/**
 * Marka & Patent hizmet içeriği.
 * Bu tek dosya iki sayfayı birden besler:
 *   /marka-patent-tescili/          → kurumsal hizmet sayfası
 *   /marka-patent-tescili/teklif/   → reklam trafiği için odaklı açılış sayfası
 * Metni değiştirmek için sadece bu dosyayı düzenlemek yeterlidir.
 */
import type { ServiceContent } from './types';

const markaPatentTescili: ServiceContent = {
  slug: 'marka-patent-tescili',
  navLabel: 'Marka & Patent',
  picker: 'Marka, patent ve tasarım tescili',
  icon: 'tag',
  card: {
    title: 'Marka & Patent Tescili',
    desc: 'TÜRKPATENT nezdinde marka tescili, patent ve faydalı model, tasarım tescili ve uluslararası marka başvurusu; ön araştırmadan tescil belgesine kadar takip.',
  },
  meta: {
    title: 'Marka, Patent ve Tasarım Tescili — Kodara Digital',
    description: 'TÜRKPATENT nezdinde marka tescili, patent ve faydalı model, tasarım tescili ve uluslararası marka başvurusu. Ön araştırma, Nice sınıflandırması, başvuru ve süreç takibi.',
  },
  hero: {
    eyebrow: 'Sınai Mülkiyet · 6769 sayılı Kanun',
    h1: 'Markanız başkası adına tescillenmeden önce koruyun',
    lead: 'Türkiye’de sınai mülkiyet hakları 6769 sayılı Sınai Mülkiyet Kanunu kapsamında ve TÜRKPATENT nezdinde korunur. Ön araştırmadan sınıf seçimine, başvurudan itiraz sürecine kadar dosyanızı biz takip ediyoruz.',
    bullets: [
      'Marka tescili, patent ve faydalı model, tasarım tescili ve uluslararası başvuru',
      'Başvuru öncesi benzerlik taraması ve Nice sınıflandırmasına göre sınıf belirleme',
      'Resmî Marka Bülteni yayını, itiraz süresi ve tescil belgesine kadar takip',
      'TÜRKPATENT resmî ücretleri hizmet bedelinden ayrı, teklifte açıkça gösterilir',
    ],
  },
  summaryTitle: 'Teslim aldığınız çıktılar',
  summaryText: 'Sürecin her adımında elinizde ne olduğunu bilirsiniz: hangi sınıfa neden başvurulduğu, hangi riskin görüldüğü ve dosyanın hangi aşamada olduğu yazılıdır.',
  deliverables: [
    'Ön araştırma raporu — benzer kayıtlar ve değerlendirilen risk',
    'Sınıf listesi ve gerekçesi — Nice sınıflandırmasına göre mal ve hizmetler',
    'Başvuru dosyası, başvuru numarası ve resmî yazışmaların kopyaları',
    'Tescil belgesi ile yenileme tarihini gösteren takip notu',
  ],
  intro: {
    heading: 'Tescil bir hak doğurur, başvuru tek başına yetmez',
    paragraphs: [
      'Bir isim, logo ya da ürün adı kullanıyor olmanız onu size ait kılmaz. Türkiye’de marka üzerindeki koruma tescille doğar ve tescili yapan kurum TÜRKPATENT’tir. Yürürlükteki mevzuat 6769 sayılı Sınai Mülkiyet Kanunu’dur; marka, patent, faydalı model ve tasarım hakları bu Kanun kapsamında düzenlenir.',
      'Süreç şöyle işler: önce ön araştırma yapılır, yani aynı ve benzer kayıtlar taranır. Ardından koruma istenen mal ve hizmetler Nice sınıflandırmasına göre belirlenir. Başvuru yapılır, kurum şekli inceleme yürütür, uygun bulunan başvuru Resmî Marka Bülteni’nde yayımlanır ve bir itiraz süresi işler. İtiraz gelmez ya da itiraz reddedilirse tescil belgesi düzenlenir. Marka tescili 10 yıl geçerlidir ve süresi dolduğunda yenilenir.',
      'Burada dürüst olmak gerekiyor: tescilin kesin olarak alınacağı hiç kimse tarafından garanti edilemez. Önceki tarihli benzer bir marka sahibinin itirazı ya da kurumun kendi değerlendirmesi başvurunun reddiyle sonuçlanabilir. Ön araştırmayı bu yüzden ciddiye alıyoruz: riski başvurudan önce görmek, hem harcı hem zamanı korur. Riskli gördüğümüz bir başvuruda bunu size söyler, alternatif kurgu öneririz.',
    ],
  },
  offerHeading: 'Tescil alanları',
  offer: [
    {
      title: 'Marka tescili',
      desc: 'Kelime, logo ve karma markalar için başvuru. Ön araştırma, Nice sınıflandırmasına göre sınıf ve alt sınıf seçimi, başvuru dosyasının hazırlanması ve sürecin takibi.',
    },
    {
      title: 'Patent ve faydalı model',
      desc: 'Teknik bir çözümün korunması için başvuru yönlendirmesi. Patent ile faydalı model arasındaki farkın değerlendirilmesi, tekniğin bilinen durumu araştırması ve dosya süreci takibi.',
    },
    {
      title: 'Tasarım tescili',
      desc: 'Ürünün görünümüne ilişkin koruma. Görsel dosyaların hazırlanması, tasarımın yeni ve ayırt edici niteliğinin değerlendirilmesi ve çoklu başvuru kurgusu.',
    },
    {
      title: 'Ön araştırma ve risk değerlendirmesi',
      desc: 'Başvurudan önce aynı ve benzer kayıtlar taranır, itiraz riski değerlendirilir. Risk yüksekse başvuru yapmadan önce ad ya da sınıf kurgusu için alternatif önerilir.',
    },
    {
      title: 'Uluslararası marka başvurusu',
      desc: 'Yurt dışında koruma istenen ülkeler için başvuru yolu değerlendirilir; Madrid Protokolü kapsamındaki uluslararası başvuru ile doğrudan ulusal başvuru seçenekleri karşılaştırılır.',
    },
    {
      title: 'İtiraz, yenileme ve devir işlemleri',
      desc: 'Yayına itiraz ve karara itiraz dosyalarının hazırlanması; tescil sonrası yenileme takibi, unvan ve adres değişikliği ile devir ve lisans işlemleri.',
    },
  ],
  processHeading: 'Ön araştırmadan tescil belgesine',
  process: [
    {
      title: 'Ön araştırma',
      desc: 'Aynı ve benzer kayıtlar taranır, itiraz riski değerlendirilir ve sonuç yazılı olarak paylaşılır. Risk yüksekse başvurudan önce alternatif kurgu konuşulur.',
    },
    {
      title: 'Sınıf belirleme ve başvuru',
      desc: 'Koruma istenen mal ve hizmetler Nice sınıflandırmasına göre belirlenir, başvuru dosyası hazırlanır ve TÜRKPATENT nezdinde başvuru yapılır.',
    },
    {
      title: 'İnceleme, yayın ve itiraz süresi',
      desc: 'Şekli inceleme sonrası başvuru Resmî Marka Bülteni’nde yayımlanır ve itiraz süresi işler. Gelen itiraz olursa yanıt dosyası hazırlanır.',
    },
    {
      title: 'Tescil ve yenileme takibi',
      desc: 'Süreç olumlu sonuçlanırsa tescil belgesi alınır ve size teslim edilir; 10 yıllık koruma süresinin bitiş tarihi yenileme için takibe alınır.',
    },
  ],
  audienceHeading: 'Bu hizmet kimler için',
  audience: [
    {
      title: 'Yeni kurulan işletmeler',
      desc: 'Adını ve logosunu yeni belirleyen; tabela, alan adı ve ambalaj yatırımı yapmadan önce koruma almak isteyenler.',
    },
    {
      title: 'Pazaryeri ve e-ticaret satıcıları',
      desc: 'Marka kayıt programlarına girmek, taklit ürün ilanlarına karşı işlem başlatmak isteyen satıcılar.',
    },
    {
      title: 'Ürün geliştiren üreticiler',
      desc: 'Teknik bir çözüm ya da özgün ürün görünümü geliştiren; patent, faydalı model veya tasarım tescili değerlendiren firmalar.',
    },
    {
      title: 'Yurt dışına açılan markalar',
      desc: 'İhracata başlayan ya da yeni pazarlara giren; hedef ülkelerde koruma kurgusu yapması gereken şirketler.',
    },
  ],
  faq: [
    {
      q: 'Tescil alacağımız garanti mi?',
      a: 'Hayır, tescil garanti edilemez. Önceki tarihli benzer bir marka sahibinin itirazı ya da kurumun değerlendirmesi başvurunun reddiyle sonuçlanabilir. Bu nedenle ön araştırmayı başvurudan önce yapıyor, riski yazılı olarak paylaşıyor ve yüksek riskli gördüğümüz durumlarda alternatif öneriyoruz.',
    },
    {
      q: 'Süreç ne kadar sürer?',
      a: 'Süre; kurumun inceleme yoğunluğuna, yayın ve itiraz sürecine ve itiraz gelip gelmediğine göre değişir. Bu nedenle kesin bir gün sayısı vermiyoruz. Başvurunuz yapıldığı anda başvuru numarası oluşur ve dosyanın hangi aşamada olduğunu adım adım bildiririz.',
    },
    {
      q: 'TÜRKPATENT ücretleri fiyata dâhil mi?',
      a: 'Hayır. TÜRKPATENT resmî ücretleri hizmet bedelinden ayrıdır ve kuruma ödenir. Teklifte hizmet bedeli ile resmî ücretler ayrı satırlarda gösterilir; sınıf sayısı arttıkça resmî ücretin de artacağı önceden bildirilir.',
    },
    {
      q: 'Kaç sınıfta başvurmalıyız?',
      a: 'Koruma yalnızca başvurduğunuz mal ve hizmet sınıflarında doğar; gereğinden fazla sınıf ise resmî ücreti yükseltir. Bu yüzden mevcut faaliyetiniz ile yakın vadeli planlarınıza bakarak sınıf listesini birlikte belirliyor ve her sınıfın gerekçesini yazıyoruz.',
    },
    {
      q: 'Tescil sonrası ne oluyor?',
      a: 'Marka tescili 10 yıl geçerlidir ve süre dolduğunda yenilenir; yenileme tarihini takibe alıyoruz. Bu süre içinde markanızı kullanmanız ve benzer başvuruları izlemeniz gerekir. İhtiyaç hâlinde devir, lisans, unvan ve adres değişikliği işlemleri de yürütülebilir.',
    },
  ],
  ctaHeading: 'Ön araştırmayla başlayalım',
  ctaText: 'Markanızın adını ve faaliyet alanınızı konuşalım; benzerlik taramasının sonucunu ve hangi sınıflarda başvurmanız gerektiğini paylaşalım. Görüşme bağlayıcı değil; sonunda elinizde yazılı bir kapsam ve sabit fiyat oluyor.',
  landing: {
    meta: {
      title: 'Marka Tescili Teklifi Alın — Kodara Digital',
      description: 'Marka, patent, faydalı model ve tasarım tescili için teklif alın. Ön araştırma, Nice sınıflandırmasına göre sınıf belirleme ve TÜRKPATENT süreç takibi. 1 iş günü içinde dönüş.',
    },
    h1: 'Marka tescili teklifinizi 1 iş günü içinde alın',
    promise: 'Önce benzerlik taraması yapıyor, riski açıkça söylüyoruz. Sınıfları birlikte belirliyor, başvurudan tescil belgesine kadar dosyayı takip ediyoruz.',
    benefits: [
      {
        title: 'Başvurudan önce ön araştırma',
        desc: 'itiraz riski görülmeden başvuru yapılmaz',
      },
      {
        title: 'Gerekçeli sınıf listesi',
        desc: 'her sınıfın neden seçildiği yazılı olarak belirtilir',
      },
      {
        title: 'Sabit kapsam ve fiyat',
        desc: 'hizmet bedeli teklif aşamasında sabitlenir',
      },
      {
        title: 'Süreç boyunca bildirim',
        desc: 'yayın, itiraz ve karar aşamaları size aktarılır',
      },
    ],
    trustHeading: 'Çalışma nasıl yürütülüyor',
    trust: [
      {
        title: 'Tescil garantisi verilmez',
        desc: 'Kararı TÜRKPATENT verir; itiraz ya da kurum değerlendirmesi redle sonuçlanabilir. Taahhüdümüz riski başvurudan önce görüp size açıkça bildirmektir.',
      },
      {
        title: 'Resmî ücretler şeffaf gösterilir',
        desc: 'TÜRKPATENT harçları hizmet bedelinden ayrıdır ve teklifte ayrı satır olarak yer alır; sınıf sayısına göre değişeceği önceden bildirilir.',
      },
      {
        title: 'Tüm evrak size teslim edilir',
        desc: 'Başvuru numarası, resmî yazışmalar ve tescil belgesi kurumunuza verilir; süreç boyunca tek muhatapla ilerlersiniz.',
      },
    ],
    faq: [
      {
        q: 'Ön araştırma neden şart?',
        a: 'Benzer bir marka önceden tescilliyse başvurunuz itirazla karşılaşabilir ve reddedilebilir; bu durumda ödenen resmî ücret ve geçen süre geri gelmez. Ön araştırma bu riski başvurudan önce görmenizi sağlar ve gerekirse ad ya da sınıf kurgusunu değiştirme imkânı verir.',
      },
      {
        q: 'Fiyat neye göre belirleniyor?',
        a: 'Başvuru türü (marka, tasarım, patent ya da faydalı model), sınıf sayısı ve uluslararası koruma istenip istenmediği belirleyicidir. Hizmet bedeli teklifte sabitlenir; TÜRKPATENT resmî ücretleri ise ayrıca ve açıkça gösterilir.',
      },
      {
        q: 'Başvuruya itiraz gelirse ne oluyor?',
        a: 'Yayın süresinde itiraz gelirse dosyanın durumunu değerlendirip yanıt hazırlıyoruz. Karşı görüş dosyası, delil sunumu ve gerekirse karara itiraz aşamaları yürütülür. Bu aşamalar ayrı bir çalışma kapsamıdır ve başlamadan önce yazılı olarak konuşulur.',
      },
      {
        q: 'Yurt dışı tescili de yapılıyor mu?',
        a: 'Evet. Hedef ülkelere göre Madrid Protokolü kapsamındaki uluslararası başvuru ile doğrudan ulusal başvuru seçeneklerini karşılaştırıp uygun yolu öneriyoruz. Her ülkenin kendi ücret ve inceleme rejimi olduğu için maliyet ülke bazında çıkarılır.',
      },
    ],
    ctaHeading: 'Marka tescili teklifi alın',
    ctaText: 'Bilgilerinizi bırakın, markanızı ve faaliyet alanınızı konuşup 1 iş günü içinde sabit fiyat teklifinizi gönderelim.',
    submitLabel: 'Teklif Al',
    closeHeading: 'Marka hakkı başvuru sırasına göre şekillenir',
    closeText: 'Aynı ada başka biri sizden önce başvurursa süreç sizin aleyhinize döner. Tabela, ambalaj ve reklam yatırımı yapmadan önce başvuruyu tamamlamak, sonradan ad değiştirmenin maliyetinden çok daha düşüktür.',
  },
};

export default markaPatentTescili;
