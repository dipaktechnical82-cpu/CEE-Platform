import React from 'react';
import Link from 'next/link';
import {
  Clock,
  Dna,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const studyModes = [
  {
    id: 'practice-mode',
    title: 'Practice Mode',
    status: 'Operational Demo',
    statusVariant: 'active' as const,
    icon: Sparkles,
    badgeText: 'Active Demo on this Page',
    headline: 'Instant Feedback & Immediate Rationale',
    description:
      'Solve one question at a time with zero time pressure. Submit to immediately unlock full clinical explanations, distractor analysis, and high-yield takeaway concepts.',
    bestFor: 'Daily concept building and early-stage preparation.',
  },
  {
    id: 'timed-mode',
    title: 'Timed Mode',
    status: 'Preview in Mock Tests',
    statusVariant: 'preview' as const,
    icon: Clock,
    badgeText: 'Available in Exam Arena',
    headline: 'Exam Conditions with 180-Minute Pacing',
    description:
      'Simulate the true Nepal CEE exam environment: 200 questions in 180 minutes with strict +1.0 / -0.25 negative marking. Rationale is hidden until post-exam telemetry.',
    bestFor: 'Speed calibration, negative marking discipline, and endurance.',
  },
  {
    id: 'topic-mode',
    title: 'Topic-wise Mode',
    status: 'Interactive Preview',
    statusVariant: 'preview' as const,
    icon: Layers,
    badgeText: 'Filter Matrix Active',
    headline: 'Micro-Targeted Syllabus Drills',
    description:
      'Filter down to a single subject chapter (e.g. Ionic Equilibrium or Cardiac Electrophysiology) to systematically clear conceptual blind spots.',
    bestFor: 'Targeting specific chapters after textbook reading.',
  },
  {
    id: 'adaptive-mode',
    title: 'Adaptive Practice',
    status: 'Coming Soon',
    statusVariant: 'upcoming' as const,
    icon: Zap,
    badgeText: 'In Active Engineering',
    headline: 'Dynamic AI-Calibrated Question Flow',
    description:
      'The engine automatically elevates question difficulty as your mastery improves, and diverts back to foundational reviews when confusion is detected.',
    bestFor: 'Maximizing learning velocity without wasting time on mastered items.',
  },
  {
    id: 'mistake-mode',
    title: 'Mistake Review',
    status: 'Coming Soon',
    statusVariant: 'upcoming' as const,
    icon: Dna,
    badgeText: 'In Active Engineering',
    headline: 'Spaced Memory & Error DNA Repetition',
    description:
      'Revisit every question you missed or flagged during practice sessions. Spaced repetition intervals ensure knowledge moves into permanent memory before CEE day.',
    bestFor: 'Eliminating recurring blunders and converting weaknesses into strengths.',
  },
];

export function StudyModesSection() {
  return (
    <section className="border-b border-[#D5F3E8] bg-white py-16 dark:border-white/10 dark:bg-[#0A1128] sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#167A80] dark:text-[#A9E6DD]">
            Engineered Modalities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Flexible Study Modes for Every Stage
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            Whether you need rapid concept reinforcement or rigorous full-length CEE exam simulation,
            choose the mode engineered for your daily study goals.
          </p>
        </div>

        {/* Study Modes Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studyModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#D5F3E8] bg-[#F5FBFA] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#A9E6DD] hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-[#101A3C] dark:hover:border-[#B8DFF4]/30 dark:hover:bg-[#131D45]"
              >
                <div>
                  {/* Top Bar with Icon and Honest Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#167A80] shadow-sm ring-1 ring-[#D5F3E8] dark:bg-[#131D45] dark:text-[#B8DFF4] dark:ring-white/10">
                      <Icon size={20} />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        mode.statusVariant === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : mode.statusVariant === 'preview'
                          ? 'bg-[#B8DFF4] text-[#244A50] dark:bg-[#131D45] dark:text-[#B8DFF4]'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {mode.badgeText}
                    </span>
                  </div>

                  {/* Mode Title & Headline */}
                  <h3 className="mt-5 text-xl font-bold text-[#244A50] dark:text-[#F5FBFA]">
                    {mode.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#167A80] dark:text-[#A9E6DD]">
                    {mode.headline}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                    {mode.description}
                  </p>
                </div>

                {/* Best for footer */}
                <div className="mt-6 border-t border-[#E5F1EF] pt-4 text-xs dark:border-white/10">
                  <span className="font-semibold text-[#244A50] dark:text-[#D5F3E8]">Best for: </span>
                  <span className="text-[#5E848C] dark:text-[#7E8DAA]">{mode.bestFor}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Transparency Banner */}
        <div className="mt-10 rounded-xl border border-dashed border-[#A9E6DD] bg-[#F5FBFA] p-4 text-center text-xs text-[#5E848C] dark:border-white/15 dark:bg-[#101A3C]/40 dark:text-[#7E8DAA]">
          <p>
            <strong className="font-semibold text-[#244A50] dark:text-[#F5FBFA]">Engineering Status:</strong>{' '}
            Practice Mode and Topic Filtering are active in the interactive preview above. Full Timed
            Exam simulation is featured in the{' '}
            <Link href="/mock-tests" className="font-semibold underline hover:text-[#167A80]">
              Mock Test Arena
            </Link>
            . Adaptive Practice and Mistake DNA are undergoing active backend model development.
          </p>
        </div>
      </Container>
    </section>
  );
}
