import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

test("projects include a controlled Editorial Domain taxonomy", () => {
  const types = readSource("src/modules/projects/projects.types.ts");
  const service = readSource("src/modules/projects/projects.service.ts");

  for (const value of [
    "LITERATURE",
    "PHILOSOPHY",
    "SPIRITISM",
    "RELIGION",
    "PSYCHOLOGY",
    "EDUCATION",
    "HISTORY",
    "SCIENCE",
    "BIOLOGY",
    "MATHEMATICS",
    "MEDICINE",
    "ART",
    "MUSIC",
    "LINGUISTICS",
    "LAW",
    "ECONOMICS",
    "TECHNOLOGY",
    "CHILDREN_EDUCATIONAL",
    "OTHER"
  ]) {
    assert.match(types, new RegExp(`"${value}"`));
    assert.match(service, new RegExp(`"${value}"`));
  }

  assert.match(types, /ProjectEditorialDomain/);
  assert.match(types, /editorialDomain: ProjectEditorialDomain/);
  assert.match(service, /PROJECT_EDITORIAL_DOMAINS/);
  assert.match(service, /Unsupported editorial domain/);
});

test("editorial classification is optional and does not change Publication Type", () => {
  const types = readSource("src/modules/projects/projects.types.ts");
  const service = readSource("src/modules/projects/projects.service.ts");

  assert.match(types, /ProjectEditorialClassification/);
  assert.match(types, /series\?: string/);
  assert.match(types, /collection\?: string/);
  assert.match(types, /volume\?: string/);
  assert.match(service, /normalizeEditorialClassification/);
  assert.match(service, /classification\?\.series/);
  assert.match(service, /classification\?\.collection/);
  assert.match(service, /classification\?\.volume/);
  assert.match(service, /const editorialClassification = this\.normalizeEditorialClassification/);
});

test("editorial taxonomy is persisted into project metadata for downstream surfaces", () => {
  const service = readSource("src/modules/projects/projects.service.ts");
  const exportService = readSource("src/modules/export/export.service.ts");

  assert.match(service, /editorialDomain,/);
  assert.match(service, /editorialClassification,/);
  assert.match(service, /domain: input\.domain \?\? editorialDomain/);
  assert.match(service, /return "OTHER"/);
  assert.match(exportService, /metadata: project\.metadata/);
});
