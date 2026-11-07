'use client';

import React from 'react';
import {
  Award,
  Crown,
  Flame,
  Swords,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import styles from './features.module.css';

interface LeaderboardUser {
  rank: number;
  name: string;
  collegeGoal: string;
  score: number;
  accuracy: string;
  streak: number;
  badge: string;
}

const TOP_ASPIRANTS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Sushil Shrestha',
    collegeGoal: 'IOM Maharajgunj',
    score: 186.75,
    accuracy: '94.2%',
    streak: 34,
    badge: 'Anatomy Maestro',
  },
  {
    rank: 2,
    name: 'Pooja Karki',
    collegeGoal: 'BPKIHS Dharan',
    score: 184.25,
    accuracy: '92.8%',
    streak: 28,
    badge: 'Physics Formula Titan',
  },
  {
    rank: 3,
    name: 'Rohan Chaudhary',
    collegeGoal: 'PAHS Lalitpur',
    score: 181.5,
    accuracy: '91.5%',
    streak: 42,
    badge: 'Negative Mark Slayer',
  },
  {
    rank: 4,
    name: 'Aayusha Regmi',
    collegeGoal: 'KUSMS Dhulikhel',
    score: 178.0,
    accuracy: '89.6%',
    streak: 19,
    badge: 'Organic Wizard',
  },
];

export function GamificationSection() {
  return (
    <section id="gamification" className={`${styles.section} bg-[#060B1A] dark:bg-[#040816]`}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <Trophy size={12} aria-hidden="true" />
            <span>GAMIFIED PREPARATION</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Make Preparation More Engaging.{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              Keep Moving Forward.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            Serious medical aspirants thrive on disciplined progress and healthy peer benchmarks.
            Turn demanding study routines into compelling daily momentum.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Component 1: CEE Battle Arena & Friends vs Friends                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CEE Battle Arena */}
          <div className="lg:col-span-6 rounded-3xl border border-[#B8DFF4]/20 bg-gradient-to-br from-[#101A3C] via-[#0A1128] to-[#060A18] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#A9E6DD] bg-[#A9E6DD]/15 border border-[#A9E6DD]/30">
                  <Swords size={13} />
                  <span>1v1 HEAD-TO-HEAD DUELS</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">REAL-TIME MATCHMAKING</span>
              </div>

              <h3 className="text-2xl font-bold text-white">CEE Battle Arena</h3>
              <p className="mt-2 text-sm text-[#A9B8D0]">
                Challenge fellow pre-med aspirants across Nepal to rapid 10-question high-yield concept sprints.
              </p>

              {/* Arena Battle Matchup Preview */}
              <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-[#060A18]/90">
                <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-white/10 text-slate-400">
                  <span>ROOM #7492 // BIOCHEMISTRY SPRINT</span>
                  <span className="text-[#A9E6DD] font-bold">QUESTION 7/10</span>
                </div>

                <div className="py-4 flex items-center justify-around">
                  {/* Player 1 */}
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#1EC5B2] bg-[#1EC5B2]/20 flex items-center justify-center text-sm font-bold text-white mx-auto mb-1.5 shadow-[0_0_15px_rgba(30,197,178,0.4)]">
                      AS
                    </div>
                    <p className="text-xs font-bold text-white">Dr. Ashish</p>
                    <p className="text-[10px] font-mono text-[#A9E6DD]">6 pts (8.2s)</p>
                  </div>

                  {/* VS Emblem */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black font-mono text-rose-400 tracking-wider">VS</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">3.4s LEFT</span>
                  </div>

                  {/* Player 2 */}
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-950/40 flex items-center justify-center text-sm font-bold text-white mx-auto mb-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                      PK
                    </div>
                    <p className="text-xs font-bold text-white">Pooja K.</p>
                    <p className="text-[10px] font-mono text-purple-300">5 pts (9.1s)</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] text-center text-xs text-slate-300">
                  Fastest correct answer scores up to 100 speed-scaled points per round.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-white">
                <Users size={14} className="text-[#38BDF8]" /> Friends vs Friends Private Rooms Available
              </span>
              <span className="font-mono text-[#A9E6DD]">Zero latency</span>
            </div>
          </div>

          {/* National Merit Leaderboard */}
          <div className="lg:col-span-6 rounded-3xl border border-[#B8DFF4]/20 bg-[#0A1226] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/30">
                  <Crown size={13} />
                  <span>NATIONAL LEAGUE MERIT</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">UPDATED WEEKLY</span>
              </div>

              <h3 className="text-2xl font-bold text-white">National Leaderboard</h3>
              <p className="mt-2 text-sm text-[#A9B8D0]">
                Benchmark your performance against thousands of serious medical aspirants across all 7 provinces.
              </p>

              {/* Leaderboard Table Preview */}
              <div className="mt-6 space-y-2">
                {TOP_ASPIRANTS.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#060A18]/80 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono font-bold text-[11px] ${
                          user.rank === 1
                            ? 'bg-amber-400 text-black'
                            : user.rank === 2
                            ? 'bg-slate-300 text-black'
                            : user.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {user.rank}
                      </span>
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.collegeGoal}</p>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[11px]">
                      <span className="font-bold text-[#A9E6DD]">{user.score} / 200</span>
                      <p className="text-[10px] text-slate-400">{user.accuracy} Acc</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Weekly Sunday National Mock League</span>
              <span className="font-mono text-emerald-400 font-bold">Statewide Ranks</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Component 2: Achievements, Streaks & Daily Missions                */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Achievement Badges */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1224] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-[#A9E6DD]" size={18} aria-hidden="true" />
              <h4 className="text-base font-bold text-white">Achievements &amp; Badges</h4>
            </div>
            <p className="text-xs text-[#A9B8D0] mb-4">
              Unlock distinct medical milestones acknowledging consistency, accuracy and zero-rush mastery.
            </p>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Stethoscope Pioneer', desc: 'Completed first 5 full-length CEE mocks' },
                { name: 'Negative Mark Guardian', desc: 'Maintained <5% negative deduction over 500 Qs' },
                { name: 'Biology Maestro', desc: 'Achieved 95%+ in Botany and Zoology sections' },
              ].map((badge, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <p className="font-bold text-white">{badge.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Study Streaks */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1224] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="text-amber-400" size={18} aria-hidden="true" />
              <h4 className="text-base font-bold text-white">Study Streaks</h4>
            </div>
            <p className="text-xs text-[#A9B8D0] mb-4">
              Daily habit formation engineered specifically to combat pre-medical entrance burnout.
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-center mb-3">
              <p className="text-3xl font-black text-amber-400 font-mono">14 DAYS</p>
              <p className="text-xs font-bold text-white mt-1">Consistency Streak Active</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Freeze protection shield unlocked</p>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Aspirants with 21+ day streaks score an average of 24 marks higher.
            </p>
          </div>

          {/* Daily Missions */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1224] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-[#38BDF8]" size={18} aria-hidden="true" />
              <h4 className="text-base font-bold text-white">Daily Missions</h4>
            </div>
            <p className="text-xs text-[#A9B8D0] mb-4">
              Manageable bite-sized objectives so you never feel overwhelmed by the vast syllabus.
            </p>
            <div className="space-y-2 text-xs">
              {[
                { task: 'Solve 20 MAT Series Questions', progress: '20/20 Done', completed: true },
                { task: 'Review 5 Lenz Law Mistake DNA Items', progress: '5/5 Done', completed: true },
                { task: 'Attempt 1 Timed Biology Sectional', progress: 'In Progress', completed: false },
              ].map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className={`font-semibold truncate ${m.completed ? 'text-slate-300' : 'text-white'}`}>
                      {m.task}
                    </p>
                    <p className="text-[10px] text-slate-400">{m.progress}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${m.completed ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'}`}>
                    {m.completed ? 'DONE' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
