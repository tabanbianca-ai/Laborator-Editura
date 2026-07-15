#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

template="${1:-$REPO_ROOT/infrastructure/nginx/laborator-staging.conf.template}"
[[ -f "$template" ]] || die "Nginx template not found: $template"

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

NGINX_CLIENT_MAX_BODY_SIZE="${NGINX_CLIENT_MAX_BODY_SIZE:-25m}"
STAGING_WEB_PORT="${STAGING_WEB_PORT:-3000}"
STAGING_API_PORT="${STAGING_API_PORT:-3001}"
APP_DOMAIN="${APP_DOMAIN:-example.invalid}"
APP_ALT_DOMAIN="${APP_ALT_DOMAIN:-www.example.invalid}"
PRODUCTION_WEB_PORT="${PRODUCTION_WEB_PORT:-3000}"
export NGINX_CLIENT_MAX_BODY_SIZE STAGING_WEB_PORT STAGING_API_PORT APP_DOMAIN APP_ALT_DOMAIN PRODUCTION_WEB_PORT

if command -v envsubst >/dev/null 2>&1; then
  envsubst '$NGINX_CLIENT_MAX_BODY_SIZE $STAGING_WEB_PORT $STAGING_API_PORT $APP_DOMAIN $APP_ALT_DOMAIN $PRODUCTION_WEB_PORT' \
    < "$template" > "$tmp_dir/default.conf"
else
  sed \
    -e "s|\${NGINX_CLIENT_MAX_BODY_SIZE}|$NGINX_CLIENT_MAX_BODY_SIZE|g" \
    -e "s|\${STAGING_WEB_PORT}|$STAGING_WEB_PORT|g" \
    -e "s|\${STAGING_API_PORT}|$STAGING_API_PORT|g" \
    -e "s|\${APP_DOMAIN}|$APP_DOMAIN|g" \
    -e "s|\${APP_ALT_DOMAIN}|$APP_ALT_DOMAIN|g" \
    -e "s|\${PRODUCTION_WEB_PORT}|$PRODUCTION_WEB_PORT|g" \
    "$template" > "$tmp_dir/default.conf"
fi

if command -v nginx >/dev/null 2>&1; then
  nginx -t -c "$tmp_dir/default.conf"
elif command -v docker >/dev/null 2>&1; then
  docker run --rm -v "$tmp_dir/default.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine nginx -t
else
  warn "Neither nginx nor docker is available; rendered template only."
  sed -n '1,120p' "$tmp_dir/default.conf"
fi

log "Nginx template validation completed: $template"
