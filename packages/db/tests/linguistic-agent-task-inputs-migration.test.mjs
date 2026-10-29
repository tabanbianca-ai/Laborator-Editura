import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("linguistic task migration is additive and retains immutable identity and tenant-scoped segment references", () => {
  const sql = readFileSync(new URL("../migrations/0013_linguistic_agent_task_inputs_v1.sql", import.meta.url), "utf8");
  const index = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
  assert.match(index, /0013_linguistic_agent_task_inputs_v1.sql/u);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS segment_id uuid/u);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS explicit_external_processing_authorization boolean/u);
  assert.match(sql, /segment_id IS NULL OR/u);
  assert.match(sql, /resource IS NOT NULL/u);
  assert.match(sql, /FOREIGN KEY \(organization_id, project_id, document_id, segment_id\)/u);
  assert.match(sql, /REFERENCES document_segments \(organization_id, project_id, document_id, id\)/u);
  assert.doesNotMatch(sql, /\b(DROP|DELETE|TRUNCATE|UPDATE|DISABLE)\b/u);
});
