import { CEE_EXAM_CONSTANTS } from '@cee/contracts';

export type ExamSubject = 'Physics' | 'Chemistry' | 'Biology' | 'MAT';

export interface DemoQuestion {
  id: string;
  subject: ExamSubject;
  subSubject: string;
  topic: string;
  difficulty: 'EASY' | 'MODERATE' | 'CHALLENGER';
  prompt: string;
  options: readonly [string, string, string, string];
  correctOption: number;
  explanation: string;
  trapWarning: string;
  pyqReference: string;
}

export const DEMO_DURATION_SECONDS = 10 * 60;

export const demoQuestions: readonly DemoQuestion[] = [
  {
    id: 'physics-1',
    subject: 'Physics',
    subSubject: 'Electricity & Magnetism',
    topic: 'Parallel Resistors',
    difficulty: 'EASY',
    prompt:
      'Two resistors of 6 Ω and 3 Ω are connected in parallel across an ideal voltage source. What is their equivalent resistance?',
    options: ['9 Ω', '2 Ω', '4.5 Ω', '1 Ω'],
    correctOption: 1,
    explanation:
      'For two parallel resistors: 1/R_eq = 1/R₁ + 1/R₂. Consequently R_eq = (R₁ × R₂) / (R₁ + R₂) = (6 × 3) / (6 + 3) = 18 / 9 = 2 Ω. In parallel, equivalent resistance is always strictly less than the smallest individual branch.',
    trapWarning: 'Option A (9 Ω) represents series sum (6 + 3), which is the most frequent rush mistake.',
    pyqReference: 'CEE 2021 / IOM Past Benchmark',
  },
  {
    id: 'physics-2',
    subject: 'Physics',
    subSubject: 'Mechanics',
    topic: 'Projectile Motion',
    difficulty: 'MODERATE',
    prompt:
      'For a projectile launched from level ground with initial velocity u, at which launch angle θ with the horizontal is maximum range achieved?',
    options: ['30°', '45°', '60°', '90°'],
    correctOption: 1,
    explanation:
      'Horizontal range formula: R = (u² sin 2θ) / g. Range reaches maximum when sin 2θ = 1, meaning 2θ = 90° and θ = 45°. Complementary angles (e.g. 30° and 60°) achieve identical ranges.',
    trapWarning: 'At 90°, the projectile has maximum vertical altitude, but zero horizontal displacement.',
    pyqReference: 'MEC CEE Core Curriculum',
  },
  {
    id: 'chemistry-1',
    subject: 'Chemistry',
    subSubject: 'Physical Chemistry',
    topic: 'Acids and bases',
    difficulty: 'EASY',
    prompt: 'At 25 °C (298 K), what is the pH value of a pure neutral aqueous solution?',
    options: ['0', '5', '7', '14'],
    correctOption: 2,
    explanation:
      'At standard 25 °C, water auto-ionization constant Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴. In pure neutral water, [H⁺] = 1.0 × 10⁻⁷ M, yielding pH = -log₁₀(10⁻⁷) = 7.0.',
    trapWarning: 'At higher temperatures (e.g. 60 °C), Kw increases and neutral pH drops below 7, though water remains neutral.',
    pyqReference: 'CEE High-Yield Standard',
  },
  {
    id: 'chemistry-2',
    subject: 'Chemistry',
    subSubject: 'Inorganic Chemistry',
    topic: 'Atomic structure',
    difficulty: 'MODERATE',
    prompt: 'Which element in its ground state possesses the electron configuration 1s² 2s² 2p⁶ 3s¹?',
    options: ['Neon', 'Magnesium', 'Sodium', 'Aluminium'],
    correctOption: 2,
    explanation:
      'Total electrons = 2 + 2 + 6 + 1 = 11. Atomic number Z = 11 corresponds to Sodium (Na), located in Group 1 (Alkali Metals), Period 3 of the periodic table.',
    trapWarning: 'Neon has 10 electrons (2p⁶); Magnesium has 12 electrons (3s²); Aluminium has 13 (3p¹).',
    pyqReference: 'BPKIHS Past Paper Model',
  },
  {
    id: 'biology-1',
    subject: 'Biology',
    subSubject: 'Zoology / Cell Biology',
    topic: 'Cell biology',
    difficulty: 'EASY',
    prompt: 'Which cellular structure serves as the primary site of biological protein synthesis in eukaryotic cells?',
    options: ['Lysosome', 'Ribosome', 'Golgi apparatus', 'Centriole'],
    correctOption: 1,
    explanation:
      'Ribosomes (composed of rRNA and ribosomal proteins) carry out translation by reading messenger RNA (mRNA) triplets and assembling polypeptide chains. They operate both free in cytosol and bound to rough ER.',
    trapWarning: 'The Golgi apparatus modifies and packages already synthesized proteins; synthesis itself occurs strictly at the ribosome.',
    pyqReference: 'CEE 2023 Blueprint Item',
  },
  {
    id: 'biology-2',
    subject: 'Biology',
    subSubject: 'Botany / Cell Division',
    topic: 'Cell division',
    difficulty: 'MODERATE',
    prompt:
      'During which specific stage of mitosis do sister chromatids cleave at the centromere and migrate toward opposite spindle poles?',
    options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
    correctOption: 2,
    explanation:
      'In Anaphase, cohesin proteins degrade, centromeres split, and sister chromatids (now individual daughter chromosomes) are pulled toward opposite poles by kinetochore microtubule depolymerization.',
    trapWarning: 'Metaphase is the alignment along the equatorial metaphase plate; separation occurs specifically in Anaphase.',
    pyqReference: 'IOM MBBS Entrance Pattern',
  },
  {
    id: 'mat-1',
    subject: 'MAT',
    subSubject: 'Numerical Aptitude',
    topic: 'Number Sequences',
    difficulty: 'MODERATE',
    prompt:
      'Identify the logical continuation of this numerical sequence: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '48'],
    correctOption: 2,
    explanation:
      'The difference between consecutive terms increases by 2: +4, +6, +8, +10, +12. Thus 30 + 12 = 42. Equivalently, the nth term is n(n + 1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.',
    trapWarning: 'Option A (36) is a common speed trap when mistaking the sequence for perfect squares.',
    pyqReference: 'MEC MAT Syllabus Standard',
  },
  {
    id: 'mat-2',
    subject: 'MAT',
    subSubject: 'Logical & Spatial Deduction',
    topic: 'Direction & Vectors',
    difficulty: 'CHALLENGER',
    prompt:
      'An emergency responder walks 40 m North from trauma triage, turns right (East) and walks 30 m to the trauma lab. What is the shortest direct displacement from start?',
    options: ['70 m', '50 m', '35 m', '45 m'],
    correctOption: 1,
    explanation:
      'Displacement is the vector hypotenuse of a right-angled triangle with legs of 40 m and 30 m: D = √(40² + 30²) = √(1600 + 900) = √2500 = 50 m in the North-East direction.',
    trapWarning: 'Option A (70 m) is the scalar distance walked (40 + 30), not the vector displacement.',
    pyqReference: 'CEE Mental Agility Model',
  },
];

export interface SubjectResult {
  subject: ExamSubject;
  correct: number;
  total: number;
}

export interface ExamResult {
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  percentage: number;
  subjects: SubjectResult[];
}

export function calculateExamResult(answers: Record<string, number>): ExamResult {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  const subjects: SubjectResult[] = [
    { subject: 'Physics', correct: 0, total: 0 },
    { subject: 'Chemistry', correct: 0, total: 0 },
    { subject: 'Biology', correct: 0, total: 0 },
    { subject: 'MAT', correct: 0, total: 0 },
  ];

  for (const question of demoQuestions) {
    const subjectResult = subjects.find(({ subject }) => subject === question.subject);
    if (!subjectResult) {
      continue;
    }

    subjectResult.total += 1;
    const answer = answers[question.id];
    if (answer === undefined) {
      unanswered += 1;
    } else if (answer === question.correctOption) {
      correct += 1;
      subjectResult.correct += 1;
    } else {
      incorrect += 1;
    }
  }

  const score =
    correct * CEE_EXAM_CONSTANTS.POSITIVE_MARK + incorrect * CEE_EXAM_CONSTANTS.NEGATIVE_MARK;
  const percentage = Math.max(0, (score / demoQuestions.length) * 100);

  return { correct, incorrect, unanswered, score, percentage, subjects };
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export interface SyllabusSubjectInfo {
  subject: string;
  marks: number;
  percentage: number;
  questions: number;
  color: string;
  badge: string;
  description: string;
  subtopics: { name: string; marks: number }[];
}

export const CEE_OFFICIAL_SYLLABUS: readonly SyllabusSubjectInfo[] = [
  {
    subject: 'Biology (Zoology & Botany)',
    marks: 80,
    percentage: 40,
    questions: 80,
    color: '#A9E6DD',
    badge: '40% Weightage',
    description: 'The heavyweight anchor of Nepal CEE. Demands deep NCERT-level mastery of physiology, cell biology, genetics, and ecology.',
    subtopics: [
      { name: 'Zoology (Human Systems, Tissues & Animal Diversity)', marks: 40 },
      { name: 'Botany (Plant Physiology, Genetics, Morphology & Ecology)', marks: 40 },
    ],
  },
  {
    subject: 'Chemistry',
    marks: 50,
    percentage: 25,
    questions: 50,
    color: '#B8DFF4',
    badge: '25% Weightage',
    description: 'Requires numerical precision in Physical Chemistry, reaction mechanisms in Organic, and periodic trends in Inorganic.',
    subtopics: [
      { name: 'Physical Chemistry (Equilibrium, Kinetics, Thermodynamics)', marks: 18 },
      { name: 'Organic Chemistry (Reaction Mechanisms, Functional Groups)', marks: 18 },
      { name: 'Inorganic Chemistry (Periodic Trends, Coordination, Metallurgy)', marks: 14 },
    ],
  },
  {
    subject: 'Physics',
    marks: 50,
    percentage: 25,
    questions: 50,
    color: '#7367F0',
    badge: '25% Weightage',
    description: 'Conceptual derivations and high-speed numerical calculations across mechanics, optics, electricity, and modern physics.',
    subtopics: [
      { name: 'Modern Physics & Nuclear Structure', marks: 13 },
      { name: 'Mechanics (Kinematics, Dynamics, Gravitation)', marks: 10 },
      { name: 'Electrostatics & Magnetism', marks: 9 },
      { name: 'Optics (Ray & Wave Optics)', marks: 7 },
      { name: 'Heat & Thermodynamics', marks: 6 },
      { name: 'Waves & Acoustic Sound', marks: 5 },
    ],
  },
  {
    subject: 'Mental Agility Test (MAT)',
    marks: 20,
    percentage: 10,
    questions: 20,
    color: '#38BDF8',
    badge: '10% Weightage',
    description: 'Introduced by Medical Education Commission (MEC) to evaluate speed, pattern recognition, and analytical aptitude under pressure.',
    subtopics: [
      { name: 'Logical & Abstract Deduction', marks: 10 },
      { name: 'Numerical Aptitude & Series', marks: 5 },
      { name: 'Verbal Comprehension & Medical Ethics Logic', marks: 5 },
    ],
  },
];
