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
    q: 'Hangi hizmetleri veriyorsunuz?',
    a: 'Sızma testi (pentest), altyapı güvenlik analizi, ISO 27001 hazırlık, KVKK uyum danışmanlığı ve marka & patent tescili. Hepsi aynı ekipte yürüdüğü için aynı bilgiyi iki kez toplamıyoruz.',
  },
  {
    q: 'Fiyat neye göre belirleniyor?',
    a: 'Hazır paket satmıyoruz. Rakamı belirleyen şey işin kapsamı: sızma testinde seçilen test alanları, kullanıcı rolü ve sistem sayısı; uyum tarafında departman sayısı, kullanılan sistemler ve aktarım yapılan tedarikçi sayısı. Kapsam görüşmesinden sonra fiyat sabitlenir ve iş bitene kadar değişmez. Teklif kabul edilmezse hiçbir ücret çıkmaz.',
  },
  {
    q: 'Bir çalışma ne kadar sürer?',
    a: 'Tek alanlı ve kapsamı netleşmiş bir sızma testi tipik olarak 5–10 iş günü test, ardından 2–3 iş günü raporlama demektir. Altyapı güvenlik analizinde saha incelemesi tipik bir işletmede 1–2 iş günü sürer. ISO 27001 hazırlığı ise kurum büyüklüğüne göre birkaç aylık bir dönemdir. Takvim her durumda kapsam görüşmesinde tarih verilerek sabitlenir.',
  },
  {
    q: 'Test sırasında sistemimiz çöker mi?',
    a: 'Amaç açık bulmak, servisi durdurmak değil: yük ve DDoS testleri kapsam dışıdır, yıkıcı olabilecek işlemler kapsam dokümanında baştan yasaklanır. Test, sizin belirlediğiniz pencerede yürütülebilir. Yine de test boyunca açık bir acil durum hattı bulunur; tek mesajla çalışma durur.',
  },
  {
    q: 'Rapor kimde kalıyor?',
    a: 'Rapor size aittir. Denetimlerde, sigorta süreçlerinde veya tedarikçi görüşmelerinde dilediğiniz gibi kullanabilirsiniz. Bulgular üçüncü taraflarla paylaşılmaz.',
  },
  {
    q: 'ISO 27001 belgesini siz mi veriyorsunuz?',
    a: 'Hayır. Belgeyi TÜRKAK akredite bir belgelendirme kuruluşu verir ve belgelendirme kararı ona aittir. Danışmanlık verdiğim kurumun belgelendirme denetimini de yapmam. Benim işim, o denetime eksiği kapatılmış olarak girmenizi sağlamak.',
  },
  {
    q: 'KVKK tarafında ceza almayacağımızın garantisini veriyor musunuz?',
    a: 'Hayır, böyle bir garanti kimse veremez. Denetim ve yaptırım yetkisi Kuruldadır ve sonucu kurumun fiilî uygulamasına bağlıdır. Bizim taahhüdümüz, yükümlülükleri eksiksiz çıkarmak, belgeleri gerçeği yansıtacak şekilde hazırlamak ve eksikleri önceliklendirilmiş bir listeyle önünüze koymaktır.',
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
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Aklınızdaki Sorular
        </h1>
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
