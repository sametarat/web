'use client';

import React, { useState, FC, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CyberChatbot from '@/components/CyberChatbot';
import { LeadCaptureSection } from '@/components/LeadCaptureSection';
import { SiteHeader } from '@/components/SiteHeader';
import { SafeImage } from '@/components/SafeImage';
import { ProcessSection } from '@/components/ProcessSection';
import { PrinciplesSection } from '@/components/PrinciplesSection';
import { FaqSection } from '@/components/FaqSection';
import { MetaGoogleAdsCard } from '@/components/MetaGoogleAdsCard';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { SiteFooter } from '@/components/SiteFooter';
import {
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Activity,
  X,
  Plus,
  ShoppingBasket,
  Calendar,
  Check,
  Megaphone,
  Search as SearchIcon,
  Code,
  Maximize2,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  Building2,
  Dumbbell,
  Globe,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface ServiceItem {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  features: string[];
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
  mockupType: 'restaurant' | 'ecommerce' | 'hotel';
  navItems: string[];
  /** Seçim kartının arkasında görünen sektör görseli. */
  preview: string;
}


// --- CONSTANTS ---
const SERVICES_OVERVIEW: ServiceItem[] = [
  {
    title: 'Özel Web Tasarım & Geliştirme',
    desc: 'İşletmenize özel, Lighthouse %100 hızlı, mobil uyumlu ve yüksek dönüşüm odaklı modern web mimarileri.',
    icon: Code,
    color: 'from-brand-600 to-brand-500',
    features: ['Sıfır Altyapı Gecikmesi', 'Özel UX/UI Tasarım', 'Core Web Vitals Optimizasyonu']
  },
  {
    title: 'SEO & Arama Motoru Optimizasyonu',
    desc: 'Google arama sonuçlarında kalıcı olarak üst sıralara çıkmanızı sağlayan teknik ve içerik tabanlı SEO altyapısı.',
    icon: SearchIcon,
    color: 'from-teal-500 to-emerald-600',
    features: ['Teknik SEO Denetimi', 'Anahtar Kelime Stratejisi', 'Organik Trafik Artışı']
  },
  {
    title: 'Meta & Google Reklam Yönetimi',
    desc: 'Yüksek ROAS odaklı reklam kurguları, Meta Pixel ve Google dönüşüm optimizasyonları ile bütçe verimliliği.',
    icon: Megaphone,
    color: 'from-brand-400 to-brand-700',
    features: ['Hedef Kitle Analizi', 'Dönüşüm Odaklı Kreatifler', 'Detaylı ROI Raporlama']
  }
];


const DEMO_LIST: DemoItem[] = [
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
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    accentColor: 'text-pink-400',
    metrics: 'Sepete Ekleme: +%180 | Yükleme: 0.08s',
    preview: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=70',
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
    badgeColor: 'border-brand-500/30 text-brand-400 bg-brand-500/10',
    accentColor: 'text-brand-400',
    metrics: 'Direkt Rezervasyon: +%310 | Yükleme: 0.06s',
    preview: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=70',
    mockupType: 'hotel',
    navItems: ['Odalar & Süitler', 'Spa & Wellness', 'Gastronomi', 'Hızlı Rezerve']
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
    mockupType: 'restaurant',
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
    mockupType: 'hotel',
    navItems: ['Portföy', 'Arama', 'Favoriler', 'Danışman'],
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
    mockupType: 'ecommerce',
    navItems: ['Paketler', 'Ders Programı', 'Eğitmenler', 'Deneme'],
  },
];

// --- COMPONENTS ---





const InteractiveRestaurantMockup: FC<{ activeTab: string }> = ({ activeTab }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const tomorrowDate = useMemo(() => {
    return new Date(Date.now() + 86400000).toISOString().split('T')[0];
  }, []);

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
    <div className="space-y-4 sm:space-y-6">
      {activeTab === 'Rezervasyon' ? (
        <div className="p-4 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 max-w-xl mx-auto text-left space-y-4 shadow-lg">
          <h4 className="text-xs sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Online Masa Rezervasyonu
          </h4>
          <p className="text-xs text-slate-400">Restoranımızda anlık masa müsaitliğini test edin.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input type="date" aria-label="Rezervasyon Tarihi" defaultValue={tomorrowDate} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white w-full" />
            <select aria-label="Kişi Sayısı Seçimi" className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white w-full">
              <option>2 Kişilik Masa</option>
              <option>4 Kişilik VIP Masa</option>
              <option>6+ Kişilik Grup</option>
            </select>
          </div>
          <button 
            onClick={() => setBookingSuccess(true)}
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
          >
            {bookingSuccess ? '✓ Masa Rezerve Edildi!' : 'Rezervasyonu Onayla'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          <div className="md:col-span-8 space-y-2 text-left">
            <div className="text-[10px] sm:text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              MENÜ: {activeTab}
            </div>
            {menuData.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 sm:gap-3 ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 text-white' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">{item.category}</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-light leading-snug line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-1">
                    <div className="text-amber-400 font-mono font-bold text-xs sm:text-sm">₺{item.price}</div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-500">{isSelected ? 'Eklendi ✓' : '+ Ekle'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-4 p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-3 sm:space-y-4 flex flex-col justify-between shadow-lg">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-2 sm:mb-3">Sipariş Özeti</h5>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">Ürün seçmek için soldaki listenin üzerine tıklayın.</p>
              ) : (
                <ul className="space-y-1.5 text-xs font-mono">
                  {selectedItems.map((id) => {
                    const item = menuData.find((m) => m.id === id);
                    return (
                      <li key={id} className="flex justify-between text-slate-300">
                        <span className="truncate max-w-[120px]">{item?.name}</span>
                        <span className="text-amber-400 font-bold ml-2">₺{item?.price}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="pt-2 sm:pt-3 border-t border-slate-800 space-y-2.5 sm:space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold font-mono">
                <span className="text-slate-400">Toplam:</span>
                <span className="text-amber-400">₺{total}</span>
              </div>
              <button 
                disabled={selectedItems.length === 0}
                className="w-full py-2 sm:py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-all"
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
    { id: 102, name: 'Mat Siyah Titanium Saat', price: 4250, tag: 'Limited' },
    { id: 103, name: 'Techwear Jogger Trousers', price: 1450, tag: 'Çok Satan' }
  ];

  const addToCart = (prod: { id: number; name: string; price: number }) => {
    setCart(prev => [...prev, { ...prod, size: selectedSize }]);
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="space-y-4 sm:space-y-6 text-left">
      {activeTab === 'Sepetim' ? (
        <div className="p-4 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4 shadow-lg">
          <h4 className="text-xs sm:text-sm font-bold text-pink-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShoppingBasket className="w-4 h-4" /> Alışveriş Sepetiniz ({cart.length} Ürün)
          </h4>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-4 text-center">Sepetiniz boş. Ürün eklemek için vitrine göz atın.</p>
          ) : (
            <div className="space-y-2.5 font-mono text-xs">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-white font-medium block truncate">{item.name}</span>
                    <span className="text-[10px] text-pink-400 block">Beden: {item.size}</span>
                  </div>
                  <span className="text-pink-400 font-bold shrink-0">₺{item.price}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between text-xs sm:text-sm font-bold text-white">
                <span>Ara Toplam:</span>
                <span className="text-pink-400">₺{totalPrice}</span>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-pink-500 text-slate-950 font-bold text-xs uppercase tracking-wide hover:bg-pink-400 transition-all">
                Anında Checkout Et (0.08s)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((prod) => (
              <div 
                key={prod.id} 
                className="p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">{prod.tag}</span>
                  <h5 className="text-xs font-bold text-white pt-1">{prod.name}</h5>
                  <div className="text-xs sm:text-sm font-mono font-bold text-pink-400">₺{prod.price}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex gap-1 text-[10px] font-mono">
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
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-pink-500 hover:text-slate-950 text-white font-mono text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4 flex flex-col justify-between shadow-lg">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-2 sm:mb-3">Canlı Sepet Durumu</h5>
              <div className="text-xl sm:text-2xl font-bold font-mono text-pink-400">
                {cart.length} <span className="text-xs font-normal text-slate-400">Ürün</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Sepet Tutarı: <strong className="text-white">₺{totalPrice}</strong>
              </p>
            </div>

            <button 
              className="w-full py-2.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs uppercase tracking-wide transition-all"
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
    <div className="space-y-4 sm:space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        <div className="md:col-span-7 space-y-2.5 sm:space-y-3">
          <div className="text-[10px] sm:text-[11px] font-mono text-brand-400 font-semibold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            OTEL MODÜLÜ: {activeTab}
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            {[
              { name: 'Infinity Pool Villa', desc: 'Özel Isıtmalı Havuz • Panorama Deniz Manzarası', price: 680 },
              { name: 'Private Garden Penthouse', desc: 'Jakuzili Teras • Butler & Özel Hizmet', price: 510 }
            ].map((suite) => (
              <div 
                key={suite.name}
                onClick={() => setSelectedSuite(suite.name)}
                className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between shadow-sm ${
                  selectedSuite === suite.name 
                    ? 'bg-brand-500/10 border-brand-500/50 text-white' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <h5 className="text-xs font-bold text-white truncate">{suite.name}</h5>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-light truncate">{suite.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-brand-400 font-mono font-bold text-xs sm:text-sm">€{suite.price}</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 block">/ gece</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 sm:space-y-4 shadow-lg">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Konaklama Hesaplayıcı</h5>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Gece Sayısı:</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setNights(Math.max(1, nights - 1))} className="px-2.5 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">-</button>
                <span className="text-white font-bold px-1">{nights} Gece</span>
                <button onClick={() => setNights(nights + 1)} className="px-2.5 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">+</button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Misafir Sayısı:</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="px-2.5 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">-</button>
                <span className="text-white font-bold px-1">{guests} Yetişkin</span>
                <button onClick={() => setGuests(guests + 1)} className="px-2.5 py-1 bg-slate-800 rounded font-bold text-white hover:bg-slate-700">+</button>
              </div>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-slate-800 flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-400">Toplam Tutar:</span>
              <span className="text-brand-400 font-bold text-sm sm:text-base">€{totalPrice}</span>
            </div>

            <button className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wide transition-all">
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-sm sm:text-base font-bold text-white">Karşılaştırmalı Yükleme Testi</h4>
            <p className="text-[11px] sm:text-xs text-slate-400">Sayfa yükleme sürelerinin dönüşüm oranlarına etkisi</p>
          </div>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isTesting}
          className={`w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isTesting
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-500'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          {isTesting ? 'Test Yapılıyor...' : 'Yükleme Testini Başlat'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left">
        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="font-mono text-xs font-bold text-rose-400 truncate">KLASİK MONOLİTİK SİTE</span>
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] text-slate-500 shrink-0">Gecikme: ~3.8s</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Yükleme Durumu</span>
              <span className="text-rose-400 font-bold">{progressOld}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-rose-500"
                animate={{ width: `${progressOld}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="pt-1 sm:pt-2 space-y-1.5 text-xs font-mono">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 sm:p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] sm:text-xs font-mono flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Yüksek Terk Etme Oranı: Kullanıcılar ayrıldı!</span>
            </motion.div>
          )}
        </div>

        <div className="p-3.5 sm:p-5 rounded-xl bg-slate-950/60 border border-brand-500/30 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-brand-400 truncate">KODARA EDGE CORE</span>
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] text-emerald-400 shrink-0">Gecikme: 0.08ms</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Yükleme Durumu</span>
              <span className="text-brand-400 font-bold">{progressKodara}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-500"
                animate={{ width: `${progressKodara}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="pt-1 sm:pt-2 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Sunucu Yanıt Süresi (TTFB):</span>
              <span className="text-emerald-400 font-semibold">{kodaraStatus === 'idle' ? '-' : '0.08 ms'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Core Web Vitals Skor:</span>
              <span className="text-emerald-400 font-semibold">{kodaraStatus === 'idle' ? '-' : '100 / 100'}</span>
            </div>
          </div>

          {kodaraStatus === 'done' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-mono flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Anında Hidrasyon & Sıfır Bekleme Süresi!</span>
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
    <div className="space-y-4 sm:space-y-6">
      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreenPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-3 sm:p-8 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`p-1.5 sm:p-2 rounded-lg border ${activeDemo.badgeColor} shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-bold text-white flex items-center gap-1.5 truncate">
                    {activeDemo.title} <span className="text-[10px] sm:text-xs font-mono text-brand-400 hidden sm:inline">(Canlı Önizleme)</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">{activeDemo.subtitle}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFullscreenPreview(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 ml-2"
                aria-label="Önizlemeyi Kapat"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="my-auto py-4 sm:py-6">
              {activeDemo.mockupType === 'restaurant' && <InteractiveRestaurantMockup activeTab={mockupTab} />}
              {activeDemo.mockupType === 'ecommerce' && <InteractiveEcommerceMockup activeTab={mockupTab} />}
              {activeDemo.mockupType === 'hotel' && <InteractiveHotelMockup activeTab={mockupTab} />}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="text-[10px] sm:text-xs">Edge Simülatör Modu</span>
              <button 
                onClick={() => setIsFullscreenPreview(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-brand-600 text-white font-bold text-xs"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {DEMO_LIST.map((demo) => {
          const DemoIcon = demo.icon;
          const isSelected = activeDemo.id === demo.id;

          return (
            <button
              key={demo.id}
              type="button"
              onClick={() => handleDemoChange(demo)}
              aria-pressed={isSelected}
              className={`group relative isolate overflow-hidden rounded-xl border p-3 sm:p-4 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-brand-500 shadow-lg shadow-brand-600/20 ring-1 ring-brand-500/40'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Sektör görseli — seçiliyken belirginleşir */}
              <SafeImage
                src={demo.preview}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className={`-z-10 object-cover transition-all duration-500 ${
                  isSelected
                    ? 'scale-105 opacity-40'
                    : 'opacity-20 grayscale group-hover:scale-105 group-hover:opacity-30 group-hover:grayscale-0'
                }`}
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />

              <span className="mb-2 flex items-center justify-between">
                <span className={`rounded-lg border p-1.5 sm:p-2 ${demo.badgeColor}`}>
                  <DemoIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                {isSelected && (
                  <span className="rounded border border-brand-500/30 bg-brand-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-brand-300 sm:text-[10px]">
                    Aktif
                  </span>
                )}
              </span>
              <span className="block text-xs font-bold text-white sm:text-sm">{demo.title}</span>
              <span className="mt-0.5 block font-mono text-[10px] text-slate-400 sm:text-[11px]">
                {demo.category}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl relative text-left">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="w-2 h-2 rounded-full bg-slate-700" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex-1 max-w-md truncate">
            <Globe className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="text-slate-500 hidden sm:inline">https://kodara.com/demo/</span>
            <span className="text-white font-bold truncate">{activeDemo.id}</span>
          </div>

          <button
            onClick={() => setIsFullscreenPreview(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all flex items-center gap-1 shrink-0"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Tam Ekran</span>
          </button>
        </div>

        <div className="p-3.5 sm:p-6 bg-slate-950 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${activeDemo.accentColor}`} />
              <span className="truncate">{activeDemo.subtitle}</span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {activeDemo.navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setMockupTab(item)}
                  className={`px-2 py-1 rounded-md text-[11px] sm:text-xs font-mono transition-all whitespace-nowrap ${
                    mockupTab === item 
                      ? 'bg-brand-600 text-white font-semibold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            {activeDemo.mockupType === 'restaurant' && <InteractiveRestaurantMockup activeTab={mockupTab} />}
            {activeDemo.mockupType === 'ecommerce' && <InteractiveEcommerceMockup activeTab={mockupTab} />}
            {activeDemo.mockupType === 'hotel' && <InteractiveHotelMockup activeTab={mockupTab} />}
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] sm:text-xs text-emerald-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{activeDemo.metrics}</span>
            </div>
            <Link
              href={activeDemo.path}
              className="text-[11px] sm:text-xs text-brand-400 hover:underline flex items-center gap-1 shrink-0 ml-auto"
            >
              <span>Sayfaya Git</span>
              <ArrowRight className="w-3 h-3" />
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
    <div className="min-h-screen bg-[#06080e] text-slate-100 font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden relative flex flex-col">
      <ParticleCanvas />
      
      <SiteHeader />

      <CyberChatbot />

      {/* Main Content */}
      <main className="relative z-10 pt-4 sm:pt-12 pb-16 sm:pb-20 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-12 sm:space-y-28 flex-1">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6 relative pt-2">
          {/* Arka plan ışıması — dekoratif, etkileşimi engellemez */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[520px] overflow-visible">
            <div className="hero-glow absolute inset-0" />
            <div className="aurora-blob absolute left-1/2 top-0 h-72 w-72 -translate-x-[130%] rounded-full bg-brand-600/25 blur-[110px]" />
            <div className="aurora-blob aurora-blob-slow absolute left-1/2 top-10 h-80 w-80 translate-x-[30%] rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="aurora-blob absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[130px]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] sm:text-xs font-medium"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-400" />
            <span>Özel Web Yazılımları & Dijital Çözümler</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-snug sm:leading-none break-words"
          >
            İşletmeniz İçin Hızlı, Güvenli ve <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-brand-300">
              Yüksek Dönüşümlü Web Sistemleri
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto font-light leading-relaxed px-1"
          >
            Yavaş açılan ve müşteri kaybettiren hazır temaları unutun. İşletmenize özel mimaride geliştirilmiş, milisaniyelik hızlarda çalışan canlı platformlar inşa ediyoruz.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-md mx-auto pt-1"
          >
            <Link 
              href="#demolar"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Canlı Demoları Gör</span>
            </Link>

            <Link 
              href="#teklif-al"
              className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-brand-400" />
              <span>Hemen Teklif Al</span>
            </Link>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="hizmetler" className="space-y-5 sm:space-y-8 scroll-mt-28">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-[10px] sm:text-xs font-mono text-brand-400 tracking-wider uppercase">// HİZMETLERİMİZ</h2>
            <h3 className="text-lg sm:text-3xl font-bold text-white">İşletmenizi Büyütecek Dijital Çözümler</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-light">
              Web tasarım, SEO arama motoru optimizasyonu ve reklam yönetimiyle tek noktadan tam kapsamlı dijital destek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES_OVERVIEW.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 sm:space-y-5 shadow-lg flex flex-col justify-between text-left"
                >
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className={`p-2.5 sm:p-3 w-fit rounded-xl bg-gradient-to-br ${srv.color} text-white shadow-md`}>
                      <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white">{srv.title}</h4>
                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">{srv.desc}</p>
                    
                    <ul className="space-y-1.5 sm:space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                      {srv.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-slate-800">
                    <Link
                      href="#teklif-al"
                      className="text-xs font-mono font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Detaylı İncele</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Banner Section */}
        <MetaGoogleAdsCard />

        {/* Live Demo Showcase */}
        <section id="demolar" className="space-y-5 sm:space-y-8 scroll-mt-28">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-[10px] sm:text-xs font-mono text-brand-400 tracking-wider uppercase">// CANLI SEKTÖREL DEMOLAR</h2>
            <h3 className="text-lg sm:text-3xl font-bold text-white">Sektörünüze Özel Canlı Web Mimarileri</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-light">
              Müşterilerinize sunacağımız yüksek hızlı arayüzleri ve interaktif özellikleri doğrudan test edin.
            </p>
          </div>

          <LiveDemoShowcase />
        </section>

        <ProcessSection />

        <PrinciplesSection />

        {/* Benchmark Section */}
        <section id="demo" className="space-y-5 sm:space-y-8 scroll-mt-28">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-[10px] sm:text-xs font-mono text-brand-400 tracking-wider uppercase">// PERFORMANS SİMÜLATÖRÜ</h2>
            <h3 className="text-lg sm:text-3xl font-bold text-white">Neden Milisaniyeler Önemlidir?</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-light">
              Yavaş açılan her 1 saniye, ziyaretçilerinizin %20'sinin sitenizden ayrılmasına neden olur.
            </p>
          </div>

          <BenchmarkSimulator />
        </section>

        <FaqSection />

        {/* Lead Capture Form */}
        <LeadCaptureSection />

      </main>

      <SiteFooter />
    </div>
  );
}