# RBAC and Permission Model

## Purpose

This document defines the target RBAC and atomic permission model for
Laborator Editura.

RBAC is required but not sufficient by itself. Effective access is:

```text
Role permissions
  x Subscription entitlements
  x Need-to-Know scope
  x Workspace policy
  x Data classification
  x Resource state
```

## Official Roles

Official roles:

- Administrator.
- Editor.
- Translator.
- Proofreader.
- Designer.
- Audio Narrator.
- Author.
- Collaborator.
- Reader.
- Guest.

Protected platform role:

- Platform Creator.

Extended implementation roles may exist where already approved, such as
Project Manager or Reviewer, but they must remain governed by this model.

## Current RBAC Baseline

Current implementation includes:

- `MvpRole` type in Auth.
- Server-derived roles in sessions.
- `permissionsForRoles` mapping.
- Enterprise Admin role and permission metadata.
- Workspace role filtering and Need-to-Know grants.
- Platform Creator protected role.

Current MVP permissions include:

- `admin:manage`.
- `project:write`.
- `document:write`.
- `segment:write`.
- `translation:write`.
- `review:approve`.
- `design:write`.
- `audio:write`.
- `author:write`.
- `collaboration:write`.
- `export:write`.
- `read`.

## Target Atomic Permission Families

Target permission families:

- `project.*`.
- `document.*`.
- `manuscript.*`.
- `segment.*`.
- `translation.*`.
- `review.*`.
- `workflow.*`.
- `publication.*`.
- `library.*`.
- `rights.*`.
- `research.*`.
- `lexicographic.*`.
- `terminology.*`.
- `qa.*`.
- `semantic_fidelity.*`.
- `export.*`.
- `admin.*`.
- `security.*`.
- `policy.*`.
- `gateway.*`.
- `api_key.*`.
- `webhook.*`.
- `ai.*`.
- `backup.*`.
- `observability.*`.
- `commerce.*`.
- `collaboration.*`.

## Authorization Inputs

Authorization must evaluate:

- User identity.
- Workspace.
- Organization.
- Role.
- Permission.
- Resource owner.
- Resource scope.
- Resource state.
- Workflow state.
- Data classification.
- Subscription entitlement.
- Need-to-Know grant.
- Organization policy.
- Temporary access window.

## Most Restrictive Rule

When multiple access rules apply, the most restrictive valid rule wins.

Example:

- A role may allow document viewing.
- A Need-to-Know grant may limit viewing to selected segments.
- A `RESTRICTED` classification may require an explicit grant.
- The final decision must only allow the explicitly permitted segment scope.

## AI Access

AI agents receive minimum necessary data only.

AI may not:

- Expand its own permissions.
- Grant roles.
- Approve access reviews.
- Revoke users.
- Change security policy automatically.

## RBAC Gaps

Current permission mapping is appropriate for MVP foundations but is not yet
the complete atomic permission catalog required by Chapter 9.

Future work should move module-specific permission checks toward a shared
policy evaluation service while preserving existing behavior.
