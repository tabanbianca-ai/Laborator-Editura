# Privileged Operations

## Protected Operation Categories

- role assignment and revocation;
- session revocation outside the current user;
- service account creation, rotation, and revocation;
- founder protection recovery and transfer;
- administrative identity status changes;
- export/publication approval paths.

## Batch 02 Foundation

`PrivilegedOperationPolicy` records:

- operation key;
- required roles;
- recent authentication requirement;
- audit requirement;
- policy status.

## Current Runtime Enforcement

Existing privileged checks remain in services. Batch 02 adds canonical metadata
for future policy-driven enforcement without breaking current APIs.

