# IAM Events

## Purpose

This document defines official events for the IAM Module.

Events are append-only evidence for identity and security activity. They do
not replace audit records.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `actorId`.
- `subjectUserId`.
- `sourceModule`.
- `correlationId`.
- `idempotencyKey`.
- `occurredAt`.
- `payload`.

## Official Events

Identity events:

- `UserCreated`.
- `UserUpdated`.
- `UserSuspended`.
- `UserReactivated`.
- `UserArchived`.

Authentication events:

- `LoginSucceeded`.
- `LoginFailed`.
- `AccountLocked`.
- `PasswordResetRequested`.
- `PasswordChanged`.
- `EmailVerified`.

Session events:

- `SessionCreated`.
- `SessionRefreshed`.
- `SessionExpired`.
- `SessionIdleTimeout`.
- `SessionRevoked`.
- `SuspiciousSessionFlagged`.

Authorization events:

- `RoleAssigned`.
- `RoleRevoked`.
- `PermissionGranted`.
- `PermissionRevoked`.
- `PermissionDenied`.
- `AccessReviewCreated`.
- `AccessReviewApproved`.
- `AccessReviewRejected`.

MFA and SSO events:

- `MFAEnabled`.
- `MFADisabled`.
- `MFAChallengeSucceeded`.
- `MFAChallengeFailed`.
- `SSOProviderCreated`.
- `SSOProviderEnabled`.
- `SSOProviderDisabled`.
- `SSOLoginSucceeded`.
- `SSOLoginFailed`.

Security policy events:

- `SecurityPolicyCreated`.
- `SecurityPolicyActivated`.
- `SecurityPolicyDisabled`.
- `PolicyViolationRecorded`.
- `SuspiciousActivityRecorded`.

Platform protection events:

- `PlatformCreatorAccessed`.
- `FounderProtectionRecovered`.
- `FounderOwnershipTransferRequested`.
- `FounderOwnershipTransferAccepted`.
- `FounderOwnershipTransferCancelled`.

## Current Repository Baseline

Existing related evidence:

- Auth audit events.
- Auth activity events.
- Auth security events.
- Security governance audit events.
- Enterprise admin audit events.
- Workspace access audit events.
- Gateway API key and webhook audit events.
- Launch Essentials MFA/GDPR/Secret Vault audit events.

Current gaps:

- IAM-specific event envelope is not yet centralized.
- Event names are not yet unified across Auth, Security Governance,
  Enterprise Admin, Workspace, Gateway, and Launch Essentials.
- Event versioning is not yet standard for IAM events.

## Event Rules

- Events must be tenant-scoped unless platform-global.
- Events must not contain secrets, raw tokens, password hashes, MFA secrets, or
  recovery codes.
- Events must preserve correlation ID.
- Security-critical events must be auditable.
- Events that affect access must be compatible with immediate revocation and
  session invalidation strategies.
