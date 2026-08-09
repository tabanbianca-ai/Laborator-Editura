# Pilot Defects

Status: OPEN_BLOCKERS_FROM_RC1_PRECONDITION  
Owner: Release Management

## Defect Model

Every defect must record:

- defect_id;
- module;
- severity;
- description;
- steps_to_reproduce;
- expected_result;
- actual_result;
- affected_version;
- owner;
- status;
- fix_version;
- evidence.

## Open Defects

| defect_id | module | severity | description | affected_version | owner | status | fix_version | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-V1-001 | Release Engineering | P0 BLOCKER | `1.0.0-rc.1` artifact has not been approved or deployed to pilot. | pre-RC1 | DevSecOps | OPEN | 1.0.0-rc.1 | Batch 11 `BLOCKED` status |
| DEF-V1-002 | Backup/Restore | P0 BLOCKER | Final restore from a real RC1 staging/pilot backup has not been verified. | pre-RC1 | Platform Operations | OPEN | 1.0.0-rc.1 | Batch 11 restore gate |
| DEF-V1-003 | Release Engineering | P0 BLOCKER | Artifact-bound SBOM and build provenance are missing. | pre-RC1 | DevSecOps | OPEN | 1.0.0-rc.1 | Batch 11 SBOM/provenance gates |
| DEF-V1-004 | Deployment | P0 BLOCKER | Rollback and redeploy rehearsal has not been executed for the candidate. | pre-RC1 | Platform Operations | OPEN | 1.0.0-rc.1 | Batch 11 deployment rehearsal |

## Remediation Rule

Defect -> Root Cause -> Minimal Fix -> Automated Test -> Regression -> Review.

No defect may be used as justification for broad refactoring before v1.0.

## Zero P0 Rule

Final certification requires `OPEN P0 = 0`.
