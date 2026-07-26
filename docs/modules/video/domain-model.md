# Video and Multimedia Domain Model

## Purpose

This document defines the conceptual domain model for the Video and
Multimedia Module.

It is an architecture baseline and does not authorize immediate database,
API, or runtime changes.

## Core Aggregates

### VideoProject

Represents one editorial video production project linked to a Library Item.

Fields:

- `videoProjectId`.
- `organizationId`.
- `projectId`.
- `libraryItemId`.
- `documentId`.
- `audioProjectId`.
- `title`.
- `projectType`.
- `language`.
- `locale`.
- `resolutionProfile`.
- `aspectRatio`.
- `formatProfile`.
- `status`.
- `version`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Statuses:

- `DRAFT`.
- `ASSET_SELECTION`.
- `TIMELINE_EDITING`.
- `SYNCHRONIZING`.
- `CAPTIONING`.
- `RENDERING`.
- `IN_REVIEW`.
- `APPROVED`.
- `READY_FOR_PUBLISHING`.
- `PUBLISHED`.
- `BLOCKED`.

### Scene

Represents a video scene within a timeline.

Fields:

- `sceneId`.
- `videoProjectId`.
- `timelineId`.
- `order`.
- `durationMs`.
- `sourceTextReference`.
- `sourceSegmentIds`.
- `visualAssetRefs`.
- `audioAssetRefs`.
- `captionTrackRefs`.
- `transitionProfile`.
- `effectsProfile`.
- `metadata`.
- `version`.

### Timeline

Represents the ordered, versioned timeline for a video project.

Fields:

- `timelineId`.
- `videoProjectId`.
- `version`.
- `sceneOrder`.
- `tracks`.
- `markers`.
- `synchronizationMapId`.
- `status`.
- `createdBy`.
- `createdAt`.

Tracks may include:

- `VIDEO`.
- `IMAGE`.
- `AUDIO`.
- `CAPTION`.
- `GRAPHICS`.
- `EFFECTS`.

### VideoAssetReference

Represents a centrally managed asset used in video production.

Fields:

- `assetRefId`.
- `videoProjectId`.
- `libraryAssetId`.
- `multimediaAssetId`.
- `mediaLocalizationAssetId`.
- `assetType`.
- `usageType`.
- `rightsRecordId`.
- `sourceReference`.
- `version`.

Asset types:

- `IMAGE`.
- `ILLUSTRATION`.
- `PHOTO`.
- `ANIMATION`.
- `VIDEO`.
- `AUDIO`.
- `MUSIC`.
- `SOUND_EFFECT`.
- `SUBTITLE`.
- `CAPTION`.
- `LOGO`.
- `GRAPHIC`.

### CaptionTrack

Represents subtitle or caption metadata for a video.

Fields:

- `captionTrackId`.
- `videoProjectId`.
- `language`.
- `locale`.
- `format`.
- `source`.
- `entries`.
- `status`.
- `version`.

Formats:

- `SRT`.
- `VTT`.
- `ASS`.

### VideoSynchronizationMap

Represents segment-level synchronization across text, audio, video, scenes,
and captions.

Fields:

- `syncMapId`.
- `videoProjectId`.
- `timelineId`.
- `sourceTextVersion`.
- `audioAssetVersion`.
- `videoAssetVersion`.
- `entries`.
- `version`.

Each entry includes:

- `segmentId`.
- `sceneId`.
- `audioStartMs`.
- `audioEndMs`.
- `videoStartMs`.
- `videoEndMs`.
- `captionStartMs`.
- `captionEndMs`.
- `confidence`.
- `reviewStatus`.

### RenderJob

Represents an asynchronous rendering job.

Fields:

- `renderJobId`.
- `videoProjectId`.
- `timelineId`.
- `timelineVersion`.
- `renderProfileId`.
- `status`.
- `queueName`.
- `startedAt`.
- `completedAt`.
- `durationMs`.
- `outputAssetId`.
- `errorCode`.
- `createdBy`.

Statuses:

- `QUEUED`.
- `RUNNING`.
- `COMPLETED`.
- `FAILED`.
- `CANCELLED`.

### RenderProfile

Represents a reusable export and encoder profile.

Fields:

- `renderProfileId`.
- `name`.
- `format`.
- `resolution`.
- `aspectRatio`.
- `frameRate`.
- `codec`.
- `bitrate`.
- `platformTarget`.
- `status`.
- `version`.

Formats:

- `MP4`.
- `WEBM`.
- `MOV`.
- `HLS`.

### VideoAuditEvent

Represents immutable audit evidence for video actions.

Actions include:

- `VIDEO_PROJECT_CREATED`.
- `SCENE_ADDED`.
- `TIMELINE_UPDATED`.
- `MEDIA_ASSET_LINKED`.
- `CAPTION_TRACK_CREATED`.
- `RENDERING_STARTED`.
- `RENDERING_COMPLETED`.
- `VIDEO_REVIEWED`.
- `VIDEO_READY_FOR_PUBLISHING`.
- `VIDEO_PUBLISHED`.

## Current Baseline Mapping

| Future concept | Current baseline |
| --- | --- |
| `VideoProject` | `MultimediaProject` with `kind: "VIDEO"` |
| `Scene` | Not first-class; only video profile metadata exists |
| `Timeline` | Not first-class; pipeline has UI readiness only |
| `VideoAssetReference` | `MultimediaAsset`, `MediaLocalizationAsset`, Library references |
| `CaptionTrack` | Media Localization subtitle tracks and multimedia subtitle assets |
| `VideoSynchronizationMap` | Media Localization synchronization metadata and Audio sync planning |
| `RenderJob` | Multimedia export history only |
| `RenderProfile` | Export target metadata only |
| Video publication | Pipeline and Publishing readiness; no canonical handoff |

## Ownership Rules

- Library owns authoritative editorial content and asset identity.
- Video owns timeline, scene, render, and video synchronization metadata.
- Multimedia Creation may continue storing generic media projects until
  canonical Video migration is approved.
- Audio owns narration source and audio-specific synchronization.
- Rights and Provenance owns usage rights and publication authorization.
- AI Orchestration owns AI-assisted video generation and provider execution.
- Publishing owns final release artifacts and public publication approval.

