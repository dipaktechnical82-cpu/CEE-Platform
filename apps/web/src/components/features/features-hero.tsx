'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  Dna,
  HeartPulse,
  Sparkles,
  Zap,
} from 'lucide-react';
import styles from './features.module.css';

export function FeaturesHero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
      {/* Soft atmospheric gradient backdrop */}
      <div className={styles.heroGlowBackdrop} aria-hidden="true" />

      {/* Subtle DNA background SVG vectors */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
        >
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A9E6DD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#B8DFF4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M50 200 Q 150 120, 250 200 T 450 200 T 650 200 T 850 200 T 1050 200 T 1250 200"
            stroke="url(#dnaGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M50 200 Q 150 280, 250 200 T 450 200 T 650 200 T 850 200 T 1050 200 T 1250 200"
            stroke="url(#dnaGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className={styles.sectionInner}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Hero Messaging */}
          <div className="lg:col-span-7 max-w-2xl text-left">
            <div className={styles.eyebrowBadge}>
              <Sparkles size={13} className="text-[#A9E6DD]" aria-hidden="true" />
              <span>THE COMPLETE FUTURE DOCTOR ECOSYSTEM</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.75rem] font-black tracking-[-0.04em] leading-[1.08] text-white dark:text-white dark:text-opacity-100">
              Everything You Need to Become a{' '}
              <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
                Future Doctor.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 dark:text-[#A9B8D0] leading-relaxed">
              From your first concept to your final CEE examination, experience a smarter, more
              personal and more effective way to prepare for medical school.
            </p>

            {/* Value Proposition Pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#D5F3E8] backdrop-blur-md">
                <CheckCircle2 size={13} className="text-[#A9E6DD]" aria-hidden="true" />
                Verified MEC Nepal Syllabus
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#B8DFF4] backdrop-blur-md">
                <Activity size={13} className="text-[#B8DFF4]" aria-hidden="true" />
                Clinical Concept Diagnostics
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#A9E6DD] backdrop-blur-md">
                <Zap size={13} className="text-[#A9E6DD]" aria-hidden="true" />
                Adaptive Learning Calibration
              </span>
            </div>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#ecosystem"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1ec5b2] to-[#0a92a8] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_12px_28px_rgba(30,197,178,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(30,197,178,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
              >
                <span>Explore the Ecosystem</span>
                <Compass size={18} aria-hidden="true" />
              </a>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 dark:border-white/20 bg-white/10 dark:bg-slate-900/40 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8DFF4]"
              >
                <span>Start Your Preparation</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Holographic Anatomical Heart & AI Ecosystem Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className={styles.heroVisualStage}>
              {/* Outer Hologram Equipment Chassis */}
              <div className={styles.hologramChassis}>
                {/* Status Telemetry Header */}
                <div className="w-full flex items-center justify-between border-b border-[#B8DFF4]/15 pb-2.5 mb-3 text-[10px] font-mono tracking-wider text-[#A9E6DD]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                    <span className="font-bold">HEART-AI CORE</span>
                  </div>
                  <span className="text-slate-400">CEE-MED // V3.8</span>
                </div>

                {/* Central Luminous Anatomical Heart */}
                <div className={styles.heartImageContainer}>
                  <Image
                    src="/images/anatomical-human-heart.jpg"
                    alt="Luminous holographic human heart with active bio-electric nodes"
                    fill
                    priority
                    sizes="(max-width: 768px) 220px, 260px"
                    className="object-cover object-center filter saturate-125 contrast-110"
                  />
                  {/* Subtle cardiac scanning laser beam */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#22D3EE]/25 to-transparent opacity-80 pointer-events-none mix-blend-screen" />
                </div>

                {/* Cardiac Telemetry Bar */}
                <div className="mt-3 w-full bg-[#060A18]/80 dark:bg-black/60 rounded-xl p-2.5 border border-[#B8DFF4]/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#B8DFF4]">
                    <HeartPulse size={16} className="text-[#22D3EE] animate-pulse" />
                    <span className="font-bold font-mono">72 BPM</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    <span className="text-[#A9E6DD]">CARDIAC CYCLE</span> • <span className="text-[#38BDF8]">SYS/DIA</span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                    NOMINAL
                  </div>
                </div>
              </div>

              {/* Floating Intelligence Question Card 1 */}
              <aside
                aria-label="Diagnostic question highlight"
                className={styles.floatingCard1}
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#A9E6DD] uppercase tracking-wider mb-1">
                  <Dna size={12} aria-hidden="true" />
                  <span>Physiology • High Yield</span>
                </div>
                <p className="text-xs font-semibold text-white leading-snug">
                  What triggers Phase 0 depolarization in ventricular myocytes?
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="text-emerald-400 font-bold">Fast Na⁺ channels</span>
                  <span className="font-mono text-[#B8DFF4]">96% accuracy</span>
                </div>
              </aside>

              {/* Floating Intelligence Question Card 2 */}
              <aside
                aria-label="Medical physics calculation highlight"
                className={styles.floatingCard2}
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
                  <Brain size={12} aria-hidden="true" />
                  <span>Medical Physics</span>
                </div>
                <p className="text-xs font-semibold text-white leading-snug">
                  Bernoulli equation across stenotic valve: ΔP = 4v²
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="text-[#A9E6DD] font-bold">Pressure drop</span>
                  <span className="font-mono text-[#38BDF8]">CEE Benchmark</span>
                </div>
              </aside>

              {/* Floating Intelligence Node 3 */}
              <aside
                aria-label="AI mentor recommendation"
                className={styles.floatingCard3}
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-1">
                  <Sparkles size={12} aria-hidden="true" />
                  <span>AI Mentor Suggestion</span>
                </div>
                <p className="text-xs font-semibold text-white leading-snug">
                  Revise Lenz&apos;s Law induced EMF traps before Sunday Mock Test.
                </p>
                <div className="mt-1 text-[10px] text-slate-400">
                  Target: +4 marks recovery
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
