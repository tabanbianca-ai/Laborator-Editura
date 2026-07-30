# Enterprise Architecture Technical Debt Registry

The Technical Debt Registry tracks architectural, code, infrastructure,
testing, security, data, UX, documentation, and operational debt so that it can
be prioritized and remediated intentionally.

## Technical Debt Record

Each item contains:

- `id`.
- `component`.
- `description`.
- `impact`.
- `priority`.
- `remediationPlan`.
- `estimatedEffort`.
- `owner`.
- `targetRelease`.
- `status`.

## Priority Levels

Recommended priorities:

- `CRITICAL`.
- `HIGH`.
- `MEDIUM`.
- `LOW`.

## Statuses

Recommended statuses:

- `IDENTIFIED`.
- `TRIAGED`.
- `ACCEPTED`.
- `IN_PROGRESS`.
- `RESOLVED`.
- `DEFERRED`.
- `WONT_FIX`.

## Current Baseline

Technical debt is currently documented through:

- Module gap analyses.
- Migration plans.
- Production readiness reports.
- Staging validation reports.
- Release checklists.
- Architecture chapter gap analyses.

This is useful but fragmented. There is no centralized technical debt registry
with ownership, priority, target release, remediation plan, and lifecycle
status.

## Initial Debt Categories

Current recurring debt themes:

- Runtime bridge persistence versus future PostgreSQL-first persistence.
- Documentation-driven module specifications without runtime registries for
  all governance concerns.
- Some architecture decisions embedded in narrative docs instead of ADRs.
- Missing centralized capability catalog.
- Missing structured quality gate and enterprise governance records.
- Performance/load/stress testing not yet formalized.
- Accessibility artifact validation not yet automated.
- AI benchmark and prompt regression records not yet centralized.

## Governance Rules

- High-impact debt must have an owner.
- Deferred debt must have a target review date.
- Debt that blocks release must be linked to Quality Assurance gates.
- Architecture debt must be linked to ADRs or architecture review records.
- Resolved debt must preserve evidence.

## Integration

The registry integrates with:

- Roadmap planning.
- Quality Assurance.
- DevSecOps.
- Security.
- Observability.
- Analytics.
- Workflow.
- Architecture Review Board.
