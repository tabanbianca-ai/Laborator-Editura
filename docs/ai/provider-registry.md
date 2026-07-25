# AI Provider Registry

## Purpose

The provider registry defines how external AI providers are represented,
enabled, disabled, observed, and routed without coupling platform modules to a
specific provider.

## Approved Provider Categories

The architecture supports:

- OpenAI.
- Google AI.
- Anthropic.
- ElevenLabs.
- Azure AI.
- Ollama.
- Local providers.
- Future providers.

Current implementation baseline:

- AI Governance models OpenAI as primary provider metadata.
- AI Governance models Anthropic as fallback provider metadata.
- Gateway integration metadata supports external provider registration.
- No real provider SDK adapter is currently implemented.

## Provider Registry Record

A provider registry record should include:

- `providerId`.
- `name`.
- `displayName`.
- `status`.
- `adapterName`.
- `providerRole`.
- `supportedCapabilities`.
- `supportedModels`.
- `defaultModel`.
- `priority`.
- `fallbackPriority`.
- `fallbackToProvider`.
- `modelSelectionMode`.
- `costProfile`.
- `privacyProfile`.
- `dataResidency`.
- `retentionPolicy`.
- `rateLimitProfile`.
- `timeoutProfile`.
- `enabledBy`.
- `enabledAt`.
- `updatedBy`.
- `updatedAt`.
- `auditMetadata`.

## Provider Statuses

Provider statuses must be explicit.

Required statuses:

- `NOT_CONFIGURED`.
- `CONFIGURED`.
- `ACTIVE`.
- `DISABLED`.
- `DEGRADED`.
- `OUTAGE`.

Status changes must be audited.

## Provider Adapter Contract

Every provider adapter must expose the same public contract:

```text
healthCheck(providerConfig)
supportsCapability(capabilityId)
estimateCost(normalizedRequest)
execute(normalizedRequest)
normalizeResponse(providerResponse)
normalizeError(providerError)
```

Adapters may contain provider-specific implementation details. Functional
modules must not.

## Provider Configuration Rules

Provider configuration must:

- Be tenant-aware when configuration varies by organization.
- Keep secrets outside functional modules.
- Never log secrets.
- Support disabled and outage states.
- Support fallback routing.
- Support audit and observability.
- Record privacy and data-use metadata.

## Fallback Policy

Default v1.0 policy:

- OpenAI is the primary provider.
- Anthropic is the fallback provider.
- Fallback may activate on timeout, provider outage, service unavailability,
  API error, or configured outage.
- Recovery to the primary provider may occur after health is restored.

Every fallback activation and recovery must be audited.

## Provider Independence Rule

No platform module may require direct knowledge of:

- Provider SDKs.
- Provider-specific model identifiers.
- Provider-specific request bodies.
- Provider-specific response bodies.
- Provider-specific error shapes.

Provider-specific details are restricted to adapters and orchestration
configuration.
