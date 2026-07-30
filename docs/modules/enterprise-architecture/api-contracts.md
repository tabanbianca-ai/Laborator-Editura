# Enterprise Architecture API Contracts

This document defines the target API contract surface for the Enterprise
Architecture, Portfolio and Strategic Governance Module. These APIs are
documentation for future implementation and do not create runtime behavior by
themselves.

## Contract Rules

- Architecture APIs are authenticated.
- Architecture APIs are versioned.
- Architecture APIs are tenant-aware where tenant scope applies.
- Architecture APIs enforce IAM and Need-to-Know permissions server-side.
- Architecture changes require audit.
- AI may draft summaries and recommendations but may not approve architecture
  decisions, technology standards, roadmap changes, or standard exceptions.

## Planned Endpoints

### Capabilities

`GET /architecture/capabilities`

Returns capabilities visible to the authenticated actor.

`POST /architecture/capabilities`

Creates or registers a capability.

Required fields:

- `name`.
- `description`.
- `businessOwnerId`.
- `technicalOwnerId`.
- `strategicPriority`.
- `lifecycleStatus`.

### Architecture Decision Records

`GET /architecture/adrs`

Returns ADRs visible to the authenticated actor.

`POST /architecture/adrs`

Creates an ADR draft.

Required fields:

- `title`.
- `context`.
- `decision`.
- `alternatives`.
- `consequences`.
- `reviewers`.

### Strategic Roadmap

`GET /architecture/roadmap`

Returns strategic roadmap items.

`POST /architecture/roadmap`

Creates or updates a roadmap item.

Required fields:

- `objective`.
- `initiative`.
- `milestone`.
- `dependencies`.
- `risks`.
- `successIndicators`.

### Technology Standards

`GET /architecture/standards`

Returns technology standards and lifecycle states.

Future mutation endpoints should support proposal, approval, restriction,
deprecation, retirement, and exception workflow.

### Technical Debt

`GET /architecture/technical-debt`

Returns technical debt items visible to the authenticated actor.

Future mutation endpoints should support debt registration, prioritization,
owner assignment, remediation, deferral, and resolution.

## Error Contract

Architecture APIs should use safe responses:

- `400` for invalid input.
- `401` for missing authenticated context.
- `403` for unauthorized access.
- `404` for unavailable or hidden records.
- `409` for state conflicts.
- `422` for governance rule failures.
- `500` for internal errors without sensitive details.

## Audit

All architecture API mutations must record:

- Actor.
- Organization where applicable.
- Entity type.
- Entity identifier.
- Action.
- Before and after state where appropriate.
- Timestamp.
- Correlation ID where available.
