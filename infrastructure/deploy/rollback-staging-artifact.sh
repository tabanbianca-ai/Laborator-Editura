#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIRM=""
ARTIFACT_PATH=""
EXPECTED_SHA256=""
EXPECTED_SOURCE_COMMIT=""
EXPECTED_MIGRATION_VERSION=""
API_IMAGE=""
WEB_IMAGE=""
EXPECTED_API_IMAGE_ID=""
EXPECTED_WEB_IMAGE_ID=""
RUNTIME_METADATA_PATH=""
RUNTIME_IMAGE_BUNDLE_PATH=""
PROVENANCE_PATH=""
CURRENT_RELEASE_IDENTITY=""
BACKUP_PATH=""
ARTIFACT_COMPOSE_FILE="$REPO_ROOT/deploy/staging/docker-compose.artifact.yml"
DRY_RUN=false
ARGS=()

usage() {
  cat <<'USAGE'
Usage:
  infrastructure/deploy/rollback-staging-artifact.sh \
    --confirm ROLLBACK \
    --artifact <approved-artifact.tar.gz> \
    --sha256 <artifact-sha256> \
    --source-commit <commit-sha> \
    --migration-version <migration-file> \
    --api-image <immutable-api-image-reference> \
    --web-image <immutable-web-image-reference> \
    --api-image-id <sha256:image-id> \
    --web-image-id <sha256:image-id> \
    --runtime-metadata <runtime-images.json> \
    --runtime-image-bundle <runtime-images.tar> \
    --provenance <build-provenance.json> \
    --current-release-identity <release-identity.json> \
    --backup <verified-backup.tar.gz>

Use --dry-run --skip-compose for isolated validation. A live rollback requires
a canonical verified backup. All deployment arguments are delegated to the
existing artifact deployment mechanism after rollback preflight succeeds.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --confirm)
      CONFIRM="$2"
      shift 2
      ;;
    --artifact)
      ARTIFACT_PATH="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --sha256)
      EXPECTED_SHA256="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --source-commit)
      EXPECTED_SOURCE_COMMIT="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --migration-version)
      EXPECTED_MIGRATION_VERSION="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --api-image)
      API_IMAGE="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --web-image)
      WEB_IMAGE="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --api-image-id)
      EXPECTED_API_IMAGE_ID="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --web-image-id)
      EXPECTED_WEB_IMAGE_ID="$2"
      ARGS+=("$1" "$2")
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
    --backup)
      BACKUP_PATH="$2"
      shift 2
      ;;
    --compose-file)
      ARTIFACT_COMPOSE_FILE="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      ARGS+=("$1")
      shift
      ;;
    --verbose)
      enable_verbose
      ARGS+=("--verbose")
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      ARGS+=("$1")
      shift
      ;;
  esac
done

require_confirm "ROLLBACK" "$CONFIRM"

[[ -n "$ARTIFACT_PATH" ]] || die "Missing required rollback artifact."
[[ -n "$EXPECTED_SHA256" ]] || die "Missing required rollback artifact SHA-256."
[[ -n "$EXPECTED_SOURCE_COMMIT" ]] || die "Missing required rollback source commit."
[[ -n "$EXPECTED_MIGRATION_VERSION" ]] || die "Missing required rollback migration version."
[[ -n "$API_IMAGE" ]] || die "Missing required rollback API image reference."
[[ -n "$WEB_IMAGE" ]] || die "Missing required rollback WEB image reference."
[[ -n "$EXPECTED_API_IMAGE_ID" ]] || die "Missing required rollback API image ID."
[[ -n "$EXPECTED_WEB_IMAGE_ID" ]] || die "Missing required rollback WEB image ID."
[[ -n "$RUNTIME_METADATA_PATH" ]] || die "Missing required runtime image metadata."
[[ -n "$RUNTIME_IMAGE_BUNDLE_PATH" ]] || die "Missing required runtime image bundle."
[[ -n "$PROVENANCE_PATH" ]] || die "Missing required build provenance."
[[ -n "$CURRENT_RELEASE_IDENTITY" ]] || die "Missing required current release identity."
[[ -f "$ARTIFACT_COMPOSE_FILE" ]] || die "Artifact compose file not found: $ARTIFACT_COMPOSE_FILE"

if [[ "$DRY_RUN" == "false" ]]; then
  [[ -n "$BACKUP_PATH" ]] || die "A verified canonical backup is required before live rollback."
  "$REPO_ROOT/infrastructure/backup/verify-backup.sh" "$BACKUP_PATH"
fi

grep -Eq '^[[:space:]]*-[[:space:]]+runtime-db:/var/lib/laborator([/:]|$)' "$ARTIFACT_COMPOSE_FILE" ||
  die "Artifact compose file does not preserve the runtime-db volume."
grep -Eq '^[[:space:]]*-[[:space:]]+runtime-backups:/var/backups/laborator/staging([/:]|$)' "$ARTIFACT_COMPOSE_FILE" ||
  die "Artifact compose file does not preserve the runtime-backups volume."
if grep -Eq 'docker[[:space:]]+(volume[[:space:]]+rm|compose.*down.*-v)|^[[:space:]]*tmpfs:' "$ARTIFACT_COMPOSE_FILE"; then
  die "Artifact compose file contains destructive or ephemeral persistent-data configuration."
fi

"$REPO_ROOT/infrastructure/validation/validate-rollback-baseline.sh" \
  --artifact "$ARTIFACT_PATH" \
  --sha256 "$EXPECTED_SHA256" \
  --source-commit "$EXPECTED_SOURCE_COMMIT" \
  --migration-version "$EXPECTED_MIGRATION_VERSION" \
  --api-image "$API_IMAGE" \
  --web-image "$WEB_IMAGE" \
  --api-image-id "$EXPECTED_API_IMAGE_ID" \
  --web-image-id "$EXPECTED_WEB_IMAGE_ID" \
  --runtime-metadata "$RUNTIME_METADATA_PATH" \
  --runtime-image-bundle "$RUNTIME_IMAGE_BUNDLE_PATH" \
  --provenance "$PROVENANCE_PATH" \
  --current-release-identity "$CURRENT_RELEASE_IDENTITY" \
  --require-runtime-evidence

success "Rollback preflight passed. Delegating to the canonical artifact deployment mechanism."
exec "$REPO_ROOT/infrastructure/deploy/deploy-staging-artifact.sh" "${ARGS[@]}"
