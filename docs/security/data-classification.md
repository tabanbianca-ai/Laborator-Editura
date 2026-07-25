# Data Classification

## Purpose

This document defines the official data classification model for Laborator
Editura.

Classification controls access, protection, audit, retention, AI eligibility,
export behavior, and backup handling.

## Classification Levels

### PUBLIC

Information intentionally available publicly.

Examples:

- Published catalog metadata.
- Public store metadata.
- Approved public community content.

### INTERNAL

Information available to authorized internal users.

Examples:

- Internal project metadata.
- Standard workflow status.
- Non-confidential editorial notes.

### CONFIDENTIAL

Information requiring scoped access and stronger audit.

Examples:

- Unpublished manuscripts.
- Draft translations.
- Internal review comments.
- Rights discussions.
- Private author notes.

### RESTRICTED

Information requiring explicit authorization and strict audit.

Examples:

- Secrets.
- Security events.
- Sensitive rights records.
- Personal data export requests.
- Account deletion requests.
- Private reading history.
- Sensitive AI context.

## Current Baseline

Current implementation includes:

- Workspace confidential classifications:
  - `CONFIDENTIAL`.
  - `INTERNAL`.
  - `PUBLIC_METADATA`.
  - `RESTRICTED`.
- Need-to-Know grants.
- Restricted access attempt audit.
- Private reading and author data rules in module foundations.
- Rights and provenance metadata.
- GDPR consent and request metadata.
- Secret Vault metadata.

## Required Metadata

Classified data should record:

- Classification.
- Owner.
- Organization.
- Workspace.
- Resource scope.
- Retention policy.
- Access policy.
- Export eligibility.
- AI eligibility.
- Audit requirements.

## AI Eligibility

AI context must respect classification:

- `PUBLIC` may be used if provider policy allows it.
- `INTERNAL` may be used with organization policy approval.
- `CONFIDENTIAL` requires Need-to-Know and provider policy checks.
- `RESTRICTED` must not be sent to external AI providers without explicit
  policy approval.

## Export and Backup

Classification must inform:

- Export permission.
- Redaction requirements.
- Backup encryption requirements.
- Restore access controls.
- Retention behavior.

## Gap

Classification exists in Workspace and several module rules, but a single
platform-wide classification service is not yet implemented.

Future work should centralize classification evaluation while preserving
existing Need-to-Know and privacy behavior.
