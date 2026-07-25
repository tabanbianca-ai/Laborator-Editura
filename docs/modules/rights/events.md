# Rights and Provenance Events

## Purpose

Rights and Provenance events preserve immutable legal history, provenance
history, contract history, license changes, validation decisions, and rights
status changes.

## Required Domain Events

The target module records:

- `RightsCreated`.
- `RightsVerified`.
- `RightsApproved`.
- `LicenseUpdated`.
- `ContractRegistered`.
- `ContractExpired`.
- `RightsRevoked`.

Additional recommended events:

- `RightsHolderCreated`.
- `RightsTransferred`.
- `LicenseCreated`.
- `LicenseVersionCreated`.
- `ContractVerified`.
- `ContractRenewed`.
- `ContractAmended`.
- `ProvenanceCreated`.
- `ProvenanceVerified`.
- `RestrictionAdded`.
- `RestrictionRemoved`.
- `ComplianceValidationFailed`.
- `ComplianceValidationPassed`.

## Current Event and Audit Baseline

Current audit actions include:

- `COLLABORATION_AGREEMENT_CREATED`.
- `TRANSLATION_AUTHORIZATION_CREATED`.
- `PUBLISHING_AUTHORIZATION_CREATED`.
- `PROVENANCE_RECORD_CREATED`.

Related module events include:

- Library rights status changes.
- Library contract reference changes.
- Publishing preflight generated and refreshed.
- Publishing state changes.
- Public Portal release approval/rejection.
- Commerce edition approval/rejection.

## Event Payload Requirements

Every event should include:

- Event id.
- Organization id.
- Library item id.
- Library publication id.
- Project id.
- Document id.
- Rights record id.
- License id.
- Contract id.
- Provenance record id.
- Actor id.
- Previous state.
- New state.
- Reason.
- Evidence references.
- Timestamp.
- Version.

## Current Gaps

- Rights events exist as lightweight audit actions, not a full domain event
  stream.
- License and contract lifecycle events are not first-class.
- Rights transfer and revocation events are not modeled.
- Compliance validation events are not standardized.
