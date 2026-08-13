'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ArrowRight } from 'lucide-react';

export const LeadCaptureSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    service: 'e-commerce',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 relative z-10 max-w-4xl mx-auto px-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">
            Projenizi Birlikte Hayata Geçirelim
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Sistemlerimiz hakkında bilgi almak ve dijital dönüşümünüzü başlatmak için formu doldurun.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center text-emerald-400 space-y-3 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold text-white">Talebiniz Alındı!</h3>
            <p className="text-sm text-slate-300">
              En kısa sürede uzman ekibimiz sizinle iletişime geçecektir.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ahmet@sirketiniz.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Web Sitesi (Opsiyonel)
              </label>
              <input
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://sirketiniz.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                İlgilendiğiniz Çözüm
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'e-commerce', label: 'E-Ticaret' },
                  { id: 'restaurant', label: 'Restoran/Kafe' },
                  { id: 'hotel', label: 'Otel/Konaklama' },
                  { id: 'custom', label: 'Özel AI Çözümü' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, service: item.id })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      formData.service === item.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Ücretsiz Danışmanlık Alın</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};