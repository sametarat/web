import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ConsentGate } from '@/components/ConsentGate';
import { SITE, CONTACT, getSiteUrl } from '@/lib/site';
import './globals.css';

// latin-ext olmadan ş/ğ/İ/ı glifleri yedek fonta düşüyor ve satır içinde
// iki farklı yazı tipi karışıyordu — Türkçe bir sitede zorunlu.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

// Başlık yüzü. Genişlik ekseni (wdth) açık: etiketler genişletilmiş,
// büyük başlıklar normal genişlikte kullanılıyor — teknik çizim başlığı hissi.
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

// Sayı ve etiket yüzü. Ölçüm değerleri (ms, ₺, %) mühendislik belgesi gibi okunsun diye.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'web tasarım',
    'web yazılım ajansı',
    'e-ticaret sitesi',
    'Next.js geliştirme',
    'teknik SEO',
    'kurumsal web sitesi',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#07080f',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${archivo.variable} ${plexMono.variable}`}
    >
      <body className="font-sans antialiased">
        {/* Google'a kim olduğumuzu makine okunur biçimde söyler (bilgi paneli, marka eşleşmesi) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: SITE.name,
              description: SITE.description,
              url: siteUrl,
              email: CONTACT.email,
              telephone: `+${CONTACT.phoneE164}`,
              areaServed: 'TR',
              address: { '@type': 'PostalAddress', addressCountry: 'TR', addressLocality: 'İstanbul' },
              serviceType: [
                'Web tasarım ve geliştirme',
                'E-ticaret sistemleri',
                'Özel yazılım geliştirme',
                'Teknik SEO',
                'Dijital reklam yönetimi',
              ],
            }),
          }}
        />
        {children}
        <SpeedInsights />
        <ConsentGate />
      </body>
    </html>
  );
}
