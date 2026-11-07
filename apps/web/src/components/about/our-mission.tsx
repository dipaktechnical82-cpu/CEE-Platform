'use client';

import React from 'react';
import { Compass, Sparkles, Target } from 'lucide-react';
import styles from './about.module.css';

const MISSION_PILLARS = [
  {
    number: '01',
    title: 'Accessible Learning',
    subtitle: 'Equal opportunity across Nepal',
    description:
      'Make structured learning and preparation resources easier to access for every student, regardless of geographic location or socio-economic background.',
    highlights: [
      'Comprehensive syllabus aligned with MEC Nepal guidelines',
      'High-yield question banks available 24/7 on any device',
      'Affordable, transparent, and student-first access model',
    ],
    icon: Compass,
  },
  {
    number: '02',
    title: 'Personalized Guidance',
    subtitle: 'Tailored to your cognitive rhythm',
    description:
      'Help students understand their strengths, weaknesses, and next best steps so study hours translate into actual conceptual mastery rather than rote repetition.',
    highlights: [
      'Subject-level diagnostic mastery scoring',
      'AI mentor answers doubts with step-by-step reasoning',
      'Custom recovery roadmaps targeted to your exact mistakes',
    ],
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Confident Preparation',
    subtitle: 'Exam-readiness through authentic practice',
    description:
      'Help students practice, learn from mistakes, and approach examinations with calm, evidence-based confidence on CEE exam day.',
    highlights: [
      'Authentic 3-hour, 200-question timed mock simulations',
      'Negative marking calibration (-0.25) to curb guessing traps',
      'Post-exam cognitive breakdowns that eliminate blindspots',
    ],
    icon: Target,
  },
];

export function OurMission() {
  return (
    <section
      id="our-mission"
      aria-labelledby="our-mission-heading"
      className={styles.section}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center">
            <span className={styles.eyebrowBadge}>
              <span className={styles.eyebrowPulseDot} />
              GUIDING PRINCIPLES
            </span>
          </div>

          <h2
            id="our-mission-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Our Mission Is Simple.{' '}
            <span className="block mt-1 bg-gradient-to-r from-[#244A50] via-[#167A80] to-[#1EC5B2] dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#7367F0] bg-clip-text text-transparent">
              Your Potential Is Not Limited.
            </span>
          </h2>

          {/* Central Mission Statement Banner */}
          <div className="mt-8 rounded-2xl border border-[#A9E6DD] bg-[#F5FBFA] p-6 sm:p-8 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-gradient-to-r dark:from-[#101A3C] dark:to-[#131D45] dark:shadow-none">
            <p className="font-serif italic text-lg sm:text-2xl text-[#244A50] dark:text-slate-100 leading-relaxed">
              &ldquo;To make high-quality, intelligent, and personalized medical entrance
              preparation more accessible to every aspiring future doctor in Nepal.&rdquo;
            </p>
          </div>
        </div>

        {/* 3 Supporting Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {MISSION_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.number} className={styles.pillarCard}>
                <div className="flex items-center justify-between">
                  <span className={styles.pillarNumber}>{pillar.number}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D5F3E8] border border-[#167A80]/20 text-[#244A50] dark:bg-[#1EC5B2]/15 dark:border-[#1EC5B2]/30 dark:text-[#A9E6DD]">
                    <Icon size={22} />
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#167A80] dark:text-[#A9E6DD]">
                    {pillar.subtitle}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-[#244A50] dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E5F1EF] dark:border-white/10">
                  <ul className="space-y-2.5 text-xs text-[#244A50] dark:text-slate-300">
                    {pillar.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1EC5B2] shrink-0" />
                        <span>{item}</span>
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
