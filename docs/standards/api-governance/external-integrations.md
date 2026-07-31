# External Integrations Standard

## Purpose

This document defines the canonical rules for external provider integrations,
connectors, partner APIs, AI providers, storage providers, payment providers,
and custom providers.

## Required Provider Metadata

Every external integration must define:

- Provider name.
- Provider category.
- Endpoint or base URL.
- Authentication model.
- Required scopes.
- Rate limits.
- Retry policy.
- Timeout.
- Monitoring requirements.
- SLA or SLO where available.
- Data classification.
- Tenant scope.
- Secret references.
- Owner.
- Status.
- Contract version.
- Audit requirements.

## Provider Status

Canonical provider statuses:

- `NOT_CONFIGURED`.
- `CONFIGURED`.
- `DISABLED`.

Implementation-specific registries may use additional lifecycle states only if
they map to these canonical statuses or have an approved exception.

## Supported Provider Families

The platform may maintain metadata for:

- Google Drive.
- Dropbox.
- OneDrive.
- OpenAI.
- Anthropic.
- DeepL.
- ElevenLabs.
- Stripe.
- PayPal.
- Amazon S3.
- MinIO.
- Custom providers.

Provider metadata does not imply that runtime integration is active.

## Authentication and Secrets

Integrations must:

- Store secrets through approved secret handling.
- Never log secrets.
- Use least-privilege scopes.
- Support rotation metadata.
- Support disable or revoke actions where applicable.
- Preserve audit for configuration changes.

## Retry, Timeout, and Circuit Control

External calls must define:

- Timeout.
- Retryable errors.
- Maximum retry attempts.
- Backoff strategy.
- Fallback behavior where approved.
- Circuit breaker or disable policy where runtime support exists.
- Safe failure mode.

## AI Integrations

AI integrations must use the platform AI orchestration and governance layers.
Functional modules must not call external AI providers directly.

AI provider metadata must preserve:

- Provider.
- Model.
- Capability.
- Cost metadata.
- Token usage metadata where available.
- Policy checks.
- Human approval gates where required.
- Audit references.

## Observability

External calls must record:

- Request ID.
- Correlation ID.
- Provider.
- Operation.
- Duration.
- Status.
- Retry count.
- Error class.
- Cost metadata when applicable.

Provider payloads must be filtered before logging.

## Audit

Audit must record:

- Integration created.
- Integration enabled.
- Integration disabled.
- Provider changed.
- Secret reference changed.
- Scope changed.
- External call failure when governance-relevant.
- Approved exception.

## Current Baseline

Runtime metadata foundations exist for integration providers, API keys,
webhooks, gateway route registry, and audit events. Most external provider
connectors remain metadata-only or placeholder-only until approved provider
implementation phases.

