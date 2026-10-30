import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const legacyName = "0006_terminology_governance_v2.sql";
export const legacy0006Sha256 = "88daf21e943681ef86c153ee05d3ce46e13e494337b5fbe579e211c65c7ada6a";
const legacyIndex = `CREATE INDEX IF NOT EXISTS qa_issues_terminology_blockers_idx
  ON qa_issues (organization_id, document_id, segment_id, status, severity, type)
  WHERE type::text IN (
    'TERMINOLOGY_VIOLATION',
    'FORBIDDEN_TERMINOLOGY_VARIANT',
    'TERMINOLOGY_DIACRITICS',
    'REJECTED_TERMINOLOGY'
  );`;
const repairedIndex = `-- Explicit fresh/pending-only repair: equivalent lookup coverage without
-- an enum-to-text predicate or use of new enum values before COMMIT.
CREATE INDEX IF NOT EXISTS qa_issues_terminology_blockers_idx
  ON qa_issues (organization_id, document_id, segment_id, status, severity, type);`;
const sha256 = (sql) => createHash("sha256").update(sql).digest("hex");

/** Never mutates an archived migration or executes SQL. Record both hashes. */
export function prepareMigrationSource(name, source, { confirmedPending = false } = {}) {
  if (!/^\d{4}_[a-z0-9_]+\.sql$/u.test(name)) throw new Error("INVALID_MIGRATION_NAME");
  const originalSha256 = sha256(source);
  let sql = source;
  let repairId;
  if (name === legacyName) {
    if (!confirmedPending) throw new Error("MIGRATION_0006_REQUIRES_EXPLICIT_PENDING_CONFIRMATION");
    if (originalSha256 !== legacy0006Sha256 || source.split(legacyIndex).length !== 2) {
      throw new Error("MIGRATION_0006_SOURCE_CHECKSUM_MISMATCH");
    }
    sql = source.replace(legacyIndex, repairedIndex);
    repairId = "0006-qa-index-fresh-v1";
  }
  return { name, originalSha256, effectiveSha256: sha256(sql), repairId, sql };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length < 1 || args.length > 2 || (args[1] && args[1] !== "--confirmed-pending")) {
    throw new Error("Usage: prepare-migration-source.mjs MIGRATION_PATH [--confirmed-pending]");
  }
  const file = resolve(args[0]);
  const result = prepareMigrationSource(basename(file), readFileSync(file, "utf8"), { confirmedPending: args[1] === "--confirmed-pending" });
  const { sql, ...evidence } = result;
  process.stderr.write(`${JSON.stringify(evidence)}\n`);
  process.stdout.write(sql);
}
