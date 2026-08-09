# RC1 Performance Baseline

Status: PARTIAL_BLOCKED  
Generated: 2026-08-09

## Local Build and Test Baseline

| Measurement | Value |
| --- | --- |
| DB tests | 49 tests, approximately 509 ms |
| Shared tests | 62 tests, approximately 163 ms |
| Web tests | 128 tests, approximately 264 ms |
| API tests | 505 tests, approximately 444 ms |
| Web production build | Passed, approximately 5.4 seconds command wall time |
| Generated Next routes | 36 routes |
| Web shared first-load JS | 102 kB |
| Largest listed route payload | `/editor`, 4.1 kB route size, 106 kB first-load JS |
| Middleware size | 34.4 kB |

## Runtime Baseline Missing

| Measurement | Result | Evidence Gap |
| --- | --- | --- |
| API health latency | MISSING | No live API could be bound in local sandbox; staging API was not running |
| Web health latency | MISSING | Staging web was not running |
| Critical workflow latency | MISSING | No browser or API staging workflow run was available |
| Concurrent request sanity | MISSING | No load or concurrency probe was executed |
| Docker resource usage | MISSING | Docker unavailable locally |
| VPS metrics | MISSING | No live VPS metrics were captured during this run |

## Decision

The local build/test baseline is acceptable as a repository sanity baseline.
It is not sufficient for RC1 pilot approval. A staging performance baseline must
be captured from the deployed candidate.

## Required Before Pilot

- API `/health` p50/p95 latency.
- Web `/` p50/p95 latency.
- Login/session check latency.
- Pipeline page latency.
- Translation save latency.
- Export or export placeholder latency.
- Backup dry-run duration.
- Restore dry-run duration.
- Basic CPU, memory, disk, and log-error summary from staging.

