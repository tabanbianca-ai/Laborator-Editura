# Canonical Change Management Standard

## Purpose

Change management ensures that platform changes are justified, reviewed,
tested, approved, auditable, reversible where possible, and compatible with
architecture.

## Required Change Fields

Every governed change must include:

- `changeId`.
- Description.
- Justification.
- Impact.
- Affected components.
- Risk assessment.
- Implementation plan.
- Rollback plan.
- Test results.
- Approval.
- Audit information.

## Change Categories

Change categories include:

- Architecture change.
- Module change.
- API change.
- Database change.
- Security change.
- AI change.
- Infrastructure change.
- Documentation standard change.
- Publishing workflow change.
- Emergency change.

## Change Rules

- Major changes require architecture review.
- Breaking changes require explicit approval.
- Security-sensitive changes may require separation of duties.
- Emergency changes must be reviewed after execution.
- Rollback must be documented before implementation unless technically
  impossible and approved.
- Test evidence must be attached before closure.
- AI may draft impact analysis but must not approve changes.

