# Service Accounts

## Foundation Added

Batch 02 adds metadata and runtime persistence for:

- `ServiceAccount`
- `DelegationSession`
- `PrivilegedOperationPolicy`
- `IdentitySecurityAuditEvent`

## Service Account Rules

- Service accounts are identities of type `SERVICE_ACCOUNT`.
- Tokens must be stored as hashes or fingerprints, never as recoverable secrets.
- Service accounts are tenant-scoped.
- Rotation and revocation metadata are persisted.
- Service account activity must be auditable.

## Current Boundary

No external service-to-service provider is enabled in this batch. The runtime
foundation is present for future controlled activation.

