import React from 'react';
import {
  BrainCircuit,
  Camera,
  Cpu,
  Dna,
  Radar,
  TrendingUp,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

export function IntelligentFeaturesSection() {
  return (
    <section className="border-b border-[#D5F3E8] bg-[#F5FBFA] py-16 dark:border-white/10 dark:bg-[#07171D] sm:py-24">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#167A80] dark:text-[#A9E6DD]">
            Next-Generation AI Intelligence
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Intelligent Features That Transform Question Practice
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            CEE Medical Prep connects every practice question to a continuous intelligence loop that
            diagnoses your thinking patterns and personalizes revision.
          </p>
        </div>

        {/* Feature Cards Matrix - Distinct Layouts & Visuals */}
        <div className="mt-14 space-y-8">
          {/* Feature 1 & 2 in 2-column grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 1. Mistake DNA */}
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#101A3C] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                  <Dna size={14} />
                  MISTAKE DNA™
                </span>
                <span className="text-[11px] font-semibold text-[#5E848C] dark:text-[#7E8DAA]">
                  Error Fingerprinting
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-[#244A50] dark:text-[#F5FBFA]">
                Decode Why You Missed the Question
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-sm">
                Most students repeat the same mental traps. Mistake DNA categorizes your incorrect
                answers into distinct cognitive buckets so you can fix the root habit.
              </p>

              {/* Visual Diagram: Error Fingerprint Breakdown */}
              <div className="mt-5 rounded-xl border border-[#E5F1EF] bg-[#F5FBFA] p-4 dark:border-white/5 dark:bg-[#131D45]/80">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                  Simulated Student Error Breakdown:
                </p>
                <div className="mt-3 space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#244A50] dark:text-[#F5FBFA]">
                      <span>Trap Rushing (Misreading NOT / EXCEPT)</span>
                      <span>42% of errors</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: '42%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#244A50] dark:text-[#F5FBFA]">
                      <span>Core Conceptual Gap (Unfamiliar mechanism)</span>
                      <span>36% of errors</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-rose-500" style={{ width: '36%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#244A50] dark:text-[#F5FBFA]">
                      <span>Unit / Sign Arithmetic Slip</span>
                      <span>22% of errors</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: '22%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs font-medium text-[#167A80] dark:text-[#A9E6DD]">
                Student Benefit: Eliminates repeated careless errors that cause heavy negative marks.
              </div>
            </div>

            {/* 2. Question Difficulty Ladder */}
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#101A3C] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8DFF4] px-3 py-1 text-xs font-bold text-[#244A50] dark:bg-[#131D45] dark:text-[#B8DFF4]">
                  <TrendingUp size={14} />
                  DIFFICULTY LADDER
                </span>
                <span className="text-[11px] font-semibold text-[#5E848C] dark:text-[#7E8DAA]">
                  Stepwise Mastery
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-[#244A50] dark:text-[#F5FBFA]">
                Progress Step-by-Step Without Frustration
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-sm">
                Move progressively from foundational recall questions to multi-concept CEE Challenge
                problems that separate top medical school rankers.
              </p>

              {/* Visual Diagram: 4-Step Difficulty Progression */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F5FBFA] p-3 text-xs dark:border-white/5 dark:bg-[#131D45]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">Foundation: </span>
                    <span className="text-[#5E848C] dark:text-[#A9B8D0]">
                      Direct definitions, anatomical facts, and standard terminology.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F5FBFA] p-3 text-xs dark:border-white/5 dark:bg-[#131D45]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-100 font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">Intermediate: </span>
                    <span className="text-[#5E848C] dark:text-[#A9B8D0]">
                      Standard single-formula physics and single-reaction chemistry problems.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F5FBFA] p-3 text-xs dark:border-white/5 dark:bg-[#131D45]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 font-bold text-indigo-800 dark:bg-[#15224D] dark:text-indigo-300">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">Advanced: </span>
                    <span className="text-[#5E848C] dark:text-[#A9B8D0]">
                      Multi-step calculations, physiological regulation, and distractor traps.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs dark:border-rose-900/30 dark:bg-rose-950/20">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 font-bold text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                    4
                  </span>
                  <div>
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">CEE Challenge: </span>
                    <span className="text-[#5E848C] dark:text-[#A9B8D0]">
                      Assertion &amp; Reason, complex graphs, and cross-subject integrative questions.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs font-medium text-[#167A80] dark:text-[#A9E6DD]">
                Student Benefit: Builds rock-solid fundamentals before tackling intimidating challenge items.
              </div>
            </div>
          </div>

          {/* Features 3, 4, 5, 6 in 4-column or 2x2 grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 3. Smart Revision Radar */}
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101A3C]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D5F3E8] text-[#167A80] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                <Radar size={20} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                Smart Revision Radar
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                Calibrated to the biological Ebbinghaus forgetting curve. Automatically alerts you
                when previously mastered topics require spaced refresh before retention drops.
              </p>
              <div className="mt-4 rounded-lg bg-[#F5FBFA] p-2.5 text-[11px] font-semibold text-[#167A80] dark:bg-[#131D45] dark:text-[#B8DFF4]">
                Spaced Retesting at 3, 7 &amp; 21 Days
              </div>
            </div>

            {/* 4. AI Personal CEE Mentor */}
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101A3C]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                <BrainCircuit size={20} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                AI Personal CEE Mentor
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                Stuck on a tricky question? The AI mentor provides Socratic hints and guiding questions
                without prematurely revealing the final answer key.
              </p>
              <div className="mt-4 rounded-lg bg-[#F5FBFA] p-2.5 text-[11px] font-semibold text-purple-700 dark:bg-[#131D45] dark:text-purple-300">
                Step-by-Step Conceptual Nudges
              </div>
            </div>

            {/* 5. Adaptive Learning Engine */}
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101A3C]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-[#A9E6DD]">
                <Cpu size={20} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                Adaptive Learning
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                Dynamically adjusts your next question based on current session accuracy, confidence
                tags, and time spent per problem.
              </p>
              <div className="mt-4 rounded-lg bg-[#F5FBFA] p-2.5 text-[11px] font-semibold text-[#167A80] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                Dynamic Real-Time Weighting
              </div>
            </div>

            {/* 6. AI Doubt Scanner */}
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101A3C]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                <Camera size={20} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="mt-3 text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                  AI Doubt Scanner
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                Snapshot physical book questions, circuit diagrams, or histological micrographs. The
                multi-modal engine transcribes and explains the underlying concept.
              </p>
              <div className="mt-4 rounded-lg bg-[#F5FBFA] p-2.5 text-[11px] font-semibold text-amber-700 dark:bg-[#131D45] dark:text-amber-300">
                Multi-Modal OCR Preview
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
