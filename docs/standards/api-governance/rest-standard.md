# REST API Standard

## Purpose

This document defines the canonical REST API rules for Laborator Editura.

It governs internal, public, partner, admin, webhook-facing, and AI-adjacent
HTTP APIs.

## Transport and Encoding

REST APIs must use:

- HTTPS in deployed environments.
- JSON encoded as UTF-8.
- Standard HTTP methods and status codes.
- Safe error responses.
- Server-derived authenticated context.
- Documented request and response contracts.

## Resource Naming

Stable public APIs should use:

- Plural resource names.
- Nouns instead of verbs.
- Lowercase route segments.
- Hyphenated route segments when multiple words are needed.
- URL versioning for public and partner contracts.

Preferred pattern:

```text
/api/v1/{resources}
/api/v1/{resources}/{id}
```

Examples:

```text
GET    /api/v1/books
GET    /api/v1/books/{id}
POST   /api/v1/books
PUT    /api/v1/books/{id}
PATCH  /api/v1/books/{id}
DELETE /api/v1/books/{id}
```

Existing validated routes that do not yet use `/api/v1` remain compatible
until an approved migration is scheduled.

## HTTP Methods

| Method | Use |
| --- | --- |
| `GET` | Read resources or query collections |
| `POST` | Create resources or start commands that create state |
| `PUT` | Replace a resource when full replacement is intended |
| `PATCH` | Partially update a resource |
| `DELETE` | Delete only when deletion is allowed by the data lifecycle |

Operations that approve, reject, restore, export, or submit may remain command
endpoints when they represent domain actions rather than simple resource
updates. They must still be documented as contracts.

## Status Codes

| Code | Meaning |
| --- | --- |
| `200` | Successful read or command |
| `201` | Resource created |
| `202` | Accepted for asynchronous processing |
| `204` | Successful action with no response body |
| `400` | Validation or malformed request error |
| `401` | Authentication required or invalid |
| `403` | Authenticated but not authorized |
| `404` | Resource not found or not visible to caller |
| `409` | Conflict with current resource state |
| `422` | Business validation failure |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `502` | Upstream provider error |
| `503` | Service unavailable |

## Response Envelope

Stable integration-facing responses should use:

```json
{
  "requestId": "req_01H...",
  "timestamp": "2026-07-31T00:00:00.000Z",
  "status": "success",
  "data": {},
  "metadata": {},
  "links": {}
}
```

`data` contains the primary response object or collection. `metadata` contains
pagination, filters, version, classification, or processing metadata.
`links` contains navigational or related resource references when applicable.

## Error Envelope

Stable integration-facing errors should use:

```json
{
  "requestId": "req_01H...",
  "timestamp": "2026-07-31T00:00:00.000Z",
  "status": "error",
  "errorCode": "VALIDATION_ERROR",
  "errorMessage": "The request is invalid.",
  "details": {},
  "correlationId": "corr_01H..."
}
```

Errors must not expose secrets, stack traces, tenant data, provider payloads,
or restricted editorial content.

## Pagination and Filtering

Collection endpoints should document:

- Pagination style.
- Sort fields.
- Filter fields.
- Default page size.
- Maximum page size.
- Stable ordering.

Preferred pagination metadata:

```json
{
  "metadata": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 100,
    "totalPages": 2
  }
}
```

## Idempotency

Retry-prone state-changing APIs should support idempotency keys.

Examples:

- Export artifact generation.
- Webhook ingestion.
- External delivery callbacks.
- Batch import finalization.
- Payment or commerce callbacks when implemented.

Idempotency keys must be scoped to the authenticated actor, organization,
operation, and target resource where applicable.

## Authentication and Authorization

Protected APIs must:

- Use server-derived identity only.
- Reject requests without valid authenticated context.
- Enforce permissions server-side.
- Respect tenant isolation.
- Respect Need-to-Know access.
- Audit state-changing actions.

Approved public surfaces must be explicitly documented. Examples include
health checks and approved public catalog or public community read endpoints.

## OpenAPI Requirement

Stable public and partner APIs must have OpenAPI documentation before they are
treated as externally consumable contracts.

Internal APIs should document method, route, request DTO, response DTO,
permissions, audit effects, event effects, rate limit class, and lifecycle
state.

## Compatibility Rule

This standard does not authorize breaking route changes. Existing routes must
be inventoried, mapped to canonical contracts, versioned where needed, and
migrated only through an approved compatibility plan.

