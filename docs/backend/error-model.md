# Backend Error Model

## Purpose

The backend error model standardizes failures across modules while preserving
safe user-facing responses.

## Error Taxonomy

| Category | Meaning | Typical HTTP Status |
| --- | --- | --- |
| `ValidationError` | Input shape, required field, format, or limit failure | 400 |
| `AuthenticationError` | Missing, invalid, expired, or revoked session | 401 |
| `AuthorizationError` | Authenticated actor lacks permission or scope | 403 |
| `NotFoundError` | Resource does not exist or is not visible to actor | 404 |
| `ConflictError` | State conflict, duplicate active record, or version conflict | 409 |
| `BusinessRuleError` | Domain invariant or workflow rule failed | 422 |
| `RateLimitError` | Rate limit or lockout threshold reached | 429 |
| `IntegrationError` | External provider or adapter failure | 502 |
| `InfrastructureError` | Database, storage, queue, or system failure | 500 |

## Safe Response Rules

Responses must not expose:

- Stack traces.
- Secrets.
- Tokens.
- SQL or persistence internals.
- Provider keys or payload internals.
- Sensitive document content.
- Private user metadata.

## Current Baseline

Current services use NestJS exceptions such as `BadRequestException`,
`UnauthorizedException`, `NotFoundException`, and related HTTP exceptions.
Security hardening added safe rate limit behavior and account lockout
metadata.

The repository does not yet have one central domain error class hierarchy or
one central error mapper for all modules.

## Required Alignment

Future work should introduce:

- Shared typed error categories.
- Domain-specific errors independent from NestJS.
- Delivery-layer mapping from domain/application errors to HTTP responses.
- Correlation IDs in error logs and responses where safe.
- Contract tests for expected error categories.

## Acceptance Criteria

- Errors are classified consistently.
- User-facing messages are safe.
- Logs contain enough diagnostic context without secrets.
- Domain rules do not throw framework-specific errors from pure domain code.
