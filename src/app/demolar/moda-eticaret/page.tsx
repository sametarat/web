'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  X, 
  Home, 
  Mail, 
  Send, 
  Bot, 
  MessageCircle,
  ArrowRight,
  Heart,
  SlidersHorizontal
} from 'lucide-react';

// --- MODA ÜRÜN SEÇKİSİ ---
const FASHION_ITEMS = [
  {
    id: '1',
    name: 'Obsidian Oversized Trench',
    category: 'Outerwear',
    price: 4850,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    description: 'Su itici teknik kumaş, mat siyah detaylar ve minimalist kesim.',
    tag: 'Yeni Sezon'
  },
  {
    id: '2',
    name: 'Cyberpunk Pleated Trousers',
    category: 'Bottoms',
    price: 2950,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    description: 'Yüksek bel, akışkan dokulu premium gabardin kumaş.',
    tag: 'Limited Edition'
  },
  {
    id: '3',
    name: 'Neomorphic Structured Blazer',
    category: 'Tailoring',
    price: 6200,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    description: 'Asimetrik yaka yapısı ve özel dikim hatlarıyla fütüristik şıklık.',
    tag: 'İmza Koleksiyon'
  }
];

export default function FashionEcommercePage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Chatbot State'leri
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour! Aetheria Moda Asistanına hoş geldiniz. Koleksiyonlar, beden rehberi veya özel tasarım talepleriniz için buradayım.' }
  ]);

  const handleOpenOrder = (item: any) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    setTimeout(() => {
      setOrderComplete(false);
      setIsModalOpen(false);
      setSelectedProduct(null);
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
      let botReply = 'Harika bir parça seçtiniz! Kombin önerileri veya özel siparişleriniz için iletişim formunu kullanabilirsiniz.';
      if (userMsg.toLowerCase().includes('beden') || userMsg.toLowerCase().includes('ölçü')) {
        botReply = 'Ürünlerimiz oversize ve regular kesim olarak ayrılmaktadır. Detaylı beden tablosu için asistanımızdan destek alabilirsiniz.';
      } else if (userMsg.toLowerCase().includes('kargo') || userMsg.toLowerCase().includes('teslimat')) {
        botReply = 'Tüm siparişleriniz özel korumalı fütüristik ambalajlarla aynı gün kargoya verilmektedir.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-neutral-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      
      {/* Arka Plan Işık Efektleri */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-purple-600/10 via-indigo-500/5 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Header / Navigasyon */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-purple-500/10 px-4 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-purple-500/20 text-purple-200/80 hover:text-purple-300 transition-all flex items-center gap-2 text-xs font-mono"
          >
            <Home className="w-4 h-4 text-purple-400" />
            <span>Ana Sayfa</span>
          </a>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-purple-500/20">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-black tracking-widest uppercase text-white font-serif">
              AETHERIA COUTURE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="px-3 md:px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Özel Tasarım İçin İletişime Geç</span>
            <span className="sm:hidden">İletişim</span>
          </button>
        </div>
      </header>

      {/* Hero Alanı */}
      <section className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto text-center space-y-6 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-mono uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autumn / Winter 2026 Collection</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-600 font-serif">
          AETHERIA COUTURE
        </h1>

        <p className="max-w-2xl mx-auto text-xs md:text-sm font-mono text-purple-200/60 uppercase tracking-widest leading-relaxed">
          Geleceğin sokak modası ve haute couture çizgilerinin kusursuz sentezi. Akıllı dokuma kumaşlar ve sınırlı üretim seriler.
        </p>
      </section>

      {/* Ürün Vitrini */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-12 flex items-center justify-between border-b border-purple-500/10 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-serif">Sezon Seçkisi</h2>
            <p className="text-xs font-mono text-purple-200/50 mt-1">Özenle tasarlanmış fütüristik silüetler</p>
          </div>
          <SlidersHorizontal className="w-5 h-5 text-purple-400 hidden sm:block" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FASHION_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="group rounded-3xl bg-neutral-900/40 border border-purple-500/15 hover:border-purple-500/50 overflow-hidden flex flex-col justify-between transition-all duration-500 backdrop-blur-xl"
            >
              <div>
                <div className="relative h-80 overflow-hidden bg-neutral-950">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold uppercase backdrop-blur-md">
                    {item.tag}
                  </div>

                  <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-purple-500/20 text-purple-300 backdrop-blur-md hover:text-white transition-colors cursor-pointer">
                    <Heart className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-200/60">{item.category}</span>
                    <span className="text-2xl font-black text-purple-300 font-mono">₺{item.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors font-serif">{item.name}</h3>
                  <p className="text-xs font-mono text-purple-200/60 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button 
                  onClick={() => handleOpenOrder(item)}
                  className="w-full py-4 rounded-2xl bg-white/5 hover:bg-purple-600 hover:text-white border border-purple-500/20 hover:border-purple-500 text-purple-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Hemen Satın Al / Sepete Ekle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Satın Alma / Sipariş Modalı */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0e0e14] border border-purple-500/40 p-8 rounded-3xl shadow-2xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white font-serif">Sipariş Onay Protokolü</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-purple-200/60 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {orderComplete ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-purple-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white font-serif">Siparişiniz Başarıyla Oluşturuldu!</h4>
                </div>
              ) : (
                <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs font-mono">
                  {selectedProduct && (
                    <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center gap-4">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white font-serif">{selectedProduct.name}</div>
                        <div className="text-purple-400 mt-0.5">₺{selectedProduct.price.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-purple-200/60 block mb-1">Beden Seçimi</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 rounded-xl border text-center font-bold transition-all ${selectedSize === size ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-purple-500/20 text-purple-200/70 hover:bg-white/10'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-purple-200/60 block mb-1">Teslimat Adresi / Ad Soyad</label>
                    <input type="text" required placeholder="Samet Aratoğlu - İstanbul" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest">Siparişi Tamamla</button>
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0e0e14] border border-purple-500/40 p-8 rounded-3xl shadow-2xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white font-serif">Özel Tasarım ve Proje Talebi</h3>
                </div>
                <button onClick={() => setIsContactModalOpen(false)} className="text-purple-200/60 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {contactSent ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-purple-400 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-white font-serif">Talebiniz Alındı!</h4>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-purple-200/60 block mb-1">Ad Soyad</label>
                    <input type="text" required placeholder="Samet Aratoğlu" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-purple-200/60 block mb-1">E-posta</label>
                    <input type="email" required placeholder="ornek@domain.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-purple-200/60 block mb-1">Özel Tasarım / Koleksiyon Detayları</label>
                    <textarea rows={4} required placeholder="Özel dikim veya kurumsal işbirliği talepleriniz..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500 resize-none" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest">Talep Gönder</button>
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
              className="w-80 md:w-96 h-[480px] bg-[#0e0e14] border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-2 backdrop-blur-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 bg-white/5 border-b border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono text-white">Aetheria AI Asistan</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-purple-200/60 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-600 text-white font-bold' : 'bg-white/5 border border-purple-500/20 text-purple-100/90'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-purple-500/20 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Koleksiyon veya beden hakkında soru sorun..." 
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-purple-500/20 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:scale-105 transition-all flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-purple-500/10 text-center text-xs font-mono text-purple-200/40 relative z-10">
        <p>© 2026 Aetheria Couture • Future Fashion & Apparel Systems</p>
      </footer>
    </main>
  );
}