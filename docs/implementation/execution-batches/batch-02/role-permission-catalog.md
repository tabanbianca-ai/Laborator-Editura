# Role and Permission Catalog

## Roles

The existing role catalog remains compatible:

- `PLATFORM_CREATOR`
- `ADMIN`
- `EDITOR`
- `TRANSLATOR`
- `PROOFREADER`
- `REVIEWER`
- `DESIGNER`
- `NARRATOR`
- `AUDIO_NARRATOR`
- `AUTHOR`
- `COLLABORATOR`
- `READER`
- `GUEST`
- `VIEWER`

## Scoped Role Assignments

Batch 02 adds `ScopedRoleAssignment` with scope types:

- `PLATFORM`
- `ORGANIZATION`
- `PROJECT`
- `PUBLICATION`
- `RESOURCE`

Existing role writes still populate `user_roles`, and now also populate
`auth_role_assignments` for organization-scoped compatibility.

## Canonical Permissions

The canonical permission catalog is defined in
`apps/api/src/modules/auth/request-context.types.ts` and includes project,
document, segment, translation, review, export, audit, identity, role, and
service-account permissions.

Legacy MVP permissions remain available through `permissionsForRoles`.

