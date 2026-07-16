#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_DIR="${CONFIG_DIR:-${LABORATOR_CONFIG_DIR:-/etc/laborator}}"
CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-$CONFIG_DIR/infrastructure.env}"
CONFIG_EXAMPLE="$REPO_ROOT/infrastructure/backup/laborator-backup.env.example"
BACKUP_FILE=""
CONFIRM=""
DRY_RUN=true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config)
      CONFIG_FILE="$2"
      shift 2
      ;;
    --backup)
      BACKUP_FILE="$2"
      shift 2
      ;;
    --apply)
      DRY_RUN=false
      shift
      ;;
    --confirm)
      CONFIRM="$2"
      shift 2
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

[[ -n "$BACKUP_FILE" ]] || die "Pass --backup /path/to/backup.tar.gz"

if [[ "$DRY_RUN" == "false" ]]; then
  require_confirm "DR_RESTORE" "$CONFIRM"
fi

load_or_bootstrap_config_file "$CONFIG_FILE" "$CONFIG_EXAMPLE" "$DRY_RUN"
normalize_path_aliases
: "${PROJECT_ROOT:=$APP_ROOT}"
: "${APP_ROOT:=$PROJECT_ROOT}"
: "${DOCKER_COMPOSE_PATH:=$APP_ROOT/deploy/staging/docker-compose.staging.yml}"
: "${COMPOSE_FILE:=$DOCKER_COMPOSE_PATH}"
: "${ENV_FILE:=$APP_ROOT/deploy/staging/.env.staging}"

"$APP_ROOT/infrastructure/backup/restore-dry-run.sh" --backup "$BACKUP_FILE"

if [[ "$DRY_RUN" == "true" ]]; then
  success "DR dry-run completed. Re-run with --apply --confirm DR_RESTORE to restore live volumes."
  exit 0
fi

"$APP_ROOT/infrastructure/backup/restore-laborator.sh" \
  --config "$CONFIG_FILE" \
  --backup "$BACKUP_FILE" \
  --force \
  --confirm RESTORE

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build
"$APP_ROOT/infrastructure/validation/wait-for-health.sh" --timeout 180

success "Disaster recovery restore completed."
