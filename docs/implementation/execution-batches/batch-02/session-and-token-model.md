# Session and Token Model

## Existing Guarantees

- Access tokens are random UUID session tokens.
- Sessions have absolute expiration.
- Sessions have idle timeout.
- Refresh rotates the session token.
- Revocation is persisted.
- Sensitive token hashes are not logged.

## Batch 02 Hardening

Sessions now include optional canonical metadata:

- `identityId`
- `identityType`
- `authenticationLevel`
- `issuedAt`
- `securityVersion`
- `revocationReason`

`AuthService.getCurrentActor` rejects a session when:

- token is missing;
- session does not exist;
- session is revoked;
- session is expired;
- session exceeded idle timeout;
- linked identity status is not authenticatable;
- session security version no longer matches the user security version.

## Critical Change Invalidation

Password reset and password change increment the user security version and
revoke active sessions for the affected user.

