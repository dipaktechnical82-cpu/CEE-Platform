'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Activity, ArrowRight, BookOpen, Sparkles, Star } from 'lucide-react';
import { CircularPreparationProgress } from './circular-preparation-progress';

interface FutureDoctorHeroProps {
  studentName?: string;
  preparationPercent?: number;
  topicsCompleted?: number;
  totalTopics?: number;
  averageScore?: number | null;
  isDevPreview?: boolean;
}

/**
 * Small SVG ECG pulse wave line.
 * Subtle medical heartbeat decoration.
 */
function EcgPulseLine({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="14"
      viewBox="0 0 70 14"
      width="70"
    >
      <path
        d="M 0 7 L 18 7 L 22 2 L 26 12 L 30 5 L 34 8 L 38 7 L 70 7"
        stroke="#A9E6DD"
        strokeDasharray="100"
        strokeDashoffset="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.9"
        strokeWidth="1.8"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="3s"
          from="100"
          repeatCount="indefinite"
          to="0"
        />
      </path>
    </svg>
  );
}

export function FutureDoctorHero({
  studentName,
  preparationPercent = 34,
  topicsCompleted = 68,
  totalTopics = 200,
  averageScore = 82.5,
  isDevPreview = false,
}: FutureDoctorHeroProps) {
  return (
    <section
      aria-labelledby="hero-future-doctor-title"
      className="relative isolate min-h-[380px] overflow-hidden rounded-[2rem] border border-[#B8DFF4]/20 bg-[#0A1128] p-6 shadow-[0_20px_60px_rgba(5,8,23,0.85)] sm:min-h-[420px] sm:p-8 lg:min-h-[440px] lg:p-10"
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. Cinematic Background Artwork                                      */}
      {/* ------------------------------------------------------------------ */}
      <Image
        alt=""
        className="object-cover object-[72%_30%] lg:object-right-top transition-transform duration-1000 ease-out"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 80vw"
        src="/images/student-dashboard/journey-to-medical-school.png"
      />

      {/* Deep cinematic gradient overlay: left opaque for contrast, right translucent */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/95 via-45% to-[#0A1128]/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/60 via-20% to-transparent" />

      {/* Ambient ambient glow spots (pure CSS, restrained brand colors) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#7367F0]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/4 h-80 w-80 rounded-full bg-[#A9E6DD]/10 blur-3xl"
      />

      {/* Decorative ambient medical rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-10 h-64 w-64 rounded-full border border-[#A9E6DD]/15 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-0 h-96 w-96 rounded-full border border-[#7367F0]/15 opacity-40"
      />

      {/* ------------------------------------------------------------------ */}
      {/* 2. Content Container                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 flex min-h-[340px] flex-col justify-between sm:min-h-[380px]">
        {/* Top Eyebrows */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Primary Medical Journey Pill */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#A9E6DD]/30 bg-[#101A3C]/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A9E6DD] shadow-[0_0_15px_rgba(169,230,221,0.15)] backdrop-blur-md">
              <Activity aria-hidden="true" className="text-[#A9E6DD] animate-pulse" size={14} />
              <span>YOUR MEDICAL JOURNEY</span>
              <EcgPulseLine className="ml-1 hidden sm:inline-block" />
            </span>

            {/* Motto Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#B8DFF4]/20 bg-[#131D45]/70 px-3 py-1 text-[11px] font-semibold text-[#B8DFF4]/90 backdrop-blur-sm">
              <Sparkles aria-hidden="true" className="text-[#B8DFF4]" size={12} />
              Dream • Prepare • Excel
            </span>

            {isDevPreview ? (
              <span className="rounded-full border border-[#B8DFF4]/30 bg-[#B8DFF4]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#B8DFF4]">
                Preview Mode
              </span>
            ) : null}
          </div>

          {/* Main Heading */}
          <h1
            className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl"
            id="hero-future-doctor-title"
          >
            Your Journey to Becoming a{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(169,230,221,0.3)]">
              Doctor
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#A9B8D0] sm:text-base">
            {studentName ? `${studentName}, every` : 'Every'} focused session brings you closer to
            your dream. Stay disciplined, master the high-yield concepts, and achieve your rank.
          </p>

          {/* Quick CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#7367F0] to-[#5B52D6] px-5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(115,103,240,0.35)] transition hover:from-[#6457E2] hover:to-[#4F45C7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A9E6DD]"
              href="/syllabus"
            >
              Start Today&apos;s Practice
              <ArrowRight aria-hidden="true" size={16} />
            </Link>

            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:bg-white/[0.1] hover:text-white"
              href="/syllabus"
            >
              Browse Syllabus
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Bottom Connected Progress and Achievement Indicators             */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-12">
            {/* A. Preparation Progress Ring */}
            <div className="flex items-center gap-4">
              <CircularPreparationProgress
                label="Prepared"
                percent={preparationPercent}
                size={84}
                strokeWidth={7}
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A9E6DD]/90">
                  Preparation Progress
                </p>
                <p className="mt-0.5 text-base font-bold text-white tabular-nums sm:text-lg">
                  {preparationPercent}% Syllabus Ready
                </p>
                <p className="text-[11px] text-[#A9B8D0]">Target: 90%+ for top CEE merit</p>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden h-12 w-px bg-white/10 sm:block" />

            {/* B. Topics Completed */}
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7367F0]/30 bg-[#7367F0]/15 text-[#B8DFF4]">
                <BookOpen aria-hidden="true" size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#B8DFF4]/90">
                  Topics Completed
                </p>
                <p className="mt-0.5 text-base font-bold text-white tabular-nums sm:text-lg">
                  <span className="text-[#D5F3E8]">{topicsCompleted}</span>
                  <span className="text-[#7E8DAA]"> / {totalTopics}</span>
                </p>
                <p className="text-[11px] text-[#A9B8D0]">Core CEE Curriculum</p>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden h-12 w-px bg-white/10 lg:block" />

            {/* C. Average Score */}
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#A9E6DD]/30 bg-[#A9E6DD]/15 text-[#A9E6DD]">
                <Star aria-hidden="true" size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A9E6DD]/90">
                  Average Score
                </p>
                <p className="mt-0.5 text-base font-bold text-white tabular-nums sm:text-lg">
                  {typeof averageScore === 'number' ? (
                    <span className="text-[#A9E6DD]">{averageScore}%</span>
                  ) : (
                    <span className="text-[#7E8DAA]">—</span>
                  )}
                </p>
                <p className="text-[11px] text-[#A9B8D0]">
                  {typeof averageScore === 'number'
                    ? 'Across all practice sets'
                    : 'Complete 1st test'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
