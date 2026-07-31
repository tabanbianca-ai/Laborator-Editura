# Authorization Standard

## Purpose

This document defines the canonical authorization model for Laborator Editura.

Authorization decides whether an authenticated identity may perform an action
on a resource in a specific context.

## Authorization Models

The platform authorization model combines:

- Role-Based Access Control.
- Attribute-Based Access Control.
- Policy-Based Access Control.
- Need-to-Know access.
- Tenant isolation.
- Scope-based grants.
- Temporary access.
- Separation of Duties.

RBAC remains the current baseline. ABAC and PBAC are target extensions that
must be introduced incrementally through approved implementation phases.

## Permission Fields

Every governed permission must define:

- `uuid`.
- `permissionName`.
- `resource`.
- `allowedOperations`.
- `scope`.
- `constraints`.
- `owner`.
- `auditPolicy`.

## Authorization Decision Inputs

Authorization decisions may use:

- Identity.
- Organization.
- Workspace.
- Roles.
- Permissions.
- Groups.
- Teams.
- Project scope.
- Document scope.
- Resource owner.
- Resource state.
- Workflow state.
- Need-to-Know grant.
- Data classification.
- Subscription entitlement.
- Temporary access window.
- Security policy.
- Compliance policy.

The most restrictive valid rule wins.

## Authorization Decision Record

Each sensitive authorization decision should be able to produce:

- `decisionId`.
- `subjectId`.
- `organizationId`.
- `resourceType`.
- `resourceId`.
- `action`.
- `decision`.
- `matchedRules`.
- `mostRestrictiveRuleApplied`.
- `reason`.
- `evaluatedAt`.
- `correlationId`.

Canonical decisions:

- `ALLOW`.
- `DENY`.
- `MANUAL_REVIEW_REQUIRED`.

## Role Governance

Roles must:

- Be assigned by authorized humans only.
- Be scoped where possible.
- Preserve assignment history.
- Preserve revocation history.
- Avoid self-escalation.
- Avoid AI-initiated privileged grants.
- Respect protected role rules.

Platform Creator and Founder protections must not be weakened by this
standard.

## Need-to-Know

Need-to-Know reduces visible data, actions, panels, comments, versions,
assets, rights records, exports, and agent context to what is required for the
current role, task, project, document, workflow stage, and explicit grant.

UI hiding is not authorization. Restricted data must not be returned by APIs
to unauthorized callers.

## Service and API Client Authorization

Service accounts and API clients must define:

- Owner.
- Purpose.
- Allowed scopes.
- Allowed resources.
- Expiration.
- Rotation policy.
- Revocation policy.
- Audit policy.

Service access must remain least-privilege and tenant-aware.

## AI Agent Authorization

AI agents:

- Receive minimum necessary data only.
- Must use approved orchestration and governance.
- Must not expand their own access.
- Must not grant roles or permissions.
- Must not approve access reviews.
- Must not change security policy.

## Audit

Audit must record:

- Permission created.
- Permission updated.
- Role created.
- Role updated.
- Role assigned.
- Role revoked.
- Access granted.
- Access changed.
- Access revoked.
- Temporary access expired.
- Restricted access attempted.
- Privileged action authorized.
- Privileged action denied.
- Approved exception.

