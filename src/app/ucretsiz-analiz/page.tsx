import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Gauge,
  Search,
  Smartphone,
  TrendingDown,
  ShoppingCart,
  Clock,
  FileText,
  Phone,
  Rocket,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SITE, CONTACT, whatsAppLink } from '@/lib/site';
import { Logo } from '@/components/Logo';
import { AnalysisForm } from '@/components/AnalysisForm';

/**
 * Reklam açılış sayfası (Meta / Google Ads trafiği için).
 *
 * Tasarım kararları:
 * - Site navigasyonu YOK. Açılış sayfasının işi ziyaretçiyi tek bir eyleme
 *   götürmek; menü koymak kaçış yolu açmak demektir.
 * - Tek dönüşüm noktası: ücretsiz site analizi talebi.
 * - `noindex`: reklam sayfası, ana sayfayla arama sonuçlarında yarışmamalı.
 */
export const metadata: Metadata = {
  title: 'Ücretsiz Web Sitesi Analizi',
  description:
    'Mevcut sitenizi hız, mobil uyum ve Google görünürlüğü açısından ücretsiz analiz edelim. 1 iş günü içinde raporunuzu paylaşalım.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/ucretsiz-analiz' },
};

const PAINS = [
  {
    icon: TrendingDown,
    title: 'Siteniz yavaş açılıyor',
    desc: 'Ziyaretçilerin yarısı 3 saniyeden uzun süren sayfayı terk ediyor. Reklama ödediğiniz para, açılmayı bekleyen bir ekranda eriyor.',
  },
  {
    icon: Search,
    title: 'Google\'da bulunamıyorsunuz',
    desc: 'Teknik SEO altyapısı olmayan siteler, içerik ne kadar iyi olursa olsun rakiplerin arkasında kalıyor.',
  },
  {
    icon: Smartphone,
    title: 'Telefonda bozuk görünüyor',
    desc: 'Trafiğin büyük kısmı mobilden geliyor. Mobilde kayan bir tasarım, doğrudan kaybedilmiş müşteri demek.',
  },
];

const DELIVERABLES = [
  {
    icon: Gauge,
    title: 'Hız ve Core Web Vitals raporu',
    desc: 'Sitenizin gerçek yükleme süresi, hangi dosyanın yavaşlattığı ve ne kadar hızlanabileceği.',
  },
  {
    icon: Search,
    title: 'Teknik SEO denetimi',
    desc: 'Google\'ın sitenizi nasıl gördüğü; eksik başlıklar, indekslenmeyen sayfalar, yapısal veri boşlukları.',
  },
  {
    icon: Smartphone,
    title: 'Mobil uyum kontrolü',
    desc: 'Telefonda bozulan bölümlerin ekran görüntüleriyle listesi.',
  },
  {
    icon: ShoppingCart,
    title: 'Dönüşüm önerileri',
    desc: 'Ziyaretçiyi müşteriye çeviren yolda tıkanan noktalar ve somut düzeltme önerileri.',
  },
];

const STEPS = [
  { icon: FileText, title: 'Formu doldurun', desc: 'Üç alan, 30 saniye.' },
  { icon: Gauge, title: 'Analizi hazırlayalım', desc: 'Sitenizi elle inceliyoruz, otomatik rapor değil.' },
  { icon: Phone, title: '1 iş günü içinde arayalım', desc: 'Bulguları anlatalım, sorularınızı yanıtlayalım.' },
  { icon: Rocket, title: 'Kararı siz verin', desc: 'İsterseniz birlikte çalışırız, istemezseniz rapor sizde kalır.' },
];

const SECTORS = [
  { label: 'Restoran & Kafe', path: '/demo/gurme-restoran' },
  { label: 'E-Ticaret', path: '/demo/moda-eticaret' },
  { label: 'Otel & Konaklama', path: '/demo/otel-rezervasyon' },
  { label: 'Klinik & Sağlık', path: '/demo/klinik-saglik' },
  { label: 'Emlak', path: '/demo/emlak-portfoy' },
  { label: 'Spor Salonu', path: '/demo/spor-salonu' },
];

const OBJECTIONS = [
  {
    q: 'Gerçekten ücretsiz mi, sonra fatura çıkar mı?',
    a: 'Analiz tamamen ücretsiz ve hiçbir şey satın almak zorunda değilsiniz. Raporu size gönderiyoruz, birlikte çalışmasak bile sizde kalıyor.',
  },
  {
    q: 'Sürekli arayıp rahatsız eder misiniz?',
    a: 'Bir kez arayıp bulguları anlatıyoruz. İlgilenmiyorsanız orada bitiyor; listeye eklenip aylarca aranmıyorsunuz.',
  },
  {
    q: 'Sitem yok, yine de olur mu?',
    a: 'Olur. Bu durumda rakiplerinizin sitelerini inceleyip sizin için nasıl bir yapı gerektiğini ve tahmini süreyi anlatıyoruz.',
  },
];

export default function AnalysisLandingPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      {/* Minimal başlık — navigasyon yok, sadece marka ve tek CTA */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo size="sm" />
          <a
            href={`tel:+${CONTACT.phoneE164}`}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{CONTACT.phoneDisplay}</span>
            <span className="sm:hidden">Ara</span>
          </a>
        </div>
      </header>

      {/* HERO — form ilk ekranda görünür */}
      <section className="relative overflow-hidden px-5 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[420px]"
        >
          <div className="hero-glow absolute inset-0" />
          <div className="aurora-blob absolute left-1/2 top-0 h-72 w-72 -translate-x-[120%] rounded-full bg-brand-600/25 blur-[110px]" />
          <div className="aurora-blob aurora-blob-slow absolute left-1/2 top-8 h-80 w-80 translate-x-[20%] rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Ücretsiz · Taahhüt yok
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Siteniz Neden Müşteri
              <br className="hidden sm:block" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-indigo-300">
                Kaybettiriyor?
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Mevcut sitenizi hız, mobil uyum ve Google görünürlüğü açısından inceleyip
              somut bir rapor çıkarıyoruz. Ücretsiz, tek seferlik ve satış baskısı olmadan.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                'Sitenizin gerçek hızı ve neyin yavaşlattığı',
                'Google\'da neden geride kaldığınız',
                'Ziyaretçiyi kaçıran mobil sorunlar',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/5 pt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />1 iş günü içinde dönüş
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />6 sektörde canlı örnek
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />Saniyenin altında açılan siteler
              </span>
            </div>
          </div>

          {/* Form — masaüstünde sağda, mobilde metnin hemen altında */}
          <div id="form" className="scroll-mt-6 lg:sticky lg:top-6">
            <AnalysisForm />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Reklama para harcıyorsunuz ama satış gelmiyorsa
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-400">
            Sorun genelde reklamda değil, reklamın gönderdiği sayfada olur.
          </p>

          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
            {PAINS.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <span className="inline-flex rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TEKLİFİN İÇERİĞİ — "ücretsiz" soyut kalmasın */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <span className="block text-center font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400">
            // Analizde ne var
          </span>
          <h2 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Elinize Geçecek Somut Rapor
          </h2>

          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {DELIVERABLES.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <span className="h-fit shrink-0 rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* KANIT — demolar */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Nasıl Siteler Yapıyoruz?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
            Anlatmak yerine gösteriyoruz. Altı sektör için hazırladığımız canlı örnekleri
            açıp kendiniz deneyin.
          </p>

          <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
            {SECTORS.map((sector) => (
              <li key={sector.path}>
                <Link
                  href={sector.path}
                  className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:border-brand-500/40 hover:text-white"
                >
                  {sector.label}
                  <ArrowRight
                    className="h-3 w-3 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-brand-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Formu Doldurduktan Sonra Ne Oluyor?
          </h2>

          <ol className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, desc }, index) => (
              <li
                key={title}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <span className="absolute right-4 top-4 font-mono text-2xl font-black text-slate-800">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="inline-flex rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* İTİRAZLAR */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Aklınıza Takılanlar
          </h2>

          <div className="mt-7 space-y-2.5">
            {OBJECTIONS.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 open:border-brand-500/30"
              >
                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {q}
                </summary>
                <p className="px-5 pb-5 text-xs leading-relaxed text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SON CTA */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Sitenizin Durumunu Öğrenin
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Ücretsiz, taahhütsüz ve 1 iş günü içinde. Kaybedecek bir şeyiniz yok.
          </p>

          <div className="mt-7 text-left">
            <AnalysisForm compact />
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Formu doldurmak istemiyorsanız{' '}
            <a
              href={whatsAppLink(`Merhaba ${SITE.name}, sitem için ücretsiz analiz istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 underline-offset-4 hover:underline"
            >
              WhatsApp'tan yazın
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="border-t border-white/5 px-5 py-8 text-center text-xs text-slate-500">
        <Logo size="sm" />
        <p className="mt-2">
          &copy; {new Date().getFullYear()} {SITE.name} · {CONTACT.city}
        </p>
      </footer>

      {/* Mobilde sabit CTA — kullanıcı nerede olursa olsun forma dönebilsin */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 p-3 backdrop-blur-sm md:hidden">
        <a
          href="#form"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white"
        >
          Ücretsiz Analizimi İstiyorum
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}
