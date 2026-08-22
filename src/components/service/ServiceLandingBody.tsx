import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown, Phone } from 'lucide-react';
import { SITE, CONTACT } from '@/lib/site';
import { INACTIVE_SLUGS } from '@/content/services';
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
 * metinler duruyor. Aktif hizmetlerde marka logosu ana sayfaya bağlanır ve
 * ziyaretçinin "burası kim" sorusuna cevap veren tek çıkış olur; pasif
 * hizmetlerde bağlanmaz (aşağıdaki `standalone` açıklamasına bak).
 */

const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
];

const SECTION_LABEL = 'block font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]';

export function ServiceLandingBody({
  service,
  theme = 'dark',
}: {
  service: ServiceContent;
  theme?: 'dark' | 'light';
}) {
  const { landing } = service;
  const isLight = theme === 'light';

  /**
   * Pasife alınmış bir hizmetin reklam sayfasında logo ana sayfaya BAĞLANMIYOR.
   *
   * Neden: ana sayfa artık yalnızca güvenlik ve uyum anlatıyor. Web tasarım
   * reklamından gelen ziyaretçi logoya tıklayıp güvenlik sitesine düşerse
   * "yanlış yere geldim" diye çıkar. Her açılış sayfası kendi başına, tek
   * hizmetlik bir teklif gibi durmalı — reklamları bağımsız ölçebilmenin şartı
   * bu. Hizmet yeniden aktif edilirse bağlantı kendiliğinden geri geliyor.
   */
  const standalone = INACTIVE_SLUGS.has(service.slug);
  const Brand = ({ withLink }: { withLink: boolean }) =>
    withLink ? (
      <Link href="/" aria-label={`${SITE.name} ana sayfa`} className="min-w-0">
        <Logo size="sm" />
      </Link>
    ) : (
      <span className="min-w-0">
        <Logo size="sm" />
      </span>
    );

  return (
    <>
      {/* Tema sınıfı tek bir sarmalayıcıya konuyor: anlamsal jetonlar (--ink,
          --panel, --line...) burada tanımlanıp altındaki tüm bölümlere miras
          kalıyor. Böylece her bölüme ayrı ayrı renk sınıfı yazmak gerekmiyor
          ve aynı gövde hem koyu hem açık temada render edilebiliyor. */}
      <div className={isLight ? 'theme-light' : 'theme-dark'}>
      {/* Minimal başlık — navigasyon yok, sadece marka */}
      <header className="border-b border-[var(--line-soft)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Brand withLink={!standalone} />
          <span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-[var(--ink-3)]">
            <ServiceIcon name={service.icon} className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
            <span className="truncate">
              {service.navLabel} · {CONTACT.city}
            </span>
          </span>
        </div>
      </header>

      <main className="min-w-0">
        {/* 1 — HERO + FORM */}
        <section className="relative overflow-hidden px-5 py-12 sm:py-16">
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 sheet-grid sheet-fade ${isLight ? 'opacity-40' : 'opacity-70'}`} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[380px]">
            <div className={`hero-glow absolute inset-0 ${isLight ? 'opacity-30' : 'opacity-60'}`} />
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <div className="min-w-0">
              <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[var(--accent-soft-border)] bg-[var(--accent-soft-bg)] px-3 py-1.5 text-[11px] font-semibold text-[var(--accent)]">
                <ServiceIcon name={service.icon} className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{service.navLabel}</span>
              </span>
              <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
                {landing.h1}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--ink-2)] sm:text-base">
                {landing.promise}
              </p>

              <ul className="mt-6 space-y-2.5">
                {landing.benefits.map((benefit) => (
                  <li key={benefit.title} className="flex min-w-0 items-start gap-2.5 text-sm text-[var(--ink-2)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span className="min-w-0 leading-relaxed">
                      <strong className="font-semibold text-[var(--ink)]">{benefit.title}</strong>
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-6 py-3.5 text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)]"
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
        <section className="border-t border-[var(--line-soft)] bg-[var(--panel-2)] px-5 py-14">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className={SECTION_LABEL}>{'// Güven'}</span>
              <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                {landing.trustHeading}
              </h2>
            </Reveal>
            <RevealGroup as="ul" className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
              {landing.trust.map((item) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  className="lift min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5"
                >
                  <h3 className="text-sm font-bold text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-3)]">{item.desc}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* 3 — SSS */}
        <section className="border-t border-[var(--line-soft)] px-5 py-14">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className={SECTION_LABEL}>{'// Sıkça sorulanlar'}</span>
              <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                Teklif İstemeden Önce Sorulanlar
              </h2>
            </Reveal>
            <RevealGroup className="mt-8 space-y-2.5">
              {landing.faq.map(({ q, a }) => (
                <RevealItem key={q}>
                  <details className="group rounded-2xl border border-[var(--line)] bg-[var(--panel)] open:border-[var(--accent-soft-border)]">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0">{q}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-[var(--ink-4)] transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-xs leading-relaxed text-[var(--ink-3)]">{a}</p>
                  </details>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* 4 — KAPANIŞ + FORM */}
        <section id="teklif-formu" className="scroll-mt-6 border-t border-[var(--line-soft)] bg-[var(--panel-2)] px-5 py-16">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="min-w-0">
              <Reveal>
                <span className={SECTION_LABEL}>{'// Başlangıç'}</span>
                <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                  {landing.closeHeading}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-3)]">{landing.closeText}</p>
              </Reveal>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-5 py-3.5 text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)]"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">{CONTACT.phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-5 py-3.5 text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)]"
                >
                  <span className="min-w-0 break-all">{CONTACT.email}</span>
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[var(--ink-4)]">{CONTACT.workingHours}</p>
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
      <footer className="border-t border-[var(--line-soft)] px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <Brand withLink={!standalone} />
          <nav aria-label="Yasal bağlantılar">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--ink-4)]">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-10 items-center transition-colors hover:text-[var(--accent)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="max-w-2xl text-[11px] leading-relaxed text-[var(--ink-4)]">
            Form aracılığıyla ilettiğiniz kişisel veriler, yalnızca talebinize dönüş yapmak amacıyla
            işlenir ve üçüncü taraflarla paylaşılmaz.
          </p>
          <p className="text-xs text-[var(--ink-4)]">
            &copy; {new Date().getFullYear()} {SITE.name} · {CONTACT.city}
          </p>
        </div>
      </footer>

      {/* Mobilde sabit CTA — sayfa uzun, forma dönüş her yerden mümkün olsun */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--panel-2)] p-3 backdrop-blur-sm md:hidden">
        <a
          href="#teklif"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white"
        >
          {landing.submitLabel}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
      </div>
    </>
  );
}

export default ServiceLandingBody;
