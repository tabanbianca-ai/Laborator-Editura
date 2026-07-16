#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
# shellcheck source=../../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

DEPLOY_USER="${DEPLOY_USER:-deploy}"
AUTHORIZED_KEY_FILE=""
DRY_RUN=true
CONFIRM=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --authorized-key-file)
      AUTHORIZED_KEY_FILE="$2"
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

if [[ "$DRY_RUN" == "false" ]]; then
  require_confirm "CREATE_DEPLOY_USER" "$CONFIRM"
  [[ -n "$AUTHORIZED_KEY_FILE" && -f "$AUTHORIZED_KEY_FILE" ]] || die "Pass --authorized-key-file with a public key."
fi

require_command id
require_command useradd

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  run_or_dry useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi

run_or_dry usermod -aG docker "$DEPLOY_USER"
run_or_dry install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"

if [[ -n "$AUTHORIZED_KEY_FILE" ]]; then
  if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY-RUN: install authorized key for $DEPLOY_USER"
  else
    install -m 600 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$AUTHORIZED_KEY_FILE" "/home/$DEPLOY_USER/.ssh/authorized_keys"
  fi
fi

success "Deploy user bootstrap completed. Verify SSH key login before hardening SSH."
