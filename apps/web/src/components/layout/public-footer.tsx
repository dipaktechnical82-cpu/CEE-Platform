import Link from 'next/link';
import { Container } from '../ui/container';
import styles from './public-footer.module.css';

const navigationGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Features', href: '/#intelligence-hub' },
      { label: 'Student Dashboard', href: '/dashboard' },
      { label: 'Mock Examinations', href: '/#exam-arena' },
    ],
  },
  {
    title: 'Learning',
    links: [
      { label: 'Study Materials', href: '/syllabus' },
      { label: 'Practice Tests', href: '/#exam-arena' },
      { label: 'AI Learning Assistant', href: '/#intelligence-hub' },
      { label: 'Performance Analytics', href: '/#progress-observatory' },
    ],
  },
  {
    title: 'Student Access',
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
      { label: 'Recover Account', href: '/auth/forgot-password' },
    ],
  },
] as const;

function BrandMark() {
  return (
    <svg aria-hidden="true" className={styles.brandMark} fill="none" viewBox="0 0 64 64">
      <defs>
        <radialGradient
          id="footer-logo-diaphragm"
          cx="32"
          cy="32"
          r="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d7fff7" />
          <stop offset=".5" stopColor="#70d4c8" />
          <stop offset="1" stopColor="#061c23" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="#041a20" stroke="#77d9ca" strokeWidth="1.5" />
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="url(#footer-logo-diaphragm)"
        stroke="#d0fff4"
        strokeOpacity=".72"
      />
      <circle cx="32" cy="32" r="19" stroke="#d9fff8" strokeOpacity=".5" />
      <circle cx="32" cy="32" r="16" stroke="#d9fff8" strokeOpacity=".32" />
      <path d="M20 21a16 16 0 0 1 18-5" stroke="white" strokeLinecap="round" strokeOpacity=".82" />
      <circle cx="32" cy="32" r="2" fill="#eafffb" />
      <path
        d="M18 32c0 8 6 14 14 14s14-6 14-14"
        stroke="#d9fff8"
        strokeLinecap="round"
        strokeOpacity=".42"
      />
      <text
        x="32"
        y="35"
        fill="#f1fffb"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fontWeight="800"
        letterSpacing=".4"
        textAnchor="middle"
        style={{ filter: 'drop-shadow(0 0 4px rgba(169,230,221,0.9))' }}
      >
        CEE
      </text>
    </svg>
  );
}

function MedicalSignal() {
  return (
    <svg
      aria-hidden="true"
      className={styles.medicalSignal}
      fill="none"
      viewBox="0 0 600 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="footer-heart-glass" x1="180" x2="420" y1="30" y2="230">
          <stop stopColor="#d8fff4" stopOpacity=".84" />
          <stop offset=".52" stopColor="#73d9d4" stopOpacity=".54" />
          <stop offset="1" stopColor="#73b9e8" stopOpacity=".68" />
        </linearGradient>
        <radialGradient
          id="footer-heart-light"
          cx="250"
          cy="64"
          r="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".54" />
          <stop offset="1" stopColor="#c1fff2" stopOpacity="0" />
        </radialGradient>
        <filter id="footer-heart-blur" width="1.8" height="1.8" x="-.4" y="-.4">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <ellipse cx="300" cy="130" rx="228" ry="97" stroke="#a9e6dd" strokeOpacity=".16" />
      <ellipse
        cx="300"
        cy="130"
        rx="184"
        ry="78"
        stroke="#b8dff4"
        strokeDasharray="2 9"
        strokeOpacity=".3"
      />
      <circle cx="300" cy="130" r="118" stroke="#d5f3e8" strokeOpacity=".12" />

      <path
        d="M300 176c-5 0-10-4-16-11-15-17-32-37-35-57-3-18 6-31 20-34 12-3 23 3 32 14 8-12 19-19 31-17 16 2 25 16 22 34-3 20-20 42-39 63-5 6-9 11-15 8Z"
        fill="#a9e6dd"
        filter="url(#footer-heart-blur)"
        opacity=".35"
      />
      <g
        stroke="#c8fff3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity=".7"
        strokeWidth="5"
      >
        <path d="M284 70 282 51c-1-10 4-16 10-16s9 6 9 14v20" />
        <path d="m306 70 7-20c3-8 8-11 13-9 6 2 7 9 3 16l-8 17" />
      </g>
      <path
        d="M300 185c-5 0-10-4-16-11-18-20-35-40-38-60-3-18 6-31 20-34 12-3 23 3 32 14 8-12 19-19 31-17 16 2 25 16 22 34-3 20-20 42-39 63-5 6-9 11-12 11Z"
        fill="url(#footer-heart-glass)"
        stroke="#bafff0"
        strokeOpacity=".88"
        strokeWidth="1.8"
      />
      <path
        d="M300 185c-5 0-10-4-16-11-18-20-35-40-38-60-3-18 6-31 20-34 12-3 23 3 32 14 8-12 19-19 31-17 16 2 25 16 22 34-3 20-20 42-39 63-5 6-9 11-12 11Z"
        fill="url(#footer-heart-light)"
      />
      <path
        d="M0 142h110l19-15 14 28 20-47 20 34h66l15-14 16 28 18-51 18 37h30l14-12 15 20 17-28 17 20h161"
        stroke="#a9e6dd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity=".74"
        strokeWidth="1.6"
      />
      <circle cx="76" cy="142" r="3" fill="#d5f3e8" />
      <circle cx="522" cy="142" r="3" fill="#b8dff4" />
      <circle cx="106" cy="62" r="3" fill="#a9e6dd" />
      <circle cx="484" cy="205" r="2.5" fill="#b8dff4" />
    </svg>
  );
}

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div aria-hidden="true" className={styles.ambient} />
      <Container className={styles.container}>
        <div className={styles.intro}>
          <div className={styles.brand}>
            <Link aria-label="CEE Medical Prep home" className={styles.brandLockup} href="/">
              <BrandMark />
              <span className={styles.brandName}>CEE MEDICAL PREP</span>
            </Link>
            <p className={styles.description}>
              Empowering Nepal&apos;s future medical professionals through intelligent learning,
              meaningful practice and smarter preparation.
            </p>
          </div>
          <div className={styles.signalWrap}>
            <MedicalSignal />
          </div>
        </div>

        <div className={styles.navigation}>
          <p className={styles.navigationLabel}>Explore the platform</p>
          <nav aria-label="Footer navigation" className={styles.navigationGroups}>
            {navigationGroups.map((group) => (
              <div className={styles.navigationGroup} key={group.title}>
                <h2 className={styles.groupTitle}>{group.title}</h2>
                <ul className={styles.linkList}>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link className={styles.footerLink} href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.brandStatement}>
          <span aria-hidden="true" className={styles.statementRule} />
          <p>
            YOUR JOURNEY TO MEDICINE.
            <span> POWERED BY INTELLIGENCE.</span>
          </p>
          <span aria-hidden="true" className={styles.statementRule} />
        </div>

        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} CEE Medical Prep. All rights reserved.</p>
          <Link className={styles.homeLink} href="/">
            Back to Home
          </Link>
        </div>
      </Container>
    </footer>
  );
}
