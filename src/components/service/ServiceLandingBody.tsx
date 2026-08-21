import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown, Phone } from 'lucide-react';
import { SITE, CONTACT } from '@/lib/site';
import { Logo } from '@/components/Logo';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceIcon } from '@/components/service/ServiceIcon';
import type { ServiceContent } from '@/content/services/types';

/**
 * Reklam trafiği için odaklı açılış sayfası gövdesi — /<slug>/teklif/
 *
 * Site navigasyonu bilinçli olarak yok: sayfanın tek işi teklif formuna
 * götürmek. Diğer hizmetlere bağlantı verilmiyor, altbilgide yalnızca yasal
 * metinler duruyor. Marka logosu ana sayfaya bağlanıyor; bu, ziyaretçinin
 * "burası kim" sorusuna cevap veren tek çıkış.
 */

const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
];

const SECTION_LABEL = 'block font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400';

export function ServiceLandingBody({ service }: { service: ServiceContent }) {
  const { landing } = service;

  return (
    <>
      {/* Minimal başlık — navigasyon yok, sadece marka */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label={`${SITE.name} ana sayfa`} className="min-w-0">
            <Logo size="sm" />
          </Link>
          <span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-slate-400">
            <ServiceIcon name={service.icon} className="h-3.5 w-3.5 shrink-0 text-brand-400" />
            <span className="truncate">
              {service.navLabel} · {CONTACT.city}
            </span>
          </span>
        </div>
      </header>

      <main className="min-w-0">
        {/* 1 — HERO + FORM */}
        <section className="relative overflow-hidden px-5 py-12 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 sheet-grid sheet-fade opacity-70" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[380px]">
            <div className="hero-glow absolute inset-0 opacity-60" />
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <div className="min-w-0">
              <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 text-[11px] font-semibold text-brand-300">
                <ServiceIcon name={service.icon} className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{service.navLabel}</span>
              </span>
              <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                {landing.h1}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {landing.promise}
              </p>

              <ul className="mt-6 space-y-2.5">
                {landing.benefits.map((benefit) => (
                  <li key={benefit.title} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                    <span className="min-w-0 leading-relaxed">
                      <strong className="font-semibold text-white">{benefit.title}</strong>
                      {' — '}
                      {benefit.desc}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#teklif"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-500"
                >
                  {landing.submitLabel}
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">{CONTACT.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Form — masaüstünde sağda ve sabit, mobilde metnin hemen altında */}
            <div id="teklif" className="min-w-0 scroll-mt-6 lg:sticky lg:top-6">
              <ServiceForm
                service={service.navLabel}
                source="hizmet-teklif"
                heading={landing.ctaHeading}
                description={landing.ctaText}
                submitLabel={landing.submitLabel}
              />
            </div>
          </div>
        </section>

        {/* 2 — ÇALIŞMA BİÇİMİ */}
        <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className={SECTION_LABEL}>{'// Güven'}</span>
              <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {landing.trustHeading}
              </h2>
            </Reveal>
            <RevealGroup as="ul" className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
              {landing.trust.map((item) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  className="lift min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
                >
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* 3 — SSS */}
        <section className="border-t border-white/5 px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className={SECTION_LABEL}>{'// Sıkça sorulanlar'}</span>
              <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Teklif İstemeden Önce Sorulanlar
              </h2>
            </Reveal>
            <RevealGroup className="mt-8 space-y-2.5">
              {landing.faq.map(({ q, a }) => (
                <RevealItem key={q}>
                  <details className="group rounded-2xl border border-slate-800 bg-slate-900/50 open:border-brand-500/30">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0">{q}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-xs leading-relaxed text-slate-400">{a}</p>
                  </details>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* 4 — KAPANIŞ + FORM */}
        <section id="teklif-formu" className="scroll-mt-6 border-t border-white/5 bg-slate-950/60 px-5 py-16">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="min-w-0">
              <Reveal>
                <span className={SECTION_LABEL}>{'// Başlangıç'}</span>
                <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {landing.closeHeading}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{landing.closeText}</p>
              </Reveal>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">{CONTACT.phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
                >
                  <span className="min-w-0 break-all">{CONTACT.email}</span>
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">{CONTACT.workingHours}</p>
            </div>
            <div className="min-w-0">
              <ServiceForm
                service={service.navLabel}
                source="hizmet-teklif"
                heading={landing.ctaHeading}
                description={landing.ctaText}
                submitLabel={landing.submitLabel}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Altbilgi — yalnızca yasal bağlantılar, hizmet menüsü yok */}
      <footer className="border-t border-white/5 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <Link href="/" aria-label={`${SITE.name} ana sayfa`}>
            <Logo size="sm" />
          </Link>
          <nav aria-label="Yasal bağlantılar">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-10 items-center transition-colors hover:text-brand-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-600">
            Form aracılığıyla ilettiğiniz kişisel veriler, yalnızca talebinize dönüş yapmak amacıyla
            işlenir ve üçüncü taraflarla paylaşılmaz.
          </p>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} {SITE.name} · {CONTACT.city}
          </p>
        </div>
      </footer>

      {/* Mobilde sabit CTA — sayfa uzun, forma dönüş her yerden mümkün olsun */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 p-3 backdrop-blur-sm md:hidden">
        <a
          href="#teklif"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white"
        >
          {landing.submitLabel}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}

export default ServiceLandingBody;
