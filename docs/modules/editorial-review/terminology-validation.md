# Terminology Validation in Editorial Review

## Purpose

Terminology validation ensures that reviewed text respects the platform's
approved terminology, glossary hierarchy, source authority, and Translation
Memory evidence rules.

## Current Baseline

Existing implementation includes:

- `terminology` backend module.
- Terminology Governance v2.
- Term statuses: `PROPOSED`, `UNDER_REVIEW`, `VALIDATED`, `SUSPENDED`,
  `ARCHIVED`, and governance rejection support.
- Validated terminology priority over Translation Memory and AI suggestions.
- Forbidden variants and preferred variants.
- Romanian diacritics and orthographic validation.
- Source priority configuration.
- Lexicographic dictionary evidence.
- Terminology audit events.
- QA integration for terminology violations.

## Priority Rule

Editorial Review must preserve this priority:

```text
Validated Platform Glossary
  > Documented Editorial Decision
  > Specialized Dictionary
  > Academic Dictionary
  > Translation Memory
  > AI Suggestion
```

Project glossary rules must remain above platform glossary rules where a
project-specific validated decision exists.

Personal glossary entries are suggestions only and must not override project
or platform terminology.

## Target Review Behavior

Terminology validation should flag:

- Missing mandatory terms.
- Unvalidated terms.
- Deprecated terms.
- Suspended or rejected terms.
- Forbidden variants.
- Disallowed synonyms.
- Inconsistent term usage.
- Missing or incorrect Romanian diacritics.
- Conflicts between glossary levels.
- Conflicts between terminology and dictionary evidence.

## Review Output

Each terminology issue should expose:

- Term.
- Language.
- Domain.
- Source text.
- Target text.
- Required translation.
- Forbidden or deprecated variant.
- Evidence sources.
- Priority rank.
- Severity.
- Review recommendation.
- Human final authority flag.

## Current Gaps

- Deprecated terminology is not yet distinct from every suspended or forbidden
  term case.
- Review-specific terminology observations are not yet unified under a
  canonical `EditorialReview` aggregate.
- The Review Workspace displays terminology support, but it does not yet own a
  persistent observation lifecycle.
- Cross-document terminology uniformity needs performance planning for large
  projects.

## Integration Rule

Terminology validation must integrate with Translation, QA, Semantic Fidelity,
Glossary, Lexicographic Intelligence, Workflow, and Publishing without
duplicating their data ownership.
