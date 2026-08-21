/**
 * next/image için özel yükleyici (loader).
 *
 * NEDEN GEREKLİ: `next/image`'ın varsayılan optimize edicisi Vercel'e özel bir
 * servistir. Cloudflare Workers'a taşındığında o servis yok; görseller ya
 * optimize edilmeden çıkar ya da Cloudflare Images (ücretli) gerekir.
 *
 * ÇÖZÜM: Unsplash zaten kendi URL'sinde boyutlandırma ve format dönüşümü
 * destekliyor. Boyutu ve kaliteyi doğrudan kaynağa söylüyoruz; hem Vercel'de
 * hem Cloudflare'de aynı şekilde çalışıyor, ek servise gerek kalmıyor ve
 * responsive `srcset` üretimi korunuyor.
 *
 * DİKKAT: Özel yükleyici tanımlandığında `next.config.ts` içindeki
 * `images.formats` ve `images.remotePatterns` ayarları devre dışı kalır —
 * optimizasyon artık Next'in değil, bu fonksiyonun sorumluluğunda.
 */

type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

const DEFAULT_QUALITY = 72;

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  const q = quality ?? DEFAULT_QUALITY;

  // Yerel dosyalar (/public altındaki SVG, PNG) olduğu gibi servis edilir;
  // zaten statik ve boyutları kaynakta belli.
  if (src.startsWith('/')) return src;

  // Veri URL'leri ve dönüştürülemeyecek biçimler dokunulmadan geçer.
  if (src.startsWith('data:') || src.endsWith('.svg')) return src;

  try {
    const url = new URL(src);

    // Unsplash: genişlik, kalite ve otomatik format (tarayıcı destekliyorsa WebP/AVIF).
    if (url.hostname === 'images.unsplash.com') {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', String(q));
      // Kaynakta zaten varsa yinelenmesin diye set kullanıyoruz, append değil.
      return url.toString();
    }

    // Tanımadığımız bir kaynak: dokunmadan geçir. Yanlış parametre eklemektense
    // optimize edilmemiş servis etmek daha güvenli.
    return src;
  } catch {
    return src;
  }
}
