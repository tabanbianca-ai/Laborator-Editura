import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

function readSource(relativePath) {
  return readFileSync(join(packageRoot, "src", relativePath), "utf8");
}

test("distribution commerce contract defines public distribution reader commerce and withdrawal concepts", () => {
  const source = readSource("distribution-commerce.ts");

  for (const symbol of [
    "CanonicalDistribution",
    "DistributionChannelRegistryEntry",
    "DistributionReadinessResult",
    "PublicCatalogProjection",
    "PublicPresentationModel",
    "PublicSlug",
    "DigitalReaderCapabilities",
    "ReadingProgress",
    "ReaderAnnotation",
    "ReaderLibraryEntry",
    "Product",
    "Offer",
    "Order",
    "Payment",
    "PaymentWebhookEvent",
    "Entitlement",
    "DownloadAuthorization",
    "DistributionConnectorContract",
    "ExternalProductMapping",
    "DistributionSyncRecord",
    "ReconciliationJob",
    "PublicationWithdrawalRequest",
    "PublicationSupersedingRecord"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be defined`);
  }
});

test("distribution readiness and public catalog visibility enforce rights territory and publication status", async () => {
  const module = await import("../dist/distribution-commerce.js");

  const blocked = module.evaluateDistributionReadiness({
    publicationPackageApproved: true,
    integrityValid: true,
    rightsValid: false,
    territoryAllowed: false,
    languageAllowed: true,
    formatAllowed: true,
    channelCompatible: true,
    metadataComplete: true,
    identifiersComplete: true,
    commercialAvailabilityValid: true,
    distributionApprovalGranted: true,
    rightsExpired: true
  });

  assert.equal(blocked.ready, false);
  assert.deepEqual(blocked.blockers, ["EXPIRED_RIGHTS", "TERRITORY_BLOCKED"]);

  assert.equal(
    module.isVisibleInPublicCatalog({
      visibility: "PUBLIC",
      publicationStatus: "PUBLISHED",
      rightsValid: true,
      availability: "AVAILABLE"
    }),
    true
  );

  assert.equal(
    module.isVisibleInPublicCatalog({
      visibility: "PUBLIC",
      publicationStatus: "WITHDRAWN",
      rightsValid: true,
      availability: "AVAILABLE"
    }),
    false
  );
});

test("commerce helpers keep pricing server-side payment authoritative and downloads entitlement gated", async () => {
  const module = await import("../dist/distribution-commerce.js");

  assert.deepEqual(module.calculateOrderTotals({ quantity: 2.9, unitPrice: 1000, tax: 190 }), {
    quantity: 2,
    unitPrice: 1000,
    tax: 190,
    total: 2190
  });

  assert.equal(
    module.canGrantEntitlementAfterPayment(
      { status: "PAID", paymentStatus: "CAPTURED" },
      { status: "CAPTURED" }
    ),
    true
  );
  assert.equal(
    module.canGrantEntitlementAfterPayment(
      { status: "PENDING_PAYMENT", paymentStatus: "PROCESSING" },
      { status: "PROCESSING" }
    ),
    false
  );

  assert.equal(
    module.canAuthorizeDownload(
      { status: "ACTIVE", validFrom: "2026-01-01T00:00:00.000Z", validUntil: "2026-12-31T00:00:00.000Z" },
      "2026-06-01T00:00:00.000Z"
    ),
    true
  );
  assert.equal(
    module.canAuthorizeDownload(
      { status: "REVOKED", validFrom: "2026-01-01T00:00:00.000Z" },
      "2026-06-01T00:00:00.000Z"
    ),
    false
  );
});

test("webhooks idempotency connector source authority and legacy public resource classification are explicit", async () => {
  const module = await import("../dist/distribution-commerce.js");

  assert.equal(module.isPaymentWebhookProcessable({ verified: true }), true);
  assert.equal(module.isPaymentWebhookProcessable({ verified: true, processedAt: "2026-01-01T00:00:00.000Z" }), false);
  assert.equal(module.isPaymentWebhookProcessable({ verified: false }), false);

  assert.equal(
    module.createCommercialIdempotencyKey({
      identityId: "reader-1",
      operation: "payment-webhook",
      providerEventId: "evt-1"
    }),
    module.createCommercialIdempotencyKey({
      providerEventId: "evt-1",
      operation: "payment-webhook",
      identityId: "reader-1"
    })
  );

  assert.equal(module.externalProviderCanBecomeCanonicalSource({ externalProviderIsCanonicalSource: false }), false);
  assert.equal(module.classifyLegacyPublicResource({ hasRightsEvidence: false }), "RIGHTS_REVIEW_REQUIRED");
  assert.equal(module.classifyLegacyPublicResource({ hasCanonicalPublication: true }), "CANONICAL");
});

test("JSON Master and package exports expose distribution commerce extensions", () => {
  const types = readSource("json-master-format/types.ts");
  const schema = readSource("json-master-format/schema.ts");
  const validation = readSource("json-master-format/validation.ts");
  const index = readSource("index.ts");
  const packageJson = readFileSync(join(packageRoot, "package.json"), "utf8");
  const rewrite = readFileSync(join(packageRoot, "scripts", "ensure-esm-file-exports.mjs"), "utf8");

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

  assert.match(index, /export \* from "\.\/distribution-commerce"/);
  assert.match(packageJson, /"\.\/distribution-commerce"/);
  assert.match(rewrite, /distribution-commerce\.js/);
});
