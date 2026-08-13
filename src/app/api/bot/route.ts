import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tool parametreleri için arayüz (Interface) tanımı
interface SaveQualifiedLeadArgs {
  fullName: string;
  contactInfo: string;
  projectType: string;
  notes?: string;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    // maxSteps doğrudan streamText objesinin kök seviyesinde kalmalıdır
    maxSteps: 3,
    system: `
      Sen NEXUS//LABS web mimarisi, özel yazılım ve dijital dönüşüm ajansının kıdemli satış ve teknik danışmanısın.

      ==================================================
      🏢 KURUMSAL BİLGİ VE HİZMET KATALOĞU
      ==================================================
      1. HİZMETLERİMİZ:
         - Kurumsal Web Tasarım & Geliştirme (Next.js 16, React 19, Tailwind CSS ile yüksek hızlı, SEO uyumlu ve mobil odaklı siteler).
         - E-Ticaret Sistemleri (Yüksek dönüşüm odaklı, ödeme entegrasyonlu, gelişmiş stok yönetimli platformlar).
         - Özel Web/Mobil Yazılım & Mimariler (SaaS projeleri, ERP/CRM çözümleri, mobil uygulamalar).
         - Dijital Strateji & SEO (Arama motoru optimizasyonu, sayfa hızı skorları (Lighthouse 90+), dönüşüm optimizasyonu).

      2. NEDEN NEXUS//LABS?
         - Eski nesil yavaş sistemler (WordPress vb.) yerine en son web teknolojilerini (Next.js App Router, Turbopack) kullanırız.
         - Sayfa yüklenme hızlarımız ultra yüksektir (Sub-second loading).
         - Güvenli ve modern mimariler uygularız.
         - Tamamen markaya özel, modern ve responsive tasarımlar hazırlarız.

      3. TEKLİF VE SÜREÇ SİSTEMİ:
         - Projeler analiz, tasarım, geliştirme, test ve canlıya alma aşamalarıyla yürütülür.
         - Ortalama teslim süreleri: Kurumsal siteler için 1-3 hafta, E-ticaret & Özel projeler için 3-6 haftadır.

      ==================================================
      🎯 MÜŞTERİ YÖNLENDİRME STRATEJİSİ
      ==================================================
      1. Ziyaretçi soru sorduğunda yukarıdaki bilgilerden faydalanarak net, kendinden emin ve profesyonel yanıtlar ver.
      2. Müşteri fiyat, teklif veya süreç sorduğunda:
         - Asla harici bir forma yönlendirme yapma!
         - "Size özel doğru teklifi ve proje takvimini çıkarabilmemiz için Ad-Soyad ve Telefon/E-posta bilgilerinizi alabilir miyim?" şeklinde bilgi iste.
      3. Müşteri iletişim bilgilerini paylaştığı an DERHAL 'saveQualifiedLead' fonksiyonunu çalıştır.
    `,
    messages,
    tools: {
      saveQualifiedLead: tool({
        description: 'Potansiyel müşterinin proje detaylarını ve iletişim bilgilerini kaydeder.',
        parameters: z.object({
          fullName: z.string().describe('Müşterinin adı soyadı'),
          contactInfo: z.string().describe('Müşterinin telefon numarası veya e-posta adresi'),
          projectType: z.string().describe('İlgilendiği hizmet (Örn: E-ticaret, Kurumsal Site, Özel Yazılım)'),
          notes: z.string().optional().describe('Müşterinin bahsettiği özel detaylar veya beklentiler'),
        }),
        execute: async ({ fullName, contactInfo, projectType, notes }: SaveQualifiedLeadArgs) => {
          console.log('🚀 --- YENİ MÜŞTERİ BİLGİSİ YAKALANDI ---');
          console.log({ fullName, contactInfo, projectType, notes });

          // WhatsApp Bildirim Entegrasyonu (İsteğe bağlı CallMeBot veya Webhook)
          const myPhoneNumber = "905XXXXXXXXX"; // Telefon numaranız
          const apiKey = "CALLMEBOT_API_KEY"; // CallMeBot API Anahtarınız

          if (apiKey !== "CALLMEBOT_API_KEY") {
            const whatsappMessage = encodeURIComponent(
              `🔥 *YENİ MÜŞTERİ BİLGİSİ YAKALANDI!*\n\n` +
              `👤 *İsim:* ${fullName}\n` +
              `📞 *İletişim:* ${contactInfo}\n` +
              `💼 *Hizmet:* ${projectType}\n` +
              `📝 *Notlar:* ${notes || 'Belirtilmedi'}`
            );

            try {
              await fetch(`https://api.callmebot.com/whatsapp.php?phone=${myPhoneNumber}&text=${whatsappMessage}&apikey=${apiKey}`);
            } catch (error) {
              console.error('WhatsApp bildirimi gönderilemedi:', error);
            }
          }

          return {
            status: 'success',
            message: `Harika! ${fullName} Bey/Hanım, proje detaylarınızı ve iletişim bilgilerinizi kaydettim. Ekibimiz en kısa sürede sizinle iletişime geçecektir.`,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}