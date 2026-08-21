import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Camera,
  CheckCircle2,
  Cpu,
  DoorOpen,
  FileSearch,
  Handshake,
  HardDrive,
  Mail,
  MessageCircle,
  Percent,
  Phone,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { SITE, SECURITY_CONTACT, securityWhatsAppLink } from '@/lib/site';
import { Logo } from '@/components/Logo';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { PartnerForm } from '@/components/PartnerForm';

/**
 * İş ortaklığı açılış sayfası.
 *
 * /pentest ile aynı mimari: site navigasyonu yok, tek dönüşüm noktası, sonda
 * yasal footer. Ama ziyaretçi son kullanıcı DEĞİL: zaten KOBİ’lerin karşısında
 * oturan, güvenlik tarafında sunacak bir şeyi olmayan bir firma. Dil bu yüzden
 * "sizi koruyalım" değil, "yeni bir gelir kalemi" dili. Sayfada yalnızca yüzde
 * oranları var; kazanç vaadi ya da doğrulanamaz hiçbir rakam yok.
 */
export const metadata: Metadata = {
  title: 'İş Ortaklığı — Güvenlik Analizini Siz Sunun, Tekniği Biz Yapalım',
  description:
    'IT çözüm ortakları, kamera ve ağ entegratörleri, IT destek firmaları ve danışmanlar için ortaklık modeli: 25.000 TL + KDV sabit fiyatlı altyapı güvenlik analizinde %30 ortak payı, analizden doğan donanım, yazılım ve altyapı projelerinde %10–%15 ek komisyon.',
  alternates: { canonical: '/is-ortakligi' },
  openGraph: {
    title: 'İş Ortaklığı — Güvenlik Analizini Siz Sunun, Tekniği Biz Yapalım',
    description:
      'Sabit fiyatlı altyapı güvenlik analizinde %30 ortak payı, analizden doğan projelerde %10–%15 ek komisyon. Kurulum maliyeti yok, teknik yük sizde değil.',
    url: '/is-ortakligi',
    type: 'website',
  },
};

/** Sayfadaki tek ürün: ortağın müşterisine sunduğu sabit fiyatlı analiz. */
const OFFER = {
  price: '25.000 TL',
  vat: '+ KDV',
  scope: 'Sızma kontrolü · Ağ izolasyonu · Yedekleme',
} as const;

const HERO_POINTS = [
  'Sunumu siz yapıyorsunuz; teknik operasyon, test ve raporlama bu tarafta.',
  'Kurulum maliyeti, stok ya da lisans yükü yok — satacağınız şey hazır bir hizmet.',
  'Analizden doğan donanım ve altyapı işlerinde ortaklık hakkınız korunur.',
];

/** %30 / %70 — iki kart. Payların neyi kapsadığı açıkça yazılı. */
const SPLIT = [
  {
    share: '%30',
    title: 'İş ortağı payı',
    card: 'border-brand-500/30 bg-brand-500/5',
    accent: 'text-brand-300',
    lead: 'Analizi müşterinize sunduğunuz anda hak edilir.',
    // 25.000 TL üzerinden %30. Fiyat değişirse bu satırı da güncelle.
    concrete: 'Her analizde 7.500 TL',
    items: [
      'Müşteri ilişkisi ve sunum sizde',
      'Analiz satışı üzerinden doğrudan pay',
      'Bekleyen hedef ya da ciro şartı yok',
    ],
  },
  {
    share: '%70',
    title: 'Hizmet ve operasyon payı',
    card: 'border-slate-800 bg-slate-900/50',
    accent: 'text-white',
    lead: 'Teknik tarafın tamamını ve test maliyetini karşılar.',
    items: [
      'Teknik operasyon ve saha çalışması',
      'Bulguların raporlanması ve teslimi',
      'Güvenlik testlerinin maliyeti',
    ],
  },
];

/** Analizden sonra gelen işler: her biri %10–%15 komisyon. */
const COMMISSIONS = [
  { icon: HardDrive, title: 'Donanım satışı', desc: 'Sunucu, güvenlik duvarı, switch, NAS, kamera.' },
  { icon: Cpu, title: 'Yazılım ve lisans', desc: 'Yedekleme, uç nokta koruma, yönetim lisansları.' },
  { icon: Wrench, title: 'IT altyapı işleri', desc: 'Ağ yapılandırma, izolasyon, yedekleme kurulumu.' },
];

/** Analizin neden kapı açtığı — ortağın imza sebebi. */
const DOOR_OPENER = [
  {
    icon: FileSearch,
    title: 'Rapor ihtiyacı kanıtlar',
    desc: 'Ön denetim, öncelikli risk alanlarını yöneticinin kendi gözüyle görebileceği bir belgeye dönüştürür. Tartışma “gerek var mı”dan çıkar.',
  },
  {
    icon: DoorOpen,
    title: 'Erteleme gerekçesi kalmaz',
    desc: 'Kendi sisteminde riskli alanları gören bir yönetici, IT yatırımını belirsiz bir tarihe atmakta zorlanır. Karar hızlanır.',
  },
  {
    icon: Handshake,
    title: 'Doğru tespit işi büyütür',
    desc: 'Rapordaki her bulgu bir sonraki işin gerekçesidir: donanım, lisans ya da altyapı düzenlemesi. Hem müşteri korunur hem kapı açılır.',
  },
];

/** Sorumluluk paylaşımı — iki sütun, somut maddeler. */
const RESPONSIBILITIES = [
  {
    icon: Users,
    title: 'Ortağa düşen',
    items: [
      'Müşteri ilişkisini kurar ve sürdürürsünüz.',
      'Analizi müşteriye siz sunarsınız; anlatım materyali sizde olur.',
      'Analiz öncesi temel bilgileri toplarsınız: kaç lokasyon, kaç kullanıcı, hangi sistemler.',
      'Rapor sonrası çıkan donanım ve altyapı işini siz üstlenirsiniz.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Bize düşen',
    items: [
      'Altyapı güvenlik analizinin teknik yürütmesini biz yaparız.',
      'Bulguları yöneticinin okuyabileceği bir raporda toplar, önceliklendiririz.',
      'İsterseniz müşteri sunumuna birlikte gireriz; teknik soruları biz yanıtlarız.',
      'Rapordaki önerileri sizin sunacağınız çözümle uyumlu şekilde yazarız.',
    ],
  },
];

/** Footer'daki yasal bağlantılar. */
const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
];

/** Kimler ortak olabilir — profil, vaat değil. */
const PROFILES = [
  {
    icon: Building2, title: 'IT çözüm ortakları ve bayiler',
    desc: 'Donanım ve yazılım satıyorsunuz ama güvenlik tarafında sunacak bir hizmetiniz yok.',
  },
  {
    icon: Camera, title: 'Kamera ve ağ entegratörleri',
    desc: 'Kurulumu yapıyorsunuz; aynı müşteriye ikinci bir gerekçeyle dönmek istiyorsunuz.',
  },
  {
    icon: Wrench, title: 'IT destek ve teknik servis firmaları',
    desc: 'Aylık bakım verdiğiniz müşterilere yatırım gerekçesini gösteren bir belge arıyorsunuz.',
  },
  {
    icon: Users, title: 'Danışmanlar ve serbest çalışanlar',
    desc: 'İşletme yöneticileriyle doğrudan konuşuyorsunuz; teknik ekip yükü taşımak istemiyorsunuz.',
  },
];

/** Hero altındaki güven şeridi. */
const HERO_CHIPS = [
  { icon: Percent, label: '%30 ortak payı' },
  { icon: ShieldCheck, label: 'Teknik yük bizde' },
  { icon: Handshake, label: 'Bayilik bedeli yok' },
];

const WHATSAPP_MESSAGE = `Merhaba ${SITE.name}, iş ortaklığı modeli hakkında bilgi almak istiyorum.`;

/** Başvuru bölümündeki doğrudan iletişim yolları — hepsi güvenlik hattına gider. */
const CONTACT_LINKS = [
  { icon: Phone, href: `tel:+${SECURITY_CONTACT.phoneE164}`, label: SECURITY_CONTACT.phoneDisplay },
  { icon: Mail, href: `mailto:${SECURITY_CONTACT.email}`, label: SECURITY_CONTACT.email },
  {
    icon: MessageCircle,
    href: securityWhatsAppLink(WHATSAPP_MESSAGE),
    label: 'WhatsApp ile yazın',
    /** Tek yeşil vurgu: WhatsApp. Emerald sayfada başka yerde kullanılmıyor. */
    accent: true,
  },
];

/** Bölüm başlığı — /pentest ile aynı antet dili, tek yerde toplanmış hâli. */
function SectionHead({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <Reveal>
      <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400">
        {`// ${label}`}
      </span>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h2>
      {desc && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{desc}</p>}
    </Reveal>
  );
}

export default function PartnershipLandingPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      {/* Minimal başlık — navigasyon yok, sadece marka ve konum */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label={`${SITE.name} ana sayfa`} className="min-w-0">
            <Logo size="sm" />
          </Link>
          <span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-slate-400">
            <Handshake className="h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden="true" />
            <span className="truncate">İş ortaklığı programı</span>
          </span>
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
              <Handshake className="h-3.5 w-3.5" aria-hidden="true" />
              İş ortakları için
            </span>

            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Müşteriniz sizde kalsın,{' '}
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-indigo-300 bg-clip-text text-transparent">
                güvenlik tarafını biz taşıyalım
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Zaten KOBİ’lerin karşısında oturuyorsunuz. Elinizde güvenlik tarafında
              sunabileceğiniz bir hizmet yoksa, sabit fiyatlı altyapı güvenlik analizini
              kendi müşterinize siz sunun. Teknik işi, testi ve raporu biz üstlenelim.
            </p>

            {/* Ortağın sattığı ürün tek ve sabit fiyatlı — belirsizlik bırakma */}
            <div className="mt-5 min-w-0 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Sunacağınız hizmet
              </p>
              <p className="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl font-extrabold tracking-tight text-white tabular-nums sm:text-3xl">
                  {OFFER.price}
                </span>
                <span className="text-sm text-slate-400">{OFFER.vat} · sabit fiyat</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Altyapı güvenlik analizi — {OFFER.scope.toLowerCase()}.
              </p>
            </div>

            <ul className="mt-6 space-y-2.5">
              {HERO_POINTS.map((item) => (
                <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/5 pt-5 text-xs text-slate-400">
              {HERO_CHIPS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Form — masaüstünde sağda ve sabit, mobilde metnin altında */}
          <div id="basvuru" className="min-w-0 scroll-mt-6 lg:sticky lg:top-6">
            <PartnerForm />
          </div>
        </div>
      </section>

      {/* 2 — NEDEN ANALİZ KAPI AÇAR */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            label="Kapı açan şey"
            title="Ürün Anlatmak Zor, Rapor Göstermek Kolay"
            desc="Soğuk bir teklifte yatırım her zaman ertelenebilir bir gider gibi durur. Analiz bu sırayı tersine çevirir: önce ihtiyacı kanıtlayan bir rapor çıkar, teklif ondan sonra gelir."
          />

          <RevealGroup className="mt-8 grid min-w-0 gap-4 md:grid-cols-3">
            {DOOR_OPENER.map(({ icon: Icon, title, desc }) => (
              <RevealItem
                key={title}
                className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <Icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-xs leading-relaxed text-slate-400">
            Kapsam netliği için: sunulan hizmet bir{' '}
            <strong className="font-semibold text-slate-200">altyapı güvenlik analizidir</strong>.
            Web ve API tarafındaki tam kapsamlı{' '}
            <Link href="/pentest" className="text-brand-300 underline-offset-4 hover:underline">
              sızma testi ayrı bir hizmettir
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 3 — ŞEFFAF KAZANÇ MODELİ */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            label="Kazanç modeli"
            title="Şeffaf Paylaşım: %30 / %70"
            desc="Analiz bedeli sabittir ve paylaşım baştan bellidir. Hangi payın neyi karşıladığı aşağıda yazılı."
          />

          <RevealGroup className="mt-8 grid min-w-0 gap-4 md:grid-cols-2">
            {SPLIT.map((card) => (
              <RevealItem key={card.share} className={`min-w-0 rounded-2xl border p-6 ${card.card}`}>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className={`text-4xl font-extrabold tracking-tight tabular-nums ${card.accent}`}
                  >
                    {card.share}
                  </span>
                  <span className="min-w-0 text-sm font-bold text-white">{card.title}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{card.lead}</p>
                {'concrete' in card && card.concrete ? (
                  <p className="mt-3 inline-flex min-w-0 items-baseline gap-1.5 rounded-lg border border-brand-500/25 bg-brand-500/10 px-3 py-1.5">
                    <span className="text-base font-extrabold tracking-tight text-white tabular-nums">
                      {card.concrete}
                    </span>
                  </p>
                ) : null}
                <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
                  {card.items.map((item) => (
                    <li key={item} className="flex min-w-0 items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 4 — EK PROJE KOMİSYONLARI */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            label="Analizden sonrası"
            title="Ek Proje Komisyonları: %10 – %15"
            desc="Analiz bittiğinde iş bitmiyor. Rapordan doğan her projede ortaklık hakkınız korunur — tek seferlik değil, süregelen bir gelir kalemi."
          />

          <RevealGroup className="mt-8 space-y-3">
            {COMMISSIONS.map(({ icon: Icon, title, desc }) => (
              <RevealItem
                key={title}
                className="flex min-w-0 flex-wrap items-start gap-x-4 gap-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-nowrap"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70">
                  <Icon className="h-4 w-4 text-brand-400" aria-hidden="true" />
                </span>
                {/* 375 px'te: üstte ikon + oran, altta metin. sm'den itibaren tek satır. */}
                <div className="order-last min-w-0 flex-1 basis-full sm:order-none sm:basis-auto">
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{desc}</p>
                </div>
                <span className="ml-auto shrink-0 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-extrabold tabular-nums text-brand-300 sm:ml-0">
                  %10 – %15
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-5 flex min-w-0 items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-xs leading-relaxed text-slate-300">
            <Percent className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
            <span className="min-w-0">
              Analizden doğan tüm projelerde iş ortağının hakkı korunur. Müşteriyi siz
              getirdiğiniz için, o müşteride açılan işlerde de payınız devam eder.
            </span>
          </p>
        </div>
      </section>

      {/* 5 — ORTAĞA DÜŞEN / BİZE DÜŞEN */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead label="İş bölümü" title="Ortağa Düşen / Bize Düşen" />

          <RevealGroup className="mt-8 grid min-w-0 gap-4 md:grid-cols-2">
            {RESPONSIBILITIES.map(({ icon: Icon, title, items }) => (
              <RevealItem
                key={title}
                className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Icon className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex min-w-0 items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 6 — KİMLER ORTAK OLABİLİR */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            label="Profil"
            title="Kimler Ortak Olabilir?"
            desc="Ortak profili tek bir ortak paydada buluşuyor: müşteriyle güven ilişkisi zaten kurulmuş olsun."
          />

          <RevealGroup className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
            {PROFILES.map(({ icon: Icon, title, desc }) => (
              <RevealItem
                key={title}
                className="flex min-w-0 gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 7 — BAŞVURU + FORM */}
      <section className="border-t border-white/5 px-5 py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="min-w-0">
            <SectionHead
              label="Başvuru"
              title="Birlikte Büyüyelim"
              desc="Biz sadece sistem kurmuyoruz; ön denetimle işletmeyi koruyor, doğru tespitle kazancı birlikte büyütüyoruz."
            />
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Başvurunuzu bırakın; modeli, paylaşımı ve ilk müşteri sunumunun nasıl
              ilerleyeceğini konuşalım. Bayilik bedeli, stok ya da aylık hedef yok.
            </p>

            <div className="mt-6 space-y-2.5">
              {CONTACT_LINKS.map(({ icon: Icon, href, label, accent }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-brand-500/40"
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${accent ? 'text-emerald-400' : 'text-brand-400'}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 truncate">{label}</span>
                </a>
              ))}
            </div>

            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              {SECURITY_CONTACT.brand}
            </p>
          </div>

          <div id="ortaklik-basvurusu" className="min-w-0 scroll-mt-6">
            <PartnerForm
              heading="Ortaklık Başvurusu Gönderin"
              description="Firmanızı ve müşteri profilinizi bırakın, 1 iş günü içinde dönüş yapayım."
              submitLabel="Başvurumu Gönder"
            />
          </div>
        </div>
      </section>

      {/* 8 — FOOTER */}
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
              Başvuru formuyla ilettiğiniz bilgiler yalnızca ortaklık görüşmesi için işlenir,
              üçüncü taraflarla paylaşılmaz. Sayfadaki oranlar paylaşım yapısını gösterir;
              kazanç taahhüdü içermez.
            </p>

            <p className="min-w-0 text-xs text-slate-600">
              &copy; {new Date().getFullYear()} {SITE.name} · {SECURITY_CONTACT.phoneDisplay}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
