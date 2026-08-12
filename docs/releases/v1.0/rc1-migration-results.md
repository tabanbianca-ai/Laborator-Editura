# RC1 Migration Results

Status: LIVE_ACTION_REQUIRED
Generated: 2026-08-12

## Migration Inventory

| Order | Migration |
| --- | --- |
| 0000 | `0000_mvp_foundation_v1.sql` |
| 0001 | `0001_translation_memory_v1.sql` |
| 0002 | `0002_terminology_glossary_v1.sql` |
| 0003 | `0003_qa_engine_v1.sql` |
| 0004 | `0004_semantic_fidelity_v1.sql` |
| 0005 | `0005_workflow_engine_v1.sql` |
| 0006 | `0006_terminology_governance_v2.sql` |
| 0007 | `0007_founder_protection_v1.sql` |
| 0008 | `0008_security_hardening_phase_1.sql` |

## Automated Evidence Passed

| Area | Result | Evidence |
| --- | --- | --- |
| MVP foundation migration | PASS | DB tests verify core tables, RLS model, export artifacts, and audit |
| Translation Memory migration | PASS | DB tests verify table columns, RLS, approved fuzzy matches, and audit |
| Terminology migration | PASS | DB tests verify table columns, statuses, RLS, search, priority, and audit |
| QA migration | PASS | DB tests verify reports, issues, checks, severities, RLS, and audit |
| Semantic Fidelity migration | PASS | DB tests verify reports, issues, issue types, RLS, and audit |
| Workflow migration | PASS | DB tests verify statuses, transitions, scopes, RLS, export gates, and audit |
| Terminology Governance v2 migration | PASS | DB tests verify quality, validation fields, statuses, actions, and blockers |
| Founder Protection migration | PASS | DB tests verify protected ownership tables, backfill, transfer paths, and RLS |
| Security Hardening migration | PASS | DB tests verify login attempts, security events, expiration, and idle tracking |
| Rollback compatibility | PASS | Blocker 06 live rehearsal used `0008_security_hardening_phase_1.sql` for `30b39ec` and `add6e73` |
| Runtime-to-staging parity | PASS | Blocker 05 isolated restore and Blocker 06 data-integrity checks passed on staging |

## Evidence Missing

| Migration Path | Result | Evidence Gap |
| --- | --- | --- |
| Clean database execution | MISSING | SQL contract tests passed, but no real PostgreSQL clean migration run was executed |
| Existing database upgrade | MISSING | No representative existing database was upgraded in this RC1 run |

## Blocker 08 Closure Attempt

Blocker 08 was evaluated locally. The local environment does not provide
`psql` or Docker, so Codex could not run a disposable PostgreSQL database or
execute real SQL migrations here. Runtime database backup/restore tests and SQL
contract tests remain valid, but they are not a replacement for PostgreSQL
execution evidence.

## Required Clean PostgreSQL Run

Run in an isolated database, not against live staging data:

```bash
cd /opt/laborator-editura
export CLEAN_DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/laborator_rc1_clean"
for migration in packages/db/migrations/*.sql; do
  psql "$CLEAN_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
done
psql "$CLEAN_DATABASE_URL" -v ON_ERROR_STOP=1 -c "\\dt"
psql "$CLEAN_DATABASE_URL" -v ON_ERROR_STOP=1 -c "select '0008_security_hardening_phase_1.sql' as expected_final_migration;"
```

Record PostgreSQL version, migration logs, final schema, constraints/index
inspection, and application startup compatibility against this clean schema.

## Required Existing Database Upgrade Run

Run in a separate isolated database created from a representative pre-0008
state:

```bash
cd /opt/laborator-editura
export EXISTING_DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/laborator_rc1_existing"
for migration in packages/db/migrations/0000_*.sql \
  packages/db/migrations/0001_*.sql \
  packages/db/migrations/0002_*.sql \
  packages/db/migrations/0003_*.sql \
  packages/db/migrations/0004_*.sql \
  packages/db/migrations/0005_*.sql \
  packages/db/migrations/0006_*.sql \
  packages/db/migrations/0007_*.sql; do
  psql "$EXISTING_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
done
psql "$EXISTING_DATABASE_URL" -v ON_ERROR_STOP=1 -c "select count(*) as pre_upgrade_tables from information_schema.tables where table_schema = 'public';"
psql "$EXISTING_DATABASE_URL" -v ON_ERROR_STOP=1 -f packages/db/migrations/0008_security_hardening_phase_1.sql
psql "$EXISTING_DATABASE_URL" -v ON_ERROR_STOP=1 -c "\\dt"
```

Record pre-upgrade state, upgrade logs, post-upgrade schema, data preservation
checks for representative organization/user/project/document rows, final
migration version, and repeatability behavior. Do not run destructive migration
tests against the live staging database.

## Migration Decision

Migration contract coverage, runtime-to-staging parity, and rollback
compatibility passed. RC1 migration certification remains blocked until
migrations are executed on clean and representative existing PostgreSQL
databases in the staging or release validation environment.
