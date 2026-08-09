# Security Test Evidence

Status: Local validation passed with documented release evidence gaps  
Owner: DevSecOps

## Required Security Tests

- secret scan;
- dependency vulnerability scan;
- container/filesystem vulnerability scan;
- security headers validation;
- rate limit validation;
- unauthenticated access negative tests;
- role/tenant isolation negative tests;
- backup secret exclusion/encryption check;
- infrastructure permission review.

## Current Repository Evidence

- `infrastructure/validation/scan-secrets.sh`.
- `.github/workflows/ci.yml` runs secret scan and Trivy.
- Security hardening tests exist in `apps/api/tests/security-hardening-contract.test.mjs`.
- Auth context and foundation security tests exist in `apps/api/tests/`.

## Latest Batch 10 Validation

- `bash infrastructure/validation/scan-secrets.sh`: PASS.
- `bash infrastructure/validation/validate-infrastructure.sh`: PASS.
- `git diff --check`: PASS.
- `pnpm format:check`: PASS.
- `pnpm --filter @laborator/api build`: PASS.
- `pnpm --filter @laborator/api test`: PASS, 483 tests passed.
- `pnpm --filter @laborator/web build`: PASS.
- `pnpm test`: PASS across all workspace packages.
- `pnpm build`: PASS across all workspace packages.

## Non-Blocking Local Warnings

- Local Docker is not installed, so Docker Compose validation was skipped by the infrastructure validator on this workstation.
- Local nginx is not installed, so the nginx template validator rendered the complete config and reported success without running native `nginx -t`.
- Local systemd is not installed, so systemd unit validation was skipped locally.
- Next.js reported the existing ESLint plugin warning during production build.
- Turborepo reported that `pnpm-lock.yaml` is missing; dependency locking remains an RC1 supply-chain evidence gap.
