# CEMI Enterprise Inventory

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CEMI-ENTERPRISE-INVENTORY |
| Version | 1.0.0 |
| Status | Official master inventory |
| Owner | Codex Enterprise Governance |
| Related sources | `docs/certification/codex-v1/final-inventory.md`, `docs/codex/module-catalog.md` |

## Purpose

This inventory records the master enterprise baseline for Codex v1.0. It is a
navigation and audit inventory, not a runtime discovery system.

## Inventory Summary

| Area | Baseline |
| --- | --- |
| Applications | `apps/api`, `apps/web`, `apps/ai` |
| Workspace packages | `packages/db`, `packages/shared` |
| Runtime API module directories | 36 |
| Fundamental documented modules | 25 |
| Specialized frameworks | 8 |
| Canonical standards | 21 |
| CEMI master documents | 8 |
| CIMP implementation documents | 6 |
| CIEF execution documents | 6 |
| Codex catalog documents | 21 markdown files under `docs/codex` |
| Documentation corpus | 762 markdown files after the CIEF baseline |

## Applications

| Application | Purpose |
| --- | --- |
| `apps/api` | Central backend API and module service host. |
| `apps/web` | Frontend application and workspace UI. |
| `apps/ai` | AI application workspace placeholder and related AI surface. |

## Packages

| Package | Purpose |
| --- | --- |
| `packages/shared` | Shared canonical models, JSON Master Format, language policy, and cross-workspace types. |
| `packages/db` | Runtime database abstraction, migrations, backup and restore helpers. |

## Runtime Modules

Runtime API module directories are inventoried in `docs/master/module-catalog.md`
and `docs/certification/codex-v1/final-inventory.md`.

## Databases and Persistence

| Area | Canonical reference |
| --- | --- |
| Conceptual data model | `docs/ARCHITECTURE_CHAPTER_4.md`, `docs/domain/domain-model.md` |
| Logical data model | `docs/ARCHITECTURE_CHAPTER_5.md`, `docs/data/logical-data-model.md` |
| Physical database model | `docs/ARCHITECTURE_CHAPTER_6.md`, `docs/database/physical-data-model.md` |
| Runtime persistence | `packages/db` |
| Backup and restore | `packages/db/scripts`, `docs/devops/backup-and-recovery.md` |

## APIs

| API area | Canonical reference |
| --- | --- |
| Codex API contracts | `docs/codex/api-contracts.md` |
| Integration API contracts | `docs/integration/api-contracts.md` |
| Runtime API modules | `apps/api/src/modules` |
| Gateway and integrations | `apps/api/src/modules/gateway`, `docs/modules/integration/integration-overview.md` |

## AI Agents

AI agents are inventoried in `docs/master/module-catalog.md` and governed by
`AGENTS.md`, `docs/frameworks/ai-engineering/overview.md`, and
`docs/modules/ai-governance/ai-governance-overview.md`.

## Workflows

| Workflow | Canonical reference |
| --- | --- |
| Editorial Production Pipeline | `docs/PHASE_7_STEP_16_PUBLISHING_PREFLIGHT_DISTRIBUTION_REPORT.md` |
| Workflow architecture | `docs/workflow/workflow-architecture.md` |
| Workflow definitions | `docs/workflow/workflow-definitions.md` |
| Workflow permissions | `docs/workflow/workflow-permissions.md` |
| Workflow events | `docs/workflow/workflow-events.md` |

## Documents and Publications

| Area | Canonical reference |
| --- | --- |
| JSON Master Format | `docs/JSON_MASTER_FORMAT.md`, `packages/shared/src/json-master-format` |
| Library | `docs/modules/library/library-overview.md` |
| Publishing | `docs/modules/publishing/publishing-overview.md` |
| Public Portal | `apps/api/src/modules/public-portal` |
| Rights and provenance | `docs/modules/rights/rights-overview.md` |

## Infrastructure

| Area | Canonical reference |
| --- | --- |
| Staging deployment | `deploy/staging/README.md`, `docs/STAGING_DEPLOYMENT_PREPARATION.md` |
| Infrastructure pack | `infrastructure/README.md`, `infrastructure/docs` |
| CI/CD and release | `docs/devops/ci-cd.md`, `docs/devops/release-management.md` |
| Monitoring | `docs/devops/observability.md`, `infrastructure/docs/MONITORING_RUNBOOK.md` |
| Backup and DR | `docs/devops/backup-and-recovery.md`, `infrastructure/docs/BACKUP_RESTORE_RUNBOOK.md`, `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md` |

## Inventory Maintenance Rule

When a new application, package, runtime module, documented module, framework,
standard, API family, workflow, or infrastructure artifact is approved, record
it here and link to its canonical owner.
