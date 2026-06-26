import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

function assertOrdered(source, labels) {
  let cursor = -1;

  for (const label of labels) {
    const next = source.indexOf(label);

    assert.ok(next > cursor, `${label} should appear after the previous workflow step`);
    cursor = next;
  }
}

test("editorial production workflow has route coverage for every launch step", () => {
  for (const routePage of [
    "app/author-studio/page.tsx",
    "app/author-studio/new/page.tsx",
    "app/translation/page.tsx",
    "app/review/page.tsx",
    "app/workflow-center/page.tsx",
    "app/publishing/page.tsx",
    "app/distribution/page.tsx",
    "app/magazine/page.tsx",
    "app/magazine/[issueId]/page.tsx",
    "app/rights/page.tsx"
  ]) {
    assert.equal(existsSync(join(webRoot, routePage)), true, `${routePage} should exist`);
    assert.match(readSource(routePage), /export default/);
  }
});

test("pipeline orders manuscript to publication with optional media and magazine outputs", () => {
  const client = readSource("lib/editorial-pipeline-client.ts");
  const page = readSource("components/pages/editorial-pipeline-page.tsx");

  assertOrdered(client, [
    'title: "Import Manuscript"',
    'title: "Automatic Analysis"',
    'title: "Editing"',
    'title: "Translation"',
    'title: "Editorial Review"',
    'title: "Editorial Validation"',
    'title: "Layout"',
    'title: "Export"',
    'title: "Technical Validation"',
    'title: "Final Approval"',
    'title: "Publication"',
    'title: "Audiobook (optional)"',
    'title: "Video (optional)"',
    'title: "Magazine Digital Outputs (optional)"'
  ]);

  assert.match(page, /Production mode/);
  assert.match(page, /<strong>14<\/strong>/);
  assert.match(page, /Technical Validation/);
  assert.match(page, /Audiobook/);
  assert.match(page, /Video/);
  assert.match(page, /Magazine/);
});

test("workflow gates preserve rights language workflow and human final authority", () => {
  const client = readSource("lib/editorial-pipeline-client.ts");
  const page = readSource("components/pages/editorial-pipeline-page.tsx");
  const rightsClient = readSource("lib/rights-workspace-client.ts");

  assert.match(client, /getRightsWarningsForDocument/);
  assert.match(client, /Language mismatch/);
  assert.match(client, /Missing original language metadata/);
  assert.match(client, /Missing current manuscript language metadata/);
  assert.match(client, /Missing translation target language/);
  assert.match(client, /Human approval is required before technical validation/);
  assert.match(client, /READY_FOR_EXPORT or exported status is required before distribution readiness/);
  assert.match(client, /Rights\/provenance blockers must be resolved before publication/);
  assert.match(client, /Publishing rights are required before official audiobook generation/);
  assert.match(client, /Publishing rights are required before official video generation/);
  assert.match(client, /Publishing rights are required before magazine digital outputs/);
  assert.match(page, /Human Final Authority/);
  assert.match(page, /cannot approve workflow, publish, approve audiobook or video, or grant rights/);
  assert.match(rightsClient, /TRANSLATION_NOT_AUTHORIZED/);
  assert.match(rightsClient, /Translation authorization is not confirmed/);
  assert.match(rightsClient, /PUBLICATION_NOT_AUTHORIZED/);
  assert.match(rightsClient, /Publication authorization is not confirmed/);
  assert.doesNotMatch(client, /apiPost|apiDelete/);
});

test("distribution and magazine outputs surface readiness without automatic publication", () => {
  const distributionClient = readSource("lib/distribution-center-client.ts");
  const distributionPage = readSource("components/pages/distribution-center-page.tsx");
  const magazineClient = readSource("lib/magazine-experience-client.ts");
  const magazinePage = readSource("components/pages/magazine-digital-experience-page.tsx");

  for (const required of [
    "ISBN",
    "Metadata",
    "Rights/provenance",
    "PDF print",
    "EPUB",
    "MOBI",
    "JSON master",
    "Audiobook",
    "Video",
    "Magazine flipbook",
    "Public Portal"
  ]) {
    assert.match(distributionClient, new RegExp(required.replace("/", "\\/")));
  }

  assert.match(distributionPage, /Preflight & Distribution Center/);
  assert.match(distributionPage, /Publication is disabled here until authorized humans confirm all gates/);
  assert.match(distributionPage, /disabled type="button"/);
  assert.match(magazineClient, /MagazineReadinessStatus = "NOT_READY" \| "READY" \| "PUBLISHED"/);
  assert.match(magazineClient, /draftNeverPublished: true/);
  assert.match(magazinePage, /Flipbook/);
  assert.match(magazinePage, /Generate Preview Audio/);
  assert.match(magazinePage, /Generate Preview Video/);
  assert.match(magazinePage, /Official .* is available only after article approval and publishing rights/);
  assert.doesNotMatch(distributionClient + magazineClient, /apiPost|apiDelete/);
});

test("launch navigation keeps pipeline and distribution accessible with no dead-end shell", () => {
  const sidebar = readSource("components/layout/sidebar-nav.tsx");
  const topNav = readSource("components/layout/top-nav.tsx");
  const dashboard = readSource("components/pages/dashboard-page.tsx");
  const navigation = readSource("components/layout/navigation.ts");

  assert.match(sidebar, /Production Pipeline/);
  assert.match(topNav, /href="\/pipeline"/);
  assert.match(topNav, /href="\/distribution"/);
  assert.match(dashboard, /Closed beta checklist/);
  assert.match(dashboard, /label: "Pipeline"/);
  assert.match(dashboard, /label: "Distribution"/);
  assert.match(navigation, /Production Pipeline/);
  assert.match(navigation, /Distribution Center/);
});
