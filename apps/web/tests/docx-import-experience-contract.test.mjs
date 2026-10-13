import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const webRoot = join(testDirectory, "..");
const readSource = (path) => readFileSync(join(webRoot, path), "utf8");

test("documents workspace exposes secure DOCX import and canonical document detail", () => {
  const page = readSource("components/pages/documents-page.tsx");
  const actions = readSource("lib/documents-actions.ts");
  const client = readSource("lib/projects-documents-api.ts");
  const detail = readSource("components/pages/document-detail-page.tsx");

  assert.match(page, /accept="\.docx,/);
  assert.match(page, /importDocxAction/);
  assert.match(actions, /importDocxDocument/);
  assert.match(client, /documents\/import-docx/);
  assert.match(client, /apiPostForm/);
  assert.match(detail, /ui\.t\("canonicalSegments"\)/);
  assert.match(detail, /ui\.t\("unsupportedDocx"\)/);
  assert.match(detail, /createDocumentSegmentAction/);
});
