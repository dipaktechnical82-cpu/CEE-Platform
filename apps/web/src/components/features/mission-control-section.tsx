'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Flame,
  LayoutDashboard,
  Radar,
  Sparkles,
} from 'lucide-react';
import styles from './features.module.css';

export function MissionControlSection() {
  return (
    <section id="mission-control" className={styles.section}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <LayoutDashboard size={12} aria-hidden="true" />
            <span>CEE MISSION CONTROL</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Your Entire Preparation.{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              One Intelligent Mission Control.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            No more fragmented notebooks, lost question slips, or guessing where you stand. Your
            student mission control aggregates your daily progress, AI recommendations, and CEE rank
            readiness in one unified cockpit.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Main Mission Control Dashboard Frame                               */}
        {/* Modeled directly after the approved student dashboard design       */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 rounded-3xl border border-[#B8DFF4]/20 bg-[#0A1128] shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#060A18] px-4 sm:px-6 py-3.5 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1EC5B2]/20 text-[#A9E6DD]">
                <Activity size={16} />
              </span>
              <div>
                <p className="font-bold text-white">STUDENT MISSION CONTROL</p>
                <p className="text-[10px] text-slate-400 font-mono">CADET: ASHISH RAJ // GOAL: IOM MBBS</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800">
                SAMPLE DEMONSTRATION VALUES
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                SYNCED WITH CEE 2026
              </span>
            </div>
          </div>

          {/* Dashboard Canvas Grid */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Row: 4 Futuristic KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Daily Progress */}
              <div className="p-4 rounded-2xl border border-white/10 bg-[#101A3C]/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">DAILY PROGRESS</span>
                <p className="text-2xl font-black text-[#A9E6DD] mt-1 font-mono">68%</p>
                <p className="text-[11px] text-slate-300 mt-1">34 / 50 questions completed</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                  <div className="bg-[#1EC5B2] h-full rounded-full w-[68%]" />
                </div>
              </div>

              {/* Mock Exam Score */}
              <div className="p-4 rounded-2xl border border-white/10 bg-[#101A3C]/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">LATEST MOCK SCORE</span>
                <p className="text-2xl font-black text-[#38BDF8] mt-1 font-mono">168.5 <span className="text-sm text-slate-400">/ 200</span></p>
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+14.5 improvement vs Mock #3</p>
              </div>

              {/* Estimated Percentile */}
              <div className="p-4 rounded-2xl border border-white/10 bg-[#101A3C]/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">NATIONAL PERCENTILE</span>
                <p className="text-2xl font-black text-purple-300 mt-1 font-mono">98.4th</p>
                <p className="text-[11px] text-slate-300 mt-1">Projected Open Merit Rank: #42</p>
              </div>

              {/* Consistency Streak */}
              <div className="p-4 rounded-2xl border border-white/10 bg-[#101A3C]/80">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">STUDY STREAK</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono flex items-center gap-1.5">
                  <Flame size={20} className="text-amber-400" />
                  <span>14 DAYS</span>
                </p>
                <p className="text-[11px] text-slate-300 mt-1">Shield active (Freeze intact)</p>
              </div>
            </div>

            {/* Middle Row: AI Recommendations + Weakness Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* AI Recommendation Engine */}
              <div className="lg:col-span-7 p-5 rounded-2xl border border-white/10 bg-[#060A18]/90">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#A9E6DD]" />
                    <h4 className="text-sm font-bold text-white">AI Real-Time Recommendations</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#A9E6DD]">PRIORITY ACTION</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      Physics: Electrostatics Potential Traps (6 marks lost recently)
                    </p>
                    <p className="text-slate-300 text-[11px] mt-1">
                      Complete recommended 10-question surgical drill on equipotential surfaces before Sunday Mock.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Botany: Plant Anatomy Retention Peak (94% Accuracy)
                    </p>
                    <p className="text-slate-300 text-[11px] mt-1">
                      Concept locked in long-term memory. Spaced revision scheduled for next Thursday.
                    </p>
                  </div>
                </div>
              </div>

              {/* Weakness Radar Matrix */}
              <div className="lg:col-span-5 p-5 rounded-2xl border border-white/10 bg-[#060A18]/90">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Radar size={16} className="text-[#38BDF8]" />
                    <h4 className="text-sm font-bold text-white">Weakness Radar Breakdown</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">4 SUBJECTS</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { subj: 'Biology', score: '91%', color: '#10B981', note: 'Strongest Pillar' },
                    { subj: 'Mental Agility (MAT)', score: '88%', color: '#38BDF8', note: 'Fast Pacing' },
                    { subj: 'Chemistry', score: '76%', color: '#F59E0B', note: 'Organic OK, Thermo Low' },
                    { subj: 'Physics', score: '64%', color: '#EF4444', note: 'Needs Targeted Sprints' },
                  ].map((s) => (
                    <div key={s.subj} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                      <span className="font-semibold text-white">{s.subj}</span>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-slate-400">{s.note}</span>
                        <span className="font-bold" style={{ color: s.color }}>{s.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Revision Timetable & Score Growth Chart Summary */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#060A18]/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <CalendarDays size={15} className="text-[#A9E6DD]" />
                  <span>Upcoming Smart Revision Timetable</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Today: SN1 vs SN2 (15 mins) • Tomorrow: Cardiac Cycle (10 mins) • Saturday: Full Mock Test #5 (3 hrs)
                </p>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 shrink-0 rounded-xl bg-gradient-to-r from-[#1ec5b2] to-[#0a92a8] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95"
              >
                <span>Launch Your Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
