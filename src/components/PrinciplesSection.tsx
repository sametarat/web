import React from 'react';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { KeyRound, Gauge, Receipt, Eye, LifeBuoy, Lock } from 'lucide-react';

/**
 * Çalışma ilkeleri — somut taahhütler.
 *
 * DİKKAT: Buradaki maddeler müşteriye verilen sözlerdir. Tutamayacağın bir
 * maddeyi silmen ya da yumuşatman gerekir; "30 gün destek" gibi süreleri de
 * kendi çalışma şekline göre güncelle.
 */

const PRINCIPLES = [
  {
    icon: KeyRound,
    title: 'Kaynak kod sizin',
    desc: 'Proje bitince kod deposu ve tüm hesaplar size devredilir. Bize bağımlı kalmazsınız, dilediğiniz geliştiriciyle devam edebilirsiniz.',
  },
  {
    icon: Receipt,
    title: 'Sabit fiyat, sürpriz fatura yok',
    desc: 'Kapsam dokümanı imzalandıktan sonra fiyat değişmez. Kapsam dışı bir talep gelirse önce onayınızı alır, sonra yazarız.',
  },
  {
    icon: Gauge,
    title: 'Performans teslim şartıdır',
    desc: 'Lighthouse performans skoru 90 altında kalan bir siteyi teslim etmiyoruz. Ölçüm raporunu teslimatla birlikte paylaşıyoruz.',
  },
  {
    icon: Eye,
    title: 'Haftalık canlı önizleme',
    desc: 'Geliştirme boyunca her hafta çalışan bir link alırsınız. İlerlemeyi görür, yanlış giden bir şey varsa erken söylersiniz.',
  },
  {
    icon: LifeBuoy,
    title: 'Teslim sonrası 30 gün destek',
    desc: 'Yayına aldıktan sonraki ilk 30 gün içindeki hata düzeltmeleri ücretsizdir. Sonrası için bakım paketi opsiyoneldir.',
  },
  {
    icon: Lock,
    title: 'Veri ve gizlilik',
    desc: 'Paylaştığınız içerik, müşteri verisi ve ticari bilgi üçüncü taraflarla paylaşılmaz. Talep ederseniz NDA imzalarız.',
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
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Sözlü Değil, Yazılı Taahhüt
        </h2>
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
