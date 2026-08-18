'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';
import { whatsAppLink } from '@/lib/site';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Flame,
  Fish,
  Leaf,
  MapPin,
  MessageCircle,
  Minus,
  PhoneCall,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UtensilsCrossed,
  WheatOff,
  Wine,
  X,
} from 'lucide-react';

/* ---------------------------------- Tipler --------------------------------- */

type Category = 'Başlangıçlar' | 'Ana Yemekler' | 'Tatlılar';
type Diet = 'Vejetaryen' | 'Glutensiz' | 'Deniz Ürünü';
type SeatingName = 'Chef Table' | 'Main Dining' | 'Terrace Lounge' | 'Private Room';
type SlotStatus = 'dolu' | 'son' | 'musait';

interface MenuItem {
  id: string;
  name: string;
  category: Category;
  /** Sepet matematiği için ham sayı; ekranda formatPrice ile gösterilir. */
  price: number;
  prepTime: string;
  calories: string;
  description: string;
  badge: string;
  image: string;
  winePairing: string;
  /** Diyet filtresi rozetleri. */
  diets: Diet[];
  allergens: string[];
  ingredients: string[];
}

interface OrderLine {
  id: string;
  name: string;
  price: number;
  qty: number;
}

/* --------------------------------- Sabitler -------------------------------- */

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Ağır Ateşte Pişmiş Wagyu Yanak',
    category: 'Ana Yemekler',
    price: 1450,
    prepTime: '48 Saat Sous-Vide',
    calories: '680 kcal',
    description:
      'Siyah Trüf mantarı püresi, karamelize arpacık soğan konfit, ilik sosu ve 24K altın yaprak dokunuşu ile.',
    badge: 'Şefin İmzası',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75',
    winePairing: '2018 Barolo DOCG Reserva',
    diets: [],
    allergens: ['Süt', 'Sülfit', 'Kereviz'],
    ingredients: [
      'A5 Wagyu yanak (48 saat 63°C)',
      'Périgord siyah trüf püresi',
      'Karamelize arpacık soğan konfit',
      'Dana ilik demi-glace',
      '24K yenilebilir altın yaprak',
    ],
  },
  {
    id: '2',
    name: 'Atlantik Istakoz & Safranlı Risotto',
    category: 'Ana Yemekler',
    price: 1850,
    prepTime: 'Taze Hazırlanır',
    calories: '540 kcal',
    description:
      'Acquerello pirinci, ızgara Atlantik ıstakoz kuyruğu, İran safranı, köpük bisque ve deniz börülcesi.',
    badge: 'Michelin Seçkisi',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=75',
    winePairing: '2021 Chablis Premier Cru',
    diets: ['Deniz Ürünü'],
    allergens: ['Kabuklu deniz ürünü', 'Süt', 'Sülfit'],
    ingredients: [
      'Atlantik ıstakoz kuyruğu',
      '7 yıl dinlendirilmiş Acquerello pirinci',
      'İran safranı infüzyonu',
      'Kabuk bisque köpüğü',
      'Ege deniz börülcesi',
    ],
  },
  {
    id: '3',
    name: 'Dry-Aged Tomahawk Steak',
    category: 'Ana Yemekler',
    price: 2200,
    prepTime: 'Odun Ateşi',
    calories: '850 kcal',
    description:
      '28 gün dinlendirilmiş meşe odunu ateşinde ızgaralanmış Tomahawk, füme kemik iliği tereyağı ve chimichurri ile.',
    badge: 'Özel Kesim',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=75',
    winePairing: '2017 Cabernet Sauvignon',
    diets: ['Glutensiz'],
    allergens: ['Süt'],
    ingredients: [
      '28 gün kuru dinlendirilmiş Tomahawk (1,2 kg)',
      'Meşe odunu közü',
      'Füme kemik iliği tereyağı',
      'El yapımı chimichurri',
      'Maldon deniz tuzu',
    ],
  },
  {
    id: '4',
    name: 'Izgara Ahtapot & Siyah Trüf Püresi',
    category: 'Ana Yemekler',
    price: 1250,
    prepTime: 'Kömür Izgara',
    calories: '420 kcal',
    description: 'Ege ahtapotu, siyah sarımsak emülsiyonu, fırınlanmış patates püresi ve mikro yeşillikler.',
    badge: 'Deniz Mahsülü',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=75',
    winePairing: '2020 Assyrtiko Santorini',
    diets: ['Deniz Ürünü', 'Glutensiz'],
    allergens: ['Yumuşakça', 'Sülfit'],
    ingredients: [
      'Ege ahtapot kolu (12 saat marine)',
      'Siyah sarımsak emülsiyonu',
      'Fırınlanmış patates püresi',
      'Trüf yağı',
      'Mikro yeşillik seçkisi',
    ],
  },
  {
    id: '5',
    name: 'Füme Burrata & Yaban Mersini Havyarı',
    category: 'Başlangıçlar',
    price: 680,
    prepTime: 'Soğuk Servis',
    calories: '390 kcal',
    description:
      'Odun ateşinde tütsülenmiş manda burrata, moleküler yaban mersini havyarı, fesleğen esansı ve fırınlanmış çeri domates.',
    badge: 'Gurme Başlangıç',
    image: 'https://images.unsplash.com/photo-1477921510058-85812315a3c4?auto=format&fit=crop&w=800&q=75',
    winePairing: '2022 Sauvignon Blanc',
    diets: ['Vejetaryen', 'Glutensiz'],
    allergens: ['Süt'],
    ingredients: [
      'Tütsülenmiş manda burrata',
      'Moleküler yaban mersini havyarı',
      'Fesleğen esansı',
      'Fırınlanmış çeri domates',
      'Sicilya zeytinyağı',
    ],
  },
  {
    id: '6',
    name: 'Kral Yengeç & Avokado Tartar',
    category: 'Başlangıçlar',
    price: 920,
    prepTime: 'Anlık Hazırlık',
    calories: '310 kcal',
    description:
      'Kamçatka kral yengeç eti, olgunlaşmış avokado, misket limonu emülsiyonu ve tütsülenmiş uçan balık yumurtası.',
    badge: 'Taze & Hafif',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=75',
    winePairing: 'Champagne Brut Réserve',
    diets: ['Deniz Ürünü', 'Glutensiz'],
    allergens: ['Kabuklu deniz ürünü', 'Balık', 'Yumurta'],
    ingredients: [
      'Kamçatka kral yengeç eti',
      'Olgun Hass avokado',
      'Misket limonu emülsiyonu',
      'Tütsülenmiş uçan balık yumurtası',
      'Yeşil elma jölesi',
    ],
  },
  {
    id: '7',
    name: 'Gold Leaf Valrhona Çikolata Küresi',
    category: 'Tatlılar',
    price: 520,
    prepTime: 'Sıcak Akışkan',
    calories: '450 kcal',
    description:
      '%85 Madagaskar bitter çikolata küresi, içerisinde çarkıfelek meyvesi kreması ve sıcak karamel dökümü.',
    badge: 'Şov Servis',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=75',
    winePairing: '2015 Vintage Port',
    diets: ['Vejetaryen'],
    allergens: ['Süt', 'Yumurta', 'Soya', 'Gluten'],
    ingredients: [
      '%85 Madagaskar Valrhona kuvertürü',
      'Çarkıfelek meyvesi kreması',
      'Tuzlu karamel dökümü',
      'Kakao tuile',
      '24K altın yaprak',
    ],
  },
  {
    id: '8',
    name: 'Altın Dokunuşlu Matcha Pavlova',
    category: 'Tatlılar',
    price: 460,
    prepTime: 'Taze Baiser',
    calories: '280 kcal',
    description:
      'Japon Kyōto matcha bezesi, taze orman meyveleri, vanilya çekirdekli krem şanti ve tutku meyvesi sosu.',
    badge: 'Özel Seri',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=75',
    winePairing: "Moscato d'Asti",
    diets: ['Vejetaryen', 'Glutensiz'],
    allergens: ['Yumurta', 'Süt'],
    ingredients: [
      'Kyōto seremoni matcha bezesi',
      'Taze orman meyveleri',
      'Madagaskar vanilyalı krem şanti',
      'Tutku meyvesi sosu',
      'Limon otu tozu',
    ],
  },
];

/** Tadım menüsü de sepete eklenebilen bir kalem; sipariş özetinde yemeklerle aynı akışta. */
const TASTING_MENU_ID = 'tadim-menusu';
const TASTING_MENU_PRICE = 3400;

interface Course {
  step: number;
  title: string;
  name: string;
  description: string;
  wine: string;
  image: string;
  technique: string;
}

const TASTING_COURSES: Course[] = [
  {
    step: 1,
    title: 'Amuse-Bouche',
    name: 'Deniz Börülcesi & Istiridye Esansı',
    description:
      'Boğaz’ın tuzlu esintisini tek lokmada özetleyen açılış. Buz üzerinde servis edilir, elle tüketilmesi önerilir.',
    wine: 'Champagne Blanc de Blancs',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=75',
    technique: 'Soğuk ekstraksiyon',
  },
  {
    step: 2,
    title: 'Birinci Servis',
    name: 'Füme Burrata & Yaban Mersini Havyarı',
    description:
      'Odun ateşinde tütsülenen manda burratası, moleküler havyar ve fesleğen esansı ile sofrada tamamlanır.',
    wine: '2022 Sauvignon Blanc',
    image: 'https://images.unsplash.com/photo-1477921510058-85812315a3c4?auto=format&fit=crop&w=800&q=75',
    technique: 'Sferifikasyon',
  },
  {
    step: 3,
    title: 'İkinci Servis',
    name: 'Izgara Ahtapot & Siyah Trüf Püresi',
    description:
      '12 saat marine edilen Ege ahtapotu, kömür ızgarada mühürlenir; siyah sarımsak emülsiyonu ile dengelenir.',
    wine: '2020 Assyrtiko Santorini',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=75',
    technique: 'Josper közü',
  },
  {
    step: 4,
    title: 'Ana Servis',
    name: 'Ağır Ateşte Pişmiş Wagyu Yanak',
    description:
      '48 saat 63°C’de pişen Wagyu yanak, ilik sosu ile masada glaze edilir. Menünün en yoğun aromalı servisi.',
    wine: '2018 Barolo DOCG Reserva',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75',
    technique: 'Sous-vide + masada glaze',
  },
  {
    step: 5,
    title: 'Final',
    name: 'Gold Leaf Valrhona Çikolata Küresi',
    description:
      'Sıcak karamel dökümüyle masada açılan çikolata küresi. Servis şefin eşliğinde, ışıklar kısılarak yapılır.',
    wine: '2015 Vintage Port',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=75',
    technique: 'Temperleme & masada servis',
  },
];

const CATEGORIES = ['Tümü', 'Başlangıçlar', 'Ana Yemekler', 'Tatlılar'] as const;

const DIET_FILTERS: { id: Diet; icon: React.ElementType }[] = [
  { id: 'Vejetaryen', icon: Leaf },
  { id: 'Glutensiz', icon: WheatOff },
  { id: 'Deniz Ürünü', icon: Fish },
];

const SEATING_AREAS: { name: SeatingName; desc: string; badge: string }[] = [
  { name: 'Chef Table', desc: 'Mutfak Önü Özel Sahne', badge: 'Ultra VIP' },
  { name: 'Main Dining', desc: 'Ana Salon & Akustik Atmosfer', badge: 'Popüler' },
  { name: 'Terrace Lounge', desc: 'Panoramik Boğaz Manzarası', badge: 'Manzaralı' },
  { name: 'Private Room', desc: 'İzole & Gizli Rezidans', badge: 'Kişiye Özel' },
];

const TIME_SLOTS: { id: string; note: string }[] = [
  { id: '18:30', note: 'Erken Servis' },
  { id: '19:00', note: "Chef's Session" },
  { id: '20:00', note: 'Main Degustation' },
  { id: '21:30', note: 'Late Lounge' },
];

const GUEST_OPTIONS = [2, 3, 4, 5, 6, 8];

const SHORT_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const LONG_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const SHORT_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const LONG_MONTHS = [
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

/** SSR anlık görüntüsü: sunucu ve hidrasyon aynı tarihi görsün diye sabit. */
const FALLBACK_DATE_KEY = '2026-7-17';

/* -------------------------------- Yardımcılar ------------------------------- */

/** Intl'e bağlı kalmadan binlik ayırıcı: sunucu/istemci farkı riski yok. */
function formatPrice(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** useSyncExternalStore için abonelik gerekmiyor; tarih oturum boyunca sabit kabul edilir. */
function subscribeToNothing(): () => void {
  return () => {};
}

/** İstemci anlık görüntüsü: aynı gün içinde hep aynı string döner (referans kararlı). */
function readTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function readFallbackKey(): string {
  return FALLBACK_DATE_KEY;
}

function parseDateKey(key: string): { year: number; month: number; day: number } {
  const [year, month, day] = key.split('-').map(Number);
  return { year, month, day };
}

interface DayOption {
  key: string;
  chipDay: string;
  chipDate: string;
  longLabel: string;
  isWeekend: boolean;
}

function buildDays(base: { year: number; month: number; day: number }): DayOption[] {
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(base.year, base.month, base.day + index);
    const weekday = date.getDay();
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      chipDay: index === 0 ? 'Bugün' : index === 1 ? 'Yarın' : SHORT_DAYS[weekday],
      chipDate: `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`,
      longLabel: `${date.getDate()} ${LONG_MONTHS[date.getMonth()]} ${LONG_DAYS[weekday]}`,
      isWeekend: weekday === 0 || weekday === 5 || weekday === 6,
    };
  });
}

/**
 * Müsaitlik simülasyonu — tamamen indekslerden türetilir.
 * Math.random() kullanılmaz; sunucu ve istemci aynı sonucu üretir.
 */
function slotStatus(dayIndex: number, slotIndex: number, areaIndex: number): SlotStatus {
  const score = (dayIndex * 5 + slotIndex * 3 + areaIndex * 7) % 11;
  if (score < 2) return 'dolu';
  if (score < 5) return 'son';
  return 'musait';
}

const STATUS_LABEL: Record<SlotStatus, string> = {
  dolu: 'Dolu',
  son: 'Son 1 masa',
  musait: 'Müsait',
};

/* ------------------------------ Alt bileşenler ------------------------------ */

function DietBadge({ diet }: { diet: Diet }) {
  const Icon = diet === 'Vejetaryen' ? Leaf : diet === 'Glutensiz' ? WheatOff : Fish;
  return (
    <span className="inline-flex min-w-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{diet}</span>
    </span>
  );
}

function QuantityStepper({
  qty,
  itemName,
  onAdd,
  onRemove,
}: {
  qty: number;
  itemName: string;
  onAdd: () => void;
  onRemove: () => void;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 text-xs font-mono font-bold text-slate-200 transition-all hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span>Siparişe Ekle</span>
      </button>
    );
  }

  return (
    <div className="flex min-h-11 items-center justify-between gap-2 rounded-2xl border border-amber-500/50 bg-amber-500/10 px-2">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${itemName} porsiyonunu azalt`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-amber-300 transition-colors hover:bg-amber-500 hover:text-slate-950"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="min-w-0 truncate font-mono text-sm font-bold text-amber-200" aria-live="polite">
        {qty} porsiyon
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`${itemName} porsiyonunu artır`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-amber-300 transition-colors hover:bg-amber-500 hover:text-slate-950"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function OrderPanel({
  idPrefix,
  lines,
  subtotal,
  service,
  total,
  orderSent,
  orderCode,
  seatingArea,
  onAdd,
  onRemove,
  onDrop,
  onSubmit,
  onReset,
}: {
  idPrefix: string;
  lines: OrderLine[];
  subtotal: number;
  service: number;
  total: number;
  orderSent: boolean;
  orderCode: string;
  seatingArea: SeatingName;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onDrop: (id: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const headingId = `${idPrefix}-order-heading`;

  if (orderSent) {
    return (
      <section
        aria-labelledby={headingId}
        className="space-y-4 rounded-3xl border-2 border-emerald-500/50 bg-emerald-950/30 p-5 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/20 text-emerald-300">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 id={headingId} className="font-serif text-lg font-bold text-white">
          Siparişiniz Masaya İletildi
        </h3>
        <p className="text-xs leading-relaxed text-slate-300">
          <span className="font-mono font-bold text-amber-300">{orderCode}</span> numaralı siparişiniz{' '}
          <span className="font-bold text-amber-300">{seatingArea}</span> alanındaki servis ekibine düştü. Şef
          onayladığında masanızdaki ekrandan bilgilendirileceksiniz.
        </p>
        <p className="font-mono text-sm text-emerald-300">Toplam ₺{formatPrice(total)}</p>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 w-full rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 text-xs font-mono font-bold uppercase tracking-wider text-emerald-200 transition-colors hover:bg-emerald-500 hover:text-slate-950"
        >
          Yeni Sipariş Oluştur
        </button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-4 rounded-3xl border border-amber-500/25 bg-[#05050a]/95 p-5 backdrop-blur-2xl"
    >
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-amber-500/15 pb-3">
        <h3 id={headingId} className="flex min-w-0 items-center gap-2 font-serif text-base font-bold text-white">
          <ShoppingBag className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
          <span className="truncate">Sipariş Özeti</span>
        </h3>
        <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
          {seatingArea}
        </span>
      </div>

      {lines.length === 0 ? (
        <div className="space-y-2 rounded-2xl border border-dashed border-slate-800 bg-black/40 p-5 text-center">
          <UtensilsCrossed className="mx-auto h-6 w-6 text-slate-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-slate-400">
            Henüz seçim yapmadınız. Menüden bir tabak ekleyin, tutar burada anlık hesaplansın.
          </p>
        </div>
      ) : (
        <ul className="max-h-[38vh] space-y-2 overflow-y-auto pr-1">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex min-w-0 items-start gap-2 rounded-2xl border border-slate-800/80 bg-black/50 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{line.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                  {line.qty} × ₺{formatPrice(line.price)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onRemove(line.id)}
                    aria-label={`${line.name} porsiyonunu azalt`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition-colors hover:border-amber-500/60 hover:text-amber-300"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdd(line.id)}
                    aria-label={`${line.name} porsiyonunu artır`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition-colors hover:border-amber-500/60 hover:text-amber-300"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDrop(line.id)}
                    aria-label={`${line.name} kalemini siparişten çıkar`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition-colors hover:border-rose-500/50 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <span className="shrink-0 font-mono text-sm font-bold text-amber-300">
                ₺{formatPrice(line.price * line.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="space-y-2 border-t border-slate-800 pt-3 font-mono text-xs">
        <div className="flex items-center justify-between gap-3">
          <dt className="min-w-0 truncate text-slate-400">Ara Toplam</dt>
          <dd className="shrink-0 text-slate-200">₺{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="min-w-0 truncate text-slate-400">Servis (%10)</dt>
          <dd className="shrink-0 text-slate-200">₺{formatPrice(service)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-2 text-sm">
          <dt className="min-w-0 truncate font-bold text-white">Genel Toplam</dt>
          <dd className="shrink-0 font-bold text-amber-400">₺{formatPrice(total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onSubmit}
        disabled={lines.length === 0}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500 disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        <span>Masaya Gönder</span>
      </button>
      <p className="text-center text-[10px] leading-relaxed text-slate-500">
        Bu bir demo akışıdır; gerçek bir ödeme alınmaz.
      </p>
    </section>
  );
}

/* ------------------------------- Ana bileşen -------------------------------- */

export default function AvantGardeGastronomyPage() {
  const reduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();

  // Menü filtreleri
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [activeDiets, setActiveDiets] = useState<Diet[]>([]);

  // Sipariş durumu
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderSent, setOrderSent] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Tabak detay modalı
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Tadım menüsü adımı
  const [courseIndex, setCourseIndex] = useState(0);

  // Rezervasyon
  const [seatingArea, setSeatingArea] = useState<SeatingName>('Chef Table');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [timeSlot, setTimeSlot] = useState<string>('20:00');
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [isReserved, setIsReserved] = useState(false);

  /**
   * Bugünün tarihi yalnızca hidrasyondan sonra okunur: sunucu anlık görüntüsü sabit,
   * istemci anlık görüntüsü gerçek tarih. Böylece hydration uyuşmazlığı oluşmaz.
   */
  const baseKey = useSyncExternalStore(subscribeToNothing, readTodayKey, readFallbackKey);
  const baseDate = useMemo(() => parseDateKey(baseKey), [baseKey]);

  const days = useMemo(() => buildDays(baseDate), [baseDate]);
  const selectedDay = days[dayIndex] ?? days[0];
  const areaIndex = useMemo(() => SEATING_AREAS.findIndex((area) => area.name === seatingArea), [seatingArea]);

  /**
   * Seçili saat, tarih/alan değişince dolu hâle gelebilir; efekt ile state güncellemek
   * yerine geçerli saati render sırasında türetiyoruz (ilk müsait saate düşer).
   */
  const activeSlotIndex = useMemo(() => {
    const preferred = TIME_SLOTS.findIndex((slot) => slot.id === timeSlot);
    if (preferred !== -1 && slotStatus(dayIndex, preferred, areaIndex) !== 'dolu') return preferred;
    const firstFree = TIME_SLOTS.findIndex((_, index) => slotStatus(dayIndex, index, areaIndex) !== 'dolu');
    if (firstFree !== -1) return firstFree;
    return preferred === -1 ? 0 : preferred;
  }, [timeSlot, dayIndex, areaIndex]);

  const activeTime = TIME_SLOTS[activeSlotIndex].id;
  const currentStatus: SlotStatus = slotStatus(dayIndex, activeSlotIndex, areaIndex);

  /* ------------------------------ Menü filtresi ----------------------------- */

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
      const matchDiet = activeDiets.every((diet) => item.diets.includes(diet));
      return matchCategory && matchDiet;
    });
  }, [selectedCategory, activeDiets]);

  const isFiltered = selectedCategory !== 'Tümü' || activeDiets.length > 0;

  const handleCategoryChange = useCallback((cat: string) => {
    startTransition(() => setSelectedCategory(cat));
  }, []);

  const toggleDiet = useCallback((diet: Diet) => {
    startTransition(() => {
      setActiveDiets((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]));
    });
  }, []);

  const resetFilters = useCallback(() => {
    startTransition(() => {
      setSelectedCategory('Tümü');
      setActiveDiets([]);
    });
  }, []);

  /* -------------------------------- Sepet ---------------------------------- */

  const addToCart = useCallback((id: string) => {
    setOrderSent(false);
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[id] ?? 0;
      if (current <= 1) delete next[id];
      else next[id] = current - 1;
      return next;
    });
  }, []);

  const dropFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const orderLines = useMemo<OrderLine[]>(() => {
    const lines: OrderLine[] = MENU_ITEMS.filter((item) => (cart[item.id] ?? 0) > 0).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: cart[item.id],
    }));

    if ((cart[TASTING_MENU_ID] ?? 0) > 0) {
      lines.push({
        id: TASTING_MENU_ID,
        name: 'Şefin Tadım Menüsü (5 Servis)',
        price: TASTING_MENU_PRICE,
        qty: cart[TASTING_MENU_ID],
      });
    }

    return lines;
  }, [cart]);

  const itemCount = useMemo(() => orderLines.reduce((sum, line) => sum + line.qty, 0), [orderLines]);
  const subtotal = useMemo(() => orderLines.reduce((sum, line) => sum + line.price * line.qty, 0), [orderLines]);
  const service = Math.round(subtotal * 0.1);
  const total = subtotal + service;
  // Sipariş numarası tutardan türetiliyor — rastgelelik yok, hydration güvenli.
  const orderCode = `LN-${1000 + (subtotal % 8999)}`;

  const submitOrder = useCallback(() => {
    if (orderLines.length === 0) return;
    setOrderSent(true);
    setMobileCartOpen(false);
  }, [orderLines.length]);

  const resetOrder = useCallback(() => {
    setCart({});
    setOrderSent(false);
  }, []);

  /* ------------------------------ Detay modalı ------------------------------ */

  const openDish = useCallback((item: MenuItem) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedDish(item);
  }, []);

  const closeDish = useCallback(() => setSelectedDish(null), []);

  useEffect(() => {
    if (!selectedDish) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDish();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedDish, closeDish]);

  // Modal kapanınca odak, açan butona geri döner.
  useEffect(() => {
    if (selectedDish) return;
    lastFocusedRef.current?.focus();
  }, [selectedDish]);

  /* ----------------------------- Tadım menüsü ------------------------------- */

  const activeCourse = TASTING_COURSES[courseIndex];
  const goPrevCourse = useCallback(() => setCourseIndex((i) => Math.max(0, i - 1)), []);
  const goNextCourse = useCallback(() => setCourseIndex((i) => Math.min(TASTING_COURSES.length - 1, i + 1)), []);

  /* ------------------------------ Rezervasyon ------------------------------- */

  const handleReservation = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setIsReserved(true);
  }, []);

  const openWhatsApp = useCallback(
    (message?: string) => {
      const text =
        message ??
        `Merhaba L'Étoile Noir Concierge, ${seatingArea} alanı için ${guestCount} kişilik VIP rezervasyon bilgisi almak istiyorum.`;
      window.open(whatsAppLink(text), '_blank', 'noopener,noreferrer');
    },
    [seatingArea, guestCount],
  );

  const showMobileBar = itemCount > 0 || orderSent;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020204] font-sans text-slate-100 selection:bg-amber-400 selection:text-black">
      {/* Arka plan ışıkları */}
      <div className="pointer-events-none fixed left-1/2 top-[-10%] z-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-600/15 via-amber-900/5 to-transparent blur-[160px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-0 z-0 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[180px]" />

      {/* --------------------------------- Header -------------------------------- */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-3 border-b border-amber-500/20 bg-[#020204]/85 px-4 py-3 backdrop-blur-2xl md:px-12 md:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 font-mono text-xs text-slate-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <ArrowLeft className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sr-only sm:hidden">Ana Sayfaya Dön</span>
          </Link>

          <nav aria-label="Bölüm bağlantıları" className="hidden min-w-0 items-center gap-4 lg:flex">
            <a href="#menu" className="font-mono text-xs text-slate-300 transition-colors hover:text-amber-300">
              Menü
            </a>
            <a href="#tadim-menusu" className="font-mono text-xs text-slate-300 transition-colors hover:text-amber-300">
              Tadım Menüsü
            </a>
            <a href="#rezervasyon" className="font-mono text-xs text-slate-300 transition-colors hover:text-amber-300">
              Rezervasyon
            </a>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 font-mono text-xs text-slate-300"
            aria-live="polite"
          >
            <ShoppingBag
              className={`h-4 w-4 ${itemCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}
              aria-hidden="true"
            />
            <span className="tabular-nums">{itemCount}</span>
            <span className="sr-only">tabak siparişinizde</span>
          </span>

          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:from-amber-400 hover:to-amber-500"
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">İletişime Geç</span>
            <span className="sm:hidden">İletişim</span>
          </button>
        </div>
      </header>

      {/* ---------------------------------- Hero --------------------------------- */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-amber-500/10 px-4 sm:px-6 md:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-[#020204] to-[#020204]" />

        <div className="relative z-10 mx-auto max-w-5xl space-y-8 py-14 text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300 backdrop-blur-2xl sm:text-xs sm:tracking-[0.25em]"
          >
            <Award className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="min-w-0 truncate">Michelin Guide 2026 • Haute Gastronomie</span>
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.1 }}
            className="bg-gradient-to-b from-amber-100 via-amber-200 to-amber-700 bg-clip-text font-serif text-5xl font-black uppercase leading-none tracking-tight text-transparent drop-shadow-[0_10px_40px_rgba(245,158,11,0.25)] sm:text-6xl md:text-9xl">
            L&apos;Étoile Noir
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.15 }}
            className="mx-auto max-w-3xl text-sm font-light leading-relaxed tracking-wide text-slate-300 sm:text-base md:text-2xl"
          >
            Sanatın moleküler lezzetlerle buluştuğu nokta. Menüden masanıza sipariş verin, tadım menüsünü keşfedin ve
            ayrıcalıklı VIP rezervasyonunuzu saniyeler içinde oluşturun.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-[11px] text-slate-300 sm:text-xs"
          >
            <span className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-slate-900/60 px-4 py-2.5 backdrop-blur-xl">
              <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
              3 Michelin Yıldızı
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-slate-900/60 px-4 py-2.5 backdrop-blur-xl">
              <Wine className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              Sommelier Kav Seçkisi
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-slate-900/60 px-4 py-2.5 backdrop-blur-xl">
              <MapPin className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              Boğaz Hattı, İstanbul
            </span>
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <a
              href="#menu"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500 sm:w-auto"
            >
              Menüyü İncele
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#rezervasyon"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-black/50 px-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-200 transition-all hover:bg-amber-500/10 sm:w-auto"
            >
              Masa Ayırt
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------- Menü --------------------------------- */}
      <section id="menu" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 md:px-12 md:py-20">
        <div className="mb-8 flex flex-col gap-6 md:mb-12">
          <div className="min-w-0">
            <span className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400 sm:text-xs">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" /> Özel Lezzetler
            </span>
            <h2 className="font-serif text-3xl font-black tracking-tight text-white sm:text-4xl md:text-6xl">
              A la Carte & Tadım
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Tabakları inceleyin, porsiyon adedini seçin ve siparişinizi doğrudan masanıza gönderin. Detay kartında
              alerjen bilgisi ve sommelier eşleşmesi yer alır.
            </p>
          </div>

          {/* Filtreler */}
          <div className="space-y-3">
            <div
              role="group"
              aria-label="Kategori filtresi"
              className="flex flex-wrap gap-2 rounded-2xl border border-amber-500/20 bg-slate-950/80 p-2 backdrop-blur-2xl"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`min-h-10 flex-1 rounded-xl px-4 font-mono text-[11px] font-bold uppercase tracking-wider transition-all sm:flex-none sm:px-6 sm:text-xs ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Diyet Tercihi</span>
              <div role="group" aria-label="Diyet filtresi" className="flex flex-wrap gap-2">
                {DIET_FILTERS.map(({ id, icon: Icon }) => {
                  const active = activeDiets.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleDiet(id)}
                      aria-pressed={active}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 font-mono text-[11px] transition-all ${
                        active
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                          : 'border-slate-800 bg-black/40 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs text-slate-400" aria-live="polite">
                <span className="font-bold text-amber-300">{filteredMenu.length}</span> tabak listeleniyor
                {isFiltered ? ` (${MENU_ITEMS.length} tabak içinden)` : ''}
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-800 bg-black/40 px-3 font-mono text-[11px] text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Tabak listesi */}
          <div className="min-w-0">
            {filteredMenu.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-amber-500/30 bg-slate-950/60 px-6 py-16 text-center">
                <UtensilsCrossed className="h-10 w-10 text-amber-500/50" aria-hidden="true" />
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-white">Bu seçimle eşleşen tabak yok</h3>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-400">
                    Seçtiğiniz kategori ve diyet tercihlerinin kesişiminde servis edilen bir tabak bulunmuyor. Filtreleri
                    gevşetin ya da sommelier ekibimizden özel bir menü talep edin.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 text-xs font-mono font-bold uppercase tracking-wider text-slate-950 transition-colors hover:bg-amber-400"
                  >
                    Filtreleri Temizle
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        "Merhaba L'Étoile Noir, özel diyet gereksinimlerime uygun bir menü hazırlanmasını rica ediyorum.",
                      )
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-800 px-5 text-xs font-mono text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                  >
                    Şefe Özel Menü Sor
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredMenu.map((item) => {
                    const qty = cart[item.id] ?? 0;
                    return (
                      <motion.article
                        layout={!reduceMotion}
                        key={item.id}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3 }}
                        className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border bg-slate-950/80 backdrop-blur-xl transition-all duration-500 ${
                          qty > 0
                            ? 'border-amber-400/70 shadow-[0_0_35px_rgba(245,158,11,0.2)]'
                            : 'border-amber-500/20 hover:border-amber-500/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="relative h-56 overflow-hidden bg-slate-900 sm:h-60">
                            <SafeImage
                              accent="text-amber-500"
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="relative z-10 object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            />

                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                            <span className="absolute left-4 top-4 z-30 rounded-full border border-amber-500/40 bg-slate-950/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                              {item.badge}
                            </span>

                            {qty > 0 && (
                              <span className="absolute right-4 top-4 z-30 flex h-8 min-w-8 items-center justify-center rounded-full bg-amber-500 px-2 font-mono text-xs font-black text-slate-950">
                                {qty}
                                <span className="sr-only">porsiyon siparişte</span>
                              </span>
                            )}

                            {/* Görselin tamamı detay modalını açan gerçek bir buton. */}
                            <button
                              type="button"
                              onClick={() => openDish(item)}
                              className="absolute inset-0 z-30 flex items-end justify-start p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                            >
                              <span className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
                                Detayları Gör
                              </span>
                              <span className="sr-only">{item.name} detaylarını gör</span>
                            </button>

                            <span className="pointer-events-none absolute bottom-4 right-4 z-30 font-mono text-2xl font-black text-amber-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                              ₺{formatPrice(item.price)}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-3 p-5">
                            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-900 pb-3 font-mono text-[11px] text-slate-400">
                              <span className="flex min-w-0 items-center gap-1.5">
                                <Flame className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                                <span className="truncate">{item.calories}</span>
                              </span>
                              <span className="flex min-w-0 items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                                <span className="truncate">{item.prepTime}</span>
                              </span>
                            </div>

                            <h3 className="font-serif text-lg font-bold text-white transition-colors group-hover:text-amber-300">
                              {item.name}
                            </h3>

                            {item.diets.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {item.diets.map((diet) => (
                                  <DietBadge key={diet} diet={diet} />
                                ))}
                              </div>
                            )}

                            <p className="text-xs font-light leading-relaxed text-slate-400">{item.description}</p>
                          </div>
                        </div>

                        <div className="min-w-0 space-y-3 p-5 pt-0">
                          <div className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 font-mono text-[11px]">
                            <span className="flex min-w-0 shrink-0 items-center gap-1.5 text-slate-400">
                              <Wine className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" /> Sommelier
                            </span>
                            <span className="min-w-0 truncate text-right font-bold text-amber-300">
                              {item.winePairing}
                            </span>
                          </div>

                          <QuantityStepper
                            qty={qty}
                            itemName={item.name}
                            onAdd={() => addToCart(item.id)}
                            onRemove={() => removeFromCart(item.id)}
                          />

                          <button
                            type="button"
                            onClick={() => openDish(item)}
                            className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl font-mono text-[11px] text-slate-400 transition-colors hover:text-amber-300"
                          >
                            Alerjen & İçerik Detayı
                            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Masaüstü sipariş rayı */}
          <div className="hidden min-w-0 lg:block">
            <div className="sticky top-28">
              <OrderPanel
                idPrefix="desktop"
                lines={orderLines}
                subtotal={subtotal}
                service={service}
                total={total}
                orderSent={orderSent}
                orderCode={orderCode}
                seatingArea={seatingArea}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onDrop={dropFromCart}
                onSubmit={submitOrder}
                onReset={resetOrder}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- Tadım menüsü ------------------------------ */}
      <section
        id="tadim-menusu"
        className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:px-12 md:py-20"
      >
        <div className="overflow-hidden rounded-[32px] border border-amber-500/25 bg-[#05050a] p-5 backdrop-blur-3xl sm:p-8 md:p-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-amber-500/15 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <span className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
                <ChefHat className="h-4 w-4 shrink-0" aria-hidden="true" /> Degüstasyon
              </span>
              <h2 className="font-serif text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                Şefin Tadım Menüsü
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                Beş servisten oluşan, şef Léa Moreau imzalı degüstasyon yolculuğu. Servisler arasında sommelier eşleşmesi
                dahildir.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-amber-500/30 bg-black/60 px-5 py-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Kişi Başı</div>
              <div className="font-mono text-2xl font-black text-amber-400">₺{formatPrice(TASTING_MENU_PRICE)}</div>
            </div>
          </div>

          {/* Adım göstergesi */}
          <ol className="mb-6 flex items-center gap-2" aria-label="Servis adımları">
            {TASTING_COURSES.map((course, index) => (
              <li key={course.step} className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setCourseIndex(index)}
                  aria-current={index === courseIndex ? 'step' : undefined}
                  aria-label={`${course.step}. servis: ${course.name}`}
                  className={`flex min-h-10 w-full flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-2 transition-all ${
                    index === courseIndex
                      ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                      : index < courseIndex
                        ? 'border-amber-500/25 bg-amber-500/5 text-amber-400/70'
                        : 'border-slate-800 bg-black/40 text-slate-500 hover:border-amber-500/40'
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{course.step}</span>
                  <span className="hidden truncate text-[10px] uppercase tracking-wider sm:block">{course.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCourse.step}
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="relative h-56 min-w-0 overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-900 sm:h-72">
                <SafeImage
                  accent="text-amber-500"
                  src={activeCourse.image}
                  alt={`${activeCourse.name} servis görseli`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-amber-500/40 bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300 backdrop-blur-md">
                  {activeCourse.technique}
                </span>
              </div>

              <div className="flex min-w-0 flex-col justify-between gap-5">
                <div className="min-w-0 space-y-3" aria-live="polite">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400">
                    {activeCourse.step}. Servis · {activeCourse.title}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">{activeCourse.name}</h3>
                  <p className="text-sm font-light leading-relaxed text-slate-400">{activeCourse.description}</p>
                  <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-800 bg-black/50 p-3 font-mono text-[11px]">
                    <Wine className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                    <span className="shrink-0 text-slate-400">Eşleşme:</span>
                    <span className="min-w-0 truncate font-bold text-amber-300">{activeCourse.wine}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrevCourse}
                    disabled={courseIndex === 0}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl border border-slate-800 bg-black/50 px-4 font-mono text-xs text-slate-200 transition-colors hover:border-amber-500/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-200"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Önceki
                  </button>
                  <button
                    type="button"
                    onClick={goNextCourse}
                    disabled={courseIndex === TASTING_COURSES.length - 1}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl border border-amber-500/50 bg-amber-500/10 px-4 font-mono text-xs text-amber-200 transition-colors hover:bg-amber-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-amber-500/10 disabled:hover:text-amber-200"
                  >
                    Sonraki
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="font-mono text-[11px] text-slate-500">
                    {courseIndex + 1} / {TASTING_COURSES.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-xs leading-relaxed text-slate-400">
              Tadım menüsü tüm masa için aynı anda servis edilir. Alerjen bildiriminizi rezervasyon notuna ekleyin.
            </p>
            <div className="w-full shrink-0 sm:w-64">
              <QuantityStepper
                qty={cart[TASTING_MENU_ID] ?? 0}
                itemName="Şefin Tadım Menüsü"
                onAdd={() => addToCart(TASTING_MENU_ID)}
                onRemove={() => removeFromCart(TASTING_MENU_ID)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- Rezervasyon -------------------------------- */}
      <section
        id="rezervasyon"
        className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:px-12 md:py-20"
      >
        <div className="relative overflow-hidden rounded-[32px] border border-amber-500/30 bg-[#05050a] p-5 backdrop-blur-3xl sm:p-8 md:p-12">
          <div className="relative z-10 mx-auto max-w-4xl space-y-8">
            {/* Başlık */}
            <div className="flex flex-col items-start justify-between gap-4 border-b border-amber-500/20 pb-6 md:flex-row md:items-center">
              <div className="min-w-0 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-300 sm:text-[11px]">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                  <span>Anlık Masa Rezervasyonu</span>
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
                  VIP Masa Rezervasyonu
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-amber-500/30 bg-black/60 px-4 py-3 font-mono text-xs text-amber-300">
                <Clock className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Canlı Durum</div>
                  <div className="truncate font-bold">Masa Müsaitliği Aktif</div>
                </div>
              </div>
            </div>

            {isReserved ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 rounded-3xl border-2 border-emerald-500/60 bg-emerald-950/40 p-6 text-center font-mono text-emerald-300 sm:p-8"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-black text-white sm:text-2xl">Rezervasyon Talebiniz Alındı!</h3>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300">
                  <span className="font-bold text-amber-400">{selectedDay.longLabel}</span>,{' '}
                  <span className="font-bold text-amber-400">{seatingArea}</span> alanında{' '}
                  <span className="font-bold text-amber-400">{guestCount} konuk</span> için saat{' '}
                  <span className="font-bold text-amber-400">{activeTime}</span> oturum talebiniz iletilmiştir. Concierge
                  ekibimiz WhatsApp üzerinden doğrulama gönderecektir.
                </p>
                <button
                  type="button"
                  onClick={() => setIsReserved(false)}
                  className="min-h-11 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 text-xs font-bold uppercase tracking-wider text-emerald-200 transition-colors hover:bg-emerald-500 hover:text-slate-950"
                >
                  Yeni Rezervasyon
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleReservation} className="space-y-8">
                {/* 01 — Tarih */}
                <fieldset className="space-y-3">
                  <legend className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    01. Tarih Seçimi
                  </legend>
                  <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
                    {days.map((day, index) => {
                      const active = index === dayIndex;
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setDayIndex(index)}
                          aria-pressed={active}
                          aria-label={day.longLabel}
                          className={`flex min-h-[64px] w-[74px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border px-2 py-2 transition-all ${
                            active
                              ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                              : 'border-slate-800 bg-black/40 text-slate-400 hover:border-amber-500/40'
                          }`}
                        >
                          <span className="font-mono text-[10px] uppercase tracking-wider">{day.chipDay}</span>
                          <span className="mt-0.5 whitespace-nowrap font-mono text-xs font-bold text-white">
                            {day.chipDate}
                          </span>
                          {day.isWeekend && (
                            <span className="mt-0.5 font-mono text-[9px] uppercase text-amber-400/80">yoğun</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 02 — Oturum alanı */}
                <fieldset className="space-y-3">
                  <legend className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                    02. Oturum Alanı
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {SEATING_AREAS.map((area) => {
                      const active = seatingArea === area.name;
                      return (
                        <button
                          key={area.name}
                          type="button"
                          onClick={() => setSeatingArea(area.name)}
                          aria-pressed={active}
                          className={`relative min-w-0 rounded-2xl border p-4 pt-9 text-left transition-all sm:pt-10 ${
                            active
                              ? 'border-amber-400 bg-gradient-to-b from-amber-500/20 to-black/80'
                              : 'border-slate-800/80 bg-black/40 text-slate-400 hover:border-amber-500/40'
                          }`}
                        >
                          <span className="absolute right-3 top-3 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] text-amber-300">
                            {area.badge}
                          </span>
                          <Compass
                            className={`absolute left-4 top-3 h-5 w-5 ${active ? 'text-amber-400' : 'text-slate-500'}`}
                            aria-hidden="true"
                          />
                          <span className="block font-serif text-sm font-bold text-white">{area.name}</span>
                          <span className="mt-1 block text-[11px] font-light text-slate-400">{area.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 03 — Saat */}
                <fieldset className="space-y-3">
                  <legend className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    03. Oturum Saati
                  </legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {TIME_SLOTS.map((slot, index) => {
                      const status = slotStatus(dayIndex, index, areaIndex);
                      const full = status === 'dolu';
                      const active = activeSlotIndex === index;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={full}
                          onClick={() => setTimeSlot(slot.id)}
                          aria-pressed={active}
                          className={`min-w-0 rounded-2xl border p-3 text-left transition-all ${
                            full
                              ? 'cursor-not-allowed border-slate-900 bg-black/60 text-slate-600'
                              : active
                                ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                                : 'border-slate-800 bg-black/40 text-slate-300 hover:border-amber-500/40'
                          }`}
                        >
                          <span className="block font-mono text-base font-bold text-white">{slot.id}</span>
                          <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-wider text-slate-500">
                            {slot.note}
                          </span>
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                              status === 'dolu'
                                ? 'bg-rose-500/10 text-rose-300'
                                : status === 'son'
                                  ? 'bg-amber-500/15 text-amber-300'
                                  : 'bg-emerald-500/10 text-emerald-300'
                            }`}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 04 — Kişi sayısı */}
                <fieldset className="space-y-3">
                  <legend className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                    <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
                    04. Kişi Sayısı
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {GUEST_OPTIONS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setGuestCount(count)}
                        aria-pressed={guestCount === count}
                        aria-label={`${count} konuk`}
                        className={`min-h-11 min-w-[56px] rounded-2xl border px-4 font-mono text-sm font-bold transition-all ${
                          guestCount === count
                            ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                            : 'border-slate-800 bg-black/40 text-slate-300 hover:border-amber-500/40'
                        }`}
                      >
                        {count === 8 ? '8+' : count}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* 05 — İletişim */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="min-w-0 space-y-2">
                    <label
                      htmlFor="guest-name"
                      className="block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
                    >
                      05. Misafir Adı & Soyadı
                    </label>
                    <input
                      id="guest-name"
                      name="guest-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Örn: Ahmet Yılmaz"
                      className="min-h-12 w-full rounded-2xl border border-slate-800 bg-black/80 px-4 text-sm text-white transition-all placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <label
                      htmlFor="guest-phone"
                      className="block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
                    >
                      06. İletişim Hattı (WhatsApp)
                    </label>
                    <input
                      id="guest-phone"
                      name="guest-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+90 (555) 000 00 00"
                      className="min-h-12 w-full rounded-2xl border border-slate-800 bg-black/80 px-4 text-sm text-white transition-all placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="min-w-0 space-y-2">
                  <label
                    htmlFor="guest-note"
                    className="block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
                  >
                    07. Şefe Not (alerjen, özel kutlama)
                  </label>
                  <textarea
                    id="guest-note"
                    name="guest-note"
                    rows={2}
                    placeholder="Örn: Fıstık alerjisi var, yıl dönümü kutlaması."
                    className="w-full rounded-2xl border border-slate-800 bg-black/80 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Özet kartı */}
                <div className="space-y-4 rounded-3xl border border-amber-500/25 bg-black/60 p-5">
                  <h3 className="flex items-center gap-2 font-serif text-base font-bold text-white">
                    <Sparkles className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                    Rezervasyon Özeti
                  </h3>
                  <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: 'Tarih', value: selectedDay.longLabel },
                      { label: 'Saat', value: activeTime },
                      { label: 'Alan', value: seatingArea },
                      { label: 'Konuk', value: `${guestCount} kişi` },
                    ].map((row) => (
                      <div key={row.label} className="min-w-0 rounded-2xl border border-slate-800 bg-black/60 p-3">
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{row.label}</dt>
                        <dd className="mt-1 break-words text-xs font-semibold text-white">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {itemCount > 0 && (
                    <p className="rounded-2xl border border-slate-800 bg-black/50 p-3 font-mono text-[11px] text-slate-300">
                      Ön siparişinizdeki <span className="font-bold text-amber-300">{itemCount} kalem</span> (₺
                      {formatPrice(total)}) bu rezervasyona iliştirilecek.
                    </p>
                  )}

                  <p
                    className={`flex items-start gap-2 rounded-2xl border p-3 font-mono text-[11px] leading-relaxed ${
                      currentStatus === 'son'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    }`}
                    aria-live="polite"
                  >
                    {currentStatus === 'son' ? (
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span className="min-w-0">
                      {currentStatus === 'son'
                        ? `${selectedDay.longLabel} ${activeTime} için ${seatingArea} alanında son masa kaldı.`
                        : `${selectedDay.longLabel} ${activeTime} için ${seatingArea} alanı müsait görünüyor.`}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-950 transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]"
                  >
                    <span>Rezervasyonu Onayla</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        `Merhaba L'Étoile Noir Concierge, ${selectedDay.longLabel} ${activeTime} için ${seatingArea} alanında ${guestCount} kişilik masa ayırtmak istiyorum.`,
                      )
                    }
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-black/50 px-6 font-mono text-xs text-slate-200 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Concierge ile Görüş
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------ Mobil sepet ------------------------------ */}
      {showMobileBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
          <div
            id="mobil-siparis-paneli"
            hidden={!mobileCartOpen}
            className="max-h-[70vh] overflow-y-auto border-t border-amber-500/30 bg-[#03030a]/95 p-4 backdrop-blur-2xl"
          >
            <OrderPanel
              idPrefix="mobile"
              lines={orderLines}
              subtotal={subtotal}
              service={service}
              total={total}
              orderSent={orderSent}
              orderCode={orderCode}
              seatingArea={seatingArea}
              onAdd={addToCart}
              onRemove={removeFromCart}
              onDrop={dropFromCart}
              onSubmit={submitOrder}
              onReset={resetOrder}
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileCartOpen((open) => !open)}
            aria-expanded={mobileCartOpen}
            aria-controls="mobil-siparis-paneli"
            className="flex min-h-14 w-full items-center justify-between gap-3 border-t border-amber-500/40 bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-slate-950"
          >
            <span className="flex min-w-0 items-center gap-2">
              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate font-mono text-xs font-bold uppercase tracking-wider">
                {orderSent ? 'Sipariş masaya gönderildi' : `${itemCount} kalem · ₺${formatPrice(total)}`}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider">
              {mobileCartOpen ? 'Kapat' : 'Özeti Aç'}
              <ChevronUp
                className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
                  mobileCartOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      )}

      {/* Sabit WhatsApp — mobil sepet çubuğu açıkken yukarı kayar. */}
      <div className={`fixed right-4 z-30 md:right-6 ${showMobileBar ? 'bottom-20 lg:bottom-6' : 'bottom-6'}`}>
        <button
          type="button"
          onClick={() => openWhatsApp()}
          className="flex min-h-11 items-center gap-2.5 rounded-full bg-emerald-500 px-4 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 motion-safe:hover:scale-105"
        >
          <MessageCircle className="h-4 w-4 fill-slate-950" aria-hidden="true" />
          <span className="font-mono uppercase tracking-wider">VIP Concierge</span>
        </button>
      </div>

      {/* ---------------------------- Tabak detay modalı -------------------------- */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6 md:items-center"
          >
            {/* Arka plan gerçek bir buton: fare ile kapatma erişilebilir kalsın. */}
            <button
              type="button"
              onClick={closeDish}
              aria-label="Tabak detayını kapat"
              className="absolute inset-0 h-full w-full cursor-default bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dish-modal-title"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-amber-500/40 bg-[#05050a] shadow-2xl"
            >
              <div className="relative h-52 sm:h-64">
                <SafeImage
                  accent="text-amber-500"
                  src={selectedDish.image}
                  alt={`${selectedDish.name} görseli`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/40 to-transparent" />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeDish}
                  aria-label="Kapat"
                  className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-white transition-colors hover:bg-amber-500 hover:text-black"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="absolute inset-x-4 bottom-4 min-w-0">
                  <span className="inline-block rounded-full border border-amber-500/40 bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300 backdrop-blur-md">
                    {selectedDish.category} · {selectedDish.badge}
                  </span>
                  <h2 id="dish-modal-title" className="mt-2 font-serif text-xl font-bold text-white sm:text-2xl">
                    {selectedDish.name}
                  </h2>
                </div>
              </div>

              <div className="max-h-[60vh] space-y-5 overflow-y-auto p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-black text-amber-400">
                    ₺{formatPrice(selectedDish.price)}
                  </span>
                  <div className="flex min-w-0 flex-wrap gap-3 font-mono text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                      {selectedDish.calories}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                      {selectedDish.prepTime}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-light leading-relaxed text-slate-300">{selectedDish.description}</p>

                {selectedDish.diets.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDish.diets.map((diet) => (
                      <DietBadge key={diet} diet={diet} />
                    ))}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-slate-800 bg-black/50 p-4">
                    <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      İçindekiler
                    </h3>
                    <ul className="space-y-1.5">
                      {selectedDish.ingredients.map((ingredient) => (
                        <li key={ingredient} className="flex min-w-0 items-start gap-2 text-xs text-slate-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                          <span className="min-w-0">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="min-w-0 space-y-4">
                    <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4">
                      <h3 className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        Alerjen Bilgisi
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDish.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] text-rose-200"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
                      <h3 className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                        <Wine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        Sommelier Eşleşmesi
                      </h3>
                      <p className="text-xs font-semibold text-amber-200">{selectedDish.winePairing}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                        Kadeh servisi mevcuttur; şişe seçimi için sommelier ekibimiz masanızda size eşlik eder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <QuantityStepper
                      qty={cart[selectedDish.id] ?? 0}
                      itemName={selectedDish.name}
                      onAdd={() => addToCart(selectedDish.id)}
                      onRemove={() => removeFromCart(selectedDish.id)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={closeDish}
                    className="min-h-11 shrink-0 rounded-2xl border border-slate-800 px-5 font-mono text-xs text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                  >
                    Menüye Dön
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------- Footer -------------------------------- */}
      <footer className="relative z-10 border-t border-slate-900 px-4 py-10 sm:px-6 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 text-center sm:grid-cols-3 sm:text-left">
          <div className="min-w-0 space-y-1.5">
            <h2 className="font-serif text-base font-bold text-amber-300">L&apos;Étoile Noir</h2>
            <p className="font-mono text-[11px] leading-relaxed text-slate-500">
              Haute Gastronomie · Boğaz Hattı, İstanbul
            </p>
          </div>
          <div className="min-w-0 space-y-1.5 font-mono text-[11px] text-slate-500">
            <p className="font-bold uppercase tracking-wider text-slate-400">Servis Saatleri</p>
            <p>Salı – Cumartesi · 18:00 – 00:30</p>
            <p>Pazar & Pazartesi · Kapalı</p>
          </div>
          <div className="min-w-0 space-y-2">
            <button
              type="button"
              onClick={() => openWhatsApp()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-800 px-4 font-mono text-[11px] text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              Concierge Hattı
            </button>
            <p className="font-mono text-[10px] text-slate-600">© L&apos;Étoile Noir Haute Gastronomie</p>
          </div>
        </div>
      </footer>

      <DemoSwitcher currentId="gurme-restoran" />

      {/* Mobil sepet çubuğunun içeriği kapatmaması için alt boşluk. */}
      {showMobileBar && <div className="h-16 lg:hidden" aria-hidden="true" />}
    </main>
  );
}
