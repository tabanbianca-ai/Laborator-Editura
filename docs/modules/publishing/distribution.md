# Distribution

## Purpose

Distribution records where and how official publications are delivered after
publication approval.

Distribution must remain adapter-based and independent from publication
metadata ownership.

## Target Channels

The specification supports:

- Public Website.
- Public Library.
- Mobile App.
- Download Portal.
- Print Export.
- External API.

Existing approved Phase 7 Step 16 channels are:

- `INTERNAL_LIBRARY`.
- `PUBLIC_PORTAL`.
- `DIGITAL_BOOKSTORE`.
- `EXTERNAL_EXPORT`.
- `PRINT_ON_DEMAND`.

## Current Baseline

Existing distribution foundations include:

- `PublishingDistributionRecord` in `layout-publishing`.
- `PublicDistributionRecord` in `public-portal`.
- `CommerceDistributionChannel` in `commerce`.
- Public catalog read endpoints.
- Public store endpoint.
- Distribution Center frontend at `/distribution`.
- Distribution history with pending, processing, delivered, failed, and
  withdrawn states.
- Audit events for distribution initiation, delivery, failure, and channel
  withdrawal.

## Adapter Model

Each future adapter should define:

- Channel.
- Target destination.
- Required artifact formats.
- Required approvals.
- Rights restrictions.
- Delivery status.
- External reference.
- Retry metadata.
- Withdrawal support.
- Audit reference.

## Distribution Rules

- Distribution cannot occur before publication approval.
- Distribution cannot bypass rights.
- Distribution cannot duplicate Library metadata.
- Distribution must reference selected exported artifacts.
- Withdrawal must preserve historical distribution records.
- Failed delivery must be auditable and retryable when supported.

## Current Gaps

- Distribution adapters are represented by metadata and records, but not as a
  formal adapter interface.
- Public Website, Mobile App, Download Portal, and External API integrations
  are not connected to real external providers.
- Asynchronous delivery queues and retries are not first-class.
- Batch distribution is not implemented as a backend job model.

## Preservation Rule

Distribution history must never be deleted when a publication is withdrawn.
