# Documentation Governance Migration Plan

## Document Control

- Title: Documentation Governance Migration Plan.
- Identifier: FRAMEWORK-08-MIGRATION-PLAN.
- Version: 1.0.
- Status: Active specification.
- Owner: Documentation Governance.
- Reviewers: Platform Architecture, Engineering Governance, Release
  Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/documentation-governance/overview.md`,
  `docs/frameworks/documentation-governance/compliance-audit.md`.
- References: `docs/codex/codex-consolidation-report.md`,
  `docs/codex/module-catalog.md`.
- Change history:
  - 1.0: Initial migration plan.

## Purpose

This document defines the prioritized plan for consolidating, standardizing,
and governing all Laborator Editura documentation under Framework 08.

## Migration Principles

The migration must:

- Preserve existing validated documentation.
- Avoid disruptive rewrites.
- Avoid loss of historical context.
- Preserve module references and dependencies.
- Standardize incrementally.
- Prefer canonical cross-references over duplicated definitions.
- Keep documentation changes separate from runtime implementation unless a
  later phase explicitly approves implementation.

## Phase 1 - Baseline Framework Activation

Status: Complete.

Deliverables:

- Create Framework 08 documentation set.
- Register Framework 08 in root governance documents.
- Record baseline inventory.
- Identify major gaps, overlaps, and duplication risks.

## Phase 2 - Metadata Normalization

Actions:

- Add document control blocks to high-priority architecture and framework
  documents.
- Normalize status values.
- Normalize version metadata.
- Add owner and reviewer metadata.
- Add references and dependencies where missing.

Priority documents:

- `SPEC.md`.
- `ROADMAP.md`.
- `AGENTS.md`.
- `docs/MANIFEST.md`.
- `docs/DEVELOPMENT_CONVENTIONS.md`.
- `docs/ARCHITECTURE_CHAPTER_*.md`.
- `docs/codex`.
- `docs/frameworks`.

## Phase 3 - Canonical Glossary Registry

Actions:

- Define canonical terms with UUIDs.
- Add definitions, aliases, domains, owners, approval status, versions, and
  usage examples.
- Link terms to modules and frameworks.
- Mark deprecated aliases.
- Record terminology conflicts.

Priority terms:

- Human Final Authority.
- Need-to-Know.
- Platform Language.
- Original Language.
- Authoring Language.
- Target Language.
- JSON Master.
- Translation Memory.
- Semantic Fidelity.
- Rights and Provenance.
- Editorial Production Pipeline.
- Documentation as Code.

## Phase 4 - Traceability Matrix

Actions:

- Create a documentation traceability matrix.
- Link requirements to modules.
- Link modules to API contracts.
- Link API contracts to tests where available.
- Link workflows to validation reports.
- Link frameworks to migration plans.

## Phase 5 - Duplicate Consolidation

Actions:

- Identify repeated definitions.
- Assign canonical owner documents.
- Replace conflicting text with references.
- Preserve module-specific notes.
- Archive or mark superseded content when needed.

High-priority overlap areas:

- Human Final Authority.
- AI governance.
- Security and Need-to-Know.
- Data governance and JSON Master.
- Publishing, export, preflight, and distribution.
- Language policy and localization.

## Phase 6 - Review and Publication Workflow

Actions:

- Define reviewer assignments for major documentation areas.
- Add approval metadata to active specifications.
- Add publication checklist to release operations.
- Record documentation approval decisions.

## Phase 7 - Searchability and Knowledge Reuse

Actions:

- Add indexes where missing.
- Improve module catalog coverage.
- Add metadata for future search indexing.
- Prepare documentation for future knowledge graph and AI retrieval use.

## Phase 8 - Continuous Compliance

Actions:

- Run periodic documentation audits.
- Report missing metadata.
- Report unresolved duplicates.
- Report broken references.
- Report glossary conflicts.
- Keep roadmap and module catalog synchronized.

## Prioritized Roadmap

1. Maintain Framework 08 as the canonical documentation governance layer.
2. Normalize metadata for root and architecture documents.
3. Build the canonical glossary registry.
4. Create the traceability matrix.
5. Consolidate duplicates by ownership.
6. Complete user and administrator manuals.
7. Add documentation publication checks to release readiness.
8. Prepare future searchable documentation portal only after approval.

## Non-Goals

This migration plan does not authorize:

- Runtime code changes.
- API changes.
- Database schema changes.
- UI changes.
- Docker or staging changes.
- Automated document approval.
