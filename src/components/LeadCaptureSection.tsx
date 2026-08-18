'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { trackLead } from '@/lib/track';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

const SERVICES = [
  { id: 'e-commerce', label: 'E-Ticaret' },
  { id: 'restaurant', label: 'Restoran/Kafe' },
  { id: 'hotel', label: 'Otel/Konaklama' },
  { id: 'custom', label: 'Özel AI Çözümü' },
  { id: 'seo', label: 'SEO & Reklam' },
  { id: 'other', label: 'Diğer' },
] as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export const LeadCaptureSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    service: 'e-commerce',
    message: '',
    company: '', // honeypot — gizli, sadece botlar doldurur
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Talebiniz gönderilemedi.');
      }

      trackLead('home');
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.',
      );
    }
  };

  const inputClass =
    'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-colors';

  return (
    <section id="teklif-al" className="relative z-10 scroll-mt-28">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">
            Projenizi Birlikte Hayata Geçirelim
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Sistemlerimiz hakkında bilgi almak ve dijital dönüşümünüzü başlatmak için formu doldurun.
          </p>
        </div>

        {status === 'sent' ? (
          <div
            role="status"
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center text-emerald-400 space-y-3"
          >
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold text-white">Talebiniz Alındı!</h3>
            <p className="text-sm text-slate-300">
              En kısa sürede uzman ekibimiz sizinle iletişime geçecektir.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
            {/* Honeypot — ekran okuyuculardan ve kullanıcıdan gizli */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="company">Şirket</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lead-name" className="block text-xs font-medium text-slate-400 mb-1">
                  Ad Soyad
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lead-email" className="block text-xs font-medium text-slate-400 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ahmet@sirketiniz.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-website" className="block text-xs font-medium text-slate-400 mb-1">
                Web Sitesi (Opsiyonel)
              </label>
              <input
                id="lead-website"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://sirketiniz.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-400 mb-2">
                İlgilendiğiniz Çözüm
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SERVICES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={formData.service === item.id}
                    onClick={() => setFormData({ ...formData, service: item.id })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      formData.service === item.id
                        ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="lead-message" className="block text-xs font-medium text-slate-400 mb-1">
                Projeniz Hakkında (Opsiyonel)
              </label>
              <textarea
                id="lead-message"
                rows={3}
                placeholder="Kısaca ihtiyacınızı anlatın..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {errorMessage} Dilerseniz doğrudan e-posta ile de ulaşabilirsiniz.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full mt-4 py-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:hover:bg-brand-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <span>Ücretsiz Danışmanlık Alın</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Formu göndererek{' '}
        <Link href="/kvkk" className="text-slate-400 underline underline-offset-2 hover:text-brand-400">
          KVKK aydınlatma metnini
        </Link>{' '}
        okuduğunuzu kabul edersiniz. Bilgileriniz yalnızca size dönüş yapmak için kullanılır.
      </p>
    </form>
        )}
      </div>
    </section>
  );
};

export default LeadCaptureSection;
