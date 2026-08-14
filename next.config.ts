import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ağır ikon/animasyon paketlerinin sadece kullanılan kısımlarını bundle'a alır.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Demo sayfalarındaki görseller Unsplash'ten geliyor; next/image bunları
  // AVIF/WebP'ye çevirip responsive srcset üretebilsin diye izin veriyoruz.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },

  // Production'da console.log'ları temizler; error ve warn hata ayıklama için kalır.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Güvenlik başlıkları tüm sayfalar için. (middleware.ts sadece /api/* kapsıyor.)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
