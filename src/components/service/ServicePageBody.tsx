import React, { type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/site';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceIcon } from '@/components/service/ServiceIcon';
import { SERVICES } from '@/content/services';
import type { ServiceContent } from '@/content/services/types';

/**
 * Kurumsal hizmet sayfasının gövdesi — /<slug>/
 *
 * Tamamen veriden besleniyor: metin değiştirmek için içerik dosyasını
 * düzenlemek yeterli, burası hiç değişmiyor. Menü ve altbilgi sayfa
 * dosyasında ekleniyor; bu bileşen yalnızca <main> içeriğini üretir.
 */

const SECTION_LABEL = 'block font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400';
const CARD = 'min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-5';

function SectionHead({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <Reveal>
      <span className={SECTION_LABEL}>{`// ${label}`}</span>
      <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {children ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{children}</p> : null}
    </Reveal>
  );
}

function Tick() {
  return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />;
}

export function ServicePageBody({ service }: { service: ServiceContent }) {
  const others = SERVICES.filter((item) => item.slug !== service.slug).slice(0, 3);
  const quoteHref = `/${service.slug}/teklif/`;

  return (
    <main className="min-w-0">
      {/* 1 — HERO */}
      <section className="relative overflow-hidden px-5 py-12 sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 sheet-grid sheet-fade opacity-70" />
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="min-w-0">
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 text-[11px] font-semibold text-brand-300">
              <ServiceIcon name={service.icon} className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0">{service.hero.eyebrow}</span>
            </span>
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {service.hero.h1}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {service.hero.lead}
            </p>

            <ul className="mt-6 space-y-2.5">
              {service.hero.bullets.map((bullet) => (
                <li key={bullet} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-300">
                  <Tick />
                  <span className="min-w-0">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={quoteHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-500"
              >
                Teklif Alın
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href={`tel:${CONTACT.phoneE164}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0">{CONTACT.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Özet kartı — sayfanın vaadini tek ekranda özetler */}
          <Reveal delay={0.08} className="min-w-0">
            <aside className="min-w-0 rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-sm sm:p-7">
              <h2 className="text-lg font-extrabold text-white">{service.summaryTitle}</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{service.summaryText}</p>
              <div className="dim-rule my-5" aria-hidden="true" />
              <ul className="space-y-3">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-300">
                    <Tick />
                    <span className="min-w-0 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* 2 — GİRİŞ */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <SectionHead label="Neden" title={service.intro.heading} />
          <RevealGroup className="mt-6 space-y-4">
            {service.intro.paragraphs.map((paragraph) => (
              <RevealItem key={paragraph}>
                <p className="text-sm leading-relaxed text-slate-300">{paragraph}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 3 — KAPSAM */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Kapsam" title={service.offerHeading} />
          <RevealGroup as="ul" className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {service.offer.map((item) => (
              <RevealItem as="li" key={item.title} className={`lift ${CARD}`}>
                {/* İçerikte karta özel ikon yok; altı kez aynı ikonu tekrarlamak
                    yerine ince bir marka çizgisi kullanılıyor. */}
                <span aria-hidden="true" className="block h-0.5 w-8 rounded-full bg-brand-500/60" />
                <h3 className="mt-3 text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 4 — SÜREÇ */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead label="Süreç" title={service.processHeading} />
          <RevealGroup as="ul" className="mt-8 space-y-3">
            {service.process.map((step, index) => (
              <RevealItem as="li" key={step.title} className={`flex gap-4 ${CARD}`}>
                <span className="shrink-0 tabular-nums font-mono text-sm font-bold text-slate-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5 — KİMLER İÇİN */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Kimler için" title={service.audienceHeading} />
          <RevealGroup as="ul" className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {service.audience.map((item) => (
              <RevealItem as="li" key={item.title} className={`lift ${CARD}`}>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 6 — SSS */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <SectionHead label="Sıkça sorulanlar" title="Bu Hizmetle İlgili Sorulanlar" />
          <RevealGroup className="mt-8 space-y-2.5">
            {service.faq.map(({ q, a }) => (
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

      {/* 7 — DİĞER HİZMETLER */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Diğer hizmetler" title="Aynı Ekiple Devam Edebileceğiniz Alanlar" />
          <RevealGroup as="ul" className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
            {others.map((item) => (
              <RevealItem as="li" key={item.slug} className="min-w-0">
                <Link
                  href={`/${item.slug}`}
                  className={`lift group flex h-full flex-col ${CARD} transition-colors hover:border-brand-500/40`}
                >
                  <span className="h-fit w-fit rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                    <ServiceIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-white">{item.card.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.card.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                    Ayrıntılar
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 8 — KAPANIŞ + FORM */}
      <section id="teklif" className="scroll-mt-24 border-t border-white/5 bg-slate-950/60 px-5 py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="min-w-0">
            <SectionHead label="Başlangıç" title={service.ctaHeading}>
              {service.ctaText}
            </SectionHead>
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
              source="hizmet"
              heading={service.ctaHeading}
              description={service.ctaText}
              submitLabel="Teklif İstiyorum"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default ServicePageBody;
