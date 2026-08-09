# Business Continuity

Status: Continuity model defined  
Owner: Platform Operations

## Continuity Priorities

1. Authentication and session validation.
2. Project and manuscript access.
3. Translation, review, and rights visibility.
4. Export and publication gates.
5. Backup, restore, and audit evidence.

## Operational Modes

- Normal: all services healthy.
- Degraded: non-critical AI/media functions unavailable, manual editorial work continues.
- Read-only: preserve access to validated content when writes are unsafe.
- Maintenance: controlled downtime with rollback plan.
- Recovery: restore/rollback in progress.

## Rule

Degraded modes must never bypass rights, approval, audit, tenant isolation, or human final authority.

