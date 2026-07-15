# Staging Deployment Runbook

## Principle

The repository is the source of truth. Staging deploys must be controlled,
auditable, and reversible. Production deploy is not enabled until the production
domain and environment are defined.

## Required GitHub Actions Secrets

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_PRIVATE_KEY`
- `VPS_KNOWN_HOSTS`
- `DEPLOY_PATH`

Do not use a root password. Use a dedicated `deploy` user with SSH key access.

## Manual VPS Deploy

```bash
cd /opt/Laborator-Editura
git status --short
infrastructure/deploy/deploy-staging.sh --ref <commit-sha>
```

The deploy script refuses to continue if local repository changes exist.

## Rollback

```bash
infrastructure/deploy/rollback-staging.sh \
  --ref <previous-commit-sha> \
  --confirm ROLLBACK
```

## Docker Exposure

Docker binds staging services to loopback:

- `127.0.0.1:3000`
- `127.0.0.1:3001`

Nginx remains the only public entry point.

