-- Controlled local execution; existing agent identities and versions are retained.
ALTER TABLE ai_agent_configuration_versions ADD COLUMN IF NOT EXISTS
  validated_handler_keys jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS ai_execution_records (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL,
  user_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  canonical_agent_id text NOT NULL,
  agent_version_id uuid NOT NULL,
  configuration_sha256 text NOT NULL,
  binding jsonb NOT NULL,
  project_id uuid NOT NULL,
  document_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  correlation_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN
    ('CREATED', 'AUTHORIZED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'BLOCKED')),
  input_tokens integer NOT NULL DEFAULT 0 CHECK (input_tokens >= 0),
  output_tokens integer NOT NULL DEFAULT 0 CHECK (output_tokens >= 0),
  actual_cost numeric NOT NULL DEFAULT 0 CHECK (actual_cost >= 0),
  currency text NOT NULL DEFAULT 'EUR',
  usage_recorded boolean NOT NULL DEFAULT false,
  failure_code text,
  result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id, idempotency_key),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, agent_id, agent_version_id)
    REFERENCES ai_agent_configuration_versions (organization_id, registry_id, id)
);

CREATE TABLE IF NOT EXISTS ai_operational_audit_events (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL,
  execution_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  action text NOT NULL,
  correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  FOREIGN KEY (organization_id, execution_id) REFERENCES ai_execution_records (organization_id, id)
);

CREATE OR REPLACE FUNCTION protect_ai_task_transition()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Execution history cannot be deleted'; END IF;
  IF OLD.status IN ('COMPLETED', 'FAILED', 'CANCELLED', 'BLOCKED') THEN
    RAISE EXCEPTION 'Terminal task records are immutable';
  END IF;
  IF (to_jsonb(OLD) - ARRAY['status', 'updated_at', 'input_tokens', 'output_tokens', 'actual_cost',
      'usage_recorded', 'failure_code', 'result']) IS DISTINCT FROM
     (to_jsonb(NEW) - ARRAY['status', 'updated_at', 'input_tokens', 'output_tokens', 'actual_cost',
      'usage_recorded', 'failure_code', 'result']) THEN
    RAISE EXCEPTION 'Execution identity and request are immutable';
  END IF;
  IF NOT (
    OLD.status = 'CREATED' AND NEW.status IN ('AUTHORIZED', 'BLOCKED', 'CANCELLED') OR
    OLD.status = 'AUTHORIZED' AND NEW.status IN ('RUNNING', 'BLOCKED', 'CANCELLED') OR
    OLD.status = 'RUNNING' AND NEW.status IN ('COMPLETED', 'FAILED', 'CANCELLED')
  ) THEN RAISE EXCEPTION 'Invalid AI task transition'; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER ai_task_transition_guard BEFORE UPDATE OR DELETE ON ai_execution_records
  FOR EACH ROW EXECUTE FUNCTION protect_ai_task_transition();

CREATE OR REPLACE FUNCTION protect_ai_execution_history()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'AI execution audit is append-only';
END;
$$;
CREATE TRIGGER ai_execution_audit_immutable BEFORE UPDATE OR DELETE ON ai_operational_audit_events
  FOR EACH ROW EXECUTE FUNCTION protect_ai_execution_history();

ALTER TABLE ai_execution_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_execution_records FORCE ROW LEVEL SECURITY;
ALTER TABLE ai_operational_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_operational_audit_events FORCE ROW LEVEL SECURITY;
CREATE POLICY ai_execution_read ON ai_execution_records FOR SELECT USING (
  organization_id = workflow_current_organization_id() AND
  (user_id = workflow_current_user_id() OR has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
);
CREATE POLICY ai_execution_insert ON ai_execution_records FOR INSERT WITH CHECK (
  organization_id = workflow_current_organization_id() AND user_id = workflow_current_user_id()
  AND status = 'CREATED' AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM'))
);
CREATE POLICY ai_execution_update ON ai_execution_records FOR UPDATE USING (
  organization_id = workflow_current_organization_id() AND
  (user_id = workflow_current_user_id() OR has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
) WITH CHECK (organization_id = workflow_current_organization_id());
CREATE POLICY ai_execution_audit_read ON ai_operational_audit_events FOR SELECT USING (
  organization_id = workflow_current_organization_id() AND
  (actor_id = workflow_current_user_id() OR has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
);
CREATE POLICY ai_execution_audit_insert ON ai_operational_audit_events FOR INSERT WITH CHECK (
  organization_id = workflow_current_organization_id() AND actor_id = workflow_current_user_id()
);
