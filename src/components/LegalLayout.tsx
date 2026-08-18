import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { LEGAL } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const NAV = [
  { href: '/kvkk', label: 'KVKK Aydınlatma' },
  { href: '/gizlilik', label: 'Gizlilik' },
  { href: '/cerez-politikasi', label: 'Çerezler' },
];

/**
 * Yasal metin sayfaları için ortak çerçeve.
 * Okunabilirlik için dar bir sütun ve tutarlı tipografi kullanır.
 */
export function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <SiteHeader links={NAV} ctaHref="/#teklif-al" showBanner={false} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-10 sm:px-6 sm:pt-14">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{intro}</p>
        <p className="mt-2 font-mono text-[11px] text-slate-500">
          Son güncelleme: {LEGAL.updatedAt}
        </p>

        {/* Yer tutucu uyarısı — gerçek bilgiler girilmeden metin geçerli değil */}
        {LEGAL.entity.includes('[') && (
          <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-amber-200">
              <strong className="font-semibold">Site sahibine not:</strong> Bu metindeki ticari
              unvan, adres ve vergi bilgileri yer tutucu. <code>src/lib/site.ts</code> içindeki{' '}
              <code>LEGAL</code> nesnesini doldurun. Bu uyarı, bilgiler girilince otomatik kaybolur.
            </p>
          </div>
        )}

        <article className="legal-prose mt-10 space-y-8">{children}</article>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-slate-800 pt-6 text-xs">
          {NAV.filter((l) => l.label).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Yasal metinlerde tekrar eden başlık + paragraf bloğu. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-bold text-white sm:text-lg">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-400">{children}</div>
    </section>
  );
}
