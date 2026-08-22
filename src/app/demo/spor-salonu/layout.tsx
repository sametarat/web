import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Forge Athletic Club — Spor Salonu Demosu',
  description: `${SITE.name} tarafından geliştirilen spor salonu web sitesi demosu: aylık/yıllık üyelik fiyat tablosu, güne göre filtrelenen haftalık ders programı ve deneme dersi başvuru formu.`,
  alternates: { canonical: '/demo/spor-salonu' },
  // Vitrin demosu: dizine kapalı, yalnızca /web-servis üzerinden reklam trafiğine açık.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Forge Athletic Club — Spor Salonu Demosu',
    description:
      'Üyelik paketleri, haftalık ders programı ve deneme dersi formuyla örnek spor salonu sitesi.',
    url: '/demo/spor-salonu',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
