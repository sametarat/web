'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { whatsAppLink } from '@/lib/site';
import { SafeImage } from '@/components/SafeImage';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Ban,
  BedDouble,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ConciergeBell,
  Eye,
  Filter,
  KeyRound,
  MapPin,
  Maximize2,
  PhoneCall,
  RotateCcw,
  Ruler,
  Search,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  TriangleAlert,
  Users,
  Utensils,
  Waves,
  Wifi,
  X,
} from 'lucide-react';

/* ================================ Tipler ================================= */

type CancellationKey = 'esnek' | 'standart' | 'kati';
type Availability = 'musait' | 'son' | 'dolu';
type SortKey = 'onerilen' | 'artan' | 'azalan' | 'puan';
type SeasonTier = 'sakin' | 'ara' | 'yuksek' | 'zirve';
type ExtraUnit = 'once' | 'perGuest' | 'perNight' | 'perNightPerGuest';
type StepId = 1 | 2 | 3 | 4 | 5;

interface Room {
  id: string;
  name: string;
  category: string;
  /** Sezon çarpanı uygulanmadan önceki taban gecelik ücret. */
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  /** Galeri: ilk görsel kart görseli olarak da kullanılır. */
  images: string[];
  features: string[];
  amenities: string[];
  maxGuests: number;
  size: number;
  bed: string;
  view: string;
  tag: string;
  description: string;
  location: string;
  cancellation: CancellationKey;
}

interface ExtraService {
  id: string;
  label: string;
  hint: string;
  price: number;
  unit: ExtraUnit;
}

interface Season {
  month: number;
  short: string;
  name: string;
  multiplier: number;
  tier: SeasonTier;
  note: string;
}

/* =============================== Sabitler ================================ */

/** Servis ücreti ve ön ödeme oranları tek yerde: fiyat dökümü ile kart aynı kaynaktan beslensin. */
const SERVICE_FEE_RATE = 0.08;
const PREPAY_RATE = 0.25;

const MONTHS_TR = [
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
];

const WEEKDAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Panoramik Manzaralı King Suite',
    category: 'Süit',
    pricePerNight: 9200,
    rating: 4.9,
    reviewCount: 214,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Jakuzi', 'Deniz Manzarası', 'Teras', 'Kral Yatak'],
    amenities: ['Özel jakuzi', 'Nespresso makinesi', 'Yastık menüsü', 'Karşılama ikramı', 'Ücretsiz Wi-Fi', 'Kasa'],
    maxGuests: 2,
    size: 64,
    bed: '1 kral yatak',
    view: 'Kesintisiz deniz',
    tag: 'En Popüler',
    description: 'Kesintisiz deniz manzarasına sahip, geniş teraslı ve özel jakuzili lüks süit.',
    location: 'Ana Bina - 4. Kat',
    cancellation: 'esnek',
  },
  {
    id: '2',
    name: 'Müstakil Havuzlu Beach Villa',
    category: 'Villa',
    pricePerNight: 16500,
    rating: 5.0,
    reviewCount: 96,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Özel Havuz', 'Sahil Erişimi', '4 Kişilik', 'Veranda'],
    amenities: ['Isıtmalı özel havuz', 'Şezlong ve kabana', 'Özel şef talebi', 'Barbekü alanı', 'Bisiklet', 'Kasa'],
    maxGuests: 4,
    size: 145,
    bed: '2 kral yatak',
    view: 'Kumsal ve koy',
    tag: 'Ultra Lüks',
    description: 'Doğrudan kumsala açılan, özel yüzme havuzlu ve geniş bahçeli müstakil lüks villa.',
    location: 'Sahil Şeridi',
    cancellation: 'standart',
  },
  {
    id: '3',
    name: 'Deluxe Bosphorus Loft',
    category: 'Loft',
    pricePerNight: 5800,
    rating: 4.8,
    reviewCount: 341,
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Çalışma Masası', 'Hızlı Wi-Fi', 'Minibar', 'Boğaz Manzarası'],
    amenities: ['1 Gbps Wi-Fi', 'Ergonomik çalışma alanı', 'Akıllı TV', 'Ücretsiz minibar', 'Kahve istasyonu'],
    maxGuests: 2,
    size: 48,
    bed: '1 queen yatak',
    view: 'Boğaz ve şehir silueti',
    tag: 'Konfor Seçeneği',
    description: 'Yüksek tavanlı modern mimarisi ve şehir manzarasıyla ideal bir konaklama deneyimi.',
    location: 'Doğu Blok',
    cancellation: 'esnek',
  },
  {
    id: '4',
    name: 'Doğa İçinde Minimalist Bungalov',
    category: 'Bungalov',
    pricePerNight: 4200,
    rating: 4.7,
    reviewCount: 188,
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Şömine', 'Veranda', 'Sessiz Konum', 'Açık Hava Sineması'],
    amenities: ['Odun şöminesi', 'Hamak', 'Yıldız gözlem terası', 'Ücretsiz otopark', 'Evcil hayvan dostu'],
    maxGuests: 2,
    size: 38,
    bed: '1 queen yatak',
    view: 'Çam ormanı',
    tag: 'Doğa & Huzur',
    description: 'Çam ormanlarının arasında, şömineli ve tam mahremiyet sunan ahşap tasarım bungalov.',
    location: 'Kuzey Bahçeleri',
    cancellation: 'esnek',
  },
  {
    id: '5',
    name: 'Penthouse Panorama Residence',
    category: 'Penthouse',
    pricePerNight: 22000,
    rating: 5.0,
    reviewCount: 47,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['360° Manzara', 'Özel Asansör', 'Özel Mutfak', 'Sauna'],
    amenities: ['Özel asansör', 'Finlandiya saunası', 'Şef mutfağı', 'Butler hizmeti', 'Şarap dolabı', 'Sinema odası'],
    maxGuests: 6,
    size: 210,
    bed: '3 kral yatak',
    view: '360° şehir ve deniz',
    tag: 'VIP Özel',
    description:
      'Otelimizin en üst katında yer alan, sauna ve özel hizmet ekibiyle sunulan 360 derece manzaralı penthouse.',
    location: 'Çatı Katı (VIP)',
    cancellation: 'kati',
  },
  {
    id: '6',
    name: 'Garden Relax Suite',
    category: 'Süit',
    pricePerNight: 6500,
    rating: 4.85,
    reviewCount: 263,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Özel Bahçe', 'Hamak', 'Kahvaltı Dahil', 'Geniş Banyo'],
    amenities: ['40 m² özel bahçe', 'Açık duş', 'Yoga matı', 'Bebek karyolası', 'Ücretsiz Wi-Fi'],
    maxGuests: 3,
    size: 72,
    bed: '1 kral + 1 tek yatak',
    view: 'Botanik bahçe',
    tag: 'Bahçe Manzaralı',
    description: 'Botanik bahçeye doğrudan erişimi olan, huzurlu ve geniş dinlenme alanı sunan süit.',
    location: 'Zemin Kat - Bahçe Cephe',
    cancellation: 'standart',
  },
];

const CANCELLATION: Record<CancellationKey, { label: string; detail: string }> = {
  esnek: {
    label: 'Esnek iptal',
    detail: 'Girişten 48 saat öncesine kadar ücretsiz iptal, tam iade. Sonrasında ilk gece bedeli tahsil edilir.',
  },
  standart: {
    label: 'Standart iptal',
    detail: 'Girişten 7 gün öncesine kadar ücretsiz iptal. Son 7 gün içinde bir gecelik bedel tahsil edilir.',
  },
  kati: {
    label: 'Katı iptal',
    detail: 'Girişten 14 gün öncesine kadar %50 iade yapılır. Son 14 gün içinde iade uygulanmaz.',
  },
};

const EXTRAS: ExtraService[] = [
  {
    id: 'breakfast',
    label: 'Serpme Kahvaltı',
    hint: 'Kişi başı / gece · Her sabah 07:30 – 10:30',
    price: 500,
    unit: 'perNightPerGuest',
  },
  {
    id: 'transfer',
    label: 'VIP Havalimanı Transferi',
    hint: 'Tek seferlik · Karşılıklı, özel şoför',
    price: 1200,
    unit: 'once',
  },
  {
    id: 'spa',
    label: 'SPA & Hamam Paketi',
    hint: 'Kişi başı · 60 dakika masaj dahil',
    price: 800,
    unit: 'perGuest',
  },
  {
    id: 'dinner',
    label: 'Akşam Yemeği Paketi',
    hint: 'Gecelik · Şef menüsü, 3 kur',
    price: 1400,
    unit: 'perNight',
  },
  {
    id: 'lateCheckout',
    label: 'Geç Çıkış (16:00)',
    hint: 'Tek seferlik · Müsaitliğe bağlı',
    price: 950,
    unit: 'once',
  },
  {
    id: 'celebration',
    label: 'Kutlama Kurulumu',
    hint: 'Tek seferlik · Oda süslemesi, pasta ve çiçek',
    price: 1500,
    unit: 'once',
  },
];

/** Sezon çarpanları: yaz zirvesi pahalı, kış sakin. Fiyatlar bu tablodan türetilir. */
const SEASONS: Season[] = [
  { month: 1, short: 'Oca', name: 'Ocak', multiplier: 0.75, tier: 'sakin', note: 'Kış kaçamağı indirimi' },
  { month: 2, short: 'Şub', name: 'Şubat', multiplier: 0.78, tier: 'sakin', note: 'Sevgililer haftası hariç' },
  { month: 3, short: 'Mar', name: 'Mart', multiplier: 0.85, tier: 'sakin', note: 'Erken bahar tarifesi' },
  { month: 4, short: 'Nis', name: 'Nisan', multiplier: 1.0, tier: 'ara', note: 'Standart tarife' },
  { month: 5, short: 'May', name: 'Mayıs', multiplier: 1.1, tier: 'ara', note: 'Bahar hareketliliği' },
  { month: 6, short: 'Haz', name: 'Haziran', multiplier: 1.25, tier: 'yuksek', note: 'Sezon açılışı' },
  { month: 7, short: 'Tem', name: 'Temmuz', multiplier: 1.45, tier: 'zirve', note: 'Zirve sezon, erken rezervasyon önerilir' },
  { month: 8, short: 'Ağu', name: 'Ağustos', multiplier: 1.45, tier: 'zirve', note: 'Zirve sezon, doluluk yüksek' },
  { month: 9, short: 'Eyl', name: 'Eylül', multiplier: 1.2, tier: 'yuksek', note: 'Deniz sıcak, kalabalık az' },
  { month: 10, short: 'Eki', name: 'Ekim', multiplier: 1.0, tier: 'ara', note: 'Standart tarife' },
  { month: 11, short: 'Kas', name: 'Kasım', multiplier: 0.8, tier: 'sakin', note: 'SPA sezonu indirimi' },
  { month: 12, short: 'Ara', name: 'Aralık', multiplier: 1.15, tier: 'yuksek', note: 'Yılbaşı programı' },
];

const SEASON_TIER_META: Record<SeasonTier, { label: string; chip: string; dot: string }> = {
  sakin: { label: 'Sakin sezon', chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', dot: 'bg-emerald-400' },
  ara: { label: 'Ara sezon', chip: 'border-sky-500/30 bg-sky-500/10 text-sky-300', dot: 'bg-sky-400' },
  yuksek: { label: 'Yüksek sezon', chip: 'border-amber-500/30 bg-amber-500/10 text-amber-300', dot: 'bg-amber-400' },
  zirve: { label: 'Zirve sezon', chip: 'border-rose-500/30 bg-rose-500/10 text-rose-300', dot: 'bg-rose-400' },
};

const SORT_OPTIONS: readonly { value: SortKey; label: string }[] = [
  { value: 'onerilen', label: 'Önerilen sıralama' },
  { value: 'artan', label: 'Fiyat: Düşükten yükseğe' },
  { value: 'azalan', label: 'Fiyat: Yüksekten düşüğe' },
  { value: 'puan', label: 'Misafir puanı' },
];

const CAPACITY_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 1, label: 'Tüm kapasiteler' },
  { value: 2, label: 'En az 2 kişilik' },
  { value: 3, label: 'En az 3 kişilik' },
  { value: 4, label: 'En az 4 kişilik' },
  { value: 6, label: 'En az 6 kişilik' },
];

const GUEST_OPTIONS: readonly number[] = [1, 2, 3, 4, 5, 6];

const STEPS: readonly { id: StepId; label: string; short: string }[] = [
  { id: 1, label: 'Tarih & Kişi', short: 'Tarih' },
  { id: 2, label: 'Oda Seçimi', short: 'Oda' },
  { id: 3, label: 'Ekstralar', short: 'Ekstra' },
  { id: 4, label: 'İletişim', short: 'İletişim' },
  { id: 5, label: 'Onay', short: 'Onay' },
];

const CHAT_PRESETS: readonly { id: string; question: string; answer: string }[] = [
  {
    id: 'checkin',
    question: 'Giriş - çıkış saatleri?',
    answer:
      'Giriş saatimiz 14:00, çıkış saatimiz 12:00. Erken giriş ve 16:00 geç çıkış müsaitliğe bağlı olarak rezervasyon adımındaki ekstralardan eklenebilir.',
  },
  {
    id: 'fiyat',
    question: 'Fiyatlar ne kadar?',
    answer:
      'Gecelik tarifeler sezona göre değişir: sakin sezonda ₺3.150 (Bungalov) seviyesinden başlar, zirve sezonda ₺31.900 (Penthouse) seviyesine çıkar. Sayfadaki sezon takviminden ay seçerek güncel tarifeyi anında görebilirsiniz.',
  },
  {
    id: 'musaitlik',
    question: 'Seçtiğim tarihte oda var mı?',
    answer:
      'Üst kısımdaki tarih alanlarını doldurduğunuzda oda kartları anında güncellenir. Dolu odalar "Bu tarihlerde dolu" rozetiyle işaretlenir; tümü doluysa size en yakın müsait tarihi öneriyoruz.',
  },
  {
    id: 'iptal',
    question: 'İptal koşulları nedir?',
    answer:
      'Odaya göre üç politika uyguluyoruz: Esnek (48 saat öncesine kadar ücretsiz), Standart (7 gün öncesine kadar ücretsiz) ve Katı (14 gün öncesine kadar %50 iade). Her odanın politikası detay penceresinde yazıyor.',
  },
  {
    id: 'kahvalti',
    question: 'Kahvaltı dahil mi?',
    answer:
      'Serpme kahvaltı kişi başı ₺500 / gece olarak ekstralar adımından eklenir; Garden Relax Suite rezervasyonlarında ücretsiz dahildir. Servis her sabah 07:30 – 10:30 arasında Terrace Restaurant bölümünde sunulur.',
  },
  {
    id: 'transfer',
    question: 'Havalimanı transferi var mı?',
    answer:
      'Evet. Karşılıklı VIP transfer ₺1.200 tek seferlik ücretle ekstralar adımından eklenebilir. Uçuş bilgilerinizi iletişim adımındaki not alanına yazmanız yeterli.',
  },
  {
    id: 'evcil',
    question: 'Evcil hayvan kabul ediyor musunuz?',
    answer:
      'Bungalov ve villa tipi konaklamalarımızda 15 kg altındaki evcil hayvanlar ücretsiz ağırlanır. Ana binadaki süit ve loftlarda ne yazık ki kabul edemiyoruz.',
  },
];

/* ============================== Yardımcılar ============================== */

/** Sayıyı Intl olmadan biçimlendirir: sunucu ve tarayıcı çıktısı bire bir aynı olur. */
function formatTRY(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** FNV-1a: aynı girdi her zaman aynı sayıyı verir — müsaitlik ve rezervasyon kodu bundan türer. */
function hashCode(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** ISO tarihi UTC gün sayısına çevirir; saat dilimi farkları gece hesabını bozmasın diye. */
function toDayNumber(iso: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return Math.round(Date.UTC(year, month - 1, day) / 86400000);
}

function fromDayNumber(days: number): string {
  const date = new Date(days * 86400000);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(iso: string, amount: number): string {
  const base = toDayNumber(iso);
  if (base === null) return iso;
  return fromDayNumber(base + amount);
}

/** "10 Temmuz 2026, Cuma" — Intl kullanılmadığı için hydration farkı oluşmaz. */
function formatDateTR(iso: string, withWeekday = true): string {
  const days = toDayNumber(iso);
  if (days === null) return iso;
  const date = new Date(days * 86400000);
  const text = `${date.getUTCDate()} ${MONTHS_TR[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  if (!withWeekday) return text;
  return `${text}, ${WEEKDAYS_TR[((days % 7) + 4 + 7) % 7]}`;
}

function seasonFor(iso: string): Season {
  const days = toDayNumber(iso);
  if (days === null) return SEASONS[3];
  return SEASONS[new Date(days * 86400000).getUTCMonth()];
}

function yearOf(iso: string): number {
  const days = toDayNumber(iso);
  if (days === null) return 2026;
  return new Date(days * 86400000).getUTCFullYear();
}

/** Sezon çarpanı uygulanmış gecelik tarife; 50 ₺'ye yuvarlanır ki fiyatlar okunaklı kalsın. */
function nightlyRate(room: Room, season: Season): number {
  return Math.round((room.pricePerNight * season.multiplier) / 50) * 50;
}

/**
 * Müsaitlik tarih + oda kimliğinden deterministik olarak türetilir.
 * Rastgelelik yok: aynı tarih aralığı her zaman aynı doluluk tablosunu verir.
 */
function availabilityFor(roomId: string, checkIn: string, checkOut: string): Availability {
  const bucket = hashCode(`${checkIn}|${checkOut}|${roomId}`) % 9;
  if (bucket === 0 || bucket === 1) return 'dolu';
  if (bucket === 2) return 'son';
  return 'musait';
}

function extraCost(extra: ExtraService, nights: number, guests: number): number {
  switch (extra.unit) {
    case 'perNightPerGuest':
      return extra.price * nights * guests;
    case 'perNight':
      return extra.price * nights;
    case 'perGuest':
      return extra.price * guests;
    default:
      return extra.price;
  }
}

/** Rezervasyon kodu form değerlerinden üretilir — aynı bilgiler her zaman aynı kodu verir. */
function reservationCode(seed: string): string {
  const raw = hashCode(seed).toString(36).toUpperCase();
  return `AET-${raw.padStart(6, '0').slice(-6)}`;
}

/**
 * Seçilen aralıkta yeterli oda yoksa ileriye doğru tarayıp en yakın uygun
 * tarih aralığını bulur. Tamamen deterministik: aynı girdi aynı öneriyi verir.
 */
function findAlternativeDates(
  checkIn: string,
  checkOut: string,
  minCapacity: number,
): { checkIn: string; checkOut: string; free: number } | null {
  const start = toDayNumber(checkIn);
  const end = toDayNumber(checkOut);
  if (start === null || end === null || end <= start) return null;

  for (let shift = 1; shift <= 21; shift += 1) {
    const nextIn = addDays(checkIn, shift);
    const nextOut = addDays(checkOut, shift);
    const free = ROOMS.filter(
      (room) => room.maxGuests >= minCapacity && availabilityFor(room.id, nextIn, nextOut) !== 'dolu',
    ).length;
    if (free >= 2) return { checkIn: nextIn, checkOut: nextOut, free };
  }
  return null;
}

const AVAILABILITY_META: Record<Availability, { label: string; chip: string }> = {
  musait: { label: 'Müsait', chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  son: { label: 'Son 1 oda', chip: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  dolu: { label: 'Bu tarihlerde dolu', chip: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
};

/**
 * Modal erişilebilirliği: Escape ile kapanma, odağın pencere içine taşınması,
 * Tab tuzağı ve kapanışta odağın tetikleyen öğeye geri dönmesi.
 */
function useDialogA11y(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = ref.current;

    const focusables = (): HTMLElement[] => {
      if (!node) return [];
      return Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    };

    // Önce pencerenin kendisine odaklan: ekran okuyucu başlığı ve rolü duyursun.
    (node ?? focusables()[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !node) return;
      const items = focusables();
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === firstItem || !node.contains(active))) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return ref;
}

/* ============================= Ana Bileşen =============================== */

export default function HotelPage() {
  const reduce = useReducedMotion();

  /* --- Tarih / misafir durumu (arama ve rezervasyon aynı kaynağı kullanır) --- */
  const [checkIn, setCheckIn] = useState('2026-07-10');
  const [checkOut, setCheckOut] = useState('2026-07-14');
  const [guests, setGuests] = useState(2);

  /* ------------------------------ Filtreler ------------------------------- */
  const [category, setCategory] = useState('Tümü');
  const [capacityFilter, setCapacityFilter] = useState(1);
  const [sort, setSort] = useState<SortKey>('onerilen');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  /* ---------------------------- Detay penceresi --------------------------- */
  const [detailRoomId, setDetailRoomId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  /* --------------------------- Rezervasyon akışı -------------------------- */
  const [bookingOpen, setBookingOpen] = useState(false);
  const [step, setStep] = useState<StepId>(1);
  const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['breakfast']);
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [kvkkApproved, setKvkkApproved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /* ------------------------------- Sohbet --------------------------------- */
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ id: number; sender: 'bot' | 'user'; text: string }[]>([
    {
      id: 0,
      sender: 'bot',
      text: 'Merhaba! Aetheria Hotel resepsiyon asistanına hoş geldiniz. Odalar, müsaitlik, fiyatlar ve tesis olanakları hakkında sorularınızı yanıtlayabilirim.',
    },
  ]);
  const messageId = useRef(1);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  const openWhatsApp = useCallback((message: string) => {
    window.open(whatsAppLink(message), '_blank', 'noopener,noreferrer');
  }, []);

  /* ------------------------- Türetilmiş değerler -------------------------- */

  const rawNights = useMemo(() => {
    const start = toDayNumber(checkIn);
    const end = toDayNumber(checkOut);
    if (start === null || end === null) return 0;
    return end - start;
  }, [checkIn, checkOut]);

  const datesValid = rawNights > 0;
  const nights = datesValid ? rawNights : 1;
  const season = useMemo(() => seasonFor(checkIn), [checkIn]);

  const categories = useMemo(() => ['Tümü', ...Array.from(new Set(ROOMS.map((r) => r.category)))], []);

  /** Her oda için o tarihlerdeki durumu ve sezon fiyatını tek yerde hesaplıyoruz. */
  const roomViews = useMemo(
    () =>
      ROOMS.map((room) => ({
        room,
        availability: availabilityFor(room.id, checkIn, checkOut),
        rate: nightlyRate(room, season),
      })),
    [checkIn, checkOut, season],
  );

  const results = useMemo(() => {
    const filtered = roomViews.filter((view) => {
      const matchCategory = category === 'Tümü' || view.room.category === category;
      const matchCapacity = view.room.maxGuests >= capacityFilter;
      const matchAvailability = !onlyAvailable || view.availability !== 'dolu';
      return matchCategory && matchCapacity && matchAvailability;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'artan') return a.rate - b.rate;
      if (sort === 'azalan') return b.rate - a.rate;
      if (sort === 'puan') return b.room.rating - a.room.rating;
      // Önerilen: önce müsait odalar, sonra puana göre.
      const rank = (value: Availability) => (value === 'dolu' ? 1 : 0);
      const diff = rank(a.availability) - rank(b.availability);
      if (diff !== 0) return diff;
      return b.room.rating - a.room.rating;
    });
  }, [roomViews, category, capacityFilter, onlyAvailable, sort]);

  const availableCount = results.filter((view) => view.availability !== 'dolu').length;
  const isFiltered = category !== 'Tümü' || capacityFilter !== 1 || onlyAvailable || sort !== 'onerilen';

  /** Tüm odalar doluysa: ileriye doğru tarayıp en yakın uygun tarih aralığını öneriyoruz. */
  const alternativeDates = useMemo(
    () => findAlternativeDates(checkIn, checkOut, capacityFilter),
    [checkIn, checkOut, capacityFilter],
  );

  const detailRoom = useMemo(() => ROOMS.find((room) => room.id === detailRoomId) ?? null, [detailRoomId]);
  const bookingRoom = useMemo(() => ROOMS.find((room) => room.id === bookingRoomId) ?? null, [bookingRoomId]);

  const bookingRate = bookingRoom ? nightlyRate(bookingRoom, season) : 0;
  const chosenExtras = useMemo(() => EXTRAS.filter((extra) => selectedExtras.includes(extra.id)), [selectedExtras]);
  const roomTotal = bookingRate * nights;
  const extrasTotal = chosenExtras.reduce((sum, extra) => sum + extraCost(extra, nights, guests), 0);
  const subtotal = roomTotal + extrasTotal;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const grandTotal = subtotal + serviceFee;
  const prepayAmount = Math.round(grandTotal * PREPAY_RATE);

  const code = useMemo(
    () =>
      reservationCode(
        `${form.name}|${form.email}|${form.phone}|${checkIn}|${checkOut}|${bookingRoomId ?? '-'}|${guests}`,
      ),
    [form.name, form.email, form.phone, checkIn, checkOut, bookingRoomId, guests],
  );

  /* ------------------------------ Etkileşim ------------------------------- */

  const closeDetail = useCallback(() => setDetailRoomId(null), []);
  const closeBooking = useCallback(() => {
    setBookingOpen(false);
    setFormError(null);
    setStep((prev) => (prev === 5 ? 1 : prev));
  }, []);

  const detailRef = useDialogA11y(detailRoom !== null, closeDetail);
  const bookingRef = useDialogA11y(bookingOpen, closeBooking);

  // Detay penceresinde ok tuşlarıyla galeri gezinme.
  useEffect(() => {
    if (!detailRoom) return;
    const total = detailRoom.images.length;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setGalleryIndex((i) => (i + 1) % total);
      if (event.key === 'ArrowLeft') setGalleryIndex((i) => (i - 1 + total) % total);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [detailRoom]);

  // Sohbet penceresi her yeni mesajda en alta kaysın.
  useEffect(() => {
    const node = chatBodyRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, isTyping, isChatOpen, reduce]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const resetFilters = useCallback(() => {
    setCategory('Tümü');
    setCapacityFilter(1);
    setSort('onerilen');
    setOnlyAvailable(false);
  }, []);

  const scrollToRooms = useCallback(() => {
    document.getElementById('mulkler')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }, [reduce]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCapacityFilter(guests);
    scrollToRooms();
  };

  /** Misafir sayısı değişince kapasitesi yetmeyen oda seçimi sessizce kalmasın. */
  const updateGuests = useCallback((count: number) => {
    setGuests(count);
    setBookingRoomId((current) => {
      if (!current) return current;
      const room = ROOMS.find((item) => item.id === current);
      return room && room.maxGuests >= count ? current : null;
    });
  }, []);

  const openDetail = useCallback((roomId: string) => {
    setGalleryIndex(0);
    setDetailRoomId(roomId);
  }, []);

  const openBooking = useCallback((roomId: string | null, startStep: StepId) => {
    setBookingRoomId(roomId);
    setDetailRoomId(null);
    setStep(startStep);
    setFormError(null);
    setBookingOpen(true);
  }, []);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const validateStep = (current: StepId): string | null => {
    if (current === 1) {
      if (!datesValid) return 'Çıkış tarihi, giriş tarihinden sonraki bir gün olmalı.';
      if (rawNights > 30) return 'Tek seferde en fazla 30 gecelik rezervasyon oluşturabilirsiniz.';
      return null;
    }
    if (current === 2) {
      if (!bookingRoom) return 'Devam etmek için bir oda seçin.';
      if (bookingRoom.maxGuests < guests)
        return `${bookingRoom.name} en fazla ${bookingRoom.maxGuests} misafir ağırlayabilir.`;
      if (availabilityFor(bookingRoom.id, checkIn, checkOut) === 'dolu')
        return 'Seçtiğiniz oda bu tarihlerde dolu. Başka bir oda ya da tarih seçin.';
      return null;
    }
    if (current === 4) {
      if (form.name.trim().length < 3) return 'Lütfen ad ve soyadınızı girin.';
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(form.email.trim())) return 'Geçerli bir e-posta adresi girin.';
      if (form.phone.replace(/\D/g, '').length < 10) return 'Telefon numarası en az 10 haneli olmalı.';
      if (!kvkkApproved) return 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.';
      return null;
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep(step);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    setStep((prev) => (prev < 5 ? ((prev + 1) as StepId) : prev));
  };

  const goBack = () => {
    setFormError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as StepId) : prev));
  };

  const goToStep = (target: StepId) => {
    if (target >= step) return;
    setFormError(null);
    setStep(target);
  };

  /* -------------------------------- Sohbet -------------------------------- */

  const pushMessage = (sender: 'bot' | 'user', text: string) => {
    const id = messageId.current;
    messageId.current += 1;
    setMessages((prev) => [...prev, { id, sender, text }]);
  };

  const replyLater = (text: string) => {
    setIsTyping(true);
    const timer = window.setTimeout(() => {
      setIsTyping(false);
      pushMessage('bot', text);
    }, 550);
    timers.current.push(timer);
  };

  const answerFor = (input: string): string => {
    const lower = input.toLocaleLowerCase('tr-TR');
    const matched = CHAT_PRESETS.find((preset) => {
      if (preset.id === 'fiyat') return lower.includes('fiyat') || lower.includes('ücret') || lower.includes('ne kadar');
      if (preset.id === 'checkin') return lower.includes('giriş') || lower.includes('çıkış') || lower.includes('saat');
      if (preset.id === 'musaitlik') return lower.includes('müsait') || lower.includes('boş') || lower.includes('dolu');
      if (preset.id === 'iptal') return lower.includes('iptal') || lower.includes('iade');
      if (preset.id === 'kahvalti') return lower.includes('kahvaltı') || lower.includes('yemek');
      if (preset.id === 'transfer') return lower.includes('transfer') || lower.includes('havaliman');
      if (preset.id === 'evcil') return lower.includes('evcil') || lower.includes('köpek') || lower.includes('kedi');
      return false;
    });
    if (matched) return matched.answer;
    if (lower.includes('villa') || lower.includes('havuz'))
      return 'Müstakil Havuzlu Beach Villa 145 m², 4 misafir kapasiteli ve doğrudan kumsala açılıyor. Isıtmalı özel havuz ve barbekü alanı dahildir.';
    if (lower.includes('spa') || lower.includes('hamam'))
      return 'SPA merkezimiz 08:00 – 22:00 arasında açık. Türk hamamı, sauna ve ısıtmalı kapalı havuz konuklarımıza ücretsiz; masaj paketleri rezervasyon sırasında eklenebilir.';
    if (lower.includes('otopark') || lower.includes('araç'))
      return 'Kapalı otopark tüm konuklarımıza ücretsizdir, vale hizmeti 7/24 sunulur.';
    return 'Bu konuda resepsiyon ekibimiz yardımcı olabilir. Aşağıdaki hazır sorulardan birini seçebilir veya İletişime Geç butonundan bize doğrudan ulaşabilirsiniz.';
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    pushMessage('user', text);
    setChatInput('');
    replyLater(answerFor(text));
  };

  const handlePreset = (presetId: string) => {
    const preset = CHAT_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    pushMessage('user', preset.question);
    replyLater(preset.answer);
  };

  /* --------------------------------- JSX ---------------------------------- */

  const currentStepMeta = STEPS.find((item) => item.id === step) ?? STEPS[0];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100">
      {/* ------------------------------ Header ------------------------------ */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/85 px-4 py-3 backdrop-blur-md md:px-12">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <ArrowLeft className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sr-only sm:hidden">Ana Sayfaya Dön</span>
          </Link>
          <span className="hidden h-5 w-px bg-slate-800 lg:block" />
          <span className="hidden truncate font-serif text-lg font-bold tracking-wider text-amber-400 lg:block">
            AETHERIA HOTEL &amp; RESIDENCES
          </span>
        </div>

        <nav aria-label="Sayfa içi gezinme" className="flex min-w-0 items-center gap-3 text-xs font-medium text-slate-300 md:gap-5">
          <a href="#mulkler" className="hidden transition-colors hover:text-amber-400 md:inline">
            Odalarımız ({ROOMS.length})
          </a>
          <a href="#sezon" className="hidden transition-colors hover:text-amber-400 lg:inline">
            Sezon Takvimi
          </a>
          <a href="#hizmetler" className="hidden transition-colors hover:text-amber-400 lg:inline">
            Tesis İmkanları
          </a>
          <button
            type="button"
            onClick={() =>
              openWhatsApp('Merhaba Aetheria Hotel, konaklama ve rezervasyon hakkında bilgi almak istiyorum.')
            }
            aria-label="WhatsApp üzerinden iletişime geç"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-300 sm:w-auto sm:gap-2 sm:px-4"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">İletişim</span>
          </button>
          <button
            type="button"
            onClick={() => openBooking(bookingRoomId, 1)}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all hover:from-amber-400 hover:to-amber-500 sm:px-4"
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Rezervasyon</span>
          </button>
        </nav>
      </header>

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative px-5 py-14 md:px-12 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,158,11,0.16),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Kişiselleştirilmiş Konaklama Portföyü
          </span>
          <h1 className="font-serif text-4xl font-bold text-white md:text-6xl">
            Ayrıcalıklı Odaları <br />
            <span className="italic text-slate-400">Keşfedin</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400">
            Süitlerden özel havuzlu villalara, orman bungalovlarından çatı penthouse dairelerine kadar; tarihinizi seçin,
            müsaitliği ve sezon fiyatını anında görün.
          </p>

          {/* Arama konsolu */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left shadow-2xl md:grid-cols-4"
          >
            <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <label htmlFor="hero-checkin" className="block text-[10px] font-semibold uppercase text-amber-400">
                Giriş Tarihi
              </label>
              <input
                id="hero-checkin"
                type="date"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
                className="mt-1 w-full min-w-0 cursor-pointer bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
            <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <label htmlFor="hero-checkout" className="block text-[10px] font-semibold uppercase text-amber-400">
                Çıkış Tarihi
              </label>
              <input
                id="hero-checkout"
                type="date"
                value={checkOut}
                min={addDays(checkIn, 1)}
                onChange={(event) => setCheckOut(event.target.value)}
                className="mt-1 w-full min-w-0 cursor-pointer bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
            <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <label htmlFor="hero-guests" className="block text-[10px] font-semibold uppercase text-amber-400">
                Misafir Sayısı
              </label>
              <select
                id="hero-guests"
                value={guests}
                onChange={(event) => updateGuests(Number(event.target.value))}
                className="mt-1 w-full min-w-0 cursor-pointer bg-transparent text-xs text-white focus:outline-none"
              >
                {GUEST_OPTIONS.map((count) => (
                  <option key={count} value={count} className="bg-slate-900">
                    {count} Kişi
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg transition-all hover:bg-amber-400 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Müsaitlik Ara</span>
            </button>
          </form>

          <p className="text-xs text-slate-500" aria-live="polite">
            {datesValid ? (
              <>
                {formatDateTR(checkIn, false)} – {formatDateTR(checkOut, false)} ·{' '}
                <span className="font-semibold text-amber-400">{nights} gece</span> · {guests} misafir ·{' '}
                <span className="font-semibold text-amber-400">{availableCount}</span> oda müsait
              </>
            ) : (
              <span className="text-rose-300">Çıkış tarihi giriş tarihinden sonra olmalı.</span>
            )}
          </p>
        </div>
      </section>

      {/* --------------------- Sezon Fiyat Takvimi Şeridi -------------------- */}
      <section id="sezon" className="scroll-mt-20 border-y border-slate-800 bg-slate-900/40 px-5 py-12 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Sezon Takvimi {yearOf(checkIn)}
              </span>
              <h2 className="mt-1.5 font-serif text-xl font-bold text-white sm:text-2xl">
                Ne zaman gelirseniz ne kadar ödersiniz?
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Bir ay seçin; tarihler ve tüm oda fiyatları o sezonun tarifesine göre anında güncellensin.
              </p>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-3 py-1.5 text-[11px] font-semibold ${SEASON_TIER_META[season.tier].chip}`}
            >
              {season.tier === 'sakin' ? (
                <Snowflake className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {season.name}: {SEASON_TIER_META[season.tier].label}
            </span>
          </div>

          {/* Yatay kaydırmalı ay şeridi — mobilde taşma yapmaz, kendi içinde kayar. */}
          <div className="-mx-5 mt-5 overflow-x-auto px-5 pb-2 md:-mx-12 md:px-12">
            <div className="flex min-w-max snap-x gap-2">
              {SEASONS.map((item) => {
                const active = item.month === season.month;
                const meta = SEASON_TIER_META[item.tier];
                const delta = Math.round((item.multiplier - 1) * 100);
                return (
                  <button
                    key={item.month}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      const year = yearOf(checkIn);
                      const month = `${item.month}`.padStart(2, '0');
                      setCheckIn(`${year}-${month}-08`);
                      setCheckOut(`${year}-${month}-12`);
                    }}
                    className={`w-[104px] shrink-0 snap-start rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? 'border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950 hover:border-amber-500/40'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${active ? 'text-amber-300' : 'text-white'}`}>
                        {item.short}
                      </span>
                      <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
                    </span>
                    <span className="mt-2 block font-mono text-[11px] font-bold text-slate-200">
                      {delta === 0 ? 'Taban' : `${delta > 0 ? '+' : ''}%${Math.abs(delta)}`}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-tight text-slate-500">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-xs text-slate-400">
              <span className="font-semibold text-amber-400">{season.name}</span> tarifesi: {season.note}. Örnek olarak
              Deluxe Bosphorus Loft bu dönemde gecelik{' '}
              <span className="font-mono font-bold text-white">₺{formatTRY(nightlyRate(ROOMS[2], season))}</span>.
            </p>
            <button
              type="button"
              onClick={scrollToRooms}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
            >
              Bu Tarihlerdeki Odalar
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------- Oda Portföyü --------------------------- */}
      <section id="mulkler" className="scroll-mt-20 px-5 py-14 md:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">Öne Çıkan Odalar</h2>
            <p className="text-xs text-slate-400">
              {formatDateTR(checkIn)} → {formatDateTR(checkOut)} · {nights} gece · {season.name} tarifesi
            </p>
          </div>

          {/* Filtre paneli */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Filter className="h-4 w-4" aria-hidden="true" />
              Oda Filtreleri
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">Tip:</span>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className={`min-h-10 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                    category === item
                      ? 'bg-amber-500 font-bold text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0">
                <label htmlFor="capacity-filter" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  Kapasite
                </label>
                <div className="relative">
                  <Users
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <select
                    id="capacity-filter"
                    value={capacityFilter}
                    onChange={(event) => setCapacityFilter(Number(event.target.value))}
                    className="min-h-10 w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {CAPACITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="sort-rooms" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  Sıralama
                </label>
                <div className="relative">
                  <ArrowUpDown
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <select
                    id="sort-rooms"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="min-h-10 w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex min-h-10 min-w-0 cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(event) => setOnlyAvailable(event.target.checked)}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-amber-400"
                />
                <span className="min-w-0">Sadece bu tarihlerde müsait odalar</span>
              </label>
            </div>
          </div>

          {/* Sonuç sayacı */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300" aria-live="polite">
              <span className="font-bold text-amber-400">{results.length}</span> oda listeleniyor
              <span className="text-slate-500"> / toplam {ROOMS.length}</span>
              {results.length > 0 && (
                <span className="text-slate-500"> · {availableCount} tanesi seçili tarihlerde müsait</span>
              )}
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-300"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Filtreleri Temizle
              </button>
            )}
          </div>

          {/* Tümü dolu uyarısı */}
          {results.length > 0 && availableCount === 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex min-w-0 items-start gap-2 text-xs text-rose-100">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden="true" />
                <span className="min-w-0">
                  Seçtiğiniz tarihlerde bu kriterlere uyan tüm odalar dolu. Lütfen başka tarih deneyin.
                </span>
              </p>
              {alternativeDates && (
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn(alternativeDates.checkIn);
                    setCheckOut(alternativeDates.checkOut);
                  }}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                >
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDateTR(alternativeDates.checkIn, false)} tarihini dene
                </button>
              )}
            </div>
          )}

          {/* Izgara veya boş durum */}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center sm:p-12">
              <ConciergeBell className="mx-auto h-10 w-10 text-amber-400/60" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-white">Bu kriterlere uyan oda bulunamadı</h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
                Kapasite filtresini gevşetmeyi veya farklı bir oda tipi seçmeyi deneyebilirsiniz. Dilerseniz resepsiyon
                ekibimiz sizin için özel bir alternatif hazırlasın.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-10 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                >
                  Filtreleri Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() => openWhatsApp('Merhaba, aradığım kriterlerde oda bulamadım. Yardımcı olur musunuz?')}
                  className="min-h-10 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                >
                  Resepsiyona Sor
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map(({ room, availability, rate }) => {
                  const soldOut = availability === 'dolu';
                  const meta = AVAILABILITY_META[availability];
                  return (
                    <motion.article
                      key={room.id}
                      layout={!reduce}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                      transition={{ duration: reduce ? 0.12 : 0.22 }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-amber-500/50"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <SafeImage
                          accent="text-amber-400"
                          src={room.images[0]}
                          alt={`${room.name} görseli`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                            soldOut ? 'opacity-45 grayscale' : ''
                          }`}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                          {room.tag}
                        </span>
                        <span
                          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${meta.chip}`}
                        >
                          {meta.label}
                        </span>
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] text-slate-200 backdrop-blur-md">
                          <MapPin className="h-3 w-3 text-amber-400" aria-hidden="true" />
                          {room.location}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="min-w-0 text-sm font-bold text-white transition-colors group-hover:text-amber-400">
                            {room.name}
                          </h3>
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-amber-400" aria-hidden="true" />
                            {room.rating}
                            <span className="sr-only">puan, {room.reviewCount} değerlendirme</span>
                          </span>
                        </div>

                        <p className="line-clamp-2 text-xs text-slate-400">{room.description}</p>

                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Ruler className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                            {room.size} m²
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                            {room.maxGuests} kişi
                          </span>
                          <span className="inline-flex min-w-0 items-center gap-1">
                            <Eye className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                            <span className="truncate">{room.view}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {room.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[10px] text-slate-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto border-t border-slate-800/70 pt-4">
                          <div className="flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              <span className="block text-[10px] text-slate-500">
                                Gecelik ({season.name} tarifesi)
                              </span>
                              <span className="font-mono text-lg font-bold text-amber-400">₺{formatTRY(rate)}</span>
                              {rate !== room.pricePerNight && (
                                <span className="ml-1.5 font-mono text-[11px] text-slate-600 line-through">
                                  ₺{formatTRY(room.pricePerNight)}
                                </span>
                              )}
                            </div>
                            <span className="shrink-0 text-right text-[10px] text-slate-500">
                              {nights} gece
                              <span className="block font-mono text-xs font-semibold text-slate-300">
                                ₺{formatTRY(rate * nights)}
                              </span>
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => openDetail(room.id)}
                              className="min-h-10 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                            >
                              Detaylar
                            </button>
                            {soldOut ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (alternativeDates) {
                                    setCheckIn(alternativeDates.checkIn);
                                    setCheckOut(alternativeDates.checkOut);
                                  }
                                  scrollToRooms();
                                }}
                                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/20"
                              >
                                <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                                Başka Tarih
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openBooking(room.id, 3)}
                                className="min-h-10 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                              >
                                Rezerve Et
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------- Tesis İmkanları -------------------------- */}
      <section id="hizmetler" className="scroll-mt-20 border-y border-slate-800 bg-slate-900/50 px-5 py-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-2xl font-bold text-white md:text-3xl">Tesis İmkanları</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Utensils,
                title: 'Gourmet Restoran',
                text: 'Şeflerimizden özel lezzetler, oda servisi ve şarap eşleştirmeli akşam menüleri.',
                hours: '07:30 – 23:00',
              },
              {
                icon: Waves,
                title: 'SPA & Wellness',
                text: 'Isıtmalı kapalı havuz, Türk hamamı, sauna ve terapist eşliğinde masaj programları.',
                hours: '08:00 – 22:00',
              },
              {
                icon: ConciergeBell,
                title: 'Özel Concierge',
                text: 'Transfer, tekne turu, restoran rezervasyonu ve kişiye özel gezi planlaması.',
                hours: '7/24',
              },
              {
                icon: Wifi,
                title: 'Dijital Resepsiyon',
                text: '1 Gbps Wi-Fi, mobil giriş anahtarı ve anlık yanıt veren canlı asistan.',
                hours: '7/24',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <item.icon className="h-7 w-7 text-amber-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.text}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[10px] text-amber-300">
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- Oda Detay Penceresi ----------------------- */}
      <AnimatePresence>
        {detailRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6 md:items-center"
          >
            <button
              type="button"
              onClick={closeDetail}
              aria-label="Oda detayını kapat"
              className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              ref={detailRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="room-detail-title"
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduce ? 0.1 : 0.2 }}
              className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              {/* Galeri */}
              <div className="relative h-56 sm:h-72">
                <SafeImage
                  accent="text-amber-400"
                  key={detailRoom.images[galleryIndex]}
                  src={detailRoom.images[galleryIndex]}
                  alt={`${detailRoom.name} — görsel ${galleryIndex + 1} / ${detailRoom.images.length}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/25 to-transparent" />

                <button
                  type="button"
                  onClick={() => setGalleryIndex((i) => (i - 1 + detailRoom.images.length) % detailRoom.images.length)}
                  aria-label="Önceki görsel"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryIndex((i) => (i + 1) % detailRoom.images.length)}
                  aria-label="Sonraki görsel"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={closeDetail}
                  aria-label="Kapat"
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/85 text-slate-300 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>

                <span className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 font-mono text-[10px] text-slate-300">
                  {galleryIndex + 1} / {detailRoom.images.length}
                </span>

                <div className="absolute bottom-3 left-4 right-4 min-w-0">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-950">
                    {detailRoom.category}
                  </span>
                  <h2 id="room-detail-title" className="mt-2 text-base font-bold text-white sm:text-xl">
                    {detailRoom.name}
                  </h2>
                </div>
              </div>

              {/* Küçük görsel şeridi */}
              <div className="flex gap-2 overflow-x-auto border-b border-slate-800 bg-slate-950/60 p-3">
                {detailRoom.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setGalleryIndex(index)}
                    aria-label={`${detailRoom.name} görsel ${index + 1}`}
                    aria-pressed={index === galleryIndex}
                    className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                      index === galleryIndex ? 'border-amber-500' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <SafeImage
                      accent="text-amber-400"
                      src={image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="max-h-[58vh] space-y-5 overflow-y-auto p-4 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                      {season.name} gecelik tarifesi
                    </span>
                    <span className="font-mono text-2xl font-bold text-amber-400">
                      ₺{formatTRY(nightlyRate(detailRoom, season))}
                    </span>
                    <span className="ml-2 text-[11px] text-slate-500">
                      {nights} gece toplam ₺{formatTRY(nightlyRate(detailRoom, season) * nights)}
                    </span>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                      AVAILABILITY_META[availabilityFor(detailRoom.id, checkIn, checkOut)].chip
                    }`}
                  >
                    {AVAILABILITY_META[availabilityFor(detailRoom.id, checkIn, checkOut)].label}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">{detailRoom.description}</p>

                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: Maximize2, label: 'Büyüklük', value: `${detailRoom.size} m²` },
                    { icon: Users, label: 'Kapasite', value: `${detailRoom.maxGuests} misafir` },
                    { icon: Eye, label: 'Manzara', value: detailRoom.view },
                    { icon: BedDouble, label: 'Yatak', value: detailRoom.bed },
                  ].map((fact) => (
                    <div key={fact.label} className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500">
                        <fact.icon className="h-3 w-3 text-amber-400" aria-hidden="true" />
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-xs font-semibold text-white">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">Oda Olanakları</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailRoom.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        <Check className="h-3 w-3 text-amber-400" aria-hidden="true" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <h3 className="flex items-center gap-2 text-xs font-semibold text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    {CANCELLATION[detailRoom.cancellation].label}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                    {CANCELLATION[detailRoom.cancellation].detail}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Giriş 14:00 · Çıkış 12:00 · {detailRoom.location}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {availabilityFor(detailRoom.id, checkIn, checkOut) === 'dolu' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (alternativeDates) {
                          setCheckIn(alternativeDates.checkIn);
                          setCheckOut(alternativeDates.checkOut);
                        }
                      }}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-xs font-bold text-rose-200 transition-colors hover:bg-rose-500/20"
                    >
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {alternativeDates
                        ? `Müsait tarihi dene: ${formatDateTR(alternativeDates.checkIn, false)}`
                        : 'Bu tarihlerde dolu'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openBooking(detailRoom.id, 3)}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
                    >
                      <KeyRound className="h-4 w-4" aria-hidden="true" />
                      Bu Odayı Rezerve Et
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        `Merhaba, ${detailRoom.name} odası için ${formatDateTR(checkIn, false)} – ${formatDateTR(checkOut, false)} tarihleri hakkında bilgi almak istiyorum.`,
                      )
                    }
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    Resepsiyona Sor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------- Rezervasyon Penceresi ---------------------- */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6 md:items-center"
          >
            <button
              type="button"
              onClick={closeBooking}
              aria-label="Rezervasyon penceresini kapat"
              className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              ref={bookingRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-title"
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduce ? 0.1 : 0.2 }}
              className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <h2 id="booking-title" className="truncate text-sm font-bold text-white">
                    Rezervasyon Oluştur
                  </h2>
                  <p className="truncate text-[11px] text-slate-500">
                    Adım {step} / 5 · {currentStepMeta.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeBooking}
                  aria-label="Kapat"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Adım göstergesi */}
              <ol className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/60 px-3 py-3 sm:px-6">
                {STEPS.map((item, index) => {
                  const done = item.id < step;
                  const active = item.id === step;
                  return (
                    <li key={item.id} className="flex min-w-0 flex-1 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => goToStep(item.id)}
                        disabled={item.id >= step}
                        aria-current={active ? 'step' : undefined}
                        aria-label={`Adım ${item.id}: ${item.label}${done ? ' (tamamlandı)' : ''}`}
                        className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-1 py-1.5 text-left transition-colors ${
                          item.id < step ? 'cursor-pointer hover:bg-slate-900' : 'cursor-default'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            active
                              ? 'bg-amber-500 text-slate-950'
                              : done
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {done ? <Check className="h-3 w-3" aria-hidden="true" /> : item.id}
                        </span>
                        <span
                          className={`hidden min-w-0 truncate text-[11px] sm:inline ${
                            active ? 'font-semibold text-amber-300' : done ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {item.short}
                        </span>
                      </button>
                      {index < STEPS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={`hidden h-px w-3 shrink-0 sm:block ${done ? 'bg-emerald-500/40' : 'bg-slate-800'}`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>

              <div className="max-h-[62vh] space-y-4 overflow-y-auto p-4 sm:p-6">
                {formError && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-100"
                  >
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden="true" />
                    <span className="min-w-0">{formError}</span>
                  </p>
                )}

                {/* Adım 1 — Tarih & Kişi */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="min-w-0">
                        <label htmlFor="booking-checkin" className="mb-1.5 block text-[11px] text-slate-400">
                          Giriş tarihi
                        </label>
                        <input
                          id="booking-checkin"
                          type="date"
                          value={checkIn}
                          onChange={(event) => setCheckIn(event.target.value)}
                          className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="booking-checkout" className="mb-1.5 block text-[11px] text-slate-400">
                          Çıkış tarihi
                        </label>
                        <input
                          id="booking-checkout"
                          type="date"
                          value={checkOut}
                          min={addDays(checkIn, 1)}
                          onChange={(event) => setCheckOut(event.target.value)}
                          className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="mb-1.5 block text-[11px] text-slate-400">Misafir sayısı</span>
                      <div className="flex flex-wrap gap-2">
                        {GUEST_OPTIONS.map((count) => (
                          <button
                            key={count}
                            type="button"
                            aria-pressed={guests === count}
                            onClick={() => updateGuests(count)}
                            className={`min-h-10 min-w-11 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                              guests === count
                                ? 'bg-amber-500 text-slate-950'
                                : 'border border-slate-800 bg-slate-950 text-slate-300 hover:text-white'
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <CalendarDays className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                        <span className="font-semibold text-white">{formatDateTR(checkIn)}</span>
                        <span>→</span>
                        <span className="font-semibold text-white">{formatDateTR(checkOut)}</span>
                      </p>
                      <p className="mt-2">
                        {datesValid ? (
                          <>
                            Toplam <span className="font-semibold text-amber-400">{nights} gece</span> · {guests} misafir
                            · {season.name} ({SEASON_TIER_META[season.tier].label})
                          </>
                        ) : (
                          <span className="text-rose-300">Geçerli bir tarih aralığı seçin.</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Adım 2 — Oda Seçimi */}
                {step === 2 && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-400">
                      {guests} misafir için {formatDateTR(checkIn, false)} – {formatDateTR(checkOut, false)} tarihlerinde
                      uygun odalar:
                    </p>

                    {roomViews.filter((view) => view.room.maxGuests >= guests).length === 0 ? (
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-400">
                        {guests} misafir için uygun kapasitede oda bulunmuyor. Misafir sayısını azaltmayı deneyin.
                      </div>
                    ) : roomViews.filter((view) => view.room.maxGuests >= guests && view.availability !== 'dolu')
                        .length === 0 ? (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-center">
                        <TriangleAlert className="mx-auto h-8 w-8 text-rose-300" aria-hidden="true" />
                        <p className="mt-2 text-xs text-rose-100">
                          Seçtiğiniz tarihlerde uygun kapasitedeki tüm odalar dolu. Lütfen başka tarih deneyin.
                        </p>
                        {alternativeDates && (
                          <button
                            type="button"
                            onClick={() => {
                              setCheckIn(alternativeDates.checkIn);
                              setCheckOut(alternativeDates.checkOut);
                            }}
                            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                          >
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatDateTR(alternativeDates.checkIn, false)} –{' '}
                            {formatDateTR(alternativeDates.checkOut, false)} tarihini dene
                          </button>
                        )}
                      </div>
                    ) : (
                      roomViews
                        .filter((view) => view.room.maxGuests >= guests)
                        .map(({ room, availability, rate }) => {
                          const soldOut = availability === 'dolu';
                          const chosen = bookingRoomId === room.id;
                          return (
                            <button
                              key={room.id}
                              type="button"
                              disabled={soldOut}
                              aria-pressed={chosen}
                              onClick={() => {
                                setBookingRoomId(room.id);
                                setFormError(null);
                              }}
                              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                                soldOut
                                  ? 'cursor-not-allowed border-slate-800 bg-slate-950/60 opacity-60'
                                  : chosen
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-slate-800 bg-slate-950 hover:border-amber-500/40'
                              }`}
                            >
                              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
                                <SafeImage
                                  accent="text-amber-400"
                                  src={room.images[0]}
                                  alt=""
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-bold text-white">{room.name}</span>
                                <span className="mt-0.5 block text-[10px] text-slate-500">
                                  {room.size} m² · {room.maxGuests} kişi · {room.bed}
                                </span>
                                <span
                                  className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${AVAILABILITY_META[availability].chip}`}
                                >
                                  {AVAILABILITY_META[availability].label}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block font-mono text-sm font-bold text-amber-400">
                                  ₺{formatTRY(rate)}
                                </span>
                                <span className="block text-[10px] text-slate-500">gecelik</span>
                              </span>
                            </button>
                          );
                        })
                    )}
                  </div>
                )}

                {/* Adım 3 — Ekstralar */}
                {step === 3 && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-400">
                      Konaklamanıza eklemek istediğiniz hizmetleri seçin. Tutarlar {nights} gece ve {guests} misafir
                      üzerinden hesaplanır.
                    </p>
                    {EXTRAS.map((extra) => {
                      const active = selectedExtras.includes(extra.id);
                      return (
                        <label
                          key={extra.id}
                          className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                            active ? 'border-amber-500/60 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleExtra(extra.id)}
                            className="h-4 w-4 shrink-0 cursor-pointer accent-amber-400"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold text-white">{extra.label}</span>
                            <span className="block text-[10px] text-slate-500">{extra.hint}</span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block font-mono text-xs font-bold text-amber-400">
                              ₺{formatTRY(extraCost(extra, nights, guests))}
                            </span>
                            <span className="block text-[10px] text-slate-500">₺{formatTRY(extra.price)} birim</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Adım 4 — İletişim */}
                {step === 4 && (
                  <div className="space-y-3">
                    <div className="min-w-0">
                      <label htmlFor="guest-name" className="mb-1.5 block text-[11px] text-slate-400">
                        Ad Soyad
                      </label>
                      <input
                        id="guest-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Örn. Ayşe Yılmaz"
                        className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="min-w-0">
                        <label htmlFor="guest-email" className="mb-1.5 block text-[11px] text-slate-400">
                          E-posta
                        </label>
                        <input
                          id="guest-email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                          placeholder="ornek@eposta.com"
                          className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="guest-phone" className="mb-1.5 block text-[11px] text-slate-400">
                          Telefon
                        </label>
                        <input
                          id="guest-phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={form.phone}
                          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                          placeholder="0555 000 00 00"
                          className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="guest-note" className="mb-1.5 block text-[11px] text-slate-400">
                        Özel notunuz (isteğe bağlı)
                      </label>
                      <textarea
                        id="guest-note"
                        rows={3}
                        value={form.note}
                        onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                        placeholder="Uçuş saati, yüksek kat tercihi, bebek karyolası..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <input
                        type="checkbox"
                        checked={kvkkApproved}
                        onChange={(event) => setKvkkApproved(event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-amber-400"
                      />
                      <span className="min-w-0 text-[11px] leading-relaxed text-slate-400">
                        Kişisel verilerimin rezervasyon işlemi için işlenmesine ilişkin aydınlatma metnini okudum ve
                        onaylıyorum.
                      </span>
                    </label>
                  </div>
                )}

                {/* Adım 5 — Onay */}
                {step === 5 && bookingRoom && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" aria-hidden="true" />
                      <h3 className="mt-3 text-base font-bold text-white">Rezervasyonunuz oluşturuldu</h3>
                      <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-slate-300">
                        Onay detayları {form.email.trim()} adresine ve telefonunuza iletildi. Girişte bu kodu
                        resepsiyonda belirtmeniz yeterli.
                      </p>
                      <p className="mt-3 inline-block rounded-xl border border-emerald-500/30 bg-slate-950 px-4 py-2 font-mono text-lg font-bold tracking-widest text-emerald-300">
                        {code}
                      </p>
                    </div>

                    <dl className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs sm:grid-cols-2">
                      {[
                        { label: 'Misafir', value: form.name.trim() },
                        { label: 'Oda', value: bookingRoom.name },
                        { label: 'Giriş', value: `${formatDateTR(checkIn, false)} · 14:00` },
                        { label: 'Çıkış', value: `${formatDateTR(checkOut, false)} · 12:00` },
                        { label: 'Konaklama', value: `${nights} gece · ${guests} misafir` },
                        { label: 'İptal koşulu', value: CANCELLATION[bookingRoom.cancellation].label },
                      ].map((row) => (
                        <div key={row.label} className="flex min-w-0 items-center justify-between gap-3">
                          <dt className="shrink-0 text-slate-500">{row.label}</dt>
                          <dd className="min-w-0 truncate text-right font-medium text-white">{row.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          openWhatsApp(
                            `Merhaba, ${code} kodlu rezervasyonum hakkında bilgi almak istiyorum. (${bookingRoom.name}, ${formatDateTR(checkIn, false)} – ${formatDateTR(checkOut, false)})`,
                          )
                        }
                        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                      >
                        <PhoneCall className="h-4 w-4" aria-hidden="true" />
                        Rezervasyonu WhatsApp&apos;tan İlet
                      </button>
                      <button
                        type="button"
                        onClick={closeBooking}
                        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-colors hover:bg-amber-400"
                      >
                        Tamam
                      </button>
                    </div>
                  </div>
                )}

                {/* Canlı fiyat dökümü — 2, 3 ve 4. adımlarda görünür */}
                {step >= 2 && step <= 4 && bookingRoom && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                      <ConciergeBell className="h-3.5 w-3.5" aria-hidden="true" />
                      Fiyat Dökümü
                    </h3>
                    <dl className="space-y-1.5 text-xs">
                      <div className="flex items-start justify-between gap-3">
                        <dt className="min-w-0 text-slate-400">
                          {bookingRoom.name}
                          <span className="block text-[10px] text-slate-600">
                            ₺{formatTRY(bookingRate)} × {nights} gece ({season.name} tarifesi)
                          </span>
                        </dt>
                        <dd className="shrink-0 font-mono text-slate-200">₺{formatTRY(roomTotal)}</dd>
                      </div>

                      {chosenExtras.map((extra) => (
                        <div key={extra.id} className="flex items-start justify-between gap-3">
                          <dt className="min-w-0 truncate text-slate-400">{extra.label}</dt>
                          <dd className="shrink-0 font-mono text-slate-200">
                            ₺{formatTRY(extraCost(extra, nights, guests))}
                          </dd>
                        </div>
                      ))}

                      {chosenExtras.length === 0 && (
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-slate-500">Ekstralar</dt>
                          <dd className="font-mono text-slate-500">Seçilmedi</dd>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-2">
                        <dt className="text-slate-400">Ara toplam</dt>
                        <dd className="font-mono text-slate-200">₺{formatTRY(subtotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-400">Hizmet bedeli (%{Math.round(SERVICE_FEE_RATE * 100)})</dt>
                        <dd className="font-mono text-slate-200">₺{formatTRY(serviceFee)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-2">
                        <dt className="text-sm font-bold text-white">Toplam</dt>
                        <dd className="font-mono text-lg font-bold text-amber-400">₺{formatTRY(grandTotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-[11px] text-slate-500">
                          Şimdi ödenecek ön ödeme (%{Math.round(PREPAY_RATE * 100)})
                        </dt>
                        <dd className="font-mono text-[11px] text-slate-400">₺{formatTRY(prepayAmount)}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              {/* Alt gezinme */}
              {step < 5 && (
                <div className="flex items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/60 px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Geri
                  </button>
                  <div className="hidden min-w-0 flex-1 truncate px-2 text-center text-[11px] text-slate-500 sm:block">
                    {bookingRoom ? `${bookingRoom.name} · ₺${formatTRY(grandTotal)}` : 'Henüz oda seçilmedi'}
                  </div>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
                  >
                    {step === 4 ? 'Rezervasyonu Onayla' : 'Devam Et'}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------ Concierge Sohbet Widget --------------------- */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              id="concierge-chat"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: reduce ? 0.1 : 0.2 }}
              className="mb-3 flex h-[70vh] max-h-[520px] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 p-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">Aetheria Concierge</span>
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                      Resepsiyon asistanı · 7/24
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Sohbeti kapat"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div
                ref={chatBodyRef}
                role="log"
                aria-live="polite"
                aria-label="Sohbet geçmişi"
                className="flex-1 space-y-3 overflow-y-auto p-3 text-xs"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <p
                      className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed ${
                        message.sender === 'user'
                          ? 'bg-amber-500 font-semibold text-slate-950'
                          : 'border border-slate-800 bg-slate-950 text-slate-200'
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}
                {isTyping && (
                  <p className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-[11px] text-slate-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" aria-hidden="true" />
                    Asistan yazıyor...
                  </p>
                )}
              </div>

              {/* Hazır sorular */}
              <div className="border-t border-slate-800 bg-slate-950/60 p-2">
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {CHAT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePreset(preset.id)}
                      className="min-h-9 shrink-0 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                    >
                      {preset.question}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-800 bg-slate-950 p-2.5">
                <label htmlFor="chat-input" className="sr-only">
                  Resepsiyon asistanına mesajınız
                </label>
                <input
                  id="chat-input"
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Odalar veya olanaklar hakkında sorun..."
                  className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Mesajı gönder"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-slate-950 transition-colors hover:bg-amber-400"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsChatOpen((open) => !open)}
          aria-expanded={isChatOpen}
          aria-controls="concierge-chat"
          aria-label={isChatOpen ? 'Concierge sohbetini kapat' : 'Concierge sohbetini aç'}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-xl transition-colors hover:bg-amber-400"
        >
          <Bot className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">{isChatOpen ? 'Sohbeti Kapat' : 'Canlı Destek'}</span>
        </button>
      </div>

      {/* ------------------------------- Footer ------------------------------ */}
      <footer id="iletisim" className="scroll-mt-20 border-t border-slate-800 bg-slate-950 px-5 py-12 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div className="min-w-0 space-y-2">
            <span className="font-serif text-sm font-bold tracking-wider text-amber-400">
              AETHERIA HOTEL &amp; RESIDENCES
            </span>
            <p className="text-xs leading-relaxed text-slate-500">
              Süit, villa, loft ve penthouse konseptlerinde altı ayrı konaklama seçeneği; sezon bazlı tarifeler ve
              7/24 concierge hizmeti.
            </p>
          </div>
          <div className="min-w-0 space-y-2 text-xs text-slate-500">
            <p className="font-semibold text-slate-300">Resepsiyon</p>
            <p>Sahil Caddesi No: 1, Kalkan / Antalya</p>
            <p>Giriş 14:00 · Çıkış 12:00 · Kahvaltı 07:30 – 10:30</p>
          </div>
          <div className="min-w-0 space-y-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-300">Hızlı rezervasyon</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openBooking(bookingRoomId, 1)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
              >
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Rezervasyon Oluştur
              </button>
              <button
                type="button"
                onClick={() => openWhatsApp('Merhaba Aetheria Hotel, rezervasyon hakkında bilgi almak istiyorum.')}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
              >
                <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-slate-800/70 pt-6 text-center text-[11px] text-slate-600">
          © 2026 Aetheria Hotel &amp; Residences. Bu sayfa tanıtım amaçlı kurgusal bir demodur.
        </p>
      </footer>
      <DemoSwitcher currentId="otel-rezervasyon" />
    </main>
  );
}
