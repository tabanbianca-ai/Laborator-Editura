import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("all public launch main routes have page files", () => {
  const routePages = [
    "app/page.tsx",
    "app/pipeline/page.tsx",
    "app/projects/page.tsx",
    "app/documents/page.tsx",
    "app/author-studio/page.tsx",
    "app/translation/page.tsx",
    "app/review/page.tsx",
    "app/publishing/page.tsx",
    "app/distribution/page.tsx",
    "app/research/page.tsx",
    "app/library/page.tsx",
    "app/marketplace/page.tsx",
    "app/admin/page.tsx"
  ];

  for (const routePage of routePages) {
    assert.equal(existsSync(join(webRoot, routePage)), true, `${routePage} should exist`);
    assert.match(readSource(routePage), /export default/);
  }
});

test("dashboard includes lightweight launch readiness checklist", () => {
  const dashboard = readSource("components/pages/dashboard-page.tsx");

  for (const checklistItem of [
    "API healthy",
    "web healthy",
    "auth working",
    "workspace navigation working",
    "manuscript editor available",
    "translation workspace available",
    "review workspace available",
    "publishing workspace available",
    "research workspace available",
    "library workspace available",
    "MFA metadata available",
    "GDPR metadata available",
    "secret vault metadata available",
    "backup governance available"
  ]) {
    assert.match(dashboard, new RegExp(checklistItem));
  }

  assert.match(dashboard, /LaunchReadinessPanel/);
  assert.match(dashboard, /Closed beta checklist/);
});

test("dashboard launch readiness links include requested main routes", () => {
  const dashboard = readSource("components/pages/dashboard-page.tsx");

  for (const route of [
    'href: "/pipeline"',
    'href: "/distribution"',
    'href: "/"',
    'href: "/projects"',
    'href: "/documents"',
    'href: "/author-studio"',
    'href: "/translation"',
    'href: "/review"',
    'href: "/publishing"',
    'href: "/research"',
    'href: "/library"',
    'href: "/marketplace"',
    'href: "/admin"'
  ]) {
    assert.match(dashboard, new RegExp(route.replaceAll("/", "\\/")));
  }
});

test("launch polish makes pipeline and distribution primary access points", () => {
  const dashboard = readSource("components/pages/dashboard-page.tsx");
  const sidebar = readSource("components/layout/sidebar-nav.tsx");
  const topNav = readSource("components/layout/top-nav.tsx");
  const css = readSource("app/globals.css");

  assert.match(dashboard, /label: "Pipeline"/);
  assert.match(dashboard, /label: "Distribution"/);
  assert.match(dashboard, /launch-route-link-primary/);
  assert.match(sidebar, /Production Pipeline/);
  assert.match(sidebar, /sidebar-link-primary/);
  assert.match(topNav, /Pipeline/);
  assert.match(topNav, /Distribution/);
  assert.match(css, /\.sidebar-link-primary/);
  assert.match(css, /\.launch-route-link-primary/);
});

test("sidebar navigation order remains backend-order driven", () => {
  const navigation = readSource("components/layout/navigation.ts");
  const workspaceTypes = readSource("lib/workspace-types.ts");

  assert.match(navigation, /sort\(\(left, right\) => left\.order - right\.order\)/);
  assert.match(navigation, /filter\(\(item\) => item\.visible\)/);
  assert.match(workspaceTypes, /order: number/);
});

test("launch polish avoids excluded product areas", () => {
  const dashboard = readSource("components/pages/dashboard-page.tsx");

  assert.doesNotMatch(dashboard, /billing|analytics|public status page|incident center/i);
});
