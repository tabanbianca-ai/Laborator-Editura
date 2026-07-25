# Versioning Policy

## Purpose

Versioning policy defines how platform releases, contracts, operational
procedures, and documentation evolve.

## Platform Versioning

The platform uses Semantic Versioning:

- `MAJOR` for incompatible platform changes.
- `MINOR` for backward-compatible capability additions.
- `PATCH` for backward-compatible fixes.

## Versioned Assets

The following must be versioned or traceable:

- Application releases.
- API contracts.
- JSON Master format.
- Database migrations.
- Operational scripts.
- Infrastructure templates.
- Runbooks.
- Feature flags.
- AI prompt definitions.
- Policy definitions.
- Documentation.

## Compatibility Rules

- Backward compatibility is preferred.
- Incompatible changes require migration guidance.
- Published data contracts must not be silently changed.
- Older exports and backups must remain readable where practical.

## Release Notes

Release notes must include:

- Version.
- Date.
- Summary.
- User-visible changes.
- Operational changes.
- Migration notes.
- Known issues.
- Rollback guidance.

## Current Gaps

- Version tags are not yet enforced by automation.
- Changelog generation is manual.
- Operational script version metadata is not standardized.
- ADR identifiers are not yet part of release notes.
