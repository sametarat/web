import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: "L'Étoile Noir — Restoran Demosu",
  description: `${SITE.name} tarafından geliştirilen fine dining restoran web sitesi demosu: görsel menü, kategori filtreleme ve VIP masa rezervasyonu akışı.`,
  alternates: { canonical: '/demo/gurme-restoran' },
  openGraph: {
    title: "L'Étoile Noir — Restoran Demosu",
    description: 'Görsel menü, kategori filtreleme ve rezervasyon akışıyla örnek restoran sitesi.',
    url: '/demo/gurme-restoran',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
