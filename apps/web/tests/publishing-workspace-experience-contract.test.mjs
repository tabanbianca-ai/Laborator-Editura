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

test("publishing workspace route loads the publishing workspace", () => {
  const route = readSource("app/publishing/page.tsx");

  assert.match(route, /PublishingWorkspacePage/);
  assert.match(route, /getPublishingWorkspaceData/);
  assert.match(route, /documentId/);
  assert.match(route, /layoutPlanId/);
  assert.match(route, /publicCatalogItemId/);
  assert.match(route, /commerceEditionId/);
});

test("publishing workspace client uses existing backend endpoints only", () => {
  const client = readSource("lib/publishing-workspace-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/translations",
    "/workflow/status",
    "/layout-publishing/plans",
    "/export/documents",
    "/export/artifacts",
    "/public-portal/catalog-items",
    "/commerce/editions"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(client, /listProjects/);
  assert.match(client, /listDocuments/);
  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("publishing workspace renders dashboard, formats, layout and export history", () => {
  const page = readSource("components/pages/publishing-workspace-page.tsx");

  assert.match(page, /Publishing & export workspace/);
  assert.match(page, /Publication export dashboard/);
  assert.match(page, /Layout publication plan list/);
  assert.match(page, /Export history/);
  assert.match(page, /PDF/);
  assert.match(page, /EPUB/);
  assert.match(page, /MOBI/);
  assert.match(page, /PRINT/);
});

test("publishing workspace displays publication approval, source and attribution metadata", () => {
  const page = readSource("components/pages/publishing-workspace-page.tsx");

  assert.match(page, /Human approval/);
  assert.match(page, /Original source metadata/);
  assert.match(page, /Author/);
  assert.match(page, /Translator/);
  assert.match(page, /Source language/);
  assert.match(page, /Target language/);
  assert.match(page, /Preserved/);
});

test("publishing workspace shows print, public portal and commerce status", () => {
  const page = readSource("components/pages/publishing-workspace-page.tsx");

  assert.match(page, /Print profile metadata/);
  assert.match(page, /Public portal release status/);
  assert.match(page, /Commerce availability status/);
  assert.match(page, /No public portal item linked/);
  assert.match(page, /No commerce edition linked/);
});

test("publishing workspace exposes explicit human actions without automatic publication", () => {
  const page = readSource("components/pages/publishing-workspace-page.tsx");
  const actions = readSource("lib/publishing-workspace-actions.ts");

  assert.match(page, /Create JSON Master export/);
  assert.match(page, /Approve publication/);
  assert.match(page, /Record export/);
  assert.match(actions, /createPublishingExportAction/);
  assert.match(actions, /approveLayoutPublicationAction/);
  assert.match(actions, /recordLayoutExportAction/);
  assert.doesNotMatch(page + actions, /autoPublish|autoApprove|billing|payment provider/);
});
