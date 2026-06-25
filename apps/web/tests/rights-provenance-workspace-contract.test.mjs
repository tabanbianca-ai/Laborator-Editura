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

test("rights route loads Rights Workspace with tab support", () => {
  const route = readSource("app/rights/page.tsx");

  assert.match(route, /RightsWorkspacePage/);
  assert.match(route, /getRightsWorkspaceData/);
  assert.match(route, /projectId/);
  assert.match(route, /documentId/);
  assert.match(route, /collaboration/);
  assert.match(route, /translation/);
  assert.match(route, /publishing/);
  assert.match(route, /provenance/);
  assert.match(route, /audit/);
});

test("rights workspace client uses rights API and server-derived auth", () => {
  const client = readSource("lib/rights-workspace-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/rights/contracts",
    "/rights/translation",
    "/rights/publishing",
    "/rights/provenance",
    "/rights/audit"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("rights workspace renders required tabs and rights warning banner", () => {
  const page = readSource("components/pages/rights-workspace-page.tsx");

  for (const label of [
    "Collaboration",
    "Translation Rights",
    "Publishing Rights",
    "Provenance",
    "Audit"
  ]) {
    assert.match(page, new RegExp(label));
  }

  assert.match(page, /Translation or publication cannot continue until the required rights are available\./);
  assert.match(page, /RightsWarningBanner/);
});

test("rights workspace displays attribution and provenance metadata", () => {
  const page = readSource("components/pages/rights-workspace-page.tsx");

  for (const label of [
    "Original author",
    "Translator",
    "Reviewer",
    "Rights holder",
    "Original edition",
    "Original language",
    "First publication year",
    "Authorized languages",
    "Territories",
    "Expiry"
  ]) {
    assert.match(page, new RegExp(label));
  }
});

test("rights workspace has forms for lightweight additive records only", () => {
  const page = readSource("components/pages/rights-workspace-page.tsx");
  const actions = readSource("lib/rights-workspace-actions.ts");

  for (const action of [
    "createRightsContractAction",
    "createTranslationRightsAction",
    "createPublishingRightsAction",
    "createProvenanceRecordAction"
  ]) {
    assert.match(actions, new RegExp(action));
  }

  assert.match(page, /Record agreement/);
  assert.match(page, /Record translation rights/);
  assert.match(page, /Record publishing rights/);
  assert.match(page, /Record provenance/);
  assert.doesNotMatch(page + actions, /digital signature|royalt|invoic|billing|litigation|erp|legal workflow/i);
});

test("rights workspace preserves human final authority and blocks automatic authorization", () => {
  const page = readSource("components/pages/rights-workspace-page.tsx");
  const client = readSource("lib/rights-workspace-client.ts");

  assert.match(page, /Human Final Authority/);
  assert.match(client, /aiMayApproveAgreements: false/);
  assert.match(client, /aiMayAuthorizeTranslations: false/);
  assert.match(client, /aiMayAuthorizePublication: false/);
  assert.match(client, /aiMayModifyProvenanceAutomatically: false/);
  assert.match(client, /TRANSLATION_NOT_AUTHORIZED/);
  assert.match(client, /PUBLICATION_NOT_AUTHORIZED/);
  assert.doesNotMatch(page + client, /autoApprove|autoAuthorize|autoPublish/i);
});
