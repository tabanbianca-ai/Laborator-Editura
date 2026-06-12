-- Translation Memory v1
-- Requires the application role model to provide:
--   has_role(role_name text) returns boolean
-- and per-request settings:
--   app.current_user_id
--   app.current_organization_id

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'translation_memory_approval_status') THEN
    CREATE TYPE translation_memory_approval_status AS ENUM (
      'PENDING',
      'APPROVED',
      'REJECTED',
      'ARCHIVED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'translation_memory_origin') THEN
    CREATE TYPE translation_memory_origin AS ENUM (
      'HUMAN',
      'AI',
      'IMPORT'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'translation_memory_audit_action') THEN
    CREATE TYPE translation_memory_audit_action AS ENUM (
      'CREATE',
      'UPDATE',
      'APPROVE'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION translation_memory_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION translation_memory_current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE TABLE IF NOT EXISTS translation_memory_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  project_id uuid,
  document_id uuid,
  source_segment_id text,
  source_text text NOT NULL,
  target_text text NOT NULL,
  normalized_source_text text GENERATED ALWAYS AS (
    lower(regexp_replace(btrim(source_text), '[[:space:]]+', ' ', 'g'))
  ) STORED,
  source_language varchar(16) NOT NULL,
  target_language varchar(16) NOT NULL,
  domain text,
  confidence_score numeric(5, 4) NOT NULL DEFAULT 1.0000,
  approval_status translation_memory_approval_status NOT NULL DEFAULT 'PENDING',
  origin translation_memory_origin NOT NULL DEFAULT 'HUMAN',
  created_by uuid NOT NULL,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT translation_memory_confidence_score_range
    CHECK (confidence_score >= 0 AND confidence_score <= 1),
  CONSTRAINT translation_memory_approved_fields
    CHECK (
      (approval_status = 'APPROVED' AND approved_by IS NOT NULL AND approved_at IS NOT NULL)
      OR approval_status <> 'APPROVED'
    )
);

CREATE INDEX IF NOT EXISTS translation_memory_entries_lookup_idx
  ON translation_memory_entries (
    organization_id,
    source_language,
    target_language,
    domain,
    approval_status
  );

CREATE INDEX IF NOT EXISTS translation_memory_entries_project_idx
  ON translation_memory_entries (organization_id, project_id, document_id);

CREATE INDEX IF NOT EXISTS translation_memory_entries_source_trgm_idx
  ON translation_memory_entries
  USING gin (normalized_source_text gin_trgm_ops);

CREATE TABLE IF NOT EXISTS translation_memory_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  tm_entry_id uuid NOT NULL REFERENCES translation_memory_entries(id) ON DELETE CASCADE,
  action translation_memory_audit_action NOT NULL,
  actor_id uuid NOT NULL,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS translation_memory_audit_events_entry_idx
  ON translation_memory_audit_events (organization_id, tm_entry_id, created_at DESC);

CREATE OR REPLACE FUNCTION translation_memory_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS translation_memory_entries_set_updated_at
  ON translation_memory_entries;

CREATE TRIGGER translation_memory_entries_set_updated_at
BEFORE UPDATE ON translation_memory_entries
FOR EACH ROW
EXECUTE FUNCTION translation_memory_set_updated_at();

ALTER TABLE translation_memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_memory_entries FORCE ROW LEVEL SECURITY;

ALTER TABLE translation_memory_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_memory_audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS translation_memory_entries_select_policy
  ON translation_memory_entries;

CREATE POLICY translation_memory_entries_select_policy
ON translation_memory_entries
FOR SELECT
USING (
  organization_id = translation_memory_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS translation_memory_entries_insert_policy
  ON translation_memory_entries;

CREATE POLICY translation_memory_entries_insert_policy
ON translation_memory_entries
FOR INSERT
WITH CHECK (
  organization_id = translation_memory_current_organization_id()
  AND created_by = translation_memory_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS translation_memory_entries_update_policy
  ON translation_memory_entries;

CREATE POLICY translation_memory_entries_update_policy
ON translation_memory_entries
FOR UPDATE
USING (
  organization_id = translation_memory_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
)
WITH CHECK (
  organization_id = translation_memory_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS translation_memory_audit_select_policy
  ON translation_memory_audit_events;

CREATE POLICY translation_memory_audit_select_policy
ON translation_memory_audit_events
FOR SELECT
USING (
  organization_id = translation_memory_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS translation_memory_audit_insert_policy
  ON translation_memory_audit_events;

CREATE POLICY translation_memory_audit_insert_policy
ON translation_memory_audit_events
FOR INSERT
WITH CHECK (
  organization_id = translation_memory_current_organization_id()
  AND actor_id = translation_memory_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

CREATE OR REPLACE FUNCTION search_translation_memory_matches(
  p_source_text text,
  p_source_language varchar,
  p_target_language varchar,
  p_domain text DEFAULT NULL,
  p_limit integer DEFAULT 10,
  p_similarity_threshold numeric DEFAULT 0.2
)
RETURNS TABLE (
  id uuid,
  source_text text,
  target_text text,
  source_language varchar,
  target_language varchar,
  domain text,
  confidence_score numeric,
  similarity_score real,
  project_id uuid,
  document_id uuid,
  created_by uuid,
  created_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  WITH query AS (
    SELECT lower(regexp_replace(btrim(p_source_text), '[[:space:]]+', ' ', 'g')) AS normalized
  )
  SELECT
    tm.id,
    tm.source_text,
    tm.target_text,
    tm.source_language,
    tm.target_language,
    tm.domain,
    tm.confidence_score,
    similarity(tm.normalized_source_text, query.normalized) AS similarity_score,
    tm.project_id,
    tm.document_id,
    tm.created_by,
    tm.created_at
  FROM translation_memory_entries tm
  CROSS JOIN query
  WHERE tm.organization_id = translation_memory_current_organization_id()
    AND tm.approval_status = 'APPROVED'
    AND tm.source_language = p_source_language
    AND tm.target_language = p_target_language
    AND (p_domain IS NULL OR tm.domain = p_domain)
    AND similarity(tm.normalized_source_text, query.normalized) >= p_similarity_threshold
    AND (
      has_role('ADMIN')
      OR has_role('REVIEWER')
      OR has_role('TRANSLATOR')
      OR has_role('VIEWER')
    )
  ORDER BY similarity_score DESC, tm.confidence_score DESC, tm.created_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 50);
$$;
