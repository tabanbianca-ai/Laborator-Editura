# Supply Chain Security

Status: Policy defined; RC1 evidence pending  
Owner: DevSecOps

## Required Evidence

- dependency lockfile;
- dependency vulnerability scan;
- container vulnerability scan;
- SBOM;
- build provenance;
- immutable artifact digest;
- reviewed GitHub Actions permissions;
- no secrets in repository;
- no unknown binary dependency introduced for release.

## Current Evidence

- `.github/workflows/ci.yml` includes `pnpm audit --audit-level high`.
- `.github/workflows/ci.yml` includes Trivy filesystem scan.
- `infrastructure/validation/scan-secrets.sh` is present.

## RC1 Gate

RC1 cannot be approved with unresolved Critical vulnerabilities, missing secret scan evidence, missing SBOM, or missing artifact provenance.

## Batch 10 Local Evidence

- Secret scan: PASS.
- Workspace build: PASS.
- Workspace test: PASS.
- Workspace typecheck: PASS.
- Dependency lockfile: GAP, `pnpm-lock.yaml` is missing in the current workspace snapshot.
- SBOM: GAP, generated artifact pending.
- Build provenance: GAP, immutable artifact digest evidence pending.
