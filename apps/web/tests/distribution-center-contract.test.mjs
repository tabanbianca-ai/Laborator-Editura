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

test("distribution center route loads preflight and distribution data", () => {
  const route = readSource("app/distribution/page.tsx");

  assert.match(route, /DistributionCenterPage/);
  assert.match(route, /getDistributionCenterData/);
  assert.match(route, /documentId/);
  assert.match(route, /layoutPlanId/);
  assert.match(route, /publicCatalogItemId/);
  assert.match(route, /commerceEditionId/);
});

test("distribution client reuses publishing export rights and workflow data only", () => {
  const client = readSource("lib/distribution-center-client.ts");

  assert.match(client, /getPublishingWorkspaceData/);
  assert.match(client, /PreflightStatus = "READY" \| "WARNING" \| "BLOCKED"/);
  assert.match(client, /ISBN/);
  assert.match(client, /metadata/);
  assert.match(client, /Rights\/provenance/);
  assert.match(client, /cover/i);
  assert.match(client, /Fonts/);
  assert.match(client, /Image resolution/);
  assert.match(client, /Table of contents/);
  assert.match(client, /Hyperlinks/);
  assert.match(client, /PDF print/);
  assert.match(client, /EPUB/);
  assert.match(client, /MOBI/);
  assert.match(client, /JSON master/);
  assert.match(client, /Audiobook/);
  assert.match(client, /Video/);
  assert.match(client, /Magazine flipbook/);
  assert.doesNotMatch(client, /apiPost|apiDelete/);
});

test("distribution page renders preflight panel channels blockers and human authority", () => {
  const page = readSource("components/pages/distribution-center-page.tsx");
  const client = readSource("lib/distribution-center-client.ts");
  const navigation = readSource("components/layout/navigation.ts");
  const dashboard = readSource("components/pages/dashboard-page.tsx");

  assert.match(page, /Preflight & Distribution Center/);
  assert.match(page, /Preflight validation panel/);
  assert.match(page, /Distribution Center/);
  assert.match(page, /Publication channels/);
  assert.match(client, /Print PDF/);
  assert.match(client, /Digital PDF/);
  assert.match(client, /EPUB/);
  assert.match(client, /MOBI/);
  assert.match(client, /Audiobook/);
  assert.match(client, /Video/);
  assert.match(client, /Magazine Flipbook/);
  assert.match(client, /Public Portal/);
  assert.match(page, /Required approvals/);
  assert.match(page, /Blockers/);
  assert.match(page, /Last export date/);
  assert.match(page, /Publish readiness/);
  assert.match(page, /Auto-publish/);
  assert.match(page, /Auto-approve/);
  assert.match(page, /cannot approve, publish, bypass rights/);
  assert.match(page, /disabled type="button"/);
  assert.match(navigation, /Distribution Center/);
  assert.match(dashboard, /\/distribution/);
});
