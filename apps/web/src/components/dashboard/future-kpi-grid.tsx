'use client';

import { BookOpenCheck, ClipboardCheck, Clock3, Trophy } from 'lucide-react';
import { FutureKpiCard } from './future-kpi-card';

interface FutureKpiGridProps {
  studyTime?: { value: string; subtext: string; trend?: string; isEmpty?: boolean };
  mockTests?: { value: string; subtext: string; trend?: string; isEmpty?: boolean };
  questions?: { value: string; subtext: string; trend?: string; isEmpty?: boolean };
  rank?: { value: string; subtext: string; trend?: string; isEmpty?: boolean };
  isDevPreview?: boolean;
}

/** Sample 30-day realistic trajectory sparkline points */
const SAMPLE_STUDY_POINTS = [12, 18, 14, 25, 30, 28, 42, 38, 55, 62, 58, 70];
const SAMPLE_MOCK_POINTS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7];
const SAMPLE_QUESTION_POINTS = [110, 180, 240, 390, 480, 620, 750, 920, 1100, 1280, 1360, 1420];
const SAMPLE_RANK_POINTS = [45, 38, 40, 32, 28, 25, 22, 19, 16, 15, 14, 12]; // lower is better in rank

export function FutureKpiGrid({
  studyTime = { value: '—', subtext: 'No sessions recorded yet', isEmpty: true },
  mockTests = { value: '—', subtext: 'No mock tests completed', isEmpty: true },
  questions = { value: '—', subtext: 'No questions answered yet', isEmpty: true },
  rank = { value: '—', subtext: 'Available after first mock test', isEmpty: true },
  isDevPreview = false,
}: FutureKpiGridProps) {
  const previewBadge = isDevPreview ? (
    <span className="inline-block rounded-full bg-orange-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-400 border border-orange-400/20">
      Preview
    </span>
  ) : null;

  return (
    <section aria-label="Key Performance Indicators" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3D6870] dark:text-[#A9B8D0]">
            Performance Metrics
          </p>
          {previewBadge}
        </div>
        <p className="text-[11px] text-[#5B7E86] dark:text-slate-500">Updated in real-time</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Study Time (Sky Blue #B8DFF4) */}
        <FutureKpiCard
          accentBg="bg-[#B8DFF4]/25 dark:bg-[#B8DFF4]/15"
          accentColor="#5BA3D9"
          accentGlow="shadow-xs dark:shadow-[0_0_12px_rgba(184,223,244,0.18)]"
          accentText="text-[#1E5F80] dark:text-[#B8DFF4]"
          badge={previewBadge}
          icon={Clock3}
          isEmpty={studyTime.isEmpty}
          label="Total Study Time"
          sparklineData={SAMPLE_STUDY_POINTS}
          sparklineId="sp-study-time"
          subtext={studyTime.subtext}
          trend={studyTime.trend ?? '+4.2h this week'}
          trendPositive={true}
          value={studyTime.value}
        />

        {/* Card 2: Mock Tests Completed (Muted Violet #7367F0) */}
        <FutureKpiCard
          accentBg="bg-[#7367F0]/15 dark:bg-[#7367F0]/15"
          accentColor="#7367F0"
          accentGlow="shadow-xs dark:shadow-[0_0_12px_rgba(115,103,240,0.2)]"
          accentText="text-[#5B52D6] dark:text-[#A59DF5]"
          badge={previewBadge}
          icon={ClipboardCheck}
          isEmpty={mockTests.isEmpty}
          label="Mock Tests Completed"
          sparklineData={SAMPLE_MOCK_POINTS}
          sparklineId="sp-mock-tests"
          subtext={mockTests.subtext}
          trend={mockTests.trend ?? '+2 completed'}
          trendPositive={true}
          value={mockTests.value}
        />

        {/* Card 3: Questions Practiced (Aqua Mint #A9E6DD) */}
        <FutureKpiCard
          accentBg="bg-[#A9E6DD]/30 dark:bg-[#A9E6DD]/15"
          accentColor="#38B3A0"
          accentGlow="shadow-xs dark:shadow-[0_0_12px_rgba(169,230,221,0.2)]"
          accentText="text-[#1B6156] dark:text-[#A9E6DD]"
          badge={previewBadge}
          icon={BookOpenCheck}
          isEmpty={questions.isEmpty}
          label="Questions Practiced"
          sparklineData={SAMPLE_QUESTION_POINTS}
          sparklineId="sp-questions"
          subtext={questions.subtext}
          trend={questions.trend ?? '+185 questions'}
          trendPositive={true}
          value={questions.value}
        />

        {/* Card 4: Current Rank (Deep Teal & Aqua #244A50 / #A9E6DD) */}
        <FutureKpiCard
          accentBg="bg-[#D5F3E8] dark:bg-[#244A50]/40"
          accentColor="#244A50"
          accentGlow="shadow-xs dark:shadow-[0_0_12px_rgba(36,74,80,0.25)]"
          accentText="text-[#244A50] dark:text-[#A9E6DD]"
          badge={previewBadge}
          icon={Trophy}
          isEmpty={rank.isEmpty}
          label="Current Rank"
          sparklineData={SAMPLE_RANK_POINTS}
          sparklineId="sp-rank"
          subtext={rank.subtext}
          trend={rank.trend ?? 'Top 2.4% percentile'}
          trendPositive={true}
          value={rank.value}
        />
      </div>
    </section>
  );
}
