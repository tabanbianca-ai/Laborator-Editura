# Staging Deployment Preparation

Date: 2026-06-12

Status: Ready for real staging deployment preparation.

Purpose: define the exact staging configuration and validation steps required before opening closed beta access.

Scope:

- Documentation only.
- No new features.
- No new modules.
- No architecture changes.
- No UI changes.
- No schema changes.

## 1. Exact Staging Environment Configuration

Use one isolated staging environment for the MVP API and, if needed, the web application.

Required runtime:

- Node.js 22.x.
- Corepack enabled.
- `pnpm` 10.12.1.
- Package registry access.
- Persistent filesystem storage for runtime database state.
- Persistent backup directory.
- Restricted network access to beta users only.

Recommended staging layout:

```text
/opt/laborator/app
/var/lib/laborator/staging/runtime-db.json
/var/backups/laborator/staging
/tmp/laborator-staging-restore
```

Recommended service ports:

```text
API port: 3001
Web port: 3000
```

Recommended public endpoints:

```text
Staging web origin: https://staging.example.com
Staging API base:   https://staging-api.example.com
```

Replace the example hostnames with the real staging domains before deployment.

## 2. Required Environment Variables

Application runtime variables:

```bash
export PORT=3001
export WEB_ORIGIN="https://staging.example.com"
export LABORATOR_RUNTIME_DB_PATH="/var/lib/laborator/staging/runtime-db.json"
```

Operator validation variables:

```bash
export API_BASE="https://staging-api.example.com"
export STAGING_WEB_ORIGIN="https://staging.example.com"
export STAGING_BACKUP_DIR="/var/backups/laborator/staging"
export STAGING_RESTORE_DB_PATH="/tmp/laborator-staging-restore/runtime-db.json"
export STAGING_REVIEWER_EMAIL="beta-reviewer@example.com"
export STAGING_REVIEWER_NAME="Beta Reviewer"
export STAGING_ORGANIZATION_NAME="Closed Beta Organization"
export STAGING_BOOTSTRAP_ROLE="REVIEWER"
```

Rules:

- Do not commit real environment values to source control.
- Do not store secrets in documentation.
- Keep runtime database and backup paths outside the repository.
- Use staging-only users and organizations.
- Do not use production data for closed beta validation.

## 3. Dependency And Build Preparation

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

Expected results:

- Node.js reports version 22.x.
- `pnpm --version` reports `10.12.1`.
- Dependency installation succeeds.
- Typecheck succeeds.
- Tests succeed.
- Build succeeds.

Closed beta must remain closed if any command fails.

## 4. Server-Side ADMIN/REVIEWER Bootstrap Procedure

Approval and export require an authorized human role. Client-provided roles must not be trusted.

Use this bootstrap only from the staging host or a secure operator environment with access to `LABORATOR_RUNTIME_DB_PATH`.

### Step 4.1 - Create The Staging User Session

```bash
LOGIN_JSON="$(curl -sfS -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$STAGING_REVIEWER_EMAIL\",\"displayName\":\"$STAGING_REVIEWER_NAME\",\"organizationName\":\"$STAGING_ORGANIZATION_NAME\"}")"

USER_ID="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).user.id));")"
ORG_ID="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).organization.id));")"
```

### Step 4.2 - Bootstrap The Server-Side Role

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

### Step 4.3 - Create A Fresh Session After Bootstrap

```bash
LOGIN_JSON="$(curl -sfS -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$STAGING_REVIEWER_EMAIL\",\"displayName\":\"$STAGING_REVIEWER_NAME\",\"organizationName\":\"$STAGING_ORGANIZATION_NAME\"}")"

TOKEN="$(printf '%s' "$LOGIN_JSON" | node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => console.log(JSON.parse(input).session.token));")"
AUTH_HEADER="Authorization: Bearer $TOKEN"
```

### Step 4.4 - Verify Server-Derived Identity

```bash
curl -sfS "$API_BASE/auth/me" -H "$AUTH_HEADER"

curl -sfS "$API_BASE/auth/me" \
  -H "$AUTH_HEADER" \
  -H "x-user-id: spoofed-user" \
  -H "x-organization-id: spoofed-org" \
  -H "x-user-roles: ADMIN"
```

Expected result:

- The user context comes from the authenticated session.
- Spoofed headers do not grant access or change identity.
- The fresh session includes the server-side role needed for approval/export.

## 5. Staging Backup/Restore Validation Steps

Run before smoke testing:

```bash
mkdir -p "$STAGING_BACKUP_DIR"
mkdir -p "$(dirname "$STAGING_RESTORE_DB_PATH")"

node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out "$STAGING_BACKUP_DIR/runtime-db-before-smoke.json"

node packages/db/scripts/restore-runtime-db.mjs \
  --db "$STAGING_RESTORE_DB_PATH" \
  --in "$STAGING_BACKUP_DIR/runtime-db-before-smoke.json"
```

Run again after smoke testing:

```bash
node packages/db/scripts/backup-runtime-db.mjs \
  --db "$LABORATOR_RUNTIME_DB_PATH" \
  --out "$STAGING_BACKUP_DIR/runtime-db-after-smoke.json"

node packages/db/scripts/restore-runtime-db.mjs \
  --db "$STAGING_RESTORE_DB_PATH" \
  --in "$STAGING_BACKUP_DIR/runtime-db-after-smoke.json"
```

Expected result:

- Backup command returns `status: "ok"`.
- Restore command returns `status: "ok"`.
- Backup schema version is `1.0`.
- Backup includes 23 runtime tables.
- Restore does not bypass tenant boundaries.

## 6. Staging Smoke Test Script

Run after deployment and role bootstrap.

```bash
set -euo pipefail

curl -sfS "$API_BASE/health"

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

Expected result:

- Every command exits successfully.
- Project, document, segment, translation, TM, terminology, QA, semantic review, workflow, approval, ready-for-export, and export all complete.
- Export artifact has format `JSON_MASTER`.
- No request relies on client-provided identity headers.

## 7. Smoke Test Checklist

Manual checklist:

- Health endpoint responds.
- Authenticated context resolves from session token.
- Spoofed identity headers do not change access.
- Project is created.
- Document is created.
- Segment is created.
- Translation is submitted.
- Translation Memory entry is created, approved, and searchable.
- Terminology term is created and validated.
- QA check runs.
- Semantic Fidelity check runs.
- Workflow reaches `IN_REVIEW`.
- Authorized human approval works.
- Document reaches `READY_FOR_EXPORT`.
- JSON Master export is generated.
- Backup/restore passes after smoke data exists.

## 8. Closed Beta Deployment Steps

Closed beta deployment sequence:

1. Confirm hosted CI is green.
2. Confirm release branch or tag.
3. Provision staging host and persistent paths.
4. Configure environment variables.
5. Install dependencies with `pnpm`.
6. Run `pnpm typecheck`.
7. Run `pnpm test`.
8. Run `pnpm build`.
9. Start API service.
10. Start web service if included in staging.
11. Run pre-smoke backup/restore validation.
12. Bootstrap server-side `ADMIN` or `REVIEWER` role.
13. Run staging smoke test script.
14. Run post-smoke backup/restore validation.
15. Approve beta users and organizations.
16. Assign monitoring and incident response owners.
17. Open access only to approved closed beta users.

## 9. Closed Beta Gate

Closed beta may open only if:

- Hosted CI is green.
- Staging deployment is complete.
- Typecheck passes.
- Tests pass.
- Backup/restore passes before and after smoke data.
- MVP smoke test passes.
- Reviewer/admin bootstrap is server-side only.
- Beta users are explicitly approved.
- Monitoring and incident owners are assigned.

If any Critical or High issue appears, closed beta access remains closed.
