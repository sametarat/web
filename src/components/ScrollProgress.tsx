'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Sayfanın en üstünde ince ilerleme çubuğu.
 *
 * Uzun sayfalarda "daha ne kadar var" sorusunu sessizce cevaplar ve kaydırmaya
 * bir geri bildirim ekler. Yay (spring) ile yumuşatılıyor; ham scroll değeri
 * doğrudan bağlanırsa titrek görünür.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[95] h-0.5 origin-left bg-gradient-to-r from-brand-500 via-brand-400 to-emerald-400"
    />
  );
}

export default ScrollProgress;
