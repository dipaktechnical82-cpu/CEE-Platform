import React from 'react';
import {
  Activity,
  Dna,
  LineChart,
  Target,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const sampleSubjectMastery = [
  { subject: 'Botany', accuracy: 82, questionsDone: 140, totalSample: 170, color: 'bg-emerald-500' },
  { subject: 'Zoology', accuracy: 78, questionsDone: 135, totalSample: 170, color: 'bg-indigo-500' },
  { subject: 'Chemistry', accuracy: 72, questionsDone: 110, totalSample: 150, color: 'bg-[#167A80]' },
  { subject: 'Physics', accuracy: 66, questionsDone: 95, totalSample: 150, color: 'bg-sky-500' },
];

export function PerformancePreviewSection() {
  return (
    <section className="border-b border-[#D5F3E8] bg-white py-16 dark:border-white/10 dark:bg-[#0A1128] sm:py-24">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E6DD] bg-[#F5FBFA] px-3 py-1 text-xs font-bold text-[#167A80] dark:border-white/10 dark:bg-[#101A3C] dark:text-[#A9E6DD]">
            <LineChart size={13} />
            STUDENT DASHBOARD CAPABILITY PREVIEW
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Turn Question Practice into Measurable CEE Growth
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            Every practice session feeds directly into high-resolution telemetry. Here is a preview
            of how your registered student dashboard tracks mastery across the entrance syllabus.
          </p>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-dashed border-[#A9E6DD] bg-[#F5FBFA] p-3 text-center text-xs text-[#5E848C] dark:border-white/15 dark:bg-[#101A3C]/60 dark:text-[#7E8DAA]">
          <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">
            DEMONSTRATION DATA ONLY:
          </span>{' '}
          The analytics below illustrate student telemetry in action. Registered students unlock
          their own personalized performance tracking upon completing diagnostic practice.
        </div>

        {/* Analytics Visual Cockpit Mockup */}
        <div className="mt-10 rounded-2xl border border-[#A9E6DD] bg-[#F5FBFA] p-6 shadow-lg dark:border-[#B8DFF4]/20 dark:bg-[#101A3C] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5F1EF] pb-4 dark:border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                CEE Preparation Telemetry
              </span>
              <h3 className="text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                Cumulative Practice Analytics
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Pacing: 52 sec / Q (Optimal)
              </span>
              <span className="rounded-full bg-[#D5F3E8] px-3 py-1 text-xs font-bold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                Overall Accuracy: 74.5%
              </span>
            </div>
          </div>

          {/* Grid of Telemetry Widgets */}
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Widget 1: Subject Accuracy Progress */}
            <div className="rounded-xl border border-[#E5F1EF] bg-white p-5 dark:border-white/5 dark:bg-[#131D45]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">
                  Subject-Wise Accuracy
                </span>
                <Target size={16} className="text-[#167A80] dark:text-[#A9E6DD]" />
              </div>

              <div className="mt-4 space-y-3.5">
                {sampleSubjectMastery.map((item) => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#3D6870] dark:text-[#A9B8D0]">{item.subject}</span>
                      <span className="text-[#244A50] dark:text-[#F5FBFA]">{item.accuracy}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Mistake DNA Breakdown */}
            <div className="rounded-xl border border-[#E5F1EF] bg-white p-5 dark:border-white/5 dark:bg-[#131D45]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">
                  Error Category Distribution
                </span>
                <Dna size={16} className="text-[#7367F0] dark:text-[#B8DFF4]" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-[#F5FBFA] p-2.5 text-xs dark:bg-[#101A3C]">
                  <span className="text-[#3D6870] dark:text-[#A9B8D0]">Trap Rush (Negative Marking Risk)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">18 questions</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#F5FBFA] p-2.5 text-xs dark:bg-[#101A3C]">
                  <span className="text-[#3D6870] dark:text-[#A9B8D0]">Concept Gap (Requires Chapter Review)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">14 questions</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#F5FBFA] p-2.5 text-xs dark:bg-[#101A3C]">
                  <span className="text-[#3D6870] dark:text-[#A9B8D0]">Calculation Slip (Algebra / Units)</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">9 questions</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-[#5E848C] dark:text-[#7E8DAA]">
                Targeting trap rush habits alone can recover 4–7 net CEE marks per mock test.
              </p>
            </div>

            {/* Widget 3: Immediate Spaced Revision Queue */}
            <div className="rounded-xl border border-[#E5F1EF] bg-white p-5 dark:border-white/5 dark:bg-[#131D45] md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">
                  Revision Priorities (Today)
                </span>
                <Activity size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="rounded-lg border border-[#D5F3E8] bg-[#F5FBFA] p-2.5 text-xs dark:border-white/5 dark:bg-[#101A3C]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">
                      Renal Countercurrent Exchanger
                    </span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Overdue 2d</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#5E848C] dark:text-[#7E8DAA]">
                    Zoology • Loop of Henle permeability rules
                  </p>
                </div>

                <div className="rounded-lg border border-[#D5F3E8] bg-[#F5FBFA] p-2.5 text-xs dark:border-white/5 dark:bg-[#101A3C]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">
                      Buffer Solutions &amp; Henderson Eq.
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Due Today</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#5E848C] dark:text-[#7E8DAA]">
                    Chemistry • Blood carbonic-bicarbonate ratio
                  </p>
                </div>

                <div className="rounded-lg border border-[#D5F3E8] bg-[#F5FBFA] p-2.5 text-xs dark:border-white/5 dark:bg-[#101A3C]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#244A50] dark:text-[#F5FBFA]">
                      Photoelectric Stopping Potential
                    </span>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Due Tomorrow</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#5E848C] dark:text-[#7E8DAA]">
                    Physics • Frequency vs Intensity curves
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
