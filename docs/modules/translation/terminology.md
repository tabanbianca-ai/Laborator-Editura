# Terminology

## Purpose

Terminology ensures that translations use approved, domain-appropriate,
orthographically correct, and auditable terms.

## Current Implementation Baseline

Current implementation includes:

- `terminology` backend module.
- Runtime table `terminology_terms`.
- Runtime audit table `terminology_audit_events`.
- Migration `0002_terminology_glossary_v1.sql`.
- Governance migration `0006_terminology_governance_v2.sql`.
- Contract tests for terminology and terminology governance v2.
- Lexicographic dictionary evidence integration.

Implemented API:

- `POST /terminology/terms`.
- `POST /terminology/terms/propose`.
- `PATCH /terminology/terms/:id`.
- `POST /terminology/terms/:id/evaluate`.
- `POST /terminology/terms/:id/under-review`.
- `POST /terminology/terms/:id/validate`.
- `POST /terminology/terms/:id/reject`.
- `POST /terminology/terms/:id/suspend`.
- `POST /terminology/terms/:id/archive`.
- `GET /terminology/terms`.
- `GET /terminology/terms/requiring-review`.
- `GET /terminology/source-priority`.
- `POST /terminology/source-priority`.
- `POST /terminology/check-segment`.

## Official Status Mapping

Requested Translation specification terms:

- Validated.
- Preferred.
- Allowed.
- Deprecated.
- Rejected.
- Under Review.

Current platform terminology statuses:

- `PROPOSED`.
- `UNDER_REVIEW`.
- `VALIDATED`.
- `REJECTED`.
- `SUSPENDED`.
- `ARCHIVED`.

Mapping:

- Validated -> `VALIDATED`.
- Under Review -> `UNDER_REVIEW`.
- Rejected -> `REJECTED`.
- Deprecated -> `SUSPENDED` or `ARCHIVED` depending on governance decision.
- Preferred / Allowed -> represented by preferred variants, approved
  translation, glossary scope, and governance metadata.

## Governance Rules

- AI must never create `VALIDATED` terminology automatically.
- New terms start as `PROPOSED`.
- Terms missing approved source evidence become `UNDER_REVIEW`.
- Romanian terms require orthographic and diacritics validation.
- Missing or incorrect Romanian diacritics create High severity issues.
- Rejected terms create Critical terminology issues.
- Only authorized humans may validate, suspend, archive, or reject terms.
- Repeated usage must not auto-promote terms.
- Validated terminology has priority over Translation Memory and AI.

## Segment Check Output

Terminology segment checks may return:

- Validity.
- Violations.
- Dictionary evidence.
- Glossary conflicts.
- Glossary priority.
- Source priority.
- Proposal explanation.

## Current Gaps

- Preferred/Allowed/Deprecated terminology states need clearer first-class
  modeling or documented mapping.
- Language-specific grammar and style terminology checks are not exhaustive.
- Full source authority conflict resolution UI is not implemented.
