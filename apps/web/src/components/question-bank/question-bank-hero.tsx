'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Dna,
  FlaskConical,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

export function QuestionBankHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#D5F3E8] bg-gradient-to-b from-[#F5FBFA] via-white to-[#F5FBFA] py-16 dark:border-white/10 dark:from-[#060A18] dark:via-[#0A1128] dark:to-[#07171D] sm:py-24 lg:py-28">
      {/* Background glowing ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#A9E6DD]/30 via-[#B8DFF4]/40 to-transparent blur-3xl dark:from-[#131D45]/40 dark:via-[#244A50]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 -z-10 h-72 w-72 rounded-full bg-[#D5F3E8]/40 blur-2xl dark:bg-[#7367F0]/10"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#A9E6DD] bg-white/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#244A50] shadow-sm backdrop-blur-sm dark:border-[#B8DFF4]/20 dark:bg-[#101A3C]/80 dark:text-[#B8DFF4]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1ec5b2] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1ec5b2]" />
              </span>
              THE CEE QUESTION BANK
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-5xl sm:leading-[1.12] lg:text-[3.5rem]">
              Practice Smarter.{' '}
              <span className="bg-gradient-to-r from-[#19707B] via-[#244A50] to-[#12828D] bg-clip-text text-transparent dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#D5F3E8]">
                Think Like a Future Doctor.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-lg">
              Explore medical entrance practice questions, understand every concept, and build the
              confidence to face your CEE examination with high-yield rationale and systematic
              distractor analysis.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#167A80] to-[#244A50] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1b8e95] hover:to-[#2e5d65] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80] dark:from-[#7367F0] dark:to-[#5B52D6] dark:hover:from-[#8276f5] dark:hover:to-[#6457E2]"
              >
                Start Practicing
                <ArrowRight size={17} />
              </Link>

              <Link
                href="#explore-subjects"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D5F3E8] bg-white px-5 py-3.5 text-sm font-semibold text-[#244A50] shadow-sm transition-colors hover:bg-[#F5FBFA] hover:text-[#167A80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244A50] dark:border-[#B8DFF4]/15 dark:bg-[#101A3C] dark:text-[#F5FBFA] dark:hover:bg-[#15224D]"
              >
                <BookOpen size={16} className="text-[#167A80] dark:text-[#A9E6DD]" />
                Explore Subjects
              </Link>
            </div>

            {/* Verified capability pill notes */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-[#D5F3E8] bg-white/70 p-2.5 backdrop-blur-sm dark:border-white/5 dark:bg-[#101A3C]/60">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-[#244A50] dark:text-[#F5FBFA]">
                  Distractor Breakdown
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#D5F3E8] bg-white/70 p-2.5 backdrop-blur-sm dark:border-white/5 dark:bg-[#101A3C]/60">
                <Activity size={16} className="shrink-0 text-[#167A80] dark:text-[#B8DFF4]" />
                <span className="text-xs font-medium text-[#244A50] dark:text-[#F5FBFA]">
                  Negative Marking Sim
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#D5F3E8] bg-white/70 p-2.5 backdrop-blur-sm dark:border-white/5 dark:bg-[#101A3C]/60">
                <Dna size={16} className="shrink-0 text-[#7367F0] dark:text-[#A9E6DD]" />
                <span className="text-xs font-medium text-[#244A50] dark:text-[#F5FBFA]">
                  Mistake DNA
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Composition */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            {/* Floating Subject Badges */}
            <div className="absolute -top-5 -left-4 z-20 hidden items-center gap-1.5 rounded-full border border-[#A9E6DD] bg-white px-3 py-1 shadow-md dark:border-white/10 dark:bg-[#101A3C] sm:inline-flex">
              <FlaskConical size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">Chemistry</span>
              <span className="rounded bg-[#D5F3E8] px-1.5 py-0.2 text-[10px] font-semibold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                50 Marks
              </span>
            </div>

            <div className="absolute -bottom-4 -right-2 z-20 hidden items-center gap-1.5 rounded-full border border-[#B8DFF4] bg-white px-3 py-1 shadow-md dark:border-white/10 dark:bg-[#101A3C] sm:inline-flex">
              <Dna size={14} className="text-[#167A80] dark:text-[#B8DFF4]" />
              <span className="text-xs font-bold text-[#244A50] dark:text-[#F5FBFA]">Biology (Botany + Zoology)</span>
              <span className="rounded bg-[#B8DFF4] px-1.5 py-0.2 text-[10px] font-semibold text-[#244A50] dark:bg-[#131D45] dark:text-[#B8DFF4]">
                80 Marks
              </span>
            </div>

            {/* Realistic MCQ Card Preview */}
            <div className="relative rounded-2xl border border-[#A9E6DD]/70 bg-white p-5 shadow-xl transition-all duration-300 dark:border-[#B8DFF4]/20 dark:bg-[#101A3C] sm:p-7">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between border-b border-[#E5F1EF] pb-4 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-md bg-[#D5F3E8] px-2 text-[11px] font-bold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                    ZOOLOGY • CELL BIOLOGY
                  </span>
                  <span className="text-xs text-[#5E848C] dark:text-[#7E8DAA]">Q 42 of 200</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#167A80] dark:text-[#B8DFF4]">
                    <Clock size={13} />
                    01:42 left
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Zap size={10} /> +1.0 / -0.25
                  </span>
                </div>
              </div>

              {/* Realistic Question Prompt */}
              <div className="mt-4">
                <p className="text-sm font-semibold leading-relaxed text-[#244A50] dark:text-[#F5FBFA] sm:text-base">
                  Which intrinsic tissue of the human heart exhibits the fastest spontaneous diastolic
                  depolarization, thereby commanding the baseline cardiac rhythm?
                </p>
              </div>

              {/* Realistic Answer Options */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl border border-[#D5F3E8] bg-[#F5FBFA] p-3 text-xs text-[#3D6870] transition-colors dark:border-white/5 dark:bg-[#131D45]/70 dark:text-[#A9B8D0]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#244A50] shadow-sm dark:bg-[#101A3C] dark:text-[#B8DFF4]">
                      A
                    </span>
                    <span>Atrioventricular (AV) node</span>
                  </div>
                  <span className="text-[10px] text-[#71898D] dark:text-[#7E8DAA]">40-60 bpm</span>
                </div>

                {/* Highlighted Correct Option in Preview */}
                <div className="flex items-center justify-between rounded-xl border-2 border-emerald-500 bg-emerald-50/70 p-3 text-xs font-semibold text-emerald-950 shadow-sm dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-sm dark:bg-emerald-500">
                      B
                    </span>
                    <span>Sinoatrial (SA) node</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-200/70 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-800/60 dark:text-emerald-100">
                    <CheckCircle2 size={11} /> Correct Pacemaker (70-80 bpm)
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#D5F3E8] bg-[#F5FBFA] p-3 text-xs text-[#3D6870] transition-colors dark:border-white/5 dark:bg-[#131D45]/70 dark:text-[#A9B8D0]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#244A50] shadow-sm dark:bg-[#101A3C] dark:text-[#B8DFF4]">
                      C
                    </span>
                    <span>Bundle of His</span>
                  </div>
                  <span className="text-[10px] text-[#71898D] dark:text-[#7E8DAA]">30-40 bpm</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#D5F3E8] bg-[#F5FBFA] p-3 text-xs text-[#3D6870] transition-colors dark:border-white/5 dark:bg-[#131D45]/70 dark:text-[#A9B8D0]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#244A50] shadow-sm dark:bg-[#101A3C] dark:text-[#B8DFF4]">
                      D
                    </span>
                    <span>Purkinje fiber network</span>
                  </div>
                  <span className="text-[10px] text-[#71898D] dark:text-[#7E8DAA]">15-30 bpm</span>
                </div>
              </div>

              {/* Rationale Peek Panel */}
              <div className="mt-4 rounded-xl border border-[#B8DFF4] bg-[#F5FBFA] p-3 dark:border-[#B8DFF4]/20 dark:bg-[#131D45]/90">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#167A80] dark:text-[#A9E6DD]">
                  <Sparkles size={13} />
                  <span>Clinical Rationale &amp; Overdrive Suppression:</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                  The SA node has the steepest Phase 4 spontaneous diastolic prepotential driven by
                  inward funny Na⁺ current. Its faster rate overrides latent pacemakers through
                  overdrive suppression.
                </p>
              </div>

              {/* Subtle footer watermark */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#71898D] dark:text-[#7E8DAA]">
                <span>CEE Question Bank Interface Preview</span>
                <span className="font-mono">ID: QB-CEE-PREVIEW-01</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
