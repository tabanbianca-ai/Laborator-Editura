# Enterprise Integration Migration Plan

## Purpose

This plan defines how Laborator Editura should converge from the current
Gateway and integration metadata baseline toward full Framework 06 compliance.

## Migration Principles

- Preserve validated APIs.
- Avoid breaking API contracts.
- Do not introduce provider coupling.
- Use additive phases.
- Keep integrations contract-first.
- Keep external connectors disabled until approved.
- Preserve tenant isolation.
- Preserve audit and observability.
- Preserve data governance and lineage.

## Phase 0 - Framework Baseline

Status: Complete when Framework 06 documents are present.

Deliverables:

- `docs/frameworks/enterprise-integration/overview.md`.
- `docs/frameworks/enterprise-integration/api-governance.md`.
- `docs/frameworks/enterprise-integration/event-governance.md`.
- `docs/frameworks/enterprise-integration/messaging.md`.
- `docs/frameworks/enterprise-integration/connectors.md`.
- `docs/frameworks/enterprise-integration/interoperability.md`.
- `docs/frameworks/enterprise-integration/monitoring.md`.
- `docs/frameworks/enterprise-integration/compliance-audit.md`.
- `docs/frameworks/enterprise-integration/migration-plan.md`.

## Phase 1 - Integration Inventory

Goal:

- Inventory all integration assets.

Actions:

- Inventory API controller namespaces.
- Inventory gateway route metadata.
- Inventory API key metadata.
- Inventory integration providers.
- Inventory webhooks.
- Inventory webhook delivery logs.
- Inventory documented events.
- Inventory file exchange formats.
- Inventory synchronization placeholders.

Validation:

- Every integration asset has an owner candidate and status.

## Phase 2 - API Contract Registry

Goal:

- Standardize stable API contracts.

Actions:

- Classify API audiences.
- Define contract ids.
- Add OpenAPI specifications incrementally.
- Link contracts to route registry.
- Define deprecation policy.
- Define idempotency policy for retryable writes.

Validation:

- Stable APIs have owner, version, authentication, authorization, schemas,
  errors, rate limits, audit, and observability expectations.

## Phase 3 - Event Catalog and Schema Registry

Goal:

- Make events versioned and consumable.

Actions:

- Map event families to owner modules.
- Define event schemas.
- Define event versions.
- Define producer and consumer registry.
- Define retention and retry policy.

Validation:

- No cross-module event is undocumented.

## Phase 4 - Messaging Readiness

Goal:

- Prepare for asynchronous messaging without premature broker selection.

Actions:

- Define message envelope.
- Define retry policy.
- Define dead-letter policy.
- Identify async workflow candidates.
- Define broker selection criteria.

Validation:

- Messaging can be implemented later without changing domain contracts.

## Phase 5 - Connector Standardization

Goal:

- Standardize external connector lifecycle.

Actions:

- Align provider metadata with connector registry requirements.
- Define adapter contracts.
- Define connector health checks.
- Link connector secrets to secret management.
- Define activation approval workflow.

Validation:

- No connector can become active without registry metadata, security, audit,
  monitoring, and approval.

## Phase 6 - Webhook Runtime Readiness

Goal:

- Prepare webhook dispatch and inbound verification.

Actions:

- Define signature format.
- Define replay protection.
- Define delivery retry policy.
- Define inbound idempotency policy.
- Link event versions to webhook payloads.

Validation:

- Webhook runtime implementation can be added without breaking existing
  metadata APIs.

## Phase 7 - Interoperability and Synchronization

Goal:

- Standardize data and file exchange.

Actions:

- Define transformation contracts.
- Link mappings to canonical data models.
- Define file validation policy.
- Define sync conflict policy.
- Define lineage requirements.

Validation:

- External exchanges preserve provenance, schema version, quality, and audit.

## Phase 8 - Monitoring and Compliance Reporting

Goal:

- Make Framework 06 compliance visible.

Actions:

- Report API contract coverage.
- Report event contract coverage.
- Report connector health.
- Report webhook health.
- Report synchronization status.
- Report contract violations.
- Report integration exceptions.

Validation:

- Release readiness includes Framework 06 status.

## Non-Goals

This plan does not authorize:

- New API routes.
- Breaking API changes.
- Message broker implementation.
- Event bus runtime.
- Webhook dispatch runtime.
- Inbound webhook runtime.
- External provider SDK adapters.
- Database migrations.
- Docker or staging changes.

Implementation must be explicitly approved in future phases.
