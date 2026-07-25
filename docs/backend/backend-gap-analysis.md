# Backend Gap Analysis

## Purpose

This document records the Chapter 12 Backend Architecture Baseline Audit gaps.

Each gap uses the required format:

- Gap ID.
- Area.
- Current State.
- Required State.
- Risk.
- Affected Modules.
- Dependencies.
- Recommended Action.
- Migration Phase.
- Acceptance Criteria.

## Gaps

### BE-GAP-001

Area: Module structure.

Current State: Backend modules use a flat
`controller/module/repository/service/types` layout.

Required State: Modules converge toward `api/application/domain/infrastructure/contracts/tests`.

Risk: Medium.

Affected Modules: All backend modules.

Dependencies: Chapter 3 module architecture, Chapter 12 backend architecture.

Recommended Action: Introduce the target structure incrementally in one pilot
module before migrating other modules.

Migration Phase: Phase 1 - structural pilot.

Acceptance Criteria: Pilot module exposes the new structure without changing
public behavior or breaking tests.

### BE-GAP-002

Area: Application and domain separation.

Current State: Services often combine use-case orchestration and domain
decisions.

Required State: Application services coordinate explicit use cases and pure
domain policies hold invariants.

Risk: High.

Affected Modules: Workflow, Translation, Terminology, Semantic Fidelity,
Library, Layout Publishing, Rights, Auth.

Dependencies: Domain tests, contract tests, public API compatibility.

Recommended Action: Extract framework-independent domain policies before any
service rewrite.

Migration Phase: Phase 2 - domain policy extraction.

Acceptance Criteria: Core domain rules are unit tested without NestJS.

### BE-GAP-003

Area: Module contracts.

Current State: Cross-module coordination imports concrete service classes.

Required State: Cross-module usage goes through documented commands, queries,
events, or public ports.

Risk: High.

Affected Modules: Translations, Workflow, Layout Publishing, Editorial
Decisions, Media Localization, Export, Documents, Segments, QA, Semantic
Fidelity.

Dependencies: Module contract inventory, dependency map.

Recommended Action: Define public contracts for the high-dependency modules
first: Auth, Projects, Documents, Segments, Translation, Workflow, Library,
Rights, Export.

Migration Phase: Phase 3 - public contract extraction.

Acceptance Criteria: High-dependency modules expose documented public
contracts and consumers no longer import private implementation details.

### BE-GAP-004

Area: API versioning.

Current State: Current NestJS routes are mostly unversioned route families.

Required State: Stable APIs are documented and exposed under `/api/v1` or an
approved versioning strategy.

Risk: Medium.

Affected Modules: All controllers.

Dependencies: Frontend clients, contract tests, staging compatibility.

Recommended Action: Document v1 contracts first, then add non-breaking version
aliases if approved.

Migration Phase: Phase 4 - API versioning.

Acceptance Criteria: Existing clients continue to work and v1 contracts are
tested.

### BE-GAP-005

Area: DTO organization.

Current State: Operation inputs and outputs are mostly represented in module
`*.types.ts` files.

Required State: Operation-specific request, response, command, query result,
and event DTOs are documented and versioned.

Risk: Medium.

Affected Modules: All API modules.

Dependencies: API versioning and module contracts.

Recommended Action: Create DTO folders for new or migrated operations without
breaking existing type exports.

Migration Phase: Phase 4 - API and DTO alignment.

Acceptance Criteria: Public endpoints have explicit request and response DTOs.

### BE-GAP-006

Area: Transactions.

Current State: Runtime database operations are sequential; formal transaction
boundaries are not exposed.

Required State: State-changing use cases define transaction boundaries and use
Outbox for reliable cross-boundary events when required.

Risk: High.

Affected Modules: Auth, Projects, Author Studio, Translation, Workflow,
Layout Publishing, Library, Backup, Gateway, Rights, Commerce.

Dependencies: Runtime database evolution or PostgreSQL transaction support.

Recommended Action: Introduce a transaction port and pilot with one critical
multi-write use case.

Migration Phase: Phase 5 - transaction and outbox foundation.

Acceptance Criteria: Critical multi-write use cases either commit atomically or
fail without partial state.

### BE-GAP-007

Area: Eventing and messaging.

Current State: Audit events and metadata records exist, but no central event
bus, queue, outbox, retry, or Dead Letter Queue exists.

Required State: Domain and integration events are versioned, dispatched
through a central mechanism, retryable, and observable.

Risk: Medium.

Affected Modules: Workflow, Publishing, Export, AI Governance, Gateway,
Scheduling, Platform Engineering.

Dependencies: Transaction strategy, observability, background jobs.

Recommended Action: Add event catalog and outbox design before implementation.

Migration Phase: Phase 6 - eventing foundation.

Acceptance Criteria: Events are documented, emitted once, and recoverable on
failure.

### BE-GAP-008

Area: Background jobs.

Current State: Job-like metadata exists, but no central recoverable job runner
is implemented.

Required State: Long-running work uses central jobs with states, progress,
retries, cancellation, and recovery after restart.

Risk: Medium.

Affected Modules: Export, Layout Publishing, Multimedia, Media Localization,
Backup, AI Governance, Scheduling, Platform Engineering.

Dependencies: Eventing, transactions, observability.

Recommended Action: Define a job port and adapter before moving long
operations out of HTTP handlers.

Migration Phase: Phase 7 - background jobs.

Acceptance Criteria: A pilot export or backup task runs through central job
metadata and can recover after restart.

### BE-GAP-009

Area: Cache.

Current State: No central cache abstraction exists.

Required State: Cache usage is governed by key scope, TTL, invalidation,
failure behavior, and tenant safety.

Risk: Low.

Affected Modules: Workspace, Permissions, Library, Public Portal,
Lexicographic, Terminology, Research.

Dependencies: Security, observability, configuration.

Recommended Action: Add `CachePort` design and only introduce cache after
performance measurements justify it.

Migration Phase: Phase 8 - measured cache introduction.

Acceptance Criteria: Cache cannot become source of truth and cannot leak
cross-tenant data.

### BE-GAP-010

Area: Observability.

Current State: Observability metadata exists, but correlation ID propagation,
structured request logging, and liveness/readiness/dependency health are not
fully standardized.

Required State: Every request, job, event, external call, error, and trace is
correlated and observable.

Risk: Medium.

Affected Modules: All backend modules.

Dependencies: Gateway, Observability, Platform Engineering, deployment
configuration.

Recommended Action: Add correlation ID middleware and split health check
contracts in a non-breaking way.

Migration Phase: Phase 9 - observability hardening.

Acceptance Criteria: Logs, traces, metrics, health checks, and audit records
can be correlated without exposing sensitive data.

### BE-GAP-011

Area: Authorization policy centralization.

Current State: Central request context exists, but permission decisions are
not uniformly delegated to one authorization policy engine.

Required State: Use cases evaluate role, subscription, Need-to-Know,
workspace, resource state, and policy consistently.

Risk: High.

Affected Modules: All protected modules.

Dependencies: IAM, Workspace, Policy Engine, Subscription Entitlements.

Recommended Action: Define an authorization port and migrate sensitive use
cases first.

Migration Phase: Phase 10 - authorization unification.

Acceptance Criteria: Sensitive actions are denied consistently regardless of
controller route or caller.

### BE-GAP-012

Area: External provider independence.

Current State: Most provider behavior is metadata-only or adapter-planned, but
future modules must avoid direct provider calls.

Required State: External systems and AI providers are accessed only through
Chapter 10 adapters and AI orchestration.

Risk: Medium.

Affected Modules: AI Governance, Multimedia, Media Localization, Gateway,
Launch Essentials, Export.

Dependencies: Integration Gateway, AI Orchestrator, Secret Vault metadata.

Recommended Action: Keep provider implementations behind ports before enabling
real providers.

Migration Phase: Phase 11 - adapter implementation.

Acceptance Criteria: Business modules do not import provider SDKs or secrets.
