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

test("author studio manuscript editor routes exist", () => {
  assert.match(readSource("app/author-studio/page.tsx"), /AuthorStudioManuscriptsPage/);
  assert.match(readSource("app/author-studio/new/page.tsx"), /AuthorStudioNewPage/);
  assert.match(readSource("app/author-studio/[id]/page.tsx"), /AuthorStudioDetailPage/);
  assert.match(readSource("app/author-studio/new/loading.tsx"), /LoadingState/);
  assert.match(readSource("app/author-studio/[id]/loading.tsx"), /LoadingState/);
});

test("author studio client uses existing backend endpoints with server-derived auth", () => {
  const client = readSource("lib/author-studio-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/author-studio/manuscripts",
    "/author-studio/manuscripts/",
    "/author-studio/sections/"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(client, /listAuthorManuscripts/);
  assert.match(client, /getAuthorManuscriptWorkspace/);
  assert.match(client, /createAuthorManuscript/);
  assert.match(client, /createAuthorSection/);
  assert.match(client, /saveAuthorDraft/);
  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("manuscript list renders loading error empty and table foundations", () => {
  const page = readSource("components/pages/author-studio-manuscripts-page.tsx");

  assert.match(page, /PageHeader/);
  assert.match(page, /DataTable/);
  assert.match(page, /EmptyState/);
  assert.match(page, /ErrorState/);
  assert.match(page, /New manuscript/);
  assert.match(page, /\/author-studio\/new/);
});

test("new manuscript screen preserves attribution and does not publish or submit automatically", () => {
  const page = readSource("components/pages/author-studio-new-page.tsx");
  const actions = readSource("lib/author-studio-actions.ts");

  for (const field of [
    "title",
    "subtitle",
    "language",
    "manuscriptType",
    "sourceManuscriptId",
    "translatorName",
    "synopsis",
    "outline"
  ]) {
    assert.match(page + actions, new RegExp(field));
  }

  assert.match(actions, /createManuscriptAction/);
  assert.doesNotMatch(page + actions, /submitManuscript|publish|archive|PUBLIC_RELEASE/);
});

test("manuscript detail supports section list draft editor version metadata and placeholders", () => {
  const page = readSource("components/pages/author-studio-detail-page.tsx");
  const actions = readSource("lib/author-studio-actions.ts");

  assert.match(page, /Create section/);
  assert.match(page, /SectionEditor/);
  assert.match(page, /textarea/);
  assert.match(page, /Save draft/);
  assert.match(page, /Version \$\{draft\.version\}/);
  assert.match(page, /Private author notes/);
  assert.match(page, /Autosave metadata/);
  assert.match(actions, /createSectionAction/);
  assert.match(actions, /saveDraftAction/);
  assert.doesNotMatch(page + actions, /archiveManuscript|submitManuscript|approve|publish/);
});

test("manuscript editor keeps human final authority and original author attribution visible", () => {
  const page = readSource("components/pages/author-studio-detail-page.tsx");
  const client = readSource("lib/author-studio-client.ts");

  assert.match(page + client, /humanEditorialApprovalRequired/);
  assert.match(page + client, /authorAttribution/);
  assert.match(page + client, /originalAuthorAttributionPreserved/);
  assert.match(page, /Original author/);
});
