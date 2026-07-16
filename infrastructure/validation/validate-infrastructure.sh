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

log "Checking shell syntax."
while IFS= read -r script; do
  debug "bash -n $script"
  bash -n "$script"
done < <(
  find infrastructure deploy/staging/scripts -type f -name '*.sh' 2>/dev/null | sort
  find infrastructure deploy/staging/scripts -type f -perm -111 ! -name '*.sh' 2>/dev/null | while IFS= read -r executable; do
    if head -n 1 "$executable" | grep -Eq '^#!.*\b(bash|sh)\b'; then
      printf '%s\n' "$executable"
    fi
  done | sort
)

if command -v node >/dev/null 2>&1; then
  log "Checking Node.js ESM script syntax."
  while IFS= read -r module_script; do
    debug "node --check $module_script"
    node --check "$module_script"
  done < <(find infrastructure deploy/staging/scripts -type f -name '*.mjs' 2>/dev/null | sort)
else
  warn "node not installed; .mjs syntax validation skipped."
fi

if find infrastructure deploy/staging/scripts -type f -name '*.ts' 2>/dev/null | grep -q .; then
  if command -v pnpm >/dev/null 2>&1; then
    log "Checking TypeScript through workspace typecheck."
    pnpm typecheck
  else
    warn "TypeScript files found, but pnpm is not installed; TypeScript validation skipped."
  fi
fi

if command -v shellcheck >/dev/null 2>&1; then
  log "Running shellcheck."
  shellcheck $(find infrastructure deploy/staging/scripts -type f -name '*.sh' | sort)
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

if command -v docker >/dev/null 2>&1; then
  log "Checking Docker Compose config."
  cp deploy/staging/.env.staging.example /tmp/laborator-env-staging-validation
  docker compose --env-file /tmp/laborator-env-staging-validation -f deploy/staging/docker-compose.staging.yml config >/tmp/laborator-compose-validation.yml
  rm -f /tmp/laborator-env-staging-validation /tmp/laborator-compose-validation.yml
else
  warn "docker not installed; Docker Compose config validation skipped."
fi

if command -v systemd-analyze >/dev/null 2>&1; then
  log "Checking systemd unit syntax."
  systemd-analyze verify infrastructure/systemd/*.service infrastructure/systemd/*.timer || warn "systemd-analyze reported host-specific warnings."
else
  warn "systemd-analyze not installed; skipped."
fi

"$REPO_ROOT/infrastructure/validation/scan-secrets.sh"

"$REPO_ROOT/infrastructure/validation/validate-nginx-template.sh" "$REPO_ROOT/infrastructure/nginx/laborator-staging.conf.template"

success "Infrastructure validation completed."
