import { SITE } from '@/lib/site';
import { storeLead, seenBefore } from '@/lib/leadStore';

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
  source: 'chatbot' | 'form' | 'landing' | 'pentest' | 'guvenlik-analizi' | 'iso-27001' | 'is-ortakligi' | 'hizmet' | 'hizmet-teklif';
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
  hizmet: 'Hizmet sayfası',
  'hizmet-teklif': 'Reklam sayfası (hizmet teklifi)',
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

/**
 * Bu iletişim bilgisi için yakın zamanda bildirim gönderildi mi?
 *
 * Önce paylaşımlı depoya (Upstash) bakıyor — orada atomik `SET NX EX` ile
 * çalıştığı için iki eşzamanlı istek aynı anda "yeni" diyemiyor. Depo yoksa
 * ya da erişilemiyorsa süreç belleğindeki yedeğe düşüyor: serverless'ta
 * örnekler arası paylaşılmadığı için o hâlde en kötü ihtimalle mükerrer
 * bildirim gelir. Lead kaçırmaktansa iki kez bildirim almak yeğdir.
 */
export async function isDuplicateLead(contact: string): Promise<boolean> {
  // seenBefore zaten "mükerrer mi" sorusunun cevabını veriyor — ters çevirme.
  const shared = await seenBefore(contact, DEDUPE_WINDOW / 1000);
  if (shared !== null) return shared;

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

async function sendViaResend(lead: Lead): Promise<LeadResult> {
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


/* ============================================================
   TELEGRAM BİLDİRİMİ
   ============================================================

   Neden Telegram: e-posta gecikebiliyor, spam'e düşebiliyor ve domain
   doğrulaması istiyor. Telegram ücretsiz, anında telefona düşüyor ve sohbet
   geçmişi aranabilir bir lead kaydı oluyor — küçük bir ekip için ayrı bir CRM
   kurmadan işi görüyor.

   KURULUM (5 dakika):
   1. Telegram'da @BotFather ile konuş → /newbot → bota bir ad ver.
      Sana "123456:ABC-DEF..." biçiminde bir token verir.
   2. Kendi botunla bir sohbet başlat ve ona herhangi bir mesaj yaz
      (bot sana ilk mesajı atamaz, önce sen yazmalısın).
   3. Tarayıcıda şu adresi aç:
      https://api.telegram.org/bot<TOKEN>/getUpdates
      Dönen JSON içindeki "chat":{"id": ...} değerini kopyala.
   4. Ortam değişkenlerine ekle (.env.local ve Vercel/Cloudflare):
      TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
      TELEGRAM_CHAT_ID=987654321

   Grup kullanmak istersen botu gruba ekle; grup chat_id'si negatif olur
   (ör. -1001234567890), onu yazman yeterli.
*/

/** Telegram'ın MarkdownV2'si çok kırılgan; düz metin + HTML kullanıyoruz. */
function escapeTelegramHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildTelegramMessage(lead: Lead): string {
  const e = escapeTelegramHtml;
  const lines = [
    `<b>🔔 Yeni lead — ${e(SOURCE_LABELS[lead.source])}</b>`,
    '',
    `<b>Ad Soyad:</b> ${e(lead.fullName)}`,
    `<b>İletişim:</b> ${e(lead.contactInfo)}`,
    `<b>Hizmet:</b> ${e(lead.projectType)}`,
  ];
  if (lead.website) lines.push(`<b>Mevcut site:</b> ${e(lead.website)}`);
  if (lead.notes) lines.push(`<b>Not:</b> ${e(lead.notes)}`);
  lines.push('', `<i>${e(new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }))}</i>`);
  return lines.join('\n');
}

async function sendViaTelegram(lead: Lead): Promise<LeadResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { delivered: false, reason: 'not_configured' };

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(lead),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[lead] Telegram hatası:', response.status, detail);
      if (response.status === 401) {
        console.error('[lead] ÇÖZÜM: TELEGRAM_BOT_TOKEN geçersiz. @BotFather üzerinden kontrol et.');
      } else if (response.status === 400) {
        console.error(
          '[lead] ÇÖZÜM: TELEGRAM_CHAT_ID yanlış ya da bota henüz hiç mesaj yazmadın. ' +
            'Botunla sohbet başlatıp bir mesaj gönder, sonra getUpdates ile chat id\'yi al.',
        );
      }
      return { delivered: false, reason: `telegram_${response.status}` };
    }
    return { delivered: true };
  } catch (error) {
    console.error('[lead] Telegram bildirimi gönderilemedi:', error);
    return { delivered: false, reason: 'network_error' };
  }
}

/**
 * Lead'i yapılandırılmış TÜM kanallara gönderir (e-posta ve/veya Telegram).
 *
 * İkisi paralel çalışır ve biri başarılıysa lead teslim edilmiş sayılır —
 * böylece Resend kotası dolduğunda ya da domain doğrulaması bozulduğunda
 * Telegram devreye girer, tersi de geçerlidir. Hiçbiri yapılandırılmamışsa
 * lead sunucu loguna tam içeriğiyle yazılır; hiçbir talep sessizce kaybolmaz.
 */
export async function sendLeadEmail(lead: Lead): Promise<LeadResult> {
  // Depolama CRM için; bildirimlerle paralel gidiyor ve başarısız olsa bile
  // lead'in müşteriye ulaşmasını engellemiyor.
  const [mail, telegram] = await Promise.all([
    sendViaResend(lead),
    sendViaTelegram(lead),
    storeLead(lead).catch(() => null),
  ]);

  if (mail.delivered || telegram.delivered) {
    const channels = [mail.delivered && 'e-posta', telegram.delivered && 'telegram']
      .filter(Boolean)
      .join(' + ');
    console.log(`[lead] Teslim edildi (${channels}): ${lead.fullName} — ${lead.contactInfo}`);
    return { delivered: true };
  }

  // İkisi de yapılandırılmamışsa bu bir arıza değil, eksik kurulum.
  const bothUnset = mail.reason === 'not_configured' && telegram.reason === 'not_configured';
  if (bothUnset) {
    console.warn(
      '[lead] Hiçbir bildirim kanalı yapılandırılmamış. RESEND_API_KEY + LEAD_TO_EMAIL ya da ' +
        'TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID tanımlayın.',
    );
  }
  console.error('[lead] Gönderilemeyen lead:', JSON.stringify(lead));
  return { delivered: false, reason: bothUnset ? 'not_configured' : `${mail.reason}|${telegram.reason}` };
}
