import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const moduleDir = join(apiRoot, "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleDir, moduleName, fileName), "utf8");
}

function readApi(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

test("Integrated Linguistic Knowledge Base extends existing lexicographic infrastructure without a new module", () => {
  const appModule = readApi("src/modules/app.module.ts");
  const lexicographicModule = readModule("lexicographic", "lexicographic.module.ts");

  assert.match(appModule, /LexicographicModule/);
  assert.doesNotMatch(appModule, /LinguisticKnowledgeBaseModule/);
  assert.match(lexicographicModule, /LexicographicService/);
  assert.match(lexicographicModule, /DatabaseLexicographicRepository/);
});

test("linguistic resources model monolingual bilingual normative phraseological specialized and corpus sources", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");

  for (const sourceType of [
    "MONOLINGUAL_DICTIONARY",
    "BILINGUAL_DICTIONARY",
    "ORTHOGRAPHIC_DICTIONARY",
    "ORTHOEPIC_DICTIONARY",
    "MORPHOLOGICAL_DICTIONARY",
    "GRAMMAR_RULES",
    "PUNCTUATION_RULES",
    "PHRASEOLOGICAL_DICTIONARY",
    "SPECIALIZED_GLOSSARY",
    "TERMINOLOGY_DATABASE",
    "EDITORIAL_GUIDE",
    "CORPUS"
  ]) {
    assert.match(types, new RegExp(sourceType));
  }

  for (const field of [
    "projectId",
    "language",
    "languagePair",
    "publisherOrInstitution",
    "edition",
    "publicationYear",
    "version",
    "sourceUrl",
    "importedDocumentRef",
    "licenseStatus",
    "copyrightHolder",
    "redistributionPermission",
    "authorityLevel",
    "domain",
    "effectiveDate",
    "lastVerificationDate",
    "enabled"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
  }
});

test("content access separates integrated content from external controlled access and forbids full restricted ingestion", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const service = readModule("lexicographic", "lexicographic.service.ts");

  assert.match(types, /"INTEGRATED_CONTENT"/);
  assert.match(types, /"EXTERNAL_CONTROLLED_ACCESS"/);
  assert.match(types, /permittedExcerpts/);
  assert.match(types, /accessRestrictions/);
  assert.match(types, /licenseNotes/);
  assert.match(service, /assertSourceAllowsEntryImport/);
  assert.match(service, /EXTERNAL_CONTROLLED_ACCESS/);
  assert.match(service, /METADATA_ONLY/);
  assert.match(service, /RESTRICTED/);
  assert.match(service, /NOT_ALLOWED/);
  assert.match(service, /cannot ingest full copyrighted dictionary content/);
});

test("integrated entries store searchable lexical content with exact source and edition traceability", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const service = readModule("lexicographic", "lexicographic.service.ts");

  for (const field of [
    "headword",
    "definition",
    "grammaticalCategory",
    "inflection",
    "pronunciation",
    "usageLabels",
    "examples",
    "idioms",
    "synonyms",
    "antonyms",
    "etymology",
    "bilingualEquivalents",
    "sourceEdition"
  ]) {
    assert.match(types + service, new RegExp(field));
  }

  assert.match(service, /sourceEdition: input\.sourceEdition \?\? source\.edition/);
  assert.match(types, /LexicographicCitation/);
});

test("Romanian linguistic profile supports configurable DOOM DEX grammar punctuation and specialized sources without hardcoded content", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");

  assert.match(types, /ROMANIAN_LINGUISTIC_SOURCE_PROFILE/);
  assert.match(types, /DOOM editions/);
  assert.match(types, /DEX-type explanatory resources/);
  assert.match(types, /official Romanian grammar rules/);
  assert.match(types, /orthographic and punctuation rules/);
  assert.match(types, /Romanian bilingual dictionaries/);
  assert.match(types, /Do not hardcode copyrighted content/);
});

test("source priority covers normative academic specialized editorial descriptive and informative levels", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const service = readModule("lexicographic", "lexicographic.service.ts");

  assert.match(types, /LINGUISTIC_SOURCE_PRIORITY_RULE/);
  assert.match(types, /"OFFICIAL_NORMATIVE",\n  "ACADEMIC"/);
  assert.match(types, /"VALIDATED_SPECIALIZED",\n  "EDITORIAL_GUIDE"/);
  assert.match(types, /"DESCRIPTIVE",\n  "INFORMATIVE"/);
  assert.match(service, /defaultAuthorityLevelForSourceType/);
  assert.match(service, /GRAMMAR_RULES/);
  assert.match(service, /ORTHOGRAPHIC_DICTIONARY/);
  assert.match(service, /SPECIALIZED_SPIRITIST_DICTIONARY/);
});

test("dictionary conflicts are detected and routed to human review without silent replacement", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const service = readModule("lexicographic", "lexicographic.service.ts");

  assert.match(types, /LexicographicSourceConflict/);
  assert.match(types, /humanReviewRequired: true/);
  assert.match(service, /detectSourceConflicts/);
  assert.match(service, /DICTIONARY_CONFLICT/);
  assert.match(service, /no silent replacement is allowed/);
});

test("search supports headword phrase idiom language pair domain source edition authority and exact normalized fuzzy morphological modes", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const repository = readModule("lexicographic", "lexicographic.repository.ts");
  const controller = readModule("lexicographic", "lexicographic.controller.ts");

  for (const field of [
    "phrase",
    "idiom",
    "languagePair",
    "domain",
    "grammaticalCategory",
    "sourceId",
    "edition",
    "authorityLevel",
    "searchMode"
  ]) {
    assert.match(types + controller, new RegExp(field));
  }

  for (const mode of ["EXACT", "NORMALIZED", "FUZZY", "MORPHOLOGICAL"]) {
    assert.match(types, new RegExp(mode));
  }

  assert.match(repository, /matchesLexicalTerm/);
  assert.match(repository, /hasTokenSafeOccurrence/);
  assert.match(repository, /isFuzzyLexicalMatch/);
  assert.match(repository, /singularLike/);
});

test("Translation Terminology and Semantic Fidelity receive source edition license and authority metadata", () => {
  const translationTypes = readModule("translations", "translations.types.ts");
  const terminologyTypes = readModule("terminology", "terminology.types.ts");
  const terminologyService = readModule("terminology", "terminology.service.ts");
  const semanticTypes = readModule("semantic-fidelity", "semantic-fidelity.types.ts");
  const semanticService = readModule("semantic-fidelity", "semantic-fidelity.service.ts");

  for (const field of [
    "authorityLevel",
    "sourceTitle",
    "sourceEdition",
    "publicationYear",
    "licenseStatus",
    "accessMode",
    "lastVerificationDate"
  ]) {
    assert.match(translationTypes, new RegExp(field));
    assert.match(terminologyTypes + terminologyService, new RegExp(field));
    assert.match(semanticTypes + semanticService, new RegExp(field));
  }

  assert.match(terminologyService, /DICTIONARY_EVIDENCE_AFTER_VALIDATED_GLOSSARY/);
  assert.match(semanticService, /LEXICOGRAPHIC_SUPPORT_AFTER_VALIDATED_TERMINOLOGY/);
});

test("agent responsibilities use the knowledge base while preserving human final authority", () => {
  const governance = readModule("ai-governance", "ai-governance.types.ts");

  assert.match(governance, /automatically queries the Integrated Linguistic Knowledge Base/);
  assert.match(governance, /consults source-language and target-language resources/);
  assert.match(governance, /checks idioms locutions and contextual meanings/);
  assert.match(governance, /cites exact source and edition for disputed choices/);
  assert.match(governance, /adds and verifies linguistic sources and editions/);
  assert.match(governance, /validates linguistic resource licenses permissions and redistribution rights/);
  assert.match(governance, /spelling grammar inflection register and usage checks against approved linguistic resources/);
  assert.match(governance, /required linguistic resource consultation/);
  assert.match(governance, /outdated linguistic sources/);
  assert.match(governance, /unauthorized linguistic sources/);
  assert.match(governance, /mayApproveAutomatically: false/);
});

test("Quality Agent readiness can report missing outdated or unauthorized linguistic resources without correcting them", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const service = readModule("lexicographic", "lexicographic.service.ts");

  assert.match(types, /LinguisticResourceReadinessReport/);
  assert.match(types, /"READY_WITH_WARNINGS"/);
  assert.match(types, /"BLOCKED"/);
  assert.match(types, /OUTDATED_VERIFICATION/);
  assert.match(types, /UNAUTHORIZED_SOURCE/);
  assert.match(service, /evaluateResourceReadiness/);
  assert.match(service, /qualityAgentReportsOnly: true/);
  assert.match(service, /humanFinalAuthority: true/);
});

test("audit coverage includes required linguistic knowledge base events", () => {
  const types = readModule("lexicographic", "lexicographic.types.ts");
  const service = readModule("lexicographic", "lexicographic.service.ts");

  for (const action of [
    "RESOURCE_ADDED",
    "RESOURCE_UPDATED",
    "LICENSE_CHANGED",
    "ENTRY_IMPORTED",
    "SOURCE_CONSULTED",
    "TERMINOLOGY_DECISION",
    "DICTIONARY_CONFLICT",
    "HUMAN_OVERRIDE",
    "RESOURCE_DISABLED"
  ]) {
    assert.match(types, new RegExp(action));
  }

  assert.match(service, /this\.audit\("ENTRY_IMPORTED"/);
  assert.match(service, /this\.audit\("RESOURCE_ADDED"/);
  assert.match(service, /this\.audit\("RESOURCE_UPDATED"/);
  assert.match(service, /this\.audit\("LICENSE_CHANGED"/);
  assert.match(service, /this\.audit\("SOURCE_CONSULTED"/);
  assert.match(service, /this\.audit\("DICTIONARY_CONFLICT"/);
  assert.match(service, /this\.audit\(\s*"TERMINOLOGY_DECISION"/);
  assert.match(service, /this\.audit\("RESOURCE_DISABLED"/);
});
