# Phase 10 - Staging Deployment Plan

Date: 2026-06-14

Status: Prepared for staging deployment planning.

Scope:

- Documentation and deployment planning only.
- No code changes.
- No database schema changes.
- No API contract changes.
- No new modules.
- No feature expansion.

Purpose: define the staging architecture, infrastructure, environment inventory,
deployment steps, backup and restore procedure, monitoring plan, role bootstrap
procedure, and end-to-end validation checklist required before closed beta.

Related documents:

- `docs/STAGING_DEPLOYMENT_PREPARATION.md`
- `docs/STAGING_VALIDATION_PLAN.md`
- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/POST_RELEASE_MONITORING.md`

## 1. Deployment Architecture Review

The MVP staging deployment consists of the existing monorepo applications and
runtime persistence model:

```text
GitHub / CI
  -> build and validation
  -> staging host or container platform
       -> web application, Next.js
       -> API application, NestJS
       -> runtime database JSON file on persistent storage
       -> backup directory on persistent storage
       -> logs collected by host, process manager, or platform
```

Current deployable units:

| Unit | Path | Runtime | Role |
| --- | --- | --- | --- |
| Web app | `apps/web` | Next.js | Browser UI and server-side frontend API access |
| API app | `apps/api` | NestJS | Auth, projects, documents, segments, translations, TM, terminology, QA, semantic fidelity, workflow, export |
| Runtime DB | `packages/db` | Node/file-backed runtime database | MVP persistence for staging |
| Shared contracts | `packages/shared` | TypeScript | JSON Master and shared validation contracts |

Current persistence model:

- Runtime data is stored in a deterministic JSON-backed runtime database.
- The runtime database path is controlled by `LABORATOR_RUNTIME_DB_PATH`.
- Backup and restore use existing scripts in `packages/db/scripts`.
- Staging must provide persistent storage outside the repository.

Security model to preserve:

- API identity must come only from authenticated server-side session or bearer token.
- Frontend server code may send `Authorization: Bearer <session-token>`.
- Clients must not provide `userId`, `organizationId`, `tenantId`, or roles.
- Privileged workflow approval/export actions require authorized human roles.
- Tenant isolation must remain enforced by server-derived organization context.

Staging architecture decision:

- Use one isolated staging environment.
- Do not use production data.
- Do not enable future modules.
- Do not share runtime database or backup storage with local or production
  environments.

## 2. Required Staging Infrastructure

Minimum infrastructure:

| Requirement | Required value |
| --- | --- |
| Runtime | Node.js 22.x |
| Package manager | Corepack with `pnpm` 10.12.1 |
| Package access | Outbound access to package registry during deployment |
| Compute | One staging host or container platform capable of running API and web processes |
| API process | `@laborator/api` on port `3001` or platform-provided port |
| Web process | `@laborator/web` on port `3000` or platform-provided port |
| TLS | HTTPS endpoint for web and API |
| Reverse proxy | Routes web and API traffic to the correct process |
| Runtime storage | Persistent file storage for runtime database JSON |
| Backup storage | Persistent directory for deterministic backup JSON files |
| Log storage | Platform logs, process manager logs, or host log collection |
| Access control | Closed beta allowlist or equivalent staging restriction |

Recommended paths:

```text
/opt/laborator/app
/var/lib/laborator/staging/runtime-db.json
/var/backups/laborator/staging
/var/log/laborator/staging
/tmp/laborator-staging-restore/runtime-db.json
```

Recommended endpoints:

```text
Web: https://staging.example.com
API: https://staging-api.example.com
```

Staging must be considered blocked until these items exist:

- A real staging host or platform is selected.
- HTTPS endpoints are available.
- Persistent runtime database path is configured.
- Persistent backup directory is configured.
- Package installation can run.
- Hosted CI is green.
- `pnpm typecheck` passes in a dependency-enabled environment.

## 3. Deployment Implementation Plan

### Phase 10.1 - Environment Provisioning

1. Provision staging compute.
2. Configure DNS and HTTPS for web and API endpoints.
3. Configure persistent runtime database path.
4. Configure persistent backup directory.
5. Configure log retention and log access.
6. Restrict access to approved closed beta users/operators.

Exit criteria:

- Staging host is reachable.
- Required persistent directories exist.
- Logs are accessible to the deployment owner.

### Phase 10.2 - CI Validation

Run hosted GitHub Actions on the release branch:

```bash
git push -u origin <release-branch>
gh run list --workflow CI --branch <release-branch> --limit 5
gh run watch <run-id>
gh run view <run-id> --log-failed
```

Required CI outcomes:

- API contract/integration tests pass.
- DB migration/runtime/backup tests pass.
- Shared JSON Master tests pass.
- Fixture JSON validation passes.
- Dependency installation succeeds where package access is available.
- `pnpm typecheck` passes.

Exit criteria:

- Hosted CI is green.
- Typecheck is green in CI or in another dependency-enabled staging validation
  environment.

### Phase 10.3 - Dependency Installation And Build

Run from the staging application directory:

```bash
cd /opt/laborator/app
node --version
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm --version
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Exit criteria:

- Node.js is version 22.x.
- `pnpm` is version 10.12.1.
- Install, typecheck, tests, and build complete successfully.

### Phase 10.4 - Runtime Configuration

Configure environment variables from Section 4.

Rules:

- Do not commit real environment values.
- Do not store secrets in documentation.
- Keep runtime files outside the repository.
- Use staging-only users, organizations, and data.

Exit criteria:

- API can read `PORT`, `WEB_ORIGIN`, and `LABORATOR_RUNTIME_DB_PATH`.
- Web can read `API_BASE_URL` for server-side API calls.
- Runtime database file can be created and written.

### Phase 10.5 - Service Start

Start API and web processes using the selected deployment platform.

Generic commands after build:

```bash
pnpm --filter @laborator/api start
pnpm --filter @laborator/web start
```

If the platform uses process definitions, map them to:

```text
API: apps/api/dist/main.js
Web: Next.js production server for apps/web
```

Exit criteria:

- API responds on the staging API endpoint.
- Web responds on the staging web endpoint.
- CORS allows the configured web origin.

### Phase 10.6 - Backup And Restore Dry-Run

Run pre-smoke backup and restore from Section 5.

Exit criteria:

- Backup returns `status: "ok"`.
- Restore returns `status: "ok"`.
- Backup schema version is `1.0`.
- Tenant boundaries are preserved.

### Phase 10.7 - Human Role Bootstrap

Run the server-side admin/reviewer bootstrap procedure from Section 7.

Exit criteria:

- Bootstrap user has server-side `ADMIN` or `REVIEWER` role.
- A fresh session resolves the role from server-derived identity.
- Spoofed identity headers do not change access.

### Phase 10.8 - End-to-End Staging Validation

Run the checklist in Section 8.

Exit criteria:

- Full MVP path passes in staging.
- Export artifact is generated.
- Audit events are written.
- Backup and restore pass again after smoke data exists.

## 4. Environment Variable Inventory

### Runtime Variables

| Variable | App | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| `PORT` | API | Yes | `3001` | API listen port |
| `WEB_ORIGIN` | API | Yes | `https://staging.example.com` | CORS allowed web origin |
| `LABORATOR_RUNTIME_DB_PATH` | API/DB | Yes | `/var/lib/laborator/staging/runtime-db.json` | Persistent runtime database file |
| `API_BASE_URL` | Web | Yes for staging | `https://staging-api.example.com` | Server-side web API base URL |
| `NEXT_PUBLIC_API_BASE_URL` | Web | Optional | `https://staging-api.example.com` | Optional public fallback; prefer `API_BASE_URL` for server-side calls |

Notes:

- The frontend session cookie name is currently `laborator_session_token`.
- The cookie name is not currently configured by environment variable.
- The frontend must not read or send client-controlled identity fields.

### Operator Validation Variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `API_BASE` | Yes | `https://staging-api.example.com` | Operator smoke test API base |
| `STAGING_WEB_ORIGIN` | Yes | `https://staging.example.com` | Operator record of web origin |
| `STAGING_BACKUP_DIR` | Yes | `/var/backups/laborator/staging` | Backup output directory |
| `STAGING_RESTORE_DB_PATH` | Yes | `/tmp/laborator-staging-restore/runtime-db.json` | Temporary restore target |
| `STAGING_REVIEWER_EMAIL` | Yes | `beta-reviewer@example.com` | Bootstrap reviewer/admin email |
| `STAGING_REVIEWER_NAME` | Yes | `Beta Reviewer` | Bootstrap display name |
| `STAGING_ORGANIZATION_NAME` | Yes | `Closed Beta Organization` | Bootstrap organization |
| `STAGING_BOOTSTRAP_ROLE` | Yes | `REVIEWER` | Must be `ADMIN` or `REVIEWER` |

### CI Variables

No application secrets are required for the existing contract validation CI.
Hosted CI requires:

- GitHub Actions enabled.
- Package registry access.
- Node.js 22.x setup.
- Corepack and `pnpm` 10.12.1.

### Secret Handling Rules

- Do not commit real values.
- Do not place secrets in `.env` files committed to source control.
- Store provider secrets in the staging platform secret manager.
- Use staging-only credentials.
- Rotate credentials if a staging value is exposed.

## 5. Backup And Restore Procedure

### Pre-Deployment Backup

```bash
mkdir -p "$STAGING_BACKUP_DIR"

node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out "$STAGING_BACKUP_DIR/runtime-db-pre-deploy.json"
```

Expected output:

```json
{
  "status": "ok",
  "action": "backup",
  "schemaVersion": "1.0"
}
```

### Restore Dry-Run

```bash
mkdir -p "$(dirname "$STAGING_RESTORE_DB_PATH")"

node packages/db/scripts/restore-runtime-db.mjs \
  --db "$STAGING_RESTORE_DB_PATH" \
  --in "$STAGING_BACKUP_DIR/runtime-db-pre-deploy.json"
```

Expected output:

```json
{
  "status": "ok",
  "action": "restore",
  "schemaVersion": "1.0"
}
```

### Post-Smoke Backup

```bash
node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out "$STAGING_BACKUP_DIR/runtime-db-post-smoke.json"
```

### Post-Smoke Restore Dry-Run

```bash
node packages/db/scripts/restore-runtime-db.mjs \
  --db "$STAGING_RESTORE_DB_PATH" \
  --in "$STAGING_BACKUP_DIR/runtime-db-post-smoke.json"
```

Backup validation checklist:

- Backup file exists.
- Backup JSON parses.
- Backup metadata includes schema version.
- Restore validates the backup before applying.
- Restored database contains MVP tables.
- Tenant-scoped data remains separated.

Restore usage rule:

- Restore to staging runtime database only after preserving the current runtime
  file and confirming rollback approval from the deployment owner.

## 6. Monitoring And Logging Plan

### Logging Sources

| Source | Required capture |
| --- | --- |
| API process | Startup, request errors, auth failures, validation errors, export failures |
| Web process | Startup, server-side API call failures, rendering failures |
| Reverse proxy/platform | Access logs, TLS errors, 4xx/5xx rates |
| Runtime DB path | File write failures, backup failures, restore failures |
| CI | Failed test, install, typecheck, and build logs |

Current limitation:

- Production-grade structured logging is not yet implemented in application
  code. Staging must capture platform/process logs until logging is improved.

### Metrics To Track

| Area | Metric | Review cadence |
| --- | --- | --- |
| Availability | API and web uptime | Continuous during beta |
| Errors | API 5xx rate and web server errors | Daily during first beta week |
| Auth | Login failures and rejected unauthenticated requests | Daily |
| Security | Spoofed identity header attempts and denied privileged actions | Daily |
| Tenant isolation | Cross-tenant access denials or anomalies | Daily |
| Persistence | Runtime DB write failures and file growth | Daily |
| Backup | Backup success and file validation | Daily |
| Restore | Restore dry-run success | Before beta and weekly |
| Workflow | Blocked documents and failed transitions | Daily |
| Export | Export success and JSON Master validation | Daily |
| Audit | Audit event creation volume and failures | Daily |

### Alert Conditions

Alert the deployment owner if any occur:

- API unavailable.
- Web unavailable.
- API 5xx rate exceeds the accepted staging threshold.
- Authentication broadly fails for valid beta users.
- Unauthorized role escalation is suspected.
- Spoofed identity headers change identity or authorization.
- Cross-tenant data access is suspected.
- Runtime database write fails.
- Backup generation fails.
- Restore dry-run fails.
- Export artifact generation fails.
- Audit events stop being written.

### Log Retention

Minimum staging retention:

- CI logs: keep according to GitHub Actions retention policy.
- API/web logs: 14 days minimum during closed beta.
- Backup logs: keep with backup files.
- Incident logs: preserve until incident review is complete.

## 7. Admin/Reviewer Bootstrap Procedure

Purpose: create an authorized human role in staging without trusting
client-provided identity or roles.

Prerequisites:

- API is running.
- `LABORATOR_RUNTIME_DB_PATH` points to the staging runtime database.
- Operator has secure host access.
- `STAGING_BOOTSTRAP_ROLE` is `ADMIN` or `REVIEWER`.

### Step 1 - Create Or Refresh The User Session

```bash
LOGIN_JSON="$(curl -sfS -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$STAGING_REVIEWER_EMAIL\",\"displayName\":\"$STAGING_REVIEWER_NAME\",\"organizationName\":\"$STAGING_ORGANIZATION_NAME\"}")"

USER_ID="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).user.id));")"
ORG_ID="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).organization.id));")"
```

### Step 2 - Add Server-Side Role In Runtime Database

```bash
node - "$LABORATOR_RUNTIME_DB_PATH" "$ORG_ID" "$USER_ID" "$STAGING_BOOTSTRAP_ROLE" <<'NODE'
const fs = require("node:fs");
const crypto = require("node:crypto");

const [dbPath, organizationId, userId, requestedRole] = process.argv.slice(2);
const allowedRoles = new Set(["ADMIN", "REVIEWER"]);

if (!allowedRoles.has(requestedRole)) {
  throw new Error("STAGING_BOOTSTRAP_ROLE must be ADMIN or REVIEWER.");
}

const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
db.user_roles = Array.isArray(db.user_roles) ? db.user_roles : [];

const now = new Date().toISOString();
const roles = ["TRANSLATOR", requestedRole];

for (const role of roles) {
  const exists = db.user_roles.some((row) =>
    row.organizationId === organizationId &&
    row.userId === userId &&
    row.role === role
  );

  if (!exists) {
    db.user_roles.push({
      id: crypto.randomUUID(),
      organizationId,
      userId,
      role,
      createdAt: now
    });
  }
}

fs.writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);
NODE
```

### Step 3 - Create A Fresh Session

```bash
LOGIN_JSON="$(curl -sfS -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$STAGING_REVIEWER_EMAIL\",\"displayName\":\"$STAGING_REVIEWER_NAME\",\"organizationName\":\"$STAGING_ORGANIZATION_NAME\"}")"

TOKEN="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).session.token));")"
AUTH_HEADER="Authorization: Bearer $TOKEN"
```

### Step 4 - Verify Server-Derived Identity

```bash
curl -sfS "$API_BASE/auth/me" -H "$AUTH_HEADER"

curl -sfS "$API_BASE/auth/me" \
  -H "$AUTH_HEADER" \
  -H "x-user-id: spoofed-user" \
  -H "x-organization-id: spoofed-org" \
  -H "x-user-roles: ADMIN"
```

Expected result:

- Authenticated context comes from the server-side session.
- Spoofed identity headers do not affect identity or authorization.
- The fresh session includes the server-side role required for human approval.

## 8. End-To-End Staging Validation Checklist

Run after deployment, backup dry-run, and role bootstrap.

### Infrastructure Checks

- Web endpoint responds over HTTPS.
- API endpoint responds over HTTPS.
- API CORS allows the staging web origin.
- Runtime database file exists at `LABORATOR_RUNTIME_DB_PATH`.
- Runtime database file is on persistent storage.
- Backup directory exists and is writable.
- Logs are accessible.

### Security Checks

- Login returns a valid session token.
- `/auth/me` works with `Authorization: Bearer <token>`.
- Requests without valid context are rejected.
- Spoofed `x-user-id` is ignored.
- Spoofed `x-organization-id` is ignored.
- Spoofed `x-user-roles` cannot grant admin/reviewer access.
- Tenant isolation is preserved.

### MVP Workflow Checks

- Project can be created.
- Document can be created.
- Segments can be created or loaded.
- Translation can be submitted.
- Translation persistence updates the segment latest target text.
- Translation Memory entry can be created.
- Translation Memory entry can be approved by authorized human role.
- Approved Translation Memory entry can be searched.
- Terminology term can be created.
- Terminology term can be validated.
- Validated terminology takes priority over TM and AI suggestions.
- QA can run on segment and document.
- QA blocks workflow review when unresolved High or Critical issues exist.
- Semantic Fidelity can run on segment and document.
- Semantic Fidelity blocks approval when unresolved High or Critical issues exist.
- Workflow can advance through the approved MVP states.
- Authorized human approval works.
- Document can be marked ready for export only after approval.
- Export artifact is generated.
- JSON Master export is valid JSON.
- Audit events are written for foundation mutations and workflow transitions.

Approved MVP path:

```text
Authentication
-> Project
-> Document
-> Segments
-> Translation
-> Translation Memory
-> Terminology Validation
-> QA Validation
-> Semantic Fidelity Validation
-> Workflow Review
-> Approval
-> Ready for Export
-> Export
```

### Frontend Checks

- Projects page loads data from API.
- Documents page loads data from API.
- Editor opens with `/editor?documentId=<document-id>`.
- Editor segment list loads persisted segments.
- Active source segment renders from API data.
- Target translation renders latest persisted translation when available.
- Save button shows pending state during save.
- Save success state appears after successful translation submit.
- Save failed state appears if the API rejects the save.
- TM, Terminology, QA, Semantic Fidelity, Workflow, and Export UI panels remain
  placeholders unless their API integration phases are explicitly approved.

### Backup Checks After Smoke Data

- Post-smoke backup succeeds.
- Post-smoke restore dry-run succeeds.
- Restored data includes projects, documents, segments, translations, TM,
  terminology, QA, semantic fidelity, workflow, export artifacts, and audit
  events.

## 9. Staging Entry And Rollback Criteria

### Staging Deployment Entry Criteria

Staging deployment may begin only when:

- Deployment owner is assigned.
- Monitoring owner is assigned.
- Incident response owner is assigned.
- Staging infrastructure is provisioned.
- Hosted CI is green.
- Dependencies install successfully.
- `pnpm typecheck` passes.
- Runtime and backup paths are persistent.
- Environment variables are configured outside source control.

### Closed Beta Entry Criteria

Closed beta may open only when:

- Staging deployment is complete.
- End-to-end staging validation passes.
- Backup and restore pass before and after smoke data.
- Admin/reviewer bootstrap is verified.
- No Critical findings are open.
- No High findings are open.
- Remaining Medium and Low findings are accepted or scheduled.
- Beta users and organizations are explicitly approved.
- Support and incident response owners are assigned.

### Rollback Criteria

Rollback if any condition occurs:

- Authentication broadly fails for valid beta users.
- Unauthorized role escalation is possible.
- Tenant isolation is suspected to be broken.
- Runtime database corruption is detected.
- Backup or restore fails after smoke data exists.
- Export artifacts are invalid.
- Audit events stop being written.
- Workflow approval/export gates fail incorrectly.
- API or web availability prevents MVP workflow validation.

### Rollback Steps

1. Pause closed beta access.
2. Preserve API, web, proxy, CI, and deployment logs.
3. Preserve current runtime database and backup files.
4. Stop the new staging services.
5. Restore the last valid runtime database backup if corruption occurred.
6. Redeploy the previous validated release.
7. Run the end-to-end staging validation checklist again.
8. Document the incident and root cause.
9. Resume beta only after the failed criterion is fixed or formally accepted.

## 10. Phase 10 Deliverables

Required deliverables before closed beta:

- Staging infrastructure provisioned.
- Environment variables configured.
- Hosted CI green.
- Dependency install complete.
- `pnpm typecheck` green.
- Staging API and web deployed.
- Backup and restore dry-run complete.
- Admin/reviewer bootstrap complete.
- End-to-end staging validation complete.
- Monitoring and logging ownership assigned.
- Rollback path verified.

Phase 10 does not approve new features. It only prepares and validates the MVP
for controlled staging and closed beta operation.
