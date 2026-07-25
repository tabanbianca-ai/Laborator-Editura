# Security and Governance Migration Plan

## Purpose

This document defines the incremental path from the current security
foundation to the full Chapter 9 Security, Identity, and Governance
architecture.

## Constraints

- Preserve validated Phase 7 Step 16 behavior.
- Do not introduce module-specific authentication.
- Do not introduce module-specific authorization.
- Do not trust client-provided identity.
- Do not weaken existing auth, request context, rate limiting, security
  headers, audit, or tenant isolation.
- Do not implement broad runtime changes before contracts and migration maps
  are complete.
- Do not change Docker, API contracts, database schema, or UI in this
  documentation phase.

## Phase 0 - Documentation Baseline

Status: Current.

Deliverables:

- `docs/ARCHITECTURE_CHAPTER_9.md`.
- `docs/security/security-architecture.md`.
- `docs/security/iam-architecture.md`.
- `docs/security/rbac-model.md`.
- `docs/security/security-policies.md`.
- `docs/security/data-classification.md`.
- `docs/security/api-security.md`.
- `docs/security/audit-strategy.md`.
- `docs/security/compliance.md`.
- `docs/security/security-gap-analysis.md`.
- `docs/security/security-migration-plan.md`.

Outcome:

- Official Security, Identity, and Governance architecture exists.

## Phase 1 - IAM Contract Alignment

Define canonical contracts for:

- User.
- Organization.
- Workspace.
- Role.
- Permission.
- Session.
- Authentication method.
- MFA requirement.
- Access policy.
- Authorization decision.
- Security audit event.

No behavior migration occurs in this phase.

## Phase 2 - Permission Catalog Expansion

Create the complete atomic permission catalog.

Map:

- Existing MVP permissions.
- Enterprise Admin permissions.
- Workspace permissions.
- Gateway permissions.
- Workflow permissions.
- AI permissions.
- Publishing permissions.
- Security and policy permissions.

Outcome:

- Compatibility map from existing permissions to target atomic permissions.

## Phase 3 - Authorization Decision Service

Introduce a central policy decision service.

Inputs:

- Authenticated context.
- Workspace.
- Resource.
- Action.
- Role.
- Permission.
- Need-to-Know scope.
- Subscription entitlement.
- Data classification.
- Resource state.
- Organization policy.

Existing module checks continue until parity tests exist.

## Phase 4 - Workspace Isolation Alignment

Make workspace scope explicit where required.

Tasks:

- Map organization-scoped tables to workspace-aware domains.
- Identify resources that remain organization-scoped.
- Identify resources that require workspace-scoped filtering.
- Add tests before changing behavior.

No destructive migration is allowed.

## Phase 5 - Data Classification Service

Centralize:

- Classification levels.
- Access rules.
- AI eligibility.
- Export eligibility.
- Backup handling.
- Retention behavior.
- Audit requirements.

Migrate existing Workspace classification metadata into the central model
incrementally.

## Phase 6 - MFA Enforcement

Convert MFA metadata into enforced MFA policy for configured sensitive roles.

Rules:

- Preserve Founder/Admin recovery.
- Provide recovery-code handling.
- Audit all changes.
- Do not lock out platform owner recovery.

## Phase 7 - OAuth, OIDC, and SSO

Add external identity providers through IAM.

Rules:

- No module-specific identity providers.
- Preserve local auth where required.
- Map external identities to internal users, roles, organizations, and
  workspaces.

## Phase 8 - Secret Management Maturity

Move from metadata placeholders to approved encrypted storage or external
vault integration.

Rules:

- Never log secrets.
- Preserve rotation and access audit.
- Support revocation.
- Keep provider credentials outside modules.

## Phase 9 - Audit Immutability and Compliance

Define and implement:

- Immutable audit storage.
- Retention policies.
- Compliance read models.
- Exportable compliance evidence.
- Security dashboards.

## Phase 10 - Full Security Validation

Validation must include:

- Authentication tests.
- Authorization tests.
- Workspace isolation tests.
- Need-to-Know tests.
- MFA tests when enforced.
- API security tests.
- Secret handling tests.
- Audit immutability tests.
- Backup/restore tests.
- AI governance traceability tests.
- End-to-end editorial pipeline smoke test.

## Acceptance Criteria

Migration is complete when:

- IAM is the single identity source.
- Policy-based authorization is centralized.
- Atomic permissions are complete.
- Workspaces are isolated.
- Data classification is platform-wide.
- MFA is enforceable where policy requires it.
- Secrets are securely managed.
- Audit is immutable.
- Compliance evidence is demonstrable.
- AI interactions are traceable and governed.
- Phase 7 Step 16 behavior remains intact.
