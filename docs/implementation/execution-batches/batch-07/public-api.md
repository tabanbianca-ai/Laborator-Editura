# Public API

Public and reader applications use dedicated API surfaces.

Canonical routes:

- `GET /public/v1/catalog`
- `GET /public/v1/publications/{slug}`
- `GET /reader/v1/library`
- `GET /reader/v1/publications/{id}`
- `POST /store/v1/orders`

Administrative endpoints must not be exposed as public API.

