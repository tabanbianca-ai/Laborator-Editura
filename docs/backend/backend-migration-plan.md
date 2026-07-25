# Backend Migration Plan

## Purpose

This plan defines how the backend should migrate toward Chapter 12 without
breaking validated Phase 7 Step 16 behavior.

No implementation is authorized by this plan alone. Each phase requires
approval before code changes.

## Migration Principles

- Preserve existing APIs until versioned replacements are ready.
- Preserve frontend compatibility.
- Preserve runtime database backup/restore compatibility.
- Add tests before moving critical behavior.
- Migrate one bounded area at a time.
- Do not introduce microservices prematurely.
- Do not rename tables or routes destructively.
- Document deviations through Architecture Decision Records when required.

## Phase 0 - Baseline Complete

Status: Documentation complete.

Deliverables:

- Backend architecture standard.
- Application service standard.
- Domain layer standard.
- Module contract standard.
- API standard.
- Error model.
- Eventing and messaging standard.
- Background job standard.
- Cache strategy.
- Transaction strategy.
- Backend security baseline.
- Backend observability baseline.
- Gap analysis.
- Dependency map.

Acceptance Criteria:

- Baseline documents exist.
- Gaps are classified.
- No runtime behavior changed.

## Phase 1 - Structural Pilot

Goal: Select one low-risk module and introduce the target folder structure.

Recommended pilot candidates:

- `gateway`.
- `observability`.
- `backup-governance`.

Acceptance Criteria:

- Public behavior unchanged.
- Existing tests pass.
- New folder structure is documented.
- No broad module rewrite.

## Phase 2 - Domain Policy Extraction

Goal: Extract pure domain policies from high-value modules.

Recommended candidates:

- Workflow transition policy.
- Publishing preflight blocking policy.
- Terminology priority policy.
- Human Final Authority policy.
- Library lifecycle policy.

Acceptance Criteria:

- Policies can be tested without NestJS.
- Services still expose existing behavior.
- No API response changes.

## Phase 3 - Public Module Contracts

Goal: Introduce explicit commands, queries, and event contracts for
high-dependency modules.

Initial modules:

- Auth.
- Projects.
- Documents.
- Segments.
- Translations.
- Workflow.
- Library.
- Rights & Provenance.
- Export.

Acceptance Criteria:

- Consumers depend on public contracts instead of private internals.
- Contract tests cover cross-module calls.
- No circular dependencies.

## Phase 4 - API Versioning and DTOs

Goal: Define `/api/v1` contracts and operation-specific DTOs.

Approach:

1. Document current routes as compatibility routes.
2. Define v1 route aliases or versioning strategy.
3. Add request and response DTOs.
4. Update frontend clients only after compatibility is proven.

Acceptance Criteria:

- Existing routes keep working.
- v1 contracts are documented and tested.
- DTOs do not expose internal or sensitive fields.

## Phase 5 - Transaction and Idempotency Foundation

Goal: Introduce transaction and idempotency ports.

Pilot use cases:

- Publication state transition.
- Export artifact generation.
- Founder ownership transfer.
- Backup restore metadata.

Acceptance Criteria:

- Critical multi-write operations are protected.
- Repeated requests are safe.
- Audit consistency is covered by tests.

## Phase 6 - Eventing and Outbox Foundation

Goal: Introduce typed domain events, integration events, and Outbox design.

Acceptance Criteria:

- Events are versioned.
- Events preserve organization/workspace context.
- Delivery failures are retryable and observable.
- Audit remains separate from events.

## Phase 7 - Background Jobs

Goal: Move long-running real processing behind central recoverable jobs.

Pilot areas:

- Export generation.
- Backup operations.
- AI long-running analysis.
- Media processing placeholders when providers are enabled.

Acceptance Criteria:

- Jobs preserve actor context.
- Jobs recover after restart.
- Job state is observable.

## Phase 8 - Cache Introduction

Goal: Add cache only where measurements show value.

Candidate data:

- Workspace navigation.
- Permission calculations.
- Public catalog metadata.
- Language resources metadata.

Acceptance Criteria:

- Cache cannot leak tenant data.
- Cache failure does not break correctness.
- Invalidation is documented.

## Phase 9 - Observability Hardening

Goal: Standardize correlation IDs, request logs, health checks, metrics, and
traces.

Acceptance Criteria:

- Requests, events, jobs, and external calls carry correlation IDs.
- Health checks are split into liveness, readiness, and dependency health.
- Logs are structured and safe.

## Phase 10 - Authorization Unification

Goal: Route sensitive authorization through a central policy interface.

Acceptance Criteria:

- Role, subscription, Need-to-Know, workspace, resource state, and policy are
  evaluated consistently.
- Denied access is audited where required.
- UI hiding remains non-authoritative.

## Phase 11 - Provider Adapter Implementation

Goal: Enable real providers only through approved Chapter 10 and AI
Orchestration adapters.

Acceptance Criteria:

- Business modules do not import provider SDKs.
- Secrets remain outside code and logs.
- Provider failures use standardized errors and fallback behavior.

## Approval Checkpoint

Implementation must stop after this migration plan until the project owner
approves a specific phase or bounded implementation task.
