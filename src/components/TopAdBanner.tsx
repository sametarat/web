'use client';

import React, { useState, FC } from 'react';

export const TopAdBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-brand-900/90 via-brand-800/90 to-brand-950/90 border-b border-brand-500/30 text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 relative flex items-center justify-between shadow-md">
      {/* min-w-0 + flex-1: 375 px'te metin kapatma düğmesini ekran dışına itiyordu. */}
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-center font-medium">
        <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          Kampanya
        </span>
        <span className="truncate">
          İlk 10 Müşterimize Özel %20 SEO & Performans Optimizasyonu Hediye!
        </span>
        <a 
          href="#teklif-al" 
          className="underline font-bold text-brand-200 hover:text-white transition-colors shrink-0 hidden sm:inline"
        >
          Hemen Fırsatı Yakala &rarr;
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="shrink-0 rounded-md p-1 text-base leading-none text-slate-400 transition-colors hover:text-white"
        aria-label="Kapat"
      >
        &times;
      </button>
    </div>
  );
};