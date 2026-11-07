/**
 * Nepal Medical Education Commission (MEC) CEE Specification Contracts
 */

export type CEESubject = 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS' | 'MAT';

export type CEESubSubject =
  | 'ZOOLOGY'
  | 'BOTANY'
  | 'PHYSICAL_CHEMISTRY'
  | 'INORGANIC_CHEMISTRY'
  | 'ORGANIC_CHEMISTRY'
  | 'MECHANICS'
  | 'HEAT_THERMODYNAMICS'
  | 'WAVES_SOUND'
  | 'OPTICS'
  | 'ELECTROSTATICS_MAGNETISM'
  | 'MODERN_PHYSICS'
  | 'MAT_VERBAL'
  | 'MAT_NUMERICAL'
  | 'MAT_ABSTRACT';

export interface CEESubjectWeight {
  subject: CEESubject;
  totalMarks: number;
  questionCount: number;
}

export const CEE_EXAM_CONSTANTS = {
  TOTAL_QUESTIONS: 200,
  TOTAL_MARKS: 200,
  DURATION_MINUTES: 180,
  POSITIVE_MARK: 1.0,
  NEGATIVE_MARK: -0.25,
  SUBJECT_DISTRIBUTION: {
    BIOLOGY: 80,
    CHEMISTRY: 50,
    PHYSICS: 50,
    MAT: 20,
  } as const,
} as const;

export type TargetProgram =
  'MBBS' | 'BDS' | 'BSC_NURSING' | 'BASLP' | 'B_PHARM' | 'BAMS' | 'BPT' | 'B_OPTOM' | 'B_PERF_TECH';

export type QuestionDifficulty = 'EASY' | 'MODERATE' | 'HARD' | 'CHALLENGER';

export type QuestionType = 'SINGLE_CHOICE' | 'ASSERTION_REASON' | 'MATCH_FOLLOWING' | 'IMAGE_BASED';
