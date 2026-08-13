import { ElementType } from 'react';

export interface ServiceItem {
  title: string;
  desc: string;
  icon: ElementType;
  color: string;
  features: string[];
}

export interface QuestionItem {
  id: string;
  label: string;
  answer: string;
}

export interface DemoItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: ElementType;
  badgeColor: string;
  accentColor: string;
  metrics: string;
  mockupType: 'restaurant' | 'ecommerce' | 'hotel';
  navItems: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}