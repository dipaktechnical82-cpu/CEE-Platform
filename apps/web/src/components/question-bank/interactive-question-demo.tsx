'use client';

import React, { useId, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { DEMO_QUESTIONS } from './demo-questions-data';
import type { InteractiveDemoQuestion } from './types';

export function InteractiveQuestionDemo() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ: InteractiveDemoQuestion = DEMO_QUESTIONS[currentIdx] ?? DEMO_QUESTIONS[0];
  const groupId = useId();

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) return;
    setIsSubmitted(true);
  };

  const handleResetCurrent = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const handleNextQuestion = () => {
    const next = (currentIdx + 1) % DEMO_QUESTIONS.length;
    setCurrentIdx(next);
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const handlePrevQuestion = () => {
    const prev = (currentIdx - 1 + DEMO_QUESTIONS.length) % DEMO_QUESTIONS.length;
    setCurrentIdx(prev);
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const handleJumpTo = (index: number) => {
    setCurrentIdx(index);
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const chosenOption = currentQ.options.find((o) => o.id === selectedOptionId);
  const isCorrect = chosenOption?.isCorrect ?? false;

  return (
    <section
      id="interactive-demo"
      className="relative isolate overflow-hidden border-b border-[#D5F3E8] bg-gradient-to-b from-white via-[#F5FBFA] to-white py-16 dark:border-white/10 dark:from-[#0A1128] dark:via-[#07171D] dark:to-[#0A1128] sm:py-24"
    >
      {/* Background Decorative Rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#B8DFF4]/20 blur-3xl dark:bg-[#7367F0]/10"
      />

      <Container>
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-xs dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            INTERACTIVE DEMO — SAMPLE QUESTION
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Experience the CEE Question Solver
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            Test your understanding with authentic, illustrative CEE practice questions. Select an
            option, submit to evaluate, and explore the complete distractor analysis.
          </p>
        </div>

        {/* Demo Question Stepper Controls */}
        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#5E848C] dark:text-[#7E8DAA]">
              Question {currentIdx + 1} of {DEMO_QUESTIONS.length}
            </span>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-1.5">
            {DEMO_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleJumpTo(idx)}
                aria-label={`Jump to sample question ${idx + 1}: ${q.subject}`}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  idx === currentIdx
                    ? 'bg-[#167A80] text-white shadow-sm ring-2 ring-[#A9E6DD] dark:bg-[#7367F0] dark:ring-[#B8DFF4]/40'
                    : 'border border-[#D5F3E8] bg-white text-[#244A50] hover:bg-slate-100 dark:border-white/10 dark:bg-[#131D45] dark:text-[#D5F3E8]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Prev / Next Chevrons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevQuestion}
              aria-label="Previous sample question"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D5F3E8] bg-white text-[#244A50] hover:bg-slate-100 dark:border-white/10 dark:bg-[#131D45] dark:text-[#F5FBFA]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextQuestion}
              aria-label="Next sample question"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D5F3E8] bg-white text-[#244A50] hover:bg-slate-100 dark:border-white/10 dark:bg-[#131D45] dark:text-[#F5FBFA]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Interactive Question Terminal */}
        <div className="mx-auto mt-4 max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#A9E6DD] bg-white p-6 shadow-xl dark:border-[#B8DFF4]/20 dark:bg-[#101A3C] sm:p-8"
          >
            {/* Top Question Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5F1EF] pb-4 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#D5F3E8] px-2.5 py-1 text-xs font-bold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                  {currentQ.subject.toUpperCase()} • {currentQ.subSubject}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-[#15224D] dark:text-slate-300">
                  Level: {currentQ.difficulty}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-[#15224D] dark:text-slate-300">
                  Format: {currentQ.format}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#167A80] dark:text-[#B8DFF4]">
                <Zap size={14} />
                <span>CEE Marking: +1.0 / -0.25</span>
              </div>
            </div>

            {/* Question Stem */}
            <div className="mt-5">
              <fieldset>
                <legend className="text-base font-bold leading-relaxed text-[#244A50] dark:text-[#F5FBFA] sm:text-lg">
                  {currentQ.prompt}
                </legend>

                {/* Option Radios */}
                <div
                  role="radiogroup"
                  aria-labelledby={`legend-${groupId}`}
                  className="mt-5 space-y-3"
                >
                  {currentQ.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isOptionCorrect = option.isCorrect;

                    // Option styling based on submission state
                    let optionContainerClasses =
                      'relative flex items-center justify-between rounded-xl border p-4 text-sm font-medium transition-all duration-150 cursor-pointer ';

                    if (!isSubmitted) {
                      if (isSelected) {
                        optionContainerClasses +=
                          'border-[#167A80] bg-[#EAF8F4] text-[#244A50] ring-2 ring-[#167A80]/20 dark:border-[#7367F0] dark:bg-[#131D45] dark:text-[#F5FBFA] dark:ring-[#7367F0]/40';
                      } else {
                        optionContainerClasses +=
                          'border-[#E5F1EF] bg-[#F5FBFA] text-[#3D6870] hover:border-[#A9E6DD] hover:bg-white dark:border-white/10 dark:bg-[#131D45]/60 dark:text-[#A9B8D0] dark:hover:bg-[#131D45]';
                      }
                    } else {
                      // Post-submission state
                      if (isOptionCorrect) {
                        optionContainerClasses +=
                          'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100';
                      } else if (isSelected && !isOptionCorrect) {
                        optionContainerClasses +=
                          'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30 dark:border-rose-400 dark:bg-rose-950/40 dark:text-rose-100';
                      } else {
                        optionContainerClasses +=
                          'border-[#E5F1EF] bg-slate-50/70 text-slate-500 opacity-60 dark:border-white/5 dark:bg-[#131D45]/30 dark:text-slate-500';
                      }
                    }

                    return (
                      <div
                        key={option.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectOption(option.id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleSelectOption(option.id);
                          }
                        }}
                        className={optionContainerClasses}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              !isSubmitted
                                ? isSelected
                                  ? 'bg-[#167A80] text-white dark:bg-[#7367F0]'
                                  : 'border border-[#D5F3E8] bg-white text-[#244A50] dark:border-white/10 dark:bg-[#101A3C] dark:text-[#B8DFF4]'
                                : isOptionCorrect
                                ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                                : isSelected
                                ? 'bg-rose-600 text-white dark:bg-rose-500'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="leading-snug">{option.text}</span>
                        </div>

                        {/* Status Icon Indicator */}
                        {isSubmitted && (
                          <div className="ml-2 shrink-0">
                            {isOptionCorrect ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={18} />
                                <span className="hidden sm:inline">Correct</span>
                              </span>
                            ) : isSelected ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                                <XCircle size={18} />
                                <span className="hidden sm:inline">Your Pick</span>
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* Action Buttons Row */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5F1EF] pt-5 dark:border-white/10">
              <div className="text-xs text-[#71898D] dark:text-[#7E8DAA]">
                {!isSubmitted ? (
                  <span>Select an option and submit to reveal deep faculty explanation.</span>
                ) : (
                  <span>Evaluated locally. Try another question to continue practicing.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleResetCurrent}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5F3E8] bg-[#F5FBFA] px-3.5 py-2 text-xs font-semibold text-[#244A50] transition-colors hover:bg-[#D5F3E8] dark:border-white/10 dark:bg-[#131D45] dark:text-[#F5FBFA] dark:hover:bg-[#15224D]"
                  >
                    <RotateCcw size={13} />
                    Try Again
                  </button>
                )}

                {!isSubmitted ? (
                  <button
                    type="submit"
                    disabled={!selectedOptionId}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#167A80] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1a8e95] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#7367F0] dark:hover:bg-[#8276f5]"
                  >
                    <span>Submit Answer</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#167A80] to-[#244A50] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-[#1b8e95] hover:to-[#2e5d65] dark:from-[#7367F0] dark:to-[#5B52D6]"
                  >
                    <span>Next Sample Question</span>
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 8: Answer Explanation Experience Panel */}
            {isSubmitted && (
              <div className="mt-6 rounded-2xl border border-[#A9E6DD] bg-[#F5FBFA] p-5 shadow-sm dark:border-[#B8DFF4]/20 dark:bg-[#131D45] sm:p-6">
                {/* Score & Verdict Banner */}
                <div
                  className={`flex items-center gap-3 rounded-xl p-3.5 ${
                    isCorrect
                      ? 'border border-emerald-300 bg-emerald-100/70 text-emerald-950 dark:border-emerald-800/50 dark:bg-emerald-950/50 dark:text-emerald-100'
                      : 'border border-rose-300 bg-rose-100/70 text-rose-950 dark:border-rose-800/50 dark:bg-rose-950/50 dark:text-rose-100'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 size={22} className="shrink-0 text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle size={22} className="shrink-0 text-rose-700 dark:text-rose-400" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold">
                      {isCorrect
                        ? 'Correct! +1.0 Mark Awarded'
                        : 'Incorrect (-0.25 Mark CEE penalty simulated)'}
                    </h4>
                    <p className="mt-0.5 text-xs">
                      {isCorrect
                        ? 'Strong conceptual clarity. Review the detailed rationale and distractor notes below.'
                        : 'Review the underlying mechanism below to understand the trap and reinforce your memory.'}
                    </p>
                  </div>
                </div>

                {/* Core Mechanism & Why It's Correct */}
                <div className="mt-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD]">
                    <Sparkles size={15} />
                    <span>Why the Answer Is Correct</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#244A50] dark:text-[#F5FBFA] sm:text-sm">
                    {currentQ.correctExplanation}
                  </p>
                </div>

                {/* Distractor Breakdown: Why other options are incorrect */}
                <div className="mt-5 border-t border-[#E5F1EF] pt-4 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                    <HelpCircle size={15} />
                    <span>Distractor Analysis (Why Other Options Are Flawed)</span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {currentQ.whyOthersIncorrect.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-[#D5F3E8] bg-white p-3 text-xs dark:border-white/5 dark:bg-[#101A3C]"
                      >
                        <span className="font-bold text-[#244A50] dark:text-[#B8DFF4]">
                          {item.label}:{' '}
                        </span>
                        <span className="text-[#3D6870] dark:text-[#A9B8D0]">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High-Yield CEE Concept / Key Takeaway */}
                <div className="mt-5 rounded-xl border border-[#B8DFF4] bg-[#EAF8F4] p-3.5 dark:border-[#7367F0]/30 dark:bg-[#101A3C]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#167A80] dark:text-[#A9E6DD]">
                    <Lightbulb size={16} />
                    <span>High-Yield CEE Takeaway:</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#244A50] dark:text-[#D5F3E8]">
                    {currentQ.highYieldTakeaway}
                  </p>
                </div>

                {/* Disclaimer pill */}
                <p className="mt-4 text-[10px] text-[#71898D] dark:text-[#7E8DAA]">
                  * {currentQ.syllabusDisclaimer} Local demonstration mode does not modify student
                  records.
                </p>
              </div>
            )}
          </form>

          {/* Demonstration Notice */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2 text-[11px] text-[#5E848C] dark:bg-[#101A3C]/70 dark:text-[#7E8DAA]">
            <span>Mode: Standalone Interactive Demo</span>
            <span className="font-semibold">CEE Medical Prep Academic Demo</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
