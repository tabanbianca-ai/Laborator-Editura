# IAM Authorization

## Purpose

Authorization decides whether an authenticated subject may perform an action on
a resource in a given context.

All protected modules must use IAM authorization decisions. UI hiding is not
authorization.

## Authorization Model

The primary model is RBAC with policy and contextual extensions.

Effective access is determined from:

- User identity.
- Organization.
- Workspace.
- Roles.
- Permissions.
- Groups or teams.
- Project scope.
- Document scope.
- Resource owner.
- Resource state.
- Workflow state.
- Need-to-Know grant.
- Data classification.
- Subscription entitlement.
- Temporary access window.
- Organization security policy.

The most restrictive valid rule wins.

## Current Repository Baseline

Current authorization foundations:

- `AuthenticatedRequestContext` includes roles and MVP permissions.
- `permissionsForRoles` maps roles to permissions.
- Many services validate actor context and selected roles.
- Workflow approval gates require authorized human roles.
- Workspace models Need-to-Know grants and temporary access.
- Enterprise Admin models roles, permissions, invitations, teams, and
  memberships.
- Policy Engine and Security Governance model policy metadata and access
  reviews.

Current limitations:

- Authorization is not yet a single centralized runtime decision service for
  every module action.
- Permission catalog is still MVP-sized.
- Module-specific role checks still exist in several services.
- ABAC/contextual rules are documented but not fully enforced uniformly.

## Authorization Decision Record

Each access decision should be able to produce:

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

Decisions:

- `ALLOW`.
- `DENY`.
- `MANUAL_REVIEW_REQUIRED`.

## Access Enforcement Rules

- Every protected API must require authenticated context.
- Every mutation must verify permission server-side.
- Tenant isolation must be enforced before resource access.
- Need-to-Know restrictions must reduce visible data and actions.
- Temporary access must expire automatically.
- Revocation must be effective immediately as implementation allows.
- AI agents receive only minimum necessary data and may not expand access.

## Human Final Authority

AI may:

- Detect suspicious access.
- Suggest policy changes.
- Summarize access reviews.
- Explain denied access.

AI may not:

- Grant access.
- Revoke users.
- Assign roles.
- Approve access reviews.
- Change policies automatically.
