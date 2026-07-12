# Phase 7 Step 12 - Platform-Wide Need-to-Know Access Model Report

## Status

Implemented as an additive Workspace/IAM refinement.

## Scope

- No new enterprise module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Existing Workspace, IAM/RBAC, project/document permissions, audit, runtime
  persistence, backup/restore, and AI governance are reused.

## Implemented

- Workspace collaborator invitations with role, project scope, assigned
  documents, manuscripts, chapters, sections, segments, permitted tools,
  optional expiration, reason, access preview, and audit trail.
- Need-to-know access grants with temporary access metadata, revocation
  metadata, confidentiality classification, and most-restrictive-rule marker.
- Server-side access evaluation for projects, manuscripts, documents, chapters,
  sections, segments, comments, versions, linguistic sources, rights records,
  media assets, exports, publishing, distribution, administration, and agent
  execution records.
- Role-specific visible panels and actions for translators, reviewers, layout
  specialists, illustrators, audio/video collaborators, collaborators, and
  administrators.
- Restricted metadata protection: unauthorized decisions return no restricted
  metadata and hidden data is marked as not loaded through API responses.
- Temporary access expiration and immediate revocation metadata.
- AI agent data access audit with agent, task, accessed resources, access
  scope, decision, result, timestamp, and `agentMayExpandOwnAccess: false`.
- Runtime database and backup/restore table coverage for:
  - `workspace_collaborator_invitations`
  - `workspace_need_to_know_grants`
  - `workspace_audit_events`

## Audit Coverage

The implementation models audit events for:

- Invitation sent.
- Invitation accepted.
- Need-to-know access granted.
- Need-to-know access changed.
- Need-to-know access revoked.
- Temporary access expired.
- Restricted access attempt.
- Document opened.
- Confidential resource accessed.
- AI agent data access.
- Workspace human override.

## Rules Preserved

- Human Final Authority remains required.
- AI agents may not expand their own access.
- Hidden data is not returned through unauthorized API responses.
- The most restrictive valid rule wins.
- Rights, financial data, administration, distribution credentials, and private
  internal discussions remain hidden unless explicitly authorized.

## Validation

Added contract coverage in:

- `apps/api/tests/platform-need-to-know-access-contract.test.mjs`
- `packages/db/tests/runtime-backup-restore.test.mjs`

Expected validation commands:

```bash
git diff --check
pnpm --filter @laborator/db build
pnpm --filter @laborator/api build
pnpm --filter @laborator/web typecheck
pnpm --filter @laborator/web build
pnpm --filter @laborator/api test
pnpm --filter @laborator/web test
pnpm typecheck
pnpm test
pnpm build
```

## Out Of Scope

- No new UI redesign.
- No Docker/staging changes.
- No external identity provider changes.
- No new enterprise module.
- No automatic publication, rights approval, policy change, or security change.
