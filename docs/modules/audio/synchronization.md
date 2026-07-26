# Text-Audio Synchronization

## Purpose

Text-audio synchronization maps audio timelines to authoritative Library text
segments.

This enables synchronized highlighting, accessibility playback, selective
regeneration, quality review, and precise correction workflows.

## Synchronization Model

Each synchronization map links:

- Narration project.
- Audio chapter.
- Audio asset version.
- Source text version.
- Segment IDs.
- Start timestamps.
- End timestamps.
- Confidence scores.
- Review status.

## Segment-Level Entries

Each sync entry should include:

- `segmentId`.
- `sourceTextHash`.
- `audioAssetId`.
- `startMs`.
- `endMs`.
- `confidence`.
- `reviewStatus`.
- `createdAt`.

Review statuses:

- `AUTO_ALIGNED`.
- `HUMAN_REVIEW_REQUIRED`.
- `APPROVED`.
- `REJECTED`.

## Current Repository Baseline

Current related support:

- Multimedia Creation has `synchronizedTextAudio` metadata.
- Media Localization has `synchronizationMetadata`.
- Editorial Pipeline exposes audiobook progress and preview controls.
- Public Portal reader access can reference audio chapter assets.

Missing canonical support:

- No dedicated segment-level synchronization map.
- No source text hash for audio sync.
- No selective regeneration model based on changed segments.
- No sync review lifecycle.
- No public text highlighting contract.

## Selective Regeneration

When text changes, the system should identify affected segments and regenerate
only the corresponding audio ranges when possible.

Required inputs:

- Previous source text version.
- Current source text version.
- Segment diff.
- Existing synchronization map.
- Voice profile version.
- TTS pipeline version.

## Accessibility

Synchronization supports:

- Text highlighting during playback.
- Chapter markers.
- Captions and transcript alignment.
- Playback speed controls.
- Screen reader-friendly navigation.
- Alternative descriptions when required.

## Publication Rules

Published synchronization maps must:

- Reference immutable audio asset versions.
- Reference immutable source text versions.
- Remain auditable.
- Not be modified in place.
- Be superseded by a new version when corrected.

