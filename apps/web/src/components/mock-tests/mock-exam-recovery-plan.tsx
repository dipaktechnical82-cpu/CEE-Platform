'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Info,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { ExamAttemptResult } from './mock-tests-data';

interface MockExamRecoveryPlanProps {
  result: ExamAttemptResult;
  onRetakeTest: () => void;
  onBrowseSubjectTests: () => void;
}

export function MockExamRecoveryPlan({
  result,
  onRetakeTest,
  onBrowseSubjectTests,
}: MockExamRecoveryPlanProps) {
  // Find weakest subject by accuracy
  const sortedSubjects = [...result.subjectBreakdowns].sort((a, b) => a.accuracy - b.accuracy);
  const weakestSubject = sortedSubjects[0];

  // Negative marking impact
  const penaltyMarks = Number((result.incorrectCount * 0.25).toFixed(2));

  return (
    <section className="py-12 border-t border-inherit" aria-labelledby="recovery-heading">
      <Container className="max-w-5xl">
        {/* Header */}
        <div className="border-b border-inherit pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD]">
            <Sparkles size={14} aria-hidden="true" />
            <span>INTELLIGENT PREPARATION STRATEGY</span>
          </div>

          <h2 id="recovery-heading" className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Next Preparation Move.
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Personalized recovery roadmap derived deterministically from your attempt data. Target
            the exact weaknesses that impacted your net score before your next examination.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 text-[11px] font-mono text-slate-400 border border-inherit">
            <Info size={13} className="text-[#A9E6DD]" />
            <span>
              Transparent Note: Recommendations are generated from question-level tags and penalty
              metrics.
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 1. Tactical Recommendations Grid                                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Weakest Subject Focus */}
          {weakestSubject && (
            <div className="rounded-2xl border border-inherit bg-white/[0.02] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-rose-400 uppercase tracking-wider font-mono">
                    Priority Focus Area
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    Accuracy: {weakestSubject.accuracy}%
                  </span>
                </div>

                <h3 className="text-xl font-bold text-inherit">
                  Master {weakestSubject.subject} Fundamentals
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Your accuracy in {weakestSubject.subject} was {weakestSubject.accuracy}%, with{' '}
                  {weakestSubject.incorrect} incorrect and {weakestSubject.unanswered} unattempted
                  questions. Revisit core theory chapters and practice subject-specific drills.
                </p>

                {result.weakTopics.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Target Chapters:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {result.weakTopics.slice(0, 3).map((wt) => (
                        <li key={wt.topic} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#A9E6DD]" />
                          <span>{wt.topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-inherit">
                <button
                  type="button"
                  onClick={onBrowseSubjectTests}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A9E6DD] hover:underline"
                >
                  <span>Practice {weakestSubject.subject} Tests</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Negative Marking Strategy */}
          <div className="rounded-2xl border border-inherit bg-white/[0.02] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Negative Marking Audit
                </span>
                <span className="font-mono text-xs text-rose-400">-{penaltyMarks} Marks</span>
              </div>

              <h3 className="text-xl font-bold text-inherit">Calibrate Guessing Discipline</h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                You incurred a penalty of{' '}
                <strong className="text-rose-400">-{penaltyMarks} marks</strong> from{' '}
                {result.incorrectCount} wrong answers. In Nepal CEE, skipping low-confidence questions
                where 2 or more options cannot be eliminated strictly yields a higher aggregate score.
              </p>

              <div className="mt-4 rounded-xl border border-inherit bg-white/[0.03] p-3 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Rule: Eliminate at least 2 options before guessing.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Use &quot;Mark for Review&quot; on Round 1 instead of blind guessing.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-inherit">
              <Link
                href="/syllabus"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8DFF4] hover:underline"
              >
                <BookOpen size={13} />
                <span>Browse Verified CEE Syllabus</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. Schedule Retake Action Banner                                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#101A3C] via-[#0E192D] to-[#0A1128] border border-[#B8DFF4]/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-white">Ready for Another Run?</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Apply what you learned from your Mistake DNA report. Retake this test or select a
              different examination category.
            </p>
          </div>

          <button
            type="button"
            onClick={onRetakeTest}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-6 py-3 text-xs font-bold text-white shadow-md hover:-translate-y-0.5 transition-transform shrink-0"
          >
            <RotateCcw size={14} />
            <span>Retake This Examination</span>
          </button>
        </div>
      </Container>
    </section>
  );
}
