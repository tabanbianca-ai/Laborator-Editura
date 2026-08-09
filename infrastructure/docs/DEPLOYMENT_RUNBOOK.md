# Staging Deployment Runbook

## Principle

The repository is the source of truth. Staging deploys must be controlled,
auditable, and reversible. Production deploy is not enabled until the production
domain and environment are defined.

For RC releases, staging follows the stricter artifact rule:

```text
BUILD ONCE
SHA-256 VERIFY
DEPLOY SAME ARTIFACT
VERIFY DEPLOYED DIGEST
```

Do not use source rebuild deployment for RC certification evidence.

## Required GitHub Actions Secrets

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_PRIVATE_KEY`
- `VPS_KNOWN_HOSTS`
- `DEPLOY_PATH`

Do not use a root password. Use a dedicated `deploy` user with SSH key access.

## Source-Based Staging Deploy

This path is allowed for ordinary staging refreshes only. It builds from the
repository source and is not acceptable for RC artifact certification.

```bash
cd /opt/Laborator-Editura
git status --short
infrastructure/deploy/deploy-staging.sh --ref <commit-sha>
```

The deploy script refuses to continue if local repository changes exist.

## Artifact-Based RC Staging Deploy

Use this path for RC releases. It verifies the approved artifact checksum,
extracts it into an immutable release directory, records release identity, and
starts staging with `docker compose up -d --no-build` using
`deploy/staging/docker-compose.artifact.yml`.

The runtime images must already be produced by the approved build pipeline from
the verified artifact. Provide either immutable `@sha256` image references or
expected Docker image IDs for images loaded from a saved bundle.

```bash
cd /opt/Laborator-Editura

infrastructure/deploy/deploy-staging-artifact.sh \
  --artifact .releases/incoming/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image <approved-api-image@sha256-or-tag> \
  --web-image <approved-web-image@sha256-or-tag> \
  --api-image-id <optional-sha256:image-id-for-loaded-images> \
  --web-image-id <optional-sha256:image-id-for-loaded-images>
```

The script fails if:

- the artifact SHA-256 differs from the expected digest;
- the artifact source commit differs from the approved commit;
- the migration version differs when provided;
- the artifact compose file contains a source build directive;
- runtime images are mutable tags without expected image IDs;
- running containers do not expose the expected artifact digest labels;
- running container image IDs differ from provided expected image IDs.

## Runtime Images From Artifact

Run this in the approved build pipeline, not on staging, when a saved Docker
image bundle is needed for the VPS:

```bash
infrastructure/deploy/build-runtime-images-from-artifact.sh \
  --artifact artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --api-image laborator-api:1.0.0-rc.1-30b39ec \
  --web-image laborator-web:1.0.0-rc.1-30b39ec \
  --output-metadata artifacts/releases/v1.0/rc1/runtime-images-30b39ec.json \
  --output-image-bundle artifacts/releases/v1.0/rc1/runtime-images-30b39ec.tar
```

This helper verifies the artifact first and does not run application builds. It
creates runtime images from the built outputs already inside the artifact.

## Artifact Rollback

```bash
infrastructure/deploy/rollback-staging-artifact.sh \
  --confirm ROLLBACK \
  --artifact <previous-approved-artifact.tar.gz> \
  --sha256 <previous-artifact-sha256> \
  --source-commit <previous-source-commit> \
  --api-image <previous-approved-api-image> \
  --web-image <previous-approved-web-image>
```

The legacy source rollback remains available for non-RC source deployments:

```bash
infrastructure/deploy/rollback-staging.sh \
  --ref <previous-commit-sha> \
  --confirm ROLLBACK
```

## Validation

Validate the artifact deployment tooling locally or in CI:

```bash
bash infrastructure/validation/validate-artifact-deploy.sh
```

The validator confirms shell syntax, verifies the current RC artifact checksum,
checks that the artifact compose file does not rebuild source, verifies the
runtime-image dry-run path, and proves that a checksum mismatch blocks
deployment.

## Docker Exposure

Docker binds staging services to loopback:

- `127.0.0.1:3000`
- `127.0.0.1:3001`

Nginx remains the only public entry point.
