# Publishing Workflows

## Purpose

Publishing workflows define how approved content becomes an official
publication without duplicating the Workflow Engine.

## Target Publishing Workflow

```text
READY_FOR_PUBLISHING
  -> BUILDING
  -> VALIDATION
  -> PUBLISHED
  -> DISTRIBUTED
```

## Publication Lifecycle States

The specification supports:

- `DRAFT`.
- `READY`.
- `PUBLISHED`.
- `SUSPENDED`.
- `WITHDRAWN`.
- `ARCHIVED`.

Current Phase 7 Step 16 publishing states are:

- `IN_PREGATIRE`.
- `GATA_PENTRU_PUBLICARE`.
- `PUBLICAT`.
- `REPUBLICAT`.
- `RETRAS_DIN_PUBLICARE`.

## Current Workflow Baseline

Current Workflow Engine statuses include:

- `APPROVED`.
- `READY_FOR_EXPORT`.
- `EXPORTED`.
- `BLOCKED`.

Publishing preflight validates:

- Metadata completeness.
- Rights validation.
- Required formats.
- Required format coverage.
- Images and resources.
- Accessibility requirements.
- Layout validation.
- Mandatory translations.
- Mandatory review completion.
- Identifier presence.
- Edition selection.
- Version selection.
- Visibility.
- Publication channels.
- Workflow approvals.

## Blocking Rules

Publishing must block when:

- Source content is not approved.
- Editorial Review is incomplete.
- Rights are missing, expired, or restrictive.
- Critical preflight errors exist.
- Required formats are missing.
- Required metadata is incomplete.
- Edition or version selection is inconsistent.
- Workflow approval is missing.

## Withdrawal Rules

Withdrawal must:

- Preserve Library records.
- Preserve generated files.
- Preserve audit.
- Preserve versions.
- Preserve distribution history.
- Mark channel withdrawal where applicable.
- Avoid permanent deletion.

## Human Final Authority

Only authorized human users may approve publication, accept publication
warnings, publish, withdraw, republish, or archive.

AI may summarize readiness and suggest remediation only.

## Gaps

- Target `BUILDING` and `VALIDATION` states are represented through preflight
  and publishing records, not dedicated Workflow Engine states.
- Canonical mapping between Romanian Phase 7 Step 16 states and English
  Module 4 states should be documented before implementation.
- Archive behavior is specified but not implemented as a canonical publishing
  action.
