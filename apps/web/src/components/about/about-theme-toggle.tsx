'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function AboutThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cee-student-theme') as 'dark' | 'light' | null;
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
      }
    } catch {
      // fallback
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('cee-student-theme', next);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    if (next === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        className="group flex items-center gap-2.5 rounded-full border border-[#B8DFF4]/40 bg-[#0A1128]/90 px-4 py-2.5 text-xs font-semibold text-[#F5FBFA] shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#A9E6DD] hover:bg-[#101A3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9E6DD] dark:border-white/20 dark:bg-[#101A3C]/95 dark:text-[#F5FBFA] light:border-[#244A50]/20 light:bg-white light:text-[#244A50] light:shadow-md"
        style={{
          boxShadow:
            theme === 'dark'
              ? '0 12px 30px rgba(10, 17, 40, 0.8), 0 0 20px rgba(169, 230, 221, 0.15)'
              : '0 12px 30px rgba(36, 74, 80, 0.15), 0 0 16px rgba(169, 230, 221, 0.3)',
        }}
      >
        <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#1EC5B2]/20 text-[#A9E6DD] transition-transform duration-300 group-hover:rotate-45">
          {theme === 'dark' ? <Sun size={13} className="text-[#A9E6DD]" /> : <Moon size={13} className="text-[#244A50]" />}
        </span>
        <span className="tracking-wide">
          {theme === 'dark' ? 'Theme: Dark' : 'Theme: Light'}
        </span>
      </button>
    </div>
  );
}

