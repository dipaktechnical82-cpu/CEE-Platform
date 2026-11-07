'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  Dna,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './features.module.css';

interface EcosystemNodeItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  accentBg: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  anchorLink: string;
  keyMetric: string;
  status: 'LIVE CAPABILITY' | 'INTEGRATED' | 'CONNECTED';
}

const ECOSYSTEM_NODES: EcosystemNodeItem[] = [
  {
    id: 'mistake-dna',
    name: 'Mistake DNA',
    tagline: 'Deep Diagnostic Error Attribution',
    description:
      'Categorizes every mistake into conceptual misunderstandings, calculation rush slips, memory fades, or question misinterpretation traps.',
    icon: Dna,
    color: '#7367F0',
    accentBg: 'rgba(115, 103, 240, 0.15)',
    position: { top: '8%', left: '12%' },
    anchorLink: '#ai-intelligence',
    keyMetric: '4-Type Error Breakdown',
    status: 'LIVE CAPABILITY',
  },
  {
    id: 'question-bank',
    name: 'Smart Question Bank',
    tagline: '15,000+ Verified CEE Challenges',
    description:
      'Structured by Physics, Chemistry, Zoology, Botany, and MAT with multi-tier difficulty ladders and comprehensive step-by-step rationales.',
    icon: BookOpenCheck,
    color: '#38BDF8',
    accentBg: 'rgba(56, 189, 248, 0.15)',
    position: { top: '8%', right: '12%' },
    anchorLink: '#learning-system',
    keyMetric: '100% MEC CEE Aligned',
    status: 'INTEGRATED',
  },
  {
    id: 'exam-simulator',
    name: 'CEE Exam Simulator',
    tagline: 'Authentic 3-Hour CEE Rehearsal',
    description:
      'Exact 200 questions / 200 marks structure, genuine OMR bubble sheet, +1.0/-0.25 negative marking evaluation, and national merit rank prediction.',
    icon: Target,
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    position: { bottom: '12%', right: '14%' },
    anchorLink: '#exam-experience',
    keyMetric: '180m Countdown + OMR',
    status: 'LIVE CAPABILITY',
  },
  {
    id: 'adaptive-learning',
    name: 'Adaptive Learning',
    tagline: 'Real-Time Dynamic Difficulty Calibration',
    description:
      'Continuously adjusts practice difficulty based on latency, accuracy, and subject retention so you never plateau.',
    icon: Zap,
    color: '#22D3EE',
    accentBg: 'rgba(34, 211, 238, 0.15)',
    position: { top: '50%', right: '2%' },
    anchorLink: '#learning-system',
    keyMetric: 'Dynamic Calibration',
    status: 'CONNECTED',
  },
  {
    id: 'smart-revision',
    name: 'Smart Revision',
    tagline: 'Spaced Repetition & Forgetting Curve Defense',
    description:
      'Predicts retention decay and schedules timely micro-revisions exactly when concepts begin to fade from memory.',
    icon: RotateCcw,
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.15)',
    position: { bottom: '12%', left: '14%' },
    anchorLink: '#ai-intelligence',
    keyMetric: 'Ebbinghaus Cycle Sync',
    status: 'CONNECTED',
  },
  {
    id: 'performance-intelligence',
    name: 'Performance Intelligence',
    tagline: 'Predictive Merit Analytics & Weakness Radar',
    description:
      'Synthesizes mock scores, accuracy speed, and subject-wise mastery into an actionable daily roadmap for medical entrance victory.',
    icon: BarChart3,
    color: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.15)',
    position: { top: '50%', left: '2%' },
    anchorLink: '#mission-control',
    keyMetric: 'Subject Mastery Radar',
    status: 'INTEGRATED',
  },
];

export function EcosystemSection() {
  const [selectedNode, setSelectedNode] = useState<EcosystemNodeItem>(ECOSYSTEM_NODES[0]);

  return (
    <section id="ecosystem" className={styles.section}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className={styles.eyebrowBadge}>
            <Sparkles size={12} aria-hidden="true" />
            <span>ONE ECOSYSTEM. EVERY STEP OF YOUR JOURNEY.</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Not Just Preparation.{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              A Complete Future Doctor Ecosystem.
            </span>
          </h2>

          <p className={`${styles.sectionLead} mx-auto`}>
            Your preparation should understand you, adapt to you, challenge you and guide you. CEE
            Medical Prep brings every part of that journey into one connected experience.
          </p>
        </div>

        {/* Interactive Ecosystem Orbital Stage */}
        <div className="relative mt-12 rounded-3xl border border-[#B8DFF4]/15 bg-[#0A1128]/70 dark:bg-[#070D1F]/90 p-4 sm:p-8 lg:p-12 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Orbital Guidelines */}
          <div className={styles.orbitalRing1} aria-hidden="true" />
          <div className={styles.orbitalRing2} aria-hidden="true" />

          {/* Large Screen Orbital Visual Display */}
          <div className="hidden lg:block relative w-full h-[540px]">
            {/* Center Core: AI Personal CEE Mentor */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
              tabIndex={0}
              role="button"
              aria-label="Central AI Personal CEE Mentor Core"
            >
              <div className={styles.mentorCore}>
                <div className="p-3 rounded-full bg-[#1EC5B2]/20 border border-[#A9E6DD]/40 mb-2">
                  <Brain size={28} className="text-[#A9E6DD]" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold tracking-wider uppercase text-[#B8DFF4]">
                  CENTRAL CORE
                </span>
                <span className="text-sm font-black text-white leading-tight">
                  AI PERSONAL
                  <br />
                  CEE MENTOR
                </span>
                <span className="mt-1 text-[10px] text-[#A9E6DD] font-mono">NEURAL HUB</span>
              </div>
            </div>

            {/* Orbiting Satellite Nodes */}
            {ECOSYSTEM_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const Icon = node.icon;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`${styles.ecosystemNode} ${isSelected ? styles.ecosystemNodeActive : ''}`}
                  style={{
                    top: node.position.top,
                    bottom: node.position.bottom,
                    left: node.position.left,
                    right: node.position.right,
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${node.name}: ${node.tagline}`}
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: node.accentBg, color: node.color }}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span>{node.name}</span>
                </button>
              );
            })}
          </div>

          {/* Small Screen / Mobile Grid for Ecosystem Nodes */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="col-span-full p-4 rounded-2xl border border-[#A9E6DD]/40 bg-[#101A3C] text-center">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1EC5B2]/20 text-[#A9E6DD] mb-2">
                Central Learning Engine
              </span>
              <h3 className="text-lg font-bold text-white">AI PERSONAL CEE MENTOR</h3>
              <p className="text-xs text-[#A9B8D0] mt-1">
                Connected orchestrator driving personalized medical preparation across all 6 modules.
              </p>
            </div>

            {ECOSYSTEM_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const Icon = node.icon;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#A9E6DD] bg-[#162354] shadow-md'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: node.accentBg, color: node.color }}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{node.name}</p>
                    <p className="text-[11px] text-[#A9B8D0] truncate">{node.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Module Detail Panel */}
          <div className="mt-6 pt-6 border-t border-[#B8DFF4]/15 bg-white/[0.02] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30">
                  {selectedNode.status}
                </span>
                <span className="text-xs font-semibold text-[#A9E6DD]">
                  {selectedNode.keyMetric}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>{selectedNode.name}</span>
                <span className="text-sm font-normal text-slate-400">— {selectedNode.tagline}</span>
              </h3>

              <p className="mt-2 text-sm text-[#A9B8D0] leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <a
              href={selectedNode.anchorLink}
              className="inline-flex items-center gap-2 shrink-0 rounded-xl border border-[#A9E6DD]/40 bg-[#1EC5B2]/15 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#A9E6DD] hover:bg-[#1EC5B2]/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9E6DD]"
            >
              <span>Explore {selectedNode.name}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
