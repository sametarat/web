import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Meridyen Gayrimenkul — Emlak Portföy Demosu',
  description: `${SITE.name} tarafından geliştirilen emlak web sitesi demosu: çok kriterli portföy filtreleme, canlı arama, fiyat sıralaması ve randevu talep akışı.`,
  alternates: { canonical: '/demo/emlak-portfoy' },
  openGraph: {
    title: 'Meridyen Gayrimenkul — Emlak Portföy Demosu',
    description:
      'Konum, tip, oda ve fiyat bazlı canlı filtreleme, favori listesi ve ilan detay akışıyla örnek emlak sitesi.',
    url: '/demo/emlak-portfoy',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
