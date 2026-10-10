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
EXPECTED_API_IMAGE=""
EXPECTED_WEB_IMAGE=""
RUNTIME_METADATA_PATH=""
RUNTIME_IMAGE_BUNDLE_PATH=""
PROVENANCE_PATH=""
CURRENT_RELEASE_IDENTITY=""
REQUIRE_RUNTIME_EVIDENCE=false

usage() {
  cat <<'USAGE'
Usage:
  infrastructure/validation/validate-rollback-baseline.sh \
    --artifact <artifact.tar.gz> \
    --sha256 <expected-sha256> \
    --source-commit <commit-sha> \
    --migration-version <migration-file> \
    [--api-image <immutable-image-reference>] \
    [--web-image <immutable-image-reference>] \
    --api-image-id <sha256:image-id> \
    --web-image-id <sha256:image-id> \
    [--runtime-metadata <runtime-images.json>] \
    [--runtime-image-bundle <runtime-images.tar>] \
    [--provenance <build-provenance.json>] \
    [--current-release-identity <release-identity.json>] \
    [--require-runtime-evidence]

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
    --api-image)
      EXPECTED_API_IMAGE="$2"
      shift 2
      ;;
    --web-image)
      EXPECTED_WEB_IMAGE="$2"
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
    --runtime-metadata)
      RUNTIME_METADATA_PATH="$2"
      shift 2
      ;;
    --runtime-image-bundle)
      RUNTIME_IMAGE_BUNDLE_PATH="$2"
      shift 2
      ;;
    --provenance)
      PROVENANCE_PATH="$2"
      shift 2
      ;;
    --current-release-identity)
      CURRENT_RELEASE_IDENTITY="$2"
      shift 2
      ;;
    --require-runtime-evidence)
      REQUIRE_RUNTIME_EVIDENCE=true
      shift
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
runtime_bundle_manifest=""
cleanup() {
  rm -f "$artifact_listing" "$manifest_file"
  if [[ -n "$runtime_bundle_manifest" ]]; then
    rm -f "$runtime_bundle_manifest"
  fi
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

if [[ "$REQUIRE_RUNTIME_EVIDENCE" == "true" ]]; then
  [[ -n "$EXPECTED_API_IMAGE" ]] || die "Runtime evidence requires an expected API image reference."
  [[ -n "$EXPECTED_WEB_IMAGE" ]] || die "Runtime evidence requires an expected WEB image reference."
  [[ -f "$RUNTIME_METADATA_PATH" ]] || die "Runtime image metadata not found: $RUNTIME_METADATA_PATH"
  [[ -f "$RUNTIME_IMAGE_BUNDLE_PATH" ]] || die "Runtime image bundle not found: $RUNTIME_IMAGE_BUNDLE_PATH"
  [[ -f "$PROVENANCE_PATH" ]] || die "Build provenance not found: $PROVENANCE_PATH"
  [[ -f "$CURRENT_RELEASE_IDENTITY" ]] || die "Current release identity not found: $CURRENT_RELEASE_IDENTITY"

  runtime_bundle_sha256="$($(sha256_command) "$RUNTIME_IMAGE_BUNDLE_PATH" | awk '{print $1}')"
  runtime_bundle_manifest="$(mktemp)"
  runtime_bundle_manifest_entry="$(
    tar -tf "$RUNTIME_IMAGE_BUNDLE_PATH" |
      awk '{ normalized=$0; sub(/^\.\//, "", normalized); if (normalized == "manifest.json") { print $0; exit } }'
  )"
  [[ -n "$runtime_bundle_manifest_entry" ]] ||
    die "Runtime image bundle does not contain Docker manifest.json."
  tar -xOf "$RUNTIME_IMAGE_BUNDLE_PATH" "$runtime_bundle_manifest_entry" > "$runtime_bundle_manifest"

  python3 - \
    "$manifest_file" \
    "$RUNTIME_METADATA_PATH" \
    "$PROVENANCE_PATH" \
    "$CURRENT_RELEASE_IDENTITY" \
    "$EXPECTED_SHA256" \
    "$EXPECTED_SOURCE_COMMIT" \
    "$EXPECTED_MIGRATION_VERSION" \
    "$EXPECTED_API_IMAGE" \
    "$EXPECTED_WEB_IMAGE" \
    "$EXPECTED_API_IMAGE_ID" \
    "$EXPECTED_WEB_IMAGE_ID" \
    "$runtime_bundle_sha256" \
    "$runtime_bundle_manifest" <<'PY'
import json
import sys
from pathlib import PurePosixPath

(
    manifest_path,
    runtime_metadata_path,
    provenance_path,
    current_identity_path,
    expected_artifact_sha,
    expected_source_commit,
    expected_migration,
    expected_api_image,
    expected_web_image,
    expected_api_image_id,
    expected_web_image_id,
    actual_bundle_sha,
    runtime_bundle_manifest_path,
) = sys.argv[1:]


def read_json(path, description):
    try:
        with open(path, "r", encoding="utf-8") as handle:
            value = json.load(handle)
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f"Unable to read {description}: {error}") from error
    if not isinstance(value, dict):
        raise SystemExit(f"{description} must be a JSON object")
    return value


manifest = read_json(manifest_path, "release artifact manifest")
runtime = read_json(runtime_metadata_path, "runtime image metadata")
provenance = read_json(provenance_path, "build provenance")
current = read_json(current_identity_path, "current release identity")

try:
    with open(runtime_bundle_manifest_path, "r", encoding="utf-8") as handle:
        docker_manifest = json.load(handle)
except (OSError, json.JSONDecodeError) as error:
    raise SystemExit(f"Unable to read Docker image bundle manifest: {error}") from error

if not isinstance(docker_manifest, list):
    raise SystemExit("Docker image bundle manifest must be a JSON array")

expected_runtime = {
    "sourceCommit": expected_source_commit,
    "artifactSha256": expected_artifact_sha,
    "migrationVersion": expected_migration,
    "apiImage": expected_api_image,
    "webImage": expected_web_image,
    "apiImageId": expected_api_image_id,
    "webImageId": expected_web_image_id,
}
for field, expected in expected_runtime.items():
    actual = runtime.get(field)
    if actual != expected:
        raise SystemExit(
            f"Runtime image metadata mismatch for {field}. expected={expected} actual={actual}"
        )

provenance_checks = {
    "source.commit": (provenance.get("source") or {}).get("commit"),
    "releaseArtifact.sha256": (provenance.get("releaseArtifact") or {}).get("sha256"),
    "releaseArtifact.migrationVersion": (provenance.get("releaseArtifact") or {}).get(
        "migrationVersion"
    ),
    "runtimeImages.bundleSha256": (provenance.get("runtimeImages") or {}).get(
        "bundleSha256"
    ),
    "runtimeImages.apiImage": (provenance.get("runtimeImages") or {}).get("apiImage"),
    "runtimeImages.webImage": (provenance.get("runtimeImages") or {}).get("webImage"),
    "runtimeImages.apiImageId": (provenance.get("runtimeImages") or {}).get("apiImageId"),
    "runtimeImages.webImageId": (provenance.get("runtimeImages") or {}).get("webImageId"),
}
expected_provenance = {
    "source.commit": expected_source_commit,
    "releaseArtifact.sha256": expected_artifact_sha,
    "releaseArtifact.migrationVersion": expected_migration,
    "runtimeImages.bundleSha256": actual_bundle_sha,
    "runtimeImages.apiImage": expected_api_image,
    "runtimeImages.webImage": expected_web_image,
    "runtimeImages.apiImageId": expected_api_image_id,
    "runtimeImages.webImageId": expected_web_image_id,
}
for field, actual in provenance_checks.items():
    expected = expected_provenance[field]
    if actual != expected:
        raise SystemExit(
            f"Build provenance mismatch for {field}. expected={expected} actual={actual}"
        )

if current.get("deploymentStatus") != "deployed":
    raise SystemExit("Current release identity must describe a deployed release")
if current.get("sourceCommit") == expected_source_commit:
    raise SystemExit("Rollback target must differ from the currently deployed source commit")
if current.get("migrationVersion") != expected_migration:
    raise SystemExit(
        "Rollback migration is incompatible with the current runtime database. "
        f"current={current.get('migrationVersion')} target={expected_migration}"
    )
if manifest.get("source", {}).get("commit") != runtime.get("sourceCommit"):
    raise SystemExit("Release manifest and runtime image metadata source commits differ")


def verify_bundled_image(image_reference, image_id, service):
    expected_config = image_id.removeprefix("sha256:")
    for entry in docker_manifest:
        if not isinstance(entry, dict) or image_reference not in entry.get("RepoTags", []):
            continue
        config = PurePosixPath(str(entry.get("Config", ""))).name
        if config == f"{expected_config}.json":
            return
        raise SystemExit(
            f"{service} image config digest mismatch in runtime bundle. "
            f"expected={expected_config}.json actual={config}"
        )
    raise SystemExit(f"{service} image reference is missing from runtime bundle: {image_reference}")


verify_bundled_image(expected_api_image, expected_api_image_id, "API")
verify_bundled_image(expected_web_image, expected_web_image_id, "WEB")
PY

  success "Rollback runtime bundle SHA-256 verified: $runtime_bundle_sha256"
  success "Rollback runtime metadata and build provenance verified."
  success "Rollback migration compatibility verified against current release identity."
fi

success "Rollback baseline artifact eligible: $ARTIFACT_PATH"
success "Rollback baseline artifact SHA-256 verified: $actual_sha256"
success "Rollback baseline source commit verified: $EXPECTED_SOURCE_COMMIT"
success "Rollback baseline API image ID recorded: $EXPECTED_API_IMAGE_ID"
success "Rollback baseline WEB image ID recorded: $EXPECTED_WEB_IMAGE_ID"
