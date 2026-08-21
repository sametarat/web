/**
 * GEÇİCİ TEŞHİS UCU — sadece geliştirme modunda çalışır.
 *
 * Sunucu sürecinin hangi ortam değişkenlerini gördüğünü söyler.
 * DEĞER YAZMAZ: yalnızca "tanımlı mı" ve "kaç karakter" bilgisini döner.
 * Production'da 404 verir, yani yayına çıksa bile hiçbir şey sızdırmaz.
 *
 * Sorun çözüldükten sonra bu klasörü silebilirsin: src/app/api/_teshis
 */

export const dynamic = 'force-dynamic';

const WATCHED = [
  'CRM_PASSWORD',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'GROQ_API_KEY',
  'GROQ_MODEL',
  'RESEND_API_KEY',
  'LEAD_TO_EMAIL',
  'LEAD_FROM_EMAIL',
  'NEXT_PUBLIC_SITE_URL',
];

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }

  const env: Record<string, string> = {};
  for (const key of WATCHED) {
    const value = process.env[key];
    env[key] = value ? `tanımlı (${value.length} karakter)` : 'YOK';
  }

  return Response.json(
    {
      not: 'Değerler asla yazılmaz, sadece uzunluk. Sorun bitince src/app/api/_teshis klasörünü sil.',
      calismaDizini: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
      surecBaslangici: new Date(Date.now() - Math.floor(process.uptime() * 1000)).toLocaleString('tr-TR'),
      calismaSuresiSaniye: Math.floor(process.uptime()),
      env,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
