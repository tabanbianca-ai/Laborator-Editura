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
