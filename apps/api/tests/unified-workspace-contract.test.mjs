import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "workspace");
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

test("workspace module is registered with required authenticated endpoints", () => {
  const controller = readSource("workspace.controller.ts");
  const moduleSource = readSource("workspace.module.ts");

  assert.match(appModule, /WorkspaceModule/);
  assert.match(moduleSource, /DatabaseWorkspaceRepository/);
  assert.match(moduleSource, /WorkspaceService/);
  assert.match(controller, /@Controller\("workspace"\)/);
  assert.match(controller, /@Get\("navigation"\)/);
  assert.match(controller, /@Get\("dashboard"\)/);
  assert.match(controller, /@Get\("preferences"\)/);
  assert.match(controller, /@Post\("preferences"\)/);
  assert.match(controller, /@Get\("widgets"\)/);
  assert.match(controller, /@Post\("widgets"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
});

test("workspace navigation exposes all approved enterprise modules with routes icons and ordering", () => {
  const types = readSource("workspace.types.ts");
  const service = readSource("workspace.service.ts");

  for (const moduleName of [
    "DASHBOARD",
    "MY_PROJECTS",
    "AUTHOR_STUDIO",
    "TRANSLATION",
    "LEXICOGRAPHIC",
    "SEMANTIC_FIDELITY",
    "RESEARCH_HUB",
    "LIBRARY",
    "COMMERCE",
    "PUBLIC_PORTAL",
    "COLLABORATION",
    "MARKETPLACE",
    "ADMINISTRATION",
    "SECURITY",
    "OBSERVABILITY",
    "BACKUP",
    "POLICIES"
  ]) {
    assert.match(types + service, new RegExp(`"${moduleName}"`));
  }

  for (const field of ["title", "module", "icon", "route", "visible", "order", "permissionsRequired", "defaultForRoles"]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /DEFAULT_NAVIGATION/);
  assert.match(service, /getNavigation/);
});

test("dashboard supports all required widget types and retrieval", () => {
  const types = readSource("workspace.types.ts");
  const service = readSource("workspace.service.ts");

  for (const widget of [
    "RECENT_PROJECTS",
    "ASSIGNED_TASKS",
    "TRANSLATION_PROGRESS",
    "RESEARCH_ACTIVITY",
    "AI_USAGE",
    "BUDGET_USAGE",
    "SECURITY_ALERTS",
    "BACKUP_STATUS",
    "PUBLISHING_STATUS",
    "MARKETPLACE_AGENTS",
    "OBSERVABILITY_SUMMARY"
  ]) {
    assert.match(types + service, new RegExp(`"${widget}"`));
  }

  assert.match(types + service, /WorkspaceDashboard/);
  assert.match(service, /getDashboard/);
  assert.match(service, /getWidgets/);
  assert.match(service, /createWidget/);
  assert.match(service, /WORKSPACE_WIDGET_CREATED/);
});

test("workspace preferences store favorites layout collapsed menus theme language and notifications", () => {
  const types = readSource("workspace.types.ts");
  const service = readSource("workspace.service.ts");

  for (const field of [
    "favoriteModules",
    "dashboardLayout",
    "collapsedMenus",
    "themeMetadata",
    "language",
    "notificationPreferences"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /savePreferences/);
  assert.match(service, /WORKSPACE_PREFERENCES_SAVED/);
});

test("role-based navigation is generated from roles permissions policies and module visibility", () => {
  const types = readSource("workspace.types.ts");
  const service = readSource("workspace.service.ts");

  assert.match(service, /isNavigationItemVisible/);
  assert.match(service, /hasRole/);
  assert.match(service, /hasPermissions/);
  assert.match(service, /actor\.roles/);
  assert.match(service, /actor\.permissions/);
  assert.match(types + service, /organizationPolicyVisibility/);
  assert.match(types + service, /moduleVisibility/);
  assert.match(service, /moduleVisibility === "HIDDEN"/);
  assert.match(service, /organizationPolicyVisibility === "HIDDEN"/);
});

test("AI can suggest workspace configuration but cannot alter permissions modules or policies", () => {
  const types = readSource("workspace.types.ts");
  const service = readSource("workspace.service.ts");

  assert.match(types + service, /aiMaySuggestDashboardLayouts: true/);
  assert.match(types + service, /aiMaySuggestWidgets: true/);
  assert.match(types + service, /aiMayRecommendShortcuts: true/);
  assert.match(types + service, /aiMayAlterPermissions: false/);
  assert.match(types + service, /aiMayExposeHiddenModules: false/);
  assert.match(types + service, /aiMayChangePolicies: false/);
  assert.doesNotMatch(service, /alterPermissions|exposeHiddenModules|changePolicies|grantRole|assignPermission/);
});

test("workspace preserves tenant isolation through server-derived context and tenant-scoped repositories", () => {
  const controller = readSource("workspace.controller.ts");
  const repository = readSource("workspace.repository.ts");
  const service = readSource("workspace.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<WorkspaceLayout>/);
  assert.match(repository, /selectForTenant<WorkspaceNavigationItem>/);
  assert.match(repository, /selectForTenant<WorkspaceWidget>/);
  assert.match(repository, /selectForTenant<WorkspacePreferences>/);
  assert.match(repository, /selectForTenant<WorkspaceAuditEvent>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("workspace audit and backup restore include all workspace tables", () => {
  const repository = readSource("workspace.repository.ts");
  const types = readSource("workspace.types.ts");

  for (const table of [
    "workspace_layouts",
    "workspace_navigation_items",
    "workspace_widgets",
    "workspace_preferences",
    "workspace_audit_events"
  ]) {
    assert.match(repository + runtimeDatabase + runtimeBackup + backupRestoreTest, new RegExp(`${table}`));
  }

  for (const action of [
    "WORKSPACE_LAYOUT_CREATED",
    "WORKSPACE_NAVIGATION_GENERATED",
    "WORKSPACE_WIDGET_CREATED",
    "WORKSPACE_PREFERENCES_SAVED"
  ]) {
    assert.match(types, new RegExp(`"${action}"`));
  }

  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "workspace_audit_events", "layoutId", "workspace_layouts"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "workspace_audit_events", "widgetId", "workspace_widgets"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "workspace_audit_events", "preferenceId", "workspace_preferences"\)/);
});

test("workspace foundation remains backend-only without frontend implementation", () => {
  const service = readSource("workspace.service.ts");
  const controller = readSource("workspace.controller.ts");

  assert.match(service, /frontendImplementation: "NOT_CONFIGURED"/);
  assert.doesNotMatch(service + controller, /React|tsx|window\.|document\./);
});
