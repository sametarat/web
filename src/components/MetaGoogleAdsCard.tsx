'use client';

import React, { FC } from 'react';

export const MetaGoogleAdsCard: FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-slate-950 border border-brand-500/20 p-6 sm:p-8 shadow-2xl">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-mono uppercase tracking-wider">
            Yüksek ROAS / Dönüşüm Optimizasyonu
          </span>
          <h3 className="text-lg sm:text-2xl font-bold text-white">
            Meta & Google Reklamlarıyla Bütçenizi Boşa Harcamayın
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl font-light leading-relaxed">
            Nokta atışı hedef kitle segmentasyonu, dinamik yeniden pazarlama (Remarketing) ve dönüşüm odaklı reklam stratejilerimizle harcadığınız her kuruşun karşılığını alın.
          </p>
        </div>

        <a
          href="#teklif-al"
          className="shrink-0 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-brand-600/20"
        >
          Reklam Danışmanlığı Al
        </a>
      </div>
    </div>
  );
};