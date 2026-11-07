'use client';

import React from 'react';
import {
  ArrowRight,
  Compass,
  LineChart,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { ExamAttemptResult } from './mock-tests-data';
import { formatDuration } from './mock-tests-data';

interface MockExamHistoryProps {
  attempts: ExamAttemptResult[];
  onSelectAttempt: (attempt: ExamAttemptResult) => void;
  onStartFirstTest: () => void;
}

export function MockExamHistory({
  attempts,
  onSelectAttempt,
  onStartFirstTest,
}: MockExamHistoryProps) {
  const hasAttempts = attempts.length > 0;

  return (
    <section className="py-12 border-t border-inherit" aria-labelledby="history-heading">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD]">
              <LineChart size={14} aria-hidden="true" />
              <span>Session History</span>
            </div>
            <h2 id="history-heading" className="mt-1 text-2xl font-bold tracking-tight">
              Previous Examination Attempts
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Review your historical test performance, score evolution, and topic error patterns.
            </p>
          </div>

          {hasAttempts && (
            <span className="text-xs font-mono text-slate-400">
              Showing <strong className="text-inherit">{attempts.length}</strong> recorded attempt(s)
            </span>
          )}
        </div>

        {hasAttempts ? (
          <div className="overflow-x-auto rounded-2xl border border-inherit bg-white/[0.02]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-inherit bg-white/[0.03] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">
                    Examination
                  </th>
                  <th scope="col" className="py-3 px-3 sm:px-4">
                    Date
                  </th>
                  <th scope="col" className="py-3 px-3 sm:px-4">
                    Score
                  </th>
                  <th scope="col" className="py-3 px-3 sm:px-4">
                    Accuracy
                  </th>
                  <th scope="col" className="py-3 px-3 sm:px-4">
                    Time Spent
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {attempts.map((attempt) => (
                  <tr key={attempt.attemptId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-inherit">{attempt.examTitle}</div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {attempt.answeredCount} answered of {attempt.totalQuestions} MCQs
                      </span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-xs text-slate-400">
                      {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-[#A9E6DD]">
                      {attempt.score} <span className="text-slate-500 font-normal">/ {attempt.maxScore}</span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-emerald-400">
                      {attempt.accuracy}%
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-slate-400">
                      {formatDuration(attempt.timeSpentSeconds)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectAttempt(attempt)}
                        className="inline-flex items-center gap-1 rounded-lg border border-inherit px-3 py-1.5 text-xs font-semibold hover:border-[#A9E6DD] hover:text-[#A9E6DD]"
                      >
                        <span>View Result</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Polished Empty State */
          <div className="rounded-2xl border border-dashed border-inherit p-10 text-center bg-white/[0.01]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
              <Compass size={28} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-inherit">Your first mock test is waiting.</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t taken a mock test yet. Take a test now to unlock your personal score
              history and Mistake DNA telemetry.
            </p>
            <button
              type="button"
              onClick={onStartFirstTest}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:-translate-y-0.5 transition-transform"
            >
              <Zap size={14} />
              <span>Start Your First Mock</span>
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
