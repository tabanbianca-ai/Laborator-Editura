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
    "/editorial-decisions/recommendations",
    "/editorial-decisions/corrections",
    "/editorial-decisions/request-changes",
    "/workflow/status",
    "/workflow/advance",
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

  assert.match(page, /ui\.t\("reviewApprovalWorkspace"\)/);
  assert.match(page, /ReviewSegmentRail/);
  assert.match(page, /ui\.t\("sourceText"\)/);
  assert.match(page, /ui\.t\("translatedText"\)/);
  assert.match(page, /ui\.t\("project"\)/);
  assert.match(page, /ui\.t\("document"\)/);
  assert.match(page, /ui\.t\("noDocumentSelected"\)/);
  assert.match(page, /ui\.t\("emptyReviewSegments"\)/);
});

test("review workspace includes required validation and evidence panels", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const client = readSource("lib/review-workspace-client.ts");

  assert.match(page, /ui\.t\("semanticFidelitySummary"\)/);
  assert.match(page, /ui\.t\("glossaryTerminology"\)/);
  assert.match(page, /ui\.t\("lexicographicReferences"\)/);
  assert.match(page, /ui\.t\("recommendationStatus"\)/);
  assert.match(page, /ui\.t\("issueList"\)/);
  assert.match(page, /dictionaryEvidence/);
  assert.match(page, /lexicographicSupport/);
  assert.match(client, /TerminologyCheckResult/);
  assert.match(client, /SemanticIssue/);
  assert.match(client, /LexicographicReference/);
});

test("review workspace displays approval status and attribution", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const client = readSource("lib/review-workspace-client.ts");

  assert.match(page, /ui\.t\("approvalStatus"\)/);
  assert.match(page, /ui\.t\("reviewerAttribution"\)/);
  assert.match(page, /ui\.t\("reviewer"\)/);
  assert.match(page, /ui\.t\("translatorId"\)/);
  assert.match(page, /ui\.t\("translator"\)/);
  assert.match(page, /ui\.t\("originalAuthor"\)/);
  assert.match(page, /ui\.t\("preserved"\)/);
  assert.match(client, /ReviewWorkflowState/);
});

test("review workspace exposes functioning human review and approval actions", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const actions = readSource("lib/review-workspace-actions.ts");

  assert.match(page, /ui\.t\("approveCorrectedTranslation"\)/);
  assert.match(page, /ui\.t\("createCorrection"\)/);
  assert.match(page, /ui\.t\("acceptProposal"\)/);
  assert.match(page, /ui\.t\("rejectProposal"\)/);
  assert.match(page, /ui\.t\("requestChanges"\)/);
  assert.match(page, /ui\.t\("humanAuthorityReview"\)/);
  assert.match(actions, /approveReviewAction/);
  assert.match(actions, /approveReviewDocument/);
  assert.match(actions, /createEditorialCorrection/);
  assert.match(actions, /acceptEditorialCorrection/);
  assert.match(actions, /rejectEditorialCorrection/);
  assert.match(actions, /requestEditorialChanges/);
  assert.doesNotMatch(page + actions, /markExported|ready-for-export|PUBLIC_RELEASE|autoApprove|autoPublish/);
});
