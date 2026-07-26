# Video Rendering Pipeline

## Purpose

The rendering pipeline transforms a validated timeline into preview or
official video assets.

Rendering must be asynchronous, scalable, auditable, and non-destructive.

## Standard Pipeline

```text
Timeline
  -> Validation
  -> Rendering Queue
  -> Encoder
  -> Video Asset
  -> Review
  -> Publishing Handoff
```

## Rendering Inputs

Each render job uses:

- Video project.
- Timeline version.
- Scene versions.
- Asset references.
- Caption tracks.
- Audio tracks.
- Render profile.
- Rights validation snapshot.
- Workflow approval snapshot.

## Render Profiles

Supported output formats:

- `MP4`.
- `WEBM`.
- `MOV`.
- `HLS`.

Profile fields:

- Resolution.
- Aspect ratio.
- Frame rate.
- Codec.
- Bitrate.
- Audio codec.
- Platform target.
- Accessibility options.

## Current Repository Baseline

Current support:

- Multimedia Creation records export history and supports `MP4` as an export
  target.
- Editorial Pipeline exposes video export status and MP4 metadata.
- Media Localization supports localized videos and captions.

Current gaps:

- No dedicated render job aggregate.
- No rendering queue.
- No encoder profile model.
- No distributed processing model.
- No render validation snapshot.
- No preview render cache.
- No selective scene regeneration.
- No streaming preview backend.

## Asynchronous Processing

Rendering should run outside request handlers.

Required capabilities:

- Queue-based processing.
- Parallel rendering where possible.
- Retry metadata.
- Failure recording.
- Progress reporting.
- Cancellation metadata.
- Render artifact references.
- Observability traces.

## Preview Rendering

Preview renders:

- May use lower resolution.
- May use watermarks.
- May use draft assets.
- Must not be published.
- May be cached.

## Official Rendering

Official renders require:

- Approved source text.
- Approved timeline.
- Rights validation.
- Audio/caption synchronization.
- Accessibility checks.
- Workflow approval.
- Publishing handoff.

## Non-Destructive Output

Rendered files are immutable assets. Re-rendering creates new asset versions
and preserves the timeline version, source versions, render profile, and audit
evidence used.

