# Backup, Restore and Continuity Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 15:
Canonical Backup, Restore, Disaster Recovery and Business Continuity.

It is a documentation and governance audit. It does not change runtime
behavior, APIs, database schema, Docker, staging, frontend behavior, tests, or
application logic.

## Audit Date

2026-08-02.

## Static Inventory

| Area | Current count or evidence |
| --- | --- |
| Backup module documents | 12 files under `docs/modules/backup` |
| Backup, restore, DR, and continuity files | 17 files across infrastructure, staging scripts, runtime DB scripts, package tests, and API tests |
| Searchable backup/restore candidates | 419 matching files across `apps`, `packages`, `docs`, `infrastructure`, and `deploy` before classification |
| Runtime backup governance tables | `backup_jobs`, `backup_restore_events`, `backup_retention_policies`, `disaster_recovery_plans`, `preservation_records`, `backup_audit_events` |
| Runtime deterministic backup/restore | `packages/db/scripts/backup-runtime-db.mjs`, `packages/db/scripts/restore-runtime-db.mjs`, `packages/db/scripts/runtime-backup-lib.mjs` |
| Infrastructure backup scripts | `infrastructure/backup/backup-laborator.sh`, `verify-backup.sh`, `restore-dry-run.sh`, `restore-laborator.sh`, `list-backups.sh` |
| Disaster recovery scripts | `infrastructure/disaster-recovery/bootstrap-vps.sh`, `restore-orchestrated.sh` |
| Scheduling artifacts | `infrastructure/systemd/laborator-backup.service`, `laborator-backup.timer` |
| Operational runbooks | `infrastructure/docs/BACKUP_RESTORE_RUNBOOK.md`, `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md` |

## Current Strengths

- Backup module documentation exists.
- Backup governance backend module exists.
- Runtime database includes backup governance tables.
- Deterministic runtime DB backup and restore scripts exist.
- Runtime backup validation checks schema metadata, table lists, tenant
  boundaries, and reference integrity.
- Infrastructure backup and restore scripts exist.
- Restore dry-run support exists.
- Disaster recovery scripts exist.
- Systemd timer and service artifacts exist for scheduled backups.
- Operational runbooks exist.
- Human Final Authority is preserved for restore and retention decisions.

## Current Gaps

- Full 3-2-1 storage topology is not proven from repository documentation
  alone.
- Immutable or isolated backup storage is policy-level and not fully
  evidenced for every critical resource.
- Approved RPO/RTO coverage is not yet mapped for every service and resource.
- Resource criticality tier mapping is not yet complete for every data object,
  service, configuration, and asset class.
- Periodic restore evidence is not yet centralized as canonical evidence
  records.
- Secret and cryptographic-key recovery is documented but not yet integrated
  with an external vault provider.
- Geographic separation and provider-outage recovery evidence require real
  environment validation.
- Degraded-operation procedures are documented conceptually and need
  environment-specific validation.
- Duplicate, obsolete, or unmanaged backup copies require inventory before
  consolidation.

## Baseline Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Backup policies | Partial foundation | Governance tables and docs exist; complete policy coverage matrix future |
| Backup executions | Partial foundation | Runtime backup scripts and job metadata exist |
| 3-2-1 coverage | Early foundation | Requirement documented; environment proof required |
| Encryption | Partial foundation | Infrastructure guidance exists; key recovery needs separate validation |
| Immutability | Early foundation | Policy-level requirement; storage evidence future |
| Retention | Partial foundation | Retention policy metadata exists |
| Restore model | Partial foundation | Restore events, scripts, and dry-run exist |
| Restore validation | Partial foundation | Runtime restore validation exists; periodic evidence registry future |
| RPO/RTO | Early foundation | Governance metadata exists; coverage matrix future |
| Disaster recovery | Partial foundation | DR docs and scripts exist |
| Business continuity | Early foundation | Continuity docs exist; environment validation future |
| Audit | Partial foundation | Backup audit events exist |

## Baseline Conclusion

The repository has a strong backup and restore foundation with module
documentation, runtime DB backup/restore, infrastructure scripts, DR scripts,
systemd scheduling artifacts, runbooks, governance metadata, and tests.

Standard 15 consolidates these into one canonical recoverability model where a
backup is valid only when restore evidence, integrity validation, compatible
application version, approved RPO/RTO, retention, encryption, and audit are
available.

