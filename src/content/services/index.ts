import type { ServiceContent, ServiceIcon } from './types';
import webTasarim from './web-tasarim';
import seo from './seo';
import reklamYonetimi from './reklam-yonetimi';
import kvkkDanismanlik from './kvkk-danismanlik';
import markaPatentTescili from './marka-patent-tescili';

/** Menü, ana sayfa ızgarası ve sitemap bu sırayı kullanır. */
export const SERVICES: ServiceContent[] = [
  webTasarim, seo, reklamYonetimi, kvkkDanismanlik, markaPatentTescili,
];

export const SERVICE_BY_SLUG: Record<string, ServiceContent> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s]),
);

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

/**
 * Ana sayfa ızgarasında ve menüde gösterilen TÜM hizmetler.
 *
 * Beşi yukarıdaki içerik kayıtlarından geliyor; güvenlik tarafındaki üç sayfa
 * (sızma testi, güvenlik analizi, ISO 27001) kendi elle yazılmış sayfalarına
 * sahip olduğu için burada elle tanımlanıyor. Yeni bir hizmet eklersen ya
 * SERVICES'e içerik dosyası ekle ya da aşağıya bir satır yaz — ana sayfa,
 * menü ve footer otomatik olarak günceller.
 *
 * `/is-ortakligi` bilinçli olarak burada yok: o son müşteriye değil bayiye
 * hitap ediyor, ana hizmet ızgarasında yer alması ziyaretçiyi şaşırtır.
 */
export type ServiceGroup = 'buyume' | 'guvenlik';

export const SERVICE_GROUPS: { id: ServiceGroup; label: string; desc: string }[] = [
  {
    id: 'buyume',
    label: 'Büyüme',
    desc: 'Daha çok görünmek, daha çok müşteriye ulaşmak ve gelen trafiği satışa çevirmek için.',
  },
  {
    id: 'guvenlik',
    label: 'Güvenlik & Uyum',
    desc: 'Denetimden geçmek, veriyi korumak ve marka ile sistemleri yasal zemine oturtmak için.',
  },
];

export type ServiceCard = {
  href: string;
  group: ServiceGroup;
  /** Menüdeki kısa ad. */
  label: string;
  /** Karttaki başlık. */
  title: string;
  desc: string;
  icon: ServiceIcon;
  /** Ajansın çekirdek işi — ana sayfada büyük kart olarak gösterilir. */
  featured?: boolean;
};

const SECURITY_CARDS: ServiceCard[] = [
  {
    href: '/pentest',
    group: 'guvenlik',
    label: 'Sızma Testi',
    title: 'Sızma Testi (Pentest)',
    desc: 'Web, API, iç ağ ve dış ağ üzerinde elle yürütülen sızma testi. CVSS puanlı bulgu raporu ve ücretsiz doğrulama testi.',
    icon: 'shield',
  },
  {
    href: '/guvenlik-analizi',
    group: 'guvenlik',
    label: 'Güvenlik Analizi',
    title: 'Altyapı Güvenlik Analizi',
    desc: 'Sabit bedelli ön denetim: sızma kontrolü, ağ izolasyonu ve yedekleme incelemesi. Yatırım kararından önce risk raporu.',
    icon: 'search',
  },
  {
    href: '/iso-27001',
    group: 'guvenlik',
    label: 'ISO 27001',
    title: 'ISO 27001 Hazırlık',
    desc: 'Boşluk analizi, dokümantasyon yönlendirmesi, iç denetim ve belgelendirme denetimine refakat.',
    icon: 'badge',
  },
];

export const ALL_SERVICE_CARDS: ServiceCard[] = [
  ...SERVICES.map((s, i) => ({
    href: `/${s.slug}`,
    // İlk üç hizmet büyüme tarafı, kalan ikisi (KVKK, marka-patent) uyum tarafı.
    group: (i < 3 ? 'buyume' : 'guvenlik') as ServiceGroup,
    label: s.navLabel,
    title: s.card.title,
    desc: s.card.desc,
    icon: s.icon,
    // Web tasarım ajansın çekirdek işi; ana sayfada öne çıkıyor.
    featured: i === 0,
  })),
  ...SECURITY_CARDS,
];

export type { ServiceContent, ServiceIcon } from './types';

/** Verilen gruptaki hizmet kartları — ana sayfa iki blok hâlinde gösteriyor. */
export function cardsByGroup(group: ServiceGroup): ServiceCard[] {
  return ALL_SERVICE_CARDS.filter((c) => c.group === group);
}
