# Authentication Inventory

## Existing Mechanisms Found

| Area | Existing implementation | Decision |
| --- | --- | --- |
| Login | `AuthService.login` with password or bootstrap secret validation | Retained and hardened |
| Logout | `AuthService.logout` revokes the active session | Retained |
| Session verification | `RequestContextMiddleware` calls `AuthService.getCurrentActor` | Retained and enriched |
| Session refresh | `AuthService.refreshSession` rotates session token | Retained |
| Password reset | Generic response with hashed one-use token metadata | Retained and hardened |
| Password change | Password strength and credential replacement | Retained and hardened |
| Email verification | Generic response with hashed token metadata | Retained |
| Roles | `MvpRole` plus `user_roles` runtime table | Retained for compatibility |
| Permissions | `permissionsForRoles` MVP mapping | Retained and supplemented |
| Tenant context | Server-derived `organizationId` in request context | Retained |
| Audit | `foundation_audit_events`, auth activity, auth security events | Retained and extended |

## Legacy Compatibility Retained

- `users`
- `user_roles`
- `auth_sessions`
- `auth_credentials`
- existing `MvpRole`
- existing `MvpPermission`

## New Canonical Foundations

- `auth_identities`
- `auth_role_assignments`
- `auth_permissions`
- `auth_service_accounts`
- `auth_delegation_sessions`
- `auth_privileged_operation_policies`
- `auth_security_audit_events`

