'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Bot, ArrowRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function SmartPreparationCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article className="relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D5F3E8] dark:border-[#B8DFF4]/15 bg-gradient-to-br from-white via-[#F5FBFA] to-[#EAF8F4] dark:from-[#0B1530] dark:via-[#0E1A3C] dark:to-[#0A122A] p-6 text-[#244A50] dark:text-white shadow-[0_4px_20px_rgba(36,74,80,0.06)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md transition-colors duration-200">
        {/* Background Artwork - Friendly AI Study Robot (Official Palette: Sky Blue, Aqua Mint, Pale Mint, Deep Teal) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            alt="Futuristic AI Medical Study Robot"
            className="h-full w-full object-cover object-right opacity-40 mix-blend-multiply dark:mix-blend-screen dark:opacity-45 transition-opacity duration-300 hover:opacity-60"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            src="/images/student-dashboard/ai-preparation-robot.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-[#0A1128] dark:via-[#0A1128]/90 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#EAF8F4]/80 via-transparent to-transparent dark:from-[#0A122A] dark:via-transparent dark:to-transparent" />
        </div>

        {/* Content Top */}
        <div className="relative z-10 max-w-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E6DD] dark:border-[#A9E6DD]/30 bg-[#D5F3E8] dark:bg-[#A9E6DD]/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#244A50] dark:text-[#A9E6DD] backdrop-blur-md shadow-xs">
              <Sparkles size={12} className="text-[#1B6156] dark:text-[#A9E6DD]" /> AI Insights
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#B8DFF4] dark:border-[#B8DFF4]/30 bg-[#B8DFF4]/40 dark:bg-[#B8DFF4]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1E5F80] dark:text-[#B8DFF4]">
              Premium Feature
            </span>
          </div>

          <h2 className="mt-4 text-xl font-black tracking-tight text-[#244A50] dark:text-white sm:text-2xl">
            Smart Preparation with{' '}
            <span className="bg-gradient-to-r from-[#244A50] via-[#1E5F80] to-[#2E8B99] dark:from-[#B8DFF4] dark:via-[#A9E6DD] dark:to-[#D5F3E8] bg-clip-text text-transparent">
              AI Insights
            </span>
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#3D6870] dark:text-[#CBD5E1] sm:text-sm">
            Personalized weakness diagnosis, high-yield CEE pattern forecasting, and adaptive
            revision schedules curated by intelligent medical tutor models.
          </p>

          {/* Value highlights */}
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[#244A50] dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#D5F3E8] dark:border-white/10 bg-white/85 dark:bg-white/[0.05] px-2.5 py-1 backdrop-blur-sm">
              <CheckCircle2 size={12} className="text-[#1B6156] dark:text-[#A9E6DD]" /> Weakness
              Auto-Detection
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#D5F3E8] dark:border-white/10 bg-white/85 dark:bg-white/[0.05] px-2.5 py-1 backdrop-blur-sm">
              <CheckCircle2 size={12} className="text-[#1E5F80] dark:text-[#B8DFF4]" /> High-Yield
              CEE Predictor
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#D5F3E8] dark:border-white/10 bg-white/85 dark:bg-white/[0.05] px-2.5 py-1 backdrop-blur-sm">
              <CheckCircle2 size={12} className="text-[#1B6156] dark:text-[#A9E6DD]" /> Spaced
              Revision Engine
            </span>
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#244A50] hover:bg-[#1B373C] text-white dark:bg-gradient-to-r dark:from-[#7367F0] dark:to-[#5B52D6] dark:hover:from-[#6457E2] dark:hover:to-[#4F45C7] px-5 text-xs font-bold shadow-[0_4px_16px_rgba(36,74,80,0.25)] dark:shadow-[0_0_20px_rgba(115,103,240,0.35)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD]"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            <Bot size={16} /> Upgrade to Premium
          </button>
          <span className="text-[11px] text-[#5B7E86] dark:text-[#94A3B8]">
            Included with upcoming institutional cohort packages
          </span>
        </div>
      </article>

      {/* Informational Modal for Upgrade / AI Feature Preview */}
      {modalOpen ? (
        <div
          aria-labelledby="ai-insights-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-[#A9E6DD]/30 bg-[#0A1128] p-6 text-white shadow-2xl">
            <button
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A9E6DD]/20 text-[#A9E6DD] p-0.5">
              <Bot size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-white" id="ai-insights-modal-title">
              CEE AI Tutor &amp; Adaptive Learning Engine
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#A9B8D0]">
              The AI Insights module connects deep telemetry from your mock tests with our curated
              Nepal Medical CEE knowledge base.
            </p>

            <div className="mt-4 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-[#A9E6DD] shrink-0" />
                <p>
                  <strong className="text-white">Pinpoint Misconceptions:</strong> Detects whether
                  errors in Physics or Chemistry stem from calculation speed or conceptual gaps.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-[#B8DFF4] shrink-0" />
                <p>
                  <strong className="text-white">Smart Spaced Repetition:</strong> Automatically
                  re-queues challenging biology questions at optimal memory consolidation intervals.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-[#A9E6DD] shrink-0" />
                <p>
                  <strong className="text-white">Rank Potential Predictor:</strong> Real-time
                  estimation of your Nepal CEE merit standing based on aggregate aspirant accuracy.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#A9E6DD]/20 bg-[#A9E6DD]/10 p-3 text-[11px] text-[#D5F3E8]">
              <ShieldAlert size={16} className="shrink-0 text-[#A9E6DD]" />
              <span>
                Full deployment scheduled for Phase 3. Standard syllabus &amp; practice sets remain
                100% active.
              </span>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                onClick={() => setModalOpen(false)}
                type="button"
              >
                Close
              </button>
              <Link
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#244A50] hover:bg-[#1B373C] border border-[#A9E6DD]/30 px-4 py-2 text-xs font-bold text-white"
                href="/syllabus"
                onClick={() => setModalOpen(false)}
              >
                Continue Daily Prep <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
