import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "research");
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

test("research module is registered with authenticated endpoints only", () => {
  const controller = readSource("research.controller.ts");
  const moduleSource = readSource("research.module.ts");

  assert.match(appModule, /ResearchModule/);
  assert.match(moduleSource, /DatabaseResearchRepository/);
  assert.match(moduleSource, /ResearchService/);
  assert.match(controller, /@Controller\("research"\)/);
  assert.match(controller, /@Post\("sources"\)/);
  assert.match(controller, /@Get\("sources"\)/);
  assert.match(controller, /@Get\("sources\/:id"\)/);
  assert.match(controller, /@Post\("notes"\)/);
  assert.match(controller, /@Post\("entities"\)/);
  assert.match(controller, /@Post\("relationships"\)/);
  assert.match(controller, /@Post\("collections"\)/);
  assert.match(controller, /@Post\("collections\/:id\/items"\)/);
  assert.match(controller, /@Get\("search"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /@Controller\("public/);
});

test("research sources support required source types and metadata", () => {
  const types = readSource("research.types.ts");
  const service = readSource("research.service.ts");

  for (const sourceType of [
    "BOOK",
    "PDF",
    "ARTICLE",
    "MANUSCRIPT",
    "MAGAZINE",
    "WEBSITE_REFERENCE",
    "HISTORICAL_DOCUMENT",
    "MULTIMEDIA_REFERENCE"
  ]) {
    assert.match(types, new RegExp(`"${sourceType}"`));
  }

  for (const field of [
    "title",
    "subtitle",
    "author",
    "originalAuthor",
    "language",
    "originalLanguage",
    "firstPublicationYear",
    "publisher",
    "isbn",
    "url",
    "citation",
    "tags",
    "notes"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }
});

test("research collections support thematic private project and shared editorial collections", () => {
  const types = readSource("research.types.ts");
  const service = readSource("research.service.ts");

  for (const visibility of ["PRIVATE", "TEAM", "ORGANIZATION", "PUBLIC_REFERENCE"]) {
    assert.match(types, new RegExp(`"${visibility}"`));
  }

  assert.match(types, /ResearchCollection/);
  assert.match(types, /ResearchCollectionItem/);
  assert.match(service, /thematicTags/);
  assert.match(service, /projectId/);
  assert.match(service, /sharedEditorialCollection/);
  assert.match(service, /addCollectionItem/);
});

test("research notes support private editorial translation semantic terminology and manuscript notes", () => {
  const types = readSource("research.types.ts");
  const service = readSource("research.service.ts");

  for (const noteType of [
    "PRIVATE_NOTE",
    "EDITORIAL_NOTE",
    "TRANSLATION_NOTE",
    "SEMANTIC_NOTE",
    "TERMINOLOGY_NOTE",
    "MANUSCRIPT_NOTE"
  ]) {
    assert.match(types, new RegExp(`"${noteType}"`));
  }

  assert.match(service, /privateToCreator/);
  assert.match(service, /PRIVATE_NOTE/);
  assert.match(service, /visibility === "PRIVATE"/);
});

test("knowledge base entities and relationships cover required graph concepts", () => {
  const types = readSource("research.types.ts");
  const service = readSource("research.service.ts");

  for (const entityType of [
    "CONCEPT",
    "CHARACTER",
    "PLACE",
    "TIMELINE",
    "HISTORICAL_EVENT",
    "TERMINOLOGY_ENTRY",
    "SPIRITUAL_CONCEPT",
    "CUSTOM_ENTITY"
  ]) {
    assert.match(types, new RegExp(`"${entityType}"`));
  }

  for (const relationshipType of ["REFERENCE", "SYNONYM", "INFLUENCE", "CHRONOLOGY", "PARENT_CHILD", "RELATED_ENTITY"]) {
    assert.match(types, new RegExp(`"${relationshipType}"`));
  }

  assert.match(service, /fromEntityId/);
  assert.match(service, /toEntityId/);
  assert.match(service, /requireEntity/);
});

test("research ecosystem references cover the approved platform modules", () => {
  const types = readSource("research.types.ts");

  for (const moduleName of [
    "AUTHOR_STUDIO",
    "TRANSLATION",
    "LEXICOGRAPHIC",
    "TERMINOLOGY",
    "SEMANTIC_FIDELITY",
    "MULTIMEDIA_CREATION",
    "MEDIA_LOCALIZATION",
    "PUBLIC_PORTAL",
    "COMMERCE"
  ]) {
    assert.match(types, new RegExp(`"${moduleName}"`));
  }

  assert.match(types, /ResearchEcosystemReference/);
});

test("research search supports full text author language tags source type entity and project filters", () => {
  const controller = readSource("research.controller.ts");
  const service = readSource("research.service.ts");

  assert.match(controller, /@Query\(\) query: ResearchSearchQuery/);
  assert.match(service, /matchesQuery/);
  assert.match(service, /query\.author/);
  assert.match(service, /query\.language/);
  assert.match(service, /query\.sourceType/);
  assert.match(service, /query\.entity/);
  assert.match(service, /query\.projectId/);
  assert.match(service, /normalizeTags/);
});

test("AI is advisory only and cannot mutate sources citations or approvals", () => {
  const types = readSource("research.types.ts");
  const service = readSource("research.service.ts");

  assert.match(types, /ResearchAiPolicy/);
  assert.match(service, /summarizeSources: true/);
  assert.match(service, /extractConcepts: true/);
  assert.match(service, /suggestRelations: true/);
  assert.match(service, /buildKnowledgeGraphs: true/);
  assert.match(service, /suggestBibliography: true/);
  assert.match(service, /mayModifyOriginalSources: false/);
  assert.match(service, /mayDeleteValidatedResearch: false/);
  assert.match(service, /mayApproveEditorialContent: false/);
  assert.match(service, /mayAlterCitationsAutomatically: false/);
  assert.doesNotMatch(service, /deleteSource|modifyOriginalSource|autoApprove|alterCitationAutomatically/);
});

test("privacy rules keep private notes and private research out of public exposure", () => {
  const service = readSource("research.service.ts");
  const controller = readSource("research.controller.ts");

  assert.match(service, /canReadVisibility/);
  assert.match(service, /visibility !== "PRIVATE"/);
  assert.match(service, /createdBy === actor\.userId/);
  assert.match(service, /hasRole\(actor, "ADMIN"\)/);
  assert.match(service, /hasRole\(actor, "REVIEWER"\)/);
  assert.doesNotMatch(controller + service, /publicResearch|publicNote|@Controller\("public\/research/);
});

test("research audit trail covers creation collection updates AI suggestions and approvals", () => {
  const repository = readSource("research.repository.ts");
  const service = readSource("research.service.ts");
  const types = readSource("research.types.ts");

  assert.match(repository, /research_audit_events/);
  assert.match(types, /ResearchAuditEvent/);

  for (const action of [
    "RESEARCH_SOURCE_CREATED",
    "RESEARCH_NOTE_CREATED",
    "RESEARCH_ENTITY_CREATED",
    "RESEARCH_RELATIONSHIP_CREATED",
    "RESEARCH_COLLECTION_CREATED",
    "RESEARCH_COLLECTION_ITEM_ADDED",
    "RESEARCH_AI_SUGGESTION_RECORDED",
    "RESEARCH_APPROVAL_RECORDED"
  ]) {
    assert.match(types + service, new RegExp(`${action}`));
  }

  assert.match(service, /humanFinalAuthority: true/);
});

test("research hub avoids external academic API integration", () => {
  const combined = [
    readSource("research.controller.ts"),
    readSource("research.service.ts"),
    readSource("research.repository.ts")
  ].join("\n");

  assert.doesNotMatch(combined, /fetch\(|axios|crossref|pubmed|openalex|semantic-scholar/i);
});

test("runtime persistence and backup include research hub data", () => {
  for (const tableName of [
    "research_sources",
    "research_notes",
    "research_entities",
    "research_relationships",
    "research_collections",
    "research_collection_items",
    "research_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"research_collection_items",\s*"collectionId",\s*"research_collections"/);
  assert.match(runtimeBackup, /"research_relationships",\s*"fromEntityId",\s*"research_entities"/);
  assert.match(backupRestoreTest, /research-source-a/);
  assert.match(backupRestoreTest, /research-relationship-a/);
});
