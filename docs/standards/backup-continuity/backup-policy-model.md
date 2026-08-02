# Canonical Backup Policy Model

## Purpose

Backup policies define what is protected, where copies are stored, how often
copies are made, how long copies are retained, and how recovery objectives are
validated.

## Required Backup Policy Fields

Each backup policy must preserve:

- `id`.
- `canonicalIdentifier`.
- `name`.
- `scope`.
- `protectedResources`.
- `dataClassification`.
- `criticality`.
- `backupType`.
- `schedule`.
- `retentionPolicy`.
- `storageTargets`.
- `encryptionProfile`.
- `immutabilityPolicy`.
- `replicationPolicy`.
- `rpo`.
- `rto`.
- `restoreTestFrequency`.
- `owner`.
- `approvalStatus`.
- `version`.
- `auditInformation`.

## Backup Types

The platform must support policy definitions for:

- Full backup.
- Incremental backup.
- Differential backup.
- Snapshot.
- Transaction log backup.
- Point-in-time recovery.
- Logical export.
- File copy.
- Object copy.
- Configuration backup.
- Infrastructure backup.
- Long-term archive.

The selected type must match criticality, data volume, change frequency, and
approved recovery objectives.

## Policy Rules

- Every protected resource must map to at least one approved backup policy.
- Critical resources must satisfy 3-2-1 protection.
- `TIER_0` and `TIER_1` policies must include restore-test frequency.
- Policies must define ownership and approval status.
- Policy exceptions must be justified, approved, time-limited where possible,
  and audited.
- AI may suggest policies but must not approve policies or execute destructive
  recovery actions.

