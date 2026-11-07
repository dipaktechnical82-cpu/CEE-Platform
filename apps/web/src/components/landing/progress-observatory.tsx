'use client';

import {
  ArrowUpRight,
  Atom,
  BrainCircuit,
  Check,
  Dna,
  FlaskConical,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './progress-observatory.module.css';

const score = 68;
const circumference = 2 * Math.PI * 86;

const subjects = [
  { name: 'Physics', value: 72, icon: Atom, tone: 'blue' },
  { name: 'Chemistry', value: 64, icon: FlaskConical, tone: 'mint' },
  { name: 'Biology', value: 86, icon: Dna, tone: 'teal' },
] as const;

const sessions = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 57 },
  { day: 'Wed', value: 53 },
  { day: 'Thu', value: 67 },
  { day: 'Fri', value: 63 },
  { day: 'Sat', value: 76 },
  { day: 'Sun', value: 84 },
] as const;

const studyWeek = [
  { day: 'Mon', minutes: 38 },
  { day: 'Tue', minutes: 54 },
  { day: 'Wed', minutes: 27 },
  { day: 'Thu', minutes: 72 },
  { day: 'Fri', minutes: 48 },
  { day: 'Sat', minutes: 88 },
  { day: 'Sun', minutes: 63 },
] as const;

function SubjectMastery() {
  return (
    <article aria-labelledby="observatory-mastery-title" className={styles.masteryPanel}>
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}>
          <Target aria-hidden="true" size={16} />
        </span>
        <div>
          <p className={styles.panelKicker}>SUBJECT MASTERY</p>
          <h3 id="observatory-mastery-title">Growing strengths</h3>
        </div>
      </div>
      <ul className={styles.masteryList}>
        {subjects.map(({ name, value, icon: Icon, tone }) => (
          <li className={styles.masteryItem} key={name}>
            <div className={styles.masteryMeta}>
              <span>
                <Icon aria-hidden="true" className={styles[tone]} size={14} />
                {name}
              </span>
              <strong>{value}%</strong>
            </div>
            <div
              aria-label={`${name}: illustrative mastery ${value} percent`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={value}
              className={styles.masteryTrack}
              role="progressbar"
            >
              <span
                className={`${styles.masteryFill} ${styles[tone]}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.sampleNote}>Illustrative mastery · sample data</p>
    </article>
  );
}

function PreparationRing() {
  return (
    <div className={styles.ringPanel}>
      <div className={styles.ringOrbit} aria-hidden="true" />
      <svg
        aria-labelledby="preparation-ring-title preparation-ring-description"
        className={styles.progressRing}
        role="img"
        viewBox="0 0 220 220"
      >
        <title id="preparation-ring-title">Illustrative medical preparation progress</title>
        <desc id="preparation-ring-description">
          A sample preparation score of 68 percent. This is illustrative data, not a student result.
        </desc>
        <circle className={styles.ringTrack} cx="110" cy="110" r="86" />
        <circle
          className={styles.ringValue}
          cx="110"
          cy="110"
          r="86"
          style={{ '--ring-offset': `${circumference * (1 - score / 100)}` } as CSSProperties}
        />
      </svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringLabel}>PREPARATION SCORE</span>
        <span className={styles.ringScore}>
          {score}
          <small>%</small>
        </span>
        <span className={styles.ringStatus}>
          <span />
          Building momentum
        </span>
      </div>
      <span className={styles.ringFootnote}>Illustrative sample</span>
      <div className={`${styles.orbitLabel} ${styles.orbitLabelTop}`}>
        <Sparkles aria-hidden="true" size={13} />
        Your journey, in focus
      </div>
      <div className={`${styles.orbitLabel} ${styles.orbitLabelBottom}`}>
        <TrendingUp aria-hidden="true" size={13} />
        Every session adds up
      </div>
    </div>
  );
}

function PerformanceTrend() {
  const points = sessions
    .map(({ value }, index) => `${24 + index * 49},${96 - value * 0.72}`)
    .join(' ');

  return (
    <article aria-labelledby="performance-trend-title" className={styles.trendPanel}>
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}>
          <TrendingUp aria-hidden="true" size={16} />
        </span>
        <div>
          <p className={styles.panelKicker}>STEADY MOMENTUM</p>
          <h3 id="performance-trend-title">Practice-to-practice progress</h3>
        </div>
        <span className={styles.trendBadge}>SAMPLE</span>
      </div>
      <div className={styles.chartWrap}>
        <svg
          aria-labelledby="performance-chart-title performance-chart-description"
          className={styles.chart}
          role="img"
          viewBox="0 0 340 118"
        >
          <title id="performance-chart-title">Illustrative practice performance trend</title>
          <desc id="performance-chart-description">
            Sample scores move from 42 on Monday to 84 on Sunday, with an overall upward trend.
            These values are illustrative, not student results.
          </desc>
          <defs>
            <linearGradient id="observatory-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#51aa9f" stopOpacity=".25" />
              <stop offset="100%" stopColor="#51aa9f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.chartGrid} d="M25 25H325 M25 59H325 M25 93H325" />
          <text className={styles.axisLabel} x="2" y="28">
            100
          </text>
          <text className={styles.axisLabel} x="8" y="62">
            50
          </text>
          <text className={styles.axisLabel} x="13" y="96">
            0
          </text>
          <polygon className={styles.chartArea} points={`25,102 ${points} 318,102`} />
          <polyline className={styles.chartLine} points={points} />
          {sessions.map(({ day, value }, index) => {
            const cx = 24 + index * 49;
            const cy = 96 - value * 0.72;
            return (
              <g key={day}>
                <circle className={styles.chartHalo} cx={cx} cy={cy} r="7" />
                <circle className={styles.chartPoint} cx={cx} cy={cy} r="3" />
                <title>{`${day}: illustrative score ${value}`}</title>
              </g>
            );
          })}
        </svg>
        <div className={styles.chartDays} aria-hidden="true">
          {sessions.map(({ day }) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <p className={styles.chartSummary}>
        Example trend shows a gradual rise across seven practice sessions.
      </p>
    </article>
  );
}

function InsightPanels() {
  return (
    <div className={styles.insightStack}>
      <article aria-labelledby="strengths-title" className={styles.strengthPanel}>
        <div className={styles.panelHeading}>
          <span className={`${styles.panelIcon} ${styles.strengthIcon}`}>
            <Check aria-hidden="true" size={16} />
          </span>
          <div>
            <p className={styles.panelKicker}>BUILD ON IT</p>
            <h3 id="strengths-title">Your strengths</h3>
          </div>
        </div>
        <ul className={styles.topicList}>
          <li>
            <span>Biology</span>
            <strong>Strong foundation</strong>
          </li>
          <li>
            <span>Cell structure</span>
            <strong>Topic to build on</strong>
          </li>
          <li>
            <span>Daily practice</span>
            <strong>Consistent habit</strong>
          </li>
        </ul>
        <p className={styles.sampleNote}>Example insights · sample data</p>
      </article>

      <article aria-labelledby="improve-title" className={styles.improvePanel}>
        <div className={styles.panelHeading}>
          <span className={`${styles.panelIcon} ${styles.improveIcon}`}>
            <Zap aria-hidden="true" size={16} />
          </span>
          <div>
            <p className={styles.panelKicker}>A GOOD NEXT STEP</p>
            <h3 id="improve-title">Room to improve</h3>
          </div>
        </div>
        <ul className={styles.topicList}>
          <li>
            <span>Organic chemistry</span>
            <strong>Review concepts</strong>
          </li>
          <li>
            <span>Physics numericals</span>
            <strong>Try more practice</strong>
          </li>
        </ul>
        <p className={styles.sampleNote}>Example focus areas · not personal results</p>
      </article>
    </div>
  );
}

function StudyConsistency() {
  return (
    <article aria-labelledby="consistency-title" className={styles.consistencyPanel}>
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}>
          <BrainCircuit aria-hidden="true" size={16} />
        </span>
        <div>
          <p className={styles.panelKicker}>SHOWING UP MATTERS</p>
          <h3 id="consistency-title">A week of study rhythm</h3>
        </div>
      </div>
      <ul className={styles.heatmap} aria-label="Illustrative study activity for a sample week">
        {studyWeek.map(({ day, minutes }) => {
          const intensity = Math.ceil(minutes / 25);
          return (
            <li key={day}>
              <span className={styles.heatmapDay}>{day}</span>
              <span
                aria-label={`${day}: illustrative ${minutes} minutes of study`}
                className={`${styles.heatCell} ${styles[`heat${intensity}`]}`}
                role="img"
              />
            </li>
          );
        })}
      </ul>
      <div className={styles.heatmapFooter}>
        <span>Illustrative activity · not student history</span>
        <span className={styles.heatLegend} aria-label="Low to high activity">
          Less <i className={styles.heat1} />
          <i className={styles.heat2} />
          <i className={styles.heat3} />
          <i className={styles.heat4} /> More
        </span>
      </div>
    </article>
  );
}

function ImprovementInsight() {
  return (
    <article aria-labelledby="ai-insight-title" className={styles.aiPanel}>
      <div className={styles.aiOrb} aria-hidden="true">
        <span>
          <BrainCircuit size={25} />
        </span>
        <i />
      </div>
      <div className={styles.aiCopy}>
        <div className={styles.aiEyebrow}>
          <Sparkles aria-hidden="true" size={14} />
          STUDY INSIGHT PREVIEW
        </div>
        <h3 id="ai-insight-title">Your next improvement opportunity</h3>
        <p>
          Spend more time revising Organic Chemistry and practice additional numerical problems in
          Physics.
        </p>
        <span className={styles.aiDisclaimer}>
          Example recommendation · not AI-generated or based on student performance
        </span>
      </div>
      <ArrowUpRight aria-hidden="true" className={styles.aiArrow} size={19} />
    </article>
  );
}

export function ProgressObservatory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="progress-observatory-heading"
      className={styles.section}
      data-visible={hasEntered}
      id="progress-observatory"
      ref={sectionRef}
    >
      <div className={styles.sectionInner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>
            <Sparkles aria-hidden="true" size={15} strokeWidth={1.9} />
            YOUR GROWTH, MADE VISIBLE
          </p>
          <h2 className={styles.heading} id="progress-observatory-heading">
            Every Small Step. A <span>Bigger Achievement.</span>
          </h2>
          <p className={styles.description}>
            Understand your strengths, identify your weak areas, and turn every practice session
            into measurable progress.
          </p>
        </header>

        <div className={styles.observatory} aria-label="Illustrative medical preparation analytics">
          <div className={styles.connectors} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <SubjectMastery />
          <PreparationRing />
          <InsightPanels />
          <p className={styles.observatoryCaption}>
            <span /> GROWTH OBSERVATORY <span /> ALL VALUES ARE ILLUSTRATIVE
          </p>
        </div>

        <div className={styles.supportingGrid}>
          <PerformanceTrend />
          <StudyConsistency />
          <ImprovementInsight />
        </div>
      </div>
    </section>
  );
}
