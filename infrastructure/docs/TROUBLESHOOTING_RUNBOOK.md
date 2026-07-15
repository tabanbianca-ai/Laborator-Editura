# Troubleshooting Runbook

## API Unhealthy

```bash
docker compose --env-file deploy/staging/.env.staging -f deploy/staging/docker-compose.staging.yml ps
docker compose --env-file deploy/staging/.env.staging -f deploy/staging/docker-compose.staging.yml logs api --tail=100
curl http://127.0.0.1:3001/health
```

## Web Unhealthy

```bash
docker compose --env-file deploy/staging/.env.staging -f deploy/staging/docker-compose.staging.yml logs web --tail=100
curl http://127.0.0.1:3000
```

## Nginx Fails

```bash
sudo nginx -t
sudo journalctl -u nginx -n 100 --no-pager
sudo tail -100 /var/log/nginx/laborator-staging.error.log
```

## Backup Fails

```bash
sudo journalctl -u laborator-backup.service -n 100 --no-pager
df -h /opt/laborator-backups
docker volume ls | grep laborator-staging
```

## Rollback

```bash
infrastructure/deploy/rollback-staging.sh --ref <previous-commit> --confirm ROLLBACK
```

## Port Exposure

```bash
ss -ltnp | grep -E ':3000|:3001'
```

Expected:

- `127.0.0.1:3000`
- `127.0.0.1:3001`

Unexpected:

- `0.0.0.0:3000`
- `0.0.0.0:3001`

