'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('recipehub-theme');
    const shouldDark = stored === 'dark';
    document.documentElement.classList.toggle('dark', shouldDark);
    setIsDark(shouldDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('recipehub-theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-orange-400 hover:text-orange-500 dark:border-slate-700 dark:text-slate-200"
      aria-label="Toggle dark and light theme"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
