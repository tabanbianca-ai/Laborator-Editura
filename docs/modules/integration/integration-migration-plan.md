# Integration Migration Plan

## Purpose

This document defines the incremental path from the current repository
baseline to the official Integration, API Gateway and External Connectors
Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Library, Rights, Workflow, IAM,
Observability, Backup, Search, Notification, AI Orchestration, Security
Governance, Policy Engine, audit, and infrastructure behavior.

## Constraints

- Do not connect real external providers before adapter, security, contract,
  secret management, and observability baselines are approved.
- Do not introduce direct provider SDK calls inside business modules.
- Do not store secrets in source code, logs, traces, client bundles, export
  artifacts, JSON Master, or search indexes.
- Do not break current `/gateway`, `/integrations`, or `/webhooks` APIs.
- Do not bypass IAM or server-derived request context.
- Do not let AI enable providers, create active secrets, expand scopes, or
  execute production-impacting integration actions automatically.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory API endpoints, gateway metadata, connector metadata, webhook
  metadata, authentication mechanisms, versioning strategies, rate limiting,
  events, audit, and integration contracts.
- Document gaps, risks, and migration dependencies.

## Phase 2 - API Definition Registry

Define canonical contracts:

- `ApiDefinition`.
- `GatewayRoute`.
- `ApiConsumer`.
- `ApiKey`.
- `Connector`.
- `WebhookSubscription`.
- `WebhookDelivery`.
- `RateLimitPolicy`.
- `IntegrationAuditEvent`.

No runtime provider activation occurs in this phase.

## Phase 3 - Versioning Alignment

Define:

- Stable `/api/v1/*` public namespace.
- Header versioning support where needed.
- Semantic versioning policy.
- Compatibility windows.
- Deprecation metadata.
- Contract tests for public APIs.

Existing routes remain compatible until versioned migrations are scheduled.

## Phase 4 - Connector Adapter Interface

Introduce provider adapter contracts:

- Capabilities.
- Configuration validation.
- Health check.
- Request normalization.
- Execution.
- Response normalization.
- Error normalization.
- Retry classification.
- Cost estimate.
- Observability metadata.

## Phase 5 - Secret and OAuth Maturity

Before real providers:

- Integrate approved Secret Vault storage.
- Define rotation and revocation.
- Define OAuth redirect and scope policy.
- Prevent secrets in backups, logs, traces, exports, and search indexes.

## Phase 6 - Webhook Runtime

Implement:

- Signed outbound delivery.
- Inbound signature verification.
- Replay protection.
- Idempotency.
- Retry policy.
- Dead-letter handling.
- Event replay.
- Delivery observability.
- Delivery audit.

## Phase 7 - Rate Limit Policy Runtime

Add:

- Tenant policies.
- Consumer policies.
- Connector policies.
- Endpoint policies.
- Burst limits.
- Concurrent request limits.
- Distributed storage.
- Rate-limit observability.

## Phase 8 - Event Gateway

Implement:

- Versioned event ingress.
- Versioned event egress.
- Event routing.
- Event contract validation.
- Dead-letter handling.
- Replay policy.

## Phase 9 - Provider Adapter Activation

Activate providers incrementally:

1. AI providers.
2. Notification providers.
3. Storage providers.
4. Translation providers.
5. Voice/audio providers.
6. OCR providers.
7. Productivity providers.
8. Publishing providers.

Each adapter requires contract tests, security tests, observability, audit,
backup/restore validation, and rollback documentation.

## Phase 10 - Gateway Runtime Hardening

Add:

- Request/response transformation.
- Circuit breakers.
- Retry policy.
- Timeout policy.
- Caching.
- Load balancing metadata.
- Failover policy.
- High-concurrency performance tests.

## Phase 11 - Developer and Consumer Governance

Add:

- API consumer registry.
- Scope request workflow.
- Contract documentation publishing.
- Usage dashboards.
- Deprecation notices.
- Support metadata.

## Testing Requirements

Each phase requires:

- Contract tests.
- Authentication tests.
- Authorization tests.
- Scope tests.
- Tenant isolation tests.
- Need-to-Know tests.
- API version compatibility tests.
- Webhook signature tests.
- Idempotency tests.
- Rate-limit tests.
- Connector adapter tests.
- Secret handling tests.
- Observability tests.
- Audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for IAM, Workflow, Notification, Search, Backup,
  Observability, Publishing, Distribution, and Phase 7 Step 16 behavior.

## Next Recommended Module

Module 16 - Integration, API Gateway and External Connectors Module
Architecture is now documented after Search, Indexing and Knowledge Graph.

Module 17 - Configuration, Feature Flags and Platform Administration Module
Architecture is now documented after Integration, API Gateway and External
Connectors.

Module 18 - Data Governance, Metadata and Master Data Management Module
Architecture is now documented after Configuration, Feature Flags and Platform
Administration.

Module 19 - Accessibility, Localization and Inclusive Experience Module
Architecture is now documented after Data Governance, Metadata and Master Data
Management.

Module 20 - Analytics, Business Intelligence and Decision Support Module
Architecture is now documented after Accessibility, Localization and Inclusive
Experience.

Module 21 - AI Governance, Model Management and Responsible AI Module
Architecture is now documented after Analytics, Business Intelligence and
Decision Support.

Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module
Architecture is now documented after AI Governance, Model Management and
Responsible AI.

Module 23 - Quality Assurance, Testing and Validation Module Architecture is
now documented after DevSecOps, CI/CD, Release and Platform Operations.

Module 24 - Enterprise Architecture, Portfolio and Strategic Governance
Module Architecture is now documented after Quality Assurance, Testing and
Validation.

Module 25 - Compliance, Legal Governance and Risk Management Module
Architecture is now documented after Enterprise Architecture, Portfolio and
Strategic Governance.

With Module 25, the fundamental Phase II architecture covers the full
enterprise chain: editorial capabilities, infrastructure, AI, operations,
governance, quality, strategy, and compliance.

Phase III Module 26 - Enterprise Meta-Architecture and Codex Governance
Framework is now documented as the supreme Codex governance layer. Future
capabilities are specialized extensions unless explicitly approved through
Codex Governance as fundamental architecture.
