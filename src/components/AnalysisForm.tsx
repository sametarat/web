'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { trackLead } from '@/lib/track';
import { TurnstileField, isTurnstileEnabled } from '@/components/TurnstileField';
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Reklam açılış sayfasının tek dönüşüm noktası.
 *
 * Bilinçli olarak üç alan: ad, telefon, site. Her ek alan doldurma oranını
 * düşürür — nitelendirmeyi ilk telefon görüşmesinde yapmak daha ucuz.
 */
export function AnalysisForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    company: '', // honeypot
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;

    if (isTurnstileEnabled() && !turnstileToken) {
      setStatus('error');
      setErrorMessage('Lütfen güvenlik doğrulamasını tamamlayın.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'landing', service: '', turnstileToken }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Talebiniz gönderilemedi.');
      }
      trackLead('landing');
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.');
      setTurnstileToken('');
    }
  };

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-8 text-center"
      >
        <CheckCircle2 className="h-11 w-11 text-emerald-400" aria-hidden="true" />
        <h2 className="text-lg font-bold text-white">Talebiniz alındı</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Analizi hazırlayıp 1 iş günü içinde sizi arıyoruz. Hazırlık için ek bilgi gerekirse
          önce kısa bir mesaj atacağız.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-brand-400 focus:outline-none';

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? 'space-y-3'
          : 'space-y-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-sm sm:p-7'
      }
    >
      {!compact && (
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-white sm:text-xl">
            Ücretsiz Site Analizi İsteyin
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            30 saniyede doldurun, 1 iş günü içinde arayalım. Satış baskısı yok.
          </p>
        </div>
      )}

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={`hp-${compact ? 'b' : 'a'}`}>Şirket</label>
        <input
          id={`hp-${compact ? 'b' : 'a'}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor={`ad-${compact ? 'b' : 'a'}`} className="sr-only">
          Ad Soyad
        </label>
        <input
          id={`ad-${compact ? 'b' : 'a'}`}
          type="text"
          required
          autoComplete="name"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`tel-${compact ? 'b' : 'a'}`} className="sr-only">
            Telefon
          </label>
          <input
            id={`tel-${compact ? 'b' : 'a'}`}
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="Telefon"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`mail-${compact ? 'b' : 'a'}`} className="sr-only">
            E-posta
          </label>
          <input
            id={`mail-${compact ? 'b' : 'a'}`}
            type="email"
            required
            autoComplete="email"
            placeholder="E-posta"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`site-${compact ? 'b' : 'a'}`} className="sr-only">
          Mevcut web siteniz
        </label>
        <input
          id={`site-${compact ? 'b' : 'a'}`}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="Mevcut siteniz (yoksa boş bırakın)"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className={inputClass}
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300"
        >
          {errorMessage}
        </p>
      )}

      <TurnstileField onToken={setTurnstileToken} className="mt-3 overflow-x-auto" />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500 disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Gönderiliyor...
          </>
        ) : (
          <>
            Ücretsiz Analizimi İstiyorum
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Bilgileriniz üçüncü taraflarla paylaşılmaz. Spam göndermiyoruz.
      </p>
      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Formu göndererek{' '}
        <Link href="/kvkk" className="text-slate-400 underline underline-offset-2 hover:text-brand-400">
          KVKK aydınlatma metnini
        </Link>{' '}
        okuduğunuzu kabul edersiniz. Bilgileriniz yalnızca size dönüş yapmak için kullanılır.
      </p>
    </form>
  );
}

export default AnalysisForm;
