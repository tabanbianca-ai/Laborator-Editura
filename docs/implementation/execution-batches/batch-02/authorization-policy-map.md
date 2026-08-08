# Authorization Policy Map

## Enforcement Model

- Request identity is resolved server-side by `RequestContextMiddleware`.
- Controllers use `CurrentActor` and `AuthenticatedRequestContext`.
- Client-provided `x-user-id`, `x-organization-id`, and `x-user-roles` are not
  trusted.
- Public routes are explicit and limited.
- All other routes require authenticated context.

## Public Routes

- `GET /health`
- `GET /health/*`
- `GET /public/catalog`
- `GET /public/catalog/*`
- `GET /public/store`
- `GET /public/community/catalog-items/*`
- `POST /auth/login`
- `POST /auth/password/reset`
- `POST /auth/email/verify`

## Authorization Helper

`evaluateAuthorizationPolicy` defaults to deny when:

- actor context is missing;
- required canonical permission is missing;
- required scope is missing.

## Next Stabilization Work

Controllers currently keep their existing service-level authorization checks.
Future batches should progressively attach explicit `AuthorizationPolicy`
metadata to protected endpoint groups without changing API contracts.

