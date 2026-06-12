import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "translation-memory");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("translation memory controller exposes MVP API endpoints", () => {
  const source = readSource("translation-memory.controller.ts");

  assert.match(source, /@Post\(\)/);
  assert.match(source, /@Get\("search"\)/);
  assert.match(source, /@Post\(":id\/approve"\)/);
  assert.match(source, /@Get\(\)/);
  assert.match(source, /CurrentActor/);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
});

test("translation memory service only returns approved authoritative matches", () => {
  const source = readSource("translation-memory.service.ts");

  assert.match(source, /entry\.approvalStatus === "APPROVED"/);
  assert.match(source, /authoritative: true/);
});

test("translation memory service prevents AI from approving memory entries", () => {
  const source = readSource("translation-memory.service.ts");

  assert.match(source, /origin === "AI" && approvalStatus === "APPROVED"/);
  assert.match(source, /existing\.origin === "AI"/);
  assert.match(source, /AI suggestions cannot be approved directly into TM/);
});

test("translation memory service writes audit events for create update and approve", () => {
  const source = readSource("translation-memory.service.ts");

  assert.match(source, /this\.audit\("CREATE"/);
  assert.match(source, /this\.audit\("UPDATE"/);
  assert.match(source, /this\.audit\("APPROVE"/);
});

test("translation memory fixtures include required create and search fields", () => {
  const fixtureDir = join(__dirname, "..", "fixtures");
  const createFixture = JSON.parse(
    readFileSync(join(fixtureDir, "translation-memory-v1.create.json"), "utf8")
  );
  const searchFixture = JSON.parse(
    readFileSync(join(fixtureDir, "translation-memory-v1.search.json"), "utf8")
  );

  for (const key of ["sourceText", "targetText", "sourceLanguage", "targetLanguage"]) {
    assert.equal(typeof createFixture[key], "string");
  }

  for (const key of ["sourceText", "sourceLanguage", "targetLanguage"]) {
    assert.equal(typeof searchFixture[key], "string");
  }
});
