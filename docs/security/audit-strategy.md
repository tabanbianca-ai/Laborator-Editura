# Audit Strategy

## Purpose

This document defines the audit strategy for Security, Identity, and
Governance.

Audit proves what happened, who did it, when it happened, what changed, and
which policy or approval governed the action.

## Current Audit Baseline

Current audit foundations include:

- Auth audit events.
- Auth activity events.
- Auth security events.
- Foundation audit events.
- Workflow audit events.
- Translation Memory audit events.
- Terminology audit events.
- QA audit events.
- Semantic Fidelity audit events.
- Editorial Decision audit events.
- Layout and Publishing audit events.
- Rights audit events.
- Security Governance audit events.
- Policy Engine audit events.
- Gateway and Integration audit events.
- Workspace audit events.
- Launch Essentials audit events.
- AI Cost audit events.
- Backup audit events.
- Observability audit events.
- Module-specific audit events across Phase 2-7 foundations.

Runtime backup includes these audit tables.

## Required Audit Fields

Audit records should include:

- Audit ID.
- Organization.
- Workspace when available.
- Actor.
- Action.
- Resource type.
- Resource ID.
- Before state when applicable.
- After state when applicable.
- Reason or metadata when applicable.
- Correlation ID when available.
- Timestamp.
- Human Final Authority marker where applicable.

## Immutable Audit

Audit must be immutable.

Future durable storage must prevent:

- In-place audit modification.
- Silent deletion.
- Unauthorized retention reduction.
- Loss during backup/restore.

## Security Audit Scope

Security audit must cover:

- Authentication success.
- Authentication failure.
- Account lockout.
- Session refresh.
- Session expiration.
- Session revocation.
- Password reset.
- Password change.
- Email verification.
- MFA enable/disable.
- GDPR consent and withdrawal.
- Personal data export request.
- Account deletion request.
- Secret metadata storage, rotation, and access.
- Role assignment.
- Permission changes.
- Access review.
- Policy violation.
- Compliance exception.
- API key creation and revocation.
- Webhook creation and state changes.
- Restricted access attempts.
- Sensitive resource access.
- AI execution traceability.

## Audit and Observability

Audit and observability are related but distinct.

Audit records:

- Authorized action history.

Observability records:

- System behavior, performance, health, and diagnostic telemetry.

Both are required for production security.

## Gap

Audit coverage is broad, but the architecture still needs:

- A unified audit query/read model.
- Immutable durable audit storage guarantees.
- Standard correlation IDs across all audit records.
- Consistent workspace references across all audit records where applicable.
