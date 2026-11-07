'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  RotateCcw,
  Target,
} from 'lucide-react';
import styles from './features.module.css';

// ---------------------------------------------------------------------------
// Demo CEE Questions for Interactive Simulator Preview
// ---------------------------------------------------------------------------
interface SimulatorQuestion {
  id: number;
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'MAT';
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

const DEMO_QUESTIONS: SimulatorQuestion[] = [
  {
    id: 1,
    subject: 'Biology',
    prompt:
      'In the cardiac conduction system, which structure possesses the highest intrinsic frequency of rhythmicity (natural pacemaker)?',
    options: [
      'Atrioventricular (AV) Node',
      'Sinoatrial (SA) Node',
      'Bundle of His',
      'Purkinje Fibres',
    ],
    correctIndex: 1,
    explanation:
      'The SA node generates rhythmic impulses at 70-80 BPM, higher than AV node (40-60) or Purkinje fibres (15-40), making it the primary pacemaker of the mammalian heart.',
  },
  {
    id: 2,
    subject: 'Physics',
    prompt:
      'A particle of mass m undergoes uniform circular motion with constant speed v on a horizontal path of radius r. What is the net work done by centripetal force during one complete revolution?',
    options: ['Zero', '2π m v²', 'm v² / r', '1/2 m v²'],
    correctIndex: 0,
    explanation:
      'Centripetal force is perpetually perpendicular to the instantaneous velocity displacement vector (θ = 90°). Because W = F · d · cos(90°) = 0, net work done is strictly zero.',
  },
  {
    id: 3,
    subject: 'Chemistry',
    prompt:
      'Which of the following organic reaction pathways proceeds primarily via a planar carbocation intermediate with complete or partial racemization of stereocenters?',
    options: ['SN2 mechanism', 'SN1 mechanism', 'E2 elimination', 'Addition-Elimination'],
    correctIndex: 1,
    explanation:
      'SN1 reactions proceed through a rate-determining unimolecular heterolysis generating a sp² planar carbocation. Nucleophilic attack from either face produces a racemic mixture.',
  },
  {
    id: 4,
    subject: 'MAT',
    prompt:
      'Find the missing term in the sequence: 3, 8, 15, 24, 35, ?',
    options: ['46', '48', '50', '52'],
    correctIndex: 1,
    explanation:
      'Pattern is n² - 1 where n begins at 2: 2²-1=3, 3²-1=8, 4²-1=15, 5²-1=24, 6²-1=35, so 7²-1 = 49 - 1 = 48.',
  },
];

export function ExamSimulatorSection() {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({ 0: 1 });
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set([2]));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = DEMO_QUESTIONS[activeQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestionIndex]: optionIndex,
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(activeQuestionIndex)) {
        next.delete(activeQuestionIndex);
      } else {
        next.add(activeQuestionIndex);
      }
      return next;
    });
  };

  // Score Calculation according to verified CEE examination rules
  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    DEMO_QUESTIONS.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correctIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const netScore = correct * 1.0 - incorrect * 0.25;
    return { correct, incorrect, unattempted, netScore };
  };

  const scoreResults = calculateScore();

  return (
    <section id="exam-experience" className={styles.section}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <Target size={12} aria-hidden="true" />
            <span>REALISTIC CEE EXAM EXPERIENCE</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Experience the Pressure.{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              Master the Performance.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            Practice in the exact physiological and psychological conditions of the actual Nepal CEE
            examination hall. Verified negative marking, authentic OMR bubble sheets, and strict
            3-hour timing.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Official Marking Rules Strip                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-[#B8DFF4]/20 bg-[#0A1128] text-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TOTAL QUESTIONS</span>
            <p className="text-xl sm:text-2xl font-black text-white">200 MCQs</p>
            <span className="text-[11px] text-[#A9E6DD]">Physics, Chem, Bio, MAT</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">DURATION</span>
            <p className="text-xl sm:text-2xl font-black text-white">180 Mins</p>
            <span className="text-[11px] text-[#38BDF8]">3 Hours Continuous</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CORRECT ANSWER</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">+1.0 Mark</p>
            <span className="text-[11px] text-slate-400">Standard Merit Unit</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">NEGATIVE PENALTY</span>
            <p className="text-xl sm:text-2xl font-black text-rose-400">-0.25 Mark</p>
            <span className="text-[11px] text-rose-300">Verified CEE Rule</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Simulator Preview Shell (Browser Frame)                            */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 rounded-3xl border border-[#B8DFF4]/25 bg-[#0A1128] shadow-2xl overflow-hidden">
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#060A18] px-4 py-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-300 font-bold hidden sm:inline">
                NEPAL CEE OFFICIAL MOCK SIMULATOR // APPARATUS 2026
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800">
                DEMONSTRATION PREVIEW
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[#A9E6DD] font-bold">
                <Clock size={14} className="text-[#A9E6DD]" aria-hidden="true" />
                <span>02:47:19 REMAINING</span>
              </div>
            </div>
          </div>

          {/* Simulator Content Deck */}
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Active Question Display */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* Question Metadata Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-bold">
                      {currentQ.subject.toUpperCase()}
                    </span>
                    <span className="text-slate-300">
                      QUESTION {activeQuestionIndex + 1} OF {DEMO_QUESTIONS.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleMarkForReview}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-colors ${
                      markedForReview.has(activeQuestionIndex)
                        ? 'border-purple-400 bg-purple-950/60 text-purple-300'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flag size={13} />
                    <span>{markedForReview.has(activeQuestionIndex) ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>
                </div>

                {/* Question Prompt */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-6">
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentQ.prompt}
                  </p>
                </div>

                {/* OMR Answer Options List */}
                <div className="space-y-3" role="radiogroup" aria-label="Question Options">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[activeQuestionIndex] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#A9E6DD] bg-[#101A3C] shadow-md'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                            isSelected
                              ? 'bg-[#1EC5B2] text-black font-extrabold shadow-sm'
                              : 'border border-white/30 text-slate-300'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-slate-100">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal (if submitted) */}
                {isSubmitted && (
                  <div className="mt-4 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-xs">
                    <p className="font-bold text-emerald-400 mb-1">
                      Correct Answer: Option {String.fromCharCode(65 + currentQ.correctIndex)}
                    </p>
                    <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  disabled={activeQuestionIndex === 0}
                  onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-md hover:opacity-95"
                    >
                      Submit Mock Preview
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setUserAnswers({});
                        setMarkedForReview(new Set());
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 text-xs font-bold text-[#A9E6DD]"
                    >
                      <RotateCcw size={14} />
                      <span>Reset Demo</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={activeQuestionIndex === DEMO_QUESTIONS.length - 1}
                    onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1EC5B2]/20 border border-[#A9E6DD]/40 text-xs font-bold text-[#A9E6DD] hover:bg-[#1EC5B2]/30 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <span>Next</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Question Palette & Score Summary */}
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#060A18]/80 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8DFF4] mb-3">
                  QUESTION PALETTE
                </h4>

                {/* Status Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-4 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                    <span>Review</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full border border-cyan-400 bg-cyan-950" />
                    <span>Current</span>
                  </div>
                </div>

                {/* Question Bubble Grid */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {DEMO_QUESTIONS.map((q, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isMarked = markedForReview.has(idx);
                    const isCurrent = activeQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`h-9 rounded-lg font-mono text-xs font-bold border transition-all ${
                          isCurrent
                            ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 ring-2 ring-cyan-400/40'
                            : isMarked
                            ? 'border-purple-400 bg-purple-950/70 text-purple-200'
                            : isAnswered
                            ? 'border-emerald-500 bg-emerald-950/70 text-emerald-200'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                        aria-label={`Question ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Score Evaluation Panel */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs">
                  <p className="font-bold text-white mb-2">Automated CEE Evaluation</p>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-emerald-400">
                      <span>Correct (+1.0 ea):</span>
                      <span>{scoreResults.correct}</span>
                    </div>
                    <div className="flex justify-between text-rose-400">
                      <span>Negative Penalty (-0.25 ea):</span>
                      <span>-{(scoreResults.incorrect * 0.25).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Unattempted:</span>
                      <span>{scoreResults.unattempted}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-[#A9E6DD]">
                      <span>Net Demo Score:</span>
                      <span>{scoreResults.netScore.toFixed(2)} / {DEMO_QUESTIONS.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-slate-400 leading-normal">
                Full examination mode features all 200 questions across 4 subject sections with national percentile rank estimation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
