# Phase 7 Step 16 - Publishing Workflow, Final Preflight and Distribution Tracking

## Status

Implemented as an additive refinement of the existing publishing infrastructure.

## Scope Confirmation

- No new enterprise module was created.
- No separate Preflight module was created.
- No separate Archive module was created.
- No social-media promotion workflow was implemented.
- No Docker or staging configuration was changed.
- No breaking API change was introduced.

## Ownership Boundaries

- Library remains the single source of truth for publication identity,
  lifecycle, editions, versions, metadata, files, rights/provenance references,
  and publication history.
- Publishing owns official edition selection, publication readiness state,
  human release gates, publication timestamps, selected channels, and immutable
  official publication snapshots.
- Export owns generated files and format artifacts.
- Rights & Provenance owns publication authorization and rights warnings.
- Quality Agent owns quality findings.
- Final Preflight aggregates existing signals only.
- Distribution tracks channel delivery status and history only.

## Implemented Backend Capabilities

- Publishing preflight generation and retrieval.
- Publishing record preparation.
- State transitions:
  - `IN_PREGATIRE`.
  - `GATA_PENTRU_PUBLICARE`.
  - `PUBLICAT`.
  - `REPUBLICAT`.
  - `RETRAS_DIN_PUBLICARE`.
- Critical preflight errors block readiness and publishing.
- Official edition and version selection references Library records.
- Published edition snapshots are immutable.
- Republishing creates a separate publishing record and preserves the previous
  record.
- Withdrawal preserves Library records, generated files, audit history,
  versions, and distribution history.
- Distribution history supports:
  - `PENDING`.
  - `DELIVERED`.
  - `FAILED`.
  - `WITHDRAWN`.
- Approved channels:
  - `INTERNAL_LIBRARY`.
  - `PUBLIC_PORTAL`.
  - `DIGITAL_BOOKSTORE`.
  - `EXTERNAL_EXPORT`.
  - `PRINT_ON_DEMAND`.

## Runtime Persistence and Backup

Runtime database tables added:

- `layout_publishing_preflight_results`.
- `layout_publishing_records`.
- `layout_publishing_distribution_records`.

Backup/restore support includes the same tables and validates references to:

- Library publications.
- Library editions.
- Library versions.
- Publishing preflight results.
- Publishing records.
- Layout publication audit events.

## Frontend Refinement

The Distribution Center now displays:

- Publishing readiness percentage.
- Official publishing state.
- Official preflight status.
- Preflight source component.
- Preflight severity.
- Remediation link.
- Approved publication channels.

The UI remains read-only for launch readiness and keeps publication actions
disabled unless a human approval endpoint and workflow gate are available.

## Audit Coverage

Audit events cover:

- Preflight generated.
- Preflight refreshed.
- Warning accepted.
- Override applied.
- Official edition selected.
- Publishing state changed.
- Publication created.
- Edition published.
- Publication withdrawn.
- Publication republished.
- Distribution initiated.
- Distribution delivered.
- Distribution failed.
- Channel withdrawn.

## Human Final Authority

AI may summarize readiness, detect blockers, and suggest remediation.

AI may not:

- Approve publication.
- Publish automatically.
- Withdraw publication automatically.
- Distribute automatically.
- Bypass rights.
- Override workflow gates.
- Replace authorized human approval.

## Validation Coverage

Added contract coverage for:

- Publishing state definitions.
- Preflight statuses and severities.
- Approved publication channels.
- No duplicate Preflight or Distribution modules.
- No social-media promotion workflow.
- Readiness/preflight aggregation.
- Rights/provenance blocking.
- Immutable official editions.
- Republishing as a new record.
- Distribution history.
- Audit coverage.
- Runtime database and backup/restore compatibility.

## Validation Performed

- `git diff --check` - PASS.
- `pnpm --filter @laborator/db typecheck` - PASS.
- `pnpm --filter @laborator/db build` - PASS.
- `pnpm --filter @laborator/db test` - PASS.
- `pnpm --filter @laborator/api typecheck` - PASS.
- `pnpm --filter @laborator/api build` - PASS.
- `pnpm --filter @laborator/api test` - PASS.
- `pnpm --filter @laborator/web typecheck` - PASS.
- `pnpm --filter @laborator/web build` - PASS.
- `pnpm --filter @laborator/web test` - PASS.
- `pnpm typecheck` - PASS.
- `pnpm test` - PASS.
- `pnpm build` - PASS.

Turborepo reported the existing non-blocking warning that `pnpm-lock.yaml` is
not present, but all package tasks completed successfully.

## Result

Phase 7 Step 16 is ready for validation as part of the v1.0 release workflow.
