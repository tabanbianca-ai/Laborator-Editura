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

test("magazine routes expose issue list and issue detail pages", () => {
  const indexRoute = readSource("app/magazine/page.tsx");
  const detailRoute = readSource("app/magazine/[issueId]/page.tsx");

  assert.match(indexRoute, /MagazineDigitalExperienceIndexPage/);
  assert.match(indexRoute, /getMagazineExperienceIndexData/);
  assert.match(detailRoute, /MagazineDigitalExperienceIssuePage/);
  assert.match(detailRoute, /getMagazineIssueExperienceData/);
  assert.match(detailRoute, /issueId/);
});

test("magazine client reuses existing project document and rights data without write APIs", () => {
  const client = readSource("lib/magazine-experience-client.ts");

  assert.match(client, /listProjects/);
  assert.match(client, /listDocuments/);
  assert.match(client, /getRightsWarningsForDocument/);
  assert.match(client, /MAGAZINE_ARTICLE/);
  assert.match(client, /MagazineReadinessStatus = "NOT_READY" \| "READY" \| "PUBLISHED"/);
  assert.match(client, /publicPortalVisibility/);
  assert.match(client, /flipbookStatus/);
  assert.match(client, /exportFormat: "MP4"/);
  assert.doesNotMatch(client, /apiPost/);
});

test("magazine UI covers flipbook article audio video rights and human authority rules", () => {
  const page = readSource("components/pages/magazine-digital-experience-page.tsx");
  const navigation = readSource("components/layout/navigation.ts");
  const dashboard = readSource("components/pages/dashboard-page.tsx");

  assert.match(page, /Magazine digital experience/);
  assert.match(page, /Magazine issue overview/);
  assert.match(page, /PDF export status/);
  assert.match(page, /Flipbook/);
  assert.match(page, /Generate Flipbook/);
  assert.match(page, /Uses PDF\/exported layout/);
  assert.match(page, /No external flipbook provider configured/);
  assert.match(page, /Public portal visibility/);
  assert.match(page, /Audio Article/);
  assert.match(page, /Video Article/);
  assert.match(page, /Generate Preview Audio/);
  assert.match(page, /Generate Official Audio/);
  assert.match(page, /Generate Preview Video/);
  assert.match(page, /Generate Official Video/);
  assert.match(page, /article\.video\.exportFormat/);
  assert.match(page, /Thumbnail/);
  assert.match(page, /Voice-over/);
  assert.match(page, /never published/);
  assert.match(page, /Translation or publication cannot continue until the required rights are available/);
  assert.match(page, /cannot approve or publish/);
  assert.match(page, /disabled type="button"/);
  assert.match(navigation, /Magazine/);
  assert.match(dashboard, /\/magazine/);
});
