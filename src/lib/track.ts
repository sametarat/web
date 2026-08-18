/**
 * Dönüşüm takibi — Meta Pixel ve Google Ads.
 *
 * Ortam değişkeni tanımlı değilse hiçbir script yüklenmez ve bu fonksiyonlar
 * sessizce hiçbir şey yapmaz. Yani ID girmeden de site normal çalışır;
 * ID girdiğin an takip otomatik devreye girer.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

export const isTrackingEnabled = Boolean(META_PIXEL_ID || GOOGLE_ADS_ID);

/**
 * Bir lead formu başarıyla gönderildiğinde çağrılır.
 * @param source Hangi form — reklam raporlarında ayırt etmek için.
 */
export function trackLead(source: 'landing' | 'contact' | 'home'): void {
  if (typeof window === 'undefined') return;

  // Meta: standart "Lead" olayı — reklam setinde dönüşüm hedefi olarak seçilebilir
  window.fbq?.('track', 'Lead', { content_category: source });

  // Google Ads: dönüşüm etiketi (AW-XXXX/label biçiminde)
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
    });
  }
  // Etiket yoksa en azından GA4 tarafında olay olarak görünsün
  else if (GOOGLE_ADS_ID) {
    window.gtag?.('event', 'generate_lead', { source });
  }
}
