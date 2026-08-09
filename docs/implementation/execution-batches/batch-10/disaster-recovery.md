# Disaster Recovery

Status: DR procedure defined, full exercise pending  
Owner: Platform Operations

## Disaster Recovery Scenarios

- VPS unavailable.
- Runtime database volume corrupted.
- Bad deployment.
- Nginx or TLS configuration failure.
- Secret exposure.
- Backup archive corrupted.
- GitHub Actions unavailable.
- External AI provider unavailable.

## Required Procedure

1. Declare incident and owner.
2. Freeze deployment changes.
3. Validate latest backup and source commit.
4. Restore to isolated environment first.
5. Verify application health and critical journeys.
6. Promote restored environment or execute rollback.
7. Capture evidence and postmortem.

## Current Assets

- `infrastructure/disaster-recovery/bootstrap-vps.sh`.
- `infrastructure/disaster-recovery/restore-orchestrated.sh`.
- `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md`.

## RC1 Gate

At least one DR tabletop or dry-run must be completed before RC1.

