'use client';

import React from 'react';
import {
  Brain,
  Cpu,
  HeartHandshake,
  LineChart,
  Search,
  Sparkles,
} from 'lucide-react';
import styles from './about.module.css';

const TECH_AREAS = [
  {
    title: 'AI-Assisted Explanations',
    description:
      'Provides conversational breakdowns of difficult concepts on demand, presenting ideas step-by-step to clarify reasoning when students hit a roadblock.',
    icon: Sparkles,
  },
  {
    title: 'Personalized Recommendations',
    description:
      'Evaluates recent question attempts to recommend which chapters and difficulty tiers deserve priority during your next study session.',
    icon: Brain,
  },
  {
    title: 'Intelligent Question Discovery',
    description:
      'Enables students to filter and discover past CEE questions by specific topics, cognitive difficulty levels, and previously missed categories.',
    icon: Search,
  },
  {
    title: 'Objective Performance Insights',
    description:
      'Summarizes accuracy trends across Botany, Zoology, Physics, Chemistry, and MAT with transparent score breakdowns and time pacing analytics.',
    icon: LineChart,
  },
  {
    title: 'Adaptive Preparation Experiences',
    description:
      'Dynamically suggests questions matching your current proficiency level, ensuring practice remains challenging without becoming demoralizing.',
    icon: Cpu,
  },
];

export function TechnologyPurpose() {
  return (
    <section
      id="technology-purpose"
      aria-labelledby="tech-purpose-heading"
      className={styles.section}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              RESPONSIBLE INNOVATION
            </span>
          </div>

          <h2
            id="tech-purpose-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Advanced Technology.{' '}
            <span className="block mt-1 bg-gradient-to-r from-[#244A50] via-[#167A80] to-[#1EC5B2] dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#7367F0] bg-clip-text text-transparent">
              Human-Centered Learning.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            We deploy modern digital tools with deep academic care. Technology exists to amplify
            human effort, make learning clearer, and assist aspiring doctors along their journey.
          </p>
        </div>

        {/* Essential Pedagogical Safeguard Banner */}
        <div className="mt-12 rounded-3xl border border-[#A9E6DD] bg-[#F5FBFA] p-6 sm:p-8 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-gradient-to-r dark:from-[#101A3C]/95 dark:to-[#131D45]/95 dark:shadow-none">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D5F3E8] border border-[#167A80]/30 text-[#167A80] dark:border-[#1EC5B2]/40 dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]">
              <HeartHandshake size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#244A50] dark:text-white">
                Our Stance: Technology Supports — It Does Not Replace Genuine Effort
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3D6870] dark:text-slate-200">
                There are no algorithmic shortcuts to becoming a competent doctor. AI cannot
                substitute for diligent personal study, critical thinking, or the wisdom of
                inspirational classroom teachers. Our technology is designed as a patient study
                assistant that helps you structure your hours, diagnose mistakes, and master core
                concepts with clarity.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Purpose-Driven Technology Applications Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_AREAS.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#D5F3E8] bg-white p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#167A80] hover:shadow-md dark:border-white/10 dark:bg-[#101A3C]/50 dark:hover:border-[#A9E6DD]/40 dark:hover:bg-[#101A3C]/80 dark:shadow-none"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D5F3E8] text-[#244A50] dark:bg-[#1EC5B2]/15 dark:text-[#A9E6DD]">
                  <Icon size={18} />
                </div>
                <h4 className="mt-4 text-base font-bold text-[#244A50] dark:text-white">
                  {area.title}
                </h4>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5E848C] dark:text-[#A9B8D0]">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
