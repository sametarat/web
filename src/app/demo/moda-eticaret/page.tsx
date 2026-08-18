'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';
import { whatsAppLink } from '@/lib/site';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Layers,
  Lock,
  Maximize2,
  Minus,
  Package,
  PhoneCall,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  Trash2,
  Truck,
  X,
} from 'lucide-react';

/* ---------------------------------- Tipler --------------------------------- */

type CategoryName = 'Ceket & Palto' | 'Pantolon' | 'Gömlek' | 'Aksesuar';
type ColorFamily = 'Siyah' | 'Beyaz' | 'Gri' | 'Krem' | 'Lacivert' | 'Kahve';
type SortKey = 'yeni' | 'artan' | 'azalan';
type StepId = 'sepet' | 'kargo' | 'odeme' | 'onay';
type ShippingId = 'standart' | 'vip';

interface ProductColor {
  name: string;
  hex: string;
  /** Renk filtresinin gruplaması — "Mat Siyah" ve "Koyu Siyah" aynı aileye düşer. */
  family: ColorFamily;
}

interface Product {
  id: string;
  name: string;
  category: CategoryName;
  price: number;
  /** İlk görsel kart görseli; kalanlar detay galerisinde gösterilir. */
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  isNew?: boolean;
  fabric: string;
  description: string;
  fit: string;
  care: string[];
  origin: string;
  modelNote: string;
}

interface CartLine {
  /** Ürün + beden + renk + kombin bilgisini birleştiren kararlı anahtar. */
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  colorName: string;
  colorHex: string;
  qty: number;
  /** Kombin paketiyle eklenen kalemler %10 indirime dâhil. */
  bundle: boolean;
}

interface PlacedOrder {
  code: string;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  comboDiscount: number;
  shippingCost: number;
  total: number;
  shippingId: ShippingId;
  name: string;
  city: string;
  district: string;
  address: string;
  email: string;
  cardTail: string;
}

/* --------------------------------- Sabitler -------------------------------- */

const IMG = {
  ketenCeket: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  trenckot: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
  pantolon: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
  ipekGomlek: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
  canta: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  muslin: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
  palto: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80',
  kremPantolon: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
  sal: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',
  atolye: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
  detay1: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  detay2: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
} as const;

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Relaxed Fit Keten Ceket',
    category: 'Ceket & Palto',
    price: 3450,
    images: [IMG.ketenCeket, IMG.detay2, IMG.atolye],
    colors: [
      { name: 'Siyah', hex: '#000000', family: 'Siyah' },
      { name: 'Krem', hex: '#D4C5B9', family: 'Krem' },
      { name: 'Gece Mavisi', hex: '#1E293B', family: 'Lacivert' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    fabric: '%100 Organik Fransız Keteni',
    description:
      'Omuz hattı düşürülmüş, önden tek düğmeli kapamalı atölye ceketi. Yıkanmış keten dokusu ilk günden yumuşak bir düşüş verir, her yıkamada karakteri artar.',
    fit: 'Relaxed — normal bedeninizi öneririz',
    care: ['30°C hassas programda yıkayın', 'Ağartıcı kullanmayın', 'Ters yüz, orta ısıda ütüleyin', 'Kuru temizlemeye uygundur'],
    origin: 'İstanbul atölyemizde el işçiliğiyle dikildi',
    modelNote: 'Manken 178 cm boyunda ve M beden giymektedir.',
  },
  {
    id: '2',
    name: 'Oversize Siyah Trençkot',
    category: 'Ceket & Palto',
    price: 5200,
    images: [IMG.trenckot, IMG.atolye, IMG.detay1],
    colors: [
      { name: 'Mat Siyah', hex: '#000000', family: 'Siyah' },
      { name: 'Füme', hex: '#4A5568', family: 'Gri' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    fabric: 'Su İtici Gabardin Twill',
    description:
      'Klasik trençkotun heykelsi yorumu: geniş yaka, çift sıra düğme ve bele oturan geniş kemer. Su itici bitişi sayesinde şehir yağmurunda formunu korur.',
    fit: 'Oversize — dar kalıp isteyenler bir beden küçük almalı',
    care: ['Yalnızca kuru temizleme', 'Askıda, nem almayan bir dolapta saklayın', 'Kemeri katlamadan asın'],
    origin: 'Bursa dokuma, İstanbul dikim',
    modelNote: 'Manken 180 cm boyunda ve L beden giymektedir.',
  },
  {
    id: '3',
    name: 'Minimalist Dökümlü Pantolon',
    category: 'Pantolon',
    price: 2100,
    images: [IMG.pantolon, IMG.kremPantolon, IMG.detay1],
    colors: [
      { name: 'Koyu Siyah', hex: '#000000', family: 'Siyah' },
      { name: 'Açık Gri', hex: '#E2E8F0', family: 'Gri' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Yün & Viskon Karışımı',
    description:
      'Yüksek bel, gizli kancalı kapama ve dökümlü paça. Ütü izi presle sabitlendiği için gün boyu keskin bir çizgi verir.',
    fit: 'Straight — belde oturur, bacakta serbest',
    care: ['Kuru temizleme önerilir', 'Düşük ısıda buharla ütüleyin', 'Kurutma makinesine vermeyin'],
    origin: 'İzmir örme, İstanbul dikim',
    modelNote: 'Manken 175 cm boyunda ve S beden giymektedir.',
  },
  {
    id: '4',
    name: 'Saf İpek Düz Gömlek',
    category: 'Gömlek',
    price: 2850,
    images: [IMG.ipekGomlek, IMG.detay1, IMG.muslin],
    colors: [
      { name: 'Optik Beyaz', hex: '#FFFFFF', family: 'Beyaz' },
      { name: 'Siyah', hex: '#000000', family: 'Siyah' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: '%100 Dut İpeği (19 momme)',
    description:
      'Klasik yaka, sedef düğme ve yumuşak omuz. 19 momme ipek ağırlığı sayesinde tenin üzerinde durmadan akar, altına giyilen parçayı belli etmez.',
    fit: 'Regular — bedeninize göre alın',
    care: ['Elde 30°C soğuk suda yıkayın', 'Sıkmadan, gölgede kurutun', 'Düşük ısıda ters ütüleyin', 'Parfümü kumaşa doğrudan sıkmayın'],
    origin: 'Bursa ipeği, İstanbul dikim',
    modelNote: 'Manken 176 cm boyunda ve S beden giymektedir.',
  },
  {
    id: '5',
    name: 'Deri Minimalist Omuz Çantası',
    category: 'Aksesuar',
    price: 4100,
    images: [IMG.canta, IMG.detay1, IMG.atolye],
    colors: [
      { name: 'Siyah', hex: '#000000', family: 'Siyah' },
      { name: 'Taba', hex: '#78350F', family: 'Kahve' },
    ],
    sizes: ['Standart'],
    isNew: true,
    fabric: 'Bitkisel Tabaklanmış Dana Derisi',
    description:
      'Tek parça deriden kesilmiş, dikişi minimuma indirilmiş omuz çantası. İç astarı süet, içinde iki kart ve bir telefon bölmesi bulunur.',
    fit: '28 × 18 × 8 cm — A5 defter sığar',
    care: ['Nemli bezle silin', 'Ayda bir deri bakım kremi uygulayın', 'Doğrudan güneşte bırakmayın'],
    origin: 'Bitkisel tabaklama, İstanbul saraciye atölyesi',
    modelNote: 'Askı boyu ayarlanabilir: 52–68 cm.',
  },
  {
    id: '6',
    name: 'Müslin Relaxed Gömlek',
    category: 'Gömlek',
    price: 1850,
    images: [IMG.muslin, IMG.detay2, IMG.ipekGomlek],
    colors: [
      { name: 'Kömür', hex: '#111827', family: 'Siyah' },
      { name: 'Taş Gri', hex: '#D1D5DB', family: 'Gri' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '%100 Çift Kat Pamuk Müslin',
    description:
      'Çift kat dokunmuş müslin, hava geçirgenliğini korurken hafif bir hacim verir. Yakası dikişsiz, kol ağzı katlanabilir.',
    fit: 'Relaxed — hacimli duruş',
    care: ['40°C pamuklu programda yıkayın', 'Buruşuk dokusu kumaşın karakteridir', 'Düşük ısıda ütüleyin'],
    origin: 'Denizli dokuma, İstanbul dikim',
    modelNote: 'Manken 181 cm boyunda ve M beden giymektedir.',
  },
  {
    id: '7',
    name: 'Yün Karışımlı Uzun Palto',
    category: 'Ceket & Palto',
    price: 6400,
    images: [IMG.palto, IMG.detay2, IMG.trenckot],
    colors: [
      { name: 'Antrasit', hex: '#374151', family: 'Gri' },
      { name: 'Gece Lacivert', hex: '#1E293B', family: 'Lacivert' },
      { name: 'Kum Beji', hex: '#D6C7B0', family: 'Krem' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    fabric: '%70 Bakir Yün, %30 Kaşmir',
    description:
      'Diz altı boyda, tek düğmeli ve arkadan yırtmaçlı palto. Kaşmir oranı sayesinde ağırlığı düşük, tutuşu yumuşaktır.',
    fit: 'Oversize — kalın triko üzerine rahat oturur',
    care: ['Yalnızca kuru temizleme', 'Yün fırçasıyla tüylenmeyi alın', 'Geniş omuzlu askıda saklayın'],
    origin: 'İtalyan kumaş, İstanbul dikim',
    modelNote: 'Manken 182 cm boyunda ve L beden giymektedir.',
  },
  {
    id: '8',
    name: 'Yüksek Bel Krem Pantolon',
    category: 'Pantolon',
    price: 2450,
    images: [IMG.kremPantolon, IMG.pantolon, IMG.detay1],
    colors: [
      { name: 'Krem', hex: '#E8DCC8', family: 'Krem' },
      { name: 'Optik Beyaz', hex: '#FFFFFF', family: 'Beyaz' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Kalın Gramajlı Pamuk Gabardin',
    description:
      'Pileli ön, yüksek bel ve geniş paça. Gramajı yüksek gabardin, açık renkte bile şeffaflaşmaz.',
    fit: 'Wide leg — beli dar, paçası geniş',
    care: ['30°C renkliler programında yıkayın', 'Benzer renklerle yıkayın', 'Orta ısıda ütüleyin'],
    origin: 'Denizli dokuma, İstanbul dikim',
    modelNote: 'Manken 174 cm boyunda ve S beden giymektedir.',
  },
  {
    id: '9',
    name: 'El Dokuma Kaşmir Şal',
    category: 'Aksesuar',
    price: 1650,
    images: [IMG.sal, IMG.detay2, IMG.atolye],
    colors: [
      { name: 'Kömür', hex: '#111827', family: 'Siyah' },
      { name: 'Sis Grisi', hex: '#9CA3AF', family: 'Gri' },
      { name: 'Kum Beji', hex: '#D6C7B0', family: 'Krem' },
    ],
    sizes: ['Standart'],
    fabric: '%100 İç Moğolistan Kaşmiri',
    description:
      'El tezgâhında dokunmuş, kenarları elde püsküllenmiş şal. 200 × 70 cm ölçüsüyle omuzda pelerin gibi de kullanılabilir.',
    fit: '200 × 70 cm',
    care: ['Elde soğuk suda, kaşmir şampuanıyla yıkayın', 'Havlu arasında düz kurutun', 'Katlayarak saklayın'],
    origin: 'El dokuma, Türkiye',
    modelNote: 'Ağırlık: 240 gram.',
  },
];

const CATEGORIES = ['Tümü', 'Yeni Gelenler', 'Ceket & Palto', 'Pantolon', 'Gömlek', 'Aksesuar'] as const;

const PRICE_RANGES: { id: string; label: string; min: number; max: number }[] = [
  { id: 'all', label: 'Tüm Fiyatlar', min: 0, max: Number.MAX_SAFE_INTEGER },
  { id: 'r1', label: '₺2.500 altı', min: 0, max: 2499 },
  { id: 'r2', label: '₺2.500 – ₺4.000', min: 2500, max: 4000 },
  { id: 'r3', label: '₺4.000 üzeri', min: 4001, max: Number.MAX_SAFE_INTEGER },
];

const COLOR_FAMILIES: { id: ColorFamily; hex: string }[] = [
  { id: 'Siyah', hex: '#000000' },
  { id: 'Beyaz', hex: '#FFFFFF' },
  { id: 'Gri', hex: '#9CA3AF' },
  { id: 'Krem', hex: '#D6C7B0' },
  { id: 'Lacivert', hex: '#1E293B' },
  { id: 'Kahve', hex: '#78350F' },
];

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'Standart'];

const ALL_SIZES = SIZE_ORDER.filter((size) => PRODUCTS.some((product) => product.sizes.includes(size)));

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'yeni', label: 'Yeni Gelenler' },
  { id: 'artan', label: 'Fiyat: Artan' },
  { id: 'azalan', label: 'Fiyat: Azalan' },
];

const SIZE_GUIDE: { size: string; gogus: string; bel: string; kalca: string; kol: string }[] = [
  { size: 'XS', gogus: '82 – 86', bel: '62 – 66', kalca: '88 – 92', kol: '58' },
  { size: 'S', gogus: '86 – 90', bel: '66 – 70', kalca: '92 – 96', kol: '59' },
  { size: 'M', gogus: '90 – 96', bel: '70 – 76', kalca: '96 – 101', kol: '60' },
  { size: 'L', gogus: '96 – 102', bel: '76 – 82', kalca: '101 – 106', kol: '61' },
  { size: 'XL', gogus: '102 – 110', bel: '82 – 90', kalca: '106 – 113', kol: '62' },
];

const SHIPPING_OPTIONS: { id: ShippingId; label: string; note: string; eta: string; price: number }[] = [
  {
    id: 'standart',
    label: 'Standart Atölye Kargosu',
    note: '₺5.000 ve üzeri siparişlerde ücretsiz',
    eta: '2 – 4 iş günü içinde teslim',
    price: 89,
  },
  {
    id: 'vip',
    label: 'Aynı Gün VIP Kurye',
    note: 'İstanbul içi, 14:00’a kadar verilen siparişlerde',
    eta: 'Aynı gün 18:00 – 22:00 arası teslim',
    price: 249,
  },
];

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Muğla', 'Adana', 'Konya', 'Eskişehir', 'Trabzon'];

const STEPS: { id: StepId; label: string }[] = [
  { id: 'sepet', label: 'Sepet' },
  { id: 'kargo', label: 'Kargo' },
  { id: 'odeme', label: 'Ödeme' },
  { id: 'onay', label: 'Onay' },
];

const FREE_SHIPPING_LIMIT = 5000;
const COMBO_DISCOUNT_RATE = 0.1;

/* -------------------------------- Yardımcılar ------------------------------- */

/** Intl'e bağlı kalmadan binlik ayırıcı: sunucu/istemci farkı riski yok. */
function formatPrice(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** FNV-1a türevi kararlı string hash — rastgelelik yok, hydration güvenli. */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Beden stokları tamamen ürün id'si + beden adından türetilir.
 * Bir ürünün tüm bedenleri tükenmişse ilk beden zorla stoklu yapılır;
 * böylece hiçbir ürün satın alınamaz hâle düşmez.
 */
function stockMapFor(product: Product): Record<string, number> {
  const map: Record<string, number> = {};
  product.sizes.forEach((size) => {
    const hash = hashString(`${product.id}::${size}`);
    const bucket = hash % 10;
    if (bucket < 2) map[size] = 0;
    else if (bucket < 4) map[size] = 1 + (hash % 2);
    else map[size] = 4 + (hash % 7);
  });
  if (product.sizes.every((size) => map[size] === 0)) {
    map[product.sizes[0]] = 3;
  }
  return map;
}

const STOCKS: Record<string, Record<string, number>> = Object.fromEntries(
  PRODUCTS.map((product) => [product.id, stockMapFor(product)]),
);

function stockOf(productId: string, size: string): number {
  return STOCKS[productId]?.[size] ?? 0;
}

function firstAvailableSize(product: Product): string {
  return product.sizes.find((size) => stockOf(product.id, size) > 0) ?? product.sizes[0];
}

/** Sipariş kodu sepet içeriğinden türetilir: aynı sepet → aynı kod. */
function orderCodeFor(lines: CartLine[], total: number): string {
  const seed = `${lines
    .map((line) => `${line.key}x${line.qty}`)
    .sort()
    .join('|')}#${total}`;
  return `MODA-${(100000 + (hashString(seed) % 900000)).toString()}`;
}

function lineKey(productId: string, size: string, colorName: string, bundle: boolean): string {
  return `${productId}|${size}|${colorName}|${bundle ? 'kombin' : 'tekil'}`;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diyalog davranışı: açılışta odak içeri alınır, Tab döngüsü hapsedilir,
 * Escape kapatır, kapanışta odak tetikleyen öğeye döner.
 */
function useDialogBehaviour(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusInside = () => {
      const node = containerRef.current;
      if (!node) return;
      const preferred = node.querySelector<HTMLElement>('[data-autofocus]');
      const target = preferred ?? node.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      target?.focus();
    };

    const raf = window.requestAnimationFrame(focusInside);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const node = containerRef.current;
      if (!node) return;
      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
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
      window.cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  return containerRef;
}

/* ------------------------------ Alt bileşenler ------------------------------ */

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="font-mono text-[10px] uppercase tracking-wider text-rose-300">Tükendi</span>;
  }
  if (stock <= 2) {
    return <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Son {stock} adet</span>;
  }
  return <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">Stokta</span>;
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  className = '',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  maxLength?: number;
  className?: string;
}) {
  return (
    <div className={`min-w-0 space-y-1.5 ${className}`}>
      <label htmlFor={id} className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 w-full rounded-xl border bg-black/70 px-3.5 text-sm text-white transition-colors placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
          error ? 'border-rose-500/70' : 'border-neutral-800 focus:border-amber-400'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="font-mono text-[11px] leading-relaxed text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckoutSteps({ current }: { current: StepId }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  return (
    <ol className="flex items-center gap-1.5" aria-label="Sipariş adımları">
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1.5">
            <span
              aria-current={active ? 'step' : undefined}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-1.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                active
                  ? 'border-amber-400 bg-amber-400 font-bold text-black'
                  : done
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-500'
              }`}
            >
              {done ? (
                <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
              ) : (
                <span className="shrink-0 tabular-nums">{index + 1}</span>
              )}
              <span className="min-w-0 truncate">{step.label}</span>
              {done && <span className="sr-only">tamamlandı</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function CartLineRow({
  line,
  onIncrease,
  onDecrease,
  onRemove,
  compact = false,
}: {
  line: CartLine;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  return (
    <li className="flex min-w-0 gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3">
      <SafeImage
        accent="text-amber-400"
        src={line.image}
        alt={line.name}
        width={64}
        height={80}
        className="h-20 w-16 shrink-0 rounded-xl bg-neutral-900 object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <h4 className="min-w-0 font-serif text-xs font-bold leading-snug text-white">{line.name}</h4>
            <span className="shrink-0 font-mono text-xs font-bold text-amber-400">
              ₺{formatPrice(line.price * line.qty)}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-neutral-400">
            <span>Beden: {line.size}</span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full border border-neutral-600"
                style={{ backgroundColor: line.colorHex }}
                aria-hidden="true"
              />
              {line.colorName}
            </span>
            {line.bundle && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-amber-300">
                Kombin
              </span>
            )}
          </p>
        </div>

        {!compact && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-black/60 p-0.5">
              <button
                type="button"
                onClick={onDecrease}
                aria-label={`${line.name} adedini azalt`}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="min-w-[1.5rem] text-center font-mono text-xs font-bold tabular-nums text-white">
                {line.qty}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                aria-label={`${line.name} adedini artır`}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`${line.name} ürününü sepetten çıkar`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 text-neutral-500 transition-colors hover:border-rose-500/50 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function SummaryRows({
  subtotal,
  comboDiscount,
  shippingCost,
  total,
  showShipping,
}: {
  subtotal: number;
  comboDiscount: number;
  shippingCost: number;
  total: number;
  showShipping: boolean;
}) {
  return (
    <dl className="space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between gap-3">
        <dt className="min-w-0 truncate text-neutral-400">Ara Toplam</dt>
        <dd className="shrink-0 text-neutral-100">₺{formatPrice(subtotal)}</dd>
      </div>
      {comboDiscount > 0 && (
        <div className="flex items-center justify-between gap-3">
          <dt className="min-w-0 truncate text-emerald-300">Kombin İndirimi (%10)</dt>
          <dd className="shrink-0 text-emerald-300">−₺{formatPrice(comboDiscount)}</dd>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <dt className="min-w-0 truncate text-neutral-400">Kargo</dt>
        <dd className="shrink-0 text-neutral-100">
          {!showShipping ? 'Kargo adımında' : shippingCost === 0 ? 'Ücretsiz' : `₺${formatPrice(shippingCost)}`}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-2 text-sm">
        <dt className="min-w-0 truncate font-bold text-white">Genel Toplam</dt>
        <dd className="shrink-0 font-bold text-amber-400">₺{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

/* ------------------------------- Ana bileşen -------------------------------- */

export default function AvantGardeFashionPage() {
  const reduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();

  /* --------------------------------- Filtreler ------------------------------ */
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [priceRangeId, setPriceRangeId] = useState<string>('all');
  const [activeColors, setActiveColors] = useState<ColorFamily[]>([]);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('yeni');
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ----------------------------- Sepet & favoriler -------------------------- */
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  /* -------------------------------- Ürün detayı ----------------------------- */
  const [detailId, setDetailId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [detailSize, setDetailSize] = useState('');
  const [detailColor, setDetailColor] = useState('');
  const [detailError, setDetailError] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  /* ---------------------------------- Checkout ------------------------------ */
  const [step, setStep] = useState<StepId>('sepet');
  const [shippingId, setShippingId] = useState<ShippingId>('standart');
  const [shippingForm, setShippingForm] = useState({
    ad: '',
    telefon: '',
    eposta: '',
    il: '',
    ilce: '',
    adres: '',
    not: '',
  });
  const [paymentForm, setPaymentForm] = useState({ kartAd: '', kartNo: '', sonKullanma: '', cvv: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  /* --------------------------------- Kombin --------------------------------- */
  const [comboTop, setComboTop] = useState('1');
  const [comboBottom, setComboBottom] = useState('3');
  const [comboAccessory, setComboAccessory] = useState('5');

  const detailProduct = useMemo(() => PRODUCTS.find((product) => product.id === detailId) ?? null, [detailId]);

  /* ------------------------------- Kapatıcılar ------------------------------ */
  const closeDetail = useCallback(() => setDetailId(null), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeFav = useCallback(() => setFavOpen(false), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const detailRef = useDialogBehaviour(detailProduct !== null, closeDetail);
  const cartRef = useDialogBehaviour(cartOpen, closeCart);
  const favRef = useDialogBehaviour(favOpen, closeFav);
  const lightboxRef = useDialogBehaviour(lightbox !== null, closeLightbox);

  const anyOverlayOpen = detailProduct !== null || cartOpen || favOpen || lightbox !== null;

  // Katman açıkken arka planın kaymaması için tek noktadan gövde kilidi.
  useEffect(() => {
    if (!anyOverlayOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [anyOverlayOpen]);

  // Galeri ok tuşlarıyla gezinir (form alanlarındayken devre dışı).
  useEffect(() => {
    if (!detailProduct) return;
    const total = detailProduct.images.length;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setGalleryIndex((index) => (index + 1) % total);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setGalleryIndex((index) => (index - 1 + total) % total);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [detailProduct]);

  /* ------------------------------ Filtre mantığı ---------------------------- */

  const visibleProducts = useMemo(() => {
    const range = PRICE_RANGES.find((item) => item.id === priceRangeId) ?? PRICE_RANGES[0];
    const filtered = PRODUCTS.filter((product) => {
      const matchCategory =
        selectedCategory === 'Tümü' ||
        (selectedCategory === 'Yeni Gelenler' ? Boolean(product.isNew) : product.category === selectedCategory);
      const matchPrice = product.price >= range.min && product.price <= range.max;
      const matchColor =
        activeColors.length === 0 || product.colors.some((color) => activeColors.includes(color.family));
      const matchSize =
        activeSizes.length === 0 ||
        product.sizes.some((size) => activeSizes.includes(size) && stockOf(product.id, size) > 0);
      return matchCategory && matchPrice && matchColor && matchSize;
    });

    const sorted = [...filtered];
    if (sortBy === 'artan') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'azalan') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || Number(a.id) - Number(b.id));
    return sorted;
  }, [selectedCategory, priceRangeId, activeColors, activeSizes, sortBy]);

  const isFiltered =
    selectedCategory !== 'Tümü' || priceRangeId !== 'all' || activeColors.length > 0 || activeSizes.length > 0;

  const activeFilterCount =
    (selectedCategory !== 'Tümü' ? 1 : 0) +
    (priceRangeId !== 'all' ? 1 : 0) +
    activeColors.length +
    activeSizes.length;

  const handleCategoryChange = useCallback((category: string) => {
    startTransition(() => setSelectedCategory(category));
  }, []);

  const toggleColor = useCallback((family: ColorFamily) => {
    startTransition(() =>
      setActiveColors((prev) => (prev.includes(family) ? prev.filter((item) => item !== family) : [...prev, family])),
    );
  }, []);

  const toggleSize = useCallback((size: string) => {
    startTransition(() =>
      setActiveSizes((prev) => (prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size])),
    );
  }, []);

  const resetFilters = useCallback(() => {
    startTransition(() => {
      setSelectedCategory('Tümü');
      setPriceRangeId('all');
      setActiveColors([]);
      setActiveSizes([]);
      setSortBy('yeni');
    });
  }, []);

  /* --------------------------------- Sepet ---------------------------------- */

  const addLines = useCallback((newLines: Omit<CartLine, 'key'>[]) => {
    setCart((prev) => {
      const next = [...prev];
      newLines.forEach((incoming) => {
        const key = lineKey(incoming.productId, incoming.size, incoming.colorName, incoming.bundle);
        const existing = next.findIndex((line) => line.key === key);
        if (existing > -1) {
          next[existing] = { ...next[existing], qty: next[existing].qty + incoming.qty };
        } else {
          next.push({ ...incoming, key });
        }
      });
      return next;
    });
    setPlacedOrder(null);
    setStep('sepet');
  }, []);

  const increaseLine = useCallback((key: string) => {
    setCart((prev) => prev.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line)));
  }, []);

  const decreaseLine = useCallback((key: string) => {
    setCart((prev) =>
      prev.flatMap((line) => {
        if (line.key !== key) return [line];
        return line.qty <= 1 ? [] : [{ ...line, qty: line.qty - 1 }];
      }),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setCart((prev) => prev.filter((line) => line.key !== key));
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, line) => sum + line.price * line.qty, 0), [cart]);
  const bundleBase = useMemo(
    () => cart.filter((line) => line.bundle).reduce((sum, line) => sum + line.price * line.qty, 0),
    [cart],
  );
  const comboDiscount = Math.round(bundleBase * COMBO_DISCOUNT_RATE);
  const shippingOption = SHIPPING_OPTIONS.find((option) => option.id === shippingId) ?? SHIPPING_OPTIONS[0];
  const shippingCost =
    shippingId === 'vip' ? shippingOption.price : subtotal - comboDiscount >= FREE_SHIPPING_LIMIT ? 0 : shippingOption.price;
  const total = subtotal - comboDiscount + shippingCost;

  /* -------------------------------- Favoriler ------------------------------- */

  const toggleFavorite = useCallback((productId: string, productName: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      setStatusMessage(exists ? `${productName} favorilerden çıkarıldı.` : `${productName} favorilere eklendi.`);
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  }, []);

  const favoriteProducts = useMemo(
    () => favorites.map((id) => PRODUCTS.find((product) => product.id === id)).filter((p): p is Product => Boolean(p)),
    [favorites],
  );

  const moveFavoriteToCart = useCallback(
    (product: Product) => {
      const size = firstAvailableSize(product);
      const color = product.colors[0];
      addLines([
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          colorName: color.name,
          colorHex: color.hex,
          qty: 1,
          bundle: false,
        },
      ]);
      setFavorites((prev) => prev.filter((id) => id !== product.id));
      setStatusMessage(`${product.name} (${size}) sepete taşındı.`);
      setFavOpen(false);
      setCartOpen(true);
    },
    [addLines],
  );

  /* ------------------------------- Ürün detayı ------------------------------ */

  const openDetail = useCallback((product: Product) => {
    setDetailId(product.id);
    setGalleryIndex(0);
    setDetailSize('');
    setDetailColor('');
    setDetailError('');
    setSizeGuideOpen(false);
  }, []);

  const addDetailToCart = useCallback(() => {
    if (!detailProduct) return;
    if (!detailSize && !detailColor) {
      setDetailError('Devam etmek için beden ve renk seçmelisiniz.');
      return;
    }
    if (!detailColor) {
      setDetailError('Lütfen bir renk seçin.');
      return;
    }
    if (!detailSize) {
      setDetailError('Lütfen bir beden seçin.');
      return;
    }
    const color = detailProduct.colors.find((item) => item.name === detailColor);
    if (!color) return;

    addLines([
      {
        productId: detailProduct.id,
        name: detailProduct.name,
        price: detailProduct.price,
        image: detailProduct.images[0],
        size: detailSize,
        colorName: color.name,
        colorHex: color.hex,
        qty: 1,
        bundle: false,
      },
    ]);
    setStatusMessage(`${detailProduct.name} (${detailSize} / ${color.name}) sepete eklendi.`);
    setDetailError('');
    setDetailId(null);
    setCartOpen(true);
  }, [detailProduct, detailSize, detailColor, addLines]);

  /* --------------------------------- Kombin --------------------------------- */

  const comboTops = useMemo(
    () => PRODUCTS.filter((product) => product.category === 'Gömlek' || product.category === 'Ceket & Palto'),
    [],
  );
  const comboBottoms = useMemo(() => PRODUCTS.filter((product) => product.category === 'Pantolon'), []);
  const comboAccessories = useMemo(() => PRODUCTS.filter((product) => product.category === 'Aksesuar'), []);

  const comboSelection = useMemo(() => {
    const ids = [comboTop, comboBottom, comboAccessory];
    return ids
      .map((id) => PRODUCTS.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product));
  }, [comboTop, comboBottom, comboAccessory]);

  const comboSubtotal = comboSelection.reduce((sum, product) => sum + product.price, 0);
  const comboSaving = Math.round(comboSubtotal * COMBO_DISCOUNT_RATE);

  const addComboToCart = useCallback(() => {
    if (comboSelection.length < 3) return;
    addLines(
      comboSelection.map((product) => {
        const size = firstAvailableSize(product);
        const color = product.colors[0];
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          colorName: color.name,
          colorHex: color.hex,
          qty: 1,
          bundle: true,
        };
      }),
    );
    setStatusMessage('Kombin sepete eklendi, %10 kombin indirimi uygulandı.');
    setCartOpen(true);
  }, [comboSelection, addLines]);

  /* -------------------------------- Checkout -------------------------------- */

  const openCart = useCallback(() => {
    setCartOpen(true);
  }, []);

  const focusFirstError = useCallback((fieldErrors: Record<string, string>) => {
    const firstKey = Object.keys(fieldErrors)[0];
    if (!firstKey) return;
    window.requestAnimationFrame(() => {
      document.getElementById(`co-${firstKey}`)?.focus();
    });
  }, []);

  const goToShipping = useCallback(() => {
    if (cart.length === 0) return;
    setErrors({});
    setStep('kargo');
  }, [cart.length]);

  const goToPayment = useCallback(() => {
    const next: Record<string, string> = {};
    if (shippingForm.ad.trim().length < 3) next.ad = 'Ad ve soyadınızı girin (en az 3 karakter).';
    const digits = shippingForm.telefon.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) next.telefon = 'Telefonu 10 hane olarak girin. Örn: 555 000 00 00';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(shippingForm.eposta.trim()))
      next.eposta = 'Geçerli bir e-posta adresi girin.';
    if (!shippingForm.il) next.il = 'Teslimat şehrini seçin.';
    if (shippingForm.ilce.trim().length < 2) next.ilce = 'İlçe bilgisini girin.';
    if (shippingForm.adres.trim().length < 10) next.adres = 'Açık adresinizi girin (en az 10 karakter).';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirstError(next);
      return;
    }
    setStep('odeme');
  }, [shippingForm, focusFirstError]);

  const confirmOrder = useCallback(() => {
    const next: Record<string, string> = {};
    if (paymentForm.kartAd.trim().length < 3) next.kartAd = 'Kart üzerindeki ismi girin.';
    const cardDigits = paymentForm.kartNo.replace(/\D/g, '');
    if (cardDigits.length !== 16) next.kartNo = 'Kart numarası 16 haneli olmalıdır.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.sonKullanma))
      next.sonKullanma = 'Son kullanma tarihini AA/YY biçiminde girin.';
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) next.cvv = 'CVV 3 veya 4 haneli olmalıdır.';
    if (!termsAccepted) next.sozlesme = 'Mesafeli satış sözleşmesini onaylamanız gerekiyor.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirstError(next);
      return;
    }

    const order: PlacedOrder = {
      code: orderCodeFor(cart, total),
      lines: cart,
      itemCount: cartCount,
      subtotal,
      comboDiscount,
      shippingCost,
      total,
      shippingId,
      name: shippingForm.ad.trim(),
      city: shippingForm.il,
      district: shippingForm.ilce.trim(),
      address: shippingForm.adres.trim(),
      email: shippingForm.eposta.trim(),
      cardTail: cardDigits.slice(-4),
    };

    setPlacedOrder(order);
    setCart([]);
    setStep('onay');
    setStatusMessage(`Siparişiniz alındı. Sipariş kodu ${order.code}.`);
  }, [
    paymentForm,
    termsAccepted,
    focusFirstError,
    cart,
    cartCount,
    subtotal,
    comboDiscount,
    shippingCost,
    total,
    shippingId,
    shippingForm,
  ]);

  const startNewOrder = useCallback(() => {
    setPlacedOrder(null);
    setStep('sepet');
    setErrors({});
    setPaymentForm({ kartAd: '', kartNo: '', sonKullanma: '', cvv: '' });
    setTermsAccepted(false);
    setCartOpen(false);
  }, []);

  const openWhatsAppStyleConsultant = useCallback((message?: string) => {
    const text =
      message ??
      'Merhaba M O D A Atelier, stil danışmanlığı hattı üzerinden özel sipariş ve koleksiyon tavsiyesi almak istiyorum.';
    window.open(whatsAppLink(text), '_blank', 'noopener,noreferrer');
  }, []);

  const detailStock = detailProduct && detailSize ? stockOf(detailProduct.id, detailSize) : null;

  /* ---------------------------------- Render -------------------------------- */

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#030305] font-sans text-neutral-100 selection:bg-amber-400 selection:text-black">
      {/* Arka plan ışıkları */}
      <div className="pointer-events-none fixed left-1/2 top-[-10%] z-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-neutral-700/10 via-neutral-900/5 to-transparent blur-[180px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-0 z-0 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[180px]" />

      {/* Ekran okuyucu bildirimleri */}
      <p role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </p>

      {/* --------------------------------- Header -------------------------------- */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-neutral-800/80 bg-[#030305]/85 px-3 py-3 backdrop-blur-2xl sm:px-6 md:px-12">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 font-mono text-xs text-neutral-300 transition-all hover:border-amber-500/40 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sr-only sm:hidden">Ana Sayfaya Dön</span>
          </Link>

          <span className="hidden h-4 w-px bg-neutral-800 sm:inline-block" />

          <a
            href="#products"
            className="min-w-0 truncate font-serif text-base font-black uppercase tracking-[0.28em] text-white sm:text-xl"
          >
            M O D A
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => openWhatsAppStyleConsultant()}
            className="hidden min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all hover:from-amber-400 hover:to-amber-500 lg:inline-flex"
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Stil Danışmanı</span>
          </button>

          <button
            type="button"
            onClick={() => setFavOpen(true)}
            aria-label={`Favorilerim, ${favorites.length} ürün`}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 transition-colors hover:border-amber-500/40 hover:text-white"
          >
            <Heart className={`h-4 w-4 ${favorites.length > 0 ? 'fill-amber-400 text-amber-400' : ''}`} aria-hidden="true" />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 font-mono text-[10px] font-bold tabular-nums text-black">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Sepetim, ${cartCount} ürün`}
            className="relative flex min-h-11 items-center gap-2 rounded-xl bg-white px-3 font-mono text-xs font-bold text-black transition-colors hover:bg-neutral-200 sm:px-4"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">{cartCount}</span>
            <span className="hidden sm:inline">Sepet</span>
          </button>
        </div>
      </header>

      {/* ---------------------------------- Hero --------------------------------- */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-800/60">
        <SafeImage
          accent="text-amber-400"
          src={IMG.atolye}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-[#030305]" />

        <div className="relative z-10 max-w-4xl space-y-7 px-4 py-14 text-center sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300 backdrop-blur-2xl sm:text-xs"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="min-w-0 truncate">2026 Sonbahar / Kış Atelier Koleksiyonu</span>
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.1 }}
            className="bg-gradient-to-b from-white via-neutral-200 to-neutral-600 bg-clip-text font-serif text-5xl font-black uppercase leading-none tracking-tight text-transparent sm:text-7xl md:text-9xl"
          >
            Zamansız <br />
            <span className="font-serif font-light italic text-amber-400/90">Sadelik</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.15 }}
            className="mx-auto max-w-xl text-sm font-light leading-relaxed text-neutral-400 sm:text-base md:text-xl"
          >
            Sürdürülebilir kumaşlar, heykelsi silüetler ve avant-garde terzilik. Bedeninizi seçin, kombininizi kurun,
            siparişinizi dört adımda tamamlayın.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.2 }}
            className="flex flex-col justify-center gap-3 pt-2 sm:flex-row"
          >
            <a
              href="#products"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white px-7 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-neutral-200 sm:w-auto"
            >
              <span>Koleksiyonu Keşfet</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#kombin"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-amber-500/40 bg-black/40 px-7 font-mono text-xs font-bold uppercase tracking-widest text-amber-200 transition-all hover:bg-amber-500/10 sm:w-auto"
            >
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span>Kombin Oluştur</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------ Hizmet şeridi ----------------------------- */}
      <section className="border-b border-neutral-800/80 bg-neutral-950/60 px-4 py-6 sm:px-6 md:px-12">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-3 font-mono text-xs text-neutral-400 md:grid-cols-3">
          <li className="flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-3.5">
            <Truck className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="min-w-0">Aynı gün VIP kurye teslimatı</span>
          </li>
          <li className="flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-3.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="min-w-0">%100 orijinal & sürdürülebilir üretim</span>
          </li>
          <li className="flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-3.5">
            <RotateCcw className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="min-w-0">30 gün ücretsiz iade ve terzi desteği</span>
          </li>
        </ul>
      </section>

      {/* ------------------------------ Ürün vitrini ------------------------------ */}
      <section id="products" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 space-y-8 px-4 py-16 sm:px-6 md:px-12 md:py-20">
        <div className="min-w-0 border-b border-neutral-800 pb-6">
          <span className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
            <Sliders className="h-4 w-4 shrink-0" aria-hidden="true" /> High Fashion Catalog
          </span>
          <h2 className="font-serif text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Sezon Seçkileri
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Kategori, fiyat, renk ve bedene göre filtreleyin. Her ürünün detay kartında beden bazlı stok, beden tablosu
            ve kumaş bakım bilgisi yer alır.
          </p>
        </div>

        {/* Kategori sekmeleri */}
        <div
          role="group"
          aria-label="Kategori filtresi"
          className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950/80 p-2 backdrop-blur-2xl"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`min-h-10 whitespace-nowrap rounded-xl px-4 font-mono text-[11px] font-bold uppercase tracking-wider transition-all sm:px-5 sm:text-xs ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sıralama + gelişmiş filtre anahtarı */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="gelismis-filtreler"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/40 hover:text-white lg:hidden"
            >
              <Sliders className="h-3.5 w-3.5" aria-hidden="true" />
              Filtreler
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 font-mono text-[10px] tabular-nums text-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className="font-mono text-xs text-neutral-400" aria-live="polite">
              <span className="font-bold text-amber-300 tabular-nums">{visibleProducts.length}</span> ürün listeleniyor
              {isFiltered ? ` (${PRODUCTS.length} ürün içinden)` : ''}
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <label htmlFor="siralama" className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Sırala
            </label>
            <select
              id="siralama"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3 font-mono text-xs text-neutral-200 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 sm:flex-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gelişmiş filtreler */}
        <div
          id="gelismis-filtreler"
          className={`${filtersOpen ? 'grid' : 'hidden'} gap-6 rounded-3xl border border-neutral-800 bg-neutral-950/70 p-5 lg:grid lg:grid-cols-3`}
        >
          <fieldset className="min-w-0 space-y-3">
            <legend className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
              Fiyat Aralığı
            </legend>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => startTransition(() => setPriceRangeId(range.id))}
                  aria-pressed={priceRangeId === range.id}
                  className={`min-h-10 rounded-xl border px-3 font-mono text-[11px] transition-all ${
                    priceRangeId === range.id
                      ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                      : 'border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0 space-y-3">
            <legend className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Renk</legend>
            <div className="flex flex-wrap gap-2">
              {COLOR_FAMILIES.map((color) => {
                const active = activeColors.includes(color.id);
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => toggleColor(color.id)}
                    aria-pressed={active}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 font-mono text-[11px] transition-all ${
                      active
                        ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                        : 'border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-600 hover:text-white'
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-neutral-600"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    {color.id}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="min-w-0 space-y-3">
            <legend className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Beden</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const active = activeSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={active}
                    className={`min-h-10 min-w-[44px] rounded-xl border px-3 font-mono text-[11px] font-bold transition-all ${
                      active
                        ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                        : 'border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-600 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p className="font-mono text-[10px] leading-relaxed text-neutral-600">
              Beden filtresi yalnızca stokta olan bedenleri getirir.
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-neutral-800 bg-black/40 px-3 font-mono text-[11px] text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Filtreleri Temizle
              </button>
            )}
          </fieldset>
        </div>

        {/* Ürün ızgarası */}
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-amber-500/30 bg-neutral-950/60 px-5 py-14 text-center">
            <Package className="h-10 w-10 text-amber-500/50" aria-hidden="true" />
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-white">Bu seçimle eşleşen parça yok</h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-neutral-400">
                Seçtiğiniz kategori, fiyat, renk ve beden kombinasyonunda stokta ürün bulunmuyor. Filtreleri gevşetin ya
                da stil danışmanımızdan özel üretim talep edin.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-colors hover:bg-amber-400"
              >
                Filtreleri Temizle
              </button>
              <button
                type="button"
                onClick={() =>
                  openWhatsAppStyleConsultant(
                    'Merhaba M O D A Atelier, aradığım beden ve renkte bir parça bulamadım. Özel üretim için bilgi alabilir miyim?',
                  )
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-neutral-800 px-5 font-mono text-xs text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
              >
                Özel Üretim Talep Et
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => {
                const isFavorite = favorites.includes(product.id);
                const inStockSizes = product.sizes.filter((size) => stockOf(product.id, size) > 0).length;
                return (
                  <motion.article
                    layout={!reduceMotion}
                    key={product.id}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3 }}
                    className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl transition-all duration-500 hover:border-amber-500/50"
                  >
                    <div className="min-w-0">
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                        <SafeImage
                          accent="text-amber-400"
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover opacity-90 transition-transform duration-700 group-hover:opacity-100 motion-safe:group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="rounded-full bg-amber-400 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-950">
                              Yeni Sezon
                            </span>
                          )}
                          {inStockSizes < product.sizes.length && (
                            <span className="rounded-full border border-white/15 bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-300 backdrop-blur-md">
                              Sınırlı beden
                            </span>
                          )}
                        </div>

                        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFavorite(product.id, product.name)}
                            aria-pressed={isFavorite}
                            aria-label={`${product.name} ürününü favorilere ekle`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-950/70 text-white backdrop-blur-md transition-all hover:bg-amber-500 hover:text-black"
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => setLightbox(product.images[0])}
                            aria-label={`${product.name} görselini büyüt`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-950/70 text-white backdrop-blur-md transition-all hover:bg-amber-500 hover:text-black"
                          >
                            <Maximize2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="absolute inset-x-4 bottom-4 z-20">
                          <button
                            type="button"
                            onClick={() => openDetail(product)}
                            className="min-h-11 w-full rounded-2xl bg-white/95 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-400"
                          >
                            İncele & Beden Seç
                          </button>
                        </div>
                      </div>

                      <div className="min-w-0 space-y-2 p-5">
                        <div className="flex min-w-0 items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                          <span className="min-w-0 truncate">{product.category}</span>
                          <span className="min-w-0 truncate text-right text-amber-400/80">{product.fabric}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold leading-snug text-white transition-colors group-hover:text-amber-300">
                          {product.name}
                        </h3>
                        <p className="font-mono text-[11px] text-neutral-500">{product.fit}</p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center justify-between gap-3 border-t border-neutral-900/80 p-5 pt-4 font-mono">
                      <span className="text-base font-bold text-white">₺{formatPrice(product.price)}</span>
                      <ul className="flex shrink-0 items-center gap-1.5">
                        {product.colors.map((color) => (
                          <li key={color.name}>
                            <span
                              className="block h-3 w-3 rounded-full border border-neutral-700"
                              style={{ backgroundColor: color.hex }}
                              aria-hidden="true"
                            />
                            <span className="sr-only">{color.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* -------------------------------- Kombin ---------------------------------- */}
      <section
        id="kombin"
        className="relative z-10 border-y border-neutral-800/80 bg-neutral-950/50 px-4 py-16 scroll-mt-20 sm:px-6 md:px-12 md:py-20"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="min-w-0">
            <span className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
              <Layers className="h-4 w-4 shrink-0" aria-hidden="true" /> Atelier Styling
            </span>
            <h2 className="font-serif text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Kombin Oluştur
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Bir üst, bir alt ve bir aksesuar seçin; üç parçayı tek dokunuşla sepete ekleyin. Kombin olarak eklenen
              parçalarda <span className="font-bold text-amber-300">%10 stil indirimi</span> otomatik uygulanır.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-5">
              {[
                { title: '01. Üst', items: comboTops, value: comboTop, setValue: setComboTop },
                { title: '02. Alt', items: comboBottoms, value: comboBottom, setValue: setComboBottom },
                { title: '03. Aksesuar', items: comboAccessories, value: comboAccessory, setValue: setComboAccessory },
              ].map((group) => (
                <fieldset key={group.title} className="min-w-0 space-y-3">
                  <legend className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {group.title}
                  </legend>
                  <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                    {group.items.map((item) => {
                      const active = group.value === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => group.setValue(item.id)}
                          aria-pressed={active}
                          className={`w-[132px] shrink-0 overflow-hidden rounded-2xl border text-left transition-all sm:w-[150px] ${
                            active
                              ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                              : 'border-neutral-800 bg-black/40 hover:border-neutral-600'
                          }`}
                        >
                          <span className="relative block aspect-[3/4] bg-neutral-900">
                            <SafeImage
                              accent="text-amber-400"
                              src={item.images[0]}
                              alt=""
                              aria-hidden="true"
                              fill
                              sizes="150px"
                              className="object-cover"
                            />
                            {active && (
                              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black">
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              </span>
                            )}
                          </span>
                          <span className="block min-w-0 p-2.5">
                            <span className="block truncate font-serif text-xs font-bold text-white">{item.name}</span>
                            <span className="mt-0.5 block font-mono text-[11px] text-amber-300">
                              ₺{formatPrice(item.price)}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <aside className="min-w-0 space-y-4 self-start rounded-3xl border border-amber-500/25 bg-black/60 p-5 lg:sticky lg:top-24">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-white">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                Kombin Özeti
              </h3>

              <ul className="space-y-2">
                {comboSelection.map((product) => (
                  <li
                    key={product.id}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/70 px-3 py-2"
                  >
                    <span className="min-w-0 truncate font-serif text-xs text-white">{product.name}</span>
                    <span className="shrink-0 font-mono text-[11px] text-neutral-400">₺{formatPrice(product.price)}</span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 border-t border-neutral-800 pt-3 font-mono text-xs">
                <div className="flex items-center justify-between gap-3">
                  <dt className="min-w-0 truncate text-neutral-400">Üç parça toplamı</dt>
                  <dd className="shrink-0 text-neutral-100">₺{formatPrice(comboSubtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="min-w-0 truncate text-emerald-300">Kombin indirimi</dt>
                  <dd className="shrink-0 text-emerald-300">−₺{formatPrice(comboSaving)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-2 text-sm">
                  <dt className="min-w-0 truncate font-bold text-white">Kombin fiyatı</dt>
                  <dd className="shrink-0 font-bold text-amber-400" aria-live="polite">
                    ₺{formatPrice(comboSubtotal - comboSaving)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={addComboToCart}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Kombini Sepete Ekle
              </button>
              <p className="text-center font-mono text-[10px] leading-relaxed text-neutral-500">
                Parçalar stokta olan ilk beden ve ilk renkle eklenir; sepette değiştirebilirsiniz.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* --------------------------------- Footer -------------------------------- */}
      <footer className="relative z-10 border-t border-neutral-900 bg-neutral-950/40 px-4 py-10 sm:px-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 font-mono text-xs text-neutral-500 md:flex-row">
          <p className="min-w-0 text-center md:text-left">© 2026 M O D A Atelier Studio • Tüm hakları saklıdır.</p>
          <nav aria-label="Alt bilgi bağlantıları" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="#products" className="min-h-10 py-2 transition-colors hover:text-amber-400">
              Atelier Koşulları
            </a>
            <a href="#products" className="min-h-10 py-2 transition-colors hover:text-amber-400">
              Gizlilik & KVKK
            </a>
            <a href="#kombin" className="min-h-10 py-2 transition-colors hover:text-amber-400">
              Sürdürülebilirlik Raporu
            </a>
          </nav>
        </div>
      </footer>

      {/* ----------------------------- Ürün detay modalı --------------------------- */}
      <AnimatePresence>
        {detailProduct && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6 md:items-center"
          >
            <button
              type="button"
              onClick={closeDetail}
              aria-label="Ürün detayını kapat"
              className="absolute inset-0 h-full w-full cursor-default bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              ref={detailRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="urun-detay-basligi"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="relative z-10 my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl"
            >
              <button
                type="button"
                data-autofocus
                onClick={closeDetail}
                aria-label="Kapat"
                className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-neutral-950/85 text-white transition-colors hover:bg-amber-400 hover:text-black"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto md:max-h-[88vh] md:grid-cols-2">
                {/* Galeri */}
                <div className="min-w-0 border-b border-neutral-900 md:border-b-0 md:border-r">
                  <div className="relative aspect-[4/5] bg-neutral-900">
                    <SafeImage
                      accent="text-amber-400"
                      key={detailProduct.images[galleryIndex]}
                      src={detailProduct.images[galleryIndex]}
                      alt={`${detailProduct.name} — görsel ${galleryIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setGalleryIndex((index) => (index - 1 + detailProduct.images.length) % detailProduct.images.length)
                      }
                      aria-label="Önceki görsel"
                      className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-amber-400 hover:text-black"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryIndex((index) => (index + 1) % detailProduct.images.length)}
                      aria-label="Sonraki görsel"
                      className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-amber-400 hover:text-black"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setLightbox(detailProduct.images[galleryIndex])}
                      aria-label="Görseli tam ekran aç"
                      className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-amber-400 hover:text-black"
                    >
                      <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <p className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono text-[10px] text-neutral-300" aria-live="polite">
                      {galleryIndex + 1} / {detailProduct.images.length}
                    </p>
                  </div>

                  <div className="flex gap-2 p-3" role="group" aria-label="Ürün görselleri">
                    {detailProduct.images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setGalleryIndex(index)}
                        aria-label={`${index + 1}. görseli göster`}
                        aria-pressed={galleryIndex === index}
                        className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition-all ${
                          galleryIndex === index ? 'border-amber-400' : 'border-neutral-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <SafeImage
                          accent="text-amber-400"
                          src={image}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                    <p className="ml-auto hidden self-end pb-1 font-mono text-[10px] leading-tight text-neutral-600 sm:block">
                      Ok tuşlarıyla
                      <br />
                      gezinebilirsiniz
                    </p>
                  </div>
                </div>

                {/* Detay */}
                <div className="min-w-0 space-y-5 p-5 sm:p-6">
                  <div className="min-w-0 pr-12">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                      {detailProduct.category} • {detailProduct.fabric}
                    </span>
                    <h2 id="urun-detay-basligi" className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
                      {detailProduct.name}
                    </h2>
                    <p className="mt-2 font-mono text-2xl font-bold text-white">₺{formatPrice(detailProduct.price)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">{detailProduct.description}</p>
                  </div>

                  {/* Renk */}
                  <fieldset className="min-w-0 space-y-2">
                    <legend className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Renk: <span className="text-white">{detailColor || 'seçilmedi'}</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {detailProduct.colors.map((color) => {
                        const active = detailColor === color.name;
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => {
                              setDetailColor(color.name);
                              setDetailError('');
                            }}
                            aria-pressed={active}
                            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 font-mono text-[11px] transition-all ${
                              active
                                ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                                : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                            }`}
                          >
                            <span
                              className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-600"
                              style={{ backgroundColor: color.hex }}
                              aria-hidden="true"
                            >
                              {active && (
                                <Check className={`h-3 w-3 ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                              )}
                            </span>
                            {color.name}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Beden */}
                  <fieldset className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <legend className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Beden: <span className="text-white">{detailSize || 'seçilmedi'}</span>
                      </legend>
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen((open) => !open)}
                        aria-expanded={sizeGuideOpen}
                        aria-controls="beden-tablosu"
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-neutral-800 px-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                      >
                        <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                        Beden Tablosu
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {detailProduct.sizes.map((size) => {
                        const stock = stockOf(detailProduct.id, size);
                        const soldOut = stock === 0;
                        const active = detailSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={soldOut}
                            onClick={() => {
                              setDetailSize(size);
                              setDetailError('');
                            }}
                            aria-pressed={active}
                            aria-label={soldOut ? `${size} bedeni tükendi` : `${size} bedeni seç`}
                            className={`min-h-11 min-w-[52px] rounded-xl border px-3 font-mono text-xs transition-all ${
                              soldOut
                                ? 'cursor-not-allowed border-neutral-900 bg-neutral-950 text-neutral-700 line-through'
                                : active
                                  ? 'border-amber-400 bg-amber-400 font-bold text-black'
                                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    <p className="font-mono text-[11px] text-neutral-500" aria-live="polite">
                      {detailStock === null ? (
                        'Beden seçtiğinizde stok durumu görünür.'
                      ) : (
                        <>
                          {detailSize} bedeni: <StockBadge stock={detailStock} />
                        </>
                      )}
                    </p>
                  </fieldset>

                  {/* Beden tablosu */}
                  {sizeGuideOpen && (
                    <div id="beden-tablosu" className="min-w-0 overflow-x-auto rounded-2xl border border-neutral-800 bg-black/50 p-3">
                      <table className="w-full min-w-[380px] border-collapse text-left font-mono text-[11px]">
                        <caption className="mb-2 text-left text-[10px] uppercase tracking-wider text-neutral-500">
                          Ölçüler santimetre cinsindendir. Aksesuarlar tek bedendir.
                        </caption>
                        <thead>
                          <tr className="text-neutral-400">
                            <th scope="col" className="px-2 py-1.5 font-bold">
                              Beden
                            </th>
                            <th scope="col" className="px-2 py-1.5 font-bold">
                              Göğüs
                            </th>
                            <th scope="col" className="px-2 py-1.5 font-bold">
                              Bel
                            </th>
                            <th scope="col" className="px-2 py-1.5 font-bold">
                              Kalça
                            </th>
                            <th scope="col" className="px-2 py-1.5 font-bold">
                              Kol
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {SIZE_GUIDE.map((row) => (
                            <tr
                              key={row.size}
                              className={`border-t border-neutral-900 ${
                                detailSize === row.size ? 'bg-amber-400/10 text-amber-200' : 'text-neutral-300'
                              }`}
                            >
                              <th scope="row" className="px-2 py-1.5 font-bold">
                                {row.size}
                              </th>
                              <td className="px-2 py-1.5">{row.gogus}</td>
                              <td className="px-2 py-1.5">{row.bel}</td>
                              <td className="px-2 py-1.5">{row.kalca}</td>
                              <td className="px-2 py-1.5">{row.kol}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Kumaş & bakım */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="min-w-0 rounded-2xl border border-neutral-800 bg-black/50 p-3.5">
                      <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                        Kumaş & Kalıp
                      </h3>
                      <ul className="space-y-1.5 text-[11px] leading-relaxed text-neutral-300">
                        <li className="min-w-0">{detailProduct.fabric}</li>
                        <li className="min-w-0">{detailProduct.fit}</li>
                        <li className="min-w-0">{detailProduct.origin}</li>
                        <li className="min-w-0 text-neutral-500">{detailProduct.modelNote}</li>
                      </ul>
                    </div>
                    <div className="min-w-0 rounded-2xl border border-neutral-800 bg-black/50 p-3.5">
                      <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                        Bakım Talimatı
                      </h3>
                      <ul className="space-y-1.5">
                        {detailProduct.care.map((rule) => (
                          <li key={rule} className="flex min-w-0 items-start gap-2 text-[11px] text-neutral-300">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                            <span className="min-w-0">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {detailError && (
                    <p
                      role="alert"
                      className="flex items-start gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-[11px] leading-relaxed text-rose-200"
                    >
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">{detailError}</span>
                    </p>
                  )}

                  <div className="space-y-2.5 border-t border-neutral-900 pt-4">
                    <button
                      type="button"
                      onClick={addDetailToCart}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
                    >
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      Sepete Ekle
                    </button>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(detailProduct.id, detailProduct.name)}
                        aria-pressed={favorites.includes(detailProduct.id)}
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 font-mono text-[11px] font-bold text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${favorites.includes(detailProduct.id) ? 'fill-amber-400 text-amber-400' : ''}`}
                          aria-hidden="true"
                        />
                        {favorites.includes(detailProduct.id) ? 'Favorilerde' : 'Favorilere Ekle'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openWhatsAppStyleConsultant(
                            `Merhaba M O D A Atelier, "${detailProduct.name}" için özel beden ve terzi desteği hakkında bilgi almak istiyorum.`,
                          )
                        }
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 font-mono text-[11px] font-bold text-neutral-300 transition-all hover:border-amber-500/50 hover:text-amber-300"
                      >
                        <PhoneCall className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                        Stil Danışmanına Sor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------ Favori çekmecesi --------------------------- */}
      <AnimatePresence>
        {favOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.button
              type="button"
              onClick={closeFav}
              aria-label="Favoriler panelini kapat"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-md"
            />

            <motion.div
              ref={favRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="favori-basligi"
              initial={reduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 220 }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-950"
            >
              <div className="flex items-center justify-between gap-3 border-b border-neutral-800 p-4">
                <h2 id="favori-basligi" className="flex min-w-0 items-center gap-2 font-serif text-base font-bold uppercase tracking-wider text-white">
                  <Heart className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span className="min-w-0 truncate">Favorilerim ({favoriteProducts.length})</span>
                </h2>
                <button
                  type="button"
                  data-autofocus
                  onClick={closeFav}
                  aria-label="Favorileri kapat"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-800 text-neutral-400 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {favoriteProducts.length === 0 ? (
                  <div className="space-y-3 rounded-2xl border border-dashed border-neutral-800 p-8 text-center">
                    <Heart className="mx-auto h-8 w-8 text-neutral-700" aria-hidden="true" />
                    <p className="font-mono text-xs leading-relaxed text-neutral-500">
                      Henüz favori parçanız yok. Ürün kartındaki kalp simgesine dokunarak beğendiklerinizi burada
                      toplayabilirsiniz.
                    </p>
                    <button
                      type="button"
                      onClick={closeFav}
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-neutral-800 px-5 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                    >
                      Koleksiyona Dön
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {favoriteProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex min-w-0 gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3"
                      >
                        <SafeImage
                          accent="text-amber-400"
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={80}
                          className="h-20 w-16 shrink-0 rounded-xl bg-neutral-900 object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="min-w-0 font-serif text-xs font-bold leading-snug text-white">
                              {product.name}
                            </h3>
                            <p className="mt-1 font-mono text-[11px] text-amber-400">₺{formatPrice(product.price)}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveFavoriteToCart(product)}
                              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-amber-400 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-amber-300"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                              Sepete Taşı
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFavOpen(false);
                                openDetail(product);
                              }}
                              className="inline-flex min-h-10 items-center rounded-xl border border-neutral-800 px-3 font-mono text-[10px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                            >
                              Detay
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(product.id, product.name)}
                              aria-label={`${product.name} ürününü favorilerden çıkar`}
                              className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 text-neutral-500 transition-colors hover:border-rose-500/50 hover:text-rose-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {favoriteProducts.length > 0 && (
                <div className="border-t border-neutral-800 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      favoriteProducts.forEach((product) => moveFavoriteToCart(product));
                    }}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Tümünü Sepete Taşı
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------- Sepet & ödeme çekmecesi ------------------------ */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.button
              type="button"
              onClick={closeCart}
              aria-label="Sepet panelini kapat"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-md"
            />

            <motion.div
              ref={cartRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="sepet-basligi"
              initial={reduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 220 }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-950"
            >
              <div className="space-y-3 border-b border-neutral-800 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id="sepet-basligi"
                    className="flex min-w-0 items-center gap-2 font-serif text-base font-bold uppercase tracking-wider text-white"
                  >
                    <ShoppingBag className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                    <span className="min-w-0 truncate">
                      {step === 'sepet' && 'Atelier Sepetiniz'}
                      {step === 'kargo' && 'Kargo Bilgileri'}
                      {step === 'odeme' && 'Ödeme Özeti'}
                      {step === 'onay' && 'Sipariş Onayı'}
                    </span>
                  </h2>
                  <button
                    type="button"
                    data-autofocus
                    onClick={closeCart}
                    aria-label="Sepeti kapat"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-800 text-neutral-400 transition-colors hover:text-white"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <CheckoutSteps current={step} />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {/* ---------------------------- 1. Sepet ---------------------------- */}
                {step === 'sepet' && (
                  <div className="space-y-4">
                    {cart.length === 0 ? (
                      <div className="space-y-3 rounded-2xl border border-dashed border-neutral-800 p-8 text-center">
                        <ShoppingBag className="mx-auto h-8 w-8 text-neutral-700" aria-hidden="true" />
                        <p className="font-mono text-xs leading-relaxed text-neutral-500">
                          Sepetinizde henüz parça bulunmuyor. Koleksiyondan bir parça seçin ya da hazır bir kombin
                          ekleyin.
                        </p>
                        <button
                          type="button"
                          onClick={closeCart}
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-neutral-800 px-5 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                        >
                          Koleksiyona Dön
                        </button>
                      </div>
                    ) : (
                      <>
                        <ul className="space-y-3">
                          {cart.map((line) => (
                            <CartLineRow
                              key={line.key}
                              line={line}
                              onIncrease={() => increaseLine(line.key)}
                              onDecrease={() => decreaseLine(line.key)}
                              onRemove={() => removeLine(line.key)}
                            />
                          ))}
                        </ul>
                        <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                          <SummaryRows
                            subtotal={subtotal}
                            comboDiscount={comboDiscount}
                            shippingCost={shippingCost}
                            total={subtotal - comboDiscount}
                            showShipping={false}
                          />
                        </div>
                        <p className="font-mono text-[10px] leading-relaxed text-neutral-500">
                          ₺{formatPrice(FREE_SHIPPING_LIMIT)} ve üzeri standart kargo siparişlerinde teslimat ücretsizdir.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* ---------------------------- 2. Kargo ---------------------------- */}
                {step === 'kargo' && (
                  <div className="space-y-4">
                    {Object.keys(errors).length > 0 && (
                      <p
                        role="alert"
                        className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-[11px] leading-relaxed text-rose-200"
                      >
                        Devam etmek için {Object.keys(errors).length} alanı düzeltmeniz gerekiyor.
                      </p>
                    )}

                    <TextField
                      id="co-ad"
                      label="Ad Soyad"
                      value={shippingForm.ad}
                      onChange={(value) => setShippingForm((form) => ({ ...form, ad: value }))}
                      error={errors.ad}
                      placeholder="Örn: Elif Yılmaz"
                      autoComplete="name"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        id="co-telefon"
                        label="Telefon"
                        value={shippingForm.telefon}
                        onChange={(value) => setShippingForm((form) => ({ ...form, telefon: value }))}
                        error={errors.telefon}
                        type="tel"
                        inputMode="tel"
                        placeholder="555 000 00 00"
                        autoComplete="tel"
                      />
                      <TextField
                        id="co-eposta"
                        label="E-posta"
                        value={shippingForm.eposta}
                        onChange={(value) => setShippingForm((form) => ({ ...form, eposta: value }))}
                        error={errors.eposta}
                        type="email"
                        inputMode="email"
                        placeholder="ad@ornek.com"
                        autoComplete="email"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="min-w-0 space-y-1.5">
                        <label
                          htmlFor="co-il"
                          className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
                        >
                          İl
                        </label>
                        <select
                          id="co-il"
                          name="co-il"
                          value={shippingForm.il}
                          onChange={(event) => setShippingForm((form) => ({ ...form, il: event.target.value }))}
                          aria-invalid={errors.il ? true : undefined}
                          aria-describedby={errors.il ? 'co-il-error' : undefined}
                          className={`min-h-11 w-full rounded-xl border bg-black/70 px-3 text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
                            errors.il ? 'border-rose-500/70' : 'border-neutral-800 focus:border-amber-400'
                          }`}
                        >
                          <option value="">Şehir seçin</option>
                          {CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {errors.il && (
                          <p id="co-il-error" role="alert" className="font-mono text-[11px] text-rose-300">
                            {errors.il}
                          </p>
                        )}
                      </div>
                      <TextField
                        id="co-ilce"
                        label="İlçe"
                        value={shippingForm.ilce}
                        onChange={(value) => setShippingForm((form) => ({ ...form, ilce: value }))}
                        error={errors.ilce}
                        placeholder="Örn: Beşiktaş"
                        autoComplete="address-level2"
                      />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <label
                        htmlFor="co-adres"
                        className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
                      >
                        Açık Adres
                      </label>
                      <textarea
                        id="co-adres"
                        name="co-adres"
                        rows={3}
                        value={shippingForm.adres}
                        onChange={(event) => setShippingForm((form) => ({ ...form, adres: event.target.value }))}
                        placeholder="Mahalle, cadde, bina ve daire numarası"
                        autoComplete="street-address"
                        aria-invalid={errors.adres ? true : undefined}
                        aria-describedby={errors.adres ? 'co-adres-error' : undefined}
                        className={`w-full rounded-xl border bg-black/70 px-3.5 py-3 text-sm text-white transition-colors placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
                          errors.adres ? 'border-rose-500/70' : 'border-neutral-800 focus:border-amber-400'
                        }`}
                      />
                      {errors.adres && (
                        <p id="co-adres-error" role="alert" className="font-mono text-[11px] text-rose-300">
                          {errors.adres}
                        </p>
                      )}
                    </div>

                    <fieldset className="min-w-0 space-y-2">
                      <legend className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                        Teslimat Seçeneği
                      </legend>
                      {SHIPPING_OPTIONS.map((option) => {
                        const free = option.id === 'standart' && subtotal - comboDiscount >= FREE_SHIPPING_LIMIT;
                        return (
                          <label
                            key={option.id}
                            className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${
                              shippingId === option.id
                                ? 'border-amber-400 bg-amber-400/10'
                                : 'border-neutral-800 bg-black/40 hover:border-neutral-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="teslimat"
                              value={option.id}
                              checked={shippingId === option.id}
                              onChange={() => setShippingId(option.id)}
                              className="mt-1 h-4 w-4 shrink-0 accent-amber-400"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex min-w-0 items-center justify-between gap-2">
                                <span className="min-w-0 truncate font-mono text-xs font-bold text-white">
                                  {option.label}
                                </span>
                                <span className="shrink-0 font-mono text-xs text-amber-300">
                                  {free ? 'Ücretsiz' : `₺${formatPrice(option.price)}`}
                                </span>
                              </span>
                              <span className="mt-1 block font-mono text-[10px] leading-relaxed text-neutral-500">
                                {option.eta} · {option.note}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>

                    <TextField
                      id="co-not"
                      label="Kurye Notu (isteğe bağlı)"
                      value={shippingForm.not}
                      onChange={(value) => setShippingForm((form) => ({ ...form, not: value }))}
                      placeholder="Örn: Zili çalmayın, kapıya bırakın."
                    />

                    <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                      <SummaryRows
                        subtotal={subtotal}
                        comboDiscount={comboDiscount}
                        shippingCost={shippingCost}
                        total={total}
                        showShipping
                      />
                    </div>
                  </div>
                )}

                {/* ---------------------------- 3. Ödeme ---------------------------- */}
                {step === 'odeme' && (
                  <div className="space-y-4">
                    {Object.keys(errors).length > 0 && (
                      <p
                        role="alert"
                        className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-[11px] leading-relaxed text-rose-200"
                      >
                        Ödemeyi tamamlamak için {Object.keys(errors).length} alanı düzeltmeniz gerekiyor.
                      </p>
                    )}

                    <div className="space-y-2 rounded-2xl border border-neutral-800 bg-black/50 p-4">
                      <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                        Teslimat Bilgileri
                      </h3>
                      <p className="min-w-0 break-words font-mono text-[11px] leading-relaxed text-neutral-300">
                        {shippingForm.ad} · {shippingForm.telefon}
                        <br />
                        {shippingForm.adres}
                        <br />
                        {shippingForm.ilce} / {shippingForm.il}
                        <br />
                        <span className="text-neutral-500">{shippingOption.label} — {shippingOption.eta}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setStep('kargo');
                        }}
                        className="inline-flex min-h-10 items-center rounded-lg border border-neutral-800 px-3 font-mono text-[10px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                      >
                        Bilgileri Düzenle
                      </button>
                    </div>

                    <TextField
                      id="co-kartAd"
                      label="Kart Üzerindeki İsim"
                      value={paymentForm.kartAd}
                      onChange={(value) => setPaymentForm((form) => ({ ...form, kartAd: value }))}
                      error={errors.kartAd}
                      placeholder="ELIF YILMAZ"
                      autoComplete="cc-name"
                    />
                    <TextField
                      id="co-kartNo"
                      label="Kart Numarası"
                      value={paymentForm.kartNo}
                      onChange={(value) =>
                        setPaymentForm((form) => ({
                          ...form,
                          kartNo: value
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim(),
                        }))
                      }
                      error={errors.kartNo}
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                      maxLength={19}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        id="co-sonKullanma"
                        label="Son Kullanma"
                        value={paymentForm.sonKullanma}
                        onChange={(value) => {
                          const digits = value.replace(/\D/g, '').slice(0, 4);
                          const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                          setPaymentForm((form) => ({ ...form, sonKullanma: formatted }));
                        }}
                        error={errors.sonKullanma}
                        inputMode="numeric"
                        placeholder="AA/YY"
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                      <TextField
                        id="co-cvv"
                        label="CVV"
                        value={paymentForm.cvv}
                        onChange={(value) =>
                          setPaymentForm((form) => ({ ...form, cvv: value.replace(/\D/g, '').slice(0, 4) }))
                        }
                        error={errors.cvv}
                        inputMode="numeric"
                        placeholder="000"
                        autoComplete="cc-csc"
                        maxLength={4}
                      />
                    </div>

                    <div className="min-w-0 space-y-2">
                      <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border border-neutral-800 bg-black/40 p-3">
                        <input
                          id="co-sozlesme"
                          name="co-sozlesme"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(event) => setTermsAccepted(event.target.checked)}
                          aria-invalid={errors.sozlesme ? true : undefined}
                          aria-describedby={errors.sozlesme ? 'co-sozlesme-error' : undefined}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
                        />
                        <span className="min-w-0 font-mono text-[11px] leading-relaxed text-neutral-300">
                          Mesafeli satış sözleşmesini ve ön bilgilendirme formunu okudum, onaylıyorum.
                        </span>
                      </label>
                      {errors.sozlesme && (
                        <p id="co-sozlesme-error" role="alert" className="font-mono text-[11px] text-rose-300">
                          {errors.sozlesme}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {cart.map((line) => (
                        <CartLineRow
                          key={line.key}
                          line={line}
                          compact
                          onIncrease={() => increaseLine(line.key)}
                          onDecrease={() => decreaseLine(line.key)}
                          onRemove={() => removeLine(line.key)}
                        />
                      ))}
                    </ul>

                    <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                      <SummaryRows
                        subtotal={subtotal}
                        comboDiscount={comboDiscount}
                        shippingCost={shippingCost}
                        total={total}
                        showShipping
                      />
                    </div>

                    <p className="flex items-start gap-2 font-mono text-[10px] leading-relaxed text-neutral-500">
                      <Lock className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" aria-hidden="true" />
                      <span className="min-w-0">
                        Bu bir demo akışıdır; kart bilgisi hiçbir yere gönderilmez, gerçek bir tahsilat yapılmaz.
                      </span>
                    </p>
                  </div>
                )}

                {/* ----------------------------- 4. Onay ---------------------------- */}
                {step === 'onay' && placedOrder && (
                  <div className="space-y-4">
                    <div className="space-y-3 rounded-3xl border-2 border-emerald-500/50 bg-emerald-950/30 p-5 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/20 text-emerald-300">
                        <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white">Siparişiniz Alındı</h3>
                      <p className="font-mono text-sm font-bold tracking-wider text-amber-300">{placedOrder.code}</p>
                      <p className="text-xs leading-relaxed text-neutral-300">
                        Sayın <span className="font-bold text-white">{placedOrder.name}</span>, {placedOrder.itemCount}{' '}
                        parçalık siparişiniz atölyemize düştü. Onay e-postası{' '}
                        <span className="break-all font-mono text-amber-200">{placedOrder.email}</span> adresine
                        gönderildi.
                      </p>
                    </div>

                    <dl className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Teslimat', value: placedOrder.shippingId === 'vip' ? 'Aynı Gün VIP Kurye' : 'Standart Kargo' },
                        {
                          label: 'Tahmini Teslim',
                          value:
                            SHIPPING_OPTIONS.find((option) => option.id === placedOrder.shippingId)?.eta ??
                            '2 – 4 iş günü',
                        },
                        { label: 'Adres', value: `${placedOrder.district} / ${placedOrder.city}` },
                        { label: 'Ödeme', value: `•••• ${placedOrder.cardTail}` },
                      ].map((row) => (
                        <div key={row.label} className="min-w-0 rounded-2xl border border-neutral-800 bg-black/50 p-3">
                          <dt className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                            {row.label}
                          </dt>
                          <dd className="mt-1 break-words font-mono text-[11px] font-semibold text-white">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <ul className="space-y-2">
                      {placedOrder.lines.map((line) => (
                        <CartLineRow
                          key={line.key}
                          line={line}
                          compact
                          onIncrease={() => undefined}
                          onDecrease={() => undefined}
                          onRemove={() => undefined}
                        />
                      ))}
                    </ul>

                    <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                      <SummaryRows
                        subtotal={placedOrder.subtotal}
                        comboDiscount={placedOrder.comboDiscount}
                        shippingCost={placedOrder.shippingCost}
                        total={placedOrder.total}
                        showShipping
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsAppStyleConsultant(
                          `Merhaba M O D A Atelier, ${placedOrder.code} numaralı siparişim hakkında bilgi almak istiyorum.`,
                        )
                      }
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                      Sipariş Takibi İçin Yaz
                    </button>
                  </div>
                )}
              </div>

              {/* Adım aksiyonları */}
              <div className="space-y-2 border-t border-neutral-800 bg-neutral-950 p-4">
                {step === 'sepet' && (
                  <>
                    <div className="flex items-center justify-between gap-3 font-mono text-xs">
                      <span className="min-w-0 truncate text-neutral-400">
                        {cartCount} parça · {cart.length} kalem
                      </span>
                      <span className="shrink-0 text-lg font-bold text-amber-400">
                        ₺{formatPrice(Math.max(0, subtotal - comboDiscount))}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={goToShipping}
                      disabled={cart.length === 0}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500 disabled:cursor-not-allowed disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500"
                    >
                      Kargo Bilgilerine Geç
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                )}

                {step === 'kargo' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setErrors({});
                        setStep('sepet');
                      }}
                      className="flex min-h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-neutral-800 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Sepet
                    </button>
                    <button
                      type="button"
                      onClick={goToPayment}
                      className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
                    >
                      <span className="min-w-0 truncate">Ödemeye Geç</span>
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {step === 'odeme' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setErrors({});
                        setStep('kargo');
                      }}
                      className="flex min-h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-neutral-800 px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition-colors hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Kargo
                    </button>
                    <button
                      type="button"
                      onClick={confirmOrder}
                      className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500"
                    >
                      <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 truncate">₺{formatPrice(total)} Öde</span>
                    </button>
                  </div>
                )}

                {step === 'onay' && (
                  <button
                    type="button"
                    onClick={startNewOrder}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 font-mono text-xs font-bold uppercase tracking-wider text-emerald-200 transition-colors hover:bg-emerald-500 hover:text-slate-950"
                  >
                    Yeni Alışverişe Başla
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------ Görsel büyütme ---------------------------- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Büyütülmüş görseli kapat"
              className="absolute inset-0 h-full w-full cursor-default bg-black/95 backdrop-blur-2xl"
            />
            <div
              ref={lightboxRef}
              role="dialog"
              aria-modal="true"
              aria-label="Ürün görseli"
              className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950"
            >
              <div className="relative aspect-[3/4] max-h-[85vh] w-full">
                <SafeImage
                  accent="text-amber-400"
                  src={lightbox}
                  alt="Seçilen ürünün büyütülmüş görseli"
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                data-autofocus
                onClick={closeLightbox}
                aria-label="Kapat"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-neutral-950/80 text-white transition-colors hover:bg-amber-400 hover:text-black"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DemoSwitcher currentId="moda-eticaret" />
    </main>
  );
}
