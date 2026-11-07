'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Radio,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './final-cta.module.css';

type BpmMode = 72 | 110 | 140;

export function FinalCtaSection() {
  const [candidateName, setCandidateName] = useState('Aspirant Doctor');
  const [bpm, setBpm] = useState<BpmMode>(72);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<number | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioTimerRef.current) {
        window.clearInterval(audioTimerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio Heartbeat Synthesizer (Lub-Dub sound)
  const toggleHeartbeatAudio = () => {
    if (isPlayingAudio) {
      if (audioTimerRef.current) {
        window.clearInterval(audioTimerRef.current);
        audioTimerRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const playLubDub = () => {
        if (!ctx || ctx.state === 'closed') return;
        const now = ctx.currentTime;

        // "Lub" (S1 - Lower frequency, slightly longer)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(65, now);
        osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);
        gain1.gain.setValueAtTime(0.28, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);

        // "Dub" (S2 - Slightly higher frequency, crisper)
        const dubTime = now + 0.16;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(82, dubTime);
        osc2.frequency.exponentialRampToValueAtTime(45, dubTime + 0.1);
        gain2.gain.setValueAtTime(0.22, dubTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, dubTime + 0.12);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(dubTime);
        osc2.stop(dubTime + 0.13);
      };

      // Play immediately once
      playLubDub();

      // Repeat interval according to active BPM
      const intervalMs = (60 / bpm) * 1000;
      if (audioTimerRef.current) window.clearInterval(audioTimerRef.current);
      audioTimerRef.current = window.setInterval(playLubDub, intervalMs);

      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // Re-adjust audio tempo when BPM changes while playing
  useEffect(() => {
    if (!isPlayingAudio || !audioContextRef.current) return;
    const ctx = audioContextRef.current;

    const playLubDub = () => {
      if (!ctx || ctx.state === 'closed') return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);
      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      const dubTime = now + 0.16;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(82, dubTime);
      osc2.frequency.exponentialRampToValueAtTime(45, dubTime + 0.1);
      gain2.gain.setValueAtTime(0.22, dubTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, dubTime + 0.12);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(dubTime);
      osc2.stop(dubTime + 0.13);
    };

    if (audioTimerRef.current) window.clearInterval(audioTimerRef.current);
    const intervalMs = (60 / bpm) * 1000;
    audioTimerRef.current = window.setInterval(playLubDub, intervalMs);
  }, [bpm, isPlayingAudio]);

  const displayName = candidateName.trim() ? candidateName.trim() : 'Aspirant Doctor';

  return (
    <section aria-labelledby="final-cta-heading" className={styles.section} id="final-cta">
      {/* Ambient background lighting orbs */}
      <div aria-hidden="true" className={styles.ambientOrb1} />
      <div aria-hidden="true" className={styles.ambientOrb2} />

      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* ---------------------------------------------------------------- */}
          {/* Left Column: Vision & Interactive Candidate Badge                */}
          {/* ---------------------------------------------------------------- */}
          <div className={styles.visionWrap}>
            <div className={styles.liveBadgeRow}>
              <div className={styles.liveBeacon}>
                <span className={styles.liveDot} />
                <span>All-Nepal CEE 2026 Batch Induction</span>
              </div>
              <span className={styles.aspirantsActiveCount}>
                <Sparkles size={13} className="text-amber-300" />
                4,850+ Aspirants Active Today
              </span>
            </div>

            <h2 className={styles.mainHeading} id="final-cta-heading">
              Your Dream Doesn&apos;t Have to{' '}
              <span className={styles.headingGradient}>Stay a Dream.</span>
            </h2>

            <p className={styles.narrativeText}>
              One day soon, you will step onto hospital rounds wearing a crisp white coat with a
              stethoscope around your neck, and someone will say:{' '}
              <strong>&ldquo;Good morning, Doctor.&rdquo;</strong> That moment isn&apos;t created on exam
              day — it is forged right now with your very next question.
            </p>

            {/* Interactive Candidate Doctor Badge Console */}
            <div className={`${styles.badgeGeneratorBox} notranslate`} translate="no">
              <div className={styles.badgeBoxHeader}>
                <span className={styles.badgeBoxTitle}>
                  <GraduationCap className="text-emerald-400" size={16} />
                  Your Future Candidate Credential
                </span>
                <span className={styles.badgeLivePill}>Live Preview</span>
              </div>

              <div className={styles.nameInputWrap}>
                <span className={styles.nameInputPrefix}>Dr.</span>
                <input
                  aria-label="Enter your name to preview your doctor ID badge"
                  className={styles.nameInput}
                  maxLength={36}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your name (e.g. Aarav Sharma)"
                  type="text"
                  value={candidateName}
                />
              </div>

              {/* Rendered Doctor ID Credential Card */}
              <div className={styles.doctorBadgeCard}>
                <div className={styles.badgeCardHoloOverlay} />
                <div className={styles.badgeCardTop}>
                  <span className={styles.badgeInstitutionText}>
                    Nepal Medical Education Commission · CEE 2026
                  </span>
                  <div aria-hidden="true" className={styles.badgeSimChip} />
                </div>

                <div className={styles.badgeCardBody}>
                  <div className={styles.badgeAvatarWrap}>
                    <Stethoscope className="text-emerald-300" size={22} />
                  </div>
                  <div className={styles.badgeMeta}>
                    <span className={styles.badgeDoctorName}>{`Dr. ${displayName}`}</span>
                    <span className={styles.badgeRole}>MBBS Candidate · Merit Rank Aspirant</span>
                    <span className={styles.badgeTargetCampuses}>
                      Target: IOM Maharajgunj / BPKIHS Dharan / PAHS
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className={styles.ctaButtonGroup}>
                <Link className={styles.btnPrimaryClaim} href="/register">
                  {`Step Into Your Future as Dr. ${displayName.split(' ')[0]}`}
                  <ArrowRight size={17} />
                </Link>
                <Link className={styles.btnSecondaryExplore} href="/syllabus">
                  <BookOpen size={16} />
                  Explore Full Syllabus
                </Link>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Right Column: Holographic Real Human Heart & Stethoscope         */}
          {/* ---------------------------------------------------------------- */}
          <div className={styles.hologramStage}>
            <div className={styles.hologramPortal}>
              {/* Rotating Holographic Orbital Rings */}
              <div className={styles.orbitalRingOuter} />
              <div className={styles.orbitalRingInner} />

              {/* Floating Orbiting Telemetry Badges */}
              <div className={styles.holoBadgeTopRight}>
                <Stethoscope className="text-teal-300" size={15} />
                <span>Apex Beat · S1/S2 Mitral Focus</span>
              </div>

              <div className={styles.holoBadgeBottomLeft}>
                <Award className="text-amber-300" size={15} />
                <span>Top 1% Merit Target (185+/200)</span>
              </div>

              <div className={styles.holoBadgeBottomRight}>
                <ShieldCheck className="text-emerald-400" size={15} />
                <span>Hippocratic Dedication Protocol</span>
              </div>

              {/* Real Human Anatomical Heart Hologram */}
              <div className={styles.cardiacCoreGlass}>
                <div
                  className={`${styles.anatomicalHeartWrap} ${
                    bpm === 140
                      ? styles.beatPulseFast
                      : bpm === 110
                        ? styles.beatPulseNormal
                        : styles.beatPulseSlow
                  }`}
                >
                  <Image
                    alt="Authentic anatomical human heart hologram with luminous bioluminescent coronaries and aortic arch"
                    className={styles.anatomicalHeartImg}
                    height={380}
                    priority
                    src="/images/anatomical-human-heart.jpg"
                    width={380}
                  />

                  {/* Stethoscope Chestpiece listening to the Apex Beat */}
                  <div aria-hidden="true" className={styles.apexStethoscopeAuscultation}>
                    <span className={styles.apexListeningRing} />
                    <span className={styles.apexListeningDot} />
                  </div>
                </div>

                {/* Stethoscope Binaural Tube & Chestpiece Arc */}
                <svg
                  className={styles.stethoscopeArcSvg}
                  fill="none"
                  viewBox="0 0 320 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 40 C50 190 90 285 160 285 C230 285 270 190 270 40"
                    stroke="rgba(169, 230, 221, 0.45)"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                  />
                  {/* Chestpiece positioned at apex of left ventricle */}
                  <circle
                    cx="135"
                    cy="235"
                    fill="#0a1926"
                    r="15"
                    stroke="#a9e6dd"
                    strokeWidth="2.5"
                  />
                  <circle cx="135" cy="235" fill="#a9e6dd" opacity="0.9" r="6" />
                </svg>
              </div>

              {/* Interactive Telemetry & Audio Controls Bar */}
              <div className={styles.telemetryControlsPanel}>
                <div className={styles.bpmSelectorGroup}>
                  <button
                    className={`${styles.bpmBtn} ${bpm === 72 ? styles.bpmBtnActive : ''}`}
                    onClick={() => setBpm(72)}
                    title="Resting cardiac rhythm"
                    type="button"
                  >
                    72 BPM
                  </button>
                  <button
                    className={`${styles.bpmBtn} ${bpm === 110 ? styles.bpmBtnActive : ''}`}
                    onClick={() => setBpm(110)}
                    title="Active study focus rhythm"
                    type="button"
                  >
                    110 BPM
                  </button>
                  <button
                    className={`${styles.bpmBtn} ${bpm === 140 ? styles.bpmBtnActive : ''}`}
                    onClick={() => setBpm(140)}
                    title="Exam simulation surge rhythm"
                    type="button"
                  >
                    140 BPM
                  </button>
                </div>

                <button
                  className={`${styles.audioToggleBtn} ${isPlayingAudio ? styles.audioToggleBtnActive : ''}`}
                  onClick={toggleHeartbeatAudio}
                  type="button"
                >
                  {isPlayingAudio ? (
                    <>
                      <Volume2 className="text-emerald-300" size={14} />
                      <span>Audio Active</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="text-slate-400" size={14} />
                      <span>Hear Stethoscope</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom Dream Medical Campuses Row                                */}
        {/* ---------------------------------------------------------------- */}
        <div className={styles.institutionBanner}>
          <span className={styles.institutionBannerLabel}>
            Targeting Nepal&apos;s Premier Medical Institutes &amp; Teaching Hospitals
          </span>
          <div className={styles.campusesPillsRow}>
            <span className={styles.campusPill}>
              <Heart className="text-rose-400" size={13} />
              IOM Maharajgunj Medical Campus (TU)
            </span>
            <span className={styles.campusPill}>
              <Activity className="text-emerald-400" size={13} />
              BPKIHS Dharan
            </span>
            <span className={styles.campusPill}>
              <Radio className="text-sky-400" size={13} />
              Patan Academy of Health Sciences (PAHS)
            </span>
            <span className={styles.campusPill}>
              <GraduationCap className="text-indigo-400" size={13} />
              KUSMS Dhulikhel
            </span>
            <span className={styles.campusPill}>
              <ShieldCheck className="text-amber-400" size={13} />
              NAMS Bir Hospital
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
