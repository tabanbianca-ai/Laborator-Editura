# Cache Strategy

## Purpose

Cache improves read performance without replacing the official data source.

## Allowed Cache Uses

Cache may be used for:

- Reference data.
- Configuration.
- Calculated permissions.
- Frequent read results.
- Public content metadata.
- Linguistic resource metadata.
- Module readiness metadata.

## Cache Rules

Each cache use must define:

- Key format.
- Organization or workspace scope.
- Permission scope when applicable.
- Time to live.
- Invalidation strategy.
- Failure behavior.
- Audit requirements if cache influences access or governance.

Cache must not store:

- Raw secrets.
- Passwords.
- Session tokens.
- Restricted document content unless explicitly approved and encrypted.
- Cross-tenant data in shared keys.

## Current Baseline

The backend does not yet have a central cache abstraction. Current in-memory
state appears in limited infrastructure support such as rate limit buckets and
runtime database test/storage foundations.

## Required Alignment

Future cache implementation should provide:

- `CachePort`.
- Environment-specific adapters.
- Tenant-safe key builder.
- Typed cache records.
- Explicit TTLs.
- Invalidation hooks.
- Observability metrics.

## Acceptance Criteria

- Cache misses preserve correctness.
- Cache keys include tenant or workspace scope when needed.
- Access decisions are not weakened by cached data.
- Cache behavior is testable.
