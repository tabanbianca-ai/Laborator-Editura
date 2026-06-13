# Staging Validation Plan

Date: 2026-06-12

Purpose: prepare the MVP for closed beta through staging validation only.

Scope:

- No new modules.
- No feature expansion.
- No architecture changes.
- Documentation and operational validation only.

The exact staging deployment configuration, server-side ADMIN/REVIEWER
bootstrap procedure, smoke test script, and backup/restore validation commands
are defined in `docs/STAGING_DEPLOYMENT_PREPARATION.md`.

## 1. Staging Environment Instructions

Use a staging environment that is separate from production and local development.

Required runtime:

- Node.js 22.x.
- `pnpm` 10.12.1 through Corepack.
- Package registry access.
- Persistent storage for the runtime database.
- Backup storage location.
- Restricted staging users and organizations only.

Required environment variables:

```bash
export PORT=3001
export WEB_ORIGIN="https://staging.example.com"
export LABORATOR_RUNTIME_DB_PATH="/var/lib/laborator/staging/runtime-db.json"
```

Staging rules:

- Do not use production data.
- Do not use real customer data unless approved for closed beta.
- Do not enable future modules.
- Keep beta users limited to explicitly approved organizations.
- Keep backup files outside source control.
- Keep secrets outside source control.

## 2. Hosted CI Validation Commands

Hosted CI must run in GitHub Actions before closed beta entry.

Recommended branch flow:

```bash
git checkout -b release/closed-beta
git push -u origin release/closed-beta
gh pr create \
  --base main \
  --head release/closed-beta \
  --title "Closed beta release validation" \
  --body "Release Preparation validation only. No new modules or feature expansion."
```

If the default branch is `master`, use:

```bash
gh pr create \
  --base master \
  --head release/closed-beta \
  --title "Closed beta release validation" \
  --body "Release Preparation validation only. No new modules or feature expansion."
```

Observe CI:

```bash
gh run list --workflow CI --branch release/closed-beta --limit 5
gh run watch <run-id>
gh run view <run-id> --log-failed
```

Hosted CI must complete these checks:

```bash
node --test apps/api/tests/*.test.mjs
node --test packages/db/tests/*.test.mjs
node --test packages/shared/tests/*.test.mjs
node -e "const fs = require('node:fs'); const files = ['apps/api/fixtures/mvp-e2e-validation.json', 'apps/api/fixtures/mvp-operational-workflow.json']; for (const file of files) { JSON.parse(fs.readFileSync(file, 'utf8')); console.log('valid', file); }"
```

CI must also attempt dependency installation and typecheck:

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install --no-frozen-lockfile
pnpm typecheck
```

Closed beta must not open if hosted CI fails.

## 3. Dependency Installation And Typecheck

Run in staging or a dependency-enabled CI runner:

```bash
node --version
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm --version
pnpm install --no-frozen-lockfile
pnpm typecheck
```

Expected results:

- `node --version` reports Node.js 22.x.
- `pnpm --version` reports 10.12.1.
- Dependency installation completes without package resolution errors.
- `pnpm typecheck` completes without TypeScript errors.

If typecheck fails:

- Do not open closed beta.
- Record the error output.
- Fix only type or integration blockers.
- Do not add features while fixing typecheck.

## 4. Backup And Restore Dry-Run

Run before opening closed beta:

```bash
mkdir -p backups
mkdir -p /tmp/laborator-staging-restore

node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out backups/staging-runtime-db-backup.json

node packages/db/scripts/restore-runtime-db.mjs \
  --db /tmp/laborator-staging-restore/runtime-db.json \
  --in backups/staging-runtime-db-backup.json
```

Expected result:

- Backup command returns `status: "ok"`.
- Restore command returns `status: "ok"`.
- Backup metadata uses schema version `1.0`.
- Restored database contains the expected runtime tables.
- Tenant boundaries are preserved.

## 5. Staging MVP Smoke Test Checklist

Run this checklist after deployment to staging:

- API service starts successfully.
- Web origin is accepted through `WEB_ORIGIN`.
- Runtime database file is created at `LABORATOR_RUNTIME_DB_PATH`.
- User can authenticate.
- Requests without valid authenticated context are rejected.
- Spoofed `x-user-id`, `x-organization-id`, and `x-user-roles` do not grant access.
- Project can be created.
- Document can be created.
- Segment can be created or loaded.
- Translation can be saved.
- Translation Memory entry can be created.
- Approved Translation Memory entry can be searched and reused.
- Terminology entry can be created.
- Terminology entry can be validated.
- Validated terminology has priority over Translation Memory and AI suggestions.
- QA can run on segment and document.
- QA blocks workflow where unresolved High or Critical issues exist.
- Semantic Fidelity can run on segment and document.
- Semantic Fidelity blocks approval where unresolved High or Critical issues exist.
- Workflow can advance through the approved MVP path.
- Authorized human approval works.
- Ready for Export can be set only after approval.
- Export artifact is generated.
- JSON Master export is valid JSON.
- Audit events are written for foundation mutations and workflow actions.
- Backup and restore dry-run passes after smoke test data exists.

Approved MVP path:

Authentication -> Project -> Document -> Segments -> Translation -> Translation Memory -> Terminology Validation -> QA Validation -> Semantic Fidelity Validation -> Workflow Review -> Approval -> Ready for Export -> Export.

## 6. Closed Beta Entry Criteria

Closed beta may open only when all criteria are met:

- All Critical findings remain closed.
- All High findings remain closed.
- Hosted CI passes.
- Dependencies install successfully.
- `pnpm typecheck` passes.
- Staging deployment is complete.
- Staging MVP smoke test passes.
- Backup and restore dry-run passes in staging.
- Runtime database path is persistent.
- Beta users and organizations are explicitly approved.
- Access is limited to authorized beta users.
- Remaining Medium and Low findings are accepted for closed beta or scheduled.
- Monitoring owner is assigned.
- Incident response owner is assigned.
- Rollback path is verified.

## 7. Closed Beta Rollback Criteria

Rollback closed beta if any condition occurs:

- Critical security finding reappears.
- High severity tenant isolation issue appears.
- Authentication rejects valid users broadly.
- Unauthorized role elevation is possible.
- Runtime data corruption is detected.
- Backup or restore fails after staging data exists.
- Export artifacts are invalid or unrecoverable.
- Workflow approval or export gates fail incorrectly.
- Audit events stop being written for foundation mutations.
- API error rate prevents normal MVP workflow validation.
- Closed beta users cannot complete the MVP workflow.

Rollback steps:

1. Pause beta access.
2. Preserve logs, audit events, and backup files.
3. Stop the deployed staging service.
4. Restore the last valid runtime database backup if data corruption occurred.
5. Redeploy the previous validated build.
6. Run the staging MVP smoke test again.
7. Document the incident and root cause.
8. Resume beta only after the failed criterion is fixed or formally accepted.

## 8. Release Preparation Rule

Until closed beta is opened, all work must remain limited to validation, documentation, blocker fixes, and deployment readiness.

## 9. Verified Preparation Status

Local verification on 2026-06-12:

| Step | Local status | Notes |
| --- | --- | --- |
| Push to GitHub | Blocked locally | Current workspace is not a Git repository. |
| Hosted GitHub Actions CI | Blocked locally | Requires GitHub remote, pushed branch, and hosted runner. |
| Dependency install with `pnpm` | Blocked locally | `corepack` and `pnpm` are not available in this local environment. |
| `pnpm typecheck` | Blocked locally | Blocked by unavailable `pnpm`. |
| API contract and integration tests | Passed locally | 62 passed, 0 failed. |
| DB migration, runtime, and backup tests | Passed locally | 39 passed, 0 failed. |
| Shared JSON Master tests | Passed locally | 2 passed, 0 failed. |
| Fixture JSON validation | Passed locally | MVP fixture JSON files parse successfully. |
| Backup and restore dry-run | Passed locally | Backup and restore returned `status: "ok"`, schema version `1.0`, 23 tables. |
| Deploy to staging | Pending | Requires staging provider, runtime storage, package access, and environment variables. |
| MVP smoke test on staging | Pending | Requires deployed API, persistent runtime database, and authorized human reviewer/admin role. |

Blocking issues found during preparation:

- The current workspace is not a Git repository.
- Local sandbox permissions do not allow creating `.git` in the workspace, so
  `git init` must be run from a normal local terminal.
- `corepack` is unavailable locally.
- `pnpm` is unavailable locally.
- Hosted CI cannot be observed until the project is pushed to GitHub.
- Staging deployment cannot be executed until a target environment is selected and configured.

These are environment and release-operation blockers. They do not require new modules, scope expansion, UI changes, or architecture changes.

## 10. Exact Staging Execution Runbook

Run these steps in order for closed beta staging validation.

### Step 1 - Push To GitHub

If the project is already a Git repository, run:

```bash
git status --short
git remote -v
git checkout -B release/closed-beta
git add \
  .github \
  AGENTS.md \
  FUTURE_MODULES.md \
  README.md \
  ROADMAP.md \
  SPEC.md \
  apps \
  docs \
  eslint.config.mjs \
  package.json \
  packages \
  pnpm-workspace.yaml \
  tsconfig.base.json \
  turbo.json \
  .gitignore \
  .prettierignore \
  .prettierrc.json
git commit -m "Prepare closed beta staging validation"
git push -u origin release/closed-beta
```

If the project is not yet a Git repository, initialize it first:

```bash
git init
git branch -M main
git remote add origin <github-repository-url>
git checkout -B release/closed-beta
git add \
  .github \
  AGENTS.md \
  FUTURE_MODULES.md \
  README.md \
  ROADMAP.md \
  SPEC.md \
  apps \
  docs \
  eslint.config.mjs \
  package.json \
  packages \
  pnpm-workspace.yaml \
  tsconfig.base.json \
  turbo.json \
  .gitignore \
  .prettierignore \
  .prettierrc.json
git commit -m "Prepare closed beta staging validation"
git push -u origin release/closed-beta
```

Do not use `git add .` from this workspace unless non-source media artifacts are intentionally part of the release.

If using `git add .`, keep `.gitignore` rules for local media, generated
artifacts, `.deps`, backup files, and runtime data in place before staging.

### Step 2 - Run Hosted GitHub Actions CI

Create a pull request to trigger the `pull_request` workflow:

```bash
gh pr create \
  --base main \
  --head release/closed-beta \
  --title "Closed beta staging validation" \
  --body "Release Preparation validation only. No new modules or feature expansion."
```

If the default branch is `master`, use:

```bash
gh pr create \
  --base master \
  --head release/closed-beta \
  --title "Closed beta staging validation" \
  --body "Release Preparation validation only. No new modules or feature expansion."
```

Watch the hosted CI run:

```bash
gh run list --workflow CI --branch release/closed-beta --limit 5
RUN_ID="$(gh run list --workflow CI --branch release/closed-beta --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RUN_ID" --exit-status
gh run view "$RUN_ID" --log-failed
```

Expected result:

- `MVP contract validation` passes.
- `Typecheck when dependencies are available` either passes or records a typecheck-skipped notice only if package access is unavailable.
- Closed beta must not open while hosted CI is failing.

### Step 3 - Install Dependencies With pnpm

Run in hosted CI or staging:

```bash
node --version
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm --version
pnpm install --no-frozen-lockfile
```

Expected result:

- Node.js is 22.x.
- `pnpm --version` is `10.12.1`.
- Dependency installation completes successfully.

### Step 4 - Run Typecheck

Run:

```bash
pnpm typecheck
```

Expected result:

- Typecheck completes without TypeScript errors.

If this step fails:

- Keep closed beta blocked.
- Fix only type or integration blockers.
- Do not add features.

### Step 5 - Run All Tests

Run the workspace test command:

```bash
pnpm test
```

Run the required CI-equivalent checks explicitly:

```bash
node --test apps/api/tests/*.test.mjs
node --test packages/db/tests/*.test.mjs
node --test packages/shared/tests/*.test.mjs
node -e "const fs = require('node:fs'); const files = ['apps/api/fixtures/mvp-e2e-validation.json', 'apps/api/fixtures/mvp-operational-workflow.json']; for (const file of files) { JSON.parse(fs.readFileSync(file, 'utf8')); console.log('valid', file); }"
```

Expected result:

- API tests pass.
- DB tests pass.
- Shared JSON Master tests pass.
- MVP fixture JSON validation passes.

### Step 6 - Run Backup/Restore Dry-Run

Run in staging after setting `LABORATOR_RUNTIME_DB_PATH`:

```bash
export LABORATOR_RUNTIME_DB_PATH="/var/lib/laborator/staging/runtime-db.json"
mkdir -p "$(dirname "$LABORATOR_RUNTIME_DB_PATH")"
mkdir -p backups
mkdir -p /tmp/laborator-staging-restore

node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out backups/staging-runtime-db-backup.json

node packages/db/scripts/restore-runtime-db.mjs \
  --db /tmp/laborator-staging-restore/runtime-db.json \
  --in backups/staging-runtime-db-backup.json
```

Expected result:

- Backup returns `status: "ok"`.
- Restore returns `status: "ok"`.
- Backup schema version is `1.0`.
- Backup contains 23 runtime tables.

### Step 7 - Deploy To Staging

Set staging environment variables:

```bash
export PORT=3001
export WEB_ORIGIN="https://staging.example.com"
export LABORATOR_RUNTIME_DB_PATH="/var/lib/laborator/staging/runtime-db.json"
mkdir -p "$(dirname "$LABORATOR_RUNTIME_DB_PATH")"
```

Build:

```bash
pnpm build
```

Start API:

```bash
PORT="$PORT" \
WEB_ORIGIN="$WEB_ORIGIN" \
LABORATOR_RUNTIME_DB_PATH="$LABORATOR_RUNTIME_DB_PATH" \
pnpm --filter @laborator/api start
```

If staging also runs the web application:

```bash
pnpm --filter @laborator/web build
pnpm --filter @laborator/web exec next start --port 3000
```

Expected result:

- API starts without runtime errors.
- `GET /health` returns successfully.
- Runtime database file is created at `LABORATOR_RUNTIME_DB_PATH`.

### Step 8 - Run MVP Smoke Test On Staging

Set API base:

```bash
export API_BASE="https://staging-api.example.com"
```

Check health:

```bash
curl -sfS "$API_BASE/health"
```

Create or reuse a beta user session:

```bash
LOGIN_JSON="$(curl -sfS -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"beta-reviewer@example.com","displayName":"Beta Reviewer","organizationName":"Closed Beta Organization"}')"

TOKEN="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).session.token));")"
USER_ID="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).user.id));")"
ORG_ID="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).organization.id));")"
```

Bootstrap an authorized human reviewer role server-side in staging. This is required because client-provided roles must not be trusted:

```bash
node - "$LABORATOR_RUNTIME_DB_PATH" "$ORG_ID" "$USER_ID" <<'NODE'
const fs = require("node:fs");
const crypto = require("node:crypto");

const [dbPath, organizationId, userId] = process.argv.slice(2);
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
db.user_roles = Array.isArray(db.user_roles) ? db.user_roles : [];
const now = new Date().toISOString();

for (const role of ["TRANSLATOR", "REVIEWER"]) {
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

Create a new session after server-side role bootstrap:

```bash
LOGIN_JSON="$(curl -sfS -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"beta-reviewer@example.com","displayName":"Beta Reviewer","organizationName":"Closed Beta Organization"}')"

TOKEN="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).session.token));")"
AUTH_HEADER="Authorization: Bearer $TOKEN"
```

Verify authenticated context and spoofed headers:

```bash
curl -sfS "$API_BASE/auth/me" -H "$AUTH_HEADER"
curl -sfS "$API_BASE/auth/me" \
  -H "$AUTH_HEADER" \
  -H "x-user-id: spoofed-user" \
  -H "x-organization-id: spoofed-org" \
  -H "x-user-roles: ADMIN"
```

Create project, document, segment, terminology, Translation Memory, translation, QA, Semantic Fidelity, workflow, and export:

```bash
PROJECT_JSON="$(curl -sfS -X POST "$API_BASE/projects" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{"name":"Closed Beta Smoke Project","sourceLanguage":"es","targetLanguages":["ro"],"domain":"spiritism"}')"
PROJECT_ID="$(printf '%s' "$PROJECT_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).id));")"

DOCUMENT_JSON="$(curl -sfS -X POST "$API_BASE/documents" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"title\":\"Closed Beta Smoke Document\",\"sourceLanguage\":\"es\",\"targetLanguage\":\"ro\",\"documentType\":\"article\"}")"
DOCUMENT_ID="$(printf '%s' "$DOCUMENT_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).id));")"

SEGMENT_JSON="$(curl -sfS -X POST "$API_BASE/segments" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\",\"sourceText\":\"El espiritu sobrevive a la muerte del cuerpo.\",\"sourceLanguage\":\"es\",\"targetLanguage\":\"ro\",\"order\":1}")"
SEGMENT_ID="$(printf '%s' "$SEGMENT_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).id));")"

TERM_JSON="$(curl -sfS -X POST "$API_BASE/terminology/terms" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{"language":"ro","domain":"spiritism","source":"GLOSSARY","term":"espiritu","definition":"Spirit in the source context.","approvedTranslation":"Spiritul","forbiddenVariants":["Sufletul"],"status":"PROPOSED"}')"
TERM_ID="$(printf '%s' "$TERM_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).id));")"
curl -sfS -X POST "$API_BASE/terminology/terms/$TERM_ID/validate" -H "$AUTH_HEADER"

TM_JSON="$(curl -sfS -X POST "$API_BASE/translation-memory" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\",\"sourceSegmentId\":\"$SEGMENT_ID\",\"sourceText\":\"El espiritu sobrevive a la muerte del cuerpo.\",\"targetText\":\"Spiritul supravietuieste mortii corpului.\",\"sourceLanguage\":\"es\",\"targetLanguage\":\"ro\",\"domain\":\"spiritism\",\"confidenceScore\":0.98,\"approvalStatus\":\"PENDING\",\"origin\":\"HUMAN\"}")"
TM_ID="$(printf '%s' "$TM_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).id));")"
curl -sfS -X POST "$API_BASE/translation-memory/$TM_ID/approve" -H "$AUTH_HEADER"

curl -sfS "$API_BASE/translation-memory/search?sourceText=El%20espiritu%20sobrevive%20a%20la%20muerte%20del%20cuerpo.&sourceLanguage=es&targetLanguage=ro&domain=spiritism&limit=1&similarityThreshold=0.75" -H "$AUTH_HEADER"

curl -sfS -X POST "$API_BASE/translations/submit" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"segmentId\":\"$SEGMENT_ID\",\"targetText\":\"Spiritul supravietuieste mortii corpului.\",\"domain\":\"spiritism\"}"

curl -sfS -X POST "$API_BASE/qa/segments/run" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\",\"segmentId\":\"$SEGMENT_ID\",\"sourceText\":\"El espiritu sobrevive a la muerte del cuerpo.\",\"targetText\":\"Spiritul supravietuieste mortii corpului.\",\"sourceLanguage\":\"es\",\"targetLanguage\":\"ro\",\"domain\":\"spiritism\"}"

curl -sfS -X POST "$API_BASE/semantic-fidelity/segments/run" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\",\"segmentId\":\"$SEGMENT_ID\",\"sourceText\":\"El espiritu sobrevive a la muerte del cuerpo.\",\"targetText\":\"Spiritul supravietuieste mortii corpului.\",\"sourceLanguage\":\"es\",\"targetLanguage\":\"ro\",\"domain\":\"spiritism\"}"

curl -sfS -X POST "$API_BASE/workflow/start" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\",\"scope\":\"DOCUMENT\"}"

for STATUS in IN_TRANSLATION IN_QA IN_SEMANTIC_REVIEW IN_REVIEW; do
  curl -sfS -X POST "$API_BASE/workflow/advance" \
    -H "$AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\",\"toStatus\":\"$STATUS\"}"
done

curl -sfS -X POST "$API_BASE/workflow/approve" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\"}"

curl -sfS -X POST "$API_BASE/workflow/ready-for-export" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"documentId\":\"$DOCUMENT_ID\"}"

EXPORT_JSON="$(curl -sfS -X POST "$API_BASE/export/documents/$DOCUMENT_ID/json-master" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\"}")"
printf '%s' "$EXPORT_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => { const parsed = JSON.parse(input); if (!parsed.artifact || parsed.format !== 'JSON_MASTER') process.exit(1); console.log('valid export artifact', parsed.id); });"
```

Run backup/restore again after smoke data exists:

```bash
node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out backups/staging-runtime-db-after-smoke.json

node packages/db/scripts/restore-runtime-db.mjs \
  --db /tmp/laborator-staging-restore/runtime-db-after-smoke.json \
  --in backups/staging-runtime-db-after-smoke.json
```

Expected result:

- Every command exits successfully.
- JSON Master export is valid.
- Workflow reaches export.
- Backup and restore still pass after smoke test data exists.
