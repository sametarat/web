/**
 * Cloudflare Turnstile — form spam koruması (sunucu tarafı doğrulama).
 *
 * NEDEN TURNSTILE: reCAPTCHA ziyaretçi verisini Google'a gönderiyor; bu hem
 * KVKK tarafında ek aydınlatma yükü hem de çerez onayı gerektiriyor. Turnstile
 * ücretsiz, sınırsız, çoğu ziyaretçiye hiç bulmaca göstermiyor ve kişisel veri
 * toplamıyor.
 *
 * KURULUM (ücretsiz):
 *   1. https://dash.cloudflare.com → Turnstile → Add site
 *      - Domain: kodaradigital.com (ve localhost'u da ekle, yerelde test için)
 *      - Widget mode: Managed (önerilen)
 *   2. İki anahtar verilir:
 *        NEXT_PUBLIC_TURNSTILE_SITE_KEY   (istemci — herkese açık, gizli değil)
 *        TURNSTILE_SECRET_KEY             (sunucu — GİZLİ, asla istemciye gitmez)
 *   3. İkisini de ortam değişkenlerine ekle ve yeniden dağıt.
 *      NEXT_PUBLIC_* derleme anında gömülür; Vercel'de girdikten sonra redeploy şart.
 *
 * ANAHTARLAR TANIMSIZSA: doğrulama tamamen atlanır ve formlar eskisi gibi
 * çalışır (honeypot devrede kalır). Yani kurulum yapılmadan da site çalışıyor,
 * sadece korumasız oluyor.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}

export type TurnstileResult = { ok: true } | { ok: false; reason: string };

/**
 * İstemciden gelen jetonu Cloudflare'e doğrulatır.
 *
 * TASARIM KARARI — Cloudflare'e ulaşılamazsa KABUL ET: doğrulama servisi
 * çöktüğünde bütün formları kapatmak, bir miktar spam almaktan daha pahalı.
 * Gerçek lead kaybetmektense birkaç çöp kayıt sil.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<TurnstileResult> {
  if (!isTurnstileConfigured()) return { ok: true };

  if (!token) return { ok: false, reason: 'missing_token' };

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY as string,
      response: token,
    });
    if (ip) body.set('remoteip', ip);

    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error('[turnstile] Doğrulama servisi hata verdi:', response.status);
      return { ok: true }; // servis arızası ziyaretçiyi cezalandırmasın
    }

    const data = (await response.json()) as {
      success?: boolean;
      'error-codes'?: string[];
    };

    if (data.success) return { ok: true };

    const codes = data['error-codes'] ?? [];
    console.warn('[turnstile] Doğrulama başarısız:', codes.join(', ') || 'sebep yok');

    if (codes.includes('invalid-input-secret')) {
      console.error(
        '[turnstile] ÇÖZÜM: TURNSTILE_SECRET_KEY geçersiz. Cloudflare > Turnstile panelinden yeniden kopyala.',
      );
    }
    return { ok: false, reason: codes[0] ?? 'failed' };
  } catch (error) {
    console.error('[turnstile] Doğrulamaya ulaşılamadı:', error);
    return { ok: true }; // ağ hatası ziyaretçiyi cezalandırmasın
  }
}
