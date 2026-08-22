'use client';

import Link from 'next/link';
import CyberChatbot from '@/components/CyberChatbot';
import { LeadCaptureSection } from '@/components/LeadCaptureSection';
import { SiteHeader } from '@/components/SiteHeader';
import { HeroSlider } from '@/components/HeroSlider';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { ACTIVE_SERVICE_GROUPS, cardsByGroup } from '@/content/services';
import { ServiceIcon } from '@/components/service/ServiceIcon';
import { SectionHeading } from '@/components/SectionHeading';
import { ScrollProgress } from '@/components/ScrollProgress';
import { TrustLinks } from '@/components/TrustLinks';
import { SiteFooter } from '@/components/SiteFooter';
import { CONTACT } from '@/lib/site';
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react';

/**
 * Sayfa kabuğu: tek bir ölçü. Bölümler bu genişliği ya kullanıyor ya da
 * bilinçli olarak kırıyor (tam genişlik bant, sağa kaçık blok, dar sütun).
 * Ritmi kuran şey bu genişlik değişimi.
 */
const SHELL = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12';


/** İletişim bloğundaki satırlar — hepsi lib/site.ts'ten geliyor. */
const CONTACT_ROWS = [
  { icon: Mail, label: 'E-posta', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Clock, label: 'Çalışma saatleri', value: CONTACT.workingHours },
  { icon: MapPin, label: 'Konum', value: CONTACT.city },
];

// --- MAIN PAGE COMPONENT ---
export default function Home() {

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-surface font-sans text-slate-100 selection:bg-brand-500 selection:text-white">
      <ScrollProgress />
      <SiteHeader />

      <CyberChatbot />

      {/* Yatay boşluk bölümlerin kendisinde: tam genişlik bantlar ancak
          main padding'siz olduğunda gerçekten kenara dayanabiliyor. */}
      <main className="relative z-10 flex-1 pb-16 sm:pb-20">
        <HeroSlider />

        {/* 01 — Hizmetler: yalnızca aktif gruplar listeleniyor. Büyüme tarafı
            pasife alındıktan sonra boş bir grup başlığı kalmasın diye ızgara
            ACTIVE_SERVICE_GROUPS üzerinden dönüyor. */}
        <section id="hizmetler" className={`${SHELL} scroll-mt-28 py-14 sm:py-20 lg:py-24`}>
          <SectionHeading
            index="01"
            eyebrow="Hizmetler"
            size="lg"
            title="Güvenlik ve uyum, tek ekip"
            desc="Sistemleri test ediyor, açıkları raporluyor ve denetim ile mevzuat tarafındaki hazırlığı aynı ekiple yürütüyoruz. Aynı bilgiyi iki kez toplamıyoruz."
          />

          <div className="mt-8 space-y-10 sm:mt-12 sm:space-y-14">
            {ACTIVE_SERVICE_GROUPS.map((group) => {
              const cards = cardsByGroup(group.id);
              return (
                <div key={group.id} className="min-w-0">
                  <Reveal>
                    <div className="flex min-w-0 flex-col gap-2 border-l-2 border-brand-500/50 pl-4 sm:pl-5">
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                        {group.label}
                        <span className="ml-2.5 align-middle font-mono text-[11px] font-semibold tracking-wider text-slate-500">
                          {cards.length} hizmet
                        </span>
                      </h3>
                      <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                        {group.desc}
                      </p>
                    </div>
                  </Reveal>

                  <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((srv) => (
                      <RevealItem key={srv.href} className="min-w-0">
                        <Link
                          href={srv.href}
                          className="lift group flex h-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-brand-500/40 hover:bg-slate-900/70 sm:p-6"
                        >
                          <span className="w-fit rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-brand-400">
                            <ServiceIcon name={srv.icon} className="h-5 w-5" />
                          </span>

                          <h4 className="mt-4 font-display text-base font-bold tracking-tight text-white sm:text-lg">
                            {srv.title}
                          </h4>
                          <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-400">
                            {srv.desc}
                          </p>

                          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                            Detaylı incele
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </span>
                        </Link>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              );
            })}
          </div>

          <Reveal delay={0.05}>
            <p className="mt-8 text-xs leading-relaxed text-slate-500">
              Hangi başlığın size uygun olduğundan emin değilseniz{' '}
              <Link href="/iletisim" className="font-semibold text-brand-300 underline-offset-4 hover:underline">
                bize yazın
              </Link>{' '}
              — kısa bir görüşmede birlikte belirleyelim. Bayilik ve çözüm ortaklığı için{' '}
              <Link href="/is-ortakligi" className="font-semibold text-brand-300 underline-offset-4 hover:underline">
                iş ortaklığı sayfasına
              </Link>{' '}
              bakabilirsiniz.
            </p>
          </Reveal>
        </section>

        {/* Güven köprüleri — başlıksız, sessiz bir ara. Solda sadece bir etiket
            sütunu var; bant sonrası göz dinlensin diye burada iri tipografi yok. */}
        <div className={`${SHELL} py-14 sm:py-20`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Şeffaflık
              </p>
              <span aria-hidden="true" className="rule-tape mt-4 hidden w-full text-brand-400 lg:block" />
            </div>
            <div className="min-w-0 lg:col-span-9">
              <TrustLinks />
            </div>
          </div>
        </div>

        {/* 02 — Teklif: solda kim olduğumuz, sağda form */}
        <section className={`${SHELL} border-t border-slate-800/70 pt-14 sm:pt-20`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <Reveal>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] font-semibold tabular-nums text-brand-400"
                  >
                    02
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-[11px]">
                    Teklif
                  </span>
                  <span aria-hidden="true" className="rule-tape ml-1 min-w-6 flex-1 text-brand-400" />
                </div>

                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  Formu doldurun; ihtiyacınıza uygun kapsamı, süreyi ve fiyatı yazılı olarak
                  çıkaralım. Yazışmak istemiyorsanız doğrudan e-posta da yazabilirsiniz.
                </p>

                <dl className="mt-8 space-y-4">
                  {CONTACT_ROWS.map(({ icon: RowIcon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-brand-400">
                        <RowIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {label}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm text-slate-200">
                          {href ? (
                            <a
                              href={href}
                              className="transition-colors hover:text-brand-300 hover:underline"
                            >
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/iletisim"
                  className="group mt-8 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand-400 transition-colors hover:text-brand-300"
                >
                  İletişim sayfası
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            </div>

            <div className="min-w-0 lg:col-span-8">
              <Reveal delay={0.05}>
                <LeadCaptureSection />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
