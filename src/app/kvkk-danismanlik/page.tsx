import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ServicePageBody } from '@/components/service/ServicePageBody';
import { SERVICE_BY_SLUG } from '@/content/services';

/**
 * Kurumsal hizmet sayfası — organik trafik için, site menüsüyle birlikte.
 * Tüm metin src/content/services/kvkk-danismanlik.ts dosyasından geliyor.
 */
const service = SERVICE_BY_SLUG['kvkk-danismanlik'];

// Slug ile klasör adı ayrışırsa sayfa boş render edilmesin: derleme burada dursun.
if (!service) {
  throw new Error(
    "Hizmet içeriği bulunamadı: 'kvkk-danismanlik'. src/content/services altındaki slug ile klasör adı aynı olmalı.",
  );
}

export const metadata: Metadata = {
  title: service.meta.title,
  description: service.meta.description,
  alternates: { canonical: '/kvkk-danismanlik' },
  openGraph: {
    title: service.meta.title,
    description: service.meta.description,
    url: '/kvkk-danismanlik',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const NAV = [
  { href: '/#hizmetler', label: 'Hizmetler' },
  { href: '/#demolar', label: 'Demolar' },
  { href: '/ilkeler', label: 'İlkelerimiz' },
  { href: '/sss', label: 'SSS' },
];

export default function KvkkDanismanlikPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <SiteHeader links={NAV} ctaHref={`/${service.slug}/teklif/`} showBanner={false} />
      <div className="flex-1">
        <ServicePageBody service={service} />
      </div>
      <SiteFooter />
    </div>
  );
}
