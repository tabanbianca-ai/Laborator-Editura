#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-/etc/laborator/infrastructure.env}"
TARGET_REF="${1:-}"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config)
      CONFIG_FILE="$2"
      shift 2
      ;;
    --ref)
      TARGET_REF="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

load_config_file "$CONFIG_FILE"
: "${APP_ROOT:=/opt/Laborator-Editura}"
: "${COMPOSE_FILE:=$APP_ROOT/deploy/staging/docker-compose.staging.yml}"
: "${ENV_FILE:=$APP_ROOT/deploy/staging/.env.staging}"
: "${DEPLOY_HEALTH_URL:=http://127.0.0.1:3000}"
: "${DEPLOY_API_HEALTH_URL:=http://127.0.0.1:3001/health}"

[[ -n "$TARGET_REF" ]] || die "Usage: $0 --ref <git-ref-or-sha>"

require_command git
require_command docker
require_command curl

cd "$APP_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  die "Repository has local changes. Refusing controlled deploy without operator review."
fi

previous_ref="$(git rev-parse HEAD)"
log "Previous commit: $previous_ref"
log "Target ref: $TARGET_REF"

rollback_on_error() {
  local exit_code=$?
  if [[ "$DRY_RUN" == "false" && "${DEPLOY_DISABLE_AUTO_ROLLBACK:-false}" != "true" ]]; then
    warn "Deploy failed. Attempting automatic rollback to $previous_ref."
    git checkout --detach "$previous_ref" || true
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build || true
  fi
  exit "$exit_code"
}

trap rollback_on_error ERR

"$APP_ROOT/infrastructure/backup/backup-laborator.sh" --config "$CONFIG_FILE"

run_or_dry git fetch origin "$TARGET_REF"
run_or_dry git checkout --detach FETCH_HEAD

run_or_dry docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build
run_or_dry docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d

if [[ "$DRY_RUN" == "false" ]]; then
  "$APP_ROOT/infrastructure/validation/wait-for-health.sh" \
    --web "$DEPLOY_HEALTH_URL" \
    --api "$DEPLOY_API_HEALTH_URL" \
    --timeout 120
fi

trap - ERR
log "Staging deploy completed for $TARGET_REF"
