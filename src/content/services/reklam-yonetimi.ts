/**
 * Reklam Yönetimi hizmet içeriği.
 * Bu tek dosya iki sayfayı birden besler:
 *   /reklam-yonetimi/          → kurumsal hizmet sayfası
 *   /reklam-yonetimi/teklif/   → reklam trafiği için odaklı açılış sayfası
 * Metni değiştirmek için sadece bu dosyayı düzenlemek yeterlidir.
 */
import type { ServiceContent } from './types';

const reklamYonetimi: ServiceContent = {
  slug: 'reklam-yonetimi',
  navLabel: 'Reklam Yönetimi',
  picker: 'Google ve Meta reklam yönetimi',
  icon: 'target',
  card: {
    title: 'Reklam Yönetimi',
    desc: 'Google Ads ve Meta reklamlarının kurulumu, dönüşüm takibi, A/B testi ve aylık optimizasyonu. Reklam hesabı sizin adınıza açılır, bütçe doğrudan platforma ödenir.',
  },
  meta: {
    title: 'Google ve Meta Reklam Yönetimi — Kodara Digital',
    description: 'Google Ads ve Meta (Facebook, Instagram) reklam yönetimi. Önce dönüşüm takibi kurulur, sonra bütçe harcanır. Hesap sizin mülkiyetinizde açılır, her ay şeffaf rapor verilir.',
  },
  hero: {
    eyebrow: 'Reklam Yönetimi · Google & Meta',
    h1: 'Ölçüm kurulmadan harcanan bütçe kayıptır',
    lead: 'Çoğu reklam hesabında hangi tıklamanın müşteriye dönüştüğü bilinmiyor. Bilinmediği için de doğru kampanya kapatılıyor, yanlış olan büyütülüyor. Biz işe bütçeyle değil, ölçümü kurmakla başlıyoruz.',
    bullets: [
      'Önce dönüşüm takibi: piksel, etiket ve olay kurulumu doğrulanarak yapılır',
      'Google Ads ve Meta tarafı tek bir hedef etrafında birlikte planlanır',
      'Reklam metni ve görselleri A/B testiyle karşılaştırılır, tahminle seçilmez',
      'Reklam hesabı sizin adınıza açılır; bütçe doğrudan platforma ödenir',
    ],
  },
  summaryTitle: 'Teslim aldığınız çıktılar',
  summaryText: 'Bütçenin nereye gittiğini ve karşılığında ne geldiğini her ay görüyorsunuz. Hesap sizin olduğu için bu veriye erişiminiz hiçbir zaman bize bağlı kalmıyor.',
  deliverables: [
    'Kendi adınıza açılmış Google Ads ve Meta reklam hesapları',
    'Kurulmuş ve test edilmiş dönüşüm takibi — piksel, etiket ve olaylar',
    'Kampanya yapısı — hedef kitle, anahtar kelime ve reklam metni setleri',
    'Aylık performans raporu — harcama, dönüşüm, maliyet ve sonraki adımlar',
  ],
  intro: {
    heading: 'Bütçeden önce ölçüm',
    paragraphs: [
      'Devraldığımız hesapların büyük kısmında aynı tabloyu görüyoruz: reklamlar aylardır dönüyor, harcama düzenli, ama hangi kampanyanın gerçekten müşteri getirdiği belli değil. Dönüşüm takibi ya hiç kurulmamış ya da yanlış olayı sayıyor. Bu durumda alınan her karar tahmine dayanıyor.',
      'Ölçüm doğru kurulduğunda tablo değişiyor. Hangi anahtar kelimenin form doldurttuğu, hangi görselin ilgi çekip satış getirmediği, hangi kitlenin sadece tıklayıp gittiği görünür hâle geliyor. Optimizasyon dediğimiz şey de bundan sonra başlıyor; öncesinde yapılan şey sadece bütçe dağıtmak.',
      'Bu yüzden çalışmaya kampanya açarak değil, takibi kurup doğrulayarak başlıyoruz. Test dönüşümleri gönderilip veri platforma düzgün ulaşıyor mu kontrol ediliyor. Ancak ondan sonra bütçe devreye giriyor ve ilk haftalar öğrenme dönemi olarak, kontrollü şekilde yönetiliyor.',
    ],
  },
  offerHeading: 'Yaptığımız işler',
  offer: [
    {
      title: 'Kampanya kurulumu',
      desc: 'Hesap yapısı, kampanya ve reklam grubu mimarisi, bütçe dağılımı ve teklif stratejisi. Yapı, sonradan büyüdüğünde karışmayacak biçimde baştan kurulur.',
    },
    {
      title: 'Anahtar kelime ve hedef kitle',
      desc: 'Google tarafında satın alma niyeti taşıyan aramalar ve negatif kelime listesi; Meta tarafında ilgi, davranış ve benzer kitle kurguları.',
    },
    {
      title: 'Reklam metni ve görsel',
      desc: 'Her reklam grubu için birden fazla başlık ve açıklama varyantı, Meta tarafında görsel ve video seti. Marka diliniz korunarak yazılır.',
    },
    {
      title: 'Dönüşüm takibi kurulumu',
      desc: 'Google etiket ve Meta piksel kurulumu, form gönderimi, arama ve satın alma olaylarının tanımlanması, test dönüşümüyle doğrulama.',
    },
    {
      title: 'A/B testi',
      desc: 'Reklam metni, görsel ve açılış sayfası varyantları karşılaştırılır. Kazanan seçilirken tahmin değil, anlamlı fark oluşana kadar biriken veri esas alınır.',
    },
    {
      title: 'Aylık optimizasyon ve rapor',
      desc: 'Arama terimi incelemesi, negatif kelime güncellemesi, bütçe kaydırma ve teklif ayarları. Yapılan her değişiklik aylık raporda gerekçesiyle yazılır.',
    },
  ],
  processHeading: 'Kurulumdan aylık optimizasyona',
  process: [
    {
      title: 'Hedef ve ölçüm planı',
      desc: 'Hangi eylemin dönüşüm sayılacağı ve bir dönüşümün sizin için ne değerde olduğu netleşir.',
    },
    {
      title: 'Takip kurulumu',
      desc: 'Piksel, etiket ve olaylar kurulur; test dönüşümleriyle verinin platforma doğru ulaştığı doğrulanır.',
    },
    {
      title: 'Yayın ve öğrenme',
      desc: 'Kampanyalar kontrollü bütçeyle açılır. İlk haftalar veri toplama dönemidir, erken müdahale edilmez.',
    },
    {
      title: 'Optimizasyon döngüsü',
      desc: 'Arama terimleri, kitleler ve varyantlar aylık olarak gözden geçirilir; değişiklikler raporda gerekçelenir.',
    },
  ],
  audienceHeading: 'Bu hizmet kimler için',
  audience: [
    {
      title: 'Hızlı talep gereken işler',
      desc: 'SEO’nun aylar süren etkisini bekleyemeyen, kısa vadede görüşme ve satış üretmesi gereken firmalar.',
    },
    {
      title: 'Hesabı kendi yöneten işletmeler',
      desc: 'Reklamı kendi açmış, harcama artarken karşılığını göremediği için nerede yanlış yaptığını bilmeyenler.',
    },
    {
      title: 'E-ticaret markaları',
      desc: 'Ürün beslemesi, yeniden pazarlama ve satın alma takibinin doğru kurulması gereken mağazalar.',
    },
    {
      title: 'Yeni ürün çıkaranlar',
      desc: 'Talebin gerçekten var olup olmadığını kontrollü bir bütçeyle hızlıca ölçmek isteyen ekipler.',
    },
  ],
  faq: [
    {
      q: 'Reklam bütçesi hizmet bedeline dâhil mi?',
      a: 'Hayır, ikisi ayrıdır. Reklam bütçesi doğrudan Google ve Meta’ya, sizin kendi ödeme yönteminizle ödenir; aradan geçmez. Bizim aldığımız bedel yönetim hizmeti karşılığıdır ve ayrı faturalanır. Böylece platforma ne ödediğinizi kuruşuna kadar kendi hesabınızdan görürsünüz.',
    },
    {
      q: 'Satış garantisi veriyor musunuz?',
      a: 'Hayır. Sonucu belirleyen şey yalnızca reklam değil; fiyatınız, ürününüz, açılış sayfanız ve rakiplerin o dönemki teklifi de sonuca giriyor. Garanti ettiğimiz şey yöntemdir: ölçümün doğru kurulması, düzenli optimizasyon ve her ay ne yapıldığının şeffaf raporlanması.',
    },
    {
      q: 'Reklam hesabı kimin adına açılıyor?',
      a: 'Sizin adınıza. Hesabın sahibi siz olursunuz, biz yönetici olarak eklenir ve çalışma bittiğinde erişimimiz kaldırılır. Geçmiş veriler, kampanya yapısı ve öğrenme birikimi sizde kalır; başka bir ekiple devam etmek isterseniz sıfırdan başlamazsınız.',
    },
    {
      q: 'Ne kadar bütçe gerekiyor?',
      a: 'Bu sektöre ve tıklama maliyetine göre değişiyor. Kritik olan, veri toplamaya yetecek bir bütçeyle başlamak: çok düşük bütçede kampanya öğrenme aşamasını tamamlayamaz ve sonuçlar yorumlanamaz. Kapsam görüşmesinde sektörünüz için gerçekçi bir alt sınır konuşuyoruz.',
    },
    {
      q: 'Ne kadar sürede sonuç görürüm?',
      a: 'İlk tıklamalar yayın günü gelir ama anlamlı bir yorum için kampanyanın öğrenme dönemini tamamlaması gerekir; bu genellikle birkaç haftadır. O döneme kadar erken müdahale etmemek, uzun vadede daha iyi sonuç veriyor.',
    },
  ],
  ctaHeading: 'Hesabınıza birlikte bakalım',
  ctaText: 'Mevcut hesabınız varsa ölçüm kurulumunu ve harcama dağılımını inceleyip somut bulguları paylaşıyoruz. Yoksa sıfırdan kurulum planını çıkarıyoruz. Görüşme bağlayıcı değil.',
  landing: {
    meta: {
      title: 'Reklam Yönetimi Teklifi Alın — Kodara Digital',
      description: 'Google Ads ve Meta reklam yönetimi için teklif alın. Önce dönüşüm takibi kurulur, hesap sizin adınıza açılır, her ay şeffaf rapor verilir. 1 iş günü içinde dönüş.',
    },
    h1: 'Reklam yönetimi teklifinizi 1 iş günü içinde alın',
    promise: 'Önce dönüşüm takibini kurup doğruluyor, sonra bütçeyi devreye alıyoruz. Reklam hesabı sizin adınıza açılıyor ve her ay ne harcandığını, karşılığında ne geldiğini yazılı olarak paylaşıyoruz.',
    benefits: [
      {
        title: 'Önce ölçüm, sonra bütçe',
        desc: 'takip doğrulanmadan kampanya açılmaz',
      },
      {
        title: 'Google ve Meta birlikte',
        desc: 'iki platform tek hedef etrafında planlanır',
      },
      {
        title: 'A/B testiyle karar',
        desc: 'kazanan varyant veriyle seçilir, tahminle değil',
      },
      {
        title: 'Aylık şeffaf rapor',
        desc: 'harcama, dönüşüm ve maliyet yan yana',
      },
    ],
    trustHeading: 'Çalışma biçimimiz',
    trust: [
      {
        title: 'Hesap sizin mülkiyetinizde',
        desc: 'Reklam hesabı sizin adınıza açılır, biz yönetici olarak ekleniriz. Çalışma bitince erişimimiz kaldırılır, veriler sizde kalır.',
      },
      {
        title: 'Bütçe doğrudan platforma',
        desc: 'Reklam bütçesi hizmet bedelinden ayrıdır ve doğrudan Google ile Meta’ya ödenir. Aradan geçmez.',
      },
      {
        title: 'Satış garantisi vermiyoruz',
        desc: 'Sonucu fiyatınız, ürününüz ve rakipler de belirliyor. Taahhüdümüz doğru kurulum, düzenli optimizasyon ve şeffaf rapor.',
      },
    ],
    faq: [
      {
        q: 'Reklam bütçesi hizmet bedeline dâhil mi?',
        a: 'Hayır. Reklam bütçesi doğrudan Google ve Meta’ya, sizin kendi ödeme yönteminizle ödenir. Bizim aldığımız bedel yalnızca yönetim hizmeti karşılığıdır ve ayrı faturalanır.',
      },
      {
        q: 'Fiyat neye göre belirleniyor?',
        a: 'Yönetilecek platform sayısı, kampanya ve ürün çeşitliliği, ölçüm kurulumunun sıfırdan mı yapılacağı ve aylık üretilecek reklam varyantı sayısı belirleyicidir. Kurulum tek seferlik, yönetim ise sabit aylık bedeldir.',
      },
      {
        q: 'Mevcut hesabımı devralabilir misiniz?',
        a: 'Evet. Önce ölçüm kurulumunu ve harcama dağılımını inceleyip bulguları paylaşıyoruz. Geçmiş veri ve öğrenme birikimi değerlidir; mümkün olduğunca sıfırlamadan üzerine çalışıyoruz.',
      },
      {
        q: 'Ne kadar sürede başlayabiliyorsunuz?',
        a: 'Hesap erişimleri ve ölçüm kurulumu tamamlandıktan sonra genellikle bir hafta içinde yayına çıkıyoruz. Sitede etiket kurulumu gerekiyorsa süre buna göre planlanıyor.',
      },
    ],
    ctaHeading: 'Reklam yönetimi teklifi alın',
    ctaText: 'Bilgilerinizi bırakın, hedefinizi ve mevcut durumu konuşup 1 iş günü içinde teklifinizi gönderelim.',
    submitLabel: 'Teklif Al',
    closeHeading: 'Ölçüm kurulmadan geçen her ay veri kaybı',
    closeText: 'Takip kurulu olmadan harcanan bütçe geriye dönük olarak yorumlanamıyor. Kurulumu bugün yapmak, gelecek ayların kararlarını da sağlam bir zemine oturtuyor.',
  },
};

export default reklamYonetimi;
