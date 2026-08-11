#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

ARTIFACT_PATH=""
EXPECTED_SHA256=""
EXPECTED_SOURCE_COMMIT=""
EXPECTED_RELEASE_VERSION="1.0.0-rc.1-rehearsal.1"
EXPECTED_MIGRATION_VERSION="0008_security_hardening_phase_1.sql"
BASELINE_SOURCE_COMMIT="30b39ec0034f335bdbda210f09c8ad66a26a25a2"

usage() {
  cat <<'USAGE'
Usage:
  infrastructure/validation/validate-forward-rehearsal-candidate.sh \
    --artifact <artifact.tar.gz> \
    --sha256 <expected-sha256> \
    --source-commit <commit-sha>

Optional:
  --release-version <release-version>
  --migration-version <migration-file>
  --baseline-source-commit <commit-sha>
  --verbose

The validator checks the forward rehearsal artifact only. It does not deploy,
rollback, rebuild, or touch live data.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --artifact)
      ARTIFACT_PATH="$2"
      shift 2
      ;;
    --sha256)
      EXPECTED_SHA256="$2"
      shift 2
      ;;
    --source-commit)
      EXPECTED_SOURCE_COMMIT="$2"
      shift 2
      ;;
    --release-version)
      EXPECTED_RELEASE_VERSION="$2"
      shift 2
      ;;
    --migration-version)
      EXPECTED_MIGRATION_VERSION="$2"
      shift 2
      ;;
    --baseline-source-commit)
      BASELINE_SOURCE_COMMIT="$2"
      shift 2
      ;;
    --verbose)
      enable_verbose
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

[[ -n "$ARTIFACT_PATH" ]] || die "Missing required artifact path."
[[ -n "$EXPECTED_SHA256" ]] || die "Missing required expected artifact SHA-256."
[[ -n "$EXPECTED_SOURCE_COMMIT" ]] || die "Missing required expected source commit."
[[ -f "$ARTIFACT_PATH" ]] || die "Artifact not found: $ARTIFACT_PATH"

require_command tar
require_command python3
require_command git

actual_sha256="$($(sha256_command) "$ARTIFACT_PATH" | awk '{print $1}')"
[[ "$actual_sha256" == "$EXPECTED_SHA256" ]] || die "Forward artifact SHA-256 mismatch. expected=$EXPECTED_SHA256 actual=$actual_sha256"

if ! git merge-base --is-ancestor "$BASELINE_SOURCE_COMMIT" "$EXPECTED_SOURCE_COMMIT"; then
  die "Forward source commit is not newer than or descended from baseline $BASELINE_SOURCE_COMMIT: $EXPECTED_SOURCE_COMMIT"
fi

if [[ "$EXPECTED_SOURCE_COMMIT" == "$BASELINE_SOURCE_COMMIT" ]]; then
  die "Forward source commit must be newer than baseline $BASELINE_SOURCE_COMMIT"
fi

artifact_listing="$(mktemp)"
manifest_file="$(mktemp)"
cleanup() {
  rm -f "$artifact_listing" "$manifest_file"
}
trap cleanup EXIT

tar -tzf "$ARTIFACT_PATH" | sed 's#^\./##' > "$artifact_listing"

require_entry() {
  local entry="$1"
  grep -qx "$entry" "$artifact_listing" || die "Forward artifact missing required entry: $entry"
}

require_entry "RELEASE_ARTIFACT_MANIFEST.json"
require_entry "pnpm-lock.yaml"
require_entry "package.json"
require_entry "pnpm-workspace.yaml"
require_entry "apps/api/dist/apps/api/src/main.js"
require_entry "apps/web/.next/BUILD_ID"
require_entry "deploy/staging/docker-compose.artifact.yml"
require_entry "infrastructure/deploy/deploy-staging-artifact.sh"
require_entry "infrastructure/deploy/rollback-staging-artifact.sh"
require_entry "infrastructure/deploy/build-runtime-images-from-artifact.sh"
require_entry "infrastructure/validation/validate-artifact-deploy.sh"
require_entry "infrastructure/validation/validate-rollback-baseline.sh"

tar -xOzf "$ARTIFACT_PATH" RELEASE_ARTIFACT_MANIFEST.json > "$manifest_file"

python3 - "$manifest_file" "$EXPECTED_RELEASE_VERSION" "$EXPECTED_SOURCE_COMMIT" "$EXPECTED_MIGRATION_VERSION" <<'PY'
import json
import sys

manifest_path, expected_release, expected_commit, expected_migration = sys.argv[1:5]
with open(manifest_path, "r", encoding="utf-8") as handle:
    manifest = json.load(handle)

if manifest.get("releaseCandidate") != expected_release:
    raise SystemExit(
        f"Forward release version mismatch. expected={expected_release} actual={manifest.get('releaseCandidate')}"
    )

source_commit = manifest.get("source", {}).get("commit")
if source_commit != expected_commit:
    raise SystemExit(f"Forward source commit mismatch. expected={expected_commit} actual={source_commit}")

migration = manifest.get("database", {}).get("latestMigration")
if migration != expected_migration:
    raise SystemExit(f"Migration mismatch. expected={expected_migration} actual={migration}")

if any(migration_name > expected_migration for migration_name in manifest.get("database", {}).get("migrations", [])):
    raise SystemExit(f"Artifact contains a migration newer than {expected_migration}")
PY

if tar -xOzf "$ARTIFACT_PATH" deploy/staging/scripts/staging-smoke-test.mjs | grep -q "projectIdentity"; then
  :
else
  die "Forward artifact smoke test is missing projectIdentity payload."
fi

tar -xOzf "$ARTIFACT_PATH" deploy/staging/scripts/staging-smoke-test.mjs | grep -q 'projectOrigin: "ORIGINAL_CREATION"' \
  || die "Forward artifact smoke test missing projectIdentity.projectOrigin ORIGINAL_CREATION."
tar -xOzf "$ARTIFACT_PATH" deploy/staging/scripts/staging-smoke-test.mjs | grep -q 'rightsStatus: "ORIGINAL_CREATION"' \
  || die "Forward artifact smoke test missing projectIdentity.rightsStatus ORIGINAL_CREATION."
tar -xOzf "$ARTIFACT_PATH" deploy/staging/scripts/staging-smoke-test.mjs | grep -q 'publicationType: "BOOK"' \
  || die "Forward artifact smoke test missing publicationType BOOK."

success "Forward rehearsal artifact validated: $ARTIFACT_PATH"
success "Forward artifact SHA-256 verified: $actual_sha256"
success "Forward source commit verified: $EXPECTED_SOURCE_COMMIT"
success "Forward migration compatibility verified: $EXPECTED_MIGRATION_VERSION"
