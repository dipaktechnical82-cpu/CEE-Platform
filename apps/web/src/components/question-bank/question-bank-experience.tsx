'use client';

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { StudentThemeProvider, useStudentTheme } from '@/components/dashboard/theme-context';
import { QuestionBankHero } from './question-bank-hero';
import { QuestionBankOverview } from './question-bank-overview';
import { SubjectDiscovery } from './subject-discovery';
import { TopicDiscoveryFilter } from './topic-discovery-filter';
import { InteractiveQuestionDemo } from './interactive-question-demo';
import { StudyModesSection } from './study-modes-section';
import { IntelligentFeaturesSection } from './intelligent-features-section';
import { PerformancePreviewSection } from './performance-preview-section';
import { QualityGovernanceSection } from './quality-governance-section';
import { HowItWorksSection } from './how-it-works-section';
import { PremiumConversionSection } from './premium-conversion-section';
import type { SubjectCategory } from './types';

function ThemeFloatingToolbar() {
  const { theme, toggleTheme } = useStudentTheme();

  return (
    <aside aria-label="Question Bank Quick Controls" className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className="flex items-center gap-2 rounded-full border border-[#D5F3E8] bg-white/95 px-4 py-2.5 text-xs font-bold text-[#244A50] shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80] dark:border-white/15 dark:bg-[#101A3C]/95 dark:text-[#F5FBFA] dark:hover:bg-[#131D45]"
      >
        {theme === 'dark' ? (
          <>
            <Sun size={15} className="text-amber-400" />
            <span>Light Theme</span>
          </>
        ) : (
          <>
            <Moon size={15} className="text-[#167A80]" />
            <span>Dark Theme</span>
          </>
        )}
      </button>
    </aside>
  );
}

function QuestionBankContent() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'All'>('All');

  const handleSelectSubject = (subj: SubjectCategory) => {
    setSelectedSubject(subj);
    const element = document.getElementById('topic-filters');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5FBFA] text-[#244A50] transition-colors duration-200 dark:bg-[#060A18] dark:text-[#F5FBFA]">
      <ThemeFloatingToolbar />
      <QuestionBankHero />
      <QuestionBankOverview />
      <SubjectDiscovery onSelectSubject={handleSelectSubject} />
      <TopicDiscoveryFilter
        key={selectedSubject}
        initialSubject={selectedSubject}
      />
      <InteractiveQuestionDemo />
      <StudyModesSection />
      <IntelligentFeaturesSection />
      <PerformancePreviewSection />
      <QualityGovernanceSection />
      <HowItWorksSection />
      <PremiumConversionSection />
    </div>
  );
}

export function QuestionBankExperience() {
  return (
    <StudentThemeProvider>
      <QuestionBankContent />
    </StudentThemeProvider>
  );
}
