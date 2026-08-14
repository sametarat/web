# Kodara

Dijital ürün & web mimarisi ajansı sitesi. Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5555
npm run build      # production derlemesi
npm run typecheck  # tsc --noEmit
npm run lint
```

## Ortam değişkenleri

`.env.local` içinde tanımlanır. Vercel'e deploy ederken aynılarını **Settings → Environment Variables** altına da eklemen gerekir.

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `GROQ_API_KEY` | AI asistanı için | [console.groq.com/keys](https://console.groq.com/keys) — ücretsiz kota var. Yoksa `/api/bot` 503 döner ve sohbet baloncuğunda hata mesajı görünür. |
| `RESEND_API_KEY` | Lead e-postası için | [resend.com](https://resend.com) → API Keys. Boşsa lead'ler kaybolmaz, sunucu loguna yazılır. |
| `LEAD_TO_EMAIL` | Lead e-postası için | Bildirimlerin düşeceği adres. |
| `LEAD_FROM_EMAIL` | hayır | Doğrulanmış gönderen. Varsayılan `onboarding@resend.dev` — Resend'in test adresi, sadece kendi hesap e-postana gönderebilir. Kendi domainini doğrulayınca değiştir. |
| `NEXT_PUBLIC_SITE_URL` | hayır | Kanonik adres. Boşsa Vercel production domaini, o da yoksa localhost. Sitemap ve OG etiketlerini besler. |

## Yapı

```
src/
  app/
    page.tsx              Ana sayfa
    layout.tsx            Metadata, OG, font
    globals.css           Tailwind v4 tema tokenları — marka paleti burada
    icon.svg              Favicon
    sitemap.ts robots.ts  SEO
    iletisim/page.tsx     İletişim sayfası (server component + ContactForm)
    api/bot/route.ts      AI asistanı — Groq (Llama 3.3 70B) streaming + lead yakalama aracı
    api/lead/route.ts     Form endpoint'i
    demo/<sektör>/
      page.tsx            Demo sayfası ('use client')
      layout.tsx          Sadece metadata taşır — client page metadata export edemez
  components/             Aşağıdaki tabloya bak
  lib/site.ts             Marka, iletişim bilgisi, rotalar
  lib/leads.ts            Resend REST ile lead e-postası
  proxy.ts                /api/* için rate limit (Next 16'da middleware → proxy)
```

### Bileşenler

| Dosya | Nerede kullanılıyor |
| --- | --- |
| `SiteHeader` / `SiteFooter` | Ana sayfa ve iletişim sayfası |
| `Logo` | Header — salt tipografik wordmark, görsel varlık yok |
| `CyberChatbot` | Ana sayfa — `/api/bot`'a bağlı streaming asistan |
| `LeadCaptureSection` | Ana sayfa formu → `/api/lead` |
| `ContactForm` | İletişim sayfası formu → `/api/lead` |
| `ProcessSection` / `PrinciplesSection` / `FaqSection` | Ana sayfa güven bölümleri |
| `SafeImage` | Demo sayfaları — görsel yüklenemezse yer tutucu gösterir |
| `TopAdBanner` / `MetaGoogleAdsCard` / `ParticleCanvas` | Ana sayfa |

## Marka

İsim, tagline ve iletişim bilgisi tek yerden yönetilir: **`src/lib/site.ts`**.

Renk paleti `src/app/globals.css` içindeki `@theme` bloğunda `--color-brand-*` olarak tanımlı;
`bg-brand-600`, `text-brand-400`, `border-brand-500/20` gibi tüm Tailwind sınıfları buradan üretilir.
İkincil vurgu rengi `emerald` (metrik ve başarı durumları).

`src/app/demo/*` sayfaları bilinçli olarak kendi renk kimliklerini korur (amber / pembe / mavi) —
bunlar müşteri örnekleridir, marka paletine dahil değildir.

## Lead akışı

1. Ziyaretçi ana sayfadaki ya da `/iletisim`'deki formu doldurur → `POST /api/lead` → e-posta.
2. Ya da chatbot ile konuşurken iletişim bilgisi verir → model `saveQualifiedLead` aracını çağırır → aynı e-posta.

`RESEND_API_KEY` tanımlı değilse iki akış da kullanıcı tarafında normal çalışır, lead sunucu loguna düşer.
Formlarda honeypot alanı var; botlar için başarılı yanıt döner ama e-posta gönderilmez.

## Bakım notları

**Değiştirmen gerekenler:**

- `src/lib/site.ts` → `CONTACT.phoneE164` ve `phoneDisplay` hâlâ placeholder (`905550000000`).
  İletişim sayfasında ve demo sayfalarındaki WhatsApp linklerinde görünüyor.
- `src/components/PrinciplesSection.tsx` → maddeler müşteriye verilen **yazılı taahhütler**.
  Tutamayacağın bir sözü (30 gün destek, Lighthouse 90 eşiği) düzelt ya da sil.
- `src/components/FaqSection.tsx` → cevaplar müşteri beklentisi kuruyor, kendi çalışma şekline göre gözden geçir.

**Demo görselleri** Unsplash'ten çekiliyor. Bir URL ölürse `SafeImage` yer tutucu gösterir,
sayfa bozulmaz; terminalde `upstream image response failed ... 404` satırı görünür.
Yeni URL koymadan önce `https://images.unsplash.com/photo-<id>` adresinin yaşadığını doğrula.

**Rate limit** (`src/proxy.ts`) süreç belleğinde tutuluyor. Vercel'de her instance kendi sayacını
tuttuğu için bu kesin bir sınır değil, kaba bir fren. `/api/bot` dış bir AI sağlayıcıya istek attığından
kötüye kullanım risk haline gelirse Upstash Redis / Vercel KV ile paylaşımlı sayaca geçilmeli.

**AI sağlayıcı** `src/app/api/bot/route.ts` başında tek yerde tanımlı (`createGroq` + `MODEL`).
Başka bir sağlayıcıya geçmek istersen (OpenAI, Gemini, Anthropic) sadece bu iki satır değişir —
prompt, `saveQualifiedLead` aracı ve istemci tarafı aynı kalır, AI SDK sağlayıcıdan bağımsız çalışır.

**Eksik:** gerçek vaka çalışması / referans bölümü. Ajans sitesinde dönüşümü en çok bu taşır.
