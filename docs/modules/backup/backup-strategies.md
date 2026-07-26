# Backup Strategies

## Purpose

This document defines required backup strategies for platform data,
configuration, artifacts, and operational state.

## Supported Backup Types

Target backup types:

- Full Backup.
- Incremental Backup.
- Differential Backup.
- Database Backup.
- File Backup.
- Configuration Backup.
- Metadata Backup.
- AI Configuration Backup.
- Object Storage Backup.
- Snapshot Backup.

Current runtime implementation supports:

- Full metadata backup.
- Incremental metadata classification.
- Snapshot metadata classification.
- Runtime database deterministic JSON backup.
- Infrastructure archive backup for Docker volumes and selected
  configuration.

## Backup Scope

Central backup policy must cover:

- Organizations, users, roles, sessions, and security metadata.
- Projects, dossiers, documents, segments, and translations.
- Translation Memory, Terminology, Lexicographic, QA, Semantic Fidelity, and
  Workflow data.
- Author Studio, Research, Library, Collaboration, Public Portal, Commerce,
  Publishing, Layout, Multimedia, Media Localization, Scheduling, and
  Marketplace data.
- Rights and Provenance records.
- Observability, security, policy, gateway, integration, and AI governance
  metadata.
- Export artifacts.
- Runtime database backups.
- Configuration templates and deployment metadata.
- Audit events.

## Database Backups

Current baseline:

- `packages/db/scripts/backup-runtime-db.mjs` creates deterministic JSON
  runtime database backups.
- `packages/db/scripts/restore-runtime-db.mjs` validates backup format before
  restore.
- `packages/db/scripts/runtime-backup-lib.mjs` includes schema/version
  metadata and validates tenant boundaries.

Target:

- PostgreSQL logical backup.
- PostgreSQL physical backup where required.
- Point-in-Time Recovery through WAL archiving.
- Cross-region replicated backup storage.
- Automated restore validation.

## File and Object Backups

Current baseline:

- `infrastructure/backup/backup-laborator.sh` archives Docker runtime volumes
  and selected configuration.

Target:

- Asset storage backups for manuscripts, media, covers, illustrations, audio,
  video, exports, and publication artifacts.
- Object storage versioning.
- Integrity verification per object.
- Rights-aware restoration checks.

## Configuration Backups

Current baseline includes:

- Docker Compose staging configuration.
- Nginx configuration archive when present.
- Laborator systemd service/timer files when present.
- Active Git commit metadata.
- Backup manifest and SHA-256 checksum.

Real environment files are excluded by default unless explicitly enabled for
encrypted and restricted backups.

## Snapshot Strategy

Snapshots are used for:

- Quick restore.
- Controlled rollback.
- Safe updates.
- Migration tests.
- Restore drills.

Snapshots do not replace long-term backups and must remain covered by
retention, checksum, encryption, and audit policy.

## Integrity Verification

Every backup must support:

- Manifest validation.
- Schema/version validation.
- Checksum validation.
- Tenant boundary validation when data is tenant-scoped.
- Restore dry-run validation.
- Audit record creation.

## Security Requirements

- Controlled-environment backups must be encrypted.
- Secrets must not be logged.
- Backup archives that include environment files must be restricted and
  encrypted.
- Backup storage access must follow IAM and Need-to-Know rules.
- AI may recommend but must not execute backup deletion, restoration, or
  retention changes.

## Current Gaps

- No dedicated external backup repository entity exists.
- No configured cloud replication provider exists.
- No PostgreSQL PITR implementation exists yet.
- Runtime metadata backups are suitable for current validation, not for final
  production-scale storage.
