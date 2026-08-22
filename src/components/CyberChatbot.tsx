'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Bot, Send, X, Sparkles, Square, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';
import { SITE } from '@/lib/site';
import { TurnstileField, isTurnstileEnabled } from '@/components/TurnstileField';

const QUICK_QUESTIONS = [
  'Web sitesi paketleri ve fiyatlandırma nasıl?',
  'E-ticaret çözümleriniz neleri kapsıyor?',
  'Proje teslim süreleriniz nedir?',
];

const GREETING = `Merhaba! Ben ${SITE.name} AI asistanıyım. Web mimarisi, e-ticaret, SEO veya reklam tarafında ne yapmak istediğinizi anlatın — size uygun yolu ve yaklaşık süreyi söyleyeyim.`;

/**
 * Sunucu JSON hata gövdesi döndüğünde (örn. 503 yapılandırma hatası) useChat bunu
 * ham metin olarak error.message'a koyar. Ziyaretçiye `{"error":"..."}` göstermemek
 * için gövdeyi çözüp içindeki mesajı çıkarıyoruz.
 */
function readableError(error: Error | undefined): string {
  const fallback = 'Asistana şu anda ulaşılamıyor. Lütfen birazdan tekrar deneyin veya iletişim formunu kullanın.';
  if (!error?.message) return fallback;

  const raw = error.message.trim();
  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw) as { error?: string; message?: string };
      return parsed.error ?? parsed.message ?? fallback;
    } catch {
      return fallback;
    }
  }
  // AI SDK'nın çevrilmemiş varsayılan metnini de gizle
  if (/^an error occurred/i.test(raw)) return fallback;
  return raw;
}

/**
 * Bazı açık kaynak modeller araç çağrısını yapısal olarak değil düz metin olarak
 * üretebiliyor: `<function=saveQualifiedLead>{...}</function>`. Sunucu tarafında
 * lead'i yine de yakalıyoruz ama ziyaretçi bu ham etiketleri asla görmemeli.
 */
const LEAKED_TOOL_CALL =
  /<function[^>]*>[\s\S]*?<\/function>|<function[^>]*>[\s\S]*$|<\|?(?:python_tag|tool_call)\|?>[\s\S]*/gi;

function cleanText(raw: string): string {
  return raw.replace(LEAKED_TOOL_CALL, '').replace(/\s{2,}/g, ' ').trim();
}

/** Tool çağrısı parçalarının tipi (AI SDK, aracı `tool-<isim>` olarak yayınlar). */
type MessagePart = {
  type: string;
  text?: string;
  state?: string;
};

/**
 * Asistan çalışmadığında devreye giren yedek lead formu.
 *
 * Sohbet balonunun asıl işi sohbet etmek değil, iletişim bilgisi toplamak.
 * Groq anahtarı tanımsızsa, kota dolmuşsa ya da model hata verirse ziyaretçiyi
 * "asistan devre dışı" mesajıyla baş başa bırakmak lead kaybetmek demek —
 * bunun yerine iki alanlık bir form gösteriyoruz.
 */
function FallbackLeadForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  // Hata metni tek bir cümle değil artık: doğrulama uyarısı da aynı satırda gösteriliyor.
  const [errorText, setErrorText] = useState(
    'Gönderilemedi. Lütfen tekrar deneyin ya da doğrudan arayın.',
  );

  if (state === 'sent') {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-emerald-200">
          Bilgileriniz bize ulaştı. En geç 1 iş günü içinde dönüş yapacağız.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-2 rounded-xl border border-slate-700 bg-slate-950/60 p-3"
      onSubmit={async (event) => {
        event.preventDefault();
        if (state === 'sending') return;
        if (isTurnstileEnabled() && !turnstileToken) {
          setErrorText('Lütfen güvenlik doğrulamasını tamamlayın.');
          setState('error');
          return;
        }
        setState('sending');
        try {
          const res = await fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...form,
              source: 'form',
              service: 'Sohbet balonu (asistan kapalı)',
              turnstileToken,
            }),
          });
          if (!res.ok) throw new Error();
          setState('sent');
        } catch {
          setErrorText('Gönderilemedi. Lütfen tekrar deneyin ya da doğrudan arayın.');
          setState('error');
          setTurnstileToken('');
        }
      }}
    >
      <p className="text-xs leading-relaxed text-slate-300">
        Bilgilerinizi bırakın, biz size dönelim:
      </p>

      {/* Bot tuzağı */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px]"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <label className="sr-only" htmlFor="cb-name">Ad Soyad</label>
      <input
        id="cb-name"
        type="text"
        required
        autoComplete="name"
        placeholder="Ad Soyad"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
      />
      <label className="sr-only" htmlFor="cb-mail">E-posta</label>
      <input
        id="cb-mail"
        type="email"
        required
        autoComplete="email"
        placeholder="E-posta"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
      />
      <label className="sr-only" htmlFor="cb-tel">Telefon</label>
      <input
        id="cb-tel"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Telefon (isteğe bağlı)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
      />

      {state === 'error' && (
        <p role="alert" className="text-[11px] text-red-300">
          {errorText}
        </p>
      )}

      <TurnstileField onToken={setTurnstileToken} className="mt-3 overflow-x-auto" />

      <button
        type="submit"
        disabled={state === 'sending'}
        className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
      >
        {state === 'sending' ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Gönderiliyor...
          </>
        ) : (
          'Bilgilerimi Gönder'
        )}
      </button>
    </form>
  );
}

export default function CyberChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop, regenerate, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/bot' }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  // Yeni mesaj geldikçe en alta kaydır
  useEffect(() => {
    if (isOpen) scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isBusy]);

  // Panel açılınca odağı input'a al
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Escape ile kapat
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isBusy) return;
      setInputValue('');
      clearError();
      void sendMessage({ text: trimmed });
    },
    [isBusy, sendMessage, clearError],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send(inputValue);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Sohbeti kapat' : 'Yapay zeka asistanını aç'}
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-all hover:bg-brand-500"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={`${SITE.name} AI Asistanı`}
          className="fixed bottom-24 right-5 z-50 flex h-[min(560px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-md"
        >
          <header className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <span className="rounded-lg border border-brand-500/20 bg-brand-500/10 p-1.5 text-brand-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{SITE.name} AI Asistanı</p>
              <p className="text-[11px] text-emerald-400">Genelde birkaç saniyede yanıtlar</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Sohbeti kapat"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <Bubble role="assistant">{GREETING}</Bubble>

            {messages.map((message) => {
              const parts = (message.parts ?? []) as MessagePart[];
              const text = cleanText(
                parts
                  .filter((part) => part.type === 'text')
                  .map((part) => part.text ?? '')
                  .join(''),
              );
              // Lead kaydetme aracı çalışırken kullanıcı boş ekrana bakmasın
              const leadPart = parts.find((part) => part.type === 'tool-saveQualifiedLead');

              return (
                <React.Fragment key={message.id}>
                  {text && (
                    <Bubble role={message.role === 'user' ? 'user' : 'assistant'}>{text}</Bubble>
                  )}
                  {leadPart && <LeadStatus done={leadPart.state === 'output-available'} />}
                </React.Fragment>
              );
            })}

            {status === 'submitted' && (
              <Bubble role="assistant">
                <span className="inline-flex gap-1" aria-label="Yazıyor">
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </span>
              </Bubble>
            )}

            {error && (
              <div className="space-y-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5">
                <p className="text-xs leading-relaxed text-red-300">{readableError(error)}</p>
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    void regenerate();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-2.5 py-1 text-[11px] font-medium text-red-200 transition-colors hover:bg-red-500/20"
                >
                  <RotateCcw className="h-3 w-3" />
                  Tekrar dene
                </button>
              </div>
            )}

            {/* Asistan çalışmıyorsa ziyaretçiyi elimizden kaçırmayalım. */}
            {error && <FallbackLeadForm />}

            <div ref={scrollAnchorRef} />
          </div>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => send(question)}
                  disabled={isBusy}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-brand-500/50 disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-800 p-3">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Sorunuzu yazın..."
              aria-label="Mesajınız"
              maxLength={1000}
              className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
            />
            {isBusy ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Yanıtı durdur"
                className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-slate-200 transition-colors hover:bg-slate-700"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Gönder"
                className="rounded-xl bg-brand-600 px-3.5 text-white transition-colors hover:bg-brand-500 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}

/** Lead kaydetme aracının durumunu gösterir. */
function LeadStatus({ done }: { done: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] ${
        done
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
          : 'border-slate-800 bg-slate-900 text-slate-400'
      }`}
    >
      {done ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>Bilgileriniz ekibimize iletildi.</span>
        </>
      ) : (
        <>
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          <span>Bilgileriniz kaydediliyor...</span>
        </>
      )}
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-brand-600 text-white'
            : 'rounded-bl-md border border-slate-800 bg-slate-900 text-slate-200'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
      style={{ animationDelay: delay }}
    />
  );
}
