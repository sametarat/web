'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { TopAdBanner } from '@/components/TopAdBanner';
import { MobileNav } from '@/components/MobileNav';
import { ALL_SERVICE_CARDS } from '@/content/services';

type NavLink = { href: string; label: string };

/**
 * Hizmet sayfaları. Masaüstü barında tek bir "Hizmetler" linki duruyor
 * (ana sayfadaki hizmet ızgarasına gidiyor); telefonda ise her hizmetin
 * kendi sayfası menüye ekleniyor — orada yer var ve bu, hizmet sayfalarının
 * tek gezinme yolu.
 */
const SERVICE_LINKS: NavLink[] = ALL_SERVICE_CARDS.map((card) => ({
  href: card.href,
  label: card.label,
}));

/**
 * Site geneli üst bar. Ana sayfada bölüm çapaları (#hizmetler), diğer
 * sayfalarda tam yol (/#hizmetler) kullanılabilsin diye linkler prop olarak alınır.
 */
export function SiteHeader({
  links = [
    { href: '#hizmetler', label: 'Hizmetler' },
    { href: '/ilkeler', label: 'İlkelerimiz' },
    { href: '/sss', label: 'SSS' },
  ],
  ctaHref = '#teklif-al',
  // Kampanya bandı KAPALI. İçindeki metin ("İlk 10 müşterimize %20 SEO
  // hediye") hem artık sunulmayan bir hizmeti duyuruyordu hem de karşılığı
  // olmayan bir vaatti. Gerçek bir kampanyan olduğunda TopAdBanner.tsx'teki
  // metni güncelleyip burayı `true` yapman yeterli.
  showBanner = false,
}: {
  links?: NavLink[];
  ctaHref?: string;
  showBanner?: boolean;
}) {
  // Aynı adres iki kez görünmesin: sayfa kendi menüsünde bir hizmete zaten
  // link veriyorsa mükerrer satır (ve mükerrer React anahtarı) oluşmaz.
  const mobileLinks: NavLink[] = [
    ...links,
    ...SERVICE_LINKS.filter((service) => !links.some((link) => link.href === service.href)),
  ];

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur-md">
      {showBanner && <TopAdBanner />}
      {/* Genişlik ana sayfadaki kabuk ile aynı (max-w-[1320px] + aynı padding);
          aksi hâlde üst bar içerikten dar kalıp hizasız görünüyordu. */}
      <header className="mx-auto w-full max-w-[1320px] px-5 py-2 sm:px-8 sm:py-3 lg:px-12">
        <div className="bg-[var(--panel)]/90 border border-[var(--line)] rounded-xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between shadow-lg">
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
            <Link
              href={ctaHref}
              className="hidden rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-md shadow-brand-600/20 transition-all hover:bg-brand-500 sm:inline-block sm:px-3.5 sm:py-2"
            >
              Teklif Al
            </Link>
            <MobileNav links={mobileLinks} ctaHref={ctaHref} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default SiteHeader;
