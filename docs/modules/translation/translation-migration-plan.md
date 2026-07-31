# Translation Migration Plan

## Purpose

This document defines the incremental path from the current implementation to
the Phase II Translation Module Architecture target.

## Migration Principles

- Additive first.
- Preserve existing APIs until clients migrate.
- Preserve source immutability.
- Preserve validated terminology priority.
- Preserve Translation Memory proposal-only behavior.
- Preserve QA, Semantic Fidelity, and Workflow blocking rules.
- Preserve Phase 7 Step 16 behavior.
- Preserve backup/restore compatibility.
- Do not duplicate editorial content outside Library.

## Phase 1 - Canonical Library Linkage

Objectives:

- Add direct Library Item references to translation project/document/segment
  records where appropriate.
- Define migration mapping from existing project/document references to
  Library identity.

Deliverables:

- Library linkage field mapping.
- Contract tests for translation-to-Library references.

## Phase 2 - Translation Project Aggregate

Objectives:

- Define a top-level Translation Project aggregate.
- Link source Library Item, source document, target languages, segment set,
  workflow state, QA, semantic reports, TM usage, terminology rules, and
  export outputs.

Deliverables:

- Translation project type.
- API contracts.
- Audit events.

## Phase 3 - Segment Versioning

Objectives:

- Formalize immutable segment and translation version lineage.
- Preserve current latest translation pointers.
- Add restore-as-new-version behavior.

Deliverables:

- Segment version model.
- Translation version model.
- Restore contract.

## Phase 4 - Context Standardization

Objectives:

- Standardize chapter, paragraph, author, edition, neighboring segments,
  Library Item, rights, and provenance context.
- Make context available to human translators and AI orchestration.

Deliverables:

- Context schema.
- Context validation.
- AI prompt context contract.

## Phase 5 - AI Orchestration Contract

Objectives:

- Create explicit AI translation execution records.
- Store prompt version, model/provider metadata, evidence sources, cost
  metadata, explanations, alternatives, and human approval state.

Deliverables:

- AI translation execution contract.
- Audit events.
- Provider-independent tests.

## Phase 6 - Quality and Linguistic Expansion

Objectives:

- Add configurable language-specific grammar/style validation.
- Add style rule integration.
- Add version comparison and diff behavior.

Deliverables:

- Language rule configuration.
- Style validation contracts.
- Diff/compare contracts.

## Phase 7 - Search and Performance Hardening

Objectives:

- Optimize Translation Memory lookup.
- Add indexing strategy for large segment corpora.
- Define performance baselines.

Deliverables:

- TM index plan.
- Performance tests.
- Operational KPI hooks.

## Phase 8 - Canonical API Completion

Objectives:

- Add target Translation API routes while preserving current routes.
- Introduce explicit API versioning.

Deliverables:

- `POST /translations`.
- `GET /translations/{id}`.
- `POST /translations/{id}/segments`.
- `POST /translations/{id}/review`.
- `POST /translations/{id}/approve`.
- `POST /translations/search`.

## Codex Governance Reference

The canonical module sequence, dependency closure, and future-extension rule are
maintained in `docs/codex/module-catalog.md`,
`docs/codex/dependency-registry.md`, and `docs/codex/meta-architecture.md`.

This migration plan owns only the local migration strategy for this module. It
does not redefine the platform module sequence, fundamental architecture
closure, or future-extension approval rule.
