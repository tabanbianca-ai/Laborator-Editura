# Rollback Plan

## Safe Rollback

Because Batch 02 is additive:

1. Revert the code commit.
2. Keep runtime database files intact.
3. Existing authentication continues to use `users`, `user_roles`,
   `auth_sessions`, and `auth_credentials`.
4. New Batch 02 runtime tables can remain unused.

## Data Compatibility

Optional metadata fields on existing user/session rows are ignored by previous
code paths.

## Operational Check

After rollback, validate:

- login;
- session verification;
- password reset/change;
- tenant-scoped project/document access;
- runtime backup/restore.

