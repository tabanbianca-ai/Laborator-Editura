# Video and Multimedia API Contracts

## Purpose

This document defines target API contracts for the Video and Multimedia
Module.

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

No dedicated `/video` API was identified.

## Target Endpoints

### Create Video Project

```text
POST /video/projects
```

Creates a video project linked to a Library Item.

Required fields:

- `libraryItemId`.
- `projectType`.
- `language`.
- `locale`.
- `title`.
- `resolutionProfile`.
- `formatProfile`.

### Get Video Project

```text
GET /video/projects/{id}
```

Returns project metadata, timeline state, scene list, linked assets, captions,
render status, rights warnings, workflow status, and publication readiness.

### Render Video

```text
POST /video/projects/{id}/render
```

Creates an asynchronous render job.

Rules:

- Preview render may use draft timeline.
- Official render requires approved timeline and rights.
- Rendering must not run directly in request handlers.

### Publish Video

```text
POST /video/projects/{id}/publish
```

Hands approved video artifacts to Publishing. It must not publish directly or
bypass Publishing.

### List Video Assets

```text
GET /video/assets
```

Returns video asset references visible to the authenticated user according to
roles, permissions, organization policy, project scope, rights, and
Need-to-Know access.

### Create Captions

```text
POST /video/captions
```

Creates or imports caption/subtitle metadata.

## Supporting Future Endpoints

Recommended future endpoints:

- `POST /video/projects/{id}/scenes`.
- `POST /video/projects/{id}/timeline`.
- `GET /video/projects/{id}/timeline`.
- `POST /video/projects/{id}/assets`.
- `POST /video/projects/{id}/sync`.
- `GET /video/projects/{id}/renders`.
- `GET /video/render-profiles`.

## API Rules

- All APIs are versioned.
- All APIs are tenant-scoped.
- Published video assets must not be modified in place.
- Video publication must use Publishing.
- Rendering must be asynchronous.
- Provider-based AI video generation must use AI Orchestration.
- AI may generate drafts but must not approve or publish.

