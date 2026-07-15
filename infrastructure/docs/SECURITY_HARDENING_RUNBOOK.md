# Security Hardening Runbook

## Safe Order

1. Create deploy user.
2. Add SSH public key.
3. Verify a new SSH login as deploy user.
4. Keep the existing SSH session open.
5. Apply UFW baseline.
6. Apply SSH hardening.
7. Enable Fail2Ban.
8. Enable unattended security upgrades.
9. Verify Nginx and Docker remain healthy.

## Deploy User

```bash
sudo infrastructure/security/ssh/bootstrap-deploy-user.sh \
  --authorized-key-file /tmp/deploy.pub \
  --apply \
  --confirm CREATE_DEPLOY_USER
```

## SSH Hardening

Dry-run first:

```bash
sudo infrastructure/security/ssh/harden-ssh.sh
```

Apply only after key login is verified:

```bash
sudo infrastructure/security/ssh/harden-ssh.sh --apply --confirm HARDEN_SSH
```

## Firewall

```bash
sudo infrastructure/security/ufw/apply-ufw-baseline.sh --apply --confirm UFW_BASELINE
```

## Ports

Public ports should be only:

- `22`
- `80`
- `443`

Docker application ports must stay on loopback.

