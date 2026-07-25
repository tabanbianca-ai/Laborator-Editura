# Rights API Contracts

## Purpose

This document defines the target Rights and Provenance API surface and maps it
to current backend APIs.

All protected APIs must be authenticated, tenant-aware, versioned, and
governed by IAM, RBAC, Need-to-Know access, Workflow gates, and Human Final
Authority.

## Target Canonical API

Rights:

- `POST /rights`.
- `GET /rights/{id}`.
- `POST /rights/{id}/verify`.
- `POST /rights/{id}/approve`.
- `POST /rights/search`.

Licenses:

- `GET /licenses`.
- `POST /licenses`.
- `GET /licenses/{id}`.
- `POST /licenses/{id}/versions`.

Contracts:

- `GET /contracts`.
- `POST /contracts`.
- `GET /contracts/{id}`.
- `POST /contracts/{id}/verify`.
- `POST /contracts/{id}/expire`.

Provenance:

- `POST /provenance`.
- `GET /provenance/{id}`.
- `POST /provenance/{id}/verify`.

## Current API Baseline

Current `rights-provenance` endpoints:

- `GET /rights/contracts`.
- `POST /rights/contracts`.
- `GET /rights/translation`.
- `POST /rights/translation`.
- `GET /rights/publishing`.
- `POST /rights/publishing`.
- `GET /rights/provenance`.
- `POST /rights/provenance`.
- `GET /rights/audit`.

Frontend consumers:

- Rights Workspace at `/rights`.
- Publishing Workspace rights warning integration.
- Distribution Center rights warning integration.

## Contract Rules

- API clients must not send trusted identity headers.
- Rights changes must use authenticated server-derived context.
- Only authorized roles may modify legal information.
- AI must not approve agreements or authorize translation/publication.
- Rights verification must block publication when required rights are missing
  or invalid.
- No module may create an independent rights system.

## Current Gaps

- Canonical `POST /rights`, `GET /rights/{id}`, `POST /rights/{id}/verify`,
  `POST /rights/{id}/approve`, and `POST /rights/search` are not implemented.
- First-class `/licenses` and `/contracts` route groups are not implemented.
- API versioning is not visible in route paths.
- Rights validation is not yet exposed as a reusable canonical endpoint.
