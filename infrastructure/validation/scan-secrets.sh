#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

cd "$REPO_ROOT"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose)
      enable_verbose
      shift
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

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

secret_pattern='(BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY|ghp_[A-Za-z0-9_]{20,}|xox[baprs]-|sk-[A-Za-z0-9]{20,})'
suspected_files=()
while IFS= read -r suspected_file; do
  [[ -n "$suspected_file" ]] && suspected_files+=("$suspected_file")
done < <(
  git grep -l -I -E "$secret_pattern" -- . \
    ':!infrastructure/docs' \
    ':!*.md' \
    ':!*.example' \
    ':!*.template' || true
)

if [[ "${#suspected_files[@]}" -gt 0 ]]; then
  warn "Potential secret patterns detected in tracked files. Matched values are intentionally not printed."
  for suspected_file in "${suspected_files[@]}"; do
    warn "Review file for possible secret rotation: $suspected_file"
  done
  die "Potential secret detected. Rotate any real exposed credentials before release."
fi

success "Secret scan completed."
