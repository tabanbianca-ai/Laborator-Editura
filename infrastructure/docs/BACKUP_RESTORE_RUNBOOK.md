# Backup and Restore Runbook

## Scope

Backups cover:

- Docker runtime database volume.
- Docker runtime backup volume.
- Docker Compose staging configuration.
- Nginx configuration.
- Laborator systemd units.
- Active Git commit metadata.
- Backup manifest and SHA-256 checksum.

Real `.env.staging` is excluded by default. If operators enable
`BACKUP_INCLUDE_ENV=true`, the backup archive must be treated as sensitive,
stored with restrictive permissions, and encrypted whenever possible.

## Install

The first backup run does not require a manually prepared config file. If
`/etc/laborator/infrastructure.env` is missing, the backup script creates it
from `infrastructure/backup/laborator-backup.env.example` when it has
permission to write to `/etc/laborator`, sets restrictive permissions, and
prints a warning asking the operator to review the file.

During `--dry-run`, the script does not write system config files. If the config
file is missing, it uses the example defaults for that validation run.

```bash
sudo install -d -m 700 /etc/laborator
sudo cp infrastructure/backup/laborator-backup.env.example /etc/laborator/infrastructure.env
sudo editor /etc/laborator/infrastructure.env
sudo cp infrastructure/systemd/laborator-backup.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now laborator-backup.timer
```

## Manual Backup

```bash
sudo /opt/laborator-editura/infrastructure/backup/backup-laborator.sh \
  --config /etc/laborator/infrastructure.env
```

Dry-run:

```bash
sudo /opt/laborator-editura/infrastructure/backup/backup-laborator.sh --dry-run
```

Use `--verbose` when diagnosing path or Docker volume configuration.

## Canonical Archive Contract

New infrastructure backups use the versioned
`laborator.infrastructure.backup.v2` contract. A canonical archive has this
minimum layout:

```text
manifest.json
config/docker/docker-compose.staging.yml
docker-volumes/runtime-db.tar.gz
docker-volumes/runtime-backups.tar.gz
metadata/git-commit.txt
```

The archive may also contain `config/docker/.env.staging` when explicitly
enabled, Nginx and systemd configuration snapshots, and
`metadata/release-identity.json` when release identity is available.

`manifest.json` records:

- Contract/schema version, backup ID, UTC creation timestamp, and environment.
- Git commit and release identity when available.
- Canonical restore mappings for both runtime volumes.
- Every included file with category, size, required/optional status, and
  SHA-256.
- SHA-256 as the integrity algorithm and the required external checksum
  sidecar name.

The producer writes `<archive>.sha256` with the archive basename so the pair
can be moved together and verified independently. Verification fails closed
when the checksum sidecar, manifest, required payload, embedded payload hash,
restore mapping, nested volume archive, or declared release identity is
missing or malformed.

## Configuration

The main config file is `/etc/laborator/infrastructure.env` by default. It can
be moved with `LABORATOR_INFRA_CONFIG` or the `--config` option.

Important configurable paths:

- `CONFIG_DIR`
- `PROJECT_ROOT` / `APP_ROOT`
- `DOCKER_COMPOSE_PATH` / `COMPOSE_FILE`
- `BACKUP_DIR` / `BACKUP_ROOT`
- `BACKUP_ENVIRONMENT`
- `LOG_DIR`
- `NGINX_DIR` / `NGINX_CONFIG_DIR`
- `SYSTEMD_DIR` / `SYSTEMD_CONFIG_DIR`

The old names remain supported for compatibility.

## Verify Backup

```bash
sudo /opt/laborator-editura/infrastructure/backup/verify-backup.sh \
  /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz
```

The verifier accepts only the canonical v2 contract. Historical archives
without `manifest.json`, including the previous root-layout staging archives,
remain valid historical evidence when their external checksum passes, but are
not restore-eligible. They must be inspected and migrated into a canonical
archive through a separately approved recovery procedure; operators must not
add a fabricated manifest or bypass verification.

## Restore Dry-Run

The dry-run restores into temporary Docker volumes and never touches active
runtime volumes. Temporary volumes use the
`laborator-restore-test-db-*` and `laborator-restore-test-backups-*` prefixes
and are removed automatically unless `--keep-temp` is supplied:

```bash
sudo /opt/laborator-editura/infrastructure/backup/restore-dry-run.sh \
  --backup /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz
```

## Controlled Staging Validation

Run these commands on staging after deploying the repository change. They do
not modify application code or restore over live volumes:

```bash
cd /opt/laborator-editura

sudo infrastructure/backup/backup-laborator.sh \
  --config /etc/laborator/infrastructure.env \
  --verbose

BACKUP_FILE="$(sudo find /opt/laborator-backups -maxdepth 1 -type f \
  -name 'laborator-staging-*.tar.gz' -printf '%T@ %p\n' | \
  sort -nr | awk 'NR == 1 { print $2 }')"

sudo infrastructure/backup/verify-backup.sh "$BACKUP_FILE" --verbose
sudo infrastructure/backup/restore-dry-run.sh \
  --backup "$BACKUP_FILE" \
  --verbose

docker ps --filter name=laborator-staging --format '{{.Names}} {{.Status}}'
```

Before running the commands, confirm `/etc/laborator/infrastructure.env`
contains the canonical lowercase `PROJECT_ROOT`, the intended runtime volume
names, `BACKUP_ENVIRONMENT=staging`, and the correct backup directory. The
restore dry-run must complete without stopping containers or referring to the
live volume names as restore targets.

## Live Restore

Live restore requires all safeguards:

```bash
sudo /opt/laborator-editura/infrastructure/backup/restore-laborator.sh \
  --config /etc/laborator/infrastructure.env \
  --backup /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz \
  --force \
  --confirm RESTORE
```

The script creates a pre-restore backup unless explicitly told not to.

## External Copy

Use `rclone` for off-VPS copies. Keep `rclone.conf` outside Git, for example:

```bash
rclone copy /opt/laborator-backups remote:laborator-backups/staging
```

Recommended external storage options:

- S3-compatible object storage.
- Hostinger Object Storage.
- Backblaze B2.
