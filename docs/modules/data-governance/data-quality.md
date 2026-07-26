# Data Quality

## Purpose

Data Quality validates master data and metadata for completeness, accuracy,
consistency, uniqueness, validity, timeliness, referential integrity, and
provenance completeness.

## Quality Dimensions

Supported dimensions:

- Completeness.
- Accuracy.
- Consistency.
- Uniqueness.
- Validity.
- Timeliness.
- Referential integrity.
- Provenance completeness.

## Severity Levels

Severity levels:

- `INFO`.
- `WARNING`.
- `ERROR`.
- `BLOCKING`.

## Example Rules

- A publication must have a canonical title.
- A translated edition must reference a source edition.
- An original work must include its original language.
- A published translation must include the year of first publication.
- A public asset must have validated rights metadata.
- An active glossary term must have a documented source.

## Quality Score

Each master entity may receive a quality score calculated from:

- Completeness.
- Validity.
- Uniqueness.
- Consistency.
- Provenance.
- Timeliness.

The score does not override blocking rules. One `BLOCKING` violation can block
publication even when the overall score is high.

## Current Repository Baseline

Existing quality engines include:

- QA Engine.
- Semantic Fidelity Engine.
- Terminology Governance.
- Workflow gates.
- Publishing preflight.
- Rights warnings.
- Security validation.
- JSON Master validation.

These are domain-specific engines. The future Data Quality Engine should
coordinate shared master data validation without replacing domain validation.
