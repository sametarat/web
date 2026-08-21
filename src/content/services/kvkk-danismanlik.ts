/**
 * KVKK Danışmanlığı hizmet içeriği.
 * Bu tek dosya iki sayfayı birden besler:
 *   /kvkk-danismanlik/          → kurumsal hizmet sayfası
 *   /kvkk-danismanlik/teklif/   → reklam trafiği için odaklı açılış sayfası
 * Metni değiştirmek için sadece bu dosyayı düzenlemek yeterlidir.
 */
import type { ServiceContent } from './types';

const kvkkDanismanlik: ServiceContent = {
  slug: 'kvkk-danismanlik',
  navLabel: 'KVKK Danışmanlığı',
  picker: 'KVKK uyum süreci',
  icon: 'scale',
  card: {
    title: 'KVKK Danışmanlığı',
    desc: '6698 sayılı Kanuna uyum için veri envanteri, VERBİS kaydı, aydınlatma ve açık rıza metinleri, saklama ve imha politikası ile başvuru sürecinin kurulması.',
  },
  meta: {
    title: 'KVKK Danışmanlığı ve Uyum Süreci — Kodara Digital',
    description: '6698 sayılı Kişisel Verilerin Korunması Kanunu uyum danışmanlığı: veri envanteri, VERBİS kaydı, aydınlatma ve açık rıza metinleri, saklama ve imha politikası, ilgili kişi başvuru süreci ve çalışan eğitimi.',
  },
  hero: {
    eyebrow: 'KVKK · 6698 sayılı Kanun',
    h1: 'KVKK uyumunu evrak yığını olmaktan çıkaralım',
    lead: 'Uyum, klasöre konan bir dosya değil; işleyen bir süreçtir. Veri envanterinden VERBİS kaydına, aydınlatma metinlerinden ilgili kişi başvurularına kadar tüm zinciri kurup ekibinize devrediyoruz.',
    bullets: [
      'Veri envanteri ve kişisel veri işleme faaliyet kaydının çıkarılması',
      'VERBİS kaydı, kayıt güncellemesi ve yükümlülük takvimi',
      'Aydınlatma metni, açık rıza metni ve saklama ile imha politikası',
      'Teknik ve idari tedbirlerin (md. 12) gözden geçirilmesi ve eksik listesi',
    ],
  },
  summaryTitle: 'Teslim aldığınız çıktılar',
  summaryText: 'Süreç sonunda elinizde denetlenebilir belgeler ve bunları kimin, hangi sıklıkla güncelleyeceğini gösteren bir plan olur.',
  deliverables: [
    'Veri envanteri ve kişisel veri işleme faaliyet kaydı',
    'Aydınlatma metinleri, açık rıza metinleri ve veri aktarım belgeleri',
    'Kişisel veri saklama ve imha politikası ile imha takvimi',
    'Teknik ve idari tedbir boşluk raporu ve önceliklendirilmiş aksiyon planı',
  ],
  intro: {
    heading: 'Uyum bir belge değil, sürdürülen bir süreçtir',
    paragraphs: [
      '6698 sayılı Kişisel Verilerin Korunması Kanunu, veri sorumlusuna somut yükümlülükler getiriyor: işlediği veriyi bilmek, ilgili kişiyi aydınlatmak, gerekli hâllerde açık rıza almak, veriyi süresi dolduğunda imha etmek ve md. 12 kapsamında teknik ve idari tedbirleri almak. Bu yükümlülüklerin karşılığı tek bir sözleşme metni değil, birbirine bağlı bir dizi kayıt ve süreçtir.',
      'Çalışmaya her zaman veri envanteriyle başlıyoruz. Hangi veri, hangi amaçla, hangi hukuki sebeple işleniyor; nereye aktarılıyor, ne kadar saklanıyor, kim erişiyor. Envanter çıkmadan yazılan aydınlatma metni gerçeği anlatmaz; VERBİS kaydı da doğru olmaz. Sıralamayı bu yüzden bozmuyoruz.',
      'Açık konuşalım: KVKK uyumu bir kerelik proje değildir. Yeni bir yazılım, yeni bir tedarikçi, yeni bir form ya da yeni bir işe alım süreci envanteri değiştirir. Bu nedenle iş, size bir klasör bırakmakla değil, güncellemeyi kimin ne zaman yapacağını gösteren bir düzen kurmakla bitiyor. Kanun idari para cezaları öngörüyor; ancak korkutmak yerine, denetlenebilir bir düzenin nasıl kurulacağını anlatmayı tercih ediyoruz.',
    ],
  },
  offerHeading: 'Çalışma kapsamı',
  offer: [
    {
      title: 'Veri envanteri ve faaliyet kaydı',
      desc: 'Departman görüşmeleriyle işlenen kişisel veriler, işleme amaçları, hukuki sebepler, alıcı grupları, saklama süreleri ve aktarımlar çıkarılır; kişisel veri işleme faaliyet kaydı oluşturulur.',
    },
    {
      title: 'VERBİS kaydı ve güncellemesi',
      desc: 'Kayıt yükümlülüğünüzün bulunup bulunmadığı değerlendirilir; yükümlülük varsa VERBİS kaydı envanterle uyumlu şekilde yapılır, mevcut kayıtlar gözden geçirilip güncellenir.',
    },
    {
      title: 'Aydınlatma ve açık rıza metinleri',
      desc: 'Müşteri, çalışan, aday, ziyaretçi ve tedarikçi gibi ilgili kişi gruplarına göre ayrı aydınlatma metinleri hazırlanır. Açık rıza yalnızca gerçekten gereken yerlerde, ayrı ve seçimlik biçimde kurgulanır.',
    },
    {
      title: 'Saklama ve imha politikası',
      desc: 'Her veri kategorisi için saklama süresi ve imha yöntemi belirlenir; periyodik imha takvimi ve imha tutanağı düzeni kurulur, sorumlular yazılı olarak atanır.',
    },
    {
      title: 'İlgili kişi başvuru süreci',
      desc: 'Başvuruların hangi kanaldan alınacağı, kimin değerlendireceği ve kanuni süre içinde nasıl yanıtlanacağı tanımlanır; başvuru formu, kayıt defteri ve yanıt şablonları teslim edilir.',
    },
    {
      title: 'Teknik ve idari tedbirler ile eğitim',
      desc: 'Md. 12 kapsamındaki erişim yetkileri, yedekleme, loglama, gizlilik taahhütnameleri ve veri işleyen sözleşmeleri gözden geçirilir; çalışanlara farkındalık eğitimi verilir.',
    },
  ],
  processHeading: 'Envanterden sürdürülebilir düzene',
  process: [
    {
      title: 'Mevcut durum analizi',
      desc: 'Departman görüşmeleri yapılır, kullanılan sistemler ve formlar incelenir, hangi belgelerin var olduğu ve hangilerinin eksik olduğu çıkarılır.',
    },
    {
      title: 'Envanter ve belge üretimi',
      desc: 'Veri envanteri ve faaliyet kaydı hazırlanır; aydınlatma, açık rıza, saklama ve imha politikası ile sözleşme ekleri bu envantere dayanarak yazılır.',
    },
    {
      title: 'Uygulamaya geçiş',
      desc: 'VERBİS kaydı yapılır veya güncellenir, metinler web sitesi ve formlara yerleştirilir, başvuru kanalı açılır, çalışan eğitimi verilir.',
    },
    {
      title: 'Sürdürme ve gözden geçirme',
      desc: 'Güncelleme sorumluları ve periyodik gözden geçirme takvimi belirlenir; değişiklik olduğunda envanterin nasıl güncelleneceği yazılı olarak devredilir.',
    },
  ],
  audienceHeading: 'Bu hizmet kimler için',
  audience: [
    {
      title: 'Müşteri verisi işleyen şirketler',
      desc: 'E-ticaret, üyelik sistemi, çağrı merkezi ya da randevu akışı olan; iletişim ve sipariş verisi tutan kurumlar.',
    },
    {
      title: 'İnsan kaynakları yükü ağır kurumlar',
      desc: 'Çok sayıda çalışan ve aday özgeçmişi işleyen, özlük dosyası ve kamera kaydı tutan işverenler.',
    },
    {
      title: 'Denetim ve ihale hazırlığındakiler',
      desc: 'Kurumsal müşteri sözleşmesi, tedarikçi değerlendirmesi ya da ISO/IEC 27001 süreci nedeniyle uyum kanıtı istenen firmalar.',
    },
    {
      title: 'Kayıtları eskimiş kurumlar',
      desc: 'Yıllar önce metin aldırmış, ancak envanteri, VERBİS kaydı ve imha süreci güncel olmayan şirketler.',
    },
  ],
  faq: [
    {
      q: 'KVKK uyum çalışması ne kadar sürer?',
      a: 'Süreyi belirleyen şey departman sayısı ve kullanılan sistemlerin çeşitliliğidir. Küçük ölçekli bir şirkette envanter ve belge seti birkaç hafta içinde tamamlanabilir; çok lokasyonlu yapılarda görüşmeler daha uzun sürer. Kapsam görüşmesinden sonra size tarihli bir plan veriyoruz.',
    },
    {
      q: 'Ceza almayacağımızın garantisini veriyor musunuz?',
      a: 'Hayır, böyle bir garanti kimse veremez. Denetim ve yaptırım yetkisi Kuruldadır ve sonucu kurumun fiilî uygulamasına bağlıdır. Bizim taahhüdümüz, yükümlülükleri eksiksiz çıkarmak, belgeleri gerçeği yansıtacak şekilde hazırlamak ve eksikleri önceliklendirilmiş bir listeyle önünüze koymaktır.',
    },
    {
      q: 'Avukatlık hizmeti veriyor musunuz?',
      a: 'Hayır. Hukuki temsil, dava takibi ve avukatlık hizmeti vermiyoruz; sunduğumuz şey uyum danışmanlığıdır. İhtilaflı ya da yorum gerektiren konularda kurumunuzun hukuk danışmanıyla birlikte çalışır, gerekirse sizi bir hukukçuya yönlendiririz.',
    },
    {
      q: 'VERBİS kaydı yaptırmak zorunda mıyız?',
      a: 'Kayıt yükümlülüğü her kurum için otomatik doğmaz; çalışan sayısı, yıllık mali bilanço ve faaliyet konusu gibi ölçütlere göre değerlendirilir. İlk adımda sizin durumunuzu değerlendiriyoruz. Yükümlülük varsa kaydı envanterinizle tutarlı biçimde yapıyor, veri kategorileriniz değiştikçe güncelliyoruz.',
    },
    {
      q: 'Çalışma bittikten sonra ne oluyor?',
      a: 'Uyum sürdürülen bir süreç olduğu için iş belge teslimiyle bitmiyor. Hangi belgenin ne zaman gözden geçirileceğini gösteren bir takvim ve sorumlu ataması bırakıyoruz. Yeni bir sistem, tedarikçi ya da veri kategorisi eklendiğinde envanteri birlikte güncelleyebileceğiniz bir destek düzeni kurulabiliyor.',
    },
  ],
  ctaHeading: 'Mevcut durumunuzu birlikte görelim',
  ctaText: 'İlk görüşmede hangi belgelerin var olduğunu, hangilerinin eksik olduğunu ve VERBİS yükümlülüğünüzün bulunup bulunmadığını konuşuyoruz. Görüşme bağlayıcı değil; sonunda elinizde yazılı bir kapsam ve sabit fiyat oluyor.',
  landing: {
    meta: {
      title: 'KVKK Danışmanlığı Teklifi Alın — Kodara Digital',
      description: 'KVKK uyum danışmanlığı için teklif alın: veri envanteri, VERBİS kaydı, aydınlatma ve açık rıza metinleri, saklama ve imha politikası, çalışan eğitimi. 1 iş günü içinde dönüş.',
    },
    h1: 'KVKK uyum teklifinizi 1 iş günü içinde alın',
    promise: 'Kapsamı birlikte belirliyoruz, fiyatı sabitliyoruz. Envanterden VERBİS kaydına ve başvuru sürecine kadar tüm zinciri kurup, güncellemeyi kimin yapacağını yazılı olarak devrediyoruz.',
    benefits: [
      {
        title: 'Envanterle başlayan çalışma',
        desc: 'hazır şablon değil, sizin veri akışınıza göre yazılan metinler',
      },
      {
        title: 'Sabit kapsam ve fiyat',
        desc: 'kapsam imzalandıktan sonra rakam değişmez',
      },
      {
        title: 'Uygulamaya kadar takip',
        desc: 'metinler formlara ve siteye yerleşene dek süreç bırakılmaz',
      },
      {
        title: 'Devredilebilir düzen',
        desc: 'güncelleme takvimi ve sorumlu ataması sizde kalır',
      },
    ],
    trustHeading: 'Çalışma nasıl yürütülüyor',
    trust: [
      {
        title: 'Süreç boyunca tek muhatap',
        desc: 'Görüşmeleri, belgeleri ve VERBİS adımlarını aynı danışman yürütür; her aşamada kime soracağınız bellidir.',
      },
      {
        title: 'Tüm evrak kurumunuza teslim',
        desc: 'Envanter, politikalar ve metinler düzenlenebilir dosya olarak size verilir; hiçbir belge bizde kilitli kalmaz.',
      },
      {
        title: 'Hukuki temsil vaadi yok',
        desc: 'Avukatlık hizmeti vermiyoruz. Yorum gerektiren konularda kurumunuzun hukuk danışmanıyla birlikte çalışıyoruz.',
      },
    ],
    faq: [
      {
        q: 'Fiyat neye göre belirleniyor?',
        a: 'Departman sayısı, çalışan sayısı, kullanılan yazılım ve form sayısı ile aktarım yapılan tedarikçi sayısı belirleyicidir. Kapsam görüşmesinden sonra fiyat sabitlenir ve iş bitene kadar değişmez.',
      },
      {
        q: 'Hazır şablon metin mi veriyorsunuz?',
        a: 'Hayır. Aydınlatma ve açık rıza metinleri, çıkardığımız veri envanterine dayanarak yazılır. İnternetten alınan genel bir metin sizin gerçek işleme faaliyetinizi anlatmadığı için denetimde işinize yaramaz.',
      },
      {
        q: 'Çalışanlarımıza eğitim veriliyor mu?',
        a: 'Evet. Belgeler hazırlandıktan sonra ilgili ekiplere farkındalık eğitimi veriyoruz. Eğitim; veri sorumlusu ve veri işleyen ayrımı, aydınlatma yükümlülüğü, ilgili kişi başvurusu ve günlük iş akışındaki pratik kuralları kapsar.',
      },
      {
        q: 'Ne kadar sürede başlayabiliyorsunuz?',
        a: 'Kapsam netleştikten sonra genellikle bir hafta içinde ilk departman görüşmelerine başlıyoruz. Denetim ya da sözleşme takvimi baskısı olan kurumlar için sıralama önceliklendirilebiliyor.',
      },
    ],
    ctaHeading: 'KVKK danışmanlık teklifi alın',
    ctaText: 'Bilgilerinizi bırakın, mevcut durumunuzu konuşup 1 iş günü içinde sabit fiyat teklifinizi gönderelim.',
    submitLabel: 'Teklif Al',
    closeHeading: 'Uyum, başvuru geldiğinde başlatılamaz',
    closeText: 'Bir ilgili kişi başvurusu ya da müşteri denetimi geldiğinde envanteri sıfırdan çıkarmaya vakit kalmıyor. Çalışmayı sakin bir dönemde yürütmek, hem maliyeti hem de riski düşürüyor.',
  },
};

export default kvkkDanismanlik;
