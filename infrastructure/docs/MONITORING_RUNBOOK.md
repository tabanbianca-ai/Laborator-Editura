# Monitoring Runbook

## Checks

The lightweight monitor checks:

- Web health.
- API health.
- Nginx.
- Docker daemon.
- Staging containers.
- Disk usage.
- Inode usage.
- CPU load.
- Recent backup presence.

## Install

```bash
sudo cp infrastructure/monitoring/monitoring.env.example /etc/laborator/monitoring.env
sudo editor /etc/laborator/monitoring.env
sudo cp infrastructure/systemd/laborator-monitor.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now laborator-monitor.timer
```

## Alerting

Set `ALERT_WEBHOOK_URL` or `ALERT_EMAIL` in `/etc/laborator/monitoring.env`.
Do not commit real webhook URLs.

Alerts are rate-limited by `ALERT_RATE_LIMIT_SECONDS`.

