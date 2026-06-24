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

test("review workspace route loads the editorial review workspace", () => {
  const route = readSource("app/review/page.tsx");

  assert.match(route, /ReviewWorkspacePage/);
  assert.match(route, /getReviewWorkspaceData/);
  assert.match(route, /documentId/);
  assert.match(route, /segmentId/);
});

test("review workspace client uses existing authenticated endpoints only", () => {
  const client = readSource("lib/review-workspace-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/segments",
    "/translations",
    "/terminology/check-segment",
    "/lexicographic/search",
    "/semantic-fidelity/issues",
    "/workflow/status",
    "/workflow/approve"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(client, /listProjects/);
  assert.match(client, /listDocuments/);
  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("review workspace renders comparison panels and review selectors", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");

  assert.match(page, /Review & approval workspace/);
  assert.match(page, /ReviewSegmentRail/);
  assert.match(page, /Source text/);
  assert.match(page, /Translated text/);
  assert.match(page, /Project/);
  assert.match(page, /Document/);
  assert.match(page, /No document selected/);
  assert.match(page, /No segments available for review/);
});

test("review workspace includes required validation and evidence panels", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const client = readSource("lib/review-workspace-client.ts");

  assert.match(page, /Semantic fidelity summary/);
  assert.match(page, /Terminology \/ glossary validation/);
  assert.match(page, /Lexicographic references/);
  assert.match(page, /Editorial decision recommendations/);
  assert.match(page, /Issue list/);
  assert.match(page, /dictionaryEvidence/);
  assert.match(page, /lexicographicSupport/);
  assert.match(client, /TerminologyCheckResult/);
  assert.match(client, /SemanticIssue/);
  assert.match(client, /LexicographicReference/);
});

test("review workspace displays approval status and attribution", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const client = readSource("lib/review-workspace-client.ts");

  assert.match(page, /Approval status/);
  assert.match(page, /Reviewer attribution/);
  assert.match(page, /Reviewer/);
  assert.match(page, /Translator ID/);
  assert.match(page, /Translator/);
  assert.match(page, /Original author/);
  assert.match(page, /Preserved/);
  assert.match(client, /ReviewWorkflowState/);
});

test("review workspace exposes human approval action and request changes placeholder", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const actions = readSource("lib/review-workspace-actions.ts");

  assert.match(page, /Approve review/);
  assert.match(page, /Request changes/);
  assert.match(page, /Human Final Authority/);
  assert.match(actions, /approveReviewAction/);
  assert.match(actions, /approveReviewDocument/);
  assert.doesNotMatch(page + actions, /markExported|ready-for-export|PUBLIC_RELEASE|autoApprove|autoPublish/);
});
