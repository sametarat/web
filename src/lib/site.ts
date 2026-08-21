/**
 * Marka ve site geneli sabitler.
 * Tek kaynak: isim, URL veya iletişim bilgisi değişince sadece burayı güncelle.
 */

export const SITE = {
  /** Marka adı — başlıklarda ve metinlerde kullanılır. */
  name: 'Kodara',
  /** Wordmark'ın küçük harfli hâli (logo bileşeni bunu kullanır). */
  wordmark: 'kodara',
  tagline: 'Dijital Ürün & Web Mimarisi Ajansı',
  description:
    'Kodara, işletmeler için yüksek hızlı web siteleri, e-ticaret sistemleri ve özel yazılımlar geliştirir. Next.js tabanlı modern mimari, teknik SEO ve dönüşüm odaklı tasarım.',
  locale: 'tr_TR',
} as const;

/**
 * Kanonik site adresi.
 * Öncelik sırası: elle verilen NEXT_PUBLIC_SITE_URL → Vercel production domain → localhost.
 * Vercel'de NEXT_PUBLIC_SITE_URL tanımlarsan OG görselleri ve sitemap doğru domaine çıkar.
 */
const FALLBACK_SITE_URL = 'http://localhost:5555';

/** Değerin gerçekten geçerli bir mutlak URL olup olmadığını doğrular. */
function asValidUrl(candidate: string | undefined): string | null {
  if (!candidate) return null;
  const trimmed = candidate.trim().replace(/\/$/, '');
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    // Sadece http(s) kabul et — yanlışlıkla girilmiş metinler elenmiş olur.
    return url.protocol === 'http:' || url.protocol === 'https:' ? trimmed : null;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  // Ortam değişkeni bozuksa build'i düşürmek yerine uyarıp yedeğe dönüyoruz;
  // metadataBase modül seviyesinde new URL() çağırdığı için geçersiz bir değer
  // aksi hâlde tüm derlemeyi kırar.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const valid = asValidUrl(explicit);
  if (valid) return valid;
  if (explicit?.trim()) {
    console.warn(
      `[site] NEXT_PUBLIC_SITE_URL geçerli bir URL değil, yok sayıldı: ${JSON.stringify(explicit)}`,
    );
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const fromVercel = asValidUrl(vercel && `https://${vercel}`);
  if (fromVercel) return fromVercel;

  return FALLBACK_SITE_URL;
}

/**
 * İletişim bilgileri — sitedeki tek kaynak.
 * İletişim sayfası, footer, hizmet sayfaları ve tüm WhatsApp / tel: linkleri
 * buradan besleniyor.
 */
export const CONTACT = {
  email: 'iletisim@kodaradigital.com',
  /** Uluslararası format, boşluksuz — wa.me ve tel: linkleri bunu kullanır. */
  phoneE164: '905318949915',
  /** Ekranda gösterilen okunabilir hâli. */
  phoneDisplay: '0531 894 99 15',
  city: 'İstanbul, Türkiye',
  workingHours: 'Hafta içi 09:00 – 18:00',
} as const;

/**
 * Güvenlik hizmetleri hattı.
 *
 * Artık ana iletişim hattıyla aynı — tek marka, tek numara, tek gelen kutusu.
 * Güvenlik tarafını ayrı bir numara/adresle yürütmek istersen aşağıdaki
 * değerleri değiştirmen yeterli; sayfalar bu sabiti kullanmaya devam eder.
 */
export const SECURITY_CONTACT = {
  brand: 'Kodara Digital — Güvenlik ve Uyum',
  email: CONTACT.email,
  phoneE164: CONTACT.phoneE164,
  phoneDisplay: CONTACT.phoneDisplay,
} as const;

/** Güvenlik hattı için WhatsApp linki. */
export function securityWhatsAppLink(message: string): string {
  return `https://wa.me/${SECURITY_CONTACT.phoneE164}?text=${encodeURIComponent(message)}`;
}

/**
 * Yasal kimlik bilgileri — KVKK aydınlatma metni ve gizlilik politikasında
 * "veri sorumlusu" olarak gösterilmesi gereken bilgiler.
 *
 * DİKKAT: Aşağıdakiler yer tutucu. Gerçek ticari unvanını, adresini ve varsa
 * vergi/MERSİS numaranı yazmadan yasal sayfalar geçerli sayılmaz.
 */
export const LEGAL = {
  /** Ticari unvan ya da şahıs şirketi adı */
  entity: 'Kodara — [ticari unvanınızı yazın]',
  address: '[açık adresinizi yazın], İstanbul, Türkiye',
  taxInfo: '[vergi dairesi ve numarası / MERSİS no]',
  /** Metinlerin en son güncellendiği tarih */
  updatedAt: '15 Ağustos 2026',
} as const;

/** Verilen metinle WhatsApp sohbeti açan link üretir. */
export function whatsAppLink(message: string): string {
  return `https://wa.me/${CONTACT.phoneE164}?text=${encodeURIComponent(message)}`;
}

/** Sitemap ve navigasyonda kullanılan herkese açık rotalar. */
export const PUBLIC_ROUTES = [
  '/',
  // Kurumsal hizmet sayfaları — organik trafik hedefi
  '/web-tasarim',
  '/seo',
  '/reklam-yonetimi',
  '/kvkk-danismanlik',
  '/marka-patent-tescili',
  '/pentest',
  '/guvenlik-analizi',
  '/iso-27001',
  '/is-ortakligi',
  '/iletisim',
  '/sss',
  '/ilkeler',
  // Hizmetlerin reklam açılış sayfaları
  '/web-tasarim/teklif',
  '/seo/teklif',
  '/reklam-yonetimi/teklif',
  '/kvkk-danismanlik/teklif',
  '/marka-patent-tescili/teklif',
  '/kvkk',
  '/gizlilik',
  '/cerez-politikasi',
  '/demo/gurme-restoran',
  '/demo/moda-eticaret',
  '/demo/otel-rezervasyon',
  '/demo/klinik-saglik',
  '/demo/emlak-portfoy',
  '/demo/spor-salonu',
] as const;
