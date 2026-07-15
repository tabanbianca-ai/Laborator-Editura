#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=../scripts/common.sh
source "$REPO_ROOT/infrastructure/scripts/common.sh"

CONFIG_FILE="${LABORATOR_MONITORING_CONFIG:-/etc/laborator/monitoring.env}"
load_config_file "$CONFIG_FILE"

: "${MONITORING_ENABLED:=true}"
: "${WEB_HEALTH_URL:=http://127.0.0.1:3000}"
: "${API_HEALTH_URL:=http://127.0.0.1:3001/health}"
: "${BACKUP_ROOT:=/opt/laborator-backups}"
: "${MAX_BACKUP_AGE_HOURS:=30}"
: "${DISK_WARN_PERCENT:=80}"
: "${DISK_CRIT_PERCENT:=90}"
: "${INODE_WARN_PERCENT:=80}"
: "${INODE_CRIT_PERCENT:=90}"
: "${LOAD_WARN_1M:=2.0}"
: "${MEMORY_CRIT_PERCENT:=90}"
: "${HTTP_5XX_CRIT_COUNT:=10}"
: "${NGINX_ACCESS_LOG:=/var/log/nginx/laborator-staging.access.log}"
: "${TLS_DOMAIN:=}"
: "${TLS_EXPIRY_WARN_DAYS:=21}"
: "${RUNTIME_DB_VOLUME:=laborator-staging_runtime-db}"
: "${RUNTIME_BACKUPS_VOLUME:=laborator-staging_runtime-backups}"
: "${ALERT_RATE_LIMIT_SECONDS:=1800}"
: "${ALERT_STATE_DIR:=/var/lib/laborator/monitoring}"

[[ "$MONITORING_ENABLED" == "true" ]] || exit 0

require_command curl
require_command docker
require_command awk
require_command df

mkdir -p "$ALERT_STATE_DIR"
status="ok"
messages=()

maybe_alert() {
  local body="$1"
  [[ -n "${ALERT_WEBHOOK_URL:-}" ]] || return 0
  local stamp="$ALERT_STATE_DIR/last-alert"
  local now
  now="$(date +%s)"
  if [[ -f "$stamp" ]] && [[ $((now - $(cat "$stamp"))) -lt "$ALERT_RATE_LIMIT_SECONDS" ]]; then
    warn "Alert suppressed by rate limit."
    return 0
  fi
  printf '%s' "$now" > "$stamp"
  curl -fsS -X POST -H 'Content-Type: application/json' --data "$body" "$ALERT_WEBHOOK_URL" >/dev/null || warn "Alert webhook failed."
}

mark_failed() {
  status="failed"
  messages+=("$1")
}

check_url() {
  local name="$1"
  local url="$2"
  if ! curl -fsS --max-time 5 "$url" >/dev/null; then
    mark_failed "$name health check failed: $url"
  fi
}

check_service() {
  local service="$1"
  if ! systemctl is-active --quiet "$service"; then
    mark_failed "systemd service not active: $service"
  fi
}

check_percent() {
  local name="$1"
  local value="$2"
  local warn="$3"
  local crit="$4"
  if [[ "$value" -ge "$crit" ]]; then
    mark_failed "$name critical: ${value}%"
  elif [[ "$value" -ge "$warn" ]]; then
    messages+=("$name warning: ${value}%")
  fi
}

check_url "web" "$WEB_HEALTH_URL"
check_url "api" "$API_HEALTH_URL"
check_service nginx
check_service docker

if ! docker ps --format '{{.Names}} {{.Status}}' | grep -E 'staging.*(api|web)' >/dev/null; then
  mark_failed "staging api/web containers not found"
fi

disk_percent="$(df -P / | awk 'NR==2 { gsub("%", "", $5); print $5 }')"
inode_percent="$(df -Pi / | awk 'NR==2 { gsub("%", "", $5); print $5 }')"
check_percent "disk" "$disk_percent" "$DISK_WARN_PERCENT" "$DISK_CRIT_PERCENT"
check_percent "inode" "$inode_percent" "$INODE_WARN_PERCENT" "$INODE_CRIT_PERCENT"

mem_used_percent="$(awk '/MemTotal/ { total=$2 } /MemAvailable/ { available=$2 } END { if (total > 0) printf "%d", ((total-available)/total)*100; else print 0 }' /proc/meminfo)"
check_percent "memory" "$mem_used_percent" "$MEMORY_CRIT_PERCENT" "$MEMORY_CRIT_PERCENT"

load_1m="$(awk '{ print $1 }' /proc/loadavg)"
awk -v load="$load_1m" -v warn="$LOAD_WARN_1M" 'BEGIN { exit !(load > warn) }' && messages+=("load warning: $load_1m") || true

for volume in "$RUNTIME_DB_VOLUME" "$RUNTIME_BACKUPS_VOLUME"; do
  docker volume inspect "$volume" >/dev/null 2>&1 || mark_failed "Docker volume missing: $volume"
done

container_ids="$(docker ps -q)"
restart_count=""
if [[ -n "$container_ids" ]]; then
  restart_count="$(docker inspect --format '{{.Name}} {{.RestartCount}}' $container_ids 2>/dev/null | awk '$2 >= 3 { print $0 }' || true)"
fi
if [[ -n "$restart_count" ]]; then
  mark_failed "repeated container restarts: $restart_count"
fi

if [[ -f "$NGINX_ACCESS_LOG" ]]; then
  http_5xx_count="$(tail -1000 "$NGINX_ACCESS_LOG" | awk '$9 ~ /^5/ { count++ } END { print count + 0 }')"
  if [[ "$http_5xx_count" -ge "$HTTP_5XX_CRIT_COUNT" ]]; then
    mark_failed "HTTP 5xx threshold exceeded in recent Nginx log: $http_5xx_count"
  fi
fi

if [[ -n "$TLS_DOMAIN" ]] && command -v openssl >/dev/null 2>&1; then
  expiry_epoch="$(echo | openssl s_client -servername "$TLS_DOMAIN" -connect "$TLS_DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 | xargs -I{} date -d "{}" +%s 2>/dev/null || true)"
  if [[ -n "$expiry_epoch" ]]; then
    now_epoch="$(date +%s)"
    days_left="$(( (expiry_epoch - now_epoch) / 86400 ))"
    if [[ "$days_left" -lt "$TLS_EXPIRY_WARN_DAYS" ]]; then
      messages+=("TLS certificate expires in ${days_left} days for $TLS_DOMAIN")
    fi
  fi
fi

latest_backup="$(find "$BACKUP_ROOT" -maxdepth 1 -type f -name 'laborator-staging-*.tar.gz' -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | awk '{ print $2 }')"
if [[ -z "$latest_backup" ]]; then
  mark_failed "no backup found in $BACKUP_ROOT"
else
  now_epoch="$(date +%s)"
  backup_epoch="$(stat -c %Y "$latest_backup" 2>/dev/null || stat -f %m "$latest_backup")"
  age_hours="$(( (now_epoch - backup_epoch) / 3600 ))"
  if [[ "$age_hours" -gt "$MAX_BACKUP_AGE_HOURS" ]]; then
    mark_failed "latest backup too old: ${age_hours}h"
  fi
fi

payload="{\"checkedAt\":\"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\",\"status\":\"$status\",\"messages\":[$(printf '"%s",' "${messages[@]}" | sed 's/,$//')]}"
printf '%s\n' "$payload"

if [[ "$status" != "ok" ]]; then
  maybe_alert "$payload"
  exit 1
fi
