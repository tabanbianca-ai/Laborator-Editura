import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleDir, moduleName, fileName), "utf8");
}

test("translation flow can include lexicographic support metadata", () => {
  const moduleSource = readModule("translations", "translations.module.ts");
  const service = readModule("translations", "translations.service.ts");
  const types = readModule("translations", "translations.types.ts");

  assert.match(moduleSource, /LexicographicModule/);
  assert.match(service, /LexicographicService/);
  assert.match(service, /lexicographicService\.searchEntries/);
  assert.match(service, /lexicographicSupport: this\.mapLexicographicSupport/);
  assert.match(types, /TranslationLexicographicSupport/);
  assert.match(service, /humanFinalAuthority: true/);
});

test("terminology check can include dictionary evidence without becoming authoritative", () => {
  const moduleSource = readModule("terminology", "terminology.module.ts");
  const service = readModule("terminology", "terminology.service.ts");
  const types = readModule("terminology", "terminology.types.ts");

  assert.match(moduleSource, /LexicographicModule/);
  assert.match(service, /LexicographicService/);
  assert.match(service, /collectDictionaryEvidence/);
  assert.match(service, /lexicographicService\.searchEntries/);
  assert.match(types, /TerminologyDictionaryEvidence/);
  assert.match(types, /DICTIONARY_EVIDENCE_AFTER_VALIDATED_GLOSSARY/);
  assert.match(service, /authoritative: false/);
});

test("semantic fidelity report can reference lexicographic evidence", () => {
  const moduleSource = readModule("semantic-fidelity", "semantic-fidelity.module.ts");
  const service = readModule("semantic-fidelity", "semantic-fidelity.service.ts");
  const types = readModule("semantic-fidelity", "semantic-fidelity.types.ts");

  assert.match(moduleSource, /LexicographicModule/);
  assert.match(service, /LexicographicService/);
  assert.match(service, /collectLexicographicReferences/);
  assert.match(service, /lexicographicService\.searchEntries/);
  assert.match(types, /SemanticLexicographicReference/);
  assert.match(types, /lexicographicReferences\?: SemanticLexicographicReference\[]/);
  assert.match(service, /LEXICOGRAPHIC_SUPPORT_AFTER_VALIDATED_TERMINOLOGY/);
});

test("validated glossary remains above dictionary evidence and AI suggestions", () => {
  const terminology = readModule("terminology", "terminology.service.ts");
  const semantic = readModule("semantic-fidelity", "semantic-fidelity.service.ts");
  const lexicographicTypes = readModule("lexicographic", "lexicographic.types.ts");

  assert.match(lexicographicTypes, /"VALIDATED_PLATFORM_GLOSSARY",\n  "DOCUMENTED_EDITORIAL_DECISION"/);
  assert.match(lexicographicTypes, /"SPECIALIZED_DICTIONARY",\n  "ACADEMIC_DICTIONARY"/);
  assert.match(lexicographicTypes, /"AI_SUGGESTION"/);
  assert.match(terminology, /priority: "TERMINOLOGY_VALIDATED"/);
  assert.match(terminology, /DICTIONARY_EVIDENCE_AFTER_VALIDATED_GLOSSARY/);
  assert.match(semantic, /VALIDATED_TERMINOLOGY_OVER_TM_OVER_AI/);
  assert.match(semantic, /AI may provide explanations and alternatives but cannot override validated terminology or final human authority/);
});
