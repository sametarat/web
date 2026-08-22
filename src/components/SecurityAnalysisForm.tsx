'use client';

import Link from 'next/link';
import React, { useId, useState } from 'react';
import { trackLead } from '@/lib/track';
import { TurnstileField, isTurnstileEnabled } from '@/components/TurnstileField';
import { ArrowRight, CheckCircle2, FileLock2, Loader2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * /guvenlik-analizi açılış sayfasının tek dönüşüm noktası.
 *
 * PentestForm ile aynı iskelet: honeypot, durum makinesi, trackLead, KVKK satırı.
 * Farkı alıcı profilinde: burada formu dolduran kişi çoğunlukla işletme sahibi
 * ya da tek kişilik BT sorumlusu. Bu yüzden alan sayısı az ve dil teknik değil.
 */

const SCOPE_OPTIONS = [
  { id: 'yerinde', label: 'Yerinde inceleme tercih ediyorum' },
  { id: 'uzaktan', label: 'Uzaktan inceleme tercih ediyorum' },
  { id: 'belirsiz', label: 'Emin değilim, önce konuşalım' },
] as const;

type SecurityAnalysisFormProps = {
  /** Sayfanın ikinci kullanımı: kart kabuğu olmadan, yalın. */
  compact?: boolean;
  heading?: string;
  description?: string;
  submitLabel?: string;
  /** Formun açılışta seçili geleceği inceleme biçimi. */
  defaultService?: string;
};

export function SecurityAnalysisForm({
  compact = false,
  heading = 'Güvenlik Analizi Talebi',
  description = 'Sabit bedel 25.000 TL + KDV. Formu bırakın, 1 iş günü içinde dönüp ön görüşme için uygun bir saat belirleyelim.',
  submitLabel = 'Analiz Talebi Gönder',
  defaultService = 'belirsiz',
}: SecurityAnalysisFormProps) {
  const uid = useId();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    service: defaultService,
    message: '',
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
        body: JSON.stringify({ ...form, source: 'guvenlik-analizi', turnstileToken }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Talebiniz gönderilemedi.');
      }
      trackLead('guvenlik-analizi');
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
          1 iş günü içinde dönüş yapıp ön görüşmeyi planlayalım. Bu aşamada sizden hiçbir
          sistem erişimi istenmiyor; inceleme yalnızca yazılı onayınızdan sonra başlar.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-brand-400 focus:outline-none';
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500';

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
          <h2 className="text-lg font-extrabold text-white sm:text-xl">{heading}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
        </div>
      )}

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={`hp-${uid}`}>Şirket</label>
        <input
          id={`hp-${uid}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor={`ad-${uid}`} className="sr-only">
          Ad Soyad
        </label>
        <input
          id={`ad-${uid}`}
          type="text"
          required
          autoComplete="name"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor={`mail-${uid}`} className="sr-only">
            E-posta
          </label>
          <input
            id={`mail-${uid}`}
            type="email"
            required
            autoComplete="email"
            placeholder="E-posta"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={`tel-${uid}`} className="sr-only">
            Telefon
          </label>
          <input
            id={`tel-${uid}`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Telefon (opsiyonel)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`kurum-${uid}`} className="sr-only">
          Kurum adı veya web siteniz
        </label>
        <input
          id={`kurum-${uid}`}
          type="text"
          autoComplete="organization"
          placeholder="Kurum adı veya web siteniz"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`bicim-${uid}`} className={labelClass}>
          İnceleme biçimi
        </label>
        <select
          id={`bicim-${uid}`}
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className={inputClass}
        >
          {SCOPE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`not-${uid}`} className={labelClass}>
          Kısa not (opsiyonel)
        </label>
        <textarea
          id={`not-${uid}`}
          rows={3}
          placeholder="Örn. Tek lokasyonda 20 kullanıcı, bir sunucu ve kamera sistemi var; yedeklemeden emin değiliz."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
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
            {submitLabel}
            <ArrowRight
              className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {/* Alıcı işletme sahibi: "form gönderdim, sistemime mi bakılacak?" endişesini
          formun dibinde bir kez daha kapatıyoruz. */}
      <p className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-[11px] leading-relaxed text-slate-400">
        <FileLock2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden="true" />
        <span className="min-w-0">
          Form yalnızca görüşme talebidir. Hiçbir inceleme, tarama veya erişim denemesi
          yazılı onayınız olmadan yapılmaz.
        </span>
      </p>

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Formu göndererek{' '}
        <Link
          href="/kvkk"
          className="text-slate-400 underline underline-offset-2 hover:text-brand-400"
        >
          KVKK aydınlatma metnini
        </Link>{' '}
        okuduğunuzu kabul edersiniz. Bilgileriniz yalnızca size dönüş yapmak için kullanılır,
        üçüncü taraflarla paylaşılmaz.
      </p>
    </form>
  );
}

export default SecurityAnalysisForm;
