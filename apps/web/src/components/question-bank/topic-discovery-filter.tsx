'use client';

import React, { useMemo, useState } from 'react';
import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SAMPLE_TOPICS } from './demo-questions-data';
import type { PlatformDifficulty, QuestionFormat, SubjectCategory, TopicSample } from './types';

interface TopicDiscoveryFilterProps {
  initialSubject?: SubjectCategory | 'All';
  onTrySampleQuestion?: (topic: TopicSample) => void;
}

const subjectsList: (SubjectCategory | 'All')[] = [
  'All',
  'Botany',
  'Zoology',
  'Chemistry',
  'Physics',
];

const difficultiesList: (PlatformDifficulty | 'All')[] = [
  'All',
  'Foundation',
  'Intermediate',
  'Advanced',
  'CEE Challenge',
];

const questionFormatsList: (QuestionFormat | 'All')[] = [
  'All',
  'Single Best Response',
  'Assertion & Reason',
];

export function TopicDiscoveryFilter({
  initialSubject = 'All',
  onTrySampleQuestion,
}: TopicDiscoveryFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'All'>(initialSubject);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PlatformDifficulty | 'All'>('All');
  const [selectedFormat, setSelectedFormat] = useState<QuestionFormat | 'All'>('All');
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);

  const handleSubjectChange = (subj: SubjectCategory | 'All') => {
    setIsSimulatedLoading(true);
    setSelectedSubject(subj);
    setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 180);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedDifficulty('All');
    setSelectedFormat('All');
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedSubject !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedFormat !== 'All';

  // Filter sample topics accurately
  const filteredTopics = useMemo(() => {
    return SAMPLE_TOPICS.filter((topic) => {
      if (selectedSubject !== 'All' && topic.subject !== selectedSubject) {
        return false;
      }
      if (selectedDifficulty !== 'All' && topic.difficulty !== selectedDifficulty) {
        return false;
      }
      if (selectedFormat !== 'All' && topic.format !== selectedFormat) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = topic.name.toLowerCase().includes(q);
        const matchSub = topic.subSubject.toLowerCase().includes(q);
        const matchPrompt = topic.sampleQuestionPrompt.toLowerCase().includes(q);
        const matchConcepts = topic.keyConcepts.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchSub && !matchPrompt && !matchConcepts) {
          return false;
        }
      }
      return true;
    });
  }, [selectedSubject, selectedDifficulty, selectedFormat, searchQuery]);

  return (
    <section
      id="topic-filters"
      className="border-b border-[#D5F3E8] bg-white py-16 dark:border-white/10 dark:bg-[#0A1128] sm:py-24"
    >
      <Container>
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B8DFF4] bg-[#F5FBFA] px-3 py-1 text-xs font-bold text-[#167A80] dark:border-white/10 dark:bg-[#101A3C] dark:text-[#A9E6DD]">
            <SlidersHorizontal size={13} />
            INTERACTIVE EXPLORATION MATRIX
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Topic Discovery &amp; Filter Experience
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            Filter high-yield topics by discipline, platform difficulty, and question format. Test the
            filtering experience with sample curriculum modules below.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="mt-10 rounded-2xl border border-[#D5F3E8] bg-[#F5FBFA] p-5 shadow-sm dark:border-white/10 dark:bg-[#101A3C] sm:p-7">
          {/* Top Row: Search Input & Clear Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71898D] dark:text-[#7E8DAA]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts (e.g., Pacemaker, Photosynthesis, Equilibrium, Resistors)..."
                aria-label="Search topics and concepts"
                className="w-full rounded-xl border border-[#A9E6DD] bg-white py-2.5 pl-10 pr-10 text-sm text-[#244A50] placeholder-[#71898D] transition-colors focus:border-[#167A80] focus:outline-none focus:ring-2 focus:ring-[#167A80]/20 dark:border-white/15 dark:bg-[#131D45] dark:text-[#F5FBFA] dark:placeholder-[#7E8DAA]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71898D] hover:text-[#244A50] dark:text-[#7E8DAA] dark:hover:text-[#F5FBFA]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#D5F3E8] bg-white px-3.5 py-2 text-xs font-semibold text-[#244A50] shadow-sm transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-[#131D45] dark:text-[#F5FBFA] dark:hover:bg-[#15224D] sm:self-auto"
              >
                <RotateCcw size={13} />
                Reset All Filters
              </button>
            )}
          </div>

          {/* Filter Groups */}
          <div className="mt-5 space-y-4 border-t border-[#E5F1EF] pt-4 dark:border-white/10">
            {/* Subject Selector */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                Subject Discipline:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {subjectsList.map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => handleSubjectChange(subj)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedSubject === subj
                        ? 'bg-[#167A80] text-white shadow-sm dark:bg-[#7367F0]'
                        : 'border border-[#D5F3E8] bg-white text-[#244A50] hover:bg-slate-50 dark:border-white/10 dark:bg-[#131D45] dark:text-[#D5F3E8] dark:hover:bg-[#162354]'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty & Format Rows */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Platform Difficulty */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                  Platform Difficulty Level:
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {difficultiesList.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-[#244A50] text-white dark:bg-[#B8DFF4] dark:text-[#0A1128]'
                          : 'border border-[#E5F1EF] bg-white text-[#3D6870] hover:bg-slate-50 dark:border-white/10 dark:bg-[#131D45] dark:text-[#A9B8D0]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Format */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                  Question Format:
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {questionFormatsList.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        selectedFormat === fmt
                          ? 'bg-[#244A50] text-white dark:bg-[#B8DFF4] dark:text-[#0A1128]'
                          : 'border border-[#E5F1EF] bg-white text-[#3D6870] hover:bg-slate-50 dark:border-white/10 dark:bg-[#131D45] dark:text-[#A9B8D0]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 border-t border-[#E5F1EF] pt-3 dark:border-white/10">
                <span className="text-[11px] font-semibold text-[#5E848C] dark:text-[#7E8DAA]">
                  Active Filters:
                </span>
                {selectedSubject !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D5F3E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                    Subject: {selectedSubject}
                    <button
                      type="button"
                      onClick={() => setSelectedSubject('All')}
                      aria-label="Remove subject filter"
                      className="hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedDifficulty !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#B8DFF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#244A50] dark:bg-[#131D45] dark:text-[#B8DFF4]">
                    Difficulty: {selectedDifficulty}
                    <button
                      type="button"
                      onClick={() => setSelectedDifficulty('All')}
                      aria-label="Remove difficulty filter"
                      className="hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedFormat !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 dark:bg-[#15224D] dark:text-slate-200">
                    Format: {selectedFormat}
                    <button
                      type="button"
                      onClick={() => setSelectedFormat('All')}
                      aria-label="Remove format filter"
                      className="hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 dark:bg-[#15224D] dark:text-slate-200">
                    Keyword: &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Remove search query"
                      className="hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Counter & Simulation Tag */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#5E848C] dark:text-[#7E8DAA]">
          <span>
            Showing <strong className="font-bold text-[#244A50] dark:text-[#F5FBFA]">{filteredTopics.length}</strong>{' '}
            sample topics matching criteria
          </span>
          <span className="italic">Interactive Sample Exploration Dataset</span>
        </div>

        {/* Results Grid / Loading State / Empty State */}
        {isSimulatedLoading ? (
          <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#D5F3E8] bg-[#F5FBFA] dark:border-white/10 dark:bg-[#101A3C]/40">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#167A80] border-t-transparent dark:border-[#7367F0]" />
              <p className="text-xs text-[#5E848C] dark:text-[#7E8DAA]">Filtering sample modules...</p>
            </div>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 p-8 text-center dark:border-amber-800/40 dark:bg-amber-950/20">
            <Filter size={32} className="text-amber-600 dark:text-amber-400" />
            <h3 className="mt-3 text-base font-bold text-amber-950 dark:text-amber-200">
              No matching sample topics found
            </h3>
            <p className="mt-1 max-w-md text-xs text-amber-900/80 dark:text-amber-300/80">
              We couldn&apos;t find any sample questions for the selected filters or keyword &ldquo;
              {searchQuery}&rdquo;. Try clearing filters or using broader search terms.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex flex-col justify-between rounded-xl border border-[#D5F3E8] bg-[#F5FBFA] p-5 transition-all duration-200 hover:border-[#A9E6DD] hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-[#101A3C] dark:hover:border-[#B8DFF4]/30 dark:hover:bg-[#131D45]"
              >
                <div>
                  {/* Topic Header Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#D5F3E8] px-2 py-0.5 text-[10px] font-bold uppercase text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                        {topic.subject} • {topic.subSubject}
                      </span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#167A80] shadow-2xs dark:bg-[#15224D] dark:text-[#B8DFF4]">
                        {topic.yieldLevel}
                      </span>
                    </div>
                    <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-white/10 dark:bg-[#15224D] dark:text-slate-300">
                      Level: {topic.difficulty}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h3 className="mt-3 text-base font-bold text-[#244A50] dark:text-[#F5FBFA]">
                    {topic.name}
                  </h3>

                  {/* Sample Question Prompt Preview */}
                  <div className="mt-2.5 rounded-lg border border-[#E5F1EF] bg-white p-3 text-xs leading-relaxed text-[#3D6870] dark:border-white/5 dark:bg-[#0A1128]/80 dark:text-[#A9B8D0]">
                    <span className="font-semibold text-[#244A50] dark:text-[#F5FBFA]">
                      Sample Question Stem:
                    </span>{' '}
                    &ldquo;{topic.sampleQuestionPrompt}&rdquo;
                  </div>

                  {/* Key Concepts Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {topic.keyConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="inline-flex items-center gap-1 rounded bg-[#EAF8F4] px-2 py-0.5 text-[10px] font-medium text-[#244A50] dark:bg-[#15224D] dark:text-[#B8DFF4]"
                      >
                        <Tag size={10} />
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-4 flex items-center justify-between border-t border-[#E5F1EF] pt-3 text-xs dark:border-white/10">
                  <span className="text-[11px] text-[#71898D] dark:text-[#7E8DAA]">
                    Format: {topic.format}
                  </span>
                  <a
                    href="#interactive-demo"
                    onClick={() => onTrySampleQuestion?.(topic)}
                    className="inline-flex items-center gap-1 font-semibold text-[#167A80] hover:underline dark:text-[#A9E6DD]"
                  >
                    Try Sample in Demo
                    <Sparkles size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
