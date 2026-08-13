'use client';

import React, { useState, useEffect, useRef, FC, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Activity,
  Radio,
  X,
  Plus,
  ShoppingBasket,
  Calendar,
  Check,
  Mail,
  Send,
  Megaphone,
  CheckSquare,
  Search as SearchIcon,
  Code,
  Bot,
  Maximize2,
  Utensils,
  ShoppingBag,
  Hotel,
  Globe,
  ExternalLink,
  LucideIcon
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface ServiceItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

interface QuestionItem {
  id: string;
  label: string;
  answer: string;
}

interface DemoItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: LucideIcon;
  badgeColor: string;
  accentColor: string;
  metrics: string;
  mockupType: 'restaurant' | 'ecommerce' | 'hotel';
  navItems: string[];
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

// --- CONSTANTS ---
const SERVICES_OVERVIEW: ServiceItem[] = [
  {
    title: 'Özel Web Tasarım & Geliştirme',
    desc: 'İşletmenize özel, Lighthouse %100 hızlı, mobil uyumlu ve yüksek dönüşüm odaklı modern web mimarileri.',
    icon: Code,
    color: 'from-cyan-500 to-blue-500',
    features: ['Sıfır Altyapı Gecikmesi', 'Özel UX/UI Tasarım', 'Core Web Vitals Optimizasyonu']
  },
  {
    title: 'SEO & Arama Motoru Optimizasyonu',
    desc: 'Google arama sonuçlarında kalıcı olarak üst sıralara çıkmanızı sağlayan teknik ve içerik tabanlı SEO altyapısı.',
    icon: SearchIcon,
    color: 'from-emerald-500 to-teal-500',
    features: ['Teknik SEO Denetimi', 'Anahtar Kelime Stratejisi', 'Organik Trafik Artışı']
  },
  {
    title: 'Meta & Google Reklam Yönetimi',
    desc: 'Yüksek ROAS odaklı reklam kurguları, Meta Pixel ve Google dönüşüm optimizasyonları ile bütçe verimliliği.',
    icon: Megaphone,
    color: 'from-purple-500 to-indigo-500',
    features: ['Hedef Kitle Analizi', 'Dönüşüm Odaklı Kreatifler', 'Detaylı ROI Raporlama']
  }
];

const PRESET_QUESTIONS: QuestionItem[] = [
  { id: '1', label: '🚀 Web sitenizi kaç günde kuruyorsunuz?', answer: 'Projelerimizin karmaşıklığına bağlı olarak anahtar teslim web sitelerini ortalama 5 ila 10 iş günü içerisinde yayına alıyoruz.' },
  { id: '2', label: '📈 SEO ile satışlarımı nasıl artırırsınız?', answer: 'Teknik altyapınızı Google standartlarına tamamen uyumlu hale getirerek, potansiyel müşterilerinizin sizi doğrudan arama sonuçlarında bulmasını sağlıyoruz.' },
  { id: '3', label: '💰 Fiyatlandırma politikanız nedir?', answer: 'Her işletmenin ihtiyacı farklı olduğundan, işletmenize özel analiz yaptıktan sonra bütçenize en uygun şeffaf fiyat teklifini sunuyoruz.' },
  { id: '4', label: '⚡ 0.08s hız nasıl mümkün oluyor?', answer: 'Klasik yavaş veritabanı sorguları yerine hibrit Edge mimarisi ve modern önbellekleme teknolojileri kullanarak sayfalarımızın anında açılmasını sağlıyoruz.' },
  { id: '5', label: '🎯 Reklam yönetiminde ROAS garantisi var mı?', answer: 'Meta ve Google reklamlarında nokta atışı hedef kitle kurguları ve düzenli optimizasyonlarla reklam harcama getirisinizi (ROAS) maksimuma çıkarıyoruz.' }
];

const DEMO_LIST: DemoItem[] = [
  {
    id: 'gurme-restoran',
    title: 'Gurme Restoran & Bistro',
    subtitle: 'La Maison - Fine Dining & Gastronomy',
    category: 'Gastronomi & Restoran',
    path: '/demo/gurme-restoran',
    icon: Utensils,
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    accentColor: 'text-amber-400',
    metrics: 'Masa Rezervasyonu: +%240 | Yükleme: 0.05s',
    mockupType: 'restaurant',
    navItems: ['Ana Menü', 'Şefin Spesiyalleri', 'Şarap Kavı', 'Rezervasyon']
  },
  {
    id: 'moda-eticaret',
    title: 'Moda & Lüks E-Ticaret',
    subtitle: 'Vogue & Urban Culture',
    category: 'E-Ticaret & Moda',
    path: '/demo/moda-eticaret',
    icon: ShoppingBag,
    badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
    accentColor: 'text-pink-400',
    metrics: 'Sepete Ekleme: +%180 | Yükleme: 0.08s',
    mockupType: 'ecommerce',
    navItems: ['Yeni Gelenler', 'Erkek', 'Kadın', 'Sepetim']
  },
  {
    id: 'otel-rezervasyon',
    title: 'Otel & Lüks Konaklama',
    subtitle: 'Grand Azure Resort & Spa',
    category: 'Turizm & Otelcilik',
    path: '/demo/otel-rezervasyon',
    icon: Hotel,
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    accentColor: 'text-blue-400',
    metrics: 'Direkt Rezervasyon: +%310 | Yükleme: 0.06s',
    mockupType: 'hotel',
    navItems: ['Odalar & Süitler', 'Spa & Wellness', 'Gastronomi', 'Hızlı Rezerve']
  },
];

// --- COMPONENTS ---

const CyberChatbot: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { 
        id: 'init',
        sender: 'bot', 
        text: 'Merhaba! Ben Nexus AI Asistanı. İşletmeniz için en uygun web mimarisi, SEO veya reklam stratejileri hakkında size nasıl yardımcı olabilirim?', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text, time: userTime };
    
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = 'Talebiniz alınmıştır! Uzman ekibimiz bu konuda size detaylı bilgi vermek için hazır. Hemen hızlı teklif formunu doldurabilir veya doğrudan iletişime geçebilirsiniz.';
      
      const matchedPreset = PRESET_QUESTIONS.find(q => 
        q.label.toLowerCase().includes(text.toLowerCase().substring(0, 10)) || text.toLowerCase().includes(q.id)
      );

      if (matchedPreset) {
        botReply = matchedPreset.answer;
      } else if (text.toLowerCase().includes('fiyat') || text.toLowerCase().includes('ücret')) {
        botReply = 'Fiyatlarımız projenin kapsamına ve gereksinimlerine göre özel olarak belirlenmektedir. Size net bilgi verebilmemiz için web sitenizi ve ihtiyaçlarınızı form üzerinden iletebilirsiniz.';
      } else if (text.toLowerCase().includes('merhaba') || text.toLowerCase().includes('selam')) {
        botReply = 'Merhaba! Nexus Labs ekosistemine hoş geldiniz. Size nasıl rehberlik edebilirim?';
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'bot', text: botReply, time: botTime };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <aside aria-label="Nexus AI Asistan Chatbot" className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] sm:w-[380px] h-[540px] rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden backdrop-blur-2xl mb-4"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-cyan-950/50 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Nexus AI Asistanı <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <p className="text-[10px] font-mono text-cyan-400">Çevrim içi • Anında Yanıt</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Sohbeti Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets */}
            <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSendMessage(q.label)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-[11px] text-cyan-300 whitespace-nowrap transition-all shadow-sm hover:scale-105 active:scale-95"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                aria-label="Gönder"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Nexus AI Asistanı Aç"
        className="relative px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center gap-2.5 group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
        <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
        <span>Nexus AI Asistanı</span>
      </motion.button>
    </aside>
  );
};

const LeadCaptureSection: FC = () => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedService, setSelectedService] = useState('Özel Web Tasarım & Geliştirme');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section id="teklif-al" className="my-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-indigo-950/40 border border-cyan-500/40 relative overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.15)] text-left scroll-mt-28">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5" />
          <span>HIZLI TEKLİF & İLETİŞİM FORMU</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            İşletmeniz İçin En Doğru Çözümü Birlikte Planlayalım
          </h3>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Hangi hizmeti almak istediğinizi seçin, web sitenizi analiz edelim; 15 dakika içinde size özel strateji ve teklif oluşturalım.
          </p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs sm:text-sm flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <strong className="block text-white text-base font-bold">Tebrikler! Talebiniz Alındı.</strong>
              Uzman ekibimiz seçtiğiniz hizmet doğrultusunda analiz yaparak sizinle iletişime geçecektir.
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                'Özel Web Tasarım & Geliştirme',
                'SEO Optimizasyonu',
                'Meta & Google Reklam Yönetimi'
              ].map((srv) => (
                <button
                  type="button"
                  key={srv}
                  onClick={() => setSelectedService(srv)}
                  className={`p-3.5 rounded-xl border text-xs font-mono text-left transition-all flex items-center justify-between ${
                    selectedService === srv
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{srv}</span>
                  {selectedService === srv && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Web siteniz (örn: sirketiniz.com)"
                  value={website}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="sm:col-span-4 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-full py-3.5 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Gönderiliyor...' : 'Teklif Al'}</span>
                  {!loading && <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="flex items-center gap-6 text-[11px] font-mono text-slate-400 pt-2">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Kredi kartı gerekmez</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Doğrudan uzman desteği</span>
        </div>
      </div>
    </section>
  );
};

const TopAdBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  return (
    <aside aria-label="Sponsorlu Duyuru" className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white text-xs font-mono py-2 px-4 relative z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="px-2 py-0.5 rounded bg-black/30 border border-white/20 font-bold uppercase tracking-wider text-[10px] shrink-0">
            SPONSORLU
          </span>
          <span className="truncate">
            🚀 <strong>CloudEdge Pro:</strong> İlk 100 kullanıcıya özel %50 indirimli bulut sunucu altyapısı!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="#teklif-al"
            className="underline font-bold hover:text-cyan-200 transition-colors hidden sm:inline"
          >
            Fırsatı Yakala &rarr;
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-black/20 rounded transition-colors"
            aria-label="Duyuruyu Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

const MetaGoogleAdsCard: FC = () => {
  return (
    <section className="my-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border border-blue-500/40 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]">
      <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-left">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono tracking-widest uppercase">
            <Megaphone className="w-3.5 h-3.5 animate-bounce" />
            <span>META & GOOGLE REKLAM YÖNETİMİ HİZMETİ</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reklam Bütçenizi Boşa Harcamayın, Doğru Kitleyle Satışa Dönüştürün
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
            Meta (Instagram & Facebook) ve Google Ads kampanyalarınızı profesyonel veri analitiği, dönüşüm optimizasyonu ve nokta atışı hedef kitle kurgularıyla yöneterek yüksek ROAS elde edin.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-cyan-300 pt-1">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Profesyonel Meta Pixel Kurulumu</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> Google Performance Max Optimizasyonu</span>
          </div>
        </div>

        <Link
          href="#teklif-al"
          className="px-7 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)] whitespace-nowrap shrink-0 hover:scale-105"
        >
          Reklam Teklifi Al
        </Link>
      </div>
    </section>
  );
};

const ParticleCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor(width / 15), 80);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

const InteractiveRestaurantMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const menuData = [
    { id: 1, name: 'Dry-Aged Truffle Ribeye', price: 1200, category: 'Şefin Spesiyalleri', desc: '28 gün dinlendirilmiş sığır pirzola, siyah trüf mantarı yağı ile.' },
    { id: 2, name: 'Ege Ahtapot & Safran Risotto', price: 850, category: 'Ana Menü', desc: 'Izgara Ege ahtapotu, safran ve parmesan kaplı İtalyan pirinci.' },
    { id: 3, name: 'Château Margaux 2018 Glass', price: 650, category: 'Şarap Kavı', desc: 'Özel mahsul Fransız kırmızısı, fıçı aromalı dinlendirilmiş.' },
  ];

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const total = selectedItems.reduce((acc, id) => {
    const item = menuData.find((m) => m.id === id);
    return acc + (item ? item.price : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {activeTab === 'Rezervasyon' ? (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 max-w-xl mx-auto text-left space-y-4 shadow-xl">
          <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Online Masa Rezervasyonu
          </h4>
          <p className="text-xs text-slate-400">Restoranımızda anlık masa müsaitliğini test edin.</p>
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <input type="date" defaultValue="2026-08-15" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white" />
            <select className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white">
              <option>2 Kişilik Masa</option>
              <option>4 Kişilik VIP Masa</option>
              <option>6+ Kişilik Grup</option>
            </select>
          </div>
          <button 
            onClick={() => setBookingSuccess(true)}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            {bookingSuccess ? '✓ Masa Rezerve Edildi!' : 'Rezervasyonu Onayla'}
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-3 text-left">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              İNTERAKTİF MENÜ KATEGORİSİ: {activeTab}
            </div>
            {menuData.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{item.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-light">{item.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-amber-400 font-mono font-bold text-sm">₺{item.price}</div>
                    <span className="text-[10px] font-mono text-slate-500">{isSelected ? 'Eklendi ✓' : '+ Ekle'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-4 flex flex-col justify-between shadow-xl">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">Masa Sipariş Özeti</h5>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">Lezzet seçmek için soldaki ürünlere tıklayabilirsiniz.</p>
              ) : (
                <ul className="space-y-2 text-xs font-mono">
                  {selectedItems.map((id) => {
                    const item = menuData.find((m) => m.id === id);
                    return (
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={id} className="flex justify-between text-slate-300">
                        <span className="truncate max-w-[120px]">{item?.name}</span>
                        <span className="text-amber-400 font-bold">₺{item?.price}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold font-mono">
                <span className="text-slate-400">Toplam:</span>
                <span className="text-amber-400">₺{total}</span>
              </div>
              <button 
                disabled={selectedItems.length === 0}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Mutfak Sunucusuna Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveEcommerceMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; size: string }[]>([]);
  const [selectedSize, setSelectedSize] = useState('M');

  const products = [
    { id: 101, name: 'Cyberpunk Oversize Hoodie', price: 1899, tag: 'Yeni Sezon' },
    { id: 102, name: 'Mat Siyah Titanium Saat', price: 4250, tag: 'Limited Edition' },
    { id: 103, name: 'Futuristic Techwear Jogger', price: 1450, tag: 'Çok Satan' }
  ];

  const addToCart = (prod: { id: number; name: string; price: number }) => {
    setCart(prev => [...prev, { ...prod, size: selectedSize }]);
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="space-y-6 text-left">
      {activeTab === 'Sepetim' ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-pink-500/30 max-w-xl mx-auto space-y-4 shadow-xl">
          <h4 className="text-sm font-bold text-pink-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShoppingBasket className="w-4 h-4" /> Alışveriş Sepetiniz ({cart.length} Ürün)
          </h4>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-4 text-center">Sepetiniz şu an boş. Ürün eklemek için vitrine göz atın.</p>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-white font-bold">{item.name}</span>
                    <span className="text-[10px] text-pink-400 block">Beden: {item.size}</span>
                  </div>
                  <span className="text-pink-400 font-bold">₺{item.price}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between text-sm font-bold text-white">
                <span>Ara Toplam:</span>
                <span className="text-pink-400">₺{totalPrice}</span>
              </div>
              <button className="w-full py-3 rounded-xl bg-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-pink-400 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                Anında Checkout Et (0.08s)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
            {products.map((prod) => (
              <motion.div 
                whileHover={{ y: -3 }}
                key={prod.id} 
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-pink-500/40 transition-all shadow-lg"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">{prod.tag}</span>
                  <h5 className="text-xs font-bold text-white pt-1">{prod.name}</h5>
                  <div className="text-sm font-mono font-black text-pink-400">₺{prod.price}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex gap-1.5 text-[10px] font-mono">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setSelectedSize(s)}
                        className={`px-2 py-0.5 rounded border transition-colors ${selectedSize === s ? 'bg-pink-500 text-slate-950 border-pink-500 font-bold' : 'border-slate-800 text-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => addToCart(prod)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-pink-500 hover:text-slate-950 text-white font-mono text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Sepete Ekle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">Canlı Sepet Durumu</h5>
              <div className="text-3xl font-black font-mono text-pink-400">
                {cart.length} <span className="text-xs font-normal text-slate-400">Ürün</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                Sepet Tutarı: <strong className="text-white">₺{totalPrice}</strong>
              </p>
            </div>

            <button 
              className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            >
              Sepeti Görüntüle & Öde
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveHotelMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [selectedSuite, setSelectedSuite] = useState('Infinity Pool Villa');

  const basePrice = selectedSuite === 'Infinity Pool Villa' ? 680 : 510;
  const totalPrice = basePrice * nights;

  return (
    <div className="space-y-6 text-left">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-4">
          <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            OTEL MODÜLÜ: {activeTab}
          </div>

          <div className="space-y-3">
            {[
              { name: 'Infinity Pool Villa', desc: 'Özel Isıtmalı Havuz • Panorama Deniz Manzarası', price: 680 },
              { name: 'Private Garden Penthouse', desc: 'Jakuzili Teras • Butler & Özel Hizmet', price: 510 }
            ].map((suite) => (
              <div 
                key={suite.name}
                onClick={() => setSelectedSuite(suite.name)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between shadow-md ${
                  selectedSuite === suite.name 
                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-white">{suite.name}</h5>
                  <p className="text-[11px] text-slate-400 font-light">{suite.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-blue-400 font-mono font-bold text-sm">€{suite.price}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">/ gece</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Konaklama Hesaplayıcı</h5>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Gece Sayısı:</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setNights(Math.max(1, nights - 1))} className="px-3 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">-</button>
                <span className="text-white font-bold px-2">{nights} Gece</span>
                <button onClick={() => setNights(nights + 1)} className="px-3 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">+</button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Misafir Sayısı:</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="px-3 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">-</button>
                <span className="text-white font-bold px-2">{guests} Yetişkin</span>
                <button onClick={() => setGuests(guests + 1)} className="px-3 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">+</button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400">Toplam Tutar:</span>
              <span className="text-blue-400 font-black text-lg">€{totalPrice}</span>
            </div>

            <button className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Direkt Rezerve Et (%0 Komisyon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenchmarkSimulator: FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [progressOld, setProgressOld] = useState(0);
  const [progressNexus, setProgressNexus] = useState(0);
  const [oldStatus, setOldStatus] = useState<'idle' | 'loading' | 'failed' | 'done'>('idle');
  const [nexusStatus, setNexusStatus] = useState<'idle' | 'done'>('idle');

  const runBenchmark = () => {
    setIsTesting(true);
    setProgressOld(0);
    setProgressNexus(0);
    setOldStatus('loading');
    setNexusStatus('idle');

    setTimeout(() => {
      setProgressNexus(100);
      setNexusStatus('done');
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
    <div className="backdrop-blur-2xl bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="text-base font-bold text-white">Karşılaştırmalı Yükleme Testi</h4>
            <p className="text-xs text-slate-400">Sayfa yükleme sürelerinin dönüşüm oranlarına etkisi</p>
          </div>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isTesting}
          className={`px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            isTesting
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          {isTesting ? 'Test Yapılıyor...' : 'Yükleme Testini Başlat'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-rose-500/20 space-y-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-mono text-xs font-bold text-rose-400">KLASİK MONOLİTİK SİTE</span>
            </div>
            <span className="font-mono text-xs text-slate-500">Gecikme: ~3.8s</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Yükleme Durumu</span>
              <span className="text-rose-400 font-bold">{progressOld}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
                animate={{ width: `${progressOld}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="pt-2 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Sunucu Yanıt Süresi (TTFB):</span>
              <span className="text-rose-400 font-semibold">{oldStatus === 'idle' ? '-' : '1,240 ms'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Core Web Vitals Skor:</span>
              <span className="text-rose-400 font-semibold">{oldStatus === 'idle' ? '-' : '38 / 100'}</span>
            </div>
          </div>

          {oldStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Yüksek Terk Etme Oranı: Kullanıcılar sayfa açılmadan ayrıldı!</span>
            </motion.div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-5 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-xs font-bold text-cyan-300">NEXUS EDGE CORE</span>
            </div>
            <span className="font-mono text-xs text-emerald-400">Gecikme: 0.08ms</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Yükleme Durumu</span>
              <span className="text-cyan-400 font-bold">{progressNexus}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-[0_0_10px_#06b6d4]"
                animate={{ width: `${progressNexus}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="pt-2 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Sunucu Yanıt Süresi (TTFB):</span>
              <span className="text-emerald-400 font-semibold">{nexusStatus === 'idle' ? '-' : '0.08 ms'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Core Web Vitals Skor:</span>
              <span className="text-emerald-400 font-semibold">{nexusStatus === 'idle' ? '-' : '100 / 100'}</span>
            </div>
          </div>

          {nexusStatus === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Anında Hidrasyon & Sıfır Bekleme Süresi Sağlandı!</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const LiveDemoShowcase: FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoItem>(DEMO_LIST[0]);
  const [mockupTab, setMockupTab] = useState<string>(DEMO_LIST[0].navItems[0]);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  const handleDemoChange = (demo: DemoItem) => {
    setActiveDemo(demo);
    setMockupTab(demo.navItems[0]);
  };

  const Icon = activeDemo.icon;

  return (
    <div className="space-y-8">
      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreenPreview && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl p-4 sm:p-8 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${activeDemo.badgeColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {activeDemo.title} <span className="text-xs font-mono text-cyan-400">(Tam Ekran Canlı Önizleme)</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{activeDemo.subtitle}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFullscreenPreview(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-auto py-8">
              {activeDemo.mockupType === 'restaurant' && <InteractiveRestaurantMockup activeTab={mockupTab} />}
              {activeDemo.mockupType === 'ecommerce' && <InteractiveEcommerceMockup activeTab={mockupTab} />}
              {activeDemo.mockupType === 'hotel' && <InteractiveHotelMockup activeTab={mockupTab} />}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Sıfır Gecikmeli Edge Simülatör</span>
              <button 
                onClick={() => setIsFullscreenPreview(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black uppercase"
              >
                Modaldan Çık
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {DEMO_LIST.map((demo) => {
          const DemoIcon = demo.icon;
          const isSelected = activeDemo.id === demo.id;

          return (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={demo.id}
              onClick={() => handleDemoChange(demo)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${demo.badgeColor}`}>
                  <DemoIcon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Aktif Demo
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {demo.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">{demo.category}</p>
              
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-400">Simülasyon</span>
                <Link
                  href={demo.path}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 z-10"
                >
                  Sayfaya Git <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] relative text-left">
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 flex-1 max-w-xl truncate shadow-inner">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-500">https://nexus-labs.io/demo/</span>
            <span className="text-white font-bold">{activeDemo.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={activeDemo.path}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <span>Sayfaya Git</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsFullscreenPreview(true)}
              className="px-4 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <span>Tam Ekran Aç</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[520px] bg-slate-950 flex flex-col justify-between p-6 md:p-8 overflow-hidden">
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle at 70% 30%, ${activeDemo.badgeColor.includes('amber') ? 'rgba(245,158,11,0.12)' : activeDemo.badgeColor.includes('pink') ? 'rgba(236,72,153,0.12)' : 'rgba(59,130,246,0.12)'}, transparent 60%)` }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Icon className={`w-4 h-4 ${activeDemo.accentColor}`} />
                  <span>{activeDemo.subtitle}</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {activeDemo.navItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => setMockupTab(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                        mockupTab === item 
                          ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {activeDemo.mockupType === 'restaurant' && <InteractiveRestaurantMockup activeTab={mockupTab} />}
                {activeDemo.mockupType === 'ecommerce' && <InteractiveEcommerceMockup activeTab={mockupTab} />}
                {activeDemo.mockupType === 'hotel' && <InteractiveHotelMockup activeTab={mockupTab} />}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-emerald-400 flex flex-wrap items-center justify-between gap-2 shadow">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{activeDemo.metrics}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  İnteraktif Simülasyon: <span className="text-emerald-400 font-bold">CANLI TEPKİSEL</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="pt-6 mt-6 border-t border-slate-900 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-500">
              SIMULATOR ENGINE: <code className="text-cyan-400">Nexus Edge Hydration v2.4</code>
            </span>

            <Link
              href={activeDemo.path}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Özel Sayfasına Git</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 font-sans selection:bg-cyan-400 selection:text-black overflow-x-hidden relative scroll-smooth flex flex-col">
      <ParticleCanvas />
      
      {/* Header & Banner Wrapper */}
      <div className="sticky top-0 z-40 w-full backdrop-blur-md">
        <TopAdBanner />
        <header className="py-4 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <div className="backdrop-blur-2xl bg-slate-950/80 border border-cyan-500/40 rounded-2xl px-6 py-4 flex items-center justify-between shadow-[0_0_40px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping absolute" />
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              </div>
              <span className="font-extrabold tracking-widest text-lg bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                NEXUS<span className="text-cyan-400">//</span>LABS
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-slate-300">
              <Link href="#hizmetler" className="hover:text-cyan-400 transition-colors">Hizmetler</Link>
              <Link href="#demolar" className="hover:text-cyan-400 transition-colors">Canlı Demolar</Link>
              <Link href="#demo" className="hover:text-cyan-400 transition-colors">Yükleme Testi</Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <Activity className="w-3 h-3 animate-pulse" /> SİSTEM: 100/100
              </span>
              <Link 
                href="#teklif-al" 
                className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> Siteni Dönüştür
                </span>
              </Link>
            </div>
          </div>
        </header>
      </div>

      <CyberChatbot />

      {/* Decorative Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[25%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-[50%] right-[-10%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-12 pb-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-36 flex-1">
        
        {/* Hero Section */}
        <section className="text-center space-y-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>WEB MİMARİSİ • YENİ NESİL ÇÖZÜMLER</span>
          </motion.div>

          <div className="group [perspective:1000px] cursor-pointer mb-6">
            <div className="relative w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
              {/* Front Side */}
              <div className="[backface-visibility:hidden]">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.92] text-white uppercase"
                >
                  WEB SİTENİZ YAŞIYOR MU, <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                    YOKSA SADECE DURUYOR MU?
                  </span>
                </motion.h1>
              </div>
              {/* Back Side */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.92] text-white uppercase">
                  DİJİTALDE SINIRLARI AŞIN, <br />
                  <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                    GELECEĞİN MİMARİSİYLE TANIŞIN!
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            Müşteri kaçıran hantal siteleri tarihe gömüyoruz. İşletmenize özel, milisaniyelik hızlarda çalışan canlı sibernetik platformlar inşa ediyoruz.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link 
              href="#demolar"
              className="relative overflow-hidden px-7 py-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40 text-cyan-300 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 backdrop-blur-xl group transition-all duration-300 hover:border-cyan-400 hover:text-white hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                Canlı Demoları Gör
              </span>
            </Link>

            <Link 
              href="#teklif-al"
              className="relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl group transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_35px_rgba(6,182,212,0.8)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-950 group-hover:scale-125 transition-transform duration-300 fill-current" />
                Hemen Teklif Al
              </span>
            </Link>

            <Link 
              href="#hizmetler"
              className="relative overflow-hidden px-7 py-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl group transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_35px_rgba(236,72,153,0.7)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                Hizmetleri İncele
              </span>
            </Link>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="hizmetler" className="space-y-8 scroll-mt-28">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-mono text-cyan-400 tracking-widest uppercase">// NELER SUNUYORUZ?</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">İşletmenizi Büyütecek Profesyonel Hizmetler</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto font-light">
              Web tasarım, SEO arama motoru optimizasyonu ve reklam yönetimiyle tek noktadan tam kapsamlı dijital çözüm.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES_OVERVIEW.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={idx}
                  className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-6 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`p-4 w-fit rounded-2xl bg-gradient-to-br ${srv.color} text-slate-950 shadow-lg`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-white">{srv.title}</h4>
                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">{srv.desc}</p>
                    
                    <ul className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-xs text-slate-300">
                      {srv.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 flex items-center gap-1"><CheckSquare className="w-3.5 h-3.5" /> Anahtar Teslim</span>
                    <Link href="#teklif-al" className="text-slate-300 hover:text-cyan-400 transition-colors font-bold">Teklif İste &rarr;</Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Live Demos Section */}
        <section id="demolar" className="space-y-8 scroll-mt-28">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-mono text-cyan-400 tracking-widest uppercase">// LIVE INTERACTIVE DEMOS</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">İnteraktif Sektörel Simülatör</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto font-light">
              Aşağıdaki demolar üzerinden sitenize eklenebilecek özellikleri canlı olarak deneyimleyebilir veya doğrudan sayfalarına gidebilirsiniz.
            </p>
          </div>

          <LiveDemoShowcase />
        </section>

        {/* Ads Promotion Card */}
        <MetaGoogleAdsCard />

        {/* Benchmark Section */}
        <section id="demo" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-mono text-cyan-400 tracking-widest uppercase">// LIVE BENCHMARK SIMULATOR</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Canlı Performans & Yükleme Testi</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto font-light">
              İki mimari arasındaki tepki süresini ve kullanıcı kayıp oranını canlı simüle edin.
            </p>
          </div>

          <BenchmarkSimulator />
        </section>

        {/* Lead Form */}
        <LeadCaptureSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              <span className="font-extrabold tracking-widest text-base text-white">
                NEXUS<span className="text-cyan-400">//</span>LABS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light max-w-sm leading-relaxed">
              Milisaniyelik hızlara sahip hibrit web mimarileri, SEO optimizasyonu ve yüksek ROAS odaklı dijital reklam yönetimi platformu.
            </p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#hizmetler" className="hover:text-cyan-400 transition-colors">Hizmetlerimiz</Link></li>
              <li><Link href="#demolar" className="hover:text-cyan-400 transition-colors">Canlı Demolar</Link></li>
              <li><Link href="#teklif-al" className="hover:text-cyan-400 transition-colors">Teklif Al</Link></li>
            </ul>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">İletişim</h4>
            <p className="text-slate-400">İstanbul, Türkiye</p>
            <p className="text-cyan-400 font-bold">iletisim@nexus-labs.io</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <p>© 2026 Nexus Labs. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <span className="hover:text-cyan-400 cursor-pointer">Gizlilik Politikası</span>
            <span>•</span>
            <span className="hover:text-cyan-400 cursor-pointer">Kullanım Şartları</span>
          </div>
        </div>
      </footer>
    </div>
  );
}