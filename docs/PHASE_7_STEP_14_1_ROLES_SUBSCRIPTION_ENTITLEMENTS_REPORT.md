# Phase 7 Step 14.1 - Roles, Permissions and Subscription Entitlements Report

## Status

Implemented as an additive Workspace and Administration access-policy
refinement.

## Scope

- Backend Workspace policy foundation.
- Frontend Administration display refinement.
- No new enterprise module.
- No Docker or staging configuration changes.
- No breaking API changes.

## Implemented

- Central effective-access policy:
  `Role permissions × Subscription entitlements × Need-to-Know scope`.
- Additive endpoints:
  - `GET /workspace/subscription`.
  - `POST /workspace/access/resolve`.
- Official operational roles are modeled separately from commercial plans.
- Subscription plans are modeled as `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`,
  and disabled `ENTERPRISE_RESERVED`.
- Plan entitlements cover active projects, storage, collaborators, AI
  availability, AI usage, translation volume, export formats, editorial tools,
  collaboration, team administration, audit retention, backup retention,
  publishing channels, distribution channels, API access, and priority
  processing.
- Plan limit behavior preserves existing data and blocks only restricted new
  actions.
- Downgrade behavior preserves content, audit, versions, projects, files, and
  collaborators.
- Over-limit resources may become read-only where necessary.
- Administration now separates:
  - Users and Roles.
  - Subscription and Usage.
- Plan names are not presented as editorial role names.

## Audit

Workspace audit actions now reserve coverage for:

- Role assigned.
- Role changed.
- Role revoked.
- Subscription activated.
- Subscription changed.
- Subscription upgrade.
- Subscription downgrade.
- Quota exceeded.
- Feature blocked.
- Temporary access expiration.
- Human override.

## Validation

Added contract coverage in:

- `apps/api/tests/roles-subscription-entitlements-contract.test.mjs`
- `apps/web/tests/administration-entitlements-contract.test.mjs`

Expected validation commands:

```bash
git diff --check
pnpm --filter @laborator/api typecheck
pnpm --filter @laborator/api build
pnpm --filter @laborator/web typecheck
pnpm --filter @laborator/web build
pnpm --filter @laborator/api test
pnpm --filter @laborator/web test
pnpm typecheck
pnpm test
pnpm build
```

## Out Of Scope

- No billing provider integration.
- No payment flow.
- No destructive downgrade automation.
- No new subscription module.
- No Docker/staging changes.
