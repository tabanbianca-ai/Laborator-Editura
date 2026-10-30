# Migration 0006 Compatibility and Audit

## Known Application Evidence

RC1 release/deployment records report migration version 0008. However,
`docs/releases/v1.0/rc1-migration-results.md` explicitly lists real PostgreSQL clean
execution and upgrade evidence as missing. Runtime JSON restore/deploy evidence
does not prove PostgreSQL 0006 was executed. No VPS or external database was accessed
for this remediation. Actual PostgreSQL application outside the disposable test
cluster remains UNKNOWN; treat 0006 as potentially already applied.

Consequently the historical file is unchanged, including its original invalid
index statement. Do not update any deployed migration checksum, replay 0006 on
an already-migrated database, or retrospectively claim a different source was used.

Original file SHA-256:
`88daf21e943681ef86c153ee05d3ce46e13e494337b5fbe579e211c65c7ada6a`.

## Exact Root Cause

PostgreSQL enum-to-text conversion is STABLE rather than IMMUTABLE, because enum
labels can be renamed. The original partial index predicate `type::text IN (...)`
is rejected with 42P17. Simply comparing enum constants is not a safe single-file
replacement: 0006 also introduces new enum values, which cannot be used until their
transaction commits. Do not declare a wrapper IMMUTABLE to bypass that restriction.

The compatible repair uses a full non-unique btree on the same six columns,
without a predicate. This changes index coverage/storage, not QA results, rejected
terminology semantics, approval rules, RLS or stored data. It costs more index space.

## Fresh or Confirmed-Pending 0006 Only

`packages/db/scripts/prepare-migration-source.mjs` is a pure source preparer, not
a database migrator or alternative deployment system. For 0006 it requires:

1. Explicit `--confirmed-pending`, after the operator verifies 0000-0005 and that
   0006 has not been applied. A partially executed nontransactional 0006 needs
   separate state inspection and approval; do not assume pending means pristine.
2. Exact archived source checksum. Any unexpected source change fails closed.
3. A single exact replacement of the invalid index statement. All enum, data,
   constraint and security statements are retained byte-for-byte.

It outputs the effective SQL on stdout and an audit JSON record on stderr:

```json
{
  "name": "0006_terminology_governance_v2.sql",
  "originalSha256": "88daf21e943681ef86c153ee05d3ce46e13e494337b5fbe579e211c65c7ada6a",
  "effectiveSha256": "94b7d48effb51e4c6439b007dc3330ddcc924df99f3291abd1f56796dce226cb",
  "repairId": "0006-qa-index-fresh-v1"
}
```

Retain both hashes and the repair ID with migration/release evidence. Never record
the original hash as if those original bytes executed successfully. The preparer
does not inspect a live migration ledger or grant approval; the operator/approved
runner owns that prerequisite. Default invocation without pending confirmation
rejects 0006. A raw `psql -f` of archived 0006 is still invalid by design.

Apply the prepared SQL in one transaction with ON_ERROR_STOP; commit before 0007.
For all other files the preparer returns unchanged SQL and equal hashes. The real
integration tests use this explicit path only in newly created isolated databases.

## Existing Databases: Forward Only

`0015_qa_blocker_index_compatibility_v1.sql` creates the full lookup index if missing
and validates its table, column order, non-unique btree shape and validity. A valid
existing index is preserved with the same OID; there is no DROP, REINDEX, data rewrite,
enum cast wrapper or constraint weakening. Unexpected index drift fails for review.
An existing historical partial index is not silently replaced.

For an environment that already records 0006, do not invoke its pending repair.
Apply only approved pending forward migrations, including 0015. For a new database,
execute the full 0000-0015 sequence with the explicit 0006 preparation above.
Existing migration history and checksums remain untouched in either case.

Before any controlled deployment, inspect the real migration ledger and index
definition, approve the path, retain both source/execution evidence, plan index
locking/storage requirements and verify a backup. This task performs no deployment.

## Local Evidence

Native PostgreSQL 17.10 passes both the fresh 0000-0015 path and a representative
upgrade that seeds an organization after 0013 and preserves it through 0014/0015.
Reapplying the forward index migration preserves the existing index OID. Archived
0006 has its original checksum. None of this certifies unknown external databases.
