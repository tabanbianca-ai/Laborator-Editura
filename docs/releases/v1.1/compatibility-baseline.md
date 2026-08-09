# v1.1 Compatibility Baseline

Status: BASELINE_RULES_CREATED  
Owner: Architecture Governance

## Purpose

This document defines what v1.1 must preserve by default from v1.0.

## Preserved Compatibility Areas

- Database identifiers.
- Public APIs.
- Event contracts.
- Publication lineage.
- Master Documents.
- Library records.
- Rights and provenance records.
- User identities.
- Organization identities.
- Audit history.
- Export artifacts and publication records.
- Language metadata.
- Workflow state history.

## Change Classes

| Change class | Allowed in v1.1 | Requirement |
| --- | --- | --- |
| Additive field | Yes | Must be optional or defaulted |
| Additive endpoint | Yes | Must not weaken security |
| Additive event version | Yes | Must preserve previous event versions |
| Behavior hardening | Yes | Must preserve user data and contracts |
| Destructive schema change | No | Requires explicit migration approval |
| Identifier rewrite | No | Requires formal migration and owner approval |
| Public API removal | No | Requires deprecation cycle |
| Audit history rewrite | No | Not allowed |

## Exception Process

Any incompatible change requires:

- business justification;
- impact analysis;
- migration plan;
- rollback plan;
- security review;
- data integrity review;
- owner approval;
- audit record.

