# Adapter Registry

## Purpose

The adapter registry defines how external providers are represented, governed,
and connected without coupling business modules to provider-specific code.

## Current Provider Registry Baseline

Gateway currently supports metadata for:

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

AI Governance currently models:

- OpenAI as primary AI provider metadata.
- Anthropic as fallback AI provider metadata.

The current runtime does not implement real external provider SDK execution for
these providers.

## Adapter Record

Each adapter registration must include:

- `adapterId`.
- `providerType`.
- `displayName`.
- `version`.
- `owner`.
- `status`.
- `supportedCapabilities`.
- `requiredScopes`.
- `configurationSchema`.
- `secretReferences`.
- `healthCheckPolicy`.
- `timeoutPolicy`.
- `retryPolicy`.
- `rateLimitPolicy`.
- `dataClassificationPolicy`.
- `observabilityPolicy`.
- `auditPolicy`.
- `migrationPolicy`.

## Adapter Statuses

Required statuses:

- `DRAFT`.
- `NOT_CONFIGURED`.
- `CONFIGURED`.
- `ACTIVE`.
- `DEGRADED`.
- `DISABLED`.
- `OUTAGE`.
- `ARCHIVED`.

Status changes must be audited.

## Adapter Contract

Every adapter must expose the same architectural contract:

```text
identity()
supportedCapabilities()
validateConfig(config)
healthCheck(config)
normalizeRequest(request)
execute(normalizedRequest)
normalizeResponse(providerResponse)
normalizeError(providerError)
estimateCost(normalizedRequest)
```

Adapters may contain provider-specific implementation details. Business
modules may not.

## Configuration Rules

Adapter configuration must:

- Be tenant-aware when configuration varies by organization.
- Store secrets through approved secret management.
- Never log secrets.
- Support disabled and outage states.
- Support fallback where applicable.
- Support audit and observability.
- Preserve privacy and data-use metadata.

## Approved Adapter Categories

Initial adapter categories:

- AI provider adapters.
- Storage adapters.
- Payment adapters.
- Email adapters.
- Calendar adapters.
- Identity provider adapters.
- Media generation adapters.
- Import/export adapters.
- Webhook adapters.

## Provider Independence Rule

No platform module may require direct knowledge of:

- Provider SDKs.
- Provider-specific model names.
- Provider-specific request bodies.
- Provider-specific response bodies.
- Provider-specific error shapes.
- Provider-specific secret formats.

Provider-specific details are restricted to adapters and approved integration
configuration.
