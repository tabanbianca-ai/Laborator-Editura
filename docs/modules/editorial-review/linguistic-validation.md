# Linguistic Validation

## Purpose

Linguistic validation verifies that reviewed text follows the orthographic,
grammatical, punctuation, and formatting expectations of the active language.

## Validation Areas

The target model supports checks for:

- Spelling.
- Grammar.
- Agreement.
- Inflection.
- Conjugation.
- Diacritics.
- Punctuation.
- Capitalization.
- Spacing.
- Number formatting.
- Date formatting.
- Quotation marks.
- Locale-specific typography.

Rules must be configurable per language and locale.

## Current Baseline

Existing validation support includes:

- QA checks for missing target text, untranslated segments, number mismatch,
  date mismatch, punctuation mismatch, repeated segments, empty or too-short
  translations, and formatting-adjacent issues.
- Terminology Governance v2 checks for Romanian diacritics and orthographic
  validation.
- High severity terminology issues for missing or incorrect Romanian
  diacritics.
- Semantic Fidelity checks for meaning-related issues that may also surface
  linguistic risk.

## Target Behavior

Linguistic validation should:

- Run at segment level and document level.
- Return issue type, severity, message, affected text, and suggested action.
- Respect project language metadata.
- Respect platform Language Management.
- Preserve original and current text until a human accepts a correction.
- Produce auditable observations.

## Severity Guidance

| Severity | Use |
| --- | --- |
| `LOW` | Minor style or formatting issue |
| `MEDIUM` | Readability or consistency issue |
| `HIGH` | Linguistic issue likely to affect publication quality |
| `CRITICAL` | Issue that blocks review approval or publication readiness |

## Gaps

- Full grammar, agreement, inflection, and conjugation engines are not yet
  implemented.
- Per-language rule packs are not yet first-class configuration objects.
- Locale-specific typography rules need a formal model.
- Linguistic validation results are not yet unified under an
  `EditorialReview` observation aggregate.

## Implementation Constraint

Future implementation must be additive and must preserve existing QA,
Terminology Governance, Semantic Fidelity, Workflow, and Publishing behavior.
