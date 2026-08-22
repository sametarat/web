/**
 * Marka ve site geneli sabitler.
 * Tek kaynak: isim, URL veya iletişim bilgisi değişince sadece burayı güncelle.
 */

export const SITE = {
  /** Marka adı — başlıklarda ve metinlerde kullanılır. */
  name: 'Kodara',
  /** Wordmark'ın küçük harfli hâli (logo bileşeni bunu kullanır). */
  wordmark: 'kodara',
  /**
   * Sekmede ve arama sonucunda görünen alt başlık. Konumlandırma güvenlik ve
   * uyuma daraltıldığı için buradaki ifade de daraltıldı; web tarafının kendi
   * başlığı /web-servis sayfasında ayrıca tanımlı.
   */
  tagline: 'Sızma Testi, ISO 27001 ve KVKK Uyumu',
  description:
    'Kodara; sızma testi, altyapı güvenlik analizi, ISO 27001 belgelendirmeye hazırlık, KVKK uyum danışmanlığı ve marka-patent tescili yürütür. Kapsam ve fiyat yazılı olarak sabitlenir.',
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
  // NOT: /web-tasarim, /seo ve /reklam-yonetimi (ve /teklif sayfaları) pasife
  // alındı; sayfaları ayakta ama noindex verildi ve site haritasından çıkarıldı.
  // Hizmet yeniden açılırsa bu rotaları da buraya geri eklemek gerekiyor.
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
  '/kvkk-danismanlik/teklif',
  '/marka-patent-tescili/teklif',
  '/kvkk',
  '/gizlilik',
  '/cerez-politikasi',
  // NOT: Altı /demo/... sayfası site haritasından çıkarıldı ve noindex verildi.
  // Bunlar web tasarım vitrini; artık yalnızca gizli /web-servis hub'ı
  // üzerinden, reklam trafiğiyle ulaşılıyor. Sayfalar ayakta duruyor —
  // buraya geri eklemek ve ilgili page.tsx'lerdeki `robots` satırını silmek
  // onları yeniden dizine açar.
] as const;
