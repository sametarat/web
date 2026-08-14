import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';

const LINKS = [
  { href: '/#hizmetler', label: 'Hizmetler' },
  { href: '/#demolar', label: 'Demolar' },
  { href: '/#surec', label: 'Süreç' },
  { href: '/#sss', label: 'SSS' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/#teklif-al', label: 'Teklif Al' },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-6 sm:py-10 px-4 sm:px-6 relative z-10 font-mono text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
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
    </footer>
  );
}

export default SiteFooter;
