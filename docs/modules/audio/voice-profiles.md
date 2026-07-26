# Voice Profiles

## Purpose

Voice Profiles define reusable, versioned voice configurations for human
recordings, TTS voices, cloned voices, and imported voices.

They keep voice selection independent from narration projects so that one
voice profile can be reused safely across multiple projects.

## Voice Profile Fields

Each voice profile must include:

- `voiceProfileId`.
- `organizationId`.
- `name`.
- `voiceType`.
- `language`.
- `locale`.
- `accent`.
- `style`.
- `tone`.
- `pace`.
- `pauseProfile`.
- `expressiveness`.
- `volumeProfile`.
- `pronunciationDictionaryId`.
- `providerId`.
- `providerVoiceId`.
- `rightsRecordId`.
- `version`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## Voice Types

Supported voice types:

- `HUMAN`.
- `TTS`.
- `CLONED`.
- `IMPORTED`.

All voice types are treated uniformly as auditable voice sources.

## Rights and Consent

Voice profiles must reference rights and consent records when applicable.

Voice cloning requires:

- Consent document reference.
- Allowed use cases.
- Territory scope.
- Language scope.
- Expiration date when applicable.
- Rights holder.
- Approval status.

Rights and Provenance must validate voice usage before publication.

## Current Repository Baseline

Current support:

- Multimedia audio profiles store `voiceProfileIds`.
- Media Localization voice-over/dubbing profiles store `voiceTracks`,
  `dubbingProjects`, and `narratorProfiles`.
- AI Governance defines Audio Agent responsibilities for voice profile
  suggestions and authorized voice metadata.

Current gaps:

- No canonical `VoiceProfile` aggregate.
- No reusable voice profile API.
- No dedicated voice consent model.
- No versioned pronunciation dictionary model.
- No formal voice rights validation handoff for publication.

## Versioning Rules

- Voice profiles cannot be overwritten.
- Changes create a new version.
- Narration projects record the exact voice profile version used.
- Published audio records preserve the voice profile version forever.
- Suspended voices cannot be used for new official audio generation.

## Governance Rules

AI may suggest:

- Voice profile candidates.
- Pronunciation entries.
- Pace and pause metadata.
- Accessibility improvements.

AI may not:

- Approve voice rights.
- Clone a voice without consent.
- Publish a voice model.
- Bypass Rights and Provenance.
- Replace a human narrator decision.

