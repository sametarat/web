'use client';

import React, { useState, useRef, useEffect, useMemo, FC } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import CyberChatbot from '@/components/CyberChatbot';
import { LeadCaptureSection } from '@/components/LeadCaptureSection';
import { SiteHeader } from '@/components/SiteHeader';
import { SafeImage } from '@/components/SafeImage';
import { HeroSlider } from '@/components/HeroSlider';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { SERVICE_GROUPS, cardsByGroup } from '@/content/services';
import { ServiceIcon } from '@/components/service/ServiceIcon';
import { SectionHeading } from '@/components/SectionHeading';
import { ScrollProgress } from '@/components/ScrollProgress';
import { TrustLinks } from '@/components/TrustLinks';
import { MetaGoogleAdsCard } from '@/components/MetaGoogleAdsCard';
import { SiteFooter } from '@/components/SiteFooter';
import { CONTACT } from '@/lib/site';
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Activity,
  X,
  Check,
  Clock,
  Mail,
  MapPin,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Trash2,
  Star,
  Lock,
  RotateCw,
  ShoppingCart,
  CalendarCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  Building2,
  Dumbbell,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---

/**
 * Önizleme satırı.
 *
 * `value` listede görünen hazır metin, `amount` ise sayısal karşılığı.
 * İkisini ayırmak, ekranda "₺1.200" yazarken arka planda gerçekten toplam
 * ve ortalama hesaplayabilmemizi sağlıyor — önizleme artık statik değil.
 */
interface PanelRow {
  primary: string;
  secondary: string;
  value: string;
  tag?: string;
  /** Hesaplamalar için TL karşılığı. */
  amount?: number;
  /** m² — emlakta birim fiyat ortalaması buradan çıkıyor. */
  area?: number;
  /** Filtre modunda satırın etiketleri; sıra `panel.filters` sırasıyla eşleşir. */
  facets?: string[];
}

/**
 * Saat/gün yuvası. Dolu yuvalar listeden çıkarılmıyor, üstü çizili gösteriliyor:
 * gerçek bir rezervasyon ekranı da doluluğu gizlemez, gösterir.
 */
interface PanelSlot {
  label: string;
  taken?: boolean;
}

/**
 * Panel modları. Her sektör kendi doğal etkileşimini kullanıyor:
 * `select` sepet/plan (restoran siparişi, tedavi planı),
 * `choose` iki adımlı randevu (kim/ne + saat),
 * `filter` arama (emlak portföyü, hasta yorumları).
 */
type PanelMode = 'select' | 'choose' | 'filter';

interface DemoPanel {
  mode: PanelMode;
  rows: PanelRow[];
  /** Özet kartının başlığı: "Sipariş özeti", "Randevu özeti"... */
  summaryTitle: string;
  /** Henüz seçim yokken özet kartında görünen yönlendirme. */
  hint: string;
  /** select: toplama eklenen servis bedeli. */
  fee?: { label: string; percent: number };
  /** select: toplam kaç aya bölünerek gösterilsin (tedavi planı taksiti). */
  installments?: number;
  /** choose: satır seçildikten sonraki ikinci adım. */
  slots?: PanelSlot[];
  slotsLabel?: string;
  confirmLabel?: string;
  confirmedLabel?: string;
  /** filter: üstte çıkan filtre grupları. */
  filters?: { label: string; options: string[] }[];
  /** filter: sonuç kalmayınca gösterilecek metin. */
  emptyLabel?: string;
  /** Listenin üstünde görünen kısa açıklama. */
  lead?: string;
}

interface DemoItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: React.ElementType;
  badgeColor: string;
  accentColor: string;
  metrics: string;
  navItems: string[];
  /** Sekme adı -> o sekmenin çalışan mini arayüzü. */
  panels: Record<string, DemoPanel>;
  /** Seçim kartının arkasında görünen sektör görseli. */
  preview: string;
}

/**
 * Sayfa kabuğu: tek bir ölçü. Bölümler bu genişliği ya kullanıyor ya da
 * bilinçli olarak kırıyor (tam genişlik bant, sağa kaçık blok, dar sütun).
 * Ritmi kuran şey bu genişlik değişimi.
 */
const SHELL = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12';


// --- CONSTANTS ---

/**
 * Ana sayfa vitrininde öne çıkan demolar.
 * Altısı da yayında (bkz. DemoSwitcher ve /ucretsiz-analiz); burada sadece
 * en yüksek bütçeli sektörler gösteriliyor — altı kart vitrini boğuyordu.
 */
const ALL_DEMOS: DemoItem[] = [
  {
    id: 'gurme-restoran',
    title: 'Gurme Restoran & Bistro',
    subtitle: 'La Maison - Fine Dining & Gastronomy',
    category: 'Gastronomi & Restoran',
    path: '/demo/gurme-restoran',
    icon: Utensils,
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    accentColor: 'text-amber-400',
    metrics: 'Masa Rezervasyonu: +%240 | Yükleme: 0.05s',
    preview: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=70',
    panels: {
      'Ana Menü': {
        mode: 'select',
        summaryTitle: 'Sipariş özeti',
        lead: 'Tabaklara dokunun; sipariş özeti anında güncellenir.',
        hint: 'Menüden bir tabak seçin, özet burada oluşsun.',
        fee: { label: 'Servis (%10)', percent: 10 },
        rows: [
          { primary: 'Dry-Aged Truffle Ribeye', secondary: '28 gün dinlendirilmiş · siyah trüf', value: '₺1.200', amount: 1200, tag: 'Şefin Seçimi' },
          { primary: 'Izgara Ahtapot', secondary: 'Safran ve parmesan kabuklu risotto', value: '₺850', amount: 850 },
          { primary: 'Kral Yengeç Tartar', secondary: 'Avokado, misket limonu, havyar', value: '₺940', amount: 940 },
          { primary: 'El Açması Trüflü Tagliatelle', secondary: '36 ay parmigiano · taze trüf', value: '₺780', amount: 780 },
          { primary: 'Fırında Levrek', secondary: 'Deniz börülcesi · beurre blanc', value: '₺910', amount: 910 },
        ],
      },
      'Şefin Spesiyalleri': {
        mode: 'select',
        summaryTitle: 'Sipariş özeti',
        lead: 'Tadım menüsü ve spesiyaller aynı siparişe eklenir.',
        hint: 'Bir spesiyal seçin, servis bedeliyle birlikte toplansın.',
        fee: { label: 'Servis (%10)', percent: 10 },
        rows: [
          { primary: '7 Kap Tadım Menüsü', secondary: 'Şef masasında · ortalama 2,5 saat', value: '₺3.400', amount: 3400, tag: 'Rezervasyon şart' },
          { primary: 'Wagyu Yanak', secondary: '12 saat ağır ateşte', value: '₺1.450', amount: 1450 },
          { primary: 'Kömürde Kuzu Karesi', secondary: 'Kekikli jus · közlenmiş enginar', value: '₺1.280', amount: 1280 },
          { primary: 'Füme Burrata', secondary: 'Yaban mersini havyarı', value: '₺620', amount: 620 },
        ],
      },
      'Şarap Kavı': {
        mode: 'select',
        summaryTitle: 'Sipariş özeti',
        lead: 'Sommelier seçkisi de aynı hesaba işlenir.',
        hint: 'Bir kadeh ya da şişe ekleyin.',
        fee: { label: 'Servis (%10)', percent: 10 },
        rows: [
          { primary: 'Château Margaux 2018', secondary: 'Bordeaux · kadeh servisi', value: '₺650', amount: 650 },
          { primary: 'Sommelier Eşleştirmesi', secondary: 'Tadım menüsüne 5 kadeh', value: '₺1.800', amount: 1800 },
          { primary: 'Yerli Öküzgözü Seçkisi', secondary: 'Anadolu bağları · şişe', value: '₺980', amount: 980 },
          { primary: 'Blanc de Blancs Şampanya', secondary: 'Grand Cru · şişe', value: '₺1.150', amount: 1150 },
        ],
      },
      'Rezervasyon': {
        mode: 'choose',
        summaryTitle: 'Rezervasyon özeti',
        lead: 'Önce masayı, sonra saati seçin.',
        hint: 'Bir masa seçin; uygun saatler hemen altında açılır.',
        slotsLabel: 'Bu akşam uygun saatler',
        slots: [
          { label: '18:30' },
          { label: '19:00' },
          { label: '19:30', taken: true },
          { label: '20:00' },
          { label: '20:30' },
          { label: '21:00', taken: true },
          { label: '21:30' },
        ],
        confirmLabel: 'Masayı ayır',
        confirmedLabel: 'Masanız ayrıldı, onay SMS ile gönderildi.',
        rows: [
          { primary: 'Şef Masası', secondary: 'Mutfağa bakan · menü şefle birlikte kurgulanır', value: '2 kişi', tag: 'Son 1 masa' },
          { primary: 'Ana Salon', secondary: 'Pencere kenarı · canlı piyano', value: '4 kişi' },
          { primary: 'Teras Lounge', secondary: 'Boğaz manzarası · ısıtmalı', value: '6 kişi' },
          { primary: 'Kav Odası', secondary: 'Özel oda · sommelier eşliğinde', value: '8 kişi' },
        ],
      },
    },
    navItems: ['Ana Menü', 'Şefin Spesiyalleri', 'Şarap Kavı', 'Rezervasyon'],
  },
  {
    id: 'moda-eticaret',
    title: 'Moda & Lüks E-Ticaret',
    subtitle: 'Vogue & Urban Culture',
    category: 'E-Ticaret & Moda',
    path: '/demo/moda-eticaret',
    icon: ShoppingBag,
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    accentColor: 'text-pink-400',
    metrics: 'Sepete Ekleme: +%180 | Yükleme: 0.08s',
    preview: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=70',
    panels: {
      'Yeni Gelenler': {
        mode: 'select',
        summaryTitle: 'Sepetim',
        lead: 'Ürünlere dokunun, sepet anında güncellensin.',
        hint: 'Bir ürün seçin; sepet toplamı burada görünür.',
        rows: [
          { primary: 'Yapılandırılmış Yün Palto', secondary: 'İtalyan yünü · 3 renk', value: '₺8.400', amount: 8400, tag: 'Yeni' },
          { primary: 'Oversize Keten Gömlek', secondary: 'Organik keten · unisex', value: '₺2.150', amount: 2150 },
          { primary: 'Heykelsi Deri Çanta', secondary: 'El yapımı · sınırlı üretim', value: '₺6.900', amount: 6900 },
        ],
      },
      'Erkek': {
        mode: 'select',
        summaryTitle: 'Sepetim',
        hint: 'Bir ürün seçin; sepet toplamı burada görünür.',
        rows: [
          { primary: 'Tailored Yün Ceket', secondary: 'Yarım astar · slim kalıp', value: '₺7.200', amount: 7200 },
          { primary: 'Merino Triko', secondary: 'İnce örgü · 6 renk', value: '₺1.980', amount: 1980 },
          { primary: 'Kalın Taban Deri Bot', secondary: 'Goodyear dikiş', value: '₺5.400', amount: 5400 },
        ],
      },
      'Kadın': {
        mode: 'select',
        summaryTitle: 'Sepetim',
        hint: 'Bir ürün seçin; sepet toplamı burada görünür.',
        rows: [
          { primary: 'Asimetrik Midi Elbise', secondary: 'Drapeli ipek karışım', value: '₺4.750', amount: 4750, tag: 'Çok satan' },
          { primary: 'Geniş Paça Pantolon', secondary: 'Yüksek bel · akışkan kumaş', value: '₺2.680', amount: 2680 },
          { primary: 'Kaşmir Şal', secondary: '%100 kaşmir · 4 ton', value: '₺3.100', amount: 3100 },
        ],
      },
    },
    navItems: ['Yeni Gelenler', 'Erkek', 'Kadın'],
  },
  {
    id: 'otel-rezervasyon',
    title: 'Otel & Lüks Konaklama',
    subtitle: 'Grand Azure Resort & Spa',
    category: 'Turizm & Otelcilik',
    path: '/demo/otel-rezervasyon',
    icon: Hotel,
    badgeColor: 'border-brand-500/30 text-brand-400 bg-brand-500/10',
    accentColor: 'text-brand-400',
    metrics: 'Direkt Rezervasyon: +%310 | Yükleme: 0.06s',
    preview: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=70',
    panels: {
      'Odalar & Süitler': {
        mode: 'choose',
        summaryTitle: 'Konaklama özeti',
        lead: 'Odayı seçin, ardından giriş tarihini işaretleyin.',
        hint: 'Bir oda tipi seçin.',
        slotsLabel: 'Uygun giriş tarihleri',
        slots: [{ label: '12 Eyl' }, { label: '13 Eyl' }, { label: '14 Eyl', taken: true }, { label: '15 Eyl' }, { label: '16 Eyl' }],
        confirmLabel: 'Rezervasyonu tut',
        confirmedLabel: 'Oda 24 saat opsiyonda tutuldu.',
        rows: [
          { primary: 'Panoramik King Suite', secondary: '65 m² · deniz manzarası', value: '₺14.500/gece', amount: 14500, tag: 'En popüler' },
          { primary: 'Müstakil Havuzlu Villa', secondary: '180 m² · özel havuz', value: '₺38.000/gece', amount: 38000 },
          { primary: 'Orman Bungalov', secondary: '48 m² · teras + şömine', value: '₺9.200/gece', amount: 9200 },
        ],
      },
      'Spa & Wellness': {
        mode: 'select',
        summaryTitle: 'Ek hizmetler',
        hint: 'Konaklamanıza spa ritüeli ekleyin.',
        rows: [
          { primary: 'Hamam & Kese Ritüeli', secondary: '90 dakika · çift kabin', value: '₺2.400', amount: 2400 },
          { primary: 'Aromaterapi Masajı', secondary: '60 dakika', value: '₺1.850', amount: 1850 },
          { primary: 'Termal Havuz Erişimi', secondary: 'Konaklamaya dahil', value: 'Ücretsiz', amount: 0 },
        ],
      },
      'Gastronomi': {
        mode: 'select',
        summaryTitle: 'Ek hizmetler',
        hint: 'Yemek paketlerini seçin.',
        rows: [
          { primary: 'Şarap Mahzeni Akşamı', secondary: 'Sommelier eşliğinde · 8 kişi', value: '₺2.900', amount: 2900 },
          { primary: 'Sahil Restoran Menüsü', secondary: 'Akdeniz mutfağı · kişi başı', value: '₺1.600', amount: 1600 },
          { primary: 'Oda Servisi', secondary: '7/24', value: 'Dahil', amount: 0 },
        ],
      },
    },
    navItems: ['Odalar & Süitler', 'Spa & Wellness', 'Gastronomi'],
  },
  {
    id: 'klinik-saglik',
    title: 'Klinik & Sağlık',
    subtitle: 'Vitalis Klinik - Diş & Estetik',
    category: 'Sağlık & Klinik',
    path: '/demo/klinik-saglik',
    icon: Stethoscope,
    badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
    accentColor: 'text-teal-400',
    metrics: 'Online Randevu: +%190 | Yükleme: 0.06s',
    preview: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=70',
    panels: {
      'Tedaviler': {
        mode: 'select',
        summaryTitle: 'Tedavi planı',
        lead: 'Tedavileri işaretleyin; plan ve taksit anında hesaplanır.',
        hint: 'Bir tedavi seçin, tahmini tutar ve taksit burada çıksın.',
        installments: 12,
        rows: [
          { primary: 'Dijital Gülüş Tasarımı', secondary: '3D simülasyon · 2 seans · 4-6 hafta', value: '₺48.000', amount: 48000, tag: 'En çok tercih edilen' },
          { primary: 'İmplant Uygulaması', secondary: 'Titanyum · diş başı · ömür boyu garanti', value: '₺22.500', amount: 22500 },
          { primary: 'Şeffaf Plak Ortodonti', secondary: 'Telsiz · 8-14 ay · aylık kontrol', value: '₺64.000', amount: 64000 },
          { primary: 'Zirkonyum Kaplama', secondary: 'Diş başı · 5 gün teslim', value: '₺9.800', amount: 9800 },
          { primary: 'Ofis Tipi Beyazlatma', secondary: 'Tek seans · 45 dakika', value: '₺6.400', amount: 6400 },
          { primary: 'Profesyonel Diş Temizliği', secondary: 'Ultrasonik · yılda 2 kez önerilir', value: '₺2.200', amount: 2200 },
        ],
      },
      'Hekimlerimiz': {
        mode: 'choose',
        summaryTitle: 'Randevu özeti',
        lead: 'Hekiminizi seçin; poliklinik günü de burada işaretlenir.',
        hint: 'Bir hekim seçin.',
        slotsLabel: 'Poliklinik günleri',
        slots: [{ label: 'Pazartesi' }, { label: 'Salı' }, { label: 'Çarşamba' }, { label: 'Perşembe' }, { label: 'Cuma', taken: true }, { label: 'Cumartesi' }],
        rows: [
          { primary: 'Dt. Elif Karaca', secondary: 'Estetik diş hekimliği · gülüş tasarımı', value: '14 yıl' },
          { primary: 'Prof. Dr. Mert Aydın', secondary: 'Ağız & çene cerrahisi · implantoloji', value: '22 yıl' },
          { primary: 'Dt. Selin Yavuz', secondary: 'Ortodonti · şeffaf plak', value: '9 yıl' },
        ],
      },
      'Randevu': {
        mode: 'choose',
        summaryTitle: 'Randevu özeti',
        lead: 'Görüşme tipini ve saati seçip randevuyu onaylayın.',
        hint: 'Görüşme tipini seçin; uygun saatler altta açılır.',
        slotsLabel: 'Yarın uygun saatler',
        slots: [
          { label: '09:30' },
          { label: '10:15' },
          { label: '11:00', taken: true },
          { label: '13:45' },
          { label: '14:30' },
          { label: '16:00', taken: true },
          { label: '17:15' },
        ],
        confirmLabel: 'Randevuyu onayla',
        confirmedLabel: 'Randevunuz oluşturuldu, hatırlatma SMS gönderildi.',
        rows: [
          { primary: 'Ücretsiz ilk muayene', secondary: 'Panoramik röntgen dahil', value: '30 dk', tag: 'Bugün müsait' },
          { primary: 'Online ön görüşme', secondary: 'Görüntülü · fotoğrafla değerlendirme', value: '15 dk' },
          { primary: 'Tedavi planı sunumu', secondary: 'Yazılı fiyat ve takvim', value: '45 dk' },
          { primary: 'Kontrol randevusu', secondary: 'Devam eden tedaviler için', value: '20 dk' },
        ],
      },
      'Yorumlar': {
        mode: 'filter',
        summaryTitle: 'Hasta geri bildirimi',
        lead: 'Yorumları tedaviye göre süzün.',
        hint: 'Filtreyi değiştirin, liste anında güncellensin.',
        emptyLabel: 'Bu tedavi için henüz yorum yok.',
        filters: [{ label: 'Tedavi', options: ['Tümü', 'İmplant', 'Ortodonti', 'Estetik'] }],
        rows: [
          { primary: 'Kerem A.', secondary: 'İki implant, tek seansta bitti. Ağrısız süreç.', value: '5,0', facets: ['İmplant'] },
          { primary: 'Bahar T.', secondary: 'Şeffaf plakla 11 ayda tamamlandı.', value: '4,8', facets: ['Ortodonti'] },
          { primary: 'Sinem K.', secondary: 'Gülüş tasarımı simülasyonu birebir çıktı.', value: '5,0', facets: ['Estetik'], tag: 'Öne çıkan' },
          { primary: 'Onur D.', secondary: 'Cerrahi implant sonrası kontroller titizdi.', value: '4,9', facets: ['İmplant'] },
          { primary: 'Melis Y.', secondary: 'Zirkonyum kaplamada renk uyumu kusursuz.', value: '4,7', facets: ['Estetik'] },
          { primary: 'Tolga E.', secondary: 'Ortodonti sürecinde aylık kontroller aksamadı.', value: '4,9', facets: ['Ortodonti'] },
        ],
      },
    },
    navItems: ['Tedaviler', 'Hekimlerimiz', 'Randevu', 'Yorumlar'],
  },
  {
    id: 'emlak-portfoy',
    title: 'Emlak & Gayrimenkul',
    subtitle: 'Meridyen Gayrimenkul - Portföy',
    category: 'Emlak & Yatırım',
    path: '/demo/emlak-portfoy',
    icon: Building2,
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    accentColor: 'text-sky-400',
    metrics: 'İlan Görüntüleme: +%260 | Yükleme: 0.07s',
    preview: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=70',
    panels: {
      'Portföy': {
        mode: 'filter',
        summaryTitle: 'Arama sonucu',
        lead: 'Filtreleri değiştirin; ilanlara dokunarak karşılaştırmaya ekleyin.',
        hint: 'Filtreleri değiştirin, sonuç sayısı ve ortalamalar güncellensin.',
        emptyLabel: 'Bu kriterlere uyan ilan yok. Filtreleri gevşetin.',
        filters: [
          { label: 'Tip', options: ['Tümü', 'Daire', 'Villa', 'Rezidans', 'Köşk'] },
          { label: 'Bölge', options: ['Tümü', 'Sarıyer', 'Beşiktaş', 'Üsküdar', 'Kadıköy'] },
        ],
        rows: [
          { primary: 'Bebek · Boğaz Cepheli Daire', secondary: '3+1 · 185 m² · 2. kat', value: '₺48.500.000', amount: 48500000, area: 185, facets: ['Daire', 'Beşiktaş'], tag: 'Yeni ilan' },
          { primary: 'Zekeriyaköy · Havuzlu Villa', secondary: '6+2 · 480 m² · müstakil bahçe', value: '₺92.000.000', amount: 92000000, area: 480, facets: ['Villa', 'Sarıyer'] },
          { primary: 'Levent · Rezidans', secondary: '2+1 · 120 m² · 24. kat', value: '₺21.750.000', amount: 21750000, area: 120, facets: ['Rezidans', 'Beşiktaş'] },
          { primary: 'Kandilli · Tarihi Köşk', secondary: '7+2 · 620 m² · restore edilmiş', value: '₺67.000.000', amount: 67000000, area: 620, facets: ['Köşk', 'Üsküdar'] },
          { primary: 'Moda · Bahçe Katı Daire', secondary: '4+1 · 210 m² · özel bahçe', value: '₺28.400.000', amount: 28400000, area: 210, facets: ['Daire', 'Kadıköy'] },
          { primary: 'Tarabya · Deniz Manzaralı Villa', secondary: '5+1 · 390 m² · havuzlu', value: '₺74.000.000', amount: 74000000, area: 390, facets: ['Villa', 'Sarıyer'] },
          { primary: 'Çengelköy · Yalı Dairesi', secondary: '4+1 · 260 m² · iskeleli', value: '₺81.000.000', amount: 81000000, area: 260, facets: ['Daire', 'Üsküdar'], tag: 'Nadir' },
          { primary: 'Fenerbahçe · Rezidans', secondary: '3+1 · 165 m² · marina manzarası', value: '₺34.900.000', amount: 34900000, area: 165, facets: ['Rezidans', 'Kadıköy'] },
        ],
      },
      'Görüntüleme': {
        mode: 'choose',
        summaryTitle: 'Görüntüleme talebi',
        lead: 'Görüntüleme tipini ve saati seçin.',
        hint: 'Bir görüntüleme tipi seçin.',
        slotsLabel: 'Yarın uygun saatler',
        slots: [{ label: '10:00' }, { label: '11:30' }, { label: '13:00', taken: true }, { label: '14:30' }, { label: '16:00' }, { label: '17:30' }],
        confirmLabel: 'Görüntüleme talebi gönder',
        confirmedLabel: 'Talebiniz danışmana iletildi, 1 saat içinde dönülecek.',
        rows: [
          { primary: 'Yerinde gezi', secondary: 'Danışman eşliğinde · ulaşım dahil', value: '45 dk', tag: 'En çok tercih edilen' },
          { primary: 'Canlı video tur', secondary: 'Telefonla bağlantı · kayıt gönderilir', value: '20 dk' },
          { primary: 'Drone & çevre turu', secondary: 'Konum, manzara ve çevre analizi', value: '30 dk' },
          { primary: 'Yatırım sunumu', secondary: 'Getiri projeksiyonu · ofiste', value: '60 dk' },
        ],
      },
      'Danışmanlar': {
        mode: 'choose',
        summaryTitle: 'Görüntüleme talebi',
        lead: 'Danışmanı ve günü seçin; talep özeti birleşir.',
        hint: 'Bir danışman seçin.',
        slotsLabel: 'Uygun günler',
        slots: [{ label: 'Bugün' }, { label: 'Yarın' }, { label: 'Cumartesi' }, { label: 'Pazar', taken: true }],
        rows: [
          { primary: 'Ayşe Demir', secondary: 'Boğaz hattı uzmanı · 11 yıl', value: '38 satış' },
          { primary: 'Kaan Ersoy', secondary: 'Villa ve müstakil · 8 yıl', value: '24 satış' },
          { primary: 'Nil Aksoy', secondary: 'Rezidans ve yatırım · 6 yıl', value: '31 satış' },
        ],
      },
    },
    navItems: ['Portföy', 'Görüntüleme', 'Danışmanlar'],
  },
  {
    id: 'spor-salonu',
    title: 'Spor Salonu & Fitness',
    subtitle: 'Forge Athletic Club',
    category: 'Spor & Sağlıklı Yaşam',
    path: '/demo/spor-salonu',
    icon: Dumbbell,
    badgeColor: 'border-lime-500/30 text-lime-400 bg-lime-500/10',
    accentColor: 'text-lime-400',
    metrics: 'Üyelik Başvurusu: +%215 | Yükleme: 0.05s',
    preview: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=70',
    panels: {
      'Paketler': {
        mode: 'select',
        summaryTitle: 'Üyelik özeti',
        lead: 'Paketleri ve ek hizmetleri seçin.',
        hint: 'Bir paket seçin, toplam burada çıksın.',
        rows: [
          { primary: 'Sınırsız Aylık', secondary: 'Tüm dersler + ekipman alanı', value: '₺2.400', amount: 2400, tag: 'En popüler' },
          { primary: 'Yıllık Peşin', secondary: '2 ay hediye · dondurma hakkı', value: '₺24.000', amount: 24000 },
          { primary: 'Kişisel Antrenman', secondary: '8 seans paketi · birebir', value: '₺9.600', amount: 9600 },
        ],
      },
      'Ders Programı': {
        mode: 'choose',
        summaryTitle: 'Ders rezervasyonu',
        lead: 'Dersi ve saati seçin.',
        hint: 'Bir ders seçin.',
        slotsLabel: 'Uygun seanslar',
        slots: [{ label: '07:00' }, { label: '12:30' }, { label: '18:30', taken: true }, { label: '19:00' }, { label: '20:15' }],
        confirmLabel: 'Derse yazıl',
        confirmedLabel: 'Yeriniz ayrıldı, ders öncesi hatırlatma gönderilecek.',
        rows: [
          { primary: 'Fonksiyonel HIIT', secondary: 'Salon A · orta-ileri seviye', value: '12/16 dolu' },
          { primary: 'Olimpik Halter', secondary: 'Platform · teknik odaklı', value: '6/10 dolu' },
          { primary: 'Reformer Pilates', secondary: 'Stüdyo · tüm seviyeler', value: 'Yedek listesi' },
        ],
      },
      'Deneme': {
        mode: 'choose',
        summaryTitle: 'Deneme randevusu',
        lead: 'Deneme tipini ve günü seçin.',
        hint: 'Bir deneme tipi seçin.',
        slotsLabel: 'Uygun günler',
        slots: [{ label: 'Bugün' }, { label: 'Yarın' }, { label: 'Cumartesi' }],
        confirmLabel: 'Denemeyi ayarla',
        confirmedLabel: 'Deneme gününüz kaydedildi.',
        rows: [
          { primary: 'Ücretsiz deneme günü', secondary: 'Tüm alanlar + 1 grup dersi', value: '1 gün', tag: 'Kayıt gerekmez' },
          { primary: 'Vücut analizi', secondary: 'InBody ölçümü + yorum', value: '20 dk' },
          { primary: 'Antrenör eşliğinde tur', secondary: 'Program önerisiyle', value: '30 dk' },
        ],
      },
    },
    navItems: ['Paketler', 'Ders Programı', 'Deneme'],
  },
];

const FEATURED_IDS = ['gurme-restoran', 'emlak-portfoy', 'klinik-saglik'];
const DEMO_LIST: DemoItem[] = FEATURED_IDS.map(
  (id) => ALL_DEMOS.find((demo) => demo.id === id)!,
);

// --- COMPONENTS ---

// --- DEMO ETKİLEŞİM MOTORU ---

/**
 * Türkçe binlik ayracı elle yazıldı: Intl'in sunucu ve tarayıcıda farklı ICU
 * sürümüne düşme ihtimali var, bu da hidrasyon uyuşmazlığı demek. Basit bir
 * regex burada hem deterministik hem yeterli.
 */
const formatTRY = (value: number) =>
  `₺${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const TR_SLUG_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  â: 'a',
  î: 'i',
  û: 'u',
};

/** Adres çubuğunda gerçek bir yol görünsün diye sekme adı slug'a çevriliyor. */
const slugify = (value: string) =>
  value
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşüâîû]/g, (char) => TR_SLUG_MAP[char] ?? char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ALL_OPTION = 'Tümü';

/**
 * Önizlemenin tüm oturum durumu tek yerde:
 * `cart` sekmeler arası taşınır (menüden seçip rezervasyon sekmesine geçince
 * sipariş kaybolmasın), `choices` sekme başına, `filters` sekme + grup başına.
 */
interface DemoState {
  cart: Record<string, number>;
  choices: Record<string, { row?: string; slot?: string }>;
  filters: Record<string, Record<string, string>>;
  confirmed: boolean;
}

interface DemoActions {
  addItem: (key: string) => void;
  changeQty: (key: string, delta: number) => void;
  toggleItem: (key: string) => void;
  clearCart: () => void;
  chooseRow: (tab: string, primary: string) => void;
  chooseSlot: (tab: string, slot: string) => void;
  setFilter: (tab: string, group: string, option: string) => void;
  resetFilters: (tab: string) => void;
  confirm: () => void;
  reset: () => void;
}

const EMPTY_DEMO_STATE: DemoState = { cart: {}, choices: {}, filters: {}, confirmed: false };

/** Aynı ürün adı iki sekmede geçebilir; anahtar sekmeyle birlikte üretiliyor. */
const rowKey = (tab: string, row: PanelRow) => `${tab}|${row.primary}`;

/**
 * WAI-ARIA "tabs" klavye kalıbı: ok tuşları odağı taşır ve sekmeyi anında
 * açar (panel hazır olduğu için otomatik etkinleştirme doğru davranış),
 * Home/End uçlara gider. Odağı elle taşımak için düğme ref'leri tutuluyor.
 */
function useRovingTabs(
  count: number,
  onSelect: (index: number) => void,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target = -1;
    if (event.key === nextKey) target = (index + 1) % count;
    else if (event.key === prevKey) target = (index - 1 + count) % count;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = count - 1;
    if (target < 0) return;

    event.preventDefault();
    onSelect(target);
    refs.current[target]?.focus();
  };

  return { refs, handleKeyDown };
}

/** Saat/gün seçici. Dolu yuvalar devre dışı ama görünür kalıyor. */
const SlotPicker: FC<{
  slots: PanelSlot[];
  label: string;
  selected?: string;
  onSelect: (slot: string) => void;
}> = ({ slots, label, selected, onSelect }) => (
  <div className="mt-3">
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {slots.map((slot) => {
        const isSelected = selected === slot.label;
        return (
          <button
            key={slot.label}
            type="button"
            disabled={slot.taken}
            aria-pressed={isSelected}
            onClick={() => onSelect(slot.label)}
            className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] tabular-nums transition-colors ${
              slot.taken
                ? 'cursor-not-allowed border-slate-800/70 text-slate-600 line-through'
                : isSelected
                  ? 'border-brand-400 bg-brand-500/20 font-semibold text-white'
                  : 'border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
          >
            {slot.label}
            {slot.taken && <span className="sr-only"> (dolu)</span>}
          </button>
        );
      })}
    </div>
  </div>
);

/** Filtre çipleri: her grup tek seçimlik, varsayılan "Tümü". */
const FilterBar: FC<{
  groups: { label: string; options: string[] }[];
  active: Record<string, string>;
  onChange: (group: string, option: string) => void;
}> = ({ groups, active, onChange }) => (
  <div className="mb-3 space-y-2">
    {groups.map((group) => (
      <div key={group.label} className="flex flex-wrap items-center gap-1.5">
        <span className="mr-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {group.label}
        </span>
        {group.options.map((option) => {
          const isActive = (active[group.label] ?? ALL_OPTION) === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(group.label, option)}
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                isActive
                  ? 'border-brand-400 bg-brand-500/20 font-semibold text-white'
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    ))}
  </div>
);

/**
 * Özet kartı: etkileşimin karşılığının görüldüğü yer.
 * Sipariş toplamı, randevu kartı ve arama istatistikleri aynı kabuğu paylaşıyor;
 * kullanıcı sektör değiştirse de "sonucun burada çıktığını" öğreniyor.
 */
const SummaryCard: FC<{
  demo: DemoItem;
  activeTab: string;
  panel: DemoPanel;
  state: DemoState;
  actions: DemoActions;
  visibleRows: PanelRow[];
}> = ({ demo, activeTab, panel, state, actions, visibleRows }) => {
  // Sepet satırları sekmeler arasında dağılmış olabilir; adı ve fiyatı
  // bulmak için tüm panelleri tek bir dizine indiriyoruz.
  const rowIndex = useMemo(() => {
    const map = new Map<string, PanelRow>();
    Object.entries(demo.panels).forEach(([tab, tabPanel]) => {
      tabPanel.rows.forEach((row) => map.set(rowKey(tab, row), row));
    });
    return map;
  }, [demo]);

  const cartLines = Object.entries(state.cart).flatMap(([key, qty]) => {
    const row = rowIndex.get(key);
    return row && qty > 0 ? [{ key, qty, row }] : [];
  });

  const subtotal = cartLines.reduce((sum, line) => sum + (line.row.amount ?? 0) * line.qty, 0);
  const feeAmount = panel.fee ? Math.round((subtotal * panel.fee.percent) / 100) : 0;
  const total = subtotal + feeAmount;

  const SummaryIcon =
    panel.mode === 'select' ? ShoppingCart : panel.mode === 'choose' ? CalendarCheck : SlidersHorizontal;

  const shellClass =
    'rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 sm:p-4';
  const ctaClass =
    'inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-500';
  const ghostClass =
    'inline-flex items-center gap-1 rounded-full border border-slate-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 transition-colors hover:border-slate-600 hover:text-white';

  const header = (
    <div className="flex items-center justify-between gap-2">
      <h4 className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
        <SummaryIcon className="h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden="true" />
        <span className="truncate">{panel.summaryTitle}</span>
      </h4>
    </div>
  );

  if (panel.mode === 'select') {
    return (
      <div className={shellClass} role="status" aria-live="polite">
        {header}

        {cartLines.length === 0 ? (
          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">{panel.hint}</p>
        ) : (
          <>
            <ul className="mt-2.5 space-y-1.5">
              {cartLines.slice(0, 4).map((line) => (
                <li key={line.key} className="flex items-start justify-between gap-2 text-[11px]">
                  <span className="min-w-0 truncate text-slate-300">
                    <span className="font-mono text-slate-500">{line.qty}×</span> {line.row.primary}
                  </span>
                  <span className="shrink-0 font-mono tabular-nums text-slate-400">
                    {typeof line.row.amount === 'number'
                      ? formatTRY(line.row.amount * line.qty)
                      : line.row.value}
                  </span>
                </li>
              ))}
              {cartLines.length > 4 && (
                <li className="font-mono text-[10px] text-slate-500">
                  +{cartLines.length - 4} kalem daha
                </li>
              )}
            </ul>

            {subtotal > 0 && (
              <dl className="mt-3 space-y-1 border-t border-slate-800 pt-2.5 font-mono text-[11px]">
                {panel.fee && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500">Ara toplam</dt>
                      <dd className="tabular-nums text-slate-300">{formatTRY(subtotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500">{panel.fee.label}</dt>
                      <dd className="tabular-nums text-slate-300">{formatTRY(feeAmount)}</dd>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <dt className="text-[12px] font-semibold text-white">Toplam</dt>
                  <dd className={`text-[14px] font-bold tabular-nums ${demo.accentColor}`}>
                    {formatTRY(total)}
                  </dd>
                </div>
              </dl>
            )}

            {panel.installments && total > 0 && (
              <p className="mt-1.5 font-mono text-[10px] text-slate-500">
                {panel.installments} ay taksitle {formatTRY(total / panel.installments)}/ay
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link href={demo.path} className={ctaClass}>
                Devam et
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
              <button type="button" onClick={actions.clearCart} className={ghostClass}>
                <Trash2 className="h-3 w-3" aria-hidden="true" />
                Temizle
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (panel.mode === 'choose') {
    // Randevu iki sekmeye yayılabiliyor (hekim bir sekmede, saat diğerinde);
    // özet bu yüzden demonun tüm "choose" panellerini birlikte gösteriyor.
    const chosen = demo.navItems
      .filter((tab) => demo.panels[tab]?.mode === 'choose')
      .map((tab) => ({ tab, ...(state.choices[tab] ?? {}) }))
      .filter((entry) => entry.row || entry.slot);

    const current = state.choices[activeTab] ?? {};
    const ready = Boolean(current.row) && (!panel.slots || Boolean(current.slot));

    return (
      <div className={shellClass} role="status" aria-live="polite">
        {header}

        {chosen.length === 0 ? (
          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">{panel.hint}</p>
        ) : (
          <dl className="mt-2.5 space-y-1.5">
            {chosen.map((entry) => (
              <div key={entry.tab} className="flex items-start justify-between gap-2 text-[11px]">
                <dt className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {entry.tab}
                </dt>
                <dd className="min-w-0 text-right text-slate-200">
                  <span className="block truncate">{entry.row ?? 'Seçilmedi'}</span>
                  {entry.slot && (
                    <span className={`font-mono tabular-nums ${demo.accentColor}`}>{entry.slot}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {state.confirmed ? (
          <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-2 text-[11px] leading-relaxed text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {panel.confirmedLabel ?? 'Talebiniz alındı.'}
          </p>
        ) : (
          panel.confirmLabel && (
            <button
              type="button"
              onClick={actions.confirm}
              disabled={!ready}
              className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                ready
                  ? 'bg-brand-600 text-white hover:bg-brand-500'
                  : 'cursor-not-allowed bg-slate-800/70 text-slate-500'
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {panel.confirmLabel}
            </button>
          )
        )}

        {!ready && !state.confirmed && (
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">
            {current.row ? 'Bir saat seçin.' : 'Listeden bir satır seçin.'}
          </p>
        )}
      </div>
    );
  }

  // filter: sonuç sayısı ve ortalamalar seçili filtrelere göre canlı hesaplanıyor
  const priced = visibleRows.filter((row) => typeof row.amount === 'number');
  const average = priced.length
    ? priced.reduce((sum, row) => sum + (row.amount ?? 0), 0) / priced.length
    : 0;
  const withArea = visibleRows.filter((row) => row.amount && row.area);
  const unitPrice = withArea.length
    ? withArea.reduce((sum, row) => sum + (row.amount ?? 0), 0) /
      withArea.reduce((sum, row) => sum + (row.area ?? 0), 0)
    : 0;
  const activeFilters = Object.entries(state.filters[activeTab] ?? {}).filter(
    ([, option]) => option !== ALL_OPTION,
  );

  return (
    <div className={shellClass} role="status" aria-live="polite">
      {header}

      <dl className="mt-2.5 space-y-1.5 font-mono text-[11px]">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-500">Sonuç</dt>
          <dd className={`font-semibold tabular-nums ${demo.accentColor}`}>
            {visibleRows.length} kayıt
          </dd>
        </div>
        {average > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-slate-500">Ortalama fiyat</dt>
            <dd className="tabular-nums text-slate-300">{formatTRY(average)}</dd>
          </div>
        )}
        {unitPrice > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-slate-500">m² birim fiyatı</dt>
            <dd className="tabular-nums text-slate-300">{formatTRY(unitPrice)}</dd>
          </div>
        )}
        {cartLines.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-slate-500">Karşılaştırmada</dt>
            <dd className="tabular-nums text-slate-300">{cartLines.length} kayıt</dd>
          </div>
        )}
      </dl>

      {activeFilters.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-800 pt-2.5">
          {activeFilters.map(([group, option]) => (
            <span
              key={group}
              className="rounded-full border border-slate-700 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-300"
            >
              {group}: {option}
            </span>
          ))}
          <button
            type="button"
            onClick={() => actions.resetFilters(activeTab)}
            className={ghostClass}
          >
            <RotateCw className="h-3 w-3" aria-hidden="true" />
            Sıfırla
          </button>
        </div>
      ) : (
        <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">{panel.hint}</p>
      )}
    </div>
  );
};

/**
 * Demo önizlemesi: solda sektör görseli ve özet, sağda çalışan liste.
 *
 * Liste artık defter satırı değil arayüz: satırlar tıklanabilir, seçim
 * soldaki özete işliyor. Mobilde sıra görsel → liste → özet; önce ne
 * yapacağını görüp sonra sonucu okuyorsun.
 */
const DemoPreview: FC<{
  demo: DemoItem;
  activeTab: string;
  state: DemoState;
  actions: DemoActions;
  panelId: string;
  labelledById: string;
}> = ({ demo, activeTab, state, actions, panelId, labelledById }) => {
  const panel = demo.panels[activeTab] ?? demo.panels[demo.navItems[0]];
  const Icon = demo.icon;
  const reduceMotion = useReducedMotion();

  const activeFilters = state.filters[activeTab] ?? {};
  const visibleRows =
    panel.mode === 'filter' && panel.filters
      ? panel.rows.filter((row) =>
          (panel.filters ?? []).every((group, index) => {
            const picked = activeFilters[group.label] ?? ALL_OPTION;
            return picked === ALL_OPTION || row.facets?.[index] === picked;
          }),
        )
      : panel.rows;

  // Sekme geçişinde içerik yumuşak giriyor; hareket azaltma tercihinde
  // sadece anında değişiyor (framer-motion useReducedMotion).
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
      };

  const renderMarker = (selected: boolean) => {
    if (panel.mode === 'filter') {
      return (
        <Star
          className={`mt-0.5 h-4 w-4 shrink-0 transition-colors ${
            selected ? 'fill-current text-brand-400' : 'text-slate-700 group-hover:text-slate-500'
          }`}
          aria-hidden="true"
        />
      );
    }

    return (
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected
            ? 'border-brand-400 bg-brand-500 text-white'
            : 'border-slate-700 text-slate-700 group-hover:border-slate-500'
        }`}
        aria-hidden="true"
      >
        {selected ? (
          <Check className="h-2.5 w-2.5" />
        ) : panel.mode === 'select' ? (
          <Plus className="h-2.5 w-2.5" />
        ) : null}
      </span>
    );
  };

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={labelledById}
      className="grid gap-3.5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-5"
    >
      {/* Sektörün gerçek görseli — demoları birbirinden ayıran asıl unsur */}
      <div className="relative order-1 min-h-[150px] overflow-hidden rounded-2xl border border-slate-800 sm:min-h-[200px] lg:col-start-1 lg:row-start-1">
        <SafeImage
          src={demo.preview}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 1024px) 100vw, 34vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${demo.badgeColor}`}
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {demo.category}
          </span>
          <p className="mt-2 font-display text-base font-bold leading-tight tracking-tight text-white sm:text-lg">
            {demo.subtitle}
          </p>
        </div>
      </div>

      {/* Çalışan liste */}
      <div className="order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-[340px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${demo.id}-${activeTab}-rows`} {...motionProps}>
            {panel.lead && (
              <p className="mb-2.5 text-[11px] leading-relaxed text-slate-500">{panel.lead}</p>
            )}

            {panel.mode === 'filter' && panel.filters && (
              <FilterBar
                groups={panel.filters}
                active={activeFilters}
                onChange={(group, option) => actions.setFilter(activeTab, group, option)}
              />
            )}

            <ul className="divide-y divide-slate-800/70 border-y border-slate-800/70">
              {visibleRows.map((row) => {
                const key = rowKey(activeTab, row);
                const qty = state.cart[key] ?? 0;
                const selected =
                  panel.mode === 'choose'
                    ? state.choices[activeTab]?.row === row.primary
                    : qty > 0;

                const onRowClick = () => {
                  if (panel.mode === 'select') actions.addItem(key);
                  else if (panel.mode === 'choose') actions.chooseRow(activeTab, row.primary);
                  else actions.toggleItem(key);
                };

                return (
                  <li key={key} className="flex items-center gap-1.5 py-1">
                    <button
                      type="button"
                      onClick={onRowClick}
                      aria-pressed={selected}
                      className="group flex min-w-0 flex-1 items-start gap-2.5 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-slate-900/70"
                    >
                      {renderMarker(selected)}

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-[13px] font-semibold text-white sm:text-sm">
                            {row.primary}
                          </span>
                          {row.tag && (
                            <span
                              className={`rounded-full border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${demo.badgeColor}`}
                            >
                              {row.tag}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                          {row.secondary}
                        </span>
                        {panel.mode === 'filter' && row.amount && row.area && (
                          <span className="mt-0.5 block font-mono text-[10px] tabular-nums text-slate-600">
                            {formatTRY(row.amount / row.area)} / m²
                          </span>
                        )}
                      </span>

                      <span
                        className={`shrink-0 font-mono text-[12px] font-semibold tabular-nums sm:text-[13px] ${
                          selected ? demo.accentColor : 'text-slate-400'
                        }`}
                      >
                        {row.value}
                      </span>
                    </button>

                    {/* Adet kontrolü ayrı düğmeler: iç içe <button> geçersiz olurdu */}
                    {panel.mode === 'select' && qty > 0 && (
                      <span className="flex shrink-0 items-center gap-0.5 rounded-full border border-slate-800 bg-slate-900 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => actions.changeQty(key, -1)}
                          aria-label={`${row.primary} adedini azalt`}
                          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                        >
                          <Minus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <span className="min-w-[14px] text-center font-mono text-[11px] font-semibold tabular-nums text-white">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => actions.changeQty(key, 1)}
                          aria-label={`${row.primary} adedini artır`}
                          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                        >
                          <Plus className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </span>
                    )}
                  </li>
                );
              })}

              {visibleRows.length === 0 && (
                <li className="flex flex-wrap items-center justify-between gap-2 py-4">
                  <span className="text-[12px] text-slate-500">
                    {panel.emptyLabel ?? 'Sonuç bulunamadı.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => actions.resetFilters(activeTab)}
                    className="rounded-full border border-slate-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                  >
                    Filtreleri sıfırla
                  </button>
                </li>
              )}
            </ul>

            {panel.mode === 'choose' && panel.slots && (
              <SlotPicker
                slots={panel.slots}
                label={panel.slotsLabel ?? 'Uygun saatler'}
                selected={state.choices[activeTab]?.slot}
                onSelect={(slot) => actions.chooseSlot(activeTab, slot)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Etkileşimin karşılığı */}
      <div className="order-3 min-w-0 lg:col-start-1 lg:row-start-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${demo.id}-${activeTab}-summary`} {...motionProps}>
            <SummaryCard
              demo={demo}
              activeTab={activeTab}
              panel={panel}
              state={state}
              actions={actions}
              visibleRows={visibleRows}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};


const BenchmarkSimulator: FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [progressOld, setProgressOld] = useState(0);
  const [progressKodara, setProgressKodara] = useState(0);
  const [oldStatus, setOldStatus] = useState<'idle' | 'loading' | 'failed' | 'done'>('idle');
  const [kodaraStatus, setKodaraStatus] = useState<'idle' | 'done'>('idle');

  const runBenchmark = () => {
    setIsTesting(true);
    setProgressOld(0);
    setProgressKodara(0);
    setOldStatus('loading');
    setKodaraStatus('idle');

    setTimeout(() => {
      setProgressKodara(100);
      setKodaraStatus('done');
    }, 120);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgressOld(100);
        setOldStatus('failed');
        setIsTesting(false);
        clearInterval(interval);
      } else {
        setProgressOld(currentProgress);
      }
    }, 350);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl sm:p-7">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:gap-4 sm:pb-5">
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="text-left">
            <h3 className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
              Karşılaştırmalı yükleme testi
            </h3>
            <p className="text-[11px] text-slate-400 sm:text-xs">
              Sayfa yükleme sürelerinin dönüşüm oranlarına etkisi
            </p>
          </div>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isTesting}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors sm:w-auto ${
            isTesting
              ? 'cursor-not-allowed bg-slate-800 text-slate-500'
              : 'bg-brand-600 text-white hover:bg-brand-500'
          }`}
        >
          <Zap className="h-4 w-4 fill-current" aria-hidden="true" />
          {isTesting ? 'Test yapılıyor...' : 'Testi başlat'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 text-left md:grid-cols-2 sm:gap-5">
        <div className="space-y-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
              <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                Klasik monolitik site
              </span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-slate-500 sm:text-[11px]">
              ~3,8 sn
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-400">Yükleme durumu</span>
              <span className="font-semibold tabular-nums text-rose-400">{progressOld}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900">
              <motion.div
                className="h-full bg-rose-500"
                animate={{ width: `${progressOld}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1 font-mono text-xs sm:pt-2">
            <div className="flex justify-between text-slate-400">
              <span>Sunucu yanıtı (TTFB)</span>
              <span className="font-semibold tabular-nums text-rose-400">
                {oldStatus === 'idle' ? '—' : '1.240 ms'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Core Web Vitals</span>
              <span className="font-semibold tabular-nums text-rose-400">
                {oldStatus === 'idle' ? '—' : '38 / 100'}
              </span>
            </div>
          </div>

          {oldStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 font-mono text-[11px] text-rose-400 sm:text-xs"
            >
              <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Yüksek terk etme oranı: kullanıcılar ayrıldı.</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-3.5 rounded-2xl border border-brand-500/30 bg-slate-950/60 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand-400" />
              <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                Kodara Edge Core
              </span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-emerald-400 sm:text-[11px]">
              48 ms
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-400">Yükleme durumu</span>
              <span className="font-semibold tabular-nums text-brand-400">{progressKodara}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900">
              <motion.div
                className="h-full bg-brand-500"
                animate={{ width: `${progressKodara}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1 font-mono text-xs sm:pt-2">
            <div className="flex justify-between text-slate-400">
              <span>Sunucu yanıtı (TTFB)</span>
              <span className="font-semibold tabular-nums text-emerald-400">
                {kodaraStatus === 'idle' ? '—' : '48 ms'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Core Web Vitals</span>
              <span className="font-semibold tabular-nums text-emerald-400">
                {kodaraStatus === 'idle' ? '—' : 'Tümü yeşil'}
              </span>
            </div>
          </div>

          {kodaraStatus === 'done' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 font-mono text-[11px] text-emerald-400 sm:text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Anında hidrasyon, sıfır bekleme.</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Tarayıcı maketi.
 *
 * Adres çubuğu artık gerçek bir yol yazıyor (sekme değişince de değişiyor),
 * altındaki şerit sitenin menüsü gibi davranıyor ve her geçişte ince bir
 * yükleme çizgisi akıyor. Amaç: "bu bir ekran görüntüsü değil, site" hissi.
 */
const BrowserMockup: FC<{
  demo: DemoItem;
  activeTab: string;
  onTabChange: (tab: string) => void;
  state: DemoState;
  actions: DemoActions;
  idPrefix: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  fullscreenButtonRef?: React.Ref<HTMLButtonElement>;
  mockupId?: string;
  labelledById?: string;
}> = ({
  demo,
  activeTab,
  onTabChange,
  state,
  actions,
  idPrefix,
  isFullscreen,
  onToggleFullscreen,
  fullscreenButtonRef,
  mockupId,
  labelledById,
}) => {
  const reduceMotion = useReducedMotion();
  const { refs, handleKeyDown } = useRovingTabs(demo.navItems.length, (index) =>
    onTabChange(demo.navItems[index]),
  );

  const Icon = demo.icon;
  const activeIndex = Math.max(0, demo.navItems.indexOf(activeTab));
  const panelId = `${idPrefix}-panel`;
  const activeTabId = `${idPrefix}-tab-${activeIndex}`;

  return (
    <div
      id={mockupId}
      role={labelledById ? 'tabpanel' : undefined}
      aria-labelledby={labelledById}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-left shadow-2xl shadow-black/50"
    >
      {/* Tarayıcı kromu */}
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-2.5 py-2 sm:px-4 sm:py-2.5">
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <span className="h-2 w-2 rounded-full bg-slate-700" />
          <span className="h-2 w-2 rounded-full bg-slate-700" />
        </div>

        <div className="flex items-center gap-0.5 text-slate-600" aria-hidden="true">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5" />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-[10px] text-slate-300 sm:text-[11px]">
          <Lock className="h-2.5 w-2.5 shrink-0 text-emerald-500" aria-hidden="true" />
          <span className="hidden shrink-0 text-slate-500 sm:inline">https://kodara.com/demo/</span>
          <span className="truncate">
            <span className="font-semibold text-white">{demo.id}</span>
            <span className="text-slate-500">/{slugify(activeTab)}</span>
          </span>
        </div>

        {/* Yenile = önizleme oturumunu sıfırla; tarayıcı metaforunun karşılığı */}
        <button
          type="button"
          onClick={actions.reset}
          aria-label="Önizlemeyi sıfırla"
          title="Önizlemeyi sıfırla"
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          ref={fullscreenButtonRef}
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Demoyu tam ekran önizle'}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-800 px-2 py-1.5 font-mono text-[11px] text-slate-200 transition-colors hover:bg-slate-700"
        >
          {isFullscreen ? (
            <Minimize2 className="h-3 w-3" aria-hidden="true" />
          ) : (
            <Maximize2 className="h-3 w-3" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{isFullscreen ? 'Küçült' : 'Tam ekran'}</span>
        </button>
      </div>

      {/* Site menüsü = sekmeler */}
      <div className="relative border-b border-slate-800 bg-slate-900/50">
        <div
          role="tablist"
          aria-label={`${demo.title} bölümleri`}
          className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2"
        >
          {demo.navItems.map((item, index) => {
            const isActive = item === activeTab;
            return (
              <button
                key={item}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                role="tab"
                id={`${idPrefix}-tab-${index}`}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(item)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 font-mono text-[11px] transition-colors sm:text-xs ${
                  isActive
                    ? 'border-brand-500 font-semibold text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Sayfa değişiminde akan yükleme çizgisi (hareket azaltmada yok) */}
        {!reduceMotion && (
          <motion.span
            key={`${demo.id}-${activeTab}-progress`}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand-500"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        )}
      </div>

      <div className="space-y-3.5 bg-slate-950 p-3 sm:space-y-5 sm:p-5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 text-xs">
          <div className="flex min-w-0 items-center gap-2 font-semibold text-white">
            <Icon className={`h-4 w-4 shrink-0 ${demo.accentColor}`} aria-hidden="true" />
            <span className="truncate">{demo.subtitle}</span>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Canlı önizleme
          </span>
        </div>

        <DemoPreview
          demo={demo}
          activeTab={activeTab}
          state={state}
          actions={actions}
          panelId={panelId}
          labelledById={activeTabId}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-400 sm:p-3 sm:text-xs">
          <div className="flex min-w-0 items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{demo.metrics}</span>
          </div>
          <Link
            href={demo.path}
            className="ml-auto flex shrink-0 items-center gap-1 text-brand-400 hover:underline"
          >
            <span>Sayfaya git</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Canlı demo vitrini.
 *
 * Solda dar bir sektör dizini (okuma sırası: seç → dene), sağda iki kat geniş
 * çalışan maket. Aktif satırdan makete uzanan kot çizgisi ikisini bağlıyor.
 * Her sektör kendi oturumunu tutuyor; sektör değişince önizleme sıfırlanıyor.
 */
const LiveDemoShowcase: FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoItem>(DEMO_LIST[0]);
  const [mockupTab, setMockupTab] = useState<string>(DEMO_LIST[0].navItems[0]);
  const [demoState, setDemoState] = useState<DemoState>(EMPTY_DEMO_STATE);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  const fullscreenTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleDemoChange = (demo: DemoItem) => {
    setActiveDemo(demo);
    setMockupTab(demo.navItems[0]);
    // Sektör değişince sepet/randevu taşınmamalı: her demo kendi oturumu.
    setDemoState(EMPTY_DEMO_STATE);
  };

  const { refs: demoRefs, handleKeyDown: handleDemoKeyDown } = useRovingTabs(
    DEMO_LIST.length,
    (index) => handleDemoChange(DEMO_LIST[index]),
    'vertical',
  );

  // Eylemler tek yerde toplandı; hem satır içi hem tam ekran maket aynı
  // duruma bağlı, böylece tam ekrana geçince sipariş kaybolmuyor.
  const actions: DemoActions = useMemo(
    () => ({
      addItem: (key) =>
        setDemoState((prev) => ({
          ...prev,
          confirmed: false,
          cart: { ...prev.cart, [key]: (prev.cart[key] ?? 0) + 1 },
        })),
      changeQty: (key, delta) =>
        setDemoState((prev) => {
          const next = { ...prev.cart };
          const qty = (next[key] ?? 0) + delta;
          if (qty <= 0) delete next[key];
          else next[key] = qty;
          return { ...prev, cart: next, confirmed: false };
        }),
      toggleItem: (key) =>
        setDemoState((prev) => {
          const next = { ...prev.cart };
          if (next[key]) delete next[key];
          else next[key] = 1;
          return { ...prev, cart: next, confirmed: false };
        }),
      clearCart: () => setDemoState((prev) => ({ ...prev, cart: {}, confirmed: false })),
      chooseRow: (tab, primary) =>
        setDemoState((prev) => ({
          ...prev,
          confirmed: false,
          choices: { ...prev.choices, [tab]: { ...prev.choices[tab], row: primary } },
        })),
      chooseSlot: (tab, slot) =>
        setDemoState((prev) => ({
          ...prev,
          confirmed: false,
          choices: { ...prev.choices, [tab]: { ...prev.choices[tab], slot } },
        })),
      setFilter: (tab, group, option) =>
        setDemoState((prev) => ({
          ...prev,
          filters: { ...prev.filters, [tab]: { ...prev.filters[tab], [group]: option } },
        })),
      resetFilters: (tab) =>
        setDemoState((prev) => ({ ...prev, filters: { ...prev.filters, [tab]: {} } })),
      confirm: () => setDemoState((prev) => ({ ...prev, confirmed: true })),
      reset: () => setDemoState(EMPTY_DEMO_STATE),
    }),
    [],
  );

  const closeFullscreen = () => {
    setIsFullscreenPreview(false);
    // Odak, tam ekranı açan düğmeye geri dönmeli (klavye kullanıcısı kaybolmasın).
    window.setTimeout(() => fullscreenTriggerRef.current?.focus(), 0);
  };

  // Tam ekranda Esc kapatır, arka plan kaymaz, odak kapatma düğmesine gider.
  useEffect(() => {
    if (!isFullscreenPreview) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreenPreview(false);
        window.setTimeout(() => fullscreenTriggerRef.current?.focus(), 0);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreenPreview]);

  const Icon = activeDemo.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* Tam ekran önizleme */}
      <AnimatePresence>
        {isFullscreenPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeDemo.title} tam ekran önizleme`}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 p-3 backdrop-blur-2xl sm:p-6"
          >
            <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className={`shrink-0 rounded-lg border p-1.5 sm:p-2 ${activeDemo.badgeColor}`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-bold text-white sm:text-base">
                      {activeDemo.title}
                    </h3>
                    <p className="truncate font-mono text-[10px] text-slate-400 sm:text-xs">
                      {activeDemo.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeFullscreen}
                  className="ml-2 shrink-0 rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-300 transition-colors hover:text-white"
                  aria-label="Önizlemeyi kapat"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Tam ekranda da sektör değiştirilebilsin diye kısa yol */}
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                {DEMO_LIST.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleDemoChange(demo)}
                    aria-pressed={demo.id === activeDemo.id}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      demo.id === activeDemo.id
                        ? 'border-brand-400 bg-brand-500/20 font-semibold text-white'
                        : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {demo.category}
                  </button>
                ))}
              </div>

              <BrowserMockup
                demo={activeDemo}
                activeTab={mockupTab}
                onTabChange={setMockupTab}
                state={demoState}
                actions={actions}
                idPrefix="fs-demo"
                isFullscreen
                onToggleFullscreen={closeFullscreen}
              />

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-800 pt-3 font-mono text-[10px] text-slate-400 sm:text-xs">
                <span>Edge simülatör modu · kapatmak için Esc</span>
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-500"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sol: sektör dizini */}
      <div className="min-w-0 lg:col-span-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500" id="demo-sector-label">
          Sektör seçin
        </p>

        <ul
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby="demo-sector-label"
          className="mt-4"
        >
          {DEMO_LIST.map((demo, i) => {
            const DemoIcon = demo.icon;
            const isSelected = activeDemo.id === demo.id;

            return (
              <li key={demo.id} role="presentation" className="relative">
                <button
                  type="button"
                  role="tab"
                  id={`demo-sector-tab-${i}`}
                  aria-selected={isSelected}
                  aria-controls="demo-mockup"
                  tabIndex={isSelected ? 0 : -1}
                  ref={(node) => {
                    demoRefs.current[i] = node;
                  }}
                  onKeyDown={(event) => handleDemoKeyDown(event, i)}
                  onClick={() => handleDemoChange(demo)}
                  className={`group flex w-full items-center gap-3.5 border-t border-slate-800/80 py-4 text-left transition-colors last:border-b sm:gap-4 ${
                    isSelected ? '' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular-nums transition-colors ${
                      isSelected ? 'text-brand-400' : 'text-slate-600'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-800 sm:h-14 sm:w-20">
                    <SafeImage
                      src={demo.preview}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="80px"
                      className={`object-cover transition-all duration-500 ${
                        isSelected
                          ? 'scale-105 opacity-90'
                          : 'opacity-45 grayscale group-hover:opacity-70 group-hover:grayscale-0'
                      }`}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-display text-sm font-bold leading-tight tracking-tight transition-colors sm:text-base ${
                        isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {demo.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-slate-500 sm:text-[11px]">
                      <DemoIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{demo.category}</span>
                    </span>
                  </span>

                  {/* lg'de aktiflik zaten renk + kot çizgisiyle okunuyor;
                      rozet sadece dar ekranlarda gerekli. */}
                  {isSelected && (
                    <span
                      className="shrink-0 rounded-full border border-brand-500/30 bg-brand-500/15 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-brand-300 lg:hidden"
                      aria-hidden="true"
                    >
                      Aktif
                    </span>
                  )}
                </button>

                {/* Seçili satırı sağdaki maketle birleştiren kot çizgisi */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-8 top-1/2 hidden h-px w-8 bg-brand-500/60 lg:block"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-4 font-mono text-[10px] leading-relaxed text-slate-600">
          Ok tuşlarıyla sektörler, sağdaki şeritte ok tuşlarıyla bölümler arasında gezinebilirsiniz.
        </p>

        <Link
          href={activeDemo.path}
          className="group mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand-400 transition-colors hover:text-brand-300"
        >
          Demoyu tam sayfa aç
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Sağ: çalışan tarayıcı maketi */}
      <div className="min-w-0 lg:col-span-8">
        <BrowserMockup
          demo={activeDemo}
          activeTab={mockupTab}
          onTabChange={setMockupTab}
          state={demoState}
          actions={actions}
          idPrefix="demo"
          isFullscreen={false}
          onToggleFullscreen={() => setIsFullscreenPreview(true)}
          fullscreenButtonRef={fullscreenTriggerRef}
          mockupId="demo-mockup"
          labelledById={`demo-sector-tab-${DEMO_LIST.findIndex((d) => d.id === activeDemo.id)}`}
        />
      </div>
    </div>
  );
};

/** İletişim bloğundaki satırlar — hepsi lib/site.ts'ten geliyor. */
const CONTACT_ROWS = [
  { icon: Mail, label: 'E-posta', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Clock, label: 'Çalışma saatleri', value: CONTACT.workingHours },
  { icon: MapPin, label: 'Konum', value: CONTACT.city },
];

// --- MAIN PAGE COMPONENT ---
export default function Home() {

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-surface font-sans text-slate-100 selection:bg-brand-500 selection:text-white">
      <ScrollProgress />
      <SiteHeader />

      <CyberChatbot />

      {/* Yatay boşluk bölümlerin kendisinde: tam genişlik bantlar ancak
          main padding'siz olduğunda gerçekten kenara dayanabiliyor. */}
      <main className="relative z-10 flex-1 pb-16 sm:pb-20">
        <HeroSlider />

        {/* 01 — Hizmetler: sekiz başlık iki gruba ayrılmış hâlde.
            Düz bir sekizli ızgara ziyaretçiyi seçim yorgunluğuna sokuyordu;
            "büyümek mi istiyorum, korunmak mı" ayrımı kararı ikiye indiriyor. */}
        <section id="hizmetler" className={`${SHELL} scroll-mt-28 py-14 sm:py-20 lg:py-24`}>
          <SectionHeading
            index="01"
            eyebrow="Hizmetler"
            size="lg"
            title="İki ihtiyaç, tek ekip"
            desc="İşletmelerin bizden istediği şey iki başlıkta toplanıyor: büyümek ve korunmak. İkisini de aynı ekip yürütüyor, aynı bilgiyi iki kez toplamıyoruz."
          />

          <div className="mt-8 space-y-10 sm:mt-12 sm:space-y-14">
            {SERVICE_GROUPS.map((group) => {
              const cards = cardsByGroup(group.id);
              return (
                <div key={group.id} className="min-w-0">
                  <Reveal>
                    <div className="flex min-w-0 flex-col gap-2 border-l-2 border-brand-500/50 pl-4 sm:pl-5">
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                        {group.label}
                        <span className="ml-2.5 align-middle font-mono text-[11px] font-semibold tracking-wider text-slate-500">
                          {cards.length} hizmet
                        </span>
                      </h3>
                      <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                        {group.desc}
                      </p>
                    </div>
                  </Reveal>

                  <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((srv) => (
                      <RevealItem key={srv.href} className="min-w-0">
                        <Link
                          href={srv.href}
                          className="lift group flex h-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-brand-500/40 hover:bg-slate-900/70 sm:p-6"
                        >
                          <span className="w-fit rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-brand-400">
                            <ServiceIcon name={srv.icon} className="h-5 w-5" />
                          </span>

                          <h4 className="mt-4 font-display text-base font-bold tracking-tight text-white sm:text-lg">
                            {srv.title}
                          </h4>
                          <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-400">
                            {srv.desc}
                          </p>

                          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                            Detaylı incele
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </span>
                        </Link>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              );
            })}
          </div>

          <Reveal delay={0.05}>
            <p className="mt-8 text-xs leading-relaxed text-slate-500">
              Hangi başlığın size uygun olduğundan emin değilseniz{' '}
              <Link href="/iletisim" className="font-semibold text-brand-300 underline-offset-4 hover:underline">
                bize yazın
              </Link>{' '}
              — kısa bir görüşmede birlikte belirleyelim. Bayilik ve çözüm ortaklığı için{' '}
              <Link href="/is-ortakligi" className="font-semibold text-brand-300 underline-offset-4 hover:underline">
                iş ortaklığı sayfasına
              </Link>{' '}
              bakabilirsiniz.
            </p>
          </Reveal>
        </section>

        {/* Reklam bloğu — sola dayalı ızgaradan bilinçli olarak sağa kaçıyor,
            soldan uzanan çizgi onu yine de sayfaya bağlıyor. */}
        <div className={`${SHELL} pb-14 sm:pb-20`}>
          <Reveal>
            <div className="relative">
              <span
                aria-hidden="true"
                className="dim-rule absolute left-0 top-1/2 hidden w-[22%] lg:block"
              />
              <div className="lg:ml-auto lg:w-[72%]">
                <MetaGoogleAdsCard />
              </div>
            </div>
          </Reveal>
        </div>

        {/* 02 — Demolar: sayfanın imzası. Tam genişlik "pafta" bandı. */}
        <section
          id="demolar"
          className="relative scroll-mt-28 border-y border-slate-800/70 bg-slate-950/40 py-16 sm:py-24 lg:py-28"
        >
          <div
            aria-hidden="true"
            className="sheet-grid sheet-fade pointer-events-none absolute inset-0"
          />

          <div className={`relative ${SHELL}`}>
            <SectionHeading
              index="02"
              eyebrow="Canlı demolar"
              size="xl"
              title="Sektörünüze özel web mimarileri"
              desc="Anlatmak yerine gösteriyoruz. Soldaki dizinden bir sektör seçin, arayüzü buradan deneyin."
            />

            <div className="mt-10 sm:mt-14">
              <LiveDemoShowcase />
            </div>
          </div>
        </section>

        {/* Güven köprüleri — başlıksız, sessiz bir ara. Solda sadece bir etiket
            sütunu var; bant sonrası göz dinlensin diye burada iri tipografi yok. */}
        <div className={`${SHELL} py-14 sm:py-20`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Şeffaflık
              </p>
              <span aria-hidden="true" className="dim-rule mt-4 hidden w-full lg:block" />
            </div>
            <div className="min-w-0 lg:col-span-9">
              <TrustLinks />
            </div>
          </div>
        </div>

        {/* 03 — Performans: bir önceki bölümde dar sütun soldaydı, burada sağa
            geçiyor. Zikzak, iki uzun bölümün aynı kalıpta okunmasını engelliyor. */}
        <section id="demo" className={`${SHELL} scroll-mt-28 pb-14 sm:pb-20 lg:pb-24`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:order-2 lg:col-span-4 lg:self-start lg:sticky lg:top-32">
              <SectionHeading
                index="03"
                eyebrow="Performans"
                size="md"
                layout="stack"
                title="Neden milisaniyeler önemlidir?"
                desc="Yavaş açılan her saniye, ziyaretçilerinizin %20'sinin sitenizden ayrılmasına neden olur."
              />

              <Reveal delay={0.1}>
                <div className="mt-8 space-y-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                      TTFB · klasik altyapı
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold tabular-nums text-slate-600 line-through decoration-rose-500/70 decoration-2 sm:text-4xl">
                      1.240 ms
                    </p>
                  </div>

                  <span aria-hidden="true" className="dim-rule block w-full max-w-[220px]" />

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-400">
                      TTFB · Kodara Edge
                    </p>
                    <p className="mt-1 font-display text-5xl font-extrabold leading-none tracking-tight tabular-nums text-white sm:text-6xl">
                      48
                      <span className="ml-2 align-baseline text-xl font-bold text-emerald-400 sm:text-2xl">
                        ms
                      </span>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="min-w-0 lg:order-1 lg:col-span-8">
              <Reveal delay={0.05}>
                <BenchmarkSimulator />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 04 — Teklif: solda kim olduğumuz, sağda form */}
        <section className={`${SHELL} border-t border-slate-800/70 pt-14 sm:pt-20`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <Reveal>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] font-semibold tabular-nums text-brand-400"
                  >
                    04
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-[11px]">
                    Teklif
                  </span>
                  <span aria-hidden="true" className="dim-rule ml-1 min-w-6 flex-1" />
                </div>

                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  Formu doldurun; ihtiyacınıza uygun kapsamı, süreyi ve fiyatı yazılı olarak
                  çıkaralım. Yazışmak istemiyorsanız doğrudan e-posta da yazabilirsiniz.
                </p>

                <dl className="mt-8 space-y-4">
                  {CONTACT_ROWS.map(({ icon: RowIcon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-brand-400">
                        <RowIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {label}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm text-slate-200">
                          {href ? (
                            <a
                              href={href}
                              className="transition-colors hover:text-brand-300 hover:underline"
                            >
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/iletisim"
                  className="group mt-8 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand-400 transition-colors hover:text-brand-300"
                >
                  İletişim sayfası
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            </div>

            <div className="min-w-0 lg:col-span-8">
              <Reveal delay={0.05}>
                <LeadCaptureSection />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
