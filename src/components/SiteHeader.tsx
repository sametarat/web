'use client';

import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { TopAdBanner } from '@/components/TopAdBanner';
import { MobileNav } from '@/components/MobileNav';

type NavLink = { href: string; label: string };

/**
 * Site geneli üst bar. Ana sayfada bölüm çapaları (#hizmetler), diğer
 * sayfalarda tam yol (/#hizmetler) kullanılabilsin diye linkler prop olarak alınır.
 */
export function SiteHeader({
  links = [
    { href: '#hizmetler', label: 'Hizmetler' },
    { href: '#demolar', label: 'Canlı Demolar' },
    { href: '/ilkeler', label: 'İlkelerimiz' },
    { href: '/sss', label: 'SSS' },
  ],
  ctaHref = '#teklif-al',
  showBanner = true,
}: {
  links?: NavLink[];
  ctaHref?: string;
  showBanner?: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur-md">
      {showBanner && <TopAdBanner />}
      {/* Genişlik ana sayfadaki kabuk ile aynı (max-w-[1320px] + aynı padding);
          aksi hâlde üst bar içerikten dar kalıp hizasız görünüyordu. */}
      <header className="mx-auto w-full max-w-[1320px] px-5 py-2 sm:px-8 sm:py-3 lg:px-12">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between shadow-lg">
          <Link href="/" aria-label="Ana sayfa" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[11px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-500/20">
              <Activity className="w-3 h-3" /> 100/100
            </span>
            <Link
              href={ctaHref}
              className="hidden rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-md shadow-brand-600/20 transition-all hover:bg-brand-500 sm:inline-block sm:px-3.5 sm:py-2"
            >
              Teklif Al
            </Link>
            <MobileNav links={links} ctaHref={ctaHref} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default SiteHeader;
