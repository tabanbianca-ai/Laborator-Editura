# P0-A Real PostgreSQL Validation

Date: 2026-10-29. Current status: REMEDIATION VALIDATED LOCALLY.
Branch: `codex/gap-02-4-4-p0-a-financial-persistence`.

The original blocked validation below is preserved. The authorized remediation
and successful real database evidence are recorded at the end of this report.

This report supersedes any inference of PostgreSQL correctness from the earlier
static/unit results. No financial migration, RLS policy or ledger constraint was
changed, disabled, replaced or bypassed to obtain a passing result.

## Isolated Environment

No existing PostgreSQL tools, server or Docker were present. Installed only into
`/tmp/laborator-financial-pg-DNw7HN`, without project dependency changes or system
services:

- Native PostgreSQL server 17.10, darwin arm64, distributed as
  `@embedded-postgres/darwin-arm64@17.10.0-beta.17` (package version, not a claim
  that the PostgreSQL engine is a beta/emulator).
- Native psql/pg_dump/pg_restore 17.11 built from the official source archive.
  Source SHA-256:
  `dd27f2b3c59e73ed14aa3324901242bf69a032a6347805f274e6260322d42979`.
- Test-only `pg@8.16.3` driver installed in that temporary directory, not the
  workspace or its lockfile.
- Dedicated temporary cluster, TCP `127.0.0.1:55483`, private Unix socket directory.
  Trust authentication was used only for disposable local fixture data. No real
  credentials, manuscript or financial customer data were loaded.
- `financial_test_app`: NOSUPERUSER, NOBYPASSRLS. Provisioning and backup control
  used the separate `financial_test_admin` of this new cluster only.
- All database names begin `laborator_financial_test`. No staging/VPS access.

## Blocking Findings

### 0014 clean/predecessor-fixture installation: FAIL

The actual server rejects `financial_guard_journal` with SQLSTATE 42601:
`syntax error at end of input`, at the condition:

```sql
IF operation_owner IS DISTINCT FROM CASE WHEN NEW.subledger = 'AI_EXPENSE' THEN 'AI_GOVERNANCE' ELSE 'COMMERCE' END THEN
```

The CASE expression needs an unambiguous SQL expression boundary in the PL/pgSQL
condition. A separately authorized migration correction should parenthesize that
expression and rerun all real tests; this validation task did not apply a fix.
The fixture transaction rolled back fully: no `financial_test_*` schema remained.

### Historical upgrade path: FAIL before reaching 0014

Actual migrations 0000-0005 passed, each committed in its own transaction. Migration
0006 fails with SQLSTATE 42P17: `functions in index predicate must be marked IMMUTABLE`.
Its `qa_issues_terminology_blockers_idx` predicate casts enum `type` to text. That
cast cannot be used as an immutable index predicate. No migration was skipped,
edited, or marked applied. Migrations 0007-0014 were not reached by this path.
Correction requires separate authorization; do not mark an enum-to-text wrapper
IMMUTABLE merely to bypass PostgreSQL's rule.

## Security and Transaction Evidence

Confirmed against the real server independently of migration installation:

- Application role is neither superuser nor BYPASSRLS.
- BEGIN ISOLATION LEVEL SERIALIZABLE reports `serializable`.
- Tenant/user settings established with transaction-local set_config are reset
  after ROLLBACK on the same real connection.
- Failed migration disconnect rolls back its schema/DDL completely.

Financial table RLS, cross-tenant writes, composite references, financial amount
constraints, deterministic account locking, concurrent reservation conflicts,
financial idempotency and ledger balancing remain BLOCKED: execution stops at
0014's parser error. Unit/static tests are not substituted for these checks.
The application reserve/dispatch/settlement implementation also remains a P0-B/P0-C
gap, not an operational service proven by this validation.

## Backup/Restore Control

Genuine pg_dump custom-format backup and pg_restore --single-transaction completed
for the isolated pre-financial database containing migrations 0000-0005 and one
organization sentinel. The source sentinel was unchanged and restored identically.
Archive: `/tmp/laborator-financial-pg-DNw7HN/baseline-control.dump`.
SHA-256: `7765a5ad5f52fcf36a8f56d2acf55f9751cc0aede6eb8fa2eef2f54d31e729a0`.

The financial verifier correctly rejects the restored database with
`Financial relation or tenant RLS missing: financial_operation`.
This is only a toolchain/negative-gate control, NOT a successful financial backup,
NOT restoration of all nine financial tables and NOT preservation of financial
history. Those acceptance criteria remain BLOCKED until 0014 can install.

## Test Hardening and Regression

- Existing real test now requests SERIALIZABLE explicitly, checks complete FORCE
  RLS metadata, missing context, unauthorized roles and negative financial amounts/
  token capacity once installation succeeds. It also checks that its rolled-back
  schema never survives a failed test. No assertion was removed or weakened.
- Added a full historical-chain/upgrade test, opt-in through a local admin test
  URL and explicit external test driver path. It creates only a randomly named
  disposable database and reports the first failed migration, without skipping it.
- Direct full DB suite with real PostgreSQL configured: 70 tests, 68 passed,
  2 failed, zero skipped. Failures are 0006 and 0014 above.
- API 625/625, shared 62/62, web 134/134 passed. Lint, production build and
  subsequent sequential typecheck passed without cache. git diff --check passed.
- Turbo's strict environment mode does not forward these opt-in variables by
  default. Its workspace run skipped both PostgreSQL tests; that is NOT the real
  DB result. The direct DB invocation above was used for the authoritative result.
- pnpm audit: zero critical/high/moderate and one existing unsuppressed low
  deepmerge finding. Plain audit exits 1 for that finding. No dependency changes.

Reproduction requires native psql on PATH and these operator-provided local-only
variables (never configure them with a staging or production URL):

```text
LABORATOR_FINANCIAL_TEST_DATABASE_URL
LABORATOR_FINANCIAL_TEST_ADMIN_URL
LABORATOR_FINANCIAL_TEST_PG_MODULE
```

Run `pnpm --filter @laborator/db test` directly so environment filtering cannot
silently skip PostgreSQL validation. No commit, push, deployment, paid AI or live
payment connection was performed. Temporary cluster shutdown is recorded in the
final task report; fixture files are retained for inspection.

## Authorized Migration Remediation

### Root Causes and Compatibility

- 0014: parenthesized the CASE expression in `financial_guard_journal` so PL/pgSQL
  parses the ownership comparison correctly. No owner rule, RLS policy, foreign
  key, financial state, amount constraint or append-only/ledger guard was relaxed.
- 0006: its enum-to-text partial-index predicate is not IMMUTABLE. The archived
  file remains byte-identical. Known RC1 records do not establish real PostgreSQL
  application; outside environments are still unverified and treated as potentially
  already migrated. There was no VPS inspection.
- Fresh/confirmed-pending 0006 uses the explicit, checksum-guarded source preparer
  and records original/effective hashes and repair ID. It replaces only the invalid
  partial index with a full non-unique index on the same columns. Query and editorial
  semantics are unchanged; index storage increases. Already-applied 0006 must not
  be replayed or have its recorded checksum rewritten.
- Forward migration 0015 preserves a valid existing index or creates the compatible
  index when missing. It fails on unexpected shape rather than dropping/rebuilding
  an existing approved artifact. Reapplication preserves the index OID.

See `docs/database/migration-0006-compatibility.md` for operational prerequisites,
the known-environment evidence and the complete explicit execution procedure.
A raw execution of archived 0006 is intentionally not presented as fixed.

### Real PostgreSQL Results

Native PostgreSQL 17.10, isolated localhost cluster; native pg_dump/pg_restore 17.11.

| Validation | Result |
| --- | --- |
| Fresh 0000-0015 including explicit pending-only 0006 repair | PASS |
| Existing 0013 schema with organization sentinel, upgrade through 0014/0015 | PASS |
| Immutable archived 0006 bytes and refusal of changed/unconfirmed source | PASS |
| NOSUPERUSER/NOBYPASSRLS application role, actual migrated IAM `has_role` | PASS |
| Forced financial RLS, missing context, ordinary role and cross-tenant read/write denial | PASS |
| Transaction-local identity reset, SERIALIZABLE isolation and rollback | PASS |
| Deterministic account row-lock ordering; real blocked second transaction | PASS |
| Concurrent reservation conflict (40001), explicit replay returns original receipt | PASS |
| Payload mismatch rejection and exactly one reservation for the task | PASS |
| Composite references, invalid amounts/tokens and duplicate financial events | PASS |
| Deferred balancing, reconciled amount matching, sealing and immutable history | PASS |
| Full native PostgreSQL financial dump/restore and post-restore verifier | PASS |

The operations test executes the actual `PostgresFinancialUnitOfWork` against the
temporary node-postgres client, not a recording client. The clean database uses
the real historical IAM and parent schemas, not the minimal fixture functions.
Both competing transactions attempt the same reservation. The contender receives
SQLSTATE 40001, rolls back and on explicit retry returns `created=false`. Exactly
one reservation remains. This proves transactional contention/idempotency behavior;
it does not implement P0-B's aggregate budget policy/business service.

### Financial Recovery Evidence

All nine financial tables contain fixture data before backup. pg_dump custom format
and transactional pg_restore target separate newly created disposable databases.
Full ordered JSON row snapshots match for every financial table, including immutable
operations, tariff versions, allocations, attempts, reconciliation, journal and lines.
The source snapshots also remain unchanged. The read-only financial restore verifier
passes against the restored constraints, RLS metadata, triggers and financial history.
No existing backup or release is overwritten or deleted.

One full-regression archive:
`/private/var/folders/9l/w6myt7c16cd5cr2011y227lc0000gn/T/financial-pg-backup-73hQGs/financial.dump`.
SHA-256: `3399736886fd036c306246920092b0e6ff439706dc49cf4ca2535755e8de9ad6`.
This is financial fixture history, not a backup of staging or production.

### Regression and Scope

- DB 77/77, API 625/625, shared 62/62 and web 134/134 pass; zero skipped.
- Full workspace tests use explicit `--env-mode=loose` for local test-only variable
  propagation; direct DB tests independently verify that PostgreSQL is not skipped.
- Lint, sequential build/typecheck and git diff --check pass without cache.
- Audit remains zero critical/high/moderate, one unsuppressed low deepmerge finding;
  plain pnpm audit exits 1 for this known low advisory. Dependencies are unchanged.
- Financial tables are seeded only in new test databases. Agents remain disabled,
  their fixture configurations remain DRAFT, and no provider/payment request occurs.
- No commit, push, deployment, external database access or VPS access. Temporary
  server shutdown is reported separately; all fixture archives remain available.

Remaining operational gates: inspect actual external migration history before
deployment, integrate PostgreSQL backups into canonical operations, provision a
production pool/principal and verified source-budget projections, and implement
P0-B/P0-C business rules. Paid AI remains disabled. Local PostgreSQL validation
does not certify or change unknown deployed environments.
