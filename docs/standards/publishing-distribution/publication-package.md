# Canonical Publication Package

## Purpose

The publication package is the immutable evidence bundle produced for each
official publication generation.

It proves which source, version, configuration, rights, metadata, accessibility
evidence, validations, formats, and approvals produced the official edition.

## Required Package Contents

Each publication package must include:

- `publication_manifest.json`.
- `publication_metadata.json`.
- `rights_manifest.json`.
- `accessibility_manifest.json`.
- `integrity_manifest.json`.
- `generated_assets/`.
- `validation_reports/`.
- `distribution_profiles/`.

## Publication Manifest

The publication manifest must record:

- Master document reference.
- Source master version.
- Generator.
- Generator version.
- Configuration profile.
- Produced formats.
- Generation timestamp.
- Human approvals.
- Validation results.
- Integrity values.
- Audit references.

## Package Rules

- The package is immutable after approval.
- Corrections create a new package version.
- A package must not be assembled from unapproved working files.
- Every generated asset must reference the exact package and source version.
- Every distribution record must reference the exact publication version.
- Package metadata must be exportable through JSON Master where applicable.

## Package Evidence

Publication packages must retain evidence for:

- Workflow approval.
- Rights validation.
- Metadata completeness.
- Accessibility validation.
- Terminology validation.
- Quality or preflight validation.
- Format generation.
- Integrity verification.
- Human final approval.

