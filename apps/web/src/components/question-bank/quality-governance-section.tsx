import React from 'react';
import {
  BookCheck,
  GitBranch,
  History,
  Lock,
  Scale,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const governanceSteps = [
  {
    step: '01',
    title: 'Question Draft',
    icon: BookCheck,
    summary: 'Authored with Clear Pedagogy',
    detail:
      'Questions are drafted against clear subject, sub-discipline, and topic classifications, with reference contexts and distractor rationales.',
  },
  {
    step: '02',
    title: 'Academic Review',
    icon: UserCheck,
    summary: 'Distractor & Ambiguity Check',
    detail:
      'Subject matter educators inspect options to verify scientific correctness, remove confusing phrasing, and eliminate double-correct anomalies.',
  },
  {
    step: '03',
    title: 'Faculty Verification',
    icon: ShieldCheck,
    summary: 'CEE Benchmark Validation',
    detail:
      'Senior medical entrance faculty calibrate difficulty tiers and ensure alignment with Nepal entrance standards before endorsement.',
  },
  {
    step: '04',
    title: 'Versioned Publication',
    icon: Lock,
    summary: 'Tamper-Proof Attempt Records',
    detail:
      'Questions are published with immutable cryptographic version identifiers so subsequent editorial updates never distort historical student attempts.',
  },
];

export function QualityGovernanceSection() {
  return (
    <section className="border-b border-[#D5F3E8] bg-[#F5FBFA] py-16 dark:border-white/10 dark:bg-[#07171D] sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#167A80] dark:text-[#A9E6DD]">
            Academic Integrity &amp; Provenance
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
            Why Question Quality and Answer Reliability Matter
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
            Medical entrance preparation cannot afford ambiguous questions, flawed keys, or silent
            corrections. We are establishing an uncompromising editorial and versioned governance
            pipeline.
          </p>
        </div>

        {/* Intended Workflow Flowchart: Draft -> Review -> Verified -> Published */}
        <div className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {governanceSteps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative flex flex-col justify-between rounded-2xl border border-[#D5F3E8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#101A3C]"
                >
                  <div>
                    {/* Step indicator & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D5F3E8] text-xs font-bold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                        {st.step}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-[#167A80] dark:bg-[#131D45] dark:text-[#B8DFF4]">
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#244A50] dark:text-[#F5FBFA]">
                      {st.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#167A80] dark:text-[#A9E6DD]">
                      {st.summary}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                      {st.detail}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#E5F1EF] pt-3 text-[11px] font-semibold text-[#5E848C] dark:border-white/10 dark:text-[#7E8DAA]">
                    Pipeline Phase {idx + 1} of 4
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Principles Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E5F1EF] bg-white p-4 dark:border-white/10 dark:bg-[#101A3C]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">
              <GitBranch size={16} className="text-[#167A80] dark:text-[#A9E6DD]" />
              Immutable Versioning
            </div>
            <p className="mt-2 text-xs text-[#5E848C] dark:text-[#A9B8D0]">
              If an errata or clarification is published, historical student attempt records remain
              anchored to the exact question snapshot evaluated at that time.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5F1EF] bg-white p-4 dark:border-white/10 dark:bg-[#101A3C]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">
              <Scale size={16} className="text-[#167A80] dark:text-[#A9E6DD]" />
              Zero-Ambiguity Standards
            </div>
            <p className="mt-2 text-xs text-[#5E848C] dark:text-[#A9B8D0]">
              Questions with conflicting commercial textbook keys are re-examined against authoritative
              references (e.g. Guyton, Lehninger, NCERT, Halliday-Resnick).
            </p>
          </div>

          <div className="rounded-xl border border-[#E5F1EF] bg-white p-4 dark:border-white/10 dark:bg-[#101A3C]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">
              <History size={16} className="text-[#167A80] dark:text-[#A9E6DD]" />
              Transparent Provenance
            </div>
            <p className="mt-2 text-xs text-[#5E848C] dark:text-[#A9B8D0]">
              Each published item maintains source provenance, distinguishing verified Past Year
              Questions from faculty-authored high-yield drill items.
            </p>
          </div>
        </div>

        {/* Governance Transparency Notice */}
        <div className="mt-8 rounded-xl border border-dashed border-[#A9E6DD] bg-white p-4 text-center text-xs text-[#5E848C] dark:border-white/15 dark:bg-[#101A3C]/60 dark:text-[#7E8DAA]">
          <p>
            <strong className="font-semibold text-[#244A50] dark:text-[#F5FBFA]">
              Quality Commitment Notice:
            </strong>{' '}
            We do not make unsupported claims such as &ldquo;100% verified question bank&rdquo;. The
            four-stage content review workflow described above represents our published engineering
            and editorial architecture currently in faculty onboarding.
          </p>
        </div>
      </Container>
    </section>
  );
}
