'use client';

import React from 'react';
import {
  AlertTriangle,
  Clock,
  Lightbulb,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const GUIDANCE_ITEMS = [
  {
    icon: Clock,
    title: 'Calibrate Section Timing',
    rule: '~54 Seconds per MCQ',
    description:
      'In a 180-minute, 200-question CEE exam, pace Biology at 40s/Q to bank time for multi-step Physics kinematics and Chemistry stoichiometry calculations.',
  },
  {
    icon: ShieldCheck,
    title: 'Strategic Mark for Review',
    rule: 'The Two-Pass Method',
    description:
      'Pass 1: Answer unambiguous recall and standard items. Flag difficult calculations for Pass 2. Never dwell on a single question for longer than 90 seconds.',
  },
  {
    icon: AlertTriangle,
    title: 'Control Negative Marking',
    rule: '-0.25 Penalty Discipline',
    description:
      'With a 25% negative marking deduction, blind guessing drops your expected value to negative. Only attempt when you have eliminated at least two distractors.',
  },
  {
    icon: Target,
    title: 'Careful Trap Detection',
    rule: 'Check Negative Qualifiers',
    description:
      'Over 30% of medical entrance errors stem from rushing past words like "EXCEPT", "INCORRECT", "ISOBARIC", or confusing scalar distance with vector displacement.',
  },
];

export function MockExamGuidance() {
  return (
    <section className="py-12 border-t border-inherit" aria-labelledby="guidance-heading">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9E6DD]">
            <Lightbulb size={14} aria-hidden="true" />
            <span>EXAMINATION TACTICS</span>
          </div>
          <h2 id="guidance-heading" className="mt-1 text-2xl font-bold tracking-tight">
            Medical Entrance Examination Protocol
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
            Practical, high-yield examination discipline derived from past Nepal CEE entrance
            benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUIDANCE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-inherit bg-white/[0.02] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="p-2 rounded-xl bg-white/5 text-[#A9E6DD] border border-inherit">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">
                      {item.rule}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-inherit">{item.title}</h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
