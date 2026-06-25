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

test("research route loads the Research Workspace instead of generic shell", () => {
  const route = readSource("app/research/page.tsx");

  assert.match(route, /ResearchWorkspacePage/);
  assert.match(route, /getResearchWorkspaceData/);
  assert.match(route, /sourceId/);
  assert.match(route, /query/);
  assert.doesNotMatch(route, /CoreModuleScreen/);
});

test("research workspace client uses existing Research API endpoints only", () => {
  const client = readSource("lib/research-workspace-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/research/sources",
    "/research/sources/",
    "/research/search"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(client, /apiPost<ResearchSourceRecord/);
  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("research workspace renders source list, source detail and create source form", () => {
  const page = readSource("components/pages/research-workspace-page.tsx");
  const actions = readSource("lib/research-workspace-actions.ts");

  assert.match(page, /Research & knowledge workspace/);
  assert.match(page, /Research source list/);
  assert.match(page, /Source detail panel/);
  assert.match(page, /Create research source/);
  assert.match(page, /Search research/);
  assert.match(actions, /createResearchSourceAction/);
  assert.match(actions, /createResearchSource/);
});

test("research workspace displays required source metadata and visibility badges", () => {
  const page = readSource("components/pages/research-workspace-page.tsx");

  for (const label of [
    "Title",
    "Author",
    "Language",
    "Original language",
    "First publication year",
    "Source type",
    "Citation"
  ]) {
    assert.match(page, new RegExp(label));
  }

  for (const visibility of ["PRIVATE", "TEAM", "ORGANIZATION", "PUBLIC_REFERENCE"]) {
    assert.match(page, new RegExp(visibility));
  }
});

test("research workspace includes notes entities relationships collections and tags", () => {
  const page = readSource("components/pages/research-workspace-page.tsx");

  assert.match(page, /Notes panel/);
  assert.match(page, /Entities panel/);
  assert.match(page, /Relationships panel/);
  assert.match(page, /Collections panel/);
  assert.match(page, /TagsDisplay/);
  assert.match(page, /No research notes/);
  assert.match(page, /No knowledge entities/);
});

test("research workspace displays AI policy and preserves human authority", () => {
  const page = readSource("components/pages/research-workspace-page.tsx");

  assert.match(page, /AI policy display/);
  assert.match(page, /summarizeSources/);
  assert.match(page, /extractConcepts/);
  assert.match(page, /suggestRelations/);
  assert.match(page, /mayModifyOriginalSources/);
  assert.match(page, /Human Final Authority/);
});

test("research workspace avoids destructive research actions", () => {
  const page = readSource("components/pages/research-workspace-page.tsx");
  const actions = readSource("lib/research-workspace-actions.ts");

  assert.doesNotMatch(page + actions, /delete|destroy|remove|modifyOriginalSources|autoApprove|alterCitations/);
});
