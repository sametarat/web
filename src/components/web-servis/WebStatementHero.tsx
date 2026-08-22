'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CONTACT } from '@/lib/site';

/**
 * /web-servis hero'su — tek cümle, dönen tek kelime.
 *
 * NEDEN DEMO GİTTİ: hero'da canlı demo vitrini vardı ama sayfanın aşağısında
 * zaten tam bir demo bölümü var. Aynı şeyi iki kez göstermek vitrini
 * değersizleştiriyordu; ziyaretçi ilk ekranda oynayıp aşağıdaki asıl bölüme
 * hiç inmiyordu. Şimdi hero söz veriyor, demo bölümü kanıtlıyor.
 *
 * NEDEN TEK SÜTUN: iki sütunlu düzende sağ yarı sürekli doldurulacak bir
 * boşluk üretiyordu ve her doldurma denemesi sayfayı kalabalıklaştırdı.
 * Tek sütun editoryal düzen bu sorunu doldurarak değil, kaldırarak çözüyor:
 * iri tipografi zaten sayfanın kendisi oluyor.
 *
 * Ana sayfayla aynı fikir (sabit cümle + dönen kelime) bilinçli: iki iş ayrı
 * sitelerde anlatılıyor ama aynı elden çıktığı belli olsun.
 */

type Phrase = { verb: string; href: string; label: string };

const PHRASES: Phrase[] = [
  { verb: 'kuralım', href: '/web-tasarim/teklif', label: 'Web tasarım teklifi' },
  { verb: 'hızlandıralım', href: '/web-tasarim/teklif', label: 'Web tasarım teklifi' },
  { verb: 'arama sonuçlarına taşıyalım', href: '/seo/teklif', label: 'SEO teklifi' },
  { verb: 'reklamla büyütelim', href: '/reklam-yonetimi/teklif', label: 'Reklam yönetimi teklifi' },
];

const HOLD_MS = 2800;

export function WebStatementHero() {
  const [index, setIndex] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), HOLD_MS);
    return () => window.clearInterval(timer);
  }, []);

  const active = PHRASES[index];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--faint)]">
          Web · SEO · Reklam
        </span>
        <span
          aria-hidden="true"
          className="rule-tape hidden w-16 shrink-0 text-[var(--faint)] sm:block"
        />
      </div>

      <h1 className="mt-6 font-display text-[clamp(2.3rem,6vw,4.6rem)] font-extrabold leading-[1.0] tracking-[-0.042em] text-[var(--ink)]">
        <span className="block">Sitenizi</span>
        {/* Görsel katman aria-hidden; tam metin altta gizli olarak duruyor. */}
        <span aria-hidden="true" className="mt-1 block min-h-[1.04em] text-[var(--blue)]">
          <span key={index} className="slide-in inline-block">
            {active.verb}
          </span>
        </span>
        <span className="sr-only">
          Sitenizi kuralım, hızlandıralım, arama sonuçlarına taşıyalım, reklamla büyütelim.
        </span>
      </h1>

      <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-[var(--graphite)]">
        Hazır tema kurmuyoruz. Kurumsal site, e-ticaret ve özel yazılımı mobil öncelikli
        yazıyor; arama tarafında önce teknik denetim yapıyor, Google Ads ve Meta tarafında
        kurulumu, dönüşüm takibini ve aylık optimizasyonu üstleniyoruz.
      </p>

      <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-[var(--faint)]">
        Sıralama ya da satış garantisi vermiyoruz. Reklam hesabı sizin adınıza açılır, bütçe
        doğrudan platforma ödenir.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href="#teklif"
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--blue)] px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Teklif İstiyorum
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
        {/* İkinci düğme cümleyi takip ediyor: hareket dekorasyon değil, yol. */}
        <Link
          href={active.href}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--card)] px-7 py-3.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--blue)]"
        >
          {active.label}
        </Link>
        <a
          href={`tel:${CONTACT.phoneE164}`}
          className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-[var(--graphite)] transition-colors hover:text-[var(--ink)]"
        >
          {CONTACT.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

export default WebStatementHero;
