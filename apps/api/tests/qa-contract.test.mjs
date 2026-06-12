import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "qa");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("qa controller exposes MVP API endpoints", () => {
  const source = readSource("qa.controller.ts");

  assert.match(source, /@Post\("segments\/run"\)/);
  assert.match(source, /@Post\("documents\/run"\)/);
  assert.match(source, /@Get\("issues"\)/);
  assert.match(source, /@Patch\("issues\/:id\/resolve"\)/);
  assert.match(source, /@Post\("reports\/:id\/recalculate-score"\)/);
  assert.match(source, /CurrentActor/);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
});

test("qa service includes all required checks", () => {
  const source = readSource("qa.service.ts");

  for (const check of [
    "MISSING_TARGET_TRANSLATION",
    "UNTRANSLATED_SEGMENT",
    "NUMBER_MISMATCH",
    "DATE_MISMATCH",
    "PUNCTUATION_MISMATCH",
    "REPEATED_SEGMENT",
    "TERMINOLOGY_VIOLATION",
    "FORBIDDEN_TERMINOLOGY_VARIANT",
    "EMPTY_TRANSLATION",
    "TOO_SHORT_TRANSLATION"
  ]) {
    assert.match(source, new RegExp(`"${check}"`));
  }
});

test("qa service respects validated terminology priority over TM and AI", () => {
  const source = readSource("qa.service.ts");

  assert.match(source, /terminologyService\.checkSegmentText/);
  assert.match(source, /Validated terminology has priority over Translation Memory and AI suggestions/);
  assert.match(source, /TERMINOLOGY_VALIDATED/);
});

test("qa service records audit events for run issue creation resolution and score recalculation", () => {
  const source = readSource("qa.service.ts");

  assert.match(source, /this\.audit\("QA_RUN"/);
  assert.match(source, /this\.audit\("ISSUE_CREATED"/);
  assert.match(source, /this\.audit\("ISSUE_RESOLVED"/);
  assert.match(source, /this\.audit\("SCORE_RECALCULATED"/);
});

test("qa severities include low medium high and critical", () => {
  const source = readSource("qa.types.ts");

  for (const severity of ["LOW", "MEDIUM", "HIGH", "CRITICAL"]) {
    assert.match(source, new RegExp(`"${severity}"`));
  }
});

test("qa fixtures include required segment and document fields", () => {
  const fixtureDir = join(__dirname, "..", "fixtures");
  const segmentFixture = JSON.parse(readFileSync(join(fixtureDir, "qa-v1.segment-run.json"), "utf8"));
  const documentFixture = JSON.parse(readFileSync(join(fixtureDir, "qa-v1.document-run.json"), "utf8"));

  for (const key of ["segmentId", "sourceText", "targetLanguage"]) {
    assert.equal(typeof segmentFixture[key], "string");
  }

  assert.equal(typeof documentFixture.documentId, "string");
  assert.ok(Array.isArray(documentFixture.segments));
  assert.ok(documentFixture.segments.length >= 2);
});
