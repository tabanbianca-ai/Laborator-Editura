import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { isAbsolute } from "node:path";
import test from "node:test";
import { prepareMigrationSource } from "../scripts/prepare-migration-source.mjs";

const adminUrl = process.env.LABORATOR_FINANCIAL_TEST_ADMIN_URL;
const pgModule = process.env.LABORATOR_FINANCIAL_TEST_PG_MODULE;

test("real PostgreSQL: complete historical migrations and financial upgrade preserve existing organization", {
  skip: adminUrl && pgModule ? false : "Requires an explicitly disposable local PostgreSQL cluster and external test-only pg driver.",
  timeout: 120000
}, async (t) => {
  const url = new URL(adminUrl);
  assert.ok(["postgres:", "postgresql:"].includes(url.protocol));
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname));
  assert.match(url.pathname, /^\/(postgres|laborator_financial_test[a-z0-9_]*)$/u);
  assert.ok(isAbsolute(pgModule), "Driver must be an explicit test-only installation path");
  const { Client } = createRequire(import.meta.url)(pgModule);
  const database = `laborator_financial_test_history_${randomUUID().replaceAll("-", "")}`;
  const control = new Client({ connectionString: adminUrl });
  await control.connect();
  try { await control.query(`CREATE DATABASE "${database}"`); }
  finally { await control.end(); }
  url.pathname = `/${database}`;
  const client = new Client({ connectionString: url.toString() });
  await client.connect();
  const directory = new URL("../migrations/", import.meta.url);
  const files = readdirSync(directory).filter((file) => /^\d{4}_.*\.sql$/u.test(file) && file <= "0015_qa_blocker_index_compatibility_v1.sql").sort();
  try {
    for (const file of files) {
      await client.query("BEGIN");
      try {
        // This database was created above and every previous migration committed;
        // 0006 is provably pending, never an already-applied historical version.
        const prepared = prepareMigrationSource(file, readFileSync(new URL(file, directory), "utf8"), { confirmedPending: true });
        if (prepared.repairId) t.diagnostic(JSON.stringify({ migration: file, repairId: prepared.repairId,
          originalSha256: prepared.originalSha256, effectiveSha256: prepared.effectiveSha256 }));
        await client.query(prepared.sql);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Historical migration ${file} failed [${error.code}]: ${error.message}`);
      }
      if (file.startsWith("0013_")) {
        await client.query("INSERT INTO organizations (id,name) VALUES ('00000000-0000-0000-0000-000000000001','Isolated upgrade sentinel')");
      }
    }
    const before = (await client.query("SELECT name FROM organizations WHERE id='00000000-0000-0000-0000-000000000001'")).rows;
    assert.equal(before[0]?.name, "Isolated upgrade sentinel");
    const tables = (await client.query("SELECT count(*)::integer AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relrowsecurity AND c.relforcerowsecurity AND c.relname IN ('financial_operation','ai_provider_tariff','ai_budget_account','ai_cost_reservation','ai_budget_allocation','ai_provider_attempt','ai_financial_reconciliation_event','financial_journal','financial_ledger_entry')")).rows;
    assert.equal(tables[0].count, 9);
    const indexBefore = (await client.query("SELECT 'qa_issues_terminology_blockers_idx'::regclass::oid AS id")).rows[0].id;
    await client.query(readFileSync(new URL("0015_qa_blocker_index_compatibility_v1.sql", directory), "utf8"));
    const indexAfter = (await client.query("SELECT 'qa_issues_terminology_blockers_idx'::regclass::oid AS id")).rows[0].id;
    assert.equal(indexAfter, indexBefore, "Forward repair must preserve an existing valid index");
  } finally { await client.end(); }
});
