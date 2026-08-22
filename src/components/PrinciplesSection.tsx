import React from 'react';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { FileSignature, Receipt, RefreshCw, LifeBuoy, Lock, Scale } from 'lucide-react';

/**
 * Çalışma ilkeleri — somut taahhütler.
 *
 * DİKKAT: Buradaki maddeler müşteriye verilen sözlerdir. Tutamayacağın bir
 * maddeyi silmen ya da yumuşatman gerekir.
 *
 * Maddeler uydurulmadı; /pentest, /guvenlik-analizi ve /iso-27001
 * sayfalarında zaten verilen taahhütlerin özeti. Oralarda bir söz
 * değişirse burayı da güncelle, yoksa site kendi kendisiyle çelişir.
 */

const PRINCIPLES = [
  {
    icon: FileSignature,
    title: 'Yetki belgesi olmadan hiçbir test başlamaz',
    desc: 'İmzalı yetki belgesi, gizlilik sözleşmesi, hedef listesi, yasaklı işlemler ve test penceresi yazılı olarak netleşmeden tek bir istek gönderilmez.',
  },
  {
    icon: Receipt,
    title: 'Sabit fiyat, sürpriz fatura yok',
    desc: 'Kapsam dokümanı imzalandıktan sonra fiyat değişmez. Kapsam dışı bir talep gelirse önce onayınızı alır, sonra çalışırız.',
  },
  {
    icon: RefreshCw,
    title: 'Doğrulama testi ücretsiz',
    desc: 'Kapattığınızı bildirdiğiniz bulgular yeniden denenir ve sonuç rapora doğrulama eki olarak işlenir. Bu adım ayrıca ücretlendirilmez.',
  },
  {
    icon: LifeBuoy,
    title: 'Tek mesajla duran bir çalışma',
    desc: 'Yük ve DDoS testleri kapsam dışıdır, yıkıcı işlemler baştan yasaklanır. Test boyunca açık bir acil durum hattı bulunur; tek mesajla çalışma durur.',
  },
  {
    icon: Lock,
    title: 'En az veriye dokunulur, hiçbiri saklanmaz',
    desc: 'Açığı kanıtlamak için gereken en küçük örneklem alınır. Ekran görüntüleri rapora girmeden önce anonimleştirilir, test bitiminde çalışma ortamı temizlenir.',
  },
  {
    icon: Scale,
    title: 'Rolümüzün sınırını söyleriz',
    desc: 'ISO 27001 belgesini TÜRKAK akredite bir kuruluş verir; danışmanlık verdiğim kurumun belgelendirme denetimini yapmam. Kimsenin veremeyeceği bir garantiyi de vermeyiz.',
  },
];

export function PrinciplesSection() {
  return (
    <section id="ilkeler" className="scroll-mt-28">
      <Reveal>
        <div className="mb-8 text-center sm:mb-12">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-brand-400 sm:text-xs">
          // Çalışma İlkelerimiz
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Sözlü Değil, Yazılı Taahhüt
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
          Aşağıdakiler pazarlama cümlesi değil, sözleşmeye giren maddeler.
        </p>
      </div>
      </Reveal>

      <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
          <RevealItem
            as="li"
            key={title}
            className="flex gap-4 lift rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-700 hover:bg-slate-900/70"
          >
            <span className="mt-0.5 h-fit rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{desc}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export default PrinciplesSection;
