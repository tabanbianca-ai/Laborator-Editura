# Rights Domain Model

## Purpose

This document defines the target Rights and Provenance domain model and maps it
to the current repository baseline.

## Main Aggregate

### RightsRecord

Canonical fields:

- `id`.
- `organizationId`.
- `libraryItemId`.
- `libraryPublicationId`.
- `documentId`.
- `rightsHolderId`.
- `rightsType`.
- `licenseId`.
- `contractId`.
- `jurisdiction`.
- `territories`.
- `languages`.
- `formats`.
- `status`.
- `effectiveFrom`.
- `expirationDate`.
- `restrictions`.
- `provenanceRecordId`.
- `version`.
- `auditTrail`.
- `createdAt`.
- `updatedAt`.

The Rights Record is the central legal decision object for a resource.

## Rights Types

The target model supports at minimum:

- Copyright.
- Translation Rights.
- Publishing Rights.
- Distribution Rights.
- Audio Rights.
- Video Rights.
- Digital Rights.
- Print Rights.
- Adaptation Rights.
- Illustration Rights.

The model must allow extension without structural changes.

## Rights Holders

Rights holders may be:

- Natural persons.
- Authors.
- Translators.
- Illustrators.
- Publishers.
- Organizations.
- Heirs.
- Literary agencies.

A rights holder may hold multiple rights types.

## Current Baseline Mapping

| Target concept | Current baseline | Notes |
| --- | --- | --- |
| `RightsRecord` | Not a dedicated aggregate | Current records are split across translation and publishing authorizations |
| Rights holder | `rightsHolder` string on translation authorization | Needs first-class registry/entity |
| Rights type | Translation and publishing authorization flags | Needs generalized rights type model |
| License | `license` metadata in Library/Public Portal | Needs versioned license entity |
| Contract | `CollaborationAgreement` and contract refs in Library | Needs contract lifecycle and asset linkage |
| Provenance | `ProvenanceRecord` | Good lightweight baseline |
| Restrictions | Publishing flags and Library restrictions | Needs unified restriction model |
| Legal history | Rights audit events | Needs immutable legal-history timeline |

## Current Backend Entities

Existing `rights-provenance` entities:

- `CollaborationAgreement`.
- `TranslationAuthorization`.
- `PublishingAuthorization`.
- `ProvenanceRecord`.
- `RightsAuditEvent`.

Existing Library links:

- `contractRefs`.
- `license`.
- `rightsStatus`.
- `sourceProvenance`.
- `assetProvenance`.
- `publicationRestrictions`.

Existing Publishing links:

- Rights warnings.
- Rights snapshot reference.
- Preflight rights validation.

## Dependency Map

Rights and Provenance depends on:

- Library for resource identity, contract assets, and publication metadata.
- Workflow for legal review and approval stages.
- Audit for immutable legal history.
- Notifications for expiration and review reminders when enabled.

Rights and Provenance is consumed by:

- Publishing before publication.
- Translation before translation workflows.
- Audio before audiobook creation.
- Video before video creation.
- Public Portal before public release.
- Commerce before commercial distribution.
- Quality Agent for publication readiness.

## Data Ownership

Rights and Provenance owns:

- Rights records.
- Rights holders.
- License versions.
- Contract references and legal metadata.
- Provenance validation.
- Restrictions.
- Legal history.
- Rights validation verdicts.

Rights and Provenance does not own:

- Library item identity.
- Actual contract files stored as Library assets.
- Publication release records.
- Generated export artifacts.
- Public catalog visibility.
- Commercial pricing.
