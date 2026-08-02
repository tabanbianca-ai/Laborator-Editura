# Specification to Implementation Matrix

Status: Batch 01 baseline

## Purpose

This matrix maps approved foundational requirements to current implementation
locations. It is a traceability artifact only.

| Requirement area | Canonical source | Current implementation location | Batch 01 status |
| --- | --- | --- | --- |
| Development conventions | `docs/DEVELOPMENT_CONVENTIONS.md`, `AGENTS.md` | Repository-wide | Referenced; no semantic changes. |
| Manifest and architecture | `docs/MANIFEST.md`, `docs/ARCHITECTURE_CHAPTER_*.md` | Documentation and module structure | Referenced; no semantic changes. |
| Authentication and context | Auth directives in `AGENTS.md` and API modules | `apps/api/src/modules/auth` | Existing; no behavior changes. |
| Runtime database | Data/database directives | `packages/db/src/runtime-database.ts` | Existing; not changed by Batch 01. |
| Backup and restore | Backup directives and runbooks | `packages/db/scripts`, `infrastructure/backup` | Existing; not changed by Batch 01 except validation documentation. |
| Logging | Standard 09 and Batch 01 P1-003 | `infrastructure/scripts/common.sh`; shared runtime utilities added in Batch 01 | Shared foundation required. |
| Error model | Batch 01 P1-004 | No central shared error model found before Batch 01 | Shared foundation required. |
| Configuration validation | Batch 01 P1-002 | API security env validation exists; no shared canonical config helper before Batch 01 | Shared foundation required. |
| Localization foundation | Development conventions and Batch 01 P1-005 | `apps/web/lib/ui-i18n.ts` | Shared baseline and locale files required. |
| Health checks | Batch 01 P1-007 | `apps/api/src/modules/health.controller.ts` exposes `/health` | Additive liveness/readiness/startup endpoints required. |
| Secret scanning | Batch 01 P0-002 | `infrastructure/validation/scan-secrets.sh`, CI | Harden output and CI linkage required. |
| CI gates | Batch 01 P1-006 | `.github/workflows/ci.yml` | Needs explicit config validation and format check. |

