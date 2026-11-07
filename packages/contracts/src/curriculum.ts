export type CurriculumVerificationStatus = 'VERIFIED';

export interface CurriculumSourceRecord {
  title: string;
  url: string;
  publisher: string;
  publication_date: string | null;
  exam_cycle: string;
  source_version: string;
  verification_status: CurriculumVerificationStatus;
  verified_at: string;
}

export interface CurriculumTopicRecord {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  parent_id: string | null;
  source_reference: string;
}

export interface CurriculumSubjectRecord {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  topics: CurriculumTopicRecord[];
}

export interface CurriculumVersionRecord {
  id: string;
  version_identifier: string;
  exam_cycle: string;
  effective_date: string | null;
  published_at: string;
  source: CurriculumSourceRecord;
  subjects: CurriculumSubjectRecord[];
}
