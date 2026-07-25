# Integration Migration Plan

## Purpose

This document defines the incremental path from the current integration
metadata foundation to the full Chapter 10 Integration and Interoperability
Architecture.

## Constraints

- Preserve validated Phase 7 Step 16 behavior.
- Do not connect real external providers before adapter, security, contract,
  and observability baselines are approved.
- Do not introduce direct provider SDK calls inside business modules.
- Do not store secrets in source code, logs, traces, client bundles, export
  artifacts, or JSON Master.
- Do not change Docker, API contracts, database schema, or UI in this
  documentation phase.
- Chapter 9 security and IAM rules remain mandatory.

## Phase 0 - Documentation Baseline

Status: Current.

Deliverables:

- `docs/ARCHITECTURE_CHAPTER_10.md`.
- `docs/integration/integration-architecture.md`.
- `docs/integration/api-contracts.md`.
- `docs/integration/adapter-registry.md`.
- `docs/integration/event-catalog.md`.
- `docs/integration/webhooks.md`.
- `docs/integration/integration-security.md`.
- `docs/integration/integration-gap-analysis.md`.
- `docs/integration/integration-migration-plan.md`.

Outcome:

- Official Integration and Interoperability architecture exists.

## Phase 1 - Integration Contract Registry

Define canonical contracts for:

- Public APIs.
- Internal module APIs.
- Provider adapters.
- Webhooks.
- Events.
- Import/export operations.

No runtime provider activation occurs in this phase.

## Phase 2 - Adapter Interface

Introduce a shared adapter interface for:

- Identity.
- Capabilities.
- Configuration validation.
- Health checks.
- Request normalization.
- Execution.
- Response normalization.
- Error normalization.
- Cost estimation.
- Observability.

Existing provider metadata remains unchanged until adapters are tested.

## Phase 3 - API Versioning Alignment

Define:

- Public route versioning pattern.
- Compatibility window.
- Deprecation policy.
- Contract test pattern.
- Documentation generation approach.

Existing routes remain compatible until versioned routes are explicitly
scheduled.

## Phase 4 - Event Schema Catalog

Create versioned schemas for:

- Workflow events.
- Publishing events.
- Translation events.
- Media events.
- Integration events.
- Security events.
- AI events.

Events must reference audit records when they represent state-changing actions.

## Phase 5 - Webhook Runtime

Add webhook execution only after event schemas and security policy are ready.

Required capabilities:

- Signed outbound webhooks.
- Inbound signature verification.
- Replay protection.
- Idempotency.
- Retry policy.
- Delivery logs.
- Observability.
- Audit.

## Phase 6 - Secret Management Maturity

Before real provider activation:

- Confirm approved secret storage.
- Support rotation.
- Support revocation.
- Ensure no secrets are logged.
- Ensure backup/export does not leak secrets.

## Phase 7 - Provider Adapter Activation

Activate providers incrementally by category:

1. AI provider adapters.
2. SMTP adapter.
3. Storage adapters.
4. Calendar adapters.
5. Identity provider adapters.
6. Payment adapters.
7. Media provider adapters.

Each adapter must have contract tests, security tests, observability, audit,
and rollback documentation.

## Phase 8 - Integration Observability

Add integration-specific visibility:

- Availability.
- Latency.
- Error rate.
- Retry count.
- Timeout count.
- Fallback activation.
- Circuit breaker state.
- Cost when applicable.

## Phase 9 - Full Interoperability Validation

Validation must include:

- Adapter contract tests.
- Public API contract tests.
- Internal API contract tests.
- Webhook signature tests.
- Event schema compatibility tests.
- Tenant and workspace isolation tests.
- Secret handling tests.
- Observability tests.
- Audit tests.
- Backup/restore tests.
- End-to-end editorial pipeline smoke test.

## Acceptance Criteria

Migration is complete when:

- Integration Gateway is the only external communication boundary.
- All external providers use adapters.
- Public APIs are versioned and documented.
- Internal APIs preserve module boundaries.
- Events are versioned and documented.
- Webhooks are signed, retryable, observable, and audited.
- Secrets are securely managed.
- Integration metrics and traces are available.
- Business modules do not depend directly on external providers.
- Phase 7 Step 16 behavior remains intact.
