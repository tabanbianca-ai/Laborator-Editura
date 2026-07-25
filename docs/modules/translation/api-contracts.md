# Translation API Contracts

## Purpose

This document defines official Translation Module API contract expectations.

## Target Translation API

Target examples:

- `POST /translations`.
- `GET /translations/{id}`.
- `POST /translations/{id}/segments`.
- `POST /translations/{id}/review`.
- `POST /translations/{id}/approve`.
- `POST /translations/search`.

All APIs must be versionable and authenticated unless explicitly public by
architecture.

## Current Implemented Translation APIs

Translations:

- `POST /translations/submit`.
- `GET /translations?documentId=...`.

Segments:

- `POST /segments`.
- `GET /segments?documentId=...`.
- `GET /segments/:id`.

Translation Memory:

- `POST /translation-memory`.
- `GET /translation-memory/search`.
- `GET /translation-memory/proposals`.
- `POST /translation-memory/:id/approve`.
- `GET /translation-memory`.

Terminology:

- `POST /terminology/check-segment`.
- Term creation, update, governance, search, and source priority endpoints.

QA:

- Segment/document run, issue list, resolve, and score recalculation endpoints.

Semantic Fidelity:

- Segment/document run, issue list, resolve, and score recalculation endpoints.

Workflow:

- Start, status, advance, block, unblock, approve, ready-for-export, and
  exported endpoints.

## API Rules

- Use server-derived authenticated context only.
- Never trust client-provided user ID, organization ID, roles, tenant ID, or
  permissions.
- Preserve source document immutability.
- All mutation actions must be audited.
- Translation APIs must reference project, document, segment, and eventually
  Library Item identity.
- AI endpoints must remain advisory and must not approve or publish.
- API changes must be additive until client migration is complete.

## Current Gaps

- Top-level translation project APIs are not explicit.
- `GET /translations/{id}` is not exposed.
- Review and approval routes are primarily handled by Workflow, not
  translation-specific endpoints.
- Unified `POST /translations/search` does not exist yet.
- API versioning is not visible in route paths.
- Canonical Library Item reference is not yet mandatory in translation routes.
