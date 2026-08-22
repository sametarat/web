import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PrinciplesSection } from '@/components/PrinciplesSection';
import { ProcessSection } from '@/components/ProcessSection';

export const metadata: Metadata = {
  title: 'Çalışma İlkelerimiz',
  description: `${SITE.name} ile çalışırken ne bekleyeceğiniz: yetkilendirme sözleşmesi olmadan test başlamaması, sabit fiyat, ücretsiz doğrulama testi, veriye en az dokunma ilkesi ve dört adımlı süreç.`,
  alternates: { canonical: '/ilkeler' },
  openGraph: { title: `Çalışma İlkelerimiz | ${SITE.name}`, url: '/ilkeler' },
};

const NAV = [
  { href: '/#hizmetler', label: 'Hizmetler' },
  { href: '/sss', label: 'SSS' },
];

export default function PrinciplesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <SiteHeader links={NAV} ctaHref="/#teklif-al" showBanner={false} />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-16 px-5 pb-20 pt-10 sm:space-y-20 sm:px-6 sm:pt-16">
        <PrinciplesSection />
        <ProcessSection />

        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold text-white sm:text-xl">Aklınıza takılan var mı?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Teslim süresi, fiyatlandırma ve destek hakkında en sık sorulanları derledik.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/sss"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
            >
              Sık Sorulan Sorular
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#teklif-al"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500"
            >
              Teklif Alın
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
