'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Hero.
 *
 * Konumlandırma güvenlik ve uyum üzerine daraltıldı; iki taraf farklı müşteri
 * profillerine hitap ettiği için tek bir başlıkla ikisini birden anlatmak
 * yerine sırayla gösteriyoruz.
 *
 * Düzen bilinçli olarak asimetrik: başlık soldaki geniş sütunu tek başına
 * dolduruyor, sağdaki dar sütun hem slayt dizinini hem de ölçüm değerlerini
 * taşıyor. Böylece slayt kontrolleri "nokta" olmaktan çıkıp içerik oluyor —
 * ziyaretçi iki hizmet başlığını aynı anda görebiliyor.
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
    label: 'Sızma Testi',
    eyebrow: 'Web · API · İç Ağ · Dış Ağ · Sosyal Mühendislik',
    title: (
      <>
        Açığı{' '}
        <span className="marked text-white">saldırgandan önce</span> biz bulalım
      </>
    ),
    desc: 'Elle yürütülen sızma testi. Her bulgu adım adım kanıtlanıyor, düzeltme önerisiyle teslim ediliyor ve düzeltmelerden sonra ücretsiz yeniden test ediliyor.',
    primary: { href: '/pentest', label: 'Sızma testi' },
    secondary: { href: '/guvenlik-analizi', label: 'Güvenlik analizi' },
  },
  {
    label: 'Güvenlik Analizi',
    eyebrow: 'Sabit Bedelli Ön Denetim',
    title: (
      <>
        Yatırımdan önce{' '}
        <span className="marked text-white">riski ölçelim</span>
      </>
    ),
    desc: 'Donanım ya da yazılıma bütçe ayırmadan önce altyapıyı ön denetimden geçiriyoruz: sızma kontrolü, ağ izolasyonu ve yedekleme incelemesi. Sonuç, yönetim seviyesinde okunabilir bir risk raporu.',
    primary: { href: '/guvenlik-analizi', label: 'Güvenlik analizi' },
    secondary: { href: '/pentest', label: 'Sızma testi' },
  },
  {
    label: 'Uyum',
    eyebrow: 'ISO 27001 · KVKK',
    title: (
      <>
        Denetime{' '}
        <span className="marked text-white">eksiksiz girin</span>
      </>
    ),
    desc: 'ISO 27001 belgelendirmeye hazırlık ve KVKK uyum süreci. Denetçinin ne aradığını bilerek hazırlanıyor, evrakı sizin ekibinizin sahiplenmesini sağlıyoruz. Belgeyi akredite kuruluş verir; biz o denetime hazır girmenizi sağlarız.',
    primary: { href: '/iso-27001', label: 'ISO 27001 hazırlık' },
    secondary: { href: '/kvkk-danismanlik', label: 'KVKK danışmanlığı' },
  },
  {
    label: 'Tescil',
    eyebrow: 'Marka ve Patent',
    title: (
      <>
        Markanızı{' '}
        <span className="marked text-white">kâğıt üstünde</span> sahiplenin
      </>
    ),
    desc: 'TÜRKPATENT nezdinde marka ve patent tescili: benzerlik araştırması, sınıf seçimi, başvuru ve süreç takibi. İhalede ve yatırımcı görüşmesinde sorulan ilk belgelerden biri.',
    primary: { href: '/marka-patent-tescili', label: 'Marka & patent tescili' },
    secondary: { href: '/is-ortakligi', label: 'İş ortaklığı' },
  },
];

/**
 * Sağ sütundaki bilgi bloğu.
 *
 * DİKKAT: Buradaki değerler doğrulanabilir olmalı. Ölçülmemiş hız rakamı ya da
 * "%100 memnuniyet" gibi ifadeler koyma — ziyaretçi kontrol edemediği rakamı
 * ciddiye almıyor, kontrol edebildiği yanlış rakam ise güveni tamamen bitiriyor.
 */
const MEASUREMENTS: { label: string; value: string; highlight?: boolean }[] = [
  { label: 'Hizmet alanı', value: '5 başlık' },
  { label: 'Doğrulama testi', value: 'Ücretsiz' },
  // Tek işaretli satır: sayfadaki en güçlü güven kanıtı bu.
  { label: 'Sertifika', value: 'OSWE · TSE · ISO 27001', highlight: true },
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

      <div className="mx-auto w-full max-w-[1320px] px-5 pt-10 pb-12 sm:px-8 lg:px-12 lg:pt-16 lg:pb-14">
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
              <span className="rule-tape hidden w-14 shrink-0 text-brand-400 sm:block" aria-hidden="true" />
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
                            isActive ? 'text-accent-400' : 'text-slate-600'
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
                  <span aria-hidden="true" className="rule-tape min-w-6 flex-1 text-brand-400" />
                  <dd
                    className={`font-mono text-sm font-semibold tabular-nums ${
                      m.highlight ? 'text-accent-400' : 'text-white'
                    }`}
                  >
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
