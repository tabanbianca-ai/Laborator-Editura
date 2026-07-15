#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
# shellcheck source=../../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

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
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

if [[ "$DRY_RUN" == "false" ]]; then
  require_confirm "UFW_BASELINE" "$CONFIRM"
fi

require_command ufw

run_or_dry ufw default deny incoming
run_or_dry ufw default allow outgoing
run_or_dry ufw allow 22/tcp
run_or_dry ufw allow 80/tcp
run_or_dry ufw allow 443/tcp
run_or_dry ufw --force enable
run_or_dry ufw status verbose

