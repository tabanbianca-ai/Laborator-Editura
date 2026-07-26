# Disaster Recovery

## Purpose

Disaster recovery defines how Laborator Editura restores critical services
after major incidents such as VPS loss, storage loss, deployment failure,
database corruption, or regional outage.

## Required Recovery Plan Fields

Each recovery plan must define:

- `id`.
- `organizationId`.
- `name`.
- Included services.
- Service dependencies.
- Restore order.
- Recovery Point Objective.
- Recovery Time Objective.
- Recovery strategy.
- Priority.
- Failover notes.
- Restoration procedures.
- Tests performed.
- Post-recovery checks.

## Current Repository Baseline

Current DR assets include:

- `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md`.
- `docs/devops/disaster-recovery.md`.
- `infrastructure/disaster-recovery/bootstrap-vps.sh`.
- `infrastructure/disaster-recovery/restore-orchestrated.sh`.
- Backup/restore scripts and validation scripts.
- API metadata for recovery plans in
  `apps/api/src/modules/backup-governance`.

The runbook currently defines:

- RPO: maximum 24 hours with daily backups.
- RTO target: 30-60 minutes when an external backup is available.

## Critical Services

Critical recovery order:

1. Secrets and environment configuration from the approved secret store.
2. Host security baseline.
3. Docker runtime and volumes.
4. Runtime database.
5. API service.
6. Web service.
7. Reverse proxy and TLS.
8. Health checks.
9. Backup verification.
10. Editorial smoke tests.
11. Public access restoration.

## Failover and Failback

Failover must:

- Preserve data integrity.
- Avoid unsafe automatic DNS changes.
- Validate backups before restore.
- Validate service health before traffic shift.
- Record operational audit evidence.

Failback must:

- Confirm source and target data consistency.
- Preserve all audit and restore records.
- Avoid overwriting newer validated data.
- Require authorized human approval.

## Post-Recovery Checks

Required checks:

- API health.
- Web health.
- Runtime database access.
- Authentication.
- Workspace navigation.
- Project/document access.
- Workflow gates.
- Rights and Provenance warnings.
- Export artifact availability.
- Backup schedule status.
- Audit event continuity.

## Gaps

- Production RPO/RTO values are not finalized per environment.
- External backup storage is not configured in repository state.
- Automated failover/failback is intentionally not implemented.
- DR testing schedule needs operational ownership.
