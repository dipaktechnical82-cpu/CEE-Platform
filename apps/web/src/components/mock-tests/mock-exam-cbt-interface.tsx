'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock,
  Flag,
  RotateCcw,
  Send,
} from 'lucide-react';
import type {
  ExamAttemptResult,
  ExamSubject,
  MockExamDefinition,
  MockQuestion,
  QuestionNavigationState,
} from './mock-tests-data';
import { calculateMockExamResult } from './mock-tests-data';
import { MockExamSubmitDialog } from './mock-exam-submit-dialog';
import styles from './mock-tests.module.css';

interface MockExamCbtInterfaceProps {
  exam: MockExamDefinition;
  onFinishExam: (result: ExamAttemptResult) => void;
  onAbortExam: () => void;
}

export function MockExamCbtInterface({
  exam,
  onFinishExam,
  onAbortExam,
}: MockExamCbtInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(() => new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(
    () => new Set([exam.questions[0]?.id || '']),
  );
  const [activeSubjectTab, setActiveSubjectTab] = useState<ExamSubject | 'ALL'>('ALL');

  // Strict Countdown Timer
  const totalDurationSeconds = exam.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDurationSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = exam.questions[currentIndex] as MockQuestion;
  const currentAnswer = answers[currentQuestion?.id];
  const isCurrentMarked = markedQuestions.has(currentQuestion?.id);

  // Mark question visited whenever currentIndex changes
  useEffect(() => {
    if (currentQuestion) {
      setVisitedQuestions((prev) => {
        if (prev.has(currentQuestion.id)) return prev;
        const next = new Set(prev);
        next.add(currentQuestion.id);
        return next;
      });
    }
  }, [currentQuestion]);

  // Submit Handler
  const handleFinalSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = totalDurationSeconds - secondsRemaining;
    const result = calculateMockExamResult(
      exam,
      answers,
      Array.from(markedQuestions),
      Math.max(1, timeSpent),
    );

    onFinishExam(result);
  }, [answers, exam, isSubmitting, markedQuestions, onFinishExam, secondsRemaining, totalDurationSeconds]);

  // Countdown Interval
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimeExpired(true);
          return 0;
        }

        // Screen reader announcements at important thresholds
        if (prev === 900) {
          setScreenReaderAnnouncement('Notice: 15 minutes remaining in this examination.');
        } else if (prev === 300) {
          setScreenReaderAnnouncement('Warning: 5 minutes remaining in this examination.');
        } else if (prev === 60) {
          setScreenReaderAnnouncement('Critical warning: 1 minute remaining.');
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-submit when time expires
  useEffect(() => {
    if (isTimeExpired && !isSubmitting) {
      handleFinalSubmit();
    }
  }, [handleFinalSubmit, isSubmitting, isTimeExpired]);

  // Timer Formatting
  const formattedTime = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }, [secondsRemaining]);

  const timerWarningClass = useMemo(() => {
    const fraction = secondsRemaining / totalDurationSeconds;
    if (fraction <= 0.05) return styles.timerCritical;
    if (fraction <= 0.15) return styles.timerWarning;
    return '';
  }, [secondsRemaining, totalDurationSeconds]);

  // Option Selection
  const handleSelectOption = useCallback((optionIndex: number) => {
    if (isSubmitting || !currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  }, [currentQuestion, isSubmitting]);

  // Clear Response
  const handleClearResponse = () => {
    if (isSubmitting || !currentQuestion) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Toggle Mark for Review
  const handleToggleMark = () => {
    if (isSubmitting || !currentQuestion) return;
    setMarkedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  // Navigation
  const handleNext = useCallback(() => {
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, exam.questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Compute status for question palette button
  const getQuestionPaletteState = useCallback((q: MockQuestion): QuestionNavigationState => {
    const isAnswered = answers[q.id] !== undefined;
    const isMarked = markedQuestions.has(q.id);
    const isVisited = visitedQuestions.has(q.id);

    if (isAnswered && isMarked) return 'ANSWERED_AND_MARKED';
    if (isMarked) return 'MARKED_FOR_REVIEW';
    if (isAnswered) return 'ANSWERED';
    if (isVisited) return 'NOT_ANSWERED';
    return 'NOT_VISITED';
  }, [answers, markedQuestions, visitedQuestions]);

  // State Counts for Legend
  const paletteCounts = useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let answeredMarked = 0;
    let notVisited = 0;

    for (const q of exam.questions) {
      const state = getQuestionPaletteState(q);
      if (state === 'ANSWERED') answered += 1;
      else if (state === 'NOT_ANSWERED') notAnswered += 1;
      else if (state === 'MARKED_FOR_REVIEW') marked += 1;
      else if (state === 'ANSWERED_AND_MARKED') answeredMarked += 1;
      else notVisited += 1;
    }

    return { answered, notAnswered, marked, answeredMarked, notVisited };
  }, [exam.questions, getQuestionPaletteState]);

  // Questions filtered by subject tab
  const filteredQuestionIndices = useMemo(() => {
    return exam.questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => (activeSubjectTab === 'ALL' ? true : q.subject === activeSubjectTab));
  }, [activeSubjectTab, exam.questions]);

  // Keyboard navigation hotkeys (1-4 or A-D for options)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isConfirmDialogOpen || isSubmitting) return;

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') handleSelectOption(0);
      else if (key === 'B' || key === '2') handleSelectOption(1);
      else if (key === 'C' || key === '3') handleSelectOption(2);
      else if (key === 'D' || key === '4') handleSelectOption(3);
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleSelectOption, isConfirmDialogOpen, isSubmitting]);

  return (
    <div className={styles.cbtScreen}>
      {/* Hidden ARIA Live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {screenReaderAnnouncement}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. Top CBT Examination Bar                                         */}
      {/* ------------------------------------------------------------------ */}
      <header className={styles.cbtTopBar} role="banner">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1EC5B2] to-[#0A92A8] text-white font-bold text-sm shadow-md">
            CEE
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-tight">{exam.title}</h1>
            <span className="text-[11px] font-mono text-slate-400">
              CANDIDATE SESSION // SECURE ASSESSMENT MODE
            </span>
          </div>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className={`${styles.timerBadge} ${timerWarningClass}`} aria-label={`Time remaining: ${formattedTime}`}>
            <Clock size={16} aria-hidden="true" />
            <span>{formattedTime}</span>
          </div>
          {secondsRemaining <= 300 && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-pulse">
              <AlertTriangle size={13} />
              <span>FINAL 5 MINUTES</span>
            </span>
          )}
        </div>

        {/* Right Action: Submit Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsConfirmDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 transition-all focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <Send size={13} aria-hidden="true" />
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Main CBT Body (Question Left, Palette Right)                     */}
      {/* ------------------------------------------------------------------ */}
      <main className={styles.cbtBody}>
        {/* Left: Question Area */}
        <div className={styles.questionPanel}>
          <div>
            {/* Question Header & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-inherit pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-[#A9E6DD]/15 px-2.5 py-1 text-xs font-bold font-mono text-[#A9E6DD]">
                  Question {currentIndex + 1} of {exam.questions.length}
                </span>

                <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {currentQuestion.subject}
                </span>

                <span className="hidden sm:inline-block text-xs text-slate-400">
                  • {currentQuestion.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Marks: <strong className="text-emerald-400">+1.0</strong> /{' '}
                  <strong className="text-rose-400">-0.25</strong>
                </span>

                <button
                  type="button"
                  onClick={handleToggleMark}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isCurrentMarked
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                  aria-pressed={isCurrentMarked}
                >
                  <Flag size={12} className={isCurrentMarked ? 'fill-current' : ''} />
                  <span>{isCurrentMarked ? 'Marked' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium leading-relaxed mb-6 text-inherit whitespace-pre-line">
              {currentQuestion.prompt}
            </div>

            {/* 4 Options */}
            <div
              className="space-y-3"
              role="radiogroup"
              aria-label={`Options for Question ${currentIndex + 1}`}
            >
              {currentQuestion.options.map((optText, optIdx) => {
                const isSelected = currentAnswer === optIdx;
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <div
                    key={optLetter}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelectOption(optIdx)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleSelectOption(optIdx);
                      }
                    }}
                    className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                  >
                    <span className={styles.optionKey}>{optLetter}</span>
                    <span className="text-sm sm:text-base font-normal leading-normal text-inherit pt-0.5">
                      {optText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Exam Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-inherit flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                className={`inline-flex items-center gap-1.5 rounded-xl border border-inherit px-4 py-2.5 text-xs font-semibold transition-all ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:border-[#A9E6DD] hover:bg-white/5 cursor-pointer'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              {currentAnswer !== undefined && (
                <button
                  type="button"
                  onClick={handleClearResponse}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                >
                  <RotateCcw size={13} />
                  <span>Clear Response</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleMark}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-inherit px-4 py-2.5 text-xs font-semibold hover:border-purple-400"
              >
                <Bookmark size={14} className={isCurrentMarked ? 'text-purple-400' : ''} />
                <span>{isCurrentMarked ? 'Unmark Review' : 'Mark for Review'}</span>
              </button>

              {currentIndex < exam.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:-translate-y-0.5 transition-transform"
                >
                  <span>Save &amp; Next</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:-translate-y-0.5"
                >
                  <Check size={14} />
                  <span>Finish &amp; Submit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <aside className={styles.paletteSidebar} aria-label="Question Navigation Palette">
          {/* Candidate Diagnostic Strip */}
          <div className="border-b border-inherit pb-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Section Palette
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setActiveSubjectTab('ALL')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold font-mono transition-colors ${
                  activeSubjectTab === 'ALL'
                    ? 'bg-[#A9E6DD] text-slate-950'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                ALL ({exam.questions.length})
              </button>
              {exam.subjectsIncluded.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setActiveSubjectTab(sub)}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold font-mono transition-colors ${
                    activeSubjectTab === sub
                      ? 'bg-[#A9E6DD] text-slate-950'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Official 5-State Legend */}
          <div className="my-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#059669]" />
              <span>Answered ({paletteCounts.answered})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#DC2626]" />
              <span>Not Answered ({paletteCounts.notAnswered})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#7C3AED]" />
              <span>Review ({paletteCounts.marked})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#334155]" />
              <span>Not Visited ({paletteCounts.notVisited})</span>
            </div>
          </div>

          {/* Palette Number Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className={styles.paletteGrid}>
              {filteredQuestionIndices.map(({ q, idx }) => {
                const state = getQuestionPaletteState(q);
                const isCurrent = idx === currentIndex;

                let stateClass = styles.stateNotVisited;
                if (state === 'ANSWERED') stateClass = styles.stateAnswered;
                else if (state === 'NOT_ANSWERED') stateClass = styles.stateNotAnswered;
                else if (state === 'MARKED_FOR_REVIEW') stateClass = styles.stateMarked;
                else if (state === 'ANSWERED_AND_MARKED')
                  stateClass = styles.stateAnsweredAndMarked;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`${styles.paletteBtn} ${stateClass} ${
                      isCurrent ? styles.paletteCurrent : ''
                    }`}
                    aria-label={`Jump to Question ${idx + 1}, status: ${state}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Abort/Back Link */}
          <div className="mt-4 pt-3 border-t border-inherit text-center">
            <button
              type="button"
              onClick={onAbortExam}
              className="text-[11px] text-slate-400 hover:text-rose-400 hover:underline"
            >
              Cancel &amp; Exit Examination
            </button>
          </div>
        </aside>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Final Submission Confirmation Modal                             */}
      {/* ------------------------------------------------------------------ */}
      {isConfirmDialogOpen && (
        <MockExamSubmitDialog
          totalQuestions={exam.questions.length}
          answeredCount={paletteCounts.answered + paletteCounts.answeredMarked}
          unansweredCount={paletteCounts.notAnswered + paletteCounts.notVisited}
          markedCount={paletteCounts.marked + paletteCounts.answeredMarked}
          isSubmitting={isSubmitting}
          onCancel={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleFinalSubmit}
        />
      )}
    </div>
  );
}
