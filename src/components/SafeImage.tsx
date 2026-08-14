'use client';

import React, { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';

type SafeImageProps = ImageProps & {
  /** Yedek görselin vurgu rengi (demo sayfasının kimliğine uysun diye). */
  accent?: string;
};

/**
 * next/image sarmalayıcısı: uzak görsel yüklenemezse kırık ikon yerine
 * sayfanın kimliğine uyan zarif bir yer tutucu gösterir.
 *
 * Demo sayfaları harici (Unsplash) görsellere bağlı; bir URL ölürse portföy
 * sayfasının kırık görünmesi kabul edilemez, o yüzden hata durumu ele alınıyor.
 */
export function SafeImage({ accent = 'text-slate-600', alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // fill kullanan görseller konumlandırılmış bir ebeveyni doldurur;
    // sabit boyutlular kendi width/height'ini korumalı.
    const isFill = 'fill' in props && props.fill;
    return (
      <div
        role="img"
        aria-label={alt}
        style={
          isFill
            ? undefined
            : { width: Number(props.width) || undefined, height: Number(props.height) || undefined }
        }
        className={`flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black ${
          isFill ? 'absolute inset-0 h-full w-full' : `shrink-0 ${props.className ?? ''}`
        }`}
      >
        <ImageOff className={`h-8 w-8 ${accent} opacity-40`} />
      </div>
    );
  }

  return <Image alt={alt} onError={() => setFailed(true)} {...props} />;
}

export default SafeImage;
