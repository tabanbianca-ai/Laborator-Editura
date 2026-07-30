# DevSecOps Infrastructure as Code

## Purpose

Infrastructure as Code defines and validates infrastructure through versioned
files, scripts, manifests, templates, and runbooks instead of unmanaged manual
changes.

## Required IaC Coverage

Infrastructure definitions may include:

- Docker.
- Docker Compose.
- Kubernetes.
- Helm.
- Terraform.
- Ansible.
- GitOps manifests.
- Nginx.
- Systemd.
- Firewall rules.
- SSH hardening scripts.
- Backup and monitoring timers.

## Current Repository Baseline

Current IaC foundations:

- Dockerfiles for API and Web under `deploy/staging`.
- Docker Compose staging configuration.
- Environment examples under `deploy/staging` and `infrastructure/inventory`.
- Nginx templates under `infrastructure/nginx`.
- Systemd service and timer units under `infrastructure/systemd`.
- UFW baseline script.
- SSH hardening scripts.
- Fail2ban and logrotate examples.
- Backup, restore, monitor, deploy, rollback, and validation scripts.
- Operational runbooks under `infrastructure/docs`.

Current gaps:

- Terraform is not implemented.
- Kubernetes manifests are not implemented.
- Helm charts are not implemented.
- GitOps manifests are not implemented.
- IaC drift detection is not implemented.
- Production infrastructure definitions are not complete.

## IaC Rules

- Infrastructure changes must be versioned.
- Manual production changes are prohibited except approved emergency actions.
- Infrastructure syntax must be validated in CI where possible.
- Environment-specific values must use external configuration.
- Secrets must not appear in IaC files.
- IaC changes must be auditable and rollback-aware.

## Validation

Current validation includes:

- Shell syntax validation.
- Docker Compose configuration validation.
- Nginx template validation.
- Systemd unit syntax validation where available.
- Secret scan.
- Infrastructure Pack validation.

Future validation should add:

- Terraform plan validation.
- Kubernetes manifest validation.
- Helm template validation.
- Policy-as-code validation.
- Drift detection.

## Audit Events

Audit:

- Infrastructure changed.
- IaC validation passed.
- IaC validation failed.
- Manual emergency change recorded.
- Drift detected.
- Drift remediated.
