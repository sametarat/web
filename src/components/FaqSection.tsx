import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

/**
 * SSS bölümü.
 *
 * Native <details>/<summary> kullanıyoruz: JavaScript olmadan çalışır, klavye ve
 * ekran okuyucu desteği tarayıcıdan gelir, ilk boyamada içerik zaten DOM'da olduğu
 * için arama motorları soruları ve cevapları görebilir.
 *
 * Cevapları kendi çalışma şekline göre düzenle — bunlar müşteri beklentisini kuruyor.
 */

const FAQS = [
  {
    q: 'Bir web sitesi ne kadar sürede teslim ediliyor?',
    a: 'Kurumsal tanıtım siteleri ortalama 1–3 hafta, e-ticaret ve özel yazılım projeleri 3–6 hafta sürüyor. Süre kapsam dokümanında yazılı olarak sabitleniyor; içerik ve görselleri zamanında ilettiğiniz sürece bu tarih kaymıyor.',
  },
  {
    q: 'Fiyat neye göre belirleniyor?',
    a: 'Hazır paket satmıyoruz çünkü her işin ihtiyacı farklı. Keşif görüşmesinden sonra sayfa sayısı, entegrasyonlar ve içerik üretimi kalemlerini ayrı ayrı fiyatlandırıp tek bir sabit rakam veriyoruz. Teklif kabul edilmezse hiçbir ücret çıkmaz.',
  },
  {
    q: 'WordPress yerine neden bunu tercih edeyim?',
    a: 'WordPress kötü bir araç değil ama eklenti yığınıyla büyüdükçe yavaşlıyor ve güvenlik yükü artıyor. Biz sayfaları önceden derleyip dünyaya dağıtılmış sunuculardan sunuyoruz; sonuç, veritabanı sorgusu beklemeyen ve saldırı yüzeyi çok daha dar bir site oluyor. Şu an okuduğunuz bu site de aynı mimariyle kurulu.',
  },
  {
    q: 'Siteyi kendim güncelleyebilecek miyim?',
    a: 'Evet. İçeriğini sık değiştireceğiniz bölümler için panel kuruyoruz ve teslimde nasıl kullanılacağını kayıt altına alınmış bir görüşmede gösteriyoruz. Kod tarafına dokunmanız gerekmiyor.',
  },
  {
    q: 'Projeyi yarıda bırakırsanız ne olur?',
    a: 'Kod deposuna baştan itibaren erişiminiz var, çalışma bizim sunucumuzda kilitli durmuyor. Herhangi bir aşamada ayrılmak isterseniz o ana kadar üretilen her şey sizde kalır ve başka bir ekip kaldığı yerden devam edebilir.',
  },
  {
    q: 'SEO ve reklam yönetimini de siz mi yapıyorsunuz?',
    a: 'Teknik SEO altyapısı (site hızı, yapısal veri, sitemap, mobil uyumluluk) her projeye dahil. İçerik stratejisi ile Meta ve Google reklam yönetimi ise ayrı hizmetler; isterseniz site teslimiyle birlikte, isterseniz sonrasında başlatıyoruz.',
  },
];

export function FaqSection() {
  return (
    <section id="sss" className="scroll-mt-28">
      {/* Soru-cevaplar Google'da zengin sonuç olarak çıkabilsin diye */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />
      <div className="mb-8 text-center sm:mb-12">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-brand-400 sm:text-xs">
          // Sık Sorulanlar
        </span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Aklınızdaki Sorular
        </h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-2.5">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border border-slate-800 bg-slate-900/50 transition-colors open:border-brand-500/30 open:bg-slate-900/80 hover:border-slate-700"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
              <span>{q}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-brand-400 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-xs leading-relaxed text-slate-400 sm:text-[13px]">{a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Başka bir sorunuz mu var?{' '}
        <Link href="/iletisim" className="font-medium text-brand-400 underline-offset-4 hover:underline">
          Doğrudan yazın
        </Link>
        , aynı gün dönüyoruz.
      </p>
    </section>
  );
}

export default FaqSection;
