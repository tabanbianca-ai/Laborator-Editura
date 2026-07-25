# Containerization

## Purpose

Containerization provides reproducible runtime environments for the Web and
API services.

## Current Baseline

Current staging containers are defined by:

- `deploy/staging/Dockerfile.api`.
- `deploy/staging/Dockerfile.web`.
- `deploy/staging/docker-compose.staging.yml`.

The API container:

- Uses Node 22.
- Uses pnpm through Corepack.
- Builds shared, database, and API packages.
- Verifies the compiled API entry exists.
- Runs `node apps/api/dist/apps/api/src/main.js`.
- Exposes port 3001.
- Provides a `/health` based health check.

The Web container:

- Uses Node 22.
- Uses pnpm through Corepack.
- Builds the Next.js application.
- Runs Next production server.
- Exposes port 3000.
- Provides a root-page health check.

Docker Compose:

- Sets `NODE_ENV=production` and `APP_ENV=staging`.
- Mounts runtime database and backup volumes.
- Binds staging ports to configurable host addresses.
- Starts Web after API is healthy.

## Container Rules

- Images must not include real secrets.
- Build commands must be deterministic.
- Runtime commands must not rely on development tooling unless explicitly
  required.
- Health checks must be minimal and safe.
- Containers must be restartable.
- Runtime data must be stored in volumes or external services.

## Current Gaps

- Images are not yet published to an artifact registry.
- Image signing is not yet implemented.
- Multi-stage production image optimization may be improved later.
- Kubernetes manifests are not yet required or implemented.

## Acceptance Criteria

- Docker builds succeed from a clean checkout.
- Runtime entrypoints match emitted build paths.
- Health checks become healthy in staging.
- Rebuilds do not erase runtime data.
