import { SITE } from '@/lib/site';

/**
 * Lead bildirimlerini e-posta ile gönderir.
 *
 * Resend'in REST API'sini doğrudan fetch ile çağırır — ek npm paketi gerekmez.
 * Gerekli ortam değişkenleri (.env.local ve Vercel > Settings > Environment Variables):
 *   RESEND_API_KEY   Resend panelinden alınan API anahtarı (re_... ile başlar)
 *   LEAD_TO_EMAIL    Bildirimlerin düşeceği adres (örn. sametaratoglu@gmail.com)
 *   LEAD_FROM_EMAIL  Doğrulanmış gönderen (örn. "Kodara <lead@kodara.com>")
 *                    Domain doğrulaman yoksa "onboarding@resend.dev" ile test edebilirsin.
 *
 * Anahtar tanımlı değilse gönderim sessizce atlanır ve lead sunucu loguna yazılır —
 * böylece yapılandırma eksikken bile form/chatbot çalışmaya devam eder.
 */

export type Lead = {
  fullName: string;
  contactInfo: string;
  projectType: string;
  notes?: string;
  /** Lead'in geldiği yer. */
  source: 'chatbot' | 'form' | 'landing' | 'pentest' | 'guvenlik-analizi' | 'iso-27001' | 'is-ortakligi';
  /** Varsa müşterinin mevcut sitesi. */
  website?: string;
};

const SOURCE_LABELS: Record<Lead['source'], string> = {
  chatbot: 'AI Chatbot',
  form: 'İletişim formu',
  landing: 'Reklam sayfası (ücretsiz analiz)',
  pentest: 'Sızma testi sayfası',
  'guvenlik-analizi': 'Siber güvenlik analizi sayfası',
  'iso-27001': 'ISO 27001 hazırlık sayfası',
  'is-ortakligi': 'İŞ ORTAĞI BAŞVURUSU',
};

export type LeadResult = { delivered: boolean; reason?: string };

/**
 * Aynı lead'in iki kez gönderilmesini engelleyen kısa ömürlü kayıt.
 *
 * Hem model aracı hem de sunucu tarafındaki otomatik yakalama aynı kişiyi
 * bildirebilir. Süreç belleğinde tutuluyor — serverless'ta örnekler arası
 * paylaşılmaz, yani en kötü ihtimalle mükerrer bildirim gelir. Lead kaçırmaktansa
 * iki kez bildirim almak yeğdir.
 */
const recentLeads = new Map<string, number>();
const DEDUPE_WINDOW = 30 * 60 * 1000; // 30 dakika

function dedupeKey(contact: string): string {
  return contact.toLowerCase().replace(/[\s()-]/g, '');
}

/** Bu iletişim bilgisi için yakın zamanda bildirim gönderildi mi? */
export function isDuplicateLead(contact: string): boolean {
  const key = dedupeKey(contact);
  const seenAt = recentLeads.get(key);
  const now = Date.now();

  // Süresi dolmuş kayıtları temizle (harita sınırsız büyümesin)
  for (const [k, t] of recentLeads) {
    if (now - t > DEDUPE_WINDOW) recentLeads.delete(k);
  }

  if (seenAt && now - seenAt < DEDUPE_WINDOW) return true;
  recentLeads.set(key, now);
  return false;
}

/** Serbest metinden e-posta veya telefon numarası çıkarır. */
export function extractContact(text: string): string | null {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]{2,}/);
  if (email) return email[0];

  // TR telefon: 05xx..., +905xx..., 5xx... (boşluk/tire/parantez toleranslı)
  const phone = text.match(/(?:\+?90[\s-]?)?0?\(?5\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/);
  if (phone) {
    const digits = phone[0].replace(/\D/g, '');
    if (digits.length >= 10) return phone[0].trim();
  }
  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(lead: Lead): string {
  const rows: Array<[string, string]> = [
    ['Ad Soyad', lead.fullName],
    ['İletişim', lead.contactInfo],
    ['Hizmet', lead.projectType],
    ['Mevcut site', lead.website || '—'],
    ['Notlar', lead.notes || '—'],
    ['Kaynak', SOURCE_LABELS[lead.source]],
    ['Tarih', new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:8px 12px;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
           <td style="padding:8px 12px;color:#0f172a;font-size:14px;font-weight:500">${escapeHtml(value)}</td>
         </tr>`,
    )
    .join('');

  return `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#0f172a">Yeni lead geldi</h2>
    <p style="margin:0 0 16px;font-size:13px;color:#64748b">${escapeHtml(SITE.name)} web sitesi</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0;border-radius:8px">${body}</table>
  </div>`;
}

function buildText(lead: Lead): string {
  return [
    'Yeni lead geldi',
    `Ad Soyad: ${lead.fullName}`,
    `İletişim: ${lead.contactInfo}`,
    `Hizmet: ${lead.projectType}`,
    `Mevcut site: ${lead.website || '—'}`,
    `Notlar: ${lead.notes || '—'}`,
    `Kaynak: ${SOURCE_LABELS[lead.source]}`,
  ].join('\n');
}

export async function sendLeadEmail(lead: Lead): Promise<LeadResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? `${SITE.name} <onboarding@resend.dev>`;

  // Yapılandırma eksikse akışı bozma; lead'i en azından loga düşür.
  if (!apiKey || !to) {
    console.warn(
      '[lead] RESEND_API_KEY veya LEAD_TO_EMAIL tanımlı değil — e-posta gönderilmedi.',
      lead,
    );
    return { delivered: false, reason: 'not_configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Yanıtla dediğinde doğrudan müşteriye gitsin (contactInfo e-posta ise).
        ...(lead.contactInfo.includes('@') ? { reply_to: lead.contactInfo } : {}),
        subject: `Yeni lead: ${lead.fullName} — ${lead.projectType}`,
        html: buildHtml(lead),
        text: buildText(lead),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[lead] Resend hatası:', response.status, detail);

      // Ham Resend hatası tek başına ne yapılacağını anlatmıyor; en sık üç
      // arıza için loga doğrudan çözümü yaz. Lead'in kendisi zaten aşağıda
      // loglanıyor, yani bu noktada hiçbir talep kaybolmuyor.
      if (response.status === 401 || response.status === 403) {
        console.error(
          `[lead] ÇÖZÜM: RESEND_API_KEY geçersiz ya da "${from}" adresinden göndermeye yetkin yok. ` +
            'Ücretsiz planda kendi domainini doğrulamadıysan gönderen olarak "onboarding@resend.dev" ' +
            'kullanmalısın ve alıcı (LEAD_TO_EMAIL) Resend hesabının e-postası olmalı.',
        );
      } else if (response.status === 422) {
        console.error(
          '[lead] ÇÖZÜM: Gönderen ya da alıcı adresi Resend tarafından reddedildi. ' +
            'LEAD_FROM_EMAIL biçimini ("Ad <adres@domain>") ve domain doğrulamasını kontrol et.',
        );
      } else if (response.status === 429) {
        console.error(
          '[lead] ÇÖZÜM: Resend kota sınırı aşıldı (ücretsiz plan: günde 100, ayda 3.000 e-posta).',
        );
      }

      // E-posta gitmediyse lead'i tam içeriğiyle loga düşür — Vercel > Logs
      // üzerinden elle kurtarılabilsin.
      console.error('[lead] Gönderilemeyen lead:', JSON.stringify(lead));
      return { delivered: false, reason: `resend_${response.status}` };
    }

    return { delivered: true };
  } catch (error) {
    console.error('[lead] E-posta gönderilemedi:', error);
    console.error('[lead] Gönderilemeyen lead:', JSON.stringify(lead));
    return { delivered: false, reason: 'network_error' };
  }
}
