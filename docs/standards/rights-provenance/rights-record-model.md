# Canonical Rights Record Model

## Purpose

This document defines the canonical rights record required by Standard 13.

## Canonical Rights Record Fields

Every rights record must preserve:

| Field | Description |
| --- | --- |
| `id` | Stable rights record identifier |
| `canonical_identifier` | Canonical cross-system identifier |
| `resource_type` | Work, manuscript, edition, translation, image, audio, video, voice, font, promotional asset, AI asset, or other resource |
| `resource_id` | Resource identifier |
| `resource_version` | Exact resource version covered |
| `rights_holder_id` | Rights holder reference |
| `rights_type` | Canonical rights type |
| `authorization_basis` | Basis authorizing the use |
| `license_id` | License reference where applicable |
| `contract_id` | Contract reference where applicable |
| `languages` | Authorized languages |
| `territories` | Authorized territories |
| `formats` | Authorized formats |
| `distribution_channels` | Authorized channels |
| `commercial_use` | Commercial use permission |
| `adaptation_allowed` | Adaptation permission |
| `derivative_use_allowed` | Derivative use permission |
| `ai_processing_allowed` | AI processing permission |
| `valid_from` | Start of validity |
| `valid_until` | End of validity |
| `restrictions` | Applicable restrictions |
| `evidence` | Evidence references |
| `verification_status` | Verification lifecycle status |
| `verified_by` | Human or authorized reviewer |
| `verified_at` | Verification timestamp |
| `version` | Rights record version |
| `audit_information` | Audit linkage |

## Canonical Rights Types

The platform must support at minimum:

- `COPYRIGHT`.
- `TRANSLATION_RIGHT`.
- `PUBLICATION_RIGHT`.
- `DISTRIBUTION_RIGHT`.
- `PRINT_RIGHT`.
- `DIGITAL_RIGHT`.
- `AUDIO_RIGHT`.
- `VIDEO_RIGHT`.
- `ADAPTATION_RIGHT`.
- `ILLUSTRATION_RIGHT`.
- `PROMOTIONAL_USE_RIGHT`.
- `ACCESSIBILITY_TRANSFORMATION_RIGHT`.
- `AI_PROCESSING_RIGHT`.
- `VOICE_USAGE_RIGHT`.
- `PUBLIC_DOMAIN`.

A general right must not be interpreted as automatically including all other
rights.

## Authorization Basis

Every use must be justified by one of:

- `CONTRACT`.
- `LICENSE`.
- `WRITTEN_PERMISSION`.
- `RIGHTS_HOLDER_DECLARATION`.
- `PUBLIC_DOMAIN`.
- `STATUTORY_EXCEPTION`.
- `ORIGINAL_OWNERSHIP`.
- `OPEN_LICENSE`.
- `INTERNAL_AUTHORIZATION`.

The authorization basis must be accompanied by corresponding evidence.

## Verification Statuses

Allowed statuses:

- `DRAFT`.
- `UNDER_REVIEW`.
- `INFORMATION_MISSING`.
- `VALIDATED`.
- `VALIDATED_WITH_RESTRICTIONS`.
- `EXPIRED`.
- `REVOKED`.
- `REJECTED`.
- `ARCHIVED`.

Only `VALIDATED` and `VALIDATED_WITH_RESTRICTIONS` allow controlled
continuation.

Restrictions must be applied automatically.

