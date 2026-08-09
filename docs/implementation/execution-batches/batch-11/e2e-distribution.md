# E2E Distribution Validation

Status: Repository contract tests passed; public staging smoke evidence pending  
Owner: Distribution Operations

## Required Journey

Approved Publication -> Public Visibility -> Public Catalog -> Product or Free Access -> Entitlement -> Reader Library -> Reader or Download.

## Commerce Path

If commerce is enabled for RC1:

Offer -> Order -> Payment -> Webhook -> Entitlement.

## Evidence

- Public portal, commerce, distribution, library, entitlement, public catalog, reader, and withdrawal contract tests passed locally.
- Payment provider integration remains metadata/foundation-only unless explicitly enabled for the candidate.

## Withdrawal Rule

Published -> Withdrawal Request -> Disable Availability -> Public Catalog Removal -> External Channel Withdrawal -> Reader Policy -> Archive.

Withdrawal must disable availability, remove public catalog visibility, preserve reader policy and archive status, and keep history intact.

## RC1 Gap

Live public catalog, entitlement, reader/download, and withdrawal smoke evidence must be captured on staging.
