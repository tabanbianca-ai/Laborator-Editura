import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "marketplace");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
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

test("marketplace module is registered with required authenticated admin endpoints", () => {
  const controller = readSource("marketplace.controller.ts");
  const moduleSource = readSource("marketplace.module.ts");
  const service = readSource("marketplace.service.ts");

  assert.match(appModule, /MarketplaceModule/);
  assert.match(moduleSource, /DatabaseMarketplaceRepository/);
  assert.match(moduleSource, /MarketplaceService/);
  assert.match(controller, /@Controller\("marketplace"\)/);
  assert.match(controller, /@Get\("agents"\)/);
  assert.match(controller, /@Post\("agents"\)/);
  assert.match(controller, /@Post\("agents\/:id\/enable"\)/);
  assert.match(controller, /@Post\("agents\/:id\/disable"\)/);
  assert.match(controller, /@Get\("extensions"\)/);
  assert.match(controller, /@Post\("extensions"\)/);
  assert.match(controller, /@Post\("extensions\/:id\/enable"\)/);
  assert.match(controller, /@Post\("extensions\/:id\/disable"\)/);
  assert.match(controller, /@Get\("catalog"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.match(service, /Marketplace endpoints require an authorized admin/);
});

test("AI agent registry captures provider metadata modules permissions governance links and status", () => {
  const types = readSource("marketplace.types.ts");
  const service = readSource("marketplace.service.ts");

  for (const field of [
    "agentName",
    "category",
    "version",
    "providerMetadata",
    "supportedModules",
    "permissionsRequired",
    "costGovernanceLink",
    "policyComplianceLink",
    "status"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  for (const status of ["DRAFT", "ACTIVE", "DISABLED", "ARCHIVED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  assert.match(service, /createAgent/);
  assert.match(service, /enableAgent/);
  assert.match(service, /disableAgent/);
});

test("extension registry captures module capabilities integration type scopes tenant availability and status", () => {
  const types = readSource("marketplace.types.ts");
  const service = readSource("marketplace.service.ts");

  for (const field of [
    "moduleName",
    "capabilities",
    "integrationType",
    "requiredScopes",
    "tenantAvailability",
    "status"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  for (const integrationType of [
    "INTERNAL_MODULE",
    "API_CONNECTOR",
    "AI_AGENT_EXTENSION",
    "WORKFLOW_EXTENSION",
    "EDITORIAL_EXTENSION",
    "MEDIA_EXTENSION",
    "CUSTOM_METADATA"
  ]) {
    assert.match(types, new RegExp(`"${integrationType}"`));
  }

  assert.match(service, /createExtension/);
  assert.match(service, /enableExtension/);
  assert.match(service, /disableExtension/);
});

test("marketplace catalog supports visibility install and disable metadata", () => {
  const types = readSource("marketplace.types.ts");
  const service = readSource("marketplace.service.ts");

  for (const visibility of ["PRIVATE", "ORGANIZATION", "PUBLIC_REFERENCE"]) {
    assert.match(types, new RegExp(`"${visibility}"`));
  }

  assert.match(types + service, /MarketplaceCatalogItem/);
  assert.match(types + service, /installMetadata/);
  assert.match(types + service, /disableMetadata/);
  assert.match(service, /listCatalog/);
  assert.match(service, /catalogItemType: "AGENT"/);
  assert.match(service, /catalogItemType: "EXTENSION"/);
});

test("governance requires admin approval policy compliance cost governance and audit", () => {
  const types = readSource("marketplace.types.ts");
  const service = readSource("marketplace.service.ts");

  for (const field of [
    "adminApprovalRequired: true",
    "policyEngineComplianceRequired: true",
    "costGovernanceRequired: true",
    "auditTrailMandatory: true",
    "humanFinalAuthorityRequired: true"
  ]) {
    assert.match(types + service, new RegExp(field));
  }

  assert.match(service, /MARKETPLACE_AGENT_CREATED/);
  assert.match(service, /MARKETPLACE_AGENT_ENABLED/);
  assert.match(service, /MARKETPLACE_AGENT_DISABLED/);
  assert.match(service, /MARKETPLACE_EXTENSION_CREATED/);
  assert.match(service, /MARKETPLACE_EXTENSION_ENABLED/);
  assert.match(service, /MARKETPLACE_EXTENSION_DISABLED/);
});

test("AI cannot self-enable install extensions or bypass policy and cost governance", () => {
  const types = readSource("marketplace.types.ts");
  const service = readSource("marketplace.service.ts");

  assert.match(types + service, /aiMaySuggest: true/);
  assert.match(types + service, /aiMaySummarizeCatalog: true/);
  assert.match(types + service, /aiMayDetectRisk: true/);
  assert.match(types + service, /aiCannotSelfEnable: true/);
  assert.match(types + service, /aiCannotInstallExtensionsAutomatically: true/);
  assert.match(types + service, /aiCannotBypassPolicyGovernance: true/);
  assert.match(types + service, /aiCannotBypassCostGovernance: true/);
  assert.match(service, /AI agents cannot self-enable/);
  assert.match(service, /AI cannot install extensions automatically/);
  assert.doesNotMatch(service, /\bselfEnable|autoInstallExtension|bypassPolicyGovernance|bypassCostGovernance\b/);
});

test("marketplace preserves tenant isolation through admin context and tenant-scoped repositories", () => {
  const controller = readSource("marketplace.controller.ts");
  const repository = readSource("marketplace.repository.ts");
  const service = readSource("marketplace.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /roles\.includes\("ADMIN"\)/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<MarketplaceAgent>/);
  assert.match(repository, /selectForTenant<MarketplaceExtension>/);
  assert.match(repository, /findByIdForTenant<MarketplaceAgent>/);
  assert.match(repository, /findByIdForTenant<MarketplaceExtension>/);
  assert.match(repository, /selectForTenant<MarketplaceAuditEvent>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("marketplace runtime persistence and backup restore include all registry tables", () => {
  const repository = readSource("marketplace.repository.ts");

  for (const table of [
    "marketplace_agents",
    "marketplace_extensions",
    "marketplace_installs",
    "marketplace_audit_events"
  ]) {
    assert.match(repository + runtimeDatabase + runtimeBackup + backupRestoreTest, new RegExp(`${table}`));
  }

  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "marketplace_installs", "agentId", "marketplace_agents"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "marketplace_installs", "extensionId", "marketplace_extensions"\)/);
  assert.match(runtimeDatabase, /validateReferenceTenant\(data, issues, "marketplace_audit_events", "installId", "marketplace_installs"\)/);
});

test("marketplace remains metadata-only without paid marketplace or external plugin execution", () => {
  const types = readSource("marketplace.types.ts");
  const service = readSource("marketplace.service.ts");

  assert.match(types + service, /externalPluginExecution: "NOT_CONFIGURED"/);
  assert.match(types + service, /paidMarketplace: "NOT_CONFIGURED"/);
  assert.doesNotMatch(service, /executePlugin|runExtension|paidCheckout|stripe|paypal|spawnPlugin/);
});
