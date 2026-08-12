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
| Live staging traceability smoke | PASS | Operator-reported Blocker 04 smoke and staging validation passed |
| Real production-like data migration | MISSING | No representative existing database was migrated |
| Live restore of staging backup | PASS | Operator-reported Blocker 05 isolated restore passed from `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz` |

## Blocker 05 Data Integrity Gate

| Requirement | Status | Evidence |
| --- | --- | --- |
| Backup corresponds to RC1 deployment identity | PASS | Operator-reported release identity metadata verification passed |
| Restored database parses correctly | PASS | Operator-reported restored runtime DB passed |
| Expected structures exist after restore | PASS | Operator-reported reviewer, organization, project, and document data present |
| Smoke-test project/document data preserved | PASS | Operator-reported staging smoke data remained available |
| Organization/user/project/document integrity preserved | PASS | Operator-reported organization, project, and document data present |
| Restored data independent from live runtime DB | PASS | Operator-reported temporary restore volumes were isolated from live staging |
| Live database unchanged by isolated restore | PASS | Operator-reported live staging remained healthy after isolated restore |

## Blocker 06 Data Integrity Gate

| Requirement | Status | Evidence |
| --- | --- | --- |
| Pre-rollback database structural counts | NOT_CAPTURED_FROM_THIS_ENVIRONMENT | Requires live VPS pre-rollback evidence |
| Rollback data integrity | NOT_VERIFIED_LIVE | Rollback was not executed on live staging from this environment |
| Post-rollback database integrity | NOT_VERIFIED_LIVE | Requires restored rollback state inspection |
| Post-redeploy database integrity | NOT_VERIFIED_LIVE | Requires live RC1 redeploy inspection |
| Organization/user/project/document data after redeploy | NOT_VERIFIED_LIVE | Requires live post-redeploy validation |
| Data loss attributable to rollback/redeploy | NOT_VERIFIED_LIVE | Requires before/after live database evidence |
| Forward candidate migration compatibility | PASS_LOCAL | Forward artifact `1.0.0-rc.1-rehearsal.1-add6e73` requires no migration newer than `0008_security_hardening_phase_1.sql` |
| Forward candidate smoke contract | PASS_LOCAL | Project creation payload includes `projectIdentity` and `publicationType` |

## Data Integrity Decision

Contract-level and Blocker 05 restore integrity evidence passed. RC1 data
integrity cannot be certified for Blocker 06 until rollback and redeploy are
executed on live staging and before/after data evidence confirms no data loss.
