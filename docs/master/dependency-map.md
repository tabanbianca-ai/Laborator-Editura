# CEMI Dependency Map

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CEMI-DEPENDENCY-MAP |
| Version | 1.0.0 |
| Status | Official master dependency map |
| Owner | Codex Enterprise Governance |
| Related sources | `docs/codex/dependency-matrix.md`, `docs/codex/dependency-registry.md` |

## Purpose

This document gives the master dependency view for Codex. It does not replace
detailed dependency registries. It points to the graph families that must be
maintained as the repository evolves.

## Standards Graph

```text
Manifest and Development Conventions
-> Standards 01-19
-> Standard 20 Certification
-> Standard 21 Standards Governance
-> CEMI
-> CIMP
```

Canonical source: `docs/codex/dependency-matrix.md`.

## Modules Graph

```text
Identity and Security
-> Projects and Documents
-> Authoring, Translation, Review, Rights
-> Workflow
-> Publishing, Export, Distribution
-> Library, Public Portal, Commerce
-> Observability, Backup, Compliance
```

Canonical source: `docs/codex/module-catalog.md`.

## Services Graph

```text
apps/web
-> apps/api
-> packages/shared
-> packages/db
```

Rules:

- Frontend uses API contracts and must not access the database directly.
- API modules use repository abstractions for persistence.
- Shared canonical models belong in `packages/shared`.
- Runtime persistence and backup helpers belong in `packages/db`.

## API Graph

```text
Public routes
-> API gateway and request context
-> Authenticated controllers
-> Module services
-> Module repositories
-> Runtime database or approved storage abstraction
```

Canonical sources:

- `docs/codex/api-contracts.md`.
- `docs/integration/api-contracts.md`.
- `docs/standards/api-governance/overview.md`.

## Workflow Graph

```text
Project Identity
-> Editorial Pipeline
-> Rights and Language validation
-> Authoring and Translation
-> Review and Quality
-> Layout and Export
-> Preflight
-> Final Approval
-> Publication and Distribution
```

Canonical sources:

- `docs/workflow/workflow-architecture.md`.
- `docs/standards/workflow-governance/overview.md`.
- `docs/PHASE_7_STEP_16_PUBLISHING_PREFLIGHT_DISTRIBUTION_REPORT.md`.

## AI Graph

```text
AI Governance
-> AI Orchestrator
-> Specialized agents and subagents
-> Evidence, recommendations, drafts, and quality reports
-> Human approval gates
-> Audit
```

Rules:

- AI may recommend, explain, draft, and validate.
- AI must not approve, publish, grant rights, modify security, or bypass
  workflow.
- Human Final Authority remains the governing rule.

Canonical sources:

- `AGENTS.md`.
- `docs/frameworks/ai-engineering/overview.md`.
- `docs/standards/ai-assets/overview.md`.
- `docs/modules/ai-governance/ai-governance-overview.md`.

## Database Graph

```text
Conceptual model
-> Logical model
-> Physical model
-> Runtime persistence
-> Backup and restore
-> Audit and retention
```

Canonical sources:

- `docs/ARCHITECTURE_CHAPTER_4.md`.
- `docs/ARCHITECTURE_CHAPTER_5.md`.
- `docs/ARCHITECTURE_CHAPTER_6.md`.
- `docs/data/logical-data-model.md`.
- `docs/database/physical-data-model.md`.
- `packages/db`.

## Documentation Graph

```text
CEMI
-> Codex catalogs and matrices
-> Standards
-> Frameworks
-> Modules
-> Specifications
-> Implementation plan
-> Runtime implementation evidence
-> Certification evidence
```

Canonical sources:

- `docs/codex/catalog.md`.
- `docs/codex/canonical-definitions.md`.
- `docs/codex/codex-consolidation-report.md`.
- `docs/certification/codex-v1`.

## Dependency Control Rule

New dependencies must be registered in the relevant canonical source before
implementation work relies on them. Circular dependencies and duplicate owners
are not allowed.

## Implementation Dependency Rule

CIMP execution must follow this dependency map. Implementation work must not
start from an isolated module assumption when upstream standards, modules,
services, data models, workflows, API contracts, AI governance, or deployment
dependencies remain unresolved.
