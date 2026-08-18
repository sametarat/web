'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Cookie } from 'lucide-react';
import { META_PIXEL_ID, GOOGLE_ADS_ID } from '@/lib/track';

/**
 * Çerez onayı + onaya bağlı reklam takip scriptleri.
 *
 * KVKK ve benzeri düzenlemelerde, zorunlu olmayan çerezler (reklam/analitik)
 * ziyaretçi ONAY VERMEDEN yazılamaz. Bu yüzden Meta Pixel ve Google Ads
 * scriptleri burada tutuluyor: yalnızca "Kabul et" seçilirse yükleniyorlar.
 *
 * Tercih localStorage'da saklanıyor — sunucuya kullanıcı kaydı tutmadan
 * çalışması gerektiği için çerez yerine bu yeterli.
 */

const STORAGE_KEY = 'kodara-cerez-onayi';
type Consent = 'accepted' | 'rejected';

const hasTrackers = Boolean(META_PIXEL_ID || GOOGLE_ADS_ID);

export function ConsentGate() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'accepted' || stored === 'rejected') setConsent(stored);
    } catch {
      // Gizli sekmede localStorage erişimi engellenebilir — banner gösterilir, sorun olmaz.
    }
    setReady(true);
  }, []);

  const decide = (value: Consent) => {
    setConsent(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* yoksay */
    }
  };

  // Takip kodu tanımlı değilse banner göstermenin anlamı yok —
  // yalnızca zorunlu çerezler kullanılıyor demektir.
  if (!hasTrackers) return null;

  return (
    <>
      {consent === 'accepted' && <TrackingScripts />}

      {ready && consent === null && (
        <div
          role="dialog"
          aria-label="Çerez tercihi"
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-800 bg-slate-950/97 p-4 backdrop-blur-sm sm:p-5"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center">
            <span className="hidden h-fit rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400 sm:block">
              <Cookie className="h-4 w-4" aria-hidden="true" />
            </span>

            <p className="flex-1 text-xs leading-relaxed text-slate-300">
              Reklam performansını ölçmek için isteğe bağlı çerezler kullanmak istiyoruz.
              Sitenin çalışması için gerekli olanlar dışındaki çerezler yalnızca izin
              verirseniz yüklenir.{' '}
              <Link
                href="/cerez-politikasi"
                className="font-medium text-brand-400 underline-offset-4 hover:underline"
              >
                Çerez politikası
              </Link>
            </p>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide('rejected')}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-white sm:flex-none"
              >
                Sadece Gerekli
              </button>
              <button
                type="button"
                onClick={() => decide('accepted')}
                className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-500 sm:flex-none"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Yalnızca onay verildikten sonra render edilir. */
function TrackingScripts() {
  return (
    <>
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}

export default ConsentGate;
