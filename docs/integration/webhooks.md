# Webhooks

## Purpose

This document defines webhook architecture for sending and receiving
integration events.

## Current Baseline

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

Webhook storage is tenant-aware through `organizationId`, and backup/restore
includes webhook records and delivery logs.

## Outbound Webhooks

Outbound webhooks must:

- Use HTTPS targets.
- Sign payloads.
- Include event name and version.
- Include correlation ID.
- Include idempotency key when retryable.
- Respect retry policy.
- Record delivery attempts.
- Avoid leaking secrets or restricted content.

## Inbound Webhooks

Inbound webhooks must:

- Verify signature before processing.
- Validate event contract.
- Enforce idempotency.
- Enforce tenant and integration scope.
- Reject unknown or disabled providers.
- Use safe error responses.
- Audit state-changing actions.

## Signature Requirements

Webhook signatures must include:

- Signature algorithm.
- Timestamp.
- Payload hash.
- Secret reference.
- Replay protection window.

Secrets must be hashed or encrypted through approved secret management.

## Retry Policy

Retry policies must define:

- Maximum attempts.
- Backoff strategy.
- Retryable status codes.
- Non-retryable status codes.
- Dead-letter handling.
- Alert threshold.

## Delivery Log

Each delivery attempt should preserve:

- Delivery ID.
- Webhook ID.
- Event name.
- Event version.
- Attempt number.
- Status.
- Response status.
- Error message when safe.
- Correlation ID.
- Created timestamp.

## Current Gaps

- Runtime webhook dispatch is not yet implemented.
- Inbound webhook verification is not yet implemented.
- Signature format and replay protection are not yet standardized.
- Event payload versioning is not yet wired to webhook delivery.

These gaps must be closed incrementally without changing existing Gateway API
contracts unless a versioned contract change is explicitly approved.
