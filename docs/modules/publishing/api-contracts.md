# Publishing API Contracts

## Purpose

This document defines the target Publishing API surface and maps it to current
backend APIs.

All protected APIs must be authenticated, tenant-aware, versioned, and governed
by IAM, RBAC, Need-to-Know access, Workflow gates, Rights & Provenance, and
Human Final Authority.

## Target Canonical API

Publications:

- `POST /publications`.
- `GET /publications/{id}`.
- `POST /publications/search`.

Build:

- `POST /publications/{id}/build`.
- `GET /publications/{id}/builds/{buildId}`.

Publishing:

- `POST /publications/{id}/publish`.
- `POST /publications/{id}/withdraw`.
- `POST /publications/{id}/archive`.

Distribution:

- `POST /publications/{id}/distribution`.
- `GET /publications/{id}/distribution`.

## Current API Baseline

Layout Publishing:

- `POST /layout-publishing/plans`.
- `GET /layout-publishing/plans/:id`.
- `POST /layout-publishing/plans/:id/style-revisions`.
- `POST /layout-publishing/plans/:id/approve`.
- `POST /layout-publishing/plans/:id/reject`.
- `POST /layout-publishing/plans/:id/exports`.
- `POST /layout-publishing/publishing/preflight`.
- `GET /layout-publishing/publishing/preflight/:id`.
- `POST /layout-publishing/publishing/records`.
- `POST /layout-publishing/publishing/records/:id/ready`.
- `POST /layout-publishing/publishing/records/:id/publish`.
- `POST /layout-publishing/publishing/records/:id/withdraw`.
- `POST /layout-publishing/publishing/records/:id/republish`.
- `POST /layout-publishing/publishing/records/:id/distribution`.
- `GET /layout-publishing/publishing/records/:id/distribution`.
- `POST /layout-publishing/publishing/distribution/:id/status`.

Export:

- `POST /export/documents/:documentId/json-master`.
- `GET /export/artifacts/:id`.

Public Portal:

- `POST /public-portal/catalog-items`.
- `GET /public-portal/catalog-items/:id`.
- `POST /public-portal/catalog-items/:id/distribution-records`.
- `POST /public-portal/catalog-items/:id/approve-release`.
- `POST /public-portal/catalog-items/:id/reject-release`.
- `GET /public/catalog`.
- `GET /public/catalog/:id`.

Commerce:

- `POST /commerce/editions`.
- `GET /commerce/editions/:id`.
- `POST /commerce/editions/:id/distribution`.
- `POST /commerce/editions/:id/approve`.
- `POST /commerce/editions/:id/reject`.
- `GET /public/store`.

## Contract Rules

- API clients must not provide trusted identity headers.
- Publication approval must require authorized human roles.
- Publishing APIs must not publish draft or unapproved content.
- Publishing APIs must not duplicate Library metadata as a separate source of
  truth.
- Published official editions must be immutable.
- Withdrawal must preserve history.

## Current Gaps

- The canonical `/publications` facade does not yet exist.
- Build APIs are represented through export, layout, and preflight contracts
  rather than a first-class `PublicationBuild`.
- API versioning is not visible in route paths.
- Distribution adapters are record-based rather than formal adapter contracts.
