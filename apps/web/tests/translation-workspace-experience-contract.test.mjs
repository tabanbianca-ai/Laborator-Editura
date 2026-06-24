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

test("translation workspace route replaces generic placeholder with real workspace", () => {
  const route = readSource("app/translation/page.tsx");

  assert.match(route, /TranslationWorkspacePage/);
  assert.match(route, /getTranslationWorkspaceData/);
  assert.match(route, /documentId/);
  assert.match(route, /segmentId/);
  assert.doesNotMatch(route, /CoreModuleScreen/);
});

test("translation workspace client uses existing backend endpoints only", () => {
  const client = readSource("lib/translation-workspace-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/segments",
    "/translations",
    "/translations/submit",
    "/terminology/check-segment",
    "/lexicographic/search",
    "/semantic-fidelity/issues"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(client, /listProjects/);
  assert.match(client, /listDocuments/);
  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("translation workspace renders selectors segments source target and save action", () => {
  const page = readSource("components/pages/translation-workspace-page.tsx");
  const actions = readSource("lib/translation-workspace-actions.ts");

  assert.match(page, /Project/);
  assert.match(page, /Document/);
  assert.match(page, /SegmentRail/);
  assert.match(page, /Source text/);
  assert.match(page, /Target text/);
  assert.match(page, /textarea/);
  assert.match(page, /Save translation/);
  assert.match(actions, /saveWorkspaceTranslationAction/);
  assert.match(actions, /submitWorkspaceTranslation/);
});

test("translation workspace displays translator and original author attribution", () => {
  const page = readSource("components/pages/translation-workspace-page.tsx");
  const client = readSource("lib/translation-workspace-client.ts");
  const actions = readSource("lib/translation-workspace-actions.ts");

  assert.match(page + client + actions, /translatorName/);
  assert.match(page + client + actions, /translatorId/);
  assert.match(page + client + actions, /originalAuthorName/);
  assert.match(page, /Original author/);
  assert.match(page, /Preserved/);
});

test("translation workspace includes terminology lexicographic and semantic support panels", () => {
  const page = readSource("components/pages/translation-workspace-page.tsx");
  const client = readSource("lib/translation-workspace-client.ts");

  assert.match(page, /Glossary \/ terminology/);
  assert.match(page, /Lexicographic references/);
  assert.match(page, /Semantic fidelity/);
  assert.match(page, /dictionaryEvidence/);
  assert.match(page, /lexicographicSupport/);
  assert.match(page, /semanticScore/);
  assert.match(client, /TerminologyCheckResult/);
  assert.match(client, /SemanticIssue/);
  assert.match(client, /LexicographicReference/);
});

test("translation workspace keeps statuses human-governed and avoids automatic publish or approval", () => {
  const page = readSource("components/pages/translation-workspace-page.tsx");
  const actions = readSource("lib/translation-workspace-actions.ts");

  assert.match(page, /draft/);
  assert.match(page, /reviewed/);
  assert.match(page, /approved/);
  assert.doesNotMatch(page + actions, /publish|approveTranslation|approveDocument|markExported|PUBLIC_RELEASE/);
});
