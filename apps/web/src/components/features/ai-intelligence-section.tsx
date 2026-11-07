'use client';

import React, { useState } from 'react';
import {
  Brain,
  Camera,
  Check,
  CheckCircle2,
  Dna,
  Radar,
} from 'lucide-react';
import styles from './features.module.css';

// ---------------------------------------------------------------------------
// Concept Explanation Modes for Feature 4: Explain Like My Teacher
// ---------------------------------------------------------------------------
type ExplanationMode =
  | 'nepali'
  | 'english'
  | 'stepByStep'
  | 'conceptual'
  | 'shortcuts'
  | 'comparisons';

interface TeacherModeData {
  title: string;
  badge: string;
  content: string;
  keyTakeaway: string;
}

const EXPLANATION_MODES: Record<ExplanationMode, TeacherModeData> = {
  nepali: {
    title: 'Simple Nepali (सरल नेपाली व्याख्या)',
    badge: 'Nepali Linguistic Context',
    content:
      'Frank-Starling law ले के भन्छ भने: मुटुको भेन्ट्रिकलमा जति धेरै रगत भरिन्छ (end-diastolic volume), मायोकार्डियल फाइबरहरू त्यति नै बढी तन्किन्छन् (stretch)। यसले गर्दा अर्को संकुचन (systolic contraction) अझ बलियो हुन्छ। सरल भाषामा: जति रबर ब्यान्ड तन्कायो, त्यति नै टाढासम्म पुग्छ!',
    keyTakeaway: 'मुख्य सूत्र: Preload बढ्दा Stroke Volume स्वतः बढ्छ।',
  },
  english: {
    title: 'Simple English (Intuitive Breakdown)',
    badge: 'Everyday Plain English',
    content:
      'The Frank-Starling mechanism states that the heart automatically adjusts its pumping force according to how much blood enters it. If more blood flows in during diastole, the heart muscle stretches more, resulting in a stronger subsequent contraction to pump that excess blood out.',
    keyTakeaway: 'Core Rule: Increased End-Diastolic Volume directly yields Increased Stroke Volume.',
  },
  stepByStep: {
    title: 'Step-by-Step Derivation & Physiology',
    badge: 'Curricular Step Breakdown',
    content:
      '1. Venous return increases → Left ventricle fills with greater volume of blood (End-Diastolic Volume rises).\n2. Sarcomere resting length elongates towards optimal actin-myosin overlap (approx 2.2 µm).\n3. Increased Ca²⁺ sensitivity of troponin C triggers greater cross-bridge formation.\n4. Ventricular force generation escalates proportionally, ejecting higher stroke volume.',
    keyTakeaway: 'Physiological Mechanism: Optimal sarcomere elongation maximizes cross-bridge kinetics.',
  },
  conceptual: {
    title: 'Deep Clinical Insights (Doctor-Grade)',
    badge: 'Pathophysiology High-Yield',
    content:
      'In decompensated congestive heart failure (CHF), chronic volume overload excessively stretches sarcomeres beyond the 2.2 µm optimum. As a consequence, actin and myosin filaments dissociate, causing contractility to drop. This explains why diuretic therapy reduces pulmonary congestion by shifting the operating point leftward along the Starling curve.',
    keyTakeaway: 'Clinical Pearl: Over-stretching past optimum leads to heart failure decompensation.',
  },
  shortcuts: {
    title: 'CEE Exam Shortcuts & Mnemonics',
    badge: 'High-Speed Elimination Strategy',
    content:
      'Mnemonic: "STARLING = S-T-A-R: Stretch Triggers Action, Raised-output."\nIn CEE MCQs: When you see "Heterometric autoregulation" or "Length-dependent activation", eliminate contractility drugs immediately — Frank-Starling is an INTRINSIC mechanical property, independent of sympathetic nerves or epinephrine!',
    keyTakeaway: 'Trap Warning: Frank-Starling does NOT require autonomic stimulation.',
  },
  comparisons: {
    title: 'Clinical Comparison & Real-World Analogy',
    badge: 'Comparative Matrix',
    content:
      'Contrast Frank-Starling vs Inotropy (Bowditch effect):\n• Frank-Starling (Intrinsic): Alters stroke volume via change in FIBER LENGTH (Preload).\n• Inotropy (Extrinsic): Alters contractility at any constant fiber length via INTRACELLULAR CALCIUM (e.g. Digoxin, Epinephrine).',
    keyTakeaway: 'Differentiation: Length-dependent (Starling) vs Length-independent (Inotropy).',
  },
};

export function AiIntelligenceSection() {
  const [activeTeacherMode, setActiveTeacherMode] = useState<ExplanationMode>('nepali');

  return (
    <section id="ai-intelligence" className={styles.section}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className={styles.eyebrowBadge}>
            <Brain size={12} aria-hidden="true" />
            <span>AI INTELLIGENCE ECOSYSTEM</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Intelligence That Understands{' '}
            <span className="bg-gradient-to-r from-[#B8DFF4] via-[#A9E6DD] to-[#D5F3E8] bg-clip-text text-transparent">
              Your Medical Mind.
            </span>
          </h2>

          <p className={styles.sectionLead}>
            Preparation shouldn&apos;t be endless repetitive question drilling. Our clinical AI
            diagnoses your knowledge architecture, isolates hidden reasoning traps, and creates a
            surgical recovery roadmap.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Feature 1: AI Personal CEE Mentor                                  */}
        {/* Editorial Layout: Interactive AI Dialogue Console                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-14 rounded-3xl border border-[#B8DFF4]/20 bg-gradient-to-br from-[#0A1128] via-[#101A3C] to-[#0D1836] p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#A9E6DD] bg-[#A9E6DD]/10 border border-[#A9E6DD]/30">
                FEATURE 01 // AUTONOMOUS MENTOR
              </span>
              <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                AI Personal CEE Mentor
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#A9B8D0] leading-relaxed">
                Your personal preparation companion that understands your progress, learning
                patterns and preparation goals.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Personalized preparation guidance calibrated to your target college rank',
                  'Context-aware study recommendations after every practice session',
                  'Concept explanations connecting foundational physics to clinical medicine',
                  'Progress-based learning suggestions to prevent burnout and plateauing',
                  'Guided preparation roadmap dynamically readjusting for CEE exam dates',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-[#A9E6DD] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mentor Live Interactive Preview Terminal */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#060A18]/90 p-4 sm:p-6 shadow-inner">
                {/* Terminal Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white">
                      CEE-MENTOR // NEURAL RUNTIME
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A9E6DD] bg-[#A9E6DD]/10 px-2 py-0.5 rounded">
                    ASPIRANT: DR. ASHISH (MBBS MERIT GOAL)
                  </span>
                </div>

                {/* Dialog Messages */}
                <div className="space-y-3 text-xs sm:text-sm font-sans">
                  {/* User Question */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#1E293B] border border-white/10 p-3 text-slate-100">
                      <p className="text-[11px] text-[#A9E6DD] font-semibold mb-1">Dr. Ashish:</p>
                      I scored 148 in yesterday&apos;s mock. Botany was strong (38/40), but in Physics I lost 6 marks to Lenz&apos;s Law induced EMF traps. How do I fix this?
                    </div>
                  </div>

                  {/* AI Mentor Response */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1EC5B2] to-[#0A92A8] text-white">
                      <Brain size={18} aria-hidden="true" />
                    </div>
                    <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-[#101A3C] border border-[#A9E6DD]/30 p-3.5 text-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-[#A9E6DD]">AI CEE Mentor</span>
                        <span className="text-[10px] text-slate-400 font-mono">Context: Lenz&apos;s Law Diagnostic</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                        Excellent Botany performance, Ashish! You&apos;re currently at 95% syllabus retention there.
                      </p>
                      <div className="mt-2 p-2.5 rounded-xl bg-[#060A18]/80 border border-[#B8DFF4]/15 text-xs text-[#B8DFF4] space-y-1">
                        <p className="font-semibold text-white">⚡ Diagnostic Finding: Lenz&apos;s Law Sign Traps</p>
                        <p className="text-[11px] text-slate-300">
                          In CEE, 72% of students choose opposite current direction because they forget: <em>induced current always opposes the CHANGE in flux</em>, not the flux itself.
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-400 font-bold">Recommended: 8-Question Remediation Drill</span>
                          <span className="text-slate-400">Est. Time: 12 mins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Feature 2: Mistake DNA                                             */}
        {/* Editorial Layout: Medical Diagnostic Visualization                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 rounded-3xl border border-[#B8DFF4]/20 bg-gradient-to-br from-[#0F1D2C] via-[#0A1622] to-[#060E18] p-6 sm:p-10 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#7367F0] bg-[#7367F0]/15 border border-[#7367F0]/30">
              FEATURE 02 // ERROR PATHOLOGY
            </span>
            <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Mistake DNA Diagnostic Engine
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#A9B8D0]">
              Go beyond knowing which answer was wrong. Understand why you keep making the same mistakes.
            </p>
          </div>

          {/* Interactive Diagnostic Tree Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                type: 'conceptual',
                title: 'Conceptual Misunderstanding',
                frequency: '38% of errors',
                color: '#7367F0',
                border: 'border-[#7367F0]/40',
                bg: 'bg-[#7367F0]/10',
                example: 'Confusing Adiabatic vs Isothermal PV curve slopes (γ factor missing).',
                remedy: 'Deep foundational re-derivation + visual PV comparison diagram.',
              },
              {
                type: 'calculation',
                title: 'Calculation Slip / Rush',
                frequency: '26% of errors',
                color: '#38BDF8',
                border: 'border-[#38BDF8]/40',
                bg: 'bg-[#38BDF8]/10',
                example: 'Powers of ten conversion errors between Å (10⁻¹⁰m) and nm (10⁻⁹m).',
                remedy: 'Unit verification checklist before clicking submit.',
              },
              {
                type: 'memory',
                title: 'Memory Fade / Retention Gap',
                frequency: '21% of errors',
                color: '#F59E0B',
                border: 'border-[#F59E0B]/40',
                bg: 'bg-[#F59E0B]/10',
                example: 'Recalling taxonomic dental formula of rabbit vs human during timed pressure.',
                remedy: 'Spaced repetition flash-sync on Day 1, 3, and 7.',
              },
              {
                type: 'trap',
                title: 'Question Interpretation Trap',
                frequency: '15% of errors',
                color: '#10B981',
                border: 'border-[#10B981]/40',
                bg: 'bg-[#10B981]/10',
                example: 'Missing negative qualifiers ("Which of the following is NOT correct?").',
                remedy: 'CEE Qualifier highlighter automatically flags inverse prompts.',
              },
            ].map((dna) => (
              <div
                key={dna.type}
                className={`rounded-2xl border ${dna.border} ${dna.bg} p-5 backdrop-blur-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono"
                      style={{ color: dna.color, backgroundColor: `${dna.color}20` }}
                    >
                      {dna.frequency}
                    </span>
                    <Dna size={16} style={{ color: dna.color }} aria-hidden="true" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{dna.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    <strong className="text-slate-100">Root Trigger:</strong> {dna.example}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-[#A9E6DD]">
                  <span className="font-semibold text-white">AI Prescription:</span> {dna.remedy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Feature 3 & 4 Grid: AI Recovery Plan + Explain Like My Teacher     */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feature 3: AI Recovery Plan */}
          <div className="lg:col-span-6 rounded-3xl border border-[#B8DFF4]/20 bg-[#0A1128] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#22D3EE] bg-[#22D3EE]/15 border border-[#22D3EE]/30">
                FEATURE 03 // PERFORMANCE REMEDIATION
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">AI Recovery Plan</h3>
              <p className="mt-2 text-sm text-[#A9B8D0]">
                Turn weak performance into a practical recovery strategy.
              </p>

              {/* Dynamic 4-Step Recovery Sprint Preview */}
              <div className="mt-6 space-y-3">
                {[
                  {
                    step: 'STEP 1',
                    label: 'Identify Learning Gaps',
                    detail: 'Isolates 3 specific subtopics causing 80% of mark deductions',
                    badge: 'Thermodynamics & Genetics',
                  },
                  {
                    step: 'STEP 2',
                    label: 'Prioritize High-Yield Topics',
                    detail: 'Cross-references gaps with MEC 5-year exam weightage matrices',
                    badge: 'High CEE Impact',
                  },
                  {
                    step: 'STEP 3',
                    label: 'Generate Manageable Recovery Tasks',
                    detail: 'Breaks down 2-hour remediation into 15-minute bite-sized sprints',
                    badge: 'Daily Sprint: 4 Tasks',
                  },
                  {
                    step: 'STEP 4',
                    label: 'Track Improvement Over Time',
                    detail: 'Simulates re-tests to verify mastery before re-introducing into mocks',
                    badge: '+12 Mark Recovery Goal',
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#A9E6DD]">{s.step}</span>
                        <span className="text-xs font-bold text-white">{s.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.detail}</p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded whitespace-nowrap">
                      {s.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Check size={14} /> Proven 18-point average score gain
              </span>
              <span className="font-mono text-[#A9E6DD]">Active on Every Mock</span>
            </div>
          </div>

          {/* Feature 4: Explain Like My Teacher (Interactive 6-Mode Switcher) */}
          <div className="lg:col-span-6 rounded-3xl border border-[#B8DFF4]/20 bg-[#101A3C] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#A9E6DD] bg-[#A9E6DD]/15 border border-[#A9E6DD]/30">
                  FEATURE 04 // MULTI-MODE PEDAGOGY
                </span>
                <span className="text-[10px] font-mono text-slate-400">Concept: Frank-Starling Law</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-white">Explain Like My Teacher</h3>
              <p className="mt-2 text-sm text-[#A9B8D0]">
                Understand difficult concepts in the way that works best for you. Switch between 6 tailored pedagogical modes:
              </p>

              {/* Mode Selection Tabs */}
              <div className="mt-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Explanation Modes">
                {[
                  { id: 'nepali', label: '🇳🇵 Simple Nepali' },
                  { id: 'english', label: '🇬🇧 Simple English' },
                  { id: 'stepByStep', label: '📝 Step-by-Step' },
                  { id: 'conceptual', label: '🔬 Deep Conceptual' },
                  { id: 'shortcuts', label: '⚡ CEE Shortcuts' },
                  { id: 'comparisons', label: '⚖️ Comparisons' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTeacherMode === mode.id}
                    onClick={() => setActiveTeacherMode(mode.id as ExplanationMode)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      activeTeacherMode === mode.id
                        ? 'border-[#A9E6DD] bg-[#1EC5B2]/20 text-[#A9E6DD] shadow-sm'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Explanation Box */}
              <div className="mt-4 rounded-xl border border-[#B8DFF4]/15 bg-[#060A18]/90 p-4 min-h-[140px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#B8DFF4]">
                      {EXPLANATION_MODES[activeTeacherMode].title}
                    </span>
                    <span className="text-[10px] font-mono text-[#A9E6DD] bg-[#A9E6DD]/10 px-2 py-0.5 rounded">
                      {EXPLANATION_MODES[activeTeacherMode].badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {EXPLANATION_MODES[activeTeacherMode].content}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 text-[11px] font-mono text-emerald-400 font-semibold">
                  ✓ {EXPLANATION_MODES[activeTeacherMode].keyTakeaway}
                </div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <span className="text-[11px] text-slate-400">Available across all 15,000+ CEE questions</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Feature 5 & 6 Grid: AI Doubt Scanner + Smart Revision Radar        */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feature 5: AI Doubt Scanner */}
          <div className="lg:col-span-6 rounded-3xl border border-[#B8DFF4]/20 bg-[#0F182A] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30">
                  FEATURE 05 // OCR SCANNER
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  GUIDED RESOLUTION PREVIEW
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-white">AI Doubt Scanner</h3>
              <p className="mt-2 text-sm text-[#A9B8D0]">
                Capture a difficult question and get guided explanations.
              </p>

              {/* Realistic OCR Visual Scan Simulation */}
              <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#060A18] p-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Camera size={14} />
                    <span>OCR QUESTION INPUT</span>
                  </div>
                  <span>LATENCY: 0.4s</span>
                </div>

                {/* Scanned MCQ Simulation */}
                <div className="p-3 rounded-lg border border-dashed border-cyan-400/40 bg-cyan-950/20 text-xs">
                  <p className="text-[11px] font-mono text-cyan-400 mb-1">
                    [DETECTED CEE 2023 RECALL QUESTION]
                  </p>
                  <p className="text-white font-semibold">
                    &quot;A thin circular disc and a solid sphere of identical mass and radius roll down an inclined plane without slipping. Which reaches the bottom first?&quot;
                  </p>
                </div>

                {/* Extracted Concept & Step-by-Step Resolution */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#A9E6DD] uppercase font-bold">Concept Identified:</span>
                    <span className="text-white font-medium">Moment of Inertia &amp; Rolling Acceleration (a = g sin θ / (1 + k²/r²))</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Solid Sphere has smaller rotational inertia ratio (k²/r² = 2/5 = 0.4) than circular disc (k²/r² = 1/2 = 0.5). Therefore, the solid sphere possesses higher linear acceleration and arrives first.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-400 font-mono border-t border-white/10">
                    <span>Correct Option: B (Solid Sphere)</span>
                    <span className="text-[#38BDF8]">3 Related Practice Questions Generated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Supports photo uploads, clear screenshot crops &amp; text paste</span>
              <span className="font-mono text-[#A9E6DD]">Step-by-step guidance</span>
            </div>
          </div>

          {/* Feature 6: Smart Revision Radar */}
          <div className="lg:col-span-6 rounded-3xl border border-[#B8DFF4]/20 bg-[#0C1527] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono tracking-wider text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/30">
                FEATURE 06 // RETENTION RADAR
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">Smart Revision Radar</h3>
              <p className="mt-2 text-sm text-[#A9B8D0]">
                Know what to revise, when to revise it and which concepts need more attention.
              </p>

              {/* Spaced Revision Timetable & Decay Meter */}
              <div className="mt-6 space-y-3">
                {[
                  {
                    topic: 'Human Endocrine System (Hormones & Feedback)',
                    decay: '88% Retention',
                    status: 'Optimal Memory State',
                    nextAction: 'Review due in 5 days (Cycle 3)',
                    color: '#10B981',
                  },
                  {
                    topic: 'Organic Reaction Mechanisms (SN1 vs SN2)',
                    decay: '58% Retention',
                    status: 'Approaching Forgetting Threshold',
                    nextAction: 'Micro-quiz recommended TODAY',
                    color: '#F59E0B',
                  },
                  {
                    topic: 'Rotational Dynamics (Torque & Conservation)',
                    decay: '34% Retention',
                    status: 'Critical Retention Decay Alert',
                    nextAction: 'Priority 15-min recovery drill scheduled',
                    color: '#EF4444',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-white/10 bg-[#060A18]/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white">{item.topic}</span>
                      <span
                        className="font-mono font-bold text-[11px]"
                        style={{ color: item.color }}
                      >
                        {item.decay}
                      </span>
                    </div>
                    {/* Retention Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: item.decay.replace('% Retention', '%'),
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.status}</span>
                      <span className="text-[#A9E6DD] font-semibold">{item.nextAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-[#A9E6DD]">
                <Radar size={15} /> Spaced repetition prevents pre-exam panic
              </span>
              <span className="font-mono text-emerald-400 font-bold">100% Automated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
