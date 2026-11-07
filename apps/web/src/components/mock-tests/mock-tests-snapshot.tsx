'use client';

import React from 'react';
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  FileCheck2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { ExamAttemptResult } from './mock-tests-data';
import styles from './mock-tests.module.css';

interface MockTestsSnapshotProps {
  availableCount: number;
  attempts: ExamAttemptResult[];
  onStartFirstTest: () => void;
}

export function MockTestsSnapshot({
  availableCount,
  attempts,
  onStartFirstTest,
}: MockTestsSnapshotProps) {
  const hasAttempts = attempts.length > 0;

  // Calculate actual aggregate metrics from completed attempts
  const averageScore = hasAttempts
    ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(1)
    : null;

  const bestScore = hasAttempts
    ? Math.max(...attempts.map((a) => a.score)).toFixed(1)
    : null;

  const averageAccuracy = hasAttempts
    ? (attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length).toFixed(1)
    : null;

  return (
    <section className="py-12 border-b border-inherit bg-inherit" aria-label="Preparation Snapshot">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD]">
              <Activity size={14} aria-hidden="true" />
              <span>Diagnostic Snapshot</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Your Examination Readiness</h2>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            <span>Attempt Telemetry: </span>
            <span className="text-[#A9E6DD] font-semibold">
              {hasAttempts ? `${attempts.length} Completed Session(s)` : 'Initial Session Pending'}
            </span>
          </div>
        </div>

        {hasAttempts ? (
          <div className={styles.snapshotGrid}>
            {/* Metric 1: Available Mocks */}
            <div className={styles.snapshotCard}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Available Tests</span>
                <BookOpen size={16} className="text-[#A9E6DD]" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-black font-mono">{availableCount}</div>
              <p className="mt-1 text-[11px] text-slate-400">Model exams ready</p>
            </div>

            {/* Metric 2: Completed Attempts */}
            <div className={styles.snapshotCard}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Attempts</span>
                <FileCheck2 size={16} className="text-[#B8DFF4]" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
                {attempts.length}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Recorded sessions</p>
            </div>

            {/* Metric 3: Average Score */}
            <div className={styles.snapshotCard}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Average Score</span>
                <TrendingUp size={16} className="text-[#7367F0]" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-black font-mono text-[#B8DFF4]">
                {averageScore}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Net marks / attempt</p>
            </div>

            {/* Metric 4: Best Score */}
            <div className={styles.snapshotCard}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Best Score</span>
                <Award size={16} className="text-amber-400" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-black font-mono text-amber-400">
                {bestScore}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Peak performance</p>
            </div>

            {/* Metric 5: Average Accuracy */}
            <div className={styles.snapshotCard}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Accuracy</span>
                <CheckCircle2 size={16} className="text-emerald-400" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
                {averageAccuracy}%
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Correct / Attempted</p>
            </div>
          </div>
        ) : (
          /* Clean Onboarding State when no attempts have been recorded */
          <div className="rounded-2xl border border-dashed border-inherit bg-white/[0.02] p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1EC5B2]/20 to-[#B8DFF4]/20 text-[#A9E6DD] border border-[#A9E6DD]/30">
              <Compass size={28} aria-hidden="true" />
            </div>

            <h3 className="mt-4 text-xl font-bold">No Completed Examination Records Yet</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
              Take your first CEE mock test to establish your diagnostic baseline, unlock Mistake DNA
              telemetry, and receive targeted high-yield recovery topics.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={onStartFirstTest}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
              >
                <Zap size={16} aria-hidden="true" />
                <span>Start Your First Mock Test</span>
              </button>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 font-mono">
              Note: Demonstration session storage runs locally in your browser. Complete a mock test to
              populate your score history.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
