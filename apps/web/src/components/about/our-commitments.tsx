'use client';

import React from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import styles from './about.module.css';

const COMMITMENT_PILLARS = [
  {
    title: 'Learning Quality',
    tagline: 'Curriculum Fidelity & Editorial Rigour',
    description:
      'We curate all practice questions and rationales against the published Nepal Medical Education Commission syllabus. Explanations undergo rigorous pre-medical academic review to ensure accuracy.',
    points: [
      'Authentic CEE syllabus topic mapping',
      'Double-checked question rationales & trap warnings',
      'Zero misleading out-of-scope filler material',
    ],
    icon: Award,
  },
  {
    title: 'Student Privacy',
    tagline: 'Strict Confidentiality & Safe Data Practices',
    description:
      'Your preparation data, test scores, error logs, and study schedules belong solely to you. We safeguard aspirant data with modern security standards and never sell student information.',
    points: [
      'Encrypted student credentials and secure sessions',
      'No third-party advertising tracking',
      'Complete control over your personal study records',
    ],
    icon: Lock,
  },
  {
    title: 'Responsible AI',
    tagline: 'Pedagogical Accuracy & Academic Transparency',
    description:
      'AI guidance is designed specifically to clarify concepts, answer doubts step-by-step, and scaffold thinking without hallucinations or encouraging dishonest academic shortcuts.',
    points: [
      'Explanations cite fundamental scientific principles',
      'Encourages genuine inquiry over rote memorization',
      'Clear transparency about AI capabilities and boundaries',
    ],
    icon: ShieldCheck,
  },
  {
    title: 'Continuous Improvement',
    tagline: 'Listening Directly to Pre-Medical Aspirants',
    description:
      'We treat medical entrance preparation as a dynamic, living discipline. We constantly refine questions, update syllabus references, and upgrade simulator tools based on student feedback.',
    points: [
      'Regular question bank enhancements and error reviews',
      'Refining mock simulator UI to match latest exam patterns',
      'Direct feedback channels for student queries',
    ],
    icon: RefreshCcw,
  },
];

export function OurCommitments() {
  return (
    <section
      id="our-commitments"
      aria-labelledby="commitments-heading"
      className={`${styles.section} bg-[#EAF8F4]/50 dark:bg-[#0A1128]/70`}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              ETHICAL STANDARDS
            </span>
          </div>

          <h2
            id="commitments-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Trust, Quality, and Continuous Improvement.
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            Building an entrance preparation platform requires unwavering dedication to
            accuracy, integrity, and student respect. These four commitments guide every
            decision we make.
          </p>
        </div>

        {/* 4 Commitment Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {COMMITMENT_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-[#D5F3E8] bg-white p-7 sm:p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#167A80] hover:shadow-md dark:border-white/10 dark:bg-gradient-to-b dark:from-[#101A3C] dark:to-[#0D1836] dark:hover:border-[#A9E6DD]/40 dark:shadow-none"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D5F3E8] border border-[#167A80]/20 text-[#244A50] dark:border-[#1EC5B2]/30 dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD]">
                      {pillar.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-[#244A50] dark:text-white">
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                  {pillar.description}
                </p>

                <div className="mt-6 pt-5 border-t border-[#E5F1EF] dark:border-white/10">
                  <ul className="space-y-2 text-xs sm:text-sm text-[#244A50] dark:text-slate-300">
                    {pillar.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 text-[#167A80] shrink-0 dark:text-[#A9E6DD]"
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
