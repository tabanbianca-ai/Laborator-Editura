# v1.1 Performance Opportunities

Status: MEASUREMENT_PLAN_CREATED  
Owner: Platform Operations

## Purpose

This document identifies candidate performance work for v1.1. No optimization is
approved without real measurement.

## Measurement Sources Required

- Pilot or production API latency.
- Page load and route transition data.
- Library and search response times.
- Master document load and save latency.
- Publication build duration.
- Queue latency.
- Reader load time.
- AI latency separated by provider and task.
- Database query latency.
- Build and CI timings.

## Candidate Opportunities

| ID | Area | Potential issue | Evidence status | Priority | Rule |
| --- | --- | --- | --- | --- | --- |
| PERF-V11-001 | API endpoints | Slow endpoint detection | MISSING_REAL_METRICS | P2 | Measure before optimizing |
| PERF-V11-002 | Database queries | Costly query or missing index detection | MISSING_REAL_METRICS | P2 | Use query evidence |
| PERF-V11-003 | Web build | Build duration and bundle size trend | LOCAL_BUILD_ONLY | P3 | Compare against baseline |
| PERF-V11-004 | Search | Library and research search responsiveness | MISSING_REAL_METRICS | P2 | Measure realistic datasets |
| PERF-V11-005 | Publishing | Export/package generation duration | MISSING_REAL_METRICS | P2 | Measure real artifacts |
| PERF-V11-006 | Multimedia | Excessive regeneration or duplicate work | MISSING_REAL_METRICS | P3 | Measure generated assets |
| PERF-V11-007 | Caching | Inefficient cache behavior | MISSING_REAL_METRICS | P3 | Add only if measured |

## Current Local Evidence

Local validation confirms that `pnpm typecheck`, `pnpm test`, and `pnpm build`
pass. These local timings are not production performance baselines.

