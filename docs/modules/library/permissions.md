# Library Permissions

## Purpose

This document defines Library permissions and access rules.

## Minimum RBAC Roles

Library must support the platform roles:

- Administrator.
- Editor.
- Translator.
- Proofreader or Reviewer.
- Author.
- Reader.
- Guest.

The broader platform role set may also include Project Manager, Designer,
Audio Narrator, Collaborator, and Platform Creator.

## Current Implementation Baseline

Current implementation:

- Uses authenticated server-derived request context.
- Scopes user library items by `organizationId` and `userId`.
- Scopes publication records by `organizationId`.
- Hides `restrictedMetadata` and `sourceAcquisition` unless actor role is
  `PLATFORM_CREATOR`, `ADMIN`, or `EDITOR`.
- Records audit events for user and publication actions.

## Need-to-Know Rules

Library access must respect:

- Organization.
- Workspace.
- Project.
- Document.
- Library Item.
- Asset.
- Assigned role.
- Assigned task.
- Confidentiality classification.
- Rights restrictions.

Most restrictive valid rule wins.

## Role Expectations

Administrator:

- Can manage Library configuration and authorized Library operations.

Editor:

- Can manage editorial metadata, relationships, publication records, and
  restricted metadata when assigned.

Translator:

- Can access assigned source/target Library Items and linguistic context.

Proofreader or Reviewer:

- Can access assigned source, translation, review, and relevant version
  history.

Author:

- Can access owned manuscripts and submitted editorial records.

Reader:

- Can access public or explicitly granted reading resources and private reader
  data.

Guest:

- Has no authenticated Library access unless explicitly granted through a
  controlled public endpoint or invitation.

## Permission Gaps

- Fine-grained Library permission names are not fully documented as constants.
- Project/document/asset-level Need-to-Know enforcement needs further
  integration for every Library relationship type.
- Temporary grants and collaborator access are governed by platform-wide
  directives but are not yet fully represented in Library-specific contracts.
