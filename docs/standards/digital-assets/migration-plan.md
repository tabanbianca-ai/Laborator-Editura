# Canonical Digital Asset and Editorial Content Migration Plan

## Purpose

This migration plan defines the safe path for aligning all documents, digital
assets, editorial content, derivatives, metadata, relationships, lifecycle
states, rights references, accessibility records, and preservation policies
with Standard 06.

It is incremental and preservation-first. It does not authorize new storage
infrastructure, file upload runtime, media processing runtime, format
conversion runtime, database migrations, API changes, UI changes, Docker
changes, or staging changes by itself.

## Phase 1 - Activate the Standard

Deliverables:

- Reference Standard 06 from `SPEC.md`.
- Reference Standard 06 from `ROADMAP.md`.
- Add Standard 06 directive to `AGENTS.md`.
- Add Standard 06 to the Manifest and Codex catalog.
- Preserve existing Library, Documents, Author Studio, Translation, Rights,
  Publishing, Export, Media, Accessibility, Backup, and JSON Master behavior.

Acceptance criteria:

- Standard 06 is discoverable as the canonical document and digital asset
  standard.
- Existing module documents remain valid as local implementation guidance.
- No runtime changes are introduced.

## Phase 2 - Asset Inventory

Deliverables:

- Inventory manuscripts.
- Inventory documents.
- Inventory translations.
- Inventory books and editions.
- Inventory articles and magazine issues.
- Inventory images and illustrations.
- Inventory audio, narration, and podcast assets.
- Inventory video and animation assets.
- Inventory export artifacts.
- Inventory templates, glossaries, marketing materials, and metadata files.

Acceptance criteria:

- Every asset family has an owner.
- Every asset family maps to a canonical asset type.
- Duplicate and orphan risks are documented.

## Phase 3 - Canonical Master Mapping

Deliverables:

- Map each work to a canonical master.
- Map derivatives to master version.
- Map source manuscript and translated manuscripts.
- Map media assets to source content.
- Map exports to source master version.
- Map public catalog items to publication master.

Acceptance criteria:

- No derivative is treated as source of truth without approved migration.
- Publication and distribution artifacts preserve source master references.

## Phase 4 - Metadata Completeness

Deliverables:

- Define mandatory metadata by asset type.
- Define conditional metadata by publication type and format.
- Define rights metadata coverage.
- Define accessibility metadata coverage.
- Define language metadata coverage.
- Define integrity metadata coverage.

Acceptance criteria:

- Metadata gaps can be measured per asset family.
- Publishing workflows can detect missing required metadata.

## Phase 5 - Relationship Registry Design

Deliverables:

- Define relationship record schema.
- Map original, translation, edition, derivative, adaptation, illustration,
  audio, video, publication, and reference relationships.
- Define orphan detection.
- Define duplicate detection.
- Define impact analysis between master and derivatives.

Acceptance criteria:

- Asset relationships can be traced across editorial, translation, publishing,
  media, public portal, and archive workflows.

## Phase 6 - Lifecycle Alignment

Deliverables:

- Map module workflow states to canonical lifecycle states.
- Define asset lifecycle events.
- Define approval and publication gates.
- Define archive and restoration behavior.
- Define lifecycle audit requirements.

Acceptance criteria:

- Asset state changes are traceable, auditable, and compatible with existing
  workflow behavior.

## Phase 7 - Preservation and Integrity

Deliverables:

- Define preservation formats per asset family.
- Define backup policy per asset family.
- Define retention and archive policy.
- Define deletion restrictions.
- Define integrity verification.
- Define restore validation.

Acceptance criteria:

- Canonical masters, derivatives, rights records, provenance, audit, and
  publication history remain recoverable and verifiable.

## Phase 8 - Continuous Compliance

Deliverables:

- Add checks for assets without canonical master.
- Add checks for derivatives without source version.
- Add checks for missing rights or provenance.
- Add checks for missing accessibility metadata.
- Add checks for missing integrity metadata.
- Add release readiness checklist for content and asset changes.

Acceptance criteria:

- New documents and digital assets cannot bypass Standard 06.
- Exceptions require explicit architecture approval.
- Documentation remains the source of truth until runtime registries are
  implemented.

## Non-Goals

This plan does not implement:

- New storage infrastructure.
- File upload runtime.
- Media processing runtime.
- Format conversion runtime.
- Database migrations.
- API changes.
- UI changes.
- Docker or staging changes.

