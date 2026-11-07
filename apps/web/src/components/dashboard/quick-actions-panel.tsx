'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Target,
  BookOpen,
  Gamepad2,
  ChartNoAxesCombined,
  Library,
  ArrowUpRight,
  Zap,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickActionItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  isModal?: boolean;
  accent: {
    iconContainer: string;
    glow: string;
  };
}

const ACTION_ITEMS: QuickActionItem[] = [
  {
    id: 'mock-exam',
    title: 'Take Mock Exam',
    badge: 'High Yield',
    description: '200-question timed CEE test simulation',
    icon: GraduationCap,
    href: '/student/mock-tests',
    accent: {
      // Muted violet
      iconContainer:
        'bg-[#7367F0]/12 border-[#7367F0]/25 text-[#5B52D6] dark:bg-[#7367F0]/15 dark:border-[#7367F0]/30 dark:text-[#A59DF5]',
      glow: 'group-hover:border-[#7367F0]/40 group-hover:shadow-[0_0_15px_rgba(115,103,240,0.18)]',
    },
  },
  {
    id: 'practice-mcqs',
    title: 'Practice MCQs',
    badge: 'Adaptive',
    description: 'Subject-wise practice with instant answers',
    icon: Target,
    href: '/syllabus',
    accent: {
      // Sky blue
      iconContainer:
        'bg-[#B8DFF4]/30 border-[#B8DFF4] text-[#1E5F80] dark:bg-[#B8DFF4]/15 dark:border-[#B8DFF4]/30 dark:text-[#B8DFF4]',
      glow: 'group-hover:border-[#B8DFF4]/50 group-hover:shadow-[0_0_15px_rgba(184,223,244,0.2)]',
    },
  },
  {
    id: 'view-notes',
    title: 'View Notes',
    badge: 'Revision',
    description: 'Concise high-yield formula & concept sheets',
    icon: BookOpen,
    href: '/syllabus',
    accent: {
      // Aqua mint
      iconContainer:
        'bg-[#A9E6DD]/30 border-[#A9E6DD] text-[#1B6156] dark:bg-[#A9E6DD]/15 dark:border-[#A9E6DD]/30 dark:text-[#A9E6DD]',
      glow: 'group-hover:border-[#A9E6DD]/50 group-hover:shadow-[0_0_15px_rgba(169,230,221,0.2)]',
    },
  },
  {
    id: 'join-game',
    title: 'Join Game',
    badge: 'Arena',
    description: 'Live peer quiz battle & speed contest',
    icon: Gamepad2,
    isModal: true,
    accent: {
      // Soft blue
      iconContainer:
        'bg-[#88C2EE]/20 border-[#88C2EE]/40 text-[#1B5784] dark:bg-[#88C2EE]/15 dark:border-[#88C2EE]/30 dark:text-[#9DD1F5]',
      glow: 'group-hover:border-[#88C2EE]/50 group-hover:shadow-[0_0_15px_rgba(136,194,238,0.2)]',
    },
  },
  {
    id: 'check-results',
    title: 'Check Results',
    badge: 'Analytics',
    description: 'Detailed solutions, rank & percentile telemetry',
    icon: ChartNoAxesCombined,
    isModal: true,
    accent: {
      // Deep teal/aqua
      iconContainer:
        'bg-[#D5F3E8] border-[#A9E6DD]/70 text-[#244A50] dark:bg-[#244A50]/45 dark:border-[#A9E6DD]/30 dark:text-[#A9E6DD]',
      glow: 'group-hover:border-[#A9E6DD]/50 group-hover:shadow-[0_0_15px_rgba(36,74,80,0.2)]',
    },
  },
  {
    id: 'browse-books',
    title: 'Browse Books',
    badge: 'Library',
    description: 'Recommended Nepal CEE reference books',
    icon: Library,
    href: '/syllabus',
    accent: {
      // Pale mint
      iconContainer:
        'bg-[#D5F3E8]/80 border-[#A9E6DD]/50 text-[#244A50] dark:bg-[#D5F3E8]/15 dark:border-[#D5F3E8]/30 dark:text-[#D5F3E8]',
      glow: 'group-hover:border-[#D5F3E8]/50 group-hover:shadow-[0_0_15px_rgba(213,243,232,0.2)]',
    },
  },
];

export function QuickActionsPanel() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <article className="rounded-3xl border border-[#D5F3E8] dark:border-white/[0.08] bg-white dark:bg-[#101A3C]/90 p-6 shadow-[0_4px_20px_rgba(36,74,80,0.05)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md transition-colors duration-200">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#A9E6DD]/40 dark:border-white/[0.08] bg-[#D5F3E8] dark:bg-white/[0.035] text-[#244A50] dark:text-[#A9E6DD]">
              <Zap size={18} strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#244A50] dark:text-white sm:text-lg">
                Quick Actions
              </h2>
              <p className="text-xs text-[#3D6870] dark:text-[#A9B8D0]">
                Fast shortcuts for your daily medical preparation mission
              </p>
            </div>
          </div>
          <span className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full border border-[#A9E6DD]/40 bg-[#D5F3E8]/60 dark:border-[#A9E6DD]/30 dark:bg-[#A9E6DD]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#244A50] dark:text-[#A9E6DD] sm:mt-0 sm:self-center">
            <Sparkles size={12} /> Daily Tools
          </span>
        </div>

        {/* 6 Actions Grid (2 columns on mobile, 3 columns on tablet/desktop) */}
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {ACTION_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:scale-105 ${item.accent.iconContainer}`}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3D6870] dark:text-slate-400 bg-black/[0.04] dark:bg-white/[0.04]">
                      {item.badge}
                      <ArrowUpRight
                        size={12}
                        className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-sm font-bold text-[#244A50] dark:text-white group-hover:text-[#1E5F80] dark:group-hover:text-[#B8DFF4] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5B7E86] dark:text-[#A9B8D0]">
                    {item.description}
                  </p>
                </div>
              </div>
            );

            const commonClasses = `group relative flex flex-col justify-between rounded-2xl border border-[#D5F3E8] dark:border-white/[0.08] bg-[#F5FBFA] dark:bg-white/[0.035] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:border-[#A9E6DD] hover:shadow-md dark:hover:bg-white/[0.07] dark:hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD] ${item.accent.glow}`;

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  className={commonClasses}
                  href={item.href}
                  title={`${item.title} — Verified CEE curriculum`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                className={commonClasses}
                onClick={() => setActiveModal(item.id)}
                type="button"
              >
                {content}
              </button>
            );
          })}
        </div>
      </article>

      {/* Interactive Modal for "Join Game" */}
      {activeModal === 'join-game' ? (
        <div
          aria-labelledby="join-game-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[#88C2EE]/30 bg-[#0A1128] p-6 text-white shadow-2xl">
            <button
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              onClick={() => setActiveModal(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#88C2EE]/20 text-[#88C2EE]">
              <Gamepad2 size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white" id="join-game-title">
              CEE Medical Arena Quiz Battle
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#A9B8D0]">
              The interactive speed-quiz challenge is being prepared for the upcoming sprint.
              Students will be matched in 3-minute rapid-fire CEE biology and chemistry face-offs
              with live leaderboards!
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                onClick={() => setActiveModal(null)}
                type="button"
              >
                Got it
              </button>
              <Link
                className="rounded-xl bg-[#244A50] px-4 py-2 text-xs font-bold text-white hover:bg-[#1B373C] border border-[#A9E6DD]/30"
                href="/syllabus"
                onClick={() => setActiveModal(null)}
              >
                Practice Syllabus Instead
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Interactive Modal for "Check Results" */}
      {activeModal === 'check-results' ? (
        <div
          aria-labelledby="results-dialog-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[#A9E6DD]/30 bg-[#0A1128] p-6 text-white shadow-2xl">
            <button
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              onClick={() => setActiveModal(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A9E6DD]/20 text-[#A9E6DD]">
              <ChartNoAxesCombined size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white" id="results-dialog-title">
              Diagnostic Exam Results
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#A9B8D0]">
              No timed mock test submissions have been registered yet for this account. Once you
              complete your first 200-question CEE mock exam, your subject heatmaps, speed metrics,
              and ranking percentiles will display here.
            </p>
            <div className="mt-4 rounded-2xl border border-[#A9E6DD]/25 bg-[#A9E6DD]/10 p-3.5">
              <div className="flex items-center gap-2 text-[#A9E6DD]">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">Preparation Tip</span>
              </div>
              <p className="mt-1 text-[11px] text-[#A9B8D0]">
                Review the Botany and Zoology syllabi first to maximize initial diagnostic scoring.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                onClick={() => setActiveModal(null)}
                type="button"
              >
                Close
              </button>
              <Link
                className="rounded-xl bg-gradient-to-r from-[#244A50] to-[#1E3B40] px-4 py-2 text-xs font-bold text-white hover:brightness-110 border border-[#A9E6DD]/30"
                href="/syllabus"
                onClick={() => setActiveModal(null)}
              >
                Explore Syllabus
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
