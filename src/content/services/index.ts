import type { ServiceContent, ServiceIcon } from './types';
import webTasarim from './web-tasarim';
import seo from './seo';
import reklamYonetimi from './reklam-yonetimi';
import kvkkDanismanlik from './kvkk-danismanlik';
import markaPatentTescili from './marka-patent-tescili';

/** Yazılmış tüm hizmet içerikleri — pasif olanlar dâhil. */
const ALL_SERVICES: ServiceContent[] = [
  webTasarim, seo, reklamYonetimi, kvkkDanismanlik, markaPatentTescili,
];

/**
 * SATIŞTA OLMAYAN HİZMETLER — tek anahtar.
 *
 * Buradaki slug'lar menüden, altbilgiden, ana sayfa ızgarasından, ilgili
 * hizmetler blokundan ve site haritasından çıkar; sayfaları ayakta kalır ama
 * arama motorlarına `noindex` verilir (bkz. ilgili page.tsx dosyaları).
 *
 * NEDEN SİLMİYORUZ: adresi bilen ya da eski bir bağlantıdan gelen ziyaretçi
 * 404 görmüyor, mevcut arama sıralamaları ve geri bağlantılar yanmıyor.
 * Hizmeti geri açmak = slug'ı bu listeden çıkarmak + o sayfanın
 * `robots: { index: false }` satırını silmek + PUBLIC_ROUTES'a geri eklemek.
 *
 * Şu an konumlandırma bilinçli olarak daraltıldı: yalnızca güvenlik ve uyum.
 */
export const INACTIVE_SLUGS: ReadonlySet<string> = new Set([
  'web-tasarim',
  'seo',
  'reklam-yonetimi',
]);

/** Menü, ana sayfa ızgarası ve sitemap bu sırayı kullanır — yalnızca aktifler. */
export const SERVICES: ServiceContent[] = ALL_SERVICES.filter(
  (s) => !INACTIVE_SLUGS.has(s.slug),
);

/**
 * Slug → içerik. Pasif hizmetler de burada: sayfaları hâlâ render ediliyor,
 * yalnızca hiçbir yerden bağlantı verilmiyor.
 */
export const SERVICE_BY_SLUG: Record<string, ServiceContent> = Object.fromEntries(
  ALL_SERVICES.map((s) => [s.slug, s]),
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

/**
 * Hangi hizmet hangi grupta. Eskiden sıra numarasına bakılıyordu (ilk üçü
 * büyüme); bir hizmet pasife alınınca bu sessizce yanlış gruplama üretiyordu.
 * Artık slug'a bakıyor — liste değişse de doğru kalıyor.
 */
const GROUP_BY_SLUG: Record<string, ServiceGroup> = {
  'web-tasarim': 'buyume',
  seo: 'buyume',
  'reklam-yonetimi': 'buyume',
  'kvkk-danismanlik': 'guvenlik',
  'marka-patent-tescili': 'guvenlik',
};

export const ALL_SERVICE_CARDS: ServiceCard[] = [
  ...SERVICES.map((s) => ({
    href: `/${s.slug}`,
    group: GROUP_BY_SLUG[s.slug] ?? 'guvenlik',
    label: s.navLabel,
    title: s.card.title,
    desc: s.card.desc,
    icon: s.icon,
  })),
  ...SECURITY_CARDS,
];

export type { ServiceContent, ServiceIcon } from './types';

/** Verilen gruptaki hizmet kartları — ana sayfa grup grup gösteriyor. */
export function cardsByGroup(group: ServiceGroup): ServiceCard[] {
  return ALL_SERVICE_CARDS.filter((c) => c.group === group);
}

/**
 * İçinde en az bir aktif hizmet kalan gruplar. Bütün büyüme hizmetleri pasife
 * alındığında ana sayfada "Büyüme — 0 hizmet" diye boş bir başlık kalmasın.
 */
export const ACTIVE_SERVICE_GROUPS = SERVICE_GROUPS.filter(
  (g) => cardsByGroup(g.id).length > 0,
);
