#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ENV_FILE="${STAGING_ENV_FILE:-$ROOT_DIR/deploy/staging/.env.staging}"
COMPOSE_FILE="${STAGING_COMPOSE_FILE:-$ROOT_DIR/deploy/staging/docker-compose.staging.yml}"
SERVICE="${1:-}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing staging environment file: $ENV_FILE" >&2
  exit 1
fi

if [ -n "$SERVICE" ]; then
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail=200 -f "$SERVICE"
else
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail=200 -f
fi
