import type {
  CurriculumSourceRecord,
  CurriculumSubjectRecord,
  CurriculumTopicRecord,
  CurriculumVersionRecord,
} from '@cee/contracts';
import { apiClient } from './api-client';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Curriculum response has an invalid ${field}.`);
  }
  return value;
}

function optionalDate(value: unknown, field: string): string | null {
  if (value === null) return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`Curriculum response has an invalid ${field}.`);
  }
  return value;
}

function parseSource(value: unknown, examCycle: string): CurriculumSourceRecord {
  if (!isRecord(value)) {
    throw new Error('Curriculum response has an invalid source.');
  }
  const sourceCycle = requiredString(value.exam_cycle, 'source examination cycle');
  if (sourceCycle !== examCycle || value.verification_status !== 'VERIFIED') {
    throw new Error('Curriculum response contains an unverified or mismatched source.');
  }
  const url = requiredString(value.url, 'source URL');
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Curriculum response has an invalid source URL.');
  }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error('Curriculum response has an unsupported source URL.');
  }

  return {
    title: requiredString(value.title, 'source title'),
    url,
    publisher: requiredString(value.publisher, 'source publisher'),
    publication_date: optionalDate(value.publication_date, 'source publication date'),
    exam_cycle: sourceCycle,
    source_version:
      typeof value.source_version === 'string'
        ? value.source_version
        : (() => {
            throw new Error('Curriculum response has an invalid source version.');
          })(),
    verification_status: 'VERIFIED',
    verified_at: requiredString(value.verified_at, 'source verification date'),
  };
}

function parseTopic(value: unknown): CurriculumTopicRecord {
  if (!isRecord(value)) {
    throw new Error('Curriculum response contains an invalid topic.');
  }
  const displayOrder = value.display_order;
  const parentId = value.parent_id;
  if (
    typeof displayOrder !== 'number' ||
    !Number.isInteger(displayOrder) ||
    (parentId !== null && typeof parentId !== 'string')
  ) {
    throw new Error('Curriculum response contains an invalid topic relationship.');
  }
  return {
    id: requiredString(value.id, 'topic identifier'),
    name: requiredString(value.name, 'topic name'),
    slug: requiredString(value.slug, 'topic slug'),
    display_order: displayOrder,
    parent_id: parentId,
    source_reference:
      typeof value.source_reference === 'string'
        ? value.source_reference
        : (() => {
            throw new Error('Curriculum response contains an invalid source reference.');
          })(),
  };
}

function parseSubject(value: unknown): CurriculumSubjectRecord {
  if (!isRecord(value) || !Array.isArray(value.topics)) {
    throw new Error('Curriculum response contains an invalid subject.');
  }
  const displayOrder = value.display_order;
  if (typeof displayOrder !== 'number' || !Number.isInteger(displayOrder)) {
    throw new Error('Curriculum response contains an invalid subject order.');
  }
  const subject: CurriculumSubjectRecord = {
    id: requiredString(value.id, 'subject identifier'),
    name: requiredString(value.name, 'subject name'),
    slug: requiredString(value.slug, 'subject slug'),
    display_order: displayOrder,
    topics: value.topics.map(parseTopic),
  };
  const topicIds = new Set(subject.topics.map(({ id }) => id));
  if (topicIds.size !== subject.topics.length) {
    throw new Error('Curriculum response contains duplicate topic identifiers.');
  }
  for (const topic of subject.topics) {
    if (topic.parent_id && !topicIds.has(topic.parent_id)) {
      throw new Error('Curriculum response contains a topic without its parent.');
    }
    const ancestors = new Set([topic.id]);
    let parentId = topic.parent_id;
    while (parentId) {
      if (ancestors.has(parentId)) {
        throw new Error('Curriculum response contains a cyclic topic hierarchy.');
      }
      ancestors.add(parentId);
      parentId = subject.topics.find(({ id }) => id === parentId)?.parent_id ?? null;
    }
  }
  return subject;
}

export function parseCurriculumVersions(value: unknown): CurriculumVersionRecord[] {
  if (!Array.isArray(value)) {
    throw new Error('Curriculum service returned an invalid version list.');
  }
  return value.map((item) => {
    if (!isRecord(item) || !Array.isArray(item.subjects)) {
      throw new Error('Curriculum service returned an invalid version.');
    }
    const examCycle = requiredString(item.exam_cycle, 'examination cycle');
    const publishedAt = requiredString(item.published_at, 'publication date');
    if (Number.isNaN(Date.parse(publishedAt))) {
      throw new Error('Curriculum response has an invalid publication date.');
    }
    const source = parseSource(item.source, examCycle);
    return {
      id: requiredString(item.id, 'version identifier'),
      version_identifier: requiredString(item.version_identifier, 'version identifier'),
      exam_cycle: examCycle,
      effective_date: optionalDate(item.effective_date, 'effective date'),
      published_at: publishedAt,
      source,
      subjects: item.subjects.map(parseSubject),
    };
  });
}

export const curriculumApi = {
  listVersions: async () => {
    const versions = await apiClient<unknown>('/curriculum/versions/?page_size=100');
    return parseCurriculumVersions(versions);
  },
};
