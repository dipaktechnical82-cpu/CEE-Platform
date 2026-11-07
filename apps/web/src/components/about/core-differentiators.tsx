'use client';

import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  Dna,
  FileQuestion,
  GraduationCap,
  Radar,
  RotateCcw,
  Swords,
  Target,
  Users2,
} from 'lucide-react';
import styles from './about.module.css';

interface DifferentiatorItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'available' | 'upcoming';
  statusLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const DIFFERENTIATORS: DifferentiatorItem[] = [
  {
    id: 'ai-mentor',
    name: 'AI Personal CEE Mentor',
    tagline: 'Always-available pre-med tutor',
    description:
      'Provides conversational, step-by-step conceptual breakdowns for complex physics problems, organic mechanisms, and physiological concepts.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: Bot,
  },
  {
    id: 'mistake-dna',
    name: 'Mistake DNA',
    tagline: 'Precision error profiling',
    description:
      'Categorizes every missed question by underlying cognitive cause—conceptual gaps, calculation slips, recall failure, or trap distractors.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: Dna,
  },
  {
    id: 'ai-recovery-plan',
    name: 'AI Recovery Plan',
    tagline: 'Targeted remediation loops',
    description:
      'Automatically generates customized micro-quizzes and review notes focused strictly on the areas where you lost marks in recent practice.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: RotateCcw,
  },
  {
    id: 'smart-question-bank',
    name: 'Smart Question Bank',
    tagline: 'High-yield curriculum repository',
    description:
      'Thoroughly tagged database covering Zoology, Botany, Chemistry, Physics, and MAT with authentic past CEE questions and detailed verified rationales.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: Target,
  },
  {
    id: 'exam-simulator',
    name: 'Realistic CEE Exam Simulator',
    tagline: 'Authentic exam-hall pressure',
    description:
      'Full 3-hour, 200-question timed mock exams with official negative marking (-0.25 penalty), realistic interface, and complete score percentile reports.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: FileQuestion,
  },
  {
    id: 'adaptive-learning',
    name: 'Adaptive Learning',
    tagline: 'Dynamic difficulty modulation',
    description:
      'Automatically scales question difficulty up or down as your topic accuracy grows, keeping you in the optimal zone of cognitive challenge.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: Cpu,
  },
  {
    id: 'revision-radar',
    name: 'Smart Revision Radar',
    tagline: 'Spaced repetition memory alerts',
    description:
      'Tracks your memory decay curve and surfaces high-yield topics right before you are likely to forget them, maximizing long-term retention.',
    status: 'available',
    statusLabel: 'Available Now',
    icon: Radar,
  },
  {
    id: 'battle-arena',
    name: 'CEE Battle Arena',
    tagline: 'Live rapid-fire peer challenges',
    description:
      'Real-time head-to-head 10-question speed drills against fellow medical aspirants across Nepal with live leaderboards and instant debriefs.',
    status: 'upcoming',
    statusLabel: 'Upcoming in Roadmap',
    icon: Swords,
  },
  {
    id: 'future-doctor-pathway',
    name: 'Future Doctor Pathway',
    tagline: 'Medical college admissions guidance',
    description:
      'Comprehensive roadmap mapping past CEE cut-offs, college seat matrices (IOM, BPKIHS, PAHS, private colleges), and scholarship counseling.',
    status: 'upcoming',
    statusLabel: 'Upcoming in Roadmap',
    icon: GraduationCap,
  },
  {
    id: 'study-group-rooms',
    name: 'Study Group Rooms',
    tagline: 'Collaborative peer study pods',
    description:
      'Virtual quiet study rooms and collaborative topic sprints to keep you accountable, focused, and motivated alongside peers.',
    status: 'upcoming',
    statusLabel: 'Upcoming in Roadmap',
    icon: Users2,
  },
];

export function CoreDifferentiators() {
  const [filter, setFilter] = useState<'all' | 'available' | 'upcoming'>('all');

  const filteredItems = DIFFERENTIATORS.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <section
      id="core-differentiators"
      aria-labelledby="differentiators-heading"
      className={styles.section}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              PREPARATION ARCHITECTURE
            </span>
          </div>

          <h2
            id="differentiators-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Not Another Question Bank.{' '}
            <span className="block mt-1 bg-gradient-to-r from-[#244A50] via-[#167A80] to-[#1EC5B2] dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#7367F0] bg-clip-text text-transparent">
              A Complete Preparation Ecosystem.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            Standard question collections test what you remember. Our integrated ecosystem
            diagnoses how you think, detects hidden reasoning errors, and actively trains your
            clinical problem-solving acumen.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#167A80] text-white shadow-sm dark:bg-[#1EC5B2]'
                  : 'bg-white border border-[#D5F3E8] text-[#5E848C] hover:text-[#244A50] dark:bg-[#101A3C]/70 dark:border-white/10 dark:text-[#A9B8D0] dark:hover:text-white'
              }`}
            >
              All Features (10)
            </button>
            <button
              type="button"
              onClick={() => setFilter('available')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === 'available'
                  ? 'bg-[#167A80] text-white shadow-sm dark:bg-[#1EC5B2]'
                  : 'bg-white border border-[#D5F3E8] text-[#5E848C] hover:text-[#244A50] dark:bg-[#101A3C]/70 dark:border-white/10 dark:text-[#A9B8D0] dark:hover:text-white'
              }`}
            >
              Available Now (7)
            </button>
            <button
              type="button"
              onClick={() => setFilter('upcoming')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === 'upcoming'
                  ? 'bg-amber-600 text-white shadow-sm dark:bg-[#F59E0B]'
                  : 'bg-white border border-[#D5F3E8] text-[#5E848C] hover:text-[#244A50] dark:bg-[#101A3C]/70 dark:border-white/10 dark:text-[#A9B8D0] dark:hover:text-white'
              }`}
            >
              Upcoming in Roadmap (3)
            </button>
          </div>
        </div>

        {/* 10-Item Visual Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isAvailable = item.status === 'available';

            return (
              <div key={item.id} className={styles.differentiatorCard}>
                <div className="flex items-start justify-between gap-4">
                  <div className={styles.diffIconBay}>
                    <Icon size={22} />
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold ${
                      isAvailable
                        ? 'border border-[#167A80]/30 bg-[#D5F3E8] text-[#167A80] dark:border-[#1EC5B2]/40 dark:bg-[#1EC5B2]/15 dark:text-[#A9E6DD]'
                        : 'border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isAvailable ? 'bg-[#167A80] dark:bg-[#1EC5B2]' : 'bg-amber-500'
                      }`}
                    />
                    {item.statusLabel}
                  </span>
                </div>

                <div className="mt-5 flex-1">
                  <h3 className="text-lg font-bold text-[#244A50] dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono font-medium text-[#167A80] dark:text-[#A9E6DD] mt-0.5">
                    {item.tagline}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#5E848C] dark:text-[#A9B8D0]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
