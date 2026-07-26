# Data Retention

## Purpose

Data Retention defines active retention, archival retention, logical deletion,
anonymization, legal hold, and preservation requirements for data classes.

## Retention Policy Fields

Each policy should include:

- Data class.
- Active period.
- Archive period.
- Deletion conditions.
- Legal obligations.
- Permanent preservation flag.
- Anonymization requirement.
- Legal hold rules.
- Exceptions.
- Owner.
- Version.

## Current Repository Baseline

Retention foundations exist in:

- Backup governance.
- Preservation records.
- Audit permanence rules.
- Library publication versioning.
- Rights and provenance history.
- Soft-delete and archive guidance in database standards.
- Infrastructure backup and restore scripts.

There is no central retention registry connected to every data domain yet.

## Rules

- Logical deletion and version retention take precedence over immediate
  physical deletion.
- Validated editorial data and publication history must not be permanently
  lost.
- Legal hold prevents deletion or destructive modification.
- Retention changes must be audited.
- Backup and restore policy must preserve retention metadata.
