'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStudentTheme } from '@/components/dashboard/theme-context';
import {
  type ExamAttemptResult,
  getStoredAttempts,
  MOCK_EXAMS_CATALOG,
  type MockExamDefinition,
  saveAttemptToStorage,
} from './mock-tests-data';
import { MockTestsHero } from './mock-tests-hero';
import { MockTestsSnapshot } from './mock-tests-snapshot';
import { type FilterState, MockTestsFilter } from './mock-tests-filter';
import { MockTestsCatalog } from './mock-tests-catalog';
import { MockExamBriefing } from './mock-exam-briefing';
import { MockExamCbtInterface } from './mock-exam-cbt-interface';
import { MockExamResult } from './mock-exam-result';
import { MockExamMistakeDna } from './mock-exam-mistake-dna';
import { MockExamRecoveryPlan } from './mock-exam-recovery-plan';
import { MockExamHistory } from './mock-exam-history';
import { MockExamGuidance } from './mock-exam-guidance';
import styles from './mock-tests.module.css';

type ActiveViewMode = 'hub' | 'briefing' | 'cbt' | 'result';

export function MockTestsCommandCenter() {
  const { theme } = useStudentTheme();

  // Active view state
  const [viewMode, setViewMode] = useState<ActiveViewMode>('hub');
  const [selectedExam, setSelectedExam] = useState<MockExamDefinition>(MOCK_EXAMS_CATALOG[0]);
  const [activeResult, setActiveResult] = useState<ExamAttemptResult | null>(null);

  // Stored Attempts State
  const [attempts, setAttempts] = useState<ExamAttemptResult[]>([]);

  // Section Refs for smooth scroll
  const catalogRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const recoveryRef = useRef<HTMLDivElement>(null);

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    category: 'ALL',
    subject: 'ALL',
    difficulty: 'ALL',
  });

  // Load client-side stored attempts on mount
  useEffect(() => {
    setAttempts(getStoredAttempts());
  }, []);

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return MOCK_EXAMS_CATALOG.filter((exam) => {
      // Search query
      if (filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase();
        const matchesTitle = exam.title.toLowerCase().includes(q);
        const matchesDesc = exam.shortDescription.toLowerCase().includes(q);
        const matchesCat = exam.categoryLabel.toLowerCase().includes(q);
        const matchesSub = exam.subjectsIncluded.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesSub) return false;
      }

      // Category
      if (filter.category !== 'ALL' && exam.category !== filter.category) {
        return false;
      }

      // Subject
      if (
        filter.subject !== 'ALL' &&
        exam.subject !== filter.subject &&
        !exam.subjectsIncluded.includes(filter.subject)
      ) {
        return false;
      }

      // Difficulty
      if (filter.difficulty !== 'ALL' && exam.difficulty !== filter.difficulty) {
        return false;
      }

      return true;
    });
  }, [filter]);

  // Handlers
  const handleSelectExamForBriefing = (exam: MockExamDefinition) => {
    setSelectedExam(exam);
    setViewMode('briefing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = () => {
    setViewMode('cbt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishExam = (result: ExamAttemptResult) => {
    // Persist attempt locally
    saveAttemptToStorage(result);
    setAttempts((prev) => [result, ...prev.filter((a) => a.attemptId !== result.attemptId)]);
    setActiveResult(result);
    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAbortExam = () => {
    setViewMode('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToCenter = () => {
    setViewMode('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPastAttempt = (attempt: ExamAttemptResult) => {
    // Locate the exam definition or fallback
    const def = MOCK_EXAMS_CATALOG.find((e) => e.id === attempt.examId) || MOCK_EXAMS_CATALOG[0];
    setSelectedExam(def);
    setActiveResult(attempt);
    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRecovery = () => {
    recoveryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine container theme class
  const themeClass = theme === 'dark' ? styles.dark : styles.light;

  return (
    <div className={`${styles.commandCenter} ${themeClass}`}>
      {/* ------------------------------------------------------------------ */}
      {/* VIEW: 1. Pre-start Candidate Briefing                              */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'briefing' && (
        <MockExamBriefing
          exam={selectedExam}
          onBack={handleReturnToCenter}
          onStartExam={handleStartExam}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW: 2. Active Computer-Based Test (CBT Interface)                 */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'cbt' && (
        <MockExamCbtInterface
          exam={selectedExam}
          onFinishExam={handleFinishExam}
          onAbortExam={handleAbortExam}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW: 3. Result Dashboard, Mistake DNA & Recovery Plan             */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'result' && activeResult && (
        <>
          <MockExamResult
            result={activeResult}
            onRetake={() => handleSelectExamForBriefing(selectedExam)}
            onReturnToCenter={handleReturnToCenter}
            onViewMistakes={scrollToRecovery}
          />

          <div ref={recoveryRef}>
            <MockExamMistakeDna
              result={activeResult}
              questions={selectedExam.questions}
              onOpenRecoveryPlan={() => {
                const el = document.getElementById('recovery-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          <div id="recovery-section">
            <MockExamRecoveryPlan
              result={activeResult}
              onRetakeTest={() => handleSelectExamForBriefing(selectedExam)}
              onBrowseSubjectTests={() => {
                setFilter((f) => ({ ...f, category: 'SUBJECT_TEST' }));
                handleReturnToCenter();
              }}
            />
          </div>
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW: 4. Master Command Center Hub                                 */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'hub' && (
        <>
          {/* Hero */}
          <MockTestsHero
            onExploreClick={scrollToCatalog}
            onPerformanceClick={scrollToHistory}
          />

          {/* Diagnostic Snapshot */}
          <MockTestsSnapshot
            availableCount={MOCK_EXAMS_CATALOG.length}
            attempts={attempts}
            onStartFirstTest={() => handleSelectExamForBriefing(MOCK_EXAMS_CATALOG[0])}
          />

          {/* Catalog & Filter Section */}
          <div ref={catalogRef} id="mock-catalog">
            <div className="py-2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <MockTestsFilter
                  filter={filter}
                  onChange={setFilter}
                  totalAvailable={MOCK_EXAMS_CATALOG.length}
                  filteredCount={filteredExams.length}
                />
              </div>
            </div>

            <MockTestsCatalog
              exams={filteredExams}
              onSelectExam={handleSelectExamForBriefing}
              onResetFilters={() =>
                setFilter({
                  searchQuery: '',
                  category: 'ALL',
                  subject: 'ALL',
                  difficulty: 'ALL',
                })
              }
            />
          </div>

          {/* Previous Attempts History */}
          <div ref={historyRef} id="mock-history">
            <MockExamHistory
              attempts={attempts}
              onSelectAttempt={handleSelectPastAttempt}
              onStartFirstTest={() => handleSelectExamForBriefing(MOCK_EXAMS_CATALOG[0])}
            />
          </div>

          {/* Exam Guidance Section */}
          <MockExamGuidance />
        </>
      )}
    </div>
  );
}
