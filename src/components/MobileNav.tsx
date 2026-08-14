'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type NavLink = { href: string; label: string };

/**
 * Mobil navigasyon.
 *
 * Masaüstü menüsü `hidden md:flex` olduğu için telefonda hiçbir bölüm linkine
 * ulaşılamıyordu — ziyaretçinin tek seçeneği sayfayı elle kaydırmaktı.
 *
 * Panel document.body'ye portal ile basılıyor: bu bileşen `backdrop-blur`
 * kullanan sticky header'ın içinde duruyor ve `backdrop-filter` kendi
 * altındaki `position: fixed` elemanlar için containing block oluşturur —
 * portal olmadan panel viewport'a değil header'a göre konumlanır.
 */
export function MobileNav({ links, ctaHref }: { links: NavLink[]; ctaHref: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // createPortal yalnızca istemcide çalışır
  useEffect(() => setMounted(true), []);

  // Menü açıkken arka planın kaymasını engelle
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Menüyü aç"
        aria-expanded={isOpen}
        className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-slate-300 transition-colors hover:text-white md:hidden"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] md:hidden">
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-slate-950/80 backdrop-blur-sm"
            />

            <nav
              aria-label="Mobil menü"
              className="absolute right-0 top-0 flex h-full w-[min(300px,85vw)] flex-col gap-1 border-l border-slate-800 bg-slate-950 p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  Menü
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Menüyü kapat"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/iletisim"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
              >
                İletişim
              </Link>

              <Link
                href={ctaHref}
                onClick={() => setIsOpen(false)}
                className="mt-3 rounded-xl bg-brand-600 px-3 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-500"
              >
                Teklif Al
              </Link>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}

export default MobileNav;
