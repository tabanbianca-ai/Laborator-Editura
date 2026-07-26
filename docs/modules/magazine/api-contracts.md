# Magazine API Contracts

## Purpose

This document defines the target Magazine API surface and maps it to current
repository behavior.

All protected APIs must be authenticated, tenant-aware, versioned, and governed
by IAM, RBAC, Need-to-Know access, Workflow, Rights and Provenance, and Human
Final Authority.

## Target Canonical API

Magazines:

- `POST /magazines`.
- `GET /magazines/{id}`.
- `POST /magazines/search`.

Issues:

- `POST /issues`.
- `GET /issues`.
- `GET /issues/{id}`.
- `POST /issues/{id}/articles`.
- `POST /issues/{id}/publish`.
- `POST /issues/{id}/archive`.
- `POST /issues/search`.

Articles:

- `POST /articles`.
- `GET /articles`.
- `GET /articles/{id}`.
- `POST /articles/search`.

## Current API Baseline

Current implementation has no dedicated Magazine backend API.

Magazine UI currently consumes:

- Projects API.
- Documents API.
- Rights warnings from `/rights/translation` and `/rights/publishing`.
- Publishing, Library, and Public Portal readiness indirectly through existing
  workspaces.

Related APIs:

- Library publication and document APIs.
- Translation APIs.
- Review APIs.
- Rights APIs.
- Layout Publishing APIs.
- Public Portal APIs.
- Export APIs.

## Contract Rules

- Magazine APIs must never duplicate article content.
- Issue/article relationships must use Library references.
- Publishing must remain the only official publication mechanism.
- Rights validation must run before issue publication.
- Article approval must be required before issue publication.
- API clients must not provide trusted identity headers.

## Current Gaps

- `/magazines`, `/issues`, and `/articles` APIs do not exist.
- Issue search is not a backend service.
- Article assignment APIs do not exist.
- Issue publication currently delegates through existing Publishing concepts
  but lacks a canonical issue handoff endpoint.
- API versioning is not visible in route paths.
