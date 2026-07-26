# Audio and Narration Migration Plan

## Purpose

This document defines the incremental path from the current multimedia audio
metadata foundation to the official Audio and Narration Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Library, Rights, Workflow, Export,
Quality, AI Orchestration, and audit behavior.

## Constraints

- Do not modify published audio assets in place.
- Do not bypass Library as source of truth.
- Do not bypass Rights and Provenance for voice or audio publication rights.
- Do not bypass Publishing for final release.
- Do not call TTS or voice providers directly outside AI Orchestration.
- Do not clone voices without documented consent and rights validation.
- Preserve existing Multimedia Creation and Media Localization behavior.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory multimedia audio projects and assets.
- Inventory media localization voice-over and dubbing metadata.
- Inventory audio pipeline UI behavior.
- Document current rights and publication gates.
- Document gaps and risks.

## Phase 2 - Canonical Audio Contracts

Define:

- `NarrationProject`.
- `AudioChapter`.
- `VoiceProfile`.
- `Narrator`.
- `AudioAsset`.
- `TTSPipelineRun`.
- `AudioSynchronizationMap`.
- `VoiceConsentRecord`.
- `AudioAuditEvent`.

No provider integration in this phase.

## Phase 3 - Narration Project Foundation

Implement:

- Narration project records.
- Library Item references.
- Source text version references.
- Basic status lifecycle.
- Audio chapter skeleton records.
- Audit events.

## Phase 4 - Voice Profile Foundation

Implement:

- Reusable voice profiles.
- Voice profile versions.
- Narrator metadata.
- Rights and consent references.
- Suspension and status metadata.
- Voice profile audit.

## Phase 5 - TTS Pipeline Metadata

Implement metadata-only TTS pipeline records:

- Text normalization version.
- SSML version.
- Voice profile version.
- AI Orchestration task reference.
- Provider metadata placeholder.
- Generation cost metadata.
- Output asset reference.

Provider adapters remain owned by AI Orchestration.

## Phase 6 - Synchronization Foundation

Implement:

- Segment-level synchronization maps.
- Timestamp entries.
- Source text hash.
- Review statuses.
- Selective regeneration detection.

## Phase 7 - Rights and Workflow Gates

Integrate:

- Voice consent checks.
- Audiobook publication authorization.
- Publishing rights checks.
- Workflow approval gates.
- Quality review status.
- Publication blocking reasons.

## Phase 8 - Publishing Handoff

Add controlled handoff to Publishing:

- Audio artifact references.
- Audio metadata.
- Narrator and voice profile attribution.
- Format targets.
- Accessibility metadata.
- Synchronization map references.

## Phase 9 - API and Event Hardening

Add canonical:

- `/audio/projects`.
- `/audio/projects/{id}`.
- `/audio/projects/{id}/generate`.
- `/audio/projects/{id}/synchronize`.
- `/audio/projects/{id}/publish`.
- `/voices`.
- Audio event stream.
- Contract tests.

## Phase 10 - Performance and Async Processing

Add:

- Chapter parallelization.
- Queue-based generation.
- Retry metadata.
- Streaming preview support.
- SSML cache.
- Voice profile cache.
- Observability metrics.

## Testing Requirements

Each implementation phase requires:

- Contract tests.
- Tenant isolation tests.
- Rights validation tests.
- Human Final Authority tests.
- Source text version tests.
- Voice profile version tests.
- Synchronization tests.
- Publishing handoff tests.
- Backup/restore tests when persistence changes.

## Next Recommended Module

Module 9 - Video and Multimedia Module Architecture is now documented as the
next Phase II specification after Audio and Narration.

Module 10 - Workflow Engine and Business Process Automation Module
Architecture is now documented after Video and Multimedia.

Module 11 - Notification and Communication Module Architecture is now
documented after Workflow Engine and Business Process Automation.

The next recommended module specification after Notification and Communication
is Module 12 - Identity, Access Management and Security Module Architecture.
