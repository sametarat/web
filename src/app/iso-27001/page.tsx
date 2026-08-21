import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Cpu,
  FileSearch,
  Gavel,
  Handshake,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Scale,
  ScrollText,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { SITE, SECURITY_CONTACT, securityWhatsAppLink } from '@/lib/site';
import { Logo } from '@/components/Logo';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { IsoForm } from '@/components/IsoForm';

/**
 * ISO/IEC 27001:2022 belgelendirmeye hazırlık açılış sayfası.
 *
 * Tasarım kararları:
 * - Site navigasyonu YOK; sayfanın işi tek bir eyleme götürmek.
 * - Alıcı, belge almaya çoktan karar vermiş bir kurum: "ISO 27001 nedir"
 *   anlatmıyoruz, "denetime nasıl hazır hâle gelirsiniz" anlatıyoruz.
 * - Fiyat yok. Kapsam kuruma göre değişiyor; tek dönüşüm noktası form.
 * - Kardeş /pentest sayfası gibi birinci tekil şahıs ve bilinçli olarak anonim:
 *   ad ve fotoğraf sayfada yok, kimlik doğrulaması kapsam görüşmesinde yapılır.
 */
export const metadata: Metadata = {
  title: 'ISO/IEC 27001 Belgelendirmeye Hazırlık — Boşluk Analizi, İç Denetim, Denetim Refakati',
  description:
    'Müşteriniz, ihaleniz ya da düzenleyiciniz ISO/IEC 27001:2022 istiyorsa: boşluk analizi, dokümantasyonda yönlendirme, zorunlu iç denetim ve Aşama 1 – Aşama 2 belgelendirme denetimlerinde refakat. Baş denetçi bakışı, sızma testiyle doğrulanmış teknik kontroller.',
  alternates: { canonical: '/iso-27001' },
  openGraph: {
    title: 'ISO/IEC 27001 Belgelendirmeye Hazırlık',
    description:
      'Boşluk analizi, dokümantasyonda yönlendirme, iç denetim ve belgelendirme denetimine refakat. Politikaları ekibiniz yazar; ben yön gösterir ve gözden geçiririm.',
    url: '/iso-27001',
    type: 'website',
  },
};

/** Unvan — kardeş /pentest sayfasıyla aynı; ad ve fotoğraf bilinçli olarak yok. */
const ROLE = 'Sızma testi uzmanı · ISO/IEC 27001 Baş Denetçi';

const HERO_POINTS = [
  'Boşluk analiziyle standarda göre nerede olduğunuz ölçülür',
  'Dokümantasyonu ekibiniz yazar; yön, şablon ve gözden geçirme benden',
  'Zorunlu iç denetim yürütülür, Aşama 1 ve Aşama 2 denetimlerinde yanınızdayım',
];

const HERO_BADGES = [
  { icon: Award, label: 'ISO/IEC 27001:2022' },
  { icon: ClipboardCheck, label: 'Baş denetçi bakışı' },
  { icon: ShieldCheck, label: 'Sızma testiyle doğrulama' },
];

/** 2 — Kimler için. Üçü de gerçek hayatta gelen tetikleyiciler. */
const AUDIENCE = [
  { icon: Handshake, title: 'Müşteri ya da ihale şartı', desc: 'Sözleşmenin ekinde ya da şartnamede ISO/IEC 27001 belgesi isteniyor ve bir tarih verilmiş. İş bu belgeye bağlanmış durumda.' },
  { icon: Scale, title: 'KVKK ve düzenleyici baskı', desc: 'Aldığınız teknik ve idari tedbirlerin kayda geçirilmesi bekleniyor. Kurulmuş bir yönetim sistemi, bu kaydın en derli toplu hâli oluyor.' },
  { icon: Building2, title: 'Kurumsal müşteriye açılmak', desc: 'Yazılım ve hizmet firmaları için belge, tedarikçi değerlendirmesinde ilk elemeyi geçmenin yolu. Güvenlik sorularının çoğu belgeyle birlikte kapanıyor.' },
];

/** 3 — Hizmet sınırı. Sol sütun yapılanlar, sağ sütun yapılmayanlar. */
const DOES = [
  { title: 'Boşluk analizi', desc: 'Mevcut durum standardın maddelerine ve Annex A kontrollerine göre tek tek ölçülür. Çıktı: eksik listesi ve gerçekçi bir takvim.' },
  { title: 'Yönlendirme ve gözden geçirme', desc: 'Politikaları, prosedürleri ve kayıtları sizin ekibiniz yazar. Ben yön gösteririm, şablon ve örnek veririm, yazılanı denetçi gözüyle gözden geçiririm.' },
  { title: 'İç denetim', desc: 'Standardın zorunlu tuttuğu iç tetkik yürütülür ve raporlanır. Uygunsuzluklar, belgelendirme denetiminden önce görülmüş olur.' },
  { title: 'Belgelendirme denetimine refakat', desc: 'Aşama 1 ve Aşama 2 denetimlerinde yanınızdayım. Çıkan uygunsuzluklar için düzeltici faaliyet planı birlikte hazırlanır.' },
];

const DOES_NOT = [
  { title: 'Dokümantasyonu sıfırdan yazmak', desc: 'Dışarıdan yazılan politika, denetimde ilk soruda dağılır. Yazan ekip sistemi sahiplenir ve denetçinin sorusuna kendi cümlesiyle cevap verir.' },
  { title: 'Belge vermek', desc: 'Belgeyi TÜRKAK akredite bir belgelendirme kuruluşu verir. Danışman veremez; belgelendirme kararı da kuruluşa aittir.' },
  { title: 'Akredite denetim yapmak', desc: 'Danışmanlık verdiğim kurumun belgelendirme denetimini yapmam. Bu bir kısıt değil, standardın ve akreditasyon kurallarının gereği.' },
  { title: 'Belge garantisi vermek', desc: 'Hazırlığın kalitesi sonucu belirler, sözleşme değil. Söz verebileceğim şey, denetime eksiği bilinen bir kurum olarak girmeniz.' },
];

/** Sol sütun olumlu, sağ sütun olumsuz — tek bileşenden iki kez basılıyor. */
const SCOPE_COLUMNS = [
  { key: 'yes', title: 'Yapıyorum', items: DOES },
  { key: 'no', title: 'Yapmıyorum', items: DOES_NOT },
] as const;

/** 4 — Belgelendirme yolu. Standardın kendi akışı; uydurma süre yok. */
const PATH = [
  { step: '01', icon: FileSearch, title: 'Aşama 1', lead: 'Doküman ve hazırlık incelemesi', desc: 'Belgelendirme kuruluşu kapsamı, politikaları, risk değerlendirmesini ve SoA’yı inceler. Amaç, Aşama 2’ye hazır olup olmadığınızı görmek.' },
  { step: '02', icon: Search, title: 'Aşama 2', lead: 'Uygulama denetimi', desc: 'Yazdığınızı gerçekten uyguluyor musunuz? Kayıtlar, kanıtlar ve saha görüşmeleri üzerinden bakılır. Uygunsuzluklar burada yazılır.' },
  { step: '03', icon: Award, title: 'Belge', lead: 'Belgelendirme kararı', desc: 'Uygunsuzluklar kapatıldıktan sonra karar akredite kuruluş tarafından verilir. Belge üç yıllık bir döngüye bağlanır.' },
  { step: '04', icon: CalendarClock, title: 'Gözetim', lead: 'Yıllık gözetim denetimleri', desc: 'Sistem yaşamaya devam ediyor mu diye her yıl bakılır. İç denetim ve YGG kayıtlarının düzenli üretilmesi bu yüzden önemli.' },
  { step: '05', icon: RefreshCw, title: 'Yeniden belgelendirme', lead: '3 yılda bir', desc: 'Döngü sonunda sistem baştan denetlenir ve belge yenilenir.' },
];

/** 5 — Annex A. 2022 sürümünde 93 kontrol, 4 tema. */
const ANNEX_THEMES = [
  { icon: Users, code: 'A.5', title: 'Organizasyonel', count: 37, desc: 'Politikalar, roller, tedarikçi ilişkileri, olay yönetimi.' },
  { icon: Handshake, code: 'A.6', title: 'İnsan kaynaklı', count: 8, desc: 'İşe alım, farkındalık, disiplin süreci, görev değişimi.' },
  { icon: Lock, code: 'A.7', title: 'Fiziksel', count: 14, desc: 'Güvenli alanlar, ekipman, temiz masa, kablolama.' },
  { icon: Cpu, code: 'A.8', title: 'Teknolojik', count: 34, desc: 'Erişim denetimi, açıklık yönetimi, günlükleme, güvenli geliştirme.' },
];

const MANDATORY_RECORDS = [
  'BGYS kapsamı',
  'Bilgi güvenliği politikası',
  'Risk değerlendirme ve işleme süreci',
  'Uygulanabilirlik Bildirgesi (SoA)',
  'Risk işleme planı',
  'Bilgi güvenliği amaçları',
  'Yetkinlik kanıtları',
  'İç denetim programı ve sonuçları',
  'YGG (yönetimin gözden geçirmesi) kayıtları',
  'Uygunsuzluk ve düzeltici faaliyet kayıtları',
];

const FAQ = [
  { q: 'Ne kadar sürer?', a: 'Kurum büyüklüğüne, kapsamın genişliğine ve ekibin dokümantasyona ayırabildiği zamana göre değişir; tipik olarak birkaç aylık bir hazırlık dönemi olur. Boşluk analizinden sonra takvimi birlikte, gerçek durumunuza göre çıkarıyoruz — öncesinde verilecek her tarih tahmin olur.' },
  { q: 'Dokümantasyonu kim yazıyor?', a: 'Sizin ekibiniz yazar. Ben yön gösteririm, şablon ve örnek veririm, yazılanı denetçi gözüyle gözden geçiririm. Bu daha yavaş görünür ama denetimde işe yarayan tek yöntem: Aşama 2’de denetçi politikayı değil, politikayı uygulayan kişiyi dinler.' },
  { q: 'Belgeyi siz mi veriyorsunuz?', a: 'Hayır. Belgeyi TÜRKAK akredite bir belgelendirme kuruluşu verir ve belgelendirme kararı ona aittir. Danışmanlık verdiğim kurumun belgelendirme denetimini de yapmam. Benim işim, o denetime eksiği kapatılmış olarak girmenizi sağlamak.' },
  { q: 'Sızma testi zorunlu mu?', a: 'Standart açıkça sızma testi şart koşmaz. Ancak A.8.8 teknik açıklık yönetimi ve A.8.29 geliştirme sürecinde güvenlik testi beklentisini karşılamanın en doğrudan yolu budur; belgelendirme kuruluşları da pratikte bu kontroller için somut kanıt arar. Zorunlu olan test değil, kanıt.' },
];

const WHATSAPP = securityWhatsAppLink(
  'Merhaba, ISO/IEC 27001 belgelendirmeye hazırlık hakkında bilgi almak istiyorum.',
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

const FOOTER_CONTACTS = [
  { href: `tel:+${SECURITY_CONTACT.phoneE164}`, label: SECURITY_CONTACT.phoneDisplay },
  { href: `mailto:${SECURITY_CONTACT.email}`, label: SECURITY_CONTACT.email },
] as const;

const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
] as const;

const SECTION_LABEL = 'block font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400';

/** Bölüm başlığı — sayfa boyunca aynı ritim. */
function SectionHead({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <Reveal>
      <span className={SECTION_LABEL}>{`// ${label}`}</span>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h2>
      {desc ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{desc}</p> : null}
    </Reveal>
  );
}

export default function IsoPage() {
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
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 sheet-grid sheet-fade opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[380px]">
          <div className="hero-glow absolute inset-0 opacity-60" />
        </div>

        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 text-[11px] font-semibold text-brand-300">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ISO/IEC 27001:2022 hazırlık
            </span>

            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Denetime{' '}
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-indigo-300 bg-clip-text text-transparent">
                hazır girin
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Müşteriniz, ihaleniz ya da düzenleyiciniz ISO/IEC 27001 istiyor. Belgeyi akredite
              kuruluş verir; benim işim, o denetime eksiği bilinen ve kapatılmış bir kurum olarak
              girmenizi sağlamak.
            </p>

            <ul className="mt-6 space-y-2.5">
              {HERO_POINTS.map((item) => (
                <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2">
              {HERO_BADGES.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden="true" />
                  <span className="min-w-0">{label}</span>
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

            <p className="mt-5 max-w-xl text-xs leading-relaxed text-slate-500">
              {ROLE}. Kimlik ve belge doğrulaması kapsam görüşmesinde yapılır: belgelerin aslı ve
              doğrulama numaraları paylaşılır, gizlilik sözleşmesi bu aşamada imzalanır.
            </p>
          </div>

          {/* Form — masaüstünde sağda, mobilde metnin hemen altında */}
          <div id="talep" className="min-w-0 scroll-mt-6 lg:sticky lg:top-6">
            <IsoForm />
          </div>
        </div>
      </section>

      {/* 2 — KİMLER İÇİN */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            label="Kimler için"
            title="Belge Kararı Genelde Dışarıdan Gelir"
            desc="Bu sayfa, ISO 27001’in ne olduğunu araştıranlar için değil; almaya karar vermiş ve takvimi sıkışmış kurumlar için."
          />

          <RevealGroup className="mt-8 grid gap-4 md:grid-cols-3">
            {AUDIENCE.map(({ icon: Icon, title, desc }) => (
              <RevealItem key={title} className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
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

      {/* 3 — NE YAPIYORUM / NE YAPMIYORUM */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            label="Kapsam"
            title="Ne Yapıyorum, Ne Yapmıyorum"
            desc="Sınırı baştan çizmek, sonradan tartışmaktan iyidir."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {SCOPE_COLUMNS.map(({ key, title, items }, index) => {
              const yes = key === 'yes';
              const Icon = yes ? CheckCircle2 : X;
              return (
                <Reveal key={key} className="min-w-0" delay={index * 0.1}>
                  <div className={`h-full min-w-0 rounded-2xl border p-6 ${yes ? 'border-brand-500/20 bg-slate-900/50' : 'border-slate-800 bg-slate-950/50'}`}>
                    <h3 className={`flex min-w-0 items-center gap-2 text-sm font-extrabold uppercase tracking-wider ${yes ? 'text-brand-300' : 'text-slate-400'}`}>
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">{title}</span>
                    </h3>
                    <ul className="mt-5 space-y-5">
                      {items.map((item) => (
                        <li key={item.title} className="flex min-w-0 items-start gap-3">
                          <Icon
                            className={`mt-0.5 h-4 w-4 shrink-0 ${yes ? 'text-brand-400' : 'text-slate-600'}`}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className={`text-sm font-bold ${yes ? 'text-white' : 'text-slate-200'}`}>
                              {item.title}
                            </p>
                            <p className={`mt-1 text-sm leading-relaxed ${yes ? 'text-slate-400' : 'text-slate-500'}`}>
                              {item.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <p className="mt-6 flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4 text-xs leading-relaxed text-slate-400">
              <Gavel className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              <span className="min-w-0">
                <strong className="font-semibold text-slate-200">Bağımsızlık sınırı:</strong>{' '}
                Danışmanlık verdiğim kurumun belgelendirme denetimini yapmam; belgelendirme kararı
                akredite kuruluşa aittir. Bu bir kısıt değil, standardın gereği.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4 — BELGELENDİRME YOLU */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            label="Yol"
            title="Belgelendirme Nasıl İlerler"
            desc="Beş durak. İlk ikisi denetim, üçüncüsü karar, kalan ikisi belgenin ayakta kalması."
          />

          {/* Geniş şerit: mobilde kendi içinde yatay kayar, md’den itibaren ızgara */}
          <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <RevealGroup as="ul" className="flex min-w-0 gap-4 md:grid md:grid-cols-3 lg:grid-cols-5">
              {PATH.map(({ step, icon: Icon, title, lead, desc }) => (
                <RevealItem as="li" key={step} className="flex w-[260px] shrink-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 md:w-auto md:min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs tracking-widest text-slate-600">{step}</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
                    {lead}
                  </p>
                  <p className="mt-2 min-w-0 text-sm leading-relaxed text-slate-400">{desc}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* 5 — STANDART NEYİ İSTİYOR */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            label="Standart"
            title="Annex A: 93 Kontrol, 4 Tema"
            desc="2022 sürümünde kontroller dört tema altında toplandı. Hepsi her kuruma uygulanmaz; hangisinin neden uygulandığı ya da uygulanmadığı Uygulanabilirlik Bildirgesi’nde (SoA) tek tek gerekçelendirilir."
          />

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ANNEX_THEMES.map(({ icon: Icon, code, title, count, desc }) => (
              <RevealItem key={code} className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-slate-600">{code}</span>
                </div>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-white tabular-nums">
                  {count}
                </p>
                <h3 className="mt-1 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <div className="mt-8 min-w-0 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <h3 className="flex min-w-0 items-center gap-2 text-sm font-extrabold text-white">
                <ScrollText className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span className="min-w-0">Denetimde aranan zorunlu kayıtlar</span>
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {MANDATORY_RECORDS.map((record) => (
                  <li key={record} className="min-w-0 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
                    {record}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Bu kayıtların hepsi sizin ekibinizce üretilir. Benim işim, hangisinin neden
                istendiğini ve denetçinin ne göreceğini önceden göstermek.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — FARKI NE */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead label="Fark" title="Kâğıt Üstünde Değil, Sahada Doğrulanmış" />

          <Reveal delay={0.05}>
            <div className="mt-6 min-w-0 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-slate-300">
                ISO 27001 danışmanlığının bilinen sorunu şu: denetimi geçen ama gerçeği
                yansıtmayan bir evrak yığını üretilir. Politika &quot;açıklıklar düzenli olarak
                yönetilir&quot; der, kimse o açıklıklara bakmamıştır.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Ben aynı zamanda sızma testi yapıyorum. Bu yüzden Annex A’nın teknik başlığındaki
                kontroller — özellikle{' '}
                <span className="font-semibold text-white">A.8 Teknolojik</span> altındaki açıklık
                yönetimi, güvenli geliştirme, erişim denetimi ve günlükleme — yalnızca
                dokümante edilmiş olarak değil, pratikte çalışıyor mu diye de bakılır. Denetçi
                kanıt istediğinde gösterecek bir şeyiniz olur.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Teknik kontrolleri kanıtla desteklemek istiyorsanız{' '}
                <Link href="/pentest" className="font-semibold text-brand-300 hover:underline">
                  sızma testi hizmeti
                </Link>{' '}
                ayrı bir kapsam olarak yürütülebilir.
              </p>

              <p className="mt-5 border-t border-white/5 pt-5 text-xs leading-relaxed text-slate-500">
                Belgelendirmeye henüz karar vermediyseniz ve önce mevcut durumu görmek
                istiyorsanız, daha küçük bütçeli bir başlangıç olarak{' '}
                <Link href="/guvenlik-analizi" className="font-semibold text-slate-300 hover:underline">
                  altyapı güvenlik analizi
                </Link>{' '}
                makul bir ilk adım olur.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — SSS */}
      <section className="border-t border-white/5 px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <SectionHead label="Sıkça sorulanlar" title="Kısa Cevaplar" />

          <RevealGroup className="mt-8 space-y-2.5">
            {FAQ.map(({ q, a }) => (
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

      {/* 8 — KAPANIŞ CTA + FORM */}
      <section className="border-t border-white/5 bg-slate-950/60 px-5 py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <Reveal className="min-w-0">
            <span className={SECTION_LABEL}>{'// Başlangıç'}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Önce Boşluk Analizi, Sonra Takvim
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
              Nerede olduğunuzu ölçmeden verilecek her tarih tahmindir. Kapsamı konuşalım, eksik
              listesini çıkaralım; hazırlık takvimi ondan sonra netleşir.
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
              {SECURITY_CONTACT.brand} · {ROLE}
            </p>
          </Reveal>

          <Reveal className="min-w-0" delay={0.1}>
            <IsoForm
              heading="Kapsam Görüşmesi Talep Edin"
              description="1 iş günü içinde dönüş yapıp kapsamınızı ve takviminizi konuşalım."
              submitLabel="Talebi Gönder"
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

            <ul className="flex flex-col items-center gap-1 text-xs text-slate-500">
              {FOOTER_CONTACTS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-10 items-center hover:text-brand-300">
                    {label}
                  </a>
                </li>
              ))}
            </ul>

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
              Bu sayfada anlatılan hizmet belgelendirmeye hazırlık kapsamındadır. ISO/IEC 27001
              belgesi TÜRKAK akredite bir belgelendirme kuruluşu tarafından verilir. Form
              aracılığıyla ilettiğiniz kişisel veriler, yalnızca talebinize dönüş yapmak amacıyla
              işlenir ve üçüncü taraflarla paylaşılmaz.
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
          Görüşme Talebi Bırak
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}
