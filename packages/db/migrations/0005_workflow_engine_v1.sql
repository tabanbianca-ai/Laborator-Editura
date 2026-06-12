-- Workflow Engine v1
-- Requires the application role model to provide:
--   has_role(role_name text) returns boolean
-- and per-request settings:
--   app.current_user_id
--   app.current_organization_id

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_scope') THEN
    CREATE TYPE workflow_scope AS ENUM (
      'DOCUMENT',
      'SEGMENT'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_status') THEN
    CREATE TYPE workflow_status AS ENUM (
      'DRAFT',
      'IN_TRANSLATION',
      'IN_QA',
      'IN_SEMANTIC_REVIEW',
      'IN_REVIEW',
      'APPROVED',
      'READY_FOR_EXPORT',
      'EXPORTED',
      'BLOCKED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_audit_action') THEN
    CREATE TYPE workflow_audit_action AS ENUM (
      'WORKFLOW_STARTED',
      'WORKFLOW_ADVANCED',
      'WORKFLOW_BLOCKED',
      'WORKFLOW_UNBLOCKED',
      'DOCUMENT_APPROVED',
      'READY_FOR_EXPORT',
      'DOCUMENT_EXPORTED'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION workflow_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION workflow_current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE TABLE IF NOT EXISTS workflow_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  project_id uuid,
  document_id uuid NOT NULL,
  segment_id text,
  scope workflow_scope NOT NULL,
  status workflow_status NOT NULL DEFAULT 'DRAFT',
  previous_status workflow_status,
  blocked_reason text,
  approved_by uuid,
  approved_at timestamptz,
  exported_by uuid,
  exported_at timestamptz,
  created_by uuid NOT NULL,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT workflow_states_scope_target CHECK (
    (scope = 'DOCUMENT' AND segment_id IS NULL)
    OR (scope = 'SEGMENT' AND segment_id IS NOT NULL)
  ),
  CONSTRAINT workflow_states_blocked_reason CHECK (
    (status = 'BLOCKED' AND blocked_reason IS NOT NULL)
    OR status <> 'BLOCKED'
  ),
  CONSTRAINT workflow_states_approval_fields CHECK (
    (status IN ('APPROVED', 'READY_FOR_EXPORT', 'EXPORTED') AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
    OR status NOT IN ('APPROVED', 'READY_FOR_EXPORT', 'EXPORTED')
  ),
  CONSTRAINT workflow_states_export_fields CHECK (
    (status = 'EXPORTED' AND exported_by IS NOT NULL AND exported_at IS NOT NULL)
    OR status <> 'EXPORTED'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS workflow_states_document_unique_idx
  ON workflow_states (organization_id, document_id)
  WHERE scope = 'DOCUMENT';

CREATE UNIQUE INDEX IF NOT EXISTS workflow_states_segment_unique_idx
  ON workflow_states (organization_id, document_id, segment_id)
  WHERE scope = 'SEGMENT';

CREATE INDEX IF NOT EXISTS workflow_states_lookup_idx
  ON workflow_states (organization_id, project_id, document_id, segment_id, scope, status);

CREATE TABLE IF NOT EXISTS workflow_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_state_id uuid NOT NULL REFERENCES workflow_states(id) ON DELETE CASCADE,
  project_id uuid,
  document_id uuid NOT NULL,
  segment_id text,
  scope workflow_scope NOT NULL,
  from_status workflow_status,
  to_status workflow_status NOT NULL,
  action workflow_audit_action NOT NULL,
  reason text,
  actor_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS workflow_transitions_lookup_idx
  ON workflow_transitions (
    organization_id,
    workflow_state_id,
    document_id,
    segment_id,
    created_at DESC
  );

CREATE TABLE IF NOT EXISTS workflow_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workflow_state_id uuid REFERENCES workflow_states(id) ON DELETE CASCADE,
  workflow_transition_id uuid REFERENCES workflow_transitions(id) ON DELETE CASCADE,
  action workflow_audit_action NOT NULL,
  actor_id uuid NOT NULL,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workflow_audit_events_lookup_idx
  ON workflow_audit_events (
    organization_id,
    workflow_state_id,
    workflow_transition_id,
    created_at DESC
  );

ALTER TABLE workflow_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_states FORCE ROW LEVEL SECURITY;

ALTER TABLE workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_transitions FORCE ROW LEVEL SECURITY;

ALTER TABLE workflow_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workflow_states_select_policy ON workflow_states;

CREATE POLICY workflow_states_select_policy
ON workflow_states
FOR SELECT
USING (
  organization_id = workflow_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS workflow_states_insert_policy ON workflow_states;

CREATE POLICY workflow_states_insert_policy
ON workflow_states
FOR INSERT
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND created_by = workflow_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS workflow_states_update_policy ON workflow_states;

CREATE POLICY workflow_states_update_policy
ON workflow_states
FOR UPDATE
USING (
  organization_id = workflow_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
)
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND (
    (
      status NOT IN ('APPROVED', 'READY_FOR_EXPORT', 'EXPORTED')
      AND (
        has_role('ADMIN')
        OR has_role('REVIEWER')
        OR has_role('TRANSLATOR')
      )
    )
    OR (
      status IN ('APPROVED', 'READY_FOR_EXPORT', 'EXPORTED')
      AND (
        has_role('ADMIN')
        OR has_role('REVIEWER')
      )
    )
  )
);

DROP POLICY IF EXISTS workflow_transitions_select_policy ON workflow_transitions;

CREATE POLICY workflow_transitions_select_policy
ON workflow_transitions
FOR SELECT
USING (
  organization_id = workflow_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS workflow_transitions_insert_policy ON workflow_transitions;

CREATE POLICY workflow_transitions_insert_policy
ON workflow_transitions
FOR INSERT
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND actor_id = workflow_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS workflow_audit_select_policy ON workflow_audit_events;

CREATE POLICY workflow_audit_select_policy
ON workflow_audit_events
FOR SELECT
USING (
  organization_id = workflow_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS workflow_audit_insert_policy ON workflow_audit_events;

CREATE POLICY workflow_audit_insert_policy
ON workflow_audit_events
FOR INSERT
WITH CHECK (
  organization_id = workflow_current_organization_id()
  AND actor_id = workflow_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);
