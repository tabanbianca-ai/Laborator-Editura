# Audio and Narration Domain Model

## Purpose

This document defines the conceptual domain model for the Audio and Narration
Module.

It is an architecture baseline and does not authorize immediate database,
API, or runtime changes.

## Core Aggregates

### NarrationProject

Represents an audio production project linked to a Library Item.

Fields:

- `narrationProjectId`.
- `organizationId`.
- `projectId`.
- `libraryItemId`.
- `documentId`.
- `language`.
- `locale`.
- `title`.
- `narratorId`.
- `voiceProfileId`.
- `sourceTextVersion`.
- `status`.
- `version`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Statuses:

- `DRAFT`.
- `VOICE_SELECTION`.
- `GENERATING`.
- `RECORDING`.
- `IN_REVIEW`.
- `SYNCHRONIZING`.
- `APPROVED`.
- `READY_FOR_PUBLISHING`.
- `PUBLISHED`.
- `BLOCKED`.

### AudioChapter

Represents one chapter or section-level audio unit.

Fields:

- `audioChapterId`.
- `narrationProjectId`.
- `libraryItemId`.
- `chapterId`.
- `sectionId`.
- `sourceTextReference`.
- `sourceTextVersion`.
- `audioAssetId`.
- `durationMs`.
- `version`.
- `status`.
- `metadata`.

### VoiceProfile

Represents a reusable voice definition.

Fields:

- `voiceProfileId`.
- `organizationId`.
- `name`.
- `voiceType`.
- `language`.
- `locale`.
- `accent`.
- `style`.
- `providerId`.
- `providerVoiceId`.
- `version`.
- `status`.
- `rightsRecordId`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Voice types:

- `HUMAN`.
- `TTS`.
- `CLONED`.
- `IMPORTED`.

### Narrator

Represents a person or approved narration identity.

Fields:

- `narratorId`.
- `organizationId`.
- `displayName`.
- `userId`.
- `languages`.
- `voiceProfileIds`.
- `rightsRecordIds`.
- `status`.

### AudioAsset

Represents an audio file or generated audio artifact.

Fields:

- `audioAssetId`.
- `organizationId`.
- `narrationProjectId`.
- `audioChapterId`.
- `assetType`.
- `uri`.
- `language`.
- `format`.
- `durationMs`.
- `checksum`.
- `sourceType`.
- `sourceReference`.
- `rightsRecordId`.
- `version`.
- `createdAt`.

Asset types:

- `CHAPTER_AUDIO`.
- `PREVIEW_AUDIO`.
- `FULL_AUDIOBOOK`.
- `VOICE_SAMPLE`.
- `TRANSCRIPT`.
- `SUBTITLE`.
- `ACCESSIBILITY_TRACK`.

### TTSPipelineRun

Represents one TTS generation run.

Fields:

- `ttsRunId`.
- `narrationProjectId`.
- `audioChapterId`.
- `aiTaskId`.
- `voiceProfileId`.
- `inputTextReference`.
- `inputTextVersion`.
- `normalizationVersion`.
- `ssmlVersion`.
- `providerId`.
- `modelVersion`.
- `status`.
- `durationMs`.
- `estimatedCost`.
- `createdAt`.

### AudioSynchronizationMap

Represents segment-level text-audio alignment.

Fields:

- `syncMapId`.
- `narrationProjectId`.
- `audioChapterId`.
- `audioAssetId`.
- `sourceTextVersion`.
- `entries`.
- `version`.
- `createdAt`.

Each entry includes:

- `segmentId`.
- `startMs`.
- `endMs`.
- `confidence`.
- `reviewStatus`.

### VoiceConsentRecord

Represents consent and rights metadata for voice use or cloning.

Fields:

- `voiceConsentRecordId`.
- `voiceProfileId`.
- `rightsRecordId`.
- `consentDocumentId`.
- `allowedUses`.
- `territories`.
- `languages`.
- `validFrom`.
- `validUntil`.
- `status`.

### AudioAuditEvent

Represents immutable audit evidence for audio actions.

Actions include:

- `NARRATION_PROJECT_CREATED`.
- `VOICE_ASSIGNED`.
- `VOICE_PROFILE_UPDATED`.
- `AUDIO_GENERATED`.
- `HUMAN_RECORDING_IMPORTED`.
- `SYNCHRONIZATION_COMPLETED`.
- `AUDIO_REVIEWED`.
- `AUDIO_READY_FOR_PUBLISHING`.
- `AUDIO_PUBLISHED`.
- `VOICE_CONSENT_RECORDED`.

## Current Baseline Mapping

| Future concept | Current baseline |
| --- | --- |
| `NarrationProject` | `MultimediaProject` with `kind: "AUDIO"` |
| `AudioChapter` | `AudioProjectProfile.chapterNarration` and future Library chapter references |
| `VoiceProfile` | `AudioProjectProfile.voiceProfileIds`; no canonical profile record yet |
| `AudioAsset` | `MultimediaAsset` with `assetType: "AUDIO"` |
| TTS generation | AI capability docs and Audio Agent governance; no runtime pipeline |
| Voice-over/dubbing | Media Localization voice-over and dubbing profiles |
| Synchronization | Multimedia and media localization synchronization metadata |
| Rights validation | Rights and Provenance audiobook flags and media rights metadata |
| Publication handoff | Publishing, Public Portal, and pipeline audiobook readiness |

## Ownership Rules

- Library owns authoritative text and Library Item identity.
- Audio owns narration project structure, voice selection, audio chapters, and
  synchronization maps.
- Multimedia may continue storing generic assets until canonical Audio
  migration is approved.
- Rights and Provenance owns voice rights and audio publication authorization.
- AI Orchestration owns TTS provider execution and AI task records.
- Publishing owns final publication artifacts and release approval.

