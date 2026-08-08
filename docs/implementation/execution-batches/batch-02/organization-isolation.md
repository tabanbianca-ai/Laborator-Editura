# Organization Isolation

## Existing Isolation

Runtime repositories use server-derived `organizationId` and tenant-scoped
database access methods such as `selectForTenant` and `findByIdForTenant`.

## Batch 02 Additions

The following new identity tables are tenant-scoped:

- `auth_identities`
- `auth_role_assignments`
- `auth_service_accounts`
- `auth_delegation_sessions`
- `auth_privileged_operation_policies`
- `auth_security_audit_events`

`auth_permissions` is intentionally global metadata.

## Cross-Organization Protection

Session organization comes from the validated token. Services must continue to
use `actor.organizationId` and must not accept organization identity from client
headers or request bodies for authorization.

