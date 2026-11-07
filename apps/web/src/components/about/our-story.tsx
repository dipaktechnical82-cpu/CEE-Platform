'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  BookOpen,
  Compass,
  FileQuestion,
  HelpCircle,
  Quote,
  RefreshCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import styles from './about.module.css';

interface ChallengeItem {
  id: string;
  title: string;
  problem: string;
  solution: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STUDENT_CHALLENGES: ChallengeItem[] = [
  {
    id: 'resources',
    title: 'Fragmented Study Materials',
    problem:
      'Students juggle disparate notes, unverified PDFs, outdated question sets, and conflicting past questions across multiple subjects.',
    solution:
      'We unified the verified Nepal CEE curriculum into an organized, high-yield digital syllabus with topic-tagged past questions.',
    icon: BookOpen,
  },
  {
    id: 'guidance',
    title: 'Limited Personalized Guidance',
    problem:
      'Massive coaching classrooms cannot provide 1-on-1 diagnostic support when a student gets stuck on difficult physics mechanics or organic mechanisms.',
    solution:
      'Our intelligent AI mentor offers patient, step-by-step conceptual explanations whenever questions arise.',
    icon: HelpCircle,
  },
  {
    id: 'blindspots',
    title: 'Unidentified Knowledge Blindspots',
    problem:
      'Students study hard for months without knowing their actual topic-level weaknesses until exam scores disappoint.',
    solution:
      'Real-time subject mastery analytics pinpoint exact cognitive gaps across Zoology, Botany, Chemistry, Physics, and MAT.',
    icon: Target,
  },
  {
    id: 'mistakes',
    title: 'Repeating Mistakes Without Insight',
    problem:
      'Memorizing answer keys leads students into the exact same distractors and traps on mock exams time and again.',
    solution:
      'Mistake DNA categorizes each error as conceptual, calculation, recall, or trap distractor, transforming mistakes into actionable revision.',
    icon: RefreshCcw,
  },
  {
    id: 'simulator',
    title: 'Lack of Realistic Exam Practice',
    problem:
      'Unstructured practice leaves students unprepared for the intense 3-hour, 200-question negative marking pressure of the actual CEE hall.',
    solution:
      'Full-length CEE exam simulations with timer countdowns, authentic marking schemes (-0.25 penalty), and section breakdowns.',
    icon: FileQuestion,
  },
  {
    id: 'consistency',
    title: 'Maintaining Motivation & Rhythm',
    problem:
      'The multi-month pre-medical journey can feel lonely, overwhelming, and mentally draining without measurable progress milestones.',
    solution:
      'Clear daily preparation pathways, revision radars, and interactive streak tracking build steady discipline and confidence.',
    icon: Compass,
  },
];

export function OurStory() {
  const [activeChallenge, setActiveChallenge] = useState<string>('mistakes');

  const selected =
    STUDENT_CHALLENGES.find((c) => c.id === activeChallenge) ?? STUDENT_CHALLENGES[0];

  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className={`${styles.section} bg-[#EAF8F4]/50 dark:bg-[#0A1128]/60`}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              THE REALITY OF PREPARATION
            </span>
          </div>

          <h2
            id="our-story-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Every Future Doctor Has a Story.
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
            The journey to medical school in Nepal is one of the most demanding academic
            pursuits a student will ever undertake. We recognized that behind every test score
            is a dedicated student striving against real preparation hurdles.
          </p>
        </div>

        {/* Split Layout: Narrative Storytelling + Visual Composition */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-[#D5F3E8] bg-white p-6 sm:p-8 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#101A3C]/70 dark:shadow-none">
              <div className="flex items-center gap-3 text-[#167A80] dark:text-[#A9E6DD]">
                <Quote size={28} className="rotate-180 opacity-60" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  The Aspirant Experience
                </span>
              </div>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#244A50] dark:text-slate-200">
                Every year, tens of thousands of ambitious students across Nepal prepare for the
                Medical Education Commission Common Entrance Examination. Many travel far from
                home, attend packed lecture halls, and spend countless hours studying late into the
                night.
              </p>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                Yet despite tremendous effort, many struggle with the same fundamental obstacles:
                <strong className="text-[#244A50] dark:text-white font-semibold">
                  {' '}scattered materials, unanswered doubts, unnoticed conceptual traps, and the
                  anxiety of not knowing where they truly stand.
                </strong>
              </p>

              <div className="mt-6 pt-6 border-t border-[#E5F1EF] dark:border-white/10">
                <p className="text-sm font-semibold text-[#167A80] dark:text-[#B8DFF4]">
                  Why this platform exists:
                </p>
                <p className="mt-1 text-sm text-[#3D6870] dark:text-[#A9B8D0]">
                  We built this platform to bring fragmented preparation resources, realistic exam
                  practice, and intelligent personalized feedback together into one cohesive,
                  inspiring preparation home.
                </p>
              </div>
            </div>

            {/* Interactive Challenge Selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD] mb-3">
                Key Challenges We Set Out to Solve:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STUDENT_CHALLENGES.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === activeChallenge;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveChallenge(item.id)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-left text-xs font-semibold transition-all duration-200 ${
                        active
                          ? 'border border-[#167A80] bg-[#D5F3E8] text-[#244A50] shadow-sm dark:border-[#A9E6DD] dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD] dark:shadow-md'
                          : 'border border-[#D5F3E8] bg-white text-[#5E848C] hover:text-[#244A50] hover:border-[#167A80] dark:border-white/10 dark:bg-[#101A3C]/40 dark:text-[#A9B8D0] dark:hover:border-white/20 dark:hover:text-white'
                      }`}
                    >
                      <Icon size={14} className="shrink-0 text-[#167A80] dark:text-[#A9E6DD]" />
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Visual & Diagnostic Spotlight */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-[#D5F3E8] bg-white p-4 sm:p-6 shadow-xl dark:border-white/10 dark:bg-gradient-to-b dark:from-[#101A3C] dark:to-[#0A1128] dark:shadow-2xl">
              {/* Image Illustration with guaranteed responsive height */}
              <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden rounded-2xl bg-[#060A18]">
                <Image
                  src="/images/journey-to-medical-school.png"
                  alt="An aspiring medical student looking ahead towards a medical college with luminous conceptual learning path"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover transition-transform duration-500 hover:scale-102"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/30 to-transparent"
                />
              </div>

              {/* Dynamic Solution Spotlight based on selected challenge */}
              <div className="mt-5 rounded-2xl border border-[#A9E6DD] bg-[#F5FBFA] p-5 dark:border-[#A9E6DD]/20 dark:bg-[#060A18]/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#167A80]/15 text-[#167A80] dark:bg-[#1EC5B2]/20 dark:text-[#A9E6DD]">
                      <selected.icon size={15} />
                    </span>
                    <h3 className="text-sm font-bold text-[#244A50] dark:text-white">
                      {selected.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold font-mono text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    OUR APPROACH
                  </span>
                </div>

                <div className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-rose-800 dark:text-rose-300/90">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>
                      <strong className="font-semibold">The Hurdle:</strong> {selected.problem}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-[#167A80] dark:text-[#A9E6DD]">
                    <Sparkles size={15} className="mt-0.5 shrink-0" />
                    <span>
                      <strong className="font-semibold">Our Ecosystem:</strong> {selected.solution}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
