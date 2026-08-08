# Batch 05 Overview

Batch 05 defines the Unified Library, editorial catalog, metadata, rights, provenance, editions,
digital assets, reservations, search projection, duplicate review, and publication readiness foundation.

Target flow:

Project -> Document Master -> Work -> Editorial Catalog -> Rights + Provenance -> Edition -> Unified Library -> Publication Readiness.

## Scope

- Canonical Work model.
- Original edition identity.
- Canonical Edition model.
- Work/edition/resource relationships.
- Canonical editorial metadata and metadata history.
- Contributors and edition contributor roles.
- Canonical rights records and rights evaluation.
- Public-domain validation.
- Provenance records.
- Digital asset records and integrity status.
- Unified Library records and reservations.
- Locale-aware catalog search/sort projection.
- Publication readiness evaluation.
- Duplicate detection and controlled consolidation rules.

## Non-Scope

- Final publishing engine.
- PDF, EPUB, print, audio, video, or distribution generation.
- External storage provider integration.
- Legal workflow engine.
- Destructive migration or table renaming.
- A separate archive, magazine archive, or reserved-work repository.

## Implementation Position

Batch 05 is implemented as a canonical shared contract and runtime persistence foundation over the existing
Library, Rights & Provenance, Public Portal, Commerce, Projects, Documents, Author Studio, Workflow, and
Export modules. Existing APIs remain compatible.

## Closure Rule

Any editorial resource must be representable as a Work, linked to the exact original/source edition,
cataloged with versioned metadata, associated with rights and provenance, registered in the Unified Library,
and evaluated for publication readiness without duplicating the source of truth.
