# Restore Strategy

## Purpose

Restore strategy defines how the platform recovers data safely, selectively,
and auditably after failure, corruption, accidental changes, or disaster.

## Supported Restore Types

Target restore types:

- Full restore.
- Partial restore.
- File-level restore.
- Project-level restore.
- Document-level restore.
- Version-level restore.
- Point-in-Time Recovery.
- Test restore.
- Dry-run restore.

## Current Repository Baseline

Current restore support includes:

- `packages/db/scripts/restore-runtime-db.mjs` for deterministic runtime
  database restore after backup validation.
- `packages/db/scripts/runtime-backup-lib.mjs` backup validation for format,
  schema version, tables, tenant boundaries, and references.
- `infrastructure/backup/restore-dry-run.sh` restores archives into temporary
  Docker volumes without touching live volumes.
- `infrastructure/backup/restore-laborator.sh` supports guarded live restore.
- `infrastructure/disaster-recovery/restore-orchestrated.sh` supports
  orchestrated disaster recovery flows.
- `apps/api/src/modules/backup-governance` records restore requests as
  metadata-only restore events.

## Restore Authorization

Restore operations require:

- Authenticated server-derived context.
- Authorized human role.
- Explicit authorization.
- Backup selection.
- Restore target.
- Integrity verification.
- Audit record.

AI cannot initiate, approve, or execute restore operations automatically.

## Restore Validation

Every restore must validate:

- Backup format.
- Schema version.
- Backup manifest.
- Checksum.
- Table coverage.
- Tenant boundaries.
- Referential consistency.
- Service health after restore.
- Workflow, rights, publication, and audit continuity.

## Point-in-Time Recovery

PITR target requirements:

- PostgreSQL WAL archiving.
- Time-based recovery target.
- Recovery checkpoint selection.
- Integrity validation.
- Post-recovery audit.

Current status:

- PITR is documented as required but is not implemented for the runtime
  metadata database.

## Selective Restore

Future selective restore must support:

- Project-level restore.
- Document-level restore.
- Version-level restore.
- File-level restore.
- Export artifact restore.
- Media asset restore.

Selective restore must never expose another tenant's data and must preserve
audit lineage.

## Gaps

- Restore execution is infrastructure-script based, while API restore records
  are metadata-only.
- PITR is not implemented.
- Selective project/document/version restore is not implemented.
- Automated post-restore smoke tests are partially documented but not fully
  orchestrated through the Backup module.
