import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import test from "node:test";

export function financialFixtureSql(schema, { rollback = true } = {}) {
  assert.match(schema, /^financial_test_[a-f0-9]+$/u);
  const migration = readFileSync(new URL("../migrations/0014_ai_financial_foundation_v1.sql", import.meta.url), "utf8");
  const id = (value) => `'00000000-0000-0000-0000-${String(value).padStart(12, "0")}'`;
  const hash = `'${"a".repeat(64)}'`;
  const operation = (value, kind, key) => `INSERT INTO financial_operation
    (id,organization_id,owner,operation_kind,idempotency_key,request_sha256,correlation_id,actor_id,source_reference)
    VALUES (${id(value)},${id(1)},'AI_GOVERNANCE','${kind}','${key}',${hash},${id(30)},${id(3)},'fixture');`;
  const sql = `BEGIN ISOLATION LEVEL SERIALIZABLE;
    DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND (rolsuper OR rolbypassrls))
      THEN RAISE EXCEPTION 'Use a non-superuser test role without BYPASSRLS'; END IF; END $$;
    CREATE SCHEMA ${schema};
    SET LOCAL search_path = ${schema}, public;
    CREATE TABLE organizations(id uuid PRIMARY KEY);
    CREATE TABLE users(id uuid PRIMARY KEY);
    CREATE TABLE projects(id uuid PRIMARY KEY, organization_id uuid NOT NULL);
    CREATE TABLE ai_agent_registry(id uuid PRIMARY KEY, organization_id uuid NOT NULL, UNIQUE(organization_id,id));
    CREATE TABLE ai_execution_records(id uuid PRIMARY KEY,organization_id uuid NOT NULL,project_id uuid NOT NULL,agent_id uuid NOT NULL);
    CREATE FUNCTION workflow_current_organization_id() RETURNS uuid LANGUAGE sql AS
      $$ SELECT NULLIF(current_setting('app.current_organization_id',true),'')::uuid $$;
    CREATE FUNCTION workflow_current_user_id() RETURNS uuid LANGUAGE sql AS
      $$ SELECT NULLIF(current_setting('app.current_user_id',true),'')::uuid $$;
    CREATE FUNCTION has_role(name text) RETURNS boolean LANGUAGE sql AS
      $$ SELECT name = ANY(string_to_array(current_setting('app.financial_test_roles',true),',')) $$;
    ${migration}
    SELECT set_config('app.current_organization_id',${id(1)},true),set_config('app.current_user_id',${id(3)},true),
      set_config('app.financial_test_roles','ADMIN',true);
    INSERT INTO organizations VALUES (${id(1)}),(${id(2)});
    INSERT INTO users VALUES (${id(3)});
    INSERT INTO projects VALUES (${id(4)},${id(1)}),(${id(5)},${id(2)});
    INSERT INTO ai_agent_registry VALUES (${id(6)},${id(1)});
    INSERT INTO ai_execution_records VALUES (${id(7)},${id(1)},${id(4)},${id(6)});
    ${operation(8, "RESERVE", "reserve")}
    INSERT INTO ai_provider_tariff
      (id,organization_id,provider,model,version,currency,monetary_scale,input_units_per_million,output_units_per_million,effective_at,approved_by,source_sha256)
      VALUES (${id(9)},${id(1)},'FIXTURE','local',1,'EUR',6,100,200,now(),${id(3)},${hash});
    INSERT INTO ai_budget_account
      (id,organization_id,source_budget_id,source_sha256,scope_kind,currency,monetary_scale,limit_units,limit_tokens,
       opening_consumed_units,opening_consumed_tokens,period_start,period_end,approved_by)
      VALUES (${id(10)},${id(1)},${id(31)},${hash},'ORGANIZATION','EUR',6,1000,1000,0,0,now(),now()+interval '1 day',${id(3)});
    INSERT INTO ai_cost_reservation
      (id,organization_id,operation_id,execution_id,project_id,agent_id,tariff_id,currency,monetary_scale,
       maximum_units,maximum_input_tokens,maximum_output_tokens,expires_at)
      VALUES (${id(11)},${id(1)},${id(8)},${id(7)},${id(4)},${id(6)},${id(9)},'EUR',6,100,20,20,now()+interval '1 hour');
    INSERT INTO ai_budget_allocation VALUES (${id(12)},${id(1)},${id(11)},${id(10)},'EUR',6,100,40,now());
    INSERT INTO ai_budget_account
      (id,organization_id,source_budget_id,source_sha256,scope_kind,currency,monetary_scale,limit_units,limit_tokens,
       opening_consumed_units,opening_consumed_tokens,period_start,period_end,approved_by)
      VALUES (${id(26)},${id(1)},${id(32)},${hash},'ORGANIZATION','EUR',6,1000,1000,0,0,now(),now()+interval '1 day',${id(3)});
    DO $$ BEGIN
      IF current_setting('transaction_isolation') <> 'serializable' THEN RAISE EXCEPTION 'Wrong isolation level'; END IF;
      IF (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname=current_schema() AND c.relkind='r' AND c.relrowsecurity AND c.relforcerowsecurity) <> 9
        THEN RAISE EXCEPTION 'Financial FORCE RLS incomplete'; END IF;
      BEGIN
        INSERT INTO ai_budget_allocation VALUES (${id(33)},${id(1)},${id(11)},${id(26)},'EUR',6,-1,40,now());
        RAISE EXCEPTION 'Negative amount accepted';
      EXCEPTION WHEN check_violation THEN NULL; END;
      BEGIN
        INSERT INTO ai_budget_allocation VALUES (${id(33)},${id(1)},${id(11)},${id(26)},'EUR',6,1,-1,now());
        RAISE EXCEPTION 'Negative token capacity accepted';
      EXCEPTION WHEN check_violation THEN NULL; END;
    END $$;
    SELECT set_config('app.current_organization_id','',true);
    DO $$ BEGIN IF EXISTS(SELECT 1 FROM ai_budget_account) THEN RAISE EXCEPTION 'Missing tenant context leaked data'; END IF; END $$;
    SELECT set_config('app.current_organization_id',${id(1)},true),set_config('app.financial_test_roles','AUTHOR',true);
    DO $$ BEGIN
      IF EXISTS(SELECT 1 FROM ai_budget_account) THEN RAISE EXCEPTION 'Unauthorized role read financial data'; END IF;
      BEGIN
        ${operation(34, "RELEASE", "unauthorized-write")}
        RAISE EXCEPTION 'Unauthorized financial write accepted';
      EXCEPTION WHEN insufficient_privilege THEN NULL; END;
    END $$;
    SELECT set_config('app.financial_test_roles','ADMIN',true);
    DO $$ BEGIN
      BEGIN
        INSERT INTO ai_budget_allocation VALUES (${id(13)},${id(1)},${id(11)},${id(10)},'EUR',6,100,40,now());
        RAISE EXCEPTION 'Duplicate allocation accepted';
      EXCEPTION WHEN unique_violation THEN NULL; END;
      BEGIN
        INSERT INTO ai_budget_allocation VALUES (${id(13)},${id(1)},${id(11)},${id(26)},'USD',6,100,40,now());
        RAISE EXCEPTION 'Wrong denomination accepted';
      EXCEPTION WHEN foreign_key_violation THEN NULL; END;
      BEGIN
        ${operation(8, "RESERVE", "reserve")}
        RAISE EXCEPTION 'Duplicate operation accepted';
      EXCEPTION WHEN unique_violation THEN NULL; END;
      BEGIN
        ${operation(14, "RELEASE", "rollback-fixture")}
        RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='rollback fixture';
      EXCEPTION WHEN no_data_found THEN NULL; END;
      IF EXISTS(SELECT 1 FROM financial_operation WHERE id=${id(14)}) THEN RAISE EXCEPTION 'Rollback failed'; END IF;
    END $$;
    SELECT set_config('app.current_organization_id',${id(2)},true);
    DO $$ BEGIN
      IF EXISTS(SELECT 1 FROM ai_budget_account) THEN RAISE EXCEPTION 'Cross-tenant read leaked'; END IF;
      BEGIN
        INSERT INTO ai_budget_allocation VALUES (${id(15)},${id(2)},${id(11)},${id(10)},'EUR',6,1,1,now());
        RAISE EXCEPTION 'Cross-tenant FK accepted';
      EXCEPTION WHEN foreign_key_violation THEN NULL; END;
    END $$;
    SELECT set_config('app.current_organization_id',${id(1)},true),set_config('app.financial_test_roles','ADMIN,SYSTEM',true);
    DO $$ BEGIN IF EXISTS(SELECT 1 FROM ai_budget_account) THEN RAISE EXCEPTION 'Mixed system role bypass'; END IF; END $$;
    SELECT set_config('app.financial_test_roles','ADMIN',true);
    ${operation(16, "DISPATCH", "dispatch")}
    INSERT INTO ai_provider_attempt
      (id,organization_id,reservation_id,operation_id,attempt_number,provider,tariff_id,currency,monetary_scale,
       maximum_units,maximum_input_tokens,maximum_output_tokens,provider_idempotency_key,request_sha256)
      VALUES (${id(17)},${id(1)},${id(11)},${id(16)},1,'FIXTURE',${id(9)},'EUR',6,100,20,20,'attempt-1',${hash});
    ${operation(18, "SETTLE", "settle")}
    INSERT INTO ai_financial_reconciliation_event
      (id,organization_id,reservation_id,attempt_id,operation_id,event_kind,currency,monetary_scale,amount_units,
       input_tokens,output_tokens,provider,provider_event_id,evidence_sha256,reason)
      VALUES (${id(19)},${id(1)},${id(11)},${id(17)},${id(18)},'SETTLED','EUR',6,100,10,10,'FIXTURE','event-1',${hash},'fixture');
    ${operation(24, "SETTLE", "duplicate-event-fixture")}
    DO $$ BEGIN
      BEGIN
        INSERT INTO ai_financial_reconciliation_event
          (id,organization_id,reservation_id,attempt_id,operation_id,event_kind,currency,monetary_scale,amount_units,
           input_tokens,output_tokens,provider,provider_event_id,evidence_sha256,reason)
          VALUES (${id(25)},${id(1)},${id(11)},${id(17)},${id(24)},'SETTLED','EUR',6,100,10,10,'FIXTURE','event-1',${hash},'duplicate fixture');
        RAISE EXCEPTION 'Duplicate provider financial event accepted';
      EXCEPTION WHEN unique_violation THEN NULL; END;
    END $$;
    DO $$ BEGIN
      BEGIN
        INSERT INTO financial_journal (id,organization_id,operation_id,subledger,reconciliation_event_id,currency,monetary_scale)
          VALUES (${id(20)},${id(1)},${id(18)},'AI_EXPENSE',${id(19)},'EUR',6);
        SET CONSTRAINTS ALL IMMEDIATE;
        RAISE EXCEPTION 'Unbalanced journal accepted';
      EXCEPTION WHEN raise_exception THEN
        IF SQLERRM <> 'Financial journal is not balanced' THEN RAISE; END IF;
      END;
    END $$;
    SET CONSTRAINTS ALL DEFERRED;
    INSERT INTO financial_journal (id,organization_id,operation_id,subledger,reconciliation_event_id,currency,monetary_scale)
      VALUES (${id(20)},${id(1)},${id(18)},'AI_EXPENSE',${id(19)},'EUR',6);
    INSERT INTO financial_ledger_entry VALUES
      (${id(21)},${id(1)},${id(20)},1,'AI_EXPENSE','DEBIT',100,'EUR',6,now()),
      (${id(22)},${id(1)},${id(20)},2,'PROVIDER_PAYABLE','CREDIT',100,'EUR',6,now());
    SET CONSTRAINTS ALL IMMEDIATE;
    DO $$ BEGIN
      IF NOT (SELECT sealed FROM financial_journal WHERE id=${id(20)}) THEN RAISE EXCEPTION 'Journal not sealed'; END IF;
      BEGIN
        INSERT INTO financial_ledger_entry VALUES (${id(23)},${id(1)},${id(20)},3,'AI_EXPENSE','DEBIT',1,'EUR',6,now());
        RAISE EXCEPTION 'Sealed journal accepted new line';
      EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Journal unavailable or sealed' THEN RAISE; END IF; END;
      BEGIN
        UPDATE financial_journal SET sealed=false WHERE id=${id(20)};
        RAISE EXCEPTION 'Journal unsealed';
      EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Only sealing an unchanged journal is permitted' THEN RAISE; END IF; END;
      BEGIN
        TRUNCATE financial_ledger_entry;
        RAISE EXCEPTION 'Financial history truncated';
      EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Financial history is append-only' THEN RAISE; END IF; END;
    END $$;
    ${rollback ? "ROLLBACK" : "COMMIT"};`;
  return sql;
}

const databaseUrl = process.env.LABORATOR_FINANCIAL_TEST_DATABASE_URL;
test("real PostgreSQL: migration, tenant RLS, composite references, duplicates, rollback and deferred balancing", {
  skip: databaseUrl ? false : "Isolated PostgreSQL unavailable; set LABORATOR_FINANCIAL_TEST_DATABASE_URL to an explicitly disposable local test database."
}, () => {
  const url = new URL(databaseUrl);
  assert.ok(["postgres:", "postgresql:"].includes(url.protocol));
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Only local disposable PostgreSQL is allowed");
  assert.match(url.pathname, /^\/laborator_financial_test[a-z0-9_]*$/u);
  const schema = `financial_test_${randomUUID().replaceAll("-", "")}`;
  const sql = financialFixtureSql(schema);
  const result = spawnSync("psql", [databaseUrl, "-X", "-v", "ON_ERROR_STOP=1", "-q"], { input: sql, encoding: "utf8", timeout: 30000 });
  assert.equal(result.error, undefined, "psql must be available when the test URL is configured");
  // Even a migration parser error must roll back every schema object on disconnect.
  const cleanup = spawnSync("psql", [databaseUrl, "-X", "-v", "ON_ERROR_STOP=1", "-Atc",
    `SELECT count(*) FROM pg_namespace WHERE nspname='${schema}'`], { encoding: "utf8", timeout: 10000 });
  assert.equal(cleanup.status, 0, cleanup.stderr);
  assert.equal(cleanup.stdout.trim(), "0", "Test schema must never survive the rollback-only test");
  assert.equal(result.status, 0, result.stderr);
});
