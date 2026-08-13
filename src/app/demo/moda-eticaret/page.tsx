'use client';

import React, { useState, useMemo, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Maximize2,
  PhoneCall,
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'Ceket & Palto' | 'Pantolon' | 'Gömlek' | 'Aksesuar';
  price: number;
  image: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNew?: boolean;
  fabric: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Relaxed Fit Keten Ceket',
    category: 'Ceket & Palto',
    price: 3450,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Siyah', hex: '#000000' },
      { name: 'Krem', hex: '#D4C5B9' },
      { name: 'Gece Mavisi', hex: '#1E293B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    fabric: '%100 Organik Fransız Keteni'
  },
  {
    id: '2',
    name: 'Oversize Siyah Trençkot',
    category: 'Ceket & Palto',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Mat Siyah', hex: '#000000' },
      { name: 'Füme', hex: '#4A5568' }
    ],
    sizes: ['M', 'L', 'XL'],
    isNew: true,
    fabric: 'Su Geçirmez Gabardin'
  },
  {
    id: '3',
    name: 'Minimalist Dökümlü Pantolon',
    category: 'Pantolon',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Koyu Siyah', hex: '#000000' },
      { name: 'Açık Gri', hex: '#E2E8F0' }
    ],
    sizes: ['S', 'M', 'L'],
    fabric: 'Yün & Viskon Karışımı'
  },
  {
    id: '4',
    name: 'Saf İpek Düz Gömlek',
    category: 'Gömlek',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Optik Beyaz', hex: '#FFFFFF' },
      { name: 'Siyah', hex: '#000000' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: '%100 Dut İpeği'
  },
  {
    id: '5',
    name: 'Deri Minimalist Omuz Çantası',
    category: 'Aksesuar',
    price: 4100,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Siyah', hex: '#000000' },
      { name: 'Taba', hex: '#78350F' }
    ],
    sizes: ['Standart'],
    isNew: true,
    fabric: 'Dana Derisi & Süet Astar'
  },
  {
    id: '6',
    name: 'Müslin Relaxed Gömlek',
    category: 'Gömlek',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Kömür', hex: '#111827' },
      { name: 'Taş Gri', hex: '#D1D5DB' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '%100 Çift Kat Pamuk Müslin'
  }
];

const CATEGORIES = ['Tümü', 'Yeni Gelenler', 'Ceket & Palto', 'Pantolon', 'Gömlek', 'Aksesuar'] as const;

interface CartItem extends Product {
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export default function AvantGardeFashionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Quick View Seçimleri
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>({ name: '', hex: '' });

  const [, startTransition] = useTransition();

  // Kategori Değişimi
  const handleCategoryChange = useCallback((cat: string) => {
    startTransition(() => {
      setSelectedCategory(cat);
    });
  }, []);

  // Filtrelenmiş Ürünler (Memoized)
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      if (selectedCategory === 'Tümü') return true;
      if (selectedCategory === 'Yeni Gelenler') return product.isNew;
      return product.category === selectedCategory;
    });
  }, [selectedCategory]);

  // Favori Ekle / Çıkar
  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  // Sepete Ekle
  const addToCart = useCallback((product: Product, size: string, color: { name: string; hex: string }) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor.hex === color.hex
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });

    setIsCartOpen(true);
    setQuickViewProduct(null);
  }, []);

  // Sepet Miktar Güncelleme
  const updateQuantity = useCallback((index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  }, []);

  // Toplam Hesaplamaları
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
  }, []);

  const openWhatsAppStyleConsultant = useCallback(() => {
    const text = encodeURIComponent(
      "Merhaba, M O D A Atelier Stil Danışmanlığı hattı üzerinden özel sipariş ve koleksiyon tavsiyesi almak istiyorum."
    );
    window.open(`https://wa.me/905550000000?text=${text}`, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <main className="min-h-screen bg-[#030305] text-neutral-100 font-sans selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-neutral-700/10 via-neutral-900/5 to-transparent rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-[#030305]/80 backdrop-blur-2xl border-b border-neutral-800/80 px-6 md:px-12 py-4 flex items-center justify-between">
        
        {/* Sol Taraf: Navilasyon & Marka */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <span className="hidden sm:inline-block w-px h-4 bg-neutral-800" />

          <a href="#" className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase text-white font-serif">
            M O D A
          </a>
        </div>

        {/* Sağ Taraf: İletişim, Favori, Sepet */}
        <div className="flex items-center gap-3">
          <button
            onClick={openWhatsAppStyleConsultant}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Stil Danışmanı</span>
          </button>

          <button 
            onClick={() => toggleFavorite('drawer')}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white relative transition-colors"
            aria-label="Favoriler"
          >
            <Heart className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            )}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow.lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>({cartItemCount})</span>
          </button>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden border-b border-neutral-800/60">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80" 
          alt="Fashion Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-[#030305]" />
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono tracking-[0.25em] uppercase backdrop-blur-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2026 Sonbahar / Kış Atelier Koleksiyonu</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-tight text-white uppercase leading-none font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600"
          >
            Zamansız <br />
            <span className="text-amber-400/90 italic font-serif font-light">Sadelik</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-neutral-400 text-base md:text-xl font-light max-w-xl mx-auto leading-relaxed"
          >
            Sürdürülebilir kumaşlar, heykelsi silüetler ve avant-garde terzilik anlayışıyla gardırobunuzu yeniden tanımlayın.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#products" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span>Koleksiyonu Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- İMKANLAR / ATELIER VURGUSU --- */}
      <section className="py-8 bg-neutral-950/60 border-b border-neutral-800/80 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-neutral-400">
          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Aynı Gün VIP Kurye Teslimatı</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>%100 Orijinal & Sürdürülebilir Üretim</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>30 Gün Ücretsiz İade ve Terzi Desteği</span>
          </div>
        </div>
      </section>

      {/* --- ÜRÜN VİTRİNİ & FİLTRELER --- */}
      <section id="products" className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Filtre Başlıkları */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4" /> High Fashion Catalog
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-serif">Sezon Seçkileri</h2>
          </div>

          {/* Kategori Butonları */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-2 bg-neutral-950/80 border border-neutral-800 rounded-2xl backdrop-blur-2xl">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)]' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ürün Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl bg-neutral-950/80 border border-neutral-800/80 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.12)] backdrop-blur-xl"
              >
                <div>
                  {/* Ürün Görseli */}
                  <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                    {/* Etiketler */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                          Yeni Sezon
                        </span>
                      )}
                    </div>

                    {/* Favori Butonu */}
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-amber-500 hover:text-black transition-all"
                      aria-label="Favorilere Ekle"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Görsel Büyütme Butonu */}
                    <button
                      onClick={() => setSelectedImage(product.image)}
                      className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-neutral-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Görseli Büyüt"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Hızlı İncele Butonu */}
                    <div className="absolute inset-x-6 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => openQuickView(product)}
                        className="w-full py-3.5 rounded-2xl bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-amber-400 transition-all shadow-xl"
                      >
                        Hızlı İncele & Seç
                      </button>
                    </div>
                  </div>

                  {/* Ürün Bilgisi */}
                  <div className="p-6 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      <span>{product.category}</span>
                      <span className="text-amber-400/80">{product.fabric}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Fiyat ve Renk Seçenekleri */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-neutral-900/80 pt-4 font-mono">
                  <span className="text-lg font-bold text-white">₺{product.price.toLocaleString('tr-TR')}</span>
                  <div className="flex items-center gap-1.5">
                    {product.colors.map((color, idx) => (
                      <span 
                        key={idx} 
                        title={color.name}
                        className="w-3 h-3 rounded-full border border-neutral-700 shadow-sm" 
                        style={{ backgroundColor: color.hex }} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- QUICK VIEW MODAL --- */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 grid md:grid-cols-2"
            >
              <button 
                onClick={() => setQuickViewProduct(null)} 
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[3/4] bg-neutral-900 relative">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{quickViewProduct.category} • {quickViewProduct.fabric}</span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">{quickViewProduct.name}</h2>
                    <p className="text-2xl font-bold font-mono text-white mt-3">₺{quickViewProduct.price.toLocaleString('tr-TR')}</p>
                  </div>

                  {/* Renk Seçimi */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">
                      Renk: <span className="text-white">{selectedColor.name}</span>
                    </label>
                    <div className="flex gap-3">
                      {quickViewProduct.colors.map(color => (
                        <button
                          key={color.hex}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                            selectedColor.hex === color.hex ? 'border-amber-400 scale-110' : 'border-neutral-800'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor.hex === color.hex && (
                            <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Beden Seçimi */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">Beden Seçiniz</label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                            selectedSize === size 
                              ? 'bg-amber-400 text-black border-amber-400 font-bold' 
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => addToCart(quickViewProduct, selectedSize, selectedColor)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-mono font-bold text-xs uppercase tracking-widest hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sepete Ekle</span>
                  </button>

                  <button
                    onClick={openWhatsAppStyleConsultant}
                    className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Özel Beden İçin Stil Danışmanına Sor</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SEPET DRAWER (SIDEBAR) --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />

            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full p-6 flex flex-col justify-between z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white font-serif uppercase tracking-wider">Atelier Sepetiniz</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sepet Ürün Listesi */}
                <div className="py-6 space-y-4 overflow-y-auto max-h-[60vh] no-scrollbar">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-neutral-500 font-mono text-xs space-y-3">
                      <ShoppingBag className="w-8 h-8 mx-auto text-neutral-700" />
                      <p>Sepetinizde henüz parça bulunmuyor.</p>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl bg-neutral-900" />
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-xs font-bold font-serif text-white">{item.name}</h4>
                            <div className="text-[10px] font-mono text-neutral-400 mt-1 flex items-center gap-2">
                              <span>Beden: {item.selectedSize}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                Renk: 
                                <span className="w-2 h-2 rounded-full border border-neutral-700" style={{ backgroundColor: item.selectedColor.hex }} />
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                              <button onClick={() => updateQuantity(idx, -1)} className="text-neutral-400 hover:text-white p-1">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                              <button onClick={() => updateQuantity(idx, 1)} className="text-neutral-400 hover:text-white p-1">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-mono font-bold text-amber-400">
                              ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sepet Alt Bilgisi & Ödeme */}
              {cart.length > 0 && (
                <div className="border-t border-neutral-800 pt-6 space-y-4 font-mono">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Toplam Tutar</span>
                    <span className="text-amber-400 font-bold text-lg">₺{cartTotal.toLocaleString('tr-TR')}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">Ücretsiz VIP kargo ve hediye paketi seçeneği dahildir.</p>
                  
                  <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                    Siparişi Tamamla
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- GÖRSEL BÜYÜTME MODAL --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden border border-neutral-800">
              <img src={selectedImage} alt="Ultra Detail" className="w-full h-full object-contain" />
              <button 
                onClick={() => setSelectedImage(null)}
                aria-label="Kapat"
                className="absolute top-4 right-4 p-3 rounded-full bg-neutral-950/80 border border-white/20 text-white hover:bg-amber-400 hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="border-t border-neutral-900 py-12 px-6 md:px-12 text-xs font-mono text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-6 bg-neutral-950/40">
        <p>© 2026 M O D A Atelier Studio • Tüm Hakları Saklıdır.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-amber-400 transition-colors">Atelier Koşulları</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Gizlilik & KVKK</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Sürdürülebilirlik Raporu</a>
        </div>
      </footer>
    </main>
  );
}