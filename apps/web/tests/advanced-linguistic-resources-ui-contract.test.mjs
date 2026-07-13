import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("translation workspace consumes TM proposals and linguistic explanations", () => {
  const client = readSource("lib/translation-workspace-client.ts");
  const page = readSource("components/pages/translation-workspace-page.tsx");

  assert.match(client, /TranslationMemoryProposal/);
  assert.match(client, /\/translation-memory\/proposals/);
  assert.match(client, /proposalExplanation/);
  assert.match(client, /sourcePriority/);
  assert.match(page, /Translation Memory proposals/);
  assert.match(page, /proposal only/);
  assert.match(page, /Glossary priority/);
  assert.match(page, /Glossary conflict/);
  assert.match(page, /Confidence/);
});

test("administration displays advanced linguistic resource governance", () => {
  const page = readSource("components/pages/administration-page.tsx");

  assert.match(page, /advancedLinguisticResources/);
  assert.match(page, /Official normative source/);
  assert.match(page, /Project glossary/);
  assert.match(page, /Translation Memory/);
  assert.match(page, /Bilingual dictionary/);
  assert.match(page, /Explanatory dictionary/);
  assert.match(page, /Corpus\/examples/);
  assert.match(page, /Project Glossary/);
  assert.match(page, /Platform Glossary/);
  assert.match(page, /Personal Glossary suggestions/);
  assert.match(page, /GLOSSARY_CONFLICT/);
  assert.match(page, /TRANSLATION_MEMORY_REUSED/);
  assert.match(page, /CONFIDENCE_RECALCULATED/);
});
