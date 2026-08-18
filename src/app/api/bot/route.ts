import { createGroq } from '@ai-sdk/groq';
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from 'ai';
import { z } from 'zod';
import { SITE } from '@/lib/site';
import { sendLeadEmail, isDuplicateLead, extractContact } from '@/lib/leads';

// Streaming yanıtlar için uzun çalışma süresi (Vercel).
export const maxDuration = 30;

/**
 * Groq çok düşük gecikmeyle çalışıyor ve ücretsiz kotası bu ölçekteki bir
 * ajans sitesi için fazlasıyla yeterli. Anahtar: https://console.groq.com/keys
 * → .env.local'de (ve Vercel ortam değişkenlerinde) GROQ_API_KEY.
 *
 * DİKKAT: Groq modelleri zaman zaman emekliye ayrılıyor; `llama-3.3-70b-versatile`
 * bu şekilde kaldırıldı. Bot "ulaşılamıyor" demeye başlarsa önce
 * https://console.groq.com/docs/models listesine bak ve aşağıdaki varsayılanı
 * güncelle — ya da kod değiştirmeden GROQ_MODEL ortam değişkenini ayarla.
 *
 * Üretimdeki seçenekler: openai/gpt-oss-120b (daha iyi Türkçe, varsayılan),
 * openai/gpt-oss-20b (daha hızlı ve daha ucuz kota tüketimi).
 *
 * Sağlayıcı değiştirmek istersen sadece bu satır ve `createGroq` çağrısı değişir;
 * prompt, araç ve istemci tarafı aynı kalır (AI SDK sağlayıcıdan bağımsız çalışır).
 */
const MODEL = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b';

const saveLeadSchema = z.object({
  fullName: z.string().describe('Müşterinin adı soyadı'),
  contactInfo: z
    .string()
    .describe('Müşterinin telefon numarası veya e-posta adresi'),
  projectType: z
    .string()
    .describe('İlgilendiği hizmet (Örn: E-ticaret, Kurumsal Site, Özel Yazılım)'),
  notes: z
    .string()
    .optional()
    .describe('Müşterinin bahsettiği özel detaylar veya beklentiler'),
});

const SYSTEM_PROMPT = `
Sen ${SITE.name} adlı web mimarisi, özel yazılım ve dijital dönüşüm ajansının kıdemli satış ve teknik danışmanısın.

==================================================
KURUMSAL BİLGİ VE HİZMET KATALOĞU
==================================================
1. HİZMETLERİMİZ:
   - Kurumsal Web Tasarım & Geliştirme (Next.js, React, Tailwind CSS ile yüksek hızlı, SEO uyumlu ve mobil odaklı siteler).
   - E-Ticaret Sistemleri (Yüksek dönüşüm odaklı, ödeme entegrasyonlu, gelişmiş stok yönetimli platformlar).
   - Özel Web/Mobil Yazılım & Mimariler (SaaS projeleri, ERP/CRM çözümleri, mobil uygulamalar).
   - Dijital Strateji & SEO (Teknik SEO, sayfa hızı optimizasyonu, dönüşüm optimizasyonu).
   - Meta & Google reklam yönetimi (ROAS odaklı kurgu ve raporlama).

2. SÜREÇ VE TESLİM:
   - Keşif & analiz (2-4 gün) → tasarım & prototip (3-7 gün) → geliştirme (1-4 hafta) → yayın & devir (1-2 gün).
   - Kurumsal siteler ortalama 1-3 hafta, e-ticaret ve özel projeler 3-6 hafta.
   - Kaynak kod müşteriye devredilir, fiyat kapsam onayından sonra sabittir.

==================================================
DAVRANIŞ KURALLARI
==================================================
1. SADECE TÜRKÇE yanıt ver. Kısa tut — en fazla 3-4 cümle.
2. Yanıtların net, kendinden emin ve profesyonel olsun.
3. Yukarıdaki katalogda olmayan bir konuda kesin bilgi UYDURMA; "ekibimiz netleştirsin" deyip iletişim bilgisi iste.
4. ASLA net fiyat veya rakam verme. Fiyat sorulduğunda projeye özel teklif çıkardığını söyle.
5. Müşteri fiyat, teklif veya süreç sorduğunda harici bir forma yönlendirme yapma;
   "Size özel doğru teklifi çıkarabilmemiz için ad-soyad ve telefon/e-posta bilginizi alabilir miyim?" diye sor.
6. Müşteri ad ve iletişim bilgisini paylaştığında, sana verilen kaydetme aracını kullan.
   Aracı gerçekten çalıştır — çağrıyı yanıt metnine YAZMA, hiçbir zaman <function> gibi
   etiketler veya JSON üretme. Kullanıcı yalnızca normal Türkçe cümleler görmeli.
7. Aynı kişi için aracı bir kereden fazla kullanma.
8. İletişim bilgisi henüz gelmediyse aracı kullanma; önce bilgiyi iste.
`.trim();

/** Sağlayıcı hatalarını tek satırda, gürültüsüz logla. */
function logProviderError(error: unknown) {
  const err = error as { name?: string; message?: string; statusCode?: number };
  const message = err?.message ?? String(error);
  console.error(
    `[bot] ${err?.name ?? 'Error'}${err?.statusCode ? ` (${err.statusCode})` : ''}: ${message}`,
  );

  // En sık karşılaşılan iki arıza için loga doğrudan çözüm yaz; aksi hâlde
  // sağlayıcının ham hatası tek başına ne yapılacağını anlatmıyor.
  if (err?.statusCode === 401 || /invalid api key|unauthorized/i.test(message)) {
    console.error(
      '[bot] ÇÖZÜM: GROQ_API_KEY geçersiz. https://console.groq.com/keys adresinden yeni anahtar üretip Vercel > Settings > Environment Variables altında güncelle, sonra redeploy et.',
    );
  } else if (err?.statusCode === 404 || /decommissioned|model_not_found|does not exist/i.test(message)) {
    console.error(
      `[bot] ÇÖZÜM: "${MODEL}" modeli Groq'ta artık yok. https://console.groq.com/docs/models listesinden güncel bir model seçip GROQ_MODEL ortam değişkenine yaz (kod değişikliği gerekmez).`,
    );
  }
}

/** Bir UIMessage'ın metin içeriğini birleştirir. */
function textOf(message: UIMessage): string {
  return (message.parts ?? [])
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join(' ');
}

/**
 * Konuşmada iletişim bilgisi geçtiyse lead'i modelden bağımsız olarak kaydeder.
 * Bilinçli olarak `await` edilmiyor — yanıt akışını geciktirmemeli.
 */
async function captureLeadFromConversation(messages: UIMessage[]) {
  const userTexts = messages.filter((m) => m.role === 'user').map(textOf);
  if (userTexts.length === 0) return;

  const contact = extractContact(userTexts[userTexts.length - 1]);
  if (!contact || isDuplicateLead(contact)) return;

  const transcript = userTexts.slice(-6).join(' | ').slice(0, 1500);
  const result = await sendLeadEmail({
    fullName: 'Chatbot ziyaretçisi',
    contactInfo: contact,
    projectType: 'Chatbot üzerinden gelen talep',
    notes: `Ziyaretçinin mesajları: ${transcript}`,
    source: 'chatbot',
  });

  if (!result.delivered) {
    console.error(`[bot] Otomatik lead yakalama gönderilemedi (${result.reason}): ${contact}`);
  } else {
    console.log(`[bot] Lead otomatik yakalandı: ${contact}`);
  }
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    console.error('[bot] GROQ_API_KEY tanımlı değil.');
    return Response.json(
      {
        error:
          'Asistan şu anda devre dışı. Lütfen iletişim formundan yazın, aynı hızda dönüş yapıyoruz.',
      },
      { status: 503 },
    );
  }

  let messages: UIMessage[];
  try {
    const body = await req.json();
    if (!Array.isArray(body?.messages)) {
      return Response.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 });
    }
    // Basit kötüye kullanım koruması: aşırı uzun konuşmaları kırp.
    messages = body.messages.slice(-30) as UIMessage[];
  } catch {
    return Response.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  // --- Emniyet ağı ---------------------------------------------------------
  // Model aracı çağırmayı atlarsa ya da çağrıyı metin olarak yazarsa lead kaybolur.
  // Kullanıcının son mesajında iletişim bilgisi varsa modelden bağımsız olarak
  // bildirimi biz gönderiyoruz. Mükerrer bildirim `isDuplicateLead` ile engelleniyor.
  void captureLeadFromConversation(messages);

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const result = streamText({
    model: groq(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    // Araç çağrısından sonra modelin kullanıcıya cevap yazabilmesi için.
    stopWhen: stepCountIs(3),
    tools: {
      saveQualifiedLead: tool({
        description:
          'Potansiyel müşterinin proje detaylarını ve iletişim bilgilerini kaydeder ve satış ekibine e-posta ile bildirir.',
        // AI SDK v5+ bu alanı 'inputSchema' olarak bekliyor ('parameters' değil).
        inputSchema: saveLeadSchema,
        execute: async ({ fullName, contactInfo, projectType, notes }) => {
          // Emniyet ağı aynı kişiyi zaten bildirdiyse ikinci e-postayı gönderme.
          if (isDuplicateLead(contactInfo)) {
            return {
              status: 'success',
              message: `${fullName} için bilgiler zaten kaydedildi. Ekibimiz iletişime geçecek.`,
            };
          }

          const delivery = await sendLeadEmail({
            fullName,
            contactInfo,
            projectType,
            notes,
            source: 'chatbot',
          });

          if (!delivery.delivered) {
            console.error(
              `[bot] Lead e-postası gönderilemedi (${delivery.reason}): ${fullName} / ${contactInfo}`,
            );
          }

          // Lead her hâlükârda loglandı; model kullanıcıya olumlu dönsün.
          return {
            status: 'success',
            message: `${fullName} için bilgiler kaydedildi. Ekibimiz en kısa sürede ${contactInfo} üzerinden iletişime geçecek.`,
          };
        },
      }),
    },
  });

  // useChat (AI SDK v5+) UI message stream bekler; toTextStreamResponse ile uyumsuzdur.
  return result.toUIMessageStreamResponse({
    // Varsayılanda hata istemciye "An error occurred" olarak gider ve stream sessizce biter.
    // Ziyaretçiye Türkçe, anlaşılır bir mesaj gösteriyoruz; detay sunucu logunda kalıyor.
    onError: (error) => {
      logProviderError(error);
      return 'Asistana şu anda ulaşılamıyor. Lütfen birazdan tekrar deneyin veya iletişim formunu kullanın.';
    },
  });
}
