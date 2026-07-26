# IAM Migration Plan

## Purpose

This document defines the incremental path from the current repository
baseline to the official Identity, Access Management and Security Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Auth, Request Context, Security
Governance, Policy Engine, Enterprise Admin, Workspace, Gateway, Launch
Essentials, Workflow, Notification, audit, and backup behavior.

## Constraints

- Do not create independent authentication systems in modules.
- Do not create independent authorization systems in modules.
- Do not trust client-provided identity, organization, role, or permission
  values.
- Do not weaken Founder Protection or Platform Creator protection.
- Do not break public endpoint exceptions that are explicitly approved.
- Do not expose secrets, tokens, password hashes, MFA secrets, or recovery
  codes.
- Do not allow AI to grant roles, revoke users, approve access reviews, enable
  SSO, or change security policies automatically.
- Do not destabilize existing Auth APIs.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory users, roles, permissions, sessions, policies, APIs, and events.
- Map Auth, Security Governance, Policy Engine, Enterprise Admin, Workspace,
  Gateway, and Launch Essentials responsibilities.
- Document gaps, risks, and migration dependencies.

## Phase 2 - IAM Contracts

Define canonical contracts:

- `User`.
- `Group`.
- `Role`.
- `Permission`.
- `RoleAssignment`.
- `AuthenticationMethod`.
- `Session`.
- `MfaFactor`.
- `SsoProvider`.
- `SecurityPolicy`.
- `IamAuditEvent`.

No runtime migration occurs in this phase.

## Phase 3 - Atomic Permission Catalog

Expand the MVP permission model into module-level atomic permissions.

Rules:

- Existing permissions remain compatible.
- New permissions are additive.
- Role mappings are versioned.
- Access tests are added before enforcement changes.

## Phase 4 - Central Authorization Decision Service

Introduce an IAM authorization service behind current module checks.

Rules:

- Start with read-only decision logging.
- Compare central decisions with existing module decisions.
- Enforce only after compatibility is proven.
- Preserve Need-to-Know and tenant isolation.

## Phase 5 - Policy Enforcement Alignment

Connect Security Governance and Policy Engine metadata to runtime decisions.

Targets:

- Password/login policy.
- Session policy.
- MFA requirement policy.
- API key policy.
- Webhook security policy.
- Organization access policy.

## Phase 6 - MFA Enforcement

Convert MFA metadata into runtime MFA challenge support.

Rules:

- Sensitive roles are prioritized.
- Recovery code handling is auditable.
- MFA bypass requires authorized human break-glass policy.
- Existing sessions are handled according to policy.

## Phase 7 - SSO Provider Runtime

Add OIDC/SAML provider runtime support through IAM.

Rules:

- Provider secrets use Secret Vault governance.
- Role mapping is auditable.
- MFA policy still applies.
- Local auth remains compatible unless policy disables it.

## Phase 8 - Service Principals and API Tokens

Align Gateway API keys and future personal access tokens with IAM.

Rules:

- Existing Gateway APIs remain compatible.
- API keys receive IAM principal metadata.
- Scope validation becomes part of IAM authorization.

## Phase 9 - Distributed Sessions and Cache

Introduce scalable session validation:

- Distributed cache.
- Revocation propagation.
- Role/permission cache invalidation.
- Suspicious session signals.

## Phase 10 - Unified IAM Events

Standardize IAM event envelope and event versions.

Rules:

- Existing audit tables remain compatible.
- Events must not contain secrets.
- Security-critical events are audit-linked.

## Phase 11 - Module Adoption

Adopt IAM authorization across modules incrementally:

1. Administration and Workspace.
2. Workflow and Notification.
3. Publishing, Distribution, and Rights.
4. Translation, Review, and Library.
5. AI Orchestration and Marketplace.
6. Gateway and Integrations.
7. Research, Collaboration, Audio, Video, and Magazine.

## Phase 12 - Performance and Resilience

Add:

- IAM health checks.
- Permission decision metrics.
- Session validation latency metrics.
- Failed access monitoring.
- Cache hit/miss metrics.
- Revocation propagation tests.
- High availability runbooks.

## Testing Requirements

Each phase requires:

- Authentication tests.
- Authorization tests.
- RBAC tests.
- Need-to-Know tests.
- Tenant isolation tests.
- MFA tests when enforcement changes.
- SSO tests when providers are added.
- Session expiration and revocation tests.
- Security policy tests.
- Audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for Auth, Workflow, Notification, Publishing,
  Distribution, and Phase 7 Step 16 behavior.

## Next Recommended Module

Module 13 - Observability, Monitoring and Audit Module Architecture is now
documented after Identity, Access Management and Security.

Module 14 - Backup, Disaster Recovery and Business Continuity Module
Architecture is now documented after Observability, Monitoring and Audit.

Module 15 - Search, Indexing and Knowledge Graph Module Architecture is now
documented after Backup, Disaster Recovery and Business Continuity.

Module 16 - Integration, API Gateway and External Connectors Module
Architecture is now documented after Search, Indexing and Knowledge Graph.

The next recommended module specification after Integration, API Gateway and
External Connectors is Module 17 - Configuration, Feature Flags and Platform
Administration Module Architecture.
