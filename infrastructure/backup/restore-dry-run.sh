#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

BACKUP_FILE=""
KEEP_TEMP=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backup)
      BACKUP_FILE="$2"
      shift 2
      ;;
    --keep-temp)
      KEEP_TEMP=true
      shift
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

[[ -n "$BACKUP_FILE" ]] || die "Pass --backup /path/to/laborator-staging-*.tar.gz"
[[ -f "$BACKUP_FILE" ]] || die "Backup file not found: $BACKUP_FILE"
require_command docker
require_command tar

"$SCRIPT_DIR/verify-backup.sh" "$BACKUP_FILE"

tmp_dir="$(mktemp -d)"
suffix="$(date -u +'%Y%m%d%H%M%S')"
db_volume="laborator-restore-test-db-$suffix"
backups_volume="laborator-restore-test-backups-$suffix"

cleanup() {
  rm -rf "$tmp_dir"
  if [[ "$KEEP_TEMP" != "true" ]]; then
    docker volume rm "$db_volume" "$backups_volume" >/dev/null 2>&1 || true
  else
    warn "Keeping temporary volumes: $db_volume $backups_volume"
  fi
}
trap cleanup EXIT

tar -C "$tmp_dir" -xzf "$BACKUP_FILE"
docker volume create "$db_volume" >/dev/null
docker volume create "$backups_volume" >/dev/null

restore_temp_volume() {
  local volume="$1"
  local archive="$2"
  docker run --rm \
    -v "$volume:/volume" \
    -v "$tmp_dir/docker-volumes:/backup:ro" \
    alpine:3.20 \
    sh -c "tar -C /volume -xzf /backup/$archive && find /volume -maxdepth 2 -type f | head -20"
}

log "Testing restore into temporary Docker volumes."
restore_temp_volume "$db_volume" "runtime-db.tar.gz"
restore_temp_volume "$backups_volume" "runtime-backups.tar.gz"
log "Restore dry-run OK. Live volumes were not touched."

