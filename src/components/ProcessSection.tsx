import React from 'react';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { Search, FileSignature, Bug, RefreshCw } from 'lucide-react';

/**
 * Süreç bölümü. Amaç: ziyaretçinin "para verdikten sonra ne olacak?" sorusuna
 * baştan net cevap vermek. Her adımda müşterinin ELİNE NE GEÇTİĞİ yazılı —
 * belirsizlik, hizmet seçiminde en büyük tereddüt sebebi.
 *
 * Süreler /pentest sayfasındaki adım tablosuyla aynı; biri değişirse diğerini
 * de güncelle.
 */

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Kapsam görüşmesi',
    duration: '1 iş günü içinde dönüş',
    desc: 'Neyin test edileceğini, hangi sistemlerin dâhil olduğunu ve takvimi konuşuyoruz. Görüşme bağlayıcı değil.',
    deliverable: 'Yazılı kapsam dokümanı ve sabit fiyat',
  },
  {
    icon: FileSignature,
    step: '02',
    title: 'Yetkilendirme ve gizlilik',
    duration: '2–3 iş günü',
    desc: 'İmzalı yetki belgesi, gizlilik sözleşmesi, hedef listesi, yasaklı işlemler ve test penceresi yazılı olarak netleşir.',
    deliverable: 'İmzalı yetki belgesi ve gizlilik sözleşmesi',
  },
  {
    icon: Bug,
    step: '03',
    title: 'Test ve raporlama',
    duration: '5–10 iş günü + 2–3 gün rapor',
    desc: 'Çalışma elle yürütülüyor. Yönetim özeti karar verecek kişi için, teknik bölüm düzeltmeyi yapacak geliştirici için ayrı yazılıyor.',
    deliverable: 'CVSS puanlı bulgu raporu ve düzeltme önerileri',
  },
  {
    icon: RefreshCw,
    step: '04',
    title: 'Düzeltme desteği ve doğrulama',
    duration: '2 hafta soru-cevap + 1–2 iş günü',
    desc: 'Geliştirici ekibinizle bulgu bazında soru-cevap, ardından kapatıldığı bildirilen bulguların yeniden denenmesi.',
    deliverable: 'Rapora işlenen doğrulama eki — ayrıca ücretlendirilmez',
  },
];

export function ProcessSection() {
  return (
    <section id="surec" className="scroll-mt-28">
      <Reveal>
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
      </Reveal>

      <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, step, title, duration, desc, deliverable }) => (
          <RevealItem
            as="li"
            key={step}
            className="group relative flex flex-col lift rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-brand-500/40"
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
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export default ProcessSection;
