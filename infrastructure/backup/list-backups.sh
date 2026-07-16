#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_DIR="${CONFIG_DIR:-${LABORATOR_CONFIG_DIR:-/etc/laborator}}"
CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-$CONFIG_DIR/infrastructure.env}"
CONFIG_EXAMPLE="$REPO_ROOT/infrastructure/backup/laborator-backup.env.example"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config)
      CONFIG_FILE="$2"
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

load_or_bootstrap_config_file "$CONFIG_FILE" "$CONFIG_EXAMPLE" "false"
normalize_path_aliases
: "${BACKUP_DIR:=$BACKUP_ROOT}"
: "${BACKUP_ROOT:=$BACKUP_DIR}"

[[ -d "$BACKUP_ROOT" ]] || die "Backup directory not found: $BACKUP_ROOT"

find "$BACKUP_ROOT" -maxdepth 1 -type f -name 'laborator-staging-*.tar.gz' -printf '%TY-%Tm-%Td %TH:%TM %s %p\n' | sort -r
