'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { whatsAppLink } from '@/lib/site';
import { SafeImage } from '@/components/SafeImage';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import {
  ArrowLeft,
  ArrowUpDown,
  Bath,
  BedDouble,
  Building2,
  CalendarClock,
  Compass,
  Heart,
  Layers,
  MapPin,
  PhoneCall,
  Ruler,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

/* ---------------------------------- Tipler --------------------------------- */

type PropertyType = 'Daire' | 'Villa' | 'Rezidans' | 'Arsa';

type RoomPlan = '1+1' | '2+1' | '3+1' | '4+1' | '5+1';

interface Agent {
  name: string;
  title: string;
  phone: string;
  /** Fotoğraf yerine baş harf rozeti kullanıyoruz; sayfadaki görsel sayısını düşük tutar. */
  initials: string;
}

interface Listing {
  id: string;
  code: string;
  title: string;
  district: string;
  neighborhood: string;
  type: PropertyType;
  /** Arsa ilanlarında oda planı yoktur; oda filtresi bu yüzden nullable. */
  rooms: RoomPlan | null;
  bathrooms: number;
  area: number;
  floor: string;
  buildingAge: string;
  heating: string;
  facing: string;
  price: number;
  /** Sıralamada "en yeni" kriteri için ISO tarih. */
  listedAt: string;
  badge: string;
  description: string;
  highlights: string[];
  image: string;
  agent: Agent;
}

type SortKey = 'yeni' | 'artan' | 'azalan';

/* --------------------------------- Sabitler -------------------------------- */

const AGENTS: Record<string, Agent> = {
  selin: { name: 'Selin Arıkan', title: 'Kıdemli Portföy Danışmanı', phone: '+90 212 000 14 22', initials: 'SA' },
  emre: { name: 'Emre Tunçel', title: 'Yatırım Danışmanı', phone: '+90 212 000 14 37', initials: 'ET' },
  derya: { name: 'Derya Kılıçoğlu', title: 'Lüks Konut Uzmanı', phone: '+90 212 000 14 09', initials: 'DK' },
};

const LISTINGS: Listing[] = [
  {
    id: '1',
    code: 'MRD-1041',
    title: 'Bebek Sahilinde Boğaz Manzaralı Tarihi Yalı Dairesi',
    district: 'Beşiktaş',
    neighborhood: 'Bebek',
    type: 'Daire',
    rooms: '4+1',
    bathrooms: 3,
    area: 265,
    floor: '2. Kat',
    buildingAge: '5 yaş',
    heating: 'Yerden ısıtma',
    facing: 'Kuzeydoğu',
    price: 92500000,
    listedAt: '2026-07-28',
    badge: 'Kesintisiz Boğaz',
    description:
      'Restore edilmiş yalı yapısında, tam cepheden Boğaz gören, geniş salonlu ve özel iskele kullanım hakkına sahip eşsiz bir daire.',
    highlights: ['Özel iskele hakkı', 'Ebeveyn banyolu', 'Şömine', 'Kapalı otopark'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.derya,
  },
  {
    id: '2',
    code: 'MRD-1077',
    title: 'Zekeriyaköy Sonsuzluk Havuzlu Müstakil Villa',
    district: 'Sarıyer',
    neighborhood: 'Zekeriyaköy',
    type: 'Villa',
    rooms: '5+1',
    bathrooms: 4,
    area: 480,
    floor: '3 Katlı Müstakil',
    buildingAge: '2 yaş',
    heating: 'Yerden ısıtma',
    facing: 'Güney',
    price: 148000000,
    listedAt: '2026-08-04',
    badge: 'Yeni Eklendi',
    description:
      'Orman sınırında, 1.100 m² arsa içinde konumlanan; sonsuzluk havuzu, akıllı ev altyapısı ve müstakil misafir stüdyosu bulunan villa.',
    highlights: ['Sonsuzluk havuzu', 'Akıllı ev sistemi', 'Misafir stüdyosu', 'Peyzajlı bahçe'],
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.derya,
  },
  {
    id: '3',
    code: 'MRD-1102',
    title: 'Levent Finans Merkezi Manzaralı Rezidans Katı',
    district: 'Beşiktaş',
    neighborhood: 'Levent',
    type: 'Rezidans',
    rooms: '3+1',
    bathrooms: 2,
    area: 178,
    floor: '31. Kat',
    buildingAge: '4 yaş',
    heating: 'VRV klima',
    facing: 'Batı',
    price: 41750000,
    listedAt: '2026-08-09',
    badge: 'Yüksek Kira Getirisi',
    description:
      'Concierge hizmeti, kapalı yüzme havuzu ve 7/24 güvenlik sunan A+ rezidansta, panoramik şehir manzaralı köşe daire.',
    highlights: ['Concierge', 'Kapalı havuz', 'Fitness merkezi', 'Metro 4 dk'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.emre,
  },
  {
    id: '4',
    code: 'MRD-1118',
    title: 'Nişantaşı Teşvikiye Butik Apartmanda Bahçe Katı',
    district: 'Şişli',
    neighborhood: 'Nişantaşı',
    type: 'Daire',
    rooms: '2+1',
    bathrooms: 1,
    area: 116,
    floor: 'Bahçe Katı',
    buildingAge: '12 yaş',
    heating: 'Kombi (doğalgaz)',
    facing: 'Güneybatı',
    price: 18900000,
    listedAt: '2026-06-19',
    badge: 'Merkezi Konum',
    description:
      'Butik bir apartmanın giriş katında, 40 m² özel bahçe kullanımlı; caddeye ve metroya yürüme mesafesinde bakımlı daire.',
    highlights: ['Özel bahçe', 'Ankastre mutfak', 'Asansör', 'Cadde yakını'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.selin,
  },
  {
    id: '5',
    code: 'MRD-1126',
    title: 'Kandilli Korulu Arazi İçinde Taş Villa',
    district: 'Üsküdar',
    neighborhood: 'Kandilli',
    type: 'Villa',
    rooms: '5+1',
    bathrooms: 4,
    area: 395,
    floor: '2 Katlı + Bodrum',
    buildingAge: '9 yaş',
    heating: 'Yerden ısıtma',
    facing: 'Kuzeybatı',
    price: 112000000,
    listedAt: '2026-05-30',
    badge: 'Nadir Portföy',
    description:
      'Yüz yıllık çınarların gölgesinde, taş işçilikli cephesi ve kış bahçesiyle öne çıkan; Boğaz siluetine hâkim müstakil villa.',
    highlights: ['Kış bahçesi', 'Şarap mahzeni', 'Kapalı garaj', 'Jeneratör'],
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.derya,
  },
  {
    id: '6',
    code: 'MRD-1133',
    title: 'Ataşehir Yeni Nesil Rezidansta Yatırımlık 1+1',
    district: 'Ataşehir',
    neighborhood: 'Batı Ataşehir',
    type: 'Rezidans',
    rooms: '1+1',
    bathrooms: 1,
    area: 68,
    floor: '14. Kat',
    buildingAge: '1 yaş',
    heating: 'Merkezi (pay ölçer)',
    facing: 'Doğu',
    price: 8450000,
    listedAt: '2026-08-11',
    badge: 'Yatırımcıya Uygun',
    description:
      'Finans merkezine 6 dakika mesafede, kurumsal kiracı profiline sahip rezidansta; eşyalı teslim edilen kompakt yatırım dairesi.',
    highlights: ['Eşyalı teslim', 'Kurumsal kiracı', 'Otopark', 'Ortak çalışma alanı'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.emre,
  },
  {
    id: '7',
    code: 'MRD-1149',
    title: 'Beykoz Riva İmarlı Deniz Manzaralı Arsa',
    district: 'Beykoz',
    neighborhood: 'Riva',
    type: 'Arsa',
    rooms: null,
    bathrooms: 0,
    area: 1850,
    floor: 'Köşe Parsel',
    buildingAge: '—',
    heating: '—',
    facing: 'Kuzey',
    price: 27400000,
    listedAt: '2026-07-02',
    badge: 'Konut İmarlı',
    description:
      'Villa nizam konut imarlı, %25 taban alanı hakkı bulunan köşe parsel. Denize 900 metre, ana yola cepheli ve altyapısı tamamlanmış.',
    highlights: ['Villa nizam imar', 'Köşe parsel', 'Altyapı hazır', 'Denize 900 m'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.emre,
  },
  {
    id: '8',
    code: 'MRD-1155',
    title: 'Etiler Akatlar Yenilenmiş Geniş Aile Dairesi',
    district: 'Beşiktaş',
    neighborhood: 'Etiler',
    type: 'Daire',
    rooms: '4+1',
    bathrooms: 2,
    area: 210,
    floor: '5. Kat',
    buildingAge: '18 yaş',
    heating: 'Kombi (doğalgaz)',
    facing: 'Güney',
    price: 33200000,
    listedAt: '2026-06-27',
    badge: 'Sıfır Yenileme',
    description:
      'Tesisatı ve zeminleri tamamen yenilenmiş, iki cepheli ve ferah; okullara yürüme mesafesindeki site içinde aile dairesi.',
    highlights: ['Site içinde', 'Çift cephe', '2 balkon', 'Kapalı otopark'],
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.selin,
  },
  {
    id: '9',
    code: 'MRD-1168',
    title: 'Çekmeköy Site İçinde Bahçe Dubleksi',
    district: 'Çekmeköy',
    neighborhood: 'Taşdelen',
    type: 'Villa',
    rooms: '4+1',
    bathrooms: 3,
    area: 240,
    floor: 'Dubleks',
    buildingAge: '7 yaş',
    heating: 'Yerden ısıtma',
    facing: 'Güneydoğu',
    price: 21750000,
    listedAt: '2026-08-01',
    badge: 'Aileye Uygun',
    description:
      'Sosyal tesisli site içinde, 120 m² özel bahçeli dubleks. Yürüyüş parkuru, açık havuz ve çocuk kulübü site bünyesinde.',
    highlights: ['Özel bahçe', 'Site havuzu', 'Çocuk kulübü', '24 saat güvenlik'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.selin,
  },
  {
    id: '10',
    code: 'MRD-1174',
    title: 'Sarıyer Maslak Ofis Aksına Yakın Ticari İmarlı Arsa',
    district: 'Sarıyer',
    neighborhood: 'Maslak',
    type: 'Arsa',
    rooms: null,
    bathrooms: 0,
    area: 940,
    floor: 'Ana Cadde',
    buildingAge: '—',
    heating: '—',
    facing: 'Batı',
    price: 58600000,
    listedAt: '2026-04-16',
    badge: 'Ticari İmar',
    description:
      'Ofis aksında, ticari + hizmet imarlı ana cadde cepheli parsel. Emsal hakkı yüksek, kurumsal geliştirici projeleri için uygun.',
    highlights: ['Ticari imar', 'Ana cadde cephe', 'Yüksek emsal', 'Metroya 700 m'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.emre,
  },
  {
    id: '11',
    code: 'MRD-1181',
    title: 'Bebek Küçük Bebek Cephesinde Stüdyo Rezidans',
    district: 'Beşiktaş',
    neighborhood: 'Bebek',
    type: 'Rezidans',
    rooms: '2+1',
    bathrooms: 2,
    area: 124,
    floor: '8. Kat',
    buildingAge: '3 yaş',
    heating: 'VRV klima',
    facing: 'Kuzey',
    price: 46300000,
    listedAt: '2026-07-21',
    badge: 'Manzara Garantili',
    description:
      'Az katlı butik rezidansta, geniş teraslı ve önü kapanmaz Boğaz manzaralı daire. Vale ve günlük temizlik hizmeti dahildir.',
    highlights: ['Geniş teras', 'Vale hizmeti', 'Manzara garantisi', 'Depo'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.derya,
  },
  {
    id: '12',
    code: 'MRD-1190',
    title: 'Üsküdar Çengelköy Bahçeli Müstakil Ev',
    district: 'Üsküdar',
    neighborhood: 'Çengelköy',
    type: 'Daire',
    rooms: '3+1',
    bathrooms: 2,
    area: 155,
    floor: 'Giriş Katı',
    buildingAge: '22 yaş',
    heating: 'Kombi (doğalgaz)',
    facing: 'Güney',
    price: 14200000,
    listedAt: '2026-05-12',
    badge: 'Uygun Fiyat',
    description:
      'Sahile yürüme mesafesinde, sakin bir sokakta; 60 m² bahçe kullanımlı, bakımlı ve hızlı taşınmaya hazır konut.',
    highlights: ['Sahile 6 dk', 'Bahçe kullanımı', 'Krediye uygun', 'Boş teslim'],
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=75',
    agent: AGENTS.selin,
  },
];

const TYPE_OPTIONS: readonly (PropertyType | 'Tümü')[] = ['Tümü', 'Daire', 'Villa', 'Rezidans', 'Arsa'];
const ROOM_OPTIONS: readonly (RoomPlan | 'Tümü')[] = ['Tümü', '1+1', '2+1', '3+1', '4+1', '5+1'];

const SORT_OPTIONS: readonly { value: SortKey; label: string }[] = [
  { value: 'yeni', label: 'En Yeni İlanlar' },
  { value: 'artan', label: 'Fiyat: Artan' },
  { value: 'azalan', label: 'Fiyat: Azalan' },
];

/** Slider ve "tümünü kapsa" mantığı için portföyün gerçek fiyat sınırları. */
const PRICE_FLOOR = 0;
const PRICE_CEILING = 150000000;
const PRICE_STEP = 500000;

/** Hero'daki hazır bütçe aralıkları; değer "min-max" biçiminde saklanır. */
const PRICE_PRESETS: readonly { value: string; label: string }[] = [
  { value: `${PRICE_FLOOR}-${PRICE_CEILING}`, label: 'Tüm Bütçeler' },
  { value: '0-20000000', label: '20.000.000 ₺ altı' },
  { value: '20000000-50000000', label: '20 – 50 milyon ₺' },
  { value: '50000000-100000000', label: '50 – 100 milyon ₺' },
  { value: `100000000-${PRICE_CEILING}`, label: '100 milyon ₺ üzeri' },
];

/* -------------------------------- Yardımcılar ------------------------------- */

/** Fiyatları Türkçe binlik ayraçla yazar — tasarımın her yerinde aynı biçim kullanılsın. */
function formatPrice(value: number): string {
  return value.toLocaleString('tr-TR');
}

/** Slider etiketinde 92.500.000 yerine "92,5 mn ₺" göstererek okunurluğu artırır. */
function formatShortPrice(value: number): string {
  const millions = value / 1000000;
  return `${millions.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} mn ₺`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

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

/* ------------------------------- Ana Bileşen ------------------------------- */

export default function EmlakPortfoyPage() {
  // Filtre durumu
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState<string>('Tümü');
  const [type, setType] = useState<PropertyType | 'Tümü'>('Tümü');
  const [rooms, setRooms] = useState<RoomPlan | 'Tümü'>('Tümü');
  const [minPrice, setMinPrice] = useState<number>(PRICE_FLOOR);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_CEILING);
  const [sort, setSort] = useState<SortKey>('yeni');

  // Etkileşim durumu
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [appointmentSent, setAppointmentSent] = useState(false);

  const openWhatsApp = useCallback((message: string) => {
    window.open(whatsAppLink(message), '_blank', 'noopener,noreferrer');
  }, []);

  // İlçe listesi veriden türetiliyor; yeni ilan eklenince filtre kendiliğinden büyür.
  const districts = useMemo(
    () => ['Tümü', ...Array.from(new Set(LISTINGS.map((l) => l.district))).sort((a, b) => a.localeCompare(b, 'tr-TR'))],
    [],
  );

  // Tüm kriterler tek geçişte uygulanıyor, ardından sıralama yapılıyor.
  const results = useMemo(() => {
    const q = normalize(query.trim());

    const filtered = LISTINGS.filter((listing) => {
      const matchType = type === 'Tümü' || listing.type === type;
      const matchDistrict = district === 'Tümü' || listing.district === district;
      const matchRooms = rooms === 'Tümü' || listing.rooms === rooms;
      const matchPrice = listing.price >= minPrice && listing.price <= maxPrice;
      const matchQuery =
        q.length === 0 ||
        [listing.title, listing.neighborhood, listing.district, listing.code, listing.type, ...listing.highlights]
          .some((field) => normalize(field).includes(q));

      return matchType && matchDistrict && matchRooms && matchPrice && matchQuery;
    });

    // Kopya üzerinde sıralıyoruz; kaynak dizi mutasyona uğramasın.
    return [...filtered].sort((a, b) => {
      if (sort === 'artan') return a.price - b.price;
      if (sort === 'azalan') return b.price - a.price;
      return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
    });
  }, [query, district, type, rooms, minPrice, maxPrice, sort]);

  const isFiltered =
    query.trim() !== '' ||
    district !== 'Tümü' ||
    type !== 'Tümü' ||
    rooms !== 'Tümü' ||
    minPrice !== PRICE_FLOOR ||
    maxPrice !== PRICE_CEILING;

  // Kaydırıcılarla hazır aralıkların dışına çıkıldığında select boş görünmesin.
  const priceSelectValue = useMemo(() => {
    const current = `${minPrice}-${maxPrice}`;
    return PRICE_PRESETS.some((preset) => preset.value === current) ? current : 'custom';
  }, [minPrice, maxPrice]);

  const resetFilters = useCallback(() => {
    setQuery('');
    setDistrict('Tümü');
    setType('Tümü');
    setRooms('Tümü');
    setMinPrice(PRICE_FLOOR);
    setMaxPrice(PRICE_CEILING);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    setAppointmentSent(false);
  }, []);

  // Modal açıkken Escape ile kapatma — klavye kullanıcıları için zorunlu davranış.
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, closeModal]);

  const scrollToPortfolio = useCallback(() => {
    document.getElementById('portfoy')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    scrollToPortfolio();
  };

  const averagePrice = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((sum, l) => sum + l.price, 0) / results.length);
  }, [results]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100">
      {/* ------------------------------- Header ------------------------------- */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/85 px-4 py-4 backdrop-blur-md md:px-12">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300"
          >
            <ArrowLeft className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sr-only sm:hidden">Ana Sayfaya Dön</span>
          </Link>
          <span className="hidden h-5 w-px bg-slate-800 lg:block" />
          <span className="hidden truncate text-lg font-bold tracking-wide text-sky-400 lg:block">
            MERİDYEN GAYRİMENKUL
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 md:gap-4">
          <a href="#portfoy" className="hidden transition-colors hover:text-sky-400 md:inline">
            Portföy ({LISTINGS.length})
          </a>

          {/* Favori sayacı: kalp ikonuna basılan her ilan burada anlık yansır. */}
          <span
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300"
            aria-live="polite"
          >
            <Heart
              className={`h-4 w-4 ${favorites.length > 0 ? 'fill-sky-400 text-sky-400' : 'text-slate-500'}`}
              aria-hidden="true"
            />
            <span className="tabular-nums">{favorites.length}</span>
            <span className="sr-only">ilan favorilerinizde</span>
            <span className="hidden sm:inline">Favori</span>
          </span>

          <button
            type="button"
            onClick={() =>
              openWhatsApp('Merhaba Meridyen Gayrimenkul, portföyünüzdeki ilanlar hakkında bilgi almak istiyorum.')
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all hover:from-sky-400 hover:to-cyan-400"
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            <span>İletişime Geç</span>
          </button>
        </div>
      </header>

      {/* -------------------------------- Hero -------------------------------- */}
      <section className="relative px-6 py-16 md:px-12 md:py-20">
        {/* Dekoratif ışık huzmesi — sky/cyan kimliğini arka planda taşır. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(14,165,233,0.18),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl space-y-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-sky-300">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Lüks Konut &amp; Yatırım Portföyü
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Doğru Adresi <span className="text-sky-400">Saniyeler İçinde</span> Bulun
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 md:text-base">
            İstanbul&apos;un seçkin semtlerinde {LISTINGS.length} aktif ilan. Konum, tip ve bütçenize göre filtreleyin;
            beğendiğiniz mülkü favorilerinize ekleyip danışmanınızdan randevu alın.
          </p>

          {/* Hero arama konsolu — gönderimde portföy bölümüne kaydırır, filtreler anlık uygulanır. */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left shadow-2xl md:grid-cols-4"
          >
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2">
              <label htmlFor="hero-district" className="block text-[10px] font-semibold uppercase text-sky-400">
                Konum
              </label>
              <select
                id="hero-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 w-full cursor-pointer bg-transparent text-xs text-white focus:outline-none"
              >
                {districts.map((d) => (
                  <option key={d} value={d} className="bg-slate-900">
                    {d === 'Tümü' ? 'Tüm İlçeler' : d}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2">
              <label htmlFor="hero-type" className="block text-[10px] font-semibold uppercase text-sky-400">
                Gayrimenkul Tipi
              </label>
              <select
                id="hero-type"
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType | 'Tümü')}
                className="mt-1 w-full cursor-pointer bg-transparent text-xs text-white focus:outline-none"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">
                    {t === 'Tümü' ? 'Tüm Tipler' : t}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2">
              <label htmlFor="hero-price" className="block text-[10px] font-semibold uppercase text-sky-400">
                Fiyat Aralığı
              </label>
              <select
                id="hero-price"
                value={priceSelectValue}
                onChange={(e) => {
                  // "custom" yalnızca kaydırıcıyla oluşan aralığı temsil eder, seçilemez bir durumdur.
                  if (e.target.value === 'custom') return;
                  const [min, max] = e.target.value.split('-').map(Number);
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                className="mt-1 w-full cursor-pointer bg-transparent text-xs text-white focus:outline-none"
              >
                {PRICE_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value} className="bg-slate-900">
                    {preset.label}
                  </option>
                ))}
                {priceSelectValue === 'custom' && (
                  <option value="custom" className="bg-slate-900">
                    Özel aralık: {formatShortPrice(minPrice)} – {formatShortPrice(maxPrice)}
                  </option>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-95"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Portföyde Ara</span>
            </button>
          </form>

          <p className="text-xs text-slate-500">
            Şu anki kriterlerle <span className="font-semibold text-sky-400">{results.length}</span> ilan eşleşiyor
            {results.length > 0 && <> · Ortalama fiyat {formatPrice(averagePrice)} ₺</>}
          </p>
        </div>
      </section>

      {/* ------------------------------ Portföy ------------------------------- */}
      <section id="portfoy" className="scroll-mt-24 px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Detaylı filtre paneli */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Portföy Filtreleri
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Metin araması */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  İlan ara (semt, başlık, ilan kodu)
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Örn. Bebek, havuz, MRD-1041..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Oda sayısı */}
              <div>
                <label htmlFor="rooms" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  Oda sayısı
                </label>
                <select
                  id="rooms"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value as RoomPlan | 'Tümü')}
                  className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r} className="bg-slate-900">
                      {r === 'Tümü' ? 'Tüm oda planları' : r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label htmlFor="sort" className="mb-1.5 block text-[11px] font-medium text-slate-400">
                  Sıralama
                </label>
                <div className="relative">
                  <ArrowUpDown
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tip seçim çipleri */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">Tip:</span>
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    type === t
                      ? 'bg-sky-500 font-bold text-slate-950 shadow-lg shadow-sky-500/20'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Fiyat aralığı kaydırıcıları */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="min-price" className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>En düşük fiyat</span>
                  <span className="font-semibold text-sky-400">{formatShortPrice(minPrice)}</span>
                </label>
                <input
                  id="min-price"
                  type="range"
                  min={PRICE_FLOOR}
                  max={PRICE_CEILING}
                  step={PRICE_STEP}
                  value={minPrice}
                  // Alt sınır üst sınırı geçemesin; aksi hâlde sonuç kümesi mantıksız biçimde boşalır.
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                  className="w-full cursor-pointer accent-sky-500"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>En yüksek fiyat</span>
                  <span className="font-semibold text-sky-400">{formatShortPrice(maxPrice)}</span>
                </label>
                <input
                  id="max-price"
                  type="range"
                  min={PRICE_FLOOR}
                  max={PRICE_CEILING}
                  step={PRICE_STEP}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                  className="w-full cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Sonuç başlığı */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300" aria-live="polite">
              <span className="font-bold text-sky-400">{results.length}</span> ilan listeleniyor
              <span className="text-slate-500"> / toplam {LISTINGS.length}</span>
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-sky-500/40 hover:text-sky-300"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Filtreleri Temizle
              </button>
            )}
          </div>

          {/* İlan ızgarası veya boş durum */}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <Compass className="mx-auto h-10 w-10 text-sky-400/60" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-white">Kriterlerinize uyan ilan bulunamadı</h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
                Fiyat aralığını genişletmeyi veya oda planı filtresini kaldırmayı deneyin. Aradığınız özellikte bir mülk
                için portföy ekibimize doğrudan da danışabilirsiniz.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-400"
                >
                  Filtreleri Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp('Merhaba, aradığım kriterlerde portföyünüzde ilan bulamadım. Yönlendirir misiniz?')
                  }
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-sky-500/40 hover:text-sky-300"
                >
                  Danışmana Sor
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((listing) => {
                  const isFavorite = favorites.includes(listing.id);
                  return (
                    <motion.article
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-colors hover:border-sky-500/50"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <SafeImage
                          accent="text-sky-400"
                          src={listing.image}
                          alt={`${listing.title} görseli`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-400">
                          {listing.badge}
                        </span>
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] text-slate-200 backdrop-blur-md">
                          <MapPin className="h-3 w-3 text-sky-400" aria-hidden="true" />
                          {listing.neighborhood}, {listing.district}
                        </span>

                        {/* Favori butonu kart açma butonunun üstünde durur; iç içe buton oluşmaz. */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(listing.id)}
                          aria-pressed={isFavorite}
                          aria-label={
                            isFavorite
                              ? `${listing.title} ilanını favorilerden çıkar`
                              : `${listing.title} ilanını favorilere ekle`
                          }
                          className="absolute right-3 top-3 z-20 rounded-full border border-slate-700 bg-slate-950/85 p-2 transition-colors hover:border-sky-500/60"
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${
                              isFavorite ? 'fill-sky-400 text-sky-400' : 'text-slate-300'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                            {listing.type}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{listing.code}</span>
                        </div>

                        <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-sky-400">
                          {listing.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Ruler className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                            {listing.area} m²
                          </span>
                          {listing.rooms && (
                            <span className="inline-flex items-center gap-1">
                              <BedDouble className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                              {listing.rooms}
                            </span>
                          )}
                          {listing.bathrooms > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Bath className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                              {listing.bathrooms} banyo
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                            {listing.floor}
                          </span>
                        </div>

                        <div className="mt-auto flex items-end justify-between border-t border-slate-800/70 pt-4">
                          <div>
                            <span className="block text-[10px] text-slate-500">Satış Fiyatı</span>
                            <span className="font-mono text-lg font-bold text-sky-400">
                              {formatPrice(listing.price)} ₺
                            </span>
                          </div>
                          <span className="pointer-events-none rounded-xl bg-slate-950 px-3.5 py-2 text-[11px] font-semibold text-slate-300 transition-colors group-hover:bg-sky-500 group-hover:text-slate-950">
                            Detayları Gör
                          </span>
                        </div>
                      </div>

                      {/* Kartın tamamını kaplayan gerçek buton: div onClick yerine erişilebilir tetikleyici. */}
                      <button
                        type="button"
                        onClick={() => {
                          setAppointmentSent(false);
                          setSelected(listing);
                        }}
                        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                      >
                        <span className="sr-only">{listing.title} ilanının detaylarını görüntüle</span>
                      </button>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------- Güven Şeridi ---------------------------- */}
      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-14 md:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
          <div className="space-y-1">
            <p className="font-mono text-2xl font-bold text-sky-400">18</p>
            <p className="text-xs text-slate-400">Yıllık sektör tecrübesi</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-bold text-sky-400">1.240+</p>
            <p className="text-xs text-slate-400">Tamamlanan satış işlemi</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-bold text-sky-400">%98</p>
            <p className="text-xs text-slate-400">Müşteri memnuniyeti</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-bold text-sky-400">32</p>
            <p className="text-xs text-slate-400">Uzman portföy danışmanı</p>
          </div>
        </div>
      </section>

      {/* -------------------------- İlan Detay Modalı ------------------------- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:items-center md:p-8"
          >
            {/* Arka plan da buton: fare ile kapatma div onClick olmadan çalışsın. */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="İlan detayını kapat"
              className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="listing-modal-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <div className="relative h-56 md:h-64">
                <SafeImage
                  accent="text-sky-400"
                  src={selected.image}
                  alt={`${selected.title} görseli`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Kapat"
                  className="absolute right-4 top-4 rounded-full border border-slate-700 bg-slate-950/80 p-2 text-slate-300 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-sky-500 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-950">
                    {selected.type}
                  </span>
                  <h2 id="listing-modal-title" className="mt-2 text-lg font-bold text-white md:text-xl">
                    {selected.title}
                  </h2>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                    {selected.neighborhood}, {selected.district} · İlan no {selected.code}
                  </p>
                </div>
              </div>

              <div className="max-h-[60vh] space-y-5 overflow-y-auto p-5 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500">Satış Fiyatı</span>
                    <span className="font-mono text-2xl font-bold text-sky-400">{formatPrice(selected.price)} ₺</span>
                    <span className="ml-2 text-[11px] text-slate-500">
                      ({formatPrice(Math.round(selected.price / selected.area))} ₺ / m²)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(selected.id)}
                    aria-pressed={favorites.includes(selected.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-sky-500/50"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(selected.id) ? 'fill-sky-400 text-sky-400' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                    {favorites.includes(selected.id) ? 'Favorilerde' : 'Favorilere Ekle'}
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">{selected.description}</p>

                {/* Teknik künye */}
                <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: 'Brüt alan', value: `${selected.area} m²` },
                    { label: 'Oda planı', value: selected.rooms ?? 'Arsa' },
                    { label: 'Banyo', value: selected.bathrooms > 0 ? `${selected.bathrooms}` : '—' },
                    { label: 'Kat / Yapı', value: selected.floor },
                    { label: 'Bina yaşı', value: selected.buildingAge },
                    { label: 'Isıtma', value: selected.heating },
                    { label: 'Cephe', value: selected.facing },
                    { label: 'İlan tarihi', value: formatDate(selected.listedAt) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <dt className="text-[10px] uppercase tracking-wide text-slate-500">{item.label}</dt>
                      <dd className="mt-1 text-xs font-semibold text-white">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-400">Öne Çıkan Özellikler</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Danışman kartı */}
                <div className="flex flex-col gap-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-bold text-slate-950"
                    >
                      {selected.agent.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{selected.agent.name}</p>
                      <p className="text-[11px] text-slate-400">{selected.agent.title}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-sky-300">
                        <PhoneCall className="h-3 w-3" aria-hidden="true" />
                        {selected.agent.phone}
                      </p>
                    </div>
                  </div>

                  {appointmentSent ? (
                    <p className="inline-flex items-center gap-2 rounded-xl bg-sky-500/15 px-4 py-3 text-xs font-semibold text-sky-300" role="status">
                      <CalendarClock className="h-4 w-4" aria-hidden="true" />
                      Randevu talebiniz danışmana iletildi.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAppointmentSent(true);
                        openWhatsApp(
                          `Merhaba, ${selected.code} numaralı "${selected.title}" ilanı için yerinde görüşme randevusu talep ediyorum.`,
                        );
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:from-sky-400 hover:to-cyan-400"
                    >
                      <CalendarClock className="h-4 w-4" aria-hidden="true" />
                      Randevu Talep Et
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------- Footer ------------------------------- */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-sky-400">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              MERİDYEN GAYRİMENKUL
            </span>
            <p className="text-xs leading-relaxed text-slate-500">
              Boğaz hattı ve İstanbul&apos;un seçkin semtlerinde lüks konut, rezidans ve yatırım arsası portföy yönetimi.
            </p>
          </div>
          <div className="space-y-2 text-xs text-slate-500">
            <p className="font-semibold text-slate-300">Ofis</p>
            <p>Etiler Mahallesi, Nispetiye Caddesi No: 42, Beşiktaş / İstanbul</p>
            <p>Hafta içi 09:00 – 19:00 · Cumartesi 10:00 – 16:00</p>
          </div>
          <div className="space-y-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-300">Portföyünüzü değerlendirelim</p>
            <button
              type="button"
              onClick={() =>
                openWhatsApp('Merhaba, satılık gayrimenkulüm için ücretsiz değerleme talep etmek istiyorum.')
              }
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-xs font-semibold text-sky-300 transition-colors hover:bg-sky-500/20"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              Ücretsiz Değerleme Talebi
            </button>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-slate-800/70 pt-6 text-center text-[11px] text-slate-600">
          © 2026 Meridyen Gayrimenkul. Bu sayfa tanıtım amaçlı kurgusal bir demodur.
        </p>
      </footer>
          <DemoSwitcher currentId="emlak-portfoy" />
</main>
  );
}
