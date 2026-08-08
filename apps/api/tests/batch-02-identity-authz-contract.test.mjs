import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function readWorkspace(path) {
  return readFileSync(join(root, path), "utf8");
}

const authTypes = readWorkspace("apps/api/src/modules/auth/auth.types.ts");
const authRepository = readWorkspace("apps/api/src/modules/auth/auth.repository.ts");
const authService = readWorkspace("apps/api/src/modules/auth/auth.service.ts");
const requestContextTypes = readWorkspace("apps/api/src/modules/auth/request-context.types.ts");
const requestContextMiddleware = readWorkspace("apps/api/src/modules/auth/request-context.middleware.ts");
const runtimeDatabase = readWorkspace("packages/db/src/runtime-database.ts");
const runtimeBackup = readWorkspace("packages/db/scripts/runtime-backup-lib.mjs");

test("Batch 02 defines the canonical identity model without replacing existing auth users", () => {
  for (const identityType of [
    "HUMAN_USER",
    "EXTERNAL_COLLABORATOR",
    "SERVICE_ACCOUNT",
    "API_CLIENT",
    "AI_AGENT",
    "SYSTEM_PROCESS"
  ]) {
    assert.match(authTypes, new RegExp(`"${identityType}"`));
  }

  for (const status of [
    "INVITED",
    "PENDING_VERIFICATION",
    "ACTIVE",
    "SUSPENDED",
    "LOCKED",
    "DISABLED",
    "ARCHIVED"
  ]) {
    assert.match(authTypes, new RegExp(`"${status}"`));
  }

  assert.match(authTypes, /interface CanonicalIdentity/);
  assert.match(authTypes, /identityId\?: string/);
  assert.match(authTypes, /securityVersion\?: number/);
  assert.match(authService, /upsertCanonicalIdentity/);
  assert.match(authService, /buildCanonicalIdentity/);
});

test("sessions carry canonical identity metadata and are invalidated after critical changes", () => {
  assert.match(authTypes, /authenticationLevel\?: AuthenticationLevel/);
  assert.match(authTypes, /revocationReason\?: string/);
  assert.match(authService, /isAuthenticatableUserStatus/);
  assert.match(authService, /IDENTITY_STATUS_REJECTED/);
  assert.match(authService, /SECURITY_VERSION_CHANGED/);
  assert.match(authService, /bumpUserSecurityVersion/);
  assert.match(authService, /revokeSessionsAfterCriticalChange/);
  assert.match(authRepository, /revokeUserSessions/);
  assert.match(authService, /PASSWORD_CHANGED/);
  assert.match(authService, /PASSWORD_RESET/);
});

test("role assignments are scoped while legacy user_roles remain compatible", () => {
  for (const scope of ["PLATFORM", "ORGANIZATION", "PROJECT", "PUBLICATION", "RESOURCE"]) {
    assert.match(authTypes, new RegExp(`"${scope}"`));
  }

  assert.match(authTypes, /interface ScopedRoleAssignment/);
  assert.match(authRepository, /"user_roles"/);
  assert.match(authRepository, /"auth_role_assignments"/);
  assert.match(authRepository, /scopeType: "ORGANIZATION"/);
  assert.match(authRepository, /scopeId: organizationId/);
  assert.match(authRepository, /listScopedRoleAssignments/);
});

test("request context exposes canonical permission catalog with default deny evaluation", () => {
  assert.match(requestContextTypes, /type CanonicalPermissionName/);
  assert.match(requestContextTypes, /CANONICAL_PERMISSION_CATALOG/);
  assert.match(requestContextTypes, /ROLE_PERMISSION_CATALOG/);
  assert.match(requestContextTypes, /evaluateAuthorizationPolicy/);
  assert.match(requestContextTypes, /DEFAULT_DENY/);
  assert.match(requestContextTypes, /MISSING_PERMISSION/);
  assert.match(requestContextTypes, /MISSING_SCOPE/);
  assert.match(requestContextMiddleware, /canonicalPermissionsForRoles\(actor\.roles\)/);
  assert.doesNotMatch(requestContextMiddleware, /x-user-id|x-organization-id|x-user-roles/);
});

test("service accounts delegation and privileged operations have tenant-scoped persistence foundations", () => {
  assert.match(authTypes, /interface ServiceAccount/);
  assert.match(authTypes, /SERVICE_ACCOUNT_TOKEN/);
  assert.match(authTypes, /interface DelegationSession/);
  assert.match(authTypes, /interface PrivilegedOperationPolicy/);
  assert.match(authTypes, /interface IdentitySecurityAuditEvent/);
  assert.match(authRepository, /upsertServiceAccount/);
  assert.match(authRepository, /upsertDelegationSession/);
  assert.match(authRepository, /upsertPrivilegedOperationPolicy/);
  assert.match(authRepository, /appendIdentitySecurityAuditEvent/);
});

test("runtime database and backup include Batch 02 identity tables", () => {
  for (const table of [
    "auth_identities",
    "auth_role_assignments",
    "auth_permissions",
    "auth_service_accounts",
    "auth_delegation_sessions",
    "auth_privileged_operation_policies",
    "auth_security_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${table}"`));
    assert.match(runtimeBackup, new RegExp(`"${table}"`));
  }

  for (const tenantScopedTable of [
    "auth_identities",
    "auth_role_assignments",
    "auth_service_accounts",
    "auth_delegation_sessions",
    "auth_privileged_operation_policies",
    "auth_security_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tenantScopedTable}"`));
    assert.match(runtimeBackup, new RegExp(`"${tenantScopedTable}"`));
  }
});
