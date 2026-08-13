import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit bellek tabanlı IP rate-limit takibi (Production için Upstash Redis önerilir)
const ipRequestMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const MAX_REQUESTS = 30; // Dakikada maksimum 30 istek

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const now = Date.now();

  const record = ipRequestMap.get(ip);
  if (record) {
    if (now - record.lastReset < RATE_LIMIT_WINDOW) {
      if (record.count >= MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      record.count++;
    } else {
      record.count = 1;
      record.lastReset = now;
    }
  } else {
    ipRequestMap.set(ip, { count: 1, lastReset: now });
  }

  // Güvenlik Başlıkları (Security Headers)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
