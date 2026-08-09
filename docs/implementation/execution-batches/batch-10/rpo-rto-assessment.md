# RPO/RTO Assessment

Status: Objectives defined, full measured evidence pending  
Owner: Platform Operations

## Initial Objectives

| Resource | RPO | RTO | Status |
| --- | --- | --- | --- |
| runtime database | 24h | 4h | UNMEASURED for RC1 |
| runtime backups | 24h | 4h | UNMEASURED for RC1 |
| staging API/web deployment | source commit | 1h rollback target | UNMEASURED for RC1 |
| nginx/systemd configuration | latest backup | 2h | UNMEASURED for RC1 |

## Measurement Rule

RPO/RTO values must be measured from a real backup and restore dry-run. Estimates are not sufficient for RC1 approval.

## Current Risk

Runtime backup/restore tests exist at package level. Full staging restore evidence must still be recorded after VPS validation.

