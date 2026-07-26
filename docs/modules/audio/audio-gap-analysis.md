# Audio and Narration Gap Analysis

## Purpose

This document compares the current repository baseline with the official Audio
and Narration Module specification.

## Summary

The repository already contains useful audio-adjacent foundations through
Multimedia Creation, Media Localization, AI Governance, Rights and Provenance,
Public Portal, and the Editorial Pipeline UI.

The repository does not yet contain a dedicated Audio and Narration backend
module with first-class narration projects, audio chapters, reusable voice
profiles, TTS pipeline records, segment-level synchronization maps, voice
consent governance, or audio-specific API and event contracts.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| Narration project | Generic `MultimediaProject` with `kind: "AUDIO"` | Dedicated `NarrationProject` linked to Library Item | High |
| Audio chapters | Profile metadata only | First-class `AudioChapter` records | High |
| Voice profiles | `voiceProfileIds` only | Reusable, versioned `VoiceProfile` aggregate | High |
| TTS pipeline | AI architecture docs only | Text normalization, SSML, provider task, output records | High |
| Voice cloning | Media/AI planning only | Consent, samples, model versions, rights validation | High |
| Synchronization | Generic metadata | Segment-level sync maps with timestamps | High |
| Rights validation | Audiobook flags and media rights metadata | Voice and audio-specific rights gates | Medium |
| Publication | Pipeline readiness and Publishing exist | Audio-to-Publishing handoff contract | Medium |
| API | Multimedia and Media Localization APIs | `/audio` and `/voices` APIs | High |
| Events | Multimedia/media localization audits | Dedicated audio events | Medium |
| Async processing | Planned in architecture | Queue, retry, streaming preview, selective regeneration | High |

## Current Strengths

- Generic audio project and audio asset metadata already exist.
- Media Localization supports voice-over, dubbing, localized audio, subtitles,
  and timing metadata.
- AI Governance defines Audio Agent limits and responsibilities.
- Editorial Pipeline distinguishes preview audio from official audiobook
  generation.
- Rights and Provenance models audiobook publication authorization.
- Public Portal can expose audio chapter references.
- Runtime backup already includes multimedia and media localization data.

## Key Risks

### Voice Rights Risk

Voice cloning or reused voice profiles can create legal and ethical risk if
consent and rights validation are not first-class records.

### Source Drift Risk

Audio generated from old text versions can drift from the authoritative
Library text if source version references are not preserved.

### Synchronization Risk

Without segment-level synchronization, accessibility playback, selective
regeneration, and review precision remain limited.

### Provider Coupling Risk

TTS providers must not be called directly from Audio. Provider calls must go
through AI Orchestration.

### Publication Integrity Risk

Audio should not be published directly from Audio or Multimedia. Final
publication must pass through Publishing and Rights and Provenance.

## Acceptance Gaps

The module is incomplete until:

- Every audio project links to a Library Item.
- Voice profiles are reusable and versioned.
- TTS generation is orchestrated through AI Orchestration.
- Voice consent and rights are enforced.
- Synchronization maps preserve segment timestamps.
- Official audio publication is gated by Rights, Workflow, and Publishing.
- Audio APIs and events are canonical and auditable.

