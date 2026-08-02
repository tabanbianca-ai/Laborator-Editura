# Publication Integrity Validation

## Purpose

Integrity validation proves that each official publication artifact remains
the exact approved generated artifact linked to the publication package.

## Required Integrity Fields

Each published format must preserve:

- Checksum.
- File size.
- MIME type.
- Version.
- Generation date.
- Signature where required.
- Validation report.
- Publication manifest reference.
- Integrity status.

## Integrity Statuses

Allowed integrity statuses are:

- `PENDING`.
- `VALID`.
- `INVALID`.
- `REQUIRES_REGENERATION`.
- `SUPERSEDED`.
- `ARCHIVED`.

## Validation Rules

- A file modified after approval must be invalidated automatically.
- Integrity checks must run before publication.
- Integrity checks must run before distribution submission.
- Integrity evidence must be retained after withdrawal.
- Regenerated files must receive new integrity records.
- Channel copies must be checked against submission records when supported.

## Audio and Video Integrity

Audio and video publications must additionally preserve:

- Exact text version.
- Segment references.
- Narrator or voice profile.
- Voice rights.
- Subtitles.
- Transcript.
- Audio description.
- Rendering profile.
- Generator.
- Approval.
- Synchronization metadata.
- Accessibility metadata.

## Children's Publication Integrity

Children's publications must additionally preserve:

- Age classification.
- Illustration validation.
- Text-in-image validation.
- Accessibility profile.
- Narration metadata.
- Minor data protection assessment.
- Interaction controls.
- Content approval.
- Animated video validation when applicable.

