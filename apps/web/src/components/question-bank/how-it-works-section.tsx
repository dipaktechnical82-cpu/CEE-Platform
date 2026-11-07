import React from 'react';
import {
  ArrowRight,
  Compass,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const steps = [
  {
    number: '01',
    title: 'Choose Your Subject',
    actionText: 'Explore & Filter Topics',
    description:
      'Select a subject discipline and filter high-yield chapters by topic or difficulty to target exactly what you need to study today.',
    icon: Compass,
    iconColor: 'text-[#167A80] dark:text-[#A9E6DD]',
    iconBg: 'bg-teal-50 dark:bg-[#131D45]',
  },
  {
    number: '02',
    title: 'Answer and Understand',
    actionText: 'Solve & Review Rationale',
    description:
      'Attempt the question under CEE-style scoring rules. Instantly uncover deep explanations that dissect the correct mechanism and all three distractors.',
    icon: Lightbulb,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    number: '03',
    title: 'Improve Your Preparation',
    actionText: 'Close Knowledge Gaps',
    description:
      'Use Mistake DNA and spaced revision radar recommendations to target weak concepts until you can answer them with complete confidence.',
    icon: TrendingUp,
    iconColor: 'text-[#7367F0] dark:text-[#B8DFF4]',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-b border-[#D5F3E8] bg-white py-16 dark:border-white/10 dark:bg-[#0A1128] sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#167A80] dark:text-[#A9E6DD]">
            Methodology
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            How the Question Bank Transforms Your Study
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            Three intuitive steps connect question solving with permanent memory and exam readiness.
          </p>
        </div>

        {/* 3-Step Connected Flowchart Layout */}
        <div className="relative mt-14">
          {/* Connector Line on Desktop */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 hidden h-0.5 w-4/5 -translate-x-1/2 -translate-y-12 bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] dark:from-[#7367F0]/30 dark:via-[#167A80]/30 dark:to-[#B8DFF4]/30 lg:block"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.number}
                  className="relative flex flex-col justify-between rounded-2xl border border-[#D5F3E8] bg-[#F5FBFA] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#A9E6DD] hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-[#101A3C] dark:hover:border-[#B8DFF4]/30 dark:hover:bg-[#131D45]"
                >
                  <div>
                    {/* Header with Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-[#244A50] shadow-sm ring-1 ring-[#D5F3E8] dark:bg-[#131D45] dark:text-[#A9E6DD] dark:ring-white/10">
                        {st.number}
                      </span>
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${st.iconBg} ${st.iconColor}`}
                      >
                        <Icon size={22} />
                      </div>
                    </div>

                    <span className="mt-5 inline-block text-xs font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD]">
                      Step {idx + 1}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-[#244A50] dark:text-[#F5FBFA]">
                      {st.title}
                    </h3>

                    <p className="mt-3 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-sm">
                      {st.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 border-t border-[#E5F1EF] pt-4 text-xs font-semibold text-[#167A80] dark:border-white/10 dark:text-[#B8DFF4]">
                    <span>{st.actionText}</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
