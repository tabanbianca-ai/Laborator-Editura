# IAM RBAC Model

## Purpose

This document defines Role-Based Access Control for IAM.

RBAC is the baseline authorization model. It is extended by policies,
Need-to-Know access, workflow state, data classification, and subscription
entitlements.

## Official Roles

Official platform roles:

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

Internal role identifiers:

- `ADMIN`.
- `EDITOR`.
- `TRANSLATOR`.
- `PROOFREADER`.
- `DESIGNER`.
- `AUDIO_NARRATOR`.
- `AUTHOR`.
- `COLLABORATOR`.
- `READER`.
- `GUEST`.

Protected role:

- `PLATFORM_CREATOR`.

Additional approved implementation roles may exist, such as `REVIEWER`,
`NARRATOR`, `VIEWER`, or `PROJECT_MANAGER`, when mapped to official role
semantics.

## Current Repository Baseline

Current roles are defined in `MvpRole` and related admin/workspace models.

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

The current model is appropriate for MVP foundations but not yet complete for
the full module architecture.

## Target Permission Families

Future atomic permission families:

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
- `notification.*`.

## Role Versioning

Roles should be versioned when permission sets change.

Rules:

- Built-in role definitions require governed change approval.
- Custom roles are tenant-scoped.
- Role changes must be auditable.
- Previous role versions remain available for audit.

## Platform Creator

The Platform Creator role:

- Is unique.
- Cannot be removed.
- Cannot be downgraded.
- Cannot be assigned to normal users.
- Is independent of subscription limits.
- Must be audited on privileged access.

## RBAC Evaluation

RBAC must answer:

- Does the subject have a role?
- Does the role include the permission?
- Is the role valid for this organization, workspace, project, document, or
  task?
- Is the role limited by Need-to-Know, policy, data classification, workflow
  state, or subscription?

## Audit Requirements

Audit must record:

- Role created.
- Role versioned.
- Role assigned.
- Role revoked.
- Permission granted.
- Permission removed.
- Permission denied.
- Platform Creator access.
