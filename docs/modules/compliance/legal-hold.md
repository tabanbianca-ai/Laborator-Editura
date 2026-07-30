# Compliance Legal Hold

Legal Hold preserves records that must not be deleted, altered, or retired
because of legal, regulatory, audit, investigation, rights, or dispute
requirements.

## Legal Hold Record

Each legal hold contains:

- `id`.
- `scope`.
- `reason`.
- `requestedBy`.
- `approvedBy`.
- `startDate`.
- `endDate`.
- `status`.
- `affectedRecords`.
- `notes`.

## Scope Examples

Legal hold may apply to:

- Projects.
- Documents.
- Manuscripts.
- Translations.
- Rights records.
- Publishing records.
- Audit logs.
- User records.
- AI execution records.
- Communications.
- Export artifacts.
- Backup records.

## Statuses

Recommended statuses:

- `REQUESTED`.
- `ACTIVE`.
- `RELEASE_REQUESTED`.
- `RELEASED`.
- `EXPIRED`.
- `CANCELLED`.

## Current Baseline

The repository contains retention and preservation rules, but no dedicated
legal hold model or centralized legal hold workflow.

## Rules

- Legal hold overrides retention deletion.
- Legal hold does not grant unauthorized access.
- Legal hold changes require authorized approval.
- Legal hold release requires authorized approval.
- Legal hold scope must be explicit.
- Affected records must remain auditable.
- AI may detect possible legal hold needs but may not apply or release legal
  holds.

## Migration Guidance

Future implementation should:

1. Define legal hold records.
2. Link holds to Data Governance and Backup.
3. Connect holds to retention controls.
4. Add approval workflow.
5. Add audit events for apply, update, and release.
