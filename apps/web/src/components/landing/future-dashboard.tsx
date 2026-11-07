'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  Flame,
  Gamepad2,
  GraduationCap,
  Moon,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './future-dashboard.module.css';

/**
 * Animated ECG Pulse Line.
 */
function EcgPulseLine({ className = '', strokeColor = '#A9E6DD' }: { className?: string; strokeColor?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" height="14" viewBox="0 0 70 14" width="70">
      <path
        d="M 0 7 L 18 7 L 22 2 L 26 12 L 30 5 L 34 8 L 38 7 L 70 7"
        stroke={strokeColor}
        strokeDasharray="100"
        strokeDashoffset="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.9"
        strokeWidth="1.8"
      >
        <animate attributeName="stroke-dashoffset" dur="2.8s" from="100" repeatCount="indefinite" to="0" />
      </path>
    </svg>
  );
}

/**
 * Responsive Mini SVG Sparkline.
 */
function MiniSparkline({
  points,
  color,
  id,
  height = 28,
}: {
  points: number[];
  color: string;
  id: string;
  height?: number;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 120;
  const paddingY = 3;
  const usableHeight = height - paddingY * 2;

  const coordinates = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const p0 = coordinates[i];
    const p1 = coordinates[i + 1];
    const cx = (p0.x + p1.x) / 2;
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg aria-hidden="true" className={styles.kpiSparkline} preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

/**
 * DNA Molecule Backdrop Graphic.
 */
function MolecularBackdrop() {
  return (
    <svg aria-hidden="true" className={styles.molecularBackdrop} fill="none" viewBox="0 0 500 540">
      <path d="M280 26c-152 57-152 130 0 187s152 130 0 187-152 81 0 114" />
      <path d="M280 26c152 57 152 130 0 187s-152 130 0 187 152 81 0 114" />
      <path d="M179 65h202M138 113h284M137 160h285M179 207h202M179 253h202M137 300h285M138 347h284M179 394h202M180 441h200M218 488h124" />
      <circle cx="280" cy="26" r="5" />
      <circle cx="280" cy="213" r="5" />
      <circle cx="280" cy="400" r="5" />
      <circle cx="280" cy="514" r="5" />
      <circle cx="138" cy="113" r="3" />
      <circle cx="422" cy="347" r="3" />
    </svg>
  );
}

export function FutureDashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="future-dashboard-heading"
      className={styles.section}
      data-visible={hasEntered}
      id="future-dashboard"
      ref={sectionRef}
    >
      {/* Ambient background lighting */}
      <div aria-hidden="true" className={styles.ambientOrb1} />
      <div aria-hidden="true" className={styles.ambientOrb2} />

      <div className={styles.sectionInner}>
        <div className={styles.experienceLayout}>
          {/* ---------------------------------------------------------------- */}
          {/* Left Hero & Pitch                                                */}
          {/* ---------------------------------------------------------------- */}
          <div className={styles.intro}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLiveDot} />
              <span>Personal Learning Space</span>
            </div>

            <h2 className={styles.heading} id="future-dashboard-heading">
              Your Entire Medical Preparation.{' '}
              <span className={styles.headingHighlight}>One Intelligent Dashboard.</span>
            </h2>

            <p className={styles.description}>
              Track real-time progress, diagnose weaknesses with AI insights, and stay disciplined every day with a
              high-yield mission control engineered specifically for Nepal&apos;s Medical CEE.
            </p>

            {/* Feature tags */}
            <div className={styles.featureGrid}>
              <span className={styles.featureTag}>
                <CheckCircle2 size={14} /> 200-Q Timed Simulations
              </span>
              <span className={styles.featureTag}>
                <CheckCircle2 size={14} /> AI Weakness Diagnosis
              </span>
              <span className={styles.featureTag}>
                <CheckCircle2 size={14} /> All-Nepal Merit Benchmarks
              </span>
              <span className={styles.featureTag}>
                <CheckCircle2 size={14} /> Spaced Memory Engine
              </span>
            </div>

            {/* CTA action & Aspirant community proof */}
            <div className={styles.ctaWrap}>
              <div className={styles.ctaActionGroup}>
                <Link className={styles.cta} href="/register">
                  Explore Your Learning Space
                  <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </div>

              <div className={styles.aspirantProof}>
                <div className={styles.avatarGroup}>
                  <span className={styles.avatarMini}>Dr</span>
                  <span className={styles.avatarMini}>MB</span>
                  <span className={styles.avatarMini}>CE</span>
                  <span className={styles.avatarMini}>+</span>
                </div>
                <p className={styles.proofText}>
                  <strong>4,800+ Aspirants</strong> preparing for Nepal CEE 2026
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Right Showcase: Interactive Mission Control Console              */}
          {/* ---------------------------------------------------------------- */}
          <div className={styles.dashboardStage} data-preview-theme={previewTheme}>
            <MolecularBackdrop />

            {/* Orbiting Floating Badge 1 (Top Right) */}
            <div
              className={styles.orbitBadgeTop}
              style={{
                background:
                  previewTheme === 'dark'
                    ? 'rgba(16, 26, 60, 0.88)'
                    : 'rgba(255, 255, 255, 0.92)',
                border:
                  previewTheme === 'dark'
                    ? '1px solid rgba(115, 103, 240, 0.35)'
                    : '1px solid #d5f3e8',
                color: previewTheme === 'dark' ? '#f5fbfa' : '#244a50',
              }}
            >
              <Flame className="text-amber-400" size={16} />
              <span>12 Day Streak · Protocol Active</span>
            </div>

            {/* Orbiting Floating Badge 2 (Bottom Left) */}
            <div
              className={styles.orbitBadgeBottom}
              style={{
                background:
                  previewTheme === 'dark'
                    ? 'rgba(16, 26, 60, 0.88)'
                    : 'rgba(255, 255, 255, 0.92)',
                border:
                  previewTheme === 'dark'
                    ? '1px solid rgba(169, 230, 221, 0.35)'
                    : '1px solid #a9e6dd',
                color: previewTheme === 'dark' ? '#a9e6dd' : '#244a50',
              }}
            >
              <Trophy size={15} />
              <span>Top 2.4% Percentile Rank</span>
            </div>

            {/* Main Interactive Console */}
            <div className={styles.dashboardFrame}>
              <div className={styles.consoleContainer}>
                {/* 1. Window Header Bar with Live Theme Switcher */}
                <header className={styles.consoleHeader}>
                  <div className={styles.windowControls}>
                    <span className={`${styles.windowDot} ${styles.dotRed}`} />
                    <span className={`${styles.windowDot} ${styles.dotYellow}`} />
                    <span className={`${styles.windowDot} ${styles.dotGreen}`} />
                    <div className={styles.brandPill}>
                      <GraduationCap size={15} />
                      <span>CEE Mission Control</span>
                    </div>
                  </div>

                  {/* Dual Theme Switcher interactive buttons */}
                  <div aria-label="Preview theme switcher" className={styles.themeToggleGroup} role="group">
                    <button
                      className={`${styles.themeBtn} ${
                        previewTheme === 'dark' ? styles.themeBtnActive : styles.themeBtnInactive
                      }`}
                      onClick={() => setPreviewTheme('dark')}
                      type="button"
                    >
                      <Moon size={11} /> Dark
                    </button>
                    <button
                      className={`${styles.themeBtn} ${
                        previewTheme === 'light' ? styles.themeBtnActive : styles.themeBtnInactive
                      }`}
                      onClick={() => setPreviewTheme('light')}
                      type="button"
                    >
                      <Sun size={11} /> Light
                    </button>
                  </div>
                </header>

                {/* 2. Console Body Content */}
                <div className={styles.consoleBody}>
                  {/* Future Doctor Journey Banner */}
                  <div className={styles.previewHero}>
                    <div className={styles.heroTopRow}>
                      <span className={styles.journeyPill}>
                        <Activity className="animate-pulse" size={13} />
                        <span>Medical Journey</span>
                        <EcgPulseLine
                          className={styles.ecgSvg}
                          strokeColor={previewTheme === 'dark' ? '#A9E6DD' : '#244A50'}
                        />
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: previewTheme === 'dark' ? '#B8DFF4' : '#244A50',
                        }}
                      >
                        Target: 90%+ Merit
                      </span>
                    </div>

                    <div className={styles.heroContentSplit}>
                      <div>
                        <h3 className={styles.heroTitle}>
                          Your Journey to Becoming a{' '}
                          <span
                            style={{
                              background:
                                previewTheme === 'dark'
                                  ? 'linear-gradient(90deg, #B8DFF4, #A9E6DD)'
                                  : 'linear-gradient(90deg, #1b635c, #2a76a8)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            Doctor
                          </span>
                        </h3>
                        <p className={styles.heroSubtitle}>
                          Master high-yield concepts, practice timed MCQs, and achieve your top rank.
                        </p>
                      </div>

                      {/* Circular Progress Gauge */}
                      <div className={styles.circularMeterWrap}>
                        <div className={styles.circularMeter}>
                          <svg className="w-full h-full" viewBox="0 0 80 80">
                            <defs>
                              <linearGradient id="landing-progress-gradient-dark" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="#7367F0" />
                                <stop offset="50%" stopColor="#B8DFF4" />
                                <stop offset="100%" stopColor="#A9E6DD" />
                              </linearGradient>
                              <linearGradient id="landing-progress-gradient-light" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="#244A50" />
                                <stop offset="100%" stopColor="#1CB59E" />
                              </linearGradient>
                            </defs>
                            <circle className={styles.meterCircleBg} cx="40" cy="40" r="34" />
                            <circle className={styles.meterCircleFill} cx="40" cy="40" r="34" />
                          </svg>
                          <div className={styles.meterTextOverlay}>
                            <span className={styles.meterPercent}>74%</span>
                            <span className={styles.meterLabel}>Ready</span>
                          </div>
                        </div>

                        <div className={styles.meterStats}>
                          <span className={styles.meterStatMain}>68 / 200</span>
                          <span className={styles.meterStatSub}>Topics Mastered</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 KPI Cards with Real SVG Sparklines */}
                  <div className={styles.kpiRow}>
                    {/* Card 1: Study Time (Sky Blue) */}
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>Study Time</span>
                        <span
                          className={styles.kpiIcon}
                          style={{
                            background:
                              previewTheme === 'dark'
                                ? 'rgba(184, 223, 244, 0.15)'
                                : '#e8f6fc',
                            color: previewTheme === 'dark' ? '#b8dff4' : '#1e5f80',
                          }}
                        >
                          <Clock3 size={14} />
                        </span>
                      </div>
                      <p className={styles.kpiValue}>24h 15m</p>
                      <div className={styles.kpiTrendLine}>
                        <span style={{ color: '#10b981' }}>↑ +4.2h this week</span>
                        <span style={{ opacity: 0.6 }}>30-day</span>
                      </div>
                      <MiniSparkline
                        color={previewTheme === 'dark' ? '#B8DFF4' : '#38BDF8'}
                        id="kpi-study-spark"
                        points={[14, 22, 19, 32, 28, 45, 52, 60]}
                      />
                    </div>

                    {/* Card 2: Questions Attempted (Aqua Mint) */}
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>Questions</span>
                        <span
                          className={styles.kpiIcon}
                          style={{
                            background:
                              previewTheme === 'dark'
                                ? 'rgba(169, 230, 221, 0.15)'
                                : '#d5f3e8',
                            color: previewTheme === 'dark' ? '#a9e6dd' : '#1b6156',
                          }}
                        >
                          <Target size={14} />
                        </span>
                      </div>
                      <p className={styles.kpiValue}>1,420</p>
                      <div className={styles.kpiTrendLine}>
                        <span style={{ color: '#10b981' }}>↑ +185 this week</span>
                        <span style={{ opacity: 0.6 }}>Adaptive</span>
                      </div>
                      <MiniSparkline
                        color={previewTheme === 'dark' ? '#A9E6DD' : '#22C55E'}
                        id="kpi-mcq-spark"
                        points={[120, 240, 390, 580, 790, 1120, 1420]}
                      />
                    </div>

                    {/* Card 3: All-Nepal Rank (Muted Violet / Deep Teal) */}
                    <div className={styles.kpiCard}>
                      <div className={styles.kpiTop}>
                        <span className={styles.kpiLabel}>Current Rank</span>
                        <span
                          className={styles.kpiIcon}
                          style={{
                            background:
                              previewTheme === 'dark'
                                ? 'rgba(115, 103, 240, 0.15)'
                                : '#ede9fe',
                            color: previewTheme === 'dark' ? '#a59df5' : '#5b52d6',
                          }}
                        >
                          <Trophy size={14} />
                        </span>
                      </div>
                      <p className={styles.kpiValue}>#12</p>
                      <div className={styles.kpiTrendLine}>
                        <span style={{ color: '#10b981' }}>↑ Top 2.4%</span>
                        <span style={{ opacity: 0.6 }}>Nepal CEE</span>
                      </div>
                      <MiniSparkline
                        color={previewTheme === 'dark' ? '#7367F0' : '#8B5CF6'}
                        id="kpi-rank-spark"
                        points={[45, 38, 30, 24, 18, 15, 12]}
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Quick Actions + AI Smart Prep Card */}
                  <div className={styles.bottomRow}>
                    {/* Quick Actions Panel */}
                    <div className={styles.actionsCard}>
                      <div className={styles.subCardHeader}>
                        <span className={styles.subCardTitle}>
                          <Zap size={13} className="text-amber-400" /> Daily Quick Actions
                        </span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>6 Shortcuts</span>
                      </div>

                      <div className={styles.actionsMiniGrid}>
                        <div className={styles.actionTile}>
                          <span
                            className={styles.actionTileIcon}
                            style={{
                              background:
                                previewTheme === 'dark'
                                  ? 'rgba(115, 103, 240, 0.15)'
                                  : 'rgba(115, 103, 240, 0.1)',
                              color: previewTheme === 'dark' ? '#a59df5' : '#5b52d6',
                            }}
                          >
                            <GraduationCap size={13} />
                          </span>
                          <span>Mock Exam</span>
                        </div>

                        <div className={styles.actionTile}>
                          <span
                            className={styles.actionTileIcon}
                            style={{
                              background:
                                previewTheme === 'dark'
                                  ? 'rgba(184, 223, 244, 0.15)'
                                  : 'rgba(184, 223, 244, 0.3)',
                              color: previewTheme === 'dark' ? '#b8dff4' : '#1e5f80',
                            }}
                          >
                            <Target size={13} />
                          </span>
                          <span>Practice MCQs</span>
                        </div>

                        <div className={styles.actionTile}>
                          <span
                            className={styles.actionTileIcon}
                            style={{
                              background:
                                previewTheme === 'dark'
                                  ? 'rgba(169, 230, 221, 0.15)'
                                  : 'rgba(169, 230, 221, 0.3)',
                              color: previewTheme === 'dark' ? '#a9e6dd' : '#1b6156',
                            }}
                          >
                            <BookOpen size={13} />
                          </span>
                          <span>View Notes</span>
                        </div>

                        <div className={styles.actionTile}>
                          <span
                            className={styles.actionTileIcon}
                            style={{
                              background:
                                previewTheme === 'dark'
                                  ? 'rgba(136, 194, 238, 0.15)'
                                  : 'rgba(184, 223, 244, 0.25)',
                              color: previewTheme === 'dark' ? '#9dd1f5' : '#1b5784',
                            }}
                          >
                            <Gamepad2 size={13} />
                          </span>
                          <span>Arena Battle</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Smart Companion Preview */}
                    <div className={styles.aiPreviewCard}>
                      <div className={styles.subCardHeader}>
                        <span className={styles.aiHeaderPill}>
                          <Sparkles size={11} /> AI Insights
                        </span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>Adaptive Model</span>
                      </div>

                      <div className={styles.aiBody}>
                        <div className={styles.aiAvatarMini}>
                          <Bot size={17} />
                        </div>
                        <div>
                          <h4 className={styles.aiHeading}>Spaced Revision Engine</h4>
                          <p className={styles.aiRecommendation}>
                            Organic Chemistry reaction kinetics queued for high-retention review.
                          </p>
                        </div>
                      </div>

                      <div className={styles.aiBadgeRow}>
                        <span className={styles.aiBadge}>
                          <CheckCircle2 size={10} /> Misconception Radar
                        </span>
                        <span className={styles.aiBadge}>
                          <CheckCircle2 size={10} /> CEE Yield Predictor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Console Footer Telemetry Bar */}
                <footer className={styles.consoleFooter}>
                  <span>● Live Aspirant Telemetry · Kathmandu 2026 Batch</span>
                  <span>CEE Medical Prep · Nepal</span>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
