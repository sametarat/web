/**
 * SEO hizmet içeriği.
 * Bu tek dosya iki sayfayı birden besler:
 *   /seo/          → kurumsal hizmet sayfası
 *   /seo/teklif/   → reklam trafiği için odaklı açılış sayfası
 * Metni değiştirmek için sadece bu dosyayı düzenlemek yeterlidir.
 */
import type { ServiceContent } from './types';

const seo: ServiceContent = {
  slug: 'seo',
  navLabel: 'SEO',
  picker: 'Google’da üst sıralara çıkmak (SEO)',
  icon: 'search',
  card: {
    title: 'SEO',
    desc: 'Teknik SEO, içerik stratejisi, yerel SEO ve backlink çalışması. Sıralama sözü değil, ne yapıldığını ve neyin değiştiğini gösteren aylık şeffaf rapor.',
  },
  meta: {
    title: 'SEO Hizmeti — Arama Motoru Optimizasyonu — Kodara Digital',
    description: 'Teknik SEO, içerik stratejisi, yerel SEO ve rakip analizi. Sıralama garantisi vermiyoruz; yapılan işi ve ölçülen değişimi gösteren aylık şeffaf raporla çalışıyoruz.',
  },
  hero: {
    eyebrow: 'SEO · Arama Motoru Optimizasyonu',
    h1: 'SEO sihir değil, ölçülebilir bir iş',
    lead: 'Arama sonuçlarındaki yerinizi belirleyen şey şans değil; sitenizin teknik durumu, içeriğinizin sorulara verdiği cevap ve size verilen dış bağlantılar. Üçünü de tek tek ölçüyor, tek tek düzeltiyoruz.',
    bullets: [
      'Önce teknik denetim: taranabilirlik, hız, yapı ve dizine ekleme sorunları',
      'İçerik, anahtar kelime listesi değil arama niyeti üzerine kuruluyor',
      'Yerel işletmeler için Google İşletme Profili ayrı bir başlık olarak ele alınıyor',
      'İlk sıra garantisi vermiyoruz; neden veremeyeceğimizi de açıkça anlatıyoruz',
    ],
  },
  summaryTitle: 'Teslim aldığınız çıktılar',
  summaryText: 'Her ay ne yapıldığını, neyin ölçüldüğünü ve bir sonraki ay ne yapılacağını yazılı olarak görüyorsunuz. Rapor, süslü grafiklerden değil kararı etkileyecek verilerden oluşuyor.',
  deliverables: [
    'Teknik SEO denetim raporu — bulgular öncelik sırasına dizilmiş hâlde',
    'Anahtar kelime ve rakip analizi — arama niyetine göre gruplanmış',
    'İçerik planı — hangi sayfa, hangi soruya, hangi ay cevap verecek',
    'Aylık performans raporu — yapılan işler, ölçülen değişim, sonraki adımlar',
  ],
  intro: {
    heading: 'Size garanti veren herkes ya yanılıyor ya yanıltıyor',
    paragraphs: [
      'SEO teklifleri arasında en dikkat çekeni genellikle sıralama garantisi verendir. Oysa sıralamayı belirleyen algoritma bize ait değil; sürekli güncelleniyor ve aynı sonuç sayfasında rakipleriniz de çalışıyor. Kimse kontrol etmediği bir sistemin çıktısını taahhüt edemez. Bunu söyleyen ya işi bilmiyordur ya da bildiği hâlde söylüyordur.',
      'Garanti edilebilecek şey yöntemdir. Sitenizin teknik hatalarının kapatılacağını, içeriğin arama niyetine göre yazılacağını, bağlantı çalışmasının kurallara uygun yürütüleceğini ve her ay ne yapıldığının rapor edileceğini taahhüt edebiliriz. Bunlar bizim kontrolümüzde olan şeyler ve sonucun büyük kısmını da bunlar belirliyor.',
      'İkinci bir dürüstlük noktası da süre. SEO’da ilk anlamlı hareket genellikle birkaç ay sonra görünür; rekabetin yüksek olduğu alanlarda daha da geç. Hemen sonuç isteyen bir işletmenin bütçesini reklama ayırıp SEO’yu paralel yürütmesi çoğu zaman daha doğru olur. Bunu ilk görüşmede söylüyoruz, altı ay sonra değil.',
    ],
  },
  offerHeading: 'Çalışma alanları',
  offer: [
    {
      title: 'Teknik SEO',
      desc: 'Tarama ve dizine ekleme sorunları, site yapısı, sayfa hızı ve Core Web Vitals, yapılandırılmış veri, yönlendirme ve kopya içerik hataları. Diğer her şeyin üzerine kurulduğu temel katman.',
    },
    {
      title: 'İçerik stratejisi',
      desc: 'Arama niyetine göre gruplanmış konu haritası. Hangi sayfanın hangi soruya cevap vereceği, hangi içeriğin birleştirileceği ve hangisinin yeniden yazılacağı planlanır.',
    },
    {
      title: 'Yerel SEO',
      desc: 'Google İşletme Profili kurulumu ve düzenli güncellenmesi, kategori ve hizmet alanı ayarları, yorum yönetimi, harita ve rehber kayıtlarında bilgi tutarlılığı.',
    },
    {
      title: 'Rakip analizi',
      desc: 'Sizinle aynı sonuç sayfasında çıkan siteler; hangi içerikle, hangi yapıyla ve hangi bağlantılarla oradalar. Kopyalamak için değil, aradaki farkı ölçmek için.',
    },
    {
      title: 'Backlink çalışması',
      desc: 'Sektörünüzle gerçekten ilgili kaynaklardan bağlantı kazanımı. Satın alınan toplu bağlantı paketleri kullanılmaz; kısa vadede işe yarar görünse de ceza riski taşır.',
    },
    {
      title: 'Aylık raporlama',
      desc: 'Yapılan işler, sıralama ve trafik değişimi, dönüşüm tarafındaki hareket ve bir sonraki ayın planı. Rapor, ne yaptığımızı savunmak için değil karar almanız için yazılır.',
    },
  ],
  processHeading: 'Denetimden aylık döngüye',
  process: [
    {
      title: 'Denetim',
      desc: 'Teknik durum, mevcut içerik, bağlantı profili ve rakipler incelenir. Bulgular öncelik sırasına dizilir.',
    },
    {
      title: 'Yol haritası',
      desc: 'Hangi işin hangi ay yapılacağı yazılı hâle gelir. Beklenen etki ve gereken süre baştan konuşulur.',
    },
    {
      title: 'Uygulama',
      desc: 'Teknik düzeltmeler, içerik üretimi ve bağlantı çalışması aylık döngü hâlinde yürütülür.',
    },
    {
      title: 'Ölçüm ve rapor',
      desc: 'Her ay ne yapıldığı ve neyin değiştiği raporlanır; plan gerçek verilere göre güncellenir.',
    },
  ],
  audienceHeading: 'Bu hizmet kimler için',
  audience: [
    {
      title: 'Reklam bütçesi eriyen firmalar',
      desc: 'Her tıklamaya ödeme yapmak yerine kalıcı bir organik trafik kaynağı kurmak isteyenler.',
    },
    {
      title: 'Yerel hizmet işletmeleri',
      desc: 'Klinik, servis, danışmanlık, restoran gibi çevresinden müşteri bulan ve haritada görünmesi gereken işler.',
    },
    {
      title: 'E-ticaret siteleri',
      desc: 'Ürün ve kategori sayfaları arama sonuçlarında görünmeyen, teknik yapısı büyüdükçe karışan mağazalar.',
    },
    {
      title: 'İçerik üreten ekipler',
      desc: 'Blog yazan ama yazılarının hiçbiri sonuç sayfasında karşılık bulmayan pazarlama ekipleri.',
    },
  ],
  faq: [
    {
      q: 'İlk sırayı garanti ediyor musunuz?',
      a: 'Hayır ve eden kimseye de inanmamanızı öneririz. Sıralamayı belirleyen algoritma bize ait değil, sürekli güncelleniyor ve aynı sayfada rakipleriniz de çalışıyor. Garanti edebileceğimiz şey yöntemdir: teknik hataların kapatılması, arama niyetine uygun içerik ve her ay ne yapıldığının raporlanması.',
    },
    {
      q: 'Sonuç ne kadar sürede gelir?',
      a: 'Teknik düzeltmelerin etkisi görece hızlı, genellikle birkaç hafta içinde görülebilir. İçerik ve bağlantı çalışmasının karşılığı ise aylarla ölçülür; rekabetin yoğun olduğu alanlarda daha da uzar. İlk aylarda sıralamadan önce tarama, dizine ekleme ve tıklama oranı gibi öncü göstergelere bakarız.',
    },
    {
      q: 'Fiyat neye göre belirleniyor?',
      a: 'Site büyüklüğü, teknik borcun derinliği, hedeflenen anahtar kelimelerin rekabet düzeyi ve aylık üretilecek içerik miktarı belirleyicidir. Denetim tek seferlik bir kalem olarak, aylık çalışma ise sabit bir aylık bedel olarak fiyatlanır. Kapsam yazılıdır, ay içinde sürpriz kalem çıkmaz.',
    },
    {
      q: 'Çalışma biterse kazanımlar kaybolur mu?',
      a: 'Yapılan teknik düzeltmeler ve yayımlanan içerikler sitenizde kalır; bunlar sizin varlığınız. Ancak rakipleriniz çalışmaya devam edeceği için zamanla konum kaybı olabilir. Sözleşme bittiğinde tüm hesap erişimleri, raporlar ve yol haritası size devredilir.',
    },
    {
      q: 'Site içeriğine siz mi müdahale ediyorsunuz?',
      a: 'Erişim verirseniz düzeltmeleri biz uygularız; vermezseniz yapılacakları maddeler hâlinde yazıp ekibinize iletiriz. Yayımlanacak her içerik önce onayınıza sunulur. Sizin haberiniz olmadan sitede değişiklik yapılmaz.',
    },
  ],
  ctaHeading: 'Ücretsiz bir ön denetimle başlayalım',
  ctaText: 'Sitenizin mevcut durumuna bakıp en kritik birkaç sorunu ve gerçekçi bir zaman ölçeğini konuşalım. Görüşme bağlayıcı değil; sonunda elinizde yazılı bir kapsam ve sabit aylık fiyat oluyor.',
  landing: {
    meta: {
      title: 'SEO Teklifi Alın — Kodara Digital',
      description: 'Teknik SEO, içerik stratejisi ve yerel SEO için teklif alın. Sıralama garantisi yok; yazılı yol haritası, aylık şeffaf rapor ve hesap devri var. 1 iş günü içinde dönüş.',
    },
    h1: 'SEO teklifinizi 1 iş günü içinde alın',
    promise: 'Sitenizin mevcut durumunu inceliyor, en kritik sorunları ve gerçekçi bir takvimi yazılı olarak paylaşıyoruz. Sıralama sözü vermiyoruz; ne yapacağımızı ve her ay ne yaptığımızı taahhüt ediyoruz.',
    benefits: [
      {
        title: 'Teknik denetimle başlar',
        desc: 'içerikten önce temeli düzeltiriz',
      },
      {
        title: 'Arama niyetine göre içerik',
        desc: 'kelime doldurma değil, cevap verme',
      },
      {
        title: 'Yerel SEO dâhil',
        desc: 'Google İşletme Profili ayrı bir başlık',
      },
      {
        title: 'Aylık şeffaf rapor',
        desc: 'yapılan iş ve ölçülen değişim yan yana',
      },
    ],
    trustHeading: 'Çalışma biçimimiz',
    trust: [
      {
        title: 'Sıralama garantisi vermiyoruz',
        desc: 'Algoritma bizim kontrolümüzde değil. Garanti ettiğimiz şey yöntem: yazılı yol haritası ve her ay raporlanan iş.',
      },
      {
        title: 'Aylık şeffaf rapor',
        desc: 'Her ay yapılan işler, ölçülen değişim ve sonraki adımlar yazılı olarak paylaşılır.',
      },
      {
        title: 'Hesaplar sizin mülkiyetinizde',
        desc: 'Analitik, arama konsolu ve işletme profili sizin adınıza açılır; sözleşme bitince erişimler eksiksiz devredilir.',
      },
    ],
    faq: [
      {
        q: 'İlk sırayı garanti ediyor musunuz?',
        a: 'Hayır. Sıralamayı belirleyen algoritma bize ait değil ve rakipleriniz de aynı anda çalışıyor; kimse kontrol etmediği bir sonucu taahhüt edemez. Garanti ettiğimiz şey yöntem ve raporlama: ne yapacağımız baştan yazılır, her ay ne yaptığımız gösterilir.',
      },
      {
        q: 'Sonuç ne kadar sürede gelir?',
        a: 'Teknik düzeltmelerin etkisi birkaç hafta içinde görülebilir. İçerik ve bağlantı çalışmasının karşılığı aylarla ölçülür. Hızlı satış gerekiyorsa reklamla paralel yürütmeyi öneriyoruz ve bunu ilk görüşmede söylüyoruz.',
      },
      {
        q: 'Fiyat neye göre belirleniyor?',
        a: 'Site büyüklüğü, teknik borcun derinliği, hedef kelimelerin rekabeti ve aylık içerik miktarı belirleyicidir. Denetim tek seferlik, aylık çalışma sabit aylık bedeldir. Kapsam yazılıdır, ay içinde ek kalem çıkmaz.',
      },
      {
        q: 'Sözleşme bitince ne oluyor?',
        a: 'Yapılan düzeltmeler ve yayımlanan içerikler sitenizde kalır. Tüm hesap erişimleri, geçmiş raporlar ve güncel yol haritası size devredilir; devam etmek isterseniz başka bir ekip kaldığı yerden sürdürebilir.',
      },
    ],
    ctaHeading: 'SEO teklifi alın',
    ctaText: 'Bilgilerinizi bırakın, sitenize bakıp 1 iş günü içinde kapsam ve fiyat teklifinizi gönderelim.',
    submitLabel: 'Teklif Al',
    closeHeading: 'SEO’da geç başlamanın bedeli birikiyor',
    closeText: 'Bu iş zamanla değer kazandığı için başlangıcı ertelemek doğrudan maliyet demek. Bugün atılan teknik adımların karşılığını birkaç ay sonra alırsınız; ertelerseniz o saat yine sıfırdan işlemeye başlar.',
  },
};

export default seo;
