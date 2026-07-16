#!/usr/bin/env bash
set -Eeuo pipefail

VERBOSE="${VERBOSE:-false}"

utc_timestamp() {
  date -u +'%Y-%m-%dT%H:%M:%SZ'
}

emit_log() {
  local level="$1"
  local stream="$2"
  shift 2
  if [[ "$stream" == "stderr" ]]; then
    printf '[%s] %s: %s\n' "$(utc_timestamp)" "$level" "$*" >&2
  else
    printf '[%s] %s: %s\n' "$(utc_timestamp)" "$level" "$*"
  fi
}

log() {
  emit_log "INFO" "stdout" "$*"
}

success() {
  emit_log "SUCCESS" "stdout" "$*"
}

warn() {
  emit_log "WARNING" "stderr" "$*"
}

debug() {
  if [[ "${VERBOSE:-false}" == "true" ]]; then
    emit_log "INFO" "stdout" "VERBOSE: $*"
  fi
}

die() {
  emit_log "ERROR" "stderr" "$*"
  exit 1
}

enable_verbose() {
  VERBOSE=true
  export VERBOSE
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

load_config_file() {
  local config_file="${1:-}"
  if [[ -n "$config_file" ]]; then
    [[ -f "$config_file" ]] || die "Config file not found: $config_file"
    debug "Loading config file: $config_file"
    # shellcheck disable=SC1090
    source "$config_file"
  fi
}

load_or_bootstrap_config_file() {
  local config_file="${1:-}"
  local example_file="${2:-}"
  local dry_run="${3:-false}"

  [[ -n "$config_file" ]] || return 0

  if [[ -f "$config_file" ]]; then
    load_config_file "$config_file"
    return 0
  fi

  if [[ -z "$example_file" || ! -f "$example_file" ]]; then
    die "Config file not found and no example file is available: $config_file"
  fi

  if [[ "$dry_run" == "true" ]]; then
    warn "Config file not found: $config_file. Dry-run will use example defaults from $example_file without writing system files."
    # shellcheck disable=SC1090
    source "$example_file"
    return 0
  fi

  local config_dir
  config_dir="$(dirname "$config_file")"
  if mkdir -p "$config_dir" 2>/dev/null && cp "$example_file" "$config_file" 2>/dev/null; then
    chmod 700 "$config_dir" 2>/dev/null || warn "Could not set restrictive permissions on config directory: $config_dir"
    chmod 600 "$config_file" 2>/dev/null || warn "Could not set restrictive permissions on config file: $config_file"
    success "Created missing config file from example: $config_file"
    warn "Review and customize this file before production use."
    load_config_file "$config_file"
    return 0
  fi

  warn "Could not create missing config file: $config_file. Falling back to example defaults from $example_file for this run."
  # shellcheck disable=SC1090
  source "$example_file"
}

normalize_path_aliases() {
  PROJECT_ROOT="${PROJECT_ROOT:-${APP_ROOT:-/opt/Laborator-Editura}}"
  APP_ROOT="${APP_ROOT:-$PROJECT_ROOT}"
  DOCKER_COMPOSE_PATH="${DOCKER_COMPOSE_PATH:-${COMPOSE_FILE:-$APP_ROOT/deploy/staging/docker-compose.staging.yml}}"
  COMPOSE_FILE="${COMPOSE_FILE:-$DOCKER_COMPOSE_PATH}"
  BACKUP_DIR="${BACKUP_DIR:-${BACKUP_ROOT:-/opt/laborator-backups}}"
  BACKUP_ROOT="${BACKUP_ROOT:-$BACKUP_DIR}"
  CONFIG_DIR="${CONFIG_DIR:-${LABORATOR_CONFIG_DIR:-/etc/laborator}}"
  LOG_DIR="${LOG_DIR:-/var/log/laborator}"
  NGINX_DIR="${NGINX_DIR:-${NGINX_CONFIG_DIR:-/etc/nginx}}"
  NGINX_CONFIG_DIR="${NGINX_CONFIG_DIR:-$NGINX_DIR}"
  SYSTEMD_DIR="${SYSTEMD_DIR:-${SYSTEMD_CONFIG_DIR:-/etc/systemd/system}}"
  SYSTEMD_CONFIG_DIR="${SYSTEMD_CONFIG_DIR:-$SYSTEMD_DIR}"
}

run_or_dry() {
  if [[ "${DRY_RUN:-false}" == "true" ]]; then
    log "DRY-RUN: $*"
  else
    "$@"
  fi
}

sha256_command() {
  if command -v sha256sum >/dev/null 2>&1; then
    printf 'sha256sum'
  elif command -v shasum >/dev/null 2>&1; then
    printf 'shasum -a 256'
  else
    die "Neither sha256sum nor shasum is available."
  fi
}

require_confirm() {
  local expected="$1"
  local actual="${2:-}"
  [[ "$actual" == "$expected" ]] || die "Confirmation required: pass --confirm $expected"
}

ensure_directory() {
  local dir="$1"
  if [[ "${DRY_RUN:-false}" == "true" ]]; then
    log "DRY-RUN: mkdir -p $dir"
  else
    mkdir -p "$dir"
  fi
}
