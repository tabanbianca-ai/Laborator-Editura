# Atomic AI Financial Persistence Foundation (P0-A)

Status: local implementation; not connected to paid execution or customer billing.
Source baseline: `0589569947e676742dd96ec9c7eda597eef00374`.

Real PostgreSQL validation initially found blockers in 0014 and historical 0006.
The subsequent authorized remediation passes real migration, RLS, concurrency and
financial restore tests. See [the validation/remediation report](financial-postgres-validation.md)
and the mandatory [0006 compatibility procedure](../../database/migration-0006-compatibility.md).
Earlier static/unit results below are preserved as historical evidence only.

## Canonical Ownership

AI Governance owns budgets, reservations, tariff versions, provider attempts,
reconciliation and consumption. Commerce owns customer billing and payments.
The common financial journal is shared infrastructure, with separate AI_EXPENSE
and CUSTOMER_REVENUE subledgers. No customer checkout or revenue operation is
implemented here. Editorial approval authority is unchanged.

Existing `ai_budgets`, quotas, policies, `ai_usage_records` and audit APIs remain
unchanged. Existing unused operational-cost collections must not become another
accounting authority. P0-C must project reconciled consumption into existing usage
reporting with one settlement identity, not record expenses twice.

## PostgreSQL Schema

Migration `0014_ai_financial_foundation_v1.sql` adds nine singular-named tables:

| Table | Responsibility |
| --- | --- |
| financial_operation | Immutable tenant-scoped idempotency claim, request SHA-256, authenticated actor, correlation and safe source reference |
| ai_provider_tariff | Immutable approved provider/model version; integer input/output rates per million tokens, currency and scale |
| ai_budget_account | Lockable immutable projection of an approved existing budget for one period, including source hash and verified opening consumption |
| ai_cost_reservation | Immutable maximum quote linked to the same tenant/task/project/agent and exact tariff denomination |
| ai_budget_allocation | One reservation allocation per applicable budget account, with integer monetary/token ceilings |
| ai_provider_attempt | Immutable dispatch intent, provider-bound tariff, per-attempt ceilings and idempotency key; not proof of provider completion |
| ai_financial_reconciliation_event | Append-only reservation/dispatch/settlement/release/unknown/adjustment evidence, deduplicated by operation and provider event |
| financial_journal / financial_ledger_entry | One journal per financial operation; immutable balanced debit/credit lines, sealed at the transaction boundary |

All monetary amounts and token counts use nonnegative PostgreSQL bigint. Rates
and ledger amounts have explicit three-letter currency and monetary scale (0-9).
Public contracts serialize integer units as decimal strings to avoid JavaScript
precision loss. Currency conversion and unsupported pricing components fail closed
in future integrations; no rate, historical usage, invoice or tax is fabricated.

Composite references bind tenant, reservation, attempt, task scope and denomination.
The budget source ID refers to the existing runtime budget, which has no PostgreSQL
parent table: this is an explicit migration boundary, not an unenforced claim of
SQL referential integrity to JSON. Provisioning must verify its tenant and source
hash before any account is funded. No provisioning/backfill runs in this phase.
One source budget/period cannot produce multiple concurrent accounts. Mid-period
policy changes require an approved amendment design before P0-B enables execution.

## Transactions and Isolation

`PostgresFinancialUnitOfWork` accepts a connected-client pool interface; it does
not install a driver, create a pool or read connection credentials. A dedicated
PostgreSQL adapter/pool must be supplied in P0-B. No Nest provider/controller is
registered and no current service is redirected to this foundation.

Each unit of work starts SERIALIZABLE, sets tenant/user context transaction-locally,
sets bounded lock/statement timeouts, and locks all requested budget account IDs
in sorted order using FOR UPDATE. Missing, inaccessible or mismatched rows abort
the entire command. SKIP LOCKED is forbidden. Deferrable ledger constraints are
checked before commit. Failures roll back; a failed rollback invalidates the client.
The helper does not retry and never wraps a provider request in a database transaction.

Operation claims are valid only inside that helper's active matching transaction.
Same tenant/key/actor/owner/kind/hash returns the prior receipt; mismatches fail.
Payload hashes must be derived server-side from validated canonical financial
commands, not trusted from HTTP input. The hash utility rejects floating point,
unsafe integers, undefined, cycles and sparse arrays. Do not hash or persist raw
manuscript content, credentials, card data or unredacted provider errors.

SQL constraints enforce per-tenant idempotency, provider event uniqueness and one
initial settlement/dispatch event per attempt. A journal
must have at least two positive lines, matching currency/scale and zero net balance.
Its debit total must equal the referenced AI reconciliation amount. A sealed journal
rejects late insertions, unsealing and identity changes. Updates/deletes of history
and TRUNCATE are denied by triggers; corrections require new operations/events.

## Security Boundary

Every new relation has enabled and forced RLS. Missing context denies access.
Initial access is restricted to existing ADMIN/PLATFORM_CREATOR with mixed
AI_AGENT/SYSTEM/AUTOMATION roles excluded. Actor IDs on operation insertion must
match IAM context. No SECURITY DEFINER privilege bypass is introduced. Lockable
budget rows have an UPDATE policy solely to permit FOR UPDATE; the immutable
trigger still rejects actual updates.

This is an admin-only foundation, not permission for ordinary users or AI agents
to mutate financial tables. P0-B must define a narrowly authorized spend principal
through existing IAM, without granting ADMIN to translators or accepting role
claims from requests. Database superusers/owners able to disable triggers remain
outside application guarantees; deployment grants and privileged audit are required.

## P0-B / P0-C Contracts and Failure Recovery

`apps/api/src/modules/ai-governance/ai-financial.contract.ts` defines reserve,
dispatch, settle, release and reconcile interfaces only. There is no implementation
of the business state machine, funding, balance projection or provider dispatch.

P0-B must enumerate every applicable tenant/project/agent/user scope server-side,
verify quote/tariff/period, lock all scopes and account for both held capacity and
verified consumed amounts. Callers must not select a cheaper subset of accounts.
It must atomically write operation, reservation, allocations and initial event.
This phase alone does not prove concurrent spending protection.

P0-C must bind each dispatch to reserved capacity, validate retries/fallback tariffs,
and settle exactly once through the central provider. Dispatch intent commits
before network I/O; settlement/event/journal/projection commits together afterward.
Unknown provider outcomes retain capacity as RECONCILIATION_REQUIRED; local timeout,
reservation expiry or cancellation is not evidence that the provider charged zero.
Recovery workers must reconcile before releasing disputed capacity. Serialization
or deadlock retry must reuse the same command and must never repeat external I/O
without verified provider idempotency. Lost COMMIT acknowledgment is also unknown:
look up the committed operation before replaying it.

Current local runtime locks are not financial reservations. Creator plan exemptions
do not bypass financial recording. Paid Translation Agent remains disabled until
all current provider endpoints share this authority, actual usage is reconciled,
cancellation/deadlines are compatible and a human approves activation explicitly.

## Migration and Recovery

Apply 0014 once, after 0013, with the existing versioned migration process inside
one transaction (`psql --single-transaction -v ON_ERROR_STOP=1` for an isolated test).
Adding unique scope constraints can acquire locks and requires deployment planning.
There is no destructive down migration or legacy data rewrite. Rollback before
COMMIT is transactional; after financial data exists, rollback must use a compatible
application and additive corrective migration, never deletion of financial history.

The JSON runtime backup format is unchanged and does NOT contain these PostgreSQL
tables. It must never be presented as a full financial backup. Before any real
financial use, canonical backup orchestration must include a consistent full
PostgreSQL schema+data dump or physical snapshot/WAL, migration version, checksums,
and all parents/constraints/triggers. A privileged dedicated backup role is required
to avoid tenant-filtered dumps under FORCE RLS; normal application roles must not
receive BYPASSRLS. Restore only into a separate disposable database, never live data.

`packages/db/scripts/verify-financial-postgres.sql` is a read-only post-restore gate
for the trusted backup role. It rejects missing RLS, immutability/ledger triggers,
unvalidated constraints, unsealed/unbalanced journals and mismatched settlement
evidence. Run it with ON_ERROR_STOP after full restore. Data-only restore with
disabled triggers is not an accepted recovery proof. Actual pg_dump/restore
rehearsal, cross-process contention and production IAM integration remain P0-B gates.

## Validation Classification

Static migration tests inspect structure, constraints and append-only protections.
Behavioral unit tests execute the driver-independent transaction helper with a
recording client, testing deterministic ordering, rollback paths, idempotency,
exact integer arithmetic and ledger validation. These are NOT PostgreSQL tests.

`financial-postgres.integration.test.mjs` is opt-in. Set
LABORATOR_FINANCIAL_TEST_DATABASE_URL to a disposable localhost database named
`laborator_financial_test...` with a non-superuser role without BYPASSRLS and schema
creation permission. It applies the actual migration over isolated predecessor
fixtures, exercises RLS/FKs/duplicates/subtransaction rollback/deferred balancing
and finally rolls the entire fixture back. It never connects to staging. It does
not claim validation of the entire historical migration chain or backup/restore.
When PostgreSQL is absent it is explicitly skipped, not reported as passed.

### Local Results (2026-10-29)

- Branch: `codex/gap-02-4-4-p0-a-financial-persistence`; no commit or remote update.
- Uncached workspace tests: API 625/625, shared 62/62, web 134/134; DB 68 passed,
  zero failed and one explicitly skipped real PostgreSQL test (69 total).
- Focused foundation tests: 12 passed and one PostgreSQL test skipped.
- Uncached lint, production build and sequential post-build typecheck passed.
  A combined parallel build/typecheck attempt raced on generated Next types;
  sequential revalidation passed without changing web code. The bundled Python
  executable was placed on PATH for existing AI-package validation scripts.
- Dependency audit: zero critical/high/moderate, one existing low deepmerge
  advisory. Plain audit returns exit 1 for that unsuppressed low finding.
- `git diff --check` passed. Existing AI handlers, provider service, cost/budget
  services, editorial workflow, package manifests and lockfile were unchanged.
- PostgreSQL server/psql/Docker unavailable: migration execution, real RLS/FK and
  transaction behavior, multiprocess contention and pg_dump/restore are NOT VERIFIED.
- No paid execution, checkout, provisioning, migration application, live database
  access, VPS access, deployment, commit or push occurred.
