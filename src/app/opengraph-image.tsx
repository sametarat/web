import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

/**
 * Link paylaşımlarında (WhatsApp, LinkedIn, X) görünen kapak görseli.
 * Statik dosya yerine build sırasında üretiliyor — marka adı veya sloganı
 * değişince otomatik güncellenir, elde tutulacak bir PNG kalmaz.
 */
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #07080f 0%, #17123d 55%, #2c2374 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 76, fontWeight: 800, letterSpacing: -3 }}>
          {SITE.wordmark}
          <span style={{ color: '#9a8cff' }}>.</span>
        </div>

        <div style={{ marginTop: 28, fontSize: 40, fontWeight: 700, lineHeight: 1.25, maxWidth: 900 }}>
          {SITE.tagline}
        </div>

        <div style={{ marginTop: 20, fontSize: 26, color: '#94a3b8', maxWidth: 880, lineHeight: 1.4 }}>
          Yüksek hızlı web siteleri, e-ticaret sistemleri ve özel yazılım.
        </div>

        <div style={{ marginTop: 48, display: 'flex', gap: 14 }}>
          {['Next.js', 'Teknik SEO', 'E-Ticaret', 'Özel Yazılım'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                padding: '10px 22px',
                borderRadius: 999,
                border: '1px solid rgba(154,140,255,0.35)',
                background: 'rgba(124,107,255,0.12)',
                color: '#cfc8ff',
                fontSize: 22,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
