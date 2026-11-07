import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  ClipboardCheck,
  GraduationCap,
  LibraryBig,
  Play,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import styles from './journey-begins.module.css';

const journeySteps = [
  { label: 'Learn', icon: BookOpen },
  { label: 'Practice', icon: ClipboardCheck },
  { label: 'Improve', icon: Activity },
  { label: 'Achieve', icon: GraduationCap },
];

const learningTools = [
  { label: 'AI Learning Assistant', icon: Bot, position: 'assistant' },
  { label: 'Mock Tests', icon: ClipboardCheck, position: 'tests' },
  { label: 'Smart Question Bank', icon: LibraryBig, position: 'questions' },
  { label: 'Performance Analytics', icon: ChartNoAxesCombined, position: 'analytics' },
] as const;

const trustPoints = [
  { label: "Nepal's Premier Medical Prep Platform", icon: Stethoscope },
  { label: 'Powered by AI for Better Learning', icon: Sparkles },
  { label: 'Trusted by Aspiring Doctors', icon: GraduationCap },
];

export function JourneyBegins() {
  return (
    <section
      aria-labelledby="journey-begins-heading"
      className={styles.section}
      id="journey-begins"
    >
      <div className={styles.backdrop}>
        <Image
          alt="A medical student follows a glowing study path toward a medical college, with an open book and digital learning tools."
          className={styles.backgroundImage}
          fill
          sizes="100vw"
          src="/images/journey-to-medical-school.png"
        />
      </div>
      <div aria-hidden="true" className={styles.imageWash} />

      <div className={styles.frame}>
        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <Activity aria-hidden="true" size={16} strokeWidth={2.2} />
              FROM ASPIRATION TO WHITE COAT
            </p>

            <h2 className={styles.heading} id="journey-begins-heading">
              Your Medical Dream Deserves a{' '}
              <span className={styles.headingAccent}>Smarter Journey.</span>
            </h2>

            <p className={styles.description}>
              Everything you need to prepare, practice, improve, and move closer to your dream of
              becoming a doctor.
            </p>

            <ol aria-label="Your preparation journey" className={styles.steps}>
              {journeySteps.map(({ label, icon: Icon }, index) => (
                <li className={styles.step} key={label}>
                  <span className={styles.stepIcon}>
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                  </span>
                  <span className={styles.stepLabel}>{label}</span>
                  {index < journeySteps.length - 1 && (
                    <span aria-hidden="true" className={styles.stepConnector} />
                  )}
                </li>
              ))}
            </ol>

            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/register">
                Start Your Preparation
                <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
              </Link>
              <a
                className={styles.secondaryAction}
                href="/Media/home.mp4"
                rel="noreferrer"
                target="_blank"
              >
                <span className={styles.playIcon}>
                  <Play aria-hidden="true" fill="currentColor" size={12} />
                </span>
                Watch Video
              </a>
            </div>
          </div>

          <div className={styles.stage}>
            <ul aria-label="Learning tools" className={styles.toolPanels}>
              {learningTools.map(({ label, icon: Icon, position }) => (
                <li className={`${styles.toolPanel} ${styles[position]}`} key={label}>
                  <span className={styles.toolIcon}>
                    <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                  </span>
                  <span className={styles.toolLabel}>{label}</span>
                  <span aria-hidden="true" className={styles.panelSignal} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul aria-label="About the platform" className={styles.trustStrip}>
          {trustPoints.map(({ label, icon: Icon }) => (
            <li className={styles.trustPoint} key={label}>
              <Icon aria-hidden="true" className={styles.trustIcon} size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </li>
          ))}
          <li className={styles.joinPoint}>
            <Link className={styles.joinLink} href="/register">
              Join Future Doctors
              <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
