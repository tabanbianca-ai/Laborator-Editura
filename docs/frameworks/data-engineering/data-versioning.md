# Data Versioning

## Purpose

Data Versioning ensures that important data changes are traceable,
auditable, restorable where appropriate, and compatible with schema evolution.

## Version First Rule

Important data must be versioned before it is overwritten.

This is mandatory for:

- Manuscripts.
- Documents.
- Segments.
- Translations.
- Terminology.
- Lexicographic decisions.
- Translation Memory.
- Editorial decisions.
- Review proposals.
- Workflow state.
- Publication versions.
- Export artifacts.
- Rights and Provenance records.
- Source authority references.
- Translation rules.
- Data schemas.
- Policies.
- AI prompts and model configuration.

## Version Metadata

Each versioned record should preserve:

- Version id.
- Entity id.
- Version number.
- Previous version id.
- Schema version.
- Created by.
- Created at.
- Change reason.
- Approval status.
- Approved by where applicable.
- Approved at where applicable.
- Source version references.
- Diff or snapshot strategy.
- Restoration rules.

## Schema Versioning

Schemas must preserve:

- Schema id.
- Schema version.
- Effective date.
- Compatibility status.
- Migration path.
- Deprecation status.
- Validation rules.

Rules:

- Schemas cannot be silently overwritten.
- Breaking changes require migration planning.
- Consumers must know which schema version they are reading.

## JSON Master Versioning

JSON Master records must preserve:

- JSON Master format version.
- Project version.
- Document version.
- Segment version.
- Translation version.
- Workflow version.
- Export metadata version.
- Future media localization version metadata.

Generated artifacts must reference the JSON Master version used.

## Rule Versioning

Translation rules, terminology rules, editorial rules, semantic fidelity
rules, and exceptions must be versioned.

Rule versions must preserve:

- Previous rule version.
- New rule version.
- Source authority.
- Authority confidence level.
- Approver.
- Approval date.
- Impact report.

## Current Baseline

Strengths:

- Versioning rules are documented in architecture and module documents.
- Author Studio preserves draft/version concepts.
- Library and publishing include edition and publication version concepts.
- Translation rules and source authority requirements are documented.
- Runtime backup includes schema/version metadata.

Gaps:

- Versioning is not yet uniform across all runtime table families.
- Schema registry implementation is not yet complete.
- Diff strategy is not standardized across all content types.
- Rule version impact analysis is documented but not fully centralized.

## Standardization Plan

1. Inventory every versioned and non-versioned data family.
2. Define versioning strategy per canonical model.
3. Add schema version references to catalog entries.
4. Standardize snapshot versus diff strategy.
5. Link version records to lineage and audit.
6. Add version compatibility checks before migration or export.
