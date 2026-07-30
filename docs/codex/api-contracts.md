# Codex Governance API Contracts

This document defines the target API contract surface for the Enterprise
Meta-Architecture and Codex Governance Framework. These APIs are documentation
for future implementation and do not create runtime behavior by themselves.

## Contract Rules

- Codex APIs are authenticated.
- Codex APIs are versioned.
- Codex APIs enforce IAM and Need-to-Know permissions server-side.
- Codex mutations require architecture approval where applicable.
- Codex mutations require audit.
- AI may summarize or recommend but may not approve, publish, or grant
  exceptions.

## Planned Endpoints

`GET /codex/modules`

Returns the module catalog visible to the authenticated actor.

`GET /codex/standards`

Returns canonical standards and lifecycle metadata.

`GET /codex/dependencies`

Returns dependency registry entries and impact metadata.

`GET /codex/reference-models`

Returns canonical reference model definitions.

`POST /codex/reviews`

Creates an architecture review request.

`GET /codex/metrics`

Returns architecture maturity and compliance metrics.

`GET /codex/versions`

Returns published Codex versions.

## Error Contract

Codex APIs should use safe responses:

- `400` for invalid input.
- `401` for missing authenticated context.
- `403` for unauthorized access.
- `404` for unavailable or hidden records.
- `409` for state conflicts.
- `422` for governance rule failures.
- `500` for internal errors without sensitive details.

## Audit

All Codex API mutations must record:

- Actor.
- Entity type.
- Entity identifier.
- Action.
- Before and after state where appropriate.
- Timestamp.
- Correlation ID where available.
