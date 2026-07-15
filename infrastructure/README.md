# Laborator Editura Infrastructure Pack v1.0

This pack versions the operational infrastructure for the existing staging
deployment without changing editorial application behavior.

## Scope

Included:

- Infrastructure as Code for staging and production templates.
- Backup, verification, restore, and restore dry-run.
- GitHub Actions CI/CD definitions.
- Lightweight monitoring and alert hooks.
- Security hardening scripts and configuration examples.
- Disaster Recovery bootstrap and restore orchestration.
- Operational runbooks.

Not included:

- Real secrets.
- Real `.env.staging` or `.env.production`.
- Backup archives.
- TLS private keys.
- Production deployment activation.
- Domain or SSL issuance.

## Directory Map

```text
infrastructure/
├── backup/
├── deploy/
├── disaster-recovery/
├── docs/
├── inventory/
├── monitoring/
├── nginx/
├── scripts/
├── security/
├── systemd/
└── validation/
```

## First Install On VPS

```bash
sudo install -d -m 700 /etc/laborator
sudo cp infrastructure/backup/laborator-backup.env.example /etc/laborator/infrastructure.env
sudo cp infrastructure/monitoring/monitoring.env.example /etc/laborator/monitoring.env
sudo editor /etc/laborator/infrastructure.env
sudo editor /etc/laborator/monitoring.env
```

Install systemd units:

```bash
sudo cp infrastructure/systemd/laborator-backup.* /etc/systemd/system/
sudo cp infrastructure/systemd/laborator-monitor.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now laborator-backup.timer laborator-monitor.timer
```

## Validation

```bash
infrastructure/validation/validate-infrastructure.sh
pnpm typecheck
pnpm test
pnpm build
docker compose --env-file deploy/staging/.env.staging.example -f deploy/staging/docker-compose.staging.yml config
```

Optional tools:

- `shellcheck`
- `yamllint`
- `nginx` or Docker for Nginx template validation
- `gitleaks`
- `trivy`

## Manual Actions After Commit And Push

1. Pull the repository on the VPS.
2. Copy examples to `/etc/laborator` and fill real values outside Git.
3. Verify SSH key access for the deploy user.
4. Install systemd units.
5. Run backup dry-run.
6. Run a real backup and verify checksum.
7. Run restore dry-run into temporary Docker volumes.
8. Apply Docker Compose update so ports bind to `127.0.0.1`.
9. Validate Nginx still proxies port 80 to web.
10. Configure GitHub Actions secrets.
11. Trigger staging deploy manually from GitHub Actions.

## Runbooks

- [Deployment](docs/DEPLOYMENT_RUNBOOK.md)
- [Backup and Restore](docs/BACKUP_RESTORE_RUNBOOK.md)
- [Disaster Recovery](docs/DISASTER_RECOVERY_RUNBOOK.md)
- [Security Hardening](docs/SECURITY_HARDENING_RUNBOOK.md)
- [Monitoring](docs/MONITORING_RUNBOOK.md)
- [Domain and SSL](docs/DOMAIN_SSL_RUNBOOK.md)
- [Maintenance](docs/MAINTENANCE_RUNBOOK.md)
- [Troubleshooting](docs/TROUBLESHOOTING_RUNBOOK.md)

