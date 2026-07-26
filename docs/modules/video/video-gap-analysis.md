# Video and Multimedia Gap Analysis

## Purpose

This document compares the current repository baseline with the official Video
and Multimedia Module specification.

## Summary

The repository already contains useful video-adjacent foundations through
Multimedia Creation, Media Localization, AI Governance, Rights and
Provenance, Public Portal, and the Editorial Pipeline UI.

The repository does not yet contain a dedicated Video and Multimedia backend
module with first-class video projects, scenes, timelines, render jobs, render
profiles, caption tracks, segment-level video synchronization maps, or
video-specific API and event contracts.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| Video project | Generic `MultimediaProject` with `kind: "VIDEO"` | Dedicated `VideoProject` linked to Library Item | High |
| Scenes | Not first-class | Versioned `Scene` records | High |
| Timeline | Not first-class | Versioned multi-track `Timeline` | High |
| Media assets | Generic multimedia/media localization assets | Video-specific asset usage references | Medium |
| Captions | Subtitle assets and localization metadata | First-class caption tracks with timing and review | Medium |
| Synchronization | Generic synchronization metadata | Segment-level text/audio/video/caption maps | High |
| Rendering | Export history only | Asynchronous render jobs and render profiles | High |
| Distributed processing | Not implemented | Queue, progress, retry, cancellation, preview cache | High |
| Publication | Pipeline readiness and Publishing exist | Video-to-Publishing handoff contract | Medium |
| API | `/multimedia` and `/media-localization` | `/video` APIs | High |
| Events | Multimedia/media localization audits | Dedicated video events | Medium |

## Current Strengths

- Generic video project and video asset metadata already exist.
- Media Localization supports localized video, captions, subtitles, and
  multilingual audio tracks.
- AI Governance defines Video Agent limits and responsibilities.
- Editorial Pipeline distinguishes preview video from official video
  generation.
- Rights and Provenance models video publication authorization.
- Public Portal can expose video references.
- Runtime backup already includes multimedia and media localization data.

## Key Risks

### Timeline Integrity Risk

Without a first-class timeline, scene order, effects, synchronization, and
render reproducibility remain difficult to audit.

### Asset Duplication Risk

Without video-specific asset references, projects may duplicate media assets
instead of reusing Library-governed resources.

### Rendering Reproducibility Risk

Render output cannot be reliably reproduced without timeline version, render
profile, source asset versions, and synchronization references.

### Provider Coupling Risk

AI-assisted video generation or captioning must not be called directly from
Video. Provider execution must pass through AI Orchestration.

### Publication Integrity Risk

Video should not publish directly. Publishing must remain the official release
authority.

## Acceptance Gaps

The module is incomplete until:

- Every video project links to a Library Item.
- Scenes and timelines are first-class versioned records.
- Multimedia assets are referenced centrally and not duplicated.
- Synchronization maps preserve segment-level timing.
- Rendering is asynchronous, scalable, and audited.
- Official video publication is gated by Rights, Workflow, and Publishing.
- Video APIs and events are canonical and auditable.

