#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_DIR="${CONFIG_DIR:-${LABORATOR_CONFIG_DIR:-/etc/laborator}}"
CONFIG_FILE="${LABORATOR_INFRA_CONFIG:-$CONFIG_DIR/infrastructure.env}"
CONFIG_EXAMPLE="$REPO_ROOT/infrastructure/backup/laborator-backup.env.example"
ARTIFACT_PATH=""
EXPECTED_SHA256=""
EXPECTED_SOURCE_COMMIT=""
EXPECTED_MIGRATION_VERSION=""
API_IMAGE="${STAGING_API_IMAGE:-}"
WEB_IMAGE="${STAGING_WEB_IMAGE:-}"
API_IMAGE_ID="${STAGING_API_IMAGE_ID:-}"
WEB_IMAGE_ID="${STAGING_WEB_IMAGE_ID:-}"
RELEASES_DIR="${STAGING_RELEASES_DIR:-}"
DEPLOYMENT_ID="${STAGING_DEPLOYMENT_ID:-}"
ARTIFACT_COMPOSE_FILE="${ARTIFACT_COMPOSE_FILE:-}"
ENV_FILE="${ENV_FILE:-}"
DRY_RUN=false
SKIP_COMPOSE=false

usage() {
  cat <<'USAGE'
Usage:
  infrastructure/deploy/deploy-staging-artifact.sh \
    --artifact <artifact.tar.gz> \
    --sha256 <expected-sha256> \
    --source-commit <commit-sha> \
    --api-image <api-image-reference> \
    --web-image <web-image-reference>

Optional:
  --migration-version <migration-file>
  --api-image-id <sha256:image-id>
  --web-image-id <sha256:image-id>
  --config <infrastructure.env>
  --release-dir <directory>
  --compose-file <docker-compose.artifact.yml>
  --env-file <.env.staging>
  --deployment-id <id>
  --dry-run
  --skip-compose
  --verbose
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
      API_IMAGE="$2"
      shift 2
      ;;
    --web-image)
      WEB_IMAGE="$2"
      shift 2
      ;;
    --api-image-id)
      API_IMAGE_ID="$2"
      shift 2
      ;;
    --web-image-id)
      WEB_IMAGE_ID="$2"
      shift 2
      ;;
    --config)
      CONFIG_FILE="$2"
      shift 2
      ;;
    --release-dir)
      RELEASES_DIR="$2"
      shift 2
      ;;
    --compose-file)
      ARTIFACT_COMPOSE_FILE="$2"
      shift 2
      ;;
    --env-file)
      ENV_FILE="$2"
      shift 2
      ;;
    --deployment-id)
      DEPLOYMENT_ID="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-compose)
      SKIP_COMPOSE=true
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

CLI_ENV_FILE="$ENV_FILE"
CLI_ARTIFACT_COMPOSE_FILE="$ARTIFACT_COMPOSE_FILE"
CLI_RELEASES_DIR="$RELEASES_DIR"

load_or_bootstrap_config_file "$CONFIG_FILE" "$CONFIG_EXAMPLE" "$DRY_RUN"
normalize_path_aliases

if [[ -n "$CLI_ENV_FILE" ]]; then
  ENV_FILE="$CLI_ENV_FILE"
fi
if [[ -n "$CLI_ARTIFACT_COMPOSE_FILE" ]]; then
  ARTIFACT_COMPOSE_FILE="$CLI_ARTIFACT_COMPOSE_FILE"
fi
if [[ -n "$CLI_RELEASES_DIR" ]]; then
  RELEASES_DIR="$CLI_RELEASES_DIR"
fi

: "${PROJECT_ROOT:=$APP_ROOT}"
: "${APP_ROOT:=$PROJECT_ROOT}"
: "${ENV_FILE:=$APP_ROOT/deploy/staging/.env.staging}"
: "${ARTIFACT_COMPOSE_FILE:=$APP_ROOT/deploy/staging/docker-compose.artifact.yml}"
: "${RELEASES_DIR:=$APP_ROOT/.releases/staging}"
: "${DEPLOY_HEALTH_URL:=http://127.0.0.1:3000}"
: "${DEPLOY_API_HEALTH_URL:=http://127.0.0.1:3001/health}"

verify_running_container_label() {
  local service="$1"
  local label="$2"
  local expected="$3"
  local container_id
  local actual

  container_id="$(docker compose --env-file "$ENV_FILE" --env-file "$release_env_file" -f "$ARTIFACT_COMPOSE_FILE" ps -q "$service")"
  [[ -n "$container_id" ]] || die "No running container found for service: $service"
  actual="$(docker inspect --format "{{ index .Config.Labels \"$label\" }}" "$container_id")"
  [[ "$actual" == "$expected" ]] || die "Container label mismatch for $service $label. expected=$expected actual=$actual"
  success "Verified $service deployed artifact digest label: $actual"
}

verify_running_container_image_id() {
  local service="$1"
  local expected="$2"
  local container_id
  local actual

  [[ -n "$expected" ]] || return 0
  container_id="$(docker compose --env-file "$ENV_FILE" --env-file "$release_env_file" -f "$ARTIFACT_COMPOSE_FILE" ps -q "$service")"
  [[ -n "$container_id" ]] || die "No running container found for service: $service"
  actual="$(docker inspect --format "{{ .Image }}" "$container_id")"
  [[ "$actual" == "$expected" ]] || die "Container image ID mismatch for $service. expected=$expected actual=$actual"
  success "Verified $service runtime image ID: $actual"
}

require_immutable_image_reference() {
  local service="$1"
  local image="$2"
  local expected_image_id="$3"

  if [[ "$image" == *"@sha256:"* || -n "$expected_image_id" ]]; then
    return 0
  fi

  die "$service image must use an immutable @sha256 digest or provide an expected image ID."
}

[[ -n "$ARTIFACT_PATH" ]] || die "Missing required --artifact."
[[ -n "$EXPECTED_SHA256" ]] || die "Missing required --sha256."
[[ -n "$EXPECTED_SOURCE_COMMIT" ]] || die "Missing required --source-commit."
[[ -n "$API_IMAGE" ]] || die "Missing required --api-image or STAGING_API_IMAGE."
[[ -n "$WEB_IMAGE" ]] || die "Missing required --web-image or STAGING_WEB_IMAGE."
[[ -f "$ARTIFACT_PATH" ]] || die "Artifact not found: $ARTIFACT_PATH"
[[ -f "$ARTIFACT_COMPOSE_FILE" ]] || die "Artifact compose file not found: $ARTIFACT_COMPOSE_FILE"
require_immutable_image_reference "API" "$API_IMAGE" "$API_IMAGE_ID"
require_immutable_image_reference "Web" "$WEB_IMAGE" "$WEB_IMAGE_ID"

require_command tar
require_command python3
if [[ "$SKIP_COMPOSE" == "false" && "$DRY_RUN" == "false" ]]; then
  require_command docker
fi

if grep -Eq '^[[:space:]]*build:' "$ARTIFACT_COMPOSE_FILE"; then
  die "Artifact compose file must not contain build directives: $ARTIFACT_COMPOSE_FILE"
fi

if grep -Eq 'pnpm[[:space:]]+(install|build)|docker[[:space:]]+build|--build' "$ARTIFACT_COMPOSE_FILE"; then
  die "Artifact compose file must not install, build, or rebuild application source: $ARTIFACT_COMPOSE_FILE"
fi

actual_sha256="$($(sha256_command) "$ARTIFACT_PATH" | awk '{print $1}')"
if [[ "$actual_sha256" != "$EXPECTED_SHA256" ]]; then
  die "Artifact SHA-256 mismatch. expected=$EXPECTED_SHA256 actual=$actual_sha256"
fi
success "Artifact checksum verified: $actual_sha256"

manifest_file="$(mktemp)"
tar -xOzf "$ARTIFACT_PATH" RELEASE_ARTIFACT_MANIFEST.json >"$manifest_file"

json_field() {
  local expression="$1"
  python3 - "$manifest_file" "$expression" <<'PY'
import json
import sys

with open(sys.argv[1], "r", encoding="utf-8") as handle:
    value = json.load(handle)

for part in sys.argv[2].split("."):
    value = value[part]

print(value)
PY
}

release_version="$(json_field "releaseCandidate")"
source_commit="$(json_field "source.commit")"
artifact_migration_version="$(json_field "database.latestMigration")"
rm -f "$manifest_file"

if [[ "$source_commit" != "$EXPECTED_SOURCE_COMMIT" ]]; then
  die "Artifact source commit mismatch. expected=$EXPECTED_SOURCE_COMMIT actual=$source_commit"
fi

if [[ -n "$EXPECTED_MIGRATION_VERSION" && "$artifact_migration_version" != "$EXPECTED_MIGRATION_VERSION" ]]; then
  die "Artifact migration mismatch. expected=$EXPECTED_MIGRATION_VERSION actual=$artifact_migration_version"
fi

if [[ -z "$DEPLOYMENT_ID" ]]; then
  DEPLOYMENT_ID="staging-${release_version}-${source_commit:0:7}-$(date -u +'%Y%m%dT%H%M%SZ')"
fi

release_dir="$RELEASES_DIR/$release_version-${source_commit:0:7}"
identity_file="$release_dir/release-identity.json"
release_env_file="$release_dir/release.env"

if [[ "$DRY_RUN" == "true" ]]; then
  log "DRY-RUN: would extract artifact to $release_dir"
  mkdir -p "$release_dir"
else
  mkdir -p "$release_dir"
  tar -xzf "$ARTIFACT_PATH" -C "$release_dir"
fi

deployed_at="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
cat >"$identity_file" <<JSON
{
  "deploymentId": "$DEPLOYMENT_ID",
  "releaseVersion": "$release_version",
  "sourceCommit": "$source_commit",
  "artifactReference": "$ARTIFACT_PATH",
  "artifactSha256": "$actual_sha256",
  "apiImage": "$API_IMAGE",
  "apiImageId": "$API_IMAGE_ID",
  "webImage": "$WEB_IMAGE",
  "webImageId": "$WEB_IMAGE_ID",
  "migrationVersion": "$artifact_migration_version",
  "deployedAt": "$deployed_at",
  "environment": "staging",
  "deploymentStatus": "prepared"
}
JSON

cat >"$release_env_file" <<ENV
STAGING_DEPLOYMENT_ID=$DEPLOYMENT_ID
STAGING_RELEASE_VERSION=$release_version
STAGING_SOURCE_COMMIT=$source_commit
STAGING_ARTIFACT_SHA256=$actual_sha256
STAGING_MIGRATION_VERSION=$artifact_migration_version
STAGING_RELEASE_IDENTITY_FILE=$identity_file
STAGING_API_IMAGE=$API_IMAGE
STAGING_WEB_IMAGE=$WEB_IMAGE
ENV

current_link="$RELEASES_DIR/current"
if [[ "$DRY_RUN" == "true" ]]; then
  log "DRY-RUN: would update current release symlink: $current_link -> $release_dir"
else
  ln -sfn "$release_dir" "$current_link"
fi

if [[ "$SKIP_COMPOSE" == "true" ]]; then
  warn "Compose execution skipped by request. Release identity prepared but services were not started."
elif [[ "$DRY_RUN" == "true" ]]; then
  log "DRY-RUN: docker compose --env-file $ENV_FILE --env-file $release_env_file -f $ARTIFACT_COMPOSE_FILE up -d --no-build"
else
  docker compose --env-file "$ENV_FILE" --env-file "$release_env_file" -f "$ARTIFACT_COMPOSE_FILE" up -d --no-build
  verify_running_container_label "api" "org.laborator.artifact.sha256" "$actual_sha256"
  verify_running_container_label "web" "org.laborator.artifact.sha256" "$actual_sha256"
  verify_running_container_image_id "api" "$API_IMAGE_ID"
  verify_running_container_image_id "web" "$WEB_IMAGE_ID"
  "$APP_ROOT/infrastructure/validation/wait-for-health.sh" \
    --web "$DEPLOY_HEALTH_URL" \
    --api "$DEPLOY_API_HEALTH_URL" \
    --timeout 120
fi

deployment_status="deployed"
if [[ "$SKIP_COMPOSE" == "true" || "$DRY_RUN" == "true" ]]; then
  deployment_status="prepared_not_started"
fi

python3 - "$identity_file" "$deployment_status" <<'PY'
import json
import sys

path = sys.argv[1]
status = sys.argv[2]
with open(path, "r", encoding="utf-8") as handle:
    identity = json.load(handle)
identity["deploymentStatus"] = status
with open(path, "w", encoding="utf-8") as handle:
    json.dump(identity, handle, indent=2)
    handle.write("\n")
PY

success "Artifact-based staging deployment prepared: $DEPLOYMENT_ID"
success "Release identity: $identity_file"
