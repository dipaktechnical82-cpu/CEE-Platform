'use client';

import React from 'react';
import {
  ArrowRight,
  Clock,
  FileQuestion,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { MockExamDefinition } from './mock-tests-data';
import styles from './mock-tests.module.css';

interface MockTestsCatalogProps {
  exams: readonly MockExamDefinition[];
  onSelectExam: (exam: MockExamDefinition) => void;
  onResetFilters: () => void;
}

const difficultyBadges: Record<string, { label: string; className: string }> = {
  EASY: {
    label: 'Standard',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  MODERATE: {
    label: 'CEE Benchmark',
    className: 'bg-[#B8DFF4]/15 text-[#B8DFF4] border-[#B8DFF4]/30',
  },
  HARD: {
    label: 'Advanced',
    className: 'bg-[#7367F0]/15 text-[#A59DF5] border-[#7367F0]/30',
  },
  CHALLENGER: {
    label: 'Top 100 Rank',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
};

export function MockTestsCatalog({ exams, onSelectExam, onResetFilters }: MockTestsCatalogProps) {
  return (
    <section className="py-12" aria-labelledby="catalog-heading">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD]">
              <Layers size={14} aria-hidden="true" />
              <span>Available Examinations</span>
            </div>
            <h2 id="catalog-heading" className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Choose Your Next Challenge.
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Select an examination suited to your preparation phase—from full 4-subject simulations
              to targeted numerical sprints.
            </p>
          </div>
        </div>

        {exams.length > 0 ? (
          <div className={styles.examGrid}>
            {exams.map((exam) => {
              const diffBadge = difficultyBadges[exam.difficulty] || difficultyBadges.MODERATE;

              return (
                <article key={exam.id} className={styles.examCard}>
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold font-mono tracking-wider uppercase bg-[#A9E6DD]/10 text-[#A9E6DD] border border-[#A9E6DD]/20">
                        {exam.categoryLabel}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold font-mono border ${diffBadge.className}`}
                      >
                        {diffBadge.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-inherit">
                      {exam.title}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                      {exam.shortDescription}
                    </p>

                    {/* Subject Tags Strip */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exam.subjectsIncluded.map((sub) => (
                        <span
                          key={sub}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Action CTA */}
                  <div className="mt-6 pt-4 border-t border-inherit flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <FileQuestion size={14} className="text-[#A9E6DD]" aria-hidden="true" />
                        <span>{exam.questionCount} MCQs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#B8DFF4]" aria-hidden="true" />
                        <span>{exam.durationMinutes} min</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectExam(exam)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1EC5B2] to-[#0A92A8] px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#A9E6DD]"
                      aria-label={`Start or review ${exam.title}`}
                    >
                      <span>Start Test</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search/Filter State */
          <div className="mt-8 rounded-2xl border border-dashed border-inherit p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400">
              <FileQuestion size={24} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No Mock Tests Match Your Filters</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
              No tests were found for your selected subject, category, or search keywords.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-inherit px-4 py-2 text-xs font-semibold hover:border-[#A9E6DD]"
            >
              <RotateCcw size={12} />
              <span>Clear All Active Filters</span>
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
