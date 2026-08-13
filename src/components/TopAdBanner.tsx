'use client';

import React, { useState, FC } from 'react';

export const TopAdBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 border-b border-blue-500/30 text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 relative flex items-center justify-between shadow-md">
      <div className="flex items-center justify-center gap-2 mx-auto font-medium text-center">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          Kampanya
        </span>
        <span className="truncate max-w-[280px] sm:max-w-none">
          İlk 10 Müşterimize Özel %20 SEO & Performans Optimizasyonu Hediye!
        </span>
        <a 
          href="#teklif-al" 
          className="underline font-bold text-blue-300 hover:text-white transition-colors shrink-0 hidden sm:inline"
        >
          Hemen Fırsatı Yakala &rarr;
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-slate-400 hover:text-white text-base leading-none p-1 rounded-md transition-colors"
        aria-label="Kapat"
      >
        &times;
      </button>
    </div>
  );
};