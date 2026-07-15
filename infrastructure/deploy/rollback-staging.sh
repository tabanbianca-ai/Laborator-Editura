#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-/etc/laborator/infrastructure.env}"
ROLLBACK_REF=""
CONFIRM=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config)
      CONFIG_FILE="$2"
      shift 2
      ;;
    --ref)
      ROLLBACK_REF="$2"
      shift 2
      ;;
    --confirm)
      CONFIRM="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

load_config_file "$CONFIG_FILE"
: "${APP_ROOT:=/opt/Laborator-Editura}"
: "${COMPOSE_FILE:=$APP_ROOT/deploy/staging/docker-compose.staging.yml}"
: "${ENV_FILE:=$APP_ROOT/deploy/staging/.env.staging}"

[[ -n "$ROLLBACK_REF" ]] || die "Pass --ref <previous-commit>"
require_confirm "ROLLBACK" "$CONFIRM"
require_command git
require_command docker

cd "$APP_ROOT"
[[ -z "$(git status --porcelain)" ]] || die "Repository has local changes. Refusing rollback."

log "Rolling back staging to $ROLLBACK_REF"
run_or_dry git checkout --detach "$ROLLBACK_REF"
run_or_dry docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build

if [[ "$DRY_RUN" == "false" ]]; then
  "$APP_ROOT/infrastructure/validation/wait-for-health.sh" --timeout 120
fi

log "Rollback completed."

