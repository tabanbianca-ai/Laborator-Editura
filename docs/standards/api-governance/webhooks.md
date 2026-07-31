# Webhook Standard

## Purpose

This document defines the canonical webhook rules for Laborator Editura.

Webhooks are HTTP-based event delivery contracts. They may be outbound,
inbound, or bidirectional only when explicitly approved.

## Webhook Contract Fields

Every webhook contract must define:

- Webhook ID.
- Event name.
- Event version.
- Target URL.
- Secret reference.
- Enabled flag.
- Retry policy.
- Timeout.
- Signature algorithm.
- Delivery log policy.
- Owner.
- Tenant scope.
- Data classification.
- Observability requirements.
- Audit requirements.

## Payload Envelope

Webhook deliveries should use the canonical event envelope:

```json
{
  "eventId": "evt_01H...",
  "eventName": "PublicationReleased",
  "eventVersion": "1.0.0",
  "eventType": "webhook",
  "source": "public-portal",
  "timestamp": "2026-07-31T00:00:00.000Z",
  "correlationId": "corr_01H...",
  "payload": {},
  "metadata": {}
}
```

## Security

Webhook security must include:

- HTTPS target URL in deployed environments.
- Secret stored through approved secret handling.
- Signature header.
- Timestamp header to reduce replay risk.
- Idempotency key.
- Source verification for inbound webhooks.
- Tenant and scope validation.
- Safe error handling.

Secrets must never be logged.

## Retry Policy

Webhook retry policy must define:

- Retryable status codes.
- Maximum attempts.
- Backoff strategy.
- Timeout per attempt.
- Dead-letter or failure record policy.
- Manual replay policy.

Retries must be idempotent.

## Delivery Logs

Webhook delivery logs must preserve:

- Delivery ID.
- Webhook ID.
- Event ID.
- Attempt number.
- Target URL host or safe reference.
- Status.
- HTTP status code.
- Started at.
- Completed at.
- Duration.
- Error class when applicable.
- Correlation ID.

Logs must not contain secrets or restricted payload content.

## Audit

Audit must record:

- Webhook created.
- Webhook enabled.
- Webhook disabled.
- Webhook secret rotated.
- Webhook delivery failed after retries.
- Webhook replay requested.
- Webhook contract version changed.

## Current Baseline

Current webhook documentation exists in `docs/integration/webhooks.md`.
Runtime metadata foundations exist for webhook records and webhook delivery
logs. Full runtime dispatch and inbound verification require a separately
approved implementation phase.

