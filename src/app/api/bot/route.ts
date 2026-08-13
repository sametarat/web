import { NextResponse } from 'next/server';

interface BotRequest {
  stage: number;
  input: string;
}

// Basit sanitizasyon fonksiyonu (XSS koruması için temel escape)
function sanitizeInput(str: string): string {
  return str.replace(/[<>]/g, '');
}

export async function POST(request: Request) {
  try {
    const body: BotRequest = await request.json();
    const { stage, input } = body;

    if (!stage || typeof input !== 'string') {
      return NextResponse.json({ error: 'Geçersiz parametreler.' }, { status: 400 });
    }

    const cleanInput = sanitizeInput(input);

    switch (stage) {
      case 1:
        // Aşama 1: Niyet Analizi ve Alt Soru Üretimi
        return NextResponse.json({
          nextStage: 2,
          response: `Analiz edilen girdi: "${cleanInput}".`,
          subQuestion: 'Bu süreci hangi ana kategoride optimize etmek istiyorsunuz?',
        });

      case 2:
        // Aşama 2: Optimizasyon ve Veri İşleme
        return NextResponse.json({
          nextStage: 3,
          response: 'Optimizasyon kuralları uygulandı ve performans testleri tamamlandı.',
          subQuestion: 'Çıktıyı rapor formatında kaydetmek ister misiniz?',
        });

      case 3:
        // Aşama 3: Nihai Çıktı ve Eylem (CTA)
        return NextResponse.json({
          nextStage: null,
          response: `İşlem başarıyla tamamlandı: ${cleanInput}`,
          actionCTA: 'Canlı Demoyu Test Et veya E-posta Gönder',
        });

      default:
        return NextResponse.json({ error: 'Bilinmeyen aşama.' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}