# Security Findings

## Critical

None open in the implemented Batch 02 foundation.

## High

None open in the implemented Batch 02 foundation.

## Medium

- Explicit endpoint-level `AuthorizationPolicy` metadata is available as a
  helper but not yet attached to every controller route. Existing service-level
  role checks remain authoritative.
- External SSO/OIDC/SAML provider integration is not configured and remains
  out of scope for this batch.

## Low

- Existing legacy auth records are migrated lazily during login rather than by
  a one-time migration command.

