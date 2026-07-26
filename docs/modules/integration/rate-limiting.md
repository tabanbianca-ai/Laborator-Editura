# Rate Limiting

## Purpose

Rate limiting protects platform availability, tenant fairness, provider
quotas, and sensitive operations.

## Target Capabilities

Gateway rate limiting must support:

- Request quotas.
- Burst control.
- Concurrent request limits.
- Tenant limits.
- Consumer limits.
- Connector limits.
- Endpoint limits.
- Adaptive throttling.
- Retry-after metadata.
- Observability and audit for exceeded limits.

## Current Repository Baseline

Current `RateLimitMiddleware` provides:

- `auth` policy.
- `sensitive` policy.
- `default` policy.
- In-memory buckets.
- Safe 429 error message.
- Public health exemption.

Gateway route registry metadata includes rate limit policy references such as:

- `standard-read`.
- `sensitive-write`.

## Policy Requirements

Future `RateLimitPolicy` records should define:

- `id`.
- `organizationId`.
- `name`.
- `scope`.
- `maxRequests`.
- `windowMs`.
- `burstLimit`.
- `concurrentLimit`.
- `connectorId`.
- `apiConsumerId`.
- `status`.
- `createdAt`.
- `updatedAt`.

## Rules

- Rate limits must never rely on client-provided tenant identity.
- Sensitive endpoints must have stricter policies than read endpoints.
- Auth endpoints must have separate brute-force protection.
- Connector calls must respect provider quotas.
- Rate-limit events must be observable and auditable.
- Distributed deployments require distributed rate-limit storage.

## Current Gaps

- Rate limiting is in-memory and process-local.
- Rate limit policies are not yet runtime-configurable.
- No tenant-specific or consumer-specific runtime policy exists.
- No connector quota enforcement exists.
- No dedicated rate-limit audit event exists beyond operational behavior.
