/**
 * CRM oturum doğrulaması.
 *
 * CRM ekranı müşteri adı, telefon ve e-posta gösteriyor — yani kişisel veri.
 * Herkese açık bırakmak hem ticari hem KVKK açısından kabul edilemez, bu yüzden
 * tek parolalı basit bir kapı koyuyoruz.
 *
 * KURULUM: ortam değişkenlerine güçlü bir parola yaz.
 *   CRM_PASSWORD=uzun-ve-tahmin-edilemez-bir-parola
 *
 * Parola tanımlı değilse CRM tamamen kapalıdır (açık kalmasındansa çalışmaması
 * yeğdir). Tek kullanıcılı bir panel için bu yeterli; birden fazla kişi
 * kullanacaksa gerçek bir kimlik doğrulama katmanı gerekir.
 */

const COOKIE = 'kodara_crm';

export function isAuthConfigured(): boolean {
  return Boolean(process.env.CRM_PASSWORD && process.env.CRM_PASSWORD.length >= 8);
}

/** Parolanın SHA-256 özeti — çerezde ham parola taşımıyoruz. */
async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode(`kodara-crm:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Zamanlama saldırısına karşı sabit süreli karşılaştırma. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = process.env.CRM_PASSWORD;
  if (!expected) return false;
  // Uzunluk farkını da gizlemek için iki tarafı da özetleyip karşılaştırıyoruz.
  const [a, b] = await Promise.all([tokenFor(candidate), tokenFor(expected)]);
  return safeEqual(a, b);
}

export async function sessionCookie(): Promise<{ name: string; value: string }> {
  const expected = process.env.CRM_PASSWORD ?? '';
  return { name: COOKIE, value: await tokenFor(expected) };
}

/** İstekteki çerez geçerli mi? */
export async function isAuthorized(req: Request): Promise<boolean> {
  if (!isAuthConfigured()) return false;

  const header = req.headers.get('cookie') ?? '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;

  const expected = await tokenFor(process.env.CRM_PASSWORD ?? '');
  return safeEqual(decodeURIComponent(match[1]), expected);
}

export const CRM_COOKIE_NAME = COOKIE;
