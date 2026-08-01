# Canonical Migration Testing Standard

## Purpose

This document defines mandatory validation for data migrations, schema
changes, runtime persistence changes, backup/restore changes, and
compatibility migrations.

## Migration Test Requirements

Every migration must include:

- Backup.
- Isolated environment test.
- Pre-migration verification.
- Post-migration verification.
- Record counts.
- Referential integrity checks.
- Legacy identifier checks.
- Rollback plan.
- Restore evidence.

Destructive migrations without a validated rollback or recovery strategy are
prohibited.

## Migration Test Scope

Migration testing applies to:

- Database schema changes.
- Runtime database changes.
- JSON Master changes.
- Backup/restore format changes.
- API contract migrations.
- Data model migrations.
- Identifier migrations.
- Audit and version history migrations.
- Asset and publication metadata migrations.
- Tenant isolation migrations.

## Pre-Migration Evidence

Pre-migration evidence must include:

- Source version.
- Source commit.
- Environment.
- Backup reference.
- Record counts.
- Integrity baseline.
- Known risks.
- Rollback plan.

## Post-Migration Evidence

Post-migration evidence must include:

- Target version.
- Migration result.
- Record counts.
- Integrity checks.
- Audit preservation.
- Version history preservation.
- Tenant isolation checks.
- Application smoke test.
- Restore or rollback evidence.

## Rollback and Restore

Rollback or restore validation must prove:

- Data can be recovered.
- Audit evidence remains intact.
- Tenant isolation is preserved.
- Source identifiers remain traceable.
- User-facing behavior remains safe.

## Migration Gate

Migration gate blocks release when:

- Backup is missing.
- Restore evidence is missing.
- Record counts are unexplained.
- Referential integrity fails.
- Tenant boundaries fail.
- Audit history is lost.
- Rollback is untested for a high-risk migration.

## Audit

Audit must record:

- Migration test planned.
- Migration test executed.
- Backup created.
- Restore verified.
- Integrity check passed or failed.
- Rollback tested.
- Migration waiver approved or rejected.
