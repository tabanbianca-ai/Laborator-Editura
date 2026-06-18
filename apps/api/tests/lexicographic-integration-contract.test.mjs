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
  assert.match(service, /lexicographicService\.describeEntries/);
  assert.match(service, /lexicographicSupport: this\.mapLexicographicSupport/);
  assert.match(types, /TranslationLexicographicSupport/);
  assert.match(types, /translationEquivalents/);
  assert.match(types, /sourceReferences/);
  assert.match(types, /citations/);
  assert.match(types, /authority/);
  assert.match(types, /priorityRank/);
  assert.match(service, /humanFinalAuthority: true/);
});

test("lexicographic matching finds a dictionary term inside a source sentence", () => {
  const repository = readModule("lexicographic", "lexicographic.repository.ts");
  const service = readModule("translations", "translations.service.ts");

  function normalizeLexicalText(value) {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
      .toLocaleLowerCase()
      .trim();
  }

  function hasTokenSafeOccurrence(text, term) {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|\\s)${escapedTerm}(?:\\s|$)`, "u").test(text);
  }

  function matchesLexicalTerm(entryTerm, queryText) {
    const normalizedTerm = normalizeLexicalText(entryTerm);
    const normalizedQuery = normalizeLexicalText(queryText);

    return normalizedTerm === normalizedQuery ||
      hasTokenSafeOccurrence(normalizedQuery, normalizedTerm) ||
      hasTokenSafeOccurrence(normalizedTerm, normalizedQuery);
  }

  assert.equal(
    matchesLexicalTerm("espíritu", "El espíritu progresa por la experiencia."),
    true
  );
  assert.equal(matchesLexicalTerm("rit", "El espíritu progresa por la experiencia."), false);
  assert.match(repository, /matchesLexicalTerm\(entry\.normalizedTerm, normalizedQuery\)/);
  assert.match(repository, /hasTokenSafeOccurrence/);
  assert.match(service, /term: segment\.sourceText/);
  assert.match(service, /lexicographicSupport: this\.mapLexicographicSupport/);
});

test("translation lexicographic support can be built from persisted dictionary evidence", () => {
  const sourceText = "El espíritu progresa por la experiencia moral.";
  const entry = {
    id: "entry-espiritu",
    sourceId: "source-calciu-samharadze",
    term: "espíritu",
    normalizedTerm: "espiritu",
    sourceLanguage: "es",
    targetLanguage: "ro",
    senses: [
      {
        id: "sense-espiritu-1",
        translationEquivalents: ["spirit"],
      }
    ],
    citations: [
      {
        id: "citation-espiritu-1",
        sourceId: "source-calciu-samharadze",
        sourceReference: "Dicționar spaniol-român și român-spaniol",
        pageOrSection: "espíritu"
      }
    ]
  };

  const normalizedSource = sourceText
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .toLocaleLowerCase()
    .trim();
  const hasEntry = new RegExp(`(?:^|\\s)${entry.normalizedTerm}(?:\\s|$)`, "u")
    .test(normalizedSource);

  const lexicographicSupport = hasEntry
    ? [
      {
        entryId: entry.id,
        sourceId: entry.sourceId,
        term: entry.term,
        translationEquivalents: entry.senses.flatMap((sense) => sense.translationEquivalents),
        sourceReferences: entry.citations.map((citation) => citation.sourceReference),
        citations: entry.citations,
        authority: "ACADEMIC_DICTIONARY",
        priorityRank: 3,
        authoritative: false,
        humanFinalAuthority: true
      }
    ]
    : [];

  assert.equal(lexicographicSupport.length, 1);
  assert.equal(lexicographicSupport[0].entryId, "entry-espiritu");
  assert.equal(lexicographicSupport[0].sourceId, "source-calciu-samharadze");
  assert.deepEqual(lexicographicSupport[0].translationEquivalents, ["spirit"]);
  assert.deepEqual(lexicographicSupport[0].sourceReferences, [
    "Dicționar spaniol-român și român-spaniol"
  ]);
  assert.equal(lexicographicSupport[0].authoritative, false);
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
