# Canonical Test Data Management Standard

## Purpose

This document defines rules for test data, fixtures, synthetic data,
anonymization, separation from production, cleanup, versioning, and audit.

## Test Data Principles

Test data must be:

- Controlled.
- Reproducible.
- Versioned.
- Separate from production.
- Free of secrets.
- Anonymized or synthetic when derived from real data.
- Cleaned automatically after testing where needed.

Uncontrolled copying of personal data from production is prohibited.

## Test Data Types

Canonical test data types include:

- Synthetic fixtures.
- Contract fixtures.
- Migration fixtures.
- JSON Master fixtures.
- API request fixtures.
- UI mock data.
- Accessibility test samples.
- Localization dictionaries.
- AI evaluation datasets.
- Backup and restore snapshots.
- Redacted production-derived datasets.

## Test Data Fields

Every governed test data asset should define:

- Data ID.
- Canonical identifier.
- Owner.
- Purpose.
- Module.
- Source.
- Version.
- Classification.
- Contains personal data flag.
- Contains secrets flag.
- Anonymization status.
- Retention policy.
- Cleanup policy.
- Usage restrictions.

## Production Data Rules

Production data may be used for testing only when:

- Approved by data governance.
- Anonymized or pseudonymized as required.
- Free of secrets.
- Legally permitted.
- Access-controlled.
- Versioned.
- Retained according to policy.
- Audited.

## Secrets

Test data must never contain:

- Passwords.
- Tokens.
- API keys.
- Webhook secrets.
- MFA secrets.
- Private keys.
- Recovery codes.
- Provider credentials.

Secret-like placeholders must be clearly fake and safe.

## Cleanup

Test cleanup must define:

- Cleanup scope.
- Cleanup trigger.
- Cleanup owner.
- Safe deletion rules.
- Retention exceptions.
- Evidence retention.

Data required for audit evidence must be preserved as references or redacted
snapshots rather than silently deleted.

## AI Evaluation Data

AI evaluation datasets must be:

- Versioned.
- Representative.
- Risk-based.
- Protected when containing sensitive content.
- Linked to expected outputs or evaluation criteria.
- Reviewed by authorized humans when high-risk.

## Audit

Audit must record:

- Test data created.
- Test data versioned.
- Test data imported.
- Test data anonymized.
- Test data used in execution.
- Test data cleaned.
- Production-derived data approved.
- Test data policy violation detected.
