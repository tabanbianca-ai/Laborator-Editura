import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const moduleDir = join(apiRoot, "src", "modules");
const dbRoot = join(apiRoot, "..", "..", "packages", "db");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleDir, moduleName, fileName), "utf8");
}

function readDb(path) {
  return readFileSync(join(dbRoot, path), "utf8");
}

test("advanced linguistic resources extend existing modules without a new module", () => {
  const appModule = readFileSync(join(apiRoot, "src", "modules", "app.module.ts"), "utf8");

  assert.doesNotMatch(appModule, /AdvancedLinguisticResourcesModule/);
  assert.match(appModule, /TranslationMemoryModule/);
  assert.match(appModule, /TerminologyModule/);
  assert.match(appModule, /LexicographicModule/);
});

test("project source priority is configurable and auditable", () => {
  const controller = readModule("terminology", "terminology.controller.ts");
  const service = readModule("terminology", "terminology.service.ts");
  const types = readModule("terminology", "terminology.types.ts");
  const runtimeDb = readDb("src/runtime-database.ts");
  const backupLib = readDb("scripts/runtime-backup-lib.mjs");

  assert.match(controller, /@Get\("source-priority"\)/);
  assert.match(controller, /@Post\("source-priority"\)/);
  assert.match(types, /LinguisticSourcePriorityKind/);
  assert.match(types, /OFFICIAL_NORMATIVE_SOURCE/);
  assert.match(types, /PROJECT_GLOSSARY/);
  assert.match(types, /TRANSLATION_MEMORY/);
  assert.match(service, /DEFAULT_SOURCE_PRIORITY/);
  assert.match(service, /dragDropOrderingSupported: true/);
  assert.match(service, /SOURCE_PRIORITY_CHANGED/);
  assert.match(runtimeDb, /"linguistic_source_priorities"/);
  assert.match(backupLib, /"linguistic_source_priorities"/);
});

test("glossary hierarchy enforces project platform personal priority and conflict review", () => {
  const service = readModule("terminology", "terminology.service.ts");
  const types = readModule("terminology", "terminology.types.ts");
  const utils = readModule("terminology", "terminology.utils.ts");

  assert.match(types, /export type GlossaryScope = "PERSONAL" \| "PLATFORM" \| "PROJECT"/);
  assert.match(service, /GLOSSARY_PRIORITY: GlossaryScope\[] = \["PROJECT", "PLATFORM", "PERSONAL"\]/);
  assert.match(utils, /term\.glossaryScope === "PROJECT"/);
  assert.match(utils, /term\.glossaryScope === "PLATFORM"/);
  assert.match(service, /detectGlossaryConflicts/);
  assert.match(service, /humanReviewRequired: true/);
  assert.match(service, /GLOSSARY_CONFLICT/);
  assert.match(service, /term\.glossaryScope === "PERSONAL" && term\.status === "VALIDATED"/);
});

test("translation memory supports exact fuzzy and context proposal matching only", () => {
  const controller = readModule("translation-memory", "translation-memory.controller.ts");
  const service = readModule("translation-memory", "translation-memory.service.ts");
  const types = readModule("translation-memory", "translation-memory.types.ts");

  assert.match(controller, /@Get\("proposals"\)/);
  assert.match(types, /TranslationMemoryMatchType = "CONTEXT" \| "EXACT" \| "FUZZY"/);
  assert.match(types, /automaticReplacement: false/);
  assert.match(types, /proposalOnly: true/);
  assert.match(service, /resolveMatchType/);
  assert.match(service, /normalizeTmText\(input\.context\) === normalizeTmText\(entry\.context\)/);
  assert.match(service, /normalizeTmText\(entry\.sourceText\) === normalizeTmText\(input\.sourceText\)/);
  assert.match(service, /return "FUZZY"/);
  assert.match(service, /It must never replace text automatically/);
});

test("translation flow stores TM only for validated translations and keeps proposals transparent", () => {
  const service = readModule("translations", "translations.service.ts");

  assert.match(service, /translationMemoryService\.buildProposals/);
  assert.match(service, /translationStatus === "VALIDATED"/);
  assert.match(service, /approvalStatus: "APPROVED"/);
  assert.match(service, /validatedTranslationOnly: true/);
  assert.match(service, /proposalOnlyReuse: true/);
  assert.match(service, /translationMemoryProposals/);
  assert.match(service, /terminologyProposalExplanation/);
});

test("confidence score proposal explanation and audit are exposed", () => {
  const terminologyService = readModule("terminology", "terminology.service.ts");
  const terminologyTypes = readModule("terminology", "terminology.types.ts");
  const tmService = readModule("translation-memory", "translation-memory.service.ts");
  const tmTypes = readModule("translation-memory", "translation-memory.types.ts");

  assert.match(terminologyTypes, /LinguisticProposalExplanation/);
  assert.match(terminologyTypes, /confidenceScore: number/);
  assert.match(terminologyTypes, /consultedSources: string\[]/);
  assert.match(terminologyTypes, /glossaryUsed\?: GlossaryScope/);
  assert.match(terminologyTypes, /semanticValidation/);
  assert.match(terminologyService, /buildProposalExplanation/);
  assert.match(terminologyService, /calculateLinguisticConfidence/);
  assert.match(terminologyService, /CONFIDENCE_RECALCULATED/);
  assert.match(tmTypes, /TranslationMemoryProposal/);
  assert.match(tmService, /calculateProposalConfidence/);
  assert.match(tmService, /TRANSLATION_MEMORY_ENTRY_ADDED/);
  assert.match(tmService, /TRANSLATION_MEMORY_REUSED/);
});
