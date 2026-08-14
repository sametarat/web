import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { SITE, CONTACT, whatsAppLink } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'İletişim',
  description: `${SITE.name} ile iletişime geçin. Web sitesi, e-ticaret ve özel yazılım projeleriniz için ücretsiz ön görüşme.`,
  alternates: { canonical: '/iletisim' },
  openGraph: {
    title: `İletişim | ${SITE.name}`,
    description: `${SITE.name} ile iletişime geçin.`,
    url: '/iletisim',
  },
};

const NAV = [
  { href: '/#hizmetler', label: 'Hizmetler' },
  { href: '/#demolar', label: 'Canlı Demolar' },
  { href: '/iletisim', label: 'İletişim' },
];

const DETAILS = [
  { icon: Mail, label: 'E-Posta', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Phone, label: 'Telefon', value: CONTACT.phoneDisplay, href: `tel:+${CONTACT.phoneE164}` },
  { icon: MapPin, label: 'Konum', value: CONTACT.city },
  { icon: Clock, label: 'Çalışma Saatleri', value: CONTACT.workingHours },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <SiteHeader links={NAV} ctaHref="#brief" showBanner={false} />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-brand-400">
            // İletişim
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Projenizi Konuşalım
          </h1>
          <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
            Formu doldurun ya da doğrudan yazın. Ön görüşme ücretsizdir; ihtiyacınızı dinleyip
            kapsam, süre ve bütçe aralığını netleştiriyoruz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Sol: iletişim bilgileri */}
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
              {DETAILS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="mt-0.5 rounded-lg border border-brand-500/20 bg-brand-500/10 p-2 text-brand-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="break-words text-sm text-slate-200 transition-colors hover:text-brand-300"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="break-words text-sm text-slate-200">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={whatsAppLink(
                `Merhaba ${SITE.name}, bir web projesi hakkında bilgi almak istiyorum.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 py-4 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/15"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp'tan Yazın
            </a>

            <p className="px-1 text-xs leading-relaxed text-slate-500">
              Formu gönderdiğinizde bilgileriniz yalnızca size dönüş yapmak için kullanılır,
              üçüncü taraflarla paylaşılmaz.
            </p>
          </div>

          {/* Sağ: brief formu */}
          <div id="brief" className="scroll-mt-28 lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
