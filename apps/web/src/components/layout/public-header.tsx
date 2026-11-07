'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  BookOpenText,
  ClipboardCheck,
  Fingerprint,
  HeartPulse,
  House,
  Info,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import styles from './public-header.module.css';

const navItems = [
  { label: 'Home', href: '/', ch: 'CH-01', icon: House },
  { label: 'Features', href: '/features', ch: 'CH-02', icon: Activity },
  { label: 'Question Bank', href: '/question-bank', ch: 'CH-03', icon: BookOpenText },
  { label: 'Mock Tests', href: '/mock-tests', ch: 'CH-04', icon: ClipboardCheck },
  { label: 'About', href: '/about', ch: 'CH-05', icon: Info },
];

/**
 * Authentic High-Tech Medical Equipment Diagnostic Console Navigation Bar.
 * Modeled after clinical surgical patient monitors, ECG vitals stations,
 * and high-energy defibrillator equipment.
 */
export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!mobileOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#02090F]/95 px-2 py-2 sm:px-4 lg:px-6 text-white backdrop-blur-xl"
    >
      <div className={styles.equipmentChassis}>
        {/* ------------------------------------------------------------------ */}
        {/* 1. Top Equipment Diagnostics Strip                                */}
        {/* ------------------------------------------------------------------ */}
        <div className={styles.topDiagnosticsStrip}>
          <div className={styles.stripLeft}>
            <span className={styles.screwHead} />
            <span className={styles.modelBadge}>CEE-MED CORP // APPARATUS X9</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">SURGICAL DIAGNOSTIC CONSOLE</span>
          </div>

          <div className={styles.stripCenter}>
            <span className={styles.telemetryTag}>
              FREQ: <span className={styles.telemetryVal}>140Hz</span>
            </span>
            <span className={styles.telemetryTag}>
              SYS-BUS: <span className={styles.telemetryVal}>NOMINAL</span>
            </span>
            <span className={styles.telemetryTag}>
              NEPAL CEE: <span className={styles.telemetryVal}>SYLLABUS 2026</span>
            </span>
          </div>

          <div className={styles.stripRight}>
            <span className={styles.statusPip} />
            <span className="font-bold text-emerald-400">STATUS: LIVE</span>
            <span className={styles.screwHead} />
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. Main Hardware Console Deck                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className={styles.mainConsoleDeck}>
          {/* Module A: Left Cardio-Telemetry Vitals Monitor */}
          <Link
            aria-label="CEE Medical Prep - Return to Home Dashboard"
            className={styles.vitalsMonitorBay}
            href="/"
          >
            {/* Concentric Milled Port Wheel */}
            <div className={styles.ceePortWheel}>
              <div className={styles.portRingKnurl} />
              <span className={styles.ceePortLogo}>CEE</span>
            </div>

            {/* Embedded Oscilloscope CRT Monitor */}
            <div className={styles.crtScreen}>
              <div className={styles.ecgGrid} />
              {/* Dynamic P-Q-R-S-T Cardiac Cycle Waveform */}
              <svg
                aria-hidden="true"
                className={styles.ecgWaveSvg}
                fill="none"
                viewBox="0 0 260 42"
              >
                {/* Baseline 1 */}
                <path
                  d="M0 21 L30 21 L36 17 L42 25 L48 9 L54 33 L60 21 L75 21 L85 16 L95 21 L130 21 L160 21 L166 17 L172 25 L178 9 L184 33 L190 21 L205 21 L215 16 L225 21 L260 21"
                  filter="drop-shadow(0 0 3px #22D3EE)"
                  stroke="#22D3EE"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            {/* Vitals Telemetry Numbers */}
            <div className={styles.vitalsReadout}>
              <div className={styles.vitalsHeartRate}>
                <HeartPulse className={styles.heartPulseIcon} size={15} />
                <span className={styles.bpmValue}>74</span>
                <span className={styles.bpmLabel}>BPM</span>
              </div>
              <div className={styles.vitalsSubRow}>
                <span>SpO2:</span>
                <span className={styles.vitalsSpO2}>99%</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400">NOM</span>
              </div>
            </div>

            {/* Hardware Sensitivity Rotary Dial */}
            <div className={styles.rotaryDialBay}>
              <div className={styles.knurledKnob}>
                <div className={styles.knobIndicator} />
              </div>
              <div className={styles.dialLabel}>
                <span>GAIN</span>
                <span>1.0x</span>
              </div>
            </div>
          </Link>

          {/* Module B: Center Surgical Console Membrane Navigation Keys */}
          <nav aria-label="Main Navigation Deck" className={styles.membraneNavDeck}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                (item.href === '/' && isHomePage) || (item.href !== '/' && pathname === item.href);

              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={`${styles.membraneKey} ${active ? styles.membraneKeyActive : ''}`}
                  href={item.href}
                  key={item.label}
                >
                  <span className={styles.keyChChannel}>{item.ch}</span>
                  <div className={styles.keyMain}>
                    <Icon className="text-cyan-400" size={13} strokeWidth={2.4} />
                    <span>{item.label}</span>
                  </div>
                  {active ? <span className={styles.keyActiveLed} /> : null}
                </Link>
              );
            })}
          </nav>

          {/* Module C: Right Emergency Action & Biometric Terminal */}
          <div className={styles.actionTerminalDeck}>
            {/* Biometric Security Login Terminal */}
            <Link
              aria-label="Secure Personnel Login"
              className={styles.biometricLoginKey}
              href="/login"
            >
              <Fingerprint className="text-cyan-400" size={18} strokeWidth={2.2} />
              <div className={styles.biometricTextCol}>
                <span>LOGIN</span>
                <span>AUTH KEY</span>
              </div>
            </Link>

            {/* Defibrillator Paddle / Start Preparing Primary Actuator */}
            <Link
              aria-label="Start Preparing for Nepal Medical CEE Examination"
              className={styles.defibrillatorPaddleKey}
              href="/register"
            >
              <Zap className={styles.defibEnergyBolt} size={18} strokeWidth={2.8} />
              <div className={styles.defibTextGroup}>
                <span className={styles.defibMainTitle}>
                  <span className="hidden sm:inline">START PREPARING</span>
                  <span className="inline sm:hidden">PREP</span>
                </span>
                <span className={styles.defibChargeLevel}>
                  <span>READY 360J</span>
                  <span className={styles.chargeMeterBar}>
                    <span className={styles.meterPip} />
                    <span className={styles.meterPip} />
                    <span className={styles.meterPip} />
                    <span className={styles.meterPip} />
                  </span>
                </span>
              </div>
              <ArrowRight className="text-slate-900 ml-0.5" size={15} strokeWidth={3} />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              aria-controls="mobile-primary-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={styles.mobileMenuTrigger}
              onClick={() => setMobileOpen((open) => !open)}
              ref={menuButtonRef}
              type="button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Bottom Hardware Detail: Bioluminescent Fluid Conduit           */}
        {/* ------------------------------------------------------------------ */}
        <div className={styles.conduitBay}>
          <div className={styles.fluidPlasmaStream} />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. Mobile Expandable Equipment Drawer                              */}
        {/* ------------------------------------------------------------------ */}
        {mobileOpen && (
          <nav
            aria-label="Mobile Navigation"
            className={styles.mobileDrawer}
            id="mobile-primary-navigation"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-cyan-400/20 pb-2 text-[10px] font-mono text-cyan-300">
                <span>PORTABLE DIAGNOSTIC TERMINAL</span>
                <span className="text-emerald-400">SYSTEM NOMINAL</span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 transition hover:bg-cyan-500/15 hover:text-cyan-300"
                    href={item.href}
                    key={item.label}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-cyan-400" size={16} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400/70">{item.ch}</span>
                  </Link>
                );
              })}

              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-cyan-400/20 pt-3">
                <Link
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-950/40 text-xs font-bold uppercase tracking-wider text-cyan-200 hover:bg-cyan-900/50"
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                >
                  <Fingerprint size={16} />
                  <span>Login</span>
                </Link>
                <Link
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg"
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                >
                  <Zap size={15} />
                  <span>Start Prep</span>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
