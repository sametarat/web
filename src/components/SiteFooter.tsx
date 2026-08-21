import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { SERVICES } from '@/content/services';

/** Beş hizmet sayfası — altbilgi, bu sayfaların site geneline açılan yolu. */
const SERVICE_LINKS = SERVICES.map((service) => ({
  href: `/${service.slug}`,
  label: service.navLabel,
}));

const LINKS = [
  { href: '/#demolar', label: 'Demolar' },
  { href: '/ilkeler', label: 'İlkelerimiz' },
  { href: '/sss', label: 'SSS' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/#teklif-al', label: 'Teklif Al' },
];

const LEGAL_LINKS = [
  { href: '/kvkk', label: 'KVKK Aydınlatma' },
  { href: '/gizlilik', label: 'Gizlilik' },
  { href: '/cerez-politikasi', label: 'Çerezler' },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-900 bg-slate-950 px-5 py-6 font-mono text-xs text-slate-500 sm:px-8 sm:py-10 lg:px-12">
      <nav
        aria-label="Hizmetler"
        className="mx-auto mb-5 flex max-w-[1320px] flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-slate-900 pb-5 text-[11px] text-slate-400 sm:justify-start sm:text-xs"
      >
        <span className="text-slate-600">Hizmetler:</span>
        {SERVICE_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="min-w-0 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mx-auto flex max-w-[1320px] flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="font-bold text-white">{SITE.name}</span>
          <span>&copy; {new Date().getFullYear()} Tüm Hakları Saklıdır.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400 text-[11px] sm:text-xs">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-[1320px] flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-900 pt-4 text-[11px] text-slate-600 sm:justify-start">
        {LEGAL_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="transition-colors hover:text-slate-400">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default SiteFooter;
