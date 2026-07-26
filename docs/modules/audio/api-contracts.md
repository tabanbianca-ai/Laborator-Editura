# Audio and Narration API Contracts

## Purpose

This document defines target API contracts for the Audio and Narration Module.

All endpoints require authenticated server-derived request context. Endpoints
must not trust client-provided user, role, permission, or tenant identifiers.

## Current API Baseline

Existing related APIs:

- `POST /multimedia/projects`.
- `GET /multimedia/projects/:id`.
- `POST /multimedia/projects/:id/assets`.
- `POST /multimedia/projects/:id/approve`.
- `POST /multimedia/projects/:id/reject`.
- `POST /multimedia/projects/:id/exports`.
- `POST /media-localization/projects`.
- `GET /media-localization/projects/:id`.
- `POST /media-localization/projects/:id/assets`.
- `POST /media-localization/projects/:id/approve`.
- `POST /media-localization/projects/:id/reject`.

No dedicated `/audio` API was identified.

## Target Endpoints

### Create Narration Project

```text
POST /audio/projects
```

Creates a narration project linked to a Library Item.

Required fields:

- `libraryItemId`.
- `language`.
- `locale`.
- `title`.
- `sourceTextVersion`.

### Get Narration Project

```text
GET /audio/projects/{id}
```

Returns narration project metadata, chapter list, voice profile, status,
rights warnings, synchronization status, and publication readiness.

### Generate Audio

```text
POST /audio/projects/{id}/generate
```

Creates a controlled TTS generation task through AI Orchestration.

Rules:

- Preview generation may use draft text.
- Official generation requires approved text and rights.
- Provider execution must not bypass AI Orchestration.

### Synchronize Audio

```text
POST /audio/projects/{id}/synchronize
```

Creates or updates a text-audio synchronization map.

### Publish Audio

```text
POST /audio/projects/{id}/publish
```

Hands approved audio to Publishing. It must not publish directly or bypass
Publishing.

### List Voices

```text
GET /voices
```

Returns reusable voice profiles visible to the authenticated user according to
roles, permissions, rights, organization policy, and Need-to-Know scope.

## Supporting Future Endpoints

Recommended future endpoints:

- `POST /voices`.
- `GET /voices/{id}`.
- `POST /voices/{id}/versions`.
- `POST /voices/{id}/consent`.
- `GET /audio/projects/{id}/chapters`.
- `POST /audio/projects/{id}/chapters`.
- `GET /audio/projects/{id}/sync`.

## API Rules

- All APIs are versioned.
- All APIs are tenant-scoped.
- Audio generation must be idempotent where practical.
- Published audio assets must not be modified in place.
- Audio publication must use Publishing.
- Voice rights must be validated before official generation and publication.
- AI may generate drafts but must not approve or publish.

