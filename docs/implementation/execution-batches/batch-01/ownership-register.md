# Ownership Register

| Area | Owner | Primary files |
| --- | --- | --- |
| Shared configuration foundation | Shared package | `packages/shared/src/configuration.ts` |
| Shared error foundation | Shared package | `packages/shared/src/errors.ts` |
| Shared logging foundation | Shared package | `packages/shared/src/structured-logging.ts` |
| Shared localization foundation | Shared package | `packages/shared/src/localization.ts`, `packages/shared/locales` |
| Health endpoints | API application | `apps/api/src/modules/health.controller.ts` |
| Request authentication middleware | Auth module | `apps/api/src/modules/auth/request-context.middleware.ts` |
| Secret scanning | Infrastructure validation | `infrastructure/validation/scan-secrets.sh` |
| Configuration validation script | Repository tooling | `scripts/validate-configuration.mjs` |
| CI gates | Repository CI | `.github/workflows/ci.yml` |

## Rule

Batch 01 ownership entries do not transfer business data ownership. Product data
ownership remains with existing modules and repositories.

