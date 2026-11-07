# Curriculum Data and Provenance

The `apps.curriculum` Django app stores source-backed curriculum data. It does
not assume subject names, topics, marks, or examination cycles from the frontend
or shared TypeScript contracts.

## Data model

- `CurriculumSource` records a source title, URL, issuing publisher, optional
  publication date and document identifier, applicable examination cycle,
  verification state, reviewer, verification time, and private review notes.
- `CurriculumVersion` binds one source to an immutable version for an
  examination cycle.
- `CurriculumSubject` belongs to a version and has a stable version-scoped slug.
- `CurriculumTopic` belongs to a subject, optionally references a parent topic,
  and records a page/section locator within the version's source.

Foreign keys protect referenced source, version, subject, and parent records.
Unique constraints prevent duplicate version identifiers per cycle and duplicate
subject/topic identifiers within their scope. Topics cannot cross subject
boundaries or contain cycles. Publishing requires a verified source, at least
one published subject, and published topics. Published records are immutable;
corrections are represented by new versions rather than overwriting history.

## Publication and API

Authorized Django admin staff create source and draft curriculum records. The
source verification action stores the reviewer and verification timestamp. A
separate version publication action validates source verification and all
publication requirements in a transaction.

`GET /api/v1/curriculum/versions/` is the public read-only endpoint. It filters
for published versions with verified sources, returns source provenance and
published subjects/topics, supports exact `exam_cycle` filtering, and uses the
standard API pagination envelope. It omits reviewer identities and internal
verification notes. No public write endpoint exists.

The syllabus page consumes this endpoint and explicitly distinguishes an empty
published catalogue from an API failure. No sample or fallback curriculum facts
are rendered as verified content.

## Source verification gate

No curriculum records are included in the migration or repository. A source
must be verified against the official Medical Education Commission document and
the applicable examination cycle before an administrator marks it verified and
publishes a version. If the official source or cycle cannot be established,
leave the records unpublished and the syllabus page in its not-yet-verified
state.
