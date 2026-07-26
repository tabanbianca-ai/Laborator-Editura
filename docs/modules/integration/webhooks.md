# Integration Webhooks

## Purpose

Webhooks allow Laborator Editura to send or receive versioned integration
events in a secure, retryable, auditable, and observable way.

This document complements `docs/integration/webhooks.md` and defines webhook
rules inside the Phase II Integration module.

## Current Repository Baseline

The Gateway module currently models:

- Webhook event name.
- Target URL.
- Hashed secret.
- Enabled flag.
- Retry policy.
- Delivery logs.
- Human final authority.
- AI suggested metadata.
- Gateway audit events.

Runtime persistence includes:

- `webhooks`.
- `webhook_delivery_logs`.
- `gateway_audit_events`.

## Outbound Webhooks

Outbound webhooks must:

- Use HTTPS targets.
- Sign payloads with HMAC or an approved signing scheme.
- Include event name and event version.
- Include correlation ID.
- Include idempotency key when retryable.
- Respect retry policy.
- Record delivery attempts.
- Avoid secrets and restricted content in payloads.
- Emit observability data.

## Inbound Webhooks

Inbound webhooks must:

- Verify signature before processing.
- Validate event contract.
- Enforce idempotency.
- Enforce tenant and integration scope.
- Reject unknown or disabled providers.
- Return safe errors.
- Audit state-changing actions.

## Retry and Dead Letter

Retry policy must define:

- Maximum attempts.
- Backoff strategy.
- Retryable status codes.
- Non-retryable status codes.
- Timeout.
- Dead-letter handling.
- Alert thresholds.

## Current Gaps

- Runtime outbound webhook dispatch is not implemented.
- Runtime inbound webhook verification is not implemented.
- HMAC payload signature format is not standardized.
- Replay protection is not implemented.
- Dead Letter Queue runtime is not implemented.
- Event replay is not implemented.

## Rules

- Webhooks must not become direct module-to-provider integration shortcuts.
- Webhook configuration changes require authorized human action.
- AI cannot create active webhook secrets or enable webhooks automatically.
- Webhook delivery logs must be retained and auditable.
