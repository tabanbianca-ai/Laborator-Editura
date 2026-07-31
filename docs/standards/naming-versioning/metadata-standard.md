# Metadata Standard

## Document Control

- Title: Metadata Standard.
- Identifier: STANDARD-01-METADATA-STANDARD.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Data Governance, Documentation Governance, Security Governance,
  AI Governance, Quality Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`,
  `docs/frameworks/data-engineering/data-catalog.md`.
- References: `docs/frameworks/documentation-governance/documentation-standards.md`,
  `docs/frameworks/quality-governance/quality-metrics.md`.
- Change history:
  - 1.0.0: Initial metadata standard baseline.

## Purpose

This document defines required metadata for governed platform artifacts.

## Required Metadata

Every governed artifact must define:

- UUID.
- Version.
- Owner.
- Created By.
- Updated By.
- Created Date.
- Updated Date.
- Status.
- Tags.
- Description.

## Recommended Metadata

Where applicable, artifacts should also define:

- Canonical Name.
- Display Name.
- Short Name.
- Domain.
- Classification.
- Lifecycle State.
- Source.
- Approval Status.
- Approver.
- Approval Date.
- Deprecation Date.
- Archive Date.
- Dependencies.
- Consumers.
- Related audit events.
- Related documentation.
- Related tests.
- Related release.

## Metadata Field Rules

Metadata fields must be:

- English for implementation-facing field names.
- Stable.
- Typed where used in code or schemas.
- Searchable where used in catalogs.
- Traceable to changes.
- Protected when sensitive.
- Audited when governance-relevant.

## Status Metadata

Status must use the artifact lifecycle values defined in
`docs/standards/naming-versioning/lifecycle.md` unless the artifact family has
an approved specialized lifecycle.

## Classification Metadata

Classification values:

- Critical.
- High.
- Medium.
- Low.

Classification indicates governance criticality, not user-facing priority.

## Ownership Metadata

Owner metadata must identify who is responsible for:

- Accuracy.
- Maintenance.
- Approval coordination.
- Lifecycle transitions.
- Deprecation or archival.
- Remediation when non-compliant.

## Security Metadata

Sensitive artifacts must include metadata for:

- Tenant scope.
- Confidentiality.
- Access rules.
- Need-to-Know scope.
- Retention.
- Audit requirements.

Secrets must never be stored in metadata values. Only secret references,
hashes, or vault metadata may be recorded.

## AI Metadata

AI assets must include:

- Agent or model owner.
- Provider.
- Version.
- Intended use.
- Prohibited use.
- Evaluation status.
- Cost governance link.
- Human approval requirement.

## Documentation Metadata

Documentation metadata follows Framework 08 and must include document control
fields for canonical documents.

## Metadata Compliance

An artifact is metadata-compliant when required metadata exists, is accurate,
is traceable, and is updated through governed processes.
