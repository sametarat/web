'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Waves, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Search,
  BedDouble,
  Sparkles,
  Compass,
  Zap,
  Home,
  Mail,
  Send,
  Bot
} from 'lucide-react';

// --- YENİLİKÇİ ODALAR & DENEYİMLER ---
const ROOMS = [
  {
    id: '1',
    name: 'Aether Panorama Suite',
    category: 'Sky Suite',
    pricePerNight: 9200,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    features: ['360° Cam Tavan', 'AI Akıllı Oda Asistanı', 'Özel Sonsuzluk Havuzu'],
    maxGuests: 2,
    tag: 'En Çok Tercih Edilen'
  },
  {
    id: '2',
    name: 'Biophilic Eco Villa',
    category: 'Private Villa',
    pricePerNight: 14500,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    features: ['Yapay Zeka İklimlendirme', 'Organik Bahçe', 'Kişisel Butler'],
    maxGuests: 4,
    tag: 'Ultra Lüks'
  },
  {
    id: '3',
    name: 'Cyber-Minimalist Loft',
    category: 'Smart Room',
    pricePerNight: 5800,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    features: ['Holografik Eğlence', 'Ergonomik Tasarım', 'High-Speed Fiber'],
    maxGuests: 2,
    tag: 'Yeni Nesil'
  }
];

export default function InnovativeHotelPage() {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkIn, setCheckIn] = useState('2026-07-10');
  const [checkOut, setCheckOut] = useState('2026-07-14');
  const [guests, setGuests] = useState(2);
  const [smartExtras, setSmartExtras] = useState({
    aiButler: true,
    airportTransfer: false,
    spaAccess: false
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Chatbot State'leri
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Merhaba! Ben Aetheria AI Asistanıyım. Oda seçimi, özellikler veya rezervasyon hakkında size nasıl yardımcı olabilirim?' }
  ]);

  const calculateTotal = (basePrice: number) => {
    let extraCost = 0;
    if (smartExtras.aiButler) extraCost += 750;
    if (smartExtras.airportTransfer) extraCost += 1200;
    if (smartExtras.spaAccess) extraCost += 900;
    return basePrice + extraCost;
  };

  const handleOpenBooking = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationComplete(true);
    setTimeout(() => {
      setReservationComplete(false);
      setIsModalOpen(false);
      setSelectedRoom(null);
    }, 4000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setIsContactModalOpen(false);
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let botReply = 'Harika bir soru! Süitlerimiz hakkında daha detaylı bilgi veya özel organizasyon talepleriniz için iletişim formunu kullanabilirsiniz.';
      if (userMsg.toLowerCase().includes('fiyat') || userMsg.toLowerCase().includes('ücret')) {
        botReply = 'Gecelik fiyatlarımız ₺5.800 ile ₺14.500 arasında değişmektedir. Seçtiğiniz odaya göre eklenti modüllerini özelleştirebilirsiniz.';
      } else if (userMsg.toLowerCase().includes('havuz') || userMsg.toLowerCase().includes('villa')) {
        botReply = 'Biophilic Eco Villa ve Aether Panorama Suite ünitelerimizde özel havuz ve 360° cam tavan özellikleri bulunmaktadır.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      
      {/* Arka Plan Efektleri */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 text-xs font-mono"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>Ana Sayfaya Dön</span>
          </a>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-lg font-black tracking-wider uppercase text-white">
              Aetheria.AI
            </span>
          </div>
        </div>

        <div>
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="px-3 md:px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Özel Tasarım İçin İletişime Geç</span>
            <span className="sm:hidden">İletişim</span>
          </button>
        </div>
      </header>

      {/* Hero Alanı */}
      <section className="relative py-24 px-6 md:px-16 max-w-7xl mx-auto text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yapay Zeka Destekli Konaklama Deneyimi</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">
          Geleceğin Otelini <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Bugün Deneyimleyin</span>
        </h1>

        {/* Arama Konsolu */}
        <div className="p-4 md:p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-left px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
            <label className="text-[10px] font-mono text-cyan-400 uppercase">Giriş Zamanı</label>
            <input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono mt-1"
            />
          </div>
          <div className="text-left px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
            <label className="text-[10px] font-mono text-cyan-400 uppercase">Çıkış Zamanı</label>
            <input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono mt-1"
            />
          </div>
          <div className="text-left px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
            <label className="text-[10px] font-mono text-cyan-400 uppercase">Misafir Birimi</label>
            <select 
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono mt-1"
            >
              <option value={1} className="bg-slate-900">1 Kişi</option>
              <option value={2} className="bg-slate-900">2 Kişi</option>
              <option value={3} className="bg-slate-900">3 Kişi</option>
              <option value={4} className="bg-slate-900">4+ Kişi</option>
            </select>
          </div>
          <button className="w-full h-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            <span>Sistem Taraması</span>
          </button>
        </div>
      </section>

      {/* Oda Vitrini */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Kuantum Süitler</h2>
          <p className="text-xs font-mono text-slate-400 mt-1">Yapay zeka optimize edilmiş konaklama üniteleri</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ROOMS.map((room) => (
            <div 
              key={room.id}
              className="group rounded-3xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/50 overflow-hidden flex flex-col justify-between transition-all duration-500 backdrop-blur-xl"
            >
              <div>
                <div className="relative h-72 overflow-hidden bg-slate-950">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase backdrop-blur-md">
                    {room.tag}
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white text-[10px] font-mono font-bold uppercase backdrop-blur-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                    <span>{room.rating}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Gecelik Baz Fiyat</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono">₺{room.pricePerNight.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{room.name}</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {room.features.map(feat => (
                      <span key={feat} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button 
                  onClick={() => handleOpenBooking(room)}
                  className="w-full py-4 rounded-2xl bg-white/5 hover:bg-cyan-500 hover:text-slate-950 border border-white/10 hover:border-cyan-500 text-slate-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Özelleştir ve Rezerve Et</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rezervasyon Modalı */}
      <AnimatePresence>
        {isModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-xl bg-[#080c19] border border-cyan-500/30 p-8 rounded-3xl shadow-2xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Nöral Rezervasyon Protokolü</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {reservationComplete ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white">Protokol Başarıyla Onaylandı!</h4>
                </div>
              ) : (
                <form onSubmit={handleConfirmReservation} className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <img src={selectedRoom.image} alt={selectedRoom.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white">{selectedRoom.name}</div>
                      <div className="text-xs font-mono text-cyan-400 mt-1">₺{selectedRoom.pricePerNight.toLocaleString()} / Gece</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-cyan-400 uppercase">Akıllı Eklenti Modülleri</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button type="button" onClick={() => setSmartExtras(prev => ({ ...prev, aiButler: !prev.aiButler }))} className={`p-3 rounded-xl border text-left text-[10px] font-mono ${smartExtras.aiButler ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>AI Butler</button>
                      <button type="button" onClick={() => setSmartExtras(prev => ({ ...prev, airportTransfer: !prev.airportTransfer }))} className={`p-3 rounded-xl border text-left text-[10px] font-mono ${smartExtras.airportTransfer ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>VIP Transfer</button>
                      <button type="button" onClick={() => setSmartExtras(prev => ({ ...prev, spaAccess: !prev.spaAccess }))} className={`p-3 rounded-xl border text-left text-[10px] font-mono ${smartExtras.spaAccess ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>Quantum Spa</button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-mono text-slate-300">
                    <div>
                      <label className="text-slate-400 block mb-1">Misafir Adı Soyadı</label>
                      <input type="text" required placeholder="Samet Aratoğlu" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">Toplam Tutar</span>
                      <span className="text-xl font-black text-cyan-400 font-mono">₺{calculateTotal(selectedRoom.pricePerNight).toLocaleString()}</span>
                    </div>
                    <button type="submit" className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest">Onayla ve Öde</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* İletişim Modalı */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsContactModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#080c19] border border-cyan-500/30 p-8 rounded-3xl shadow-2xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Özel Tasarım ve Proje Talebi</h3>
                </div>
                <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {contactSent ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white">Talebiniz Alındı!</h4>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">Ad Soyad</label>
                    <input type="text" required placeholder="Samet Aratoğlu" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">E-posta</label>
                    <input type="email" required placeholder="ornek@domain.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Proje Detayları</label>
                    <textarea rows={4} required placeholder="Taleplerinizi belirtin..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest">Talep Gönder</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AETHERIA AI CHATBOT (SAĞ ALT KÖŞE) --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-80 md:w-96 h-[480px] bg-[#080c19] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 backdrop-blur-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono text-white">Aetheria AI Asistan</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/5 border border-white/10 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Bir şeyler sorun..." 
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs font-mono text-slate-500 relative z-10">
        <p>© 2026 Aetheria.AI • Autonomous Hotel & Neural Hospitality Systems</p>
      </footer>
    </main>
  );
}