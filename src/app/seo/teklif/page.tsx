import type { Metadata } from 'next';
import { ServiceLandingBody } from '@/components/service/ServiceLandingBody';
import { SERVICE_BY_SLUG } from '@/content/services';

/**
 * Reklam trafiği için odaklı açılış sayfası — site menüsü yok, tek dönüşüm hedefi.
 * Tüm metin src/content/services/seo.ts dosyasındaki `landing` bloğundan geliyor.
 */
const service = SERVICE_BY_SLUG['seo'];

// Slug ile klasör adı ayrışırsa sayfa boş render edilmesin: derleme burada dursun.
if (!service) {
  throw new Error(
    "Hizmet içeriği bulunamadı: 'seo'. src/content/services altındaki slug ile klasör adı aynı olmalı.",
  );
}

export const metadata: Metadata = {
  title: service.landing.meta.title,
  description: service.landing.meta.description,
  alternates: { canonical: '/seo/teklif' },
  openGraph: {
    title: service.landing.meta.title,
    description: service.landing.meta.description,
    url: '/seo/teklif',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SeoTeklifPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <ServiceLandingBody service={service} />
    </div>
  );
}
