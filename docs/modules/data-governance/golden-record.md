# Golden Record

## Purpose

Golden Record represents the approved canonical version of a master entity.

It is derived from validated sources, configurable priorities, editorial
decisions, reconciliation rules, and authorized human approvals.

## Required Data

Each Golden Record must preserve:

- Canonical entity identifier.
- Current canonical values.
- All contributing source records.
- Conflicting values.
- Selection rule.
- Approver.
- Approval timestamp.
- Quality status.
- Classification.
- Version history.
- Audit trail.

## Rules

- Golden Records do not erase source records.
- Conflicting values remain visible to authorized users.
- AI may propose candidate values but cannot approve the Golden Record.
- Golden Record changes must create a new version.
- Publication-impacting Golden Record changes require workflow and impact
  analysis where applicable.

## Current Repository Baseline

The platform already has authoritative records by module, such as validated
terminology, approved translations, rights records, publication records, and
workflow approvals. These are not yet unified as MDM Golden Records.

## Relationship to Source Modules

Golden Records reference module-owned records. They do not transfer ownership
of module business data to Data Governance.
