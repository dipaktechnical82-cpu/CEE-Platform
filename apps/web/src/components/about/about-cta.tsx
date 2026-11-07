'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import styles from './about.module.css';

export function AboutCta() {
  return (
    <section
      id="about-cta"
      aria-labelledby="about-cta-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-[#F5FBFA] dark:bg-gradient-to-b dark:from-[#0A1128] dark:via-[#060A18] dark:to-[#02090F]"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-r from-[#A9E6DD]/40 via-[#B8DFF4]/30 to-[#D5F3E8]/40 blur-3xl dark:from-[#1EC5B2]/15 dark:via-[#B8DFF4]/10 dark:to-[#7367F0]/15" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Medical Aspirant Badge */}
        <div className="inline-flex items-center">
          <span className={styles.eyebrowBadge}>
            <span className={styles.eyebrowPulseDot} />
            <Stethoscope size={14} className="text-[#167A80] dark:text-[#1EC5B2]" />
            THE JOURNEY TO THE WHITE COAT
          </span>
        </div>

        {/* Closing Headline */}
        <h2
          id="about-cta-heading"
          className="mt-6 text-3xl font-black tracking-tight text-[#244A50] dark:text-white sm:text-5xl lg:text-6xl"
        >
          Your Future in Medicine{' '}
          <span className="block mt-2 bg-gradient-to-r from-[#244A50] via-[#167A80] to-[#1EC5B2] dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#7367F0] bg-clip-text text-transparent">
            Starts With One Step.
          </span>
        </h2>

        {/* Supporting Narrative */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
          Build your preparation journey with smarter tools, meaningful practice, and a
          learning experience designed around your progress.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1ec5b2] via-[#167a80] to-[#244a50] px-8 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(30,197,178,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_45px_rgba(30,197,178,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80]"
          >
            <span>Start Your Preparation</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/features"
            className="inline-flex items-center gap-2 rounded-full border border-[#244A50]/20 bg-white px-7 py-4 text-base font-semibold text-[#244A50] shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-[#F5FBFA] hover:border-[#167A80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80] dark:border-[#B8DFF4]/40 dark:bg-[#101A3C]/60 dark:text-[#F5FBFA] dark:hover:bg-[#101A3C]/90"
          >
            <span>Explore Our Features</span>
          </Link>
        </div>

        {/* Vitals Telemetry Ribbon */}
        <div className="mt-14 pt-8 border-t border-[#D5F3E8] dark:border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-[#5E848C] dark:text-[#A9B8D0]">
          <div className="flex items-center gap-2">
            <HeartPulse size={15} className="text-[#167A80] dark:text-[#1EC5B2]" />
            <span>NEPAL CEE 2026 CYCLE</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#167A80] dark:text-[#A9E6DD]" />
            <span>ADAPTIVE DIAGNOSTIC ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-[#167A80] dark:text-[#B8DFF4]" />
            <span>MBBS / BDS / ALLIED HEALTH</span>
          </div>
        </div>
      </div>
    </section>
  );
}
