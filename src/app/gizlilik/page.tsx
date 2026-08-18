import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, CONTACT, LEGAL } from '@/lib/site';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: `${SITE.name} olarak hangi verileri topladığımız, nasıl sakladığımız ve nasıl koruduğumuz.`,
  alternates: { canonical: '/gizlilik' },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Gizlilik Politikası"
      intro="Bu sitede hangi bilgileri topladığımızı, ne için kullandığımızı ve nasıl koruduğumuzu sade bir dille anlatıyoruz."
    >
      <LegalSection heading="Kısaca">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Yalnızca formlarda ve sohbette <strong className="text-slate-300">sizin yazdığınız</strong> bilgileri topluyoruz.</li>
          <li>Verilerinizi satmıyor, kiralamıyor, pazarlama listesi olarak paylaşmıyoruz.</li>
          <li>Reklam çerezleri yalnızca <strong className="text-slate-300">siz onay verirseniz</strong> çalışır.</li>
          <li>Silinmesini istediğinizde siliyoruz.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Topladığımız bilgiler">
        <p>
          İletişim formu, teklif formu ve ücretsiz analiz formu üzerinden ad-soyad, e-posta,
          telefon ve varsa mevcut sitenizin adresi. Yapay zeka asistanıyla konuşursanız,
          o sohbette yazdığınız mesajlar.
        </p>
        <p>
          Ayrıca sunucumuz, aynı adresten gelen aşırı isteği engellemek için IP adresinizi
          geçici olarak bellekte tutar. Bu kayıt diske yazılmaz ve dakikalar içinde silinir.
        </p>
      </LegalSection>

      <LegalSection heading="Yapay zeka asistanı hakkında">
        <p>
          Sitedeki asistan, yanıt üretmek için mesajlarınızı Groq altyapısına iletir. Asistana
          kimlik numarası, kart bilgisi, şifre veya sağlık bilgisi gibi hassas veriler yazmayın —
          ihtiyacımız yok ve talep etmiyoruz.
        </p>
        <p>
          Sohbette e-posta veya telefon paylaşırsanız, bunu bir iletişim talebi olarak kaydeder
          ve size dönüş yapmak için kullanırız.
        </p>
      </LegalSection>

      <LegalSection heading="Verilerinizi kimler görüyor">
        <p>
          Talebiniz e-posta olarak <strong className="text-slate-300">{LEGAL.entity}</strong> ekibine iletilir.
          Bunun dışında verilerinize erişimi olan taraflar yalnızca altyapı sağlayıcılarımızdır
          (barındırma, e-posta gönderimi, yapay zeka yanıtı). Ayrıntılı liste{' '}
          <Link href="/kvkk" className="text-brand-400 hover:underline">KVKK aydınlatma metninde</Link>.
        </p>
      </LegalSection>

      <LegalSection heading="Güvenlik">
        <p>
          Site tümüyle HTTPS üzerinden sunulur. Form uçları istek sınırlaması ve bot koruması
          ile korunur. Buna rağmen internet üzerinden yapılan hiçbir aktarımın %100 güvenli
          olduğu garanti edilemez; hassas bilgilerinizi form üzerinden göndermemenizi öneririz.
        </p>
      </LegalSection>

      <LegalSection heading="Silme talebi">
        <p>
          <a className="text-brand-400 hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{' '}
          adresine yazmanız yeterli. Kaydınızı siler ve size teyit ederiz.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
