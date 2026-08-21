import { z } from 'zod';
import { sendLeadEmail } from '@/lib/leads';

/** İletişim formundan gelen lead'leri karşılar. */

const SERVICE_LABELS: Record<string, string> = {
  'e-commerce': 'E-Ticaret',
  restaurant: 'Restoran / Kafe',
  hotel: 'Otel / Konaklama',
  custom: 'Özel / Kurumsal Yazılım',
  seo: 'SEO & Dijital Pazarlama',
  other: 'Diğer / Belirsiz',
};

const formSchema = z.object({
  name: z.string().trim().min(2, 'Ad soyad çok kısa').max(120),
  email: z.string().trim().email('Geçerli bir e-posta adresi girin').max(200),
  website: z.string().trim().max(300).optional().or(z.literal('')),
  service: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  /** Hangi form gönderdi — e-postada kaynağı ayırt etmek için. */
  source: z.enum(['form', 'landing', 'pentest', 'guvenlik-analizi', 'iso-27001', 'is-ortakligi']).optional(),
  /** Bot tuzağı: gerçek kullanıcılar bu gizli alanı doldurmaz. */
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const parsed = formSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Form bilgileri eksik.' },
      { status: 400 },
    );
  }

  const { name, email, phone, website, service, message, company, source } = parsed.data;

  // Honeypot doluysa bot: başarılıymış gibi dön, hiçbir şey gönderme.
  if (company) {
    return Response.json({ ok: true });
  }

  const result = await sendLeadEmail({
    fullName: name,
    contactInfo: phone ? `${email} · ${phone}` : email,
    projectType: service ? (SERVICE_LABELS[service] ?? service) : 'Ücretsiz analiz talebi',
    notes: message || undefined,
    website: website || undefined,
    source: source ?? 'form',
  });

  // E-posta gönderilemese bile lead sunucu loguna düştü; kullanıcıyı hata ekranıyla kaybetme.
  if (!result.delivered && result.reason !== 'not_configured') {
    console.error('[lead] Form lead e-postası gönderilemedi:', result.reason);
  }

  return Response.json({ ok: true });
}
