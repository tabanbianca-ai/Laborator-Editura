import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "public-portal");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const requestContext = readFileSync(
  join(__dirname, "..", "src", "modules", "auth", "request-context.middleware.ts"),
  "utf8"
);
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("public reader and distribution portal is registered with admin and public endpoints", () => {
  const controller = readSource("public-portal.controller.ts");
  const moduleSource = readSource("public-portal.module.ts");

  assert.match(appModule, /PublicPortalModule/);
  assert.match(moduleSource, /DatabasePublicPortalRepository/);
  assert.match(moduleSource, /PublicPortalService/);
  assert.match(controller, /@Controller\("public-portal"\)/);
  assert.match(controller, /@Post\("catalog-items"\)/);
  assert.match(controller, /@Get\("catalog-items\/:id"\)/);
  assert.match(controller, /@Post\("catalog-items\/:id\/distribution-records"\)/);
  assert.match(controller, /@Post\("catalog-items\/:id\/approve-release"\)/);
  assert.match(controller, /@Post\("catalog-items\/:id\/reject-release"\)/);
  assert.match(controller, /@Controller\("public"\)/);
  assert.match(controller, /@Get\("catalog"\)/);
  assert.match(controller, /@Get\("catalog\/:id"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("public catalog read routes are unauthenticated while admin routes use server-derived context", () => {
  const controller = readSource("public-portal.controller.ts");
  const publicController = controller.slice(controller.indexOf("export class PublicCatalogController"));

  assert.match(requestContext, /request\.originalUrl \?\? request\.path \?\? request\.url/);
  assert.match(requestContext, /method === "GET" && this\.isPublicCatalogRoute\(routePath\)/);
  assert.match(requestContext, /routePath === "\/public\/catalog"/);
  assert.match(requestContext, /routePath\.startsWith\("\/public\/catalog\/"\)/);
  assert.doesNotMatch(publicController, /CurrentActor/);
  assert.doesNotMatch(publicController, /AuthenticatedRequestContext/);
});

test("catalog items support books magazines articles audio video localized media and source references", () => {
  const types = readSource("public-portal.types.ts");
  const service = readSource("public-portal.service.ts");

  for (const itemType of ["BOOK", "MAGAZINE", "ARTICLE", "AUDIOBOOK", "VIDEO", "LOCALIZED_MEDIA"]) {
    assert.match(types, new RegExp(`"${itemType}"`));
  }

  for (const field of [
    "title",
    "authors",
    "language",
    "edition",
    "keywords",
    "originalSourceReferences",
    "layoutPublicationPlanId",
    "multimediaProjectId",
    "mediaLocalizationProjectId"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }
});

test("reader access supports online reading downloads audio video and localized media references", () => {
  const types = readSource("public-portal.types.ts");
  const service = readSource("public-portal.service.ts");

  for (const field of [
    "onlineReadingAvailable",
    "downloadableFormats",
    "pdfRef",
    "epubRef",
    "mobiRef",
    "audioChapterRefs",
    "videoRefs",
    "localizedMediaRefs",
    "fileHostingIntegration"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  for (const format of ["PDF", "EPUB", "MOBI", "HTML", "JSON_MASTER"]) {
    assert.match(types, new RegExp(`"${format}"`));
  }

  assert.match(types, /artifactRef\?: string/);
  assert.match(service, /artifactRefForDownload/);
  assert.match(service, /artifactRef/);
});

test("distribution records cover channels availability release dates editions languages and print metadata", () => {
  const types = readSource("public-portal.types.ts");
  const service = readSource("public-portal.service.ts");

  for (const field of [
    "publicationChannels",
    "availabilityStatus",
    "releaseDate",
    "editionStatus",
    "languageVariants",
    "printOnDemandMetadata"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(service, /createDistributionRecord/);
  assert.match(service, /PUBLIC_DISTRIBUTION_RECORD_CREATED/);
});

test("licensing and rights metadata are preserved without payment or CDN integration", () => {
  const types = readSource("public-portal.types.ts");
  const service = readSource("public-portal.service.ts");

  for (const field of ["license", "sourceAttribution", "copyrightStatus", "usageRestrictions"]) {
    assert.match(types, new RegExp(`${field}`));
  }

  assert.match(types, /paymentIntegration: "NOT_CONFIGURED"/);
  assert.match(types, /cdnIntegration: "NOT_CONFIGURED"/);
  assert.match(types, /fileHostingIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /paymentIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /cdnIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /fileHostingIntegration: "NOT_CONFIGURED"/);
  assert.doesNotMatch(service, /stripe|paypal|braintree|cloudfront|s3/i);
});

test("release approval requires authorized humans and AI cannot auto-release", () => {
  const service = readSource("public-portal.service.ts");
  const types = readSource("public-portal.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /releaseApprovalStatus: PublicReleaseApprovalStatus/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /releaseApprovalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /approveRelease/);
  assert.match(service, /this\.assertAuthorizedHuman\(actor\)/);
  assert.match(service, /Only authorized humans may approve public release/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
  assert.match(service, /aiMayPrepareMetadata: true/);
  assert.match(service, /aiMaySuggestDistribution: true/);
  assert.doesNotMatch(service, /aiMayApprove|autoRelease|autoApprove/i);
});

test("public catalog reads expose only approved public records", () => {
  const repository = readSource("public-portal.repository.ts");

  assert.match(repository, /findCatalogItemPublicById/);
  assert.match(repository, /item\?\.availabilityStatus === "PUBLIC"/);
  assert.match(repository, /listPublicCatalogItems/);
  assert.match(repository, /item\.availabilityStatus === "PUBLIC"/);
});

test("public portal audit trail is preserved for creation distribution approval and rejection", () => {
  const repository = readSource("public-portal.repository.ts");
  const service = readSource("public-portal.service.ts");
  const types = readSource("public-portal.types.ts");

  assert.match(repository, /public_portal_audit_events/);
  assert.match(types, /PublicPortalAuditTrailItem/);
  assert.match(types, /PUBLIC_CATALOG_ITEM_CREATED/);
  assert.match(types, /PUBLIC_DISTRIBUTION_RECORD_CREATED/);
  assert.match(types, /PUBLIC_RELEASE_APPROVED/);
  assert.match(types, /PUBLIC_RELEASE_REJECTED/);
  assert.match(service, /auditTrail/);
  assert.match(service, /repository\.appendAuditEvent/);
});

test("runtime persistence and backup include public portal data", () => {
  for (const tableName of [
    "public_catalog_items",
    "public_distribution_records",
    "public_access_records",
    "public_portal_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"publicCatalogItemId",\s*"public_catalog_items"/);
  assert.match(runtimeBackup, /"publicDistributionRecordId",\s*"public_distribution_records"/);
  assert.match(backupRestoreTest, /public-item-a/);
});
