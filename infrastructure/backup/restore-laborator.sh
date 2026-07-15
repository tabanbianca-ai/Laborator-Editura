#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-/etc/laborator/infrastructure.env}"
BACKUP_FILE=""
FORCE=false
CONFIRM=""
DRY_RUN=false
SKIP_PRE_RESTORE_BACKUP=false

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
    --force)
      FORCE=true
      shift
      ;;
    --confirm)
      CONFIRM="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-pre-restore-backup)
      SKIP_PRE_RESTORE_BACKUP=true
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
: "${RUNTIME_DB_VOLUME:=laborator-staging_runtime-db}"
: "${RUNTIME_BACKUPS_VOLUME:=laborator-staging_runtime-backups}"

[[ -n "$BACKUP_FILE" ]] || die "Pass --backup /path/to/laborator-staging-*.tar.gz"
[[ -f "$BACKUP_FILE" ]] || die "Backup file not found: $BACKUP_FILE"

require_command docker
require_command tar

"$SCRIPT_DIR/verify-backup.sh" "$BACKUP_FILE"

if [[ "$DRY_RUN" == "true" ]]; then
  log "Dry-run restore validation completed. No live data changed."
  tar -tzf "$BACKUP_FILE"
  exit 0
fi

[[ "$FORCE" == "true" ]] || die "Live restore requires --force"
require_confirm "RESTORE" "$CONFIRM"

if [[ "$SKIP_PRE_RESTORE_BACKUP" != "true" ]]; then
  log "Creating pre-restore backup before touching live volumes."
  "$SCRIPT_DIR/backup-laborator.sh" --config "$CONFIG_FILE"
fi

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

tar -C "$tmp_dir" -xzf "$BACKUP_FILE"

restore_volume() {
  local volume="$1"
  local archive="$2"
  [[ -f "$tmp_dir/docker-volumes/$archive" ]] || die "Missing volume archive: $archive"
  log "Restoring Docker volume: $volume"
  docker run --rm \
    -v "$volume:/volume" \
    -v "$tmp_dir/docker-volumes:/backup:ro" \
    alpine:3.20 \
    sh -c "find /volume -mindepth 1 -maxdepth 1 -exec rm -rf {} + && tar -C /volume -xzf /backup/$archive"
}

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down
restore_volume "$RUNTIME_DB_VOLUME" "runtime-db.tar.gz"
restore_volume "$RUNTIME_BACKUPS_VOLUME" "runtime-backups.tar.gz"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d

log "Restore completed. Run health checks before returning traffic."

