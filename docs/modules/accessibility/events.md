# Accessibility Events

## Purpose

Accessibility events publish versioned, auditable changes to profiles,
localization resources, captions, transcripts, audio descriptions, alternative
text, and compliance validation.

## Official Events

Required official events:

- `AccessibilityProfileCreated`.
- `AccessibilityProfileUpdated`.
- `AccessibilityValidated`.
- `LocalizationUpdated`.
- `CaptionGenerated`.
- `CaptionValidated`.
- `TranscriptGenerated`.
- `TranscriptValidated`.
- `AudioDescriptionGenerated`.
- `AlternativeTextGenerated`.
- `AccessibilityComplianceUpdated`.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `resourceType`.
- `resourceId`.
- `resourceVersion`.
- `language`.
- `locale`.
- `standard`.
- `actorId`.
- `correlationId`.
- `occurredAt`.
- `metadata`.

## Rules

- Events are versioned.
- Events must not contain secrets.
- Restricted accessibility metadata follows Data Governance classification.
- External event delivery must go through Integration Gateway.
- Audit remains immutable.
- Events should reference captions, transcripts, media, publication artifacts,
  and master records through stable identifiers.
