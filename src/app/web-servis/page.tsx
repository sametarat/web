import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE, CONTACT } from '@/lib/site';
import { SERVICE_BY_SLUG } from '@/content/services';
import { Logo } from '@/components/Logo';
import { ServiceForm } from '@/components/ServiceForm';
import { MetaGoogleAdsCard } from '@/components/MetaGoogleAdsCard';
import { LiveDemoShowcase, BenchmarkSimulator } from '@/components/demo/DemoShowcase';
import { WebStatementHero } from '@/components/web-servis/WebStatementHero';

/**
 * Gizli web & pazarlama hub'ı — /web-servis
 *
 * Ana sayfa yalnızca güvenlik ve uyum anlatıyor. Web tasarım, SEO ve reklam
 * yönetimi tarafı buraya taşındı: menüde, altbilgide ve site haritasında yok,
 * yalnızca reklam trafiğiyle ulaşılıyor. Logo bilinçli olarak "/" adresine
 * bağlanmıyor — web reklamından gelen ziyaretçi güvenlik ana sayfasına düşmesin.
 *
 * GÖRSEL DİL: Bu sayfa kâğıt. Güvenlik tarafı koyu olduğu için iki iş bakışta
 * ayrışıyor; ayrıca "iç açıcı olsun" geri bildirimi büyüme tarafı içindi.
 * Dil teknik çizim föyünden geliyor (bkz. globals.css `.draft`): kot çizgileri,
 * kılavuz kâğıt ve antet bloğu. Demolar ve hız simülatörü koyu bileşenler
 * olduğu için tam genişlikte bir "perde" bandına alındı — kâğıt, perde, kâğıt.
 */

export const metadata: Metadata = {
  // `absolute`: kök şablon başlığa "| Kodara" ekliyor ve marka iki kez
  // görünüyordu. Bu sayfa kendi başlığını sonuna kadar kendi yazıyor.
  title: { absolute: 'Web Sitesi, SEO ve Reklam Yönetimi — Kodara' },
  description:
    'Kurumsal web sitesi ve özel yazılım geliştirme, teknik SEO ve Google & Meta reklam yönetimi. Kapsam ve fiyat yazılı olarak çıkarılır.',
  alternates: { canonical: '/web-servis' },
  // Yalnızca reklam trafiği için: bilinçli olarak dizine kapalı ve site
  // haritasının dışında tutuluyor. Bağlantılar izlenebilsin diye follow açık.
  robots: { index: false, follow: true },
};

const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
];

/**
 * Üç hizmetin dönüşüm hedefi kurumsal sayfa değil, reklam açılış sayfası.
 * `tag` karttaki kısa koddur; süslemek için değil, üç hizmeti tek bakışta
 * ayırt ettirmek için var.
 */
const HUB_SERVICES = [
  { slug: 'web-tasarim', href: '/web-tasarim/teklif', tag: 'WEB' },
  { slug: 'seo', href: '/seo/teklif', tag: 'SEO' },
  { slug: 'reklam-yonetimi', href: '/reklam-yonetimi/teklif', tag: 'ADS' },
] as const;

/** Antet bloğu — teknik çizimin sağ altındaki künye. İçeriği gerçek. */
const TITLE_BLOCK = [
  { k: 'Kapsam', v: 'Web · SEO · Reklam' },
  { k: 'Teslim', v: 'Kaynak kod ve hesaplar sizin' },
  { k: 'Fiyat', v: 'Kapsam sonrası sabit' },
  { k: 'Dönüş', v: '1 iş günü' },
];

const MONO = 'font-mono uppercase tracking-[0.24em]';

export default function WebServisPage() {
  return (
    <div className="draft flex min-h-screen flex-col font-sans">
      {/* Başlık — navigasyon yok, logo ana sayfaya bağlanmıyor */}
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <span className="min-w-0 text-[var(--ink)]">
            <Logo size="sm" />
          </span>
          <span className={`${MONO} truncate text-[10px] text-[var(--faint)]`}>
            Web &amp; Pazarlama · {CONTACT.city}
          </span>
        </div>
      </header>

      <main className="min-w-0 flex-1">
        {/* ---------- HERO: tek sütun, editoryal ---------- */}
        <section className="relative overflow-hidden border-b border-[var(--rule)]">
          <div
            aria-hidden="true"
            className="draft-paper pointer-events-none absolute inset-0 opacity-70"
          />
          <div className="relative px-5 py-16 sm:py-24">
            <WebStatementHero />
          </div>
        </section>

        {/* ---------- ANTET BLOĞU: çizimin künyesi ---------- */}
        <section className="border-b border-[var(--rule)] bg-[var(--card)]">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-[var(--rule-soft)] px-5 sm:grid-cols-4 sm:divide-x">
            {TITLE_BLOCK.map(({ k, v }) => (
              <div key={k} className="min-w-0 px-0 py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <dt className={`${MONO} text-[9px] text-[var(--faint)]`}>{k}</dt>
                <dd className="mt-2 text-[13px] font-semibold leading-snug text-[var(--ink)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- HİZMETLER ---------- */}
        <section className="px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-baseline gap-4">
              <h2 className={`${MONO} shrink-0 text-[10px] text-[var(--faint)]`}>Hizmetler</h2>
              <span aria-hidden="true" className="draft-dim min-w-6 flex-1" />
            </div>

            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--rule-soft)] sm:grid-cols-3">
              {HUB_SERVICES.map(({ slug, href, tag }) => {
                const service = SERVICE_BY_SLUG[slug];
                if (!service) return null;
                return (
                  <Link
                    key={slug}
                    href={href}
                    className="group flex min-w-0 flex-col bg-[var(--card)] p-6 transition-colors hover:bg-[#fbfcfe] sm:p-7"
                  >
                    <span className={`${MONO} text-[10px] text-[var(--mark)]`}>{tag}</span>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-[var(--ink)]">
                      {service.card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--graphite)]">
                      {service.card.desc}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--blue)]">
                      Teklif al
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- PERDE: koyu bileşenler burada yaşıyor ----------
            LiveDemoShowcase, BenchmarkSimulator ve MetaGoogleAdsCard koyu
            zemine göre yazılmış. Kâğıda zorlamak yerine bilinçli bir perde
            bandına alındılar; geçiş kaza değil, karar gibi okunuyor. */}
        <div className="bg-surface text-slate-100">
          <div className="mx-auto max-w-[1320px] px-5 py-16 sm:py-20">
            <div className="flex items-baseline gap-4">
              <h2 className={`${MONO} shrink-0 text-[10px] text-slate-500`}>Canlı örnekler</h2>
              <span aria-hidden="true" className="rule-tape min-w-6 flex-1 text-brand-400" />
            </div>
            <p className="mt-5 max-w-2xl font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Anlatmak yerine gösteriyoruz
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Bir sektör seçin, arayüzü buradan deneyin. Hepsi çalışan örnekler.
            </p>

            <div className="mt-10">
              <LiveDemoShowcase />
            </div>

            <div className="mt-20 flex items-baseline gap-4">
              <h2 className={`${MONO} shrink-0 text-[10px] text-slate-500`}>Hız</h2>
              <span aria-hidden="true" className="rule-tape min-w-6 flex-1 text-brand-400" />
            </div>
            <p className="mt-5 max-w-2xl font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Neden milisaniyeler önemlidir?
            </p>
            <div className="mt-8">
              <BenchmarkSimulator />
            </div>

            <div className="mt-20">
              <MetaGoogleAdsCard />
            </div>
          </div>
        </div>

        {/* ---------- TEKLİF ---------- */}
        {/* MetaGoogleAdsCard'ın CTA'sı #teklif-al adresine gidiyor */}
        <span id="teklif-al" aria-hidden="true" />
        <section
          id="teklif"
          className="theme-light relative scroll-mt-6 overflow-hidden border-t border-[var(--rule)] px-5 py-16 sm:py-20"
        >
          <div
            aria-hidden="true"
            className="draft-paper pointer-events-none absolute inset-0 opacity-60"
          />
          <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <div className="min-w-0">
              <div className="flex items-baseline gap-4">
                <span className={`${MONO} shrink-0 text-[10px] text-[var(--faint)]`}>Teklif</span>
                <span aria-hidden="true" className="draft-dim min-w-6 flex-1" />
              </div>
              <h2 className="mt-5 text-balance font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
                Kapsamı birlikte çıkaralım
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--graphite)]">
                Formu bırakın; ihtiyacınıza uygun kapsamı, süreyi ve fiyatı yazılı olarak
                çıkaralım. Görüşme bağlayıcı değil.
              </p>

              <dl className="mt-8 space-y-4 border-t border-[var(--rule-soft)] pt-6">
                <div>
                  <dt className={`${MONO} text-[9px] text-[var(--faint)]`}>E-posta</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="break-all text-sm font-semibold text-[var(--ink)] hover:text-[var(--blue)]"
                    >
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={`${MONO} text-[9px] text-[var(--faint)]`}>Telefon</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${CONTACT.phoneE164}`}
                      className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--blue)]"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={`${MONO} text-[9px] text-[var(--faint)]`}>Çalışma saatleri</dt>
                  <dd className="mt-1 text-sm text-[var(--graphite)]">{CONTACT.workingHours}</dd>
                </div>
              </dl>
            </div>

            <div className="min-w-0">
              <ServiceForm
                service={'Web & Pazarlama'}
                source="hizmet-teklif"
                heading="Teklif İsteyin"
                description="Web sitesi, SEO veya reklam yönetimi — hangisi olduğunu mesaj alanına yazmanız yeterli."
                submitLabel="Teklif İstiyorum"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Altbilgi — yalnızca yasal bağlantılar */}
      <footer className="border-t border-[var(--rule)] bg-[var(--card)] px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <nav aria-label="Yasal bağlantılar">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--faint)]">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-10 items-center transition-colors hover:text-[var(--blue)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className={`${MONO} text-[10px] text-[var(--faint)]`}>
            &copy; {new Date().getFullYear()} {SITE.name} · {CONTACT.city}
          </p>
        </div>
      </footer>
    </div>
  );
}
