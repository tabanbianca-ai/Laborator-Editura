# API Gateway

## Purpose

The API Gateway provides the central interoperability boundary for public,
partner, internal, webhook, and connector traffic.

## Gateway Responsibilities

The gateway provides:

- Central authentication.
- IAM authorization.
- Request validation.
- Message transformation.
- API versioning.
- Throttling.
- Caching metadata.
- Logging.
- Observability.
- Audit.
- Route registry metadata.
- Connector routing.
- Event routing.

## Current Repository Baseline

Current Gateway capabilities:

- `GET /gateway/health`.
- `GET /gateway/routes`.
- `GET /gateway/modules`.
- Route registry metadata with `apiVersion: "v1"`.
- Tenant awareness metadata.
- Correlation ID requirement metadata.
- Tracing enabled metadata.
- Rate limit policy metadata.
- API key creation, listing, and revocation.
- Runtime persistence and backup coverage.

Current limitations:

- The gateway does not yet act as a full proxy for all internal route traffic.
- Public routes are not globally exposed under `/api/v1/*`.
- Contract registry and documentation generation are not centralized.
- GraphQL, WebSocket, event streaming, and gRPC runtimes are not implemented.

## Gateway Flow

```text
External Request
  -> API Gateway
  -> IAM Authentication
  -> Authorization
  -> Request Validation
  -> Rate Limiting
  -> Version Resolution
  -> Routing
  -> Connector or Internal Service
  -> Response Normalization
  -> Observability and Audit
```

## Gateway Rules

- All protected traffic must use server-derived identity.
- Client-provided user IDs, roles, organization IDs, and tenant metadata must
  not be trusted.
- Gateway routing must not bypass IAM, Need-to-Know, or module permissions.
- Gateway responses must not leak secrets, stack traces, provider payloads, or
  restricted tenant data.
- Route registry metadata must align with real controller contracts before
  stable public exposure.
- Gateway must emit observability metadata for latency, errors, timeouts, and
  rate-limit outcomes.

## Future Capabilities

Future gateway phases should add:

- Contract registry.
- Versioned public routing.
- Request and response schema validation.
- Idempotency key enforcement.
- Distributed rate limiting.
- Circuit breaker metadata.
- API documentation publishing.
- Developer/consumer portal metadata.
- Gateway-level integration metrics.
