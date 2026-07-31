# Codex Module Catalog

The Module Catalog is the official inventory of Codex modules, lifecycle
states, documentation status, dependencies, and governance requirements.

## Catalog Rules

Every module record must preserve:

- Module number.
- Module name.
- Phase.
- Purpose.
- Owner.
- Lifecycle state.
- Version.
- Required deliverables.
- Dependencies.
- API contract references.
- Event references.
- Migration plan.
- Acceptance criteria.

## Canonical Module Sequence

This section is the single canonical definition of the platform module
sequence. Module migration plans must reference this section instead of
repeating next-module or phase-closure statements.

## Phase II Fundamental Modules

The 25 fundamental enterprise modules are:

| Module | Name | Canonical overview |
| --- | --- | --- |
| 1 | Library | `docs/modules/library/library-overview.md` |
| 2 | Translation | `docs/modules/translation/translation-overview.md` |
| 3 | Proofreading and Editorial Review | `docs/modules/editorial-review/editorial-review-overview.md` |
| 4 | Publishing | `docs/modules/publishing/publishing-overview.md` |
| 5 | Rights and Provenance | `docs/modules/rights/rights-overview.md` |
| 6 | Magazine | `docs/modules/magazine/magazine-overview.md` |
| 7 | AI Orchestration and Editorial Agents | `docs/modules/ai-orchestration/ai-orchestration-overview.md` |
| 8 | Audio and Narration | `docs/modules/audio/audio-overview.md` |
| 9 | Video and Multimedia | `docs/modules/video/video-overview.md` |
| 10 | Workflow Engine and Business Process Automation | `docs/modules/workflow/workflow-overview.md` |
| 11 | Notification and Communication | `docs/modules/notifications/notifications-overview.md` |
| 12 | Identity, Access Management and Security | `docs/modules/iam/iam-overview.md` |
| 13 | Observability, Monitoring and Audit | `docs/modules/observability/observability-overview.md` |
| 14 | Backup, Disaster Recovery and Business Continuity | `docs/modules/backup/backup-overview.md` |
| 15 | Search, Indexing and Knowledge Graph | `docs/modules/search/search-overview.md` |
| 16 | Integration, API Gateway and External Connectors | `docs/modules/integration/integration-overview.md` |
| 17 | Configuration, Feature Flags and Platform Administration | `docs/modules/configuration/configuration-overview.md` |
| 18 | Data Governance, Metadata and Master Data Management | `docs/modules/data-governance/data-governance-overview.md` |
| 19 | Accessibility, Localization and Inclusive Experience | `docs/modules/accessibility/accessibility-overview.md` |
| 20 | Analytics, Business Intelligence and Decision Support | `docs/modules/analytics/analytics-overview.md` |
| 21 | AI Governance, Model Management and Responsible AI | `docs/modules/ai-governance/ai-governance-overview.md` |
| 22 | DevSecOps, CI/CD, Release and Platform Operations | `docs/modules/devsecops/devsecops-overview.md` |
| 23 | Quality Assurance, Testing and Validation | `docs/modules/quality-assurance/qa-overview.md` |
| 24 | Enterprise Architecture, Portfolio and Strategic Governance | `docs/modules/enterprise-architecture/architecture-overview.md` |
| 25 | Compliance, Legal Governance and Risk Management | `docs/modules/compliance/compliance-overview.md` |

## Phase III Meta-Architecture

| Module | Name | Canonical overview |
| --- | --- | --- |
| 26 | Enterprise Meta-Architecture and Codex Governance Framework | `docs/codex/meta-architecture.md` |

## Fundamental Architecture Closure

The 25 Phase II modules define the fundamental enterprise architecture:
editorial capabilities, infrastructure, AI, operations, governance, quality,
strategy, and compliance.

Phase III Module 26 defines the supreme Codex governance layer. Future
capabilities are specialized extensions unless explicitly approved through
Codex Governance as fundamental architecture.

Module migration plans must not restate this closure rule. They must reference
this catalog and `docs/codex/meta-architecture.md`.

## Current Baseline

Module documentation exists under:

- `docs/modules`.
- `SPEC.md`.
- `ROADMAP.md`.
- `AGENTS.md`.
- `docs/MANIFEST.md`.

The catalog is currently document-based, not a structured registry with
machine-readable lifecycle, version, dependency, and compliance metadata.

## Structural Conformity

Every module must define:

- Purpose.
- Responsibilities.
- Principles.
- Architecture.
- Entities.
- Workflows.
- APIs.
- Events.
- Integration.
- Performance.
- Security.
- Acceptance criteria.
- Audit.
- Deliverables.
- Final instruction for Codex.

Existing older module documents may not all follow this template perfectly.
They must converge incrementally without breaking validated documentation.
