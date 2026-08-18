import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FaqSection } from '@/components/FaqSection';

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular',
  description: `${SITE.name} ile çalışmadan önce merak edilenler: teslim süresi, fiyatlandırma, kaynak kodun sahipliği, teslim sonrası destek.`,
  alternates: { canonical: '/sss' },
  openGraph: { title: `Sık Sorulan Sorular | ${SITE.name}`, url: '/sss' },
};

const NAV = [
  { href: '/#hizmetler', label: 'Hizmetler' },
  { href: '/#demolar', label: 'Demolar' },
  { href: '/ilkeler', label: 'İlkelerimiz' },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <SiteHeader links={NAV} ctaHref="/#teklif-al" showBanner={false} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <FaqSection />

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Cevabını bulamadığınız bir şey mi var?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Nasıl çalıştığımızı ve size ne söz verdiğimizi ilkeler sayfamızda yazılı bulabilirsiniz.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/ilkeler"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
            >
              Çalışma İlkelerimiz
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500"
            >
              Bize Yazın
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
