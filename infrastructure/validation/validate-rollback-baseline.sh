#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

ARTIFACT_PATH="${ARTIFACT_PATH:-$REPO_ROOT/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz}"
EXPECTED_SHA256="${EXPECTED_SHA256:-9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e}"
EXPECTED_SOURCE_COMMIT="${EXPECTED_SOURCE_COMMIT:-30b39ec0034f335bdbda210f09c8ad66a26a25a2}"
EXPECTED_MIGRATION_VERSION="${EXPECTED_MIGRATION_VERSION:-0008_security_hardening_phase_1.sql}"
EXPECTED_API_IMAGE_ID="${EXPECTED_API_IMAGE_ID:-sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451}"
EXPECTED_WEB_IMAGE_ID="${EXPECTED_WEB_IMAGE_ID:-sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e}"

usage() {
  cat <<'USAGE'
Usage:
  infrastructure/validation/validate-rollback-baseline.sh \
    --artifact <artifact.tar.gz> \
    --sha256 <expected-sha256> \
    --source-commit <commit-sha> \
    --migration-version <migration-file> \
    --api-image-id <sha256:image-id> \
    --web-image-id <sha256:image-id>

This validates rollback baseline eligibility only. It does not deploy,
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
    --migration-version)
      EXPECTED_MIGRATION_VERSION="$2"
      shift 2
      ;;
    --api-image-id)
      EXPECTED_API_IMAGE_ID="$2"
      shift 2
      ;;
    --web-image-id)
      EXPECTED_WEB_IMAGE_ID="$2"
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
[[ -n "$EXPECTED_MIGRATION_VERSION" ]] || die "Missing required expected migration version."
[[ -n "$EXPECTED_API_IMAGE_ID" ]] || die "Missing required expected API image ID."
[[ -n "$EXPECTED_WEB_IMAGE_ID" ]] || die "Missing required expected WEB image ID."
[[ -f "$ARTIFACT_PATH" ]] || die "Artifact not found: $ARTIFACT_PATH"

require_command tar
require_command python3

case "$EXPECTED_API_IMAGE_ID" in
  sha256:*) ;;
  *) die "API image ID must be an immutable sha256 image ID." ;;
esac

case "$EXPECTED_WEB_IMAGE_ID" in
  sha256:*) ;;
  *) die "WEB image ID must be an immutable sha256 image ID." ;;
esac

actual_sha256="$($(sha256_command) "$ARTIFACT_PATH" | awk '{print $1}')"
[[ "$actual_sha256" == "$EXPECTED_SHA256" ]] || die "Artifact SHA-256 mismatch. expected=$EXPECTED_SHA256 actual=$actual_sha256"

artifact_listing="$(mktemp)"
manifest_file="$(mktemp)"
cleanup() {
  rm -f "$artifact_listing" "$manifest_file"
}
trap cleanup EXIT

tar -tzf "$ARTIFACT_PATH" | sed 's#^\./##' > "$artifact_listing"
grep -qx "RELEASE_ARTIFACT_MANIFEST.json" "$artifact_listing" || die "Release artifact manifest missing."
grep -qx "pnpm-lock.yaml" "$artifact_listing" || die "Rollback baseline rejected: pnpm-lock.yaml missing. Frozen dependency resolution cannot be proven."
grep -qx "apps/api/dist/apps/api/src/main.js" "$artifact_listing" || die "Rollback baseline rejected: API build output missing."
grep -qx "apps/web/.next/BUILD_ID" "$artifact_listing" || die "Rollback baseline rejected: web build output missing."

tar -xOzf "$ARTIFACT_PATH" RELEASE_ARTIFACT_MANIFEST.json > "$manifest_file"

python3 - "$manifest_file" "$EXPECTED_SOURCE_COMMIT" "$EXPECTED_MIGRATION_VERSION" <<'PY'
import json
import sys

manifest_path, expected_commit, expected_migration = sys.argv[1:4]
with open(manifest_path, "r", encoding="utf-8") as handle:
    manifest = json.load(handle)

source_commit = manifest.get("source", {}).get("commit")
migration = manifest.get("database", {}).get("latestMigration")

if source_commit != expected_commit:
    raise SystemExit(f"Artifact source commit mismatch. expected={expected_commit} actual={source_commit}")

if migration != expected_migration:
    raise SystemExit(f"Artifact migration mismatch. expected={expected_migration} actual={migration}")
PY

success "Rollback baseline artifact eligible: $ARTIFACT_PATH"
success "Rollback baseline artifact SHA-256 verified: $actual_sha256"
success "Rollback baseline source commit verified: $EXPECTED_SOURCE_COMMIT"
success "Rollback baseline API image ID recorded: $EXPECTED_API_IMAGE_ID"
success "Rollback baseline WEB image ID recorded: $EXPECTED_WEB_IMAGE_ID"
