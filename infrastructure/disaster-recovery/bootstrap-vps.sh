#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
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
  require_confirm "BOOTSTRAP_VPS" "$CONFIRM"
fi

require_command apt-get

run_or_dry apt-get update
run_or_dry apt-get install -y ca-certificates curl git gnupg nginx ufw fail2ban unattended-upgrades gettext-base

if ! command -v docker >/dev/null 2>&1; then
  log "Docker is not installed. Install Docker Engine using the official Docker repository before restore."
fi

log "Bootstrap baseline completed. Next: create deploy user, restore secrets, clone repository, restore backup."

