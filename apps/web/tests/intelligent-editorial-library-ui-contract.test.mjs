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

test("Library workspace exposes one intelligent editorial center without replacing reader features", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");
  const client = readSource("lib/library-workspace-client.ts");

  assert.match(page, /Intelligent Editorial Library/);
  assert.match(page, /Centru editorial unic pentru ciclul complet al publicațiilor/);
  assert.match(page, /Unified Library/);
  assert.match(page, /Library & reader workspace/);
  assert.match(client, /\/library\/publications\/search/);
  assert.doesNotMatch(page + client, /ArchiveModule|separate Archive|generic file explorer/i);
});

test("Library UX includes primary search filters grid list and persistent preferences", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");
  const client = readSource("lib/library-workspace-client.ts");

  for (const marker of [
    "Search title, author, ISBN, language, series or metadata",
    "Exact",
    "Normalized",
    "Fuzzy",
    "Multilingual metadata",
    "Active Library filter chips",
    "Advanced filters",
    "Grid view",
    "List view",
    "viewPreference",
    "persistentFilters",
    "recentSearches",
    "savedSearches"
  ]) {
    assert.match(page + client, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Library shows lifecycle statuses visibility formats relationships and preview", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");
  const client = readSource("lib/library-workspace-client.ts");

  for (const marker of [
    "STOC_REAL",
    "IN_LUCRU",
    "PUBLICAT",
    "Stoc real",
    "În lucru",
    "Publicat",
    "PUBLIC",
    "PRIVATE",
    "INTERNAL_WORKING_PUBLICATION",
    "Quick preview",
    "Formats",
    "Associated project",
    "Manuscript",
    "Rights and provenance",
    "PDF",
    "EPUB",
    "MOBI",
    "PRINT_READY_PDF",
    "AUDIO",
    "VIDEO",
    "ACCESSIBLE"
  ]) {
    assert.match(page + client, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Library quick actions and bulk actions remain contextual and non-destructive", () => {
  const page = readSource("components/pages/library-workspace-page.tsx");

  for (const action of [
    "Open publication",
    "Open manuscript",
    "Open project",
    "Continue editorial work",
    "Start new edition",
    "Add translation",
    "View rights",
    "View versions",
    "Preview",
    "Export",
    "Move status",
    "Publish when permitted",
    "Add to collection",
    "Edit metadata",
    "Change status",
    "Assign collection",
    "Assign series",
    "Add tags",
    "Export metadata",
    "Update selected metadata",
    "Assign project",
    "Mark public/private",
    "Validate rights status",
    "Generate report"
  ]) {
    assert.match(page, new RegExp(action.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(page, /Common actions stay within 2-3 clicks/);
  assert.match(page, /Historical versions are never destroyed/);
  assert.match(page, /Bulk actions respect permissions, subscription entitlements, Need-to-Know scope and rights restrictions/);
});
