# Reference Data

## Purpose

Reference Data Registry governs controlled values used across the platform.

## Required Reference Domains

Minimum reference data sets:

- Languages.
- Countries.
- Currencies.
- Timezones.
- Editorial formats.
- Print sizes.
- Publication types.
- Workflow statuses.
- Categories.
- Genres.
- Rights types.
- Classification levels.

## Current Repository Baseline

Reference data currently appears as:

- TypeScript union types.
- Runtime constants.
- PostgreSQL enum types in core migrations.
- Frontend dictionaries and label maps.
- Module-specific status values.
- Documentation tables.

This is practical for the current codebase but fragmented for long-term
governance.

## Registry Record

Each reference data set should include:

- `id`.
- `name`.
- `version`.
- `scope`.
- `values`.
- `effectiveFrom`.
- `effectiveUntil`.
- `status`.
- `ownerId`.
- `localizedLabels`.
- `sortOrder`.
- `deprecationMetadata`.

## Rules

- Stable low-change physical states may remain database enums where approved.
- Values requiring localization, ordering, activation, approval, governance,
  or source authority should become reference data records.
- Application constants must align with registry authority.
- Reference data changes must be auditable.
