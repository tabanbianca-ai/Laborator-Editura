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
require_command python3
require_command tar

sha_cmd="$(sha256_command)"
if [[ -f "$backup_file.sha256" ]]; then
  log "Verifying checksum: $backup_file.sha256"
  (cd "$(dirname "$backup_file")" && $sha_cmd -c "$(basename "$backup_file").sha256")
else
  die "Checksum file missing: $backup_file.sha256"
fi

contract_args=(
  "$SCRIPT_DIR/backup-contract.py"
  verify
  --archive "$backup_file"
)
[[ -n "${EXPECTED_DEPLOYMENT_ID:-}" ]] && contract_args+=(--expected-deployment-id "$EXPECTED_DEPLOYMENT_ID")
[[ -n "${EXPECTED_SOURCE_COMMIT:-}" ]] && contract_args+=(--expected-source-commit "$EXPECTED_SOURCE_COMMIT")
[[ -n "${EXPECTED_ARTIFACT_SHA256:-}" ]] && contract_args+=(--expected-artifact-sha256 "$EXPECTED_ARTIFACT_SHA256")
[[ -n "${EXPECTED_MIGRATION_VERSION:-}" ]] && contract_args+=(--expected-migration-version "$EXPECTED_MIGRATION_VERSION")

log "Verifying canonical backup contract: laborator.infrastructure.backup.v2"
python3 "${contract_args[@]}"

success "Backup verification OK: $backup_file"
