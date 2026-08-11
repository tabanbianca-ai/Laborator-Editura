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

tar_has_entry() {
  local expected="$1"
  tar -tzf "$backup_file" | sed 's#^\./##' | grep -qx "$expected"
}

tar_extract_entry() {
  local expected="$1"
  if tar -xOzf "$backup_file" "$expected" 2>/dev/null; then
    return 0
  fi

  tar -xOzf "$backup_file" "./$expected"
}

log "Verifying archive structure."
tar_has_entry "manifest.json" || die "manifest.json missing from backup"
tar_has_entry "docker-volumes/runtime-db.tar.gz" || die "runtime-db volume archive missing"
tar_has_entry "docker-volumes/runtime-backups.tar.gz" || die "runtime-backups volume archive missing"

if tar_has_entry "metadata/release-identity.json"; then
  log "Verifying release identity metadata."
  require_command python3
  release_identity_tmp="$(mktemp)"
  tar_extract_entry "metadata/release-identity.json" > "$release_identity_tmp"
  python3 - "$release_identity_tmp" <<'PY'
import json
import os
import sys

with open(sys.argv[1], "r", encoding="utf-8") as handle:
    identity = json.load(handle)

expected = {
    "deploymentId": os.environ.get("EXPECTED_DEPLOYMENT_ID"),
    "sourceCommit": os.environ.get("EXPECTED_SOURCE_COMMIT"),
    "artifactSha256": os.environ.get("EXPECTED_ARTIFACT_SHA256"),
    "migrationVersion": os.environ.get("EXPECTED_MIGRATION_VERSION"),
}

missing = [key for key in ["deploymentId", "sourceCommit", "artifactSha256", "migrationVersion"] if not identity.get(key)]
if missing:
    raise SystemExit(f"release identity missing required field(s): {', '.join(missing)}")

for key, value in expected.items():
    if value and identity.get(key) != value:
        raise SystemExit(f"release identity mismatch for {key}: expected {value}, received {identity.get(key)}")
PY
  rm -f "$release_identity_tmp"
else
  if [[ -n "${EXPECTED_DEPLOYMENT_ID:-}${EXPECTED_SOURCE_COMMIT:-}${EXPECTED_ARTIFACT_SHA256:-}${EXPECTED_MIGRATION_VERSION:-}" ]]; then
    die "release identity metadata missing from backup"
  fi
  warn "Release identity metadata missing from backup."
fi

success "Backup verification OK: $backup_file"
