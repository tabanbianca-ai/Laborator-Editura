#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

cd "$REPO_ROOT"

log "Checking shell syntax."
while IFS= read -r script; do
  bash -n "$script"
done < <(find infrastructure deploy/staging/scripts -type f \( -name '*.sh' -o -perm -111 \) 2>/dev/null)

if command -v shellcheck >/dev/null 2>&1; then
  log "Running shellcheck."
  shellcheck $(find infrastructure deploy/staging/scripts -type f -name '*.sh')
else
  warn "shellcheck not installed; skipped."
fi

if command -v yamllint >/dev/null 2>&1; then
  log "Running yamllint."
  yamllint .github deploy infrastructure
else
  warn "yamllint not installed; skipped."
fi

if command -v ruby >/dev/null 2>&1; then
  log "Checking GitHub Actions YAML syntax with Ruby Psych."
  ruby -e 'require "yaml"; ARGV.each { |file| YAML.load_file(file); puts "valid #{file}" }' .github/workflows/*.yml
else
  warn "ruby not installed; GitHub Actions YAML parse skipped."
fi

log "Checking Docker Compose config."
cp deploy/staging/.env.staging.example /tmp/laborator-env-staging-validation
docker compose --env-file /tmp/laborator-env-staging-validation -f deploy/staging/docker-compose.staging.yml config >/tmp/laborator-compose-validation.yml
rm -f /tmp/laborator-env-staging-validation /tmp/laborator-compose-validation.yml

if command -v systemd-analyze >/dev/null 2>&1; then
  log "Checking systemd unit syntax."
  systemd-analyze verify infrastructure/systemd/*.service infrastructure/systemd/*.timer || warn "systemd-analyze reported host-specific warnings."
else
  warn "systemd-analyze not installed; skipped."
fi

"$REPO_ROOT/infrastructure/validation/scan-secrets.sh"

if command -v envsubst >/dev/null 2>&1; then
  "$REPO_ROOT/infrastructure/validation/validate-nginx-template.sh" "$REPO_ROOT/infrastructure/nginx/laborator-staging.conf.template"
else
  warn "envsubst not installed; Nginx template render skipped."
fi

log "Infrastructure validation completed."
