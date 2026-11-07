export type SubjectCategory = 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';

export type PlatformDifficulty = 'Foundation' | 'Intermediate' | 'Advanced' | 'CEE Challenge';

export type QuestionFormat = 'Single Best Response' | 'Assertion & Reason' | 'Match the Following';

export interface DemoOption {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  distractorExplanation: string;
}

export interface InteractiveDemoQuestion {
  id: string;
  questionNumber: number;
  subject: SubjectCategory;
  subSubject: string;
  topic: string;
  difficulty: PlatformDifficulty;
  format: QuestionFormat;
  prompt: string;
  options: DemoOption[];
  correctExplanation: string;
  whyOthersIncorrect: { label: string; text: string }[];
  highYieldTakeaway: string;
  syllabusDisclaimer: string;
}

export interface TopicSample {
  id: string;
  name: string;
  subject: SubjectCategory;
  subSubject: string;
  difficulty: PlatformDifficulty;
  format: QuestionFormat;
  yieldLevel: 'High Yield' | 'Core Concept' | 'Clinical Application';
  sampleQuestionPrompt: string;
  keyConcepts: string[];
}
