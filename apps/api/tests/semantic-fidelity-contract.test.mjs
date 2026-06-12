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
