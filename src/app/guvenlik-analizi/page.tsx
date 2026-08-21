import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  DatabaseBackup,
  FileText,
  Layers,
  Mail,
  MessageCircle,
  Network,
  Phone,
  Presentation,
  Scale,
  ScanSearch,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { SITE, SECURITY_CONTACT, securityWhatsAppLink } from '@/lib/site';
import { Logo } from '@/components/Logo';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { SecurityAnalysisForm } from '@/components/SecurityAnalysisForm';

/**
 * Sabit bedelli altyapı güvenlik analizi açılış sayfası.
 *
 * Tasarım kararları:
 * - Site navigasyonu YOK; sayfanın işi tek bir eyleme götürmek.
 * - Alıcı son müşteri (işletme sahibi / tek kişilik BT sorumlusu). Bu yüzden
 *   kardeş /pentest sayfasının aksine kısa, teknik jargonu az ve fiyatı açık.
 * - Tek yukarı satış: sayfanın sonunda /pentest'e giden tek bir satır.
 */
export const metadata: Metadata = {
  title: 'Altyapı Güvenlik Analizi — Sabit 25.000 TL + KDV',
  description:
    'Donanım ya da yazılıma yatırım yapmadan önce altyapınızı ön denetimden geçiriyoruz: sızma kontrolü, ağ izolasyonu ve yedekleme incelemesi. Sabit bedelli analiz, yönetim seviyesinde risk raporu.',
  alternates: { canonical: '/guvenlik-analizi' },
  openGraph: {
    title: 'Altyapı Güvenlik Analizi — Sabit 25.000 TL + KDV',
    description:
      'Önce ön denetim, sonra yatırım. Sızma kontrolü, ağ izolasyonu ve yedekleme incelemesi; sonunda yönetimin karar verebileceği bir risk raporu.',
    url: '/guvenlik-analizi',
    type: 'website',
  },
};

const PRICE = '25.000 TL';

const WHY = [
  {
    icon: AlertTriangle,
    title: 'Saldırı riskleri',
    desc: 'Fidye yazılımı ve veri sızıntısı, artık büyük kurumlara özel bir sorun değil. Zayıf bir nokta yeter.',
  },
  {
    icon: Scale,
    title: 'Yasal korunma',
    desc: 'KVKK ve denetim süreçleri, alınan teknik tedbirlerin belgelenmesini bekliyor. Rapor bu belgenin temeli olur.',
  },
  {
    icon: Layers,
    title: 'Modern altyapı',
    desc: 'Kör noktalar görünür hâle gelince sistem yalnızca güvenli değil, daha stabil ve ölçeklenebilir hâle gelir.',
  },
];

const SCOPE = [
  {
    icon: ScanSearch,
    label: '01',
    title: 'Sızma kontrolü',
    desc: 'Zayıf parolalar, dışarıya açık portlar ve ağ içindeki zafiyet noktaları tespit edilir.',
    points: ['Zayıf ve varsayılan parolalar', 'Açık portlar ve gereksiz servisler', 'Ağ içi zafiyet noktaları'],
  },
  {
    icon: Network,
    label: '02',
    title: 'Ağ izolasyonu',
    desc: 'Kamera (CCTV), kullanıcı ve sunucu ağlarının birbirinden gerçekten ayrıştırılmış olup olmadığı incelenir.',
    points: ['Kamera ağı ayrımı', 'Kullanıcı ağı ayrımı', 'Sunucu ağı ayrımı'],
  },
  {
    icon: DatabaseBackup,
    label: '03',
    title: 'Yedekleme',
    desc: 'Verilerin güvenli yedeklendiği kontrol edilir; felaket senaryosunda geri yükleme test edilerek doğrulanır.',
    points: ['Yedeklerin kapsamı ve sıklığı', 'Yedeklerin saklanma biçimi', 'Geri yükleme senaryosu testi'],
  },
];

const REPORT = [
  'Tespit edilen bulguların sade bir dille açıklaması',
  'Her bulgu için risk seviyesi ve olası iş etkisi',
  'Önceliklendirilmiş aksiyon listesi — önce hangi kalem',
  'Yönetim özeti: karar verirken bakılacak tek sayfa',
];

const STEPS = [
  {
    icon: MessageCircle,
    title: 'Ön görüşme',
    time: 'Yaklaşık 30 dakika',
    desc: 'Kaç lokasyon, kaç kullanıcı, hangi sistemler var — kapsamı birlikte netleştiriyoruz.',
  },
  {
    icon: Search,
    title: 'Yerinde veya uzaktan inceleme',
    time: '1–2 iş günü',
    desc: 'Üç başlık sırayla incelenir; çalışan sistemleri kesintiye uğratmayacak biçimde ilerlenir.',
  },
  {
    icon: FileText,
    title: 'Raporlama',
    time: 'Birkaç iş günü',
    desc: 'Bulgular risk seviyeleriyle birlikte yazılır ve yönetim seviyesinde bir dile çevrilir.',
  },
  {
    icon: Presentation,
    title: 'Sunum ve yol haritası',
    time: 'Tek oturum',
    desc: 'Rapor birlikte okunur; hangi yatırımın önce yapılması gerektiği konuşulur.',
  },
];

const FAQ = [
  {
    q: 'İnceleme sırasında sistemimiz etkilenir mi?',
    a: 'Amaç sistemi zorlamak değil, durumunu görmek. Çalışma saatleri ve incelemenin biçimi baştan birlikte kararlaştırılır; kesinti riski taşıyan hiçbir işlem sizin yazılı onayınız olmadan yapılmaz.',
  },
  {
    q: 'Ne kadar sürer?',
    a: 'Ön görüşmeden sonra saha incelemesi tipik bir işletmede 1–2 iş günü sürer. Rapor ve sunum bunu takip eder. Kesin takvim, kapsam netleştikten sonra baştan sabitlenir.',
  },
  {
    q: 'Rapor kimde kalıyor?',
    a: 'Rapor size aittir. Denetimlerde, sigorta süreçlerinde veya tedarikçi görüşmelerinde dilediğiniz gibi kullanabilirsiniz. Bulgular üçüncü taraflarla paylaşılmaz.',
  },
  {
    q: 'Bu bir sızma testi mi?',
    a: 'Hayır. Bu bir altyapı güvenlik analizidir: ağ, erişim ve yedekleme tarafındaki mevcut durumu ortaya koyar. Web uygulaması ve API sızma testi ayrı bir hizmettir.',
  },
];

const WHATSAPP = securityWhatsAppLink(
  'Merhaba, altyapı güvenlik analizi hakkında bilgi almak istiyorum.',
);

const CONTACT_LINKS = [
  {
    icon: Phone,
    href: `tel:+${SECURITY_CONTACT.phoneE164}`,
    label: SECURITY_CONTACT.phoneDisplay,
    external: false,
  },
  {
    icon: Mail,
    href: `mailto:${SECURITY_CONTACT.email}`,
    label: SECURITY_CONTACT.email,
    external: false,
  },
  { icon: MessageCircle, href: WHATSAPP, label: 'WhatsApp', external: true },
] as const;

const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
] as const;

const SECTION_LABEL =
  'block font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400';

export default function SecurityAnalysisPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      {/* Minimal başlık — navigasyon yok */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label={`${SITE.name} ana sayfa`} className="min-w-0">
            <Logo size="sm" />
          </Link>
          <a
            href={`tel:+${SECURITY_CONTACT.phoneE164}`}
            className="flex min-h-10 min-w-0 items-center gap-2 text-xs font-semibold text-slate-300 transition-colors hover:text-brand-300"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden="true" />
            <span className="truncate">{SECURITY_CONTACT.phoneDisplay}</span>
          </a>
        </div>
      </header>

      {/* 1 — HERO */}
      <section className="relative overflow-hidden px-5 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 sheet-grid sheet-fade opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[380px]"
        >
          <div className="hero-glow absolute inset-0 opacity-60" />
        </div>

        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 text-[11px] font-semibold text-brand-300">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Altyapı güvenlik analizi
            </span>

            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Önce ön denetim,{' '}
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-indigo-300 bg-clip-text text-transparent">
                sonra yatırım
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Donanım ya da yazılım satın almadan önce altyapınızı ön denetimden geçiriyoruz.
              Yatırım kararı tahminle değil, raporla verilir.
            </p>

            {/* Fiyat: sabit ve açık. Sayfanın en güçlü argümanı bu. */}
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums sm:text-4xl">
                  {PRICE}
                </span>
                <span className="text-sm font-semibold text-slate-300">+ KDV</span>
                <span className="text-sm text-slate-500">· sabit bedel</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Sürpriz kalem yok. Piyasada çok daha yüksek bedellerle yapılan derinlikli analizi
                ulaşılabilir kıldık; bu bedel güven inşasının ilk adımı.
              </p>
            </div>

            <ul className="mt-6 space-y-2.5">
              {[
                'Üç başlık incelenir: sızma kontrolü, ağ izolasyonu, yedekleme',
                'Çıktı: yönetim seviyesinde risk raporu',
                'Rastgele ürün önerisi değil, gerçek ihtiyacın tespiti',
              ].map((item) => (
                <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-sm font-semibold text-slate-200 transition-colors hover:border-brand-500/40 hover:text-white"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              WhatsApp&apos;tan yazın
            </a>
          </div>

          {/* Form — masaüstünde sağda, mobilde metnin hemen altında */}
          <div id="talep" className="min-w-0 scroll-mt-6 lg:sticky lg:top-6">
            <SecurityAnalysisForm />
          </div>
        </div>
      </section>

      {/* 2 — NEDEN GEREKLİ */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className={SECTION_LABEL}>{'// Neden'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Bu Analize Neden İhtiyaç Var?
            </h2>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 md:grid-cols-3">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <RevealItem
                key={title}
                className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <span className="inline-flex rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 3 — NELERİ İNCELİYORUZ (sayfanın kalbi) */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className={SECTION_LABEL}>{'// Kapsam'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Neleri İnceliyoruz?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Üç başlık. Her biri, gerçek olaylarda en sık kırılan noktalar olduğu için burada.
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 md:grid-cols-3">
            {SCOPE.map(({ icon: Icon, label, title, desc, points }) => (
              <RevealItem
                key={title}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-slate-600">{label}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
                <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex min-w-0 items-start gap-2 text-xs leading-relaxed text-slate-400"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-500">
              Bu başlıklar, KVKK md.12&apos;deki teknik tedbir yükümlülüğü ve ISO/IEC 27001&apos;in
              düzenli zafiyet değerlendirmesi beklentisiyle örtüşür. Analiz bir belgelendirme ya da
              denetim hizmeti değildir; mevcut durumun tespitidir.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4 — ÇIKTI: RİSK RAPORU */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={SECTION_LABEL}>{'// Çıktı'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Yönetim Seviyesinde Risk Raporu
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Teknik bulgular, yöneticinin karar verebileceği bir dile çevrilir. Öncelikli risk
              alanları tek tek listelenir; yatırım sıralaması buna göre yapılır.
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2">
            {REPORT.map((item) => (
              <RevealItem
                key={item}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4"
              >
                <ClipboardList
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                  aria-hidden="true"
                />
                <span className="min-w-0 text-sm leading-relaxed text-slate-300">{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5 — SÜREÇ */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={SECTION_LABEL}>{'// Süreç'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Dört Adım
            </h2>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, title, time, desc }) => (
              <RevealItem
                key={title}
                className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex shrink-0 rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="ml-auto min-w-0 truncate rounded-full border border-slate-800 px-2.5 py-1 text-[11px] text-slate-400">
                    {time}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 6 — SSS */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className={SECTION_LABEL}>{'// Sıkça sorulanlar'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Kısa Cevaplar
            </h2>
          </Reveal>

          <RevealGroup className="mt-8 space-y-2.5">
            {FAQ.map(({ q, a }) => (
              <RevealItem key={q}>
                <details className="group rounded-2xl border border-slate-800 bg-slate-900/50 open:border-brand-500/30">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">{q}</span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-xs leading-relaxed text-slate-400">{a}</p>
                </details>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Sayfadaki tek yukarı satış — tek satır, tek link. */}
          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Web uygulamanız ve API katmanınız için ayrıca sızma testi gerekiyorsa{' '}
            <Link
              href="/pentest"
              className="font-semibold text-brand-300 underline-offset-4 hover:underline"
            >
              sızma testi hizmetine
            </Link>{' '}
            bakabilirsiniz.
          </p>
        </div>
      </section>

      {/* 7 — KAPANIŞ CTA + FORM */}
      <section className="border-t border-white/5 px-5 py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <Reveal className="min-w-0">
            <span className={SECTION_LABEL}>{'// Başlangıç'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Yatırım Kararından Önce Ön Denetimden Geçirelim
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
              Sabit {PRICE} + KDV. Üç başlıklı inceleme, yönetim seviyesinde risk raporu ve
              birlikte okunan bir yol haritası.
            </p>

            <div className="mt-6 space-y-3">
              {CONTACT_LINKS.map(({ icon: Icon, href, label, external }) => (
                <a
                  key={href}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 text-sm text-slate-200 transition-colors hover:border-brand-500/40"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span className="min-w-0 truncate">{label}</span>
                </a>
              ))}
            </div>

            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              {SECURITY_CONTACT.brand}
            </p>
          </Reveal>

          <Reveal className="min-w-0" delay={0.1}>
            <SecurityAnalysisForm
              heading="Analiz Talebi Bırakın"
              description="1 iş günü içinde dönüş yapıp ön görüşme için uygun bir saat belirleyelim."
            />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <Link href="/" aria-label={`${SITE.name} ana sayfa`}>
              <Logo size="sm" />
            </Link>

            <nav aria-label="Yasal bağlantılar">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                {LEGAL_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-flex min-h-10 items-center transition-colors hover:text-brand-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="max-w-2xl text-[11px] leading-relaxed text-slate-600">
              Form aracılığıyla ilettiğiniz kişisel veriler, yalnızca talebinize dönüş
              yapmak amacıyla işlenir ve üçüncü taraflarla paylaşılmaz.
            </p>

            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} {SITE.name}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobilde sabit CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 p-3 backdrop-blur-sm md:hidden">
        <a
          href="#talep"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white"
        >
          Analiz Talebi Bırak
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}
