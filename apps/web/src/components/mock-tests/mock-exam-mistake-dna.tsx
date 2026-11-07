'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type {
  ExamAttemptResult,
  MockQuestion,
} from './mock-tests-data';
import styles from './mock-tests.module.css';

interface MockExamMistakeDnaProps {
  result: ExamAttemptResult;
  questions: readonly MockQuestion[];
  onOpenRecoveryPlan: () => void;
}

export function MockExamMistakeDna({
  result,
  questions,
  onOpenRecoveryPlan,
}: MockExamMistakeDnaProps) {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'INCORRECT' | 'SKIPPED' | 'CORRECT'>('INCORRECT');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  // Filter questions according to student's answer
  const displayedQuestions = questions.filter((q) => {
    const studentAns = result.answers[q.id];
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'INCORRECT') return studentAns !== undefined && studentAns !== q.correctOption;
    if (selectedFilter === 'SKIPPED') return studentAns === undefined;
    if (selectedFilter === 'CORRECT') return studentAns === q.correctOption;
    return true;
  });

  return (
    <section className="py-12 border-t border-inherit" aria-labelledby="mistake-dna-heading">
      <Container className="max-w-5xl">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD]">
              <Brain size={14} aria-hidden="true" />
              <span>Diagnostic Mistake DNA Engine</span>
            </div>
            <h2 id="mistake-dna-heading" className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Anatomy of Every Missed Mark
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Categorized error analysis grounded strictly in your responses. We classify whether a
              loss of marks was due to fundamental theory, derivation slips, or speed traps.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenRecoveryPlan}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:-translate-y-0.5 transition-transform"
          >
            <Sparkles size={14} />
            <span>Generate Recovery Plan</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 1. Categorized Mistake Clusters                                    */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.mistakeBreakdowns
            .filter((m) => m.category !== 'TIME_MANAGEMENT')
            .map((item) => (
              <div key={item.category} className={styles.mistakeCard}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A9E6DD] font-mono">
                    {item.label}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold font-mono text-rose-400">
                    {item.count} errors
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                <div className="mt-3 text-[11px] font-mono text-slate-500">
                  Impact: -{(item.count * 1.25).toFixed(2)} marks lost (1.0 + 0.25 penalty)
                </div>
              </div>
            ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. Weak Topics Diagnostic Alert                                    */}
        {/* ------------------------------------------------------------------ */}
        {result.weakTopics.length > 0 && (
          <div className="mt-6 rounded-2xl border border-rose-500/25 bg-rose-500/[0.04] p-5">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-2">
              <AlertTriangle size={16} />
              <span>Highest-Yield Weak Topic Clusters</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              The following topics registered multiple errors in this attempt. Target these chapters
              in your next study block:
            </p>
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((wt) => (
                <span
                  key={wt.topic}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-200"
                >
                  <strong className="text-white font-semibold">{wt.subject}:</strong> {wt.topic}{' '}
                  <span className="text-rose-400 font-mono">({wt.mistakes} wrong)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 3. Question-by-Question Solution & Trap Review                     */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-inherit pb-4 mb-6">
            <h3 className="text-lg font-bold text-inherit">Question-by-Question Diagnostic Review</h3>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-inherit text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedFilter('INCORRECT')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'INCORRECT'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Incorrect ({result.incorrectCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('SKIPPED')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'SKIPPED'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Skipped ({result.unansweredCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('CORRECT')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'CORRECT'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Correct ({result.correctCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'ALL'
                    ? 'bg-[#A9E6DD] text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({questions.length})
              </button>
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {displayedQuestions.map((q) => {
              const studentAns = result.answers[q.id];
              const isCorrect = studentAns === q.correctOption;
              const isSkipped = studentAns === undefined;
              const isExpanded = expandedQuestionId === q.id;

              return (
                <article
                  key={q.id}
                  className="rounded-2xl border border-inherit bg-white/[0.02] p-5 transition-all"
                >
                  <header
                    className="flex items-start justify-between gap-4 cursor-pointer"
                    onClick={() => toggleExpand(q.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-[#A9E6DD]">
                          Q.{questions.findIndex((item) => item.id === q.id) + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                          {q.subject}
                        </span>
                        <span className="text-xs text-slate-400">• {q.topic}</span>
                        {isCorrect && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 ml-auto">
                            <Check size={13} /> Correct (+1.0)
                          </span>
                        )}
                        {!isCorrect && !isSkipped && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 ml-auto">
                            <X size={13} /> Incorrect (-0.25)
                          </span>
                        )}
                        {isSkipped && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 ml-auto">
                            ○ Skipped (0.0)
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-inherit leading-relaxed">{q.prompt}</p>
                    </div>

                    <button
                      type="button"
                      aria-label={isExpanded ? 'Collapse solution' : 'Expand solution'}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </header>

                  {/* Expanded Solution & Trap Warning */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-inherit space-y-4">
                      {/* Options Review */}
                      <div className="space-y-2">
                        {q.options.map((optText, optIdx) => {
                          const isOptionCorrect = optIdx === q.correctOption;
                          const isOptionChosen = studentAns === optIdx;

                          let badgeClass = 'border-inherit bg-white/[0.02] text-inherit';
                          if (isOptionCorrect) {
                            badgeClass =
                              'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold';
                          } else if (isOptionChosen) {
                            badgeClass = 'border-rose-500/40 bg-rose-500/10 text-rose-300 font-semibold';
                          }

                          return (
                            <div
                              key={optText}
                              className={`flex items-center justify-between p-3 rounded-xl border text-xs ${badgeClass}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-mono">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{optText}</span>
                              </div>

                              <div className="font-mono text-[11px]">
                                {isOptionCorrect && <span>✓ Correct Key</span>}
                                {isOptionChosen && !isOptionCorrect && (
                                  <span className="text-rose-400">✗ Your Choice</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="rounded-xl border border-inherit bg-white/[0.03] p-4 text-xs leading-relaxed text-slate-300">
                        <strong className="text-[#A9E6DD] block mb-1 font-bold">
                          Medical Faculty Solution:
                        </strong>
                        {q.explanation}
                      </div>

                      {/* Trap Warning */}
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                        <strong className="text-amber-300 block mb-1 font-bold flex items-center gap-1.5">
                          <AlertTriangle size={14} />
                          <span>Exam Trap &amp; Rush Factor:</span>
                        </strong>
                        {q.trapWarning}
                      </div>

                      <div className="text-[11px] font-mono text-slate-500">
                        Reference Benchmark: {q.pyqReference}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
