# Identity Migration Plan

## Strategy

The migration is lazy, additive, and reversible.

1. Preserve existing `users`, `user_roles`, and `auth_sessions`.
2. Populate canonical identity metadata during login.
3. Write organization-scoped role assignments in `auth_role_assignments`
   alongside legacy `user_roles`.
4. Keep existing IDs stable.
5. Add runtime backup/restore coverage for new tables.

## Reversibility

Rollback can ignore the new tables and optional user/session metadata because
legacy auth tables remain intact.

## Data Review

Existing users should be reviewed for:

- missing `identityId`;
- non-canonical status;
- missing `securityVersion`;
- stale sessions after password reset/change;
- unexpected global admin or platform creator assignments.

