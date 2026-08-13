'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, ShoppingBag, Utensils } from 'lucide-react';

export const InteractiveRestaurantMockup: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [tomorrowDate, setTomorrowDate] = useState<string>('');

  useEffect(() => {
    // Hydration hatasını önlemek için client-side hesaplama
    const date = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setTomorrowDate(date);
  }, []);

  const handleBooking = (tableId: number) => {
    setSelectedTable(tableId);
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Gourmet Bistro</h4>
            <p className="text-xs text-slate-400">Masada Sipariş & Rezerve AI</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          Canlı Sistem
        </span>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-slate-300">
          <p className="mb-2">Tarih Seçimi: <span className="text-amber-400 font-mono">{tomorrowDate || 'Yükleniyor...'}</span></p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((table) => (
            <button
              key={table}
              type="button"
              onClick={() => handleBooking(table)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedTable === table
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="text-xs text-slate-400">Masa</div>
              <div className="text-base font-bold">#{table}</div>
            </button>
          ))}
        </div>

        {isBooked && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Masa #{selectedTable} başarıyla rezerve edildi ve konfirme edildi.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const InteractiveEcommerceMockup: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white">NextStore</h4>
            <p className="text-xs text-slate-400">AI Destekli E-Ticaret</p>
          </div>
        </div>
        <div className="relative p-2 bg-slate-800 rounded-lg">
          <ShoppingBag className="w-4 h-4 text-cyan-400" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">Akıllı Kablosuz Kulaklık</div>
            <div className="text-xs text-slate-400">Yapay Zekalı Ses Optimizasyonu</div>
            <div className="text-sm font-bold text-cyan-400 mt-1">₺3.499,00</div>
          </div>
          <button
            type="button"
            onClick={() => setCartCount((prev) => prev + 1)}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors"
          >
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export const InteractiveHotelMockup: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Grand Resort & Spa</h4>
            <p className="text-xs text-slate-400">Otomatik Resepsiyon & Rezervasyon</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Oda Tipi:</span>
          <span className="text-slate-200 font-medium">Deluxe Deniz Manzaralı</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Durum:</span>
          <span className="text-emerald-400 font-medium">Musait (Anında Onay)</span>
        </div>
      </div>
    </div>
  );
};