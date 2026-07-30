# Compliance API Contracts

This document defines the target API contract surface for the Compliance,
Legal Governance and Risk Management Module. These APIs are documentation for
future implementation and do not create runtime behavior by themselves.

## Contract Rules

- Compliance APIs are authenticated.
- Compliance APIs are versioned.
- Compliance APIs are tenant-aware where tenant scope applies.
- Compliance APIs enforce IAM and Need-to-Know permissions server-side.
- Compliance mutations require audit.
- AI may summarize policies, risks, controls, and findings but may not approve
  policies, accept risks, approve exceptions, release legal holds, or close
  corrective actions.

## Planned Endpoints

### Policies

`GET /compliance/policies`

Returns policies visible to the authenticated actor.

`POST /compliance/policies`

Creates a policy draft or new policy version.

Required fields:

- `title`.
- `category`.
- `ownerId`.
- `version`.
- `effectiveDate`.
- `reviewDate`.

### Risks

`GET /compliance/risks`

Returns risk records visible to the authenticated actor.

`POST /compliance/risks`

Registers a risk.

Required fields:

- `category`.
- `description`.
- `probability`.
- `impact`.
- `mitigationPlan`.
- `ownerId`.

### Controls

`GET /compliance/controls`

Returns controls visible to the authenticated actor.

`POST /compliance/controls`

Registers a control.

Required fields:

- `objective`.
- `controlType`.
- `frequency`.
- `ownerId`.
- `executionMode`.
- `linkedRisks`.

### Audits

`GET /compliance/audits`

Returns audit engagements and findings visible to the authenticated actor.

### Exceptions

`POST /compliance/exceptions`

Creates an exception request.

Required fields:

- `policyId`.
- `justification`.
- `riskAcceptance`.
- `expiresAt`.

## Error Contract

Compliance APIs should use safe responses:

- `400` for invalid input.
- `401` for missing authenticated context.
- `403` for unauthorized access.
- `404` for unavailable or hidden records.
- `409` for state conflicts.
- `422` for governance rule failures.
- `500` for internal errors without sensitive details.

## Audit

All compliance API mutations must record:

- Actor.
- Organization where applicable.
- Entity type.
- Entity identifier.
- Action.
- Before and after state where appropriate.
- Timestamp.
- Correlation ID where available.
