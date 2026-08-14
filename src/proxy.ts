import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16'da "middleware" dosya kuralı "proxy" olarak yeniden adlandırıldı.
 *
 * NOT: Aşağıdaki rate-limit sayacı süreç belleğinde tutuluyor. Vercel gibi
 * serverless ortamlarda her instance kendi sayacını tutar ve instance'lar geri
 * dönüştürülür — yani bu koruma kaba bir fren, kesin bir sınır değil. Gerçek bir
 * sınır gerekirse Upstash Redis / Vercel KV gibi paylaşımlı bir sayaç kullanılmalı.
 */

const ipRequestMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const MAX_REQUESTS = 30; // Dakikada maksimum 30 istek

export function proxy(request: NextRequest) {
  // Next.js 16'da request.ip kaldırıldı; IP'yi header'dan okuyoruz.
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const ip = xForwardedFor
    ? xForwardedFor.split(',')[0].trim()
    : (xRealIp ?? '127.0.0.1');

  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (record && now - record.lastReset < RATE_LIMIT_WINDOW) {
    if (record.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.ceil((RATE_LIMIT_WINDOW - (now - record.lastReset)) / 1000),
            ),
          },
        },
      );
    }
    record.count++;
  } else {
    ipRequestMap.set(ip, { count: 1, lastReset: now });
  }

  // Genel güvenlik başlıkları next.config.ts > headers() içinde tanımlı.
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
