# Performance Baseline

Status: Baseline model defined; real staging measurements pending  
Owner: Platform Operations

## Required Measurements

- API latency;
- page load;
- library search;
- master document load;
- save latency;
- publication build;
- queue latency;
- reader load;
- AI latency separately;
- DB latency.

## Rule

No invented thresholds are allowed. RC1 records the real baseline and flags obvious degradation.

## Current Local Evidence

Build and test execution times were recorded by command output. They are not production performance baselines.

Latest local validation:

- `pnpm typecheck`: PASS.
- `pnpm --filter @laborator/api test`: PASS, 491 tests passed.
- `pnpm test`: PASS.
- `pnpm build`: PASS.

Observed local caveat: Turborepo reports missing `pnpm-lock.yaml`, so dependency freeze remains incomplete.

## RC1 Gap

Run staging measurements and record the observed values for the exact RC1 candidate.
