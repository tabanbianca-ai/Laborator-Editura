# Digital Asset Preservation Policy

## Purpose

This document defines preservation, retention, backup, archive, deletion, and
integrity requirements for documents, editorial content, digital assets, and
publication artifacts.

## Required Preservation Fields

Every governed asset must define:

- `retentionPolicy`.
- `backupPolicy`.
- `archivePolicy`.
- `deletionPolicy`.
- `preservationFormat`.
- `integrityVerification`.
- `owner`.
- `classification`.
- `rightsConstraints`.
- `restorationProcedure`.
- `auditInformation`.

## Retention

Retention policy must define:

- Retention duration.
- Legal or editorial reason.
- Owner.
- Review schedule.
- Archive trigger.
- Deletion restriction.
- Preservation exceptions.

Published editorial content, provenance, rights, audit records, and canonical
masters should not be permanently deleted while preservation obligations
remain active.

## Backup

Backup policy must define:

- Backup scope.
- Backup frequency.
- Backup location.
- Encryption requirement.
- Integrity check.
- Restoration test schedule.
- Responsible owner.

Backup metadata must remain linked to canonical asset identifiers and source
versions.

## Archive

Archive policy must define:

- Archive trigger.
- Archive format.
- Archive location.
- Retrieval procedure.
- Access policy.
- Rights restrictions.
- Integrity verification.
- Restoration procedure.

Archive state must not destroy version history.

## Deletion

Deletion policy must define:

- Whether deletion is allowed.
- Whether soft deletion is required.
- Retention hold rules.
- Legal hold rules.
- Rights hold rules.
- Audit retention.
- Restoration window.

Deletion must not remove required audit, provenance, rights, or published
history.

## Preservation Formats

Preferred preservation formats may include:

- JSON Master.
- PDF/A where applicable.
- EPUB where applicable.
- WAV or FLAC for audio preservation where applicable.
- Lossless image formats where applicable.
- Structured metadata exports.

Preservation format choice must be documented per asset family.

## Integrity Verification

Integrity verification may include:

- Checksum.
- File size.
- Format validation.
- Version comparison.
- Relationship validation.
- Backup restore dry-run.
- Preservation audit.

## Audit

Audit must record:

- Retention policy created.
- Retention policy changed.
- Backup policy changed.
- Asset archived.
- Asset restored.
- Integrity verification completed.
- Integrity verification failed.
- Deletion requested.
- Deletion blocked.
- Preservation exception approved.

