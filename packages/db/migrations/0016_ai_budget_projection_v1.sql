-- Derived policy evidence only. Existing AI Governance policies remain authoritative.
CREATE TABLE ai_budget_projection (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  version bigint NOT NULL CHECK (version > 0),
  source_sha256 text NOT NULL CHECK (source_sha256 ~ '^[a-f0-9]{64}$'),
  account_ids uuid[] NOT NULL CHECK (cardinality(account_ids) > 0),
  quotas jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(quotas)='array'),
  actor_id uuid NOT NULL REFERENCES users(id),
  correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz NOT NULL DEFAULT (now()+interval '15 minutes') CHECK (valid_until>created_at),
  UNIQUE (organization_id, version),
  UNIQUE (organization_id, id)
);
ALTER TABLE ai_budget_projection ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_budget_projection FORCE ROW LEVEL SECURITY;
CREATE POLICY financial_projection_access ON ai_budget_projection FOR ALL
  USING (organization_id=workflow_current_organization_id()
    AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION')))
  WITH CHECK (organization_id=workflow_current_organization_id() AND actor_id=workflow_current_user_id()
    AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION')));
CREATE TRIGGER financial_immutable BEFORE UPDATE OR DELETE ON ai_budget_projection
  FOR EACH ROW EXECUTE FUNCTION financial_deny_mutation();
CREATE TRIGGER financial_no_truncate BEFORE TRUNCATE ON ai_budget_projection
  FOR EACH STATEMENT EXECUTE FUNCTION financial_deny_mutation();

-- UUID arrays cannot carry a composite foreign key. Validate every member under
-- the same tenant RLS instead of trusting application-only snapshot validation.
CREATE FUNCTION ai_financial_validate_projection() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF cardinality(NEW.account_ids) IS DISTINCT FROM
      (SELECT count(DISTINCT account_id)::integer FROM unnest(NEW.account_ids) account_id)
    OR EXISTS(SELECT 1 FROM unnest(NEW.account_ids) account_id WHERE account_id IS NULL)
    OR (SELECT count(*) FROM ai_budget_account WHERE organization_id=NEW.organization_id AND id=ANY(NEW.account_ids))
      <> cardinality(NEW.account_ids)
    OR NOT EXISTS(SELECT 1 FROM ai_budget_account WHERE organization_id=NEW.organization_id
      AND id=ANY(NEW.account_ids) AND scope_kind='ORGANIZATION') THEN
    RAISE EXCEPTION 'Invalid, missing or foreign budget projection account';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER ai_projection_accounts_valid BEFORE INSERT ON ai_budget_projection
  FOR EACH ROW EXECUTE FUNCTION ai_financial_validate_projection();

-- Keep every account revision; old allocations continue to consume capacity.
DO $$
DECLARE constraint_name text;
BEGIN
  SELECT conname INTO STRICT constraint_name FROM pg_constraint
    WHERE conrelid='ai_budget_account'::regclass AND contype='u'
      AND pg_get_constraintdef(oid)='UNIQUE (organization_id, source_budget_id, period_start)';
  EXECUTE format('ALTER TABLE ai_budget_account DROP CONSTRAINT %I',constraint_name);
END;
$$;
ALTER TABLE ai_budget_account ADD CONSTRAINT ai_budget_account_source_revision
  UNIQUE (organization_id, source_budget_id, period_start, source_sha256);
ALTER TABLE ai_cost_reservation ADD COLUMN projection_id uuid;
ALTER TABLE ai_cost_reservation ADD CONSTRAINT ai_reservation_projection_fk
  FOREIGN KEY (organization_id, projection_id) REFERENCES ai_budget_projection (organization_id,id);

CREATE FUNCTION ai_financial_require_projection() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE projection ai_budget_projection%ROWTYPE;
BEGIN
  SELECT * INTO projection FROM ai_budget_projection
    WHERE organization_id=NEW.organization_id ORDER BY version DESC LIMIT 1;
  IF projection.id IS NULL OR projection.valid_until<=clock_timestamp() OR NEW.projection_id IS DISTINCT FROM projection.id
    OR current_setting('app.ai_budget_source_sha256',true) IS DISTINCT FROM projection.source_sha256 THEN
    RAISE EXCEPTION 'Missing or stale budget projection';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER ai_reservation_requires_projection BEFORE INSERT ON ai_cost_reservation
  FOR EACH ROW EXECUTE FUNCTION ai_financial_require_projection();
