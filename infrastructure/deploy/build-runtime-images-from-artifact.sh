#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

ARTIFACT_PATH=""
EXPECTED_SHA256=""
EXPECTED_SOURCE_COMMIT=""
API_IMAGE=""
WEB_IMAGE=""
OUTPUT_METADATA=""
OUTPUT_IMAGE_BUNDLE=""
DRY_RUN=false

usage() {
  cat <<'USAGE'
Usage:
  infrastructure/deploy/build-runtime-images-from-artifact.sh \
    --artifact <artifact.tar.gz> \
    --sha256 <expected-sha256> \
    --source-commit <commit-sha> \
    --api-image <api-image-tag-or-digest> \
    --web-image <web-image-tag-or-digest>

Optional:
  --output-metadata <runtime-image-metadata.json>
  --output-image-bundle <runtime-images.tar>
  --dry-run
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
    --api-image)
      API_IMAGE="$2"
      shift 2
      ;;
    --web-image)
      WEB_IMAGE="$2"
      shift 2
      ;;
    --output-metadata)
      OUTPUT_METADATA="$2"
      shift 2
      ;;
    --output-image-bundle)
      OUTPUT_IMAGE_BUNDLE="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
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

[[ -n "$ARTIFACT_PATH" ]] || die "Missing required --artifact."
[[ -n "$EXPECTED_SHA256" ]] || die "Missing required --sha256."
[[ -n "$EXPECTED_SOURCE_COMMIT" ]] || die "Missing required --source-commit."
[[ -n "$API_IMAGE" ]] || die "Missing required --api-image."
[[ -n "$WEB_IMAGE" ]] || die "Missing required --web-image."
[[ -f "$ARTIFACT_PATH" ]] || die "Artifact not found: $ARTIFACT_PATH"

require_command tar
require_command python3
if [[ "$DRY_RUN" == "false" ]]; then
  require_command docker
fi

actual_sha256="$($(sha256_command) "$ARTIFACT_PATH" | awk '{print $1}')"
[[ "$actual_sha256" == "$EXPECTED_SHA256" ]] || die "Artifact SHA-256 mismatch. expected=$EXPECTED_SHA256 actual=$actual_sha256"
success "Artifact checksum verified: $actual_sha256"

work_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$work_dir"
}
trap cleanup EXIT

tar -xzf "$ARTIFACT_PATH" -C "$work_dir"
manifest_file="$work_dir/RELEASE_ARTIFACT_MANIFEST.json"
[[ -f "$manifest_file" ]] || die "Artifact manifest missing: RELEASE_ARTIFACT_MANIFEST.json"

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
migration_version="$(json_field "database.latestMigration")"

[[ "$source_commit" == "$EXPECTED_SOURCE_COMMIT" ]] || die "Artifact source commit mismatch. expected=$EXPECTED_SOURCE_COMMIT actual=$source_commit"
[[ -f "$work_dir/apps/api/dist/apps/api/src/main.js" ]] || die "API build output missing from artifact."
[[ -f "$work_dir/apps/web/.next/BUILD_ID" ]] || die "Web build output missing from artifact."

cat >"$work_dir/Dockerfile.api.artifact" <<'DOCKERFILE'
FROM node:22-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV APP_ENV="staging"
ENV PORT="3001"
ENV WEB_ORIGIN="http://localhost:3000"
ENV LABORATOR_RUNTIME_DB_PATH="/var/lib/laborator/runtime-db.json"

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

COPY . .

RUN pnpm install --frozen-lockfile --prod \
  && test -f apps/api/dist/apps/api/src/main.js \
  && mkdir -p /var/lib/laborator /var/backups/laborator/staging

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const port=process.env.PORT||3001; fetch('http://127.0.0.1:'+port+'/health').then((res)=>process.exit(res.ok?0:1)).catch(()=>process.exit(1));"

CMD ["node", "apps/api/dist/apps/api/src/main.js"]
DOCKERFILE

cat >"$work_dir/Dockerfile.web.artifact" <<'DOCKERFILE'
FROM node:22-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
ENV APP_ENV="staging"
ENV PORT="3000"
ENV API_BASE_URL="http://api:3001"
ENV NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

COPY . .

RUN pnpm install --frozen-lockfile --prod \
  && test -f apps/web/.next/BUILD_ID

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const port=process.env.PORT||3000; fetch('http://127.0.0.1:'+port+'/').then((res)=>process.exit(res.ok?0:1)).catch(()=>process.exit(1));"

CMD ["sh", "-c", "pnpm --filter @laborator/web exec next start --hostname 0.0.0.0 --port ${PORT:-3000}"]
DOCKERFILE

if [[ "$DRY_RUN" == "true" ]]; then
  log "DRY-RUN: docker build API and web runtime images from verified artifact."
  log "DRY-RUN: would write metadata to ${OUTPUT_METADATA:-<not requested>}"
  log "DRY-RUN: would save image bundle to ${OUTPUT_IMAGE_BUNDLE:-<not requested>}"
  exit 0
fi

common_labels=(
  --label "org.laborator.release.version=$release_version"
  --label "org.laborator.source.commit=$source_commit"
  --label "org.laborator.artifact.sha256=$actual_sha256"
  --label "org.laborator.migration.version=$migration_version"
)

docker build "${common_labels[@]}" -f "$work_dir/Dockerfile.api.artifact" -t "$API_IMAGE" "$work_dir"
docker build "${common_labels[@]}" -f "$work_dir/Dockerfile.web.artifact" -t "$WEB_IMAGE" "$work_dir"

api_image_id="$(docker image inspect --format '{{.Id}}' "$API_IMAGE")"
web_image_id="$(docker image inspect --format '{{.Id}}' "$WEB_IMAGE")"

if [[ -n "$OUTPUT_IMAGE_BUNDLE" ]]; then
  docker save "$API_IMAGE" "$WEB_IMAGE" -o "$OUTPUT_IMAGE_BUNDLE"
  success "Runtime image bundle written: $OUTPUT_IMAGE_BUNDLE"
fi

if [[ -n "$OUTPUT_METADATA" ]]; then
  mkdir -p "$(dirname "$OUTPUT_METADATA")"
  cat >"$OUTPUT_METADATA" <<JSON
{
  "releaseVersion": "$release_version",
  "sourceCommit": "$source_commit",
  "artifactReference": "$ARTIFACT_PATH",
  "artifactSha256": "$actual_sha256",
  "apiImage": "$API_IMAGE",
  "apiImageId": "$api_image_id",
  "webImage": "$WEB_IMAGE",
  "webImageId": "$web_image_id",
  "migrationVersion": "$migration_version",
  "createdAt": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
}
JSON
  success "Runtime image metadata written: $OUTPUT_METADATA"
fi

success "Runtime images built from verified artifact."
