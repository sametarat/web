'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Search, 
  Bot, 
  Send,
  Wifi,
  Coffee,
  Waves,
  MapPin,
  Filter,
  Sparkles
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  category: string;
  pricePerNight: number;
  rating: number;
  image: string;
  features: string[];
  maxGuests: number;
  tag: string;
  description: string;
  location: string;
}

// --- GENİŞLETİLMİŞ MÜLK PORTFÖYÜ (6 Farklı Mülk/Oda) ---
const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Panoramik Manzaralı King Suite',
    category: 'Süit',
    pricePerNight: 9200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    features: ['Jakuzi', 'Deniz Manzarası', 'Teras', 'Kral Yatak'],
    maxGuests: 2,
    tag: 'En Popüler',
    description: 'Kesintisiz deniz manzarasına sahip, geniş teraslı ve özel jakuzili lüks süit.',
    location: 'Ana Bina - 4. Kat'
  },
  {
    id: '2',
    name: 'Müstakil Havuzlu Beach Villa',
    category: 'Villa',
    pricePerNight: 16500,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    features: ['Özel Havuz', 'Sahil Erişimi', '4 Kişilik', 'Veranda'],
    maxGuests: 4,
    tag: 'Ultra Lüks',
    description: 'Doğrudan kumsala açılan, özel yüzme havuzlu ve geniş bahçeli müstakil lüks villa.',
    location: 'Sahil Şeridi'
  },
  {
    id: '3',
    name: 'Deluxe Bosphorus Loft',
    category: 'Loft',
    pricePerNight: 5800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    features: ['Çalışma Masası', 'Hızlı Wi-Fi', 'Minibar', 'Boğaz Manzarası'],
    maxGuests: 2,
    tag: 'Konfor Seçeneği',
    description: 'Yüksek tavanlı modern mimarisi ve şehir manzarasıyla ideal bir konaklama deneyimi.',
    location: 'Doğu Blok'
  },
  {
    id: '4',
    name: 'Doğa İçinde Minimalist Bungalov',
    category: 'Bungalov',
    pricePerNight: 4200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
    features: ['Şömine', 'Veranda', 'Sessiz Konum', 'Açık Hava Sineması'],
    maxGuests: 2,
    tag: 'Doğa & Huzur',
    description: 'Çam ormanlarının arasında, şömineli ve tam mahremiyet sunan ahşap tasarım bungalov.',
    location: 'Kuzey Bahçeleri'
  },
  {
    id: '5',
    name: 'Penthouse Panorama Residence',
    category: 'Penthouse',
    pricePerNight: 22000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    features: ['360° Manzara', 'Özel Asansör', 'Özel Mutfak', 'Sauna'],
    maxGuests: 6,
    tag: 'VIP Özel',
    description: 'Otelimizin en üst katında yer alan, sauna ve özel hizmet ekibiyle sunulan 360 derece manzaralı penthouse.',
    location: 'Çatı Katı (VIP)'
  },
  {
    id: '6',
    name: 'Garden Relax Suite',
    category: 'Süit',
    pricePerNight: 6500,
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    features: ['Özel Bahçe', 'Hamak', 'Kahvaltı Dahil', 'Geniş Banyo'],
    maxGuests: 3,
    tag: 'Bahçe Manzaralı',
    description: 'Botanik bahçeye doğrudan erişimi olan, huzurlu ve geniş dinlenme alanı sunan süit.',
    location: 'Zemin Kat - Bahçe Cephe'
  }
];

export default function HotelPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  
  // Arama & Tarih Seçimi Form State'leri
  const [checkIn, setCheckIn] = useState('2026-07-10');
  const [checkOut, setCheckOut] = useState('2026-07-14');
  const [searchGuests, setSearchGuests] = useState<number>(2);

  // Arama Yapıldıktan Sonra Uygulanan Misafir Filtresi
  const [appliedGuests, setAppliedGuests] = useState<number>(1);

  // Form State'leri
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  // Ek Hizmetler
  const [extras, setExtras] = useState({
    airportTransfer: false,
    breakfast: true,
    spaAccess: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);

  // Chatbot State'leri
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Merhaba! Aetheria Hotel Asistanına hoş geldiniz. Mülklerimiz, boş odalarımız veya tesis imkanları hakkında sorularınızı yanıtlayabilirim.' }
  ]);

  // Gece Sayısı Hesaplama
  const numberOfNights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Kategori Listesi
  const categories = useMemo(() => {
    return ['Tümü', ...Array.from(new Set(ROOMS.map(r => r.category)))];
  }, []);

  // Filtreleme Mantığı (Kategori + Uygulanan Misafir Sayısı)
  const filteredRooms = useMemo(() => {
    return ROOMS.filter(r => {
      const matchCategory = selectedCategory === 'Tümü' || r.category === selectedCategory;
      const matchGuests = r.maxGuests >= appliedGuests;
      return matchCategory && matchGuests;
    });
  }, [selectedCategory, appliedGuests]);

  // Arama Butonuna Tıklandığında Çalışacak Fonksiyon
  const handleSearch = () => {
    // Seçilen misafir kapasitesini uygulamaya sok
    setAppliedGuests(searchGuests);

    // Mülkler alanına yumuşak geçiş yap
    const section = document.getElementById('mulkler');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toplam Tutar Hesaplama
  const calculateTotal = (basePrice: number) => {
    let extraCost = 0;
    if (extras.airportTransfer) extraCost += 1200;
    if (extras.breakfast) extraCost += 500 * numberOfNights;
    if (extras.spaAccess) extraCost += 800;
    return (basePrice * numberOfNights) + extraCost;
  };

  // Chatbot Mesaj Gönderimi
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Giriş saatimiz 14:00, çıkış saatimiz ise 12:00'dir. Detaylı bilgi için resepsiyonumuzla iletişime geçebilirsiniz.";
      const lower = userText.toLowerCase();

      if (lower.includes('fiyat') || lower.includes('ücret')) {
        reply = "Mülklerimizin fiyatları gecelik ₺4.200 (Bungalov) ile ₺22.000 (Penthouse) arasında değişmektedir.";
      } else if (lower.includes('villa') || lower.includes('havuz')) {
        reply = "Müstakil Havuzlu Beach Villa seçeneğimiz özel yüzme havuzlu ve doğrudan kumsala açılan geniş bir seçenektir.";
      } else if (lower.includes('kaç mülk') || lower.includes('oda sayısı')) {
        reply = "Bünyemizde Süit, Villa, Loft, Bungalov ve Penthouse konseptlerinde toplam 6 farklı lüks konaklama seçeneği bulunmaktadır.";
      } else if (lower.includes('kahvaltı')) {
        reply = "Açık büfe kahvaltımız her sabah 07:30 - 10:30 saatleri arasında sunulmaktadır.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-serif font-bold text-amber-400 tracking-wider">AETHERIA HOTEL & RESIDENCES</span>
        </div>
        
        <div className="flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#mulkler" className="hover:text-amber-400 transition-colors">Mülklerimiz ({ROOMS.length})</a>
          <a href="#hizmetler" className="hover:text-amber-400 transition-colors">Tesis İmkanları</a>
          <a href="#iletisim" className="hover:text-amber-400 transition-colors">İletişim</a>
        </div>
      </header>

      {/* Hero Alanı */}
      <section className="relative py-20 px-6 md:px-16 max-w-7xl mx-auto text-center space-y-6">
        <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Kişiselleştirilmiş Konaklama Portföyü</span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
          Ayrıcalıklı Mülkleri <br />
          <span className="text-slate-400 italic">Keşfedin</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          Süitlerden özel havuzlu villalara, orman bungalowlarından çatı penthouse'larına kadar ihtiyacınıza uygun lüks alanlar.
        </p>

        {/* Arama Konsolu */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-3 items-center shadow-2xl mt-8">
          <div className="text-left px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[10px] text-amber-400 uppercase font-semibold block">Giriş Tarihi</label>
            <input 
              type="date" 
              value={checkIn} 
              onChange={(e) => setCheckIn(e.target.value)} 
              className="w-full bg-transparent text-xs text-white focus:outline-none mt-1 cursor-pointer" 
            />
          </div>
          <div className="text-left px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[10px] text-amber-400 uppercase font-semibold block">Çıkış Tarihi</label>
            <input 
              type="date" 
              value={checkOut} 
              onChange={(e) => setCheckOut(e.target.value)} 
              className="w-full bg-transparent text-xs text-white focus:outline-none mt-1 cursor-pointer" 
            />
          </div>
          <div className="text-left px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[10px] text-amber-400 uppercase font-semibold block">Misafir Sayısı</label>
            <select 
              value={searchGuests} 
              onChange={(e) => setSearchGuests(Number(e.target.value))} 
              className="w-full bg-transparent text-xs text-white focus:outline-none mt-1 cursor-pointer"
            >
              <option value={1} className="bg-slate-900">1 Kişi</option>
              <option value={2} className="bg-slate-900">2 Kişi</option>
              <option value={4} className="bg-slate-900">4 Kişi (Villa)</option>
              <option value={6} className="bg-slate-900">6 Kişi (Penthouse)</option>
            </select>
          </div>
          
          {/* ÇALIŞAN ARAMA BUTONU */}
          <button 
            type="button"
            onClick={handleSearch}
            className="w-full h-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/20 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Mülk Taraması</span>
          </button>
        </div>
      </section>

      {/* Mülk Filtreleme ve Izgara Liste */}
      <section id="mulkler" className="py-12 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Öne Çıkan Mülkler</h2>
            <p className="text-slate-400 text-xs mt-1">{filteredRooms.length} konaklama seçeneği listeleniyor • {numberOfNights} Gece</p>
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
            <p className="text-sm">Seçilen kriterlere uygun mülk bulunamadı.</p>
            <button 
              onClick={() => { setSelectedCategory('Tümü'); setAppliedGuests(1); setSearchGuests(1); }} 
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div key={room.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 group">
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 text-amber-400 text-[10px] font-semibold uppercase">
                      {room.tag}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {room.location}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{room.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{room.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-xs line-clamp-2">{room.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {room.features.map(f => (
                        <span key={f} className="px-2.5 py-1 rounded-lg bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gecelik Tutar</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">₺{room.pricePerNight.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                  >
                    Detay & Rezervasyon
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Otel Özellikleri */}
      <section id="hizmetler" className="py-16 bg-slate-900/50 border-y border-slate-800 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2 p-4">
            <Coffee className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm text-white">Gourmet Restoran</h4>
            <p className="text-xs text-slate-400">Şeflerimizden özel lezzetler ve odaya servis imkanı.</p>
          </div>
          <div className="space-y-2 p-4">
            <Waves className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm text-white">SPA & Wellness</h4>
            <p className="text-xs text-slate-400">Isıtmalı havuz, Türk hamamı ve sauna alanları.</p>
          </div>
          <div className="space-y-2 p-4">
            <Wifi className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm text-white">Özel Concierge</h4>
            <p className="text-xs text-slate-400">7/24 kişiye özel transfer ve tur organizasyonları.</p>
          </div>
          <div className="space-y-2 p-4">
            <Bot className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm text-white">Dijital Resepsiyonist</h4>
            <p className="text-xs text-slate-400">Anlık sorularınız ve danışma için canlı chatbot asistanı.</p>
          </div>
        </div>
      </section>

      {/* Rezervasyon Modalı */}
      <AnimatePresence>
        {isModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl z-10 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Mülk Rezervasyonu</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {reservationComplete ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Rezervasyon Talebiniz Alındı!</h4>
                  <p className="text-xs text-slate-400">Onay detayları kayıtlı e-posta ve telefon numaranıza iletilmiştir.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setReservationComplete(true); setTimeout(() => { setReservationComplete(false); setIsModalOpen(false); }, 3000); }} className="space-y-4">
                  
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <img src={selectedRoom.image} alt={selectedRoom.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white">{selectedRoom.name}</div>
                      <div className="text-[10px] text-slate-400">{selectedRoom.location}</div>
                      <div className="text-xs text-amber-400 font-bold mt-1">₺{selectedRoom.pricePerNight.toLocaleString()} / Gece ({numberOfNights} Gece)</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-slate-400 block">Kişisel Bilgiler</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Adınız Soyadınız" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400" 
                    />
                    <input 
                      type="tel" 
                      required 
                      placeholder="Telefon Numaranız" 
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400" 
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-slate-400 block">Ek Hizmetler</label>
                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                      <span>VIP Havalimanı Transferi (+₺1.200)</span>
                      <input type="checkbox" checked={extras.airportTransfer} onChange={(e) => setExtras(p => ({ ...p, airportTransfer: e.target.checked }))} className="accent-amber-400 cursor-pointer" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Toplam Tutar</span>
                      <span className="text-lg font-bold text-amber-400 font-mono">₺{calculateTotal(selectedRoom.pricePerNight).toLocaleString()}</span>
                    </div>
                    <button type="submit" className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer">
                      Rezervasyonu Onayla
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SAĞ ALT KÖŞE: 7/24 CANLI DESTEK CHATBOTU --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-80 md:w-96 h-[450px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
            >
              {/* Chat Header */}
              <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Aetheria Destek</span>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Resepsiyon Asistanı
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Mülkler veya olanaklar hakkında sorun..." 
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <button type="submit" className="p-2 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="p-4 rounded-full bg-amber-500 text-slate-950 shadow-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 font-bold text-xs cursor-pointer"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">Canlı Destek</span>
        </button>
      </div>

      {/* Footer */}
      <footer id="iletisim" className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Aetheria Hotel & Residences. Tüm hakları saklıdır.</p>
      </footer>
    </main>
  );
}