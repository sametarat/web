/**
 * Hizmet sayfası içerik şeması.
 *
 * Her hizmet TEK bir veri dosyasıyla tanımlanır ve bu dosya iki sayfayı birden
 * besler:
 *   /<slug>/          → kurumsal hizmet sayfası (menülü, organik trafik için)
 *   /<slug>/teklif/   → odaklı reklam sayfası (menüsüz, tek CTA)
 *
 * Metin değiştirmek için sadece ilgili içerik dosyasını düzenle; sayfa
 * bileşenlerine dokunman gerekmiyor.
 */

export type ServiceIcon =
  | 'layout'
  | 'search'
  | 'target'
  | 'shield'
  | 'scale'
  | 'badge'
  | 'tag';

export type FaqItem = { q: string; a: string };
export type TitledItem = { title: string; desc: string };

export type ServiceContent = {
  /** URL parçası. Klasör adıyla birebir aynı olmalı. */
  slug: string;
  /** Menüde ve kartlarda görünen kısa ad. */
  navLabel: string;
  /** Ana sayfadaki "hangi konuda destek arıyorsunuz" seçeneği. */
  picker: string;
  icon: ServiceIcon;

  /** Ana sayfa ve ilgili hizmetler ızgarasındaki kart. */
  card: { title: string; desc: string };

  meta: { title: string; description: string };

  hero: {
    eyebrow: string;
    h1: string;
    lead: string;
    bullets: string[];
  };

  summaryTitle: string;
  summaryText: string;
  /** Müşterinin eline geçen somut çıktılar. */
  deliverables: string[];

  intro: { heading: string; paragraphs: string[] };

  offerHeading: string;
  offer: TitledItem[];

  processHeading: string;
  process: TitledItem[];

  audienceHeading: string;
  audience: TitledItem[];

  faq: FaqItem[];

  ctaHeading: string;
  ctaText: string;

  /** Reklam trafiği için odaklı açılış sayfası. */
  landing: {
    meta: { title: string; description: string };
    h1: string;
    promise: string;
    benefits: TitledItem[];
    trustHeading: string;
    trust: TitledItem[];
    faq: FaqItem[];
    ctaHeading: string;
    ctaText: string;
    submitLabel: string;
    closeHeading: string;
    closeText: string;
  };
};
