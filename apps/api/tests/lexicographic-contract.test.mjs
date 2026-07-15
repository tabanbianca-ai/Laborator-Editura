import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "lexicographic");
const appModulePath = join(__dirname, "..", "src", "modules", "app.module.ts");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("lexicographic module is registered as a Phase 2 backend foundation", () => {
  const moduleSource = readSource("lexicographic.module.ts");
  const appModule = readFileSync(appModulePath, "utf8");

  assert.match(moduleSource, /controllers: \[LexicographicController\]/);
  assert.match(moduleSource, /runtimeDatabaseProvider/);
  assert.match(moduleSource, /DatabaseLexicographicRepository/);
  assert.match(moduleSource, /LexicographicService/);
  assert.match(appModule, /LexicographicModule/);
});

test("lexicographic repository uses runtime database persistence", () => {
  const repository = readSource("lexicographic.repository.ts");
  const service = readSource("lexicographic.service.ts");

  assert.match(repository, /export class DatabaseLexicographicRepository/);
  assert.match(repository, /getDefaultRuntimeDatabase/);
  assert.match(repository, /FileBackedRuntimeDatabase/);
  assert.match(repository, /@Inject\(RUNTIME_DATABASE\)/);
  assert.match(repository, /lexicographic_sources/);
  assert.match(repository, /lexicographic_entries/);
  assert.match(repository, /lexicographic_decisions/);
  assert.match(repository, /lexicographic_audit_events/);
  assert.match(repository, /selectForTenant<DictionaryEntry>/);
  assert.doesNotMatch(repository, /new Map|private readonly .* = new Map|private readonly .*\\[\\] = \\[\\]/);
  assert.match(service, /private readonly repository: DatabaseLexicographicRepository/);
});

test("lexicographic persistence survives repository and service re-instantiation", () => {
  const repository = readSource("lexicographic.repository.ts");
  const moduleSource = readSource("lexicographic.module.ts");

  assert.match(repository, /private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase\(\)/);
  assert.match(repository, /this\.database\.insert\("lexicographic_sources"/);
  assert.match(repository, /this\.database\.insert\("lexicographic_entries"/);
  assert.match(repository, /this\.database\.insert\("lexicographic_decisions"/);
  assert.match(repository, /this\.database\.insert\("lexicographic_audit_events"/);
  assert.match(repository, /selectForTenant<DictionaryEntry>\(\s*"lexicographic_entries"/);
  assert.match(moduleSource, /providers: \[runtimeDatabaseProvider, DatabaseLexicographicRepository, LexicographicService\]/);
});

test("lexicographic controller exposes required authenticated endpoints", () => {
  const source = readSource("lexicographic.controller.ts");

  assert.match(source, /@Post\("sources"\)/);
  assert.match(source, /@Get\("sources"\)/);
  assert.match(source, /@Post\("sources\/:id"\)/);
  assert.match(source, /@Post\("sources\/:id\/disable"\)/);
  assert.match(source, /@Post\("entries"\)/);
  assert.match(source, /@Get\("search"\)/);
  assert.match(source, /@Post\("compare"\)/);
  assert.match(source, /@Post\("validate-term"\)/);
  assert.match(source, /AuthenticatedRequestContext/);
  assert.equal(source.match(/@CurrentActor\(\)/g)?.length, 8);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
  assert.doesNotMatch(source, /x-user-roles/);
});

test("lexicographic source creation supports Calciu and Samharadze dictionary", () => {
  const types = readSource("lexicographic.types.ts");
  const service = readSource("lexicographic.service.ts");

  assert.match(types, /CALCIU_SAMHARADZE_ES_RO_RO_ES/);
  assert.match(types, /Dicționar spaniol-român și român-spaniol/);
  assert.match(types, /Alexandru Calciu/);
  assert.match(types, /Zaira Samharadze/);
  assert.match(service, /applyKnownSourceDefaults/);
  assert.match(service, /BILINGUAL_DICTIONARY/);
  assert.match(service, /this\.audit\("CREATE_SOURCE"/);
});

test("lexicographic entry search supports term and language filters", () => {
  const controller = readSource("lexicographic.controller.ts");
  const repository = readSource("lexicographic.repository.ts");
  const service = readSource("lexicographic.service.ts");

  assert.match(controller, /term: query\.term \?\? ""/);
  assert.match(controller, /sourceLanguage: query\.sourceLanguage \?\? ""/);
  assert.match(controller, /targetLanguage: query\.targetLanguage/);
  assert.match(repository, /searchEntries/);
  assert.match(repository, /entry\.sourceLanguage === input\.sourceLanguage/);
  assert.match(repository, /entry\.targetLanguage === input\.targetLanguage/);
  assert.match(service, /sortEntriesByAuthority/);
  assert.match(service, /this\.audit\("SEARCH_ENTRIES"/);
});

test("lexicographic priority rule prevents AI from overriding validated sources", () => {
  const types = readSource("lexicographic.types.ts");
  const service = readSource("lexicographic.service.ts");

  assert.match(types, /"VALIDATED_PLATFORM_GLOSSARY",\n {2}"DOCUMENTED_EDITORIAL_DECISION"/);
  assert.match(types, /"SPECIALIZED_DICTIONARY",\n {2}"ACADEMIC_DICTIONARY"/);
  assert.match(types, /"AI_SUGGESTION"/);
  assert.match(service, /selectHighestPriorityEvidence/);
  assert.match(service, /priorityRank\(left\.authority\) - this\.priorityRank\(right\.authority\)/);
  assert.match(service, /AI suggestions must never override validated glossary entries/);
  assert.match(service, /humanFinalAuthority: true/);
});

test("lexicographic actions are auditable", () => {
  const service = readSource("lexicographic.service.ts");
  const repository = readSource("lexicographic.repository.ts");
  const types = readSource("lexicographic.types.ts");

  for (const action of [
    "CREATE_SOURCE",
    "LIST_SOURCES",
    "CREATE_ENTRY",
    "SEARCH_ENTRIES",
    "COMPARE_SENSES",
    "VALIDATE_TERM"
  ]) {
    assert.match(types + service, new RegExp(action));
  }

  assert.match(repository, /appendAuditEvent/);
  assert.match(repository, /getAuditEvents/);
});
