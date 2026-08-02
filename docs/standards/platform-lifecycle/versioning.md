# Platform Lifecycle Versioning Standard

## Purpose

This document defines version governance for platform components.

## Versioning Model

Laborator Editura uses Semantic Versioning:

- Major.
- Minor.
- Patch.

Version format:

```text
MAJOR.MINOR.PATCH
```

## Version Rules

- Major versions are required for incompatible changes.
- Minor versions are required for compatible capability additions.
- Patch versions are required for compatible fixes.
- Pre-release labels may be used for concept, prototype, alpha, beta, and
  release candidate work.
- Approved versions must not be overwritten.
- Version changes must preserve changelog, owner, approval, validation
  evidence, and audit history.

## Compatibility Requirements

Version changes must assess:

- API compatibility.
- Database compatibility.
- Workflow compatibility.
- AI compatibility.
- Documentation compatibility.
- Interface compatibility.
- Configuration compatibility.
- Backup and restore compatibility.

## Current Baseline

The current workspace packages use version `0.1.0`, which indicates
pre-release active development:

- Root workspace: `0.1.0`.
- `@laborator/ai`: `0.1.0`.
- `@laborator/api`: `0.1.0`.
- `@laborator/web`: `0.1.0`.
- `@laborator/db`: `0.1.0`.
- `@laborator/shared`: `0.1.0`.

Future release preparation must define the first v1.0 versioning plan before
production launch.

