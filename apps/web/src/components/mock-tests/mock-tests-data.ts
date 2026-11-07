import { CEE_EXAM_CONSTANTS } from '@cee/contracts';

export type ExamCategory =
  | 'FULL_MOCK'
  | 'SUBJECT_TEST'
  | 'TOPIC_TEST'
  | 'TIMED_PRACTICE'
  | 'REVISION_TEST'
  | 'CHALLENGE_TEST';

export type ExamSubject = 'Biology' | 'Chemistry' | 'Physics' | 'MAT';

export type DifficultyLevel = 'EASY' | 'MODERATE' | 'HARD' | 'CHALLENGER';

export type MistakeCategory =
  | 'CONCEPTUAL'
  | 'CALCULATION'
  | 'MEMORY_RECALL'
  | 'INTERPRETATION'
  | 'TIME_MANAGEMENT';

export interface MockQuestion {
  id: string;
  subject: ExamSubject;
  subSubject: string;
  topic: string;
  difficulty: DifficultyLevel;
  prompt: string;
  options: readonly [string, string, string, string];
  correctOption: number;
  explanation: string;
  trapWarning: string;
  pyqReference: string;
  mistakeCategory: MistakeCategory;
}

export interface MockExamDefinition {
  id: string;
  title: string;
  shortDescription: string;
  category: ExamCategory;
  categoryLabel: string;
  subject?: ExamSubject;
  difficulty: DifficultyLevel;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  isAvailable: boolean;
  isDemo: boolean;
  tier: 'FREE' | 'PRO';
  subjectsIncluded: readonly ExamSubject[];
  questions: readonly MockQuestion[];
}

export type QuestionNavigationState =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_AND_MARKED';

export interface SubjectBreakdown {
  subject: ExamSubject;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  accuracy: number;
}

export interface MistakeBreakdown {
  category: MistakeCategory;
  label: string;
  description: string;
  count: number;
  questions: MockQuestion[];
}

export interface ExamAttemptResult {
  attemptId: string;
  examId: string;
  examTitle: string;
  completedAt: string;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  totalDurationSeconds: number;
  answers: Record<string, number>;
  markedQuestions: string[];
  subjectBreakdowns: SubjectBreakdown[];
  mistakeBreakdowns: MistakeBreakdown[];
  weakTopics: Array<{ topic: string; subject: ExamSubject; mistakes: number }>;
  isDemo: boolean;
}

// -----------------------------------------------------------------------------
// QUESTION BANK (Authentic Medical Entrance Syllabus)
// -----------------------------------------------------------------------------

export const MOCK_QUESTIONS_POOL: readonly MockQuestion[] = [
  // --- BIOLOGY (Zoology & Botany) ---
  {
    id: 'bio-01',
    subject: 'Biology',
    subSubject: 'Zoology / Neurophysiology',
    topic: 'Nerve Impulse & Action Potential',
    difficulty: 'MODERATE',
    prompt:
      'During the depolarization phase of an axonal action potential, which rapid ionic event is primarily responsible for the rapid shift of membrane potential toward +30 mV?',
    options: [
      'Efflux of K⁺ ions through voltage-gated potassium channels',
      'Rapid influx of Na⁺ ions through voltage-gated sodium channels',
      'Active pumping of 3 Na⁺ ions outward by Na⁺/K⁺-ATPase',
      'Influx of Ca²⁺ ions through ligand-gated channels',
    ],
    correctOption: 1,
    explanation:
      'Depolarization is triggered when threshold stimulus opens voltage-gated Na⁺ activation gates, causing explosive passive influx of Na⁺ along both its electrical and concentration gradients. Repolarization follows when Na⁺ channels inactivate and voltage-gated K⁺ channels open.',
    trapWarning:
      'Na⁺/K⁺-ATPase maintains resting potential (-70 mV); it is NOT the driver of rapid action potential upstroke.',
    pyqReference: 'CEE 2023 Blueprint / IOM Past Model',
    mistakeCategory: 'CONCEPTUAL',
  },
  {
    id: 'bio-02',
    subject: 'Biology',
    subSubject: 'Zoology / Cardiovascular Physiology',
    topic: 'Cardiac Cycle & Heart Sounds',
    difficulty: 'EASY',
    prompt:
      'The first physiological heart sound (LUB) is produced synchronously with which event of the cardiac cycle?',
    options: [
      'Closure of the semilunar valves (aortic and pulmonary)',
      'Closure of the atrioventricular valves (mitral and tricuspid)',
      'Rapid passive filling of the ventricles in early diastole',
      'Contraction of the atria during late diastole',
    ],
    correctOption: 1,
    explanation:
      'The first heart sound (S1 / "LUB") results from reverberation of blood and vibration of ventricular walls upon the abrupt closure of atrioventricular (AV) valves at the onset of ventricular systole (isovolumetric contraction). S2 ("DUB") marks semilunar valve closure.',
    trapWarning:
      'Option A describes S2 ("DUB"), which signals the onset of ventricular diastole.',
    pyqReference: 'BPKIHS MBBS Entrance Benchmark',
    mistakeCategory: 'MEMORY_RECALL',
  },
  {
    id: 'bio-03',
    subject: 'Biology',
    subSubject: 'Botany / Plant Physiology',
    topic: 'Photosynthesis & C4 Pathway',
    difficulty: 'MODERATE',
    prompt:
      'In C4 plants such as maize and sugarcane, what is the primary acceptor of CO₂ in the mesophyll chloroplasts, and which enzyme catalyzes this fixation?',
    options: [
      'Ribulose-1,5-bisphosphate (RuBP) catalyzed by RuBisCO',
      'Phosphoenolpyruvate (PEP) catalyzed by PEP carboxylase',
      'Oxaloacetic acid (OAA) catalyzed by malic dehydrogenase',
      '3-Phosphoglyceric acid (PGA) catalyzed by phosphotriose isomerase',
    ],
    correctOption: 1,
    explanation:
      'In C4 plants, initial carbon fixation occurs in mesophyll cells where PEP (a 3-carbon compound) accepts CO₂ catalyzed by PEP carboxylase (PEPcase) to form 4-carbon Oxaloacetic Acid (OAA). RuBisCO operates only in the bundle sheath cells.',
    trapWarning:
      'RuBP is the primary acceptor in C3 plants; C4 plants evolve Kranz anatomy precisely to isolate RuBisCO from oxygenation.',
    pyqReference: 'CEE Standard Plant Biology Pattern',
    mistakeCategory: 'CONCEPTUAL',
  },
  {
    id: 'bio-04',
    subject: 'Biology',
    subSubject: 'Botany / Genetics & Molecular Biology',
    topic: 'Transcription & RNA Processing',
    difficulty: 'HARD',
    prompt:
      'Which post-transcriptional modification in eukaryotic pre-mRNA processing involves the enzymatic addition of 7-methylguanosine triphosphate at the 5′ terminus?',
    options: [
      'Polyadenylation',
      'Exon splicing by spliceosome',
      '5′ Capping',
      'RNA editing via deamination',
    ],
    correctOption: 2,
    explanation:
      '5′ Capping is the addition of 7-methylguanosine (m⁷G) via an atypical 5′-to-5′ triphosphate bridge to protect eukaryotic transcripts from 5′ exonucleases and promote ribosome assembly. Polyadenylation occurs at the 3′ end.',
    trapWarning:
      'Do not confuse 5′ capping (m⁷G) with 3′ poly-A tailing (200-300 adenylate residues).',
    pyqReference: 'MEC CEE Core Curriculum 2024',
    mistakeCategory: 'MEMORY_RECALL',
  },
  {
    id: 'bio-05',
    subject: 'Biology',
    subSubject: 'Zoology / Renal Physiology',
    topic: 'Countercurrent Mechanism',
    difficulty: 'CHALLENGER',
    prompt:
      'In the human juxtamedullary nephron, which segment of the Loop of Henle is impermeable to water but actively reabsorbs NaCl into the surrounding medullary interstitium?',
    options: [
      'Thin descending limb of Loop of Henle',
      'Thick ascending limb of Loop of Henle',
      'Proximal convoluted tubule (PCT)',
      'Cortical collecting duct',
    ],
    correctOption: 1,
    explanation:
      'The thick ascending limb (TAL) is impermeable to water and expresses the apical Na⁺-K⁺-2Cl⁻ cotransporter (NKCC2), actively transporting solutes into the renal medulla to establish hypertonicity without water following.',
    trapWarning:
      'The descending limb is freely permeable to water (via AQP1) but impermeable to solutes, the inverse of the ascending limb.',
    pyqReference: 'IOM Past Golden Standard',
    mistakeCategory: 'INTERPRETATION',
  },

  // --- CHEMISTRY ---
  {
    id: 'chem-01',
    subject: 'Chemistry',
    subSubject: 'Physical Chemistry / Thermodynamics',
    topic: 'Gibbs Free Energy & Spontaneity',
    difficulty: 'MODERATE',
    prompt:
      'For a chemical reaction occurring at constant temperature and pressure, which condition guarantees that the reaction will proceed spontaneously at all temperatures?',
    options: [
      'ΔH > 0 and ΔS > 0',
      'ΔH < 0 and ΔS > 0',
      'ΔH < 0 and ΔS < 0',
      'ΔH > 0 and ΔS < 0',
    ],
    correctOption: 1,
    explanation:
      'According to the Gibbs-Helmholtz relation ΔG = ΔH - TΔS, when ΔH is negative (exothermic) and ΔS is positive (increasing entropy), both terms contribute negatively to ΔG regardless of absolute temperature T (where T > 0 K), ensuring ΔG < 0 unconditionally.',
    trapWarning:
      'When ΔH > 0 and ΔS < 0 (Option D), the reaction is non-spontaneous at ALL temperatures.',
    pyqReference: 'CEE High-Yield Physical Chemistry',
    mistakeCategory: 'CONCEPTUAL',
  },
  {
    id: 'chem-02',
    subject: 'Chemistry',
    subSubject: 'Organic Chemistry / Reaction Mechanisms',
    topic: 'Aldol Condensation & Carbonyls',
    difficulty: 'MODERATE',
    prompt:
      'Which of the following carbonyl compounds will FAIL to undergo self-Aldol condensation when treated with dilute sodium hydroxide (NaOH)?',
    options: [
      'Acetaldehyde (CH₃CHO)',
      'Benzaldehyde (C₆H₅CHO)',
      'Propanal (CH₃CH₂CHO)',
      'Acetone (CH₃COCH₃)',
    ],
    correctOption: 1,
    explanation:
      'Aldol condensation strictly requires the presence of at least one α-hydrogen atom adjacent to the carbonyl group to form a resonance-stabilized enolate anion. Benzaldehyde lacks any α-hydrogens on the carbonyl carbon attached to the sp² phenyl ring.',
    trapWarning:
      'Benzaldehyde undergoes Cannizzaro reaction in 50% concentrated base, not self-Aldol in dilute base.',
    pyqReference: 'Nepal CEE Past Benchmark',
    mistakeCategory: 'CONCEPTUAL',
  },
  {
    id: 'chem-03',
    subject: 'Chemistry',
    subSubject: 'Inorganic Chemistry / Coordination Compounds',
    topic: 'Crystal Field Theory & Magnetic Moments',
    difficulty: 'HARD',
    prompt:
      'In an octahedral coordination complex [Fe(CN)₆]³⁻, what is the spin-only magnetic moment in Bohr Magnetons (BM), given that CN⁻ is a strong field ligand?',
    options: ['5.92 BM', '1.73 BM', '3.87 BM', '0 BM'],
    correctOption: 1,
    explanation:
      'In [Fe(CN)₆]³⁻, Fe is in +3 oxidation state: Fe³⁺ has 3d⁵ configuration. Strong field ligand CN⁻ causes extensive crystal field splitting (Δ₀ > P), forcing pairing into t₂g: configuration becomes t₂g⁵ eg⁰, leaving n = 1 unpaired electron. Spin-only formula μ = √(n(n+2)) = √(1(3)) = √3 ≈ 1.73 BM.',
    trapWarning:
      '5.92 BM (Option A) corresponds to weak-field d⁵ (high spin with 5 unpaired electrons, e.g. [Fe(H₂O)₆]³⁺).',
    pyqReference: 'CEE Inorganic Coordination Standard',
    mistakeCategory: 'CALCULATION',
  },
  {
    id: 'chem-04',
    subject: 'Chemistry',
    subSubject: 'Physical Chemistry / Chemical Equilibrium',
    topic: 'Buffer Solutions & Henderson Equation',
    difficulty: 'MODERATE',
    prompt:
      'A buffer solution is prepared by mixing 0.1 M acetic acid (pKa = 4.74) with 0.1 M sodium acetate. What is the pH of this buffer system at 25 °C?',
    options: ['3.74', '4.74', '5.74', '7.00'],
    correctOption: 1,
    explanation:
      'By the Henderson-Hasselbalch equation: pH = pKa + log([Conjugate Base] / [Acid]). Here [CH₃COO⁻] = [CH₃COOH] = 0.1 M. log(0.1/0.1) = log(1) = 0. Therefore pH = pKa = 4.74.',
    trapWarning:
      'Do not assume equimolar mixing yields neutral pH 7; buffer pH is governed by the acid dissociation constant.',
    pyqReference: 'BPKIHS & CEE Core Physical Chemistry',
    mistakeCategory: 'CALCULATION',
  },
  {
    id: 'chem-05',
    subject: 'Chemistry',
    subSubject: 'Organic Chemistry / Aromatic Chemistry',
    topic: 'Electrophilic Aromatic Substitution',
    difficulty: 'CHALLENGER',
    prompt:
      'During the mononitration of toluene using a nitrating mixture (concentrated HNO₃ + concentrated H₂SO₄), what is the active electrophile generated, and what is the directing influence of the methyl group?',
    options: [
      'NO⁺, meta-directing and deactivating',
      'NO₂⁺ (nitronium ion), ortho/para-directing and activating',
      'NO₃⁻, ortho/para-directing and deactivating',
      'NO₂⁻, meta-directing and activating',
    ],
    correctOption: 1,
    explanation:
      'The active electrophile is the nitronium ion (NO₂⁺), produced when sulfuric acid protonates nitric acid: HNO₃ + 2H₂SO₄ ⇌ NO₂⁺ + H₃O⁺ + 2HSO₄⁻. The -CH₃ group is electron-donating via hyperconjugation (+H) and inductive effect (+I), activating the ring toward ortho/para positions.',
    trapWarning:
      'The nitrosonium ion (NO⁺) is used in diazotization of primary aromatic amines, not nitration.',
    pyqReference: 'MEC Organic Chemistry Blueprint',
    mistakeCategory: 'CONCEPTUAL',
  },

  // --- PHYSICS ---
  {
    id: 'phys-01',
    subject: 'Physics',
    subSubject: 'Mechanics / Work, Energy & Power',
    topic: 'Conservation of Linear Momentum',
    difficulty: 'MODERATE',
    prompt:
      'A bullet of mass 0.02 kg travelling horizontally at 300 m/s embeds into a stationary ballistic wooden block of mass 1.98 kg suspended by light cords. What is the common velocity of the block-bullet system immediately after impact?',
    options: ['3.0 m/s', '1.5 m/s', '6.0 m/s', '30 m/s'],
    correctOption: 0,
    explanation:
      'During completely inelastic collision, linear momentum is conserved: m₁u₁ + m₂u₂ = (m₁ + m₂)V. Substituting: (0.02 × 300) + 0 = (0.02 + 1.98)V => 6.0 = 2.0V => V = 3.0 m/s.',
    trapWarning:
      'Common rush error: omitting the bullet mass from the combined denominator (dividing 6 by 1.98 instead of 2.0).',
    pyqReference: 'CEE Past Mechanics Model',
    mistakeCategory: 'CALCULATION',
  },
  {
    id: 'phys-02',
    subject: 'Physics',
    subSubject: 'Modern Physics / Quantum Physics',
    topic: 'Photoelectric Effect & Einstein Equation',
    difficulty: 'MODERATE',
    prompt:
      'If the frequency of incident radiation on a photosensitive metal is doubled while keeping the intensity constant, what happens to the maximum kinetic energy of the emitted photoelectrons?',
    options: [
      'It is exactly doubled',
      'It becomes more than doubled',
      'It remains unchanged because intensity is constant',
      'It increases by a factor of 1.414',
    ],
    correctOption: 1,
    explanation:
      'Einstein equation: K_max = hf - Φ. If frequency doubles to 2f: K_new = 2hf - Φ = 2(hf - Φ) + Φ = 2K_max + Φ. Because work function Φ > 0, K_new is strictly greater than twice the original maximum kinetic energy.',
    trapWarning:
      'Linear proportionality (doubling) applies only if work function is zero, which is physical impossibility for real metals.',
    pyqReference: 'CEE 2022 Core Physics Item',
    mistakeCategory: 'CONCEPTUAL',
  },
  {
    id: 'phys-03',
    subject: 'Physics',
    subSubject: 'Electrostatics & Current Electricity',
    topic: 'Capacitance & Dielectrics',
    difficulty: 'HARD',
    prompt:
      'A parallel-plate capacitor is charged by a DC battery and then DISCONNECTED from the battery. A dielectric slab of dielectric constant K = 4 is now inserted between the plates. What happens to the stored electrostatic energy?',
    options: [
      'Increases by a factor of 4',
      'Decreases by a factor of 4',
      'Remains strictly constant',
      'Increases by a factor of 16',
    ],
    correctOption: 1,
    explanation:
      'When disconnected from the battery, charge Q remains constant. Inserting dielectric increases capacitance to C_new = K C. Stored energy U = Q² / (2C). Since C increases 4-fold with constant Q, U_new = Q² / (2(4C)) = U / 4 (decreases by a factor of 4).',
    trapWarning:
      'If the capacitor remained CONNECTED to the battery (constant voltage V), energy U = 1/2 C V² would have increased 4-fold.',
    pyqReference: 'IOM Past Benchmark Series',
    mistakeCategory: 'INTERPRETATION',
  },
  {
    id: 'phys-04',
    subject: 'Physics',
    subSubject: 'Optics / Wave Optics',
    topic: "Young's Double Slit Experiment (YDSE)",
    difficulty: 'MODERATE',
    prompt:
      "In a Young's double-slit experiment performed in air, fringe width is found to be β. If the entire apparatus is immersed in water having refractive index μ = 4/3 without modifying geometric dimensions, what will be the new fringe width?",
    options: ['4/3 β', '3/4 β', '16/9 β', 'β (unchanged)'],
    correctOption: 1,
    explanation:
      'Fringe width formula: β = (λ D) / d. In water, the wavelength of light decreases to λ_w = λ / μ = λ / (4/3) = (3/4)λ. Since slit separation d and screen distance D are fixed, β_new = (3/4)β.',
    trapWarning:
      'Light frequency remains constant upon entering a denser medium, but wavelength shrinks inversely with refractive index.',
    pyqReference: 'CEE Standard Wave Optics',
    mistakeCategory: 'CALCULATION',
  },
  {
    id: 'phys-05',
    subject: 'Physics',
    subSubject: 'Heat & Thermodynamics',
    topic: 'Carnot Engine & Thermodynamic Efficiency',
    difficulty: 'EASY',
    prompt:
      'A reversible Carnot heat engine operates between source temperature T₁ = 500 K and sink temperature T₂ = 300 K. What is the theoretical maximum thermal efficiency of this engine?',
    options: ['60%', '40%', '25%', '66.7%'],
    correctOption: 1,
    explanation:
      'Carnot efficiency η = 1 - (T₂ / T₁) = 1 - (300 / 500) = 1 - 0.60 = 0.40, which translates to 40%.',
    trapWarning:
      'Ensure temperatures are expressed in Kelvin. 300/500 = 60% represents the heat rejected, NOT the useful efficiency.',
    pyqReference: 'CEE High-Yield Standard',
    mistakeCategory: 'CALCULATION',
  },

  // --- MAT (Mental Agility Test) ---
  {
    id: 'mat-01',
    subject: 'MAT',
    subSubject: 'Analytical Deduction',
    topic: 'Blood Relations & Medical Genetics Logic',
    difficulty: 'MODERATE',
    prompt:
      'Pointing to a pedigree chart in a genetics consultation, Dr. Sharma says: "His mother is the only daughter of my mother." How is Dr. Sharma (a male physician) related to the patient in the chart?',
    options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
    correctOption: 1,
    explanation:
      '"My mother\'s only daughter" means Dr. Sharma\'s sister. The patient\'s mother is Dr. Sharma\'s sister. Therefore, Dr. Sharma is the brother of the patient\'s mother, which is the maternal uncle.',
    trapWarning:
      'Do not rush into assuming "father"; read whether Dr. Sharma himself is the only child or has siblings.',
    pyqReference: 'MEC MAT Syllabus Standard',
    mistakeCategory: 'INTERPRETATION',
  },
  {
    id: 'mat-02',
    subject: 'MAT',
    subSubject: 'Numerical Aptitude',
    topic: 'Rate & Drug Infusion Mathematics',
    difficulty: 'MODERATE',
    prompt:
      'An IV infusion set delivers 20 drops/mL. A pediatric patient requires 500 mL of normal saline over a duration of 4 hours. At what drip rate (in drops per minute) should the IV regulator be set?',
    options: ['42 drops/min', '48 drops/min', '35 drops/min', '25 drops/min'],
    correctOption: 0,
    explanation:
      'Total volume = 500 mL; Total drops = 500 × 20 = 10,000 drops. Total minutes = 4 hours × 60 min = 240 minutes. Drip rate = 10,000 / 240 ≈ 41.67 drops/min, rounded to 42 drops/min.',
    trapWarning:
      'Forgetting to multiply hours by 60 gives 2500 drops/hour, which is unusable at the bedside without minute conversion.',
    pyqReference: 'CEE Clinical Aptitude Model',
    mistakeCategory: 'CALCULATION',
  },
  {
    id: 'mat-03',
    subject: 'MAT',
    subSubject: 'Logical & Abstract Deduction',
    topic: 'Syllogism & Set Logic',
    difficulty: 'HARD',
    prompt:
      'Given the statements:\n1. All surgeons are medical graduates.\n2. Some medical graduates are clinical researchers.\nWhich of the following conclusions logically follows with certainty?',
    options: [
      'All surgeons are clinical researchers',
      'Some clinical researchers are surgeons',
      'Some medical graduates are surgeons',
      'No surgeon is a clinical researcher',
    ],
    correctOption: 2,
    explanation:
      'From statement 1: Since the set of "surgeons" is a proper subset of "medical graduates", it necessarily follows by conversion that "Some medical graduates are surgeons". There is no guaranteed overlap between surgeons and researchers from the given premises.',
    trapWarning:
      'Assuming that some surgeons must be researchers commits the fallacious undistributed middle term.',
    pyqReference: 'MEC MAT Standard Set',
    mistakeCategory: 'CONCEPTUAL',
  },
  {
    id: 'mat-04',
    subject: 'MAT',
    subSubject: 'Spatial & Directional Agility',
    topic: 'Hospital Navigation & Compass Vectors',
    difficulty: 'MODERATE',
    prompt:
      'A doctor leaves the operating room and walks 50 m South to the pharmacy, turns West and walks 40 m to the ICU, then turns North and walks 20 m to radiology. How far and in what direction is the doctor now from the operating room?',
    options: [
      '50 m, South-West',
      '60 m, South-East',
      '40 m, Due West',
      '70 m, South-West',
    ],
    correctOption: 0,
    explanation:
      'Net vertical displacement = 50 m South - 20 m North = 30 m South. Net horizontal displacement = 40 m West. Net distance = √(30² + 40²) = √(900 + 1600) = √2500 = 50 m in the South-West direction.',
    trapWarning:
      'Option D (70 m) is the scalar sum (30 + 40), failing to compute vector hypotenuse.',
    pyqReference: 'CEE Mental Agility Benchmark',
    mistakeCategory: 'CALCULATION',
  },
  {
    id: 'mat-05',
    subject: 'MAT',
    subSubject: 'Numerical & Letter Coding',
    topic: 'Pattern Recognition',
    difficulty: 'EASY',
    prompt:
      'In a diagnostic coding cipher, if HEART is coded as JGCVT (+2 shift for each letter), how is BRAIN coded under the exact same transformation?',
    options: ['DTCKP', 'CTCKP', 'DTBKO', 'ESDJP'],
    correctOption: 0,
    explanation:
      'Each character shifts forward by 2 positions: B (2+2=4: D), R (18+2=20: T), A (1+2=3: C), I (9+2=11: K), N (14+2=16: P). Result: DTCKP.',
    trapWarning:
      'Option B fails at the first letter by advancing B by only 1 position to C.',
    pyqReference: 'CEE MAT Pattern Cipher',
    mistakeCategory: 'MEMORY_RECALL',
  },
];

// -----------------------------------------------------------------------------
// MOCK EXAM CATALOG DEFINITIONS
// -----------------------------------------------------------------------------

export const MOCK_EXAMS_CATALOG: readonly MockExamDefinition[] = [
  {
    id: 'cee-grand-mock-01',
    title: 'Nepal CEE Grand Mock Test — Model 01',
    shortDescription:
      'Authentic full-length examination simulation matching the verified MEC CEE 200-question blueprint: Biology (80), Chemistry (50), Physics (50), and MAT (20).',
    category: 'FULL_MOCK',
    categoryLabel: 'Full CEE Mock',
    difficulty: 'HARD',
    questionCount: 20, // Demonstration active pool of 20 high-yield questions covering all 4 subjects
    durationMinutes: 25, // 25 min timed simulation for active frontend evaluation
    totalMarks: 20,
    isAvailable: true,
    isDemo: true,
    tier: 'FREE',
    subjectsIncluded: ['Biology', 'Chemistry', 'Physics', 'MAT'],
    questions: MOCK_QUESTIONS_POOL,
  },
  {
    id: 'cee-bio-mastery',
    title: 'CEE Biology High-Yield Master Sprint',
    shortDescription:
      'Targeted 40% weightage drill focusing on Zoology physiology, human organ systems, cellular genetics, and Botany plant pathways.',
    category: 'SUBJECT_TEST',
    categoryLabel: 'Subject-wise Test',
    subject: 'Biology',
    difficulty: 'MODERATE',
    questionCount: 5,
    durationMinutes: 8,
    totalMarks: 5,
    isAvailable: true,
    isDemo: true,
    tier: 'FREE',
    subjectsIncluded: ['Biology'],
    questions: MOCK_QUESTIONS_POOL.filter((q) => q.subject === 'Biology'),
  },
  {
    id: 'cee-chem-sprint',
    title: 'Chemistry Mechanics & Stoichiometry Sprint',
    shortDescription:
      'Numerical thermodynamics, equilibrium kinetics, coordinate ligands, and key organic reaction mechanisms with trap warnings.',
    category: 'SUBJECT_TEST',
    categoryLabel: 'Subject-wise Test',
    subject: 'Chemistry',
    difficulty: 'MODERATE',
    questionCount: 5,
    durationMinutes: 8,
    totalMarks: 5,
    isAvailable: true,
    isDemo: true,
    tier: 'FREE',
    subjectsIncluded: ['Chemistry'],
    questions: MOCK_QUESTIONS_POOL.filter((q) => q.subject === 'Chemistry'),
  },
  {
    id: 'cee-phys-numerical',
    title: 'Physics Core Derivation & Numerical Challenge',
    shortDescription:
      'Rapid projectile momentum, wave optics fringe derivations, photoelectric equations, and thermodynamic engine limits.',
    category: 'SUBJECT_TEST',
    categoryLabel: 'Subject-wise Test',
    subject: 'Physics',
    difficulty: 'HARD',
    questionCount: 5,
    durationMinutes: 8,
    totalMarks: 5,
    isAvailable: true,
    isDemo: true,
    tier: 'FREE',
    subjectsIncluded: ['Physics'],
    questions: MOCK_QUESTIONS_POOL.filter((q) => q.subject === 'Physics'),
  },
  {
    id: 'cee-mat-accelerator',
    title: 'Mental Agility Test (MAT) Speed Accelerator',
    shortDescription:
      '20-mark MEC component practice: deductive syllogisms, infusion flow math, directional vectors, and rapid visual logic.',
    category: 'TIMED_PRACTICE',
    categoryLabel: 'Timed Practice',
    subject: 'MAT',
    difficulty: 'MODERATE',
    questionCount: 5,
    durationMinutes: 6,
    totalMarks: 5,
    isAvailable: true,
    isDemo: true,
    tier: 'FREE',
    subjectsIncluded: ['MAT'],
    questions: MOCK_QUESTIONS_POOL.filter((q) => q.subject === 'MAT'),
  },
  {
    id: 'cee-revision-pyq',
    title: 'CEE Benchmark High-Frequency Revision Drill',
    shortDescription:
      'Curated recurring conceptual traps and past year high-yield benchmark patterns across recent medical entrance examination cycles.',
    category: 'REVISION_TEST',
    categoryLabel: 'Revision Test',
    difficulty: 'MODERATE',
    questionCount: 12,
    durationMinutes: 15,
    totalMarks: 12,
    isAvailable: true,
    isDemo: true,
    tier: 'FREE',
    subjectsIncluded: ['Biology', 'Chemistry', 'Physics', 'MAT'],
    questions: MOCK_QUESTIONS_POOL.slice(0, 12),
  },
  {
    id: 'cee-challenger-rank-booster',
    title: 'Top-100 Rank Booster Elite Challenge',
    shortDescription:
      'Challenger and Hard difficulty items designed to test deep conceptual integration, multi-step calculations, and clinical traps.',
    category: 'CHALLENGE_TEST',
    categoryLabel: 'Challenge Test',
    difficulty: 'CHALLENGER',
    questionCount: 8,
    durationMinutes: 12,
    totalMarks: 8,
    isAvailable: true,
    isDemo: true,
    tier: 'PRO',
    subjectsIncluded: ['Biology', 'Chemistry', 'Physics', 'MAT'],
    questions: MOCK_QUESTIONS_POOL.filter(
      (q) => q.difficulty === 'HARD' || q.difficulty === 'CHALLENGER',
    ),
  },
];

// -----------------------------------------------------------------------------
// RESULT & MISTAKE ANALYSIS ENGINE
// -----------------------------------------------------------------------------

export function calculateMockExamResult(
  exam: MockExamDefinition,
  answers: Record<string, number>,
  markedQuestions: string[],
  timeSpentSeconds: number,
): ExamAttemptResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const subjectsMap = new Map<ExamSubject, {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    unanswered: number;
  }>();

  for (const sub of exam.subjectsIncluded) {
    subjectsMap.set(sub, { total: 0, attempted: 0, correct: 0, incorrect: 0, unanswered: 0 });
  }

  const mistakeCategoryMap = new Map<MistakeCategory, MockQuestion[]>([
    ['CONCEPTUAL', []],
    ['CALCULATION', []],
    ['MEMORY_RECALL', []],
    ['INTERPRETATION', []],
    ['TIME_MANAGEMENT', []],
  ]);

  const weakTopicsMap = new Map<string, { topic: string; subject: ExamSubject; count: number }>();

  for (const question of exam.questions) {
    const subStats = subjectsMap.get(question.subject) || {
      total: 0,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
    };
    subStats.total += 1;

    const answer = answers[question.id];
    if (answer === undefined) {
      unansweredCount += 1;
      subStats.unanswered += 1;
      mistakeCategoryMap.get('TIME_MANAGEMENT')?.push(question);
    } else if (answer === question.correctOption) {
      correctCount += 1;
      subStats.attempted += 1;
      subStats.correct += 1;
    } else {
      incorrectCount += 1;
      subStats.attempted += 1;
      subStats.incorrect += 1;

      // Classify error
      const cat = question.mistakeCategory || 'CONCEPTUAL';
      mistakeCategoryMap.get(cat)?.push(question);

      // Track weak topic
      const key = `${question.subject}::${question.topic}`;
      const existing = weakTopicsMap.get(key) || {
        topic: question.topic,
        subject: question.subject,
        count: 0,
      };
      existing.count += 1;
      weakTopicsMap.set(key, existing);
    }

    subjectsMap.set(question.subject, subStats);
  }

  // CEE Standard Scoring: +1.0 for correct, -0.25 for incorrect
  const positive = correctCount * CEE_EXAM_CONSTANTS.POSITIVE_MARK;
  const negative = incorrectCount * Math.abs(CEE_EXAM_CONSTANTS.NEGATIVE_MARK);
  const netScore = Math.max(0, Number((positive - negative).toFixed(2)));
  const maxScore = exam.questions.length * CEE_EXAM_CONSTANTS.POSITIVE_MARK;
  const percentage = maxScore > 0 ? Number(((netScore / maxScore) * 100).toFixed(1)) : 0;
  const attemptedTotal = correctCount + incorrectCount;
  const accuracy = attemptedTotal > 0 ? Number(((correctCount / attemptedTotal) * 100).toFixed(1)) : 0;

  const subjectBreakdowns: SubjectBreakdown[] = Array.from(subjectsMap.entries()).map(
    ([subject, stats]) => {
      const subScore = Math.max(
        0,
        Number(
          (
            stats.correct * CEE_EXAM_CONSTANTS.POSITIVE_MARK -
            stats.incorrect * Math.abs(CEE_EXAM_CONSTANTS.NEGATIVE_MARK)
          ).toFixed(2),
        ),
      );
      const subAttempted = stats.correct + stats.incorrect;
      const subAccuracy =
        subAttempted > 0 ? Number(((stats.correct / subAttempted) * 100).toFixed(1)) : 0;
      return {
        subject,
        totalQuestions: stats.total,
        attempted: subAttempted,
        correct: stats.correct,
        incorrect: stats.incorrect,
        unanswered: stats.unanswered,
        score: subScore,
        accuracy: subAccuracy,
      };
    },
  );

  const mistakeDescriptions: Record<MistakeCategory, { label: string; desc: string }> = {
    CONCEPTUAL: {
      label: 'Core Concept Misalignments',
      desc: 'Errors where fundamental biochemical, anatomical, or physical laws were misapplied.',
    },
    CALCULATION: {
      label: 'Calculation & Derivation Slips',
      desc: 'Mathematical errors, formula missteps, or decimal unit conversion slips.',
    },
    MEMORY_RECALL: {
      label: 'Factual & Terminology Gaps',
      desc: 'Lapses in retaining high-yield anatomical names, enzyme cofactors, or periodic properties.',
    },
    INTERPRETATION: {
      label: 'Question Interpretation Errors',
      desc: 'Rushing through question qualifiers like "except", "not", "isovolumetric", or directional vectors.',
    },
    TIME_MANAGEMENT: {
      label: 'Pacing & Unattempted Questions',
      desc: 'Questions left blank due to time allocation pressure or hesitation.',
    },
  };

  const mistakeBreakdowns: MistakeBreakdown[] = Array.from(mistakeCategoryMap.entries()).map(
    ([category, questions]) => ({
      category,
      label: mistakeDescriptions[category].label,
      description: mistakeDescriptions[category].desc,
      count: questions.length,
      questions,
    }),
  );

  const weakTopics = Array.from(weakTopicsMap.values())
    .sort((a, b) => b.count - a.count)
    .map((item) => ({ topic: item.topic, subject: item.subject, mistakes: item.count }));

  return {
    attemptId: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    examId: exam.id,
    examTitle: exam.title,
    completedAt: new Date().toISOString(),
    totalQuestions: exam.questions.length,
    answeredCount: attemptedTotal,
    unansweredCount,
    markedCount: markedQuestions.length,
    correctCount,
    incorrectCount,
    score: netScore,
    maxScore,
    percentage,
    accuracy,
    timeSpentSeconds,
    totalDurationSeconds: exam.durationMinutes * 60,
    answers,
    markedQuestions,
    subjectBreakdowns,
    mistakeBreakdowns,
    weakTopics,
    isDemo: true,
  };
}

// -----------------------------------------------------------------------------
// LOCAL ATTEMPTS STORAGE (Safe for Client Rendering)
// -----------------------------------------------------------------------------

const ATTEMPTS_STORAGE_KEY = 'cee_mock_attempts_history_v1';

export function getStoredAttempts(): ExamAttemptResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttemptToStorage(attempt: ExamAttemptResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredAttempts();
    const updated = [attempt, ...existing.filter((a) => a.attemptId !== attempt.attemptId)].slice(
      0,
      20,
    );
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or restricted environment
  }
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}
