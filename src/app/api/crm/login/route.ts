import { z } from 'zod';
import { isAuthConfigured, passwordMatches, sessionCookie, CRM_COOKIE_NAME } from '@/lib/crmAuth';

/** CRM girişi. Doğru parolada httpOnly çerez bırakır. */

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return Response.json(
      {
        error:
          'CRM parolası tanımlı değil. Ortam değişkenlerine en az 8 karakterlik bir CRM_PASSWORD ekleyin.',
      },
      { status: 503 },
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
    // Kaba kuvvet denemesini yavaşlat.
    await new Promise((r) => setTimeout(r, 600));
    return Response.json({ error: 'Parola hatalı.' }, { status: 401 });
  }

  const cookie = await sessionCookie();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return Response.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}${secure}`,
      },
    },
  );
}

/** Çıkış. */
export async function DELETE() {
  return Response.json(
    { ok: true },
    { headers: { 'Set-Cookie': `${CRM_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` } },
  );
}
