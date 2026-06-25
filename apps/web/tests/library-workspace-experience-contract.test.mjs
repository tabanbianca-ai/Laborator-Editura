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

test("library route loads the Library Workspace instead of generic shell", () => {
  const route = readSource("app/library/page.tsx");

  assert.match(route, /LibraryWorkspacePage/);
  assert.match(route, /getLibraryWorkspaceData/);
  assert.match(route, /itemId/);
  assert.doesNotMatch(route, /CoreModuleScreen/);
});

test("library workspace client uses existing Library API endpoints", () => {
  const client = readSource("lib/library-workspace-client.ts");
  const apiClient = readSource("lib/api-client.ts");

  for (const endpoint of [
    "/library",
    "/progress",
    "/bookmarks",
    "/highlights",
    "/notes",
    "/favorite"
  ]) {
    assert.match(client, new RegExp(endpoint.replaceAll("/", "\\/")));
  }

  assert.match(client, /apiGet<LibraryItemRecord/);
  assert.match(client, /apiPost/);
  assert.match(client, /apiDelete/);
  assert.match(apiClient, /method: "DELETE"/);
  assert.match(apiClient, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(client, /x-user-id|x-organization-id|x-user-roles/);
});

test("library workspace renders saved items, detail and reader access panels", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");

  assert.match(page, /Library & reader workspace/);
  assert.match(page, /Saved items list/);
  assert.match(page, /Library item detail panel/);
  assert.match(page, /Reader access metadata/);
  assert.match(page, /Recent access/);
  assert.match(page, /No saved library items/);
});

test("library workspace includes all item type badges", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");
  const client = readSource("lib/library-workspace-client.ts");

  for (const itemType of ["BOOK", "ARTICLE", "MAGAZINE", "AUDIOBOOK", "VIDEO", "LOCALIZED_MEDIA"]) {
    assert.match(page + client, new RegExp(itemType));
  }
});

test("library workspace includes reader experience forms", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");
  const actions = readSource("lib/library-workspace-actions.ts");

  assert.match(page, /Simple reading panel placeholder/);
  assert.match(page, /Current chapter/);
  assert.match(page, /Current section/);
  assert.match(page, /Update progress/);
  assert.match(page, /Add bookmark/);
  assert.match(page, /Add highlight/);
  assert.match(page, /Add note/);
  assert.match(actions, /updateLibraryProgressAction/);
  assert.match(actions, /addLibraryBookmarkAction/);
  assert.match(actions, /addLibraryHighlightAction/);
  assert.match(actions, /addLibraryNoteAction/);
});

test("library workspace exposes favorite actions and preserves private reader data", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");
  const actions = readSource("lib/library-workspace-actions.ts");

  assert.match(page, /Favorite/);
  assert.match(page, /Unfavorite/);
  assert.match(page, /Reading history and annotations are private/);
  assert.match(actions, /favoriteLibraryItemAction/);
  assert.match(actions, /unfavoriteLibraryItemAction/);
  assert.doesNotMatch(page + actions, /publicEndpoint|publicRead|publish|autoShare/);
});
