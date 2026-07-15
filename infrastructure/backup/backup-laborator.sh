#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-/etc/laborator/infrastructure.env}"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config)
      CONFIG_FILE="$2"
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
: "${BACKUP_ROOT:=/opt/laborator-backups}"
: "${BACKUP_RETENTION_DAYS:=30}"
: "${BACKUP_MIN_FREE_MB:=1024}"
: "${BACKUP_LOCK_DIR:=/tmp/laborator-backup.lock}"
: "${RUNTIME_DB_VOLUME:=laborator-staging_runtime-db}"
: "${RUNTIME_BACKUPS_VOLUME:=laborator-staging_runtime-backups}"
: "${NGINX_CONFIG_DIR:=/etc/nginx}"
: "${SYSTEMD_CONFIG_DIR:=/etc/systemd/system}"
: "${BACKUP_INCLUDE_ENV:=false}"
: "${BACKUP_ENCRYPTION:=none}"

if [[ "$DRY_RUN" == "false" ]]; then
  require_command docker
elif ! command -v docker >/dev/null 2>&1; then
  warn "docker not found; dry-run will not validate live Docker volume access."
fi
require_command git
require_command tar
require_command df
require_command awk

if [[ "$DRY_RUN" == "false" ]]; then
  if ! mkdir "$BACKUP_LOCK_DIR" 2>/dev/null; then
    die "Another backup appears to be running: $BACKUP_LOCK_DIR"
  fi
  trap 'rm -rf "$BACKUP_LOCK_DIR"' EXIT
fi

ensure_directory "$BACKUP_ROOT"

df_target="$BACKUP_ROOT"
if [[ ! -d "$df_target" ]]; then
  df_target="$(dirname "$BACKUP_ROOT")"
fi
available_mb="$(df -Pm "$df_target" | awk 'NR==2 { print $4 }')"
if [[ "${available_mb:-0}" -lt "$BACKUP_MIN_FREE_MB" ]]; then
  die "Insufficient free space in $BACKUP_ROOT: ${available_mb}MB available, ${BACKUP_MIN_FREE_MB}MB required"
fi

timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
backup_name="laborator-staging-$timestamp"
tmp_dir="$(mktemp -d)"
archive_path="$BACKUP_ROOT/$backup_name.tar.gz"
manifest_path="$tmp_dir/manifest.json"
sha_cmd="$(sha256_command)"

cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

log "Starting Laborator backup: $backup_name"

git_commit="unknown"
git_dirty="unknown"
if [[ -d "$APP_ROOT/.git" ]]; then
  git_commit="$(git -C "$APP_ROOT" rev-parse HEAD 2>/dev/null || printf unknown)"
  git_dirty="$(git -C "$APP_ROOT" status --short 2>/dev/null | wc -l | tr -d ' ')"
fi

cat > "$manifest_path" <<JSON
{
  "schemaVersion": "laborator.infrastructure.backup.v1",
  "createdAt": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "appRoot": "$APP_ROOT",
  "gitCommit": "$git_commit",
  "gitDirtyFileCount": "$git_dirty",
  "composeFile": "$COMPOSE_FILE",
  "runtimeDbVolume": "$RUNTIME_DB_VOLUME",
  "runtimeBackupsVolume": "$RUNTIME_BACKUPS_VOLUME",
  "envIncluded": $BACKUP_INCLUDE_ENV,
  "encryption": "$BACKUP_ENCRYPTION"
}
JSON

mkdir -p "$tmp_dir/docker-volumes" "$tmp_dir/config/docker" "$tmp_dir/config/nginx" "$tmp_dir/config/systemd"

if [[ -f "$COMPOSE_FILE" ]]; then
  cp "$COMPOSE_FILE" "$tmp_dir/config/docker/docker-compose.staging.yml"
fi

if [[ "$BACKUP_INCLUDE_ENV" == "true" ]]; then
  [[ -f "$ENV_FILE" ]] || die "BACKUP_INCLUDE_ENV=true but env file does not exist: $ENV_FILE"
  cp "$ENV_FILE" "$tmp_dir/config/docker/.env.staging"
  chmod 600 "$tmp_dir/config/docker/.env.staging"
else
  log "Skipping real staging env file. Set BACKUP_INCLUDE_ENV=true only for encrypted/restricted backups."
fi

if [[ -d "$NGINX_CONFIG_DIR" ]]; then
  tar -C "$NGINX_CONFIG_DIR" -czf "$tmp_dir/config/nginx/nginx-config.tar.gz" .
fi

if [[ -d "$SYSTEMD_CONFIG_DIR" ]]; then
  find "$SYSTEMD_CONFIG_DIR" -maxdepth 1 -type f \
    \( -name 'laborator*.service' -o -name 'laborator*.timer' \) \
    -exec cp {} "$tmp_dir/config/systemd/" \;
fi

backup_volume() {
  local volume="$1"
  local output_name="$2"
  log "Backing up Docker volume: $volume"
  if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY-RUN: docker run --rm -v $volume:/volume:ro -v $tmp_dir/docker-volumes:/backup alpine tar -C /volume -czf /backup/$output_name ."
    return 0
  fi
  docker volume inspect "$volume" >/dev/null
  docker run --rm \
    -v "$volume:/volume:ro" \
    -v "$tmp_dir/docker-volumes:/backup" \
    alpine:3.20 \
    tar -C /volume -czf "/backup/$output_name" .
}

backup_volume "$RUNTIME_DB_VOLUME" "runtime-db.tar.gz"
backup_volume "$RUNTIME_BACKUPS_VOLUME" "runtime-backups.tar.gz"

if [[ "$DRY_RUN" == "true" ]]; then
  log "DRY-RUN: tar -C $tmp_dir -czf $archive_path ."
else
  tar -C "$tmp_dir" -czf "$archive_path" .
  tar -tzf "$archive_path" >/dev/null
  $sha_cmd "$archive_path" > "$archive_path.sha256"
  chmod 600 "$archive_path" "$archive_path.sha256"
fi

case "$BACKUP_ENCRYPTION" in
  none)
    ;;
  age)
    require_command age
    [[ -n "${AGE_RECIPIENT:-}" ]] || die "AGE_RECIPIENT is required when BACKUP_ENCRYPTION=age"
    run_or_dry age -r "$AGE_RECIPIENT" -o "$archive_path.age" "$archive_path"
    ;;
  gpg)
    require_command gpg
    [[ -n "${GPG_RECIPIENT:-}" ]] || die "GPG_RECIPIENT is required when BACKUP_ENCRYPTION=gpg"
    run_or_dry gpg --batch --yes --encrypt --recipient "$GPG_RECIPIENT" --output "$archive_path.gpg" "$archive_path"
    ;;
  *)
    die "Unsupported BACKUP_ENCRYPTION value: $BACKUP_ENCRYPTION"
    ;;
esac

if [[ "$DRY_RUN" == "false" && "$BACKUP_RETENTION_DAYS" =~ ^[0-9]+$ ]]; then
  find "$BACKUP_ROOT" -maxdepth 1 -type f -name 'laborator-staging-*.tar.gz' -mtime "+$BACKUP_RETENTION_DAYS" -print -delete
  find "$BACKUP_ROOT" -maxdepth 1 -type f -name 'laborator-staging-*.tar.gz.sha256' -mtime "+$BACKUP_RETENTION_DAYS" -print -delete
fi

log "Backup completed: $archive_path"
