'use client';

import React, { useState, useEffect, useRef, FC } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  ShieldCheck,
  TrendingUp,
  Maximize2,
  Utensils,
  ShoppingBag,
  Hotel,
  Plus,
  Send,
  Bot,
  User,
  X,
  MessageSquare
} from 'lucide-react';

// --- DATA & CONSTANTS ---
interface DemoItem {
  id: string;
  title: string;
  path: string;
  icon: any;
  badgeColor: string;
  metrics: string;
  navItems: string[];
  mockupType: 'restaurant' | 'ecommerce' | 'hotel';
}

const DEMO_LIST: DemoItem[] = [
  {
    id: 'restaurant',
    title: 'Gastronomi & Restoran',
    path: '/demos/restaurant',
    icon: Utensils,
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    metrics: '⚡ 0.07s Sayfa Hızı',
    navItems: ['Menü', 'Şefin Seçtikleri', 'Rezerve Et'],
    mockupType: 'restaurant'
  },
  {
    id: 'ecommerce',
    title: 'E-Ticaret & Moda',
    path: '/demos/ecommerce',
    icon: ShoppingBag,
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    metrics: '🚀 %99.9 Uptime',
    navItems: ['Koleksiyon', 'Çok Satanlar', 'Sepetim'],
    mockupType: 'ecommerce'
  },
  {
    id: 'hotel',
    title: 'Lüks Otel & Tatil',
    path: '/demos/hotel',
    icon: Hotel,
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    metrics: '🎯 High Conversion',
    navItems: ['Odalar', 'Olanaklar', 'Hızlı Rezervasyon'],
    mockupType: 'hotel'
  }
];

const SERVICES_OVERVIEW = [
  {
    title: 'Edge-Native Web Geliştirme',
    desc: 'Next.js ve React mimarisi ile milisaniyeler içinde yüklenen, SEO uyumlu ve sunucusuz altyapılar.',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    features: ['Serverless Edge Deployment', 'Core Web Vitals Grade A+', 'Headless CMS Entegrasyonu']
  },
  {
    title: 'Meta & Google Reklam Yönetimi',
    desc: 'AI destekli hedef kitle analizi ve ROAS odaklı dijital pazarlama kampanyaları.',
    icon: TrendingUp,
    color: 'from-purple-500 to-indigo-500',
    features: ['A/B Test Botları', 'Piksel & CAPI Kurulumu', 'Dönüşüm Odaklı Reklam Metinleri']
  },
  {
    title: 'Cyber-Grade Güvenlik & SEO',
    desc: 'Siber güvenlik standartlarında kod mimarisi ve arama motorlarında üst sıralar.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-500',
    features: ['DDoS & Bot Koruması', 'Teknik SEO Mimarisi', 'SSL & OWASP Uyumlu']
  }
];

// --- SUB-COMPONENTS ---

// Top Ad Banner Component
const TopAdBanner = () => (
  <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-b border-blue-500/20 py-2 px-4 text-center text-xs font-mono text-blue-200 flex items-center justify-center gap-2">
    <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
    <span>Eylül Ayına Özel: İlk 5 Projede Reklam Kurulum Hesabı Hediye!</span>
  </div>
);

// Particle Canvas Background Component
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

    const particles = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

// Interactive Mockups
const InteractiveRestaurantMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);

  const menu = [
    { name: 'Truffle Burger', price: 340, desc: 'Taze trüf mantarı, karamelize soğan, brioche ekmeği' },
    { name: 'Smokey BBQ Ribs', price: 480, desc: '12 saat ağır ateşte pişmiş dana kaburga' }
  ];

  return (
    <div className="space-y-4 text-left">
      {activeTab === 'Rezerve Et' ? (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-amber-400">Anında Masanızı Ayırın</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <input type="date" className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300" />
            <select className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <option>2 Kişi</option>
              <option>4 Kişi</option>
              <option>6+ Kişi</option>
            </select>
          </div>
          <button className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all">
            Rezervasyonu Onayla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menu.map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex justify-between items-center font-bold text-xs text-white">
                  <span>{item.name}</span>
                  <span className="text-amber-400 font-mono">₺{item.price}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
              </div>
              <button
                onClick={() => setCart([...cart, { name: item.name, price: item.price }])}
                className="w-full py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Masaya Ekle
              </button>
            </div>
          ))}
        </div>
      )}
      {cart.length > 0 && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex justify-between items-center text-xs text-amber-300 font-mono">
          <span>Sipariş Taslağı ({cart.length} ürün)</span>
          <span>Toplam: ₺{cart.reduce((a, b) => a + b.price, 0)}</span>
        </div>
      )}
    </div>
  );
};

const InteractiveEcommerceMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; size: string }[]>([]);

  const products = [
    { id: 1, name: 'Cyberpunk Oversize Hoodie', price: 1250, tag: 'YENİ' },
    { id: 2, name: 'Minimalist Tech Cargo Trousers', price: 980, tag: 'TREND' }
  ];

  const addToCart = (prod: (typeof products)[0]) => {
    setCart([...cart, { ...prod, size: selectedSize }]);
  };

  const totalPrice = cart.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-4 text-left">
      {activeTab === 'Sepetim' ? (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-pink-400">Sepetiniz ({cart.length})</h4>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Sepetiniz henüz boş.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-white font-medium truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-500">Beden: {item.size}</div>
                  </div>
                  <div className="text-pink-400 font-bold shrink-0">₺{item.price}</div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Toplam Tutar:</span>
                <span className="text-pink-400">₺{totalPrice}</span>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs uppercase transition-all">
                Ödemeye Geç (Edge Checkout)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-slate-400">BEDEN SEÇİMİ:</span>
            {['S', 'M', 'L', 'XL'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  selectedSize === s
                    ? 'border-pink-500 bg-pink-500/20 text-pink-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    {prod.tag}
                  </span>
                  <h5 className="text-xs font-bold text-white pt-1 group-hover:text-pink-400 transition-colors">
                    {prod.name}
                  </h5>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold font-mono text-pink-400">₺{prod.price}</span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500 text-pink-400 hover:text-slate-950 font-bold text-[10px] transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveHotelMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [booked, setBooked] = useState(false);

  const rooms = [
    { name: 'Royal Ocean Suite', price: 14500, features: ['Deniz Manzarası', 'Özel Jakuzi', '24/7 Butler Service'] },
    { name: 'Penthouse Panorama', price: 28000, features: ['Sonsuzluk Havuzu', 'Teras Bar', 'Helikopter Transfer'] }
  ];

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rooms.map((room, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h5 className="text-xs font-bold text-white">{room.name}</h5>
                <span className="text-blue-400 font-mono font-bold text-xs">₺{room.price}/gece</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {room.features.map((f, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setBooked(true)}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all"
            >
              {booked ? '✓ Müsaitlik Onaylandı' : 'Anında Rezerve Et'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Meta & Google Ads Showcase Card
const MetaGoogleAdsCard: FC = () => (
  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-4 text-left relative overflow-hidden">
    <div className="flex items-center gap-2">
      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-[10px]">
        GROWTH MARKETING
      </span>
    </div>
    <h3 className="text-xl font-bold text-white">Yüksek Dönüşümlü Reklam Yönetimi</h3>
    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
      Sadece web sitesi inşa etmiyoruz; Google Search, Display, Meta (Instagram/Facebook) piksel ve CAPI dönüşüm yapılandırmaları ile potansiyel müşterilerinize doğrudan ulaşmanızı sağlıyoruz.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="text-xs text-slate-500 font-mono">ROAS HEDEFİ</div>
        <div className="text-lg font-black text-indigo-400 mt-0.5">4.8x+</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="text-xs text-slate-500 font-mono">CAPI DÖNÜŞÜM</div>
        <div className="text-lg font-black text-emerald-400 mt-0.5">%100 Aktif</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="text-xs text-slate-500 font-mono">A/B KİTLE TESTİ</div>
        <div className="text-lg font-black text-purple-400 mt-0.5">Otomatik</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="text-xs text-slate-500 font-mono">TAKİP & RAPOR</div>
        <div className="text-lg font-black text-cyan-400 mt-0.5">Canlı Paneller</div>
      </div>
    </div>
  </div>
);

// Lead Capture Section Component
const LeadCaptureSection: FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="teklif-al" className="scroll-mt-28">
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden text-left">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <span>PROJENİZİ BAŞLATIN</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Hayalinizdeki Dijital Varlığı Birlikte Oluşturalım
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-light">
            Sektörünüzü ve hedeflerinizi iletin, size özel mimari teklifi ve büyüme stratejisini 24 saat içinde hazırlayıp iletelim.
          </p>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              ✓ Talebiniz başarıyla alındı. Ekibimiz sizinle en kısa sürede iletişime geçecektir.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  placeholder="Adınız Soyadınız / Firma"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  required
                  type="email"
                  placeholder="E-Posta Adresiniz"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Projenizden veya ihtiyaçlarınızdan kısaca bahsedin..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30"
              >
                Hızlı Teklif İste
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// Cyber Chatbot Component
const CyberChatbot: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'Merhaba! Nexus Labs sistemine hoş geldiniz. Web geliştirme veya reklam süreçlerimiz hakkında nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Talebiniz kaydedildi. Uzman ekibimiz detaylar için doğrudan iletişime geçebilir.' }
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/40 transition-all hover:scale-105"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-left">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">Nexus AI Asistan</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-3 h-64 overflow-y-auto text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && <Bot className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                <div
                  className={`p-2.5 rounded-xl max-w-[80%] ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
              </div>
            ))}
          </div>

          <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Sorunuzu yazın..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button onClick={handleSend} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function LandingPage() {
  const [selectedDemo, setSelectedDemo] = useState<DemoItem>(DEMO_LIST[0]);
  const [activeNavTab, setActiveNavTab] = useState<string>(DEMO_LIST[0].navItems[0]);

  const handleSelectDemo = (demo: DemoItem) => {
    setSelectedDemo(demo);
    setActiveNavTab(demo.navItems[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <ParticleCanvas />
      <TopAdBanner />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg tracking-tighter shadow-lg shadow-blue-600/30">
              N
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              NEXUS <span className="text-blue-500 font-mono text-xs">LABS</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#hizmetler" className="hover:text-white transition-colors">Hizmetler</a>
            <a href="#canli-demolar" className="hover:text-white transition-colors">Canlı Demolar</a>
            <a href="#teklif-al" className="hover:text-white transition-colors">Teklif Al</a>
          </nav>

          <a
            href="#teklif-al"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20"
          >
            Hızlı Teklif Al
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-16 relative z-10 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YENİ NESİL WEB MİMARİSİ & DİJİTAL PAZARLAMA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Işık Hızında Web Sitemizle <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Müşteri Portföyünüzü Büyütün
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Yavaş açılan, dönüşüm getirmeyen klasik siteleri geride bırakın. Edge mimarisine dayalı 0.08s yüklenme hızı, teknik SEO ve Meta & Google reklam yönetimi ile hedeflerinize ulaşın.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#teklif-al"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <span>Projenizi Başlatın</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#canli-demolar"
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all"
            >
              Canlı Demoları İncele
            </a>
          </div>
        </section>

        {/* Services Overview Section */}
        <section id="hizmetler" className="scroll-mt-28 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">Hizmet Alanlarımız</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-light">Dijitalde ölçeklenmeniz için gereken tüm çözümler tek çatıda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES_OVERVIEW.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${srv.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-light">
                      {srv.desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-300">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <MetaGoogleAdsCard />

        {/* Interactive Live Demos Showcase */}
        <section id="canli-demolar" className="scroll-mt-28 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">Etkileşimli Canlı Demolar</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-light">Sektörünüze özel hazırladığımız demoları doğrudan sayfa üzerinden test edin.</p>
          </div>

          {/* Demo Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO_LIST.map((demo) => {
              const Icon = demo.icon;
              const isSelected = selectedDemo.id === demo.id;
              return (
                <button
                  key={demo.id}
                  onClick={() => handleSelectDemo(demo)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{demo.title}</span>
                </button>
              );
            })}
          </div>

          {/* Browser / App Container Mockup */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            {/* Mockup Address Bar */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-400">https://</span>
                  <span className="text-slate-200">nexuslabs.dev{selectedDemo.path}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${selectedDemo.badgeColor}`}>
                  {selectedDemo.metrics}
                </span>
                <Link
                  href={selectedDemo.path}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                  title="Tam Ekran İncele"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mockup Internal Navigation */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              {selectedDemo.navItems.map((nav) => (
                <button
                  key={nav}
                  onClick={() => setActiveNavTab(nav)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeNavTab === nav
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {nav}
                </button>
              ))}
            </div>

            {/* Dynamic Mockup Content Render */}
            <div className="p-4 sm:p-6 bg-slate-950/50 min-h-[320px]">
              {selectedDemo.mockupType === 'restaurant' && <InteractiveRestaurantMockup activeTab={activeNavTab} />}
              {selectedDemo.mockupType === 'ecommerce' && <InteractiveEcommerceMockup activeTab={activeNavTab} />}
              {selectedDemo.mockupType === 'hotel' && <InteractiveHotelMockup activeTab={activeNavTab} />}
            </div>
          </div>
        </section>

        <LeadCaptureSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 relative z-10 text-xs text-slate-500 text-center">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <p>© {new Date().getFullYear()} Nexus Labs. Tüm hakları saklıdır.</p>
          <p className="font-mono text-[10px] text-slate-600">
            Optimized with Edge Runtime • Core Web Vitals Grade A+
          </p>
        </div>
      </footer>

      {/* Floating Chatbot Component */}
      <CyberChatbot />
    </div>
  );
}