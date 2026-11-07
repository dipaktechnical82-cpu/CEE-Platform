'use client';

import React, { useState } from 'react';
import {
  Lightbulb,
  Repeat,
  Target,
  TrendingUp,
} from 'lucide-react';
import styles from './about.module.css';

interface PrincipleItem {
  number: string;
  title: string;
  tagline: string;
  coreBelief: string;
  inPractice: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PHILOSOPHY_PRINCIPLES: PrincipleItem[] = [
  {
    number: '01',
    title: 'Understand Before Memorizing',
    tagline: 'Deep Conceptual First-Principles',
    coreBelief:
      'Medical education is not about rote retention; it is about building robust mental models that endure under high exam pressure.',
    inPractice:
      'Rather than memorizing isolated formulas or facts, we ground every explanation in underlying biological and physical mechanics, from cardiac action potentials to thermodynamic equilibrium.',
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'Learn From Every Mistake',
    tagline: 'Errors Are High-Yield Learning Signals',
    coreBelief:
      'A mistake is not a measure of intelligence; it is the most precise diagnostic indicator of where your understanding needs refinement.',
    inPractice:
      'Every incorrect option chosen triggers a diagnostic breakdown. We isolate whether the error stemmed from a misleading distractor, calculation oversight, or fundamental concept gap.',
    icon: Repeat,
  },
  {
    number: '03',
    title: 'Practice With Purpose',
    tagline: 'Targeted High-Yield Focus',
    coreBelief:
      'Doing 5,000 random questions without reflection yields less growth than solving 500 carefully structured, challenging questions with thorough debriefs.',
    inPractice:
      'Our practice sessions are dynamically calibrated. We target high-weight CEE syllabus chapters and tailor sets specifically to strengthen your identified weaknesses.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Improve Every Day',
    tagline: 'Consistency Compounds Into Success',
    coreBelief:
      'Medical entrance triumph is built on small, disciplined daily breakthroughs that compound steadily across months of preparation.',
    inPractice:
      'Through spaced repetition alerts, visual streak meters, and daily diagnostic micro-goals, we help students build enduring study stamina without burnout.',
    icon: TrendingUp,
  },
];

export function LearningPhilosophy() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const activePrinciple = PHILOSOPHY_PRINCIPLES[activeStep];

  return (
    <section
      id="learning-philosophy"
      aria-labelledby="philosophy-heading"
      className={`${styles.section} bg-[#EAF8F4]/50 dark:bg-[#0A1128]/70`}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              PEDAGOGICAL VALUES
            </span>
          </div>

          <h2
            id="philosophy-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            We Believe Every Student Learns Differently.
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            Our learning philosophy puts the student at the center. By combining genuine
            conceptual mastery with diagnostic self-awareness, we help aspirants develop the
            analytical habits of future doctors.
          </p>
        </div>

        {/* 4 Horizontal Numbered Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHILOSOPHY_PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon;
            const isCurrent = index === activeStep;
            return (
              <button
                key={principle.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`text-left p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between border ${
                  isCurrent
                    ? 'border-[#167A80] bg-white shadow-lg dark:border-[#A9E6DD] dark:bg-gradient-to-b dark:from-[#101A3C] dark:to-[#131D45] dark:shadow-xl'
                    : 'border-[#D5F3E8] bg-white hover:border-[#167A80] dark:border-white/10 dark:bg-[#101A3C]/40 dark:hover:border-white/20 dark:hover:bg-[#101A3C]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#167A80] dark:text-[#A9E6DD]">
                      {principle.number}
                    </span>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isCurrent
                          ? 'bg-[#D5F3E8] text-[#167A80] dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]'
                          : 'bg-[#F5FBFA] text-[#5E848C] dark:bg-white/5 dark:text-[#A9B8D0]'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#244A50] dark:text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono font-medium text-[#167A80] dark:text-[#A9E6DD]">
                    {principle.tagline}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-[#5E848C] dark:text-[#A9B8D0]">
                    {principle.coreBelief}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5F1EF] dark:border-white/10">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#167A80] dark:text-[#B8DFF4]">
                    <span>In Practice</span>
                    <span>→</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Philosophy Deep-Dive Banner */}
        <div className="mt-10 rounded-3xl border border-[#A9E6DD] bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-gradient-to-r dark:from-[#101A3C] dark:via-[#131D45] dark:to-[#101A3C] dark:shadow-none">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D5F3E8] font-mono text-sm font-bold text-[#167A80] dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]">
                {activePrinciple.number}
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#244A50] dark:text-white">
                  {activePrinciple.title}
                </h4>
                <p className="text-xs text-[#167A80] dark:text-[#A9E6DD]">
                  How this shapes your preparation
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#244A50]/10 px-3 py-1 font-mono text-xs font-semibold text-[#244A50] dark:bg-white/10 dark:text-[#D5F3E8]">
              CORE PEDAGOGY
            </span>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#3D6870] dark:text-slate-200">
            {activePrinciple.inPractice}
          </p>
        </div>
      </div>
    </section>
  );
}
