-- Additive operational configuration for the canonical AI Governance identities.
-- No execution, provider requests, legacy record rewrites, or automatic approvals.
CREATE TABLE IF NOT EXISTS ai_agent_registry (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL,
  canonical_agent_id text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  active_version_id uuid,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, canonical_agent_id),
  UNIQUE (organization_id, id)
);

CREATE TABLE IF NOT EXISTS ai_agent_configuration_versions (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL,
  registry_id uuid NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  revision integer NOT NULL CHECK (revision > 0),
  governance_version text NOT NULL,
  configuration_sha256 text NOT NULL CHECK (configuration_sha256 ~ '^[a-f0-9]{64}$'),
  bindings jsonb NOT NULL CHECK (jsonb_typeof(bindings) = 'array'),
  status text NOT NULL CHECK (status IN ('DRAFT', 'APPROVED', 'ACTIVE')),
  reason text NOT NULL CHECK (length(trim(reason)) > 0),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid,
  approved_at timestamptz,
  activated_by uuid,
  activated_at timestamptz,
  UNIQUE (organization_id, registry_id, version),
  UNIQUE (organization_id, registry_id, id),
  FOREIGN KEY (organization_id, registry_id) REFERENCES ai_agent_registry (organization_id, id),
  CHECK (status = 'DRAFT' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)),
  CHECK (status <> 'ACTIVE' OR (activated_by IS NOT NULL AND activated_at IS NOT NULL))
);

ALTER TABLE ai_agent_registry ADD CONSTRAINT ai_agent_registry_active_version_fk
  FOREIGN KEY (organization_id, id, active_version_id)
  REFERENCES ai_agent_configuration_versions (organization_id, registry_id, id);

CREATE OR REPLACE FUNCTION protect_ai_agent_configuration_version()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'ACTIVE' THEN
    RAISE EXCEPTION 'Activated agent versions are immutable';
  END IF;
  IF OLD.status = 'APPROVED' THEN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Approved agent versions are immutable';
    END IF;
    IF NEW.status <> 'ACTIVE' OR
      (to_jsonb(OLD) - ARRAY['status', 'activated_by', 'activated_at', 'updated_by', 'updated_at'])
      IS DISTINCT FROM
      (to_jsonb(NEW) - ARRAY['status', 'activated_by', 'activated_at', 'updated_by', 'updated_at']) THEN
      RAISE EXCEPTION 'Only activation of an unchanged approved version is allowed';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER ai_agent_configuration_immutable
  BEFORE UPDATE OR DELETE ON ai_agent_configuration_versions
  FOR EACH ROW EXECUTE FUNCTION protect_ai_agent_configuration_version();

ALTER TABLE ai_agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_registry FORCE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_configuration_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_configuration_versions FORCE ROW LEVEL SECURITY;

CREATE POLICY ai_agent_registry_admin ON ai_agent_registry
  FOR ALL USING (
    organization_id = workflow_current_organization_id()
    AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION'))
  ) WITH CHECK (
    organization_id = workflow_current_organization_id()
    AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION'))
    AND updated_by = workflow_current_user_id()
  );
CREATE POLICY ai_agent_versions_admin ON ai_agent_configuration_versions
  FOR ALL USING (
    organization_id = workflow_current_organization_id()
    AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION'))
  ) WITH CHECK (
    organization_id = workflow_current_organization_id()
    AND (has_role('ADMIN') OR has_role('PLATFORM_CREATOR'))
    AND NOT (has_role('AI_AGENT') OR has_role('SYSTEM') OR has_role('AUTOMATION'))
    AND updated_by = workflow_current_user_id()
    AND (status = 'DRAFT' OR approved_by IS NOT NULL)
  );
CREATE INDEX ai_agent_versions_lookup_idx
  ON ai_agent_configuration_versions (organization_id, registry_id, version DESC);
