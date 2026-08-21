import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitExceeded } from '@/lib/leadStore';

/**
 * Next.js 16'da "middleware" dosya kuralı "proxy" olarak yeniden adlandırıldı.
 *
 * API uçlarına kaba kuvvet ve kötüye kullanım koruması. Sayaç önce paylaşımlı
 * depoda (Upstash) tutuluyor; depo yapılandırılmamışsa ya da o an erişilemiyorsa
 * süreç belleğindeki yedeğe düşülüyor.
 *
 * TASARIM KARARI — hata durumunda AÇIK kal: depo cevap vermezse isteği
 * engellemek yerine geçiriyoruz. Bir saldırganı kaçırmak, tüm gerçek
 * ziyaretçileri kapıda bırakmaktan iyidir.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_WINDOW_S = 60;
const MAX_REQUESTS = 30;

/** Depo yokken kullanılan yedek sayaç. Örnek başına, yani yaklaşık. */
const ipRequestMap = new Map<string, { count: number; lastReset: number }>();

function exceededInMemory(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (record && now - record.lastReset < RATE_LIMIT_WINDOW_MS) {
    record.count++;
    return record.count > MAX_REQUESTS;
  }

  ipRequestMap.set(ip, { count: 1, lastReset: now });

  // Harita sınırsız büyümesin: süresi dolmuş kayıtları ara ara temizle.
  if (ipRequestMap.size > 5000) {
    for (const [k, v] of ipRequestMap) {
      if (now - v.lastReset > RATE_LIMIT_WINDOW_MS) ipRequestMap.delete(k);
    }
  }
  return false;
}

function clientIp(request: NextRequest): string {
  // Next.js 16'da request.ip kaldırıldı; IP'yi header'dan okuyoruz.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '127.0.0.1';
}

export async function proxy(request: NextRequest) {
  const ip = clientIp(request);

  let exceeded: boolean;
  const shared = await rateLimitExceeded(ip, MAX_REQUESTS, RATE_LIMIT_WINDOW_S);
  if (shared === null) {
    exceeded = exceededInMemory(ip);
  } else {
    exceeded = shared;
  }

  if (exceeded) {
    return NextResponse.json(
      { error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' },
      {
        status: 429,
        headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_S) },
      },
    );
  }

  // Genel güvenlik başlıkları next.config.ts > headers() içinde tanımlı.
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
