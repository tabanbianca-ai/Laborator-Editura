# Data Migration Plan

## Expand-Migrate-Contract

1. EXPAND: add compatible schema or optional fields.
2. Deploy compatible application code.
3. MIGRATE: transform data and validate reconciliation.
4. Switch reads and writes after evidence passes.
5. CONTRACT: remove legacy structure only through separately approved change.

## Existing Data Issues to Scan

| issue | detection | action |
| --- | --- | --- |
| non-uniform identifiers | compare canonical entity aliases | preserve mapping |
| duplicate entities | compare business keys per organization | HUMAN_DECISION_REQUIRED |
| missing organization | runtime backup validation | logical quarantine |
| orphaned references | reference validation | report and quarantine |
| noncanonical states | lifecycle catalog comparison | map through migration |
| missing metadata | metadata audit model | backfill where safe |
| sensitive metadata | classification audit | remove from generic metadata only through approved migration |
| unowned tables | data ownership map | assign owner or mark unresolved |
| JSON without validation | import/export contracts | validate before processing |
| divergent API models | API inventory | version or deprecate |
| unversioned events | event catalog | add schema version |

## Rollback

No data migration is executed in Batch 03. Future migrations must include
backup, validation, reconciliation, and rollback notes before execution.

