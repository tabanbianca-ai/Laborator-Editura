# Audio and Narration Module Overview

## Purpose

Audio and Narration is the eighth Phase II module specification for Laborator
Editura.

The module manages the lifecycle of editorial audio: audiobook projects,
audio chapters, narration, human recordings, text-to-speech drafts, voice
profiles, text-audio synchronization, transcripts, subtitles, accessibility
metadata, audio assets, and audio publication handoff.

Text remains the authoritative source. Audio assets are derived, versioned,
audited, and published only through controlled platform workflows.

## Scope

The module owns:

- Narration projects.
- Audio chapters.
- Voice profiles.
- Narrator metadata.
- Human recording metadata.
- Text-to-Speech pipeline metadata.
- Voice cloning governance metadata.
- Text-audio synchronization records.
- Transcript and subtitle references for audio.
- Accessibility metadata for audio.
- Audio publication readiness.
- Audio audit records.

The module does not own:

- Source manuscript ownership, which remains in Library and Author Studio.
- Translation ownership, which remains in Translation.
- Rights approval, which remains in Rights and Provenance.
- Publication approval, which remains in Publishing and Workflow.
- AI provider execution, which must pass through AI Orchestration.
- General video generation, which belongs to the future Video and Multimedia
  module.

## Principles

The module follows:

- Text as Source of Truth.
- Voice Independence.
- Multi-Voice Support.
- Non-Destructive Audio.
- Accessibility by Design.
- AI Assisted Narration.
- Version Everything.
- Audit by Default.
- Rights before publication.
- Publishing handoff only after approval.

## Current Repository Baseline

The repository already contains audio-adjacent foundations:

- `apps/api/src/modules/multimedia-creation` supports `AUDIO` multimedia
  projects, audio assets, `AudioProjectProfile`, chapter narration metadata,
  synchronized text-audio metadata, and MP3/WAV/FLAC export targets.
- `apps/api/src/modules/media-localization` supports `VOICE_OVER`, `DUBBING`,
  `LOCALIZED_AUDIO`, voice tracks, narrator profiles, subtitle tracks, timing
  metadata, and localization QA evidence.
- `apps/api/src/modules/ai-governance` defines the Audio Agent and Media
  Localization Subagent governance profiles.
- The Editorial Pipeline frontend includes preview audio, official audiobook
  gating, narrator, voice, language, progress, MP3/M4B-style export metadata,
  and rights-based locking behavior.
- Rights and Provenance includes audiobook publication authorization metadata.
- Public Portal reader access can reference audio chapter assets.
- Runtime database and backup logic already include multimedia and media
  localization tables.

No canonical `audio` backend module was identified. No dedicated narration
project, audio chapter, voice profile, text-to-audio synchronization, TTS
pipeline, or voice cloning governance aggregate was identified as a first
class module.

## Target Architecture

```text
Library Item
  -> Narration Project
  -> Audio Chapters
  -> Voice Profiles
  -> TTS Pipeline or Human Recording
  -> Audio Assets
  -> Text-Audio Synchronization
  -> Quality Review
  -> Publishing Handoff
```

All provider-based TTS, transcription, voice cloning, and audio generation
work must pass through AI Orchestration.

## Dependency Map

Audio and Narration integrates with:

- Library for source text, Library Items, audio assets, and publication files.
- Translation for translated text used as audio source.
- Publishing for final audio outputs and publication approval.
- AI Orchestration for TTS, transcription, voice generation, and AI-assisted
  narration.
- Rights and Provenance for voice rights, narrator consent, source rights,
  and audio publication authorization.
- Workflow Engine for review and approval gates.
- Audit for immutable accountability.
- Notifications for long-running processing updates.
- Observability for audio generation metrics and errors.

## Acceptance Criteria

The module is aligned when:

- Every audio project links to a Library Item.
- Source text remains authoritative.
- Voice profiles are reusable and versioned.
- Human and TTS sources are treated uniformly as auditable audio sources.
- Segment-level text-audio synchronization is preserved.
- Voice cloning records include consent and rights validation references.
- Official audio publication is blocked until rights and workflow gates pass.
- Audio assets are non-destructive and versioned.
- All generation, review, synchronization, and publication handoff actions are
  audited.

## Related Documents

- `docs/modules/audio/domain-model.md`.
- `docs/modules/audio/narration-projects.md`.
- `docs/modules/audio/voice-profiles.md`.
- `docs/modules/audio/tts-pipeline.md`.
- `docs/modules/audio/synchronization.md`.
- `docs/modules/audio/api-contracts.md`.
- `docs/modules/audio/events.md`.
- `docs/modules/audio/workflows.md`.
- `docs/modules/audio/audio-gap-analysis.md`.
- `docs/modules/audio/audio-migration-plan.md`.

