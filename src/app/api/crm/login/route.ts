import { z } from 'zod';
import {
  isAuthConfigured,
  authConfigProblem,
  passwordMatches,
  issueSession,
  sessionCookieHeader,
  clearCookieHeader,
} from '@/lib/crmAuth';
import { loginAttemptStatus, recordFailedLogin, clearFailedLogins } from '@/lib/leadStore';

/**
 * CRM girişi.
 *
 * Katmanlar:
 *   1. Yapılandırma kontrolü — parola yoksa ya da kısaysa giriş tamamen kapalı
 *   2. IP başına kaba kuvvet kilidi (paylaşımlı sayaç)
 *   3. Sabit süreli parola karşılaştırması
 *   4. Başarısız denemede yapay gecikme
 *   5. Her denemenin loglanması
 */

/** Bu kadar başarısız denemeden sonra IP kilitlenir. */
const MAX_ATTEMPTS = 5;
/** Kilit süresi (saniye). Her başarısız denemede yeniden başlar. */
const LOCK_SECONDS = 15 * 60;

const schema = z.object({ password: z.string().min(1).max(200) });

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'bilinmeyen';
}

export async function POST(req: Request) {
  const problem = authConfigProblem();
  if (problem || !isAuthConfigured()) {
    return Response.json({ error: problem ?? 'CRM yapılandırılmamış.' }, { status: 503 });
  }

  const ip = clientIp(req);

  // --- Kilit kontrolü ---
  const status = await loginAttemptStatus(ip, MAX_ATTEMPTS);
  if (status?.locked) {
    console.warn(`[crm] Kilitli IP giriş denedi: ${ip}`);
    return Response.json(
      {
        error: `Çok fazla hatalı deneme. Güvenlik için bu adres ${LOCK_SECONDS / 60} dakika kilitlendi.`,
      },
      { status: 429, headers: { 'Retry-After': String(LOCK_SECONDS) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Parola gerekli.' }, { status: 400 });
  }

  if (!(await passwordMatches(parsed.data.password))) {
    const nowLocked = await recordFailedLogin(ip, MAX_ATTEMPTS, LOCK_SECONDS);
    console.warn(`[crm] Hatalı parola denemesi: ${ip}${nowLocked ? ' — kilitlendi' : ''}`);

    // Depo yoksa sayaç da yok; en azından denemeyi yavaşlatalım.
    await new Promise((r) => setTimeout(r, 700));

    const remaining = status ? Math.max(0, status.remaining - 1) : null;
    return Response.json(
      {
        error:
          nowLocked
            ? `Çok fazla hatalı deneme. Bu adres ${LOCK_SECONDS / 60} dakika kilitlendi.`
            : remaining !== null
              ? `Parola hatalı. Kalan deneme hakkı: ${remaining}.`
              : 'Parola hatalı.',
      },
      { status: nowLocked ? 429 : 401 },
    );
  }

  await clearFailedLogins(ip);
  console.log(`[crm] Başarılı giriş: ${ip}`);

  const session = await issueSession();
  return Response.json(
    { ok: true },
    { headers: { 'Set-Cookie': sessionCookieHeader(session.value, session.maxAge) } },
  );
}

/** Çıkış. */
export async function DELETE() {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearCookieHeader() } });
}
