# Narration Projects

## Purpose

Narration Projects organize audio production for one Library Item, manuscript,
document, or translated edition.

They provide the audio production container for audiobooks, meditations,
lectures, accessible readings, and other editorial audio formats.

## Core Rules

- Every narration project must link to a Library Item.
- Source text remains authoritative.
- Audio may be generated or recorded only from a referenced text version.
- Audio edits must be non-destructive and versioned.
- Published audio assets must not be modified in place.
- Regeneration must create a new audio asset version.
- Official audiobook generation requires approved text and valid rights.

## Project Types

Supported narration project types:

- `AUDIOBOOK`.
- `CHAPTER_NARRATION`.
- `MEDITATION`.
- `LECTURE`.
- `CONFERENCE`.
- `ACCESSIBILITY_AUDIO`.
- `ARTICLE_AUDIO`.
- `MAGAZINE_AUDIO`.

## Current Repository Baseline

Existing related support:

- Multimedia Creation can create `AUDIO` projects.
- Editorial Pipeline has preview audio and official audiobook states.
- Public Portal can reference audio chapters.
- Rights and Provenance has `audiobookAllowed` publication metadata.
- Project capabilities include audiobook-related gating in the frontend
  pipeline.

Missing canonical support:

- Dedicated narration project aggregate.
- Dedicated audio chapter aggregate.
- Official narration project lifecycle.
- Explicit Library Item first-class link for every audio project.
- Dedicated narration API.
- Dedicated audio publication readiness record.

## Lifecycle

```text
Narration Project Created
  -> Voice Selection
  -> Audio Generation or Recording
  -> Quality Review
  -> Synchronization
  -> Approved
  -> Publishing Handoff
  -> Published
```

## Chapter Model

Each narration project may contain audio chapters.

Chapter records should preserve:

- Chapter order.
- Source text reference.
- Source text version.
- Voice profile.
- Audio asset reference.
- Duration.
- Synchronization map.
- Review status.
- Publication status.

## Preview vs Official Audio

Preview audio:

- May be generated during editing.
- May use draft text.
- Must be marked draft-only.
- Must never be published.

Official audio:

- Requires approved final text.
- Requires publishing rights.
- Requires voice rights.
- Requires review and synchronization.
- Is published only through Publishing.

## Integration Requirements

Narration projects must integrate with:

- Library for source text and asset references.
- Translation for target-language audio.
- Rights and Provenance for voice and publication authorization.
- Workflow for review and approval status.
- Publishing for final audio artifacts.
- AI Orchestration for TTS and AI narration support.

