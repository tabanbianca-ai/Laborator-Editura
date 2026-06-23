import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "security-governance");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const authTypes = readFileSync(join(__dirname, "..", "src", "modules", "auth", "auth.types.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("security governance module is registered with authenticated admin endpoints", () => {
  const controller = readSource("security-governance.controller.ts");
  const moduleSource = readSource("security-governance.module.ts");
  const service = readSource("security-governance.service.ts");

  assert.match(appModule, /SecurityGovernanceModule/);
  assert.match(moduleSource, /DatabaseSecurityGovernanceRepository/);
  assert.match(moduleSource, /SecurityGovernanceService/);
  assert.match(controller, /@Controller\("security"\)/);
  assert.match(controller, /@Get\("policies"\)/);
  assert.match(controller, /@Post\("policies"\)/);
  assert.match(controller, /@Get\("access-reviews"\)/);
  assert.match(controller, /@Post\("access-reviews"\)/);
  assert.match(controller, /@Get\("events"\)/);
  assert.match(controller, /@Post\("events"\)/);
  assert.match(controller, /@Post\("sessions\/:id\/revoke"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.match(service, /Security governance endpoints require an authorized admin/);
  assert.match(service, /roles\.has\("ADMIN"\)/);
});

test("security policies cover login session API key webhook domain IP and MFA metadata", () => {
  const types = readSource("security-governance.types.ts");
  const service = readSource("security-governance.service.ts");

  for (const policyType of [
    "PASSWORD_LOGIN",
    "SESSION_DURATION",
    "API_KEY",
    "WEBHOOK_SECURITY",
    "NETWORK_ACCESS",
    "MFA_REQUIREMENT",
    "ORGANIZATION_ACCESS"
  ]) {
    assert.match(types, new RegExp(`"${policyType}"`));
  }

  for (const field of [
    "passwordLoginPolicy",
    "sessionDurationPolicy",
    "apiKeyPolicy",
    "webhookSecurityPolicy",
    "allowedDomains",
    "ipAllowlist",
    "ipBlocklist",
    "mfaRequirementPlaceholder"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createPolicy/);
  assert.match(service, /SECURITY_POLICY_CREATED/);
});

test("access governance tracks role permission matrix audits reviews and tenant checks", () => {
  const types = readSource("security-governance.types.ts");
  const service = readSource("security-governance.service.ts");

  for (const field of [
    "rolePermissionMatrix",
    "reviewedRoles",
    "reviewedPermissions",
    "accessFindings",
    "tenantIsolationChecks",
    "PENDING_HUMAN_REVIEW"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createAccessReview/);
  assert.match(service, /listAccessReviews/);
  assert.match(service, /SECURITY_ACCESS_REVIEW_CREATED/);
});

test("session governance records active session metadata revocation and suspicious flags without changing auth", () => {
  const types = readSource("security-governance.types.ts");
  const service = readSource("security-governance.service.ts");
  const repository = readSource("security-governance.repository.ts");

  for (const field of [
    "activeSessionMetadata",
    "revocationRecorded",
    "suspiciousFlags",
    "lastSeenAt",
    "SESSION_REVOCATION_RECORDED",
    "METADATA_ONLY"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /existingAuthSessionNotModified/);
  assert.match(repository, /security_session_events/);
  assert.doesNotMatch(service + repository, /"auth_sessions"|updateSession|deleteSession|invalidateSession/);
});

test("API key governance stores usage scope expiration and revocation metadata", () => {
  const types = readSource("security-governance.types.ts");
  const service = readSource("security-governance.service.ts");
  const repository = readSource("security-governance.repository.ts");

  for (const field of [
    "usagePolicyMetadata",
    "scopeValidationMetadata",
    "expirationPolicyMetadata",
    "revocationAuditMetadata",
    "API_KEY_SCOPE_DENIED",
    "API_KEY_REVOCATION_RECORDED"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /recordApiKeyEvent/);
  assert.match(repository, /security_api_key_events/);
  assert.match(service, /SECURITY_API_KEY_EVENT_RECORDED/);
});

test("security events include login failed access permission denied policy violation and suspicious activity", () => {
  const types = readSource("security-governance.types.ts");
  const service = readSource("security-governance.service.ts");

  for (const eventType of [
    "LOGIN_EVENT",
    "FAILED_ACCESS",
    "PERMISSION_DENIED",
    "POLICY_VIOLATION",
    "SUSPICIOUS_ACTIVITY"
  ]) {
    assert.match(types, new RegExp(`"${eventType}"`));
  }

  assert.match(service, /listSecurityEvents/);
  assert.match(service, /createSecurityEvent/);
  assert.match(service, /recordPolicyViolation/);
  assert.match(service, /SECURITY_POLICY_VIOLATION_RECORDED/);
});

test("human final authority is preserved and AI cannot change security automatically", () => {
  const types = readSource("security-governance.types.ts");
  const service = readSource("security-governance.service.ts");

  assert.match(types + service, /humanApprovalRequired: true/);
  assert.match(types + service, /humanFinalAuthority: true/);
  assert.match(types, /aiMayDetectRisks: true/);
  assert.match(types, /aiMaySuggestPolicyChanges: true/);
  assert.match(types, /aiMayChangePolicyAutomatically: false/);
  assert.match(types, /aiMaySummarizeAccessReviews: true/);
  assert.match(types, /aiMayApproveAccessReviewAutomatically: false/);
  assert.match(service, /AI cannot change security policy automatically/);
  assert.match(service, /AI cannot approve access reviews automatically/);
  assert.doesNotMatch(service, /\b(revokeUser|deleteUser|changeRole|approveAccessReview|applyPolicyChange)\s*\(/i);
});

test("security governance preserves existing auth roles and uses tenant-scoped access", () => {
  const controller = readSource("security-governance.controller.ts");
  const repository = readSource("security-governance.repository.ts");
  const service = readSource("security-governance.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<SecurityPolicy>/);
  assert.match(repository, /selectForTenant<SecurityAccessReview>/);
  assert.match(repository, /selectForTenant<SecuritySessionEvent>/);
  assert.match(repository, /selectForTenant<SecurityApiKeyEvent>/);
  assert.match(repository, /selectForTenant<SecurityPolicyViolation>/);
  assert.match(authTypes, /"ADMIN"/);
  assert.match(authTypes, /"REVIEWER"/);
  assert.match(authTypes, /"TRANSLATOR"/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("security governance audit trail and backup restore include all runtime tables", () => {
  const repository = readSource("security-governance.repository.ts");
  const service = readSource("security-governance.service.ts");
  const types = readSource("security-governance.types.ts");

  assert.match(repository, /security_audit_events/);
  assert.match(types, /SecurityAuditEvent/);

  for (const action of [
    "SECURITY_POLICY_CREATED",
    "SECURITY_ACCESS_REVIEW_CREATED",
    "SECURITY_SESSION_EVENT_RECORDED",
    "SECURITY_API_KEY_EVENT_RECORDED",
    "SECURITY_POLICY_VIOLATION_RECORDED",
    "SECURITY_SESSION_REVOCATION_RECORDED"
  ]) {
    assert.match(types + service, new RegExp(`${action}`));
  }

  for (const tableName of [
    "security_policies",
    "security_access_reviews",
    "security_session_events",
    "security_api_key_events",
    "security_policy_violations",
    "security_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"security_audit_events",\s*"policyId",\s*"security_policies"/);
  assert.match(runtimeBackup, /"security_audit_events",\s*"policyViolationId",\s*"security_policy_violations"/);
  assert.match(backupRestoreTest, /security-policy-a/);
  assert.match(backupRestoreTest, /security-access-review-a/);
});

test("security governance is additive and has no external SSO enforcement", () => {
  const service = readSource("security-governance.service.ts");
  const repository = readSource("security-governance.repository.ts");

  assert.match(service, /METADATA_ONLY/);
  assert.doesNotMatch(service + repository, /saml|oidc|oauth|ldap|okta|auth0|azuread|fetch\(|axios/i);
});
