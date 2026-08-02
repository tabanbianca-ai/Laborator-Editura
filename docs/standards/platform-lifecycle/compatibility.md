# Platform Compatibility Standard

## Purpose

This document defines compatibility checks required during platform lifecycle
changes.

## Compatibility Dimensions

Codex must assess:

- API compatibility.
- Database compatibility.
- Workflow compatibility.
- AI compatibility.
- Documentation compatibility.
- Interface compatibility.
- Configuration compatibility.
- Deployment compatibility.
- Backup and restore compatibility.
- Security and access compatibility.
- Tenant isolation compatibility.

## Compatibility Assessment Record

Every compatibility assessment should preserve:

- Assessment ID.
- Component ID.
- Change ID.
- Previous version.
- New version.
- Affected modules.
- Affected APIs.
- Affected events.
- Affected data models.
- Affected workflows.
- Affected AI agents.
- Affected documentation.
- Risk level.
- Compatibility result.
- Required migration.
- Rollback plan.
- Test evidence.
- Approval.
- Audit information.

## Compatibility Results

Canonical compatibility results are:

- `COMPATIBLE`.
- `COMPATIBLE_WITH_WARNINGS`.
- `INCOMPATIBLE_REQUIRES_MIGRATION`.
- `BLOCKED`.
- `UNKNOWN_REQUIRES_REVIEW`.

## Rules

- Incompatible changes require a major version and migration plan.
- Unknown compatibility must be treated as requiring review.
- Compatibility warnings must be visible before release.
- Public API compatibility must follow Standard 03.
- Database compatibility must follow Chapter 6 and Standard 02.
- Workflow compatibility must follow Standard 07.
- Documentation compatibility must follow Standard 18.
- Architecture compatibility must follow Standard 17.

