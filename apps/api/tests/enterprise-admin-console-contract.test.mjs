import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "enterprise-admin");
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

test("enterprise admin module is registered with required authenticated admin endpoints", () => {
  const controller = readSource("enterprise-admin.controller.ts");
  const moduleSource = readSource("enterprise-admin.module.ts");
  const service = readSource("enterprise-admin.service.ts");

  assert.match(appModule, /EnterpriseAdminModule/);
  assert.match(moduleSource, /DatabaseEnterpriseAdminRepository/);
  assert.match(moduleSource, /EnterpriseAdminService/);
  assert.match(controller, /@Controller\("admin"\)/);
  assert.match(controller, /@Get\("organization"\)/);
  assert.match(controller, /@Post\("organization"\)/);
  assert.match(controller, /@Get\("teams"\)/);
  assert.match(controller, /@Post\("teams"\)/);
  assert.match(controller, /@Post\("teams\/:id"\)/);
  assert.match(controller, /@Get\("users"\)/);
  assert.match(controller, /@Post\("users"\)/);
  assert.match(controller, /@Get\("roles"\)/);
  assert.match(controller, /@Post\("roles"\)/);
  assert.match(controller, /@Get\("permissions"\)/);
  assert.match(controller, /@Post\("users\/:id\/roles"\)/);
  assert.match(controller, /@Post\("memberships\/:id\/remove"\)/);
  assert.match(controller, /@Post\("invitations"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.match(service, /Enterprise admin endpoints require an authorized admin/);
});

test("organization and user administration metadata is modeled without changing Auth behavior", () => {
  const types = readSource("enterprise-admin.types.ts");
  const service = readSource("enterprise-admin.service.ts");

  for (const field of [
    "workspaces",
    "workspaceId",
    "environmentId",
    "projectIds",
    "teamIds",
    "departmentIds",
    "active",
    "suspended",
    "archived",
    "createdBy",
    "updatedAt"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  for (const status of ["ACTIVE", "SUSPENDED", "INVITED", "ARCHIVED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  assert.match(service, /authBehaviorPreserved: true/);
  assert.doesNotMatch(service, /AuthService|AuthModule|user_roles|auth_sessions/);
});

test("organization management supports required organization types and default teams", () => {
  const types = readSource("enterprise-admin.types.ts");
  const service = readSource("enterprise-admin.service.ts");
  const controller = readSource("enterprise-admin.controller.ts");

  for (const organizationType of [
    "PERSOANA_FIZICA",
    "EDITURA",
    "ASOCIATIE_ONG",
    "COMPANIE",
    "INSTITUTIE"
  ]) {
    assert.match(types + service, new RegExp(`"${organizationType}"`));
  }

  for (const teamName of [
    "Echipa Traducere",
    "Echipa Revizie",
    "Echipa Machetare",
    "Echipa Ilustrații",
    "Echipa Multimedia",
    "Echipa Publicare",
    "Echipa Marketing",
    "Echipa Publicitate"
  ]) {
    assert.match(service, new RegExp(teamName));
  }

  assert.match(types, /interface AdminTeam/);
  assert.match(types, /projectIds: string\[\]/);
  assert.match(types, /taskIds: string\[\]/);
  assert.match(types, /documentIds: string\[\]/);
  assert.match(types, /workflowResponsibilities: string\[\]/);
  assert.match(controller, /getOrganizationProfile/);
  assert.match(controller, /createTeam/);
  assert.match(controller, /updateTeam/);
});

test("role management supports required built-in roles and custom roles", () => {
  const types = readSource("enterprise-admin.types.ts");
  const service = readSource("enterprise-admin.service.ts");

  for (const role of [
    "PLATFORM_CREATOR",
    "ADMIN",
    "EDITOR",
    "TRANSLATOR",
    "REVIEWER",
    "AUTHOR",
    "DESIGNER",
    "AUDIO_NARRATOR",
    "COLLABORATOR",
    "READER",
    "GUEST"
  ]) {
    assert.match(types + service, new RegExp(`"${role}"`));
  }

  assert.match(types, /type AdminRoleName = AdminBuiltInRole \| \(string & \{\}\)/);
  assert.match(service, /builtIn: this\.isBuiltInRole/);
  assert.match(service, /custom: !this\.isBuiltInRole/);
});

test("platform creator is protected and separate from administrator", () => {
  const authTypes = readFileSync(join(__dirname, "..", "src", "modules", "auth", "auth.types.ts"), "utf8");
  const requestContext = readFileSync(join(__dirname, "..", "src", "modules", "auth", "request-context.types.ts"), "utf8");
  const authService = readFileSync(join(__dirname, "..", "src", "modules", "auth", "auth.service.ts"), "utf8");
  const service = readSource("enterprise-admin.service.ts");
  const types = readSource("enterprise-admin.types.ts");

  assert.match(authTypes, /"PLATFORM_CREATOR"/);
  assert.match(requestContext, /role === "PLATFORM_CREATOR" \|\| role === "ADMIN"/);
  assert.match(authService, /LABORATOR_PLATFORM_CREATOR_EMAIL/);
  assert.match(authService, /CREATOR_ROLE_ACCESS/);
  assert.match(types, /"ADMIN_PLATFORM_CREATOR_ACCESS"/);
  assert.match(service, /Platform Creator is a protected system role/);
  assert.match(service, /Platform Creator is not assignable through Administration/);
  assert.match(service, /Platform Creator is not available for invitation/);
  assert.match(service, /Platform Creator membership cannot be removed/);
  assert.match(service, /roles\.includes\("PLATFORM_CREATOR"\).*roles\.includes\("ADMIN"\)/s);
});

test("permission matrix supports module project document admin API and AI scopes", () => {
  const types = readSource("enterprise-admin.types.ts");
  const service = readSource("enterprise-admin.service.ts");

  for (const scope of ["MODULE", "PROJECT", "DOCUMENT", "ADMIN", "API", "AI"]) {
    assert.match(types, new RegExp(`"${scope}"`));
  }

  for (const key of [
    "module:read",
    "project:admin",
    "document:admin",
    "admin:manage-users",
    "api:manage",
    "ai:govern"
  ]) {
    assert.match(service, new RegExp(`${key}`));
  }

  assert.match(service, /listPermissions/);
  assert.match(service, /upsertPermission/);
});

test("user creation role assignment and invitations are auditable", () => {
  const repository = readSource("enterprise-admin.repository.ts");
  const service = readSource("enterprise-admin.service.ts");
  const types = readSource("enterprise-admin.types.ts");

  assert.match(service, /createUser/);
  assert.match(service, /createRole/);
  assert.match(service, /assignRole/);
  assert.match(service, /createInvitation/);
  assert.match(service, /ADMIN_USER_CREATED/);
  assert.match(service, /ADMIN_ROLE_CREATED/);
  assert.match(service, /ADMIN_ROLE_ASSIGNED/);
  assert.match(service, /ADMIN_INVITATION_CREATED/);
  assert.match(repository, /admin_audit_events/);
  assert.match(types, /humanFinalAuthority: true/);
});

test("AI cannot auto grant ADMIN or change administrative authority", () => {
  const types = readSource("enterprise-admin.types.ts");
  const service = readSource("enterprise-admin.service.ts");

  assert.match(types + service, /aiMaySuggestPermissions: true/);
  assert.match(types + service, /aiMayGrantAdminAutomatically: false/);
  assert.match(service, /AI cannot auto grant ADMIN/);
  assert.match(service, /aiInitiatedAdminGrant/);
  assert.doesNotMatch(service, /\bautoGrantAdmin|autoRevokeUser|autoSuspendUser|alterAuditLogs\b/);
});

test("enterprise admin preserves tenant isolation through admin context and tenant-scoped repositories", () => {
  const controller = readSource("enterprise-admin.controller.ts");
  const repository = readSource("enterprise-admin.repository.ts");
  const service = readSource("enterprise-admin.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /roles\.includes\("ADMIN"\)/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<AdminUser>/);
  assert.match(repository, /selectForTenant<AdminRole>/);
  assert.match(repository, /selectForTenant<AdminPermission>/);
  assert.match(repository, /findByIdForTenant<AdminUser>/);
  assert.match(repository, /findByIdForTenant<AdminRole>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("admin runtime persistence and backup restore include all administration tables", () => {
  const repository = readSource("enterprise-admin.repository.ts");

  for (const table of [
    "admin_organizations",
    "admin_teams",
    "admin_users",
    "admin_roles",
    "admin_permissions",
    "admin_memberships",
    "admin_invitations",
    "admin_audit_events"
  ]) {
    assert.match(repository + runtimeDatabase + runtimeBackup + backupRestoreTest, new RegExp(`${table}`));
  }

  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "admin_memberships", "userId", "admin_users"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "admin_memberships", "roleId", "admin_roles"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "admin_memberships", "teamId", "admin_teams"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "admin_audit_events", "organizationMetadataId", "admin_organizations"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "admin_audit_events", "teamId", "admin_teams"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "admin_audit_events", "membershipId", "admin_memberships"\)/);
});

test("enterprise admin foundation remains backend-only and metadata-only", () => {
  const service = readSource("enterprise-admin.service.ts");
  const controller = readSource("enterprise-admin.controller.ts");

  assert.doesNotMatch(service + controller, /React|tsx|window\.|document\./);
  assert.doesNotMatch(service, /sendEmail|externalDirectoryProvider|ssoProviderClient|mfaProviderClient/);
  assert.match(service, /NOT_CONFIGURED/);
});
