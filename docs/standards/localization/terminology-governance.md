# Canonical Localization Terminology Governance

## Purpose

This document defines how user-interface terminology and platform-specific
terminology are governed under Standard 11.

## Source Priority for General UI Terminology

General interface terminology must be selected in this order:

1. Official localized terminology from Windows, macOS, iOS, and Android.
2. Official terminology from the technologies used by the platform.
3. Established terminology in comparable professional applications.
4. Official editorial terminology.
5. Laborator Editura platform terminology registry.

The platform must not invent translations when an official established
equivalent exists.

## Platform Terminology Registry Scope

The platform-specific terminology registry is reserved for terms that:

- Are specific to Laborator Editura.
- Have a special editorial meaning.
- May create ambiguity.
- Require cross-module consistency.
- Lack a sufficient established equivalent.

## Canonical Term Fields

Every governed term must preserve:

| Field | Description |
| --- | --- |
| `id` | Stable term identifier |
| `canonical_term` | Canonical source concept |
| `domain` | Business, editorial, technical, or UI domain |
| `source_language` | Source language of the term |
| `translations` | Approved localized values by language or locale |
| `definition` | Meaning and boundaries |
| `context` | Where the term applies |
| `accepted_variants` | Approved variants where permitted |
| `rejected_variants` | Forbidden variants |
| `source_reference` | Authority source |
| `status` | Term lifecycle status |
| `version` | Term version |
| `owner` | Term owner |
| `approval_history` | Review and approval history |

## Official Term Statuses

- `VALIDATED`.
- `UNDER_REVIEW`.
- `SPECIALIZED_TERM`.
- `SUSPENDED`.
- `ARCHIVED`.

## Conflict Rules

- Conflicting variants must be reviewed by authorized humans.
- AI suggestions may support analysis but may not validate official
  terminology.
- Local modules must not create private competing terms for shared platform
  concepts.
- Terminology decisions must remain auditable and versioned.

## Relationship to Translation Terminology

Interface terminology is separate from editorial translation terminology, but
both must use the same governance principles:

- Canonical ownership.
- Source authority.
- Status lifecycle.
- Human approval.
- Audit trail.

