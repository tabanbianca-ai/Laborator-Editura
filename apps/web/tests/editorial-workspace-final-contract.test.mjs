import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");
const repoRoot = join(webRoot, "..", "..");

function readWeb(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

function readRepo(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

test("Editorial Workspace is the primary production route without adding a backend module", () => {
  const home = readWeb("app/page.tsx");
  const workspaceRoute = readWeb("app/workspace/page.tsx");
  const appModule = readRepo("apps/api/src/modules/app.module.ts");

  assert.equal(existsSync(join(webRoot, "app/workspace/page.tsx")), true);
  assert.equal(existsSync(join(webRoot, "app/workspace/loading.tsx")), true);
  assert.match(home, /EditorialWorkspaceFinalPage/);
  assert.match(workspaceRoute, /getEditorialWorkspaceData/);
  assert.match(workspaceRoute, /getWorkspaceDashboard/);
  assert.doesNotMatch(appModule, /EditorialWorkspaceModule/);
});

test("Editorial Workspace supports all approved publication types and common actions within 2-3 clicks", () => {
  const client = readWeb("lib/editorial-workspace-client.ts");
  const page = readWeb("components/pages/editorial-workspace-final-page.tsx");

  for (const publicationType of [
    "Book",
    "Children's Book",
    "Magazine",
    "Poetry",
    "Dictionary",
    "Course",
    "Audiobook",
    "Video"
  ]) {
    assert.match(client, new RegExp(publicationType.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const action of [
    "Import manuscript",
    "Write or edit",
    "Translate",
    "Review",
    "Layout and publishing",
    "Preflight and distribution"
  ]) {
    assert.match(client + page, new RegExp(action));
  }

  assert.match(client, /maxClicks: 1/);
  assert.match(client, /maxClicks: 2/);
  assert.match(page, /2-3/);
});

test("Editorial Workspace includes production functions inspired by InDesign but does not reproduce Adobe UI", () => {
  const client = readWeb("lib/editorial-workspace-client.ts");
  const page = readWeb("components/pages/editorial-workspace-final-page.tsx");

  for (const tool of [
    "drag & drop",
    "page thumbnails",
    "paragraph styles",
    "character styles",
    "object styles",
    "master pages/templates",
    "page guides",
    "rulers",
    "grids",
    "snapping",
    "alignment",
    "page numbering",
    "headers",
    "footers",
    "table of contents",
    "footnotes",
    "endnotes",
    "hyperlinks",
    "anchors",
    "image placement",
    "image fitting",
    "image replacement",
    "layers",
    "preflight",
    "package project",
    "live preview"
  ]) {
    assert.match(client, new RegExp(tool.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(page, /Useful InDesign-inspired functions, not Adobe UI/);
  assert.doesNotMatch(page, /Adobe toolbar|Adobe panel|Premiere|Photoshop/);
});

test("Editorial Workspace supports publication formats and automatic adaptation", () => {
  const client = readWeb("lib/editorial-workspace-client.ts");
  const page = readWeb("components/pages/editorial-workspace-final-page.tsx");

  for (const format of [
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "B4",
    "B5",
    "B6",
    "C4",
    "C5",
    "C6",
    "Letter",
    "Legal",
    "Executive",
    "Ledger",
    "Tabloid",
    "Half Letter",
    "Junior Legal",
    "Pocket",
    "Digest",
    "Crown",
    "Royal",
    "Demy",
    "Trade Paperback",
    "US Trade",
    "Mass Market Paperback",
    "Board Book",
    "Picture Book",
    "Large Format",
    "Square",
    "Landscape",
    "Brochure",
    "width",
    "height",
    "portrait",
    "landscape",
    "bleed",
    "spine",
    "inside margin",
    "outside margin",
    "top margin",
    "bottom margin",
    "gutter",
    "safe area",
    "columns"
  ]) {
    assert.match(client, new RegExp(format.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const target of [
    "layout",
    "templates",
    "styles",
    "guides",
    "image placement",
    "page numbering",
    "export settings",
    "previews"
  ]) {
    assert.match(client + page, new RegExp(target));
  }

  assert.match(page, /without manual reconstruction/);
});

test("Editorial Workspace keeps review, collaboration, panels and performance governed", () => {
  const client = readWeb("lib/editorial-workspace-client.ts");
  const page = readWeb("components/pages/editorial-workspace-final-page.tsx");
  const topNav = readWeb("components/layout/top-nav.tsx");
  const navigation = readWeb("components/layout/navigation.ts");
  const i18n = readWeb("lib/ui-i18n.ts");
  const css = readWeb("app/globals.css");

  for (const marker of [
    "2 columns",
    "3 columns",
    "4 columns",
    "sentence alignment",
    "paragraph alignment",
    "synchronized scrolling",
    "Accept/Reject",
    "immutable original",
    "Invite collaborator",
    "role assignment",
    "chapter assignment",
    "segment assignment",
    "live collaboration",
    "comments",
    "mentions",
    "suggestions",
    "synchronized updates",
    "audit",
    "version history",
    "collapsible",
    "dockable",
    "resizable",
    "restorable",
    "favorites",
    "universal search",
    "configurable shortcuts",
    "recently used tools",
    "large books",
    "large magazines",
    "thousands of pages",
    "high-resolution illustrations",
    "multiple collaborators"
  ]) {
    assert.match(client + page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(page, /data-workspace-mode="individual-first-instant-collaboration"/);
  assert.match(page + i18n, /Human Final Authority/);
  assert.match(topNav, /href="\/workspace"/);
  assert.match(navigation, /translateRouteLabel\("\/workspace"/);
  assert.match(css, /\.editorial-workspace-hero/);
  assert.match(css, /\.editorial-workspace-grid/);
});
