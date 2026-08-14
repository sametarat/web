'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

const SERVICES = [
  { id: 'e-commerce', label: 'E-Ticaret' },
  { id: 'custom', label: 'Kurumsal / Özel Yazılım' },
  { id: 'restaurant', label: 'Restoran / Kafe' },
  { id: 'hotel', label: 'Otel / Konaklama' },
  { id: 'seo', label: 'SEO & Dijital Pazarlama' },
  { id: 'other', label: 'Diğer / Emin değilim' },
] as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    website: '',
    service: 'custom',
    message: '',
    company: '', // honeypot
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
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Mesajınız gönderilemedi.');
      }
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 transition-colors focus:border-brand-500 focus:outline-none';

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Mesajınız ulaştı</h2>
        <p className="text-sm text-slate-300">
          En kısa sürede size dönüş yapacağız. Acil bir konuysa WhatsApp'tan da yazabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
    >
      <h2 className="text-lg font-bold text-white">Proje Brief'i Gönderin</h2>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="contact-company">Şirket</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-slate-400">
            Ad Soyad
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ahmet Yılmaz"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-slate-400">
            E-Posta
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            placeholder="ahmet@sirketiniz.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-website" className="mb-1 block text-xs font-medium text-slate-400">
          Mevcut Web Siteniz (Opsiyonel)
        </label>
        <input
          id="contact-website"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://sirketiniz.com"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-service" className="mb-1 block text-xs font-medium text-slate-400">
          İlgilendiğiniz Hizmet
        </label>
        <select
          id="contact-service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className={inputClass}
        >
          {SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-xs font-medium text-slate-400">
          Projeniz
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          placeholder="Ne yapmak istediğinizi, hedeflerinizi ve varsa bütçe aralığınızı kısaca yazın."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-bold text-white transition-all hover:bg-brand-500 disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Gönderiliyor...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Gönder</span>
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
