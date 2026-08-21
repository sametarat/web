import React from 'react';
import {
  BadgeCheck,
  LayoutTemplate,
  Scale,
  Search,
  ShieldCheck,
  Tag,
  Target,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceIcon as ServiceIconName } from '@/content/services/types';

/**
 * İçerik dosyalarındaki `icon` alanını lucide bileşenine çevirir.
 * İçerikte yeni bir ad kullanmak istersen önce types.ts'teki birleşime,
 * sonra buraya eklemek gerekiyor — böylece eksik eşleşme derlemede yakalanır.
 */
const ICONS: Record<ServiceIconName, LucideIcon> = {
  layout: LayoutTemplate,
  search: Search,
  target: Target,
  shield: ShieldCheck,
  scale: Scale,
  badge: BadgeCheck,
  tag: Tag,
};

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}

export default ServiceIcon;
