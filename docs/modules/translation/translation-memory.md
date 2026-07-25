# Translation Memory

## Purpose

Translation Memory stores validated translations as reusable translation
evidence.

It improves consistency but never replaces human decision-making.

## Current Implementation Baseline

Current implementation includes:

- `translation-memory` backend module.
- Runtime table `translation_memory_entries`.
- Runtime audit table `translation_memory_audit_events`.
- Migration `0001_translation_memory_v1.sql`.
- Contract tests in `apps/api/tests/translation-memory-contract.test.mjs`.

Implemented API:

- `POST /translation-memory`.
- `GET /translation-memory/search`.
- `GET /translation-memory/proposals`.
- `POST /translation-memory/:id/approve`.
- `GET /translation-memory`.

## TM Entry Fields

Current fields include:

- Source text.
- Target text.
- Source and target language.
- Project reference.
- Document reference.
- Source segment reference.
- Domain.
- Context.
- Author.
- Reviewer.
- Approval date.
- Version.
- Confidence score.
- Approval status.
- Origin.
- Created and approved actors.
- Metadata.

## Match Types

Supported match types:

- `EXACT`.
- `FUZZY`.
- `CONTEXT`.

## Rules

- Only approved Translation Memory entries may be authoritative suggestions.
- Translation Memory entries generated from AI origin cannot be approved
  directly into authoritative TM.
- Translation Memory proposals are proposal-only.
- TM must not overwrite user translations.
- TM reuse must be auditable.
- Validated terminology has priority over TM.
- TM has priority over AI suggestions when terminology does not decide.

## Current Integration

`TranslationsService.submitTranslation` currently:

- Builds TM proposals for the source segment.
- Adds approved human validated translations to TM when QA, terminology, and
  semantic checks pass.
- Stores TM proposal metadata on translation records.

## Current Gaps

- TM lookup performance is runtime repository based and not yet optimized for
  million-segment scale.
- Cross-project/global TM governance needs clearer project/domain policy.
- TM version lineage and conflict resolution can be expanded.
- TM reuse audit exists but proposal consumption acceptance/rejection is not
  yet a separate first-class decision record.
