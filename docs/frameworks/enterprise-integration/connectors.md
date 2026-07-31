# External Connectors

## Purpose

External Connectors define controlled integration points with external
systems, providers, storage, AI providers, payment providers, media providers,
calendar systems, and custom integrations.

## Connector Registry Rule

Every external connector must be registered before it is enabled.

Business modules must not call external provider SDKs directly.

## Required Connector Record

Each connector must include:

- UUID.
- System.
- Provider name.
- Protocol.
- Authentication method.
- Synchronization mode.
- Supported operations.
- Owner.
- Monitoring policy.
- Security policy.
- Data classification.
- Rate limits.
- Retry policy.
- Status.
- Enabled by.
- Enabled at.
- Updated by.
- Updated at.
- Audit metadata.

## Supported Connector Categories

Connector categories include:

- Cloud storage.
- AI providers.
- Translation providers.
- Media providers.
- Payment providers.
- Email providers.
- Calendar providers.
- Identity providers.
- Observability providers.
- Backup providers.
- Custom providers.

## Current Registry Baseline

Current integration provider metadata supports:

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

Most providers remain metadata-only or placeholder-only until explicit
runtime integration is approved.

## Authentication Methods

Supported authentication methods may include:

- API key.
- OAuth.
- Basic authentication where allowed.
- Signed request.
- Mutual TLS.
- Service account.
- Custom token.

Secrets must be stored through approved secret management and must not be
logged, committed, embedded in images, or exposed to frontend code.

## Synchronization Modes

Supported modes:

- Manual.
- Scheduled.
- Event-driven.
- Real-time.
- Batch.
- Pull.
- Push.

## Connector Statuses

Statuses:

- `NOT_CONFIGURED`.
- `CONFIGURED`.
- `ACTIVE`.
- `DISABLED`.
- `DEGRADED`.
- `OUTAGE`.
- `ARCHIVED`.

Status changes must be audited.

## Current Baseline Assessment

Strengths:

- Gateway has integration provider registry metadata.
- Webhooks have metadata and delivery logs.
- AI Governance tracks provider status and fallback metadata.
- Security Governance tracks API key and webhook policy metadata.

Gaps:

- Provider adapters are not implemented.
- Secret vault integration is metadata-only.
- Connector health checks are not complete.
- Connector lifecycle dashboard is not fully implemented.

## Standardization Plan

1. Preserve provider metadata registry as the current baseline.
2. Define adapter contract per connector category.
3. Link connector status to observability.
4. Link connector secrets to secret management.
5. Add connector approval workflow before runtime enablement.
6. Implement actual adapters only in approved phases.
