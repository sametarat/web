import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipRequestMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const MAX_REQUESTS = 30; // Dakikada maks 30 istek

export function middleware(request: NextRequest) {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  
  const ip = xForwardedFor 
    ? xForwardedFor.split(',')[0].trim() 
    : (xRealIp ?? '127.0.0.1');

  const now = Date.now();

  const record = ipRequestMap.get(ip);
  if (record) {
    if (now - record.lastReset < RATE_LIMIT_WINDOW) {
      if (record.count >= MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' }),
          { status: 429, headers: { 'content-type': 'application/json' } }
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