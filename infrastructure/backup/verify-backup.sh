#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

backup_file=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose)
      enable_verbose
      shift
      ;;
    *)
      if [[ -z "$backup_file" ]]; then
        backup_file="$1"
        shift
      else
        die "Unknown argument: $1"
      fi
      ;;
  esac
done

[[ -n "$backup_file" ]] || die "Usage: $0 /path/to/backup.tar.gz"
[[ -f "$backup_file" ]] || die "Backup file not found: $backup_file"

sha_cmd="$(sha256_command)"
if [[ -f "$backup_file.sha256" ]]; then
  log "Verifying checksum: $backup_file.sha256"
  (cd "$(dirname "$backup_file")" && $sha_cmd -c "$(basename "$backup_file").sha256")
else
  warn "Checksum file missing: $backup_file.sha256"
fi

log "Verifying archive structure."
tar -tzf "$backup_file" | grep -q '^manifest.json$' || die "manifest.json missing from backup"
tar -tzf "$backup_file" | grep -q '^docker-volumes/runtime-db.tar.gz$' || die "runtime-db volume archive missing"
tar -tzf "$backup_file" | grep -q '^docker-volumes/runtime-backups.tar.gz$' || die "runtime-backups volume archive missing"

success "Backup verification OK: $backup_file"
