# Video and Multimedia Module Overview

## Purpose

Video and Multimedia is the ninth Phase II module specification for Laborator
Editura.

The module manages the lifecycle of editorial video production: video
projects, scenes, timelines, multimedia assets, narration, captions,
synchronization, rendering, export, and publication handoff.

All videos are derived from existing editorial content in Library, Audio,
Translation, Publishing, and approved media assets. The module must not create
duplicate editorial content or uncontrolled file repositories.

## Scope

The module owns:

- Video projects.
- Scenes.
- Timelines.
- Timeline versions.
- Video-specific media asset references.
- Caption and subtitle references.
- Audio-video synchronization metadata.
- Rendering jobs.
- Preview renders.
- Export metadata.
- Video publication readiness.
- Video audit records.

The module does not own:

- Source manuscript or article content, which remains in Library.
- Audio narration source of truth, which remains in Audio and Library.
- Translation ownership, which remains in Translation.
- Rights approval, which remains in Rights and Provenance.
- Final publication approval, which remains in Publishing and Workflow.
- AI provider execution, which must pass through AI Orchestration.
- Generic storage ownership, which remains in Library or approved asset
  storage abstractions.

## Principles

The module follows:

- Text First.
- Asset Reuse.
- Timeline Driven.
- Non-Destructive Editing.
- Accessibility by Design.
- Multi-Platform Publishing.
- AI Assisted Production.
- Audit by Default.
- Library as source of truth.
- Publishing handoff for final release.

## Current Repository Baseline

The repository already contains video-adjacent foundations:

- `apps/api/src/modules/multimedia-creation` supports `VIDEO` multimedia
  projects, `VideoProjectProfile`, linked asset IDs, subtitle track IDs,
  narration synchronization metadata, media assets, MP4 exports, audit trail,
  and human approval.
- `apps/api/src/modules/media-localization` supports `VIDEO`,
  `LOCALIZED_VIDEO`, localized captions, multilingual audio tracks, subtitle
  tracks, timing metadata, and localization QA evidence.
- `apps/api/src/modules/ai-governance` defines the Video Agent and Media
  Localization Subagent governance profiles.
- The Editorial Pipeline frontend includes preview video, official video
  gating, MP4 export metadata, thumbnail metadata, voice-over source,
  subtitle language/locale, progress, and rights-based locking behavior.
- Runtime database and backup logic include multimedia and media localization
  tables.
- Contract tests verify multimedia video scaffolding and media localization
  video support.

No canonical `video` backend module was identified. No dedicated Video
Project, Scene, Timeline, Rendering Job, Encoder Profile, Platform Delivery,
or video-specific publication handoff aggregate was identified as a first
class module.

## Target Architecture

```text
Library Item
  -> Video Project
  -> Timeline
  -> Scenes
  -> Media Assets
  -> Narration
  -> Captions
  -> Rendering Queue
  -> Video Asset
  -> Publishing Handoff
```

AI-assisted scene generation, image-to-video, text-to-video, captioning,
thumbnail suggestions, and timing suggestions must pass through AI
Orchestration.

## Dependency Map

Video and Multimedia integrates with:

- Library for source text, Library Items, asset references, and final video
  records.
- Audio for narration, voice-over, audiobook video, and audio synchronization.
- Translation for localized video text and subtitle language variants.
- Publishing for final publication approval and release artifacts.
- AI Orchestration for AI-assisted production, captions, summaries,
  thumbnails, and media generation.
- Rights and Provenance for image, music, voice, video, platform, and
  publication rights.
- Workflow Engine for review and approval gates.
- Audit for immutable accountability.
- Notifications for long-running rendering updates.
- Observability for render duration, queue, errors, and provider status.

## Acceptance Criteria

The module is aligned when:

- Every video project is linked to a Library Item.
- All multimedia assets are centrally referenced and not duplicated.
- Timeline state is independent from source editorial content.
- Scene and timeline changes are versioned and auditable.
- Text-audio-video-subtitle synchronization is preserved at segment level.
- Rendering is asynchronous, scalable, and traceable.
- Preview video is draft-only and must never be published.
- Official video publication is delegated to Publishing.
- Rights and workflow gates block publication when required.

## Related Documents

- `docs/modules/video/domain-model.md`.
- `docs/modules/video/video-projects.md`.
- `docs/modules/video/timeline.md`.
- `docs/modules/video/media-assets.md`.
- `docs/modules/video/rendering-pipeline.md`.
- `docs/modules/video/api-contracts.md`.
- `docs/modules/video/events.md`.
- `docs/modules/video/workflows.md`.
- `docs/modules/video/video-gap-analysis.md`.
- `docs/modules/video/video-migration-plan.md`.

