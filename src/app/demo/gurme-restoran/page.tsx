'use client';

import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ChevronRight, 
  Star, 
  MapPin,
  Sparkles,
  Flame,
  Award,
  Wine,
  Maximize2,
  X,
  MessageCircle,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Radio,
  Cpu,
  Zap
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'Başlangıçlar' | 'Ana Yemekler' | 'Tatlılar';
  price: string;
  prepTime: string;
  calories: string;
  description: string;
  badge: string;
  image: string;
  winePairing: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Ağır Ateşte Pişmiş Wagyu Yanak',
    category: 'Ana Yemekler',
    price: '₺1.450',
    prepTime: '48 Saat Sous-Vide',
    calories: '680 kcal',
    description: 'Siyah Trüf mantarı püresi, karamelize arpacık soğan konfit, ilik sosu ve 24K altın yaprak dokunuşu ile.',
    badge: 'Şefin İmzası',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75',
    winePairing: '2018 Barolo DOCG Reserva'
  },
  {
    id: '2',
    name: 'Atlantik Istakoz & Safranlı Risotto',
    category: 'Ana Yemekler',
    price: '₺1.850',
    prepTime: 'Taze Hazırlanır',
    calories: '540 kcal',
    description: 'Acquerello pirinci, ızgara Atlantik ıstakoz kuyruğu, İran safranı, köpük bisque ve deniz börülcesi.',
    badge: 'Michelin Seçkisi',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=75',
    winePairing: '2021 Chablis Premier Cru'
  },
  {
    id: '3',
    name: 'Dry-Aged Tomahawk Steak',
    category: 'Ana Yemekler',
    price: '₺2.200',
    prepTime: 'Odun Ateşi',
    calories: '850 kcal',
    description: '28 gün dinlendirilmiş meşe odunu ateşinde ızgaralanmış Tomahawk, füme kemik iliği tereyağı ve chimichurri ile.',
    badge: 'Özel Kesim',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=75',
    winePairing: '2017 Cabernet Sauvignon'
  },
  {
    id: '4',
    name: 'Izgara Ahtapot & Siyah Trüf Püresi',
    category: 'Ana Yemekler',
    price: '₺1.250',
    prepTime: 'Kömür Izgara',
    calories: '420 kcal',
    description: 'Ege ahtapotu, siyah sarımsak emülsiyonu, fırınlanmış patates püresi ve mikro yeşillikler.',
    badge: 'Deniz Mahsülü',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=75',
    winePairing: '2020 Assyrtiko Santorina'
  },
  {
    id: '5',
    name: 'Füme Burrata & Yaban Mersini Havyarı',
    category: 'Başlangıçlar',
    price: '₺680',
    prepTime: 'Soğuk Servis',
    calories: '390 kcal',
    description: 'Odun ateşinde tütsülenmiş manda burrata, moleküler yaban mersini havyarı, fesleğen esansı ve fırınlanmış çeri domates.',
    badge: 'Gurme Başlangıç',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&w=800&q=75',
    winePairing: '2022 Sauvignon Blanc'
  },
  {
    id: '6',
    name: 'Kral Yengeç & Avokado Tartar',
    category: 'Başlangıçlar',
    price: '₺920',
    prepTime: 'Anlık Hazırlık',
    calories: '310 kcal',
    description: 'Kamçatka kral yengeç eti, olgunlaşmış avokado, misket limonu emülsiyonu ve tütsülenmiş uçan balık yumurtası.',
    badge: 'Taze & Hafif',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=75',
    winePairing: 'Champagne Brut Reserve'
  },
  {
    id: '7',
    name: 'Gold Leaf Valrhona Çikolata Küresi',
    category: 'Tatlılar',
    price: '₺520',
    prepTime: 'Sıcak Akışkan',
    calories: '450 kcal',
    description: '%85 Madagaskar bitter çikolata küresi, içerisinde çarkıfelek meyvesi kreması ve sıcak karamel dökümü.',
    badge: 'Şov Servis',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=75',
    winePairing: '2015 Vintage Port'
  },
  {
    id: '8',
    name: 'Altın Dokunuşlu Matcha Pavlova',
    category: 'Tatlılar',
    price: '₺460',
    prepTime: 'Taze Baiser',
    calories: '280 kcal',
    description: 'Japon Kyōto matcha bezesi, taze orman meyveleri, vanilya çekirdekli krem şanti ve tutku meyvesi sosu.',
    badge: 'Özel Seri',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=75',
    winePairing: "Moscato d'Asti"
  }
];

const CATEGORIES = ['Tümü', 'Başlangıçlar', 'Ana Yemekler', 'Tatlılar'] as const;

export default function AvantGardeGastronomyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isReserved, setIsReserved] = useState(false);
  const [, startTransition] = useTransition();

  // İnteraktif Rezervasyon Konfigüratör
  const [seatingArea, setSeatingArea] = useState<'Chef Table' | 'Main Dining' | 'Terrace Lounge' | 'Private Room'>('Chef Table');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [timeSlot, setTimeSlot] = useState<string>('20:00');

  // Filtrelenmiş menüyü memoize ederek gereksiz hesaplamaları engelliyoruz
  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'Tümü') return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = useCallback((cat: string) => {
    startTransition(() => {
      setSelectedCategory(cat);
    });
  }, []);

  const handleReservation = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsReserved(true);
    setTimeout(() => setIsReserved(false), 6000);
  }, []);

  const openWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `Merhaba L'Étoile Noir Concierge, ${seatingArea} alanı için ${guestCount} kişilik VIP rezervasyon bilgisi almak istiyorum.`
    );
    window.open(`https://wa.me/905550000000?text=${text}`, '_blank', 'noopener,noreferrer');
  }, [seatingArea, guestCount]);

  return (
    <main className="min-h-screen bg-[#020204] text-slate-100 font-sans selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-600/15 via-amber-900/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-6 md:px-12 overflow-hidden border-b border-amber-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-[#020204] to-[#020204]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono uppercase tracking-[0.25em] backdrop-blur-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)]"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Michelin Guide 2026 • Haute Gastronomie</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-tight uppercase leading-none font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-700 drop-shadow-[0_10px_40px_rgba(245,158,11,0.25)]"
          >
            L'Étoile Noir
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-slate-300 text-base md:text-2xl max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
          >
            Sanatın moleküler lezzetlerle buluştuğu nokta. 4K görsel kalitede hazırlanan anlık menü ve VIP Masa Konfigüratörü.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-mono text-slate-300"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-xl">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>3 Michelin Yıldızı</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-xl">
              <Wine className="w-4 h-4 text-amber-400" />
              <span>Sommelier Kav Seçkisi</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-xl">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Boğaz Hattı, İstanbul</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Menu Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" /> Visual Menu Showcase
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight font-serif">A la Carte & Tadım</h2>
          </div>

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2 p-2 bg-slate-950/80 border border-amber-500/20 rounded-2xl backdrop-blur-2xl shadow-2xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menü Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="group rounded-3xl bg-slate-950/80 border border-amber-500/20 hover:border-amber-500/60 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.18)] backdrop-blur-xl relative"
              >
                <div>
                  {/* Görsel Kutusu */}
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out relative z-10"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 z-20" />
                    
                    {/* Rozet */}
                    <div className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-lg">
                      {item.badge}
                    </div>

                    {/* Zoom Butonu */}
                    <button
                      onClick={() => setSelectedImage(item.image)}
                      aria-label="Görseli Büyüt"
                      className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/70 border border-white/20 text-white hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-4 right-4 z-30 text-2xl font-black text-amber-400 font-mono drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                      {item.price}
                    </div>
                  </div>

                  {/* Detay Bilgileri */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-900 pb-3">
                      <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-500" /> {item.calories}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> {item.prepTime}</span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-slate-400 text-xs leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Şarap Eşleşmesi ve Alt Bilgi */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Wine className="w-4 h-4 text-amber-500" /> Sommelier:
                    </span>
                    <span className="text-amber-300 font-bold">{item.winePairing}</span>
                  </div>

                  <button 
                    onClick={openWhatsApp}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 hover:border-amber-500 text-slate-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    <span>Şefin Masasına Özel Sipariş</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Rezervasyon Konsolu */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <div className="relative rounded-[36px] bg-[#040408] border border-amber-500/40 p-8 md:p-14 overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.15)] backdrop-blur-3xl">
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-amber-500/20 pb-6 gap-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold tracking-widest uppercase">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  <span>Holographic Nexus v4.2 // Secure Terminal</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-serif">
                  Quantum Table Configurator
                </h2>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 border border-amber-500/30 text-xs font-mono text-amber-300 shadow-inner">
                <Cpu className="w-5 h-5 text-amber-400 animate-spin" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">AI Synced Slots</div>
                  <div className="font-bold">Real-time Telemetry Active</div>
                </div>
              </div>
            </div>

            {/* Salon Seçimi */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-[0.2em] text-amber-400/80 font-bold">
                01. Deneyim Alanını Seçin
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Chef Table', desc: 'Mutfak Önü Özel Sahne', badge: 'Ultra VIP' },
                  { name: 'Main Dining', desc: 'Ana Salon & Akustik Atmosfer', badge: 'Popüler' },
                  { name: 'Terrace Lounge', desc: 'Panoramik Boğaz Manzarası', badge: 'Manzaralı' },
                  { name: 'Private Room', desc: 'İzole & Gizli Rezidans', badge: 'Kişiye Özel' }
                ].map((area) => (
                  <button
                    key={area.name}
                    type="button"
                    onClick={() => setSeatingArea(area.name as any)}
                    className={`group relative p-5 rounded-2xl border transition-all duration-300 text-left ${
                      seatingArea === area.name
                        ? 'bg-gradient-to-b from-amber-500/20 to-black/80 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                        : 'bg-black/40 border-slate-800/80 text-slate-400 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="absolute top-3 right-3 text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {area.badge}
                    </div>
                    <Compass className={`w-5 h-5 mb-3 ${seatingArea === area.name ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className="text-sm font-bold font-serif text-white mb-1">{area.name}</div>
                    <div className="text-[11px] text-slate-400 font-light">{area.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            {isReserved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-emerald-950/40 border-2 border-emerald-500/60 text-emerald-300 font-mono space-y-4 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white font-serif">Kuantum Rezervasyonunuz Onaylandı!</h3>
                <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  <span className="text-amber-400 font-bold">{seatingArea}</span> lokasyonunda, <span className="text-amber-400 font-bold">{guestCount} Misafir</span> için saat <span className="text-amber-400 font-bold">{timeSlot}</span> oturumunuz rezerve edilmiştir. VIP konsiyerj pass kodunuz WhatsApp hattınıza iletildi.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleReservation} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                      02. Misafir Adı & Soyadı
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Lord / Lady Altuğ"
                      className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                      03. İletişim Hattı (WhatsApp / SMS)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+90 (555) 000 00 00"
                      className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                      04. Deneyim Tarihi
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                      05. Oturum Saati
                    </label>
                    <select 
                      value={timeSlot} 
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-all"
                    >
                      <option>19:00 (Chef's Session)</option>
                      <option>20:00 (Main Degustation)</option>
                      <option>21:30 (Late Lounge)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                      06. Misafir Kapasitesi
                    </label>
                    <select 
                      value={guestCount} 
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-5 py-3.5 rounded-2xl bg-black/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-all"
                    >
                      <option value={2}>2 Kişi (VIP Table)</option>
                      <option value={4}>4 Kişi (Exclusive)</option>
                      <option value={6}>6+ Kişi (Private Lounge)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-3"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Kuantum Kod ile Anında Rezerve Et</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openWhatsApp}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950" />
          <span className="font-mono tracking-wider uppercase">VIP Concierge Hat</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden border border-amber-500/40">
              <img src={selectedImage} alt="Ultra Detail" className="w-full h-full object-contain" />
              <button 
                onClick={() => setSelectedImage(null)}
                aria-label="Kapat"
                className="absolute top-4 right-4 p-3 rounded-full bg-slate-950/80 border border-white/20 text-white hover:bg-amber-500 hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-10 border-t border-slate-900 text-center text-xs font-mono text-slate-500">
        <p>© L'Étoile Noir Showcase</p>
      </footer>
    </main>
  );
}