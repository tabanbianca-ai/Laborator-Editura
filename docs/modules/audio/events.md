# Audio and Narration Events

## Purpose

This document defines official events for the Audio and Narration Module.

Events support workflows, audit, notifications, asynchronous processing,
publication handoff, and observability.

## Official Events

Required events:

- `NarrationProjectCreated`.
- `VoiceAssigned`.
- `AudioGenerated`.
- `AudioReviewed`.
- `SynchronizationCompleted`.
- `AudioPublished`.
- `VoiceProfileUpdated`.

Recommended additional events:

- `AudioChapterCreated`.
- `AudioGenerationRequested`.
- `AudioGenerationFailed`.
- `HumanRecordingImported`.
- `VoiceConsentRecorded`.
- `VoiceProfileSuspended`.
- `AudioReadyForPublishing`.
- `AudioPublicationBlocked`.
- `SelectiveRegenerationRequested`.

## Event Envelope

Each event should include:

- `eventId`.
- `eventType`.
- `organizationId`.
- `projectId`.
- `libraryItemId`.
- `narrationProjectId`.
- `audioChapterId`.
- `audioAssetId`.
- `voiceProfileId`.
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
- AI Governance audit for usage, budgets, provider fallback, and blocked AI
  actions.
- Rights and Provenance audit for translation and publication authorization.
- Publishing audit for publication and export artifacts.

No dedicated audio event stream was identified.

## Event Rules

- Events must be append-only.
- Events must not contain provider secrets.
- Events must not contain unrestricted sensitive voice samples.
- Events must reference audio asset versions, not mutable files.
- Events related to voice cloning must include consent and rights references.
- Publication events must reference Publishing records.

## Workflow Consumers

Potential consumers:

- Workflow Engine for status transitions.
- Notifications for long-running generation completion.
- Observability for generation duration and errors.
- Publishing for approved audio handoff.
- Public Portal for released audio availability.
- Library for final audio asset references.

