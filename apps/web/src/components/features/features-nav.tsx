'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Moon, Sparkles, Sun } from 'lucide-react';
import { useStudentTheme } from '@/components/dashboard/theme-context';
import styles from './features.module.css';

const navPills = [
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'AI Intelligence', href: '#ai-intelligence' },
  { label: 'Learning System', href: '#learning-system' },
  { label: 'Exam Simulator', href: '#exam-experience' },
  { label: 'Battle Arena', href: '#gamification' },
  { label: 'Mission Control', href: '#mission-control' },
  { label: 'Community', href: '#community' },
  { label: 'Doctor Pathway', href: '#pathway' },
];

export function FeaturesNav() {
  const { theme, toggleTheme } = useStudentTheme();
  const [activeSection, setActiveSection] = useState('ecosystem');

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = navPills.map((pill) => pill.href.replace('#', ''));
      const scrollPosition = window.scrollY + 240;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.subnavPill} role="navigation" aria-label="Features Category Navigation">
      {/* Scrollable Category Links */}
      <div className={styles.subnavLinks}>
        {navPills.map((pill) => {
          const isActive = activeSection === pill.href.replace('#', '');
          return (
            <a
              key={pill.label}
              href={pill.href}
              className={`${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ''}`}
              aria-current={isActive ? 'location' : undefined}
            >
              {pill.label}
            </a>
          );
        })}
      </div>

      {/* Right Controls: Theme Toggle & Quick CTA */}
      <div className="flex items-center gap-2 shrink-0 pl-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B8DFF4]/20 bg-white/5 dark:bg-slate-800/60 text-[#A9E6DD] dark:text-[#B8DFF4] hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
          title={theme === 'dark' ? 'Toggle Light Theme' : 'Toggle Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun size={15} aria-hidden="true" />
          ) : (
            <Moon size={15} aria-hidden="true" />
          )}
        </button>

        <Link
          href="/register"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1ec5b2] to-[#0a92a8] px-3.5 py-1 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ec5b2]"
        >
          <Sparkles size={12} aria-hidden="true" />
          <span>Join Free</span>
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
