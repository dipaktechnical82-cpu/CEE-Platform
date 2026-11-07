'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import styles from './features.module.css';

interface PathwayStep {
  number: string;
  title: string;
  phase: string;
  description: string;
  keyDetails: string[];
  verifiedSource: string;
}

const PATHWAY_STEPS: PathwayStep[] = [
  {
    number: '01',
    phase: 'PREPARATION & SYLLABUS MASTERY',
    title: 'MEC CEE Core Curriculum Mastery',
    description:
      'Rigorous preparation across Physics (50 marks), Chemistry (50 marks), Biology (80 marks), and Mental Agility Test (20 marks).',
    keyDetails: [
      'Total 200 MCQs in 180 minutes duration',
      'Negative marking: -0.25 mark penalty for wrong options',
      'Dual verification against National Curriculum Development Centre standards',
    ],
    verifiedSource: 'Medical Education Commission (MEC) Nepal Curriculum Spec',
  },
  {
    number: '02',
    phase: 'REGISTRATION & VERIFICATION',
    title: 'Official MEC Application & Biometrics',
    description:
      'Online application submission on the MEC portal with verified +2 Science credentials, citizenship/NID documentation, and biometric photo clearance.',
    keyDetails: [
      'Minimum eligibility: 50% aggregate in +2 Science (Physics, Chem, Bio)',
      'Or minimum 2.4 CGPA under revised NEB grading guidelines',
      'Biometric computerized admit card issuance',
    ],
    verifiedSource: 'National Medical Education Act 2075 & MEC Guidelines',
  },
  {
    number: '03',
    phase: 'EXAMINATION DAY',
    title: 'National CEE Examination Day',
    description:
      'Strict computer-monitored examination held across verified university exam centers in Kathmandu valley and provincial centres.',
    keyDetails: [
      'OMR optical recognition scanning for error-free evaluation',
      'Jammer-equipped designated hall security',
      'Simultaneous nationwide start across all authorized halls',
    ],
    verifiedSource: 'MEC Examination Directorate Operations Protocol',
  },
  {
    number: '04',
    phase: 'MERIT PUBLICATION',
    title: 'Merit Score & Percentile Rank Publication',
    description:
      'MEC publishes the unified national merit list with raw score, negative penalty deduction, and provincial rank breakdown.',
    keyDetails: [
      'Minimum qualifying benchmark: 50th percentile of total candidate pool',
      'Open merit rank list & separate reservation quota lists',
      'Strict transparency with roll-number verified scorecard downloads',
    ],
    verifiedSource: 'MEC Nepal Public Merit Notice Board',
  },
  {
    number: '05',
    phase: 'SCHOLARSHIP & COUNSELING',
    title: '75% Free Government Scholarship Allocation',
    description:
      'Mandatory centralized online matching under the Medical Education Act 2075 providing 75% free scholarship seats in all government medical institutions.',
    keyDetails: [
      'Applicable at IOM Maharajgunj, BPKIHS Dharan, PAHS, KAHS, and Pokhara Academy',
      'Mandatory government service bond (2 years) upon graduation',
      'Transparent computerized merit-priority allocation rounds',
    ],
    verifiedSource: 'Medical Education Act 2075 Section 17 & MEC Regulations',
  },
  {
    number: '06',
    phase: 'MEDICAL ADMISSION',
    title: 'College Enrollment & White Coat Ceremony',
    description:
      'Verification of original certificates at your allocated university campus, medical fitness clearance, and official initiation into medicine.',
    keyDetails: [
      'Final credential verification at campus administration',
      'Registration with Nepal Medical Council (NMC) as medical student',
      'Commencement of 5.5-year MBBS curriculum including mandatory clinical internship',
    ],
    verifiedSource: 'Nepal Medical Council (NMC) Accreditation Standards',
  },
];

export function DoctorPathwaySection() {
  return (
    <section id="pathway" className={styles.section}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <Stethoscope size={12} aria-hidden="true" />
            <span>FUTURE DOCTOR PATHWAY</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Preparation Is{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              Only the Beginning.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            Your journey towards medical school should not end with examination preparation. Stay
            informed about the next steps towards your medical career.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Timeline Visual Presentation                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 relative">
          {/* Vertical Center Line for Desktop */}
          <div
            className="hidden lg:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#1EC5B2] via-[#38BDF8] to-[#7367F0] opacity-30"
            aria-hidden="true"
          />

          <div className="space-y-8 lg:space-y-12">
            {PATHWAY_STEPS.map((step, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col ${
                    isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } items-center gap-6 lg:gap-12`}
                >
                  {/* Step Card */}
                  <div className="w-full lg:w-[calc(50%-2rem)] rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1128] p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-[#A9E6DD] bg-[#A9E6DD]/10 border border-[#A9E6DD]/30">
                        {step.phase}
                      </span>
                      <span className="text-xs font-mono font-black text-slate-400">
                        PHASE {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-[#A9B8D0] leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                      {step.keyDetails.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Source: {step.verifiedSource}</span>
                    </div>
                  </div>

                  {/* Center Node Badge */}
                  <div className="hidden lg:flex shrink-0 w-12 h-12 rounded-full border-2 border-[#1EC5B2] bg-[#060A18] items-center justify-center font-mono font-black text-xs text-[#A9E6DD] shadow-[0_0_20px_rgba(30,197,178,0.4)] z-20">
                    {step.number}
                  </div>

                  {/* Empty Spacer Column on Opposite Side */}
                  <div className="hidden lg:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Verified Medical Colleges of Nepal Reference Banner                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-[#B8DFF4]/20 bg-gradient-to-r from-[#0C152B] to-[#0A1020] shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="text-[#38BDF8]" size={20} />
                <h3 className="text-lg font-bold text-white">Target Medical Colleges in Nepal</h3>
              </div>
              <p className="text-xs text-[#A9B8D0] max-w-2xl leading-relaxed">
                CEE results qualify you for MBBS and BDS admissions across Institute of Medicine
                (IOM Maharajgunj), B.P. Koirala Institute of Health Sciences (BPKIHS Dharan), Patan
                Academy of Health Sciences (PAHS), Kathmandu University School of Medical Sciences
                (KUSMS), Pokhara Academy of Health Sciences, and affiliated private medical colleges.
              </p>
            </div>

            <Link
              href="/syllabus"
              className="inline-flex items-center gap-2 shrink-0 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 px-5 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <span>Explore CEE Syllabus</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
