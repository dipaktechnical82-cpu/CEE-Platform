import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  ClipboardCheck,
  GraduationCap,
  HeartPulse,
  LockKeyhole,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

interface AuthShellProps {
  children: ReactNode;
  mode?: 'login' | 'register' | 'recovery';
}

const highlights = [
  { label: 'Structured study plans', icon: BookOpenText },
  { label: 'Real exam practice', icon: ClipboardCheck },
  { label: 'AI-powered learning', icon: Sparkles },
  { label: 'Track your progress', icon: Activity },
];

export function AuthShell({ children, mode = 'login' }: AuthShellProps) {
  const isRegister = mode === 'register';

  return (
    <main id="main-content" tabIndex={-1} className={`auth-page auth-page--${mode}`}>
      <section className="auth-visual" aria-label="CEE Medical Prep">
        <header className="auth-visual__topbar">
          <Link href="/" className="auth-brand" aria-label="CEE Medical Prep home">
            <span className="auth-brand__mark">
              <Stethoscope size={21} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="auth-brand__name">
              CEE <span>Medical Prep</span>
            </span>
          </Link>
          <span className="auth-visual__edition">
            <span className="auth-status-dot" />
            MADE FOR NEPAL&apos;S CEE
          </span>
        </header>

        <div className="auth-visual__content">
          <p className="auth-kicker">
            <span /> YOUR NEXT CHAPTER IN MEDICINE
          </p>
          <h1>Your Journey to Medical School Starts Here.</h1>
          <p className="auth-visual__description">
            Thoughtful preparation for Nepal&apos;s medical entrance exam. Build confidence,
            strengthen your understanding, and keep moving forward.
          </p>
          <ul className="auth-highlights" aria-label="Preparation features">
            {highlights.map(({ label, icon: Icon }) => (
              <li key={label}>
                <span className="auth-highlights__icon">
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-visual__floating" aria-hidden="true">
          <span className="auth-visual__float auth-visual__float--study">
            <GraduationCap size={22} strokeWidth={1.7} />
          </span>
          <span className="auth-visual__float auth-visual__float--health">
            <HeartPulse size={21} strokeWidth={1.7} />
          </span>
          <span className="auth-visual__float auth-visual__float--book">
            <BookOpenText size={19} strokeWidth={1.7} />
          </span>
        </div>

        <footer className="auth-visual__footer">
          <span>PREPARE WITH PURPOSE</span>
          <span>YOUR FUTURE IN HEALTHCARE STARTS HERE</span>
        </footer>
      </section>

      <section className="auth-stage" aria-label="Account access">
        <div className="auth-stage__topline">
          <span className="auth-secure-label">
            <LockKeyhole size={14} strokeWidth={1.8} aria-hidden="true" />
            SECURE STUDENT ACCESS
          </span>
          <Link href="/" className="auth-home-link">
            Back to home <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="auth-panel">
          <nav className="auth-tabs" aria-label="Account options">
            <Link
              href="/login"
              className={`auth-tabs__tab${!isRegister ? ' is-active' : ''}`}
              aria-current={!isRegister ? 'page' : undefined}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className={`auth-tabs__tab${isRegister ? ' is-active' : ''}`}
              aria-current={isRegister ? 'page' : undefined}
            >
              Sign Up
            </Link>
            <span
              className={`auth-tabs__indicator${isRegister ? ' auth-tabs__indicator--right' : ''}`}
              aria-hidden="true"
            />
          </nav>
          <div className="auth-panel__content">{children}</div>
        </div>
        <p className="auth-stage__note">Your progress, protected. Your next step, within reach.</p>
      </section>
    </main>
  );
}
