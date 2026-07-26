# Video Projects

## Purpose

Video Projects organize video production for one Library Item, manuscript,
article, course, audiobook, magazine issue, or approved publication.

They provide the production container for educational videos, presentations,
courses, trailers, social clips, audiobook videos, and children's videos.

## Project Types

Supported project types:

- `YOUTUBE_VIDEO`.
- `YOUTUBE_SHORT`.
- `CONFERENCE`.
- `ONLINE_COURSE`.
- `PRESENTATION`.
- `AUDIOBOOK_VIDEO`.
- `SOCIAL_MEDIA_CLIP`.
- `CHILDREN_VIDEO`.
- `BOOK_TRAILER`.
- `PROMOTIONAL_VIDEO`.
- `EDUCATIONAL_VIDEO`.

The architecture must allow future types without structural redesign.

## Core Rules

- Every video project must link to a Library Item.
- Video projects must reference source text versions.
- Video projects must not duplicate source editorial content.
- Multimedia assets must be referenced from Library or approved asset
  modules.
- Preview videos are draft-only and must never be published.
- Official videos require source approval, rights validation, workflow
  approval, quality review, and Publishing handoff.

## Current Repository Baseline

Existing related support:

- Multimedia Creation supports `VIDEO` projects.
- `VideoProjectProfile` supports book trailers, educational videos,
  reels/shorts, subtitle track IDs, narration synchronization, and linked
  asset IDs.
- Editorial Pipeline includes official and preview video state.
- Media Localization supports localized videos and captions.
- Rights and Provenance includes video publication authorization metadata.
- Public Portal can reference video assets.

Missing canonical support:

- Dedicated `VideoProject` aggregate.
- Dedicated project type taxonomy.
- First-class scene and timeline records.
- Dedicated video publication readiness record.
- Dedicated `/video` API.
- Dedicated render lifecycle.

## Video Project Metadata

Each project should preserve:

- Project type.
- Source Library Item.
- Source text version.
- Language and locale.
- Resolution profile.
- Aspect ratio.
- Platform target.
- Default render profile.
- Linked audio project when applicable.
- Rights validation state.
- Workflow state.
- Publication readiness state.

## Preview vs Official Video

Preview video:

- May use draft text.
- May use placeholder assets.
- May use draft narration.
- Must be marked draft-only.
- Must not be public.

Official video:

- Requires approved source text.
- Requires validated rights for every asset.
- Requires approved audio or voice-over.
- Requires captions/accessibility review.
- Requires rendering review.
- Is published only through Publishing.

## Integration Requirements

Video projects must integrate with:

- Library for source content and assets.
- Audio for narration and voice-over.
- Translation for localized text and captions.
- Rights and Provenance for source, music, image, voice, and platform rights.
- Workflow for review and approval status.
- Publishing for final video artifacts.
- AI Orchestration for AI-assisted video generation, captions, thumbnails,
  and timing support.

