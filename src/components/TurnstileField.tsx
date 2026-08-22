'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile widget'ı — tüm herkese açık formlarda kullanılıyor.
 *
 * Site anahtarı tanımlı değilse HİÇBİR ŞEY render etmiyor ve script indirmiyor;
 * form eskisi gibi çalışıyor. Böylece kurulum yapılmadan da site ayakta kalıyor.
 *
 * Kullanım:
 *   const [token, setToken] = useState('');
 *   ...
 *   <TurnstileField onToken={setToken} />
 *   ...ve gönderirken body'ye `turnstileToken: token` ekle.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'auto' | 'light' | 'dark';
          language?: string;
        },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

/** Script'i sayfa başına bir kez yükler. */
let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('turnstile')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function isTurnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}

export function TurnstileField({
  onToken,
  className = '',
}: {
  onToken: (token: string) => void;
  className?: string;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
  const fieldId = useId();

  // onToken referansı her render'da değişebilir; widget'ı yeniden kurmamak için
  // ref'te tutuyoruz. Güncellemeyi render sırasında değil effect içinde yapıyoruz
  // (render sırasında ref yazmak React kurallarına aykırı).
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const emit = useCallback((token: string) => onTokenRef.current(token), []);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !holderRef.current || !window.turnstile) return;
        if (widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(holderRef.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          language: 'tr',
          callback: (token) => emit(token),
          'expired-callback': () => emit(''),
          'error-callback': () => {
            emit('');
            setFailed(true);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // Widget zaten kaldırılmış olabilir.
        }
      }
      widgetIdRef.current = null;
    };
  }, [emit]);

  if (!SITE_KEY) return null;

  return (
    <div className={`min-w-0 ${className}`}>
      <div ref={holderRef} id={`ts-${fieldId}`} />
      {failed && (
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Güvenlik doğrulaması yüklenemedi. Formu yine de gönderebilirsiniz; sorun sürerse
          doğrudan telefonla ulaşın.
        </p>
      )}
    </div>
  );
}

export default TurnstileField;
