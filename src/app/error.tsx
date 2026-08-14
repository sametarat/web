'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';

/**
 * Beklenmeyen bir hatada Next'in İngilizce varsayılan ekranı yerine
 * markaya uygun, Türkçe bir kurtarma ekranı gösterir.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app] Beklenmeyen hata:', error.message, error.digest ?? '');
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-6 text-center text-slate-100">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400">
          // Hata
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Bir şeyler ters gitti
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Sayfa yüklenirken beklenmeyen bir sorun oluştu. Tekrar denemek çoğu zaman yeterli oluyor.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
