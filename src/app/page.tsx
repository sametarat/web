'use client';

import { ParticleCanvas } from '@/components/ParticleCanvas';
import { 
  InteractiveRestaurantMockup, 
  InteractiveEcommerceMockup, 
  InteractiveHotelMockup 
} from '@/components/Mockups';
import { LeadCaptureSection } from '@/components/LeadCaptureSection';
import { CyberChatbot } from '@/components/CyberChatbot';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Arka Plan Efekti */}
      <ParticleCanvas />

      {/* Hero Bölümü */}
      <section className="relative z-10 pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Geleceğin Dijital Çözümleri ile <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            İşinizi Büyütün
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Yapay zeka destekli otomasyonlar, modern web mimarileri ve yüksek dönüşüm odaklı dijital altyapılar.
        </p>
      </section>

      {/* Mockup Demo Bölümü */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <InteractiveRestaurantMockup />
        <InteractiveEcommerceMockup />
        <InteractiveHotelMockup />
      </section>

      {/* Lead Capture Formu */}
      <LeadCaptureSection />

      {/* Footer & Chatbot */}
      <Footer />
      <CyberChatbot />
    </main>
  );
}