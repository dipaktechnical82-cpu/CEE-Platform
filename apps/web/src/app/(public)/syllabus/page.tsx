import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { curriculumApi } from '@/lib/curriculum-api';
import type { CurriculumTopicRecord, CurriculumVersionRecord } from '@cee/contracts';
import { constructMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Nepal CEE Curriculum & Syllabus',
  description:
    'Browse published Nepal CEE curriculum versions with their verified source and examination cycle.',
  path: '/syllabus',
});

interface TopicNode extends CurriculumTopicRecord {
  children: TopicNode[];
}

function topicTree(topics: CurriculumTopicRecord[]): TopicNode[] {
  const nodes = new Map(
    topics.map((topic) => [topic.id, { ...topic, children: [] as TopicNode[] }]),
  );
  const roots: TopicNode[] = [];
  for (const node of nodes.values()) {
    if (node.parent_id) {
      nodes.get(node.parent_id)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function TopicList({ topics }: { topics: TopicNode[] }) {
  if (topics.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2 border-l border-[#D5F3E8] pl-4 text-sm text-[#49666B]">
      {topics.map((topic) => (
        <li key={topic.id}>
          <span>{topic.name}</span>
          {topic.source_reference ? (
            <span className="ml-2 text-xs text-[#71898D]">({topic.source_reference})</span>
          ) : null}
          <TopicList topics={topic.children} />
        </li>
      ))}
    </ul>
  );
}

function CurriculumVersionCard({ version }: { version: CurriculumVersionRecord }) {
  return (
    <article className="rounded-2xl border border-[#D5F3E8] bg-white p-5 shadow-sm sm:p-7">
      <header className="border-b border-[#E5F1EF] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#31828A]">
          Examination cycle
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#244A50]">{version.exam_cycle}</h2>
        <p className="mt-1 text-sm text-[#557177]">
          Curriculum version {version.version_identifier}
          {version.effective_date ? ` · Effective ${version.effective_date.slice(0, 10)}` : ''}
        </p>
      </header>

      {version.subjects.length > 0 ? (
        <div className="mt-5 space-y-4">
          {version.subjects.map((subject) => (
            <section
              aria-labelledby={`subject-${subject.id}`}
              className="rounded-xl bg-[#F5FBFA] p-4 sm:p-5"
              key={subject.id}
            >
              <h3 className="text-lg font-semibold text-[#244A50]" id={`subject-${subject.id}`}>
                {subject.name}
              </h3>
              <TopicList topics={topicTree(subject.topics)} />
              {subject.topics.length === 0 ? (
                <p className="mt-2 text-sm text-[#557177]">
                  No topics are listed in this published source.
                </p>
              ) : null}
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          This verified version has no published subjects available for display.
        </p>
      )}

      <aside className="mt-5 rounded-xl border border-[#D5F3E8] p-4">
        <h3 className="text-sm font-semibold text-[#244A50]">Verified source</h3>
        <p className="mt-1 text-sm font-medium text-[#365C62]">{version.source.title}</p>
        <p className="mt-1 text-sm text-[#557177]">
          {version.source.publisher}
          {version.source.publication_date
            ? ` · Published ${version.source.publication_date.slice(0, 10)}`
            : ''}
          {version.source.source_version ? ` · ${version.source.source_version}` : ''}
        </p>
        <p className="mt-1 text-xs text-[#71898D]">
          Source review verified {version.source.verified_at.slice(0, 10)}
        </p>
        <a
          className="mt-3 inline-flex min-h-11 items-center rounded-lg font-semibold text-[#167A80] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80]"
          href={version.source.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          View source document
        </a>
      </aside>
    </article>
  );
}

export default async function SyllabusPage() {
  let versions: CurriculumVersionRecord[];
  try {
    versions = await curriculumApi.listVersions();
  } catch (error) {
    console.warn('Unable to load published curriculum.', error);
    return (
      <div className="py-12 sm:py-16">
        <Container>
          <header className="mx-auto max-w-4xl border-b border-[#D5F3E8] pb-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#244A50] sm:text-4xl">
              Nepal CEE Curriculum &amp; Syllabus
            </h1>
          </header>
          <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
            <h2 className="font-semibold">Curriculum service unavailable</h2>
            <p className="mt-2 text-sm">
              Published curriculum could not be loaded. Please try again later.
            </p>
            <Link
              className="mt-3 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
              href="/syllabus"
            >
              Retry
            </Link>
          </section>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <header className="mx-auto max-w-4xl border-b border-[#D5F3E8] pb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#31828A]">
            Source-backed information
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#244A50] sm:text-4xl">
            Nepal CEE Curriculum &amp; Syllabus
          </h1>
          <p className="mt-4 text-base leading-7 text-[#557177]">
            Published curriculum is shown with its applicable examination cycle and source. Draft or
            unverified material is not displayed.
          </p>
        </header>

        {versions.length === 0 ? (
          <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6">
            <h2 className="font-semibold">No verified curriculum has been published yet</h2>
            <p className="mt-2 text-sm leading-6">
              The syllabus will appear here after the official MEC source and examination cycle have
              been verified and the curriculum version has been published. Unverified or inferred
              syllabus facts are intentionally withheld.
            </p>
          </section>
        ) : (
          <div className="mx-auto mt-8 max-w-4xl space-y-6">
            {versions.map((version) => (
              <CurriculumVersionCard key={version.id} version={version} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
