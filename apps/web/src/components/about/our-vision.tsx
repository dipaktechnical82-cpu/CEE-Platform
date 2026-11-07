'use client';

import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Network,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
} from 'lucide-react';
import styles from './about.module.css';

interface VisionPillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  impact: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const VISION_PILLARS: VisionPillar[] = [
  {
    id: 'ecosystem',
    title: 'A Connected Learning Ecosystem',
    tagline: 'Syllabus, question bank, and simulator in one flow',
    description:
      'Replacing disjointed coaching notebooks and PDFs with a unified digital ecosystem where every question practiced connects back to verified syllabus topics and revision queues.',
    impact: 'Seamless navigation between theory, practice, and diagnosis.',
    icon: Workflow,
  },
  {
    id: 'personalization',
    title: 'Deeply Personalized Experiences',
    tagline: 'Learning adapted to each student’s pace',
    description:
      'Every medical aspirant brings unique strengths. Our vision is a platform that adapts study recommendations dynamically, so strong botanists don’t waste hours on mastered chapters while mechanics remains neglected.',
    impact: 'Efficient study schedules tailored to individual cognitive curves.',
    icon: Brain,
  },
  {
    id: 'intelligence',
    title: 'Meaningful Diagnostic Feedback',
    tagline: 'Insight beyond raw marks and percentiles',
    description:
      'Transforming a simple "wrong answer" into a diagnostic lesson. We analyze why a mistake occurred—calculation slip, conceptual confusion, or reading trap—and provide immediate restorative practice.',
    impact: 'Turning failed attempts into permanent learning milestones.',
    icon: Sparkles,
  },
  {
    id: 'trust',
    title: 'Trustworthy Medical Knowledge',
    tagline: 'Strict adherence to Nepal CEE syllabus',
    description:
      'Curating only accurate, peer-reviewed questions conforming strictly to the latest Nepal Medical Education Commission guidelines, eliminating misleading or out-of-scope materials.',
    impact: 'Complete peace of mind regarding curriculum fidelity.',
    icon: ShieldCheck,
  },
  {
    id: 'community',
    title: 'A Supportive Aspirant Community',
    tagline: 'Strength in shared pre-medical ambition',
    description:
      'Creating an encouraging environment where aspirants from Mechi to Mahakali can benchmark performance, share high-yield mnemonics, and motivate one another on the path to the white coat.',
    impact: 'Eliminating the isolation of long-haul entrance preparation.',
    icon: Users2,
  },
  {
    id: 'responsible-tech',
    title: 'Responsible AI & Continuous Growth',
    tagline: 'Technology that serves human understanding',
    description:
      'Deploying AI thoughtfully to scaffold critical medical reasoning—never as a shortcut or black-box shortcut, but as a transparent pedagogical companion that sharpens doctor-level thinking.',
    impact: 'Disciplined diagnostic thinking without cognitive complacency.',
    icon: Network,
  },
];

export function OurVision() {
  const [activeVision, setActiveVision] = useState<string>('ecosystem');
  const activeItem = VISION_PILLARS.find((v) => v.id === activeVision) ?? VISION_PILLARS[0];

  return (
    <section
      id="our-vision"
      aria-labelledby="our-vision-heading"
      className={`${styles.section} bg-[#EAF8F4]/50 dark:bg-[#0A1128]/70`}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              LONG-TERM HORIZON
            </span>
          </div>

          <h2
            id="our-vision-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Building the Future of Medical Entrance Preparation.
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            We envision an educational landscape where every student in Nepal has access to
            the world-class diagnostic tools, personalized guidance, and authentic exam
            preparation needed to achieve their highest medical potential.
          </p>
        </div>

        {/* Vision Matrix Layout: Interactive Left Selector + Dynamic Right Projection */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 6 Vision Principles List */}
          <div className="lg:col-span-7 space-y-3.5">
            {VISION_PILLARS.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === activeVision;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveVision(item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 border ${
                    isSelected
                      ? 'border-[#167A80] bg-white shadow-md dark:border-[#A9E6DD] dark:bg-gradient-to-r dark:from-[#101A3C] dark:to-[#131D45] dark:shadow-lg'
                      : 'border-[#D5F3E8] bg-white hover:border-[#167A80] dark:border-white/10 dark:bg-[#101A3C]/30 dark:hover:border-white/20 dark:hover:bg-[#101A3C]/50'
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-[#167A80]/30 bg-[#D5F3E8] text-[#167A80] dark:border-[#A9E6DD]/40 dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]'
                        : 'border-[#D5F3E8] bg-[#F5FBFA] text-[#5E848C] dark:border-white/10 dark:bg-white/5 dark:text-[#A9B8D0]'
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-base font-bold truncate ${
                          isSelected
                            ? 'text-[#244A50] dark:text-white'
                            : 'text-[#244A50] dark:text-[#F5FBFA]'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {isSelected && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#167A80] dark:text-[#A9E6DD]">
                          <CheckCircle2 size={12} />
                          ACTIVE FOCUS
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#5E848C] dark:text-[#A9B8D0] truncate">
                      {item.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Impact Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-[#D5F3E8] bg-white p-6 sm:p-8 shadow-xl dark:border-white/10 dark:bg-gradient-to-b dark:from-[#101A3C] dark:to-[#0A1128] dark:shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D5F3E8] border border-[#167A80]/20 text-[#167A80] dark:border-[#1EC5B2]/40 dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]">
                  <activeItem.icon size={24} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD]">
                    Vision Spotlight
                  </span>
                  <h3 className="text-xl font-extrabold text-[#244A50] dark:text-white">
                    {activeItem.title}
                  </h3>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                {activeItem.description}
              </p>

              {/* Expected Student Impact Box */}
              <div className="mt-6 rounded-2xl border border-[#A9E6DD] bg-[#EAF8F4] p-4 dark:border-white/10 dark:bg-[#060A18]/60">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD]">
                  <Sparkles size={14} />
                  <span>Transformative Impact for Aspirants</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-[#244A50] dark:text-slate-200">
                  {activeItem.impact}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-5 border-t border-[#E5F1EF] dark:border-white/10 flex items-center justify-between text-xs text-[#5E848C] dark:text-[#A9B8D0]">
                <span>Ecosystem Horizon</span>
                <span className="font-mono font-bold text-[#167A80] dark:text-[#A9E6DD]">
                  Nepal CEE Preparation Cycle 2026+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
