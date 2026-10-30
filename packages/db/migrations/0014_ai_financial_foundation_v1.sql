-- P0-A persistence only. No data backfill, provider activation or customer billing.
-- Apply once through the migration runner inside a single transaction.
ALTER TABLE projects ADD CONSTRAINT project_financial_tenant_reference UNIQUE (organization_id, id);
ALTER TABLE ai_execution_records ADD CONSTRAINT ai_execution_financial_scope_reference
  UNIQUE (organization_id, id, project_id, agent_id);

CREATE TABLE financial_operation (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  owner text NOT NULL CHECK (owner IN ('AI_GOVERNANCE', 'COMMERCE')),
  operation_kind text NOT NULL CHECK (operation_kind IN ('RESERVE', 'DISPATCH', 'SETTLE', 'RELEASE', 'RECONCILE')),
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 1 AND 120),
  request_sha256 text NOT NULL CHECK (request_sha256 ~ '^[a-f0-9]{64}$'),
  correlation_id uuid NOT NULL,
  actor_id uuid NOT NULL REFERENCES users(id),
  source_reference text NOT NULL CHECK (length(source_reference) BETWEEN 1 AND 200),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, idempotency_key)
);

CREATE TABLE ai_provider_tariff (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  provider text NOT NULL CHECK (length(provider) BETWEEN 1 AND 80),
  model text NOT NULL CHECK (length(model) BETWEEN 1 AND 120),
  version integer NOT NULL CHECK (version > 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  input_units_per_million bigint NOT NULL CHECK (input_units_per_million >= 0),
  output_units_per_million bigint NOT NULL CHECK (output_units_per_million >= 0),
  effective_at timestamptz NOT NULL,
  approved_by uuid NOT NULL REFERENCES users(id),
  source_sha256 text NOT NULL CHECK (source_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, provider, model, version),
  UNIQUE (organization_id, id, provider, currency, monetary_scale),
  UNIQUE (organization_id, id, currency, monetary_scale)
);

-- Lockable projection of an existing AI Governance budget, not a second policy store.
-- P0-B must provision it from an authorized source version, with verified opening usage.
CREATE TABLE ai_budget_account (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  source_budget_id uuid NOT NULL,
  source_sha256 text NOT NULL CHECK (source_sha256 ~ '^[a-f0-9]{64}$'),
  scope_kind text NOT NULL CHECK (scope_kind IN ('ORGANIZATION', 'PROJECT', 'AGENT', 'USER')),
  project_id uuid,
  agent_id uuid,
  user_id uuid REFERENCES users(id),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  limit_units bigint NOT NULL CHECK (limit_units >= 0),
  limit_tokens bigint NOT NULL CHECK (limit_tokens >= 0),
  opening_consumed_units bigint NOT NULL CHECK (opening_consumed_units >= 0),
  opening_consumed_tokens bigint NOT NULL CHECK (opening_consumed_tokens >= 0),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL CHECK (period_end > period_start),
  approved_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((scope_kind = 'ORGANIZATION' AND project_id IS NULL AND agent_id IS NULL AND user_id IS NULL)
    OR (scope_kind = 'PROJECT' AND project_id IS NOT NULL AND agent_id IS NULL AND user_id IS NULL)
    OR (scope_kind = 'AGENT' AND project_id IS NULL AND agent_id IS NOT NULL AND user_id IS NULL)
    OR (scope_kind = 'USER' AND project_id IS NULL AND agent_id IS NULL AND user_id IS NOT NULL)),
  UNIQUE (organization_id, source_budget_id, period_start),
  UNIQUE (organization_id, id, currency, monetary_scale),
  FOREIGN KEY (organization_id, project_id) REFERENCES projects (organization_id, id),
  FOREIGN KEY (organization_id, agent_id) REFERENCES ai_agent_registry (organization_id, id)
);

CREATE TABLE ai_cost_reservation (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  operation_id uuid NOT NULL,
  execution_id uuid NOT NULL,
  project_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  tariff_id uuid NOT NULL,
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  maximum_units bigint NOT NULL CHECK (maximum_units >= 0),
  maximum_input_tokens bigint NOT NULL CHECK (maximum_input_tokens >= 0),
  maximum_output_tokens bigint NOT NULL CHECK (maximum_output_tokens >= 0),
  expires_at timestamptz NOT NULL CHECK (expires_at > created_at),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, execution_id),
  UNIQUE (organization_id, operation_id),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, id, currency, monetary_scale),
  FOREIGN KEY (organization_id, operation_id) REFERENCES financial_operation (organization_id, id),
  FOREIGN KEY (organization_id, execution_id, project_id, agent_id)
    REFERENCES ai_execution_records (organization_id, id, project_id, agent_id),
  FOREIGN KEY (organization_id, project_id) REFERENCES projects (organization_id, id),
  FOREIGN KEY (organization_id, agent_id) REFERENCES ai_agent_registry (organization_id, id),
  FOREIGN KEY (organization_id, tariff_id, currency, monetary_scale)
    REFERENCES ai_provider_tariff (organization_id, id, currency, monetary_scale)
);

CREATE TABLE ai_budget_allocation (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  reservation_id uuid NOT NULL,
  budget_account_id uuid NOT NULL,
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  reserved_units bigint NOT NULL CHECK (reserved_units >= 0),
  reserved_tokens bigint NOT NULL CHECK (reserved_tokens >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, reservation_id, budget_account_id),
  FOREIGN KEY (organization_id, reservation_id, currency, monetary_scale)
    REFERENCES ai_cost_reservation (organization_id, id, currency, monetary_scale),
  FOREIGN KEY (organization_id, budget_account_id, currency, monetary_scale)
    REFERENCES ai_budget_account (organization_id, id, currency, monetary_scale)
);

CREATE TABLE ai_provider_attempt (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  reservation_id uuid NOT NULL,
  operation_id uuid NOT NULL,
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  provider text NOT NULL CHECK (length(provider) BETWEEN 1 AND 80),
  tariff_id uuid NOT NULL,
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  maximum_units bigint NOT NULL CHECK (maximum_units >= 0),
  maximum_input_tokens bigint NOT NULL CHECK (maximum_input_tokens >= 0),
  maximum_output_tokens bigint NOT NULL CHECK (maximum_output_tokens >= 0),
  provider_idempotency_key text NOT NULL CHECK (length(provider_idempotency_key) BETWEEN 1 AND 200),
  request_sha256 text NOT NULL CHECK (request_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, reservation_id, id),
  UNIQUE (organization_id, reservation_id, id, provider),
  UNIQUE (organization_id, operation_id),
  UNIQUE (organization_id, reservation_id, attempt_number),
  UNIQUE (organization_id, provider, provider_idempotency_key),
  FOREIGN KEY (organization_id, reservation_id, currency, monetary_scale)
    REFERENCES ai_cost_reservation (organization_id, id, currency, monetary_scale),
  FOREIGN KEY (organization_id, tariff_id, provider, currency, monetary_scale)
    REFERENCES ai_provider_tariff (organization_id, id, provider, currency, monetary_scale),
  FOREIGN KEY (organization_id, operation_id) REFERENCES financial_operation (organization_id, id)
);

CREATE TABLE ai_financial_reconciliation_event (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  reservation_id uuid NOT NULL,
  attempt_id uuid,
  operation_id uuid NOT NULL,
  event_kind text NOT NULL CHECK (event_kind IN ('RESERVED', 'DISPATCHED', 'SETTLED', 'RELEASED', 'RECONCILIATION_REQUIRED', 'ADJUSTED')),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  amount_units bigint NOT NULL CHECK (amount_units >= 0),
  input_tokens bigint NOT NULL CHECK (input_tokens >= 0),
  output_tokens bigint NOT NULL CHECK (output_tokens >= 0),
  provider text,
  provider_event_id text,
  evidence_sha256 text NOT NULL CHECK (evidence_sha256 ~ '^[a-f0-9]{64}$'),
  reason text NOT NULL CHECK (length(trim(reason)) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (provider_event_id IS NULL OR (provider IS NOT NULL AND length(provider_event_id) BETWEEN 1 AND 200)),
  CHECK (attempt_id IS NULL OR provider IS NOT NULL),
  CHECK (event_kind NOT IN ('DISPATCHED', 'SETTLED') OR attempt_id IS NOT NULL),
  CHECK (event_kind <> 'SETTLED' OR provider_event_id IS NOT NULL),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, operation_id),
  UNIQUE (organization_id, provider, provider_event_id),
  FOREIGN KEY (organization_id, operation_id) REFERENCES financial_operation (organization_id, id),
  FOREIGN KEY (organization_id, reservation_id, currency, monetary_scale)
    REFERENCES ai_cost_reservation (organization_id, id, currency, monetary_scale),
  FOREIGN KEY (organization_id, reservation_id, attempt_id)
    REFERENCES ai_provider_attempt (organization_id, reservation_id, id),
  FOREIGN KEY (organization_id, reservation_id, attempt_id, provider)
    REFERENCES ai_provider_attempt (organization_id, reservation_id, id, provider)
);

-- One common journal; never net AI expenses against customer revenue.
CREATE TABLE financial_journal (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  operation_id uuid NOT NULL,
  subledger text NOT NULL CHECK (subledger IN ('AI_EXPENSE', 'CUSTOMER_REVENUE')),
  reconciliation_event_id uuid,
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  sealed boolean NOT NULL DEFAULT false CHECK (sealed IN (true, false)),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((subledger = 'AI_EXPENSE' AND reconciliation_event_id IS NOT NULL)
    OR (subledger = 'CUSTOMER_REVENUE' AND reconciliation_event_id IS NULL)),
  UNIQUE (organization_id, operation_id),
  UNIQUE (organization_id, reconciliation_event_id),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, id, currency, monetary_scale),
  FOREIGN KEY (organization_id, operation_id) REFERENCES financial_operation (organization_id, id),
  FOREIGN KEY (organization_id, reconciliation_event_id) REFERENCES ai_financial_reconciliation_event (organization_id, id)
);

CREATE TABLE financial_ledger_entry (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  journal_id uuid NOT NULL,
  line_number integer NOT NULL CHECK (line_number > 0),
  account_code text NOT NULL CHECK (account_code ~ '^[A-Z][A-Z0-9_]{2,63}$'),
  side text NOT NULL CHECK (side IN ('DEBIT', 'CREDIT')),
  amount_units bigint NOT NULL CHECK (amount_units > 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  monetary_scale smallint NOT NULL CHECK (monetary_scale BETWEEN 0 AND 9),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, journal_id, line_number),
  FOREIGN KEY (organization_id, journal_id, currency, monetary_scale)
    REFERENCES financial_journal (organization_id, id, currency, monetary_scale)
);

CREATE FUNCTION financial_deny_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Financial history is append-only';
END;
$$;

CREATE FUNCTION ai_financial_check_operation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE expected_kind text; actual_kind text; actual_owner text;
BEGIN
  IF TG_TABLE_NAME = 'ai_cost_reservation' THEN expected_kind := 'RESERVE';
  ELSIF TG_TABLE_NAME = 'ai_provider_attempt' THEN expected_kind := 'DISPATCH';
  ELSE expected_kind := CASE NEW.event_kind WHEN 'RESERVED' THEN 'RESERVE' WHEN 'DISPATCHED' THEN 'DISPATCH'
    WHEN 'SETTLED' THEN 'SETTLE' WHEN 'RELEASED' THEN 'RELEASE' ELSE 'RECONCILE' END;
  END IF;
  SELECT owner, operation_kind INTO actual_owner, actual_kind FROM financial_operation
    WHERE organization_id = NEW.organization_id AND id = NEW.operation_id;
  IF actual_owner IS DISTINCT FROM 'AI_GOVERNANCE' OR actual_kind IS DISTINCT FROM expected_kind THEN
    RAISE EXCEPTION 'AI financial operation ownership or kind mismatch';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER ai_reservation_operation BEFORE INSERT ON ai_cost_reservation
  FOR EACH ROW EXECUTE FUNCTION ai_financial_check_operation();
CREATE TRIGGER ai_attempt_operation BEFORE INSERT ON ai_provider_attempt
  FOR EACH ROW EXECUTE FUNCTION ai_financial_check_operation();
CREATE TRIGGER ai_reconciliation_operation BEFORE INSERT ON ai_financial_reconciliation_event
  FOR EACH ROW EXECUTE FUNCTION ai_financial_check_operation();

CREATE FUNCTION financial_guard_journal() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE operation_owner text;
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Financial journal cannot be deleted'; END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.sealed OR NOT NEW.sealed OR (to_jsonb(OLD) - 'sealed') IS DISTINCT FROM (to_jsonb(NEW) - 'sealed') THEN
      RAISE EXCEPTION 'Only sealing an unchanged journal is permitted';
    END IF;
  ELSE
    IF NEW.sealed THEN RAISE EXCEPTION 'Journal must start unsealed'; END IF;
    SELECT owner INTO operation_owner FROM financial_operation
      WHERE organization_id = NEW.organization_id AND id = NEW.operation_id;
    IF operation_owner IS DISTINCT FROM (CASE WHEN NEW.subledger = 'AI_EXPENSE' THEN 'AI_GOVERNANCE' ELSE 'COMMERCE' END) THEN
      RAISE EXCEPTION 'Financial subledger ownership mismatch';
    END IF;
    IF NEW.subledger = 'AI_EXPENSE' AND NOT EXISTS (
      SELECT 1 FROM ai_financial_reconciliation_event WHERE organization_id = NEW.organization_id
        AND id = NEW.reconciliation_event_id AND operation_id = NEW.operation_id
        AND currency = NEW.currency AND monetary_scale = NEW.monetary_scale
        AND event_kind IN ('SETTLED', 'ADJUSTED')
    ) THEN RAISE EXCEPTION 'Journal must reference the same settled AI financial operation'; END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER financial_journal_guard BEFORE INSERT OR UPDATE OR DELETE ON financial_journal
  FOR EACH ROW EXECUTE FUNCTION financial_guard_journal();

CREATE FUNCTION financial_guard_entry() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE is_sealed boolean;
BEGIN
  SELECT sealed INTO is_sealed FROM financial_journal
    WHERE organization_id = NEW.organization_id AND id = NEW.journal_id FOR UPDATE;
  IF is_sealed IS DISTINCT FROM false THEN RAISE EXCEPTION 'Journal unavailable or sealed'; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER financial_entry_guard BEFORE INSERT ON financial_ledger_entry
  FOR EACH ROW EXECUTE FUNCTION financial_guard_entry();

CREATE FUNCTION financial_check_balance() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target_id uuid; line_count bigint; balance numeric; debit_total numeric; journal_record financial_journal%ROWTYPE;
BEGIN
  IF TG_TABLE_NAME = 'financial_journal' THEN target_id := NEW.id;
  ELSE target_id := NEW.journal_id; END IF;
  SELECT * INTO journal_record FROM financial_journal WHERE organization_id = NEW.organization_id AND id = target_id FOR UPDATE;
  SELECT count(*), COALESCE(sum(CASE WHEN side = 'DEBIT' THEN amount_units::numeric ELSE -amount_units::numeric END), 0),
    COALESCE(sum(CASE WHEN side = 'DEBIT' THEN amount_units::numeric ELSE 0 END), 0)
    INTO line_count, balance, debit_total FROM financial_ledger_entry
    WHERE organization_id = NEW.organization_id AND journal_id = target_id;
  IF line_count < 2 OR balance <> 0 THEN RAISE EXCEPTION 'Financial journal is not balanced'; END IF;
  IF journal_record.subledger = 'AI_EXPENSE' AND NOT EXISTS (
    SELECT 1 FROM ai_financial_reconciliation_event WHERE organization_id = NEW.organization_id
      AND id = journal_record.reconciliation_event_id AND amount_units::numeric = debit_total
  ) THEN RAISE EXCEPTION 'Journal amount differs from reconciled AI expense'; END IF;
  UPDATE financial_journal SET sealed = true WHERE organization_id = NEW.organization_id AND id = target_id AND NOT sealed;
  RETURN NULL;
END;
$$;
CREATE CONSTRAINT TRIGGER financial_journal_balanced AFTER INSERT ON financial_journal
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION financial_check_balance();
CREATE CONSTRAINT TRIGGER financial_entries_balanced AFTER INSERT ON financial_ledger_entry
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION financial_check_balance();

-- Missing IAM/tenant context fails closed. No HTTP endpoint or execution activation.
DO $$
DECLARE relation_name text;
BEGIN
  FOREACH relation_name IN ARRAY ARRAY['financial_operation', 'ai_provider_tariff', 'ai_budget_account',
    'ai_cost_reservation', 'ai_budget_allocation', 'ai_provider_attempt', 'ai_financial_reconciliation_event',
    'financial_journal', 'financial_ledger_entry'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', relation_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', relation_name);
    EXECUTE format('CREATE TRIGGER financial_no_truncate BEFORE TRUNCATE ON %I FOR EACH STATEMENT EXECUTE FUNCTION financial_deny_mutation()', relation_name);
    EXECUTE format('CREATE POLICY financial_read ON %I FOR SELECT USING (organization_id = workflow_current_organization_id() AND (has_role(''ADMIN'') OR has_role(''PLATFORM_CREATOR'')) AND NOT (has_role(''AI_AGENT'') OR has_role(''SYSTEM'') OR has_role(''AUTOMATION'')))', relation_name);
    EXECUTE format('CREATE POLICY financial_insert ON %I FOR INSERT WITH CHECK (organization_id = workflow_current_organization_id() AND (has_role(''ADMIN'') OR has_role(''PLATFORM_CREATOR'')) AND NOT (has_role(''AI_AGENT'') OR has_role(''SYSTEM'') OR has_role(''AUTOMATION'')) AND %s)',
      relation_name, CASE WHEN relation_name = 'financial_operation' THEN 'actor_id = workflow_current_user_id()' ELSE 'true' END);
    IF relation_name <> 'financial_journal' THEN
      EXECUTE format('CREATE TRIGGER financial_immutable BEFORE UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION financial_deny_mutation()', relation_name);
    END IF;
  END LOOP;
END;
$$;
CREATE POLICY financial_journal_seal ON financial_journal FOR UPDATE
  USING (organization_id = workflow_current_organization_id() AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION')))
  WITH CHECK (organization_id = workflow_current_organization_id());
-- SELECT FOR UPDATE needs an UPDATE policy; the immutable trigger still rejects writes.
CREATE POLICY financial_budget_lock ON ai_budget_account FOR UPDATE
  USING (organization_id = workflow_current_organization_id() AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION')))
  WITH CHECK (organization_id = workflow_current_organization_id());

CREATE INDEX ai_allocation_account_lookup ON ai_budget_allocation (organization_id, budget_account_id, reservation_id);
CREATE INDEX ai_reconciliation_reservation_lookup ON ai_financial_reconciliation_event (organization_id, reservation_id, created_at, id);
CREATE UNIQUE INDEX ai_attempt_settled_once ON ai_financial_reconciliation_event (organization_id, attempt_id)
  WHERE event_kind = 'SETTLED';
CREATE UNIQUE INDEX ai_attempt_dispatched_once ON ai_financial_reconciliation_event (organization_id, attempt_id)
  WHERE event_kind = 'DISPATCHED';
CREATE UNIQUE INDEX ai_reservation_created_once ON ai_financial_reconciliation_event (organization_id, reservation_id)
  WHERE event_kind = 'RESERVED';
CREATE INDEX ai_reservation_expiry_lookup ON ai_cost_reservation (organization_id, expires_at);
CREATE INDEX financial_journal_time_lookup ON financial_journal (organization_id, created_at, id);
