import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = join(__dirname, "..", "fixtures");

function readFixture(name) {
  return JSON.parse(readFileSync(join(fixtureDir, name), "utf8"));
}

function validateContract(value) {
  const issues = [];
  const requiredTopLevel = [
    "formatVersion",
    "project",
    "documents",
    "terminology",
    "translationMemory",
    "qa",
    "workflow",
    "audit",
    "versionHistory"
  ];

  for (const key of requiredTopLevel) {
    if (!(key in value)) {
      issues.push(`${key} is required`);
    }
  }

  if (value.formatVersion !== "1.0") {
    issues.push("formatVersion must be 1.0");
  }

  if (!value.project || typeof value.project.id !== "string" || value.project.id.length === 0) {
    issues.push("project.id must be a non-empty string");
  }

  if (!Array.isArray(value.project?.targetLanguages)) {
    issues.push("project.targetLanguages must be an array");
  }

  if (!Array.isArray(value.documents)) {
    issues.push("documents must be an array");
  } else {
    for (const [documentIndex, document] of value.documents.entries()) {
      if (!Array.isArray(document.segments)) {
        issues.push(`documents[${documentIndex}].segments must be an array`);
        continue;
      }

      for (const [segmentIndex, segment] of document.segments.entries()) {
        if (!Number.isInteger(segment.order) || segment.order < 0) {
          issues.push(`documents[${documentIndex}].segments[${segmentIndex}].order is invalid`);
        }

        if (typeof segment.source?.text !== "string") {
          issues.push(`documents[${documentIndex}].segments[${segmentIndex}].source.text is required`);
        }
      }
    }
  }

  if (typeof value.qa?.scores?.overall === "number" && value.qa.scores.overall > 100) {
    issues.push("qa.scores.overall must be <= 100");
  }

  return issues;
}

test("minimal JSON Master Format v1 fixture follows the MVP contract", () => {
  const fixture = readFixture("json-master-format-v1.minimal.json");
  assert.deepEqual(validateContract(fixture), []);
});

test("JSON Master Format v1 supports layout and publication production fields", () => {
  const types = readFileSync(
    join(__dirname, "..", "src", "json-master-format", "types.ts"),
    "utf8"
  );
  const schema = readFileSync(
    join(__dirname, "..", "src", "json-master-format", "schema.ts"),
    "utf8"
  );
  const validation = readFileSync(
    join(__dirname, "..", "src", "json-master-format", "validation.ts"),
    "utf8"
  );

  for (const field of [
    "layout",
    "pageTemplates",
    "printProfiles",
    "illustrations",
    "audioTracks",
    "videoAssets",
    "publicationProfiles"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
    assert.match(schema, new RegExp(`${field}:`));
  }

  assert.match(validation, /value\.layout/);

  for (const field of [
    "pageTemplates",
    "printProfiles",
    "illustrations",
    "audioTracks",
    "videoAssets",
    "publicationProfiles"
  ]) {
    assert.match(validation, new RegExp(`"${field}"`));
  }

  assert.match(types, /JsonMasterPublicationProfile/);
  assert.match(types, /humanApprovalRequired: true/);
  assert.match(schema, /pending_human_approval/);
  assert.match(schema, /print_on_demand/);
});

test("invalid JSON Master Format v1 fixture fails the MVP contract", () => {
  const fixture = readFixture("json-master-format-v1.invalid.json");
  assert.match(validateContract(fixture).join("\n"), /formatVersion must be 1\.0/);
});
