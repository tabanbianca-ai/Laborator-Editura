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
sudo /opt/Laborator-Editura/infrastructure/backup/backup-laborator.sh \
  --config /etc/laborator/infrastructure.env
```

Dry-run:

```bash
sudo /opt/Laborator-Editura/infrastructure/backup/backup-laborator.sh \
  --config /etc/laborator/infrastructure.env \
  --dry-run
```

## Verify Backup

```bash
sudo /opt/Laborator-Editura/infrastructure/backup/verify-backup.sh \
  /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz
```

## Restore Dry-Run

The dry-run restores into temporary Docker volumes and never touches active
runtime volumes:

```bash
sudo /opt/Laborator-Editura/infrastructure/backup/restore-dry-run.sh \
  --backup /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz
```

## Live Restore

Live restore requires all safeguards:

```bash
sudo /opt/Laborator-Editura/infrastructure/backup/restore-laborator.sh \
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

