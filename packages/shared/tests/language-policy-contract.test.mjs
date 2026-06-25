import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "..", "src", "language-policy.ts"), "utf8");
const jsonTypes = readFileSync(join(__dirname, "..", "src", "json-master-format", "types.ts"), "utf8");
const jsonSchema = readFileSync(join(__dirname, "..", "src", "json-master-format", "schema.ts"), "utf8");

test("language policy defines supported assisted translation targets for v1.0", () => {
  for (const value of [
    "Romanian",
    "en-US",
    "en-GB",
    "en-CA",
    "en-AU",
    "fr-FR",
    "fr-CA",
    "es-ES",
    "es-MX",
    "es-AR",
    "it-IT",
    "pt-PT",
    "pt-BR",
    "de-DE",
    "de-AT",
    "de-CH"
  ]) {
    assert.match(source, new RegExp(value));
  }

  assert.match(source, /SUPPORTED_TRANSLATION_TARGETS_V1/);
  assert.match(source, /validateTranslationTargetV1/);
  assert.match(source, /formatLanguageLocale/);
  assert.match(source, /English/);
});

test("language policy keeps manuscript ISO language validation separate from translation target validation", () => {
  assert.match(source, /validateIsoCompatibleLanguageTag/);
  assert.match(source, /Target language is not supported for assisted translation v1\.0/);
  assert.match(source, /Target locale is required/);
  assert.match(source, /normalizeLanguageLocale/);
  assert.doesNotMatch(source, /SUPPORTED_AUTHORING_LANGUAGES|AUTHORING_LANGUAGE_ALLOWLIST/);
});

test("JSON Master exposes separate original authoring and target language metadata", () => {
  for (const field of [
    "originalLanguage",
    "originalLocale",
    "authoringLanguage",
    "authoringLocale",
    "targetLanguage",
    "targetLocale",
    "targetLocales"
  ]) {
    assert.match(jsonTypes, new RegExp(field));
    assert.match(jsonSchema, new RegExp(field));
  }
});
