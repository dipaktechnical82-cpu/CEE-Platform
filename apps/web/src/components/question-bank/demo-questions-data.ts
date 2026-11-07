import type { InteractiveDemoQuestion, TopicSample } from './types';

export const DEMO_QUESTIONS: InteractiveDemoQuestion[] = [
  {
    id: 'demo-q1-mitochondria',
    questionNumber: 1,
    subject: 'Botany',
    subSubject: 'Cytology & Cell Biology',
    topic: 'Cell Organelles & Respiration',
    difficulty: 'Foundation',
    format: 'Single Best Response',
    prompt:
      'Which cellular organelle is primarily responsible for ATP production during aerobic respiration in eukaryotic cells?',
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Golgi apparatus',
        isCorrect: false,
        distractorExplanation:
          'The Golgi apparatus is specialized for post-translational modification, sorting, and packaging of proteins and lipids into transport vesicles. It does not contain an electron transport chain or ATP synthase for aerobic ATP generation.',
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Mitochondrion',
        isCorrect: true,
        distractorExplanation:
          'Mitochondria house the citric acid (Krebs) cycle within their matrix and the electron transport chain (ETC) along their folded inner cristae, where oxidative phosphorylation via ATP synthase produces the vast majority of cellular ATP.',
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Lysosome',
        isCorrect: false,
        distractorExplanation:
          'Lysosomes are membrane-bound digestive vesicles rich in acid hydrolases (active at pH ~4.5–5.0) that degrade autophagic debris and phagocytosed material; they consume ATP via proton pumps rather than generating it.',
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'Ribosome',
        isCorrect: false,
        distractorExplanation:
          'Ribosomes are ribonucleoprotein complexes responsible for peptide synthesis (mRNA translation). Peptide bond formation actually consumes metabolic energy (ATP and GTP) rather than synthesizing ATP.',
      },
    ],
    correctExplanation:
      'Mitochondria are often designated the powerhouses of eukaryotic cells because their double-membrane architecture accommodates the biochemical machinery of aerobic cellular respiration. The matrix houses the pyruvate dehydrogenase complex and Krebs cycle enzymes, generating NADH and FADH2. These high-energy electron carriers donate electrons to Complexes I–IV on the inner mitochondrial membrane, establishing an electrochemical proton gradient across the intermembrane space that drives ATP synthesis via F0F1-ATP synthase.',
    whyOthersIncorrect: [
      {
        label: 'Golgi apparatus',
        text: 'Functions in vesicular trafficking, glycoprotein processing, and secretory sorting, not oxidative energy generation.',
      },
      {
        label: 'Lysosome',
        text: 'Deals with enzymatic macromolecular degradation; utilizes vacuolar ATPase to maintain an acidic lumen.',
      },
      {
        label: 'Ribosome',
        text: 'Translates messenger RNA into polypeptides using aminoacyl-tRNAs and GTP/ATP energy.',
      },
    ],
    highYieldTakeaway:
      'High-Yield CEE Fact: Mature human mammalian erythrocytes (RBCs) lack mitochondria and nuclei; they depend entirely on anaerobic glycolysis for ATP despite continuously carrying oxygen.',
    syllabusDisclaimer:
      'Illustrative sample question demonstrating platform pedagogy. Not an official MEC question.',
  },
  {
    id: 'demo-q2-cardiology-pacemaker',
    questionNumber: 2,
    subject: 'Zoology',
    subSubject: 'Human Physiology & Cardiology',
    topic: 'Cardiac Conduction & Electrophysiology',
    difficulty: 'Intermediate',
    format: 'Single Best Response',
    prompt:
      'In the human cardiac conduction system, which specialized intrinsic tissue acts as the primary physiological pacemaker due to its highest rate of spontaneous diastolic depolarization?',
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Atrioventricular (AV) node',
        isCorrect: false,
        distractorExplanation:
          'The AV node acts as a latent secondary pacemaker discharging at ~40–60 action potentials per minute. Its physiological purpose in normal conduction is introducing a ~0.09 s delay allowing ventricular filling.',
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Sinoatrial (SA) node',
        isCorrect: true,
        distractorExplanation:
          'The SA node, positioned subepicardially at the junction of the superior vena cava and right atrium, possesses the steepest Phase 4 spontaneous diastolic prepotential (funny Na⁺/HCN and T-type Ca²⁺ currents), generating ~70–80 impulses/min.',
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Bundle of His',
        isCorrect: false,
        distractorExplanation:
          'The common atrioventricular bundle of His conducts action potentials from the AV node across the fibrous cardiac skeleton into the ventricular septum, with an intrinsic subsidiary rate of only ~30–40 bpm.',
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'Purkinje fiber network',
        isCorrect: false,
        distractorExplanation:
          'Purkinje fibers exhibit the fastest conduction velocity (~2–4 m/s) in the myocardium to ensure synchronized ventricular systole, but their intrinsic pacemaker pacing rate is the slowest (~15–30 bpm).',
      },
    ],
    correctExplanation:
      'The SA node rhythm overrides all ectopic latent pacemakers through a phenomenon known as "overdrive suppression". Cells in the SA node have an unstable resting membrane potential characterized by continuous Phase 4 spontaneous diastolic depolarization mediated by inward funny current (If, carried by Na⁺ through HCN channels) followed by transient T-type and long-lasting L-type Ca²⁺ channel activation.',
    whyOthersIncorrect: [
      {
        label: 'AV node',
        text: 'Backup pacemaker (40–60 bpm) whose chief clinical role is conduction slowing to facilitate complete atrial emptying prior to ventricular contraction.',
      },
      {
        label: 'Bundle of His',
        text: 'Conducts impulse through the annulus fibrosus; subsidiary pacemaker rate is 30–40 bpm.',
      },
      {
        label: 'Purkinje network',
        text: 'Fastest conduction velocity (4 m/s) due to abundant gap junctions and large cell diameter, but lowest intrinsic pacing frequency.',
      },
    ],
    highYieldTakeaway:
      'CEE Clinical Rule: The hierarchy of intrinsic cardiac pacemaker automaticity is SA Node (70–80 bpm) > AV Node (40–60 bpm) > Purkinje system (15–30 bpm). The fastest rhythm center commands heart rate.',
    syllabusDisclaimer:
      'Illustrative sample question demonstrating platform pedagogy. Not an official MEC question.',
  },
  {
    id: 'demo-q3-ionic-equilibrium',
    questionNumber: 3,
    subject: 'Chemistry',
    subSubject: 'Physical Chemistry',
    topic: 'Ionic Equilibrium & Auto-ionization',
    difficulty: 'Advanced',
    format: 'Single Best Response',
    prompt:
      'At 25 °C (298 K), pure neutral water has Kw = 1.0 × 10⁻¹⁴ (pH = 7.00). When the temperature of pure water is elevated to 60 °C (333 K), what occurs to Kw and the pH of neutral water?',
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'Kw increases, neutral pH decreases below 7.0, and the water remains strictly neutral',
        isCorrect: true,
        distractorExplanation:
          'Auto-ionization of water (H₂O ⇌ H⁺ + OH⁻) is endothermic (ΔH > 0). Increasing temperature shifts equilibrium rightward (Le Chatelier principle), increasing Kw to ~1.0 × 10⁻¹³. Hence [H⁺] > 10⁻⁷ M so pH < 7.0; however, because [H⁺] remains strictly equal to [OH⁻], water remains chemically neutral.',
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'Kw increases, neutral pH increases above 7.0, and water becomes alkaline',
        isCorrect: false,
        distractorExplanation:
          'pH is defined as -log₁₀[H⁺]. As [H⁺] increases, pH must decrease, not increase. Water does not become alkaline because [OH⁻] does not exceed [H⁺].',
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Kw decreases because heat volatilizes hydrogen ions, keeping pH fixed at 7.0',
        isCorrect: false,
        distractorExplanation:
          'Auto-ionization is endothermic; therefore, according to van \'t Hoff equation, Kw must increase with temperature, not decrease.',
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'Kw and neutral pH are fundamental physical constants that cannot alter with temperature',
        isCorrect: false,
        distractorExplanation:
          'Equilibrium constants (K) are strictly temperature-dependent thermodynamic values. Kw changes nearly tenfold between 0 °C and 60 °C.',
      },
    ],
    correctExplanation:
      'A neutral solution is defined rigorously by [H⁺] = [OH⁻], NOT solely by "pH = 7.0". At 60 °C, Kw ≈ 9.6 × 10⁻¹⁴. For pure water where [H⁺] = [OH⁻] = √Kw ≈ 3.1 × 10⁻⁷ M, the pH = -log₁₀(3.1 × 10⁻⁷) ≈ 6.51. Because [H⁺] is identical to [OH⁻], the water is completely neutral despite having a pH of 6.51.',
    whyOthersIncorrect: [
      {
        label: 'Option B',
        text: 'Misunderstands the negative logarithmic definition of pH and confuses lower numeric pH with acidity when neutrality shifts.',
      },
      {
        label: 'Option C',
        text: 'Violates thermodynamic principle: endothermic dissociation absorbs heat, favoring forward ionization products.',
      },
      {
        label: 'Option D',
        text: 'Fails to recognize that all thermodynamic equilibrium constants vary with temperature.',
      },
    ],
    highYieldTakeaway:
      'Trap Warning: Never equate "neutrality" solely with pH 7.0. True chemical neutrality is [H⁺] = [OH⁻] (or pH = pOH = ½ pKw). At 37 °C (human body temperature), pure water neutrality sits at pH ~6.8.',
    syllabusDisclaimer:
      'Illustrative sample question demonstrating platform pedagogy. Not an official MEC question.',
  },
  {
    id: 'demo-q4-photoelectric-effect',
    questionNumber: 4,
    subject: 'Physics',
    subSubject: 'Modern Physics',
    topic: 'Photoelectric Effect & Quantum Physics',
    difficulty: 'CEE Challenge',
    format: 'Single Best Response',
    prompt:
      'In a photoelectric effect experiment using radiation with frequency greater than threshold frequency (ν > ν₀), the intensity of incident monochromatic radiation is doubled while maintaining frequency constant. How do the maximum kinetic energy (KE_max) of emitted electrons and the saturation photocurrent respond?',
    options: [
      {
        id: 'opt-a',
        label: 'A',
        text: 'KE_max doubles; saturation photocurrent remains constant',
        isCorrect: false,
        distractorExplanation:
          'Doubling light intensity increases the flux of incident photons per second; it does not change the energy of individual photons (E = hν). Therefore KE_max cannot double.',
      },
      {
        id: 'opt-b',
        label: 'B',
        text: 'KE_max remains unchanged; saturation photocurrent doubles',
        isCorrect: true,
        distractorExplanation:
          'Einstein\'s photoelectric equation (KE_max = hν - Φ) shows that maximum kinetic energy depends strictly on photon energy (frequency ν) and work function (Φ). Doubling intensity doubles the number of photons hitting the cathode per second, thereby doubling the rate of emitted photoelectrons and doubling the saturation photocurrent.',
      },
      {
        id: 'opt-c',
        label: 'C',
        text: 'Both KE_max and saturation photocurrent double',
        isCorrect: false,
        distractorExplanation:
          'This is the classical wave theory misconception. Wave theory predicted energy accumulated with intensity, but quantum mechanics established that kinetic energy is purely frequency-dependent.',
      },
      {
        id: 'opt-d',
        label: 'D',
        text: 'Stopping potential increases twofold while photocurrent is halved',
        isCorrect: false,
        distractorExplanation:
          'Stopping potential V₀ = KE_max / e = (hν - Φ)/e is independent of light intensity. Photocurrent is directly proportional to intensity.',
      },
    ],
    correctExplanation:
      'According to Einstein\'s quantum theory of light, light behaves as localized energy packets (quanta/photons) with energy E = hν. Light intensity I is defined as energy incident per unit area per unit time (I = n·hν / (A·t)). Doubling I at constant ν doubles the photon flux n. Since one photon interacts with one conduction electron in an elastic collision, doubling photon flux doubles photoelectron emission per second (saturation current), while electron kinetic energy remains constrained by KE_max = hν - Φ.',
    whyOthersIncorrect: [
      {
        label: 'Option A',
        text: 'Confuses photon quantity (intensity) with photon energy (frequency).',
      },
      {
        label: 'Option C',
        text: 'Classical wave error rejected by Millikan\'s and Einstein\'s experimental confirmations.',
      },
      {
        label: 'Option D',
        text: 'Stopping potential is directly linked to KE_max, which is unaffected by intensity variations.',
      },
    ],
    highYieldTakeaway:
      'CEE Golden Rule: Light frequency determines photon energy, kinetic energy of photoelectrons, and stopping potential. Light intensity determines photon number and saturation photocurrent.',
    syllabusDisclaimer:
      'Illustrative sample question demonstrating platform pedagogy. Not an official MEC question.',
  },
];

export const SAMPLE_TOPICS: TopicSample[] = [
  {
    id: 'topic-bot-1',
    name: 'Plant Cell Structure & Membrane Transport',
    subject: 'Botany',
    subSubject: 'Cytology',
    difficulty: 'Foundation',
    format: 'Single Best Response',
    yieldLevel: 'High Yield',
    sampleQuestionPrompt:
      'Which component of plant cell walls provides tensile resistance against turgor pressure?',
    keyConcepts: ['Cellulose Microfibrils', 'Turgor Mechanics', 'Plasmodesmata'],
  },
  {
    id: 'topic-bot-2',
    name: 'Photosynthetic Light Reactions (Z-Scheme)',
    subject: 'Botany',
    subSubject: 'Plant Physiology',
    difficulty: 'Advanced',
    format: 'Single Best Response',
    yieldLevel: 'High Yield',
    sampleQuestionPrompt:
      'At which molecular complex does photolysis of water occur during non-cyclic photophosphorylation?',
    keyConcepts: ['Oxygen-Evolving Complex (OEC)', 'Photosystem II', 'Plastoquinone'],
  },
  {
    id: 'topic-zoo-1',
    name: 'Human Cardiac Electrophysiology & Pacemakers',
    subject: 'Zoology',
    subSubject: 'Human Physiology',
    difficulty: 'Intermediate',
    format: 'Single Best Response',
    yieldLevel: 'Clinical Application',
    sampleQuestionPrompt:
      'Which ion channel current drives Phase 4 spontaneous diastolic depolarization in nodal tissue?',
    keyConcepts: ['SA Nodal Automaticity', 'HCN Funny Channels', 'AV Nodal Delay'],
  },
  {
    id: 'topic-zoo-2',
    name: 'Renal Countercurrent Multiplication & Osmoregulation',
    subject: 'Zoology',
    subSubject: 'Human Physiology',
    difficulty: 'CEE Challenge',
    format: 'Assertion & Reason',
    yieldLevel: 'High Yield',
    sampleQuestionPrompt:
      'Assertion: The descending limb of the Loop of Henle is permeable to water but impermeable to NaCl.',
    keyConcepts: ['Medullary Hyperosmolality', 'Vasa Recta Exchanger', 'ADH Regulation'],
  },
  {
    id: 'topic-chem-1',
    name: 'Ionic Equilibrium & Buffer Calculations',
    subject: 'Chemistry',
    subSubject: 'Physical Chemistry',
    difficulty: 'Advanced',
    format: 'Single Best Response',
    yieldLevel: 'High Yield',
    sampleQuestionPrompt:
      'How does the pH of blood maintain 7.40 despite metabolic carbonic acid production?',
    keyConcepts: ['Henderson-Hasselbalch', 'Bicarbonate Buffer System', 'Auto-ionization Kw'],
  },
  {
    id: 'topic-chem-2',
    name: 'Coordination Compounds & Crystal Field Theory',
    subject: 'Chemistry',
    subSubject: 'Inorganic Chemistry',
    difficulty: 'Intermediate',
    format: 'Single Best Response',
    yieldLevel: 'Core Concept',
    sampleQuestionPrompt:
      'Which transition metal complex exhibits diamagnetism in an octahedral strong field environment?',
    keyConcepts: ['Crystal Field Splitting (Δo)', 'Spectrochemical Series', 'd-d Transitions'],
  },
  {
    id: 'topic-phys-1',
    name: 'Ray Optics: Total Internal Reflection & Endoscopy',
    subject: 'Physics',
    subSubject: 'Optics',
    difficulty: 'Foundation',
    format: 'Single Best Response',
    yieldLevel: 'Clinical Application',
    sampleQuestionPrompt:
      'What critical condition must be satisfied for total internal reflection in medical optical fibers?',
    keyConcepts: ['Critical Angle', 'Snell\'s Law', 'Fiber Cladding Refraction'],
  },
  {
    id: 'topic-phys-2',
    name: 'Photoelectric Effect & Quantum Nature of Light',
    subject: 'Physics',
    subSubject: 'Modern Physics',
    difficulty: 'CEE Challenge',
    format: 'Single Best Response',
    yieldLevel: 'High Yield',
    sampleQuestionPrompt:
      'How does monochromatic light intensity affect the maximum kinetic energy of emitted photoelectrons?',
    keyConcepts: ['Einstein Equation', 'Work Function', 'Threshold Frequency'],
  },
];
