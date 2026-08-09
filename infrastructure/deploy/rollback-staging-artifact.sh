#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIRM=""
ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --confirm)
      CONFIRM="$2"
      shift 2
      ;;
    --verbose)
      enable_verbose
      ARGS+=("--verbose")
      shift
      ;;
    *)
      ARGS+=("$1")
      shift
      ;;
  esac
done

require_confirm "ROLLBACK" "$CONFIRM"

exec "$REPO_ROOT/infrastructure/deploy/deploy-staging-artifact.sh" "${ARGS[@]}"
