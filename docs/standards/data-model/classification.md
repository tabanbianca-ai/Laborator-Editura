# Data Classification

## Document Control

- Title: Data Classification.
- Identifier: STANDARD-02-DATA-CLASSIFICATION.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Data Governance.
- Reviewers: Security Governance, Compliance, Quality Governance, AI
  Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/data-model/overview.md`,
  `docs/frameworks/security-engineering/data-protection.md`.
- References: `docs/modules/data-governance/data-classification.md`,
  `docs/modules/compliance/privacy-governance.md`.
- Change history:
  - 1.0.0: Initial classification baseline.

## Purpose

This document defines the canonical classification model for data objects.

## Classification Dimensions

Every data object must be classified by:

- Sensitivity.
- Criticality.
- Provenance.

## Sensitivity Levels

Canonical sensitivity levels:

- Public.
- Internal.
- Confidential.
- Restricted.

Definitions:

- Public: approved for public visibility.
- Internal: visible within the organization or authorized workspace.
- Confidential: restricted to authorized roles, projects, or tasks.
- Restricted: tightly controlled data requiring explicit Need-to-Know and
  enhanced audit.

Compatibility note:

- Existing documentation may use `Highly Restricted` for sensitive security or
  secret-adjacent data. Under Standard 02, this maps to `Restricted` with
  enhanced controls unless a specialized classification extension is approved.

## Criticality Levels

Canonical criticality levels:

- Critical.
- High.
- Medium.
- Low.

Definitions:

- Critical: compromise, corruption, or loss can block platform operations,
  security, legal compliance, publishing, or audit.
- High: compromise or loss has significant operational, editorial, financial,
  security, or compliance impact.
- Medium: compromise or loss has limited but meaningful impact.
- Low: compromise or loss has minor impact.

## Provenance Types

Canonical provenance types:

- Native.
- Imported.
- Generated.
- AI Generated.
- External.
- Archived.

Definitions:

- Native: created inside Laborator Editura by authorized users or services.
- Imported: brought into the platform from a file, external system, or
  migration.
- Generated: produced by platform automation.
- AI Generated: produced by AI and requiring explicit governance before
  becoming canonical or approved.
- External: referenced but controlled by an external source.
- Archived: retained for history, audit, preservation, or compatibility.

## Classification Rules

Classification must:

- Be assigned at object creation where possible.
- Be updated when sensitivity, provenance, or criticality changes.
- Be inherited cautiously from parent objects.
- Not expose restricted metadata to unauthorized users.
- Be enforced through IAM, Need-to-Know, and tenant isolation.
- Be included in catalog and audit records.

## AI Rules

AI may suggest classification based on metadata and context. AI must not
downgrade sensitivity, reduce access controls, approve public exposure, or
override human classification decisions.

## Audit Requirements

Audit must cover:

- Classification created.
- Classification changed.
- Sensitivity changed.
- Criticality changed.
- Provenance changed.
- Human override.
- Restricted access attempt.
