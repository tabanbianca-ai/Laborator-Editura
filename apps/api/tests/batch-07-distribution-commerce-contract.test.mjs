import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-07");

const requiredDocuments = [
  "overview.md",
  "distribution-model.md",
  "channel-registry.md",
  "distribution-readiness.md",
  "public-catalog.md",
  "public-api.md",
  "reader.md",
  "reader-library.md",
  "product-model.md",
  "pricing-model.md",
  "order-model.md",
  "payment-integration.md",
  "entitlements.md",
  "download-security.md",
  "distribution-connectors.md",
  "external-mapping.md",
  "reconciliation.md",
  "withdrawal.md",
  "accessibility.md",
  "test-evidence.md",
  "changed-files.md",
  "migration-plan.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

const distributionTables = [
  "distribution_records",
  "distribution_channels",
  "distribution_readiness_results",
  "public_catalog_projections",
  "public_slugs",
  "digital_reader_capabilities",
  "reader_reading_progress",
  "reader_annotations",
  "reader_library_entries",
  "commerce_products",
  "commerce_offers",
  "commerce_tax_profiles",
  "commerce_orders",
  "commerce_order_items",
  "commerce_payments",
  "commerce_payment_webhook_events",
  "commerce_entitlements",
  "commerce_download_authorizations",
  "commerce_promotions",
  "commerce_refunds",
  "distribution_external_mappings",
  "distribution_sync_records",
  "distribution_reconciliation_jobs",
  "publication_withdrawal_requests",
  "publication_superseding_records",
  "public_app_analytics_events",
  "distribution_audit_events"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-07", fileName);
}

test("Batch 07 required distribution and public application documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("shared distribution commerce contract separates publication distribution product order payment and entitlement", () => {
  const source = readRepositoryFile("packages", "shared", "src", "distribution-commerce.ts");

  for (const symbol of [
    "CanonicalDistribution",
    "DistributionChannelRegistryEntry",
    "DistributionReadinessResult",
    "PublicCatalogProjection",
    "PublicPresentationModel",
    "ReadingProgress",
    "ReaderAnnotation",
    "ReaderLibraryEntry",
    "Product",
    "Offer",
    "Order",
    "OrderItem",
    "Payment",
    "PaymentWebhookEvent",
    "Entitlement",
    "DownloadAuthorization",
    "DistributionConnectorContract",
    "ExternalProductMapping",
    "DistributionSyncRecord",
    "ReconciliationJob",
    "PublicationWithdrawalRequest",
    "PublicationSupersedingRecord",
    "Refund"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be part of Batch 07`);
  }
});

test("distribution public app safeguards prevent private catalog exposure duplicate access and external master source", () => {
  const source = readRepositoryFile("packages", "shared", "src", "distribution-commerce.ts");

  for (const token of [
    "isVisibleInPublicCatalog",
    "visibility === \"PUBLIC\"",
    "publicationStatus === \"PUBLISHED\"",
    "rightsValid",
    "availability === \"AVAILABLE\"",
    "evaluateDistributionReadiness",
    "TERRITORY_BLOCKED",
    "FORMAT_UNSUPPORTED",
    "EXPIRED_RIGHTS",
    "calculateOrderTotals",
    "canGrantEntitlementAfterPayment",
    "isPaymentWebhookProcessable",
    "canAuthorizeDownload",
    "externalProviderIsCanonicalSource: false",
    "deletesPublication: false",
    "silentOverwriteAllowed: false"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be represented`);
  }
});

test("runtime database and backup include Batch 07 distribution commerce tables", () => {
  const runtimeDatabase = readRepositoryFile("packages", "db", "src", "runtime-database.ts");
  const backupLibrary = readRepositoryFile("packages", "db", "scripts", "runtime-backup-lib.mjs");
  const inventory = readRepositoryFile(
    "docs",
    "implementation",
    "execution-batches",
    "batch-03",
    "data-store-inventory.md"
  );

  for (const tableName of distributionTables) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`), `${tableName} must be a runtime table`);
    assert.match(backupLibrary, new RegExp(`"${tableName}"`), `${tableName} must be included in backup/restore`);
    assert.match(inventory, new RegExp(tableName), `${tableName} must be inventoried`);
  }

  for (const reference of [
    ["distribution_records", "publicationPackageId", "publishing_publication_packages"],
    ["commerce_order_items", "accessEntitlementId", "commerce_entitlements"],
    ["commerce_payment_webhook_events", "paymentId", "commerce_payments"],
    ["commerce_download_authorizations", "entitlementId", "commerce_entitlements"],
    ["publication_superseding_records", "replacementPublicationId", "publishing_publications"]
  ]) {
    const referencePattern = new RegExp(reference.map((value) => `"${value}"`).join("[\\s\\S]*"));
    assert.match(runtimeDatabase, referencePattern, `${reference.join(" -> ")} must be tenant-validated`);
    assert.match(backupLibrary, referencePattern, `${reference.join(" -> ")} must be backup-validated`);
  }
});

test("Batch 07 reuses existing public portal commerce library gateway and publishing package surfaces", () => {
  const publicPortalTypes = readRepositoryFile("apps", "api", "src", "modules", "public-portal", "public-portal.types.ts");
  const commerceTypes = readRepositoryFile("apps", "api", "src", "modules", "commerce", "commerce.types.ts");
  const libraryTypes = readRepositoryFile("apps", "api", "src", "modules", "library", "library.types.ts");
  const gatewayTypes = readRepositoryFile("apps", "api", "src", "modules", "gateway", "gateway.types.ts");
  const publishingEngine = readRepositoryFile("packages", "shared", "src", "publishing-engine.ts");

  assert.match(publicPortalTypes, /PublicCatalogItem/);
  assert.match(publicPortalTypes, /PublicReaderAccessMetadata/);
  assert.match(commerceTypes, /CommerceEdition/);
  assert.match(commerceTypes, /CommercePricing/);
  assert.match(libraryTypes, /LibraryPublicationRecord/);
  assert.match(libraryTypes, /LibraryItem/);
  assert.match(gatewayTypes, /Webhook/);
  assert.match(publishingEngine, /PublicationPackage/);
});

test("JSON Master exposes additive distribution commerce extension points", () => {
  const types = readRepositoryFile("packages", "shared", "src", "json-master-format", "types.ts");
  const schema = readRepositoryFile("packages", "shared", "src", "json-master-format", "schema.ts");
  const validation = readRepositoryFile("packages", "shared", "src", "json-master-format", "validation.ts");

  for (const field of [
    "distributionRecords",
    "channelRegistry",
    "distributionReadinessResults",
    "publicCatalogProjections",
    "publicSlugs",
    "digitalReaderCapabilities",
    "readerProgress",
    "readerAnnotations",
    "readerLibraryEntries",
    "commerceProducts",
    "commerceOffers",
    "commerceOrders",
    "commercePayments",
    "commercePaymentWebhookEvents",
    "commerceEntitlements",
    "commerceDownloadAuthorizations",
    "distributionExternalMappings",
    "distributionSyncRecords",
    "distributionReconciliationJobs",
    "publicationWithdrawalRequests",
    "publicationSupersedingRecords",
    "distributionAuditEvents"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`), `${field} must be typed`);
    assert.match(schema, new RegExp(`${field}:`), `${field} must be in schema`);
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated`);
  }
});

test("Batch 07 reports preserve canonical source and withdrawal history", () => {
  const overview = readBatchDocument("overview.md");
  const publicCatalog = readBatchDocument("public-catalog.md");
  const payment = readBatchDocument("payment-integration.md");
  const withdrawal = readBatchDocument("withdrawal.md");
  const compliance = readBatchDocument("compliance-report.md");

  assert.match(overview, /Approved Publication Package -> Distribution Readiness -> Public Catalog/);
  assert.match(overview, /public application does not own an independent editorial copy/);
  assert.match(publicCatalog, /visibility = PUBLIC/);
  assert.match(payment, /browser redirect is not proof/);
  assert.match(withdrawal, /does not delete the publication/);
  assert.match(compliance, /Distribution and Publication remain distinct/);
});
