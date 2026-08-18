'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Hero.
 *
 * Ajans tek bir şey satmıyor; kurumsal site, e-ticaret ve büyüme hizmetleri
 * farklı müşteri profillerine hitap ediyor. Tek bir başlıkla üçünü birden
 * anlatmaya çalışmak yerine sırayla gösteriyoruz.
 *
 * Düzen bilinçli olarak asimetrik: başlık soldaki geniş sütunu tek başına
 * dolduruyor, sağdaki dar sütun hem slayt dizinini hem de ölçüm değerlerini
 * taşıyor. Böylece slayt kontrolleri "nokta" olmaktan çıkıp içerik oluyor —
 * ziyaretçi üç hizmeti aynı anda görebiliyor.
 *
 * Erişilebilirlik: otomatik geçiş fareyle üzerine gelince, odaklanınca ve
 * `prefers-reduced-motion` açıkken durur. Slaytlar arasında ok tuşlarıyla
 * gezinilebilir.
 */

type Slide = {
  /** Sağdaki dizinde görünen kısa ad. */
  label: string;
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
};

const SLIDES: Slide[] = [
  {
    label: 'Web & Yazılım',
    eyebrow: 'Özel Web Yazılımları & Dijital Çözümler',
    title: (
      <>
        İşletmeniz için hızlı, güvenli ve{' '}
        <span className="text-brand-300">yüksek dönüşümlü</span> web sistemleri
      </>
    ),
    desc: 'Yavaş açılan ve müşteri kaybettiren hazır temaları unutun. İşletmenize özel mimaride geliştirilmiş, milisaniyelik hızlarda çalışan canlı platformlar inşa ediyoruz.',
    primary: { href: '#demolar', label: 'Canlı demoları gör' },
    secondary: { href: '#teklif-al', label: 'Hemen teklif al' },
  },
  {
    label: 'E-Ticaret',
    eyebrow: 'E-Ticaret & Satış Altyapısı',
    title: (
      <>
        Ürününüzü değil,{' '}
        <span className="text-brand-300">satış sürecinizi</span> tasarlıyoruz
      </>
    ),
    desc: 'Ödeme entegrasyonu, stok yönetimi ve sepet akışı; hepsi dönüşüm için kurgulanmış tek bir sistemde. Ziyaretçinin sepete gitmesini engelleyen her adımı ölçüp kaldırıyoruz.',
    primary: { href: '/demo/moda-eticaret', label: 'E-ticaret demosunu aç' },
    secondary: { href: '#teklif-al', label: 'Projenizi konuşalım' },
  },
  {
    label: 'SEO & Reklam',
    eyebrow: 'Teknik SEO & Reklam Yönetimi',
    title: (
      <>
        Siteniz var ama{' '}
        <span className="text-brand-300">kimse bulamıyorsa</span>
      </>
    ),
    desc: 'Teknik SEO altyapısı, sayfa hızı ve dönüşüm optimizasyonu ile organik trafiği büyütüyor; Meta ve Google reklamlarını ölçülebilir hedeflerle yönetiyoruz.',
    primary: { href: '/ucretsiz-analiz', label: 'Ücretsiz site analizi' },
    secondary: { href: '/ilkeler', label: 'Nasıl çalışıyoruz' },
  },
];

/** Sağ sütundaki ölçüm bloğu — sayfanın başka yerlerinde kanıtlanan değerler. */
const MEASUREMENTS = [
  { label: 'TTFB', value: '0,08 ms' },
  { label: 'Core Web Vitals', value: '100 / 100' },
  { label: 'Canlı demo', value: '6 sektör' },
];

const INTERVAL = 7000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  // Otomatik geçiş — duraklatıldığında ve hareket azaltma tercihinde çalışmaz
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(index + 1);
    if (event.key === 'ArrowLeft') go(index - 1);
  };

  const slide = SLIDES[index];

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Hizmetlerimiz"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
      className="relative"
    >
      {/* Arka plan ışıması — dekoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[540px] overflow-hidden"
      >
        <div className="hero-glow absolute inset-0" />
        <div className="aurora-blob absolute left-0 top-4 h-72 w-72 rounded-full bg-brand-600/20 blur-[130px]" />
        <div className="aurora-blob aurora-blob-slow absolute right-0 top-20 h-80 w-80 rounded-full bg-brand-800/25 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-5 pt-10 pb-12 sm:px-8 lg:px-12 lg:pt-20 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          {/* Sol: tezin kendisi */}
          <div
            className="min-w-0 lg:col-span-8"
            role="group"
            aria-roledescription="slayt"
            aria-label={`${index + 1} / ${SLIDES.length}`}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="whitespace-nowrap font-mono text-[11px] font-semibold tabular-nums text-brand-400">
                {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </span>
              <span className="dim-rule hidden w-10 shrink-0 sm:block" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 sm:text-[11px]">
                {slide.eyebrow}
              </span>
            </div>

            <div key={index} className="slide-in">
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.05rem,4.9vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white text-balance">
                {slide.title}
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
                {slide.desc}
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href={slide.primary.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-brand-900/50 transition-colors hover:bg-brand-500"
                >
                  {slide.primary.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href={slide.secondary.href}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-7 py-4 text-sm font-semibold text-slate-200 transition-colors hover:border-brand-500/60 hover:text-white"
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </div>
          </div>

          {/* Sağ: slayt dizini + ölçümler. Kontroller aynı zamanda içerik. */}
          <div className="min-w-0 lg:col-span-4 lg:border-l lg:border-slate-800/70 lg:pl-10">
            <ul className="flex flex-col">
              {SLIDES.map((item, i) => {
                const isActive = i === index;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={isActive ? 'true' : undefined}
                      aria-label={`${i + 1}. hizmete geç: ${item.eyebrow}`}
                      className="group w-full border-t border-slate-800/70 py-3.5 text-left last:border-b"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-[11px] tabular-nums transition-colors ${
                            isActive ? 'text-brand-400' : 'text-slate-600'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-display text-base font-bold tracking-tight transition-colors sm:text-lg ${
                            isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        >
                          {item.label}
                        </span>
                      </span>

                      {/* Sıradaki geçişe kalan süre */}
                      <span
                        aria-hidden="true"
                        className="mt-2.5 block h-px w-full overflow-hidden bg-slate-800/80"
                      >
                        {isActive && (
                          <span
                            key={index}
                            className="hero-progress block h-px w-full bg-brand-400"
                            style={{
                              animationDuration: `${INTERVAL}ms`,
                              animationPlayState: paused ? 'paused' : 'running',
                            }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-8 space-y-3">
              {MEASUREMENTS.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {m.label}
                  </dt>
                  <span aria-hidden="true" className="h-px flex-1 bg-slate-800/70" />
                  <dd className="font-mono text-sm font-semibold tabular-nums text-emerald-400">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
