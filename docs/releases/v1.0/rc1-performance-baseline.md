# RC1 Performance Baseline

Status: LIVE_ACTION_REQUIRED
Generated: 2026-08-12

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

## Blocker 08 Closure Attempt

Blocker 08 was evaluated against the repository tooling. The repository has
staging health, smoke, monitoring, and validation commands. It does not define
formal p50/p95/p99 SLO thresholds or a dedicated load-test runner such as k6,
autocannon, Artillery, Lighthouse, or wrk.

No synthetic threshold was created for RC1. The required closure evidence is a
measured, non-destructive staging baseline for the deployed artifact.

## Required Baseline Capture

Run from the live VPS:

```bash
cd /opt/laborator-editura
set -a
. deploy/staging/.env.staging
set +a
export STAGING_ENV_FILE=/opt/laborator-editura/deploy/staging/.env.staging
export STAGING_COMPOSE_FILE=/opt/laborator-editura/deploy/staging/docker-compose.artifact.yml
pnpm install --frozen-lockfile
pnpm staging:health
pnpm staging:smoke
pnpm staging:monitor
pnpm staging:validate
docker compose --env-file "$STAGING_ENV_FILE" -f "$STAGING_COMPOSE_FILE" ps
docker stats --no-stream
```

Then capture a non-destructive latency baseline for:

- web `/`;
- web representative authenticated route after login;
- API `/health`;
- API representative read endpoint;
- API representative authenticated request;
- project/document read path;
- backup dry-run;
- restore dry-run.

Each measurement must record test duration, request count, concurrency,
p50, p95, p99 where available, error count, restart count, CPU, memory, disk
state, and log error summary. If no official threshold exists, record measured
baseline values only and do not claim SLO compliance.

## Decision

The local build/test baseline is acceptable as a repository sanity baseline.
It is not sufficient for RC1 full GO. A staging performance baseline must be
captured from the deployed candidate.

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
