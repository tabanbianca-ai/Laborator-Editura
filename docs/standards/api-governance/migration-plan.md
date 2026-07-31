# Canonical API, Event and Integration Migration Plan

## Purpose

This migration plan defines the safe path for aligning all APIs, events,
webhooks, external integrations, and service contracts with Standard 03.

It is incremental and compatibility-first. It does not authorize breaking API
changes, database migrations, Docker changes, UI changes, runtime event bus
implementation, or provider SDK integration by itself.

## Phase 1 - Activate the Standard

Deliverables:

- Reference Standard 03 from `SPEC.md`.
- Reference Standard 03 from `ROADMAP.md`.
- Add Standard 03 directive to `AGENTS.md`.
- Add Standard 03 to the Manifest and Codex catalog.
- Preserve existing route and event behavior.

Acceptance criteria:

- Standard 03 is discoverable as the canonical interface standard.
- Existing API and event documents remain valid as local catalogs.
- No runtime changes are introduced.

## Phase 2 - API Inventory and Ownership Map

Deliverables:

- Inventory every controller route.
- Classify each route as internal, public, partner, admin, webhook, AI, or
  health.
- Assign owner module.
- Record authentication and authorization requirements.
- Record tenant and Need-to-Know scope.
- Record response envelope status.
- Record audit and observability effects.

Acceptance criteria:

- Every API surface has an owner.
- Every stable route has a version target.
- Public and partner APIs have a migration path to `/api/v1` where needed.

## Phase 3 - Contract Registry and OpenAPI Baseline

Deliverables:

- Create machine-readable contract registry design.
- Add OpenAPI documentation for stable public and partner APIs first.
- Add contract lifecycle metadata.
- Add compatibility matrix for externally consumed contracts.
- Add deprecation metadata.

Acceptance criteria:

- Stable public contracts can be validated independently.
- Breaking changes are blocked without compatibility review.

## Phase 4 - Event Registry

Deliverables:

- Map current event catalogs to Standard 03 event envelope fields.
- Assign owner, producer, consumer, version, payload schema, retention policy,
  retry policy, and audit relationship for each event family.
- Document naming compatibility between current dot notation and canonical
  event registry names.

Acceptance criteria:

- Event contracts are versioned and owned.
- Event payload changes have schema evolution rules.
- A future runtime event bus can be implemented without redesigning event
  semantics.

## Phase 5 - Webhook and External Connector Alignment

Deliverables:

- Map webhook metadata to the webhook standard.
- Map provider metadata to the external integrations standard.
- Define signature, timeout, retry, idempotency, and delivery log contracts.
- Document provider status and secret reference policies.

Acceptance criteria:

- Webhooks and providers have governed metadata.
- Secrets are never logged.
- Retry and failure handling are documented before runtime expansion.

## Phase 6 - Observability and Audit Coverage

Deliverables:

- Validate request ID and correlation ID coverage.
- Validate trace ID readiness.
- Validate structured logs.
- Validate metrics.
- Validate audit for state-changing routes, webhook changes, provider changes,
  contract changes, version changes, and approved exceptions.

Acceptance criteria:

- Every integration path can be traced and audited.
- Observability and audit remain separate but linked.

## Phase 7 - Continuous Compliance

Deliverables:

- Add repository checks for missing API contract docs.
- Add checks for missing event contract docs.
- Add checks for unversioned stable public contracts.
- Add release review checklist for API, event, webhook, and integration
  changes.

Acceptance criteria:

- New integration interfaces cannot bypass Standard 03.
- Exceptions require explicit architecture approval.
- Documentation remains the source of truth for contracts until runtime
  registries are implemented.

## Non-Goals

This plan does not implement:

- Runtime API gateway replacement.
- Runtime event bus.
- Runtime message broker.
- Webhook dispatch engine.
- Provider SDK adapters.
- External provider connections.
- API breaking changes.
- Database schema changes.
- Docker or staging changes.

