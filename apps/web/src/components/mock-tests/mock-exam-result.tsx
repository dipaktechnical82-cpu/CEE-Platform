'use client';

import React from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { ExamAttemptResult } from './mock-tests-data';
import { formatDuration } from './mock-tests-data';
import styles from './mock-tests.module.css';

interface MockExamResultProps {
  result: ExamAttemptResult;
  onRetake: () => void;
  onReturnToCenter: () => void;
  onViewMistakes: () => void;
}

export function MockExamResult({
  result,
  onRetake,
  onReturnToCenter,
  onViewMistakes,
}: MockExamResultProps) {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="result-heading">
      <Container className="max-w-5xl">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onReturnToCenter}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-inherit"
          >
            <ArrowLeft size={14} />
            <span>Return to Mock Test Center</span>
          </button>

          {/* Demonstration Result Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            DEMO ASSESSMENT RESULT // CLIENT EVALUATION
          </span>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 1. Primary Score Header Banner                                     */}
        {/* ------------------------------------------------------------------ */}
        <div className={styles.resultHeader}>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD] mb-2">
            <Award size={15} aria-hidden="true" />
            <span>EXAMINATION REPORT</span>
          </div>

          <h1 id="result-heading" className="text-2xl sm:text-4xl font-black tracking-tight">
            Your Performance. Your Next Opportunity.
          </h1>

          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            {result.examTitle} • Completed on{' '}
            {new Date(result.completedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          {/* Large Score Metric */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-2">
              <span className={styles.scoreRingValue}>{result.score}</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400 font-mono">
                / {result.maxScore}
              </span>
            </div>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-slate-400">
              Net Marks Achieved (+1.0 Correct, -0.25 Penalty)
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            <div className="rounded-xl border border-inherit bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">ACCURACY</span>
              <span className="mt-1 text-xl font-bold font-mono text-emerald-400">
                {result.accuracy}%
              </span>
              <span className="text-[10px] text-slate-500 block">On attempted MCQs</span>
            </div>

            <div className="rounded-xl border border-inherit bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">TIME TAKEN</span>
              <span className="mt-1 text-xl font-bold font-mono text-[#B8DFF4]">
                {formatDuration(result.timeSpentSeconds)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                of {formatDuration(result.totalDurationSeconds)}
              </span>
            </div>

            <div className="rounded-xl border border-inherit bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">CORRECT</span>
              <span className="mt-1 text-xl font-bold font-mono text-emerald-400">
                {result.correctCount}
              </span>
              <span className="text-[10px] text-slate-500 block">+{result.correctCount}.0 marks</span>
            </div>

            <div className="rounded-xl border border-inherit bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">INCORRECT</span>
              <span className="mt-1 text-xl font-bold font-mono text-rose-400">
                {result.incorrectCount}
              </span>
              <span className="text-[10px] text-slate-500 block">
                -{(result.incorrectCount * 0.25).toFixed(2)} penalty
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. Subject-wise Performance Section                                */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Activity size={20} className="text-[#A9E6DD]" aria-hidden="true" />
            <span>Subject-wise Breakdown</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.subjectBreakdowns.map((sub) => (
              <div key={sub.subject} className={styles.snapshotCard}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-inherit">{sub.subject}</span>
                  <span className="text-xs font-mono font-bold text-[#A9E6DD]">
                    Score: {sub.score} / {sub.totalQuestions}
                  </span>
                </div>

                <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-700/30">
                  <div
                    className="bg-emerald-400"
                    style={{ width: `${(sub.correct / sub.totalQuestions) * 100}%` }}
                    title={`Correct: ${sub.correct}`}
                  />
                  <div
                    className="bg-rose-400"
                    style={{ width: `${(sub.incorrect / sub.totalQuestions) * 100}%` }}
                    title={`Incorrect: ${sub.incorrect}`}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="text-emerald-400">✓ {sub.correct} Correct</span>
                  <span className="text-rose-400">✗ {sub.incorrect} Incorrect</span>
                  <span>○ {sub.unanswered} Skipped</span>
                  <span className="font-bold text-inherit">{sub.accuracy}% Accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Action CTAs Strip                                               */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border border-inherit bg-white/[0.02]">
          <div>
            <h3 className="text-base font-bold text-inherit">Next Recommended Action</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze your error categories to isolate conceptual gaps from calculation slips.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 rounded-full border border-inherit px-5 py-2.5 text-xs font-semibold hover:border-[#A9E6DD]"
            >
              <RotateCcw size={14} />
              <span>Retake Test</span>
            </button>

            <button
              type="button"
              onClick={onViewMistakes}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:-translate-y-0.5 transition-transform"
            >
              <Sparkles size={14} />
              <span>Diagnose Mistake DNA</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
