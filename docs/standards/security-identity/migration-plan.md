# Canonical Security, Identity and Access Migration Plan

## Purpose

This migration plan defines the safe path for aligning identities,
authentication, authorization, secrets, cryptographic assets, security events,
and access governance with Standard 05.

It is incremental and security-first. It does not authorize runtime SSO,
runtime OAuth or OIDC login, runtime SAML login, real MFA enforcement,
external secret vault integration, managed key service integration, database
migrations, Docker changes, UI changes, or breaking API changes by itself.

## Phase 1 - Activate the Standard

Deliverables:

- Reference Standard 05 from `SPEC.md`.
- Reference Standard 05 from `ROADMAP.md`.
- Add Standard 05 directive to `AGENTS.md`.
- Add Standard 05 to the Manifest and Codex catalog.
- Preserve existing Auth, IAM, Gateway, Security Governance, Enterprise Admin,
  Workspace, Policy Engine, and Launch Essentials behavior.

Acceptance criteria:

- Standard 05 is discoverable as the canonical security, identity, and access
  standard.
- Existing security and IAM documents remain valid as local implementation
  guidance.
- No runtime changes are introduced.

## Phase 2 - Identity Inventory

Deliverables:

- Inventory users.
- Inventory organizations.
- Inventory groups and teams.
- Inventory roles and permissions.
- Inventory service accounts and API clients.
- Inventory AI agent identities.
- Inventory system processes and automation workflows.
- Map every identity to owner, status, lifecycle state, authentication
  method, authorization profile, classification, and audit requirements.

Acceptance criteria:

- Every identity family has an owner.
- Protected identities are explicitly classified.
- Duplicate or overlapping identity definitions are mapped to the canonical
  identity model.

## Phase 3 - Authentication Hardening Plan

Deliverables:

- Map current local authentication to the authentication standard.
- Map session lifecycle, refresh, revocation, expiration, and idle timeout.
- Define MFA enforcement plan for sensitive roles.
- Define SSO provider runtime plan.
- Define OAuth 2.1 and OpenID Connect runtime plan.
- Define SAML runtime plan where needed.
- Define passkey or WebAuthn roadmap.
- Define device verification metadata and policy plan.

Acceptance criteria:

- Current authentication remains compatible.
- Future authentication providers can be added only through IAM.
- MFA and SSO cannot bypass existing session, audit, or authorization rules.

## Phase 4 - Authorization Consolidation Plan

Deliverables:

- Expand atomic permission catalog.
- Map protected module actions to permissions.
- Define authorization decision record schema.
- Define ABAC and PBAC rule metadata.
- Map Need-to-Know rules to authorization enforcement.
- Define temporary access revocation behavior.
- Define privileged role protection and Separation of Duties rules.

Acceptance criteria:

- UI hiding is never treated as authorization.
- Protected APIs enforce access server-side.
- The most restrictive valid rule wins.

## Phase 5 - Secrets Governance Plan

Deliverables:

- Inventory secret metadata.
- Classify secret types.
- Define owner, rotation, expiration, and access policy.
- Define external vault integration target.
- Define secret scan workflow.
- Define API key and webhook secret rotation workflow.
- Define provider credential storage rules.

Acceptance criteria:

- Secrets are never hardcoded, logged, or returned by APIs.
- Secret metadata is auditable.
- External vault integration can be added without changing module behavior.

## Phase 6 - Cryptographic Asset Plan

Deliverables:

- Inventory cryptographic asset metadata.
- Define key and certificate metadata model.
- Define managed key service target.
- Define certificate renewal monitoring plan.
- Define backup encryption key governance.
- Define token and webhook signing key rotation plan.
- Define approved algorithm and exception policy.

Acceptance criteria:

- Cryptographic assets have owners, usage policies, rotation schedules, and
  audit requirements.
- Weak or custom cryptography requires approved security exception.

## Phase 7 - Security Events and Monitoring

Deliverables:

- Map authentication events.
- Map authorization events.
- Map role and permission events.
- Map secret events.
- Map cryptographic asset events.
- Map incident and policy violation events.
- Define SIEM integration target.
- Define security monitoring dashboards and alert rules.

Acceptance criteria:

- Security events are structured, correlated, auditable, and safe.
- Logs do not expose secrets or restricted content.

## Phase 8 - Continuous Compliance

Deliverables:

- Add checks for public endpoints.
- Add checks for unmanaged roles and permissions.
- Add checks for weak or default secrets.
- Add checks for missing audit in sensitive actions.
- Add release review checklist for identity, access, secrets, and crypto
  changes.

Acceptance criteria:

- New identities, credentials, permissions, and security assets cannot bypass
  Standard 05.
- Exceptions require explicit architecture approval.
- Documentation remains the source of truth until runtime registries are
  implemented.

## Non-Goals

This plan does not implement:

- Runtime SSO.
- Runtime OAuth or OIDC login.
- Runtime SAML login.
- Real MFA challenge enforcement.
- External vault integration.
- Managed key service integration.
- Certificate authority integration.
- Database migrations.
- UI changes.
- Docker or staging changes.

