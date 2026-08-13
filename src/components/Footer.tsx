'use client';

import React, { useState, useEffect } from 'react';

export const Footer: React.FC = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-slate-800 py-8 bg-slate-950/80 relative z-10 text-center text-xs text-slate-500">
      <p>© {year || '2026'} Tüm Hakları Saklıdır.</p>
    </footer>
  );
};