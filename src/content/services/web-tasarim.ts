/**
 * Web Tasarım hizmet içeriği.
 * Bu tek dosya iki sayfayı birden besler:
 *   /web-tasarim/          → kurumsal hizmet sayfası
 *   /web-tasarim/teklif/   → reklam trafiği için odaklı açılış sayfası
 * Metni değiştirmek için sadece bu dosyayı düzenlemek yeterlidir.
 */
import type { ServiceContent } from './types';

const webTasarim: ServiceContent = {
  slug: 'web-tasarim',
  navLabel: 'Web Tasarım',
  picker: 'Web sitesi tasarımı ve yenileme',
  icon: 'layout',
  card: {
    title: 'Web Tasarım',
    desc: 'Hazır tema değil, markanıza özel arayüz. Mobil öncelikli, hızlı ve teknik SEO altyapısı kurulmuş hâlde teslim edilen kurumsal site ve e-ticaret projeleri.',
  },
  meta: {
    title: 'Web Tasarım ve Web Sitesi Yenileme — Kodara Digital',
    description: 'Kurumsal web sitesi, e-ticaret ve açılış sayfası tasarımı. Hazır tema kullanılmaz; markaya özel, mobil öncelikli ve hızlı bir site, teknik SEO kurulumu ve kaynak kod devriyle teslim edilir.',
  },
  hero: {
    eyebrow: 'Web Tasarım · Geliştirme',
    h1: 'Siteniz bir broşür değil, satış aracı olsun',
    lead: 'Çoğu şirket sitesi yavaş açılıyor, telefonda bozuk görünüyor ve içeriği güncellemek için her seferinde birine sormak gerekiyor. Biz siteyi bu üç sorunun üçünü de kapatacak şekilde kuruyoruz.',
    bullets: [
      'Hazır tema yok; tasarım markanızın kendi diline göre çiziliyor',
      'Mobil öncelikli kurgu — trafiğin çoğunluğu telefondan geliyor',
      'Hız ve Core Web Vitals ölçülerek teslim ediliyor, tahminle değil',
      'Kaynak kod, alan adı ve hosting hesapları sizin mülkiyetinizde kalıyor',
    ],
  },
  summaryTitle: 'Teslim aldığınız çıktılar',
  summaryText: 'Proje bittiğinde elinizde çalışan bir site ve onu kendi başınıza yönetebileceğiniz her şey oluyor. Bize bağlı kalmanız gereken hiçbir nokta bırakmıyoruz.',
  deliverables: [
    'Markaya özel tasarım — sayfa şablonları, tipografi ve bileşen seti',
    'Kaynak kodun devri — depo erişimi, hosting ve alan adı hesapları sizde',
    'Yönetim paneli eğitimi — ekran kaydı ve kısa bir kullanım rehberi',
    'Teknik SEO kurulumu — site haritası, etiketler, hız ve ölçüm ayarları',
  ],
  intro: {
    heading: 'Güzel görünen site ile işe yarayan site aynı şey değil',
    paragraphs: [
      'Bir siteye bakıp beğenmek kolaydır. Asıl soru şudur: ziyaretçi ne yapıyor? Teklif formunu dolduruyor mu, telefonu arıyor mu, sepete ürün ekliyor mu? Tasarımı bu sorulardan başlatmazsanız ortaya bakması hoş ama iş getirmeyen bir dijital broşür çıkar.',
      'Biz her sayfayı tek bir hedefle kuruyoruz. Ziyaretçinin ne aradığı, hangi bilgiden sonra ikna olduğu ve nerede iletişime geçtiği önceden konuşuluyor. Tasarım o akışın üzerine oturuyor; süsleme değil, yön verme işi yapıyor.',
      'Teknik taraf da aynı şekilde ölçülebilir. Hazır tema kullanmadığımız için sayfalar gereksiz kod taşımıyor; görseller optimize ediliyor, yükleme sırası ayarlanıyor ve teslimden önce hız değerleri ölçülüp size raporlanıyor. Site açıldığı gün Google’ın taraması için de hazır oluyor.',
    ],
  },
  offerHeading: 'Proje tipleri',
  offer: [
    {
      title: 'Kurumsal web sitesi',
      desc: 'Hizmet ve ürün sayfaları, referans ve ekip bölümleri, blog altyapısı ve iletişim akışı. Her sayfa arama motorunda tek bir konuya karşılık gelecek şekilde kurgulanıyor.',
    },
    {
      title: 'E-ticaret',
      desc: 'Ürün ve kategori yapısı, varyant yönetimi, sepet ve ödeme akışı, kargo entegrasyonu. Ürün sayfası şablonu, ürün sayısı büyüdüğünde bozulmayacak biçimde kuruluyor.',
    },
    {
      title: 'Tek sayfa açılış sayfası',
      desc: 'Reklam trafiği için tasarlanmış, tek bir eyleme odaklanan sayfa. Menü ve dikkat dağıtan bağlantılar yok; form ve dönüşüm takibi kurulu hâlde teslim ediliyor.',
    },
    {
      title: 'Mevcut sitenin yenilenmesi',
      desc: 'İçeriğiniz duruyor, kabuk değişiyor. Eski adresler yeni sayfalara yönlendiriliyor, böylece arama motorundaki mevcut konumunuzu kaybetmiyorsunuz.',
    },
    {
      title: 'İçerik yönetimi ve eğitim',
      desc: 'Sayfa, blog yazısı ve ürün eklemeyi kendi ekibinizin yapabileceği bir panel. Teslimde canlı eğitim yapılıyor ve tekrar izleyebileceğiniz ekran kaydı bırakılıyor.',
    },
    {
      title: 'Hız ve Core Web Vitals',
      desc: 'Yavaş açılan mevcut siteler için ölçüm, darboğaz tespiti ve iyileştirme. Görsel boyutları, yazı tipi yüklemesi, önbellek ve gereksiz betikler tek tek ele alınıyor.',
    },
  ],
  processHeading: 'Brifingten yayına',
  process: [
    {
      title: 'Brifing ve kapsam',
      desc: 'Hedef kitle, rakipler, sayfa listesi ve site haritası yazılı olarak netleşir. Kapsam imzalandıktan sonra fiyat sabitlenir.',
    },
    {
      title: 'Tasarım',
      desc: 'Önce ana sayfa ve bir iç sayfa çizilir. Yön onaylanmadan diğer sayfalara geçilmez; böylece revizyon en başta ve ucuza yapılır.',
    },
    {
      title: 'Geliştirme',
      desc: 'Kodlama boyunca haftalık canlı önizleme bağlantısı açılır. İlerlemeyi tahmin etmek yerine tarayıcıdan izlersiniz.',
    },
    {
      title: 'Yayın ve devir',
      desc: 'Hız ve mobil kontrolleri, teknik SEO kurulumu, panel eğitimi ve tüm hesapların size devri yapılır.',
    },
  ],
  audienceHeading: 'Bu hizmet kimler için',
  audience: [
    {
      title: 'Sitesi olmayan şirketler',
      desc: 'İşini referansla büyütmüş, dijitalde ilk ciddi adımını atacak KOBİ ve serbest çalışanlar.',
    },
    {
      title: 'Eski sitesinden memnun olmayanlar',
      desc: 'Mobilde bozulan, yavaş açılan ya da içeriğini kendi güncelleyemediği bir sitesi olanlar.',
    },
    {
      title: 'Reklam verecek işletmeler',
      desc: 'Google ya da Meta reklamı planlayan, tıklamayı karşılayacak düzgün bir açılış sayfası gereken firmalar.',
    },
    {
      title: 'Satışa geçen üreticiler',
      desc: 'Ürününü toptan satarken perakendeye açılmak isteyen ve e-ticaret altyapısı kuracak markalar.',
    },
  ],
  faq: [
    {
      q: 'Fiyat neye göre belirleniyor?',
      a: 'Sayfa sayısı, benzersiz tasarım gerektiren şablon sayısı, e-ticaret ya da entegrasyon ihtiyacı ve içeriğin kim tarafından hazırlanacağı belirleyicidir. Kapsam görüşmesinde bunlar yazılı hâle getirilir ve fiyat sabitlenir. Kapsam imzalandıktan sonra rakam değişmez; yeni bir istek çıkarsa ayrı olarak fiyatlanır ve onayınıza sunulur.',
    },
    {
      q: 'Ne kadar sürer?',
      a: 'Orta ölçekli bir kurumsal site tipik olarak brifingden yayına birkaç hafta sürer; e-ticaret projeleri daha uzundur. Süreyi en çok uzatan şey içeriktir: metin ve görseller gecikirse takvim de kayar. Bu yüzden içerik teslim tarihleri kapsam dokümanına yazılır.',
    },
    {
      q: 'İçerik ve görselleri kim hazırlıyor?',
      a: 'İkisi de mümkün. İçeriği siz veriyorsanız biz düzenleyip sayfa yapısına oturtuyoruz. Yazılmasını istiyorsanız metin yazımı kapsama ayrı bir kalem olarak ekleniyor. Görsellerde stok görsel kullanımı yerine kendi ürün ve mekân fotoğraflarınızı öneriyoruz; ziyaretçi farkı hemen anlıyor.',
    },
    {
      q: 'Site ve hesaplar kimde kalıyor?',
      a: 'Hepsi sizde. Alan adı ve hosting sizin adınıza açılıyor, kaynak kod teslimde devrediliyor. Bizimle çalışmayı bırakırsanız siteyi başka bir ekibe götürebilirsiniz; kilitli bir sistem bırakmıyoruz.',
    },
    {
      q: 'Teslimden sonra ne oluyor?',
      a: 'Yayın sonrası belirli bir süre boyunca ortaya çıkan hatalar ücretsiz düzeltilir; bu süre sözleşmede yazılıdır. Sonrasında güncelleme, yedekleme ve küçük geliştirmeler için isteğe bağlı bir bakım anlaşması yapılabilir. Bakım almamayı seçerseniz de site çalışmaya devam eder.',
    },
  ],
  ctaHeading: 'Kapsam görüşmesiyle başlayalım',
  ctaText: 'Hangi sayfaların olacağını, takvimi ve fiyatı tek bir görüşmede netleştiriyoruz. Görüşme bağlayıcı değil; sonunda elinizde yazılı bir kapsam dokümanı ve sabit fiyat oluyor.',
  landing: {
    meta: {
      title: 'Web Sitesi Teklifi Alın — Kodara Digital',
      description: 'Kurumsal web sitesi, e-ticaret ve açılış sayfası için teklif alın. Markaya özel tasarım, mobil öncelikli ve hızlı kurulum, kaynak kod devri. 1 iş günü içinde dönüş.',
    },
    h1: 'Web sitesi teklifinizi 1 iş günü içinde alın',
    promise: 'Kapsamı birlikte çıkarıyoruz, fiyatı sabitliyoruz. Hazır tema kullanmadan, mobil öncelikli ve hızlı bir site kuruyor; kaynak kodu ve tüm hesapları size devrederek teslim ediyoruz.',
    benefits: [
      {
        title: 'Markaya özel tasarım',
        desc: 'hazır tema değil, sıfırdan çizilen arayüz',
      },
      {
        title: 'Mobilde kusursuz',
        desc: 'tasarım telefon ekranından başlatılıyor',
      },
      {
        title: 'Hız ölçülerek teslim',
        desc: 'Core Web Vitals değerleri raporlanıyor',
      },
      {
        title: 'SEO altyapısı kurulu',
        desc: 'site açıldığı gün taranmaya hazır',
      },
    ],
    trustHeading: 'Çalışma biçimimiz',
    trust: [
      {
        title: 'Sabit fiyat',
        desc: 'Kapsam imzalandıktan sonra rakam değişmez. Yeni bir istek çıkarsa ayrıca fiyatlanır ve onayınız alınır.',
      },
      {
        title: 'Haftalık canlı önizleme',
        desc: 'Geliştirme boyunca açık bir önizleme bağlantısı olur. İlerlemeyi anlatımdan değil, ekrandan görürsünüz.',
      },
      {
        title: 'Kaynak kod ve hesaplar sizin',
        desc: 'Alan adı ve hosting sizin adınıza açılır, kod teslimde devredilir. Bize bağlı kalmazsınız.',
      },
    ],
    faq: [
      {
        q: 'Fiyat neye göre belirleniyor?',
        a: 'Sayfa sayısı, tasarlanacak farklı şablon sayısı, e-ticaret ve entegrasyon ihtiyacı ile içeriğin kim tarafından hazırlanacağı belirleyicidir. Kapsam görüşmesinden sonra fiyat sabitlenir ve iş bitene kadar değişmez.',
      },
      {
        q: 'Mevcut sitem var, sıralamamı kaybeder miyim?',
        a: 'Yenileme projelerinde eski adresler yeni sayfalara tek tek yönlendirilir ve mevcut içerik korunur. Amaç, arama motorundaki konumunuzu taşımak; sıfırlamak değil.',
      },
      {
        q: 'İçeriği kendim güncelleyebilir miyim?',
        a: 'Evet. Sayfa, blog yazısı ve ürün eklemeyi ekibinizin yapabileceği bir yönetim paneli kuruyoruz. Teslimde canlı eğitim yapılıyor ve tekrar izleyebileceğiniz bir ekran kaydı bırakılıyor.',
      },
      {
        q: 'Ne kadar sürede başlayabiliyorsunuz?',
        a: 'Kapsam ve içerik planı netleştikten sonra genellikle bir hafta içinde tasarıma başlıyoruz. Takvimi olan projelerde başlangıç tarihi kapsam dokümanına yazılıyor.',
      },
    ],
    ctaHeading: 'Web sitesi teklifi alın',
    ctaText: 'Bilgilerinizi bırakın, ihtiyacınızı konuşup 1 iş günü içinde sabit fiyat teklifinizi gönderelim.',
    submitLabel: 'Teklif Al',
    closeHeading: 'Reklama başlamadan önce siteyi hazırlayın',
    closeText: 'Yavaş ve mobilde bozuk bir siteye reklam trafiği göndermek bütçeyi eritir. Sırayı doğru kurmak, sonraki her adımın maliyetini düşürüyor.',
  },
};

export default webTasarim;
