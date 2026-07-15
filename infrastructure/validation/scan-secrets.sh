#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

cd "$REPO_ROOT"

forbidden_files=(
  "deploy/staging/.env.staging"
  "deploy/staging/.env.production"
  ".env"
  ".env.local"
  "rclone.conf"
)

for file in "${forbidden_files[@]}"; do
  if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
    die "Forbidden secret-bearing file is tracked: $file"
  fi
done

if git grep -n -I -E '(BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY|ghp_[A-Za-z0-9_]{20,}|xox[baprs]-|sk-[A-Za-z0-9]{20,})' -- . \
  ':!infrastructure/docs' \
  ':!*.md' \
  ':!*.example' \
  ':!*.template'; then
  die "Potential secret detected. Review output above."
fi

log "Secret scan completed."

