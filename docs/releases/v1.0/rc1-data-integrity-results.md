# RC1 Data Integrity Results

Status: PARTIAL_BLOCKED
Generated: 2026-08-11

## Automated Evidence Passed

| Area | Result | Evidence |
| --- | --- | --- |
| Runtime DB inventory | PASS | DB tests confirm runtime database includes approved persistence tables |
| Tenant-scoped runtime access | PASS | DB tests cover tenant-scoped repository enforcement patterns |
| Backup deterministic format | PASS | DB tests confirm deterministic JSON backup generation |
| Restore recreates data | PASS | DB tests confirm runtime restore recreates approved data tables |
| Invalid backup rejection | PASS | DB tests and local probe confirm invalid backup rejection |
| Tenant boundaries after restore | PASS | DB tests cover tenant boundary preservation |
| Rights and Provenance | PASS | API tests cover rights warnings, provenance, attribution, and audit |
| Publishing traceability | PASS | API/shared tests cover source of truth, publications, builds, packages, and approvals |
| Distribution traceability | PASS | Shared/API tests cover distribution records, commerce, public portal, and withdrawal history |
| Audit trails | PASS | API tests cover audit events across auth, projects, translation, export, rights, workflow, AI governance, and platform modules |

## Traceability Chain

The repository test suite covers the following chain at contract level:

Project -> Master Document -> Version -> Translation/Correction -> Work ->
Edition -> Publication -> Distribution.

Related coverage includes:

- Project Identity.
- Project Dossiers.
- Documents and segments.
- Segment translations.
- Translation Memory.
- Terminology and Lexicography.
- QA.
- Semantic Fidelity.
- Workflow.
- Export artifacts.
- Publishing records.
- Public Portal.
- Commerce.
- Rights and Provenance.
- Library.
- Audit.

## Local Runtime Restore Evidence

An isolated runtime database containing an organization and project was backed
up, restored to a separate database file, and inspected. The restored project
preserved `organizationId: org-rc1`.

## Evidence Missing

| Area | Result | Evidence Gap |
| --- | --- | --- |
| Live staging traceability smoke | MISSING | No live staging workflow was executed end to end |
| Real production-like data migration | MISSING | No representative existing database was migrated |
| Live restore of staging backup | MISSING | No Docker-volume restore dry-run was executed |

## Blocker 05 Data Integrity Gate

| Requirement | Status | Evidence |
| --- | --- | --- |
| Backup corresponds to RC1 deployment identity | MECHANISM_READY | `verify-backup.sh` can enforce deployment ID, source commit, artifact SHA, and migration |
| Restored database parses correctly | NOT_VERIFIED_LIVE | Requires isolated VPS restore output |
| Expected structures exist after restore | NOT_VERIFIED_LIVE | Requires restored runtime DB inspection |
| Smoke-test project/document data preserved | NOT_VERIFIED_LIVE | Requires live staging backup artifact |
| Organization/user/project/document integrity preserved | NOT_VERIFIED_LIVE | Requires isolated restore validation |
| Restored data independent from live runtime DB | NOT_VERIFIED_LIVE | Requires temporary Docker volume evidence |
| Live database unchanged by isolated restore | NOT_VERIFIED_LIVE | Requires before/after live staging evidence |

## Data Integrity Decision

Contract-level and local runtime integrity evidence passed. RC1 data integrity
cannot be certified until the same traceability and restore gates pass against
the deployed staging candidate.
