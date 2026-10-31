# Atomic AI Budget Reservations (P0-B)

Baseline: `2c43da3d448916543cb0d7a0fae05d1a40f2cabb`.
Status: local P0-B projection, spending authorization and runtime integration
implemented. All external paid translation dispatch remains blocked pending P0-C.

## Ownership and boundary

AI Governance remains the accounting owner. `PostgresAiBudgetReservations` reuses
P0-A tables and `PostgresFinancialUnitOfWork`. It does not introduce another
ledger, provider, budget policy store or billing service. Additive migration 0016
adds immutable versioned policy projections and references from new reservations.
Historical 0014/0015 are unchanged. Existing reservations remain readable and
are not silently assigned invented projection provenance.

The repository is an admin-only PostgreSQL boundary, not an HTTP endpoint or an
authorization token. Existing forced RLS and non-superuser/non-BYPASSRLS
requirements remain unchanged. The existing AI Governance module owns the
AI_SPENDING binding and a bounded PostgreSQL pool, configured only through
AI_FINANCIAL_DATABASE_URL. Missing configuration fails closed; it does not fall
back to another database. Each connection rejects superuser/BYPASSRLS roles.
No ordinary translator receives ADMIN. A reservation never approves a task/content.

## Verified source projection and spending principal

Existing Governance budgets, quotas, policies and usage remain authoritative.
The repository fences all canonical budget/quota/policy/usage/override writes and
registry/version changes with an exclusive financial-source file lock. The same
fence is held from reading the source through projection synchronization and
reservation commit. Busy writers fail closed and may retry; no write is dropped
or queued as a false success. A leftover crash lock requires operator inspection,
not automatic expiry/removal. This coordinates supported repository operations,
not manual JSON edits, filesystem restores or an unmodified older application.
Do not run mixed old/new writers. Restore requires quiescing writers and
revalidating both JSON and PostgreSQL before any new reservation.

The source hash includes actual persisted policy/usage/registry evidence and UTC
period/day. Decimal source amounts are converted exactly to integer millionths;
unsupported precision/currency, invalid scope, ambiguous agent or unverified
opening consumption is rejected, never guessed. Monthly limits and per-run caps
are supported. CUSTOM periods remain rejected, matching the runtime's existing
fail-closed restriction. Active quotas project per-run money/tokens and daily/
monthly runs. Missing organization budget denies spending. Personal Creator plan
exemptions never waive this financial recording boundary.

PostgreSQL synchronization is SERIALIZABLE under a tenant advisory lock. It
appends a new projection version, immutable account revisions and quota evidence
in one transaction. Identical evidence reuses the version. Every account revision
retains its original budget ID; old accounts/allocations are not overwritten.
Reservations check the latest version/hash and SQL also rejects missing/stale
projection references. All current applicable limits are selected server-side.
Projections carry a validity deadline at the next UTC day or budget start/end
boundary. PostgreSQL wall-clock checks reject expired evidence even when the
source hash has not changed, including after waiting for a transaction lock.
The SQL projection trigger rejects duplicate, missing, null and foreign account
references; these checks are also required by the restore verifier.
Held reservations are counted across revisions and newly introduced scopes, so
lowering a budget or creating another scope cannot hide earlier held capacity.
Unreleased old-period holds remain charged conservatively until P0-C.

The canonical spending principal is an authenticated requesting human with ADMIN
or PLATFORM_CREATOR and platform.admin.manage, plus current PostgreSQL IAM/RLS
authorization. Mixed AI_AGENT/SYSTEM/AUTOMATION identities are denied. No role is
granted, impersonated or elevated. The runtime rechecks task ownership/state,
permissions, resource Need-to-Know, Workflow, Governance, validated binding and
human-activated configuration while preparing the reservation. The service
independently checks the active human-approved registry version. PostgreSQL binds
the reservation to the same actor/execution/project/agent. Reservation outcomes
and denials are audited with safe execution/correlation IDs; SQL financial history
and projection versions are immutable.

Active cost-policy hard ceilings and approval thresholds also constrain the
requested reservation cap, independently of a handler's zero-cost estimate.
Amounts reaching a human-approval threshold are rejected; explicit spend consent
does not grant a budget exception. No override is automatically approved.

POST /ai/tasks/:id/reservation is additive and accepts a strict bounded quote
plus explicitSpendingAuthorization=true. No client projection/hash/account subset
is accepted. It does not execute the task, dispatch, settle or approve content.
Runtime and service tests distinguish real financial PostgreSQL integration from
the runtime authorization adapter test. Canonical IAM/project/agent/task parent
rows and a reviewed tariff must already exist in PostgreSQL: the endpoint will
not fabricate them or copy identities/roles from JSON. Missing parents deny the
reservation. Deployment provisioning/migration approval remains separate.

## Reservation transaction

1. Validate UUIDs, integer bigint amounts, currency/scale and expiry. Compute the
   canonical request hash server-side; never accept a caller-provided hash.
2. Begin SERIALIZABLE with transaction-local tenant/user identity and bounded
   timeouts. Claim the tenant/actor-bound idempotency operation.
3. Verify the execution belongs to the actor, tenant, project and agent and is
   CREATED or AUTHORIZED. Existing execution permissions remain required before
   any future dispatch; this check is not a substitute for Need-to-Know.
4. Discover all current organization/project/user/agent accounts server-side and
   lock in UUID order. No caller-selected cheaper subset is accepted. At least
   one organization account is mandatory; every overlapping matching account
   enforces both its monetary and combined input/output token limit.
5. Require a tenant-scoped effective immutable tariff of matching denomination,
   rejecting a superseded effective version for the same provider/model. Round
   the token quote upward using integer arithmetic. Unsupported pricing charges
   must not be treated as zero by a future dispatch adapter.
6. Require expiry after database transaction time, within 15 minutes, and no
   later than any applicable budget period end.
7. Charge opening verified consumption plus unreleased reservations against every
   limit. Persist operation, reservation, allocations and RESERVED evidence in
   the same commit. Any failure rolls everything back.

Replays with the same key and payload return the original reservation/event.
Changed payload/actor is rejected. Serialization failures propagate: retry the
same validated request explicitly; never repeat provider I/O as a database retry.
An ambiguous COMMIT acknowledgment requires idempotent lookup/replay, not a new key.

## Expiration, cancellation and uncertain costs

Expiration prevents future dispatch; it is not proof of zero provider charges.
There is no automatic release worker in this batch. `releaseUndispatched` locks
all allocated accounts and records one idempotent RELEASED operation/event only
when no provider attempt, dispatch, settlement, adjustment or uncertain event
exists. Even a persisted attempt with no response blocks release. Different
release keys do not create a second release. Failure rolls back the operation.

Until P0-C, settled and uncertain allocations conservatively remain held in full;
actual charges do not decrement holds. This may over-reserve but cannot silently
turn timeout/cancellation into available money. No ledger expense or actual
provider charge is invented by reserve/release.

## Provider inventory and dispatch gate

The API provider I/O inventory finds two external calls, both owned by
`AiTranslationProviderService`: OpenAI chat completions and Anthropic messages.
The service is reachable from `TranslationsService.generateAiProposal`, as well
as the linguistic runtime adapter. The runtime adapter already rejects paid
translation. P0-B additionally blocks the central service immediately before
attempt execution and at each transport method. Configuration flags, credentials,
Creator status and external-processing consent cannot enable it.

No production bypass flag, injected allow callback or fake reservation is added.
Deterministic fake-transport tests explicitly replace the private gate only on
their test instance to retain transport/retry/glossary/redaction contracts. A
separate behavioral test verifies the unmodified service makes zero fetch calls,
including direct transport-method invocation. No real credentials are used.

| Invocation path | Classification |
| --- | --- |
| Execution Runtime external-processing handler | Explicitly blocked before RUNNING, pending P0-C |
| Translation Agent linguistic adapter | Explicitly blocked; no automatic activation |
| TranslationsService.generateAiProposal -> centralized provider | Explicitly blocked before transport |
| OpenAI chat/completions transport | Explicitly blocked at method entry |
| Anthropic messages transport | Explicitly blocked at method entry |
| Existing local handlers and local quota/cost estimates | Non-billable; existing authorization unchanged |
| New reservation endpoint/service | Non-billable, reservation-protected preparation only |

The repository provider inventory finds no additional external AI SDK/HTTP call
in application/package source. All real paid paths are explicitly blocked; none
is classified as an enabled paid dispatch protected solely by a reservation.

Retry/fallback is therefore disabled for real paid I/O. P0-C must persist a unique
attempt with separately reserved capacity and the exact tariff before each
network invocation. The existing retry loop cannot simply be switched back on.

## P0-C dependencies and operational limitations

- P0-C must implement bounded per-attempt dispatch, retry/fallback capacity,
  provider idempotency, durable UNKNOWN/RECONCILIATION_REQUIRED recovery,
  settlement and exact ledger/usage reconciliation without double accounting.
- Opening consumption requires verified actual costs. Unknown legacy costs and
  already financially settled usage identities are rejected rather than double
  counted. P0-C must implement the reconciled usage bridge before real settlement.
- User-supplied caps are limits, not authoritative provider token estimates.
  P0-C must compute/validate a server-side quote for the actual payload, provider
  overhead and all supported tariff components before any dispatch.
- Provider deadlines and cancellation must propagate without releasing unknown
  charges. A reservation expiry is not authorization to dispatch afterward.
- Canonical operational backup must include PostgreSQL, not only the JSON backup.
  Local pg_dump/pg_restore proof is not a production recovery procedure.

Paid execution remains disabled, including direct provider access. No checkout,
settlement, financial reconciliation worker or automatic tariff approval is added.

## Validation

`financial-postgres-operations.integration.test.mjs` runs against disposable
localhost PostgreSQL only, with real historical IAM and forced RLS. It adds:

- Independent child-process contention for organization, project, user and agent
  limits, including two overlapping organization accounts.
- Exactly one winner, explicit loser retry/exhaustion, stable idempotent replay
  after the worker process exits, and changed-payload rejection.
- Token exhaustion, invalid expiry, underfunded tariff, unauthorized actor and
  cross-tenant rejection, with no partial financial operation left committed.
- Idempotent pre-dispatch release and capacity reuse; a persisted uncertain
  attempt blocks cancellation release and subsequent overspending.
- Projection synchronization/reuse, stale rejection, concurrent policy revision
  and reservation, per-run/run-count quota denial, cross-tenant projection denial.
- Real Governance repository -> spending service -> PostgreSQL reservation and
  replay; configuration/resource revocation and denied-action audit.
- Actual configured pool accepts NOSUPERUSER/NOBYPASSRLS and rejects superuser.
- Full-schema dump/restore includes projections and reservation/release history,
  verifies all ten financial tables and immutable ledger integrity.

The suite explicitly skips real PostgreSQL tests if the isolated database,
driver or native backup tools are unavailable. A skipped test is not proof.
No production/staging database, provider or VPS is accessed.

### Initial local validation evidence (2026-10-30, before completion)

- PostgreSQL 17.10, isolated localhost port 55483, native 17.11 client tools;
  application role NOSUPERUSER/NOBYPASSRLS and full real historical migrations.
- Full uncached workspace suite: API 626/626, DB 78/78, shared 62/62, web 134/134;
  zero failures and zero skipped tests. Financial tests used explicit opt-in
  database variables forwarded with Turbo `--env-mode=loose`.
- Separate DB rerun after bounded child-process timeout: 78/78, zero skipped.
- Lint, production build and final typecheck passed; `git diff --check` passed.
- `pnpm audit`: zero critical/high/moderate, one existing LOW deepmerge advisory
  GHSA-gcqx-w48m-w2h4. Plain audit returns exit 1 for that unsuppressed finding.
- Native financial dump/restore snapshot proof: SHA-256
  `b65608d0392b964d551dd8099a272a8953da8c283791b86022d20d3d1b87f210`.
  All nine financial tables matched; the source database remained unchanged.
- Independent process exit/replay and transaction rollback are verified. Abrupt
  operating-system/power-loss recovery, live provider timeouts and real fallback
  charges are not verified; no live provider was contacted.
- Temporary cluster stopped after validation. No commit, push, deployment,
  VPS access, paid AI activation or project dependency change occurred.

The initial BLOCKED assessment above was superseded by the completion work
described in the current contract. It remains historical evidence only.

### Completion validation evidence (2026-10-30)

- Real isolated PostgreSQL 17.10 with native 17.11 backup tools: migrations
  through 0016, source synchronization, RLS, stale/version checks, independent
  process contention, budget update/reservation conflict and quota tests passed.
- Workspace tests: API 630/630, DB 80/80, shared 62/62, web 134/134, zero skipped.
- Financial restore SHA-256:
  `8526520bf79d85c02a8fbad9b64d9dc39a7b7e0d13bc51c695119afd85d9eab5`.
  All ten financial table snapshots matched; source data remained unchanged.
- Driver pg 8.16.3 added through pnpm; frozen-lockfile installation passed.
  No unrelated dependency version changed. Audit still reports zero critical/
  high/moderate and one unsuppressed LOW deepmerge finding (plain audit exit 1).
- No live provider, paid activation, production/staging/VPS access or deployment.
  Runtime authorization adapter tests do not claim a live paid execution.

### Completion follow-up (2026-10-31)

Existing uncommitted P0-B work was preserved. Follow-up hardening adds SQL-level
account membership validation, finite-period validation, time-based projection
expiry and enforcement of policy hard/approval ceilings on reservation caps.
Migration 0016 is still unpublished/uncommitted; historical 0014/0015 are unchanged.

Real PostgreSQL 17.10, isolated localhost port 55483, native 17.11 tools:
full migrations through 0016, forced RLS, source synchronization, stale/expired
projection rejection, independent-process contention, concurrent budget revision,
runtime authorization adapter and real Governance-service/PostgreSQL integration
passed. The API-to-runtime boundary test uses an explicit service test double;
the separate spending-service test uses real PostgreSQL. Neither claims a live
provider or automatic migration of JSON task/IAM/project parents to PostgreSQL.
Missing canonical PostgreSQL parents remain a fail-closed provisioning prerequisite.

Workspace tests: API 633/633, DB 81/81, shared 62/62, web 134/134, zero skipped.
Frozen installation passed without dependency resolution changes. Offline install
initially lacked cached tarballs; the frozen online retry succeeded. Full lint,
final sequential typecheck, production build and whitespace checks passed.
The temporary PostgreSQL cluster was stopped after the final DB rerun (81/81).
No commit, push, deployment, VPS access or paid activation occurred.

Financial archive SHA-256:
`90dd289b749ecfce990fb4a50c8d03c05adbc7aea8c81f82224276c8ee9d3563`.
All ten financial table snapshots and immutable ledger checks matched after restore;
the source test database remained unchanged. This is isolated test evidence only.

Pre-security-remediation dependency audit: 0 critical, 0 high, 3 moderate, 1 low.
Two moderate occurrences are minimatch 3.1.5/10.2.5
(`GHSA-g3hv-75wg-m249`, ESLint/typescript-eslint paths); one is glob 13.0.6
(`GHSA-3g3m-2fjr-6pw4`, Nest CLI path). The existing low deepmerge finding
`GHSA-gcqx-w48m-w2h4` remains. Plain audit exits 1. These existing tooling paths
were not upgraded or suppressed as part of the financial task; older audit
counts above are historical, not the current security result.

The subsequent [P0-B dependency security remediation](p0-b-dependency-security.md)
records the corrected dependency state and final validation. Financial source,
migration 0016 and the paid-dispatch block remain unchanged by that remediation.

### Uncommitted P0-B File Inventory

Includes preserved work already present when the follow-up began:

- `apps/api/package.json`
- `apps/api/src/modules/ai-governance/ai-budget-policy-projection.ts`
- `apps/api/src/modules/ai-governance/ai-execution.controller.ts`
- `apps/api/src/modules/ai-governance/ai-execution.service.ts`
- `apps/api/src/modules/ai-governance/ai-financial-pool.ts`
- `apps/api/src/modules/ai-governance/ai-governance.repository.ts`
- `apps/api/src/modules/ai-governance/ai-governance.types.ts`
- `apps/api/src/modules/ai-governance/ai-spending.service.ts`
- `apps/api/src/modules/ai-governance/ai-translation-provider.module.ts`
- `apps/api/src/modules/ai-governance/ai-translation-provider.service.ts`
- `apps/api/tests/ai-governance-contract.test.mjs`
- `apps/api/tests/ai-spending-authorization.test.mjs`
- `apps/api/tests/ai-translation-provider.integration.test.mjs`
- `apps/api/tests/helpers/load-financial-source.mjs`
- `apps/api/tests/local-agent-handlers.integration.test.mjs`
- `docs/modules/ai-orchestration/atomic-budget-reservations.md`
- `docs/modules/ai-orchestration/financial-persistence-foundation.md`
- `packages/db/migrations/0016_ai_budget_projection_v1.sql`
- `packages/db/scripts/verify-financial-postgres.sql`
- `packages/db/src/ai-budget-projection.ts`
- `packages/db/src/ai-budget-reservations.ts`
- `packages/db/src/index.ts`
- `packages/db/src/runtime-database.ts`
- `packages/db/tests/financial-postgres-operations.integration.test.mjs`
- `pnpm-lock.yaml`
