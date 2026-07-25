# AI Security and Privacy

## Purpose

This document defines security and privacy requirements for AI and external
provider integrations.

## Security Boundary

The AI Orchestration Service is the only approved security boundary between
platform modules and external AI providers.

Functional modules must not:

- Store provider credentials.
- Send direct provider requests.
- Log provider secrets.
- Construct unrestricted provider payloads.
- Bypass Need-to-Know access.

## Authentication and Authorization

Every AI request must be tied to:

- Authenticated user.
- Organization.
- Workspace when available.
- Project or resource scope when available.
- Roles.
- Permissions.
- Subscription entitlements.
- Need-to-Know scope.

Requests without valid authenticated context must be rejected.

## Tenant Isolation

AI context must be tenant-scoped. Data from one organization must never be sent
as AI context for another organization.

Cross-tenant provider telemetry must be aggregated only when it does not expose
content, identifiers, secrets, or restricted metadata.

## Sensitive Data Filtering

Before sending any payload to an external provider, orchestration must apply
sensitive data filtering based on:

- Privacy classification.
- Rights and provenance restrictions.
- User permissions.
- Organization policy.
- Provider data-use policy.
- Data residency policy.
- Content type.

Sensitive data must not be sent to external providers unless a documented
policy explicitly allows it.

## Provider Credentials

Provider credentials must:

- Be stored outside functional modules.
- Be encrypted or referenced through an approved secret mechanism.
- Never appear in logs, traces, audit text, frontend bundles, test snapshots,
  or exported project data.
- Be rotatable.
- Be revocable.
- Be scoped to the minimum necessary permissions.

## Privacy by Design

AI requests must use minimum necessary context.

The orchestration layer should prefer references, excerpts, or filtered
context over full documents whenever the task allows it.

Private reading data, restricted rights discussions, security data, secrets,
and unrelated editorial discussions must not be sent to AI providers unless
explicitly authorized by policy and role.

## Human Final Authority

AI security policy must preserve the Human Final Authority rule.

AI must not:

- Approve publications.
- Approve budgets.
- Grant rights.
- Revoke users.
- Modify security policies.
- Activate providers.
- Bypass workflow restrictions.

## Retention

AI execution records must preserve auditability while minimizing exposure of
sensitive content.

Records may store:

- References to inputs.
- Redacted summaries.
- Prompt references.
- Result references.
- Approval metadata.
- Cost and telemetry.

Full prompt and response payload retention must be controlled by policy.

## Baseline Security Gap

Current foundations include authentication, role-aware request context, AI
governance metadata, security governance metadata, observability metadata, and
audit patterns.

The dedicated AI Orchestration security boundary, provider credential handling,
sensitive data filtering pipeline, and prompt-specific policy enforcement are
not yet implemented as a complete runtime layer.
