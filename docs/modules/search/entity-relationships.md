# Entity Relationships

## Purpose

Entity relationships define how the platform links works, people, concepts,
languages, translations, editions, media, rights, and publication artifacts.

## Relationship Rules

- Relationships must be explicit.
- Relationships must preserve provenance.
- Relationships must preserve source version references.
- Relationships must be tenant-scoped.
- Relationship confidence must be recorded.
- AI-suggested relationships must be distinguishable from human-validated
  relationships.
- Relationships must not expose hidden resources to unauthorized users.

## Canonical Relationship Types

Editorial relationships:

- `wrote`.
- `edited`.
- `reviewed`.
- `proofread`.
- `translated`.
- `illustrated`.
- `narrated`.
- `published`.

Structural relationships:

- `contains`.
- `part_of`.
- `chapter_of`.
- `section_of`.
- `paragraph_of`.
- `segment_of`.
- `version_of`.
- `replaces`.

Knowledge relationships:

- `references`.
- `cites`.
- `defines`.
- `synonym_of`.
- `antonym_of`.
- `related_to`.
- `derived_from`.
- `influenced_by`.

Media relationships:

- `has_image`.
- `has_audio`.
- `has_video`.
- `has_subtitle`.
- `localized_as`.
- `synchronized_with`.

Rights relationships:

- `authorized_by`.
- `owned_by`.
- `licensed_under`.
- `restricted_by`.

## Current Repository Baseline

Current relationship foundations include:

- Research `fromEntityId`, `toEntityId`, and `relationshipType`.
- Library publication, edition, version, file, project, and manuscript
  metadata.
- Rights and Provenance records linking projects, documents, rights holders,
  authors, translators, reviewers, and publishers.
- Translation alignment through document segments and segment translations.
- Lexicographic citations and source references.
- Public Portal publication and distribution records.

## Relationship Visibility

Relationship visibility must be evaluated from:

- Source entity visibility.
- Target entity visibility.
- Relationship classification.
- IAM role.
- Need-to-Know scope.
- Project/document assignment.
- Workflow state.
- Rights restrictions.

If either side of a relationship is hidden, the relationship must not reveal
restricted metadata.

## Conflict Handling

Conflicting relationships require:

- Conflict reason.
- Affected entities.
- Evidence sources.
- Confidence.
- Human review status.
- Audit record.

## Gaps

- Relationship types are not centralized.
- Relationship confidence and provenance are not standardized across modules.
- Graph visibility evaluation is not centralized.
- Conflict handling is module-specific.
