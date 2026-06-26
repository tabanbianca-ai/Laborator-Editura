import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("app shell consumes workspace navigation and preferences", () => {
  const appShell = readSource("components/layout/app-shell.tsx");
  const rootLayout = readSource("app/layout.tsx");
  const topNav = readSource("components/layout/top-nav.tsx");

  assert.match(rootLayout, /getWorkspaceNavigation/);
  assert.match(rootLayout, /getWorkspacePreferences/);
  assert.match(rootLayout, /data-theme=\{theme\}/);
  assert.match(rootLayout, /lang=\{language\}/);
  assert.match(appShell, /navigation: WorkspaceNavigationItem\[\]/);
  assert.match(appShell, /preferences\?: WorkspacePreferences/);
  assert.match(appShell, /data-collapsed-menus/);
  assert.match(topNav, /href="\/pipeline"/);
  assert.match(topNav, /href="\/distribution"/);
  assert.match(topNav, /Workspace/);
  assert.match(topNav, /User/);
});

test("navigation renders only visible backend modules through module registry routes", () => {
  const sidebar = readSource("components/layout/sidebar-nav.tsx");
  const navigation = readSource("components/layout/navigation.ts");
  const registry = readSource("lib/module-registry.ts");

  assert.match(navigation, /\.filter\(\(item\) => item\.visible\)/);
  assert.match(navigation, /resolveModuleRoute/);
  assert.match(navigation, /resolveModuleTitle/);
  assert.match(sidebar, /toNavigationItems\(navigation\)/);
  assert.match(sidebar, /Production Pipeline/);
  assert.match(sidebar, /href="\/pipeline"/);
  assert.match(sidebar, /navigationError/);
  assert.doesNotMatch(sidebar, /mainNavigation/);

  for (const moduleName of ["DASHBOARD", "TRANSLATION", "MARKETPLACE", "ADMINISTRATION", "POLICIES"]) {
    assert.match(registry, new RegExp(`${moduleName}`));
  }
});

test("dashboard shell consumes workspace dashboard and renders widgets states and preferences", () => {
  const dashboardRoute = readSource("app/dashboard/page.tsx");
  const dashboardPage = readSource("components/pages/dashboard-page.tsx");
  const dashboardLoading = readSource("app/dashboard/loading.tsx");

  assert.match(dashboardRoute, /getWorkspaceDashboard/);
  assert.match(dashboardPage, /dashboardResult: ApiResult<WorkspaceDashboard>/);
  assert.match(dashboardPage, /visibleWidgets/);
  assert.match(dashboardPage, /Workspace dashboard unavailable/);
  assert.match(dashboardPage, /No dashboard widgets/);
  assert.match(dashboardPage, /favoriteModules/);
  assert.match(dashboardPage, /collapsedMenus/);
  assert.match(dashboardLoading, /Loading workspace dashboard/);
});

test("typed workspace client uses Workspace backend endpoints only", () => {
  const client = readSource("lib/workspace-client.ts");

  for (const endpoint of [
    "/workspace/navigation",
    "/workspace/dashboard",
    "/workspace/preferences",
    "/workspace/widgets"
  ]) {
    assert.match(client, new RegExp(endpoint));
  }

  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("UI design system exposes required primitives", () => {
  const index = readSource("components/ui/index.ts");

  for (const component of [
    "button",
    "card",
    "input",
    "select",
    "badge",
    "tabs",
    "modal-shell",
    "page-header",
    "data-table",
    "empty-state",
    "loading-state",
    "error-state"
  ]) {
    assert.match(index, new RegExp(component));
  }
});

test("frontend foundation remains shell-only without full module implementations", () => {
  const dashboardPage = readSource("components/pages/dashboard-page.tsx");
  const client = readSource("lib/workspace-client.ts");

  assert.match(dashboardPage, /Dashboard widgets/);
  assert.doesNotMatch(client, /translation-memory|terminology|qa-center|semantic-fidelity/);
});
