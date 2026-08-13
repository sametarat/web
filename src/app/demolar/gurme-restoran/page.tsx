'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Sparkles, 
  Star, 
  Calendar, 
  Users, 
  CheckCircle2, 
  X, 
  Home, 
  Mail, 
  Send, 
  Bot, 
  MessageCircle,
  ChefHat,
  Wine,
  Flame,
  ArrowRight
} from 'lucide-react';

// --- GURME MENÜ SEÇKİSİ ---
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Truffle Infused Wagyu',
    category: 'Ana Yemek',
    price: 3400,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    description: 'A5 Dereceli Wagyu bonfile, siyah trüf mantarı püresi ve özel tütsülenmiş portakal sosu ile.',
    tag: 'Şefin İmzası'
  },
  {
    id: '2',
    name: 'Molecular Sphere Scallop',
    category: 'Başlangıç',
    price: 1850,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
    description: 'Deniz tarağı, safran küresi, deniz fasulyesi ve havyar emülsiyonu.',
    tag: 'Moleküler'
  },
  {
    id: '3',
    name: 'Obsidian Gold Sphere',
    category: 'Tatlı',
    price: 1400,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=80',
    description: 'Yenilebilir 24K altın yapraklı bitter çikolata küresi, Madagaskar vanilyalı dondurma dolgusu.',
    tag: 'Özel Seri'
  }
];

export default function GourmetRestaurantPage() {
  const [selectedTableItem, setSelectedTableItem] = useState<any>(null);
  const [reservationDate, setReservationDate] = useState('2026-07-15');
  const [guestCount, setGuestCount] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Chatbot State'leri
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour! L\'Étoile Noir gastronomi asistanına hoş geldiniz. Masa rezervasyonu veya özel tasarım talepleriniz için size nasıl yardımcı olabilirim?' }
  ]);

  const handleOpenReservation = (item: any) => {
    setSelectedTableItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationComplete(true);
    setTimeout(() => {
      setReservationComplete(false);
      setIsModalOpen(false);
      setSelectedTableItem(null);
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
      let botReply = 'Mükemmel bir lezzet tercihi! Özel tadım menüleri veya özel tasarım talepleriniz için iletişim formunu kullanabilirsiniz.';
      if (userMsg.toLowerCase().includes('fiyat') || userMsg.toLowerCase().includes('ücret')) {
        botReply = 'Yemeklerimiz ve tadım menülerimiz ₺1.400 ile ₺3.400 arasında değişmektedir. Özel projeleriniz için teklif alabilirsiniz.';
      } else if (userMsg.toLowerCase().includes('michelin') || userMsg.toLowerCase().includes('ödül')) {
        botReply = 'Restoranımız Michelin Guide 2026 seçkisinde haute gastronomie kategorisinde yer almaktadır.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#050508] text-amber-50/90 font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      
      {/* Arka Plan Işık Efektleri */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-amber-500/5 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Header / Navigasyon */}
      <header className="sticky top-0 z-40 bg-[#050508]/80 backdrop-blur-xl border-b border-amber-500/10 px-4 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-amber-500/20 text-amber-200/80 hover:text-amber-400 transition-all flex items-center gap-2 text-xs font-mono"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Ana Sayfa</span>
          </a>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-amber-500/20">
            <ChefHat className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-black tracking-widest uppercase text-amber-100">
              L'ÉTOILE NOIR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="px-3 md:px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Özel Tasarım İçin İletişime Geç</span>
            <span className="sm:hidden">İletişim</span>
          </button>
        </div>
      </header>

      {/* Hero Alanı */}
      <section className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto text-center space-y-6 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-mono uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Michelin Guide 2026 • Haute Gastronomie</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 font-serif">
          L'ÉTOILE NOIR
        </h1>

        <p className="max-w-2xl mx-auto text-xs md:text-sm font-mono text-amber-200/60 uppercase tracking-widest leading-relaxed">
          Sanatın moleküler lezzetlerle buluştuğu nokta. 4K görsel kalitede hazırlanan anlık menü ve VIP Masa Konfigüratörü.
        </p>
      </section>

      {/* Menü Vitrini */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-12 flex items-center justify-between border-b border-amber-500/10 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-100 font-serif">İmza Seçkiler</h2>
            <p className="text-xs font-mono text-amber-200/50 mt-1">Şefin özel atölyesinden çıkan taze kreasyonlar</p>
          </div>
          <Wine className="w-6 h-6 text-amber-400 hidden sm:block" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MENU_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="group rounded-3xl bg-neutral-900/40 border border-amber-500/15 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-500 backdrop-blur-xl"
            >
              <div>
                <div className="relative h-72 overflow-hidden bg-neutral-950">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase backdrop-blur-md">
                    {item.tag}
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase backdrop-blur-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-200/60">{item.category}</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">₺{item.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors font-serif">{item.name}</h3>
                  <p className="text-xs font-mono text-amber-200/60 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button 
                  onClick={() => handleOpenReservation(item)}
                  className="w-full py-4 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-neutral-950 border border-amber-500/20 hover:border-amber-500 text-amber-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>VIP Masa Rezerve Et</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rezervasyon Modalı */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0b0b0f] border border-amber-500/40 p-8 rounded-3xl shadow-2xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-amber-100 font-serif">Gourmet Masa Protokolü</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-amber-200/60 hover:text-amber-100"><X className="w-5 h-5" /></button>
              </div>

              {reservationComplete ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-amber-100 font-serif">Masa Rezervasyonunuz Onaylandı!</h4>
                </div>
              ) : (
                <form onSubmit={handleConfirmReservation} className="space-y-4 text-xs font-mono">
                  {selectedTableItem && (
                    <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-4">
                      <img src={selectedTableItem.image} alt={selectedTableItem.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-amber-100 font-serif">{selectedTableItem.name}</div>
                        <div className="text-amber-400 mt-0.5">₺{selectedTableItem.price.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-amber-200/60 block mb-1">Rezervasyon Tarihi</label>
                    <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-amber-200/60 block mb-1">Misafir Sayısı</label>
                    <select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500">
                      <option value={1} className="bg-neutral-900">1 Kişi</option>
                      <option value={2} className="bg-neutral-900">2 Kişi</option>
                      <option value={4} className="bg-neutral-900">4 Kişi</option>
                      <option value={6} className="bg-neutral-900">6+ Kişi (VIP Salon)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-amber-200/60 block mb-1">Ad Soyad</label>
                    <input type="text" required placeholder="Samet Aratoğlu" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-widest">Rezervasyonu Tamamla</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Özel Tasarım İletişim Modalı */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsContactModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0b0b0f] border border-amber-500/40 p-8 rounded-3xl shadow-2xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-amber-100 font-serif">Özel Tasarım ve Proje Talebi</h3>
                </div>
                <button onClick={() => setIsContactModalOpen(false)} className="text-amber-200/60 hover:text-amber-100"><X className="w-5 h-5" /></button>
              </div>

              {contactSent ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-amber-100 font-serif">Talebiniz Alındı!</h4>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-amber-200/60 block mb-1">Ad Soyad</label>
                    <input type="text" required placeholder="Samet Aratoğlu" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-amber-200/60 block mb-1">E-posta</label>
                    <input type="email" required placeholder="ornek@domain.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-amber-200/60 block mb-1">Proje Detayları ve Özel İstekler</label>
                    <textarea rows={4} required placeholder="Özel tasarım veya etkinlik taleplerinizi belirtin..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500 resize-none" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-widest">Talep Gönder</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- WHATSAPP & CHATBOT WIDGET (SAĞ ALT KÖŞE) --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* WhatsApp Hızlı Bağlantı Butonu */}
        <a 
          href="https://wa.me/905000000000" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center justify-center"
          title="WhatsApp ile İletişim"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-80 md:w-96 h-[480px] bg-[#0b0b0f] border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-2 backdrop-blur-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 bg-white/5 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono text-amber-100">L'Étoile AI Asistan</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-amber-200/60 hover:text-amber-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-white/5 border border-amber-500/20 text-amber-100/90'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-amber-500/20 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Şefe veya asistana bir şey sorun..." 
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-amber-500/20 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="p-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-amber-500/10 text-center text-xs font-mono text-amber-200/40 relative z-10">
        <p>© 2026 L'Étoile Noir • Haute Gastronomie & Molecular Dining</p>
      </footer>
    </main>
  );
}