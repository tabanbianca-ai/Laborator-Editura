# Magazine Module Overview

## Purpose

The Magazine Module manages the complete lifecycle of periodical publications
in Laborator Editura: planning, issues, articles, translation, editorial
review, layout, publication, archive, and distribution.

Each magazine issue is an independent publication unit. Each article remains an
independent Library Item that may be reused across issues, editions, languages,
and publications without duplicating editorial content.

## Status

Phase II - Module 6.

Official implementation specification.

Version: 1.0.

## Scope

The Magazine Module coordinates:

- Magazines.
- Volumes.
- Issues.
- Sections.
- Articles.
- Authors.
- Images and illustrations.
- Covers.
- Translations.
- Versions.
- Issue layout.
- Publishing handoff.
- Archive state.
- Distribution readiness.

## Current Repository Baseline

Current implementation already includes partial magazine foundations:

- Project publication type `MAGAZINE`.
- Project capability `FLIPBOOK`, constrained to magazine projects.
- Library publication type `MAGAZINE` and Library item type `ARTICLE`.
- Author Studio manuscript type `MAGAZINE_ARTICLE`.
- Frontend routes `/magazine` and `/magazine/[issueId]`.
- Magazine Digital Experience frontend for issue list, issue detail, article
  list, flipbook readiness, public portal visibility, article audio preview,
  article video preview, and rights warnings.
- Magazine client that reuses existing Projects, Documents, Rights, and
  language metadata.
- Layout Publishing support for `MAGAZINE` layout plans.
- Publishing and Distribution Center support for magazine flipbook readiness.
- Public Portal support for `MAGAZINE` and `ARTICLE` catalog item types.
- Rights and Provenance warning integration.
- Contract tests for magazine digital experience.

There is no canonical backend `magazine` module yet. Magazine issue,
volume, section, article assignment, layout, archive, and event ownership are
currently inferred from Projects, Documents, Library, Publishing, and frontend
read models.

## Principles

- Issue First.
- Article First.
- Reusable Content.
- Single Source of Truth.
- Modular Publishing.
- Editorial Workflow.
- Metadata First.
- Audit by Default.
- Library First.
- Human Final Authority.

## Canonical Magazine Structure

```text
Magazine
  -> Volumes
  -> Issues
  -> Sections
  -> Articles
  -> Assets
  -> Layout
  -> Publication
```

## Canonical Editorial Flow

```text
Proposal
  -> Draft
  -> Translation
  -> Editorial Review
  -> Approved
  -> Layout
  -> Published
```

## Boundaries

Magazine owns:

- Magazine publication structure.
- Volume and issue organization.
- Section/rubric configuration.
- Article assignment to issues.
- Issue-level layout coordination.
- Issue archive coordination.

Magazine does not own:

- Article content.
- Canonical Library metadata.
- Translation execution.
- Editorial review decisions.
- Rights validation.
- Official publication release.
- Generated artifacts.
- Public catalog visibility.

## Acceptance Criteria

The module is compliant when:

- Every article is represented as an independent Library Item.
- Articles can be reused across issues without content duplication.
- Issues are versioned.
- Layout is decoupled from article content.
- Publication is delegated exclusively to the Publishing Module.
- All changes are audited.
- Translation, Editorial Review, Rights and Provenance, Library, and
  Publishing integrations are preserved.
