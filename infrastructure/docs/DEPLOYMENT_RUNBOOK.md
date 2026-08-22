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
cd /opt/laborator-editura
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
the verified artifact. Docker image IDs recorded during build are retained as
provenance evidence, but they must not be used as the portable acceptance gate
after `docker save` and `docker load`. The deterministic runtime gate is:

- release artifact SHA-256 verification before extraction;
- image configuration labels embedded by the approved build pipeline;
- running container labels emitted by the artifact compose file;
- source commit, release version, migration version, deployment ID, and artifact
  SHA-256 all matching the approved release identity.

Provide immutable `@sha256` image references where a registry is used. For
saved Docker image bundles, explicit non-`latest` tags are accepted only when
the loaded images expose the required release labels and the running containers
verify the same identity after `docker compose up -d --no-build`.

```bash
cd /opt/laborator-editura

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

`--api-image-id` and `--web-image-id` are retained as optional build-time
provenance records only. They are not compared with the post-load runtime image
ID because that assertion is not portable across the current saved-bundle
deployment path.

The script fails if:

- the artifact SHA-256 differs from the expected digest;
- the artifact source commit differs from the approved commit;
- the migration version differs when provided;
- the artifact compose file contains a source build directive;
- runtime image references are implicit `latest` or explicit `:latest` tags;
- tagged runtime image references do not use the deterministic
  `<source-commit-prefix>-<github-run-id>` identity recorded in release
  provenance;
- a tagged API or web image is not an exact match for the corresponding image
  reference in provenance from the SHA-256-verified runtime bundle;
- loaded image configuration labels do not match the approved release identity;
- running containers do not expose the expected release identity labels;
- running container image labels do not match the approved release identity.

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
creates runtime images from the built outputs already inside the artifact and
labels them with release version, source commit, artifact SHA-256, and migration
version so the deploy script can verify portable identity after save/load.

An immutable `@sha256:<digest>` reference remains valid without a saved bundle.
For the current `docker save`/`docker load` path, a tagged reference is accepted
only when its tag has the deterministic
`<source-commit-prefix>-<github-run-id>` form, the API and web references match
their exact values in release provenance, and the runtime bundle SHA-256 matches
that same provenance. Before service startup, the deploy script from the
verified release artifact checks the loaded image labels; after startup it
checks both container and running-image labels for release version, source
commit, artifact SHA-256, migration version, and deployment ID where
applicable. Build-time image IDs remain evidence and are not an equality gate.

## Artifact Rollback

Before any RC rollback, validate that the rollback target is an eligible
artifact baseline. A valid baseline must include `pnpm-lock.yaml`, match the
expected source commit and migration, and have independently recorded immutable
API and web image IDs:

```bash
infrastructure/validation/validate-rollback-baseline.sh \
  --artifact <approved-rollback-artifact.tar.gz> \
  --sha256 <rollback-artifact-sha256> \
  --source-commit <rollback-source-commit> \
  --migration-version <migration-file> \
  --api-image-id <sha256:api-image-id> \
  --web-image-id <sha256:web-image-id>
```

Do not use `--no-frozen-lockfile` to make historical artifacts deployable. If
the artifact lacks a lockfile, preserve it as historical evidence and establish
a new verified rollback baseline from a lockfile-backed artifact instead.

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
