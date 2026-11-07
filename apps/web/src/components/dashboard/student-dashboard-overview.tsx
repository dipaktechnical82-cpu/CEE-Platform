'use client';

import React from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Flame,
  Medal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FutureDoctorHero } from '@/components/dashboard/future-doctor-hero';
import { FutureKpiGrid } from '@/components/dashboard/future-kpi-grid';
import { QuickActionsPanel } from '@/components/dashboard/quick-actions-panel';
import { SmartPreparationCard } from '@/components/dashboard/smart-preparation-card';
import { DEV_PREVIEW_JOURNEY } from '@/types/dashboard';

// ---------------------------------------------------------------------------
// Lower Section Components (Preserved and styled to match futuristic theme)
// ---------------------------------------------------------------------------

function PanelHeading({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9E6DD]/40 dark:border-white/[0.08] bg-[#D5F3E8] dark:bg-white/[0.035] text-[#244A50] dark:text-[#A9E6DD] shadow-xs dark:shadow-[0_0_12px_rgba(169,230,221,0.15)]">
        <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
      </span>
      <div>
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#244A50] dark:text-[#A9E6DD]/85">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-0.5 text-sm font-bold text-[#244A50] dark:text-white sm:text-base">
          {title}
        </h2>
      </div>
    </div>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-4 py-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A9E6DD]/30 bg-[#A9E6DD]/15 text-[#1B6156] dark:text-[#A9E6DD] shadow-xs dark:shadow-[0_0_15px_rgba(169,230,221,0.15)]">
        <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
      </span>
      <p className="mt-3.5 text-sm font-semibold text-[#244A50] dark:text-slate-200">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-[#3D6870] dark:text-[#A9B8D0]">
        {description}
      </p>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Exported Overview Component
// ---------------------------------------------------------------------------

/**
 * Student Dashboard Overview — Futuristic Medical Mission Control Redesign.
 *
 * Upper Section:
 *   1. Future Doctor Journey Hero Banner (with white-coat aspirant, stethoscope,
 *      glowing destination, ECG line, and 3 connected indicators).
 *   2. Four Futuristic KPI Cards (Electric blue, violet, neon cyan, medical gold
 *      with mini SVG sparklines).
 *
 * Lower Section (Enhanced):
 *   3. Interactive Quick Actions Panel (6 tiles) + AI Insights Companion Card (with robot artwork).
 *   4. Performance overview & subject progress panels.
 *   5. Upcoming schedule & daily mission plan.
 *   6. Consistency streak & National merit leaderboard.
 *   7. Future Doctor Mission CTA banner.
 */
export function StudentDashboardOverview() {
  const journey = DEV_PREVIEW_JOURNEY;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Main Hero: Future Doctor Journey                                  */}
      {/* ------------------------------------------------------------------ */}
      <FutureDoctorHero
        averageScore={journey.averagePerformance ?? 82.5}
        isDevPreview={true}
        preparationPercent={journey.preparationPercent}
        topicsCompleted={journey.topicsCompleted}
        totalTopics={journey.totalTopics}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 2. Four Futuristic KPI Cards                                         */}
      {/* ------------------------------------------------------------------ */}
      <FutureKpiGrid
        isDevPreview={true}
        mockTests={{
          value: '7',
          subtext: 'Examination practice',
          trend: '+2 mock tests this month',
          isEmpty: false,
        }}
        questions={{
          value: '1,420',
          subtext: 'Attempted in practice sets',
          trend: '+185 questions this week',
          isEmpty: false,
        }}
        rank={{
          value: '#12',
          subtext: 'Top 2.4% percentile rank',
          trend: 'Improved +3 positions',
          isEmpty: false,
        }}
        studyTime={{
          value: '24h 15m',
          subtext: 'Total focused study time',
          trend: '+4.2h vs last week',
          isEmpty: false,
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 3. New 2-Column Section: Quick Actions + Smart AI Insights Card     */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Daily preparation launchpad and AI insights"
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <QuickActionsPanel />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <SmartPreparationCard />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Performance & Subject Breakdown Panels                           */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Performance panels"
        className="grid grid-cols-1 gap-5 xl:grid-cols-12"
        id="performance-overview"
      >
        <article className="rounded-3xl border border-[#D5F3E8] dark:border-white/[0.08] bg-white dark:bg-[#101A3C]/90 p-6 shadow-[0_4px_20px_rgba(36,74,80,0.05)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md xl:col-span-7">
          <PanelHeading
            eyebrow="Diagnostic Telemetry"
            icon={ChartNoAxesCombined}
            title="Performance Overview"
          />
          <div className="mt-4 border-t border-[#D5F3E8]/60 dark:border-white/[0.06]">
            <EmptyPanel
              description="Your accuracy curve and subject heatmaps will populate after your first timed diagnostic session."
              icon={Activity}
              title="No Performance Data Recorded"
            />
          </div>
        </article>

        <article className="rounded-3xl border border-[#D5F3E8] dark:border-white/[0.08] bg-white dark:bg-[#101A3C]/90 p-6 shadow-[0_4px_20px_rgba(36,74,80,0.05)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md xl:col-span-5">
          <PanelHeading
            eyebrow="Curriculum Mastery"
            icon={BookOpenCheck}
            title="Subject-wise Progress"
          />
          <div className="mt-4 border-t border-[#D5F3E8]/60 dark:border-white/[0.06]">
            <EmptyPanel
              description="Progress across Physics, Chemistry, Botany, Zoology, and MAT builds automatically as you study."
              icon={CircleHelp}
              title="Curriculum Telemetry Ready"
            />
          </div>
        </article>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Study Planning & Daily Mission Schedule                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Study planning and schedule"
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <article className="rounded-3xl border border-[#D5F3E8] dark:border-white/[0.08] bg-white dark:bg-[#101A3C]/90 p-6 shadow-[0_4px_20px_rgba(36,74,80,0.05)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md">
          <PanelHeading eyebrow="Timeline" icon={CalendarDays} title="Upcoming Sessions" />
          <div className="mt-4 border-t border-[#D5F3E8]/60 dark:border-white/[0.06]">
            <EmptyPanel
              description="Scheduled live mentor sessions and institutional mock tests will appear on your timeline."
              icon={CalendarDays}
              title="Nothing Scheduled Today"
            />
          </div>
        </article>

        <article className="rounded-3xl border border-[#D5F3E8] dark:border-white/[0.08] bg-white dark:bg-[#101A3C]/90 p-6 shadow-[0_4px_20px_rgba(36,74,80,0.05)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md">
          <PanelHeading eyebrow="Daily Focus" icon={Clock3} title="Today's Mission Plan" />
          <div className="mt-4 border-t border-[#D5F3E8]/60 dark:border-white/[0.06]">
            <EmptyPanel
              description="Your high-yield syllabus topics are queued and ready to explore."
              icon={ClipboardCheck}
              title="Mission Plan Ready"
            >
              <Link
                className="mt-3.5 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-[#A9E6DD] bg-[#D5F3E8] px-3.5 text-xs font-bold text-[#244A50] hover:bg-[#A9E6DD]/40 dark:border-[#A9E6DD]/30 dark:bg-[#A9E6DD]/10 dark:text-[#A9E6DD] dark:hover:bg-[#A9E6DD]/20 transition"
                href="/syllabus"
              >
                Browse CEE Syllabus <ArrowRight aria-hidden="true" size={14} />
              </Link>
            </EmptyPanel>
          </div>
        </article>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Motivation & Consistency Cards                                   */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Consistency and achievement previews"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <article className="flex items-center gap-4 rounded-3xl border border-[#A9E6DD]/60 dark:border-white/[0.08] bg-[#D5F3E8]/60 dark:bg-[#101A3C]/90 p-5 shadow-xs dark:shadow-[0_8px_24px_rgba(5,8,23,0.5)] backdrop-blur-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#A9E6DD] bg-[#A9E6DD]/30 text-[#1B6156] dark:border-[#A9E6DD]/30 dark:bg-[#A9E6DD]/15 dark:text-[#A9E6DD] shadow-xs">
            <Flame aria-hidden="true" size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#244A50] dark:text-[#A9E6DD]/90">
              Study Streak Protocol
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#244A50] dark:text-white">
              Daily consistency beats last-minute cramming.
            </p>
            <p className="mt-1 text-[11px] text-[#3D6870] dark:text-[#A9B8D0]">
              Maintained automatically with each completed session.
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-3xl border border-[#B8DFF4]/60 dark:border-white/[0.08] bg-[#B8DFF4]/20 dark:bg-[#101A3C]/90 p-5 shadow-xs dark:shadow-[0_8px_24px_rgba(5,8,23,0.5)] backdrop-blur-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B8DFF4] bg-[#B8DFF4]/40 text-[#1E5F80] dark:border-[#B8DFF4]/30 dark:bg-[#B8DFF4]/15 dark:text-[#B8DFF4] shadow-xs">
            <Medal aria-hidden="true" size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E5F80] dark:text-[#B8DFF4]/90">
              National Merit Leaderboard
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#244A50] dark:text-white">
              Benchmark your preparation against all Nepal aspirants.
            </p>
            <p className="mt-1 text-[11px] text-[#3D6870] dark:text-[#A9B8D0]">
              Unlocks after submitting your first verified mock examination.
            </p>
          </div>
        </article>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Motivational Footer Banner                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="A message for your CEE journey"
        className="relative isolate overflow-hidden rounded-3xl border border-[#A9E6DD]/50 dark:border-[#A9E6DD]/20 bg-gradient-to-r from-[#EAF8F4] via-[#D5F3E8]/80 to-[#B8DFF4]/40 dark:from-[#0A122A] dark:via-[#0E1B3A] dark:to-[#122A38] px-6 py-7 shadow-sm dark:shadow-[0_18px_40px_rgba(3,7,22,0.8)] sm:px-8 sm:py-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#A9E6DD]/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#244A50] dark:text-[#A9E6DD]/90">
              Future Doctor Mission
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#244A50] dark:text-white sm:text-2xl">
              Every great medical career begins with one focused session.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
              Review the verified syllabus, practice high-yield MCQs, and stay disciplined every
              day.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#244A50] hover:bg-[#1B373C] text-white dark:bg-gradient-to-r dark:from-[#7367F0] dark:to-[#5B52D6] dark:hover:from-[#6457E2] dark:hover:to-[#4F45C7] px-5 text-sm font-bold shadow-[0_4px_16px_rgba(36,74,80,0.2)] dark:shadow-[0_0_20px_rgba(115,103,240,0.35)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD]"
            href="/syllabus"
          >
            Start Exploring <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
