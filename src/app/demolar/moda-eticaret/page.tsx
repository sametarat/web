'use client';

import React, { useState } from 'react';
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
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

// --- KATEGORİLER & ÜRÜN VERİLERİ ---
const CATEGORIES = ['Tümü', 'Yeni Gelenler', 'Ceket & Palto', 'Pantolon', 'Gömlek', 'Aksesuar'];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Relaxed Fit Keten Ceket',
    category: 'Ceket & Palto',
    price: 3450,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    colors: ['#000000', '#D4C5B9', '#1E293B'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true
  },
  {
    id: '2',
    name: 'Oversize Siyah Trençkot',
    category: 'Ceket & Palto',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    colors: ['#000000', '#4A5568'],
    sizes: ['M', 'L', 'XL'],
    isNew: true
  },
  {
    id: '3',
    name: 'Minimalist Dökümlü Pantolon',
    category: 'Pantolon',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    colors: ['#000000', '#E2E8F0'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '4',
    name: 'Saf İpek Düz Gömlek',
    category: 'Gömlek',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    colors: ['#FFFFFF', '#000000'],
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: '5',
    name: 'Deri Minimalist Omuz Çantası',
    category: 'Aksesuar',
    price: 4100,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    colors: ['#000000', '#78350F'],
    sizes: ['Standart'],
    isNew: true
  },
  {
    id: '6',
    name: 'Müslin Relaxed Gömlek',
    category: 'Gömlek',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    colors: ['#000000', '#D1D5DB'],
    sizes: ['S', 'M', 'L', 'XL'],
  }
];

interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export default function FashionStorePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Quick View Seçimleri
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Filtrelenmiş Ürünler
  const filteredProducts = PRODUCTS.filter(product => {
    if (selectedCategory === 'Tümü') return true;
    if (selectedCategory === 'Yeni Gelenler') return product.isNew;
    return product.category === selectedCategory;
  });

  // Favori Ekle / Çıkar
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Sepete Ekle
  const addToCart = (product: Product, size: string, color: string) => {
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart(prev => [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }]);
    }

    setIsCartOpen(true);
    setQuickViewProduct(null);
  };

  // Sepet Miktar Güncelleme
  const updateQuantity = (index: number, delta: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;

    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
  };

  // Toplam Tutar
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-neutral-100 font-sans selection:bg-neutral-200 selection:text-black">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-neutral-800/60 px-6 md:px-16 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="text-2xl font-black tracking-widest uppercase text-white font-mono">
            M O D A
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">Koleksiyonlar</a>
            <a href="#" className="hover:text-white transition-colors">Lookbook</a>
            <a href="#" className="hover:text-white transition-colors">Sürdürülebilirlik</a>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <button className="p-2 text-neutral-300 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-neutral-300 hover:text-white transition-colors relative">
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
            )}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </button>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80" 
          alt="Fashion Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/40" />
        
        <div className="relative z-10 text-center space-y-6 max-w-3xl px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900/60 text-neutral-300 text-[10px] font-mono tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>2026 Sonbahar / Kış Koleksiyonu</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase leading-none">
            Zamansız <br />
            <span className="text-neutral-500 italic font-serif">Sadelik</span>
          </h1>

          <p className="text-sm font-mono text-neutral-400 max-w-md mx-auto">
            Minimal çizgilere ve sürdürülebilir kumaşlara odaklanan yeni sezon parçalarıyla tarzınızı yeniden tanımlayın.
          </p>

          <div>
            <a 
              href="#products" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all"
            >
              <span>Koleksiyonu Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* --- ÜRÜN VİTRİNİ & FİLTRELER --- */}
      <section id="products" className="py-20 px-6 md:px-16 max-w-7xl mx-auto space-y-12">
        
        {/* Filtre Başlıkları */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-white text-black font-bold' 
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span>{filteredProducts.length} Ürün Listeleniyor</span>
          </div>
        </div>

        {/* Ürün Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="group relative flex flex-col justify-between"
            >
              <div>
                {/* Ürün Görseli */}
                <div className="relative aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Etiketler */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-mono font-bold uppercase">
                        Yeni
                      </span>
                    )}
                  </div>

                  {/* Favori Butonu */}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-white' : ''}`} />
                  </button>

                  {/* Hızlı Bakış / İncele Butonu */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => openQuickView(product)}
                      className="w-full py-3 rounded-xl bg-white/90 backdrop-blur-md text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-white transition-all shadow-xl"
                    >
                      Hızlı İncele
                    </button>
                  </div>
                </div>

                {/* Ürün Bilgisi */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{product.category}</div>
                  <h3 className="text-sm font-medium text-white group-hover:text-neutral-300 transition-colors">{product.name}</h3>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono">
                <span className="text-sm font-bold text-neutral-200">₺{product.price.toLocaleString('tr-TR')}</span>
                <div className="flex items-center gap-1">
                  {product.colors.map((color, idx) => (
                    <span 
                      key={idx} 
                      className="w-2.5 h-2.5 rounded-full border border-neutral-700" 
                      style={{ backgroundColor: color }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- QUICK VIEW MODAL --- */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 grid md:grid-cols-2"
            >
              <button 
                onClick={() => setQuickViewProduct(null)} 
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[3/4] bg-neutral-950">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{quickViewProduct.category}</span>
                    <h2 className="text-2xl font-bold text-white mt-1">{quickViewProduct.name}</h2>
                    <p className="text-xl font-bold font-mono text-neutral-300 mt-2">₺{quickViewProduct.price.toLocaleString('tr-TR')}</p>
                  </div>

                  {/* Beden Seçimi */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400">Beden Seçiniz</label>
                    <div className="flex gap-2">
                      {quickViewProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
                            selectedSize === size 
                              ? 'bg-white text-black border-white font-bold' 
                              : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(quickViewProduct, selectedSize, selectedColor)}
                  className="w-full py-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Sepete Ekle</span>
                </button>
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            />

            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full p-6 flex flex-col justify-between z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white font-mono uppercase">Sepetiniz</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sepet Ürün Listesi */}
                <div className="py-6 space-y-4 overflow-y-auto max-h-[60vh] no-scrollbar">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                      Sepetinizde henüz ürün bulunmuyor.
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl" />
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.name}</h4>
                            <div className="text-[10px] font-mono text-neutral-400 mt-1">
                              Beden: {item.selectedSize}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                              <button onClick={() => updateQuantity(idx, -1)} className="text-neutral-400 hover:text-white p-1">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                              <button onClick={() => updateQuantity(idx, 1)} className="text-neutral-400 hover:text-white p-1">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-mono font-bold text-neutral-200">
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
                    <span>Ara Toplam</span>
                    <span className="text-white font-bold text-base">₺{cartTotal.toLocaleString('tr-TR')}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">Kargo ve vergiler ödeme adımında hesaplanır.</p>
                  
                  <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all">
                    Siparişi Tamamla
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="border-t border-neutral-800/80 py-12 px-6 md:px-16 text-xs font-mono text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-6">
        <p>© 2026 MODA Studio • Tüm Hakları Saklıdır.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
          <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
          <a href="#" className="hover:text-white transition-colors">İletişim</a>
        </div>
      </footer>
    </main>
  );
}