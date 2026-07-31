# Data Protection

## Purpose

Data Protection defines how sensitive data, personal data, editorial data,
rights data, security data, AI data, and operational data are protected.

## Protection Methods

Data protection may use:

- Encryption in transit.
- Encryption at rest.
- Digital signatures.
- Hashing.
- Tokenization.
- Pseudonymization.
- Data masking.
- Access classification.
- Need-to-Know filtering.
- Audit and retention controls.

## Data Classification

Data must be classified according to sensitivity:

- Public.
- Internal.
- Confidential.
- Restricted.
- Highly Restricted.

Examples:

- Public catalog metadata is Public only after authorized release.
- Draft manuscripts are Confidential or Restricted.
- Rights negotiations are Restricted.
- Credentials, secrets, tokens, and security events are Highly Restricted.
- AI context inherits classification from source data.

## Encryption in Transit

Production communication must use encrypted transport where applicable.

Requirements:

- HTTPS for public traffic.
- Secure internal service communication where runtime architecture supports it.
- Secure provider communication for integrations.
- Certificate lifecycle management.

## Encryption at Rest

Sensitive storage must define:

- Encryption owner.
- Key owner.
- Rotation policy.
- Backup encryption policy.
- Restore procedure.
- Audit requirement.

Current runtime foundations include metadata and operational policy. Managed
key service integration is future work.

## Hashing

Hashing is required for:

- Passwords.
- API key secrets.
- Webhook secrets where appropriate.
- Recovery tokens where appropriate.

Hashes must not be reversible.

## Tokenization and Masking

Tokenization, pseudonymization, and masking should be used for:

- Personal data exports.
- Logs and traces.
- Support diagnostics.
- AI context preparation.
- Analytics datasets.

## Privacy by Design

Privacy rules:

- Collect minimum required data.
- Expose private data only to authorized users.
- Do not expose private reading history publicly.
- Do not expose restricted rights or contract data without authorization.
- Do not include secrets in logs, traces, JSON Master, exports, or frontend
  bundles.

## Current Baseline Assessment

Strengths:

- GDPR consent and request metadata exists.
- Secret Vault metadata exists.
- Need-to-Know foundations exist.
- API keys and webhook secrets are represented as hashed secrets.
- Security and audit documentation defines safe error and logging boundaries.

Gaps:

- External managed key service is not integrated.
- Field-level encryption is not standardized.
- Data masking is not centralized.
- Pseudonymization workflows are not fully implemented.
- Backup encryption is recommended but not fully managed.

## Standardization Plan

1. Map classifications to Data Catalog entries.
2. Define encryption requirements per data class.
3. Define masking rules for logs, traces, support, and AI context.
4. Add managed key service and vault integration in approved phases.
5. Add privacy validation to release readiness.
