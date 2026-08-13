import { 
  Code, 
  Search as SearchIcon, 
  Megaphone, 
  Utensils, 
  ShoppingBag, 
  Hotel 
} from 'lucide-react';
import { ServiceItem, QuestionItem, DemoItem } from '@/types';

export const SERVICES_OVERVIEW: ServiceItem[] = [
  {
    title: 'Özel Web Tasarım & Geliştirme',
    desc: 'İşletmenize özel, Lighthouse %100 hızlı, mobil uyumlu ve yüksek dönüşüm odaklı modern web mimarileri.',
    icon: Code,
    color: 'from-blue-600 to-indigo-600',
    features: ['Sıfır Altyapı Gecikmesi', 'Özel UX/UI Tasarım', 'Core Web Vitals Optimizasyonu']
  },
  {
    title: 'SEO & Arama Motoru Optimizasyonu',
    desc: 'Google arama sonuçlarında kalıcı olarak üst sıralara çıkmanızı sağlayan teknik ve içerik tabanlı SEO altyapısı.',
    icon: SearchIcon,
    color: 'from-teal-500 to-emerald-600',
    features: ['Teknik SEO Denetimi', 'Anahtar Kelime Stratejisi', 'Organik Trafik Artışı']
  },
  {
    title: 'Meta & Google Reklam Yönetimi',
    desc: 'Yüksek ROAS odaklı reklam kurguları, Meta Pixel ve Google dönüşüm optimizasyonları ile bütçe verimliliği.',
    icon: Megaphone,
    color: 'from-indigo-500 to-purple-600',
    features: ['Hedef Kitle Analizi', 'Dönüşüm Odaklı Kreatifler', 'Detaylı ROI Raporlama']
  }
];

export const PRESET_QUESTIONS: QuestionItem[] = [
  { id: '1', label: '🚀 Web sitenizi kaç günde kuruyorsunuz?', answer: 'Projelerimizin karmaşıklığına bağlı olarak anahtar teslim web sitelerini ortalama 5 ila 10 iş günü içerisinde yayına alıyoruz.' },
  { id: '2', label: '📈 SEO ile satışlarımı nasıl artırırsınız?', answer: 'Teknik altyapınızı Google standartlarına tamamen uyumlu hale getirerek, potansiyel müşterilerinizin sizi doğrudan arama sonuçlarında bulmasını sağlıyoruz.' },
  { id: '3', label: '💰 Fiyatlandırma politikanız nedir?', answer: 'Her işletmenin ihtiyacı farklı olduğundan, işletmenize özel analiz yaptıktan sonra bütçenize en uygun şeffaf fiyat teklifini sunuyoruz.' },
  { id: '4', label: '⚡ 0.08s hız nasıl mümkün oluyor?', answer: 'Klasik yavaş veritabanı sorguları yerine hibrit Edge mimarisi ve modern önbellekleme teknolojileri kullanarak sayfalarımızın anında açılmasını sağlıyoruz.' },
  { id: '5', label: '🎯 Reklam yönetiminde ROAS garantisi var mı?', answer: 'Meta ve Google reklamlarında nokta atışı hedef kitle kurguları ve düzenli optimizasyonlarla reklam harcama getirisinizi (ROAS) maksimuma çıkarıyoruz.' }
];

export const DEMO_LIST: DemoItem[] = [
  {
    id: 'gurme-restoran',
    title: 'Gurme Restoran & Bistro',
    subtitle: 'La Maison - Fine Dining & Gastronomy',
    category: 'Gastronomi & Restoran',
    path: '/demo/gurme-restoran',
    icon: Utensils,
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    accentColor: 'text-amber-400',
    metrics: 'Masa Rezervasyonu: +%240 | Yükleme: 0.05s',
    mockupType: 'restaurant',
    navItems: ['Ana Menü', 'Şefin Spesiyalleri', 'Şarap Kavı', 'Rezervasyon']
  },
  {
    id: 'moda-eticaret',
    title: 'Moda & Lüks E-Ticaret',
    subtitle: 'Vogue & Urban Culture',
    category: 'E-Ticaret & Moda',
    path: '/demo/moda-eticaret',
    icon: ShoppingBag,
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    accentColor: 'text-pink-400',
    metrics: 'Sepete Ekleme: +%180 | Yükleme: 0.08s',
    mockupType: 'ecommerce',
    navItems: ['Yeni Gelenler', 'Erkek', 'Kadın', 'Sepetim']
  },
  {
    id: 'otel-rezervasyon',
    title: 'Otel & Lüks Konaklama',
    subtitle: 'Grand Azure Resort & Spa',
    category: 'Turizm & Otelcilik',
    path: '/demo/otel-rezervasyon',
    icon: Hotel,
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    accentColor: 'text-blue-400',
    metrics: 'Direkt Rezervasyon: +%310 | Yükleme: 0.06s',
    mockupType: 'hotel',
    navItems: ['Odalar & Süitler', 'Spa & Wellness', 'Gastronomi', 'Hızlı Rezerve']
  },
];