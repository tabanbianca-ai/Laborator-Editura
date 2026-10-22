-- Configurable and Versioned Workflow Engine v1
-- Additive to 0005_workflow_engine_v1.sql. Existing workflow state, transition,
-- audit, approval, and export behavior remains unchanged.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_definition_status') THEN
    CREATE TYPE workflow_definition_status AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_version_status') THEN
    CREATE TYPE workflow_version_status AS ENUM ('DRAFT', 'ACTIVE', 'RETIRED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_instance_status') THEN
    CREATE TYPE workflow_instance_status AS ENUM ('RUNNING', 'BLOCKED', 'COMPLETED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_approval_status') THEN
    CREATE TYPE workflow_approval_status AS ENUM ('GRANTED', 'REJECTED');
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION workflow_roles_are_human(role_names text[])
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT cardinality(role_names) > 0
    AND NOT EXISTS (
      SELECT 1 FROM unnest(role_names) role_name
      WHERE upper(role_name) ~ '(^|_)(AI|AGENT|SYSTEM|AUTOMATION)($|_)'
    );
$$;

CREATE TABLE IF NOT EXISTS workflow_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  definition_key text NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  status workflow_definition_status NOT NULL DEFAULT 'DRAFT',
  current_version_id uuid,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workflow_definitions_key_format CHECK (
    definition_key ~ '^[a-z][a-z0-9._-]{2,79}$'
  ),
  CONSTRAINT workflow_definitions_org_key_unique UNIQUE (organization_id, definition_key),
  CONSTRAINT workflow_definitions_org_id_unique UNIQUE (organization_id, id)
);

CREATE TABLE IF NOT EXISTS workflow_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_definition_id uuid NOT NULL,
  version integer NOT NULL,
  status workflow_version_status NOT NULL DEFAULT 'DRAFT',
  stages jsonb NOT NULL,
  transitions jsonb NOT NULL,
  configuration_sha256 text GENERATED ALWAYS AS (
    encode(digest(stages::text || '|' || transitions::text, 'sha256'), 'hex')
  ) STORED,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid,
  approved_at timestamptz,
  CONSTRAINT workflow_versions_definition_fk
    FOREIGN KEY (organization_id, workflow_definition_id)
    REFERENCES workflow_definitions (organization_id, id),
  CONSTRAINT workflow_versions_number_positive CHECK (version > 0),
  CONSTRAINT workflow_versions_stages_array CHECK (jsonb_typeof(stages) = 'array'),
  CONSTRAINT workflow_versions_transitions_array CHECK (jsonb_typeof(transitions) = 'array'),
  CONSTRAINT workflow_versions_approval_fields CHECK (
    (status = 'ACTIVE' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
    OR status <> 'ACTIVE'
  ),
  CONSTRAINT workflow_versions_org_version_unique
    UNIQUE (organization_id, workflow_definition_id, version),
  CONSTRAINT workflow_versions_org_id_unique UNIQUE (organization_id, id)
);

ALTER TABLE workflow_definitions
  DROP CONSTRAINT IF EXISTS workflow_definitions_current_version_fk;
ALTER TABLE workflow_definitions
  ADD CONSTRAINT workflow_definitions_current_version_fk
  FOREIGN KEY (organization_id, current_version_id)
  REFERENCES workflow_versions (organization_id, id);

CREATE TABLE IF NOT EXISTS workflow_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_definition_id uuid NOT NULL,
  workflow_version_id uuid NOT NULL,
  project_id uuid,
  document_id uuid,
  scope_type text NOT NULL,
  scope_id text NOT NULL,
  current_stage_id text NOT NULL,
  status workflow_instance_status NOT NULL DEFAULT 'RUNNING',
  started_by uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  blocked_reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT workflow_instances_definition_fk
    FOREIGN KEY (organization_id, workflow_definition_id)
    REFERENCES workflow_definitions (organization_id, id),
  CONSTRAINT workflow_instances_version_fk
    FOREIGN KEY (organization_id, workflow_version_id)
    REFERENCES workflow_versions (organization_id, id),
  CONSTRAINT workflow_instances_scope_type CHECK (scope_type IN ('PROJECT', 'DOCUMENT', 'SEGMENT')),
  CONSTRAINT workflow_instances_completed_fields CHECK (
    (status = 'COMPLETED' AND completed_at IS NOT NULL)
    OR (status <> 'COMPLETED' AND completed_at IS NULL)
  ),
  CONSTRAINT workflow_instances_blocked_fields CHECK (
    (status = 'BLOCKED' AND blocked_reason IS NOT NULL)
    OR status <> 'BLOCKED'
  ),
  CONSTRAINT workflow_instances_org_id_unique UNIQUE (organization_id, id)
);

CREATE TABLE IF NOT EXISTS workflow_instance_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_instance_id uuid NOT NULL,
  workflow_version_id uuid NOT NULL,
  transition_definition_id text NOT NULL,
  action text NOT NULL,
  from_stage_id text NOT NULL,
  to_stage_id text NOT NULL,
  actor_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  evaluated_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT workflow_instance_transitions_instance_fk
    FOREIGN KEY (organization_id, workflow_instance_id)
    REFERENCES workflow_instances (organization_id, id),
  CONSTRAINT workflow_instance_transitions_version_fk
    FOREIGN KEY (organization_id, workflow_version_id)
    REFERENCES workflow_versions (organization_id, id),
  CONSTRAINT workflow_instance_transitions_distinct_stages CHECK (from_stage_id <> to_stage_id),
  CONSTRAINT workflow_instance_transitions_rules_array CHECK (jsonb_typeof(evaluated_rules) = 'array')
);

CREATE TABLE IF NOT EXISTS workflow_approval_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_instance_id uuid NOT NULL,
  workflow_version_id uuid NOT NULL,
  stage_id text NOT NULL,
  status workflow_approval_status NOT NULL,
  actor_id uuid NOT NULL,
  actor_roles text[] NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workflow_approval_records_instance_fk
    FOREIGN KEY (organization_id, workflow_instance_id)
    REFERENCES workflow_instances (organization_id, id),
  CONSTRAINT workflow_approval_records_version_fk
    FOREIGN KEY (organization_id, workflow_version_id)
    REFERENCES workflow_versions (organization_id, id),
  CONSTRAINT workflow_approval_records_actor_unique
    UNIQUE (organization_id, workflow_instance_id, stage_id, actor_id),
  CONSTRAINT workflow_approval_records_human_roles CHECK (workflow_roles_are_human(actor_roles))
);

CREATE TABLE IF NOT EXISTS workflow_configuration_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  action text NOT NULL,
  actor_id uuid NOT NULL,
  entity_id uuid NOT NULL,
  entity_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT workflow_configuration_audit_entity_type CHECK (
    entity_type IN ('DEFINITION', 'VERSION', 'INSTANCE', 'APPROVAL')
  )
);

CREATE INDEX IF NOT EXISTS workflow_versions_definition_idx
  ON workflow_versions (organization_id, workflow_definition_id, version DESC);
CREATE INDEX IF NOT EXISTS workflow_instances_scope_idx
  ON workflow_instances (organization_id, scope_type, scope_id);
CREATE INDEX IF NOT EXISTS workflow_instances_version_idx
  ON workflow_instances (organization_id, workflow_version_id);
CREATE INDEX IF NOT EXISTS workflow_instance_transitions_instance_idx
  ON workflow_instance_transitions (organization_id, workflow_instance_id, created_at);
CREATE INDEX IF NOT EXISTS workflow_approval_records_instance_idx
  ON workflow_approval_records (organization_id, workflow_instance_id, stage_id);
CREATE INDEX IF NOT EXISTS workflow_configuration_audit_entity_idx
  ON workflow_configuration_audit_events (organization_id, entity_type, entity_id, created_at);

CREATE OR REPLACE FUNCTION prevent_active_workflow_version_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status = 'ACTIVE' THEN
    RAISE EXCEPTION 'Activated workflow versions are immutable';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workflow_versions_immutable_after_activation ON workflow_versions;
CREATE TRIGGER workflow_versions_immutable_after_activation
BEFORE UPDATE OR DELETE ON workflow_versions
FOR EACH ROW
EXECUTE FUNCTION prevent_active_workflow_version_mutation();

ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE workflow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances FORCE ROW LEVEL SECURITY;
ALTER TABLE workflow_instance_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instance_transitions FORCE ROW LEVEL SECURITY;
ALTER TABLE workflow_approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_approval_records FORCE ROW LEVEL SECURITY;
ALTER TABLE workflow_configuration_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_configuration_audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workflow_definitions_select_policy ON workflow_definitions;
CREATE POLICY workflow_definitions_select_policy ON workflow_definitions
FOR SELECT USING (organization_id = workflow_current_organization_id());

DROP POLICY IF EXISTS workflow_definitions_write_policy ON workflow_definitions;
CREATE POLICY workflow_definitions_write_policy ON workflow_definitions
FOR ALL
USING (
  organization_id = workflow_current_organization_id()
  AND (has_role('PLATFORM_CREATOR') OR has_role('ADMIN'))
)
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND (has_role('PLATFORM_CREATOR') OR has_role('ADMIN'))
);

DROP POLICY IF EXISTS workflow_versions_select_policy ON workflow_versions;
CREATE POLICY workflow_versions_select_policy ON workflow_versions
FOR SELECT USING (organization_id = workflow_current_organization_id());

DROP POLICY IF EXISTS workflow_versions_write_policy ON workflow_versions;
CREATE POLICY workflow_versions_write_policy ON workflow_versions
FOR ALL
USING (
  organization_id = workflow_current_organization_id()
  AND (has_role('PLATFORM_CREATOR') OR has_role('ADMIN'))
)
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND (has_role('PLATFORM_CREATOR') OR has_role('ADMIN'))
);

DROP POLICY IF EXISTS workflow_instances_select_policy ON workflow_instances;
CREATE POLICY workflow_instances_select_policy ON workflow_instances
FOR SELECT USING (organization_id = workflow_current_organization_id());

DROP POLICY IF EXISTS workflow_instances_write_policy ON workflow_instances;
CREATE POLICY workflow_instances_write_policy ON workflow_instances
FOR ALL
USING (
  organization_id = workflow_current_organization_id()
  AND (
    has_role('PLATFORM_CREATOR') OR has_role('ADMIN') OR has_role('EDITOR')
    OR has_role('REVIEWER') OR has_role('TRANSLATOR') OR has_role('DESIGNER')
    OR has_role('AUTHOR') OR has_role('COLLABORATOR')
  )
)
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND (
    has_role('PLATFORM_CREATOR') OR has_role('ADMIN') OR has_role('EDITOR')
    OR has_role('REVIEWER') OR has_role('TRANSLATOR') OR has_role('DESIGNER')
    OR has_role('AUTHOR') OR has_role('COLLABORATOR')
  )
  AND updated_by = workflow_current_user_id()
);

DROP POLICY IF EXISTS workflow_instance_transitions_select_policy ON workflow_instance_transitions;
CREATE POLICY workflow_instance_transitions_select_policy ON workflow_instance_transitions
FOR SELECT USING (organization_id = workflow_current_organization_id());

DROP POLICY IF EXISTS workflow_instance_transitions_insert_policy ON workflow_instance_transitions;
CREATE POLICY workflow_instance_transitions_insert_policy ON workflow_instance_transitions
FOR INSERT WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND actor_id = workflow_current_user_id()
);

DROP POLICY IF EXISTS workflow_approval_records_select_policy ON workflow_approval_records;
CREATE POLICY workflow_approval_records_select_policy ON workflow_approval_records
FOR SELECT USING (organization_id = workflow_current_organization_id());

DROP POLICY IF EXISTS workflow_approval_records_insert_policy ON workflow_approval_records;
CREATE POLICY workflow_approval_records_insert_policy ON workflow_approval_records
FOR INSERT WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND actor_id = workflow_current_user_id()
  AND NOT has_role('AI_AGENT')
  AND NOT has_role('SYSTEM')
);

DROP POLICY IF EXISTS workflow_configuration_audit_select_policy ON workflow_configuration_audit_events;
CREATE POLICY workflow_configuration_audit_select_policy ON workflow_configuration_audit_events
FOR SELECT USING (
  organization_id = workflow_current_organization_id()
  AND (has_role('PLATFORM_CREATOR') OR has_role('ADMIN') OR has_role('REVIEWER'))
);

DROP POLICY IF EXISTS workflow_configuration_audit_insert_policy ON workflow_configuration_audit_events;
CREATE POLICY workflow_configuration_audit_insert_policy ON workflow_configuration_audit_events
FOR INSERT WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND actor_id = workflow_current_user_id()
);
