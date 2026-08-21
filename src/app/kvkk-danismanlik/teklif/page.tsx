import type { Metadata } from 'next';
import { ServiceLandingBody } from '@/components/service/ServiceLandingBody';
import { SERVICE_BY_SLUG } from '@/content/services';

/**
 * Reklam trafiği için odaklı açılış sayfası — site menüsü yok, tek dönüşüm hedefi.
 * Tüm metin src/content/services/kvkk-danismanlik.ts dosyasındaki `landing` bloğundan geliyor.
 */
const service = SERVICE_BY_SLUG['kvkk-danismanlik'];

// Slug ile klasör adı ayrışırsa sayfa boş render edilmesin: derleme burada dursun.
if (!service) {
  throw new Error(
    "Hizmet içeriği bulunamadı: 'kvkk-danismanlik'. src/content/services altındaki slug ile klasör adı aynı olmalı.",
  );
}

export const metadata: Metadata = {
  title: service.landing.meta.title,
  description: service.landing.meta.description,
  alternates: { canonical: '/kvkk-danismanlik/teklif' },
  openGraph: {
    title: service.landing.meta.title,
    description: service.landing.meta.description,
    url: '/kvkk-danismanlik/teklif',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function KvkkDanismanlikTeklifPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <ServiceLandingBody service={service} />
    </div>
  );
}
