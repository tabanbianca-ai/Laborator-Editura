#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf '[%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"
}

warn() {
  printf '[%s] WARNING: %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*" >&2
}

die() {
  printf '[%s] ERROR: %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

load_config_file() {
  local config_file="${1:-}"
  if [[ -n "$config_file" ]]; then
    [[ -f "$config_file" ]] || die "Config file not found: $config_file"
    # shellcheck disable=SC1090
    source "$config_file"
  fi
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

