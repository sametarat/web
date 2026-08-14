'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { whatsAppLink } from '@/lib/site';
import { SafeImage } from '@/components/SafeImage';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  AtSign,
  ArrowLeft,
  PhoneCall,
  Dumbbell,
  Flame,
  HeartPulse,
  Users,
  Clock,
  CheckCircle2,
  Check,
  Sparkles,
  Timer,
  MapPin,
  Mail,
} from 'lucide-react';

/* ----------------------------- Tipler ----------------------------- */

type BillingCycle = 'monthly' | 'yearly';

interface MembershipPlan {
  id: string;
  name: string;
  summary: string;
  /** Aylık ödemeli taban fiyat (TL); yıllık fiyat bundan indirimle türetilir. */
  monthlyPrice: number;
  features: string[];
  highlighted: boolean;
}

type DayKey = 'pzt' | 'sal' | 'car' | 'per' | 'cum' | 'cmt' | 'paz';

interface WeekDay {
  key: DayKey;
  /** Sekmede görünen kısa ad — dar ekranda satır kaplamasın diye ayrı tutuldu. */
  short: string;
  long: string;
}

interface ClassSession {
  time: string;
  name: string;
  trainer: string;
  /** Toplam kontenjan ve dolan yer; "kalan" bunlardan hesaplanır. */
  capacity: number;
  booked: number;
  intensity: 'Düşük' | 'Orta' | 'Yüksek';
}

interface Trainer {
  name: string;
  title: string;
  image: string;
  specialties: string[];
  experience: string;
}

/* ----------------------------- Veri ----------------------------- */

/** Yıllık ödemede uygulanan indirim oranı; hem rozet hem fiyat bundan üretilir. */
const YEARLY_DISCOUNT = 0.2;

const PLANS: MembershipPlan[] = [
  {
    id: 'base',
    name: 'Forge Base',
    summary: 'Serbest ağırlık ve kardiyo alanına sınırsız erişim.',
    monthlyPrice: 1290,
    features: [
      'Sınırsız salon kullanımı (07:00 - 23:00)',
      'Kardiyo ve serbest ağırlık bölgesi',
      'Ayda 2 grup dersi hakkı',
      'Vücut analizi (3 ayda bir)',
      'Mobil uygulama ile giriş',
    ],
    highlighted: false,
  },
  {
    id: 'performance',
    name: 'Forge Performance',
    summary: 'Sınırsız grup dersi ve aylık birebir performans takibi.',
    monthlyPrice: 1890,
    features: [
      'Base paketteki her şey',
      'Sınırsız grup dersi katılımı',
      'Aylık 1 birebir PT seansı',
      'Kişiye özel antrenman programı',
      'Sauna ve buhar odası erişimi',
      'Misafir davet hakkı (ayda 2)',
    ],
    highlighted: true,
  },
  {
    id: 'elite',
    name: 'Forge Elite',
    summary: 'Haftalık birebir çalışma, beslenme danışmanlığı ve fizyoterapi.',
    monthlyPrice: 2790,
    features: [
      'Performance paketteki her şey',
      'Haftalık 1 birebir PT seansı',
      'Diyetisyen eşliğinde beslenme planı',
      'Ayda 1 fizyoterapi değerlendirmesi',
      'Öncelikli ders rezervasyonu',
      'Kişisel dolap ve havlu hizmeti',
    ],
    highlighted: false,
  },
];

const WEEK_DAYS: WeekDay[] = [
  { key: 'pzt', short: 'Pzt', long: 'Pazartesi' },
  { key: 'sal', short: 'Sal', long: 'Salı' },
  { key: 'car', short: 'Çar', long: 'Çarşamba' },
  { key: 'per', short: 'Per', long: 'Perşembe' },
  { key: 'cum', short: 'Cum', long: 'Cuma' },
  { key: 'cmt', short: 'Cmt', long: 'Cumartesi' },
  { key: 'paz', short: 'Paz', long: 'Pazar' },
];

const SCHEDULE: Record<DayKey, ClassSession[]> = {
  pzt: [
    { time: '07:00', name: 'Sabah Metcon', trainer: 'Kerem Aydın', capacity: 16, booked: 13, intensity: 'Yüksek' },
    { time: '10:30', name: 'Mobilite & Esneme', trainer: 'Deniz Şahin', capacity: 20, booked: 9, intensity: 'Düşük' },
    { time: '18:00', name: 'Güç Temelleri', trainer: 'Kerem Aydın', capacity: 12, booked: 12, intensity: 'Orta' },
    { time: '20:00', name: 'Boks Kondisyon', trainer: 'Melis Torun', capacity: 18, booked: 11, intensity: 'Yüksek' },
  ],
  sal: [
    { time: '08:00', name: 'Reformer Pilates', trainer: 'Deniz Şahin', capacity: 10, booked: 8, intensity: 'Orta' },
    { time: '12:30', name: 'Öğle HIIT 45', trainer: 'Melis Torun', capacity: 16, booked: 14, intensity: 'Yüksek' },
    { time: '19:00', name: 'Olimpik Halter Tekniği', trainer: 'Baran Yıldırım', capacity: 8, booked: 6, intensity: 'Yüksek' },
    { time: '20:30', name: 'Akşam Yoga', trainer: 'Deniz Şahin', capacity: 20, booked: 12, intensity: 'Düşük' },
  ],
  car: [
    { time: '07:00', name: 'Sabah Metcon', trainer: 'Kerem Aydın', capacity: 16, booked: 10, intensity: 'Yüksek' },
    { time: '11:00', name: 'Fonksiyonel Kor', trainer: 'Melis Torun', capacity: 18, booked: 7, intensity: 'Orta' },
    { time: '18:00', name: 'Kettlebell Akışı', trainer: 'Baran Yıldırım', capacity: 14, booked: 13, intensity: 'Orta' },
    { time: '19:30', name: 'Spinning Endurance', trainer: 'Kerem Aydın', capacity: 22, booked: 18, intensity: 'Yüksek' },
  ],
  per: [
    { time: '08:00', name: 'Reformer Pilates', trainer: 'Deniz Şahin', capacity: 10, booked: 10, intensity: 'Orta' },
    { time: '12:30', name: 'Öğle HIIT 45', trainer: 'Melis Torun', capacity: 16, booked: 9, intensity: 'Yüksek' },
    { time: '18:30', name: 'Sırt & Omuz Bloğu', trainer: 'Baran Yıldırım', capacity: 12, booked: 8, intensity: 'Orta' },
    { time: '20:00', name: 'Boks Kondisyon', trainer: 'Melis Torun', capacity: 18, booked: 15, intensity: 'Yüksek' },
  ],
  cum: [
    { time: '07:00', name: 'Sabah Metcon', trainer: 'Kerem Aydın', capacity: 16, booked: 15, intensity: 'Yüksek' },
    { time: '10:00', name: 'Mobilite & Esneme', trainer: 'Deniz Şahin', capacity: 20, booked: 6, intensity: 'Düşük' },
    { time: '18:00', name: 'Forge Circuit', trainer: 'Baran Yıldırım', capacity: 20, booked: 17, intensity: 'Yüksek' },
    { time: '20:00', name: 'Hafta Sonu Isınması', trainer: 'Melis Torun', capacity: 18, booked: 10, intensity: 'Orta' },
  ],
  cmt: [
    { time: '09:00', name: 'Forge Circuit', trainer: 'Kerem Aydın', capacity: 20, booked: 19, intensity: 'Yüksek' },
    { time: '11:00', name: 'Aile Fonksiyonel', trainer: 'Melis Torun', capacity: 24, booked: 14, intensity: 'Düşük' },
    { time: '13:00', name: 'Olimpik Halter Tekniği', trainer: 'Baran Yıldırım', capacity: 8, booked: 5, intensity: 'Yüksek' },
    { time: '16:00', name: 'Vinyasa Yoga', trainer: 'Deniz Şahin', capacity: 20, booked: 11, intensity: 'Düşük' },
  ],
  paz: [
    { time: '10:00', name: 'Toparlanma Seansı', trainer: 'Deniz Şahin', capacity: 20, booked: 8, intensity: 'Düşük' },
    { time: '12:00', name: 'Kettlebell Akışı', trainer: 'Baran Yıldırım', capacity: 14, booked: 9, intensity: 'Orta' },
    { time: '17:00', name: 'Spinning Endurance', trainer: 'Kerem Aydın', capacity: 22, booked: 13, intensity: 'Yüksek' },
  ],
};

const TRAINERS: Trainer[] = [
  {
    name: 'Kerem Aydın',
    title: 'Baş Antrenör & Kondisyon',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=75',
    specialties: ['Metcon', 'Spinning', 'Dayanıklılık'],
    experience: '11 yıl saha deneyimi',
  },
  {
    name: 'Melis Torun',
    title: 'Fonksiyonel Antrenman Uzmanı',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=75',
    specialties: ['HIIT', 'Boks', 'Kor Stabilizasyon'],
    experience: '8 yıl saha deneyimi',
  },
  {
    name: 'Baran Yıldırım',
    title: 'Güç & Halter Koçu',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=75',
    specialties: ['Olimpik Halter', 'Powerlifting', 'Kettlebell'],
    experience: '13 yıl saha deneyimi',
  },
  {
    name: 'Deniz Şahin',
    title: 'Pilates & Mobilite Eğitmeni',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=75',
    specialties: ['Reformer', 'Yoga', 'Postür'],
    experience: '9 yıl saha deneyimi',
  },
];

/** Formdaki ders seçimi — programdaki isimlerle tutarlı kalsın diye sabit liste. */
const TRIAL_CLASSES: string[] = [
  'Sabah Metcon',
  'Öğle HIIT 45',
  'Reformer Pilates',
  'Boks Kondisyon',
  'Olimpik Halter Tekniği',
  'Spinning Endurance',
  'Vinyasa Yoga',
];

/* ----------------------------- Yardımcılar ----------------------------- */

const formatPrice = (value: number): string => `₺${Math.round(value).toLocaleString('tr-TR')}`;

/** Yoğunluk etiketinin rengi — koyu zemin üzerinde okunur kalsın diye sabit eşleme. */
const intensityStyles: Record<ClassSession['intensity'], string> = {
  Düşük: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  Orta: 'bg-lime-500/10 text-lime-300 border-lime-500/25',
  Yüksek: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
};

/* ----------------------------- Sayfa ----------------------------- */

export default function GymPage() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [activeDay, setActiveDay] = useState<DayKey>('pzt');

  // Deneme dersi formu
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState<string>(TRIAL_CLASSES[0]);
  const [submitted, setSubmitted] = useState(false);

  const openWhatsApp = () => {
    window.open(
      whatsAppLink('Merhaba Forge Athletic Club, üyelik paketleri ve deneme dersi hakkında bilgi almak istiyorum.'),
      '_blank',
      'noopener,noreferrer',
    );
  };

  const todaysClasses = SCHEDULE[activeDay];
  const activeDayLabel = WEEK_DAYS.find((d) => d.key === activeDay)?.long ?? '';

  // Seçili günün toplam boş kontenjanı — başlıkta özet olarak gösteriliyor.
  const remainingSpots = useMemo(
    () => todaysClasses.reduce((total, session) => total + (session.capacity - session.booked), 0),
    [todaysClasses],
  );

  const handleTrialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gerçek bir API yok; demo olduğu için sadece başarı durumuna geçiyoruz.
    setSubmitted(true);
  };

  const resetTrialForm = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setInterest(TRIAL_CLASSES[0]);
  };

  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/85 px-4 py-4 backdrop-blur-md md:px-16">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-lime-400/40 hover:bg-lime-400/10 hover:text-lime-300"
          >
            <ArrowLeft className="h-4 w-4 text-lime-400" aria-hidden="true" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sr-only sm:hidden">Ana Sayfaya Dön</span>
          </Link>
          <span className="hidden h-5 w-px bg-zinc-800 lg:block" />
          <span className="hidden truncate text-lg font-black uppercase tracking-[0.2em] text-lime-400 lg:block">
            Forge Athletic Club
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 md:gap-6">
          <a href="#uyelik" className="hidden transition-colors hover:text-lime-400 md:inline">
            Üyelik
          </a>
          <a href="#program" className="hidden transition-colors hover:text-lime-400 md:inline">
            Ders Programı
          </a>
          <a href="#egitmenler" className="hidden transition-colors hover:text-lime-400 lg:inline">
            Eğitmenler
          </a>
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-lime-400 to-green-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_20px_rgba(163,230,53,0.25)] transition-all hover:from-lime-300 hover:to-green-400"
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            <span>İletişime Geç</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        {/* Görsel arka planda; metnin okunabilirliği için üzerine degrade perde konuluyor. */}
        <div className="absolute inset-0">
          <SafeImage
            accent="text-lime-400"
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=75"
            alt="Forge Athletic Club antrenman salonu"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-16 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-lime-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Kadıköy · 2.400 m² performans merkezi
            </span>

            <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white md:text-6xl">
              Forge Athletic <span className="text-lime-400">Club</span>
            </h1>

            <p className="text-lg font-medium text-zinc-300 md:text-xl">
              Demir sertleşir, sen güçlenirsin.
            </p>

            <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
              Olimpik halter platformları, fonksiyonel antrenman alanı, 3 ayrı stüdyo ve
              performans laboratuvarı. Haftada 40+ grup dersi, ölçüme dayalı birebir programlar.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#deneme"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-lime-300 active:scale-95"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Ücretsiz Deneme Dersi
              </a>
              <a
                href="#uyelik"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-all hover:border-lime-400/40 hover:text-lime-300"
              >
                Üyelik Paketleri
              </a>
            </div>

            <dl className="grid max-w-lg grid-cols-3 gap-4 pt-8">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-500">Aktif üye</dt>
                <dd className="text-2xl font-black text-lime-400">1.850+</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-500">Haftalık ders</dt>
                <dd className="text-2xl font-black text-lime-400">40+</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-500">Eğitmen</dt>
                <dd className="text-2xl font-black text-lime-400">14</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Üyelik paketleri */}
      <section id="uyelik" className="scroll-mt-20 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">Üyelik</span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Sana Uygun Paketi Seç
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Tüm paketlerde kayıt ücreti yok, dondurma hakkı var. Yıllık ödemede
              %{Math.round(YEARLY_DISCOUNT * 100)} avantaj.
            </p>
          </div>

          {/* Ödeme periyodu geçişi */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
              <button
                type="button"
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  billing === 'monthly'
                    ? 'bg-lime-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Aylık
              </button>
              <button
                type="button"
                aria-pressed={billing === 'yearly'}
                onClick={() => setBilling('yearly')}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  billing === 'yearly'
                    ? 'bg-lime-400 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Yıllık
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    billing === 'yearly' ? 'bg-zinc-950 text-lime-400' : 'bg-lime-400/15 text-lime-300'
                  }`}
                >
                  %{Math.round(YEARLY_DISCOUNT * 100)} indirim
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const monthlyEquivalent =
                billing === 'yearly' ? plan.monthlyPrice * (1 - YEARLY_DISCOUNT) : plan.monthlyPrice;
              const yearlyTotal = monthlyEquivalent * 12;
              const yearlySaving = plan.monthlyPrice * 12 - yearlyTotal;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className={`relative flex flex-col rounded-3xl border p-7 ${
                    plan.highlighted
                      ? 'border-lime-400/60 bg-gradient-to-b from-lime-400/[0.08] to-zinc-900 shadow-[0_0_50px_-12px_rgba(163,230,53,0.35)] lg:-translate-y-3'
                      : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime-400 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-950">
                      En Popüler
                    </span>
                  )}

                  <h3 className="text-lg font-black uppercase tracking-wide text-white">{plan.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{plan.summary}</p>

                  <div className="mt-6 border-y border-zinc-800 py-6">
                    <div className="flex items-end gap-2">
                      <span className="font-mono text-4xl font-black text-lime-400">
                        {formatPrice(monthlyEquivalent)}
                      </span>
                      <span className="pb-1 text-xs text-zinc-500">/ ay</span>
                    </div>

                    {billing === 'yearly' ? (
                      <p className="mt-2 text-[11px] text-zinc-400">
                        <span className="text-zinc-500 line-through">{formatPrice(plan.monthlyPrice)}</span>{' '}
                        yerine · Yıllık tek çekim {formatPrice(yearlyTotal)} ·{' '}
                        <span className="font-semibold text-lime-300">{formatPrice(yearlySaving)} tasarruf</span>
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] text-zinc-500">Aylık ödeme · İstediğin ay iptal et</p>
                    )}
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className={`mt-7 w-full rounded-xl px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                      plan.highlighted
                        ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300'
                        : 'border border-zinc-700 bg-zinc-950 text-zinc-100 hover:border-lime-400/50 hover:text-lime-300'
                    }`}
                  >
                    {plan.name} ile Başla
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Haftalık ders programı */}
      <section id="program" className="scroll-mt-20 border-y border-zinc-800 bg-zinc-900/40 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">Program</span>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                Haftalık Ders Takvimi
              </h2>
              <p className="mt-3 text-sm text-zinc-400">
                {activeDayLabel} günü {todaysClasses.length} ders · toplam {remainingSpots} boş kontenjan
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <Timer className="h-3.5 w-3.5 text-lime-400" aria-hidden="true" />
              Rezervasyonlar ders saatinden 1 saat öncesine kadar açıktır.
            </div>
          </div>

          {/* Gün sekmeleri — dar ekranda 4 sütuna sarar, taşma olmaz. */}
          <div
            role="group"
            aria-label="Haftanın günleri"
            className="mb-6 grid grid-cols-4 gap-2 sm:grid-cols-7"
          >
            {WEEK_DAYS.map((day) => {
              const isActive = day.key === activeDay;
              return (
                <button
                  key={day.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveDay(day.key)}
                  className={`rounded-xl border px-2 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'border-lime-400 bg-lime-400 text-zinc-950'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-lime-400/40 hover:text-lime-300'
                  }`}
                >
                  <span aria-hidden="true">{day.short}</span>
                  <span className="sr-only">{day.long}</span>
                </button>
              );
            })}
          </div>

          {/* Masaüstünde tablo başlığı; mobilde kart düzenine geçtiği için gizli. */}
          <div className="hidden grid-cols-[92px_1fr_180px_150px] gap-4 border-b border-zinc-800 px-5 pb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:grid">
            <span>Saat</span>
            <span>Ders</span>
            <span>Eğitmen</span>
            <span>Kontenjan</span>
          </div>

          <ul className="divide-y divide-zinc-800/70">
            {todaysClasses.map((session) => {
              const remaining = session.capacity - session.booked;
              const isFull = remaining <= 0;

              return (
                <li
                  key={`${activeDay}-${session.time}-${session.name}`}
                  className="grid grid-cols-1 gap-3 px-1 py-5 md:grid-cols-[92px_1fr_180px_150px] md:items-center md:gap-4 md:px-5"
                >
                  <div className="flex items-center gap-2 font-mono text-sm font-bold text-lime-400">
                    <Clock className="h-3.5 w-3.5 md:hidden" aria-hidden="true" />
                    {session.time}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{session.name}</p>
                    <span
                      className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${intensityStyles[session.intensity]}`}
                    >
                      {session.intensity} yoğunluk
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Users className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                    {session.trainer}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800" aria-hidden="true">
                      <div
                        className={`h-full rounded-full ${isFull ? 'bg-orange-400' : 'bg-lime-400'}`}
                        style={{ width: `${Math.min(100, (session.booked / session.capacity) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold ${isFull ? 'text-orange-300' : 'text-zinc-300'}`}>
                      {isFull ? 'Kontenjan dolu' : `${remaining} / ${session.capacity} yer`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Eğitmen kadrosu */}
      <section id="egitmenler" className="scroll-mt-20 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">Kadro</span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Eğitmenlerimiz
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Tümü uluslararası sertifikalı; her üye için ölçüm tabanlı ilerleme takibi yapar.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRAINERS.map((trainer) => (
              <motion.article
                key={trainer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 transition-all hover:border-lime-400/40"
              >
                <div className="relative h-64 overflow-hidden">
                  <SafeImage
                    accent="text-lime-400"
                    src={trainer.image}
                    alt={`${trainer.name} — ${trainer.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-lg bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold text-lime-300 backdrop-blur-sm">
                    {trainer.experience}
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-sm font-bold text-white">{trainer.name}</h3>
                    <p className="text-[11px] text-zinc-400">{trainer.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-300"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Deneme dersi formu */}
      <section id="deneme" className="scroll-mt-20 border-t border-zinc-800 bg-zinc-900/40 px-6 py-20 md:px-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">Ücretsiz Deneme</span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              İlk Dersin Bizden
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Formu doldur, eğitmenlerimiz seni arasın. Vücut analizi ve ihtiyaç görüşmesi
              sonrasında sana uygun dersle başlıyoruz. Taahhüt yok, kayıt ücreti yok.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-center gap-2.5">
                <HeartPulse className="h-4 w-4 text-lime-400" aria-hidden="true" />
                Ücretsiz vücut kompozisyon analizi
              </li>
              <li className="flex items-center gap-2.5">
                <Dumbbell className="h-4 w-4 text-lime-400" aria-hidden="true" />
                Eğitmen eşliğinde tanıtım antrenmanı
              </li>
              <li className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-lime-400" aria-hidden="true" />
                Tesis turu ve ders programı planlaması
              </li>
            </ul>

            <div className="relative h-48 overflow-hidden rounded-3xl border border-zinc-800">
              <SafeImage
                accent="text-lime-400"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=75"
                alt="Forge Athletic Club serbest ağırlık bölgesi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-80"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7">
            {submitted ? (
              <div className="space-y-4 py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-lime-400" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">Başvurun Alındı!</h3>
                <p className="text-xs text-zinc-400">
                  {fullName.trim() ? `${fullName.trim()}, ` : ''}deneme dersi talebini aldık.
                  Eğitmen ekibimiz 24 saat içinde seni arayarak uygun saati planlayacak.
                </p>
                <button
                  type="button"
                  onClick={resetTrialForm}
                  className="rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
                >
                  Yeni Başvuru Oluştur
                </button>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="space-y-5">
                <h3 className="text-base font-bold text-white">Deneme Dersi Formu</h3>

                <div className="space-y-1.5">
                  <label htmlFor="trial-name" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Ad Soyad
                  </label>
                  <input
                    id="trial-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Örn. Ayşe Korkmaz"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="trial-phone" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Telefon
                  </label>
                  <input
                    id="trial-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0555 000 00 00"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="trial-class" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    İlgilendiğin Ders
                  </label>
                  <select
                    id="trial-class"
                    name="class"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-lime-400 focus:outline-none"
                  >
                    {TRIAL_CLASSES.map((lesson) => (
                      <option key={lesson} value={lesson} className="bg-zinc-900">
                        {lesson}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-lime-400 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-lime-300 active:scale-95"
                >
                  Ücretsiz Dersimi Ayırt
                </button>

                <p className="text-center text-[10px] text-zinc-600">
                  Bu bir demo formudur; bilgiler hiçbir yere gönderilmez.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-12 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <span className="text-lg font-black uppercase tracking-[0.2em] text-lime-400">
              Forge Athletic Club
            </span>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
              Demir sertleşir, sen güçlenirsin. Performans odaklı antrenman ve
              ölçüme dayalı ilerleme takibi.
            </p>
          </div>

          <div className="space-y-2 text-xs text-zinc-400">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-lime-400" aria-hidden="true" />
              Caferağa Mah. Moda Cad. No:118, Kadıköy / İstanbul
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-lime-400" aria-hidden="true" />
              Hafta içi 06:30 – 23:30 · Hafta sonu 08:00 – 21:00
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-lime-400" aria-hidden="true" />
              uyelik@forgeathletic.example
            </p>
            <p className="flex items-center gap-2">
              <AtSign className="h-3.5 w-3.5 text-lime-400" aria-hidden="true" />
              @forgeathleticclub
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-zinc-900 pt-6 text-center text-[11px] text-zinc-600">
          © 2026 Forge Athletic Club. Tüm hakları saklıdır. Bu sayfa örnek bir demo çalışmasıdır.
        </div>
      </footer>
          <DemoSwitcher currentId="spor-salonu" />
</main>
  );
}
