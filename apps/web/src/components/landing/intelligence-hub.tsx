'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  BrainCircuit,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock3,
  HeartPulse,
  Info,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import styles from './intelligence-hub.module.css';

// ---------------------------------------------------------------------------
// Medical Concept Definitions for AI Assistant
// ---------------------------------------------------------------------------
interface ConceptPrompt {
  id: string;
  label: string;
  query: string;
  answer: string;
  tag: string;
}

const AI_CONCEPTS: ConceptPrompt[] = [
  {
    id: 'cardiac',
    label: 'Cardiac Cycle',
    query: 'How does Phase 0 depolarization occur in ventricular myocytes?',
    answer:
      'Fast voltage-gated Na⁺ channels open rapidly when membrane potential reaches -70mV, driving massive Na⁺ influx and steep upstroke to +20mV.',
    tag: 'PHYSIOLOGY',
  },
  {
    id: 'bernoulli',
    label: 'Hemodynamics',
    query: 'How does Bernoulli’s equation explain aortic valve stenosis flow?',
    answer:
      'As blood velocity surges across the stenotic orifice, kinetic energy escalates while hydrostatic pressure drops proportionally: ΔP = 4v².',
    tag: 'MEDICAL PHYSICS',
  },
  {
    id: 'krebs',
    label: 'ATP Yield',
    query: 'What is the net ATP generated per glucose molecule under aerobic respiration?',
    answer:
      'Total yield is 30 to 32 ATP molecules depending on glycerol-3-phosphate vs malate-aspartate NADH shuttle transport.',
    tag: 'BIOCHEMISTRY',
  },
];

// ---------------------------------------------------------------------------
// Interactive MCQ Question for Smart Question Bank
// ---------------------------------------------------------------------------
interface MCQOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

const DEMO_MCQ = {
  subject: 'HUMAN PHYSIOLOGY',
  questionNumber: 'Q. 114',
  question: 'Which heart sound is caused by the closure of the semilunar valves?',
  options: [
    {
      letter: 'A',
      text: 'First heart sound (S1 - Lub)',
      isCorrect: false,
      explanation: 'S1 is produced by AV valve (mitral & tricuspid) closure.',
    },
    {
      letter: 'B',
      text: 'Second heart sound (S2 - Dub)',
      isCorrect: true,
      explanation: 'Correct! S2 marks the end of systole with aortic & pulmonary valve closure.',
    },
    {
      letter: 'C',
      text: 'Third heart sound (S3)',
      isCorrect: false,
      explanation: 'S3 represents rapid ventricular filling during early diastole.',
    },
    {
      letter: 'D',
      text: 'Fourth heart sound (S4)',
      isCorrect: false,
      explanation: 'S4 represents atrial contraction against a stiff ventricle.',
    },
  ] as MCQOption[],
};

// ---------------------------------------------------------------------------
// Component Implementation
// ---------------------------------------------------------------------------
export function IntelligenceHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [overdriveActive, setOverdriveActive] = useState(false);

  // AI Assistant Interactive State
  const [selectedConcept, setSelectedConcept] = useState<ConceptPrompt>(AI_CONCEPTS[0]);

  // Question Bank Interactive State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Mock Exam Timer (ticking)
  const [examSeconds, setExamSeconds] = useState(10542); // 2h 55m 42s
  const [isQuestionFlagged, setIsQuestionFlagged] = useState(false);

  // Study Plan Interactive Days
  const [activeDay, setActiveDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'>('WED');

  // Performance Analytics Active Bar Hover
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  // Trigger intersection observer
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Live Exam Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setExamSeconds((prev) => (prev > 0 ? prev - 1 : 10800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const triggerOverdrive = () => {
    setOverdriveActive(true);
    setTimeout(() => {
      setOverdriveActive(false);
    }, 3800);
  };

  return (
    <section
      aria-labelledby="intelligence-hub-heading"
      className={`${styles.section} ${overdriveActive ? styles.overdriveMode : ''}`}
      data-visible={hasEntered}
      id="intelligence-hub"
      ref={sectionRef}
    >
      {/* Background Cyber Mesh & Atmospheric Plasma Fields */}
      <div aria-hidden="true" className={styles.ambientCyberGrid} />
      <div aria-hidden="true" className={styles.radialPlasmaAura} />
      <div aria-hidden="true" className={styles.energyScanline} />

      <div className={styles.sectionInner}>
        {/* Section Heading & Overdrive Activation Banner */}
        <header className={styles.intro}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className={styles.eyebrow}>
              <Sparkles aria-hidden="true" size={14} className={styles.eyebrowIcon} />
              AI Quantum Medical Architecture
            </span>

            <button
              className={`${styles.overdriveButton} ${overdriveActive ? styles.overdriveActiveState : ''}`}
              onClick={triggerOverdrive}
              title="Click to pulse high-energy data between all neural modules"
              type="button"
            >
              <Zap size={14} className={overdriveActive ? 'animate-bounce' : ''} />
              <span>{overdriveActive ? 'OVERDRIVE ACTIVE · PULSING' : 'ENGAGE NEURAL SURGE'}</span>
            </button>
          </div>

          <h2 className={styles.heading} id="intelligence-hub-heading">
            Not Just Preparation.
            <br />A <span className={styles.gradientHeading}>Smarter, High-Yield Way</span> to
            Become a Doctor.
          </h2>

          <p className={styles.description}>
            Five interconnected cybernetic intelligence vectors engineered specifically for Nepal’s
            competitive CEE examination.
          </p>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* The Holographic Ecosystem Arena                                   */}
        {/* ---------------------------------------------------------------- */}
        <div
          aria-label="Five connected medical learning capabilities"
          className={styles.ecosystem}
          role="group"
        >
          {/* Animated SVG Laser Conduits with Travelling Light Pulses */}
          <svg aria-hidden="true" className={styles.conduitsSvg} viewBox="0 0 1100 800">
            <defs>
              <linearGradient id="neon-cyan-beam" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0891B2" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="neon-purple-beam" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="neon-amber-beam" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="neon-emerald-beam" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="neon-blue-beam" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.2" />
              </linearGradient>

              <filter id="beam-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path 1: Center to AI Assistant (Top Left) */}
            <path
              className={`${styles.laserTrack} ${activeModule === 'assistant' || overdriveActive ? styles.laserActive : ''}`}
              d="M 550 400 C 440 340, 300 220, 160 160"
              stroke="url(#neon-cyan-beam)"
            />
            <path
              className={`${styles.laserPulse} ${activeModule === 'assistant' || overdriveActive ? styles.pulseFast : ''}`}
              d="M 550 400 C 440 340, 300 220, 160 160"
              stroke="#22D3EE"
              filter="url(#beam-glow)"
            />

            {/* Path 2: Center to Question Bank (Top Right) */}
            <path
              className={`${styles.laserTrack} ${activeModule === 'questions' || overdriveActive ? styles.laserActive : ''}`}
              d="M 550 400 C 660 340, 800 220, 940 160"
              stroke="url(#neon-purple-beam)"
            />
            <path
              className={`${styles.laserPulse} ${activeModule === 'questions' || overdriveActive ? styles.pulseFast : ''}`}
              d="M 550 400 C 660 340, 800 220, 940 160"
              stroke="#C084FC"
              filter="url(#beam-glow)"
            />

            {/* Path 3: Center to Study Plan (Bottom Left) */}
            <path
              className={`${styles.laserTrack} ${activeModule === 'study-plan' || overdriveActive ? styles.laserActive : ''}`}
              d="M 550 400 C 420 440, 300 530, 160 520"
              stroke="url(#neon-emerald-beam)"
            />
            <path
              className={`${styles.laserPulse} ${activeModule === 'study-plan' || overdriveActive ? styles.pulseFast : ''}`}
              d="M 550 400 C 420 440, 300 530, 160 520"
              stroke="#34D399"
              filter="url(#beam-glow)"
            />

            {/* Path 4: Center to Mock Exam (Bottom Right) */}
            <path
              className={`${styles.laserTrack} ${activeModule === 'examination' || overdriveActive ? styles.laserActive : ''}`}
              d="M 550 400 C 680 440, 800 530, 940 520"
              stroke="url(#neon-amber-beam)"
            />
            <path
              className={`${styles.laserPulse} ${activeModule === 'examination' || overdriveActive ? styles.pulseFast : ''}`}
              d="M 550 400 C 680 440, 800 530, 940 520"
              stroke="#FBBF24"
              filter="url(#beam-glow)"
            />

            {/* Path 5: Center to Analytics (Bottom Center) */}
            <path
              className={`${styles.laserTrack} ${activeModule === 'analytics' || overdriveActive ? styles.laserActive : ''}`}
              d="M 550 400 C 550 490, 550 590, 550 680"
              stroke="url(#neon-blue-beam)"
            />
            <path
              className={`${styles.laserPulse} ${activeModule === 'analytics' || overdriveActive ? styles.pulseFast : ''}`}
              d="M 550 400 C 550 490, 550 590, 550 680"
              stroke="#60A5FA"
              filter="url(#beam-glow)"
            />

            {/* Central Resonance Node Point */}
            <circle cx="550" cy="400" r="7" className={styles.centralHubDot} />
          </svg>

          {/* -------------------------------------------------------------- */}
          {/* Central Kinetic Reactor Core                                  */}
          {/* -------------------------------------------------------------- */}
          <div
            className={`${styles.quantumCore} ${overdriveActive ? styles.coreOverdrive : ''}`}
            onClick={triggerOverdrive}
            role="button"
            tabIndex={0}
            title="Click to pulse the CEE Neural Core"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerOverdrive();
              }
            }}
          >
            {/* Layer 1: Rotating Gyroscopic Cyber Rings */}
            <div className={`${styles.gyroRing} ${styles.gyroRingOuter}`} />
            <div className={`${styles.gyroRing} ${styles.gyroRingMiddle}`} />
            <div className={`${styles.gyroRing} ${styles.gyroRingInner}`} />

            {/* Layer 2: Orbiting Energy Particles */}
            <div className={`${styles.orbitParticle} ${styles.particleOne}`} />
            <div className={`${styles.orbitParticle} ${styles.particleTwo}`} />
            <div className={`${styles.orbitParticle} ${styles.particleThree}`} />

            {/* Layer 3: Central Glass Orb with Glowing Anatomical Heart SVG */}
            <div className={styles.coreHoloGlass}>
              <div className={styles.coreHologramGraphic}>
                <svg
                  className={styles.beatingHeartSvg}
                  viewBox="0 0 100 90"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="heart-glow-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  {/* Heart silhouette */}
                  <path
                    d="M 50 82 C 20 58 5 40 5 24 C 5 10 16 2 28 2 C 37 2 45 7 50 16 C 55 7 63 2 72 2 C 84 2 95 10 95 24 C 95 40 80 58 50 82 Z"
                    fill="url(#heart-glow-grad)"
                    fillOpacity="0.22"
                    stroke="#22D3EE"
                    strokeWidth="2"
                  />
                  {/* ECG Line pulsing across heart */}
                  <path
                    d="M 12 45 L 32 45 L 38 30 L 44 60 L 52 18 L 60 52 L 66 42 L 72 45 L 88 45"
                    stroke="#F7F8FF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.ecgPulseLine}
                  />
                </svg>
              </div>

              {/* Core Telemetry Text */}
              <span className={styles.coreKicker}>CEE · NEURAL CORE v4.2</span>
              <h3 className={styles.coreTitle}>AI LEARNING INTELLIGENCE</h3>
              <p className={styles.coreSubtitle}>Medical Preparation Matrix</p>
              <div className={styles.coreBadge}>
                <span className={styles.corePulsingDot} />
                <span>5 VECTORS ACTIVE</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* SATELLITE MODULE 1: AI Learning Assistant (Top Left)           */}
          {/* -------------------------------------------------------------- */}
          <article
            className={`${styles.satelliteCard} ${styles.posAssistant} ${activeModule === 'assistant' ? styles.cardActive : ''}`}
            onMouseEnter={() => setActiveModule('assistant')}
            onMouseLeave={() => setActiveModule(null)}
          >
            <div className={styles.cardHeader}>
              <span className={`${styles.cardIconBox} ${styles.accentCyan}`}>
                <BrainCircuit size={20} strokeWidth={2} />
              </span>
              <div>
                <span className={styles.cardEyebrow}>LEARN WITH CLARITY</span>
                <h4 className={styles.cardTitle}>AI Learning Assistant</h4>
              </div>
            </div>

            <p className={styles.cardDesc}>
              Instant clinical explanations that deconstruct challenging CEE mechanisms.
            </p>

            {/* Interactive Concept Switcher Terminal */}
            <div className={styles.aiTerminalBox}>
              <div className={styles.terminalPromptTabs}>
                {AI_CONCEPTS.map((c) => (
                  <button
                    key={c.id}
                    className={`${styles.promptTabBtn} ${selectedConcept.id === c.id ? styles.promptTabActive : ''}`}
                    onClick={() => setSelectedConcept(c)}
                    type="button"
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className={styles.terminalBody}>
                <div className={styles.terminalQuery}>
                  <span className={styles.promptArrow}>&gt;</span>
                  <span>{selectedConcept.query}</span>
                </div>
                <div className={styles.terminalAnswer}>
                  <Sparkles size={12} className="text-cyan-300 shrink-0 mt-0.5" />
                  <p>{selectedConcept.answer}</p>
                </div>
              </div>
            </div>
          </article>

          {/* -------------------------------------------------------------- */}
          {/* SATELLITE MODULE 2: Smart Question Bank (Top Right)            */}
          {/* -------------------------------------------------------------- */}
          <article
            className={`${styles.satelliteCard} ${styles.posQuestions} ${activeModule === 'questions' ? styles.cardActive : ''}`}
            onMouseEnter={() => setActiveModule('questions')}
            onMouseLeave={() => setActiveModule(null)}
          >
            <div className={styles.cardHeader}>
              <span className={`${styles.cardIconBox} ${styles.accentPurple}`}>
                <BookOpen size={20} strokeWidth={2} />
              </span>
              <div>
                <span className={styles.cardEyebrow}>PRACTICE WITH PURPOSE</span>
                <h4 className={styles.cardTitle}>Smart Question Bank</h4>
              </div>
            </div>

            <p className={styles.cardDesc}>
              Adaptive topic-wise questions with instant verification and CEE weightage notes.
            </p>

            {/* Interactive MCQ Simulator */}
            <div className={styles.mcqSimulatorBox}>
              <div className={styles.mcqMeta}>
                <span>{DEMO_MCQ.subject}</span>
                <span className={styles.mcqQNum}>{DEMO_MCQ.questionNumber}</span>
              </div>
              <p className={styles.mcqQuestionText}>{DEMO_MCQ.question}</p>

              <div className={styles.mcqOptionsGrid}>
                {DEMO_MCQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.letter;
                  const isAnswered = selectedAnswer !== null;
                  let optStyle = styles.mcqOptionBtn;

                  if (isAnswered) {
                    if (opt.isCorrect) optStyle += ` ${styles.mcqCorrect}`;
                    else if (isSelected) optStyle += ` ${styles.mcqIncorrect}`;
                  }

                  return (
                    <button
                      key={opt.letter}
                      className={optStyle}
                      onClick={() => setSelectedAnswer(opt.letter)}
                      type="button"
                    >
                      <span className={styles.optLetter}>{opt.letter}</span>
                      <span className={styles.optText}>{opt.text}</span>
                      {isAnswered && opt.isCorrect ? (
                        <Check size={14} className="ml-auto text-emerald-400 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer ? (
                <div className={styles.mcqExplanationNote}>
                  <Info size={13} className="shrink-0 text-cyan-300 mt-0.5" />
                  <span>
                    {DEMO_MCQ.options.find((o) => o.letter === selectedAnswer)?.explanation}
                  </span>
                </div>
              ) : (
                <p className={styles.mcqHint}>👆 Click any option above to test yourself!</p>
              )}
            </div>
          </article>

          {/* -------------------------------------------------------------- */}
          {/* SATELLITE MODULE 3: Personalized Study Plan (Bottom Left)      */}
          {/* -------------------------------------------------------------- */}
          <article
            className={`${styles.satelliteCard} ${styles.posStudyPlan} ${activeModule === 'study-plan' ? styles.cardActive : ''}`}
            onMouseEnter={() => setActiveModule('study-plan')}
            onMouseLeave={() => setActiveModule(null)}
          >
            <div className={styles.cardHeader}>
              <span className={`${styles.cardIconBox} ${styles.accentEmerald}`}>
                <CalendarDays size={20} strokeWidth={2} />
              </span>
              <div>
                <span className={styles.cardEyebrow}>FIND YOUR RHYTHM</span>
                <h4 className={styles.cardTitle}>Personalized Study Plan</h4>
              </div>
            </div>

            <p className={styles.cardDesc}>
              Circadian spaced repetition engine calibrating revision before memory decay occurs.
            </p>

            {/* Interactive Day Milestones */}
            <div className={styles.studyScheduleBox}>
              <div className={styles.daysStreakRow}>
                {(['MON', 'TUE', 'WED', 'THU', 'FRI'] as const).map((day) => {
                  const isCurrent = activeDay === day;
                  const isDone = day === 'MON' || day === 'TUE';
                  return (
                    <button
                      key={day}
                      className={`${styles.dayChip} ${isCurrent ? styles.dayChipActive : ''}`}
                      onClick={() => setActiveDay(day)}
                      type="button"
                    >
                      <span className={styles.dayLabel}>{day}</span>
                      <span className={styles.dayStatusIcon}>
                        {isDone ? (
                          <Check size={11} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <Target size={11} className="text-cyan-300" />
                        ) : (
                          <Circle size={8} className="text-slate-600" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.planTelemetryRow}>
                <div className={styles.retentionDial}>
                  <div className={styles.retentionVal}>94.2%</div>
                  <div className={styles.retentionLbl}>Retention Index</div>
                </div>
                <div className={styles.planFocusNote}>
                  <span className="font-semibold text-emerald-300">
                    {activeDay}: Botany Genetics &amp; Optics
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Target: 60 questions · High CEE weightage
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* -------------------------------------------------------------- */}
          {/* SATELLITE MODULE 4: Mock Examination (Bottom Right)            */}
          {/* -------------------------------------------------------------- */}
          <article
            className={`${styles.satelliteCard} ${styles.posExam} ${activeModule === 'examination' ? styles.cardActive : ''}`}
            onMouseEnter={() => setActiveModule('examination')}
            onMouseLeave={() => setActiveModule(null)}
          >
            <div className={styles.cardHeader}>
              <span className={`${styles.cardIconBox} ${styles.accentAmber}`}>
                <ClipboardCheck size={20} strokeWidth={2} />
              </span>
              <div>
                <span className={styles.cardEyebrow}>BUILD EXAM CONFIDENCE</span>
                <h4 className={styles.cardTitle}>Mock Examination</h4>
              </div>
            </div>

            <p className={styles.cardDesc}>
              200-question timed simulation with authentic Nepal CEE negative marking mechanics.
            </p>

            {/* Live Exam Monitor Widget */}
            <div className={styles.liveExamMonitor}>
              <div className={styles.examTimerBar}>
                <div className={styles.examClock}>
                  <Clock3 size={14} className="text-amber-400 animate-spin-slow" />
                  <span className={styles.timeTicker}>{formatTimer(examSeconds)}</span>
                </div>
                <span className={styles.examRemainingBadge}>TIME REMAINING</span>
              </div>

              <div className={styles.examQuestionStats}>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Question 142 of 200</span>
                  <span className="text-amber-400 font-mono font-bold">71% Done</span>
                </div>
                {/* Progress bar track */}
                <div className={styles.examTrack}>
                  <div className={styles.examFill} style={{ width: '71%' }} />
                </div>
              </div>

              <div className={styles.examBottomToolbar}>
                <button
                  className={`${styles.flagBtn} ${isQuestionFlagged ? styles.flaggedActive : ''}`}
                  onClick={() => setIsQuestionFlagged(!isQuestionFlagged)}
                  type="button"
                >
                  <Activity size={12} />
                  <span>{isQuestionFlagged ? 'Flagged for Review' : 'Mark for Review'}</span>
                </button>
                <span className={styles.strictMarkingBadge}>-0.25 Mark / Wrong</span>
              </div>
            </div>
          </article>

          {/* -------------------------------------------------------------- */}
          {/* SATELLITE MODULE 5: Performance Analytics (Bottom Center)      */}
          {/* -------------------------------------------------------------- */}
          <article
            className={`${styles.satelliteCard} ${styles.posAnalytics} ${activeModule === 'analytics' ? styles.cardActive : ''}`}
            onMouseEnter={() => setActiveModule('analytics')}
            onMouseLeave={() => setActiveModule(null)}
          >
            <div className={styles.cardHeader}>
              <span className={`${styles.cardIconBox} ${styles.accentBlue}`}>
                <ChartNoAxesCombined size={20} strokeWidth={2} />
              </span>
              <div>
                <span className={styles.cardEyebrow}>SEE YOUR PROGRESS</span>
                <h4 className={styles.cardTitle}>Performance Analytics</h4>
              </div>
            </div>

            <p className={styles.cardDesc}>
              Granular telemetry dissecting accuracy curves across Physics, Chemistry, and Biology.
            </p>

            {/* Interactive Telemetry Bar Charts */}
            <div className={styles.analyticsTelemetryBox}>
              <div className={styles.barsContainer}>
                {[
                  { subject: 'PHY', score: 84, color: '#38BDF8' },
                  { subject: 'CHEM', score: 91, color: '#A855F7' },
                  { subject: 'BOT', score: 96, color: '#34D399' },
                  { subject: 'ZOO', score: 89, color: '#FBBF24' },
                  { subject: 'MAT', score: 92, color: '#818CF8' },
                ].map((item) => (
                  <div
                    key={item.subject}
                    className={styles.barColumn}
                    onMouseEnter={() => setHoveredSubject(`${item.subject}: ${item.score}%`)}
                    onMouseLeave={() => setHoveredSubject(null)}
                  >
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          height: `${item.score}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className={styles.barLabel}>{item.subject}</span>
                  </div>
                ))}
              </div>

              <div className={styles.analyticsSummary}>
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                  <HeartPulse size={14} />
                  <span>{hoveredSubject ?? 'National Percentile: Top 2.8%'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Based on 1,400+ aspirants
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom Educational / Regulatory Disclaimer */}
        <p className={styles.bottomDisclaimer}>
          <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
          <span>
            CEE Medical Prep intelligence models are tailored strictly to the Nepal Medical
            Education Commission (MEC) syllabus.
          </span>
        </p>
      </div>
    </section>
  );
}
