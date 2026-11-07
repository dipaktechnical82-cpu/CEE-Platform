'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { DifficultyLevel, ExamCategory, ExamSubject } from './mock-tests-data';
import styles from './mock-tests.module.css';

export interface FilterState {
  searchQuery: string;
  category: ExamCategory | 'ALL';
  subject: ExamSubject | 'ALL';
  difficulty: DifficultyLevel | 'ALL';
}

interface MockTestsFilterProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  totalAvailable: number;
  filteredCount: number;
}

const CATEGORY_OPTIONS: Array<{ value: ExamCategory | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'FULL_MOCK', label: 'Full CEE Mock' },
  { value: 'SUBJECT_TEST', label: 'Subject-wise' },
  { value: 'TIMED_PRACTICE', label: 'Timed Practice' },
  { value: 'REVISION_TEST', label: 'Revision' },
  { value: 'CHALLENGE_TEST', label: 'Elite Challenger' },
];

const SUBJECT_OPTIONS: Array<{ value: ExamSubject | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Subjects' },
  { value: 'Biology', label: 'Biology (Zoology & Botany)' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Physics', label: 'Physics' },
  { value: 'MAT', label: 'MAT' },
];

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyLevel | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Difficulties' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'HARD', label: 'Hard' },
  { value: 'CHALLENGER', label: 'Challenger' },
];

export function MockTestsFilter({
  filter,
  onChange,
  totalAvailable,
  filteredCount,
}: MockTestsFilterProps) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const isFiltered =
    filter.searchQuery.trim() !== '' ||
    filter.category !== 'ALL' ||
    filter.subject !== 'ALL' ||
    filter.difficulty !== 'ALL';

  const handleReset = () => {
    onChange({
      searchQuery: '',
      category: 'ALL',
      subject: 'ALL',
      difficulty: 'ALL',
    });
  };

  return (
    <div className={styles.filterPanel}>
      {/* Top Search & Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
            placeholder="Search mock exams by title, topic, or syllabus tag..."
            className="w-full rounded-xl border border-inherit bg-white/5 py-2.5 pl-10 pr-10 text-sm focus:border-[#A9E6DD] focus:outline-none focus:ring-1 focus:ring-[#A9E6DD]"
            aria-label="Search mock exams"
          />
          {filter.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ ...filter, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle & Quick Stats */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="font-bold text-[#A9E6DD]">{filteredCount}</span> of{' '}
            <span>{totalAvailable}</span> tests
          </div>

          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="sm:hidden inline-flex items-center gap-1.5 rounded-lg border border-inherit px-3 py-2 text-xs font-semibold"
            aria-expanded={isMobileExpanded}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {isMobileExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:underline"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Body (collapsible on mobile, always visible on sm+) */}
      <div className={`mt-4 space-y-3 ${isMobileExpanded ? 'block' : 'hidden sm:block'}`}>
        {/* Row 1: Categories */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Examination Category
          </span>
          <div className={styles.filterChipsContainer}>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange({ ...filter, category: cat.value })}
                className={`${styles.filterChip} ${filter.category === cat.value ? styles.active : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Subject & Difficulty Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Subject Filter */}
          <div>
            <label
              htmlFor="filter-subject"
              className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
            >
              Target Subject
            </label>
            <select
              id="filter-subject"
              value={filter.subject}
              onChange={(e) =>
                onChange({ ...filter, subject: e.target.value as ExamSubject | 'ALL' })
              }
              className="w-full rounded-lg border border-inherit bg-white/5 px-3 py-2 text-xs font-medium focus:border-[#A9E6DD] focus:outline-none"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub.value} value={sub.value} className="bg-slate-900 text-white">
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label
              htmlFor="filter-difficulty"
              className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
            >
              Difficulty Level
            </label>
            <select
              id="filter-difficulty"
              value={filter.difficulty}
              onChange={(e) =>
                onChange({ ...filter, difficulty: e.target.value as DifficultyLevel | 'ALL' })
              }
              className="w-full rounded-lg border border-inherit bg-white/5 px-3 py-2 text-xs font-medium focus:border-[#A9E6DD] focus:outline-none"
            >
              {DIFFICULTY_OPTIONS.map((dif) => (
                <option key={dif.value} value={dif.value} className="bg-slate-900 text-white">
                  {dif.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
