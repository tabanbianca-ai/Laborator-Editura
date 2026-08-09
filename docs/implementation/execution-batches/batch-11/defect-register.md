# Defect Register

Status: Initial RC1 triage created  
Owner: Release Management

## Severity Model

- P0 BLOCKER: blocks RC1.
- P1 CRITICAL: must be fixed or formally accepted before RC1.
- P2 MAJOR: may ship only with transparent mitigation.
- P3 MINOR: non-blocking.
- P4 COSMETIC: non-blocking.

## Open Defects

| ID | Severity | Module | Description | Workaround | Owner | RC1 Impact |
| --- | --- | --- | --- | --- | --- | --- |
| DEF-RC1-001 | P0 BLOCKER | Operations | No live isolated restore evidence for RC1 candidate. | Run staging backup and restore dry-run. | Platform Operations | BLOCKS_RC1 |
| DEF-RC1-002 | P0 BLOCKER | Release Engineering | No RC1 SBOM and immutable artifact provenance. | Generate artifact-bound SBOM and provenance. | DevSecOps | BLOCKS_RC1 |
| DEF-RC1-003 | P0 BLOCKER | Deployment | No recorded rollback rehearsal for RC1 candidate. | Execute rollback and redeploy rehearsal. | Platform Operations | BLOCKS_RC1 |
| DEF-RC1-004 | P1 CRITICAL | Supply Chain | Root dependency lockfile missing or exception not approved. | Commit lockfile or approve documented exception. | DevSecOps | BLOCKS_RC1 unless accepted |

## Rule

RC1 cannot be approved with any open P0 defect.

