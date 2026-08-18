import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, CONTACT } from '@/lib/site';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description: `${SITE.name} sitesinde hangi çerezlerin kullanıldığı ve tercihinizi nasıl değiştirebileceğiniz.`,
  alternates: { canonical: '/cerez-politikasi' },
};

const COOKIES = [
  {
    name: 'Zorunlu çerezler',
    consent: 'Onay gerekmez',
    desc: 'Sitenin çalışması için gerekli olanlar. Çerez tercihinizi hatırlamak için tarayıcınızda tutulan kayıt da buna dâhildir.',
  },
  {
    name: 'Meta Pixel',
    consent: 'Onayınıza bağlı',
    desc: 'Meta (Facebook/Instagram) reklamlarından gelen ziyaretçilerin form doldurup doldurmadığını ölçer. Onay vermezseniz hiç yüklenmez.',
  },
  {
    name: 'Google Ads / gtag',
    consent: 'Onayınıza bağlı',
    desc: 'Google reklamlarının dönüşüm ölçümü. Onay vermezseniz hiç yüklenmez.',
  },
];

export default function CookiePage() {
  return (
    <LegalLayout
      title="Çerez Politikası"
      intro="Bu sitede hangi çerezlerin kullanıldığını ve tercihinizi nasıl değiştirebileceğinizi açıklıyoruz."
    >
      <LegalSection heading="Kullandığımız çerezler">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Çerez</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Durum</th>
                <th scope="col" className="py-2.5 font-semibold">Ne işe yarar</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-b border-slate-900 align-top">
                  <td className="py-3 pr-4 font-medium text-white">{c.name}</td>
                  <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{c.consent}</td>
                  <td className="py-3 leading-relaxed text-slate-400">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection heading="Onay vermezseniz ne olur">
        <p>
          Site tamamen normal çalışır. &quot;Sadece Gerekli&quot; seçerseniz reklam ve ölçümleme
          scriptleri tarayıcınıza hiç indirilmez — engellenmiş hâlde yüklenmez, gerçekten
          yüklenmez. Sayfa da bir miktar daha hızlı açılır.
        </p>
      </LegalSection>

      <LegalSection heading="Tercihinizi değiştirme">
        <p>
          Tercihiniz tarayıcınızda <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px]">kodara-cerez-onayi</code>{' '}
          anahtarıyla saklanır. Tarayıcınızın site verilerini temizlerseniz seçim sıfırlanır ve
          size yeniden sorulur. Ayrıca tarayıcı ayarlarınızdan çerezleri tümüyle engelleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection heading="Sorularınız için">
        <p>
          <a className="text-brand-400 hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{' '}
          adresine yazabilir ya da{' '}
          <Link href="/kvkk" className="text-brand-400 hover:underline">KVKK aydınlatma metnini</Link>{' '}
          inceleyebilirsiniz.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
