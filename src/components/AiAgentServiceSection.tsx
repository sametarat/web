'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  BrainCircuit, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Clock, 
  BarChart3,
  Users,
  Calendar,
  Headphones
} from 'lucide-react';

interface AgentFeature {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  capabilities: string[];
  metrics: { label: string; value: string }[];
  demoChat: { role: 'user' | 'agent'; text: string; time: string }[];
}

const AGENT_SOLUTIONS: AgentFeature[] = [
  {
    id: 'support-agent',
    title: '7/24 Otonom Müşteri Destek Ajanı',
    subtitle: 'Müşteri Taleplerini Bekletmeden Anında Çözün',
    badge: 'Müşteri İlişkileri',
    icon: Headphones,
    description: 'Sıkça sorulan sorular, kargo takibi, iade süreçleri ve ürün bilgilendirmelerini insan müdahalesi olmadan milisaniyeler içinde yanıtlar.',
    capabilities: [
      'WhatsApp, Web ve Telegram Çoklu Kanal Desteği',
      'Şirket Bilgi Bankası (KMS) ile Özel Eğitilmiş LLM',
      'Karmaşık Taleplerde İnsan Temsilciye Kesintisiz Aktarım'
    ],
    metrics: [
      { label: 'Yanıt Süresi', value: '< 1.2s' },
      { label: 'Otomasyon Oranı', value: '%85+' },
      { label: 'Müşteri Memnuniyeti', value: '%98' }
    ],
    demoChat: [
      { role: 'user', text: 'Siparişim ne zaman kargoya verilir? Sipariş No: #9821', time: '14:22' },
      { role: 'agent', text: 'Siparişiniz #9821 incelendi. Paketeniz bugün saat 16:30\'da Aras Kargo\'ya teslim edilmek üzere hazırlandı. Takip kodunuz SMS ile iletilecektir. 🚀', time: '14:22' }
    ]
  },
  {
    id: 'sales-agent',
    title: 'Satış & Dönüşüm AI Ajanı',
    subtitle: 'Ziyaretçileri Müşteriye Dönüştüren Akıllı Asistan',
    badge: 'Satış & Pazarlama',
    icon: BarChart3,
    description: 'Sitenize gelen ziyaretçilerin ihtiyaçlarını analiz eder, doğru ürünü önerir ve satın alma kararını hızlandırarak cironuzu artırır.',
    capabilities: [
      'Kişiselleştirilmiş Ürün ve Hizmet Önerileri',
      'Sepet Terk Etme Önleyici Etkileşimler',
      'E-Ticaret ve CRM Sistemleri (Shopify, HubSpot vb.) Entegrasyonu'
    ],
    metrics: [
      { label: 'Dönüşüm Artışı', value: '%35+' },
      { label: 'Ort. Sepet Tutar Artışı', value: '%22' },
      { label: '7/24 Aktif Satış', value: 'Kesintisiz' }
    ],
    demoChat: [
      { role: 'user', text: 'Yazılım firmamız için en uygun paketi arıyorum.', time: '10:15' },
      { role: 'agent', text: 'Harika! Büyüme hedefindeki yazılım ekipleri için "Pro Agent" paketimiz öne çıkıyor. API sınırları yüksek ve özel CRM entegrasyonu içeriyor. İsterseniz 14 gün ücretsiz deneyebilirsiniz!', time: '10:15' }
    ]
  },
  {
    id: 'booking-agent',
    title: 'Randevu & Operasyon Ajanı',
    subtitle: 'Takvim Yönetimini ve Randevuları Otomatize Edin',
    badge: 'Operasyon',
    icon: Calendar,
    description: 'Klinik, danışmanlık, gayrimenkul veya hizmet sektörleri için takvim müsaitliğini sorgular ve randevuları otonom oluşturur.',
    capabilities: [
      'Google Calendar, Outlook ve Özel CRM Entegrasyonu',
      'Otomatik SMS ve WhatsApp Randevu Hatırlatıcıları',
      'Çift Yönlü Randevu İptal ve Güncelleme Yönetimi'
    ],
    metrics: [
      { label: 'Randevu Kaybı Azalması', value: '%60' },
      { label: 'Zaman Tasarrufu', value: '20 Saat/Hafta' },
      { label: 'Çakışma Oranı', value: '%0' }
    ],
    demoChat: [
      { role: 'user', text: 'Yarın öğleden sonra bir danışmanlık randevusu alabilir miyim?', time: '16:05' },
      { role: 'agent', text: 'Yarın (14 Ağustos) saat 14:30 ve 16:00 saatleri müsait. Hangi saat size daha uygun? Seçiminiz sonrası takviminizi hemen onaylayacağım.', time: '16:05' }
    ]
  }
];

export default function AiAgentServiceSection() {
  const [activeTab, setActiveTab] = useState<string>(AGENT_SOLUTIONS[0].id);

  const selectedAgent = AGENT_SOLUTIONS.find((a) => a.id === activeTab) || AGENT_SOLUTIONS[0];

  return (
    <div className="p-5 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 via-purple-950/20 to-slate-900/90 border border-purple-500/20 relative overflow-hidden shadow-2xl">
      {/* Arka Plan Glow Efektleri */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8 sm:space-y-12">
        {/* Başlık Başlığı */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>NEXUS AGENTIC AI SOLUTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            İş Süreçlerinizi Yöneten <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400">
              Otonom Yapay Zeka Ajanları
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-base font-light leading-relaxed">
            Sadece hazır yanıtlara bağımlı kalan basit kural tabanlı botları unutun. Kendi verinizle eğitilen, kararlar alabilen ve iş akışlarınızı otonom yürüten LLM ajanları inşa ediyoruz.
          </p>
        </div>

        {/* Tab Seçim Butonları */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {AGENT_SOLUTIONS.map((agent) => {
            const Icon = agent.icon;
            const isActive = activeTab === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveTab(agent.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{agent.title.split(' ')[1]} AI</span>
              </button>
            );
          })}
        </div>

        {/* Detay Kartı & İnteraktif Görünüm */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAgent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch"
          >
            {/* Sol Taraf: Özellikler ve Metrikler */}
            <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-mono">
                    {selectedAgent.badge}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Canlı Modelde Aktif
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedAgent.title}</h3>
                  <p className="text-purple-300/80 text-xs sm:text-sm font-medium mt-1">{selectedAgent.subtitle}</p>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  {selectedAgent.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">// TEKNİK YETENEKLER</h4>
                  <div className="space-y-2">
                    {selectedAgent.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performans Metrikleri Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                {selectedAgent.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 text-center">
                    <div className="text-base sm:text-lg font-extrabold text-white font-mono">{metric.value}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-light mt-0.5">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Taraf: Canlı AI Chat Simülasyonu */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Nexus AI Agent</span>
                    <span className="text-[10px] text-slate-400">Otonom Yanıt Modu</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              {/* Sohbet Akışı */}
              <div className="space-y-3 my-auto py-2">
                {selectedAgent.demoChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600/30 border border-blue-500/30 text-blue-100 rounded-br-none'
                          : 'bg-slate-900 border border-purple-500/30 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* CTA Butonu */}
              <div className="pt-3 border-t border-slate-800">
                <a
                  href="#teklif-al"
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <span>Bu Ajanı İşletmenize Entegre Edin</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}