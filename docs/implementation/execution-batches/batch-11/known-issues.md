# Known Issues

Status: Initial RC1 known issues register created  
Owner: Release Management

## Known Issues

| Issue ID | Severity | Affected Module | Description | Workaround | Risk | Target Release | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| KI-RC1-001 | P0 | Operations | Live restore evidence is missing. | Execute staging restore dry-run. | Cannot prove recoverability. | RC1 | Platform Operations |
| KI-RC1-002 | P0 | Release Engineering | RC1 SBOM and build provenance are missing. | Generate candidate artifact evidence. | Cannot prove artifact integrity. | RC1 | DevSecOps |
| KI-RC1-003 | P0 | Deployment | Rollback rehearsal is missing. | Execute rollback and redeploy rehearsal. | Recovery path unproven. | RC1 | Platform Operations |
| KI-RC1-004 | P1 | Supply Chain | Root `pnpm-lock.yaml` is missing. | Commit lockfile or approve formal exception. | Dependency reproducibility risk. | RC1 | DevSecOps |

## Rule

Known issues allowed in RC1 must be transparent and non-blocking. The current P0 known issues block approval.

