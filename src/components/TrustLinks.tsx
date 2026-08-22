import React from 'react';
import { RevealGroup, RevealItem } from '@/components/Reveal';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

/**
 * Ana sayfadan ilkeler ve SSS sayfalarına köprü.
 *
 * Bu iki bölüm ana sayfada tam hâliyle duruyordu ve sayfayı hem masaüstünde
 * hem mobilde aşırı uzatıyordu. İçerik artık kendi sayfalarında; ana sayfa
 * sadece varlıklarını duyurup yönlendiriyor.
 */
const CARDS = [
  {
    icon: ShieldCheck,
    href: '/ilkeler',
    title: 'Çalışma İlkelerimiz',
    desc: 'Yetki belgesi olmadan test yok, fiyat sabit, doğrulama testi ücretsiz. Sözleşmeye giren maddeler ve dört adımlı süreç.',
    cta: 'İlkeleri ve süreci gör',
  },
  {
    icon: HelpCircle,
    href: '/sss',
    title: 'Sık Sorulan Sorular',
    desc: 'Bir çalışma ne kadar sürer, fiyat neye göre belirlenir, test sırasında sistem çöker mi, rapor kimde kalır.',
    cta: 'Soruları oku',
  },
];

export function TrustLinks() {
  return (
    <section aria-label="İlkeler ve sık sorulan sorular">
      {/* İki kart eşit değil: ilkeler sözleşmeye giren taahhütler, SSS ise
          ikincil bir referans. Genişlik farkı bu önem farkını söylüyor. */}
      <RevealGroup
        as="ul"
        className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      >
        {CARDS.map(({ icon: Icon, href, title, desc, cta }, idx) => (
          <RevealItem as="li" key={href}>
            <Link
              href={href}
              className={`lift group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 transition-all hover:border-brand-500/40 hover:bg-slate-900/80 ${
                idx === 0 ? 'p-6 sm:p-8' : 'p-6'
              }`}
            >
              <span className="w-fit rounded-lg border border-brand-500/20 bg-brand-500/10 p-2.5 text-brand-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2
                className={`mt-5 font-display font-bold tracking-tight text-white ${
                  idx === 0 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-xl'
                }`}
              >
                {title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand-400">
                {cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export default TrustLinks;
