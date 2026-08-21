/**
 * Lead deposu — Upstash Redis (REST API).
 *
 * NEDEN UPSTASH: CRM'in çalışması için lead'lerin bir yerde durması gerekiyor.
 * Upstash'in REST arayüzü düz `fetch` ile çalışıyor; npm paketi, bağlantı havuzu
 * ya da Node-özel API gerektirmiyor. Bu sayede hem Vercel'de hem Cloudflare
 * Workers'ta aynı kod çalışıyor — taşınma planı için önemli.
 *
 * KURULUM (ücretsiz):
 *   1. https://upstash.com → Redis → Create Database (bölge: eu-central-1 önerilir)
 *   2. Veritabanı sayfasında "REST API" bölümünden şu ikisini kopyala:
 *        UPSTASH_REDIS_REST_URL
 *        UPSTASH_REDIS_REST_TOKEN
 *   3. Ortam değişkenlerine ekle (.env.local ve Vercel/Cloudflare panelinde).
 *
 * Tanımlı değilse: lead'ler yine e-posta ve Telegram ile gider, sadece CRM
 * boş görünür ve kurulum kartı gösterir. Hiçbir şey kırılmaz.
 *
 * VERİ YAPISI
 *   lead:<id>      → JSON kaydı (hash yerine düz string; okuma tek komut)
 *   leads:index    → sorted set, score = kayıt zamanı (en yeni önce sıralamak için)
 */

import type { Lead } from '@/lib/leads';

export type LeadStatus = 'yeni' | 'arandi' | 'teklif' | 'kazanildi' | 'kaybedildi';

export const LEAD_STATUSES: { id: LeadStatus; label: string }[] = [
  { id: 'yeni', label: 'Yeni' },
  { id: 'arandi', label: 'Arandı' },
  { id: 'teklif', label: 'Teklif verildi' },
  { id: 'kazanildi', label: 'Kazanıldı' },
  { id: 'kaybedildi', label: 'Kaybedildi' },
];

export type StoredLead = {
  id: string;
  createdAt: number;
  status: LeadStatus;
  /** Satış notu — CRM'den elle yazılır. */
  note: string;
  fullName: string;
  contactInfo: string;
  projectType: string;
  notes?: string;
  website?: string;
  source: Lead['source'];
};

const URL_ENV = 'UPSTASH_REDIS_REST_URL';
const TOKEN_ENV = 'UPSTASH_REDIS_REST_TOKEN';

export function isStoreConfigured(): boolean {
  return Boolean(process.env[URL_ENV] && process.env[TOKEN_ENV]);
}

/**
 * Upstash REST'e tek komut gönderir.
 * Komutlar dizi olarak yollanıyor: ['SET', 'key', 'value']
 */
async function redis<T = unknown>(command: (string | number)[]): Promise<T | null> {
  const url = process.env[URL_ENV];
  const token = process.env[TOKEN_ENV];
  if (!url || !token) return null;

  try {
    const response = await fetch(url.replace(/\/$/, ''), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[store] Upstash hatası:', response.status, detail.slice(0, 200));
      if (response.status === 401) {
        console.error(`[store] ÇÖZÜM: ${TOKEN_ENV} geçersiz. Upstash panelinden yeniden kopyala.`);
      }
      return null;
    }

    const data = (await response.json()) as { result?: T; error?: string };
    if (data.error) {
      console.error('[store] Upstash komut hatası:', data.error);
      return null;
    }
    return (data.result ?? null) as T | null;
  } catch (error) {
    console.error('[store] Upstash erişilemedi:', error);
    return null;
  }
}

/**
 * `redis()` hata durumunda da null döndürüyor; bu bazı komutlar için yeterli
 * değil. Örneğin `SET ... NX` anahtar zaten varsa null döner — bunu bir
 * ağ hatasından ayırt edemezsek "yeni lead"i "mükerrer" sanıp atarız.
 * Bu sarmalayıcı ikisini ayırıyor.
 */
async function redisEnvelope<T = unknown>(
  command: (string | number)[],
): Promise<{ ok: true; result: T | null } | { ok: false }> {
  const url = process.env[URL_ENV];
  const token = process.env[TOKEN_ENV];
  if (!url || !token) return { ok: false };

  try {
    const response = await fetch(url.replace(/\/$/, ''), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error('[store] Upstash hatası:', response.status);
      return { ok: false };
    }
    const data = (await response.json()) as { result?: T; error?: string };
    if (data.error) {
      console.error('[store] Upstash komut hatası:', data.error);
      return { ok: false };
    }
    return { ok: true, result: (data.result ?? null) as T | null };
  } catch (error) {
    console.error('[store] Upstash erişilemedi:', error);
    return { ok: false };
  }
}

/** Zamana göre artan, çakışmayan ve tahmin edilmesi zor bir kimlik. */
function newId(): string {
  const time = Date.now().toString(36);
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  return `${time}${rand}`;
}

/**
 * Lead'i depoya yazar. Bildirim gönderimini bloklamamalı — çağıran taraf
 * sonucu bekleyip akışı durdurmuyor, hata yalnızca loglanıyor.
 */
export async function storeLead(lead: Lead): Promise<string | null> {
  if (!isStoreConfigured()) return null;

  const now = Date.now();
  const record: StoredLead = {
    id: newId(),
    createdAt: now,
    status: 'yeni',
    note: '',
    fullName: lead.fullName,
    contactInfo: lead.contactInfo,
    projectType: lead.projectType,
    notes: lead.notes,
    website: lead.website,
    source: lead.source,
  };

  const ok = await redis(['SET', `lead:${record.id}`, JSON.stringify(record)]);
  if (ok === null) return null;
  await redis(['ZADD', 'leads:index', now, record.id]);
  return record.id;
}

/** En yeniden eskiye doğru lead listesi. */
export async function listLeads(limit = 300): Promise<StoredLead[]> {
  if (!isStoreConfigured()) return [];

  const ids = await redis<string[]>(['ZRANGE', 'leads:index', 0, limit - 1, 'REV']);
  if (!ids?.length) return [];

  const raw = await redis<(string | null)[]>(['MGET', ...ids.map((id) => `lead:${id}`)]);
  if (!raw) return [];

  const out: StoredLead[] = [];
  for (const item of raw) {
    if (!item) continue;
    try {
      out.push(JSON.parse(item) as StoredLead);
    } catch {
      // Bozuk kayıt listeyi düşürmesin.
    }
  }
  return out;
}

/** Durum ve/veya satış notunu günceller. */
export async function updateLead(
  id: string,
  patch: { status?: LeadStatus; note?: string },
): Promise<StoredLead | null> {
  if (!isStoreConfigured()) return null;

  const raw = await redis<string | null>(['GET', `lead:${id}`]);
  if (!raw) return null;

  let record: StoredLead;
  try {
    record = JSON.parse(raw) as StoredLead;
  } catch {
    return null;
  }

  if (patch.status) record.status = patch.status;
  if (typeof patch.note === 'string') record.note = patch.note.slice(0, 2000);

  const ok = await redis(['SET', `lead:${id}`, JSON.stringify(record)]);
  return ok === null ? null : record;
}

/** Kaydı tamamen siler (KVKK: ilgili kişi silme talebi geldiğinde gerekir). */
export async function deleteLead(id: string): Promise<boolean> {
  if (!isStoreConfigured()) return false;
  const ok = await redis(['DEL', `lead:${id}`]);
  await redis(['ZREM', 'leads:index', id]);
  return ok !== null;
}

/* ============================================================
   PAYLAŞIMLI SAYAÇLAR
   ============================================================
   Hız sınırı ve mükerrer lead kontrolü daha önce süreç belleğindeydi. Serverless
   ortamda her örnek kendi sayacını tuttuğu için bu koruma kaba bir frenden
   ibaretti; Cloudflare Workers'ta isolate'lar daha da kısa ömürlü olduğu için
   iyice zayıflayacaktı. Depo zaten kurulu olduğuna göre sayaçları oraya taşıyoruz.

   Depo yapılandırılmamışsa ya da erişilemezse çağıran taraf kendi bellek içi
   yedeğine düşüyor — koruma zayıflar ama servis durmaz.
*/

/**
 * Sayaç artırır ve limit aşıldıysa true döner.
 * Depo yoksa/erişilemiyorsa `null` döner; çağıran yedeğe düşmeli.
 */
export async function rateLimitExceeded(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean | null> {
  if (!isStoreConfigured()) return null;

  // Pencere numarası anahtarın İÇİNDE. Böylece her pencerede yeni bir anahtar
  // kullanılıyor ve EXPIRE herhangi bir sebeple başarısız olsa bile sayaç
  // kalıcı olarak takılı kalmıyor — eski anahtar bir daha hiç okunmuyor.
  // (Önceki sürümde tek bir `rl:<ip>` anahtarı vardı; EXPIRE bir kez
  // kaçtığında o IP kalıcı olarak engelleniyordu.)
  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  const redisKey = `rl:${key}:${window}`;

  const count = await redis<number>(['INCR', redisKey]);
  if (count === null) return null;

  if (count === 1) await redis(['EXPIRE', redisKey, windowSeconds * 2]);

  return count > limit;
}

/**
 * Bu iletişim bilgisi bu pencerede DAHA ÖNCE görüldü mü?
 *
 *   true  → daha önce görüldü (mükerrer)
 *   false → ilk kez görüldü (yeni lead)
 *   null  → depo yok ya da erişilemedi; çağıran yedeğine düşmeli
 *
 * Atomik: `SET key 1 NX EX` — iki eşzamanlı istek aynı anda "yeni" diyemez.
 * NX başarısız olduğunda Upstash `null` döndürüyor; bunu bir ağ hatasından
 * ayırt edebilmek için `redisEnvelope` kullanıyoruz. Ayırt edemezsek her
 * lead'i mükerrer sanıp atarız — bu hata bir kez yaşandı, tekrar etmesin.
 */
export async function seenBefore(
  contact: string,
  windowSeconds: number,
): Promise<boolean | null> {
  if (!isStoreConfigured()) return null;

  const key = `seen:${contact.toLowerCase().replace(/[\s()-]/g, '')}`;
  const res = await redisEnvelope<string>(['SET', key, '1', 'NX', 'EX', windowSeconds]);
  if (!res.ok) return null;

  // result === 'OK' → yazıldı, yani ilk kez görülüyor.
  // result === null → NX başarısız, yani zaten vardı.
  return res.result === null;
}
