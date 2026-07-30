# Architecture Decision Records

Architecture Decision Records preserve major architectural choices,
alternatives, consequences, approvals, reviewers, implementation status, and
supersession history.

## ADR Requirement

All major architectural decisions must be documented through ADRs before
implementation when they affect:

- Platform architecture.
- Application architecture.
- Module boundaries.
- Data ownership.
- Database technology.
- API standards.
- Integration patterns.
- Security architecture.
- AI architecture.
- Infrastructure architecture.
- DevSecOps process.
- Quality gates.
- Runtime dependencies.
- Public or publication-facing behavior.

## ADR Record

Each ADR includes:

- `id`.
- `title`.
- `context`.
- `decision`.
- `alternatives`.
- `consequences`.
- `approvalDate`.
- `reviewers`.
- `implementationStatus`.
- `supersedesAdrId`.

## Implementation Status

Recommended statuses:

- `PROPOSED`.
- `APPROVED`.
- `IMPLEMENTED`.
- `PARTIALLY_IMPLEMENTED`.
- `SUPERSEDED`.
- `REJECTED`.
- `RETIRED`.

## Current ADR Baseline

The repository contains extensive architecture chapters and module
specifications, but no dedicated ADR directory or structured ADR registry was
found during baseline inspection.

Existing architecture decisions are currently embedded in:

- `docs/MANIFEST.md`.
- `docs/DEVELOPMENT_CONVENTIONS.md`.
- `SPEC.md`.
- `ROADMAP.md`.
- `AGENTS.md`.
- `docs/ARCHITECTURE_CHAPTER_*.md`.
- Module specification documents under `docs/modules`.

## Governance Rules

- ADRs are immutable after approval except for implementation status,
  supersession metadata, and audit references.
- Superseded ADRs remain visible and auditable.
- ADRs must reference impacted capabilities, modules, standards, and roadmap
  items.
- Deviations from approved ADRs require authorized review and audit.
- AI may draft ADR summaries but may not approve ADRs.

## Migration Guidance

Future implementation should:

1. Create an ADR registry.
2. Convert existing major architecture decisions into initial ADR records.
3. Link ADRs to modules, capabilities, standards, and roadmap items.
4. Define ADR approval workflow.
5. Add ADR compliance checks to Quality Assurance and DevSecOps gates.
