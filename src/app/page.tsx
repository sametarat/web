'use client';

// Göreceli yollarla tam eşleşen import'lar:
import { ParticleCanvas } from '../components/ParticleCanvas';
import { AiAgentServiceSection } from '../components/AiAgentServiceSection';
import { MetaGoogleAdsCard } from '../components/MetaGoogleAdsCard';
import { TopAdBanner } from '../components/TopAdBanner';
import { 
  InteractiveRestaurantMockup, 
  InteractiveEcommerceMockup, 
  InteractiveHotelMockup 
} from '../components/Mockups';
import { LeadCaptureSection } from '../components/LeadCaptureSection';
import { CyberChatbot } from '../components/CyberChatbot';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Üst Duyuru Banners */}
      <TopAdBanner />

      {/* Arka Plan Animasyonu */}
      <ParticleCanvas />

      {/* Hero / Başlık */}
      <section className="relative z-10 pt-20 pb-16 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          İşletmeniz İçin Hızlı, Güvenli ve <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Yüksek Dönüşümlü Web Sistemleri
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Yavaş açılan ve müşteri kaybettiren hazır temaları unutun. İşletmenize özel mimaride geliştirilmiş canlı platformlar inşa ediyoruz.
        </p>
      </section>

      {/* AI Servisleri & Reklam Kartı */}
      <section className="relative z-10 py-8 px-4 max-w-6xl mx-auto space-y-12">
        <AiAgentServiceSection />
        <MetaGoogleAdsCard />
      </section>

      {/* Canlı Mockup Demoları */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <InteractiveRestaurantMockup />
        <InteractiveEcommerceMockup />
        <InteractiveHotelMockup />
      </section>

      {/* İletişim Formu */}
      <LeadCaptureSection />

      {/* Sayfa Altı & Chatbot */}
      <Footer />
      <CyberChatbot />
    </main>
  );
}