import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sql = readFileSync(new URL("../migrations/0012_local_agent_handler_resources_v1.sql", import.meta.url), "utf8");
test("resource migration accepts legacy document tasks and requires complete, matching new resource references", () => {
  assert.match(sql, /ALTER COLUMN document_id DROP NOT NULL/u);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS resource jsonb/u);
  assert.match(sql, /resource IS NULL AND document_id IS NOT NULL/u);
  assert.match(sql, /resource \?& ARRAY\['type', 'id'\]/u);
  assert.match(sql, /jsonb_typeof\(resource->'id'\) = 'string'/u);
  assert.match(sql, /resource->>'id' = document_id::text/u);
  assert.match(sql, /resource->>'type' <> 'DOCUMENT' AND document_id IS NULL/u);
  assert.doesNotMatch(sql, /DELETE FROM|TRUNCATE|DROP TABLE|DISABLE TRIGGER|DROP POLICY/iu);
});
