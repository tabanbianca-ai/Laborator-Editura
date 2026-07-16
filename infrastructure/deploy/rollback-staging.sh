#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_DIR="${CONFIG_DIR:-${LABORATOR_CONFIG_DIR:-/etc/laborator}}"
CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-$CONFIG_DIR/infrastructure.env}"
CONFIG_EXAMPLE="$REPO_ROOT/infrastructure/backup/laborator-backup.env.example"
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
    --verbose)
      enable_verbose
      shift
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

load_or_bootstrap_config_file "$CONFIG_FILE" "$CONFIG_EXAMPLE" "$DRY_RUN"
normalize_path_aliases
: "${PROJECT_ROOT:=$APP_ROOT}"
: "${APP_ROOT:=$PROJECT_ROOT}"
: "${DOCKER_COMPOSE_PATH:=$APP_ROOT/deploy/staging/docker-compose.staging.yml}"
: "${COMPOSE_FILE:=$DOCKER_COMPOSE_PATH}"
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

success "Rollback completed."
