'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Database,
  Library,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import styles from './features.module.css';

interface SubjectMasteryItem {
  subject: string;
  weightage: string;
  questions: number;
  masteryPct: number;
  color: string;
  subtopics: string[];
}

const SUBJECT_MASTERY: SubjectMasteryItem[] = [
  {
    subject: 'Biology (Zoology & Botany)',
    weightage: '80 Marks (40%)',
    questions: 80,
    masteryPct: 86,
    color: '#10B981',
    subtopics: [
      'Zoology: Human Physiology, Genetics, Animal Tissues, Developmental Biology',
      'Botany: Plant Anatomy, Photosynthesis, Plant Physiology, Ecology & Environment',
    ],
  },
  {
    subject: 'Chemistry',
    weightage: '50 Marks (25%)',
    questions: 50,
    masteryPct: 74,
    color: '#38BDF8',
    subtopics: [
      'Physical Chemistry: Thermodynamics, Electrochemistry, Chemical Kinetics',
      'Organic Chemistry: Reaction Mechanisms, Biomolecules, Functional Conversions',
      'Inorganic Chemistry: Coordination Chemistry, Transition Elements, Metallurgy',
    ],
  },
  {
    subject: 'Physics',
    weightage: '50 Marks (25%)',
    questions: 50,
    masteryPct: 68,
    color: '#7367F0',
    subtopics: [
      'Mechanics: Kinematics, Dynamics, Rotational Motion, Gravitation',
      'Electrodynamics: Current Electricity, Magnetism, Electromagnetic Induction',
      'Modern Physics & Optics: Nuclear Physics, Photoelectric Effect, Ray & Wave Optics',
    ],
  },
  {
    subject: 'Mental Agility Test (MAT)',
    weightage: '20 Marks (10%)',
    questions: 20,
    masteryPct: 92,
    color: '#F59E0B',
    subtopics: [
      'Logical Deduction: Syllogisms, Direction Sense, Blood Relations',
      'Numerical Reasoning: Series Completion, Data Interpretation, Arithmetic Logic',
      'Abstract Reasoning: Spatial Orientation, Pattern Recognition, Cube & Die Traps',
    ],
  },
];

export function LearningSystemSection() {
  const [selectedLadderLevel, setSelectedLadderLevel] = useState<number>(2);

  return (
    <section id="learning-system" className={`${styles.section} bg-[#040814] dark:bg-[#030610]`}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <Library size={12} aria-hidden="true" />
            <span>INTELLIGENT LEARNING SYSTEM</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Academic Rigor Meets{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              Precision Learning.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            A structured, verified curriculum architecture engineered around the official Medical
            Education Commission (MEC) Nepal examination blueprint.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Component 1: Smart Question Bank + Adaptive Learning Split         */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Smart Question Bank */}
          <div className="lg:col-span-7 rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1224] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2">
                <Database className="text-[#38BDF8]" size={20} aria-hidden="true" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">Smart Question Bank</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                15,000+ VERIFIED MCQs
              </span>
            </div>

            <p className="text-sm text-[#A9B8D0] leading-relaxed mb-6">
              A structured CEE question collection organized by subject, topic, difficulty and
              verified answer explanations. Every question undergoes dual faculty review to ensure
              zero ambiguities and 100% syllabus alignment.
            </p>

            {/* Subject Breakdown Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { name: 'Biology', count: '6,200+ Qs', share: '40% Exam' },
                { name: 'Chemistry', count: '4,100+ Qs', share: '25% Exam' },
                { name: 'Physics', count: '3,800+ Qs', share: '25% Exam' },
                { name: 'MAT', count: '1,500+ Qs', share: '10% Exam' },
              ].map((s) => (
                <div key={s.name} className="p-3 rounded-xl border border-white/10 bg-white/5 text-center">
                  <p className="text-xs font-bold text-white">{s.name}</p>
                  <p className="text-sm font-extrabold text-[#A9E6DD] mt-0.5">{s.count}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.share}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-[#060A18]/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#A9E6DD]">
                <span>SAMPLE METADATA TAGGING</span>
                <span>STATUS: VERIFIED</span>
              </div>
              <p className="font-semibold text-white">
                &quot;The ratio of root mean square velocity to average velocity of gas molecules at absolute temperature T is...&quot;
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                <span className="bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Subject: Physics</span>
                <span className="bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded border border-purple-800">Topic: Kinetic Theory</span>
                <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Difficulty: Challenger</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Past Ref: CEE 2022</span>
              </div>
            </div>
          </div>

          {/* Adaptive Learning Engine */}
          <div className="lg:col-span-5 rounded-3xl border border-[#B8DFF4]/15 bg-[#0C152B] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-[#A9E6DD]" size={20} aria-hidden="true" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">Adaptive Learning</h3>
              </div>

              <p className="text-sm text-[#A9B8D0] leading-relaxed">
                Learning recommendations that respond to actual student performance. Rather than static
                chapter progressions, the system calibrates challenge levels in real-time.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    condition: 'High Accuracy + Fast Latency',
                    action: 'Elevates to Challenger-tier clinical scenarios and reduces question scaffolding.',
                    color: '#10B981',
                  },
                  {
                    condition: 'Repeated Formula Stumbles',
                    action: 'Temporarily inserts micro-concept refreshers before continuing problem sets.',
                    color: '#F59E0B',
                  },
                  {
                    condition: 'Intermittent Rush Traps',
                    action: 'Activates pacing prompts and forces confirmation checks on inverse-logic prompts.',
                    color: '#38BDF8',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-white/10 bg-[#060A18]/80 text-xs">
                    <p className="font-bold text-white flex items-center gap-2" style={{ color: item.color }}>
                      <span>●</span> {item.condition}
                    </p>
                    <p className="text-slate-300 mt-1 leading-relaxed">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Dynamic Difficulty Index</span>
              <span className="font-mono text-emerald-400 font-bold">100% Calibrated</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Component 2: Question Difficulty Ladder (Interactive Tiers)         */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 rounded-3xl border border-[#B8DFF4]/15 bg-gradient-to-br from-[#0A1224] to-[#070D1C] p-6 sm:p-10 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#A9E6DD] bg-[#A9E6DD]/10 border border-[#A9E6DD]/30">
              PROGRESSION METHODOLOGY
            </span>
            <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
              Question Difficulty Ladder
            </h3>
            <p className="mt-2 text-sm text-[#A9B8D0]">
              Progress from foundational questions to advanced CEE-level challenges. Build confidence
              gradually without getting demoralized.
            </p>
          </div>

          {/* Three-Tier Ladder Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                level: 1,
                name: 'Foundational Recall',
                badge: 'Tier 1 // Core Facts',
                target: 'Builds 80+ baseline score',
                description:
                  'Direct factual definitions, anatomical landmarks, standard chemical nomenclature, and fundamental physics laws.',
                samplePrompt: 'Which cell organelle is known as the powerhouse of the cell?',
                focus: 'Zero memory hesitation on direct textbook questions.',
                color: '#38BDF8',
              },
              {
                level: 2,
                name: 'Clinical & Numerical',
                badge: 'Tier 2 // Multi-Step',
                target: 'Pushes score to 140+ range',
                description:
                  'Multi-variable calculation, assertion-reason statements, biochemical pathway intermediates, and dimensional derivations.',
                samplePrompt: 'Calculate net work done in an isothermal expansion from V₁ to 2V₁ at 300K.',
                focus: 'Application of formulas under speed-accuracy constraints.',
                color: '#10B981',
              },
              {
                level: 3,
                name: 'CEE Challenger Benchmark',
                badge: 'Tier 3 // Top 100 Rank',
                target: 'Decides Maharajgunj / Dharan seats',
                description:
                  'Complex multi-concept integration, misleading distractors, advanced MAT logic, and high-discrimination ranking questions.',
                samplePrompt: 'Assertion-Reason pairing on counter-current multiplier mechanism in Henle loop.',
                focus: 'Immunity against high-stakes trick questions and negative marking traps.',
                color: '#7367F0',
              },
            ].map((tier) => (
              <div
                key={tier.level}
                onClick={() => setSelectedLadderLevel(tier.level)}
                className={`rounded-2xl border p-6 flex flex-col justify-between cursor-pointer transition-all ${
                  selectedLadderLevel === tier.level
                    ? 'border-[#A9E6DD] bg-[#101A3C] shadow-2xl scale-[1.02]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
                      style={{ color: tier.color, backgroundColor: `${tier.color}15` }}
                    >
                      {tier.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">LEVEL 0{tier.level}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">{tier.name}</h4>
                  <p className="text-xs font-semibold text-[#A9E6DD] mb-3">{tier.target}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{tier.description}</p>

                  <div className="p-3 rounded-xl bg-[#060A18]/80 border border-white/10 text-xs">
                    <p className="text-[10px] text-slate-400 font-mono mb-1">SAMPLE LEVEL CHALLENGE:</p>
                    <p className="text-white italic">&quot;{tier.samplePrompt}&quot;</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400">
                  <span className="font-semibold text-white">Focus:</span> {tier.focus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Component 3: Topic-wise Mastery + Verified Resources               */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Topic-wise Mastery Panel */}
          <div className="lg:col-span-8 rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1224] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Topic-Wise Mastery Matrix</h3>
                <p className="text-xs text-[#A9B8D0] mt-1">
                  Track concept understanding and topic-level progress using real learning activity.
                </p>
              </div>
              <span className="text-xs font-mono text-[#A9E6DD]">CEE 200 MARKS SPECS</span>
            </div>

            <div className="space-y-4">
              {SUBJECT_MASTERY.map((subj) => (
                <div key={subj.subject} className="p-4 rounded-xl border border-white/10 bg-[#060A18]/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: subj.color }} />
                      <span className="text-sm font-bold text-white">{subj.subject}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">{subj.weightage}</span>
                      <span className="font-bold text-[#A9E6DD]">{subj.masteryPct}% Mastery</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subj.masteryPct}%`, backgroundColor: subj.color }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    {subj.subtopics.map((line, idx) => (
                      <p key={idx} className="truncate">• {line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Learning Resources */}
          <div className="lg:col-span-4 rounded-3xl border border-[#B8DFF4]/15 bg-[#0C152B] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-emerald-400" size={22} aria-hidden="true" />
                <h3 className="text-xl font-bold text-white">Verified Resources</h3>
              </div>

              <p className="text-xs text-[#A9B8D0] leading-relaxed mb-4">
                Organized resources with reliable source information and appropriate verification status.
                No unverified rumor questions or outdated Indian NEET syllabus deviations.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: 'Medical Education Commission (MEC)',
                    badge: 'Official Syllabus Baseline',
                    detail: 'Common Entrance Examination 2026 Curriculum Specifications.',
                    verified: true,
                  },
                  {
                    title: 'NEB Curriculum Development Centre',
                    badge: 'Grade 11 & 12 Science Reference',
                    detail: 'Prescribed textbooks for Physics, Chemistry, and Biology.',
                    verified: true,
                  },
                  {
                    title: 'IOM Maharajgunj & BPKIHS Benchmarks',
                    badge: 'Historical Paper Verification',
                    detail: 'Past 10-year question trend and high-frequency concepts.',
                    verified: true,
                  },
                ].map((res, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/10 bg-[#060A18]/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{res.title}</span>
                      <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
                    </div>
                    <p className="text-[11px] text-[#A9E6DD] font-semibold">{res.badge}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{res.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/syllabus"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 py-2.5 text-xs font-bold text-white transition-colors"
              >
                <span>View Complete CEE Syllabus</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
