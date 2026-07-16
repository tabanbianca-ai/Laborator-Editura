#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

WEB_URL="${WEB_HEALTH_URL:-http://127.0.0.1:3000}"
API_URL="${API_HEALTH_URL:-http://127.0.0.1:3001/health}"
TIMEOUT_SECONDS=120

while [[ $# -gt 0 ]]; do
  case "$1" in
    --web)
      WEB_URL="$2"
      shift 2
      ;;
    --api)
      API_URL="$2"
      shift 2
      ;;
    --timeout)
      TIMEOUT_SECONDS="$2"
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

require_command curl
deadline=$((SECONDS + TIMEOUT_SECONDS))

until curl -fsS --max-time 5 "$API_URL" >/dev/null && curl -fsS --max-time 5 "$WEB_URL" >/dev/null; do
  if [[ "$SECONDS" -ge "$deadline" ]]; then
    die "Timed out waiting for healthy web/API endpoints."
  fi
  debug "Waiting for healthy endpoints: $WEB_URL $API_URL"
  sleep 5
done

success "Health checks passed: $WEB_URL $API_URL"
