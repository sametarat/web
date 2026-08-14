import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aetheria Hotel — Otel Rezervasyon Demosu',
  description: `${SITE.name} tarafından geliştirilen otel web sitesi demosu: tarih bazlı müsaitlik taraması, oda portföyü ve direkt rezervasyon akışı.`,
  alternates: { canonical: '/demo/otel-rezervasyon' },
  openGraph: {
    title: 'Aetheria Hotel — Otel Rezervasyon Demosu',
    description: 'Tarih bazlı arama, oda portföyü ve direkt rezervasyon akışıyla örnek otel sitesi.',
    url: '/demo/otel-rezervasyon',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
