import React from 'react';
import {
  Compass,
  FileQuestion,
  Layers,
  LineChart,
  Sparkles,
  Target,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const overviewPillars = [
  {
    icon: Compass,
    title: 'Subject-Based Discovery',
    capability: 'Hierarchical Structure',
    description:
      'Organized across Physics, Chemistry, Botany, and Zoology to allow targeted subject immersion or cross-discipline practice sessions.',
  },
  {
    icon: Layers,
    title: 'Topic-Based Practice',
    capability: 'Micro-Concept Drills',
    description:
      'Break high-yield chapters down into bite-sized concept modules, allowing you to isolate and master precise mechanisms.',
  },
  {
    icon: Target,
    title: 'Difficulty-Based Practice',
    capability: '4-Tier Platform Ladder',
    description:
      'Progress intentionally from Foundation concept checks to Intermediate recall, Advanced applications, and multi-step CEE Challenges.',
  },
  {
    icon: Sparkles,
    title: 'Learning-Focused Explanations',
    capability: 'Complete Distractor Analysis',
    description:
      'Every question details not just why the correct answer holds, but why every incorrect distractor is physiologically or chemically flawed.',
  },
  {
    icon: FileQuestion,
    title: 'Exam-Style Practice',
    capability: 'CEE Marking Simulation',
    description:
      'Simulate official Nepal CEE scoring protocols: +1.0 mark for accurate answers and -0.25 mark deduction for incorrect selections.',
  },
  {
    icon: LineChart,
    title: 'Performance Recommendations',
    capability: 'Adaptive Revision Signals',
    description:
      'Identifies cognitive error patterns (conceptual vs calculation vs trap rushing) to queue relevant spaced review questions.',
  },
];

export function QuestionBankOverview() {
  return (
    <section className="border-b border-[#D5F3E8] bg-white py-16 dark:border-white/10 dark:bg-[#0A1128] sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#167A80] dark:text-[#A9E6DD]">
            Pedagogical Architecture
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Engineered for Deep Medical Understanding
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            The CEE Question Bank is structured as a progressive learning system rather than an
            exhaustive, unvetted dump of questions. Each module is crafted to reinforce core
            scientific reasoning.
          </p>
        </div>

        {/* Capability Grid with Honest Descriptive Labels */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {overviewPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative rounded-2xl border border-[#D5F3E8] bg-[#F5FBFA] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#A9E6DD] hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-[#101A3C] dark:hover:border-[#B8DFF4]/30 dark:hover:bg-[#131D45]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#167A80] shadow-sm ring-1 ring-[#D5F3E8] dark:bg-[#131D45] dark:text-[#B8DFF4] dark:ring-white/10">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-[#D5F3E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                    {pillar.capability}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Data Provenance & Verification Notice */}
        <div className="mt-10 rounded-xl border border-dashed border-[#A9E6DD] bg-[#F5FBFA]/60 p-4 text-center dark:border-white/15 dark:bg-[#101A3C]/40">
          <p className="text-xs text-[#5E848C] dark:text-[#7E8DAA]">
            <strong className="font-semibold text-[#244A50] dark:text-[#F5FBFA]">
              Editorial Transparency:
            </strong>{' '}
            All metrics reflect platform architecture and learning design. In accordance with platform
            standards, unverified question statistics are withheld until faculty review and syllabus
            publication are verified.
          </p>
        </div>
      </Container>
    </section>
  );
}
