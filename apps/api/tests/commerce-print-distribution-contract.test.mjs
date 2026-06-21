import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "commerce");
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

test("commerce and print distribution module is registered with admin and public endpoints", () => {
  const controller = readSource("commerce.controller.ts");
  const moduleSource = readSource("commerce.module.ts");

  assert.match(appModule, /CommerceModule/);
  assert.match(moduleSource, /DatabaseCommerceRepository/);
  assert.match(moduleSource, /CommerceService/);
  assert.match(controller, /@Controller\("commerce"\)/);
  assert.match(controller, /@Post\("editions"\)/);
  assert.match(controller, /@Get\("editions\/:id"\)/);
  assert.match(controller, /@Post\("editions\/:id\/distribution"\)/);
  assert.match(controller, /@Post\("editions\/:id\/approve"\)/);
  assert.match(controller, /@Post\("editions\/:id\/reject"\)/);
  assert.match(controller, /@Controller\("public"\)/);
  assert.match(controller, /@Get\("store"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("public store read route is unauthenticated while commerce admin routes use server-derived context", () => {
  const controller = readSource("commerce.controller.ts");
  const publicController = controller.slice(controller.indexOf("export class PublicStoreController"));

  assert.match(requestContext, /request\.originalUrl \?\? request\.path \?\? request\.url/);
  assert.match(requestContext, /method === "GET" && this\.isPublicStoreRoute\(routePath\)/);
  assert.match(requestContext, /routePath === "\/public\/store"/);
  assert.doesNotMatch(publicController, /CurrentActor/);
  assert.doesNotMatch(publicController, /AuthenticatedRequestContext/);
});

test("edition creation supports required commercial edition types and ISBN metadata", () => {
  const types = readSource("commerce.types.ts");
  const service = readSource("commerce.service.ts");

  for (const editionType of ["HARDCOVER", "PAPERBACK", "EPUB", "MOBI", "PDF", "AUDIOBOOK", "VIDEO_EDITION"]) {
    assert.match(types, new RegExp(`"${editionType}"`));
  }

  for (const field of [
    "isbn",
    "editionNumber",
    "originalEditionReference",
    "originalLanguage",
    "firstPublicationYear"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(service, /createEdition/);
  assert.match(service, /COMMERCE_EDITION_CREATED/);
});

test("print profiles support European and American trim sizes with production metadata", () => {
  const types = readSource("commerce.types.ts");
  const service = readSource("commerce.service.ts");

  for (const trimSize of ["A5", "B5", "A4", "5x8", "6x9", "8.5x11"]) {
    assert.match(types, new RegExp(`"${trimSize.replace(".", "\\.")}"`));
  }

  for (const field of ["bleed", "margins", "coverSizes", "spineWidth", "paperTypes"]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(types, /CommercePrintRegion = "EUROPEAN" \| "AMERICAN"/);
  assert.match(service, /regionForTrimSize/);
});

test("commerce metadata includes price currency stock availability royalties and channels", () => {
  const types = readSource("commerce.types.ts");
  const service = readSource("commerce.service.ts");

  for (const field of [
    "price",
    "currency",
    "stock",
    "availability",
    "royaltyPercentages",
    "distributionChannels"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(service, /createDistribution/);
  assert.match(service, /COMMERCE_DISTRIBUTION_CREATED/);
});

test("print-on-demand remains metadata-only with provider region status and print profile", () => {
  const types = readSource("commerce.types.ts");
  const service = readSource("commerce.service.ts");

  for (const field of ["provider", "region", "status", "printProfileId"]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(types, /printProviderIntegration: "METADATA_ONLY"/);
  assert.match(service, /printProviderIntegration: "METADATA_ONLY"/);
  assert.doesNotMatch(service, /printful|lulu|ingram|kdp|createspace/i);
});

test("commercial approval requires authorized humans and AI cannot auto-release", () => {
  const service = readSource("commerce.service.ts");
  const types = readSource("commerce.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: CommerceApprovalStatus/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /approveEdition/);
  assert.match(service, /this\.assertAuthorizedHuman\(actor\)/);
  assert.match(service, /Only authorized humans may approve commercial release/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
  assert.match(service, /aiMaySuggestPricing: true/);
  assert.match(service, /aiMaySuggestPrintProfiles: true/);
  assert.match(service, /aiMaySuggestDistribution: true/);
  assert.doesNotMatch(service, /aiMayApprove|autoRelease|autoApprove/i);
});

test("public store exposes only approved available editions", () => {
  const repository = readSource("commerce.repository.ts");

  assert.match(repository, /listPublicStoreEditions/);
  assert.match(repository, /edition\.approvalStatus === "APPROVED"/);
  assert.match(repository, /edition\.availabilityStatus === "AVAILABLE"/);
});

test("commerce audit trail is preserved for edition distribution approval and rejection", () => {
  const repository = readSource("commerce.repository.ts");
  const service = readSource("commerce.service.ts");
  const types = readSource("commerce.types.ts");

  assert.match(repository, /commerce_audit_events/);
  assert.match(types, /CommerceAuditTrailItem/);
  assert.match(types, /COMMERCE_EDITION_CREATED/);
  assert.match(types, /COMMERCE_DISTRIBUTION_CREATED/);
  assert.match(types, /COMMERCE_EDITION_APPROVED/);
  assert.match(types, /COMMERCE_EDITION_REJECTED/);
  assert.match(service, /auditTrail/);
  assert.match(service, /repository\.appendAuditEvent/);
});

test("runtime persistence and backup include commerce data", () => {
  for (const tableName of [
    "commerce_editions",
    "commerce_distribution_channels",
    "commerce_print_profiles",
    "commerce_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"commerceEditionId",\s*"commerce_editions"/);
  assert.match(runtimeBackup, /"commerceDistributionChannelId",\s*"commerce_distribution_channels"/);
  assert.match(runtimeBackup, /"commercePrintProfileId",\s*"commerce_print_profiles"/);
  assert.match(backupRestoreTest, /commerce-edition-a/);
});
