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

test("terminology governance v2 exposes approved backend endpoints", () => {
  const source = readSource("terminology.controller.ts");

  assert.match(source, /@Post\("terms\/propose"\)/);
  assert.match(source, /@Post\("terms\/:id\/evaluate"\)/);
  assert.match(source, /@Post\("terms\/:id\/under-review"\)/);
  assert.match(source, /@Post\("terms\/:id\/reject"\)/);
  assert.match(source, /@Get\("terms\/requiring-review"\)/);
  assert.match(source, /CurrentActor/);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
  assert.doesNotMatch(source, /x-user-roles/);
});

test("terminology governance v2 prevents automatic validated terminology", () => {
  const source = readSource("terminology.service.ts");

  assert.match(source, /New terminology entries must start as PROPOSED/);
  assert.match(source, /this\.assertAuthorizedHuman\(actor\)/);
  assert.match(source, /Terminology cannot be validated while orthographic or diacritics validation fails/);
  assert.match(source, /Terminology cannot be validated without an approved source or reference source/);
  assert.doesNotMatch(source, /auto-promote/i);
});

test("terminology governance v2 evaluates Romanian orthography diacritics and sources", () => {
  const source = readSource("terminology-governance.utils.ts");

  assert.match(source, /validateRomanianDiacritics/);
  assert.match(source, /validateRomanianOrthography/);
  assert.match(source, /sourceValidationStatusFor/);
  assert.match(source, /qualityLevelForScore/);
  assert.match(source, /TRUSTED/);
  assert.match(source, /ACCEPTABLE/);
  assert.match(source, /REVIEW_REQUIRED/);
  assert.match(source, /REJECTED/);
});

test("terminology governance v2 records audit actions", () => {
  const source = readSource("terminology.service.ts");
  const types = readSource("terminology.types.ts");

  for (const action of ["EVALUATE", "MARK_UNDER_REVIEW", "VALIDATE", "REJECT", "SUSPEND", "ARCHIVE"]) {
    assert.match(types, new RegExp(`"${action}"`));
  }

  assert.match(source, /this\.audit\("EVALUATE"/);
  assert.match(source, /"MARK_UNDER_REVIEW"/);
  assert.match(source, /this\.audit\("VALIDATE"/);
  assert.match(source, /this\.audit\("REJECT"/);
});

test("terminology governance v2 fixtures include quality validation signals", () => {
  const fixtureDir = join(__dirname, "..", "fixtures");
  const proposeFixture = JSON.parse(
    readFileSync(join(fixtureDir, "terminology-governance-v2.propose.json"), "utf8")
  );
  const evaluateFixture = JSON.parse(
    readFileSync(join(fixtureDir, "terminology-governance-v2.evaluate.json"), "utf8")
  );

  assert.equal(proposeFixture.status, "PROPOSED");
  assert.equal(proposeFixture.language, "ro");
  assert.ok(Array.isArray(proposeFixture.referenceSources));
  assert.equal(typeof proposeFixture.glossaryPresent, "boolean");
  assert.equal(typeof evaluateFixture.termId, "string");
});
