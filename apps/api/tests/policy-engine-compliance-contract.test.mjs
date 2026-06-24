import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "policy-engine");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
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

test("policy engine module is registered with required authenticated admin endpoints", () => {
  const controller = readSource("policy-engine.controller.ts");
  const moduleSource = readSource("policy-engine.module.ts");
  const service = readSource("policy-engine.service.ts");

  assert.match(appModule, /PolicyEngineModule/);
  assert.match(moduleSource, /DatabasePolicyEngineRepository/);
  assert.match(moduleSource, /PolicyEngineService/);
  assert.match(controller, /@Controller\("policies"\)/);
  assert.match(controller, /@Get\(\)/);
  assert.match(controller, /@Post\(\)/);
  assert.match(controller, /@Get\("evaluations"\)/);
  assert.match(controller, /@Post\("evaluate"\)/);
  assert.match(controller, /@Post\("exceptions"\)/);
  assert.match(controller, /@Post\("exceptions\/:id\/approve"\)/);
  assert.match(controller, /@Post\("exceptions\/:id\/reject"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.match(service, /Policy engine endpoints require an authorized admin/);
});

test("policy definitions support all approved governance categories and statuses", () => {
  const types = readSource("policy-engine.types.ts");

  for (const category of [
    "EDITORIAL",
    "TRANSLATION",
    "AI_GOVERNANCE",
    "SECURITY",
    "PUBLISHING",
    "COMMERCE",
    "RESEARCH",
    "LIBRARY",
    "COMMUNITY_MODERATION",
    "BACKUP_RETENTION"
  ]) {
    assert.match(types, new RegExp(`"${category}"`));
  }

  for (const status of ["DRAFT", "ACTIVE", "SUSPENDED", "ARCHIVED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  for (const field of [
    "name",
    "category",
    "description",
    "version",
    "effectiveFrom",
    "effectiveUntil",
    "createdBy",
    "approvedBy",
    "humanApprovalRequired",
    "aiMaySuggest",
    "aiMayEnforce"
  ]) {
    assert.match(types, new RegExp(`${field}`));
  }
});

test("mandatory compliance rules preserve human authority audit versioning preservation and AI restrictions", () => {
  const types = readSource("policy-engine.types.ts");
  const service = readSource("policy-engine.service.ts");

  for (const rule of [
    "humanFinalAuthorityMandatory",
    "noPermanentDeletion",
    "originalSourcePreservationMandatory",
    "auditTrailMandatory",
    "versionHistoryMandatory",
    "aiCannotApprovePublications",
    "aiCannotApproveBudgets",
    "aiCannotRevokeUsersAutomatically",
    "aiCannotAlterCitationsAutomatically",
    "aiCannotModifyValidatedResearch"
  ]) {
    assert.match(types + service, new RegExp(`${rule}: true`));
  }

  assert.match(service, /aiMayEnforce: false/);
  assert.doesNotMatch(service, /\bdeletePolicy|permanentDelete|autoEnforcePolicy|alterCitation|modifyValidatedResearch\b/);
});

test("active policies require human approval and AI cannot activate policies", () => {
  const service = readSource("policy-engine.service.ts");

  assert.match(service, /status === "ACTIVE"/);
  assert.match(service, /approvedBy: status === "ACTIVE" \? actor\.userId : undefined/);
  assert.match(service, /approvedAt: status === "ACTIVE" \? now : undefined/);
  assert.match(service, /AI cannot activate policies/);
  assert.match(service, /POLICY_ACTIVATED/);
});

test("policy evaluations cover module project AI execution and publication scopes", () => {
  const types = readSource("policy-engine.types.ts");
  const service = readSource("policy-engine.service.ts");

  for (const scope of ["MODULE", "PROJECT", "AI_EXECUTION", "PUBLICATION"]) {
    assert.match(types, new RegExp(`"${scope}"`));
  }

  for (const status of ["COMPLIANT", "WARNING", "NON_COMPLIANT", "MANUAL_REVIEW_REQUIRED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  assert.match(service, /evaluatePolicy/);
  assert.match(service, /POLICY_EVALUATED/);
  assert.match(service, /COMPLIANCE_RECORD_CREATED/);
  assert.match(service, /statusForFindings/);
  assert.match(service, /Human Final Authority is missing/);
  assert.match(service, /AI cannot approve publications/);
});

test("policy exceptions require justification expiration and human approval", () => {
  const types = readSource("policy-engine.types.ts");
  const service = readSource("policy-engine.service.ts");

  for (const field of [
    "justification",
    "expirationDate",
    "approver",
    "approvedAt",
    "rejectedBy",
    "rejectionReason",
    "humanApprovalRequired"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createExceptionRequest/);
  assert.match(service, /approveException/);
  assert.match(service, /rejectException/);
  assert.match(service, /AI cannot approve policy exceptions/);
  assert.match(service, /AI approval attempts cannot approve policy exceptions/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
  assert.match(service, /POLICY_EXCEPTION_REQUESTED/);
  assert.match(service, /POLICY_EXCEPTION_APPROVED/);
  assert.match(service, /POLICY_EXCEPTION_REJECTED/);
});

test("policy engine preserves tenant isolation through admin context and tenant-scoped repositories", () => {
  const controller = readSource("policy-engine.controller.ts");
  const repository = readSource("policy-engine.repository.ts");
  const service = readSource("policy-engine.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /roles\.includes\("ADMIN"\)/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<PolicyDefinition>/);
  assert.match(repository, /selectForTenant<PolicyEvaluation>/);
  assert.match(repository, /findByIdForTenant<PolicyExceptionRequest>/);
  assert.match(repository, /selectForTenant<PolicyAuditEvent>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("policy audit trail and backup restore include all compliance tables", () => {
  const repository = readSource("policy-engine.repository.ts");
  const types = readSource("policy-engine.types.ts");

  for (const table of [
    "policy_definitions",
    "policy_evaluations",
    "policy_exception_requests",
    "policy_audit_events",
    "compliance_records"
  ]) {
    assert.match(repository + runtimeDatabase + runtimeBackup + backupRestoreTest, new RegExp(`${table}`));
  }

  for (const action of [
    "POLICY_CREATED",
    "POLICY_ACTIVATED",
    "POLICY_EVALUATED",
    "POLICY_EXCEPTION_REQUESTED",
    "POLICY_EXCEPTION_APPROVED",
    "POLICY_EXCEPTION_REJECTED",
    "COMPLIANCE_RECORD_CREATED"
  ]) {
    assert.match(types, new RegExp(`"${action}"`));
  }

  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "policy_evaluations", "policyId", "policy_definitions"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "policy_audit_events", "complianceRecordId", "compliance_records"\)/);
});

test("policy engine remains metadata-only without external compliance providers", () => {
  const service = readSource("policy-engine.service.ts");
  const backupRestore = backupRestoreTest;

  assert.match(service + backupRestore, /externalComplianceProvider: "NOT_CONFIGURED"/);
  assert.match(service, /metadataOnly: true/);
  assert.doesNotMatch(service, /complianceProviderClient|externalComplianceApi|sendToProvider/);
});
