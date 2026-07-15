# Domain and SSL Runbook

## Current State

Staging may be accessed by IP while the permanent domain is undecided. Do not
request a TLS certificate for an IP address.

## Placeholders

Use:

- `APP_DOMAIN=example.invalid`
- `API_DOMAIN=api.example.invalid`
- `TLS_EMAIL=admin@example.invalid`

Replace these only after the real domain is selected.

## Certbot Activation

After DNS points to the VPS:

```bash
sudo certbot --nginx -d example.com -d www.example.com --email admin@example.com
```

Then validate:

```bash
curl -I https://example.com
sudo nginx -t
```

Secondary domains should redirect with 301 to the primary domain.

