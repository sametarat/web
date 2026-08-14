import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';

/**
 * Demo sayfalarının altına eklenen çapraz geçiş şeridi.
 *
 * Bir demoya giren ziyaretçi diğerlerini göremiyordu; tek çıkış yolu ana sayfaya
 * dönmekti. Portföyün tamamını göstermek, tek bir demoyu göstermekten daha ikna edici.
 */
const DEMOS = [
  { id: 'gurme-restoran', title: 'Gurme Restoran', sector: 'Gastronomi', path: '/demo/gurme-restoran' },
  { id: 'moda-eticaret', title: 'Moda E-Ticaret', sector: 'Perakende', path: '/demo/moda-eticaret' },
  { id: 'otel-rezervasyon', title: 'Otel & Konaklama', sector: 'Turizm', path: '/demo/otel-rezervasyon' },
  { id: 'klinik-saglik', title: 'Klinik & Sağlık', sector: 'Sağlık', path: '/demo/klinik-saglik' },
  { id: 'emlak-portfoy', title: 'Emlak Portföy', sector: 'Gayrimenkul', path: '/demo/emlak-portfoy' },
  { id: 'spor-salonu', title: 'Spor Salonu', sector: 'Fitness', path: '/demo/spor-salonu' },
];

export function DemoSwitcher({ currentId }: { currentId: string }) {
  const others = DEMOS.filter((demo) => demo.id !== currentId);

  return (
    <section className="border-t border-white/10 bg-slate-950/80 px-6 py-14 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              Diğer Sektörler
            </span>
            <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
              Başka bir sektörün demosuna göz atın
            </h2>
          </div>
          <Link
            href="/#teklif-al"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-slate-200"
          >
            Kendi Siteniz İçin Teklif Alın
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5">
          {others.map((demo) => (
            <li key={demo.id}>
              <Link
                href={demo.path}
                className="group flex h-full flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/25 hover:bg-white/[0.07]"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {demo.sector}
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 text-xs font-bold text-white sm:text-sm">
                  {demo.title}
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DemoSwitcher;
