import Link from 'next/link';
import { Home, MessageCircle } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { Logo } from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <header className="mx-auto w-full max-w-6xl px-6 py-6">
        <Link href="/" aria-label="Ana sayfa">
          <Logo size="sm" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-400">
          // 404
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Bu sayfa bulunamadı
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Aşağıdan devam edebilirsiniz.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            İletişime Geç
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
