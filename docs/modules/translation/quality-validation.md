# Translation Quality Validation

## Purpose

Quality validation ensures that translations are complete, terminologically
consistent, semantically faithful, linguistically correct, and workflow-ready.

## Validation Layers

Translation validation uses:

- Terminology validation.
- QA Engine.
- Semantic Fidelity Engine.
- Lexicographic evidence.
- Workflow blocking rules.
- Human review.

## Current QA Baseline

Current QA checks include:

- Missing target translation.
- Untranslated segment.
- Number mismatch.
- Date mismatch.
- Punctuation mismatch.
- Repeated segment.
- Terminology violation.
- Forbidden terminology variant.
- Terminology diacritics issue.
- Rejected terminology.
- Empty translation.
- Too-short translation.

QA severity levels:

- `LOW`.
- `MEDIUM`.
- `HIGH`.
- `CRITICAL`.

Implemented API:

- `POST /qa/segments/run`.
- `POST /qa/documents/run`.
- `GET /qa/issues`.
- `PATCH /qa/issues/:id/resolve`.
- `POST /qa/reports/:id/recalculate-score`.

## Current Semantic Fidelity Baseline

Current semantic issue types include:

- Meaning drift.
- Unjustified reinterpretation.
- Omitted meaning.
- Added meaning.
- Terminology meaning conflict.
- Context mismatch.

Risk levels:

- `LOW`.
- `MEDIUM`.
- `HIGH`.
- `CRITICAL`.

Implemented API:

- `POST /semantic-fidelity/segments/run`.
- `POST /semantic-fidelity/documents/run`.
- `GET /semantic-fidelity/issues`.
- `PATCH /semantic-fidelity/issues/:id/resolve`.
- `POST /semantic-fidelity/reports/:id/recalculate-score`.

## Linguistic Validation Target

The Translation Module must eventually support language-configurable checks
for:

- Orthography.
- Grammar.
- Agreement.
- Diacritics.
- Verb tense.
- Concordance.
- Repetition.
- Pleonasm.
- Cacophony.
- Punctuation.

## Current Integration

`TranslationsService.submitTranslation` currently runs:

- Terminology check.
- QA segment run.
- Semantic Fidelity segment run.
- Lexicographic support lookup.
- Translation Memory proposal lookup.

Validated translations can be added to TM only when terminology, QA, and
semantic checks pass.

## Current Gaps

- Comprehensive grammar and style checks are not implemented for every
  supported language.
- Style rule configuration is not fully first-class.
- Version comparison and visual diff are not implemented as backend services.
- QA/Semantic blocking is enforced in Workflow but should be traced back into
  translation workspace decisions more explicitly.
