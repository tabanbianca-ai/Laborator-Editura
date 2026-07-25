# Library API Contracts

## Purpose

This document defines official Library API contract expectations.

## Required Public Module API

The target Library API includes:

- `GET /library/items`.
- `GET /library/items/{id}`.
- `POST /library/items`.
- `PATCH /library/items/{id}`.
- `DELETE /library/items/{id}`.
- `POST /library/search`.

## Current Implemented API

Current backend controller exposes:

- `GET /library`.
- `POST /library/items`.
- `POST /library/publications/search`.
- `POST /library/publications`.
- `POST /library/publications/:id/status`.
- `POST /library/publications/:id/visibility`.
- `POST /library/publications/:id/editions`.
- `POST /library/publications/:id/versions`.
- `POST /library/publications/:id/files`.
- `POST /library/publications/:id/preview`.
- `POST /library/publications/bulk-actions`.
- `POST /library/publications/duplicates`.
- `POST /library/preferences`.
- `POST /library/items/:id/progress`.
- `POST /library/items/:id/bookmarks`.
- `POST /library/items/:id/highlights`.
- `POST /library/items/:id/notes`.
- `POST /library/items/:id/favorite`.
- `DELETE /library/items/:id/favorite`.

## API Rules

- All non-public Library endpoints require authenticated server-derived
  request context.
- Client-provided user IDs, roles, tenant IDs, or organization IDs must not be
  trusted.
- API responses must respect Need-to-Know access.
- Restricted metadata must not be returned to unauthorized users.
- Delete operations must be soft, reversible, or replaced by archive/
  deprecation flows unless explicit permanent deletion is approved by a
  governing policy.
- AI must not call endpoints with expanded access beyond the authorized user
  or agent scope.

## Contract Gaps

- `GET /library/items/{id}` is not exposed as a dedicated endpoint.
- `PATCH /library/items/{id}` is not exposed for item metadata updates.
- `DELETE /library/items/{id}` is not exposed and should be treated carefully
  because platform preservation rules discourage destructive deletion.
- `POST /library/search` is represented by `POST /library/publications/search`
  but not as a unified item/asset search endpoint.
- General asset endpoints are not defined yet.

## Migration Direction

Additive API work should introduce canonical routes while preserving current
routes until clients migrate.
