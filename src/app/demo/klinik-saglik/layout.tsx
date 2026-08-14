import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Vitalis Klinik — Diş & Estetik Klinik Demosu',
  description: `${SITE.name} tarafından geliştirilen klinik web sitesi demosu: kategori filtreli tedavi kataloğu, hekim kadrosu ve online randevu akışı.`,
  alternates: { canonical: '/demo/klinik-saglik' },
  openGraph: {
    title: 'Vitalis Klinik — Diş & Estetik Klinik Demosu',
    description: 'Tedavi kataloğu, hekim kadrosu ve online randevu akışıyla örnek klinik sitesi.',
    url: '/demo/klinik-saglik',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
