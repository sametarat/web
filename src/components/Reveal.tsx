'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Kaydırdıkça beliren içerik.
 *
 * Sayfa boyunca tek bir hareket dili kullanmak, her bölüme ayrı efekt
 * yazmaktan daha iyi durur — göz bir ritim yakalar. Bu yüzden tüm bölümler
 * aynı `Reveal` bileşeninden geçiyor; sadece gecikme ve yön değişiyor.
 *
 * `prefers-reduced-motion` açıksa hareket tamamen kapanır, içerik anında görünür.
 */

type Direction = 'up' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 44 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  as?: 'div' | 'section' | 'li';
}) {
  const reduce = useReducedMotion();
  const offset = OFFSET[direction];
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: reduce
      ? { opacity: 1 }
      : { opacity: 0, scale: 0.965, filter: 'blur(6px)', ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: reduce ? 0 : 0.9,
        delay: reduce ? 0 : delay,
        // Uzun, yavaslayan bir egri — sert duran "ease-out" yerine kamera hissi
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-110px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Alt öğeleri sırayla getiren kapsayıcı.
 * Kart ızgaralarında hepsinin birden belirmesi ucuz durur; 80 ms'lik kayma yeter.
 */
export function RevealGroup({
  children,
  className = '',
  stagger = 0.14,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul';
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-110px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** RevealGroup içinde tek bir öğe. */
export function RevealItem({
  children,
  className = '',
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduce
          ? { opacity: 1 }
          : { opacity: 0, y: 44, scale: 0.955, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: reduce ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
