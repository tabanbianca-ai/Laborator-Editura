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

const adminPage = readSource("components/pages/administration-page.tsx");
const i18n = readSource("lib/ui-i18n.ts");
const workspaceTypes = readSource("lib/workspace-types.ts");
const workspaceClient = readSource("lib/workspace-client.ts");

test("administration exposes Central Language Management without duplicate language settings", () => {
  assert.match(adminPage, /Central Language Management/);
  assert.match(adminPage, /No duplicate settings/);
  assert.match(adminPage, /Platform Language/);
  assert.match(adminPage, /Original Language/);
  assert.match(adminPage, /Authoring Language/);
  assert.match(adminPage, /Target Languages/);
  assert.match(adminPage, /Changing Platform Language updates menus/);
});

test("frontend client can consume centralized language management metadata", () => {
  assert.match(workspaceTypes, /WorkspaceLanguageManagement/);
  assert.match(workspaceTypes, /linguisticResourceLoading/);
  assert.match(workspaceTypes, /supportsThreeColumns: true/);
  assert.match(workspaceTypes, /supportsFourColumns: true/);
  assert.match(workspaceClient, /getWorkspaceLanguageManagement/);
  assert.match(workspaceClient, /\/workspace\/language-management/);
});

test("UI localization includes language labels agent names and workflow names", () => {
  for (const key of [
    "language.platformLanguage",
    "language.originalLanguage",
    "language.authoringLanguage",
    "language.targetLanguages",
    "language.agent.quality",
    "language.agent.translation",
    "workflow.import",
    "workflow.review",
    "workflow.publication"
  ]) {
    assert.match(i18n, new RegExp(key.replace(".", "\\.")));
  }

  assert.match(i18n, /translateAgentName/);
  assert.match(i18n, /translateWorkflowName/);
  assert.match(i18n, /return "en"/);
});

test("platform language does not mutate manuscript or translation language fields", () => {
  assert.doesNotMatch(i18n, /setOriginalLanguage|setAuthoringLanguage|setTargetLanguage/);
  assert.match(adminPage, /does\s+not change Original Language, Authoring Language or Target Language/);
});
