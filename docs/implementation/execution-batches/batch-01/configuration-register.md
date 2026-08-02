# Configuration Register

## Canonical Configuration Files

| File | Purpose |
| --- | --- |
| `.env.example` | Local development example. |
| `deploy/staging/.env.staging.example` | Staging deployment example. |
| `infrastructure/backup/laborator-backup.env.example` | Infrastructure backup example and bootstrap source. |

## Required Core Variables

| Variable | Purpose | Secret |
| --- | --- | --- |
| `NODE_ENV` | Node/Next runtime mode. Must use standard values. | No |
| `APP_ENV` | Laborator environment semantics such as local, staging, production. | No |
| `LABORATOR_SESSION_SECRET` | Session token signing/validation secret. | Yes |
| `LABORATOR_AUTH_LOGIN_SECRET` | Login/auth secret material. | Yes |
| `API_BASE_URL` | Server-side API URL. | No |
| `NEXT_PUBLIC_API_BASE_URL` | Browser-visible API URL. | No |
| `LABORATOR_RUNTIME_DB_PATH` | Runtime database path. | No |

## Rules

- Real environment files remain ignored.
- Example files must use placeholders, not real secrets.
- Staging/production must reject weak default or demo secrets.
- Secret values must never be logged.

