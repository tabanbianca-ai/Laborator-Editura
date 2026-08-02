# Duplication Register

Status: Batch 01 baseline

## Purpose

This register records overlapping definitions that should converge toward canonical
references without deleting existing validated behavior.

| ID | Area | Duplicate or overlap | Canonical direction | Severity |
| --- | --- | --- | --- | --- |
| DUP-001 | Localization | Web UI labels currently live in `apps/web/lib/ui-i18n.ts`; Batch 01 adds shared localization baseline files. | Keep runtime behavior, use shared keys and locale files as the canonical future baseline. | Medium |
| DUP-002 | Health checks | `/health` exists as a minimal endpoint; liveness/readiness/startup were not distinct. | Preserve `/health`, add explicit safe health check endpoints. | Low |
| DUP-003 | Logging | Infrastructure scripts have timestamped logging; application logging did not have a shared typed helper. | Keep shell logging; add shared TypeScript structured logging model. | Medium |
| DUP-004 | Configuration | API security validation exists separately from staging/infrastructure config validation. | Preserve API validation; add shared canonical config primitives for future convergence. | Medium |
| DUP-005 | Error handling | Controllers/services may use local framework exceptions without a shared error payload model. | Add shared typed error model without changing public APIs in Batch 01. | Medium |

## Non-Actions

- No duplicate module removal is authorized in Batch 01.
- No large code migration to new shared primitives is performed in Batch 01.
- Existing public API responses are preserved unless an additive health endpoint is used.

