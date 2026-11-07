'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import styles from './features.module.css';

export function FeaturesCtaSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-28 bg-[#040714] dark:bg-[#02050E]">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(30, 197, 178, 0.18) 0%, rgba(184, 223, 244, 0.08) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className={styles.sectionInner}>
        <div className="relative rounded-3xl border border-[#B8DFF4]/20 bg-gradient-to-b from-[#0A1224] to-[#060B18] p-8 sm:p-12 lg:p-16 text-center shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Subtle medical ECG SVG trace in background */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-10"
            aria-hidden="true"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              fill="none"
              stroke="#A9E6DD"
              strokeWidth="2"
            >
              <path d="M0 50 L300 50 L320 30 L340 70 L360 10 L380 90 L400 50 L600 50 L620 30 L640 70 L660 10 L680 90 L700 50 L1000 50" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Eyebrow */}
            <div className={styles.eyebrowBadge}>
              <Sparkles size={12} className="text-[#A9E6DD]" aria-hidden="true" />
              <span>YOUR FUTURE STARTS WITH ONE DECISION</span>
            </div>

            {/* Main Heading */}
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Your Dream of Becoming a Doctor{' '}
              <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
                Deserves a Smarter Journey.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 dark:text-[#A9B8D0] leading-relaxed max-w-2xl mx-auto">
              Build stronger concepts, understand your mistakes, prepare strategically and move
              forward with confidence. Join thousands of future doctors preparing for Nepal CEE.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1ec5b2] to-[#0a92a8] px-8 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(30,197,178,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(30,197,178,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
              >
                <span>Start Your Preparation</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/syllabus"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8DFF4]"
              >
                <BookOpen size={18} aria-hidden="true" />
                <span>Explore the Syllabus</span>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#A9E6DD]" aria-hidden="true" />
                <span>100% MEC Nepal Syllabus Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" aria-hidden="true" />
                <span>Faculty Verified Explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse size={16} className="text-[#38BDF8]" aria-hidden="true" />
                <span>Personalized Mistake Diagnostics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
