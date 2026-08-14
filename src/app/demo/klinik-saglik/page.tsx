'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { whatsAppLink } from '@/lib/site';
import { SafeImage } from '@/components/SafeImage';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  ArrowLeft,
  PhoneCall,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Wallet,
  ShieldCheck,
  Stethoscope,
  Smile,
  Users,
  Star,
  Quote,
  MapPin,
  Mail,
  Sparkles,
} from 'lucide-react';

/** Tedavi kategorileri sabit bir birlik tipi: filtre butonları ve kartlar aynı kaynaktan beslensin. */
type TreatmentCategory = 'İmplantoloji' | 'Estetik Diş Hekimliği' | 'Ortodonti';

interface Treatment {
  id: string;
  name: string;
  category: TreatmentCategory;
  /** Tek seansın ortalama süresi (hasta planlama yaparken en çok sorduğu bilgi). */
  duration: string;
  priceRange: string;
  description: string;
  sessions: string;
}

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experienceYears: number;
  image: string;
  focus: string[];
}

interface Testimonial {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  comment: string;
}

interface TrustBadge {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Kategori başına tek görsel: sayfa 6 uzak görsel sınırını aşmasın diye
 * tedavi kartları kendi kategorilerinin klinik fotoğrafını paylaşıyor.
 */
const CATEGORY_IMAGES: Record<TreatmentCategory, string> = {
  'İmplantoloji':
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=75',
  'Estetik Diş Hekimliği':
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=75',
  'Ortodonti':
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=75',
};

// Kategoriler sırayla dizildi: "Tümü" görünümünde aynı görsel yan yana düşmesin.
const TREATMENTS: Treatment[] = [
  {
    id: 'implant-tek',
    name: 'Tek Diş İmplantı',
    category: 'İmplantoloji',
    duration: '45 dk',
    priceRange: '18.000 ₺ – 26.000 ₺',
    description:
      'Titanyum implant yerleşimi ve iyileşme başlığı uygulaması. Kemik yoğunluğu ölçümü tedavi ücretine dahildir.',
    sessions: '2 seans + kontrol',
  },
  {
    id: 'zirkonyum',
    name: 'Zirkonyum Kaplama',
    category: 'Estetik Diş Hekimliği',
    duration: '60 dk',
    priceRange: '7.500 ₺ – 11.000 ₺',
    description:
      'Dijital ölçü ile hazırlanan, ışığı doğal dişe yakın geçiren metal desteksiz zirkonyum kronlar.',
    sessions: '3 seans',
  },
  {
    id: 'seffaf-plak',
    name: 'Şeffaf Plak Tedavisi',
    category: 'Ortodonti',
    duration: '30 dk',
    priceRange: '48.000 ₺ – 72.000 ₺',
    description:
      'Ağız içi tarayıcı ile planlanan, iki haftada bir değişen şeffaf plaklarla görünmez diş düzeltme.',
    sessions: '12 – 18 ay takip',
  },
  {
    id: 'all-on-four',
    name: 'All-on-4 Sabit Protez',
    category: 'İmplantoloji',
    duration: '3 saat',
    priceRange: '145.000 ₺ – 190.000 ₺',
    description:
      'Tam dişsiz çenede dört implant üzerine sabitlenen protez; aynı gün geçici dişlerle taburcu olursunuz.',
    sessions: '1 cerrahi + 3 kontrol',
  },
  {
    id: 'lamina',
    name: 'Lamina Veneer (Yaprak Porselen)',
    category: 'Estetik Diş Hekimliği',
    duration: '90 dk',
    priceRange: '12.000 ₺ – 16.500 ₺',
    description:
      'Minimal aşındırma ile ön dişlerde form, renk ve simetri düzenlemesi. Öncesinde dijital gülüş tasarımı yapılır.',
    sessions: '2 seans',
  },
  {
    id: 'metal-braket',
    name: 'Metal Braket Ortodonti',
    category: 'Ortodonti',
    duration: '40 dk',
    priceRange: '38.000 ₺ – 55.000 ₺',
    description:
      'Klasik sabit tel tedavisi; kapanış bozukluğu ve çapraşıklık vakalarında en öngörülebilir yöntem.',
    sessions: '18 – 24 ay takip',
  },
];

const DOCTORS: Doctor[] = [
  {
    id: 'dr-elif',
    name: 'Dr. Dt. Elif Şahinkaya',
    title: 'Kurucu Hekim',
    specialty: 'Estetik Diş Hekimliği & Gülüş Tasarımı',
    experienceYears: 14,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=75',
    focus: ['Lamina Veneer', 'Dijital Gülüş Tasarımı', 'Zirkonyum'],
  },
  {
    id: 'dr-mert',
    name: 'Uzm. Dr. Dt. Mert Bozkurt',
    title: 'Ağız & Çene Cerrahisi Uzmanı',
    specialty: 'İmplantoloji ve İleri Cerrahi',
    experienceYears: 17,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=75',
    focus: ['All-on-4', 'Sinüs Lifting', 'Kemik Grefti'],
  },
  {
    id: 'dr-nazli',
    name: 'Dr. Dt. Nazlı Erkut',
    title: 'Ortodonti Uzmanı',
    specialty: 'Şeffaf Plak ve Sabit Ortodonti',
    experienceYears: 11,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=75',
    focus: ['Şeffaf Plak', 'Çocuk Ortodontisi', 'Pekiştirme'],
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Seda K.',
    treatment: 'Lamina Veneer',
    rating: 5,
    comment:
      'Tedaviye başlamadan önce gülüşümün dijital tasarımını gösterdiler, sonucu birebir aynı çıktı. İlk kez bir klinikte ne olacağını bilerek koltuğa oturdum.',
  },
  {
    id: 't2',
    name: 'Okan D.',
    treatment: 'All-on-4 Sabit Protez',
    rating: 5,
    comment:
      'Sabah ameliyata girdim, akşam geçici dişlerimle evime döndüm. Kontrollerde hep aynı hekim ilgilendi, bu güven verdi.',
  },
  {
    id: 't3',
    name: 'Melis A.',
    treatment: 'Şeffaf Plak Tedavisi',
    rating: 4,
    comment:
      'On dört ay sürdü ama iş görüşmelerinde hiç belli olmadı. Randevu hatırlatmaları da düzenli geliyordu, tek bir kontrolü bile kaçırmadım.',
  },
];

const TRUST_BADGES: TrustBadge[] = [
  { id: 'b1', label: 'Yıl Deneyim', value: '12', icon: ShieldCheck },
  { id: 'b2', label: 'Mutlu Hasta', value: '20.000+', icon: Users },
  { id: 'b3', label: 'Uzman Hekim', value: '3', icon: Stethoscope },
  { id: 'b4', label: 'Hasta Memnuniyeti', value: '%98', icon: Smile },
];

const TIME_SLOTS: string[] = [
  '09:00',
  '10:00',
  '11:00',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
];

export default function ClinicPage() {
  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategory | 'Tümü'>('Tümü');

  // Randevu formu alanları
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState(TIME_SLOTS[0]);
  const [selectedTreatment, setSelectedTreatment] = useState<string>(TREATMENTS[0].id);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openWhatsApp = () => {
    window.open(
      whatsAppLink('Merhaba Vitalis Klinik, tedaviler ve randevu hakkında bilgi almak istiyorum.'),
      '_blank',
      'noopener,noreferrer',
    );
  };

  const categories = useMemo<Array<TreatmentCategory | 'Tümü'>>(
    () => ['Tümü', ...Array.from(new Set(TREATMENTS.map((t) => t.category)))],
    [],
  );

  const filteredTreatments = useMemo(
    () =>
      selectedCategory === 'Tümü'
        ? TREATMENTS
        : TREATMENTS.filter((t) => t.category === selectedCategory),
    [selectedCategory],
  );

  // Özet kartında ad göstermek için: seçilen id'nin tedavi karşılığı.
  const chosenTreatment = useMemo(
    () => TREATMENTS.find((t) => t.id === selectedTreatment) ?? TREATMENTS[0],
    [selectedTreatment],
  );

  // Gerçek bir API yok; demo akışı sadece başarı durumunu gösteriyor.
  const handleAppointmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetAppointment = () => {
    setIsSubmitted(false);
    setFullName('');
    setPhone('');
    setAppointmentDate('');
    setAppointmentTime(TIME_SLOTS[0]);
    setSelectedTreatment(TREATMENTS[0].id);
    setNote('');
  };

  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur-md md:px-16">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-300"
          >
            <ArrowLeft className="h-4 w-4 text-teal-400" aria-hidden="true" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sr-only sm:hidden">Ana Sayfaya Dön</span>
          </Link>
          <span className="hidden h-5 w-px bg-slate-800 lg:block" />
          <span className="hidden truncate text-xl font-bold tracking-wider text-teal-400 lg:block">
            VITALIS KLİNİK
          </span>
        </div>

        <nav className="flex items-center gap-4 text-xs font-medium text-slate-300 md:gap-6">
          <a href="#tedaviler" className="hidden transition-colors hover:text-teal-400 md:inline">
            Tedaviler
          </a>
          <a href="#hekimler" className="hidden transition-colors hover:text-teal-400 lg:inline">
            Hekim Kadrosu
          </a>
          <a href="#randevu" className="hidden transition-colors hover:text-teal-400 lg:inline">
            Randevu
          </a>
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:from-teal-400 hover:to-emerald-400"
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            <span>İletişime Geç</span>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 md:px-16">
        {/* Dekoratif ışıma: kliniğin teal kimliğini arka planda tutar. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-4xl space-y-6 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-teal-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Özel Diş &amp; Estetik Kliniği
          </span>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Vitalis Klinik
            <span className="mt-2 block bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-2xl text-transparent md:text-3xl">
              Sağlıklı gülüş, ölçülebilir planlama
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm text-slate-400 md:text-base">
            Nişantaşı&apos;ndaki kliniğimizde dijital ağız içi tarama, 3B tomografi ve gülüş tasarımı
            ile tedavinizi daha ilk görüşmede sonucuyla birlikte planlıyoruz.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <a
              href="#randevu"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-teal-400 sm:w-auto"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Ücretsiz Muayene Randevusu
            </a>
            <a
              href="#tedaviler"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3 text-xs font-semibold text-slate-300 transition-all hover:border-teal-500/40 hover:text-teal-300 sm:w-auto"
            >
              Tedavileri İncele
            </a>
          </div>

          {/* Güven rozetleri */}
          <div className="grid grid-cols-2 gap-3 pt-8 md:grid-cols-4">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center"
                >
                  <Icon className="mx-auto mb-2 h-5 w-5 text-teal-400" aria-hidden="true" />
                  <div className="text-xl font-bold text-white">{badge.value}</div>
                  <div className="text-[11px] text-slate-400">{badge.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Tedaviler */}
      <section id="tedaviler" className="scroll-mt-24 px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold text-white md:text-3xl">Tedavilerimiz</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredTreatments.length} tedavi listeleniyor • Fiyatlar 2026 muayene sonrası
                planlamaya göre değişebilir
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-500 font-bold text-slate-950 shadow-lg'
                      : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTreatments.map((treatment) => (
                <motion.article
                  key={treatment.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-teal-500/50"
                >
                  {/* SafeImage fill kullandığı için ebeveyn relative olmalı. */}
                  <div className="relative h-44 overflow-hidden">
                    <SafeImage
                      accent="text-teal-400"
                      src={CATEGORY_IMAGES[treatment.category]}
                      alt={`${treatment.name} tedavisi`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-300">
                      {treatment.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-base font-bold text-white transition-colors group-hover:text-teal-300">
                      {treatment.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">{treatment.description}</p>

                    <dl className="mt-auto grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                        <dt className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-3 w-3 text-teal-400" aria-hidden="true" />
                          Seans Süresi
                        </dt>
                        <dd className="mt-0.5 font-semibold text-white">{treatment.duration}</dd>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                        <dt className="flex items-center gap-1 text-slate-500">
                          <CalendarCheck className="h-3 w-3 text-teal-400" aria-hidden="true" />
                          Plan
                        </dt>
                        <dd className="mt-0.5 font-semibold text-white">{treatment.sessions}</dd>
                      </div>
                    </dl>

                    <div className="flex items-center justify-between border-t border-slate-800/70 pt-3">
                      <div>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Wallet className="h-3 w-3 text-teal-400" aria-hidden="true" />
                          Fiyat Aralığı
                        </span>
                        <span className="text-sm font-bold text-teal-400">
                          {treatment.priceRange}
                        </span>
                      </div>
                      <a
                        href="#randevu"
                        onClick={() => setSelectedTreatment(treatment.id)}
                        className="rounded-xl bg-teal-500 px-3.5 py-2 text-[11px] font-bold text-slate-950 transition-colors hover:bg-teal-400"
                      >
                        Randevu Al
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Hekim Kadrosu */}
      <section
        id="hekimler"
        className="scroll-mt-24 border-y border-slate-800 bg-slate-900/40 px-6 py-16 md:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Hekim Kadromuz</h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-400">
              Tedaviniz baştan sona aynı hekim tarafından yürütülür; kontrol randevularınızda hekim
              değişikliği yapmıyoruz.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOCTORS.map((doctor) => (
              <article
                key={doctor.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 transition-colors hover:border-emerald-500/40"
              >
                <div className="relative h-64">
                  <SafeImage
                    accent="text-teal-400"
                    src={doctor.image}
                    alt={`${doctor.name} portresi`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                    {doctor.experienceYears} yıl deneyim
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-base font-bold text-white">{doctor.name}</h3>
                    <p className="text-[11px] uppercase tracking-wide text-teal-400">
                      {doctor.title}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">{doctor.specialty}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {doctor.focus.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] text-slate-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Randevu Formu */}
      <section id="randevu" className="scroll-mt-24 px-6 py-16 md:px-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Online Randevu</h2>
            <p className="text-sm text-slate-400">
              İlk muayene ve tedavi planlaması ücretsizdir. Formu doldurun, hasta danışmanımız aynı
              gün içinde arayarak saati teyit etsin.
            </p>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Panoramik röntgen ve ağız içi tarama ilk muayeneye dahildir.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Tedavi planınızı yazılı fiyat teklifiyle birlikte teslim ediyoruz.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Randevu değişikliğini 24 saat öncesine kadar ücretsiz yapabilirsiniz.
              </li>
            </ul>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400" aria-hidden="true" />
                Teşvikiye Mah. Vali Konağı Cad. No: 48, Şişli / İstanbul
              </p>
              <p className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-400" aria-hidden="true" />
                Hafta içi 09:00 – 19:00 • Cumartesi 10:00 – 16:00
              </p>
              <p className="mt-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400" aria-hidden="true" />
                randevu@vitalisklinik.example
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="space-y-4 py-8 text-center"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-white">Randevu Talebiniz Alındı</h3>
                  <p className="text-xs text-slate-400">
                    {fullName ? `Sayın ${fullName}, ` : ''}
                    {appointmentDate || 'seçtiğiniz tarih'} • {appointmentTime} için{' '}
                    <span className="text-teal-400">{chosenTreatment.name}</span> talebiniz kaydedildi.
                    Hasta danışmanımız kısa süre içinde sizi arayacak.
                  </p>
                  <button
                    type="button"
                    onClick={resetAppointment}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                  >
                    Yeni Randevu Oluştur
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleAppointmentSubmit}
                  className="space-y-4"
                >
                  <h3 className="text-base font-bold text-white">Randevu Formu</h3>

                  <div className="space-y-1.5">
                    <label htmlFor="ad-soyad" className="block text-[11px] font-medium text-slate-400">
                      Ad Soyad
                    </label>
                    <input
                      id="ad-soyad"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Adınız ve soyadınız"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="telefon" className="block text-[11px] font-medium text-slate-400">
                      Telefon
                    </label>
                    <input
                      id="telefon"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="tarih" className="block text-[11px] font-medium text-slate-400">
                        Tarih
                      </label>
                      <input
                        id="tarih"
                        type="date"
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="saat" className="block text-[11px] font-medium text-slate-400">
                        Saat
                      </label>
                      <select
                        id="saat"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot} className="bg-slate-900">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="tedavi" className="block text-[11px] font-medium text-slate-400">
                      Tedavi
                    </label>
                    <select
                      id="tedavi"
                      value={selectedTreatment}
                      onChange={(e) => setSelectedTreatment(e.target.value)}
                      className="w-full cursor-pointer rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                    >
                      {TREATMENTS.map((treatment) => (
                        <option key={treatment.id} value={treatment.id} className="bg-slate-900">
                          {treatment.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-500">
                      Tahmini ücret: {chosenTreatment.priceRange} • {chosenTreatment.duration}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="not" className="block text-[11px] font-medium text-slate-400">
                      Notunuz (opsiyonel)
                    </label>
                    <textarea
                      id="not"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Şikayetiniz veya sormak istedikleriniz"
                      className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-teal-400 hover:to-emerald-400"
                  >
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Randevu Talebi Gönder
                  </button>
                  <p className="text-center text-[10px] text-slate-600">
                    Bu bir demo formudur; bilgiler hiçbir yere gönderilmez.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Hasta Yorumları */}
      <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
            Hastalarımız Ne Diyor?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.id}
                className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6"
              >
                <Quote className="h-6 w-6 text-teal-400/60" aria-hidden="true" />
                <blockquote className="flex-1 text-xs leading-relaxed text-slate-300">
                  {item.comment}
                </blockquote>
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`5 üzerinden ${item.rating} puan`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 ${
                        i < item.rating ? 'fill-teal-400 text-teal-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <figcaption className="border-t border-slate-800 pt-3">
                  <span className="block text-xs font-bold text-white">{item.name}</span>
                  <span className="text-[11px] text-slate-500">{item.treatment}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <span className="text-lg font-bold tracking-wider text-teal-400">VITALIS KLİNİK</span>
            <p className="mt-1 text-xs text-slate-500">
              Teşvikiye Mah. Vali Konağı Cad. No: 48, Şişli / İstanbul
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-xs font-semibold text-teal-300 transition-colors hover:bg-teal-500/20"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              WhatsApp Danışma Hattı
            </button>
            <Link
              href="/"
              className="text-xs text-slate-400 underline-offset-4 transition-colors hover:text-teal-300 hover:underline"
            >
              Kodara ana sayfası
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] text-slate-600">
          © 2026 Vitalis Klinik — Kurgusal demo içeriktir, gerçek bir sağlık kuruluşu değildir.
        </p>
      </footer>
          <DemoSwitcher currentId="klinik-saglik" />
</main>
  );
}
