# Video and Multimedia Events

## Purpose

This document defines official events for the Video and Multimedia Module.

Events support workflows, audit, notifications, rendering queues, publication
handoff, and observability.

## Official Events

Required events:

- `VideoProjectCreated`.
- `SceneAdded`.
- `TimelineUpdated`.
- `RenderingStarted`.
- `RenderingCompleted`.
- `VideoReviewed`.
- `VideoPublished`.

Recommended additional events:

- `MediaAssetLinked`.
- `CaptionTrackCreated`.
- `SynchronizationCompleted`.
- `RenderingFailed`.
- `PreviewRendered`.
- `VideoReadyForPublishing`.
- `VideoPublicationBlocked`.
- `SelectiveSceneRegenerationRequested`.

## Event Envelope

Each event should include:

- `eventId`.
- `eventType`.
- `organizationId`.
- `projectId`.
- `libraryItemId`.
- `videoProjectId`.
- `timelineId`.
- `sceneId`.
- `renderJobId`.
- `videoAssetId`.
- `correlationId`.
- `traceId`.
- `actorId`.
- `occurredAt`.
- `payload`.
- `auditEventId`.

## Current Event and Audit Baseline

Existing related audit actions:

- Multimedia Creation audit events for media project, asset, revision,
  approval, rejection, and export.
- Media Localization audit events for localization project, asset, revision,
  approval, and rejection.
- AI Governance and Observability records for AI agent execution and usage.
- Rights and Provenance audit for publication authorization.
- Publishing audit for release and export artifacts.

No dedicated video event stream was identified.

## Event Rules

- Events must be append-only.
- Events must not contain provider secrets.
- Events must not embed full unrestricted media payloads.
- Events must reference immutable asset versions.
- Rendering events must record timeline version and render profile.
- Publication events must reference Publishing records.

## Workflow Consumers

Potential consumers:

- Workflow Engine for status transitions.
- Notifications for rendering completion or failure.
- Observability for render metrics.
- Publishing for approved video handoff.
- Public Portal for released video availability.
- Library for final video asset references.

