'use client';

import React from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Cpu,
  LineChart,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import styles from './mock-tests.module.css';

interface MockTestsHeroProps {
  onExploreClick: () => void;
  onPerformanceClick: () => void;
}

export function MockTestsHero({ onExploreClick, onPerformanceClick }: MockTestsHeroProps) {
  return (
    <section className={styles.heroSection} aria-labelledby="mock-hero-heading">
      <div className={styles.heroGlowOrb} aria-hidden="true" />
      <div className={styles.heroGlowOrbSecondary} aria-hidden="true" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7">
            <div className={styles.eyebrow}>
              <Cpu size={14} className="text-[#A9E6DD]" aria-hidden="true" />
              <span>YOUR CEE EXAMINATION COMMAND CENTER</span>
            </div>

            <h1 id="mock-hero-heading" className={styles.heroHeading}>
              Prepare Like It&apos;s the{' '}
              <span className={styles.heroGradientText}>Real Examination.</span>
            </h1>

            <p className={styles.heroDescription}>
              Challenge your knowledge, experience exam conditions, understand your performance, and
              build the confidence to move closer to medical school.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(14,134,149,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(14,134,149,0.45)] focus-visible:outline-2 focus-visible:outline-[#A9E6DD]"
              >
                <span>Explore Mock Tests</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onPerformanceClick}
                className="inline-flex items-center gap-2 rounded-full border border-[#B8DFF4]/40 bg-white/5 px-6 py-3.5 text-sm font-semibold transition-all hover:bg-white/10 hover:border-[#A9E6DD] focus-visible:outline-2 focus-visible:outline-[#B8DFF4]"
              >
                <LineChart size={18} className="text-[#A9E6DD]" aria-hidden="true" />
                <span>View My Performance</span>
              </button>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="mt-8 pt-6 border-t border-inherit flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />
                <span>MEC Blueprint Aligned (200 MCQs)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />
                <span>180-Minute Authentic Timing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />
                <span>-0.25 Negative Marking Rules</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Examination Control Deck */}
          <div className="lg:col-span-5">
            <div className={styles.diagnosticDeck}>
              {/* Deck Header */}
              <div className={styles.diagnosticHeader}>
                <div className="flex items-center gap-2 text-[#A9E6DD]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold tracking-wider">CEE-CBT SIMULATOR // VER 2026.4</span>
                </div>
                <span className="text-[11px] font-mono opacity-60">TELEMETRY: ACTIVE</span>
              </div>

              {/* Central Readiness & Timer Gauge */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-inherit bg-white/[0.03] p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#A9E6DD]">
                    <Clock size={14} aria-hidden="true" />
                    <span>EXAM TIMER</span>
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[#B8DFF4]">
                    02:47:19
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">180m Session Limit</p>
                </div>

                <div className="rounded-xl border border-inherit bg-white/[0.03] p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#A9E6DD]">
                    <Award size={14} aria-hidden="true" />
                    <span>READINESS INDEX</span>
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                    78.4%
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Based on past mocks</p>
                </div>
              </div>

              {/* Subject Distribution Bar */}
              <div className="mt-5 rounded-xl border border-inherit bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Subject Mark Distribution</span>
                  <span className="font-mono text-[#A9E6DD]">200 Marks Total</span>
                </div>

                <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-700/40">
                  <div
                    className="bg-[#A9E6DD] transition-all"
                    style={{ width: '40%' }}
                    title="Biology: 80 Marks (40%)"
                  />
                  <div
                    className="bg-[#B8DFF4] transition-all"
                    style={{ width: '25%' }}
                    title="Chemistry: 50 Marks (25%)"
                  />
                  <div
                    className="bg-[#7367F0] transition-all"
                    style={{ width: '25%' }}
                    title="Physics: 50 Marks (25%)"
                  />
                  <div
                    className="bg-[#38BDF8] transition-all"
                    style={{ width: '10%' }}
                    title="MAT: 20 Marks (10%)"
                  />
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div>
                    <span className="inline-block h-2 w-2 rounded-full bg-[#A9E6DD] mr-1" />
                    <span className="font-medium">Bio (80)</span>
                  </div>
                  <div>
                    <span className="inline-block h-2 w-2 rounded-full bg-[#B8DFF4] mr-1" />
                    <span className="font-medium">Chem (50)</span>
                  </div>
                  <div>
                    <span className="inline-block h-2 w-2 rounded-full bg-[#7367F0] mr-1" />
                    <span className="font-medium">Phys (50)</span>
                  </div>
                  <div>
                    <span className="inline-block h-2 w-2 rounded-full bg-[#38BDF8] mr-1" />
                    <span className="font-medium">MAT (20)</span>
                  </div>
                </div>
              </div>

              {/* Real-time Palette State Preview */}
              <div className="mt-4 pt-4 border-t border-inherit flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  <span>Answered: 134</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                  <span>Review: 14</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
                  <span>Pending: 52</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
