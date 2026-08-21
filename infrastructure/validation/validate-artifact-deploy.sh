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
DUMMY_API_IMAGE="${DUMMY_API_IMAGE:-laborator-api@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}"
DUMMY_WEB_IMAGE="${DUMMY_WEB_IMAGE:-laborator-web@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb}"

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
    --verbose)
      enable_verbose
      shift
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

cd "$REPO_ROOT"

log "Checking artifact deploy shell syntax."
bash -n infrastructure/deploy/build-runtime-images-from-artifact.sh
bash -n infrastructure/deploy/deploy-staging-artifact.sh
bash -n infrastructure/deploy/rollback-staging-artifact.sh
bash -n infrastructure/validation/validate-rollback-baseline.sh

log "Checking rollback baseline eligibility."
infrastructure/validation/validate-rollback-baseline.sh \
  --artifact "$ARTIFACT_PATH" \
  --sha256 "$EXPECTED_SHA256" \
  --source-commit "$EXPECTED_SOURCE_COMMIT" \
  --migration-version "$EXPECTED_MIGRATION_VERSION" \
  --api-image-id "sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451" \
  --web-image-id "sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e"

log "Checking runtime image build dry-run from verified artifact."
infrastructure/deploy/build-runtime-images-from-artifact.sh \
  --artifact "$ARTIFACT_PATH" \
  --sha256 "$EXPECTED_SHA256" \
  --source-commit "$EXPECTED_SOURCE_COMMIT" \
  --api-image "$DUMMY_API_IMAGE" \
  --web-image "$DUMMY_WEB_IMAGE" \
  --dry-run

log "Checking artifact compose file does not rebuild source."
if grep -Eq '^[[:space:]]*build:' deploy/staging/docker-compose.artifact.yml; then
  die "Artifact compose file contains a build directive."
fi

if grep -Eq 'pnpm[[:space:]]+(install|build)|docker[[:space:]]+build|--build' deploy/staging/docker-compose.artifact.yml; then
  die "Artifact compose file contains an install/build/rebuild command."
fi

log "Checking checksum success path."
tmp_release_dir="$(mktemp -d)"
if [[ "${VERBOSE:-false}" == "true" ]]; then
  infrastructure/deploy/deploy-staging-artifact.sh \
    --config infrastructure/backup/laborator-backup.env.example \
    --artifact "$ARTIFACT_PATH" \
    --sha256 "$EXPECTED_SHA256" \
    --source-commit "$EXPECTED_SOURCE_COMMIT" \
    --migration-version "$EXPECTED_MIGRATION_VERSION" \
    --api-image "$DUMMY_API_IMAGE" \
    --web-image "$DUMMY_WEB_IMAGE" \
    --release-dir "$tmp_release_dir" \
    --compose-file "$REPO_ROOT/deploy/staging/docker-compose.artifact.yml" \
    --env-file "$REPO_ROOT/deploy/staging/.env.staging.example" \
    --dry-run \
    --skip-compose \
    --verbose
else
  infrastructure/deploy/deploy-staging-artifact.sh \
    --config infrastructure/backup/laborator-backup.env.example \
    --artifact "$ARTIFACT_PATH" \
    --sha256 "$EXPECTED_SHA256" \
    --source-commit "$EXPECTED_SOURCE_COMMIT" \
    --migration-version "$EXPECTED_MIGRATION_VERSION" \
    --api-image "$DUMMY_API_IMAGE" \
    --web-image "$DUMMY_WEB_IMAGE" \
    --release-dir "$tmp_release_dir" \
    --compose-file "$REPO_ROOT/deploy/staging/docker-compose.artifact.yml" \
    --env-file "$REPO_ROOT/deploy/staging/.env.staging.example" \
    --dry-run \
    --skip-compose
fi

log "Checking checksum mismatch blocks deployment."
if infrastructure/deploy/deploy-staging-artifact.sh \
  --config infrastructure/backup/laborator-backup.env.example \
  --artifact "$ARTIFACT_PATH" \
  --sha256 "0000000000000000000000000000000000000000000000000000000000000000" \
  --source-commit "$EXPECTED_SOURCE_COMMIT" \
  --migration-version "$EXPECTED_MIGRATION_VERSION" \
  --api-image "$DUMMY_API_IMAGE" \
  --web-image "$DUMMY_WEB_IMAGE" \
  --release-dir "$tmp_release_dir" \
  --compose-file "$REPO_ROOT/deploy/staging/docker-compose.artifact.yml" \
  --env-file "$REPO_ROOT/deploy/staging/.env.staging.example" \
  --dry-run \
  --skip-compose >/tmp/laborator-artifact-mismatch.log 2>&1; then
  cat /tmp/laborator-artifact-mismatch.log >&2
  die "Digest mismatch did not block deployment."
fi

log "Checking implicit latest-style runtime image references are rejected."
if infrastructure/deploy/deploy-staging-artifact.sh \
  --config infrastructure/backup/laborator-backup.env.example \
  --artifact "$ARTIFACT_PATH" \
  --sha256 "$EXPECTED_SHA256" \
  --source-commit "$EXPECTED_SOURCE_COMMIT" \
  --migration-version "$EXPECTED_MIGRATION_VERSION" \
  --api-image "staging-api:latest" \
  --web-image "$DUMMY_WEB_IMAGE" \
  --release-dir "$tmp_release_dir" \
  --compose-file "$REPO_ROOT/deploy/staging/docker-compose.artifact.yml" \
  --env-file "$REPO_ROOT/deploy/staging/.env.staging.example" \
  --dry-run \
  --skip-compose >/tmp/laborator-artifact-latest.log 2>&1; then
  cat /tmp/laborator-artifact-latest.log >&2
  die "Latest image reference did not block deployment."
fi

rm -rf "$tmp_release_dir" /tmp/laborator-artifact-mismatch.log /tmp/laborator-artifact-latest.log
success "Artifact deployment validation completed."
