/** @type {import('next').NextConfig} */
const nextConfig = {
  // SWC ile JS küçültme (minification)
  swcMinify: true,

  // Ağır UI ve ikon kütüphanelerinin kullanılmayan kısımlarını temizler
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'framer-motion',
      'lodash',
      'react-icons',
    ],
  },

  // Production ortamında console.log'ları silerek performansı artırır
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack Code-Splitting (JS paketlerini küçük parçalara böler)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }
    return config;
  },
};

module.exports = nextConfig;