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
  AtSign,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Info,
  ListChecks,
  Mail,
  MapPin,
  Minus,
  PhoneCall,
  Sparkles,
  Target,
  Timer,
  Trash2,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react';

/* ------------------------------- Tipler ------------------------------- */

type BillingCycle = 'monthly' | 'yearly';

type Intensity = 'Düşük' | 'Orta' | 'Yüksek';

type DayKey = 'pzt' | 'sal' | 'car' | 'per' | 'cum' | 'cmt' | 'paz';

interface MembershipPlan {
  id: string;
  name: string;
  summary: string;
  /** Aylık ödemeli taban fiyat (TL); yıllık fiyat bundan indirimle türetilir. */
  monthlyPrice: number;
  features: string[];
  highlighted: boolean;
}

interface FeatureRow {
  label: string;
  /** Değer: metin ya da "var / yok" bilgisi. */
  values: Record<string, string | boolean>;
}

interface WeekDay {
  key: DayKey;
  /** Sekmede görünen kısa ad — dar ekranda satır kaplamasın diye ayrı tutuldu. */
  short: string;
  long: string;
}

interface ClassType {
  id: string;
  name: string;
  /** Programda ve formda aynı kısa açıklama kullanılıyor. */
  tagline: string;
  intensity: Intensity;
  durationMin: number;
  capacity: number;
  primaryTrainerId: string;
  trainerIds: string[];
  /** Derste ne yapılır — modalın ilk bloğu. */
  whatHappens: string[];
  equipment: string[];
  calorieRange: string;
  suitableFor: string[];
  focus: 'kondisyon' | 'guc' | 'mobilite';
}

interface ScheduleEntry {
  time: string;
  classId: string;
}

interface Trainer {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  experience: string;
}

interface BookedClass {
  key: string;
  dayKey: DayKey;
  time: string;
  classId: string;
}

interface QuizOption {
  id: string;
  label: string;
  description: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

/* -------------------------------- Veri -------------------------------- */

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

/** Karşılaştırma tablosunun satırları — masaüstü tablo ve mobil kartlar aynı veriden. */
const FEATURE_ROWS: FeatureRow[] = [
  {
    label: 'Salon erişimi',
    values: {
      base: '07:00 – 23:00',
      performance: '06:30 – 23:30',
      elite: '06:30 – 23:30 + erken giriş',
    },
  },
  {
    label: 'Grup dersi hakkı',
    values: { base: 'Ayda 2 ders', performance: 'Sınırsız', elite: 'Sınırsız + öncelikli yer' },
  },
  {
    label: 'Birebir PT seansı',
    values: { base: false, performance: 'Ayda 1', elite: 'Haftada 1' },
  },
  {
    label: 'Vücut kompozisyon analizi',
    values: { base: '3 ayda bir', performance: 'Ayda bir', elite: 'Ayda bir + yazılı rapor' },
  },
  {
    label: 'Antrenman programı',
    values: { base: 'Hazır şablon', performance: 'Kişiye özel', elite: 'Kişiye özel + aylık revizyon' },
  },
  {
    label: 'Beslenme danışmanlığı',
    values: { base: false, performance: 'Grup semineri', elite: 'Diyetisyenle bireysel plan' },
  },
  {
    label: 'Fizyoterapi değerlendirmesi',
    values: { base: false, performance: false, elite: 'Ayda 1 seans' },
  },
  { label: 'Sauna ve buhar odası', values: { base: false, performance: true, elite: true } },
  { label: 'Misafir davet hakkı', values: { base: false, performance: 'Ayda 2', elite: 'Ayda 4' } },
  {
    label: 'Dolap ve havlu',
    values: { base: 'Günlük dolap', performance: 'Günlük dolap + havlu', elite: 'Kişisel dolap + havlu' },
  },
  {
    label: 'Üyelik dondurma',
    values: { base: 'Yılda 1 ay', performance: 'Yılda 2 ay', elite: 'Yılda 3 ay' },
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

const TRAINERS: Trainer[] = [
  {
    id: 'kerem',
    name: 'Kerem Aydın',
    title: 'Baş Antrenör & Kondisyon',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=75',
    bio: 'Metcon ve dayanıklılık derslerini yürütüyor. Dersleri ısınma, teknik provası, ana blok ve soğuma olmak üzere dört bölüme ayırıyor; katılımcıların hareket kalitesini tempodan önce değerlendiriyor.',
    specialties: ['Metcon', 'Spinning', 'Dayanıklılık'],
    certifications: [
      'NSCA-CSCS Kuvvet ve Kondisyon Uzmanlığı',
      'Spinning® Instructor Level 2',
      'İlk Yardım ve Temel Yaşam Desteği',
    ],
    experience: '11 yıl saha deneyimi',
  },
  {
    id: 'melis',
    name: 'Melis Torun',
    title: 'Fonksiyonel Antrenman Uzmanı',
    image:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=75',
    bio: 'HIIT, boks kondisyon ve kor derslerinden sorumlu. Yüksek tempolu bloklarda seçenekli hareket seti veriyor; yeni başlayanlar aynı derste düşük etkili varyasyonla ilerleyebiliyor.',
    specialties: ['HIIT', 'Boks', 'Kor Stabilizasyon'],
    certifications: [
      'ACE Group Fitness Instructor',
      'Boxing Conditioning Coach Level 1',
      'Kettlebell Fundamentals Sertifikası',
    ],
    experience: '8 yıl saha deneyimi',
  },
  {
    id: 'baran',
    name: 'Baran Yıldırım',
    title: 'Güç & Halter Koçu',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=75',
    bio: 'Olimpik halter ve güç bloklarını yönetiyor. Her katılımcı için hareket taraması yapıp yükü buna göre planlıyor; teknik düzelene kadar ağırlık artışını erteliyor.',
    specialties: ['Olimpik Halter', 'Powerlifting', 'Kettlebell'],
    certifications: [
      'IWF Level 2 Weightlifting Coach',
      'Türkiye Halter Federasyonu Antrenörlük Belgesi',
      'FMS Level 1 Hareket Taraması',
    ],
    experience: '13 yıl saha deneyimi',
  },
  {
    id: 'deniz',
    name: 'Deniz Şahin',
    title: 'Pilates & Mobilite Eğitmeni',
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=75',
    bio: 'Reformer pilates, yoga ve toparlanma seanslarını veriyor. Masa başı çalışan üyeler için omuz–kalça hareketliliğine odaklanan kısa ev rutinleri hazırlıyor.',
    specialties: ['Reformer', 'Yoga', 'Postür'],
    certifications: [
      'BASI Pilates Comprehensive Program',
      'Yoga Alliance RYT-500',
      'Mobility Coach Level 1',
    ],
    experience: '9 yıl saha deneyimi',
  },
];

const CLASS_TYPES: ClassType[] = [
  {
    id: 'metcon',
    name: 'Sabah Metcon',
    tagline: 'Kısa dinlenmeli, çok eklemli hareketlerden kurulu kondisyon bloğu.',
    intensity: 'Yüksek',
    durationMin: 50,
    capacity: 16,
    primaryTrainerId: 'kerem',
    trainerIds: ['kerem', 'melis'],
    whatHappens: [
      '10 dakika eklem hazırlığı ve tempolu ısınma',
      'Hareket provası: squat, kürek ve kettlebell tekniği',
      '20 dakikalık ana blok, üç turlu istasyon çalışması',
      'Nefes düzenleme ve esneme ile soğuma',
    ],
    equipment: ['Kettlebell', 'Kürek ergometresi', 'Sağlık topu', 'Atlama ipi'],
    calorieRange: '400 – 600 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Temel squat ve şınav hareketini ağrısız yapabilenler',
      'Sabah saatlerinde yüksek tempo tercih edenler',
      'Kardiyo ve kuvveti tek derste birleştirmek isteyenler',
    ],
    focus: 'kondisyon',
  },
  {
    id: 'hiit',
    name: 'Öğle HIIT 45',
    tagline: 'Kırk beş dakikaya sığan aralıklı yüksek tempo çalışması.',
    intensity: 'Yüksek',
    durationMin: 45,
    capacity: 16,
    primaryTrainerId: 'melis',
    trainerIds: ['melis', 'kerem'],
    whatHappens: [
      'Kısa dinamik ısınma ve nabız yükseltme',
      '30 saniye çalışma / 30 saniye dinlenme aralıkları',
      'Alt beden, üst beden ve kor istasyonları dönüşümlü',
      'Beş dakikalık toparlanma ve esneme',
    ],
    equipment: ['Dumbbell', 'Step platformu', 'Direnç bandı'],
    calorieRange: '350 – 550 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Öğle arasında kısa ve yoğun antrenman arayanlar',
      'Düşük etkili varyasyonla başlamak isteyen yeni üyeler',
      'Haftada en az iki gün antrenman yapabilenler',
    ],
    focus: 'kondisyon',
  },
  {
    id: 'pilates',
    name: 'Reformer Pilates',
    tagline: 'Reformer üzerinde kontrollü, düşük etkili kuvvet ve postür çalışması.',
    intensity: 'Orta',
    durationMin: 55,
    capacity: 10,
    primaryTrainerId: 'deniz',
    trainerIds: ['deniz'],
    whatHappens: [
      'Nefes ve merkez aktivasyonu ile başlangıç',
      'Yay direnciyle bacak, kalça ve sırt serileri',
      'Omurga hareketliliği ve denge çalışmaları',
      'Kapanışta uzama ve gevşeme serisi',
    ],
    equipment: ['Reformer yatağı', 'Pilates halkası', 'Küçük top'],
    calorieRange: '200 – 320 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Masa başı çalışan ve postür üzerinde durmak isteyenler',
      'Eklem dostu, düşük etkili çalışma arayanlar',
      'Kor kuvvetini kontrollü ilerletmek isteyenler',
    ],
    focus: 'mobilite',
  },
  {
    id: 'boks',
    name: 'Boks Kondisyon',
    tagline: 'Temel boks tekniğiyle birleşen kondisyon dersi; temas yok.',
    intensity: 'Yüksek',
    durationMin: 60,
    capacity: 18,
    primaryTrainerId: 'melis',
    trainerIds: ['melis', 'baran'],
    whatHappens: [
      'İp atlama ve omuz hazırlığı',
      'Duruş, adım ve temel yumruk kombinasyonları',
      'Kum torbası ve pençe turları',
      'Kor bloğu ve esneme',
    ],
    equipment: ['Boks eldiveni', 'Bandaj', 'Kum torbası', 'Pençe'],
    calorieRange: '400 – 620 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Teknik öğrenmeyi seven, tempolu ders arayanlar',
      'Omuz ve bilek sağlığı yerinde olan katılımcılar',
      'Grup enerjisiyle çalışmayı sevenler',
    ],
    focus: 'kondisyon',
  },
  {
    id: 'halter',
    name: 'Olimpik Halter Tekniği',
    tagline: 'Koparma ve silkme hareketlerinde teknik odaklı küçük grup dersi.',
    intensity: 'Yüksek',
    durationMin: 75,
    capacity: 8,
    primaryTrainerId: 'baran',
    trainerIds: ['baran'],
    whatHappens: [
      'Bar ile hareket taraması ve mobilite hazırlığı',
      'Pozisyon çalışması: çekiş, geçiş ve karşılama',
      'Tekniğe göre kademeli yük artışı',
      'Tamamlayıcı sırt ve kor çalışması',
    ],
    equipment: ['Olimpik bar', 'Teknik plaka', 'Halter platformu', 'Kaldırma ayakkabısı'],
    calorieRange: '280 – 420 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Teknik öğrenmeye zaman ayırmak isteyenler',
      'Overhead pozisyonda ağrısız çalışabilenler',
      'Kuvvet gelişimini önceliklendirenler',
    ],
    focus: 'guc',
  },
  {
    id: 'spinning',
    name: 'Spinning Endurance',
    tagline: 'Kadans ve direnç aralıklarıyla planlanmış bisiklet dersi.',
    intensity: 'Yüksek',
    durationMin: 45,
    capacity: 22,
    primaryTrainerId: 'kerem',
    trainerIds: ['kerem'],
    whatHappens: [
      'Sele ve gidon ayarı, ısınma turu',
      'Kadans aralıkları ve tempolu düz bölümler',
      'Tırmanış simülasyonu ile direnç artışı',
      'Soğuma pedalı ve bacak esnetme',
    ],
    equipment: ['Indoor bike', 'Nabız bandı (isteğe bağlı)', 'Havlu'],
    calorieRange: '380 – 560 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Eklem yükü düşük kardiyo arayanlar',
      'Dayanıklılık kapasitesini artırmak isteyenler',
      'Kendi temposunu direnç kadranıyla ayarlamak isteyenler',
    ],
    focus: 'kondisyon',
  },
  {
    id: 'yoga',
    name: 'Vinyasa Yoga',
    tagline: 'Nefesle senkron akan, orta tempolu yoga akışı.',
    intensity: 'Düşük',
    durationMin: 60,
    capacity: 20,
    primaryTrainerId: 'deniz',
    trainerIds: ['deniz'],
    whatHappens: [
      'Oturuşta nefes çalışması',
      'Selamlama serileri ile ısınma',
      'Ayakta duruşlar ve denge akışı',
      'Yerde uzun tutuşlar ve kapanış',
    ],
    equipment: ['Yoga matı', 'Blok', 'Kayış'],
    calorieRange: '180 – 300 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Hareketlilik ve nefes çalışmasına ağırlık vermek isteyenler',
      'Yoğun antrenman günleri arasında denge arayanlar',
      'Yeni başlayanlar (blok ve kayışla varyasyon verilir)',
    ],
    focus: 'mobilite',
  },
  {
    id: 'mobilite',
    name: 'Mobilite & Esneme',
    tagline: 'Eklem hareket açıklığına odaklanan kısa ve düşük tempolu seans.',
    intensity: 'Düşük',
    durationMin: 40,
    capacity: 20,
    primaryTrainerId: 'deniz',
    trainerIds: ['deniz', 'baran'],
    whatHappens: [
      'Foam roller ile doku hazırlığı',
      'Kalça, omuz ve ayak bileği açıklık çalışmaları',
      'Kontrollü eklem rotasyonları',
      'Ev için kısa rutin özeti',
    ],
    equipment: ['Foam roller', 'Lakros topu', 'Direnç bandı', 'Mat'],
    calorieRange: '120 – 220 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Gün boyu masa başında oturanlar',
      'Ağır antrenman sonrası toparlanma arayanlar',
      'Hareket kısıtı üzerinde çalışmak isteyenler',
    ],
    focus: 'mobilite',
  },
  {
    id: 'guc',
    name: 'Güç Temelleri',
    tagline: 'Squat, deadlift ve bench hareketlerinde temel kuvvet bloğu.',
    intensity: 'Orta',
    durationMin: 60,
    capacity: 12,
    primaryTrainerId: 'kerem',
    trainerIds: ['kerem', 'baran'],
    whatHappens: [
      'Bar ile ısınma setleri',
      'Ana hareket: squat veya deadlift, tekniğe göre set planı',
      'Yardımcı hareketler ve tek bacak çalışması',
      'Kor bloğu ve esneme',
    ],
    equipment: ['Olimpik bar', 'Güç kafesi', 'Dumbbell', 'Kemer (isteğe bağlı)'],
    calorieRange: '250 – 400 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Ağırlık antrenmanına yapılandırılmış şekilde başlamak isteyenler',
      'Serbest ağırlık tekniğini oturtmak isteyenler',
      'Haftada iki güç günü planlayanlar',
    ],
    focus: 'guc',
  },
  {
    id: 'kettlebell',
    name: 'Kettlebell Akışı',
    tagline: 'Salınım, temizleme ve press hareketlerinden oluşan akıcı set yapısı.',
    intensity: 'Orta',
    durationMin: 50,
    capacity: 14,
    primaryTrainerId: 'baran',
    trainerIds: ['baran', 'melis'],
    whatHappens: [
      'Kalça menteşesi tekniği provası',
      'Salınım ve temizleme serileri',
      'Tek kol press ve taşıma çalışmaları',
      'Kor ve ön kol tamamlayıcıları',
    ],
    equipment: ['Kettlebell seti', 'Tebeşir', 'Mat'],
    calorieRange: '300 – 480 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Kalça menteşesi hareketini öğrenmek isteyenler',
      'Kavrama ve kor kuvveti üzerinde çalışanlar',
      'Orta tempolu, teknik ağırlıklı ders arayanlar',
    ],
    focus: 'guc',
  },
  {
    id: 'kor',
    name: 'Fonksiyonel Kor',
    tagline: 'Gövde stabilizasyonuna odaklanan kırk dakikalık kısa blok.',
    intensity: 'Orta',
    durationMin: 40,
    capacity: 18,
    primaryTrainerId: 'melis',
    trainerIds: ['melis', 'deniz'],
    whatHappens: [
      'Nefes ve derin kor aktivasyonu',
      'Plank varyasyonları ve anti-rotasyon çalışmaları',
      'Taşıma ve denge istasyonları',
      'Bel ve kalça esnetme',
    ],
    equipment: ['Mat', 'Direnç bandı', 'Sağlık topu', 'Kettlebell'],
    calorieRange: '200 – 330 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Bel bölgesini destekleyici çalışma arayanlar',
      'Ders sonrası tamamlayıcı blok isteyenler',
      'Kısa süreli antrenman planlayanlar',
    ],
    focus: 'mobilite',
  },
  {
    id: 'circuit',
    name: 'Forge Circuit',
    tagline: 'Sekiz istasyonlu, tur bazlı tam vücut devre çalışması.',
    intensity: 'Yüksek',
    durationMin: 50,
    capacity: 20,
    primaryTrainerId: 'baran',
    trainerIds: ['baran', 'kerem'],
    whatHappens: [
      'İstasyon tanıtımı ve teknik hatırlatma',
      'Sekiz istasyonda 40 saniye çalışma turları',
      'Turlar arası iki dakika toparlanma',
      'Kapanışta nefes ve esneme',
    ],
    equipment: ['Sled', 'Battle rope', 'Dumbbell', 'Kutu', 'Rower'],
    calorieRange: '400 – 600 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Değişken hareketlerle çalışmayı sevenler',
      'Grup temposunda antrenman arayanlar',
      'Temel hareket kalıplarını öğrenmiş üyeler',
    ],
    focus: 'kondisyon',
  },
  {
    id: 'toparlanma',
    name: 'Toparlanma Seansı',
    tagline: 'Hafta kapanışında düşük tempolu doku ve nefes çalışması.',
    intensity: 'Düşük',
    durationMin: 45,
    capacity: 20,
    primaryTrainerId: 'deniz',
    trainerIds: ['deniz'],
    whatHappens: [
      'Yavaş tempolu nefes ısınması',
      'Foam roller ve top ile doku çalışması',
      'Pasif esneme tutuşları',
      'Kapanışta gevşeme',
    ],
    equipment: ['Foam roller', 'Mat', 'Battaniye', 'Blok'],
    calorieRange: '110 – 200 kcal aralığı (kişiye göre değişir)',
    suitableFor: [
      'Yoğun antrenman haftasını kapatmak isteyenler',
      'Uyku ve gevşeme rutinini desteklemek isteyenler',
      'Her seviyeden katılımcı',
    ],
    focus: 'mobilite',
  },
];

const SCHEDULE: Record<DayKey, ScheduleEntry[]> = {
  pzt: [
    { time: '07:00', classId: 'metcon' },
    { time: '10:30', classId: 'mobilite' },
    { time: '18:00', classId: 'guc' },
    { time: '20:00', classId: 'boks' },
  ],
  sal: [
    { time: '08:00', classId: 'pilates' },
    { time: '12:30', classId: 'hiit' },
    { time: '19:00', classId: 'halter' },
    { time: '20:30', classId: 'yoga' },
  ],
  car: [
    { time: '07:00', classId: 'metcon' },
    { time: '11:00', classId: 'kor' },
    { time: '18:00', classId: 'kettlebell' },
    { time: '19:30', classId: 'spinning' },
  ],
  per: [
    { time: '08:00', classId: 'pilates' },
    { time: '12:30', classId: 'hiit' },
    { time: '18:30', classId: 'guc' },
    { time: '20:00', classId: 'boks' },
  ],
  cum: [
    { time: '07:00', classId: 'metcon' },
    { time: '10:00', classId: 'mobilite' },
    { time: '18:00', classId: 'circuit' },
    { time: '20:00', classId: 'kor' },
  ],
  cmt: [
    { time: '09:00', classId: 'circuit' },
    { time: '11:00', classId: 'kettlebell' },
    { time: '13:00', classId: 'halter' },
    { time: '16:00', classId: 'yoga' },
  ],
  paz: [
    { time: '10:00', classId: 'toparlanma' },
    { time: '12:00', classId: 'kettlebell' },
    { time: '17:00', classId: 'spinning' },
  ],
};

const LEVELS: readonly { id: string; label: string; description: string }[] = [
  { id: 'baslangic', label: 'Başlangıç', description: 'Yeni başlıyorum ya da uzun bir aradan dönüyorum.' },
  { id: 'orta', label: 'Orta', description: 'Düzenli antrenman yapıyorum, temel hareketleri biliyorum.' },
  { id: 'ileri', label: 'İleri', description: 'Yıllardır çalışıyorum, teknik ve yük planım oturmuş.' },
];

const GOALS: readonly { id: string; label: string; description: string }[] = [
  { id: 'kondisyon', label: 'Kondisyon & Dayanıklılık', description: 'Nefes kapasitesi ve tempo çalışması.' },
  { id: 'guc', label: 'Kuvvet & Kas Gelişimi', description: 'Serbest ağırlık ve teknik odaklı program.' },
  { id: 'mobilite', label: 'Mobilite & Postür', description: 'Hareket açıklığı, esneklik ve toparlanma.' },
  { id: 'genel', label: 'Genel Sağlık & Alışkanlık', description: 'Haftalık düzen kurmak ve sürdürmek.' },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 'hedef',
    question: 'Önümüzdeki 3 ayda neye ağırlık vermek istiyorsun?',
    options: [
      { id: 'kondisyon', label: 'Kondisyon', description: 'Tempo, nefes ve dayanıklılık.' },
      { id: 'guc', label: 'Kuvvet', description: 'Serbest ağırlık ve teknik.' },
      { id: 'mobilite', label: 'Mobilite', description: 'Esneklik, postür, toparlanma.' },
    ],
  },
  {
    id: 'siklik',
    question: 'Haftada kaç gün antrenmana ayırabilirsin?',
    options: [
      { id: 'az', label: '1 – 2 gün', description: 'Kısa ve yoğun planlar uygun.' },
      { id: 'orta', label: '3 – 4 gün', description: 'Dengeli bir haftalık program kurulabilir.' },
      { id: 'cok', label: '5 gün ve üzeri', description: 'Bölünmüş program ve toparlanma planı gerekir.' },
    ],
  },
  {
    id: 'stil',
    question: 'Nasıl çalışmayı tercih edersin?',
    options: [
      { id: 'grup', label: 'Grup dersi', description: 'Kalabalık enerjisi ve sabit takvim.' },
      { id: 'birebir', label: 'Birebir rehberlik', description: 'Eğitmen gözetiminde bireysel plan.' },
      { id: 'serbest', label: 'Serbest çalışma', description: 'Kendi programımı uygularım.' },
    ],
  },
];

/** Anket sonucunun ders ve eğitmen eşlemesi — tamamen sabit, rastgelelik yok. */
const QUIZ_FOCUS_MAP: Record<string, { classIds: [string, string]; trainerId: string; note: string }> = {
  kondisyon: {
    classIds: ['metcon', 'hiit'],
    trainerId: 'kerem',
    note: 'Aralıklı tempo çalışmaları ve kürek/bisiklet blokları ağırlıkta olacak.',
  },
  guc: {
    classIds: ['guc', 'halter'],
    trainerId: 'baran',
    note: 'Önce hareket taraması, ardından tekniğe göre kademeli yük planı uygulanır.',
  },
  mobilite: {
    classIds: ['pilates', 'mobilite'],
    trainerId: 'deniz',
    note: 'Düşük etkili, eklem hareket açıklığına odaklı bir hafta kurgusu önerilir.',
  },
};

/** Yoğunluk haritasının saat başlıkları. */
const HEATMAP_HOURS: readonly string[] = ['07', '09', '11', '13', '15', '17', '19', '21'];

const HEATMAP_LEVELS: readonly { label: string; cell: string; dot: string }[] = [
  { label: 'Sakin', cell: 'bg-zinc-900 text-zinc-500', dot: 'bg-zinc-700' },
  { label: 'Normal', cell: 'bg-lime-400/15 text-lime-200', dot: 'bg-lime-400/40' },
  { label: 'Yoğun', cell: 'bg-lime-400/40 text-zinc-950', dot: 'bg-lime-400/70' },
  { label: 'Çok yoğun', cell: 'bg-orange-400/70 text-zinc-950', dot: 'bg-orange-400' },
];

const WEEKDAYS_LONG = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'] as const;
const WEEKDAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'] as const;
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
 * Date.now() kullanılmıyor: sunucu ve istemci aynı çıktıyı üretsin (hydration)
 * ve doluluk tablosu her açılışta aynı kalsın.
 */
const CALENDAR_ANCHOR = '2026-08-18';
const CALENDAR_LENGTH = 14;

const WEEKDAY_SLOTS: readonly string[] = ['07:00', '09:00', '11:00', '13:00', '17:00', '19:00', '21:00'];
const WEEKEND_SLOTS: readonly string[] = ['09:00', '11:00', '13:00', '15:00', '17:00'];

const WIZARD_STEPS: readonly { id: string; label: string; short: string }[] = [
  { id: 'hedef', label: 'Hedef & Seviye', short: 'Hedef' },
  { id: 'ders', label: 'Ders & Eğitmen', short: 'Ders' },
  { id: 'takvim', label: 'Tarih & Saat', short: 'Takvim' },
  { id: 'iletisim', label: 'İletişim', short: 'İletişim' },
  { id: 'onay', label: 'Onay', short: 'Onay' },
];

/* ----------------------------- Yardımcılar ----------------------------- */

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

/** ISO tarihe gün ekler. Yerel ayrıştırma + yerel okuma yapıldığı için saat dilimi etkisi yok. */
function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

interface DateParts {
  day: number;
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
    monthLong: MONTHS_LONG[month - 1],
    monthShort: MONTHS_SHORT[month - 1],
    weekdayIndex,
    weekdayLong: WEEKDAYS_LONG[weekdayIndex],
    weekdayShort: WEEKDAYS_SHORT[weekdayIndex],
  };
}

function formatLongDate(iso: string): string {
  const parts = dateParts(iso);
  return `${parts.day} ${parts.monthLong} ${parts.weekdayLong}`;
}

const CALENDAR_DAYS: readonly string[] = Array.from({ length: CALENDAR_LENGTH }, (_, index) =>
  addDays(CALENDAR_ANCHOR, index),
);

function slotsForDate(iso: string): readonly string[] {
  const { weekdayIndex } = dateParts(iso);
  return weekdayIndex === 0 || weekdayIndex === 6 ? WEEKEND_SLOTS : WEEKDAY_SLOTS;
}

/** Uygunluk tarih + eğitmen + saat üçlüsünün karmasından türetilir; rastgelelik yok. */
function isSlotFree(iso: string, trainerId: string, slot: string): boolean {
  return hashString(`${iso}#${trainerId}#${slot}`) % 10 >= 3;
}

function freeSlotCount(iso: string, trainerId: string | null): number {
  if (!trainerId) return 0;
  return slotsForDate(iso).filter((slot) => isSlotFree(iso, trainerId, slot)).length;
}

const formatPrice = (value: number): string => `₺${Math.round(value).toLocaleString('tr-TR')}`;

/** Yoğunluk etiketinin rengi — koyu zemin üzerinde okunur kalsın diye sabit eşleme. */
const intensityStyles: Record<Intensity, string> = {
  Düşük: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  Orta: 'bg-lime-500/10 text-lime-300 border-lime-500/25',
  Yüksek: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
};

function findClass(id: string | null): ClassType | null {
  return CLASS_TYPES.find((item) => item.id === id) ?? null;
}

function findTrainer(id: string | null): Trainer | null {
  return TRAINERS.find((item) => item.id === id) ?? null;
}

function findPlan(id: string | null): MembershipPlan | null {
  return PLANS.find((item) => item.id === id) ?? null;
}

function classesOfTrainer(trainerId: string): ClassType[] {
  return CLASS_TYPES.filter((item) => item.trainerIds.includes(trainerId));
}

/** Kalan kontenjan: gün + ders karmasından üretilir, her açılışta aynıdır. */
function remainingSeats(dayKey: DayKey, classId: string, capacity: number): number {
  return hashString(`${dayKey}#${classId}`) % (capacity + 1);
}

/** Günlük yoğunluk seviyesi: saat bazlı temel eğri + sabit karma sapması. */
function occupancyLevel(dayKey: DayKey, hour: string): number {
  const base = hour === '07' || hour === '19' ? 2 : hour === '17' || hour === '09' ? 1 : hour === '21' ? 1 : 0;
  const drift = (hashString(`${dayKey}~${hour}`) % 3) - 1;
  const weekendPenalty = dayKey === 'cmt' || dayKey === 'paz' ? 1 : 0;
  const level = base + drift + 1 - weekendPenalty;
  return Math.max(0, Math.min(3, level));
}

/** Telefon doğrulaması: biçimden bağımsız, en az 10 rakam. */
function digitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

/* ---------------------------- Alt Bileşenler ---------------------------- */

interface DialogShellProps {
  labelledBy: string;
  onClose: () => void;
  closeLabel: string;
  children: React.ReactNode;
  reduceMotion: boolean;
}

/**
 * Ortak modal kabuğu: role="dialog", Escape, gerçek <button> arka plan,
 * odak tuzağı, odağın geri verilmesi ve gövde kaydırma kilidi.
 */
function DialogShell({ labelledBy, onClose, closeLabel, children, reduceMotion }: DialogShellProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
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
        className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl focus:outline-none"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Karşılaştırma hücresi: metin, "var" ya da "yok" durumlarını tek yerden basar. */
function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-lime-300">
        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">Dahil</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-zinc-600">
        <Minus className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">Dahil değil</span>
      </span>
    );
  }
  return <span className="text-zinc-200">{value}</span>;
}

/* -------------------------------- Sayfa -------------------------------- */

export default function GymPage() {
  const reduceMotion = useReducedMotion() ?? false;

  /* --- Üyelik --- */
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  /* --- Haftalık program --- */
  const [activeDay, setActiveDay] = useState<DayKey>('pzt');
  const [booked, setBooked] = useState<BookedClass[]>([]);
  const [waitlist, setWaitlist] = useState<string[]>([]);

  /* --- Modallar --- */
  const [dialog, setDialog] = useState<{ type: 'trainer' | 'class'; id: string } | null>(null);

  /* --- Mini anket --- */
  const [quizAnswers, setQuizAnswers] = useState<(string | null)[]>([null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  /* --- Kayıt sihirbazı --- */
  const [step, setStep] = useState(0);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openWhatsApp = useCallback((message: string) => {
    window.open(whatsAppLink(message), '_blank', 'noopener,noreferrer');
  }, []);

  const scrollToSignup = useCallback(() => {
    document
      .getElementById('deneme')
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [reduceMotion]);

  const closeDialog = useCallback(() => setDialog(null), []);

  /* --- Program türetmeleri (render sırasında hesaplanır, efekt yok) --- */

  const activeDayLabel = WEEK_DAYS.find((day) => day.key === activeDay)?.long ?? '';

  const daySessions = useMemo(() => {
    return SCHEDULE[activeDay].map((entry) => {
      const classType = findClass(entry.classId);
      const capacity = classType?.capacity ?? 0;
      const remaining = remainingSeats(activeDay, entry.classId, capacity);
      return {
        key: `${activeDay}-${entry.time}-${entry.classId}`,
        time: entry.time,
        classType,
        capacity,
        remaining,
        isFull: remaining === 0,
      };
    });
  }, [activeDay]);

  const dayRemainingTotal = daySessions.reduce((total, session) => total + session.remaining, 0);

  const bookedKeys = useMemo(() => new Set(booked.map((item) => item.key)), [booked]);

  /** Programım listesi gün sırasına, sonra saate göre sıralanır. */
  const sortedProgram = useMemo(() => {
    const dayOrder = WEEK_DAYS.map((day) => day.key);
    return [...booked].sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.dayKey) - dayOrder.indexOf(b.dayKey);
      return dayDiff !== 0 ? dayDiff : a.time.localeCompare(b.time);
    });
  }, [booked]);

  const weeklyMinutes = sortedProgram.reduce(
    (total, item) => total + (findClass(item.classId)?.durationMin ?? 0),
    0,
  );

  const toggleBooking = useCallback(
    (dayKey: DayKey, time: string, id: string) => {
      const key = `${dayKey}-${time}-${id}`;
      setBooked((current) =>
        current.some((item) => item.key === key)
          ? current.filter((item) => item.key !== key)
          : [...current, { key, dayKey, time, classId: id }],
      );
    },
    [],
  );

  const removeBooking = useCallback((key: string) => {
    setBooked((current) => current.filter((item) => item.key !== key));
  }, []);

  const toggleWaitlist = useCallback((key: string) => {
    setWaitlist((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }, []);

  /* --- Form ön doldurma --- */

  const prefillFromPlan = useCallback(
    (id: string) => {
      setPlanId(id);
      setIsSubmitted(false);
      setFormError(null);
      setStep(0);
      scrollToSignup();
    },
    [scrollToSignup],
  );

  const prefillFromTrainer = useCallback(
    (id: string) => {
      const trainerClasses = classesOfTrainer(id);
      const first = trainerClasses[0];
      setTrainerId(id);
      if (first) {
        setClassId(first.id);
        setGoalId((current) => current ?? first.focus);
      }
      setSelectedTime(null);
      setIsSubmitted(false);
      setFormError(null);
      setStep(0);
      setDialog(null);
      scrollToSignup();
    },
    [scrollToSignup],
  );

  const prefillFromClass = useCallback(
    (id: string) => {
      const classType = findClass(id);
      setClassId(id);
      setTrainerId(classType?.primaryTrainerId ?? null);
      setGoalId((current) => current ?? classType?.focus ?? null);
      setSelectedTime(null);
      setIsSubmitted(false);
      setFormError(null);
      setStep(0);
      setDialog(null);
      scrollToSignup();
    },
    [scrollToSignup],
  );

  /* --- Mini anket --- */

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

  const quizResult = useMemo(() => {
    if (!quizComplete) return null;
    const [focus, frequency, style] = quizAnswers as [string, string, string];
    const mapping = QUIZ_FOCUS_MAP[focus] ?? QUIZ_FOCUS_MAP.kondisyon;

    const frequencyPoints = frequency === 'cok' ? 2 : frequency === 'orta' ? 1 : 0;
    const stylePoints = style === 'birebir' ? 2 : style === 'grup' ? 1 : 0;
    const total = frequencyPoints + stylePoints;
    const plan = total >= 3 ? findPlan('elite') : total >= 1 ? findPlan('performance') : findPlan('base');

    return {
      plan: plan ?? PLANS[0],
      classes: mapping.classIds.map((id) => findClass(id)).filter((item): item is ClassType => item !== null),
      trainer: findTrainer(mapping.trainerId),
      note: mapping.note,
      weeklyPlan:
        frequency === 'cok'
          ? 'Beş günlük bölünmüş plan: üç yüklenme, bir teknik, bir toparlanma günü.'
          : frequency === 'orta'
            ? 'Dört günlük plan: iki yüklenme, bir teknik, bir düşük tempolu gün.'
            : 'İki günlük plan: tam vücut çalışması ve kısa bir toparlanma seansı.',
    };
  }, [quizAnswers, quizComplete]);

  /* --- Sihirbaz türetmeleri --- */

  const chosenClass = findClass(classId);
  const chosenTrainer = findTrainer(trainerId);
  const chosenPlan = findPlan(planId);
  const chosenGoal = GOALS.find((goal) => goal.id === goalId) ?? null;
  const chosenLevel = LEVELS.find((level) => level.id === levelId) ?? null;

  /** Seçilen derse göre eğitmen listesi; ders seçilmediyse tüm kadro. */
  const eligibleTrainers = useMemo(() => {
    if (!chosenClass) return TRAINERS;
    return TRAINERS.filter((trainer) => chosenClass.trainerIds.includes(trainer.id));
  }, [chosenClass]);

  const daySummaries = useMemo(
    () =>
      CALENDAR_DAYS.map((iso) => ({
        iso,
        parts: dateParts(iso),
        free: freeSlotCount(iso, trainerId),
      })),
    [trainerId],
  );

  const daySlots = useMemo(() => {
    if (!selectedDate || !trainerId) return [];
    return slotsForDate(selectedDate).map((slot) => ({
      slot,
      free: isSlotFree(selectedDate, trainerId, slot),
    }));
  }, [selectedDate, trainerId]);

  /** Onay kodu tamamen seçimlerin karmasından; her yenilemede aynı kalır. */
  const confirmationCode = useMemo(() => {
    const seed = `${classId ?? '-'}|${trainerId ?? '-'}|${selectedDate ?? '-'}|${selectedTime ?? '-'}`;
    return `FRG-${(hashString(seed) % 900000) + 100000}`;
  }, [classId, trainerId, selectedDate, selectedTime]);

  const summaryLine = useMemo(() => {
    if (!chosenClass) return null;
    const parts = [chosenClass.name];
    if (chosenTrainer) parts.push(chosenTrainer.name);
    if (selectedDate) parts.push(formatLongDate(selectedDate));
    if (selectedTime) parts.push(selectedTime);
    return parts.join(' · ');
  }, [chosenClass, chosenTrainer, selectedDate, selectedTime]);

  /** Adım doğrulaması: hata metnini üretir, geçerliyse null döner. */
  const validateStep = useCallback(
    (index: number): string | null => {
      if (index === 0) {
        if (!goalId) return 'Devam etmek için bir hedef seçin.';
        if (!levelId) return 'Devam etmek için mevcut seviyenizi seçin.';
        return null;
      }
      if (index === 1) {
        if (!classId) return 'Başlamak istediğiniz dersi seçin.';
        if (!trainerId) return 'Bu dersi veren eğitmenlerden birini seçin.';
        return null;
      }
      if (index === 2) {
        if (!selectedDate) return 'Takvimden bir gün seçin.';
        if (!selectedTime) return 'Seçtiğiniz gün için uygun bir saat seçin.';
        return null;
      }
      if (index === 3) {
        if (fullName.trim().length < 3) return 'Ad soyad en az 3 karakter olmalı.';
        if (digitCount(phone) < 10) return 'Telefon numarası en az 10 rakam içermeli.';
        if (email.trim().length > 0 && !email.includes('@')) return 'E-posta adresi geçerli görünmüyor.';
        if (!consent) return 'Devam etmek için bilgilendirme onayını işaretleyin.';
        return null;
      }
      return null;
    },
    [goalId, levelId, classId, trainerId, selectedDate, selectedTime, fullName, phone, email, consent],
  );

  /** Bir adıma atlanabilmesi için önceki tüm adımların geçerli olması gerekir. */
  const maxReachableStep = useMemo(() => {
    let reachable = 0;
    while (reachable < WIZARD_STEPS.length - 1 && validateStep(reachable) === null) {
      reachable += 1;
    }
    return reachable;
  }, [validateStep]);

  const goToStep = useCallback(
    (target: number) => {
      if (target <= step) {
        setStep(target);
        setFormError(null);
        return;
      }
      for (let index = step; index < target; index += 1) {
        const error = validateStep(index);
        if (error) {
          setStep(index);
          setFormError(error);
          return;
        }
      }
      setStep(target);
      setFormError(null);
    },
    [step, validateStep],
  );

  const handleNext = useCallback(() => {
    const error = validateStep(step);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    setStep((current) => Math.min(current + 1, WIZARD_STEPS.length - 1));
  }, [step, validateStep]);

  const handleBack = useCallback(() => {
    setFormError(null);
    setStep((current) => Math.max(current - 1, 0));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      for (let index = 0; index < WIZARD_STEPS.length - 1; index += 1) {
        const error = validateStep(index);
        if (error) {
          setStep(index);
          setFormError(error);
          return;
        }
      }
      setFormError(null);
      // Gerçek bir API yok; demo olduğu için sadece başarı durumuna geçiyoruz.
      setIsSubmitted(true);
    },
    [validateStep],
  );

  const resetForm = useCallback(() => {
    setIsSubmitted(false);
    setStep(0);
    setGoalId(null);
    setLevelId(null);
    setPlanId(null);
    setClassId(null);
    setTrainerId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setNote('');
    setConsent(false);
    setFormError(null);
  }, []);

  const applyQuizResult = useCallback(() => {
    if (!quizResult) return;
    const [focus] = quizAnswers;
    setPlanId(quizResult.plan.id);
    const firstClass = quizResult.classes[0];
    if (firstClass) setClassId(firstClass.id);
    if (quizResult.trainer) setTrainerId(quizResult.trainer.id);
    if (focus) setGoalId(focus);
    setSelectedTime(null);
    setIsSubmitted(false);
    setFormError(null);
    setStep(0);
    scrollToSignup();
  }, [quizResult, quizAnswers, scrollToSignup]);

  const dialogTrainer = dialog?.type === 'trainer' ? findTrainer(dialog.id) : null;
  const dialogClass = dialog?.type === 'class' ? findClass(dialog.id) : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-950 font-sans text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/85 px-4 py-4 backdrop-blur-md md:px-16">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-lime-400/40 hover:bg-lime-400/10 hover:text-lime-300"
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
            onClick={() =>
              openWhatsApp(
                'Merhaba Forge Athletic Club, üyelik paketleri ve deneme dersi hakkında bilgi almak istiyorum.',
              )
            }
            className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-lime-400 to-green-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_20px_rgba(163,230,53,0.25)] transition-all hover:from-lime-300 hover:to-green-400"
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
            initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
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
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-lime-300 active:scale-95"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Ücretsiz Deneme Dersi
              </a>
              <a
                href="#uyelik"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-all hover:border-lime-400/40 hover:text-lime-300"
              >
                Üyelik Paketleri
              </a>
            </div>

            <dl className="grid max-w-lg grid-cols-3 gap-4 pt-8">
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wider text-zinc-500">Antrenman alanı</dt>
                <dd className="text-2xl font-black text-lime-400">2.400 m²</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wider text-zinc-500">Haftalık ders</dt>
                <dd className="text-2xl font-black text-lime-400">40+</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wider text-zinc-500">Stüdyo</dt>
                <dd className="text-2xl font-black text-lime-400">3</dd>
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
              %{Math.round(YEARLY_DISCOUNT * 100)} avantaj. Paketi seçtiğinizde kayıt formu o paketle
              doldurulur.
            </p>
          </div>

          {/* Ödeme periyodu geçişi */}
          <div className="mb-12 flex justify-center">
            <div
              role="group"
              aria-label="Ödeme periyodu"
              className="inline-flex items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-1"
            >
              <button
                type="button"
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
                className={`min-h-[40px] rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
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
                className={`flex min-h-[40px] items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
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
              const yearlySaving = plan.monthlyPrice * 12 - plan.monthlyPrice * 12 * (1 - YEARLY_DISCOUNT);
              const isChosen = planId === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className={`relative flex min-w-0 flex-col rounded-3xl border p-7 ${
                    plan.highlighted
                      ? 'border-lime-400/60 bg-gradient-to-b from-lime-400/[0.08] to-zinc-900 shadow-[0_0_50px_-12px_rgba(163,230,53,0.35)] lg:-translate-y-3'
                      : 'border-zinc-800 bg-zinc-900/60'
                  } ${isChosen ? 'ring-2 ring-lime-400/70' : ''}`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime-400 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-950">
                      En Popüler
                    </span>
                  )}

                  <h3 className="text-lg font-black uppercase tracking-wide text-white">{plan.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{plan.summary}</p>

                  <div className="mt-6 border-y border-zinc-800 py-6">
                    <div className="flex flex-wrap items-end gap-2">
                      <span className="font-mono text-4xl font-black text-lime-400">
                        {formatPrice(monthlyEquivalent)}
                      </span>
                      <span className="pb-1 text-xs text-zinc-500">/ ay</span>
                      {billing === 'yearly' && (
                        <span className="mb-1 rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-0.5 text-[10px] font-bold text-lime-300">
                          Yılda {formatPrice(yearlySaving)} tasarruf
                        </span>
                      )}
                    </div>

                    {billing === 'yearly' ? (
                      <p className="mt-2 text-[11px] text-zinc-400">
                        <span className="text-zinc-500 line-through">{formatPrice(plan.monthlyPrice)}</span>{' '}
                        yerine · Yıllık tek çekim {formatPrice(yearlyTotal)}
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] text-zinc-500">Aylık ödeme · İstediğin ay iptal et</p>
                    )}
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex min-w-0 items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
                        <span className="min-w-0">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => prefillFromPlan(plan.id)}
                    aria-pressed={isChosen}
                    className={`mt-7 min-h-[44px] w-full rounded-xl px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                      plan.highlighted
                        ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300'
                        : 'border border-zinc-700 bg-zinc-950 text-zinc-100 hover:border-lime-400/50 hover:text-lime-300'
                    }`}
                  >
                    {isChosen ? `${plan.name} seçildi` : 'Üyeliği Seç'}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Karşılaştırma — masaüstünde tablo, mobilde yığılmış kartlar */}
          <div className="mt-14">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-black uppercase tracking-wide text-white">
                Paket Karşılaştırması
              </h3>
              <p className="text-[11px] text-zinc-500">
                Geniş ekranda tabloyu yatay kaydırabilirsiniz.
              </p>
            </div>

            {/* Tablo yalnızca kendi kabında kayar; sayfa yatay taşmaz. */}
            <div className="hidden overflow-x-auto rounded-3xl border border-zinc-800 md:block">
              <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                <caption className="sr-only">
                  Forge Athletic Club üyelik paketlerinin özellik karşılaştırması
                </caption>
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/70">
                    <th scope="col" className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Özellik
                    </th>
                    {PLANS.map((plan) => (
                      <th
                        key={plan.id}
                        scope="col"
                        className={`px-5 py-4 text-[11px] font-bold uppercase tracking-wide ${
                          plan.highlighted ? 'text-lime-300' : 'text-zinc-200'
                        }`}
                      >
                        {plan.name}
                        <span className="mt-1 block font-mono text-[11px] font-normal normal-case text-zinc-500">
                          {formatPrice(
                            billing === 'yearly'
                              ? plan.monthlyPrice * (1 - YEARLY_DISCOUNT)
                              : plan.monthlyPrice,
                          )}{' '}
                          / ay
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-800/60 last:border-b-0">
                      <th scope="row" className="px-5 py-3.5 text-[11px] font-semibold text-zinc-400">
                        {row.label}
                      </th>
                      {PLANS.map((plan) => (
                        <td key={plan.id} className="px-5 py-3.5 text-[11px]">
                          <FeatureValue value={row.values[plan.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-zinc-900/50">
                    <th scope="row" className="px-5 py-4 text-[11px] font-semibold text-zinc-400">
                      Seçim
                    </th>
                    {PLANS.map((plan) => (
                      <td key={plan.id} className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => prefillFromPlan(plan.id)}
                          className="min-h-[40px] w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-100 transition-colors hover:border-lime-400/50 hover:text-lime-300"
                        >
                          {planId === plan.id ? 'Seçildi' : 'Üyeliği Seç'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobil: paket başına yığılmış kart */}
            <div className="space-y-4 md:hidden">
              {PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`min-w-0 rounded-3xl border p-5 ${
                    plan.highlighted ? 'border-lime-400/50 bg-lime-400/[0.06]' : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  <div className="flex min-w-0 items-baseline justify-between gap-3">
                    <h4 className="min-w-0 truncate text-sm font-black uppercase tracking-wide text-white">
                      {plan.name}
                    </h4>
                    <span className="shrink-0 font-mono text-sm font-bold text-lime-400">
                      {formatPrice(
                        billing === 'yearly' ? plan.monthlyPrice * (1 - YEARLY_DISCOUNT) : plan.monthlyPrice,
                      )}
                      <span className="text-[10px] font-normal text-zinc-500"> / ay</span>
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2">
                    {FEATURE_ROWS.map((row) => (
                      <div
                        key={row.label}
                        className="flex min-w-0 items-start justify-between gap-3 border-b border-zinc-800/60 pb-2 text-[11px] last:border-b-0"
                      >
                        <dt className="min-w-0 text-zinc-500">{row.label}</dt>
                        <dd className="min-w-0 text-right">
                          <FeatureValue value={row.values[plan.id]} />
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <button
                    type="button"
                    onClick={() => prefillFromPlan(plan.id)}
                    className="mt-4 min-h-[44px] w-full rounded-xl bg-lime-400 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
                  >
                    {planId === plan.id ? `${plan.name} seçildi` : 'Üyeliği Seç'}
                  </button>
                </article>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-zinc-600" aria-live="polite">
              {chosenPlan
                ? `Kayıt formu ${chosenPlan.name} paketiyle dolduruldu.`
                : 'Henüz paket seçilmedi. Bir paket seçtiğinizde kayıt formuna aktarılır.'}
            </p>
          </div>
        </div>
      </section>

      {/* Haftalık ders programı */}
      <section
        id="program"
        className="scroll-mt-20 border-y border-zinc-800 bg-zinc-900/40 px-6 py-20 md:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">Program</span>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                Haftalık Ders Takvimi
              </h2>
              <p className="mt-3 text-sm text-zinc-400">
                {activeDayLabel} günü {daySessions.length} ders · toplam {dayRemainingTotal} boş kontenjan.
                Dersi seçtiğinizde “Programım” listesine eklenir.
              </p>
            </div>
            <div className="flex min-w-0 items-start gap-2 text-[11px] text-zinc-500">
              <Timer className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
              <span className="min-w-0">Rezervasyonlar ders saatinden 1 saat öncesine kadar açıktır.</span>
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
              const dayTotal = SCHEDULE[day.key].reduce(
                (total, entry) =>
                  total + remainingSeats(day.key, entry.classId, findClass(entry.classId)?.capacity ?? 0),
                0,
              );
              return (
                <button
                  key={day.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveDay(day.key)}
                  className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border px-2 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'border-lime-400 bg-lime-400 text-zinc-950'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-lime-400/40 hover:text-lime-300'
                  }`}
                >
                  <span aria-hidden="true">{day.short}</span>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 text-[9px] font-semibold normal-case ${
                      isActive ? 'text-zinc-800' : 'text-zinc-600'
                    }`}
                  >
                    {dayTotal} yer
                  </span>
                  <span className="sr-only">
                    {day.long}, {SCHEDULE[day.key].length} ders, {dayTotal} boş kontenjan
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            <div className="min-w-0">
              {/* Masaüstünde tablo başlığı; mobilde kart düzenine geçtiği için gizli. */}
              <div className="hidden grid-cols-[84px_1fr_170px_190px] gap-4 border-b border-zinc-800 px-5 pb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 lg:grid">
                <span>Saat</span>
                <span>Ders</span>
                <span>Eğitmen</span>
                <span>Kontenjan</span>
              </div>

              <ul className="divide-y divide-zinc-800/70">
                {daySessions.map((session) => {
                  const classType = session.classType;
                  if (!classType) return null;
                  const trainer = findTrainer(classType.primaryTrainerId);
                  const isBooked = bookedKeys.has(session.key);
                  const onWaitlist = waitlist.includes(session.key);
                  const filled = session.capacity - session.remaining;

                  return (
                    <li
                      key={session.key}
                      className="grid grid-cols-1 gap-3 px-1 py-5 lg:grid-cols-[84px_1fr_170px_190px] lg:items-center lg:gap-4 lg:px-5"
                    >
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-lime-400">
                        <Clock className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                        {session.time}
                      </div>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => setDialog({ type: 'class', id: classType.id })}
                          className="min-h-[40px] max-w-full text-left text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-lime-300 hover:underline"
                        >
                          <span className="block truncate">{classType.name}</span>
                          <span className="sr-only">ders detayını aç</span>
                        </button>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${intensityStyles[classType.intensity]}`}
                          >
                            {classType.intensity} zorluk
                          </span>
                          <span className="inline-block rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-400">
                            {classType.durationMin} dk
                          </span>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-400">
                        <Users className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
                        {trainer ? (
                          <button
                            type="button"
                            onClick={() => setDialog({ type: 'trainer', id: trainer.id })}
                            className="min-h-[40px] min-w-0 truncate text-left underline-offset-4 transition-colors hover:text-lime-300 hover:underline"
                          >
                            {trainer.name}
                            <span className="sr-only"> eğitmen profilini aç</span>
                          </button>
                        ) : (
                          <span className="min-w-0 truncate">Eğitmen atanacak</span>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-800"
                            aria-hidden="true"
                          >
                            <div
                              className={`h-full rounded-full ${session.isFull ? 'bg-orange-400' : 'bg-lime-400'}`}
                              style={{
                                width: `${Math.min(100, (filled / Math.max(1, session.capacity)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span
                            className={`min-w-0 text-[11px] font-semibold ${
                              session.isFull ? 'text-orange-300' : 'text-zinc-300'
                            }`}
                          >
                            {session.isFull
                              ? 'Kontenjan dolu'
                              : `${session.remaining} / ${session.capacity} yer`}
                          </span>
                        </div>

                        {session.isFull ? (
                          <button
                            type="button"
                            onClick={() => toggleWaitlist(session.key)}
                            aria-pressed={onWaitlist}
                            className={`min-h-[40px] w-full rounded-xl border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                              onWaitlist
                                ? 'border-orange-400/60 bg-orange-400/15 text-orange-200'
                                : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-orange-400/50 hover:text-orange-300'
                            }`}
                          >
                            {onWaitlist ? 'Yedek listesindesin' : 'Yedek listesine yaz'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleBooking(activeDay, session.time, classType.id)}
                            aria-pressed={isBooked}
                            className={`min-h-[40px] w-full rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                              isBooked
                                ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300'
                                : 'border border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-lime-400/50 hover:text-lime-300'
                            }`}
                          >
                            {isBooked ? 'Programımda' : 'Programıma ekle'}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Programım */}
            <aside className="min-w-0 self-start rounded-3xl border border-zinc-800 bg-zinc-950 p-5 lg:sticky lg:top-24">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 shrink-0 text-lime-400" aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-wide text-white">Programım</h3>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500" aria-live="polite">
                {sortedProgram.length === 0
                  ? 'Haftalık seçilen ders: 0. Listeden ders ekleyerek haftanı kurmaya başla.'
                  : `Haftalık seçilen ders: ${sortedProgram.length} · toplam ${weeklyMinutes} dakika antrenman.`}
              </p>

              {sortedProgram.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-zinc-800 px-4 py-6 text-center text-[11px] text-zinc-600">
                  Henüz ders eklemedin. Soldaki takvimden “Programıma ekle” butonuna dokun.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {sortedProgram.map((item) => {
                    const classType = findClass(item.classId);
                    const dayLabel = WEEK_DAYS.find((day) => day.key === item.dayKey)?.long ?? '';
                    return (
                      <li
                        key={item.key}
                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-2.5"
                      >
                        <span className="shrink-0 rounded-lg bg-lime-400/10 px-2 py-1 font-mono text-[11px] font-bold text-lime-300">
                          {item.time}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-white">
                            {classType?.name ?? 'Ders'}
                          </span>
                          <span className="block truncate text-[10px] text-zinc-500">
                            {dayLabel} · {classType?.durationMin ?? 0} dk ·{' '}
                            {findTrainer(classType?.primaryTrainerId ?? null)?.name ?? '—'}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBooking(item.key)}
                          aria-label={`${classType?.name ?? 'Ders'} dersini programdan çıkar (${dayLabel} ${item.time})`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-500 transition-colors hover:border-orange-400/50 hover:text-orange-300"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {waitlist.length > 0 && (
                <p className="mt-4 rounded-2xl border border-orange-400/25 bg-orange-400/5 px-3 py-2.5 text-[11px] text-orange-200">
                  {waitlist.length} ders için yedek listesindesin. Yer açıldığında bildirim gönderilir.
                </p>
              )}

              {sortedProgram.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const first = sortedProgram[0];
                    if (first) prefillFromClass(first.classId);
                  }}
                  className="mt-4 min-h-[44px] w-full rounded-xl bg-lime-400 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
                >
                  Bu programla kayıt oluştur
                </button>
              )}

              <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">
                Kontenjan bilgisi demo amaçlı sabit bir örnek haftadan üretilir; gerçek rezervasyon
                yapılmaz.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Günlük yoğunluk haritası */}
      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                Salon Yoğunluğu
              </span>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                Günlük Yoğunluk Haritası
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Hangi saatte hangi gün ne kadar kalabalık olduğunu görün; sakin saatlerde ekipman
                bekleme süresi kısalır.
              </p>
            </div>

            <ul className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400">
              {HEATMAP_LEVELS.map((level) => (
                <li key={level.label} className="flex items-center gap-1.5">
                  <span className={`h-3 w-3 shrink-0 rounded ${level.dot}`} aria-hidden="true" />
                  {level.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Tablo kendi kabında kayar; sayfa yatay taşmaz. */}
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full min-w-[560px] border-collapse text-center text-[11px]">
              <caption className="sr-only">
                Haftanın günlerine ve saatlere göre tahmini salon yoğunluğu
              </caption>
              <thead>
                <tr className="border-b border-zinc-800">
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Gün
                  </th>
                  {HEATMAP_HOURS.map((hour) => (
                    <th key={hour} scope="col" className="px-2 py-3 font-mono text-[11px] font-semibold text-zinc-400">
                      {hour}:00
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEK_DAYS.map((day) => (
                  <tr key={day.key} className="border-b border-zinc-800/60 last:border-b-0">
                    <th scope="row" className="px-4 py-2 text-left text-[11px] font-semibold text-zinc-300">
                      {day.long}
                    </th>
                    {HEATMAP_HOURS.map((hour) => {
                      const level = occupancyLevel(day.key, hour);
                      const meta = HEATMAP_LEVELS[level];
                      return (
                        <td key={hour} className="px-1 py-1">
                          <span
                            className={`flex h-9 items-center justify-center rounded-lg text-[10px] font-semibold ${meta.cell}`}
                          >
                            <span aria-hidden="true">{level === 0 ? '·' : level}</span>
                            <span className="sr-only">
                              {day.long} saat {hour}:00 — {meta.label}
                            </span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[11px] text-zinc-600">
            Değerler demo amaçlı sabit bir örnek haftadan üretilmiştir; canlı doluluk verisi değildir.
          </p>
        </div>
      </section>

      {/* Eğitmen kadrosu */}
      <section
        id="egitmenler"
        className="scroll-mt-20 border-y border-zinc-800 bg-zinc-900/40 px-6 py-20 md:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">Kadro</span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Eğitmenlerimiz
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Her eğitmen kendi ders bloğunu yürütür; sertifikaları, uzmanlık alanları ve verdiği
              dersler için karta dokunun.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRAINERS.map((trainer) => {
              const trainerClasses = classesOfTrainer(trainer.id);
              return (
                <motion.article
                  key={trainer.id}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 transition-all hover:border-lime-400/40"
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

                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                    <div className="min-w-0">
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
                    <p className="text-[11px] text-zinc-500">
                      {trainerClasses.length} derste görev alıyor
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setDialog({ type: 'trainer', id: trainer.id })}
                        className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
                      >
                        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                        Profili Aç
                      </button>
                      <button
                        type="button"
                        onClick={() => prefillFromTrainer(trainer.id)}
                        className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-lime-400 px-3 py-2 text-[11px] font-bold text-zinc-950 transition-colors hover:bg-lime-300"
                      >
                        <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                        Bu Eğitmenle Çalış
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hedefe göre program önerisi */}
      <section className="px-6 py-20 md:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">
              Program Önerisi
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Hedefine Göre Nereden Başlamalı?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Üç kısa soru; sana uygun paketi, iki dersi ve eğitmeni öneriyoruz. Öneri sabit bir
              eşleme tablosundan üretilir, kişisel bir sağlık tavsiyesi değildir.
            </p>
          </div>

          <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 md:p-7">
            {QUIZ.map((question, questionIndex) => (
              <fieldset key={question.id} className="min-w-0">
                <legend className="mb-2 text-xs font-bold text-white">
                  {questionIndex + 1}. {question.question}
                </legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => {
                    const active = quizAnswers[questionIndex] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setQuizAnswer(questionIndex, option.id)}
                        className={`flex min-h-[64px] min-w-0 flex-col items-start justify-center rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? 'border-lime-400 bg-lime-400/15 text-white'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-lime-400/40 hover:text-white'
                        }`}
                      >
                        <span className="w-full truncate text-xs font-semibold">{option.label}</span>
                        <span className="w-full text-[10px] leading-snug text-zinc-500">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setQuizSubmitted(true)}
                disabled={!quizComplete}
                className={`min-h-[44px] flex-1 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  quizComplete
                    ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300'
                    : 'cursor-not-allowed bg-zinc-800 text-zinc-500'
                }`}
              >
                Önerimi Göster
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="min-h-[44px] rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
              >
                Sıfırla
              </button>
            </div>

            <p className="text-center text-[11px] text-zinc-500" aria-live="polite">
              {quizComplete
                ? 'Üç soru yanıtlandı. Önerini görebilirsin.'
                : `${quizAnswers.filter(Boolean).length}/3 soru yanıtlandı.`}
            </p>

            <AnimatePresence initial={false}>
              {quizSubmitted && quizResult && (
                <motion.div
                  key="quiz-result"
                  initial={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1, height: 'auto' }}
                  exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-lime-400/30 bg-lime-400/[0.06] p-5">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-lime-300">
                      <Target className="h-3.5 w-3.5" aria-hidden="true" />
                      Önerilen başlangıç
                    </span>

                    <h3 className="mt-2 text-lg font-black uppercase tracking-wide text-white">
                      {quizResult.plan.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">{quizResult.note}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{quizResult.weeklyPlan}</p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {quizResult.classes.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDialog({ type: 'class', id: item.id })}
                          className="flex min-h-[56px] min-w-0 flex-col items-start justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-left transition-colors hover:border-lime-400/40"
                        >
                          <span className="w-full truncate text-xs font-semibold text-white">
                            {item.name}
                          </span>
                          <span className="w-full truncate text-[10px] text-zinc-500">
                            {item.durationMin} dk · {item.intensity} zorluk · detay için dokun
                          </span>
                        </button>
                      ))}
                    </div>

                    {quizResult.trainer && (
                      <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <SafeImage
                            accent="text-lime-400"
                            src={quizResult.trainer.image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-white">
                            {quizResult.trainer.name}
                          </span>
                          <span className="block truncate text-[10px] text-zinc-500">
                            {quizResult.trainer.title}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setDialog({ type: 'trainer', id: quizResult.trainer!.id })}
                          className="min-h-[40px] shrink-0 rounded-xl border border-zinc-800 px-3 py-2 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
                        >
                          Profil
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={applyQuizResult}
                      className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      Bu Öneriyle Forma Geç
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Kayıt sihirbazı */}
      <section
        id="deneme"
        className="scroll-mt-20 border-t border-zinc-800 bg-zinc-900/40 px-6 py-20 md:px-16"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">
              Ücretsiz Deneme
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              İlk Dersin Bizden
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Beş adımda hedefini, dersini, eğitmenini ve saatini seç. Ekip aynı gün arayarak planı
              teyit eder; taahhüt yok, kayıt ücreti yok.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex min-w-0 items-start gap-2.5">
                <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" aria-hidden="true" />
                <span className="min-w-0">Vücut kompozisyon analizi ve hareket taraması</span>
              </li>
              <li className="flex min-w-0 items-start gap-2.5">
                <Dumbbell className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" aria-hidden="true" />
                <span className="min-w-0">Eğitmen eşliğinde tanıtım antrenmanı</span>
              </li>
              <li className="flex min-w-0 items-start gap-2.5">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" aria-hidden="true" />
                <span className="min-w-0">Tesis turu ve haftalık ders programı planlaması</span>
              </li>
            </ul>

            {/* Canlı özet kartı — hangi adımda olursanız olun seçimleri gösterir. */}
            <div className="rounded-3xl border border-lime-400/25 bg-lime-400/[0.06] p-5" aria-live="polite">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-lime-300">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Kayıt Özeti
              </span>
              {summaryLine ? (
                <>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-white">{summaryLine}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
                      <dt className="text-zinc-500">Süre</dt>
                      <dd className="mt-0.5 font-semibold text-white">
                        {chosenClass ? `${chosenClass.durationMin} dk` : '—'}
                      </dd>
                    </div>
                    <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
                      <dt className="text-zinc-500">Paket</dt>
                      <dd className="mt-0.5 truncate font-semibold text-lime-300">
                        {chosenPlan?.name ?? 'Seçilmedi'}
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  Henüz seçim yapılmadı. Formda ders ve eğitmen seçtiğinizde özet burada güncellenir.
                </p>
              )}
            </div>

            <div className="relative h-40 overflow-hidden rounded-3xl border border-zinc-800">
              <SafeImage
                accent="text-lime-400"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=75"
                alt="Forge Athletic Club serbest ağırlık bölgesi"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-80"
              />
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 md:p-7">
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
                  <CheckCircle2 className="mx-auto h-12 w-12 text-lime-400" aria-hidden="true" />
                  <h3 className="text-lg font-black uppercase tracking-wide text-white">
                    Başvurun Alındı
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {fullName.trim() ? `${fullName.trim()}, ` : ''}deneme dersi talebini kaydettik.
                    Ekibimiz {phone} numarasından arayarak saati teyit edecek.
                  </p>

                  <p className="mx-auto inline-flex items-center gap-2 rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-2 font-mono text-sm font-bold text-lime-300">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    {confirmationCode}
                  </p>

                  <dl className="mx-auto max-w-sm space-y-2 text-left text-[11px]">
                    {[
                      { label: 'Hedef', value: chosenGoal?.label ?? '—' },
                      { label: 'Seviye', value: chosenLevel?.label ?? '—' },
                      { label: 'Ders', value: chosenClass?.name ?? '—' },
                      { label: 'Eğitmen', value: chosenTrainer?.name ?? '—' },
                      { label: 'Tarih', value: selectedDate ? formatLongDate(selectedDate) : '—' },
                      { label: 'Saat', value: selectedTime ?? '—' },
                      { label: 'Paket', value: chosenPlan?.name ?? 'Görüşmede belirlenecek' },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2"
                      >
                        <dt className="shrink-0 text-zinc-500">{row.label}</dt>
                        <dd className="min-w-0 text-right font-semibold text-white">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="min-h-[44px] rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
                    >
                      Yeni Başvuru
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          `Merhaba, ${confirmationCode} kodlu deneme dersi başvurumu (${
                            chosenClass?.name ?? 'ders'
                          }, ${selectedDate ? formatLongDate(selectedDate) : ''} ${
                            selectedTime ?? ''
                          }) teyit eder misiniz?`,
                        )
                      }
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
                    >
                      <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
                      WhatsApp ile Teyit
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-600">
                    Bu bir demo formudur; bilgiler hiçbir yere gönderilmez.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={reduceMotion ? undefined : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  className="space-y-5"
                  noValidate
                >
                  <h3 className="text-base font-black uppercase tracking-wide text-white">
                    Deneme Dersi Kaydı
                  </h3>

                  {/* Adım göstergesi */}
                  <ol className="grid grid-cols-5 gap-1.5">
                    {WIZARD_STEPS.map((wizardStep, index) => {
                      const isActive = index === step;
                      const isDone = index < step;
                      const reachable = index <= Math.max(step, maxReachableStep);
                      return (
                        <li key={wizardStep.id} className="min-w-0">
                          <button
                            type="button"
                            onClick={() => goToStep(index)}
                            disabled={!reachable}
                            aria-current={isActive ? 'step' : undefined}
                            aria-label={`Adım ${index + 1}: ${wizardStep.label}`}
                            className={`flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 transition-colors ${
                              isActive
                                ? 'border-lime-400 bg-lime-400/15'
                                : isDone
                                  ? 'border-lime-500/30 bg-lime-500/5'
                                  : 'border-zinc-800 bg-zinc-900/60'
                            } ${reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-lime-400 text-zinc-950'
                                  : isDone
                                    ? 'bg-lime-500 text-zinc-950'
                                    : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {isDone ? '✓' : index + 1}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`w-full truncate text-center text-[10px] font-medium ${
                                isActive ? 'text-lime-200' : 'text-zinc-500'
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
                      className="flex min-w-0 items-start gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2.5 text-[11px] text-orange-200"
                    >
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">{formError}</span>
                    </p>
                  )}

                  {/* Adım 1 — Hedef & Seviye */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <fieldset className="min-w-0">
                        <legend className="mb-2 text-xs font-bold text-white">1. Hedefin nedir?</legend>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {GOALS.map((goal) => {
                            const active = goalId === goal.id;
                            return (
                              <button
                                key={goal.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setGoalId(goal.id);
                                  setFormError(null);
                                }}
                                className={`flex min-h-[56px] min-w-0 flex-col items-start justify-center rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                  active
                                    ? 'border-lime-400 bg-lime-400/15 text-white'
                                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-lime-400/40 hover:text-white'
                                }`}
                              >
                                <span className="w-full truncate text-xs font-semibold">{goal.label}</span>
                                <span className="w-full text-[10px] leading-snug text-zinc-500">
                                  {goal.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <fieldset className="min-w-0">
                        <legend className="mb-2 text-xs font-bold text-white">
                          2. Mevcut seviyen
                        </legend>
                        <div className="space-y-2">
                          {LEVELS.map((level) => {
                            const active = levelId === level.id;
                            return (
                              <button
                                key={level.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setLevelId(level.id);
                                  setFormError(null);
                                }}
                                className={`flex min-h-[52px] w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                  active
                                    ? 'border-lime-400 bg-lime-400/15'
                                    : 'border-zinc-800 bg-zinc-900/60 hover:border-lime-400/40'
                                }`}
                              >
                                <Activity
                                  className={`h-4 w-4 shrink-0 ${active ? 'text-lime-400' : 'text-zinc-600'}`}
                                  aria-hidden="true"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-xs font-semibold text-white">
                                    {level.label}
                                  </span>
                                  <span className="block truncate text-[10px] text-zinc-500">
                                    {level.description}
                                  </span>
                                </span>
                                {active && (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-400" aria-hidden="true" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <p className="text-[11px] text-zinc-500">
                        {chosenPlan
                          ? `Seçili paket: ${chosenPlan.name}. Üyelik bölümünden değiştirebilirsin.`
                          : 'Paket seçimi zorunlu değil; görüşmede birlikte belirleyebiliriz.'}
                      </p>
                    </div>
                  )}

                  {/* Adım 2 — Ders & Eğitmen */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <fieldset className="min-w-0">
                        <legend className="mb-2 text-xs font-bold text-white">1. Ders seç</legend>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {CLASS_TYPES.map((item) => {
                            const active = classId === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setClassId(item.id);
                                  setTrainerId(item.primaryTrainerId);
                                  setSelectedTime(null);
                                  setFormError(null);
                                }}
                                className={`flex min-h-[56px] min-w-0 flex-col items-start justify-center rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                  active
                                    ? 'border-lime-400 bg-lime-400/15 text-white'
                                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-lime-400/40 hover:text-white'
                                }`}
                              >
                                <span className="w-full truncate text-xs font-semibold">{item.name}</span>
                                <span className="w-full truncate text-[10px] text-zinc-500">
                                  {item.durationMin} dk · {item.intensity} zorluk
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <fieldset className="min-w-0">
                        <legend className="mb-2 text-xs font-bold text-white">2. Eğitmen seç</legend>
                        {!chosenClass ? (
                          <p className="rounded-xl border border-dashed border-zinc-800 px-3 py-4 text-center text-[11px] text-zinc-500">
                            Önce bir ders seçin; bu dersi veren eğitmenler burada listelenecek.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {eligibleTrainers.map((trainer) => {
                              const active = trainerId === trainer.id;
                              return (
                                <button
                                  key={trainer.id}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() => {
                                    setTrainerId(trainer.id);
                                    setSelectedTime(null);
                                    setFormError(null);
                                  }}
                                  className={`flex min-h-[56px] w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                    active
                                      ? 'border-lime-400 bg-lime-400/15'
                                      : 'border-zinc-800 bg-zinc-900/60 hover:border-lime-400/40'
                                  }`}
                                >
                                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <SafeImage
                                      accent="text-lime-400"
                                      src={trainer.image}
                                      alt=""
                                      fill
                                      sizes="40px"
                                      className="object-cover"
                                    />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs font-semibold text-white">
                                      {trainer.name}
                                    </span>
                                    <span className="block truncate text-[10px] text-zinc-500">
                                      {trainer.title}
                                    </span>
                                  </span>
                                  {active && (
                                    <CheckCircle2
                                      className="h-4 w-4 shrink-0 text-lime-400"
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

                  {/* Adım 3 — Tarih & Saat */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">Uygun gün seç</h4>
                          <span className="text-[10px] text-zinc-500">
                            14 günlük takvim · yatay kaydırın
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
                                        ? 'border-lime-400 bg-lime-400/20'
                                        : closed
                                          ? 'cursor-not-allowed border-zinc-800/60 bg-zinc-900/40 opacity-50'
                                          : 'border-zinc-800 bg-zinc-900/60 hover:border-lime-400/40'
                                    }`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={`text-[10px] uppercase tracking-wide ${
                                        active ? 'text-lime-200' : 'text-zinc-500'
                                      }`}
                                    >
                                      {parts.weekdayShort}
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className={`text-lg font-black tabular-nums ${
                                        active ? 'text-white' : 'text-zinc-200'
                                      }`}
                                    >
                                      {parts.day}
                                    </span>
                                    <span aria-hidden="true" className="text-[10px] text-zinc-500">
                                      {parts.monthShort}
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                                        closed ? 'bg-zinc-900 text-zinc-600' : 'bg-lime-400/15 text-lime-300'
                                      }`}
                                    >
                                      {closed ? 'Dolu' : `${free} saat`}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <p className="text-[10px] text-zinc-600">
                          Uygunluk, seçtiğiniz eğitmenin ders programından türetilir. Takvim demo
                          amaçlı sabit bir örnek dönemi gösterir.
                        </p>
                      </div>

                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">Saat seç</h4>
                          {selectedDate && (
                            <span className="text-[10px] text-zinc-500">{formatLongDate(selectedDate)}</span>
                          )}
                        </div>

                        {!selectedDate ? (
                          <p className="rounded-xl border border-dashed border-zinc-800 px-3 py-6 text-center text-[11px] text-zinc-500">
                            Saatleri görmek için yukarıdan bir gün seçin.
                          </p>
                        ) : (
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
                                      ? 'border-lime-400 bg-lime-400 text-zinc-950'
                                      : free
                                        ? 'border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:border-lime-400/40'
                                        : 'cursor-not-allowed border-zinc-800/60 bg-zinc-900/30 text-zinc-600 line-through'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Adım 4 — İletişim */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="trial-name"
                          className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                        >
                          Ad Soyad
                        </label>
                        <input
                          id="trial-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          placeholder="Örn. Ayşe Korkmaz"
                          className="min-h-[44px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="trial-phone"
                          className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                        >
                          Telefon
                        </label>
                        <input
                          id="trial-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="0555 000 00 00"
                          className="min-h-[44px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="trial-email"
                          className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                        >
                          E-posta <span className="normal-case text-zinc-600">(isteğe bağlı)</span>
                        </label>
                        <input
                          id="trial-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="ornek@eposta.com"
                          className="min-h-[44px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="trial-note"
                          className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                        >
                          Not <span className="normal-case text-zinc-600">(sakatlık, kısıt vb.)</span>
                        </label>
                        <textarea
                          id="trial-note"
                          name="note"
                          rows={3}
                          value={note}
                          onChange={(event) => setNote(event.target.value)}
                          placeholder="Eğitmenin bilmesi gerekenler"
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-lime-400 focus:outline-none"
                        />
                      </div>

                      <label
                        htmlFor="trial-consent"
                        className="flex min-h-[44px] min-w-0 items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-[11px] leading-relaxed text-zinc-400"
                      >
                        <input
                          id="trial-consent"
                          name="consent"
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-700 bg-zinc-900 accent-lime-400"
                        />
                        <span className="min-w-0">
                          Bilgilerimin deneme dersi planlaması için kullanılmasını onaylıyorum. Bu bir
                          demo formudur; veriler hiçbir yere gönderilmez.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Adım 5 — Onay */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <p className="flex min-w-0 items-start gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-[11px] text-zinc-400">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
                        <span className="min-w-0">
                          Bilgileri kontrol edin. Onayladıktan sonra size özel bir başvuru kodu
                          üretilir.
                        </span>
                      </p>

                      <dl className="space-y-2 text-[11px]">
                        {[
                          { label: 'Hedef', value: chosenGoal?.label ?? '—' },
                          { label: 'Seviye', value: chosenLevel?.label ?? '—' },
                          { label: 'Ders', value: chosenClass?.name ?? '—' },
                          {
                            label: 'Süre & zorluk',
                            value: chosenClass
                              ? `${chosenClass.durationMin} dk · ${chosenClass.intensity}`
                              : '—',
                          },
                          { label: 'Eğitmen', value: chosenTrainer?.name ?? '—' },
                          { label: 'Tarih', value: selectedDate ? formatLongDate(selectedDate) : '—' },
                          { label: 'Saat', value: selectedTime ?? '—' },
                          { label: 'Paket', value: chosenPlan?.name ?? 'Görüşmede belirlenecek' },
                          { label: 'Ad Soyad', value: fullName.trim() || '—' },
                          { label: 'Telefon', value: phone.trim() || '—' },
                          { label: 'E-posta', value: email.trim() || 'Belirtilmedi' },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2"
                          >
                            <dt className="shrink-0 text-zinc-500">{row.label}</dt>
                            <dd className="min-w-0 text-right font-semibold text-white">{row.value}</dd>
                          </div>
                        ))}
                      </dl>

                      {note.trim() && (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] text-zinc-400">
                          <span className="font-semibold text-zinc-300">Notun: </span>
                          {note.trim()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Adım gezinmesi */}
                  <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4 sm:flex-row">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300 sm:w-auto"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        Geri
                      </button>
                    )}

                    {step < WIZARD_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
                      >
                        Devam Et
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
                      >
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Başvuruyu Gönder
                      </button>
                    )}
                  </div>

                  <p className="text-center text-[10px] text-zinc-600">
                    Adım {step + 1} / {WIZARD_STEPS.length} · Bu bir demo formudur.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-12 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-3">
            <span className="text-lg font-black uppercase tracking-[0.2em] text-lime-400">
              Forge Athletic Club
            </span>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
              Demir sertleşir, sen güçlenirsin. Performans odaklı antrenman ve
              ölçüme dayalı ilerleme takibi.
            </p>
          </div>

          <div className="min-w-0 space-y-2 text-xs text-zinc-400">
            <p className="flex min-w-0 items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
              <span className="min-w-0">Caferağa Mah. Moda Cad. No:118, Kadıköy / İstanbul</span>
            </p>
            <p className="flex min-w-0 items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
              <span className="min-w-0">Hafta içi 06:30 – 23:30 · Hafta sonu 08:00 – 21:00</span>
            </p>
            <p className="flex min-w-0 items-start gap-2">
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
              <span className="min-w-0 break-words">uyelik@forgeathletic.example</span>
            </p>
            <p className="flex min-w-0 items-start gap-2">
              <AtSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
              <span className="min-w-0">@forgeathleticclub</span>
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-zinc-900 pt-6 text-center text-[11px] text-zinc-600">
          © 2026 Forge Athletic Club. Tüm hakları saklıdır. Bu sayfa örnek bir demo çalışmasıdır.
        </div>
      </footer>

      {/* Eğitmen ve ders modalleri */}
      <AnimatePresence>
        {dialogTrainer && (
          <DialogShell
            key={`trainer-${dialogTrainer.id}`}
            labelledBy="trainer-dialog-title"
            onClose={closeDialog}
            closeLabel="Eğitmen profilini kapat"
            reduceMotion={reduceMotion}
          >
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                  <SafeImage
                    accent="text-lime-400"
                    src={dialogTrainer.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <h2 id="trainer-dialog-title" className="truncate text-base font-black uppercase tracking-wide text-white">
                    {dialogTrainer.name}
                  </h2>
                  <p className="truncate text-[11px] text-lime-300">{dialogTrainer.title}</p>
                  <p className="truncate text-[10px] text-zinc-500">{dialogTrainer.experience}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Eğitmen profilini kapat"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-colors hover:border-lime-400/40 hover:text-lime-300"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5">
              <p className="text-xs leading-relaxed text-zinc-300">{dialogTrainer.bio}</p>

              <div className="min-w-0">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Uzmanlık alanları
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {dialogTrainer.specialties.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[10px] text-zinc-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Sertifikalar
                </h3>
                <ul className="space-y-1.5">
                  {dialogTrainer.certifications.map((item) => (
                    <li key={item} className="flex min-w-0 items-start gap-2 text-[11px] text-zinc-300">
                      <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Verdiği dersler
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {classesOfTrainer(dialogTrainer.id).map((item) => (
                    <li key={item.id} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setDialog({ type: 'class', id: item.id })}
                        className="flex min-h-[52px] w-full min-w-0 flex-col items-start justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-left transition-colors hover:border-lime-400/40"
                      >
                        <span className="w-full truncate text-xs font-semibold text-white">
                          {item.name}
                        </span>
                        <span className="w-full truncate text-[10px] text-zinc-500">
                          {item.durationMin} dk · {item.intensity} zorluk
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-800 p-5 sm:flex-row">
              <button
                type="button"
                onClick={() => prefillFromTrainer(dialogTrainer.id)}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Bu Eğitmenle Çalış
              </button>
              <button
                type="button"
                onClick={closeDialog}
                className="min-h-[44px] rounded-xl border border-zinc-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
              >
                Kapat
              </button>
            </div>
          </DialogShell>
        )}

        {dialogClass && (
          <DialogShell
            key={`class-${dialogClass.id}`}
            labelledBy="class-dialog-title"
            onClose={closeDialog}
            closeLabel="Ders detayını kapat"
            reduceMotion={reduceMotion}
          >
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 p-5">
              <div className="min-w-0">
                <h2 id="class-dialog-title" className="text-base font-black uppercase tracking-wide text-white">
                  {dialogClass.name}
                </h2>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{dialogClass.tagline}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${intensityStyles[dialogClass.intensity]}`}
                  >
                    {dialogClass.intensity} zorluk
                  </span>
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-400">
                    {dialogClass.durationMin} dk
                  </span>
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-400">
                    {dialogClass.capacity} kişilik kontenjan
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Ders detayını kapat"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-colors hover:border-lime-400/40 hover:text-lime-300"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5">
              <div className="min-w-0">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Derste ne yapılır?
                </h3>
                <ol className="space-y-2">
                  {dialogClass.whatHappens.map((item, index) => (
                    <li key={item} className="flex min-w-0 items-start gap-2.5 text-[11px] text-zinc-300">
                      <span
                        aria-hidden="true"
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-[10px] font-bold text-lime-300"
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Kullanılan ekipman
                  </h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {dialogClass.equipment.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Tahmini enerji harcaması
                  </h3>
                  <p className="text-[11px] leading-relaxed text-zinc-300">{dialogClass.calorieRange}</p>
                  <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
                    Aralık; kilo, tempo ve deneyime göre değişir. Kişisel bir hedef vaadi değildir.
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Kimler için uygun?
                </h3>
                <ul className="space-y-1.5">
                  {dialogClass.suitableFor.map((item) => (
                    <li key={item} className="flex min-w-0 items-start gap-2 text-[11px] text-zinc-300">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-400" aria-hidden="true" />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Dersi veren eğitmenler
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {dialogClass.trainerIds.map((id) => {
                    const trainer = findTrainer(id);
                    if (!trainer) return null;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setDialog({ type: 'trainer', id })}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] font-semibold text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
                        >
                          <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                          {trainer.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-800 p-5 sm:flex-row">
              <button
                type="button"
                onClick={() => prefillFromClass(dialogClass.id)}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-lime-300"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Bu Derse Kaydol
              </button>
              <button
                type="button"
                onClick={closeDialog}
                className="min-h-[44px] rounded-xl border border-zinc-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-lime-400/40 hover:text-lime-300"
              >
                Kapat
              </button>
            </div>
          </DialogShell>
        )}
      </AnimatePresence>

      <DemoSwitcher currentId="spor-salonu" />
    </main>
  );
}
