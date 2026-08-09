#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ENV_FILE="${STAGING_ENV_FILE:-$ROOT_DIR/deploy/staging/.env.staging}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing staging environment file: $ENV_FILE" >&2
  echo "Copy deploy/staging/.env.staging.example to deploy/staging/.env.staging first." >&2
  exit 1
fi

cd "$ROOT_DIR"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

node deploy/staging/scripts/validate-env.mjs

corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build

docker compose \
  --env-file "$ENV_FILE" \
  -f deploy/staging/docker-compose.staging.yml \
  up -d --build

node deploy/staging/scripts/health-check.mjs
