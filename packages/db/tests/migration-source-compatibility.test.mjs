import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { prepareMigrationSource, legacy0006Sha256 } from "../scripts/prepare-migration-source.mjs";

const name = "0006_terminology_governance_v2.sql";
const source = readFileSync(new URL(`../migrations/${name}`, import.meta.url), "utf8");
test("historical 0006 bytes remain frozen and require explicit pending-only repair authorization", () => {
  assert.equal(createHash("sha256").update(source).digest("hex"), legacy0006Sha256);
  assert.throws(() => prepareMigrationSource(name, source), /EXPLICIT_PENDING_CONFIRMATION/u);
  assert.throws(() => prepareMigrationSource(name, `${source}\n`, { confirmedPending: true }), /CHECKSUM_MISMATCH/u);
});
test("fresh/pending 0006 repair changes only index coverage, retaining all data, enum and security statements", () => {
  const result = prepareMigrationSource(name, source, { confirmedPending: true });
  assert.equal(result.originalSha256, legacy0006Sha256);
  assert.notEqual(result.originalSha256, result.effectiveSha256);
  assert.equal(result.repairId, "0006-qa-index-fresh-v1");
  assert.equal(result.sql.split("CREATE INDEX IF NOT EXISTS qa_issues_terminology_blockers_idx").length, 2);
  const start = source.indexOf("CREATE INDEX IF NOT EXISTS qa_issues_terminology_blockers_idx");
  assert.ok(result.sql.startsWith(source.slice(0, start)));
  assert.doesNotMatch(result.sql.slice(start), /WHERE type::text|IMMUTABLE|DROP|DISABLE/u);
  const unchanged = prepareMigrationSource("0014_ai_financial_foundation_v1.sql", "SELECT 1;");
  assert.equal(unchanged.originalSha256, unchanged.effectiveSha256);
  assert.equal(unchanged.repairId, undefined);
});
