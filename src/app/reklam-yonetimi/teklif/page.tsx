import type { Metadata } from 'next';
import { ServiceLandingBody } from '@/components/service/ServiceLandingBody';
import { SERVICE_BY_SLUG } from '@/content/services';

/**
 * Reklam trafiği için odaklı açılış sayfası — site menüsü yok, tek dönüşüm hedefi.
 * Tüm metin src/content/services/reklam-yonetimi.ts dosyasındaki `landing` bloğundan geliyor.
 */
const service = SERVICE_BY_SLUG['reklam-yonetimi'];

// Slug ile klasör adı ayrışırsa sayfa boş render edilmesin: derleme burada dursun.
if (!service) {
  throw new Error(
    "Hizmet içeriği bulunamadı: 'reklam-yonetimi'. src/content/services altındaki slug ile klasör adı aynı olmalı.",
  );
}

export const metadata: Metadata = {
  title: service.landing.meta.title,
  description: service.landing.meta.description,
  alternates: { canonical: '/reklam-yonetimi/teklif' },
  openGraph: {
    title: service.landing.meta.title,
    description: service.landing.meta.description,
    url: '/reklam-yonetimi/teklif',
    type: 'website',
  },
  // Hizmet pasife alındı: sayfa ayakta kalıyor ama arama motorlarına kapalı.
  robots: { index: false, follow: true },
};

export default function ReklamYonetimiTeklifPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <ServiceLandingBody service={service} />
    </div>
  );
}
