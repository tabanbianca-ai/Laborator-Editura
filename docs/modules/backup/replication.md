# Backup Replication

## Purpose

Replication ensures backup availability beyond one runtime host or storage
location.

## Supported Replication Targets

The target architecture supports:

- Local replication.
- Inter-datacenter replication.
- Cloud replication.
- Continuous replication.
- Asynchronous replication.
- Synchronous replication where required.

## Current Repository Baseline

Current infrastructure includes:

- Local backup archive generation.
- Runtime backup volume backup.
- Optional external copy guidance through `rclone`.
- Disaster recovery runbook steps for downloading the latest verified backup
  from external storage.

No external replication provider is configured in the repository.

## Replication Rules

- Replication targets must be configured outside source code.
- Replication credentials must never be committed or logged.
- Replicated backups must preserve manifests and checksums.
- Failed replication must emit observable warnings and auditable operational
  records.
- Replication must not bypass retention policy.
- Replication must not bypass tenant isolation after restore.

## Replication Metadata

Future replication records should include:

- `id`.
- `organizationId`.
- `backupJobId`.
- `sourceRepositoryId`.
- `targetRepositoryId`.
- `replicationMode`.
- `status`.
- `startedAt`.
- `completedAt`.
- `checksum`.
- `errorSummary`.
- `createdAt`.

## Integration

Replication integrates with:

- Backup jobs.
- Backup repositories.
- Retention policies.
- Disaster recovery plans.
- Observability health signals.
- Notification and Communication for failure delivery.
- Security Governance for credential handling.

## Gaps

- Dedicated replication records are not implemented.
- Cross-region replication is not configured.
- Synchronous replication policy is not defined.
- Replication health is not yet surfaced through Backup APIs.
