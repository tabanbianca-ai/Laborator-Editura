# Accessibility Domain Model

## Purpose

This document defines the canonical domain model for the Accessibility,
Localization and Inclusive Experience Module.

## Aggregate Ownership

Accessibility owns accessibility and localization governance metadata. It does
not own source content, translations, media production, publication approval,
or IAM authorization.

| Entity | Owner | Purpose |
| --- | --- | --- |
| `AccessibilityProfile` | Accessibility | User or organization profile for UI, document, and media accessibility behavior. |
| `LocalizationResource` | Accessibility / Configuration | Versioned UI localization key and value metadata. |
| `AccessibilityMetadata` | Accessibility | Accessibility metadata attached to resources and generated outputs. |
| `CaptionTrack` | Accessibility / Media Localization | Timed caption or subtitle track metadata. |
| `Transcript` | Accessibility / Media Localization | Text transcript metadata for audio or video resources. |
| `AudioDescriptionTrack` | Accessibility / Media Localization | Timed or structured audio description metadata. |
| `AlternativeTextRecord` | Accessibility | Alt text or long description metadata for visual resources. |
| `AccessibilityValidationReport` | Accessibility | Validation result for UI, document, publication, audio, or video resource. |
| `ReadingProfile` | Accessibility | Reading preferences such as font size, contrast, spacing, motion, and dyslexia support. |
| `AccessibilityAuditEvent` | Accessibility | Immutable audit record for accessibility actions. |

## AccessibilityProfile

Required fields:

- `id`.
- `organizationId`.
- `name`.
- `description`.
- `uiSettings`.
- `documentSettings`.
- `mediaSettings`.
- `enabledFeatures`.
- `status`.
- `version`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Profile examples:

- `DEFAULT`.
- `LOW_VISION`.
- `BLIND`.
- `COLOR_BLIND`.
- `DYSLEXIA`.
- `MOTOR_IMPAIRMENT`.
- `HEARING_IMPAIRMENT`.
- `SENIOR_MODE`.
- `CHILD_MODE`.

## LocalizationResource

Required fields:

- `id`.
- `locale`.
- `namespace`.
- `translationKey`.
- `translationValue`.
- `version`.
- `status`.
- `source`.
- `reviewedBy`.
- `updatedAt`.

## AccessibilityMetadata

Required fields:

- `resourceId`.
- `resourceType`.
- `accessibilityLevel`.
- `captions`.
- `transcript`.
- `alternativeText`.
- `readingOrder`.
- `semanticStructure`.
- `validationStatus`.
- `standards`.
- `updatedAt`.

## CaptionTrack

Required fields:

- `id`.
- `resourceId`.
- `language`.
- `locale`.
- `timestamps`.
- `captionType`.
- `format`.
- `version`.
- `status`.

Supported formats:

- `WebVTT`.
- `SRT`.
- `ASS`.

Caption types:

- `SUBTITLE`.
- `CLOSED_CAPTION`.
- `SDH`.
- `TRANSLATION_SUBTITLE`.

## Transcript

Required fields:

- `id`.
- `resourceId`.
- `language`.
- `locale`.
- `segments`.
- `speakerMetadata`.
- `timecodes`.
- `version`.
- `status`.

## AccessibilityValidationReport

Required fields:

- `id`.
- `resourceId`.
- `resourceType`.
- `standard`.
- `level`.
- `status`.
- `issues`.
- `validatedAt`.
- `validatedBy`.
- `automationTool`.

Statuses:

- `PASS`.
- `PASS_WITH_WARNINGS`.
- `FAIL`.
- `NOT_VALIDATED`.

## Standards

The module targets:

- WCAG 2.2 AA.
- EPUB Accessibility.
- PDF/UA.
- WAI-ARIA.
- Semantic HTML5.
- WebVTT.
- SRT.

## Invariants

- Accessibility profiles modify interaction and presentation behavior without
  changing source content.
- Platform Language localizes UI only and does not change manuscript,
  original, authoring, or target languages.
- Captions, transcripts, and audio descriptions remain linked to source media
  and language-specific versions.
- Accessibility validation must occur before publication according to
  publishing policy.
- Accessibility-related operations are auditable.
