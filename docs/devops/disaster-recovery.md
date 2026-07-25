# Disaster Recovery

## Purpose

Disaster Recovery defines how Laborator Editura restores service after
infrastructure failure, data loss, deployment failure, or severe operational
incident.

## Required DR Metadata

Every controlled environment must define:

- Recovery Point Objective.
- Recovery Time Objective.
- Recovery owner.
- Escalation contacts.
- Backup locations.
- Restore procedure.
- Validation procedure.
- Communication plan.
- Failover notes.

## Current Baseline

Current DR assets include:

- `infrastructure/disaster-recovery/bootstrap-vps.sh`.
- `infrastructure/disaster-recovery/restore-orchestrated.sh`.
- `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md`.
- Backup and restore scripts.
- Staging rollback script.
- Staging operations workflow.

## DR Event Classes

DR planning must cover:

- Failed deployment.
- Corrupted runtime database.
- Lost host.
- Expired or invalid TLS configuration.
- Failed reverse proxy.
- Full disk.
- Backup failure.
- AI or integration provider outage.
- Security incident.

## Restore Validation

After restore, validation must include:

- Container health.
- API health.
- Web health.
- Runtime data validation.
- Backup checksum validation.
- Auth smoke test.
- Editorial pipeline smoke test.
- Publishing/preflight/distribution smoke test.
- Audit continuity check.

## Current Gaps

- Production RPO/RTO targets are not finalized.
- Offsite encrypted backup policy is not yet enforced.
- Automated failover is not implemented.
- Incident communication templates are not yet formalized.

## Acceptance Criteria

- A documented operator can restore staging from backup.
- Restore dry-run is repeatable.
- Recovery procedures preserve audit and versions.
- Production rollout requires finalized RPO and RTO.
