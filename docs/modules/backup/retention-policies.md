# Backup Retention Policies

## Purpose

Retention policies define how long backups, restore records, preservation
metadata, and audit evidence remain available.

## Required Retention Classes

The platform must support independent retention for:

- Databases.
- Documents.
- Media files.
- Configuration.
- Logs.
- Audit records.
- Published editions.
- Manuscript versions.
- Glossary versions.
- Runtime metadata.

## Retention Schedules

Target schedules:

- Daily backups.
- Weekly backups.
- Monthly backups.
- Yearly backups.
- Long-term archive.
- Permanent audit preservation.

Current runtime modes:

- `RETAIN_FOREVER`.
- `RETAIN_N_YEARS`.
- `ARCHIVE_METADATA_FOREVER`.
- `IMMUTABLE_BACKUPS`.
- `AUDIT_RETENTION`.

## Current Runtime Baseline

`apps/api/src/modules/backup-governance` stores retention policy metadata in
`backup_retention_policies`.

Current retention records preserve:

- Retention mode.
- Retain years.
- Archive metadata forever flag.
- Immutable backup flag.
- Permanent audit retention.
- Applicable scopes.
- Human approval requirement.
- AI suggestion metadata.

The infrastructure backup script supports a configurable
`BACKUP_RETENTION_DAYS` value for local backup archive cleanup.

## Policy Rules

- Audit records are permanent.
- Retention changes require authorized human action.
- AI cannot change retention policies automatically.
- Retention may expire redundant backup copies, but must not destroy canonical
  audit, provenance, publication, or preservation records.
- Long-term archive metadata must remain queryable after backup files are
  rotated or moved.
- Retention must respect copyright, GDPR, platform policy, and legal holds.

## Preservation Rules

Preservation records must protect:

- Historical editions.
- Original source references.
- All manuscript versions.
- Glossary versions.
- Audit permanence.

No permanent deletion is allowed for protected preservation categories.

## Gaps

- Retention policy metadata is implemented, but automated policy enforcement
  is not fully governed.
- External archival storage is not configured.
- Legal hold metadata is not represented as a dedicated retention override.
- Environment-specific retention schedules remain to be finalized.
