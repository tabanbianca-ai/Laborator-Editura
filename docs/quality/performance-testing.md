# Performance Testing

## Purpose

Performance testing verifies that the platform remains responsive, scalable,
and efficient.

## Required Measurements

- API latency.
- Web response time.
- Build duration.
- Test duration.
- CPU usage.
- Memory usage.
- Runtime database operations.
- Backup and restore duration.
- Workflow execution time.
- AI execution time and cost.
- Export generation duration when real generation is enabled.

## Current Baseline

Current CI runs typecheck, tests, lint, build, and selected infrastructure
validation. Observability and platform engineering modules store metadata for
future diagnostics. Formal performance benchmarks are not yet configured.

## Performance Test Rules

- Measure before optimizing.
- Avoid fragile timing assertions in normal CI.
- Use dedicated benchmark jobs for thresholds.
- Track trends over time.
- Use representative but non-production data.

## Required Future Coverage

- API smoke latency checks.
- Web production build budget.
- Test suite duration tracking.
- Backup/restore duration tracking.
- AI cost and duration tracking.
- Load testing before public high-traffic launch.

## Acceptance Criteria

- Critical paths have defined performance expectations.
- Regressions are visible before release.
- Performance tests do not make normal CI flaky.
