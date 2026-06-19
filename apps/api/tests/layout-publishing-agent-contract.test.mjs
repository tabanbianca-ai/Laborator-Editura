import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "layout-publishing");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("layout publishing agent is registered with authenticated endpoints", () => {
  const controller = readSource("layout-publishing.controller.ts");
  const moduleSource = readSource("layout-publishing.module.ts");

  assert.match(appModule, /LayoutPublishingModule/);
  assert.match(moduleSource, /DatabaseLayoutPublicationRepository/);
  assert.match(moduleSource, /LayoutPublishingService/);
  assert.match(controller, /@Controller\("layout-publishing"\)/);
  assert.match(controller, /@Post\("plans"\)/);
  assert.match(controller, /@Get\("plans\/:id"\)/);
  assert.match(controller, /@Post\("plans\/:id\/style-revisions"\)/);
  assert.match(controller, /@Post\("plans\/:id\/approve"\)/);
  assert.match(controller, /@Post\("plans\/:id\/exports"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("book layout supports chapters sections footnotes indexes illustrations captions and templates", () => {
  const service = readSource("layout-publishing.service.ts");
  const types = readSource("layout-publishing.types.ts");

  for (const field of [
    "chapters",
    "sections",
    "footnotes",
    "tableOfContents",
    "indexes",
    "illustrations",
    "captions",
    "pageTemplates"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  assert.match(service, /buildBookLayout/);
  assert.match(service, /front-matter/);
  assert.match(service, /chapter/);
  assert.match(service, /back-matter/);
});

test("magazine layout supports issues articles columns galleries covers and archives", () => {
  const service = readSource("layout-publishing.service.ts");
  const types = readSource("layout-publishing.types.ts");

  for (const field of ["issues", "articles", "columns", "imageGalleries", "covers", "archives"]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  assert.match(service, /buildMagazineLayout/);
});

test("editorial finishing includes typography print and pagination controls", () => {
  const service = readSource("layout-publishing.service.ts");
  const types = readSource("layout-publishing.types.ts");

  for (const field of [
    "widowOrphanControl",
    "typographyValidation",
    "spacing",
    "kerning",
    "margins",
    "bleed",
    "pagination",
    "printProfiles"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  assert.match(service, /EUROPEAN_STANDARD/);
  assert.match(service, /PDF_X/);
  assert.match(service, /PRINT_ON_DEMAND/);
});

test("layout publishing supports required export formats and multimedia assets", () => {
  const service = readSource("layout-publishing.service.ts");
  const types = readSource("layout-publishing.types.ts");

  for (const format of [
    "JSON_MASTER",
    "PDF",
    "EPUB",
    "MOBI",
    "HARDCOVER",
    "PAPERBACK",
    "PRINT_ON_DEMAND"
  ]) {
    assert.match(types, new RegExp(`"${format}"`));
  }

  for (const field of [
    "audioChapters",
    "synchronizedNarration",
    "videoAssets",
    "illustrations",
    "galleries"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  assert.match(service, /recordExport/);
  assert.match(service, /exportHistory/);
});

test("layout publishing preserves human final authority for publication approval", () => {
  const service = readSource("layout-publishing.service.ts");
  const types = readSource("layout-publishing.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: LayoutApprovalStatus/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /assertAuthorizedHuman/);
  assert.match(service, /Only authorized humans may approve publication/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
});

test("layout publishing stores versions style revisions publication export history and audit", () => {
  const repository = readSource("layout-publishing.repository.ts");
  const service = readSource("layout-publishing.service.ts");
  const types = readSource("layout-publishing.types.ts");

  assert.match(repository, /layout_publication_plans/);
  assert.match(repository, /layout_publication_audit_events/);
  assert.match(types, /layoutVersion: number/);
  assert.match(types, /styleRevision: number/);
  assert.match(types, /publicationHistory: LayoutPublicationHistoryItem\[]/);
  assert.match(types, /exportHistory: LayoutPublicationExportHistory\[]/);
  assert.match(service, /STYLE_REVISION_CREATED/);
  assert.match(service, /PUBLICATION_APPROVED/);
  assert.match(service, /EXPORT_RECORDED/);
  assert.match(service, /repository\.appendAuditEvent/);
});
