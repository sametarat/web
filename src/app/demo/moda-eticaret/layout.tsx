import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'MODA — Lüks E-Ticaret Demosu',
  description: `${SITE.name} tarafından geliştirilen moda e-ticaret demosu: ürün filtreleme, hızlı bakış, sepet ve terzi desteği akışı.`,
  alternates: { canonical: '/demo/moda-eticaret' },
  // Vitrin demosu: dizine kapalı, yalnızca /web-servis üzerinden reklam trafiğine açık.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'MODA — Lüks E-Ticaret Demosu',
    description: 'Ürün filtreleme, hızlı bakış ve sepet akışıyla örnek e-ticaret sitesi.',
    url: '/demo/moda-eticaret',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
