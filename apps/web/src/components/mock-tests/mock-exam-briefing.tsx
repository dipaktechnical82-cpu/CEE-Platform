'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { MockExamDefinition } from './mock-tests-data';

interface MockExamBriefingProps {
  exam: MockExamDefinition;
  onBack: () => void;
  onStartExam: () => void;
}

export function MockExamBriefing({ exam, onBack, onStartExam }: MockExamBriefingProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <section className="py-12 sm:py-16" aria-labelledby="briefing-heading">
      <Container className="max-w-4xl">
        {/* Back Link */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-inherit mb-6"
        >
          <ArrowLeft size={14} />
          <span>Return to Command Center</span>
        </button>

        <div className="rounded-2xl border border-inherit bg-inherit p-6 sm:p-10 shadow-xl">
          {/* Header */}
          <div className="border-b border-inherit pb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#A9E6DD] bg-[#A9E6DD]/10 border border-[#A9E6DD]/20">
              OFFICIAL EXAMINATION BRIEFING // CANDIDATE PROTOCOL
            </div>

            <h1 id="briefing-heading" className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {exam.title}
            </h1>

            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {exam.shortDescription}
            </p>
          </div>

          {/* Quick Specifications Strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-inherit bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">TOTAL QUESTIONS</span>
              <span className="mt-1 text-2xl font-black font-mono text-[#A9E6DD]">
                {exam.questionCount}
              </span>
              <span className="text-[10px] text-slate-500 block">Single-Choice MCQs</span>
            </div>

            <div className="rounded-xl border border-inherit bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">TOTAL TIME</span>
              <span className="mt-1 text-2xl font-black font-mono text-[#B8DFF4]">
                {exam.durationMinutes} min
              </span>
              <span className="text-[10px] text-slate-500 block">Strict Auto-Submit</span>
            </div>

            <div className="rounded-xl border border-inherit bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">MAX MARKS</span>
              <span className="mt-1 text-2xl font-black font-mono text-[#7367F0]">
                {exam.totalMarks}
              </span>
              <span className="text-[10px] text-slate-500 block">+1.0 per Correct MCQ</span>
            </div>

            <div className="rounded-xl border border-inherit bg-white/[0.02] p-4 text-center">
              <span className="text-[11px] font-mono text-slate-400 block">NEGATIVE MARK</span>
              <span className="mt-1 text-2xl font-black font-mono text-rose-400">-0.25</span>
              <span className="text-[10px] text-slate-500 block">25% Penalty / Wrong</span>
            </div>
          </div>

          {/* Detailed Instructions */}
          <div className="mt-8 space-y-6 text-sm text-slate-300">
            <div>
              <h2 className="text-base font-bold text-inherit mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#A9E6DD]" aria-hidden="true" />
                <span>Marking Policy &amp; Scoring Rule</span>
              </h2>
              <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-400 pl-1">
                <li>
                  <strong className="text-inherit">+1.00 Mark</strong> will be awarded for every
                  correctly answered question.
                </li>
                <li>
                  <strong className="text-rose-400">-0.25 Mark</strong> (negative marking) will be
                  deducted for every incorrect response.
                </li>
                <li>
                  <strong className="text-inherit">0.00 Marks</strong> for unattempted or cleared
                  questions. No penalty applies for left questions.
                </li>
                <li className="text-[11px] text-slate-500">
                  Policy note: This follows standard Nepal Medical Education Commission (MEC) Common
                  Entrance Examination specifications for bachelor-level medical programs.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-inherit mb-2 flex items-center gap-2">
                <BookOpen size={18} className="text-[#B8DFF4]" aria-hidden="true" />
                <span>Question Palette &amp; Navigation Protocol</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03]">
                  <span className="h-4 w-4 rounded bg-[#059669] shrink-0" />
                  <span>
                    <strong>Answered:</strong> Question has been selected and saved.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03]">
                  <span className="h-4 w-4 rounded bg-[#DC2626] shrink-0" />
                  <span>
                    <strong>Not Answered:</strong> Visited but no option chosen yet.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03]">
                  <span className="h-4 w-4 rounded bg-[#7C3AED] shrink-0" />
                  <span>
                    <strong>Marked for Review:</strong> Flagged for reconsideration.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03]">
                  <span className="h-4 w-4 rounded bg-[#334155] shrink-0" />
                  <span>
                    <strong>Not Visited:</strong> Question has not been opened yet.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="font-bold text-white block mb-1">
                    Authentic Examination Rules
                  </strong>
                  The countdown timer begins immediately once you click &quot;Start Examination&quot;.
                  Closing or refreshing the browser tab will forfeit elapsed time. You can review and
                  change your answers at any point prior to final submission.
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Checkbox Agreement */}
          <div className="mt-8 pt-6 border-t border-inherit">
            <label
              htmlFor="agree-checkbox"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <input
                id="agree-checkbox"
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-[#0DA994] focus:ring-[#A9E6DD]"
              />
              <span className="text-xs sm:text-sm text-inherit">
                I have read and understood the examination instructions. I agree to adhere to the
                medical entrance examination conduct guidelines.
              </span>
            </label>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="rounded-full border border-inherit px-5 py-2.5 text-xs font-semibold hover:border-slate-400"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!acknowledged}
                onClick={onStartExam}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold shadow-lg transition-all ${
                  acknowledged
                    ? 'bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] text-white hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(14,134,149,0.4)] cursor-pointer'
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Start Examination</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
