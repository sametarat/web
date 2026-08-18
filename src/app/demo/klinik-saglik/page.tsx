'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { whatsAppLink } from '@/lib/site';
import { SafeImage } from '@/components/SafeImage';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  PhoneCall,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';

/* --------------------------------- Tipler --------------------------------- */

/** Tedavi kategorileri sabit bir birlik tipi: filtre butonları ve kartlar aynı kaynaktan beslensin. */
type TreatmentCategory = 'İmplantoloji' | 'Estetik Diş Hekimliği' | 'Ortodonti';

/** Mini testte "ne kadar zaman ayırabilirim" sorusunun karşılığı. */
type Commitment = 'kisa' | 'orta' | 'uzun';

/** Mini testte "bütçe planı" sorusunun karşılığı. */
type BudgetTier = 'ekonomik' | 'dengeli' | 'kapsamli';

interface ProcessStep {
  title: string;
  detail: string;
}

interface Treatment {
  id: string;
  name: string;
  category: TreatmentCategory;
  /** Tek seansın ortalama süresi (hasta planlama yaparken en çok sorduğu bilgi). */
  duration: string;
  priceRange: string;
  description: string;
  sessions: string;
  /** İyileşme / alışma süreci — tıbbi vaat değil, süreç tarifi. */
  recovery: string;
  anesthesia: string;
  /** Tedaviye başlarken yapılan hazırlıklar. */
  before: string[];
  /** Tedavi tamamlandıktan sonraki takip düzeni. */
  after: string[];
  /** Numaralı süreç haritası; fotoğraf yerine adım adım anlatım. */
  steps: ProcessStep[];
  /** Bu tedaviyi yürüten hekimler (randevu formu bu listeden besleniyor). */
  doctorIds: string[];
  commitment: Commitment;
  budget: BudgetTier;
}

interface DoctorMilestone {
  period: string;
  title: string;
  place: string;
}

interface Doctor {
  id: string;
  name: string;
  /** Randevu özet kartında uzun unvan yerine kısa ad kullanılıyor. */
  shortName: string;
  title: string;
  specialty: string;
  experienceYears: number;
  image: string;
  focus: string[];
  bio: string;
  expertise: string[];
  timeline: DoctorMilestone[];
  languages: string[];
  /** 0 = Pazar … 6 = Cumartesi. Takvim şeridi bu listeden kapalı günleri türetir. */
  workDays: number[];
}

interface TrustBadge {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface JourneyStep {
  id: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuizOption {
  id: string;
  label: string;
  hint: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

/* -------------------------------- Sabitler -------------------------------- */

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
    recovery:
      'Cerrahi sonrası ilk 48 saat ılık ve yumuşak beslenme önerilir. Kemik kaynaması hekim takibinde ortalama 8 – 12 hafta izlenir; bu sürede geçici bir çözümle günlük hayata devam edilir.',
    anesthesia: 'Lokal anestezi',
    before: [
      '3B tomografi ile kemik hacmi ve sinir konumu ölçülür',
      'Ağız içi tarayıcı ile dijital ölçü alınır',
      'Cerrahi rehber planı hastayla ekran üzerinde paylaşılır',
    ],
    after: [
      'İlk hafta dikiş ve doku kontrolü',
      '8 – 12 hafta arası kaynama kontrolü',
      'Üst yapı takıldıktan sonra yılda iki kez bakım randevusu',
    ],
    steps: [
      { title: 'Planlama', detail: 'Tomografi ve dijital ölçü birleştirilerek implant açısı belirlenir.' },
      { title: 'Cerrahi seans', detail: 'Lokal anestezi altında implant yerleştirilir, iyileşme başlığı takılır.' },
      { title: 'Kaynama takibi', detail: 'Kemik – implant bütünleşmesi kontrol randevularıyla izlenir.' },
      { title: 'Üst yapı', detail: 'Dijital ölçüyle hazırlanan kron implanta sabitlenir.' },
    ],
    doctorIds: ['dr-mert', 'dr-elif'],
    commitment: 'kisa',
    budget: 'dengeli',
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
    recovery:
      'Prova seansları arasında geçici kron kullanılır. Kalıcı kronlar sabitlendikten sonra birkaç gün sıcak – soğuk hassasiyeti görülebilir; bu süre hekim tarafından takip edilir.',
    anesthesia: 'Gerektiğinde lokal anestezi',
    before: [
      'Renk skalası ve gülüş hattı ölçümü yapılır',
      'Dijital ölçü alınır, laboratuvar dosyası hazırlanır',
      'Geçici kronlarla form provası yapılır',
    ],
    after: [
      'İlk hafta kapanış (oklüzyon) kontrolü',
      'Altı ayda bir diş eti ve kenar uyumu kontrolü',
      'Ara yüz fırçası ve gece plağı kullanımı anlatılır',
    ],
    steps: [
      { title: 'Ölçü ve renk', detail: 'Ağız içi tarayıcıyla ölçü alınır, renk doğal dişlere göre seçilir.' },
      { title: 'Provalar', detail: 'Alt yapı ve form provaları hastayla birlikte aynada değerlendirilir.' },
      { title: 'Simantasyon', detail: 'Onaylanan kronlar kalıcı olarak sabitlenir.' },
    ],
    doctorIds: ['dr-elif'],
    commitment: 'kisa',
    budget: 'ekonomik',
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
    recovery:
      'Her yeni plak setinin ilk günlerinde baskı hissi olağandır. Plakların günde 20 – 22 saat takılması planın öngörülen sürede ilerlemesi için gereklidir.',
    anesthesia: 'Gerekmez',
    before: [
      'Ağız içi tarama ve fotoğraf kaydı alınır',
      'Dijital hareket simülasyonu hastaya izletilir',
      'Plak seti ve değişim takvimi teslim edilir',
    ],
    after: [
      '6 – 8 haftada bir ilerleme kontrolü',
      'Tedavi sonunda pekiştirme (retainer) planı',
      'Gece pekiştirme kullanımının yıllık kontrolü',
    ],
    steps: [
      { title: 'Dijital tarama', detail: 'Diş dizilimi taranır, hareket planı yazılımda kurulur.' },
      { title: 'Plak serisi', detail: 'İki haftada bir değişen plaklarla kademeli hareket sağlanır.' },
      { title: 'Ara kontroller', detail: 'Planla gerçek hareket karşılaştırılır, gerekirse set yenilenir.' },
      { title: 'Pekiştirme', detail: 'Sonuç pozisyonu gece plağı ile korunur.' },
    ],
    doctorIds: ['dr-nazli'],
    commitment: 'uzun',
    budget: 'kapsamli',
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
    recovery:
      'Cerrahi günü geçici sabit protez takılır. İlk 6 – 8 hafta yumuşak beslenme dönemi olarak planlanır; kalıcı protez kemik iyileşmesi tamamlandıktan sonra hazırlanır.',
    anesthesia: 'Lokal anestezi veya sedasyon',
    before: [
      'Tomografi ile çene açıları ve kemik hacmi ölçülür',
      'Yüz oranlarına göre diş dizilim provası yapılır',
      'Cerrahi rehber ve geçici protez önceden üretilir',
    ],
    after: [
      '48 saat ve 1 hafta doku kontrolü',
      '6 – 8 haftalık kaynama takibi',
      'Kalıcı protez sonrası yılda iki kez profesyonel temizlik',
    ],
    steps: [
      { title: 'Ön hazırlık', detail: 'Tomografi, dijital ölçü ve protez provası tek randevuda toplanır.' },
      { title: 'Cerrahi gün', detail: 'Dört implant yerleştirilir, geçici sabit protez aynı gün takılır.' },
      { title: 'Uyum dönemi', detail: 'Konuşma ve çiğneme alışkanlığı kontrollerle izlenir.' },
      { title: 'Kalıcı protez', detail: 'İyileşme tamamlandığında kalıcı üst yapı hazırlanır.' },
    ],
    doctorIds: ['dr-mert'],
    commitment: 'orta',
    budget: 'kapsamli',
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
    recovery:
      'Mock-up seansından sonra geçici bir alışma dönemi planlanır. Yapıştırma sonrası birkaç gün hassasiyet görülebilir; sert gıdalarla ısırma alışkanlığı için öneri listesi verilir.',
    anesthesia: 'Genellikle gerekmez',
    before: [
      'Yüz oranı, gülüş hattı ve konuşma çizgisi ölçülür',
      'Dijital gülüş tasarımı ekranda birlikte gözden geçirilir',
      'Ağız içi mock-up ile tasarım denenir',
    ],
    after: [
      'Yapıştırma sonrası 1 hafta kapanış kontrolü',
      'Gece plağı kullanım planı',
      'Yılda iki kez yüzey ve kenar kontrolü',
    ],
    steps: [
      { title: 'Tasarım', detail: 'Dijital gülüş tasarımı hazırlanır, ölçüler hastayla paylaşılır.' },
      { title: 'Mock-up', detail: 'Tasarım geçici malzemeyle ağızda denenir ve birlikte düzenlenir.' },
      { title: 'Uygulama', detail: 'Onaylanan laminalar minimal hazırlıkla yapıştırılır.' },
    ],
    doctorIds: ['dr-elif'],
    commitment: 'orta',
    budget: 'dengeli',
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
    recovery:
      'Braket takıldıktan sonraki ilk günlerde yanak teması ve baskı hissi olağandır. Tel aktivasyonlarının ardından 2 – 3 gün yumuşak beslenme önerilir.',
    anesthesia: 'Gerekmez',
    before: [
      'Panoramik röntgen ve sefalometrik analiz yapılır',
      'Kapanış kaydı ve fotoğraf arşivi oluşturulur',
      'Tedavi süresi ve kontrol takvimi yazılı verilir',
    ],
    after: [
      '4 – 6 haftada bir tel aktivasyonu',
      'Braket sökümünden sonra pekiştirme teli',
      'Pekiştirme dönemi boyunca 6 aylık kontrol',
    ],
    steps: [
      { title: 'Analiz', detail: 'Röntgen ve model analiziyle hareket planı çıkarılır.' },
      { title: 'Braket seansı', detail: 'Braketler yapıştırılır, ilk ark teli yerleştirilir.' },
      { title: 'Aktivasyonlar', detail: 'Belirli aralıklarla tel değişimi ve ilerleme kaydı yapılır.' },
      { title: 'Pekiştirme', detail: 'Söküm sonrası pozisyon pekiştirme apareyiyle korunur.' },
    ],
    doctorIds: ['dr-nazli'],
    commitment: 'uzun',
    budget: 'ekonomik',
  },
];

const DOCTORS: Doctor[] = [
  {
    id: 'dr-elif',
    name: 'Dr. Dt. Elif Şahinkaya',
    shortName: 'Dr. Elif Şahinkaya',
    title: 'Kurucu Hekim',
    specialty: 'Estetik Diş Hekimliği & Gülüş Tasarımı',
    experienceYears: 14,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=75',
    focus: ['Lamina Veneer', 'Dijital Gülüş Tasarımı', 'Zirkonyum'],
    bio: 'Kliniğin dijital ölçü ve gülüş tasarımı akışını kuran hekim. Tedaviye başlamadan önce yüz oranlarını, konuşma çizgisini ve mevcut kapanışı ölçüp planı ekran üzerinde hastayla birlikte gözden geçiriyor.',
    expertise: [
      'Dijital gülüş tasarımı',
      'Laminate veneer uygulaması',
      'Zirkonyum kron ve köprü',
      'İmplant üstü protez',
    ],
    timeline: [
      { period: '2006 – 2011', title: 'Diş Hekimliği Fakültesi', place: 'İstanbul Üniversitesi' },
      { period: '2012 – 2013', title: 'Restoratif Tedavi Sertifika Programı', place: 'Marmara Üniversitesi Sürekli Eğitim' },
      { period: '2013 – 2019', title: 'Estetik Diş Hekimi', place: 'Özel klinik — Nişantaşı' },
      { period: '2019 – bugün', title: 'Kurucu Hekim', place: 'Vitalis Klinik' },
    ],
    languages: ['Türkçe', 'İngilizce'],
    workDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'dr-mert',
    name: 'Uzm. Dr. Dt. Mert Bozkurt',
    shortName: 'Dr. Mert Bozkurt',
    title: 'Ağız & Çene Cerrahisi Uzmanı',
    specialty: 'İmplantoloji ve İleri Cerrahi',
    experienceYears: 17,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=75',
    focus: ['All-on-4', 'Sinüs Lifting', 'Kemik Grefti'],
    bio: 'İmplant planlamasını 3B tomografi üzerinden cerrahi rehber hazırlayarak yürütüyor. Kemik hacmi sınırlı vakalarda greftleme ve sinüs tabanı yükseltme uygulamalarıyla ilgileniyor; cerrahi sonrası takvimi hastaya yazılı olarak teslim ediyor.',
    expertise: [
      'İmplant cerrahisi ve rehberli planlama',
      'Sinüs tabanı yükseltme',
      'Kemik greftleme',
      'Tam çene sabit protez cerrahisi',
    ],
    timeline: [
      { period: '2003 – 2008', title: 'Diş Hekimliği Fakültesi', place: 'Ege Üniversitesi' },
      { period: '2009 – 2013', title: 'Ağız, Diş ve Çene Cerrahisi Doktorası', place: 'Hacettepe Üniversitesi' },
      { period: '2013 – 2020', title: 'Cerrahi Sorumlu Hekim', place: 'Özel ağız ve diş sağlığı merkezi' },
      { period: '2020 – bugün', title: 'Cerrahi Birim Sorumlusu', place: 'Vitalis Klinik' },
    ],
    languages: ['Türkçe', 'İngilizce', 'Almanca'],
    workDays: [1, 3, 5, 6],
  },
  {
    id: 'dr-nazli',
    name: 'Dr. Dt. Nazlı Erkut',
    shortName: 'Dr. Nazlı Erkut',
    title: 'Ortodonti Uzmanı',
    specialty: 'Şeffaf Plak ve Sabit Ortodonti',
    experienceYears: 11,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=75',
    focus: ['Şeffaf Plak', 'Çocuk Ortodontisi', 'Pekiştirme'],
    bio: 'Şeffaf plak ve sabit ortodonti planlamasını dijital simülasyon üzerinden kuruyor. Yetişkin hastalarda görünürlük ve konuşma konforu beklentisini planın başında netleştirmeyi, çocuk hastalarda ise büyüme takvimine göre zamanlama yapmayı önceliklendiriyor.',
    expertise: [
      'Şeffaf plak tedavisi',
      'Sabit ortodontik tedavi',
      'Çocuk ve ergen ortodontisi',
      'Pekiştirme dönemi takibi',
    ],
    timeline: [
      { period: '2009 – 2014', title: 'Diş Hekimliği Fakültesi', place: 'Ankara Üniversitesi' },
      { period: '2015 – 2019', title: 'Ortodonti Uzmanlık Eğitimi', place: 'İstanbul Üniversitesi' },
      { period: '2019 – 2022', title: 'Ortodonti Uzmanı', place: 'Özel klinik — Kadıköy' },
      { period: '2022 – bugün', title: 'Ortodonti Birim Sorumlusu', place: 'Vitalis Klinik' },
    ],
    languages: ['Türkçe', 'İngilizce'],
    workDays: [2, 3, 4, 5, 6],
  },
];

const TRUST_BADGES: TrustBadge[] = [
  { id: 'b1', label: 'Yıl Klinik Deneyimi', value: '12', icon: ShieldCheck },
  { id: 'b2', label: 'Uzman Hekim', value: '3', icon: Stethoscope },
  { id: 'b3', label: 'Tanımlı Tedavi Protokolü', value: '6', icon: ClipboardList },
  { id: 'b4', label: 'Önce Ücretsiz Randevu Değişikliği', value: '24 sa', icon: CalendarCheck },
];

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'j1',
    title: 'Ön görüşme',
    detail: 'Şikayetiniz, beklentiniz ve varsa mevcut tedavi geçmişiniz telefonda kaydedilir.',
    icon: PhoneCall,
  },
  {
    id: 'j2',
    title: 'Klinik muayene',
    detail: 'Panoramik röntgen, ağız içi tarama ve gerektiğinde 3B tomografi aynı randevuda alınır.',
    icon: Search,
  },
  {
    id: 'j3',
    title: 'Plan ve yazılı teklif',
    detail: 'Seans sayısı, süre ve ücret aralığı yazılı bir plan olarak teslim edilir.',
    icon: ClipboardList,
  },
  {
    id: 'j4',
    title: 'Tedavi seansları',
    detail: 'Planı hazırlayan hekim tedaviyi baştan sona kendisi yürütür; hekim değişikliği yapılmaz.',
    icon: Activity,
  },
  {
    id: 'j5',
    title: 'Kontrol ve bakım',
    detail: 'Tedavi tipine göre kontrol takvimi oluşturulur, hatırlatmalar SMS ile iletilir.',
    icon: CalendarDays,
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 'hedef',
    question: 'Önceliğiniz hangisine daha yakın?',
    options: [
      { id: 'eksik', label: 'Eksik dişlerimi tamamlamak', hint: 'İmplant ve sabit protez seçenekleri' },
      { id: 'estetik', label: 'Ön dişlerimin form ve rengini düzenlemek', hint: 'Kaplama ve laminate seçenekleri' },
      { id: 'dizilim', label: 'Diş dizilimimi ve kapanışımı düzeltmek', hint: 'Ortodontik tedavi seçenekleri' },
    ],
  },
  {
    id: 'sure',
    question: 'Tedaviye ne kadar zaman ayırabilirsiniz?',
    options: [
      { id: 'kisa', label: 'Birkaç seansta tamamlansın', hint: 'Kısa takvimli planlar' },
      { id: 'orta', label: 'Birkaç aya yayılabilir', hint: 'Orta vadeli planlar' },
      { id: 'uzun', label: 'Bir yıl ve üzeri sürebilir', hint: 'Uzun takipli planlar' },
    ],
  },
  {
    id: 'butce',
    question: 'Bütçe planınız hangisine yakın?',
    options: [
      { id: 'ekonomik', label: 'Kademeli ilerleyen ölçülü bir plan', hint: 'Aşamalı ödeme takvimi' },
      { id: 'dengeli', label: 'Orta ölçekli, dengeli bir plan', hint: 'Bölüm bölüm tamamlanan tedavi' },
      { id: 'kapsamli', label: 'Kapsamlı ve bütüncül bir çözüm', hint: 'Tek planda toplanan tedavi' },
    ],
  },
];

/** Hafta içi randevu ızgarası. */
const WEEKDAY_SLOTS: readonly string[] = [
  '09:00',
  '09:45',
  '10:30',
  '11:15',
  '13:30',
  '14:15',
  '15:00',
  '15:45',
  '16:30',
  '17:15',
];

/** Cumartesi kliniğin çalışma saati kısa; ızgara da kısalıyor. */
const SATURDAY_SLOTS: readonly string[] = [
  '10:00',
  '10:45',
  '11:30',
  '12:15',
  '13:00',
  '13:45',
  '14:30',
  '15:15',
];

const WEEKDAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'] as const;
const WEEKDAYS_LONG = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
] as const;
const MONTHS_LONG = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
] as const;
const MONTHS_SHORT = [
  'Oca',
  'Şub',
  'Mar',
  'Nis',
  'May',
  'Haz',
  'Tem',
  'Ağu',
  'Eyl',
  'Eki',
  'Kas',
  'Ara',
] as const;

/**
 * Takvim şeridi sabit bir başlangıç gününden üretilir.
 * Date.now() kullanmıyoruz: sunucu ve istemci aynı çıktıyı üretsin (hydration)
 * ve doluluk tablosu her açılışta aynı kalsın.
 */
const CALENDAR_ANCHOR = '2026-08-18';
const CALENDAR_LENGTH = 14;

const CATEGORY_OPTIONS: readonly (TreatmentCategory | 'Tümü')[] = [
  'Tümü',
  'İmplantoloji',
  'Estetik Diş Hekimliği',
  'Ortodonti',
];

const WIZARD_STEPS: readonly { id: string; label: string; short: string }[] = [
  { id: 'secim', label: 'Tedavi & Hekim', short: 'Tedavi' },
  { id: 'takvim', label: 'Tarih & Saat', short: 'Takvim' },
  { id: 'iletisim', label: 'İletişim', short: 'İletişim' },
  { id: 'onay', label: 'Onay', short: 'Onay' },
];

/* ------------------------------- Yardımcılar ------------------------------- */

/** Türkçe karakterli aramada "İ/ı" farkları eşleşmeyi bozmasın diye normalize ediyoruz. */
function normalize(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('İ', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

/** FNV-1a: kısa, bağımlılıksız ve tamamen deterministik bir karma. */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

/** ISO tarihe gün ekler. Yerel ayrıştırma + yerel okuma yaptığımız için saat dilimi etkisi yok. */
function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

interface DateParts {
  day: number;
  monthIndex: number;
  monthLong: string;
  monthShort: string;
  weekdayIndex: number;
  weekdayLong: string;
  weekdayShort: string;
}

function dateParts(iso: string): DateParts {
  const [year, month, day] = iso.split('-').map(Number);
  const weekdayIndex = new Date(year, month - 1, day).getDay();
  return {
    day,
    monthIndex: month - 1,
    monthLong: MONTHS_LONG[month - 1],
    monthShort: MONTHS_SHORT[month - 1],
    weekdayIndex,
    weekdayLong: WEEKDAYS_LONG[weekdayIndex],
    weekdayShort: WEEKDAYS_SHORT[weekdayIndex],
  };
}

/** "12 Eylül Perşembe" biçimi — özet kartı ve onay ekranı aynı metni kullanır. */
function formatLongDate(iso: string): string {
  const parts = dateParts(iso);
  return `${parts.day} ${parts.monthLong} ${parts.weekdayLong}`;
}

const CALENDAR_DAYS: readonly string[] = Array.from({ length: CALENDAR_LENGTH }, (_, index) =>
  addDays(CALENDAR_ANCHOR, index),
);

/** Klinik pazar günü kapalı; cumartesi kısa gün. */
function slotsForDate(iso: string): readonly string[] {
  const { weekdayIndex } = dateParts(iso);
  if (weekdayIndex === 0) return [];
  return weekdayIndex === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
}

/**
 * Doluluk tamamen tarih + hekim + saat üçlüsünün karmasından türetiliyor.
 * Aynı gün her açılışta aynı görünsün diye rastgelelik kullanılmıyor.
 */
function isSlotFree(iso: string, doctorId: string, slot: string): boolean {
  return hashString(`${iso}#${doctorId}#${slot}`) % 10 >= 3;
}

function freeSlotCount(iso: string, doctor: Doctor | null): number {
  if (!doctor) return 0;
  if (!doctor.workDays.includes(dateParts(iso).weekdayIndex)) return 0;
  return slotsForDate(iso).filter((slot) => isSlotFree(iso, doctor.id, slot)).length;
}

function doctorsForTreatment(treatment: Treatment | null): Doctor[] {
  if (!treatment) return DOCTORS;
  return DOCTORS.filter((doctor) => treatment.doctorIds.includes(doctor.id));
}

function findTreatment(id: string | null): Treatment | null {
  return TREATMENTS.find((treatment) => treatment.id === id) ?? null;
}

function findDoctor(id: string | null): Doctor | null {
  return DOCTORS.find((doctor) => doctor.id === id) ?? null;
}

/** Telefon doğrulaması: biçimden bağımsız, en az 10 rakam. */
function digitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

/* ----------------------------- Alt Bileşenler ------------------------------ */

interface DialogShellProps {
  labelledBy: string;
  onClose: () => void;
  closeLabel: string;
  children: React.ReactNode;
  reduceMotion: boolean;
}

/**
 * Ortak modal kabuğu: role="dialog", Escape, gerçek <button> arka plan,
 * odak içeri alma ve basit odak tuzağı. İki modal da bunu kullanıyor.
 */
function DialogShell({ labelledBy, onClose, closeLabel, children, reduceMotion }: DialogShellProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    panel?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null || element === panel);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Modal açıkken arka planın kaymasını engelle.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const panelMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
        transition: { duration: 0.2 },
      };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-4 md:items-center md:p-8"
    >
      {/* Arka plan da gerçek buton: fare ile kapatma div onClick olmadan çalışsın. */}
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        {...panelMotion}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl focus:outline-none"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- Ana Bileşen ------------------------------- */

export default function ClinicPage() {
  const reduceMotion = useReducedMotion() ?? false;

  /* --- Tedavi filtreleri --- */
  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategory | 'Tümü'>('Tümü');
  const [query, setQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<string>('Tümü');

  /* --- Modallar --- */
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);
  const [activeTreatmentId, setActiveTreatmentId] = useState<string | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  /* --- Mini test --- */
  const [quizAnswers, setQuizAnswers] = useState<(string | null)[]>([null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  /* --- Randevu sihirbazı --- */
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [treatmentId, setTreatmentId] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openWhatsApp = useCallback((message: string) => {
    window.open(whatsAppLink(message), '_blank', 'noopener,noreferrer');
  }, []);

  /* ------------------------------ Türetilmişler ----------------------------- */

  const filteredTreatments = useMemo(() => {
    const q = normalize(query.trim());
    return TREATMENTS.filter((treatment) => {
      const matchCategory = selectedCategory === 'Tümü' || treatment.category === selectedCategory;
      const matchDoctor = doctorFilter === 'Tümü' || treatment.doctorIds.includes(doctorFilter);
      const matchQuery =
        q.length === 0 ||
        [treatment.name, treatment.category, treatment.description, treatment.sessions, ...treatment.steps.map((s) => s.title)].some(
          (field) => normalize(field).includes(q),
        );
      return matchCategory && matchDoctor && matchQuery;
    });
  }, [query, selectedCategory, doctorFilter]);

  const isFiltered = query.trim() !== '' || selectedCategory !== 'Tümü' || doctorFilter !== 'Tümü';

  const resetFilters = useCallback(() => {
    setQuery('');
    setSelectedCategory('Tümü');
    setDoctorFilter('Tümü');
  }, []);

  const activeDoctor = useMemo(() => findDoctor(activeDoctorId), [activeDoctorId]);
  const activeTreatment = useMemo(() => findTreatment(activeTreatmentId), [activeTreatmentId]);

  const chosenTreatment = useMemo(() => findTreatment(treatmentId), [treatmentId]);
  const chosenDoctor = useMemo(() => findDoctor(doctorId), [doctorId]);
  const eligibleDoctors = useMemo(() => doctorsForTreatment(chosenTreatment), [chosenTreatment]);

  const daySummaries = useMemo(
    () =>
      CALENDAR_DAYS.map((iso) => ({
        iso,
        parts: dateParts(iso),
        free: freeSlotCount(iso, chosenDoctor),
      })),
    [chosenDoctor],
  );

  const daySlots = useMemo(() => {
    if (!selectedDate || !chosenDoctor) return [];
    return slotsForDate(selectedDate).map((slot) => ({
      slot,
      free: isSlotFree(selectedDate, chosenDoctor.id, slot),
    }));
  }, [selectedDate, chosenDoctor]);

  /** Canlı özet metni: "Dr. X ile 12 Eylül Perşembe 14:30, Tedavi adı". */
  const summaryLine = useMemo(() => {
    if (!chosenDoctor || !chosenTreatment) return null;
    const datePart = selectedDate ? formatLongDate(selectedDate) : 'tarih seçilmedi';
    const timePart = selectedTime ?? '--:--';
    return `${chosenDoctor.shortName} ile ${datePart} ${timePart}, ${chosenTreatment.name}`;
  }, [chosenDoctor, chosenTreatment, selectedDate, selectedTime]);

  /* -------------------------------- Eylemler -------------------------------- */

  /**
   * Modal kapanırken gövdedeki scroll kilidi çıkış animasyonu bitince kalkıyor;
   * kaydırmayı o yüzden küçük bir gecikmeyle tetikliyoruz.
   */
  const scrollToAppointment = useCallback(
    (delay = 0) => {
      const run = () =>
        document.getElementById('randevu')?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      if (delay > 0) window.setTimeout(run, delay);
      else run();
    },
    [reduceMotion],
  );

  /** Tedavi seçimi hekim listesini daraltır; uyumsuz hekim ve saat temizlenir. */
  const chooseTreatment = useCallback(
    (id: string) => {
      const treatment = findTreatment(id);
      setTreatmentId(id);
      setFormError(null);
      setIsSubmitted(false);
      setSelectedTime(null);
      if (treatment && (!doctorId || !treatment.doctorIds.includes(doctorId))) {
        const nextDoctorId = treatment.doctorIds[0] ?? null;
        setDoctorId(nextDoctorId);
        const nextDoctor = findDoctor(nextDoctorId);
        if (selectedDate && freeSlotCount(selectedDate, nextDoctor) === 0) setSelectedDate(null);
      }
    },
    [doctorId, selectedDate],
  );

  const chooseDoctor = useCallback(
    (id: string) => {
      setDoctorId(id);
      setFormError(null);
      setIsSubmitted(false);
      setSelectedTime(null);
      const nextDoctor = findDoctor(id);
      if (selectedDate && freeSlotCount(selectedDate, nextDoctor) === 0) setSelectedDate(null);
    },
    [selectedDate],
  );

  /** Kart / modal / test sonucundan gelen ön doldurma tek kapıdan geçiyor. */
  const prefillAppointment = useCallback(
    (nextTreatmentId: string, nextDoctorId?: string) => {
      const treatment = findTreatment(nextTreatmentId);
      const resolvedDoctorId =
        nextDoctorId && treatment?.doctorIds.includes(nextDoctorId)
          ? nextDoctorId
          : treatment?.doctorIds[0] ?? null;

      setTreatmentId(nextTreatmentId);
      setDoctorId(resolvedDoctorId);
      setSelectedTime(null);
      setIsSubmitted(false);
      setFormError(null);
      setStep(0);
      setMaxStep((current) => Math.max(current, 0));

      const doctor = findDoctor(resolvedDoctorId);
      if (selectedDate && freeSlotCount(selectedDate, doctor) === 0) setSelectedDate(null);
    },
    [selectedDate],
  );

  /**
   * Odak hedefini yalnızca sayfadan modala ilk geçişte kaydediyoruz;
   * modal içinden başka bir modal açılırsa kapanışta odak sayfaya döner.
   */
  const rememberTrigger = useCallback(() => {
    if (activeDoctorId || activeTreatmentId) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
  }, [activeDoctorId, activeTreatmentId]);

  const openDoctorModal = useCallback(
    (id: string) => {
      rememberTrigger();
      setActiveTreatmentId(null);
      setActiveDoctorId(id);
    },
    [rememberTrigger],
  );

  const openTreatmentModal = useCallback(
    (id: string) => {
      rememberTrigger();
      setActiveDoctorId(null);
      setActiveTreatmentId(id);
    },
    [rememberTrigger],
  );

  /** Odak kapanışta tetikleyen öğeye geri döner. */
  const closeModals = useCallback(() => {
    setActiveDoctorId(null);
    setActiveTreatmentId(null);
    const target = lastFocusedRef.current;
    lastFocusedRef.current = null;
    if (target && typeof target.focus === 'function') {
      window.setTimeout(() => target.focus(), 0);
    }
  }, []);

  /* --------------------------------- Test ---------------------------------- */

  const setQuizAnswer = useCallback((questionIndex: number, optionId: string) => {
    setQuizAnswers((current) => {
      const next = [...current];
      next[questionIndex] = optionId;
      return next;
    });
    setQuizSubmitted(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizAnswers([null, null, null]);
    setQuizSubmitted(false);
  }, []);

  const quizComplete = quizAnswers.every((answer) => answer !== null);

  /**
   * Puanlama tamamen deterministik: kategori 4, süre 2, bütçe 2 puan.
   * Eşitlikte TREATMENTS dizisindeki sıra belirleyici olur.
   */
  const quizResult = useMemo(() => {
    if (!quizComplete) return null;
    const [goal, commitment, budget] = quizAnswers as [string, string, string];
    const goalCategory: Record<string, TreatmentCategory> = {
      eksik: 'İmplantoloji',
      estetik: 'Estetik Diş Hekimliği',
      dizilim: 'Ortodonti',
    };
    const targetCategory = goalCategory[goal];

    let best = TREATMENTS[0];
    let bestScore = -1;
    for (const treatment of TREATMENTS) {
      const score =
        (treatment.category === targetCategory ? 4 : 0) +
        (treatment.commitment === commitment ? 2 : 0) +
        (treatment.budget === budget ? 2 : 0);
      if (score > bestScore) {
        best = treatment;
        bestScore = score;
      }
    }

    const doctor = findDoctor(best.doctorIds[0]);
    return { treatment: best, doctor, category: targetCategory };
  }, [quizAnswers, quizComplete]);

  /* ------------------------------- Sihirbaz -------------------------------- */

  const validateStep = useCallback(
    (index: number): string | null => {
      if (index === 0) {
        if (!treatmentId) return 'Devam etmek için bir tedavi seçin.';
        if (!doctorId) return 'Devam etmek için bir hekim seçin.';
        return null;
      }
      if (index === 1) {
        if (!selectedDate) return 'Takvimden uygun bir gün seçin.';
        if (!selectedTime) return 'Seçtiğiniz gün için bir saat seçin.';
        return null;
      }
      if (index === 2) {
        if (fullName.trim().length < 3) return 'Ad soyad en az 3 karakter olmalı.';
        if (digitCount(phone) < 10) return 'Telefon numarasını en az 10 hane olacak şekilde girin.';
        if (email.trim() !== '' && !email.includes('@')) return 'E-posta adresi geçerli görünmüyor.';
        return null;
      }
      return null;
    },
    [treatmentId, doctorId, selectedDate, selectedTime, fullName, phone, email],
  );

  const goNext = useCallback(() => {
    const problem = validateStep(step);
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError(null);
    const next = Math.min(step + 1, WIZARD_STEPS.length - 1);
    setStep(next);
    setMaxStep((current) => Math.max(current, next));
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setFormError(null);
    setStep((current) => Math.max(0, current - 1));
  }, []);

  const jumpToStep = useCallback(
    (index: number) => {
      if (index > maxStep) return;
      setFormError(null);
      setStep(index);
    },
    [maxStep],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Son adıma kadar tüm adımlar tekrar doğrulanır; klavye ile atlanmış olabilir.
      for (let index = 0; index < WIZARD_STEPS.length - 1; index += 1) {
        const problem = validateStep(index);
        if (problem) {
          setFormError(problem);
          setStep(index);
          return;
        }
      }
      setFormError(null);
      setIsSubmitted(true);
    },
    [validateStep],
  );

  const resetAppointment = useCallback(() => {
    setIsSubmitted(false);
    setStep(0);
    setMaxStep(0);
    setFormError(null);
    setTreatmentId(null);
    setDoctorId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setNote('');
  }, []);

  /* --------------------------------- Render -------------------------------- */

  const cardMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { duration: 0.25 },
      };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100">
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

        <nav className="flex min-w-0 items-center gap-4 text-xs font-medium text-slate-300 md:gap-6">
          <a href="#tedaviler" className="hidden transition-colors hover:text-teal-400 md:inline">
            Tedaviler
          </a>
          <a href="#hekimler" className="hidden transition-colors hover:text-teal-400 lg:inline">
            Hekim Kadrosu
          </a>
          <a href="#eslestirme" className="hidden transition-colors hover:text-teal-400 lg:inline">
            Tedavi Eşleştirme
          </a>
          <a href="#randevu" className="hidden transition-colors hover:text-teal-400 md:inline">
            Randevu
          </a>
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                'Merhaba Vitalis Klinik, tedaviler ve randevu hakkında bilgi almak istiyorum.',
              )
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:from-teal-400 hover:to-emerald-400"
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
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { duration: 0.5 }}
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-teal-400 sm:w-auto"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Ücretsiz Muayene Randevusu
            </a>
            <a
              href="#eslestirme"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-xs font-semibold text-slate-300 transition-all hover:border-teal-500/40 hover:text-teal-300 sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-teal-400" aria-hidden="true" />
              Tedavi Eşleştirme Testi
            </a>
          </div>

          {/* Güven rozetleri */}
          <div className="grid grid-cols-2 gap-3 pt-8 md:grid-cols-4">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center"
                >
                  <Icon className="mx-auto mb-2 h-5 w-5 text-teal-400" aria-hidden="true" />
                  <div className="text-xl font-bold text-white">{badge.value}</div>
                  <div className="text-[11px] leading-snug text-slate-400">{badge.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Tedavi Eşleştirme Testi */}
      <section
        id="eslestirme"
        className="scroll-mt-24 border-y border-slate-800 bg-slate-900/40 px-6 py-16 md:px-16"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />3 soruda ön yönlendirme
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
              Hangi tedavi ve hekim size uygun?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-400 md:text-sm">
              Üç kısa soruyu yanıtlayın; beklentinize en yakın tedavi protokolünü ve bu protokolü
              yürüten hekimi gösterelim. Sonucu tek tıkla randevu formuna aktarabilirsiniz.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {QUIZ.map((question, questionIndex) => (
              <fieldset
                key={question.id}
                className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <legend className="px-1 text-xs font-semibold text-white">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-slate-950">
                    {questionIndex + 1}
                  </span>
                  {question.question}
                </legend>
                <div className="mt-3 space-y-2">
                  {question.options.map((option) => {
                    const active = quizAnswers[questionIndex] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setQuizAnswer(questionIndex, option.id)}
                        className={`flex min-h-[44px] w-full flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                          active
                            ? 'border-teal-400 bg-teal-500/15 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-teal-500/40 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-semibold leading-snug">{option.label}</span>
                        <span className="text-[10px] text-slate-500">{option.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={!quizComplete}
              className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-teal-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Eşleştirmeyi Göster
            </button>
            <button
              type="button"
              onClick={resetQuiz}
              className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300 sm:w-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Yanıtları Temizle
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-500" aria-live="polite">
            {quizComplete
              ? 'Üç soru da yanıtlandı.'
              : `${quizAnswers.filter(Boolean).length}/3 soru yanıtlandı.`}
          </p>

          <AnimatePresence initial={false}>
            {quizSubmitted && quizResult && (
              <motion.div
                key="quiz-result"
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                className="mt-6 rounded-2xl border border-teal-500/30 bg-teal-500/5 p-5 md:p-6"
                role="status"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-300">
                      Yanıtlarınıza en yakın protokol
                    </span>
                    <h3 className="text-lg font-bold text-white">{quizResult.treatment.name}</h3>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {quizResult.treatment.description}
                    </p>
                    <dl className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      <div className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5">
                        <dt className="inline text-slate-500">Kategori: </dt>
                        <dd className="inline font-semibold text-white">
                          {quizResult.treatment.category}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5">
                        <dt className="inline text-slate-500">Plan: </dt>
                        <dd className="inline font-semibold text-white">
                          {quizResult.treatment.sessions}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5">
                        <dt className="inline text-slate-500">Ücret aralığı: </dt>
                        <dd className="inline font-semibold text-teal-300">
                          {quizResult.treatment.priceRange}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {quizResult.doctor && (
                    <div className="w-full shrink-0 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:w-64">
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          <SafeImage
                            accent="text-teal-400"
                            src={quizResult.doctor.image}
                            alt={`${quizResult.doctor.name} portresi`}
                            fill
                            sizes="48px"
                            className="object-cover object-top"
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-white">
                            {quizResult.doctor.shortName}
                          </p>
                          <p className="text-[10px] text-teal-300">{quizResult.doctor.title}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                        Bu protokolü {quizResult.doctor.shortName} yürütüyor.
                      </p>
                      <button
                        type="button"
                        onClick={() => openDoctorModal(quizResult.doctor!.id)}
                        className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                      >
                        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                        Hekim Profilini Aç
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-teal-500/20 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      prefillAppointment(quizResult.treatment.id, quizResult.doctor?.id);
                      scrollToAppointment();
                    }}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-colors hover:bg-teal-400"
                  >
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Randevu Formuna Aktar
                  </button>
                  <button
                    type="button"
                    onClick={() => openTreatmentModal(quizResult.treatment.id)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                  >
                    <ClipboardList className="h-4 w-4" aria-hidden="true" />
                    Tedavi Detayını İncele
                  </button>
                </div>

                <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden="true" />
                  Bu eşleştirme yalnızca ön bilgilendirme amaçlıdır ve muayene yerine geçmez. Kesin
                  tedavi planı klinik muayene ve görüntüleme sonrası hekiminiz tarafından belirlenir.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tedaviler */}
      <section id="tedaviler" className="scroll-mt-24 px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Tedavilerimiz</h2>
            <p className="mt-1 text-xs text-slate-400">
              Her tedavinin süresi, seans sayısı, iyileşme süreci ve ücret aralığı kart detayında
              yazılıdır. Fiyatlar muayene sonrası planlamaya göre değişebilir.
            </p>
          </div>

          {/* Filtre paneli */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="min-w-0 lg:col-span-2">
                <label htmlFor="tedavi-ara" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  Tedavi ara (ad, kategori, süreç adımı)
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="tedavi-ara"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Örn. implant, plak, kaplama..."
                    className="min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="hekim-filtre" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  Hekime göre
                </label>
                <select
                  id="hekim-filtre"
                  value={doctorFilter}
                  onChange={(event) => setDoctorFilter(event.target.value)}
                  className="min-h-[44px] w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="Tümü" className="bg-slate-900">
                    Tüm hekimler
                  </option>
                  {DOCTORS.map((doctor) => (
                    <option key={doctor.id} value={doctor.id} className="bg-slate-900">
                      {doctor.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">Kategori:</span>
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[40px] cursor-pointer rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-teal-500 font-bold text-slate-950 shadow-lg'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300" aria-live="polite">
              <span className="font-bold text-teal-400">{filteredTreatments.length}</span> tedavi
              listeleniyor
              <span className="text-slate-500"> / toplam {TREATMENTS.length}</span>
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-[40px] items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Filtreleri Temizle
              </button>
            )}
          </div>

          {filteredTreatments.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center md:p-12">
              <Stethoscope className="mx-auto h-10 w-10 text-teal-400/60" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-white">
                Bu kriterlere uyan tedavi bulunamadı
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400">
                Arama metnini kısaltmayı veya hekim filtresini kaldırmayı deneyin. Aradığınız
                uygulama listede yoksa hasta danışmanımız doğru birime yönlendirebilir.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[40px] rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-teal-400"
                >
                  Filtreleri Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp(
                      'Merhaba, aradığım tedaviyi listede bulamadım. Doğru birime yönlendirir misiniz?',
                    )
                  }
                  className="min-h-[40px] rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                >
                  Danışmana Sor
                </button>
              </div>
            </div>
          ) : (
            <motion.div layout={!reduceMotion} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTreatments.map((treatment) => {
                  const performers = doctorsForTreatment(treatment);
                  return (
                    <motion.article
                      key={treatment.id}
                      layout={!reduceMotion}
                      {...cardMotion}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-teal-500/50"
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

                      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                        <h3 className="text-base font-bold text-white transition-colors group-hover:text-teal-300">
                          {treatment.name}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-400">
                          {treatment.description}
                        </p>

                        <dl className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                            <dt className="flex items-center gap-1 text-slate-500">
                              <Clock className="h-3 w-3 text-teal-400" aria-hidden="true" />
                              Seans Süresi
                            </dt>
                            <dd className="mt-0.5 font-semibold text-white">{treatment.duration}</dd>
                          </div>
                          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                            <dt className="flex items-center gap-1 text-slate-500">
                              <CalendarCheck className="h-3 w-3 text-teal-400" aria-hidden="true" />
                              Plan
                            </dt>
                            <dd className="mt-0.5 font-semibold text-white">{treatment.sessions}</dd>
                          </div>
                        </dl>

                        <ul className="flex flex-wrap gap-1.5">
                          {performers.map((doctor) => (
                            <li
                              key={doctor.id}
                              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-slate-400"
                            >
                              {doctor.shortName}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto border-t border-slate-800/70 pt-3">
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Wallet className="h-3 w-3 text-teal-400" aria-hidden="true" />
                            Fiyat Aralığı
                          </span>
                          <span className="text-sm font-bold text-teal-400">
                            {treatment.priceRange}
                          </span>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openTreatmentModal(treatment.id)}
                              className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                            >
                              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                              Detaylar
                            </button>
                            <a
                              href="#randevu"
                              onClick={() => prefillAppointment(treatment.id)}
                              className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-500 px-3 py-2 text-[11px] font-bold text-slate-950 transition-colors hover:bg-teal-400"
                            >
                              <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              Randevu Al
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
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
              değişikliği yapmıyoruz. Ayrıntılı profil için hekim kartına dokunun.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOCTORS.map((doctor) => {
              const treatments = TREATMENTS.filter((treatment) =>
                treatment.doctorIds.includes(doctor.id),
              );
              return (
                <article
                  key={doctor.id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 transition-colors hover:border-emerald-500/40"
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
                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                    <div className="min-w-0">
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
                    <p className="text-[11px] text-slate-500">
                      {treatments.length} tedavi protokolü •{' '}
                      {doctor.workDays.map((day) => WEEKDAYS_SHORT[day]).join(', ')}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => openDoctorModal(doctor.id)}
                        className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                      >
                        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                        Hekim Profili
                      </button>
                      <a
                        href="#randevu"
                        onClick={() => {
                          const first = treatments[0];
                          if (first) prefillAppointment(first.id, doctor.id);
                        }}
                        className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-500 px-3 py-2 text-[11px] font-bold text-slate-950 transition-colors hover:bg-teal-400"
                      >
                        <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Randevu Al
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Randevu Sihirbazı */}
      <section id="randevu" className="scroll-mt-24 px-6 py-16 md:px-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0 space-y-4">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Online Randevu</h2>
            <p className="text-sm text-slate-400">
              İlk muayene ve tedavi planlaması ücretsizdir. Dört adımda hekiminizi, saatinizi ve
              iletişim bilgilerinizi bırakın; hasta danışmanımız aynı gün arayarak teyit etsin.
            </p>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span className="min-w-0">
                  Panoramik röntgen ve ağız içi tarama ilk muayeneye dahildir.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span className="min-w-0">
                  Tedavi planınızı yazılı fiyat teklifiyle birlikte teslim ediyoruz.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span className="min-w-0">
                  Randevu değişikliğini 24 saat öncesine kadar ücretsiz yapabilirsiniz.
                </span>
              </li>
            </ul>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                <span className="min-w-0">
                  Teşvikiye Mah. Vali Konağı Cad. No: 48, Şişli / İstanbul
                </span>
              </p>
              <p className="mt-2 flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                <span className="min-w-0">Hafta içi 09:00 – 19:00 • Cumartesi 10:00 – 16:00</span>
              </p>
              <p className="mt-2 flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                <span className="min-w-0 break-words">randevu@vitalisklinik.example</span>
              </p>
            </div>

            {/* Canlı özet kartı — hangi adımda olursanız olun seçimlerinizi gösterir. */}
            <div
              className="rounded-2xl border border-teal-500/25 bg-teal-500/5 p-5"
              aria-live="polite"
            >
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-teal-300">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Randevu Özeti
              </span>
              {summaryLine ? (
                <>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-white">
                    {summaryLine}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                      <dt className="text-slate-500">Seans süresi</dt>
                      <dd className="mt-0.5 font-semibold text-white">
                        {chosenTreatment?.duration ?? '—'}
                      </dd>
                    </div>
                    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                      <dt className="text-slate-500">Ücret aralığı</dt>
                      <dd className="mt-0.5 font-semibold text-teal-300">
                        {chosenTreatment?.priceRange ?? '—'}
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Henüz seçim yapılmadı. İlk adımda tedavi ve hekim seçtiğinizde özet burada
                  güncellenecek.
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
            <AnimatePresence mode="wait" initial={false}>
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  className="space-y-4 py-4 text-center"
                  role="status"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-white">Randevu Talebiniz Alındı</h3>
                  <p className="text-xs text-slate-400">
                    {fullName.trim() ? `Sayın ${fullName.trim()}, ` : ''}talebiniz kaydedildi. Hasta
                    danışmanımız {phone} numarasından arayarak saati teyit edecek.
                  </p>

                  <dl className="mx-auto max-w-sm space-y-2 text-left text-[11px]">
                    {[
                      { label: 'Tedavi', value: chosenTreatment?.name ?? '—' },
                      { label: 'Hekim', value: chosenDoctor?.name ?? '—' },
                      {
                        label: 'Tarih',
                        value: selectedDate ? formatLongDate(selectedDate) : '—',
                      },
                      { label: 'Saat', value: selectedTime ?? '—' },
                      { label: 'Ücret aralığı', value: chosenTreatment?.priceRange ?? '—' },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                      >
                        <dt className="shrink-0 text-slate-500">{row.label}</dt>
                        <dd className="min-w-0 text-right font-semibold text-white">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {note.trim() && (
                    <p className="mx-auto max-w-sm rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Notunuz: </span>
                      {note.trim()}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={resetAppointment}
                      className="min-h-[44px] rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                    >
                      Yeni Randevu Oluştur
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          `Merhaba, ${chosenTreatment?.name ?? 'tedavi'} için ${
                            selectedDate ? formatLongDate(selectedDate) : ''
                          } ${selectedTime ?? ''} randevu talebimi teyit eder misiniz?`,
                        )
                      }
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-teal-400"
                    >
                      <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
                      WhatsApp&apos;tan Teyit Et
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-600">
                    Bu bir demo formudur; bilgiler hiçbir yere gönderilmez.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={reduceMotion ? undefined : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {/* Adım göstergesi */}
                  <ol className="flex items-stretch gap-1.5">
                    {WIZARD_STEPS.map((wizardStep, index) => {
                      const isActive = index === step;
                      const isDone = index < step;
                      const reachable = index <= maxStep;
                      return (
                        <li key={wizardStep.id} className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => jumpToStep(index)}
                            disabled={!reachable}
                            aria-current={isActive ? 'step' : undefined}
                            aria-label={`Adım ${index + 1}: ${wizardStep.label}`}
                            className={`flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 transition-colors ${
                              isActive
                                ? 'border-teal-400 bg-teal-500/15'
                                : isDone
                                  ? 'border-emerald-500/30 bg-emerald-500/5'
                                  : 'border-slate-800 bg-slate-950'
                            } ${reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-teal-500 text-slate-950'
                                  : isDone
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isDone ? '✓' : index + 1}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`w-full truncate text-center text-[10px] font-medium ${
                                isActive ? 'text-teal-200' : 'text-slate-500'
                              }`}
                            >
                              <span className="sm:hidden">{wizardStep.short}</span>
                              <span className="hidden sm:inline">{wizardStep.label}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>

                  {formError && (
                    <p
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] text-rose-200"
                    >
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">{formError}</span>
                    </p>
                  )}

                  {/* Adım 1 — Tedavi & Hekim */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <fieldset>
                        <legend className="mb-2 text-xs font-bold text-white">
                          1. Tedavi seçin
                        </legend>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {TREATMENTS.map((treatment) => {
                            const active = treatmentId === treatment.id;
                            return (
                              <button
                                key={treatment.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => chooseTreatment(treatment.id)}
                                className={`flex min-h-[56px] min-w-0 flex-col items-start justify-center rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                  active
                                    ? 'border-teal-400 bg-teal-500/15 text-white'
                                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-teal-500/40 hover:text-white'
                                }`}
                              >
                                <span className="w-full truncate text-xs font-semibold">
                                  {treatment.name}
                                </span>
                                <span className="w-full truncate text-[10px] text-slate-500">
                                  {treatment.category} • {treatment.duration}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="mb-2 text-xs font-bold text-white">2. Hekim seçin</legend>
                        {!chosenTreatment ? (
                          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-950 px-3 py-4 text-center text-[11px] text-slate-500">
                            Önce bir tedavi seçin; bu tedaviyi yürüten hekimler burada listelenecek.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {eligibleDoctors.map((doctor) => {
                              const active = doctorId === doctor.id;
                              return (
                                <button
                                  key={doctor.id}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() => chooseDoctor(doctor.id)}
                                  className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                    active
                                      ? 'border-teal-400 bg-teal-500/15'
                                      : 'border-slate-800 bg-slate-950 hover:border-teal-500/40'
                                  }`}
                                >
                                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <SafeImage
                                      accent="text-teal-400"
                                      src={doctor.image}
                                      alt=""
                                      fill
                                      sizes="40px"
                                      className="object-cover object-top"
                                    />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs font-semibold text-white">
                                      {doctor.name}
                                    </span>
                                    <span className="block truncate text-[10px] text-slate-500">
                                      {doctor.title} •{' '}
                                      {doctor.workDays.map((day) => WEEKDAYS_SHORT[day]).join(', ')}
                                    </span>
                                  </span>
                                  {active && (
                                    <CheckCircle2
                                      className="h-4 w-4 shrink-0 text-teal-400"
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </fieldset>
                    </div>
                  )}

                  {/* Adım 2 — Tarih & Saat */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">Uygun gün seçin</h4>
                          <span className="text-[10px] text-slate-500">
                            14 günlük takvim • yatay kaydırın
                          </span>
                        </div>

                        {/* Şerit kendi kabında kayar; sayfa yatay taşmaz. */}
                        <div className="-mx-1 overflow-x-auto px-1 pb-2">
                          <ul className="flex w-max gap-2">
                            {daySummaries.map(({ iso, parts, free }) => {
                              const active = selectedDate === iso;
                              const closed = free === 0;
                              return (
                                <li key={iso}>
                                  <button
                                    type="button"
                                    disabled={closed}
                                    aria-pressed={active}
                                    aria-label={`${parts.day} ${parts.monthLong} ${parts.weekdayLong}${
                                      closed ? ', uygun saat yok' : `, ${free} uygun saat`
                                    }`}
                                    onClick={() => {
                                      setSelectedDate(iso);
                                      setSelectedTime(null);
                                      setFormError(null);
                                    }}
                                    className={`flex min-h-[84px] w-[4.75rem] flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 transition-colors ${
                                      active
                                        ? 'border-teal-400 bg-teal-500/20'
                                        : closed
                                          ? 'cursor-not-allowed border-slate-800/60 bg-slate-950/60 opacity-50'
                                          : 'border-slate-800 bg-slate-950 hover:border-teal-500/40'
                                    }`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={`text-[10px] uppercase tracking-wide ${
                                        active ? 'text-teal-200' : 'text-slate-500'
                                      }`}
                                    >
                                      {parts.weekdayShort}
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className={`text-lg font-bold tabular-nums ${
                                        active ? 'text-white' : 'text-slate-200'
                                      }`}
                                    >
                                      {parts.day}
                                    </span>
                                    <span aria-hidden="true" className="text-[10px] text-slate-500">
                                      {parts.monthShort}
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                                        closed
                                          ? 'bg-slate-900 text-slate-600'
                                          : 'bg-emerald-500/15 text-emerald-300'
                                      }`}
                                    >
                                      {closed ? 'Kapalı' : `${free} saat`}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <p className="text-[10px] text-slate-600">
                          Klinik pazar günleri kapalıdır; hekimlerin çalışma günleri farklılık
                          gösterir. Takvim demo amaçlı sabit bir örnek dönemden üretilmiştir.
                        </p>
                      </div>

                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">Saat seçin</h4>
                          {selectedDate && (
                            <span className="text-[10px] text-slate-500">
                              {formatLongDate(selectedDate)}
                            </span>
                          )}
                        </div>

                        {!selectedDate ? (
                          <p className="rounded-xl border border-dashed border-slate-800 bg-slate-950 px-3 py-6 text-center text-[11px] text-slate-500">
                            Saatleri görmek için yukarıdan bir gün seçin.
                          </p>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {daySlots.map(({ slot, free }) => {
                                const active = selectedTime === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={!free}
                                    aria-pressed={active}
                                    aria-label={`${slot}${free ? ' uygun' : ' dolu'}`}
                                    onClick={() => {
                                      setSelectedTime(slot);
                                      setFormError(null);
                                    }}
                                    className={`min-h-[44px] rounded-xl border px-2 py-2.5 text-xs font-semibold tabular-nums transition-colors ${
                                      active
                                        ? 'border-teal-400 bg-teal-500 text-slate-950'
                                        : free
                                          ? 'border-slate-800 bg-slate-950 text-slate-200 hover:border-teal-500/50 hover:text-teal-300'
                                          : 'cursor-not-allowed border-slate-800/60 bg-slate-950/50 text-slate-600 line-through'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  aria-hidden="true"
                                  className="h-2.5 w-2.5 rounded-sm border border-slate-700 bg-slate-950"
                                />
                                Uygun
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  aria-hidden="true"
                                  className="h-2.5 w-2.5 rounded-sm border border-slate-800 bg-slate-900"
                                />
                                Dolu (üstü çizili)
                              </span>
                            </p>
                          </>
                        )}
                      </div>

                      {summaryLine && (
                        <p className="rounded-xl border border-teal-500/25 bg-teal-500/5 px-3 py-2.5 text-[11px] text-teal-100">
                          {summaryLine}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Adım 3 — İletişim */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="ad-soyad" className="block text-[11px] font-medium text-slate-400">
                          Ad Soyad <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id="ad-soyad"
                          type="text"
                          autoComplete="name"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          placeholder="Adınız ve soyadınız"
                          className="min-h-[44px] w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="telefon" className="block text-[11px] font-medium text-slate-400">
                          Telefon <span className="text-rose-400">*</span>
                        </label>
                        <input
                          id="telefon"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="05XX XXX XX XX"
                          className="min-h-[44px] w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="eposta" className="block text-[11px] font-medium text-slate-400">
                          E-posta (opsiyonel)
                        </label>
                        <input
                          id="eposta"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="ornek@eposta.com"
                          className="min-h-[44px] w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="not" className="block text-[11px] font-medium text-slate-400">
                          Notunuz (opsiyonel)
                        </label>
                        <textarea
                          id="not"
                          rows={3}
                          value={note}
                          onChange={(event) => setNote(event.target.value)}
                          placeholder="Şikayetiniz veya sormak istedikleriniz"
                          className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none"
                        />
                      </div>

                      <p className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden="true" />
                        Sağlık geçmişinize dair ayrıntıları form üzerinden değil, muayenede
                        hekiminizle paylaşmanızı öneririz.
                      </p>
                    </div>
                  )}

                  {/* Adım 4 — Onay */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white">Bilgilerinizi kontrol edin</h4>
                      <dl className="space-y-2 text-[11px]">
                        {[
                          { label: 'Tedavi', value: chosenTreatment?.name ?? '—' },
                          { label: 'Kategori', value: chosenTreatment?.category ?? '—' },
                          { label: 'Hekim', value: chosenDoctor?.name ?? '—' },
                          {
                            label: 'Tarih',
                            value: selectedDate ? formatLongDate(selectedDate) : '—',
                          },
                          { label: 'Saat', value: selectedTime ?? '—' },
                          { label: 'Seans süresi', value: chosenTreatment?.duration ?? '—' },
                          { label: 'Ücret aralığı', value: chosenTreatment?.priceRange ?? '—' },
                          { label: 'Ad soyad', value: fullName.trim() || '—' },
                          { label: 'Telefon', value: phone.trim() || '—' },
                          { label: 'E-posta', value: email.trim() || 'Belirtilmedi' },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                          >
                            <dt className="shrink-0 text-slate-500">{row.label}</dt>
                            <dd className="min-w-0 break-words text-right font-semibold text-white">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {note.trim() && (
                        <p className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">Notunuz: </span>
                          {note.trim()}
                        </p>
                      )}

                      <p className="text-[10px] leading-relaxed text-slate-500">
                        Randevu talebiniz kesinleşmiş bir saat rezervasyonu değildir; hasta
                        danışmanımız arayarak teyit eder.
                      </p>
                    </div>
                  )}

                  {/* Adım navigasyonu */}
                  <div className="flex flex-col gap-2 border-t border-slate-800 pt-4 sm:flex-row">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300 sm:w-auto"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        Geri
                      </button>
                    )}

                    {step < WIZARD_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-teal-400 hover:to-emerald-400"
                      >
                        Devam Et
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-teal-400 hover:to-emerald-400"
                      >
                        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                        Randevu Talebi Gönder
                      </button>
                    )}
                  </div>

                  <p className="text-center text-[10px] text-slate-600">
                    Bu bir demo formudur; bilgiler hiçbir yere gönderilmez.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Hasta Yolculuğu */}
      <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Klinikte Süreç Nasıl İşler?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-400">
              İlk telefondan bakım kontrollerine kadar izlediğimiz adımlar. Her aşamada ne
              yapılacağını önceden bilirsiniz.
            </p>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {JOURNEY_STEPS.map((journeyStep, index) => {
              const Icon = journeyStep.icon;
              return (
                <li
                  key={journeyStep.id}
                  className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-[11px] font-bold text-teal-300"
                    >
                      {index + 1}
                    </span>
                    <Icon className="h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{journeyStep.title}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-400">{journeyStep.detail}</p>
                </li>
              );
            })}
          </ol>

          <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center text-[11px] leading-relaxed text-slate-500">
            Bu sayfa bir demo çalışmasıdır. Vitalis Klinik kurgusal bir markadır; içerikteki süre,
            seans ve ücret bilgileri örnek amaçlıdır ve tıbbi tavsiye niteliği taşımaz.
          </p>
        </div>
      </section>

      {/* Hekim Detay Modalı */}
      <AnimatePresence>
        {activeDoctor && (
          <DialogShell
            key={`doctor-${activeDoctor.id}`}
            labelledBy="hekim-modal-basligi"
            onClose={closeModals}
            closeLabel="Hekim profilini kapat"
            reduceMotion={reduceMotion}
          >
            <div className="relative h-40 sm:h-48">
              <SafeImage
                accent="text-teal-400"
                src={activeDoctor.image}
                alt={`${activeDoctor.name} portresi`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"
              />
              <button
                type="button"
                onClick={closeModals}
                aria-label="Kapat"
                className="absolute right-3 top-3 rounded-full border border-slate-700 bg-slate-950/80 p-2.5 text-slate-300 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 min-w-0">
                <h2 id="hekim-modal-basligi" className="truncate text-lg font-bold text-white md:text-xl">
                  {activeDoctor.name}
                </h2>
                <p className="truncate text-[11px] uppercase tracking-wide text-teal-300">
                  {activeDoctor.title} • {activeDoctor.experienceYears} yıl deneyim
                </p>
              </div>
            </div>

            <div className="max-h-[62vh] space-y-5 overflow-y-auto p-5 md:p-6">
              <p className="text-xs leading-relaxed text-slate-300">{activeDoctor.bio}</p>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Uzmanlık Alanları
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {activeDoctor.expertise.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  Eğitim &amp; Deneyim
                </h3>
                <ol className="space-y-3 border-l border-slate-800 pl-4">
                  {activeDoctor.timeline.map((milestone) => (
                    <li key={`${milestone.period}-${milestone.title}`} className="relative min-w-0">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[1.3125rem] top-1.5 h-2 w-2 rounded-full bg-teal-400"
                      />
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        {milestone.period}
                      </p>
                      <p className="text-xs font-bold text-white">{milestone.title}</p>
                      <p className="text-[11px] text-slate-400">{milestone.place}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <Stethoscope className="h-4 w-4" aria-hidden="true" />
                  Yürüttüğü Tedaviler
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TREATMENTS.filter((treatment) =>
                    treatment.doctorIds.includes(activeDoctor.id),
                  ).map((treatment) => (
                    <button
                      key={treatment.id}
                      type="button"
                      onClick={() => openTreatmentModal(treatment.id)}
                      className="flex min-h-[52px] min-w-0 flex-col items-start justify-center rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-left transition-colors hover:border-teal-500/40"
                    >
                      <span className="w-full truncate text-xs font-semibold text-white">
                        {treatment.name}
                      </span>
                      <span className="w-full truncate text-[10px] text-slate-500">
                        {treatment.sessions} • {treatment.priceRange}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-500">Çalışma günleri</dt>
                  <dd className="mt-0.5 font-semibold text-white">
                    {activeDoctor.workDays.map((day) => WEEKDAYS_SHORT[day]).join(', ')}
                  </dd>
                </div>
                <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-500">Konuştuğu diller</dt>
                  <dd className="mt-0.5 font-semibold text-white">
                    {activeDoctor.languages.join(', ')}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-col gap-2 border-t border-slate-800 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    const first = TREATMENTS.find((treatment) =>
                      treatment.doctorIds.includes(activeDoctor.id),
                    );
                    if (first) prefillAppointment(first.id, activeDoctor.id);
                    closeModals();
                    scrollToAppointment(280);
                  }}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-teal-400 hover:to-emerald-400"
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  Bu Hekimden Randevu Al
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                >
                  Kapat
                </button>
              </div>
            </div>
          </DialogShell>
        )}
      </AnimatePresence>

      {/* Tedavi Detay Modalı */}
      <AnimatePresence>
        {activeTreatment && (
          <DialogShell
            key={`treatment-${activeTreatment.id}`}
            labelledBy="tedavi-modal-basligi"
            onClose={closeModals}
            closeLabel="Tedavi detayını kapat"
            reduceMotion={reduceMotion}
          >
            <div className="relative h-36 sm:h-44">
              <SafeImage
                accent="text-teal-400"
                src={CATEGORY_IMAGES[activeTreatment.category]}
                alt={`${activeTreatment.name} tedavisi`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"
              />
              <button
                type="button"
                onClick={closeModals}
                aria-label="Kapat"
                className="absolute right-3 top-3 rounded-full border border-slate-700 bg-slate-950/80 p-2.5 text-slate-300 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 min-w-0">
                <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-950">
                  {activeTreatment.category}
                </span>
                <h2 id="tedavi-modal-basligi" className="mt-2 text-lg font-bold text-white md:text-xl">
                  {activeTreatment.name}
                </h2>
              </div>
            </div>

            <div className="max-h-[62vh] space-y-5 overflow-y-auto p-5 md:p-6">
              <p className="text-xs leading-relaxed text-slate-300">{activeTreatment.description}</p>

              <dl className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
                {[
                  { label: 'Seans süresi', value: activeTreatment.duration, icon: Clock },
                  { label: 'Seans planı', value: activeTreatment.sessions, icon: CalendarDays },
                  { label: 'Anestezi', value: activeTreatment.anesthesia, icon: Activity },
                  { label: 'Ücret aralığı', value: activeTreatment.priceRange, icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >
                      <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                        <Icon className="h-3 w-3 text-teal-400" aria-hidden="true" />
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-xs font-semibold text-white">{item.value}</dd>
                    </div>
                  );
                })}
              </dl>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <Timer className="h-4 w-4" aria-hidden="true" />
                  İyileşme ve Alışma Süreci
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {activeTreatment.recovery}
                </p>
              </div>

              {/* Fotoğraf yerine süreç karşılaştırması: öncesi / sonrası ne yapılıyor. */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Tedaviye başlarken
                  </h3>
                  <ul className="space-y-2">
                    {activeTreatment.before.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-slate-600" aria-hidden="true" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-0 rounded-2xl border border-teal-500/25 bg-teal-500/5 p-4">
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-teal-300">
                    Tedavi tamamlandığında
                  </h3>
                  <ul className="space-y-2">
                    {activeTreatment.after.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" aria-hidden="true" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  Süreç Haritası
                </h3>
                <ol className="space-y-3 border-l border-slate-800 pl-4">
                  {activeTreatment.steps.map((processStep, index) => (
                    <li key={processStep.title} className="relative min-w-0">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[1.4375rem] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[9px] font-bold text-slate-950"
                      >
                        {index + 1}
                      </span>
                      <p className="text-xs font-bold text-white">{processStep.title}</p>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        {processStep.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Bu Tedaviyi Yürüten Hekimler
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {doctorsForTreatment(activeTreatment).map((doctor) => (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => openDoctorModal(doctor.id)}
                      className="flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-left transition-colors hover:border-teal-500/40"
                    >
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                        <SafeImage
                          accent="text-teal-400"
                          src={doctor.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover object-top"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-white">
                          {doctor.shortName}
                        </span>
                        <span className="block truncate text-[10px] text-slate-500">
                          {doctor.title}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden="true" />
                Süre, seans sayısı ve ücret aralığı örnek planlamadır; kişiye özel plan muayene ve
                görüntüleme sonrası belirlenir.
              </p>

              <div className="flex flex-col gap-2 border-t border-slate-800 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    prefillAppointment(activeTreatment.id);
                    closeModals();
                    scrollToAppointment(280);
                  }}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-teal-400 hover:to-emerald-400"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  Bu Tedavi İçin Randevu Al
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-teal-500/40 hover:text-teal-300"
                >
                  Kapat
                </button>
              </div>
            </div>
          </DialogShell>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="min-w-0">
            <span className="text-lg font-bold tracking-wider text-teal-400">VITALIS KLİNİK</span>
            <p className="mt-1 text-xs text-slate-500">
              Teşvikiye Mah. Vali Konağı Cad. No: 48, Şişli / İstanbul
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  'Merhaba Vitalis Klinik, tedaviler ve randevu hakkında bilgi almak istiyorum.',
                )
              }
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-xs font-semibold text-teal-300 transition-colors hover:bg-teal-500/20"
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
