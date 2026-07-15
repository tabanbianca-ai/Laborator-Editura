#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-/etc/laborator/infrastructure.env}"
load_config_file "$CONFIG_FILE"
: "${BACKUP_ROOT:=/opt/laborator-backups}"

[[ -d "$BACKUP_ROOT" ]] || die "Backup directory not found: $BACKUP_ROOT"

find "$BACKUP_ROOT" -maxdepth 1 -type f -name 'laborator-staging-*.tar.gz' -printf '%TY-%Tm-%Td %TH:%TM %s %p\n' | sort -r

