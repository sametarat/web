'use client';

import React from 'react';
import { Reveal } from '@/components/Reveal';

/**
 * Bölüm başlığı — teknik çizim "antet"i.
 *
 * Önceki hâlinde her bölüm başlığı aynı puntodaydı; sayfada hiyerarşi yoktu,
 * beş bölüm de eşit ağırlıkta görünüyordu. Artık boyut bir karar: `size`
 * bölümün sayfadaki önemini taşıyor (demolar en iri, yardımcı bölümler en
 * küçük). Numara dekorasyon değil — bölümler bir sunum sırası izliyor.
 *
 * `layout="split"` açıklamayı sağda ayrı bir sütuna alır ve blok asimetrik
 * durur; `layout="stack"` dar sütunlar için başlığın altına yığar.
 */

type Size = 'xl' | 'lg' | 'md' | 'sm';

/**
 * Punto ve satır aralığı birlikte veriliyor: Türkçe başlıklarda ğ/ç/ş alt
 * uzantıları ve ü/ö/İ üst işaretleri var, iri puntoda bile 0,94 satır aralığı
 * satırları birbirine değdiriyor. Punto küçüldükçe aralık açılıyor.
 */
const TITLE_SIZE: Record<Size, string> = {
  xl: 'text-[clamp(2.1rem,6.2vw,4.5rem)] leading-[0.98]',
  lg: 'text-[clamp(1.85rem,4.6vw,3.4rem)] leading-[1.03]',
  md: 'text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.08]',
  sm: 'text-[clamp(1.35rem,2.6vw,1.85rem)] leading-[1.15]',
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  desc,
  size = 'lg',
  layout = 'split',
  className = '',
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
  size?: Size;
  layout?: 'split' | 'stack';
  className?: string;
}) {
  const heading = (
    <h2
      className={`font-display font-extrabold tracking-[-0.03em] text-white text-balance ${TITLE_SIZE[size]}`}
    >
      {title}
    </h2>
  );

  return (
    <Reveal>
      <div className={className}>
        {/* Antet satırı: sıra numarası (işaret rengi), bölüm adı ve sağa
            doğru uzayan ölçü şeridi — markanın taşıyıcı motifi. */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="font-mono text-[11px] font-semibold tabular-nums text-accent-400"
          >
            {index}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-[11px]">
            {eyebrow}
          </span>
          <span aria-hidden="true" className="rule-tape ml-1 min-w-6 flex-1 text-brand-400" />
        </div>

        {layout === 'split' ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-12">
            {heading}
            {desc && (
              <p className="max-w-md text-sm leading-relaxed text-slate-400 lg:self-end lg:pb-2">
                {desc}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-5">
            {heading}
            {desc && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{desc}</p>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default SectionHeading;
