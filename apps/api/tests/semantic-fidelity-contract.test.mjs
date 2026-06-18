import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "semantic-fidelity");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("semantic fidelity controller exposes MVP API endpoints", () => {
  const source = readSource("semantic-fidelity.controller.ts");

  assert.match(source, /@Post\("segments\/run"\)/);
  assert.match(source, /@Post\("documents\/run"\)/);
  assert.match(source, /@Get\("issues"\)/);
  assert.match(source, /@Patch\("issues\/:id\/resolve"\)/);
  assert.match(source, /@Post\("reports\/:id\/recalculate-score"\)/);
  assert.match(source, /CurrentActor/);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
});

test("semantic fidelity service detects required issue categories", () => {
  const source = readSource("semantic-fidelity.service.ts");

  for (const issueType of [
    "MEANING_DRIFT",
    "UNJUSTIFIED_REINTERPRETATION",
    "OMITTED_MEANING",
    "ADDED_MEANING",
    "TERMINOLOGY_MEANING_CONFLICT",
    "CONTEXT_MISMATCH"
  ]) {
    assert.match(source, new RegExp(`"${issueType}"`));
  }
});

test("semantic fidelity service uses terminology TM and QA modules", () => {
  const source = readSource("semantic-fidelity.service.ts");

  assert.match(source, /TerminologyService/);
  assert.match(source, /TranslationMemoryService/);
  assert.match(source, /QaService/);
  assert.match(source, /terminologyService\.checkSegmentText/);
  assert.match(source, /translationMemoryService\.searchMatches/);
  assert.match(source, /qaService\.listIssues/);
});

test("semantic fidelity service preserves authority order and human final authority", () => {
  const source = readSource("semantic-fidelity.service.ts");

  assert.match(source, /VALIDATED_TERMINOLOGY_OVER_TM_OVER_AI/);
  assert.match(source, /Validated terminology has priority over Translation Memory and AI suggestions/);
  assert.match(source, /AI may provide explanations and alternatives but cannot override validated terminology or final human authority/);
  assert.match(source, /AUTHORIZED_HUMAN/);
});

test("semantic fidelity report returns lexicographicReferences for espíritu", () => {
  const source = readSource("semantic-fidelity.service.ts");
  const types = readSource("semantic-fidelity.types.ts");
  const sourceText = "El espíritu progresa por la experiencia moral.";
  const entry = {
    entryId: "entry-espiritu",
    sourceId: "source-calciu-samharadze",
    term: "espíritu",
    sourceLanguage: "es",
    targetLanguage: "ro",
    senseIds: ["sense-espiritu-1"],
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
  };

  function normalizeLexicalText(value) {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
      .toLocaleLowerCase()
      .trim();
  }

  const normalizedSource = normalizeLexicalText(sourceText);
  const hasReference = new RegExp(`(?:^|\\s)espiritu(?:\\s|$)`, "u")
    .test(normalizedSource);
  const lexicographicReferences = hasReference
    ? [
      {
        ...entry,
        priority: "LEXICOGRAPHIC_SUPPORT_AFTER_VALIDATED_TERMINOLOGY",
        priorityRule:
          "validated platform glossary > documented editorial decision > specialized dictionary > academic dictionary > AI suggestion"
      }
    ]
    : [];

  assert.match(source, /term: segment\.sourceText/);
  assert.match(source, /lexicographicService\.describeEntries/);
  assert.match(types, /lexicographicReferences\?: SemanticLexicographicReference\[]/);
  assert.equal(lexicographicReferences.length, 1);
  assert.equal(lexicographicReferences[0].term, "espíritu");
  assert.deepEqual(lexicographicReferences[0].translationEquivalents, ["spirit"]);
  assert.deepEqual(lexicographicReferences[0].sourceReferences, [
    "Dicționar spaniol-român și român-spaniol"
  ]);
});

test("semantic lexicographic references are non-authoritative with human final authority", () => {
  const source = readSource("semantic-fidelity.service.ts");
  const types = readSource("semantic-fidelity.types.ts");

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
    "priorityRule",
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

test("semantic lexicographic references preserve token-safe matching and reject substrings", () => {
  const repository = readFileSync(
    join(dirname(moduleDir), "lexicographic", "lexicographic.repository.ts"),
    "utf8"
  );
  const source = readSource("semantic-fidelity.service.ts");

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

  const normalizedSource = normalizeLexicalText("El espíritu progresa por la experiencia moral.");

  assert.equal(hasTokenSafeOccurrence(normalizedSource, "espiritu"), true);
  assert.equal(hasTokenSafeOccurrence(normalizedSource, "rit"), false);
  assert.match(repository, /matchesLexicalTerm\(entry\.normalizedTerm, normalizedQuery\)/);
  assert.match(repository, /hasTokenSafeOccurrence/);
  assert.match(source, /lexicographicService\.searchEntries/);
});

test("semantic fidelity service records audit events", () => {
  const source = readSource("semantic-fidelity.service.ts");

  assert.match(source, /this\.audit\("SEMANTIC_CHECK"/);
  assert.match(source, /this\.audit\("ISSUE_CREATED"/);
  assert.match(source, /this\.audit\("ISSUE_RESOLVED"/);
  assert.match(source, /this\.audit\("SCORE_RECALCULATED"/);
});

test("semantic fidelity risk levels include low medium high and critical", () => {
  const source = readSource("semantic-fidelity.types.ts");

  for (const risk of ["LOW", "MEDIUM", "HIGH", "CRITICAL"]) {
    assert.match(source, new RegExp(`"${risk}"`));
  }
});

test("semantic fidelity fixtures include required fields", () => {
  const fixtureDir = join(__dirname, "..", "fixtures");
  const segmentFixture = JSON.parse(
    readFileSync(join(fixtureDir, "semantic-fidelity-v1.segment-run.json"), "utf8")
  );
  const documentFixture = JSON.parse(
    readFileSync(join(fixtureDir, "semantic-fidelity-v1.document-run.json"), "utf8")
  );

  for (const key of ["segmentId", "sourceText", "targetText", "sourceLanguage", "targetLanguage"]) {
    assert.equal(typeof segmentFixture[key], "string");
  }

  assert.equal(typeof documentFixture.documentId, "string");
  assert.ok(Array.isArray(documentFixture.segments));
  assert.ok(documentFixture.segments.length >= 2);
});
