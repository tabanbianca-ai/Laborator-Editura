import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-03");

const requiredBatchDocuments = [
  "overview.md",
  "data-store-inventory.md",
  "canonical-entity-registry.md",
  "data-ownership-map.md",
  "metadata-audit-model.md",
  "lifecycle-state-catalog.md",
  "referential-integrity-report.md",
  "migration-standardization.md",
  "data-migration-plan.md",
  "api-inventory.md",
  "api-contract-catalog.md",
  "event-catalog.md",
  "import-export-contracts.md",
  "data-classification-retention.md",
  "test-evidence.md",
  "changed-files.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

const canonicalEntities = [
  "Identity",
  "Organization",
  "Project",
  "Manuscript",
  "Work",
  "Edition",
  "Translation",
  "Revision",
  "Publication",
  "MagazineIssue",
  "Article",
  "DigitalAsset",
  "RightsRecord",
  "Contract",
  "Workflow",
  "Task",
  "Notification",
  "AuditRecord",
  "LocalizationResource",
  "AIAsset"
];

const migrationIds = [
  "0000_mvp_foundation_v1",
  "0001_translation_memory_v1",
  "0002_terminology_glossary_v1",
  "0003_qa_engine_v1",
  "0004_semantic_fidelity_v1",
  "0005_workflow_engine_v1",
  "0006_terminology_governance_v2",
  "0007_founder_protection_v1",
  "0008_security_hardening_phase_1"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-03", fileName);
}

function extractRuntimeTableNames(source) {
  const tableBlock = source.match(/const TABLE_NAMES = \[([\s\S]*?)\] as const;/);

  if (!tableBlock) {
    return [];
  }

  return [...tableBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

test("Batch 03 required documentation deliverables exist", () => {
  for (const fileName of requiredBatchDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("canonical entity registry and shared contracts cover approved Batch 03 entities", () => {
  const registry = readBatchDocument("canonical-entity-registry.md");
  const sharedContract = readRepositoryFile("packages", "shared", "src", "canonical-data.ts");
  const sharedIndex = readRepositoryFile("packages", "shared", "src", "index.ts");
  const sharedPackage = readRepositoryFile("packages", "shared", "package.json");

  for (const entity of canonicalEntities) {
    assert.match(registry, new RegExp(`\\b${entity}\\b`), `${entity} must be documented`);
    assert.match(sharedContract, new RegExp(`"${entity}"`), `${entity} must be typed`);
  }

  for (const symbol of [
    "CanonicalEntityDefinition",
    "DataOwnershipRule",
    "LifecycleDefinition",
    "ReferentialIntegrityRule",
    "MigrationManifest",
    "ApiSuccessEnvelope",
    "ApiErrorEnvelope",
    "ApiEndpointContract",
    "CanonicalEventEnvelope",
    "EventContract",
    "ImportExportContract",
    "RetentionPolicyDefinition"
  ]) {
    assert.match(sharedContract, new RegExp(symbol), `${symbol} must be part of shared canonical data`);
  }

  assert.match(sharedIndex, /export \* from "\.\/canonical-data"/);
  assert.match(sharedPackage, /"\.\/canonical-data"/);
});

test("runtime table inventory is mirrored by backup support and Batch 03 reports", () => {
  const runtimeDatabase = readRepositoryFile("packages", "db", "src", "runtime-database.ts");
  const backupLibrary = readRepositoryFile("packages", "db", "scripts", "runtime-backup-lib.mjs");
  const inventory = readBatchDocument("data-store-inventory.md");
  const runtimeTables = extractRuntimeTableNames(runtimeDatabase);

  assert.ok(runtimeTables.length > 100, "runtime table inventory should include current module tables");

  for (const tableName of runtimeTables) {
    assert.match(backupLibrary, new RegExp(`"${tableName}"`), `${tableName} must be backed up`);
    assert.match(inventory, new RegExp(`\\b${tableName}\\b`), `${tableName} must be inventoried`);
  }

  for (const tableName of ["projects", "documents", "segment_translations", "rights_audit_events"]) {
    assert.ok(runtimeTables.includes(tableName), `${tableName} must remain registered`);
  }
});

test("migration and API contract reports document the current versioned baseline", () => {
  const migrations = readdirSync(join(repositoryRoot, "packages", "db", "migrations")).filter((fileName) =>
    fileName.endsWith(".sql")
  );
  const migrationStandardization = readBatchDocument("migration-standardization.md");
  const apiInventory = readBatchDocument("api-inventory.md");
  const apiContractCatalog = readBatchDocument("api-contract-catalog.md");

  for (const migrationId of migrationIds) {
    assert.ok(
      migrations.some((fileName) => fileName.startsWith(migrationId)),
      `${migrationId} must exist as a SQL migration`
    );
    assert.match(migrationStandardization, new RegExp(migrationId), `${migrationId} must be cataloged`);
  }

  for (const route of ["/health", "/auth", "/projects", "/documents", "/translations", "/workflow", "/export"]) {
    assert.match(apiInventory, new RegExp(route.replace("/", "\\/")), `${route} must be inventoried`);
  }

  for (const contractTerm of ["request_id", "message_key", "correlation_id", "v1", "deprecation plan"]) {
    assert.match(apiContractCatalog, new RegExp(contractTerm), `${contractTerm} must be in API contracts`);
  }
});

test("events, import/export, classification, and migration plans expose governance rules", () => {
  const eventCatalog = readBatchDocument("event-catalog.md");
  const importExport = readBatchDocument("import-export-contracts.md");
  const classification = readBatchDocument("data-classification-retention.md");
  const migrationPlan = readBatchDocument("data-migration-plan.md");
  const referentialIntegrity = readBatchDocument("referential-integrity-report.md");

  for (const eventName of [
    "IdentityCreated",
    "ProjectCreated",
    "ManuscriptCreated",
    "TranslationStarted",
    "RevisionCompleted",
    "EditionApproved",
    "PublicationCreated",
    "RightsValidated"
  ]) {
    assert.match(eventCatalog, new RegExp(eventName), `${eventName} must be cataloged`);
  }

  for (const eventField of ["event_id", "event_version", "organization_id", "correlation_id", "causation_id"]) {
    assert.match(eventCatalog, new RegExp(eventField), `${eventField} must be in event envelope`);
  }

  for (const importExportTerm of ["JSON Master", "runtime database backup", "schema_version", "idempotency"]) {
    assert.match(importExport, new RegExp(importExportTerm, "i"), `${importExportTerm} must be documented`);
  }

  for (const classificationName of ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED", "legal hold"]) {
    assert.match(classification, new RegExp(classificationName, "i"), `${classificationName} must be governed`);
  }

  for (const phase of ["Expand", "Migrate", "Contract"]) {
    assert.match(migrationPlan, new RegExp(phase, "i"), `${phase} phase must be documented`);
  }

  for (const relationship of ["organization -> project", "work -> edition", "rights -> resource"]) {
    assert.match(referentialIntegrity, new RegExp(relationship), `${relationship} must be reviewed`);
  }
});
