'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Dna,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import styles from './about.module.css';

export function AboutHero() {
  const scrollToStory = () => {
    const el = document.getElementById('our-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-labelledby="about-hero-heading"
      className={styles.heroContainer}
    >
      {/* Atmosphere Glow & Medical Blueprint Grid */}
      <div className={styles.heroAtmosphere} aria-hidden="true">
        <div className={styles.heroGlowPrimary} />
        <div className={styles.heroGlowSecondary} />
        <div className={styles.medicalGridOverlay} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Narrative Headline & Mission Intent */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Medical-Tech Eyebrow Badge */}
            <div className="inline-flex items-center">
              <span className={styles.eyebrowBadge}>
                <span className={styles.eyebrowPulseDot} />
                <Activity size={14} className="text-[#167A80] dark:text-[#1EC5B2]" />
                OUR PURPOSE & VISION // NEPAL CEE
              </span>
            </div>

            <h1
              id="about-hero-heading"
              className="mt-6 text-3xl font-black tracking-tight text-[#244A50] dark:text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]"
            >
              <span className="block text-[#244A50] dark:text-slate-100">
                More Than Preparation.
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[#244A50] via-[#167A80] to-[#1EC5B2] dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#7367F0] bg-clip-text text-transparent">
                A Mission to Shape Future Doctors.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-lg lg:text-xl">
              We are building a smarter, more personal, and more accessible way for
              aspiring medical students in Nepal to prepare for their future.
            </p>

            {/* Quick Proof Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
              <div className="flex items-center gap-2 rounded-xl border border-[#D5F3E8] bg-white px-3.5 py-2 text-xs font-semibold text-[#244A50] shadow-sm dark:border-white/10 dark:bg-[#101A3C]/70 dark:text-[#D5F3E8]">
                <CheckCircle2 size={15} className="text-[#167A80] dark:text-[#A9E6DD]" />
                <span>Conceptual Focus</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#D5F3E8] bg-white px-3.5 py-2 text-xs font-semibold text-[#244A50] shadow-sm dark:border-white/10 dark:bg-[#101A3C]/70 dark:text-[#D5F3E8]">
                <Brain size={15} className="text-[#167A80] dark:text-[#B8DFF4]" />
                <span>Intelligent Diagnostic Mentorship</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#D5F3E8] bg-white px-3.5 py-2 text-xs font-semibold text-[#244A50] shadow-sm dark:border-white/10 dark:bg-[#101A3C]/70 dark:text-[#D5F3E8]">
                <HeartPulse size={15} className="text-[#167A80] dark:text-[#A9E6DD]" />
                <span>Nepal CEE Focused</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1ec5b2] via-[#167a80] to-[#244a50] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(30,197,178,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(30,197,178,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80]"
              >
                <span>Join Aspiring Doctors</span>
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={scrollToStory}
                className="inline-flex items-center gap-2 rounded-full border border-[#244A50]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#244A50] shadow-sm transition-all duration-200 hover:bg-[#F5FBFA] hover:border-[#167A80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80] dark:border-[#B8DFF4]/40 dark:bg-[#101A3C]/40 dark:text-[#F5FBFA] dark:hover:bg-[#101A3C]/80"
              >
                <span>Read Our Story</span>
              </button>
            </div>
          </div>

          {/* Right Column: Medical + AI Visual Composition */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            {/* Visual Showcase Card */}
            <div className="relative rounded-3xl border border-[#D5F3E8] bg-white p-3 shadow-xl sm:p-5 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#101A3C] dark:to-[#0A1128] dark:shadow-2xl">
              {/* Image Frame with Guaranteed Responsive Height */}
              <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-2xl bg-[#060A18]">
                <Image
                  src="/images/student-dashboard/smart-learning-hologram.png"
                  alt="Medical student reviewing interactive 3D human anatomy holographic diagnostics with smart learning assistance"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent opacity-70"
                />
                
                {/* Visual Telemetry Overlay on bottom of image */}
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/20 bg-[#060A18]/85 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1EC5B2]/20 text-[#A9E6DD]">
                      <Stethoscope size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold tracking-wider text-white uppercase font-mono">
                        Aspirant Diagnostic Radar
                      </div>
                      <div className="text-[10px] text-[#A9E6DD]">
                        Active Syllabus: 200 Questions CEE Grid
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#1EC5B2]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#A9E6DD]">
                    100% CEE ALIGNED
                  </span>
                </div>
              </div>

              {/* Floating Element 1: Top-Right Educational Question Card */}
              <div
                className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-[#D5F3E8] bg-white px-4 py-2.5 shadow-lg dark:border-[#B8DFF4]/40 dark:bg-[#0A1128]/95 dark:shadow-2xl"
                style={{ animation: 'floatSlow 7s ease-in-out infinite' }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D5F3E8] text-[#244A50] dark:bg-[#7367F0]/20 dark:text-[#A9E6DD]">
                  <Dna size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#244A50] dark:text-white">
                    Mistake DNA Architecture
                  </div>
                  <div className="text-[10px] text-[#5E848C] dark:text-[#A9B8D0]">
                    Turning errors into mastery
                  </div>
                </div>
              </div>

              {/* Floating Element 2: Bottom-Left Mentorship Card */}
              <div
                className="absolute -bottom-5 -left-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-[#D5F3E8] bg-white px-4 py-2.5 shadow-lg dark:border-[#A9E6DD]/40 dark:bg-[#0A1128]/95 dark:shadow-2xl"
                style={{ animation: 'floatSlow 9s ease-in-out infinite 1.5s' }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D5F3E8] text-[#167A80] dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#244A50] dark:text-white">
                    AI Personal CEE Mentor
                  </div>
                  <div className="text-[10px] text-[#5E848C] dark:text-[#A9B8D0]">
                    Conceptual guidance on demand
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator at base of hero */}
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={scrollToStory}
            aria-label="Scroll down to read our story"
            className={styles.scrollIndicator}
          >
            <span className={styles.scrollMouse}>
              <span className={styles.scrollWheel} />
            </span>
            <span>Explore Our Mission</span>
          </button>
        </div>
      </div>
    </section>
  );
}
