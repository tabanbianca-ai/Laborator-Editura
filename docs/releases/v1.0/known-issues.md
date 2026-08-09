# v1.0 Known Issues

Status: BLOCKING_ISSUES_PRESENT  
Owner: Release Management

## Known Issues

| issue_id | severity | affected_module | description | workaround | risk | target_release | owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| KI-V1-001 | P0 | Release Engineering | RC1 is not approved, so final acceptance cannot start. | Complete Batch 11 blockers first. | Cannot certify v1.0. | 1.0.0-rc.1 | Release Management |
| KI-V1-002 | P0 | Backup/Restore | Final restore evidence missing. | Run verified restore. | Recovery unproven. | 1.0.0 | Platform Operations |
| KI-V1-003 | P0 | Supply Chain | Final SBOM and build provenance missing. | Generate artifact-bound evidence. | Artifact integrity unproven. | 1.0.0 | DevSecOps |
| KI-V1-004 | P0 | Deployment | Pilot and production deployment evidence missing. | Deploy approved artifact and record evidence. | Production readiness unproven. | 1.0.0 | Platform Operations |

## Rule

Blocking known issues cannot ship in final v1.0.

