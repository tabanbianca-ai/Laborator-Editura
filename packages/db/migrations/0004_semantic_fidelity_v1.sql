-- Semantic Fidelity Engine v1
-- Requires the application role model to provide:
--   has_role(role_name text) returns boolean
-- and per-request settings:
--   app.current_user_id
--   app.current_organization_id

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'semantic_fidelity_report_scope') THEN
    CREATE TYPE semantic_fidelity_report_scope AS ENUM (
      'SEGMENT',
      'DOCUMENT'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'semantic_fidelity_report_status') THEN
    CREATE TYPE semantic_fidelity_report_status AS ENUM (
      'COMPLETED',
      'FAILED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'semantic_fidelity_issue_type') THEN
    CREATE TYPE semantic_fidelity_issue_type AS ENUM (
      'MEANING_DRIFT',
      'UNJUSTIFIED_REINTERPRETATION',
      'OMITTED_MEANING',
      'ADDED_MEANING',
      'TERMINOLOGY_MEANING_CONFLICT',
      'CONTEXT_MISMATCH'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'semantic_fidelity_risk_level') THEN
    CREATE TYPE semantic_fidelity_risk_level AS ENUM (
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'semantic_fidelity_issue_status') THEN
    CREATE TYPE semantic_fidelity_issue_status AS ENUM (
      'OPEN',
      'RESOLVED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'semantic_fidelity_audit_action') THEN
    CREATE TYPE semantic_fidelity_audit_action AS ENUM (
      'SEMANTIC_CHECK',
      'ISSUE_CREATED',
      'ISSUE_RESOLVED',
      'SCORE_RECALCULATED'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION semantic_fidelity_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION semantic_fidelity_current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE TABLE IF NOT EXISTS semantic_fidelity_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  project_id uuid,
  document_id uuid,
  segment_id text,
  scope semantic_fidelity_report_scope NOT NULL,
  status semantic_fidelity_report_status NOT NULL DEFAULT 'COMPLETED',
  score numeric(5, 2) NOT NULL DEFAULT 100.00,
  risk_level semantic_fidelity_risk_level NOT NULL DEFAULT 'LOW',
  issue_count integer NOT NULL DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT semantic_fidelity_reports_score_range CHECK (score >= 0 AND score <= 100),
  CONSTRAINT semantic_fidelity_reports_scope_target CHECK (
    (scope = 'SEGMENT' AND segment_id IS NOT NULL)
    OR (scope = 'DOCUMENT' AND document_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS semantic_fidelity_reports_lookup_idx
  ON semantic_fidelity_reports (
    organization_id,
    project_id,
    document_id,
    segment_id,
    scope,
    created_at DESC
  );

CREATE TABLE IF NOT EXISTS semantic_fidelity_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  semantic_report_id uuid NOT NULL REFERENCES semantic_fidelity_reports(id) ON DELETE CASCADE,
  project_id uuid,
  document_id uuid,
  segment_id text,
  type semantic_fidelity_issue_type NOT NULL,
  risk_level semantic_fidelity_risk_level NOT NULL,
  status semantic_fidelity_issue_status NOT NULL DEFAULT 'OPEN',
  message text NOT NULL,
  source_text text,
  target_text text,
  terminology_term_id uuid,
  translation_memory_entry_id uuid,
  qa_issue_id uuid,
  ai_explanation text,
  alternatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT semantic_fidelity_issues_resolved_fields CHECK (
    (status = 'RESOLVED' AND resolved_by IS NOT NULL AND resolved_at IS NOT NULL)
    OR status <> 'RESOLVED'
  )
);

CREATE INDEX IF NOT EXISTS semantic_fidelity_issues_lookup_idx
  ON semantic_fidelity_issues (
    organization_id,
    project_id,
    document_id,
    segment_id,
    status,
    risk_level
  );

CREATE INDEX IF NOT EXISTS semantic_fidelity_issues_report_idx
  ON semantic_fidelity_issues (organization_id, semantic_report_id, created_at DESC);

CREATE TABLE IF NOT EXISTS semantic_fidelity_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  semantic_report_id uuid REFERENCES semantic_fidelity_reports(id) ON DELETE CASCADE,
  semantic_issue_id uuid REFERENCES semantic_fidelity_issues(id) ON DELETE CASCADE,
  action semantic_fidelity_audit_action NOT NULL,
  actor_id uuid NOT NULL,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS semantic_fidelity_audit_events_lookup_idx
  ON semantic_fidelity_audit_events (
    organization_id,
    semantic_report_id,
    semantic_issue_id,
    created_at DESC
  );

ALTER TABLE semantic_fidelity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_fidelity_reports FORCE ROW LEVEL SECURITY;

ALTER TABLE semantic_fidelity_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_fidelity_issues FORCE ROW LEVEL SECURITY;

ALTER TABLE semantic_fidelity_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_fidelity_audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS semantic_fidelity_reports_select_policy ON semantic_fidelity_reports;

CREATE POLICY semantic_fidelity_reports_select_policy
ON semantic_fidelity_reports
FOR SELECT
USING (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_reports_insert_policy ON semantic_fidelity_reports;

CREATE POLICY semantic_fidelity_reports_insert_policy
ON semantic_fidelity_reports
FOR INSERT
WITH CHECK (
  organization_id = semantic_fidelity_current_organization_id()
  AND created_by = semantic_fidelity_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_reports_update_policy ON semantic_fidelity_reports;

CREATE POLICY semantic_fidelity_reports_update_policy
ON semantic_fidelity_reports
FOR UPDATE
USING (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
)
WITH CHECK (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_issues_select_policy ON semantic_fidelity_issues;

CREATE POLICY semantic_fidelity_issues_select_policy
ON semantic_fidelity_issues
FOR SELECT
USING (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_issues_insert_policy ON semantic_fidelity_issues;

CREATE POLICY semantic_fidelity_issues_insert_policy
ON semantic_fidelity_issues
FOR INSERT
WITH CHECK (
  organization_id = semantic_fidelity_current_organization_id()
  AND created_by = semantic_fidelity_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_issues_update_policy ON semantic_fidelity_issues;

CREATE POLICY semantic_fidelity_issues_update_policy
ON semantic_fidelity_issues
FOR UPDATE
USING (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
)
WITH CHECK (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_audit_select_policy ON semantic_fidelity_audit_events;

CREATE POLICY semantic_fidelity_audit_select_policy
ON semantic_fidelity_audit_events
FOR SELECT
USING (
  organization_id = semantic_fidelity_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS semantic_fidelity_audit_insert_policy ON semantic_fidelity_audit_events;

CREATE POLICY semantic_fidelity_audit_insert_policy
ON semantic_fidelity_audit_events
FOR INSERT
WITH CHECK (
  organization_id = semantic_fidelity_current_organization_id()
  AND actor_id = semantic_fidelity_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);
