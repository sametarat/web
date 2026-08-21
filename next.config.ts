import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Derleme sırasında bellek tüketimini sınırlar. Geliştirme makinesi zorlanıyorsa
  // faydalı; güçlü bir makinede ya da CI'da kaldırmak derlemeyi hızlandırır.
  staticPageGenerationTimeout: 60,

  experimental: {
    // Ağır ikon/animasyon paketlerinin sadece kullanılan kısımlarını bundle'a alır.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    cpus: 1,
  },

  // Görsel optimizasyonu Vercel'in servisine değil, kendi yükleyicimize bağlı.
  // Böylece Cloudflare Workers'a taşındığında da aynı şekilde çalışıyor.
  // Ayrıntı: src/lib/imageLoader.ts
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },

  // Production'da console.log'ları temizler; error ve warn hata ayıklama için kalır.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Güvenlik başlıkları tüm sayfalar için.
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

/*
 * KALDIRILAN AYARLAR — neden kaldırıldıklarını bilerek buraya yazıyorum ki
 * ileride tekrar eklenmesin:
 *
 * output: 'standalone'
 *   Docker ile kendi sunucunda barındırmak içindir. Vercel'de gereksiz,
 *   Cloudflare/OpenNext ile birlikte sorun çıkarabiliyor.
 *
 * eslint: { ignoreDuringBuilds: true }
 *   Next.js 16'da bu anahtar NextConfig tipinde yok; `tsc` bu yüzden
 *   "Object literal may only specify known properties" hatası veriyordu.
 *
 * typescript: { ignoreBuildErrors: true }
 *   Tip hatalarını görmezden gelmek, bozuk kodun yayına çıkması demek.
 *   Derleme bir tip hatasında durursa bu bir engel değil, koruma.
 *   Şu an projede tip hatası yok; bu bayrağa ihtiyaç da yok.
 */
