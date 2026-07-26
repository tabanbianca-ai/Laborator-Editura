# Data Classification

## Purpose

Data Classification defines the sensitivity and handling policy for entities,
fields, documents, attachments, exports, and datasets.

## Classification Levels

Minimum levels:

- `PUBLIC`.
- `INTERNAL`.
- `CONFIDENTIAL`.
- `RESTRICTED`.

## Scope

Classification may apply to:

- Entity.
- Document.
- Field.
- Attachment.
- Export.
- Dataset.

## Examples

| Data | Classification |
| --- | --- |
| Published book metadata | `PUBLIC` |
| Editorial draft | `INTERNAL` |
| Unpublished manuscript | `CONFIDENTIAL` |
| Authentication secret | `RESTRICTED` |

## Current Repository Baseline

Classification appears in:

- Security documentation.
- Need-to-Know workspace access.
- Rights and provenance warnings.
- Secret Vault metadata.
- Public vs private Library and Community behavior.
- Infrastructure secret handling.

There is no unified classification registry attached to every master record
yet.

## Rules

- IAM enforces access.
- Data Governance defines classification and handling policy.
- Restricted fields must support redaction.
- Exports must preserve classification metadata where relevant.
- Search must not index restricted data unless explicitly authorized.
