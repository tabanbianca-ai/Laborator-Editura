# Maintenance Runbook

## Monthly

- Review backup logs and verify at least one recent restore dry-run.
- Review monitoring logs and repeated alerts.
- Review Nginx 5xx counts.
- Review Docker disk usage:

```bash
docker system df
```

- Review security updates:

```bash
sudo unattended-upgrade --dry-run --debug
```

## Docker Updates

1. Read Docker release notes.
2. Create backup.
3. Upgrade Docker during a maintenance window.
4. Restart services if required.
5. Run health checks and smoke tests.

## Ubuntu Updates

1. Create backup.
2. Run package updates.
3. Reboot only if required.
4. Verify Docker, Nginx, systemd timers, web, and API health.

## Secret Rotation

Rotate:

- GitHub Actions SSH key.
- `LABORATOR_SESSION_SECRET`.
- `LABORATOR_AUTH_LOGIN_SECRET`.
- rclone credentials.
- Webhook URLs.

Never commit secret values. Store them in the VPS secret location and GitHub
Actions Secrets.

