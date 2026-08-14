import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE, CONTACT, getSiteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
    <html lang="tr" dir="ltr" data-scroll-behavior="smooth" className={inter.variable}>
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
      </body>
    </html>
  );
}
