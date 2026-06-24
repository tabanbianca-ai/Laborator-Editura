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

test("core module routes exist for Phase 5 Step 3 screens", () => {
  for (const route of [
    "projects",
    "documents",
    "author-studio",
    "translation",
    "research",
    "library",
    "marketplace",
    "admin"
  ]) {
    assert.match(readSource(`app/${route}/page.tsx`), /export default/);
  }
});

test("core module screens use shared shell components and placeholders", () => {
  const coreScreen = readSource("components/pages/core-module-screen.tsx");
  const projectsPage = readSource("components/pages/projects-page.tsx");
  const documentsPage = readSource("components/pages/documents-page.tsx");

  for (const source of [coreScreen, projectsPage, documentsPage]) {
    assert.match(source, /PageHeader/);
    assert.match(source, /DataTable/);
    assert.match(source, /EmptyState/);
    assert.match(source, /ErrorState/);
  }

  assert.match(coreScreen, /Button disabled/);
  assert.match(projectsPage, /New project/);
  assert.match(documentsPage, /Import document/);
});

test("core module client provides safe placeholders without destructive actions", () => {
  const client = readSource("lib/core-module-client.ts");

  for (const moduleKey of [
    "author-studio",
    "translation",
    "research",
    "library",
    "marketplace",
    "admin"
  ]) {
    assert.match(client, new RegExp(`"${moduleKey}"`));
  }

  assert.doesNotMatch(client, /delete|destroy|remove|archive|suspend|approveRelease/);
});

test("module registry points Workspace navigation to Phase 5 routes", () => {
  const registry = readSource("lib/module-registry.ts");

  for (const route of [
    "/projects",
    "/author-studio",
    "/translation",
    "/research",
    "/library",
    "/marketplace",
    "/admin"
  ]) {
    assert.match(registry, new RegExp(route));
  }

  assert.match(registry, /ADMINISTRATION.*route: "\/admin"/s);
  assert.match(registry, /TRANSLATION.*route: "\/translation"/s);
});

test("new core routes include loading state files", () => {
  for (const route of ["author-studio", "translation", "research", "library", "marketplace", "admin"]) {
    assert.match(readSource(`app/${route}/loading.tsx`), /LoadingState/);
  }
});
