# Integration Architecture

## Purpose

This document defines the target integration architecture and compares it with
the current repository baseline.

It supports `docs/ARCHITECTURE_CHAPTER_10.md` and must be used before any
new external integration, provider adapter, public API, webhook, or event bus
implementation.

## Target Architecture

All external integrations pass through the Integration Layer:

```text
External System
  -> Integration Gateway
  -> Validation
  -> Authentication
  -> Authorization
  -> Integration Adapter
  -> Business Module
  -> Audit + Observability
```

Business modules must depend on platform contracts and capabilities, not on
external providers, SDKs, vendor payloads, or vendor-specific errors.

## Current Baseline

The repository already includes these integration foundations:

- Gateway route registry metadata.
- Gateway API keys with scopes, expiration, revocation, secret hashing, and
  audit.
- Integration provider registry metadata for Google Drive, Dropbox, OneDrive,
  OpenAI, Anthropic, DeepL, ElevenLabs, Stripe, PayPal, Amazon S3, MinIO, and
  custom providers.
- Webhook metadata with hashed secrets, enabled state, retry policy, delivery
  logs, and audit.
- AI Governance provider metadata for OpenAI as primary provider and Anthropic
  as fallback provider.
- Observability metadata for health, metrics, logs, traces, and agent
  executions.
- Security Governance metadata for API key and webhook policies.
- Backup and restore coverage for integration provider, webhook, delivery log,
  gateway audit, and integration audit tables.

## Current External Provider Status

Most external providers are metadata-only or placeholder-only in the current
runtime. This is acceptable for the current architecture stage.

Known metadata-only provider areas:

- AI providers.
- Payment providers.
- Storage providers.
- Media generation providers.
- Calendar providers.
- External identity providers.
- External observability providers.
- Cloud backup providers.

## Dependency Map

| Area | Current Owner | Current Dependency Pattern | Target Pattern |
| --- | --- | --- | --- |
| API keys | Gateway | Runtime metadata, hashed secrets, audit | Gateway plus policy decision service |
| Integration providers | Gateway | Metadata registry only | Provider adapters registered through Integration Layer |
| Webhooks | Gateway | Metadata, retry policy, delivery logs | Signed webhook dispatch and inbound verification |
| AI providers | AI Governance | Provider status metadata and fallback metadata | AI Orchestrator -> provider adapter |
| External storage | Backup, Public Portal, Export | Metadata placeholders | Storage adapter |
| Payments | Commerce, Public Portal | Metadata placeholders | Payment adapter |
| Media providers | Multimedia, Media Localization | Placeholder status fields | Media adapter |
| Calendar | Scheduling | Internal metadata only | Calendar adapter |
| Public APIs | Module controllers | Controller namespaces without global URL versioning | Versioned API contract registry |
| Events | Workflow docs and module audit events | Mostly documented or audit-local | Versioned event catalog |

## Integration Ownership

Gateway owns:

- Route registry metadata.
- API keys.
- Integration provider registration.
- Webhook configuration.
- Gateway and integration audit.

Business modules own:

- Domain rules.
- Domain state.
- Domain validation.
- Domain-specific events.

Adapters own:

- Provider-specific authentication details.
- Provider-specific request/response conversion.
- Provider-specific errors.
- Provider-specific retries and fallback metadata.

## Prohibited Patterns

- Direct external SDK use inside business modules.
- Provider-specific request bodies in domain services.
- Provider secrets in source code, logs, traces, client bundles, JSON Master,
  or export artifacts.
- Module-specific authentication or authorization.
- Unversioned public API exposure.
- Webhook delivery without signature verification and delivery logging.

## Required Alignment

Future implementation must converge toward:

- Contract-first public and internal APIs.
- Dedicated adapters for every external provider.
- Versioned event and webhook schemas.
- Centralized integration security.
- Observability for every integration attempt.
- Audit for every integration configuration, activation, delivery, and
  state-changing result.
