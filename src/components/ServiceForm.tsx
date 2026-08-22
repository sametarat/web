'use client';

import Link from 'next/link';
import React, { useId, useState } from 'react';
import { trackLead } from '@/lib/track';
import { TurnstileField, isTurnstileEnabled } from '@/components/TurnstileField';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Hizmet sayfalarının tek dönüşüm noktası.
 *
 * PentestForm ile aynı iskelet: honeypot, durum makinesi, useId ile eşsiz
 * alan kimlikleri, trackLead ve KVKK satırı. Farkı, hizmetin adının prop
 * olarak gelmesi: aynı bileşen beş hizmetin hem kurumsal hem reklam
 * sayfasında kullanılıyor, gelen e-postada hangi hizmet olduğu `service`
 * alanından okunuyor.
 */
type ServiceFormProps = {
  /** Hizmetin ekranda görünen adı — lead e-postasına aynen yazılır. */
  service: string;
  /** Hangi sayfadan geldi: kurumsal sayfa mı, reklam açılış sayfası mı. */
  source: 'hizmet' | 'hizmet-teklif';
  heading?: string;
  description?: string;
  submitLabel?: string;
};

export function ServiceForm({
  service,
  source,
  heading = 'Teklif İsteyin',
  description = 'Formu bırakın, ihtiyacınızı konuşmak için 1 iş günü içinde dönüş yapalım.',
  submitLabel = 'Teklif İstiyorum',
}: ServiceFormProps) {
  const uid = useId();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
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
        body: JSON.stringify({ ...form, service, source, turnstileToken }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Talebiniz gönderilemedi.');
      }
      trackLead(source);
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
        <h2 className="text-lg font-bold text-[var(--ink)]">Talebiniz alındı</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-2)]">
          {service} talebiniz bize ulaştı. 1 iş günü içinde dönüş yapıp ihtiyacınızı
          birlikte netleştirelim.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full min-w-0 rounded-xl border border-[var(--line)] bg-[var(--field)] px-4 py-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] transition-colors focus:border-[var(--accent)] focus:outline-none';
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-4)]';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl backdrop-blur-sm sm:p-7"
    >
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-[var(--ink)] sm:text-xl">{heading}</h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-3)]">{description}</p>
      </div>

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
          <label htmlFor={`tel-${uid}`} className="sr-only">
            Telefon
          </label>
          <input
            id={`tel-${uid}`}
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
      </div>

      <div>
        <label htmlFor={`site-${uid}`} className="sr-only">
          Mevcut siteniz
        </label>
        <input
          id={`site-${uid}`}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="Mevcut siteniz (varsa)"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`not-${uid}`} className={labelClass}>
          Kısaca ihtiyacınız
        </label>
        <textarea
          id={`not-${uid}`}
          rows={3}
          placeholder="Birkaç cümle yeterli; ayrıntıyı görüşmede konuşuruz. (opsiyonel)"
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
        className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500 disabled:opacity-60"
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

      <p className="text-center text-[11px] leading-relaxed text-[var(--ink-4)]">
        Formu göndererek{' '}
        <Link
          href="/kvkk"
          className="text-[var(--ink-3)] underline underline-offset-2 hover:text-[var(--accent)]"
        >
          KVKK aydınlatma metnini
        </Link>{' '}
        okuduğunuzu kabul edersiniz. Bilgileriniz yalnızca size dönüş yapmak için kullanılır,
        üçüncü taraflarla paylaşılmaz.
      </p>
    </form>
  );
}

export default ServiceForm;
