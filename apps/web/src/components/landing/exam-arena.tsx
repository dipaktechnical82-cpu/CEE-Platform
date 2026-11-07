'use client';

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Dna,
  FlaskConical,
  Flag,
  GraduationCap,
  Info,
  Layers,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { CEE_EXAM_CONSTANTS } from '@cee/contracts';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateExamResult,
  CEE_OFFICIAL_SYLLABUS,
  DEMO_DURATION_SECONDS,
  demoQuestions,
  formatTime,
  type ExamSubject,
} from './exam-arena-demo';
import styles from './exam-arena.module.css';

const subjectIcons = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
  MAT: BrainCircuit,
} satisfies Record<ExamSubject, typeof Atom>;

type ExamStatus = 'ready' | 'running' | 'submitted';
type ActiveView = 'simulator' | 'blueprint';

export function ExamArena() {
  const [activeView, setActiveView] = useState<ActiveView>('simulator');
  const [status, setStatus] = useState<ExamStatus>('ready');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(() => new Set());
  const [secondsLeft, setSecondsLeft] = useState(DEMO_DURATION_SECONDS);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const currentQuestion = demoQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = demoQuestions.length - answeredCount;
  const result = useMemo(() => calculateExamResult(answers), [answers]);

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

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === 'running' && secondsLeft === 0) {
      setStatus('submitted');
      setIsConfirmOpen(false);
    }
  }, [secondsLeft, status]);

  useEffect(() => {
    if (!isConfirmOpen && !isRulesOpen) {
      return;
    }

    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsConfirmOpen(false);
        setIsRulesOpen(false);
        submitButtonRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        const buttons =
          dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if (!buttons?.length) {
          return;
        }

        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isConfirmOpen, isRulesOpen]);

  function startExam() {
    setSecondsLeft(DEMO_DURATION_SECONDS);
    setStatus('running');
  }

  function toggleMarkedQuestion() {
    setMarkedQuestions((marked) => {
      const next = new Set(marked);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  }

  function chooseAnswer(optionIndex: number) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: optionIndex }));
  }

  function closeConfirmation() {
    setIsConfirmOpen(false);
    submitButtonRef.current?.focus();
  }

  function confirmSubmission() {
    setIsConfirmOpen(false);
    setStatus('submitted');
    setIsSolutionsOpen(true);
  }

  function tryAgain() {
    setCurrentIndex(0);
    setAnswers({});
    setMarkedQuestions(new Set());
    setSecondsLeft(DEMO_DURATION_SECONDS);
    setIsConfirmOpen(false);
    setIsSolutionsOpen(false);
    setStatus('ready');
  }

  return (
    <section
      aria-labelledby="exam-arena-heading"
      className={styles.section}
      data-visible={hasEntered}
      id="exam-arena"
      ref={sectionRef}
    >
      <div className={styles.sectionInner}>
        {/* Intro Heading */}
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <ShieldCheck aria-hidden="true" size={16} />
            OFFICIAL MEC COMPUTER-BASED TESTING PROTOCOL
          </p>
          <h2 className={styles.heading} id="exam-arena-heading">
            Practice Like It&apos;s the <span>Real CEE Exam.</span>
          </h2>
          <p className={styles.description}>
            Nepal&apos;s most authentic medical entrance simulation — calibrated with the exact 200-question
            distribution, -0.25 negative marking penalty, and high-pressure pacing mandated by the Medical
            Education Commission (MEC).
          </p>
        </div>

        {/* CEE Blueprint 4 Spec Pillars */}
        <div className={styles.blueprintBar}>
          <div className={styles.blueprintPillar}>
            <div className={styles.pillarIconWrap}>
              <Target size={20} />
            </div>
            <div className={styles.pillarContent}>
              <span className={styles.pillarValue}>200 MCQs</span>
              <span className={styles.pillarLabel}>200 Marks Total</span>
              <span className={styles.pillarSubtitle}>Bio 80 · Chem 50 · Phy 50 · MAT 20</span>
            </div>
          </div>

          <div className={styles.blueprintPillar}>
            <div className={styles.pillarIconWrap}>
              <Clock3 size={20} />
            </div>
            <div className={styles.pillarContent}>
              <span className={styles.pillarValue}>180 Mins</span>
              <span className={styles.pillarLabel}>3.0 Hours Duration</span>
              <span className={styles.pillarSubtitle}>54s / Question Time Budget</span>
            </div>
          </div>

          <div className={styles.blueprintPillar}>
            <div className={styles.pillarIconWrap}>
              <AlertTriangle size={20} />
            </div>
            <div className={styles.pillarContent}>
              <span className={styles.pillarValue}>-0.25 Mark</span>
              <span className={styles.pillarLabel}>Negative Marking</span>
              <span className={styles.pillarSubtitle}>+1.00 Correct · -0.25 Incorrect</span>
            </div>
          </div>

          <div className={styles.blueprintPillar}>
            <div className={styles.pillarIconWrap}>
              <Award size={20} />
            </div>
            <div className={styles.pillarContent}>
              <span className={styles.pillarValue}>50th %ile</span>
              <span className={styles.pillarLabel}>Passing Standard</span>
              <span className={styles.pillarSubtitle}>Nepal Merit Rank Matching</span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className={styles.modeSwitcherWrap}>
          <div className={styles.modeSwitcher} role="tablist">
            <button
              aria-selected={activeView === 'simulator'}
              className={`${styles.modeBtn} ${activeView === 'simulator' ? styles.modeBtnActive : ''}`}
              onClick={() => setActiveView('simulator')}
              role="tab"
              type="button"
            >
              <ShieldCheck size={16} />
              Interactive CBT Simulator
            </button>
            <button
              aria-selected={activeView === 'blueprint'}
              className={`${styles.modeBtn} ${activeView === 'blueprint' ? styles.modeBtnActive : ''}`}
              onClick={() => setActiveView('blueprint')}
              role="tab"
              type="button"
            >
              <Layers size={16} />
              Official MEC Syllabus &amp; Weightage
            </button>
          </div>
        </div>

        {/* Arena Frame */}
        <div className={styles.arenaFrame}>
          {activeView === 'simulator' ? (
            <>
              {/* Exam Header */}
              <header className={styles.examHeader}>
                <div className={styles.examBrand}>
                  <span className={styles.brandMark}>
                    <GraduationCap aria-hidden="true" size={20} />
                  </span>
                  <span className={styles.brandText}>
                    <strong>CEE EXAM ARENA</strong>
                    <small>COMPUTER-BASED SIMULATOR</small>
                  </span>
                </div>
                <div className={styles.headerMeta}>
                  <span
                    className={`${styles.sessionBadge} ${status === 'running' ? styles.liveBadge : ''}`}
                  >
                    <i aria-hidden="true" />
                    {status === 'running'
                      ? 'SIMULATION IN PROGRESS'
                      : status === 'submitted'
                        ? 'DIAGNOSTIC COMPLETE'
                        : 'MEC SPRINT DEMO'}
                  </span>
                  <div
                    aria-label={`Time remaining ${formatTime(secondsLeft)}`}
                    className={`${styles.timer} notranslate ${secondsLeft < 60 && status === 'running' ? styles.timerWarning : ''}`}
                    translate="no"
                  >
                    <Clock3 aria-hidden="true" size={17} />
                    <span>
                      <small>TIME LEFT</small>
                      <strong>{formatTime(secondsLeft)}</strong>
                    </span>
                  </div>
                  <button
                    className={styles.headerRulesBtn}
                    onClick={() => setIsRulesOpen(true)}
                    type="button"
                  >
                    <Info size={14} />
                    Rules
                  </button>
                  {status === 'running' && (
                    <button
                      className={styles.headerSubmit}
                      onClick={() => setIsConfirmOpen(true)}
                      ref={submitButtonRef}
                      type="button"
                    >
                      <Send aria-hidden="true" size={15} />
                      Submit
                    </button>
                  )}
                </div>
              </header>

              {/* Exam Meta Strip with 4 Subjects */}
              <div className={styles.examMeta}>
                <div className={styles.subjectIndicators} aria-label="Sample subjects">
                  {(['Physics', 'Chemistry', 'Biology', 'MAT'] as const).map((subject) => {
                    const Icon = subjectIcons[subject];
                    const subjectQuestions = demoQuestions.filter(
                      (question) => question.subject === subject,
                    );
                    const subjectAnswered = subjectQuestions.filter(
                      (question) => answers[question.id] !== undefined,
                    ).length;
                    return (
                      <span className={styles.subjectChip} key={subject}>
                        <Icon aria-hidden="true" size={15} />
                        <span>{subject}</span>
                        <b>
                          {status === 'running' || status === 'submitted'
                            ? `${subjectAnswered}/${subjectQuestions.length}`
                            : subjectQuestions.length}
                        </b>
                      </span>
                    );
                  })}
                </div>
                {status !== 'ready' && (
                  <div className={styles.progressSummary}>
                    <span>
                      <b>{answeredCount}</b> answered
                    </span>
                    <span className={styles.progressDivider} />
                    <span>
                      <b>{unansweredCount}</b> remaining
                    </span>
                  </div>
                )}
              </div>

              {/* Workspace */}
              <div className={`${styles.workspace} notranslate`} translate="no">
                <div className={styles.questionWorkspace}>
                  {status === 'ready' ? (
                    <div className={styles.readyScreen} key="screen-ready">
                      <span className={styles.readyIcon}>
                        <ShieldCheck aria-hidden="true" size={27} />
                      </span>
                      <p className={styles.panelEyebrow}>MEC HIGH-YIELD DIAGNOSTIC READY</p>
                      <h3>Step into the exam environment.</h3>
                      <p className={styles.readyDescription}>
                        Work through eight authentic sample questions covering Physics, Chemistry, Biology,
                        and the official Mental Agility Test (MAT). Scored with exact +1.00 / -0.25 CEE marking.
                      </p>
                      <div className={styles.readyDetails}>
                        <span>
                          <Clock3 aria-hidden="true" size={16} />
                          10-minute session
                        </span>
                        <span>
                          <CheckCircle2 aria-hidden="true" size={16} />
                          8 High-Yield MCQs
                        </span>
                        <span>
                          <Flag aria-hidden="true" size={16} />
                          Mark for Review
                        </span>
                        <span>
                          <Sparkles aria-hidden="true" size={16} />
                          Complete Rationale
                        </span>
                      </div>
                      <button className={styles.startButton} onClick={startExam} type="button">
                        Start sample examination
                        <ArrowRight aria-hidden="true" size={17} />
                      </button>
                      <p className={styles.disclaimer}>
                        <Info aria-hidden="true" size={14} />
                        Live demonstration · Zero backend setup required · Questions follow the 2026 MEC curriculum
                      </p>
                    </div>
                  ) : status === 'submitted' ? (
                    <div className={styles.resultScreen} key="screen-submitted">
                      <div className={styles.resultHeading}>
                        <span className={styles.resultIcon}>
                          <CheckCircle2 aria-hidden="true" size={24} />
                        </span>
                        <div>
                          <p className={styles.panelEyebrow}>CEE DIAGNOSTIC SCORECARD</p>
                          <h3>Your practice session is complete</h3>
                        </div>
                      </div>
                      <p className={styles.resultNote}>
                        Calculated locally with MEC negative marking protocol: +1.00 for correct, -0.25 penalty for errors.
                      </p>
                      <div className={styles.scorePanel}>
                        <div
                          className={styles.scoreRing}
                          style={{ '--score-percent': `${result.percentage}%` } as React.CSSProperties}
                        >
                          <span>
                            <strong>{result.percentage.toFixed(1)}%</strong>
                            <small>accuracy</small>
                          </span>
                        </div>
                        <div className={styles.scoreBreakdown}>
                          <span>
                            <strong>{result.score.toFixed(2)}</strong>
                            <small>{`net marks / ${demoQuestions.length}`}</small>
                          </span>
                          <span className={styles.markingNote}>
                            {`+${CEE_EXAM_CONSTANTS.POSITIVE_MARK} correct · ${CEE_EXAM_CONSTANTS.NEGATIVE_MARK} incorrect penalty`}
                          </span>
                        </div>
                      </div>

                      <div className={styles.resultCounts} aria-label="Question results">
                        <div>
                          <strong>{demoQuestions.length}</strong>
                          <span>Total Questions</span>
                        </div>
                        <div>
                          <strong>{result.correct}</strong>
                          <span>Correct</span>
                        </div>
                        <div>
                          <strong>{result.incorrect}</strong>
                          <span>Incorrect</span>
                        </div>
                        <div>
                          <strong>{result.unanswered}</strong>
                          <span>Unanswered</span>
                        </div>
                      </div>

                      <div className={styles.subjectResults}>
                        <h4>Subject-wise Breakdown (All 4 CEE Areas)</h4>
                        {result.subjects.map(({ subject, correct, total }) => {
                          const Icon = subjectIcons[subject];
                          return (
                            <div className={styles.subjectResult} key={subject}>
                              <span className={styles.subjectResultName}>
                                <Icon aria-hidden="true" size={16} />
                                {subject}
                              </span>
                              <span
                                aria-label={`${subject}: ${correct} correct out of ${total}`}
                                aria-valuemax={total}
                                aria-valuemin={0}
                                aria-valuenow={correct}
                                className={styles.subjectResultTrack}
                                role="progressbar"
                              >
                                <span style={{ width: `${(correct / total) * 100}%` }} />
                              </span>
                              <strong>
                                {correct}/{total}
                              </strong>
                            </div>
                          );
                        })}
                      </div>

                      {/* Step-by-Step Solutions & Trap Analysis Accordion */}
                      <div className={styles.solutionsAccordion}>
                        <button
                          className={styles.solutionsToggle}
                          onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                          type="button"
                        >
                          <span className="flex items-center gap-2">
                            <BookOpen size={16} />
                            {`Review Detailed Step-by-Step Explanations & Trap Alerts (${demoQuestions.length} Questions)`}
                          </span>
                          {isSolutionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {isSolutionsOpen && (
                          <div className={styles.solutionsList}>
                            {demoQuestions.map((q, idx) => {
                              const studentAns = answers[q.id];
                              const isCorrect = studentAns === q.correctOption;
                              const isUnanswered = studentAns === undefined;

                              return (
                                <div className={styles.solutionCard} key={q.id}>
                                  <div className={styles.solutionCardHeader}>
                                    <span className={styles.solutionQuestionNum}>
                                      {`Q${String(idx + 1).padStart(2, '0')} · ${q.subject} (${q.subSubject})`}
                                    </span>
                                    <span
                                      className={`${styles.solutionStatusPill} ${
                                        isCorrect
                                          ? styles.statusCorrect
                                          : isUnanswered
                                            ? styles.statusUnanswered
                                            : styles.statusIncorrect
                                      }`}
                                    >
                                      {isCorrect
                                        ? '✓ Correct (+1.00)'
                                        : isUnanswered
                                          ? '○ Unanswered (0.00)'
                                          : '✕ Incorrect (-0.25)'}
                                    </span>
                                  </div>

                                  <h5 className={styles.solutionPrompt}>{q.prompt}</h5>

                                  <div className={styles.solutionAnswerComparison}>
                                    <div className={`${styles.solutionAnswerBlock} ${styles.solutionYourAnswer}`}>
                                      <strong>Your Answer:</strong>{' '}
                                      {isUnanswered
                                        ? 'None (Skipped)'
                                        : `${String.fromCharCode(65 + studentAns)}: ${q.options[studentAns]}`}
                                    </div>
                                    <div className={`${styles.solutionAnswerBlock} ${styles.solutionCorrectAnswer}`}>
                                      <strong>Correct Option:</strong>{' '}
                                      {String.fromCharCode(65 + q.correctOption)}: {q.options[q.correctOption]}
                                    </div>
                                  </div>

                                  <div className={styles.explanationBox}>
                                    <strong>Scientific Rationale &amp; Derivation</strong>
                                    {q.explanation}
                                  </div>

                                  <div className={styles.trapWarningBox}>
                                    <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-amber-600" />
                                    <span>
                                      <strong>High-Yield Trap Alert:</strong> {q.trapWarning}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button className={styles.tryAgainButton} onClick={tryAgain} type="button">
                        <RotateCcw aria-hidden="true" size={16} />
                        Try again
                      </button>
                    </div>
                  ) : (
                    <div aria-live="polite" className={styles.questionPanel} key={`question-${currentQuestion.id}`}>
                      <div className={styles.questionTopline}>
                        <div className={styles.questionIdentity}>
                          <span className={styles.questionNumber}>
                            {`QUESTION ${String(currentIndex + 1).padStart(2, '0')}`}
                          </span>
                          <span className={styles.questionTotal}>{`OF ${demoQuestions.length}`}</span>
                        </div>
                        <span className={styles.topicBadge}>{currentQuestion.topic}</span>
                      </div>

                      <div className={styles.questionMetadataRow}>
                        <span
                          className={`${styles.difficultyPill} ${
                            currentQuestion.difficulty === 'EASY'
                              ? styles.diffEasy
                              : currentQuestion.difficulty === 'MODERATE'
                                ? styles.diffModerate
                                : styles.diffChallenger
                          }`}
                        >
                          {currentQuestion.difficulty}
                        </span>
                        <span className={styles.pyqPill}>
                          <Award size={12} />
                          {currentQuestion.pyqReference}
                        </span>
                      </div>

                      <div
                        aria-label={`Question ${currentIndex + 1} of ${demoQuestions.length}`}
                        aria-valuemax={demoQuestions.length}
                        aria-valuemin={1}
                        aria-valuenow={currentIndex + 1}
                        className={styles.questionProgress}
                        role="progressbar"
                      >
                        <span
                          style={{ width: `${((currentIndex + 1) / demoQuestions.length) * 100}%` }}
                        />
                      </div>

                      <div className={styles.promptBlock}>
                        <p className={styles.promptLabel}>SELECT ONE BEST ANSWER (MEC SINGLE-CHOICE)</p>
                        <h3 id="current-question">{currentQuestion.prompt}</h3>
                      </div>

                      <fieldset className={styles.options}>
                        <legend className={styles.srOnly}>Answer options</legend>
                        {currentQuestion.options.map((option, optionIndex) => {
                          const isSelected = answers[currentQuestion.id] === optionIndex;
                          return (
                            <label
                              className={`${styles.option} ${isSelected ? styles.selectedOption : ''}`}
                              key={option}
                            >
                              <input
                                checked={isSelected}
                                name={`answer-${currentQuestion.id}`}
                                onChange={() => chooseAnswer(optionIndex)}
                                type="radio"
                                value={optionIndex}
                              />
                              <span className={styles.optionLetter}>
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className={styles.optionText}>{option}</span>
                              <span aria-hidden="true" className={styles.optionCheck}>
                                {isSelected && <Check size={16} />}
                              </span>
                            </label>
                          );
                        })}
                      </fieldset>

                      <div className={styles.questionActions}>
                        <button
                          aria-pressed={markedQuestions.has(currentQuestion.id)}
                          className={`${styles.reviewButton} ${markedQuestions.has(currentQuestion.id) ? styles.reviewActive : ''}`}
                          onClick={toggleMarkedQuestion}
                          type="button"
                        >
                          <Flag aria-hidden="true" size={16} />
                          {markedQuestions.has(currentQuestion.id)
                            ? 'Marked for review'
                            : 'Mark for review'}
                        </button>
                        <div className={styles.navigationButtons}>
                          <button
                            aria-label="Previous question"
                            className={styles.previousButton}
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                            type="button"
                          >
                            <ArrowLeft aria-hidden="true" size={16} />
                            <span>Previous</span>
                          </button>
                          <button
                            aria-label="Next question"
                            className={styles.nextButton}
                            disabled={currentIndex === demoQuestions.length - 1}
                            onClick={() =>
                              setCurrentIndex((index) => Math.min(demoQuestions.length - 1, index + 1))
                            }
                            type="button"
                          >
                            <span>Next question</span>
                            <ArrowRight aria-hidden="true" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {status !== 'submitted' && (
                  <aside aria-label="Question navigation" className={styles.questionSidebar}>
                    <div className={styles.sidebarHeading}>
                      <div>
                        <p className={styles.panelEyebrow}>QUESTION PALETTE</p>
                        <h3>Navigate</h3>
                      </div>
                      <span className={styles.paletteCount}>{demoQuestions.length} Q</span>
                    </div>
                    {status === 'running' && (
                      <p className={styles.paletteInstruction}>
                        Select any question to jump directly.
                      </p>
                    )}
                    <div className={styles.palette} role="group" aria-label="Choose a question">
                      {demoQuestions.map((question, index) => {
                        const isAnswered = answers[question.id] !== undefined;
                        const isMarked = markedQuestions.has(question.id);
                        return (
                          <button
                            aria-current={index === currentIndex ? 'step' : undefined}
                            aria-label={`Question ${index + 1}, ${question.subject}, ${isMarked ? 'marked for review' : isAnswered ? 'answered' : 'unanswered'}${index === currentIndex ? ', current question' : ''}`}
                            className={[
                              styles.paletteButton,
                              index === currentIndex ? styles.paletteCurrent : '',
                              isAnswered ? styles.paletteAnswered : '',
                              isMarked ? styles.paletteMarked : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            key={question.id}
                            onClick={() => setCurrentIndex(index)}
                            type="button"
                          >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {isAnswered && (
                              <Check aria-hidden="true" className={styles.paletteCheck} size={11} />
                            )}
                            {isMarked && (
                              <Flag aria-hidden="true" className={styles.paletteFlag} size={10} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className={styles.paletteLegend} aria-label="Question state legend">
                      <span>
                        <i className={styles.legendCurrent} />
                        Current
                      </span>
                      <span>
                        <i className={styles.legendAnswered} />
                        Answered
                      </span>
                      <span>
                        <i className={styles.legendUnanswered} />
                        Unanswered
                      </span>
                      <span>
                        <i className={styles.legendMarked} />
                        Review
                      </span>
                    </div>
                    {status === 'running' && (
                      <div className={styles.sidebarProgress}>
                        <div className={styles.sidebarProgressMeta}>
                          <span>Session progress</span>
                          <strong>
                            {answeredCount}/{demoQuestions.length}
                          </strong>
                        </div>
                        <span className={styles.sidebarProgressTrack}>
                          <span style={{ width: `${(answeredCount / demoQuestions.length) * 100}%` }} />
                        </span>
                      </div>
                    )}
                    {status === 'running' && (
                      <button
                        className={styles.sidebarSubmit}
                        onClick={() => setIsConfirmOpen(true)}
                        type="button"
                      >
                        Submit examination
                        <ArrowRight aria-hidden="true" size={15} />
                      </button>
                    )}
                  </aside>
                )}
              </div>

              {/* Exam Footer */}
              <footer className={styles.examFooter}>
                <span>
                  <span className={styles.footerSignal} />
                  {status === 'running'
                    ? 'Active simulation · Answers held locally in browser memory.'
                    : 'Self-contained practice · No login or payment required.'}
                </span>
                <span>AUTHENTIC MEC CEE CBT REPLICA</span>
              </footer>
            </>
          ) : (
            /* Official MEC Blueprint & Weightage View */
            <div className={styles.blueprintDashboard}>
              <div className={styles.blueprintHeroCard}>
                <div>
                  <h3 className={styles.blueprintHeroTitle}>Nepal Medical Education Commission Blueprint</h3>
                  <p className={styles.blueprintHeroText}>
                    The Common Entrance Examination (CEE) for MBBS, BDS, BSc Nursing, and allied medical sciences
                    features a strict 200-question computer-based and OMR exam format with negative marking penalties.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/20">
                      200 Single-Best-Response MCQs
                    </span>
                    <span className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full border border-white/20">
                      180 Minutes (3 Hours)
                    </span>
                    <span className="px-3 py-1 text-xs font-bold bg-amber-400/20 text-amber-200 rounded-full border border-amber-400/30">
                      -0.25 Negative Marking / Error
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-xs text-sky-200 uppercase tracking-widest font-bold">Pacing Formula</span>
                  <span className="text-3xl font-extrabold text-white mt-1">54 Seconds</span>
                  <p className="text-xs text-white/70 mt-1">
                    Target maximum time per MCQ to leave 20 minutes for revision and bubble review.
                  </p>
                </div>
              </div>

              {/* Subject Breakdown Grid */}
              <div className={styles.blueprintSubjectGrid}>
                {CEE_OFFICIAL_SYLLABUS.map((subj) => (
                  <div className={styles.blueprintSubjectCard} key={subj.subject}>
                    <div className={styles.blueprintSubjectTop}>
                      <h4 className={styles.blueprintSubjectName}>{subj.subject}</h4>
                      <span className={styles.blueprintSubjectBadge}>{subj.badge}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{subj.description}</p>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 py-1 border-b border-slate-100">
                      <span>Total Marks: {subj.marks}</span>
                      <span>{subj.questions} Questions</span>
                    </div>

                    <div className={styles.blueprintSubtopicList}>
                      {subj.subtopics.map((st) => (
                        <div className={styles.blueprintSubtopicItem} key={st.name}>
                          <span>{st.name}</span>
                          <strong>{st.marks} Marks</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom 3 Feature Highlights */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <AlertTriangle size={22} />
            </div>
            <h4 className={styles.featureTitle}>Negative Marking Defense</h4>
            <p className={styles.featureDescription}>
              In Nepal CEE, 4 incorrect guesses erase an entire correct answer. Our exam engine trains you
              in intelligent option elimination and risk management.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <BrainCircuit size={22} />
            </div>
            <h4 className={styles.featureTitle}>Mental Agility Test (MAT)</h4>
            <p className={styles.featureDescription}>
              Complete preparation for the newly introduced 20-mark MAT section covering numerical patterns,
              spatial relations, and medical reasoning logic.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Sparkles size={22} />
            </div>
            <h4 className={styles.featureTitle}>Instant High-Yield Solutions</h4>
            <p className={styles.featureDescription}>
              Never wonder why you lost marks. Every problem includes full scientific rationales, formula
              derivations, and common misconception trap alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div
          className={styles.dialogBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeConfirmation();
          }}
        >
          <div
            aria-labelledby="submit-dialog-title"
            aria-modal="true"
            className={styles.confirmDialog}
            ref={dialogRef}
            role="dialog"
          >
            <button
              aria-label="Close submission confirmation"
              className={styles.dialogClose}
              onClick={closeConfirmation}
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
            <span className={styles.dialogIcon}>
              <Send aria-hidden="true" size={21} />
            </span>
            <p className={styles.panelEyebrow}>END THIS PRACTICE SESSION?</p>
            <h3 id="submit-dialog-title">Submit your examination?</h3>
            <p className={styles.dialogDescription}>
              You can review your answers before confirming. Your diagnostic scorecard and step-by-step
              solutions will generate immediately.
            </p>
            <div className={styles.dialogCounts}>
              <span>
                <strong>{answeredCount}</strong> Answered
              </span>
              <span>
                <strong>{unansweredCount}</strong> Unanswered
              </span>
            </div>
            <div className={styles.dialogActions}>
              <button
                className={styles.cancelSubmit}
                onClick={closeConfirmation}
                ref={cancelButtonRef}
                type="button"
              >
                Continue exam
              </button>
              <button className={styles.confirmSubmit} onClick={confirmSubmission} type="button">
                Confirm submit
                <ArrowRight aria-hidden="true" size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules & Protocols Dialog */}
      {isRulesOpen && (
        <div
          className={styles.dialogBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsRulesOpen(false);
          }}
        >
          <div
            aria-labelledby="rules-dialog-title"
            aria-modal="true"
            className={styles.confirmDialog}
            role="dialog"
            style={{ maxWidth: '32rem' }}
          >
            <button
              aria-label="Close rules"
              className={styles.dialogClose}
              onClick={() => setIsRulesOpen(false)}
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
            <span className={styles.dialogIcon}>
              <ShieldCheck aria-hidden="true" size={21} />
            </span>
            <p className={styles.panelEyebrow}>OFFICIAL MEC CEE PROTOCOL</p>
            <h3 id="rules-dialog-title">Nepal CEE Examination Hall Rules</h3>
            <div className="text-left text-xs text-slate-600 space-y-3 mt-3 leading-relaxed">
              <p>
                <strong>1. Marking Scheme:</strong> Each correct response awards <strong>+1.00 mark</strong>.
                Each incorrect response deducts <strong>0.25 mark (-25%)</strong>. Unattempted questions carry zero penalty.
              </p>
              <p>
                <strong>2. Time Budget:</strong> 200 questions across 180 minutes gives exactly <strong>54 seconds per question</strong>.
                Budget 15–20 minutes at the end for reviewing flagged items.
              </p>
              <p>
                <strong>3. Hardware &amp; Calculator Policy:</strong> Strictly non-programmable. No electronic gadgets, smartwatches,
                or calculators are permitted in the official exam hall.
              </p>
              <p>
                <strong>4. Single Best Response:</strong> Only one option out of four is keyed as correct. Marking multiple options on OMR
                is automatically penalized as an incorrect attempt (-0.25).
              </p>
            </div>
            <div className={styles.dialogActions} style={{ marginTop: '1.25rem' }}>
              <button
                className={styles.confirmSubmit}
                onClick={() => setIsRulesOpen(false)}
                type="button"
                style={{ width: '100%' }}
              >
                Understood, Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
