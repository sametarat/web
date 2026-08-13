'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 md:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold text-amber-400 tracking-wider">
          AETHERIA HOTEL & RESIDENCES
        </Link>
        
        <div className="flex items-center gap-6 text-xs font-medium text-slate-300">
          <Link href="/#mulkler" className="hover:text-amber-400 transition-colors">Mülklerimiz</Link>
          <Link href="/iletisim" className="text-amber-400 font-bold">İletişim</Link>
        </div>
      </header>

      {/* İçerik */}
      <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Bize Ulaşın</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">İletişim & Konum</h1>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            Rezervasyon talepleriniz, özel organizasyonlar veya sorularınız için 7/24 ekibimizle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* İletişim Bilgileri */}
          <div className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Resepsiyon & Ofis</h3>
            
            <div className="flex items-start gap-4 text-xs text-slate-300">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white mb-1">Adres</strong>
                Aetheria Resort Cad. No:142, Sahil Bölgesi / İstanbul
              </div>
            </div>

            <div className="flex items-start gap-4 text-xs text-slate-300">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white mb-1">Telefon</strong>
                +90 (212) 555 01 99
              </div>
            </div>

            <div className="flex items-start gap-4 text-xs text-slate-300">
              <Mail className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white mb-1">E-Posta</strong>
                info@aetheriaresidences.com
              </div>
            </div>

            <div className="flex items-start gap-4 text-xs text-slate-300">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white mb-1">Giriş / Çıkış Saatleri</strong>
                Check-in: 14:00 | Check-out: 12:00
              </div>
            </div>
          </div>

          {/* Hızlı Mesaj Formu */}
          <form onSubmit={(e) => e.preventDefault()} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white mb-2">Bize Mesaj Gönderin</h3>
            <div>
              <label className="text-slate-400 block mb-1">Adınız Soyadınız</label>
              <input type="text" placeholder="Orhn..." className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">E-Posta Adresiniz</label>
              <input type="email" placeholder="ornek@email.com" className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Mesajınız</label>
              <textarea rows={4} placeholder="Talebinizi buraya yazın..." className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400 resize-none" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Send className="w-4 h-4" />
              <span>Gönder</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}