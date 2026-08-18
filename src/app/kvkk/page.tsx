import type { Metadata } from 'next';
import { SITE, CONTACT, LEGAL } from '@/lib/site';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: `${SITE.name} olarak kişisel verilerinizi hangi amaçla işlediğimiz, kimlerle paylaştığımız ve haklarınız.`,
  alternates: { canonical: '/kvkk' },
  robots: { index: true, follow: true },
};

export default function KvkkPage() {
  return (
    <LegalLayout
      title="KVKK Aydınlatma Metni"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, sitemiz üzerinden paylaştığınız kişisel verilerin nasıl işlendiğine dair bilgilendirme."
    >
      <LegalSection heading="1. Veri Sorumlusu">
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla <strong className="text-slate-200">{LEGAL.entity}</strong>{' '}
          tarafından aşağıda açıklanan kapsamda işlenmektedir.
        </p>
        <p>
          Adres: {LEGAL.address}
          <br />
          Vergi/MERSİS: {LEGAL.taxInfo}
          <br />
          E-posta: <a className="text-brand-400 hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </LegalSection>

      <LegalSection heading="2. İşlenen Kişisel Veriler">
        <p>Sitemiz üzerinden yalnızca sizin ilettiğiniz verileri topluyoruz:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong className="text-slate-300">Kimlik:</strong> ad ve soyad.</li>
          <li><strong className="text-slate-300">İletişim:</strong> e-posta adresi, telefon numarası.</li>
          <li><strong className="text-slate-300">Talep içeriği:</strong> mevcut web sitenizin adresi, formda ya da yapay zeka asistanıyla yaptığınız görüşmede paylaştığınız proje bilgileri.</li>
          <li><strong className="text-slate-300">İşlem güvenliği:</strong> istek sıklığını sınırlamak amacıyla geçici olarak tutulan IP adresi.</li>
        </ul>
        <p>
          Özel nitelikli kişisel veri (sağlık, din, biyometrik veri vb.) talep etmiyoruz. Lütfen
          formlara ve sohbete bu tür bilgiler yazmayın.
        </p>
      </LegalSection>

      <LegalSection heading="3. İşleme Amaçları">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Talebinize dönüş yapmak ve teklif hazırlamak.</li>
          <li>Sözleşme öncesi görüşmeleri yürütmek.</li>
          <li>Site güvenliğini sağlamak ve kötüye kullanımı engellemek.</li>
          <li>İzin vermeniz hâlinde reklam performansını ölçmek.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Hukuki Sebep">
        <p>
          Verileriniz, KVKK m.5/2-(c) uyarınca <em>sözleşmenin kurulması veya ifasıyla doğrudan
          ilgili olması</em> ve m.5/2-(f) uyarınca <em>meşru menfaat</em> hukuki sebeplerine
          dayanılarak işlenir. Reklam ve ölçümleme çerezleri ise yalnızca <em>açık rızanıza</em>{' '}
          dayanır; onay vermediğiniz sürece bu çerezler yüklenmez.
        </p>
      </LegalSection>

      <LegalSection heading="5. Aktarım ve Hizmet Sağlayıcılar">
        <p>
          Verilerinizi satmıyor ve pazarlama amacıyla üçüncü taraflarla paylaşmıyoruz. Hizmetin
          çalışması için aşağıdaki sağlayıcılar kullanılmaktadır; bu sağlayıcıların sunucuları
          yurt dışında bulunabilir:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong className="text-slate-300">Vercel</strong> — site barındırma.</li>
          <li><strong className="text-slate-300">Resend</strong> — form bildirimlerinin e-posta ile iletilmesi.</li>
          <li><strong className="text-slate-300">Groq</strong> — yapay zeka asistanının yanıt üretmesi. Asistana yazdığınız mesajlar bu hizmete iletilir.</li>
          <li><strong className="text-slate-300">Meta ve Google</strong> — yalnızca çerez onayı verirseniz, reklam ölçümlemesi.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Saklama Süresi">
        <p>
          İletişim talepleri, görüşme süreci tamamlandıktan sonra en fazla 2 yıl saklanır; bu süre
          sonunda silinir. Sözleşmeye dönüşen taleplerde, ilgili mevzuatın öngördüğü saklama
          süreleri uygulanır. Güvenlik amaçlı IP kayıtları dakikalar içinde silinir.
        </p>
      </LegalSection>

      <LegalSection heading="7. Haklarınız">
        <p>KVKK m.11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.</p>
        <p>
          Taleplerinizi{' '}
          <a className="text-brand-400 hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{' '}
          adresine iletebilirsiniz. Başvurunuz en geç 30 gün içinde sonuçlandırılır.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
