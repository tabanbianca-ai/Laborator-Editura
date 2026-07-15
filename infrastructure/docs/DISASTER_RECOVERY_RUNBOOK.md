# Disaster Recovery Runbook

## Objectives

- RPO: maximum 24 hours with daily backups.
- RTO target: 30-60 minutes when an external backup is available.

## New VPS Preparation

1. Provision Ubuntu 24.04 LTS.
2. Install Docker, Docker Compose, Git, Nginx, UFW, Fail2Ban.
3. Create a non-root deploy user.
4. Configure SSH key access.
5. Enable UFW for ports `22`, `80`, and `443`.
6. Clone the repository.
7. Restore `/etc/laborator/infrastructure.env` and `.env.staging` from the
   external secret store.
8. Download the latest verified backup from external storage.
9. Run restore dry-run.
10. Run orchestrated restore.
11. Apply Nginx configuration.
12. Start Docker Compose.
13. Run health checks.
14. Move DNS only after validation.

## Commands

```bash
sudo infrastructure/disaster-recovery/bootstrap-vps.sh --dry-run
sudo infrastructure/disaster-recovery/restore-orchestrated.sh \
  --backup /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz
```

Use `--apply --confirm DR_RESTORE` only after dry-run passes.

## Data Not Stored In Git

- `.env.staging`.
- `.env.production`.
- SSH private keys.
- GitHub Actions secrets.
- rclone credentials.
- Backup archives.
- TLS private keys.
- Runtime database files.

## Periodic Test

Run a restore dry-run monthly and after any major infrastructure change.

