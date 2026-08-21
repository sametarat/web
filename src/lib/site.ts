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
 * İletişim bilgileri.
 * TODO: telefon ve adresi kendi gerçek bilgilerinle değiştir —
 * bunlar iletişim sayfasında ve demo sayfalarındaki WhatsApp linklerinde kullanılıyor.
 */
export const CONTACT = {
  email: 'sametaratoglu@gmail.com',
  /** Uluslararası format, boşluksuz — wa.me linki bunu kullanır. */
  phoneE164: '905550000000',
  /** Ekranda gösterilen okunabilir hâli. */
  phoneDisplay: '+90 555 000 00 00',
  city: 'İstanbul, Türkiye',
  workingHours: 'Hafta içi 09:00 – 18:00',
} as const;

/**
 * Güvenlik hizmetleri hattı.
 *
 * Siber güvenlik analizi ve iş ortaklığı sayfaları bu bilgileri kullanır.
 * Web ajansı tarafından ayrı bir iletişim kanalı olarak tutuluyor; ikisini
 * birleştirmek istersen buradaki değerleri CONTACT ile aynı yap.
 */
export const SECURITY_CONTACT = {
  brand: 'Dijital Güvenlik Analiz & IT Operasyon Merkezi',
  email: 'dgtlguvenlik@gmail.com',
  /** Uluslararası format, boşluksuz — wa.me ve tel: linkleri bunu kullanır. */
  phoneE164: '905318949915',
  phoneDisplay: '0531 894 99 15',
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
  '/pentest',
  '/guvenlik-analizi',
  '/iso-27001',
  '/is-ortakligi',
  '/iletisim',
  '/sss',
  '/ilkeler',
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
