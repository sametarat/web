import React from 'react';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';

/**
 * Süreç bölümü. Amaç: ziyaretçinin "para verdikten sonra ne olacak?" sorusuna
 * baştan net cevap vermek. Her adımda müşterinin ELİNE NE GEÇTİĞİ yazılı —
 * belirsizlik, ajans seçiminde en büyük tereddüt sebebi.
 */

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Keşif & Analiz',
    duration: '2–4 gün',
    desc: 'İşinizi, hedef kitlenizi ve rakiplerinizi konuşuyoruz. Mevcut siteniz varsa teknik denetimden geçiriyoruz.',
    deliverable: 'Kapsam dokümanı ve sabit fiyat teklifi',
  },
  {
    icon: PenTool,
    step: '02',
    title: 'Tasarım & Prototip',
    duration: '3–7 gün',
    desc: 'Hazır tema kullanmıyoruz. Markanıza özel arayüzü tıklanabilir prototip olarak görüyorsunuz.',
    deliverable: 'Onayınıza sunulan interaktif prototip',
  },
  {
    icon: Code2,
    step: '03',
    title: 'Geliştirme',
    duration: '1–4 hafta',
    desc: 'Kod yazılırken izliyorsunuz. Her hafta çalışan bir önizleme linki gönderiyoruz, sürpriz olmuyor.',
    deliverable: 'Haftalık canlı önizleme ve ilerleme raporu',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Yayın & Devir',
    duration: '1–2 gün',
    desc: 'Alan adı, SSL, analytics ve arama motoru kurulumlarını biz yapıyoruz. Kod deposu size devrediliyor.',
    deliverable: 'Yayındaki site, kaynak kod ve kullanım eğitimi',
  },
];

export function ProcessSection() {
  return (
    <section id="surec" className="scroll-mt-28">
      <div className="mb-8 text-center sm:mb-12">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-brand-400 sm:text-xs">
          // Nasıl Çalışıyoruz
        </span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Sürpriz Yok, Her Adım Belli
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
          Projeye başlarken ne zaman ne olacağını ve her aşamada elinize ne geçeceğini
          önceden yazılı olarak biliyorsunuz.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, step, title, duration, desc, deliverable }) => (
          <li
            key={step}
            className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-brand-500/40"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-mono text-2xl font-black text-slate-800 transition-colors group-hover:text-brand-500/30">
                {step}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white sm:text-base">{title}</h3>
            <span className="mt-0.5 font-mono text-[11px] text-brand-400">{duration}</span>

            <p className="mt-2.5 flex-1 text-xs leading-relaxed text-slate-400">{desc}</p>

            <div className="mt-4 border-t border-slate-800 pt-3">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Teslim
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-300">
                {deliverable}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ProcessSection;
