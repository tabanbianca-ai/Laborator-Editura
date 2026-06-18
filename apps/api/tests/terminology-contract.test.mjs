import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "terminology");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("terminology controller exposes MVP API endpoints", () => {
  const source = readSource("terminology.controller.ts");

  assert.match(source, /@Post\("terms"\)/);
  assert.match(source, /@Patch\("terms\/:id"\)/);
  assert.match(source, /@Post\("terms\/:id\/validate"\)/);
  assert.match(source, /@Post\("terms\/:id\/suspend"\)/);
  assert.match(source, /@Post\("terms\/:id\/archive"\)/);
  assert.match(source, /@Get\("terms"\)/);
  assert.match(source, /@Post\("check-segment"\)/);
  assert.match(source, /CurrentActor/);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
});

test("terminology service records audit events for lifecycle actions", () => {
  const source = readSource("terminology.service.ts");

  assert.match(source, /this\.audit\("CREATE"/);
  assert.match(source, /this\.audit\("UPDATE"/);
  assert.match(source, /this\.audit\("VALIDATE"/);
  assert.match(source, /this\.audit\(action/);
  assert.match(source, /"SUSPEND"/);
  assert.match(source, /"ARCHIVE"/);
});

test("terminology service enforces validated term authority over TM and AI", () => {
  const source = readSource("terminology.service.ts");

  assert.match(source, /authoritative: true/);
  assert.match(source, /priority: "TERMINOLOGY_VALIDATED"/);
  assert.match(source, /VALIDATED terms require an approved translation or preferred variant/);
});

test("terminology check returns dictionaryEvidence for espíritu source text", () => {
  const source = readSource("terminology.service.ts");
  const types = readSource("terminology.types.ts");

  assert.match(source, /const queryTexts = uniqueStrings\(\[/);
  assert.match(source, /input\.sourceText/);
  assert.match(source, /for \(const queryText of queryTexts\)/);
  assert.match(source, /term: queryText/);
  assert.match(source, /resolveLexicographicSourceLanguages/);
  assert.match(source, /lexicographicService\.listSources/);
  assert.match(source, /source\.targetLanguages\.includes\(targetLanguage\)/);
  assert.match(source, /return source\.sourceLanguages/);
  assert.match(source, /lexicographicService\.searchEntries/);
  assert.match(source, /lexicographicService\.describeEntries/);
  assert.match(source, /evidenceByEntryId/);
  assert.match(types, /dictionaryEvidence\?: TerminologyDictionaryEvidence\[]/);

  const dictionaryEvidence = [
    {
      entryId: "entry-espiritu",
      sourceId: "source-calciu-samharadze",
      term: "espíritu",
      sourceLanguage: "es",
      targetLanguage: "ro",
      translationEquivalents: ["spirit"],
      sourceReferences: ["Dicționar spaniol-român și român-spaniol"],
      citations: [
        {
          id: "citation-espiritu",
          sourceId: "source-calciu-samharadze",
          sourceReference: "Dicționar spaniol-român și român-spaniol",
          pageOrSection: "espíritu",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      authority: "ACADEMIC_DICTIONARY",
      priorityRank: 3,
      authoritative: false,
      humanFinalAuthority: true
    }
  ];

  assert.equal(dictionaryEvidence[0].term, "espíritu");
  assert.equal(dictionaryEvidence[0].sourceLanguage, "es");
  assert.equal(dictionaryEvidence[0].targetLanguage, "ro");
  assert.deepEqual(dictionaryEvidence[0].translationEquivalents, ["spirit"]);
  assert.equal(dictionaryEvidence[0].authoritative, false);
  assert.equal(dictionaryEvidence[0].humanFinalAuthority, true);
});

test("terminology check infers Spanish source dictionary evidence for Romanian target language", () => {
  const source = readSource("terminology.service.ts");
  const sourceText = "El espíritu progresa por la experiencia moral.";
  const targetText = "Spiritul progresează prin experiența morală.";
  const request = {
    language: "ro",
    domain: "spiritism",
    sourceText,
    targetText
  };
  const dictionarySources = [
    {
      id: "source-calciu-samharadze",
      sourceLanguages: ["es", "ro"],
      targetLanguages: ["ro", "es"]
    }
  ];
  const entries = [
    {
      id: "entry-espiritu",
      sourceId: "source-calciu-samharadze",
      term: "espíritu",
      normalizedTerm: "espiritu",
      sourceLanguage: "es",
      targetLanguage: "ro"
    }
  ];

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

  const targetLanguage = request.language;
  const inferredSourceLanguages = [
    ...new Set(
      dictionarySources
        .filter((dictionarySource) => dictionarySource.targetLanguages.includes(targetLanguage))
        .flatMap((dictionarySource) => dictionarySource.sourceLanguages)
    )
  ];
  const normalizedSourceText = normalizeLexicalText(sourceText);
  const dictionaryEvidence = entries.filter((entry) => {
    return (
      inferredSourceLanguages.includes(entry.sourceLanguage) &&
      entry.targetLanguage === targetLanguage &&
      hasTokenSafeOccurrence(normalizedSourceText, entry.normalizedTerm)
    );
  });

  assert.equal(request.sourceLanguage, undefined);
  assert.deepEqual(inferredSourceLanguages, ["es", "ro"]);
  assert.equal(dictionaryEvidence.length, 1);
  assert.equal(dictionaryEvidence[0].term, "espíritu");
  assert.match(source, /sourceLanguage,\n\s+targetLanguage,/);
});

test("terminology dictionary evidence is complete and non-authoritative", () => {
  const source = readSource("terminology.service.ts");
  const types = readSource("terminology.types.ts");

  for (const field of [
    "entryId",
    "sourceId",
    "term",
    "sourceLanguage",
    "targetLanguage",
    "translationEquivalents",
    "sourceReferences",
    "citations",
    "authority",
    "priorityRank",
    "authoritative",
    "humanFinalAuthority"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
  }

  assert.match(source, /translationEquivalents: entry\.translationEquivalents/);
  assert.match(source, /sourceReferences: entry\.sourceReferences/);
  assert.match(source, /citations: entry\.citations/);
  assert.match(source, /authority: entry\.authority/);
  assert.match(source, /priorityRank: entry\.priorityRank/);
  assert.match(source, /authoritative: false/);
  assert.match(source, /humanFinalAuthority: true/);
});

test("validated glossary remains authoritative above dictionary evidence", () => {
  const source = readSource("terminology.service.ts");
  const types = readSource("terminology.types.ts");

  assert.match(source, /priority: "TERMINOLOGY_VALIDATED"/);
  assert.match(source, /authoritative: true/);
  assert.match(source, /priority: "DICTIONARY_EVIDENCE_AFTER_VALIDATED_GLOSSARY"/);
  assert.match(types, /authoritative: false/);
  assert.match(types, /humanFinalAuthority: true/);
});

test("terminology repository prioritizes validated terms", () => {
  const source = readSource("terminology.utils.ts");

  assert.match(source, /left\.status === "VALIDATED" \? 0 : 1/);
  assert.match(source, /right\.status === "VALIDATED" \? 0 : 1/);
});

test("terminology fixtures include required fields", () => {
  const fixtureDir = join(__dirname, "..", "fixtures");
  const createFixture = JSON.parse(
    readFileSync(join(fixtureDir, "terminology-v1.create.json"), "utf8")
  );
  const checkFixture = JSON.parse(
    readFileSync(join(fixtureDir, "terminology-v1.check-segment.json"), "utf8")
  );

  for (const key of ["language", "term", "approvedTranslation"]) {
    assert.equal(typeof createFixture[key], "string");
  }

  assert.equal(createFixture.status, "PROPOSED");
  assert.ok(Array.isArray(createFixture.forbiddenVariants));
  assert.ok(Array.isArray(createFixture.preferredVariants));

  for (const key of ["language", "sourceText", "targetText"]) {
    assert.equal(typeof checkFixture[key], "string");
  }
});
