# Backup Retention Policy

## Purpose

Retention policies define how long backup copies, transaction logs, archives,
audit evidence, and legal records must be preserved.

## Retention Categories

Retention must be defined separately for:

- Daily backups.
- Weekly backups.
- Monthly backups.
- Yearly backups.
- Permanent archives.
- Transaction logs.
- Legal documents.
- Audit records.
- Withdrawn publications.
- Historical versions.

## Baseline Example

An indicative baseline is:

- Daily: 30 days.
- Weekly: 12 weeks.
- Monthly: 24 months.
- Yearly: 7 years.

Final values must be aligned with legal obligations, cost, data
classification, contractual duties, and project owner approval.

## Controlled Deletion

A backup may be removed only:

- Through retention policy.
- After mandatory retention expires.
- When not under legal hold.
- When not needed for an investigation.
- Through an authorized operation.
- With complete audit.

Direct manual deletion must be restricted.

## Retention Rules

- Retention must preserve auditability.
- Retention must respect legal holds.
- Retention must not break restore dependencies.
- Deleting one backup must not remove the only recoverable chain.
- Retention changes must be versioned and audited.

