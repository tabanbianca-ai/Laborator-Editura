# Codex Reference Models

Canonical Reference Models define the official data and ownership references
that every module must use when designing entities, APIs, events, workflows,
and integrations.

## Purpose

Reference models prevent duplicate sources of truth and uncontrolled data
variants. They provide a stable shared vocabulary for all modules.

## Governed Reference Models

The Codex governs canonical reference models for:

- Users.
- Organizations.
- Roles and permissions.
- Projects.
- Publications.
- Manuscripts.
- Documents.
- Segments.
- Translations.
- Terminology.
- Linguistic resources.
- Multimedia assets.
- Workflows.
- AI agents.
- Audit records.
- Configuration.
- Rights and provenance.
- Compliance records.
- Quality validation records.
- Architecture records.

## Model Rules

- Every canonical model must have one owner.
- Modules may reference canonical models but must not create competing
  ownership.
- Cross-module references must use stable identifiers.
- Public APIs must preserve compatibility with canonical models.
- Event payloads must not redefine canonical models inconsistently.
- Future extensions must map new entities to existing reference models or
  request an approved extension.

## Current Baseline

Canonical models are currently distributed across:

- `docs/domain`.
- `docs/data`.
- `docs/database`.
- `docs/JSON_MASTER_FORMAT.md`.
- `docs/modules/data-governance`.
- Module domain model documents.
- `packages/shared`.

## Gaps

The repository does not yet maintain a single Codex Reference Model Registry
with owner, version, compatibility rules, and dependency metadata.

## Migration Guidance

Future implementation should:

1. Inventory all canonical models.
2. Assign model owners.
3. Version model definitions.
4. Map API DTOs and events to canonical models.
5. Add compatibility checks to Quality Assurance and Enterprise Architecture
   reviews.
