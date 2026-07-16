#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
# shellcheck source=../../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

DEPLOY_USER="${DEPLOY_USER:-deploy}"
SSH_CONFIG_DIR="${SSH_CONFIG_DIR:-/etc/ssh/sshd_config.d}"
DROP_IN="${SSH_HARDENING_DROP_IN:-$SSH_CONFIG_DIR/99-laborator-hardening.conf}"
DRY_RUN=true
CONFIRM=""

while [[ $# -gt 0 ]]; do
  case "$1" in
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
  require_confirm "HARDEN_SSH" "$CONFIRM"
  [[ -s "/home/$DEPLOY_USER/.ssh/authorized_keys" ]] || die "No authorized_keys for $DEPLOY_USER. Do not harden SSH yet."
fi

content="$(cat <<EOF
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
AllowUsers $DEPLOY_USER
EOF
)"

if [[ "$DRY_RUN" == "true" ]]; then
  log "DRY-RUN: write $DROP_IN"
  printf '%s\n' "$content"
else
  printf '%s\n' "$content" > "$DROP_IN"
  sshd -t
  systemctl reload ssh || systemctl reload sshd
fi

success "SSH hardening validation completed. Keep an active SSH session open until a new key-based login is verified."
