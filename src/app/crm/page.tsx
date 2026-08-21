import type { Metadata } from 'next';
import KodaraCRM from '@/components/KodaraCRM';

/**
 * İç kullanım aracı: site başlığı/altbilgisi ve chatbot bilinçli olarak yok.
 * Arama motorlarına kapalı.
 */
export const metadata: Metadata = {
  title: 'CRM — Kodara',
  robots: { index: false, follow: false },
};

export default function CrmPage() {
  return (
    <main className="min-h-screen bg-surface">
      <KodaraCRM />
    </main>
  );
}
