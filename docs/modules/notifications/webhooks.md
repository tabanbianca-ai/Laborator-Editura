# Notification Webhook Dispatch

## Purpose

Webhook Dispatch sends selected platform events to configured external systems
through signed, retryable, auditable HTTP deliveries.

This document complements `docs/integration/webhooks.md`.

## Ownership Boundary

Current Gateway ownership:

- Webhook registration.
- Target URL.
- Secret hash.
- Enabled flag.
- Retry policy metadata.
- Delivery logs.
- Gateway audit events.

Future Notification ownership:

- Event-to-webhook notification routing.
- Payload rendering.
- Queueing.
- Dispatch orchestration.
- Retry and dead letter handling.
- Delivery status normalization.

Gateway may remain the security and registry owner while Notification Engine
owns dispatch orchestration.

## Dispatch Requirements

Outbound webhook delivery must:

- Use HTTPS targets.
- Sign payloads with HMAC.
- Include event name.
- Include event version.
- Include tenant-safe correlation ID.
- Include idempotency key.
- Respect retry policy.
- Enforce timeout.
- Record delivery attempts.
- Avoid leaking secrets.
- Avoid sending restricted content unless explicitly authorized.

## Payload Rules

Webhook payloads must be:

- Versioned.
- Documented.
- Tenant-scoped.
- Minimal.
- Need-to-Know safe.
- Replay-protected.
- Traceable by correlation ID.

## Supported Events

Webhook dispatch may be used for:

- Workflow events.
- Publishing events.
- Export events.
- Rights events.
- Task events.
- Approval events.
- Distribution events.
- Security and compliance events when policy allows.

## Current Repository Baseline

Existing implementation:

- `POST /webhooks`.
- `GET /webhooks`.
- `POST /webhooks/:id/enable`.
- `POST /webhooks/:id/disable`.
- Webhook delivery log repository support.
- Runtime backup support for `webhooks` and `webhook_delivery_logs`.
- Documentation in `docs/integration/webhooks.md`.

Current gaps:

- Runtime webhook dispatch is not implemented.
- Notification routing to webhooks is not implemented.
- HMAC signature format is documented conceptually but not standardized as a
  runtime contract.
- Dead letter queue is not implemented.
- Provider timeout and backoff execution are not implemented.

## Audit Requirements

Audit must record:

- Webhook selected for event.
- Payload rendered.
- Signature generated.
- Delivery queued.
- Delivery attempt.
- Delivery success.
- Delivery failure.
- Retry scheduled.
- Dead lettered.
