import React from 'react';
import { SITE } from '@/lib/site';

type LogoProps = {
  /** Yazı boyutu. sm: header, md: footer/genel, lg: hero veya boş sayfa durumları. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-base sm:text-lg',
  md: 'text-xl sm:text-2xl',
  lg: 'text-3xl sm:text-4xl',
};

/**
 * Kodara wordmark'ı.
 * Salt tipografi: küçük harf, sıkı harf aralığı, marka renginde nokta.
 * Görsel varlık taşımadığı için her boyutta net ve tema değişimlerine dayanıklı.
 */
export function Logo({ size = 'sm', className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex select-none items-baseline font-extrabold leading-none tracking-tight text-white ${SIZE_CLASSES[size]} ${className}`}
    >
      {SITE.wordmark}
      <span className="text-brand-400">.</span>
    </span>
  );
}

export default Logo;
