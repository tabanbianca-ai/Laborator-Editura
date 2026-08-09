# Codex v1.0 Pilot Plan

Status: BLOCKED_PENDING_RC1_APPROVAL  
Mode: FINAL_ACCEPTANCE_MODE  
Target version: 1.0.0

## Precondition

The pilot can start only after Batch 11 produces `RC1_APPROVED` and an immutable `1.0.0-rc.1` artifact.

Current status: precondition not met. Batch 11 is `BLOCKED`.

## RC1 Artifact Promotion Record

| Field | Value |
| --- | --- |
| source_commit | MISSING |
| artifact_digest | MISSING |
| deployment_id | MISSING |
| environment | pilot |
| migration_version | MISSING |
| deployed_at | NOT_DEPLOYED |
| deployed_by | NOT_DEPLOYED |

## Build Once Rule

The pilot must use the exact approved RC1 artifact. The artifact must not be rebuilt for pilot.

## Pilot Dataset

The pilot dataset must cover:

- editorial project;
- manuscript;
- translation;
- proofreading;
- book;
- magazine;
- image;
- publication;
- rights and provenance;
- users with all approved roles.

Sensitive real data must not be used without documented justification.

## Pilot Roles

- Administrator;
- Editor;
- Translator;
- Proofreader;
- Designer;
- Audio Narrator;
- Author;
- Collaborator;
- Reader;
- Guest.

## Pilot Exit Criteria

- Zero open P0 defects.
- No unresolved P1 affecting security, data integrity, rights, organization isolation, or restore.
- UAT completed for applicable roles and workflows.
- Regression suite passed after final fix.
- Final security, accessibility, localization, rights, restore, and traceability gates passed.

