'use client';

import React from 'react';
import {
  GraduationCap,
  Target,
  Users,
} from 'lucide-react';
import styles from './features.module.css';

export function CommunitySection() {
  return (
    <section id="community" className={`${styles.section} bg-[#040814] dark:bg-[#030612]`}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <Users size={12} aria-hidden="true" />
            <span>COMMUNITY &amp; COLLABORATIVE LEARNING</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Prepare Together.{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            Medical preparation doesn&apos;t have to be an isolating solitary battle. Connect with
            ambitious study partners, solve challenging CEE questions collectively, and maintain
            shared accountability.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Collaborative Hub Grid                                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Study Group Rooms */}
          <div className="rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1224] p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Users size={20} />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  COLLABORATIVE SESSIONS
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Study Group Rooms</h3>
              <p className="text-xs text-[#A9B8D0] leading-relaxed mb-4">
                Join curated subject-focused rooms with pre-med aspirants pursuing identical targets.
                Tackle 50-question mock blocks together with synchronised timers.
              </p>

              <div className="p-3 rounded-xl bg-[#060A18]/80 border border-white/5 space-y-1.5 text-xs text-slate-300">
                <p className="font-semibold text-white">Active Room Highlight:</p>
                <p className="text-[11px] text-[#A9E6DD] font-mono">
                  &quot;IOM Maharajgunj Target: Organic Synthesis Drill&quot;
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>8 Aspirants Active</span>
                  <span>Timed 45-min block</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Peer accountability</span>
              <span className="font-mono text-cyan-400">Distraction-free</span>
            </div>
          </div>

          {/* Card 2: Peer Learning & Concept Exchanges */}
          <div className="rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1224] p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <GraduationCap size={20} />
                </span>
                <span className="text-[10px] font-mono text-[#A9E6DD] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  EXPERT PEER REVIEW
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Peer Learning</h3>
              <p className="text-xs text-[#A9B8D0] leading-relaxed mb-4">
                Teaching a concept solidifies 90% of retention. Aspirants exchange novel mnemonics,
                graphical shortcuts, and alternate solution paths under faculty moderation.
              </p>

              <div className="p-3 rounded-xl bg-[#060A18]/80 border border-white/5 space-y-1.5 text-xs text-slate-300">
                <p className="font-semibold text-white">Top Student Explanation:</p>
                <p className="text-[11px] text-purple-300 italic">
                  &quot;How to remember Cranial Nerves in 10 seconds without mixing sensory vs motor.&quot;
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>By Dr. Pooja (Rank 2)</span>
                  <span>142 Upvotes</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Verified explanations</span>
              <span className="font-mono text-purple-400">Zero spam</span>
            </div>
          </div>

          {/* Card 3: Group Challenges & Shared Goals */}
          <div className="rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1224] p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Target size={20} />
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  COLLECTIVE MILESTONES
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Shared Preparation Goals</h3>
              <p className="text-xs text-[#A9B8D0] leading-relaxed mb-4">
                Team up with friends to achieve joint preparation targets. Share streak protection,
                unlock group challenge badges, and celebrate each other&apos;s progress.
              </p>

              <div className="p-3 rounded-xl bg-[#060A18]/80 border border-white/5 space-y-1.5 text-xs text-slate-300">
                <p className="font-semibold text-white">Current Cohort Challenge:</p>
                <p className="text-[11px] text-amber-300 font-mono">
                  &quot;Solve 1,000 High-Yield Botany MCQs this Month&quot;
                </p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-400 h-full rounded-full w-[78%]" />
                </div>
                <p className="text-[10px] text-slate-400 pt-1 font-mono text-right">780 / 1000 Completed</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Team streak bonuses</span>
              <span className="font-mono text-amber-400">Squad support</span>
            </div>
          </div>
        </div>

        {/* Note on Availability */}
        <div className="mt-8 p-4 rounded-2xl border border-white/10 bg-white/[0.02] text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <span>
            💡 <strong>Honest Capability Notice:</strong> 1v1 Battle Arena and asynchronous study group leaderboards are fully active. Live synchronized audio study rooms are currently in scheduled beta preview.
          </span>
          <span className="text-[10px] font-mono text-[#A9E6DD]">BETA COHORT 2026</span>
        </div>
      </div>
    </section>
  );
}
