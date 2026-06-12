-- Terminology & Glossary System v1
-- Requires the application role model to provide:
--   has_role(role_name text) returns boolean
-- and per-request settings:
--   app.current_user_id
--   app.current_organization_id

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'terminology_term_status') THEN
    CREATE TYPE terminology_term_status AS ENUM (
      'PROPOSED',
      'UNDER_REVIEW',
      'VALIDATED',
      'SUSPENDED',
      'ARCHIVED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'terminology_source') THEN
    CREATE TYPE terminology_source AS ENUM (
      'DICTIONARY',
      'GLOSSARY',
      'TRANSLATION_MEMORY',
      'CORPUS',
      'EDITORIAL_DECISION',
      'AI',
      'IMPORT'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'terminology_audit_action') THEN
    CREATE TYPE terminology_audit_action AS ENUM (
      'CREATE',
      'UPDATE',
      'VALIDATE',
      'SUSPEND',
      'ARCHIVE'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION terminology_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION terminology_current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE TABLE IF NOT EXISTS terminology_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  language varchar(16) NOT NULL,
  domain text,
  source terminology_source NOT NULL DEFAULT 'GLOSSARY',
  term text NOT NULL,
  normalized_term text GENERATED ALWAYS AS (
    lower(regexp_replace(btrim(term), '[[:space:]]+', ' ', 'g'))
  ) STORED,
  definition text,
  approved_translation text,
  forbidden_variants text[] NOT NULL DEFAULT ARRAY[]::text[],
  preferred_variants text[] NOT NULL DEFAULT ARRAY[]::text[],
  notes text,
  status terminology_term_status NOT NULL DEFAULT 'PROPOSED',
  created_by uuid NOT NULL,
  updated_by uuid,
  validated_by uuid,
  suspended_by uuid,
  archived_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  validated_at timestamptz,
  suspended_at timestamptz,
  archived_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT terminology_validated_requires_translation
    CHECK (
      status <> 'VALIDATED'
      OR approved_translation IS NOT NULL
      OR array_length(preferred_variants, 1) IS NOT NULL
    ),
  CONSTRAINT terminology_validated_fields
    CHECK (
      (status = 'VALIDATED' AND validated_by IS NOT NULL AND validated_at IS NOT NULL)
      OR status <> 'VALIDATED'
    ),
  CONSTRAINT terminology_suspended_fields
    CHECK (
      (status = 'SUSPENDED' AND suspended_by IS NOT NULL AND suspended_at IS NOT NULL)
      OR status <> 'SUSPENDED'
    ),
  CONSTRAINT terminology_archived_fields
    CHECK (
      (status = 'ARCHIVED' AND archived_by IS NOT NULL AND archived_at IS NOT NULL)
      OR status <> 'ARCHIVED'
    )
);

CREATE INDEX IF NOT EXISTS terminology_terms_lookup_idx
  ON terminology_terms (organization_id, language, domain, status);

CREATE INDEX IF NOT EXISTS terminology_terms_normalized_idx
  ON terminology_terms (organization_id, language, normalized_term);

CREATE INDEX IF NOT EXISTS terminology_terms_trgm_idx
  ON terminology_terms USING gin (normalized_term gin_trgm_ops);

CREATE TABLE IF NOT EXISTS terminology_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  term_id uuid NOT NULL REFERENCES terminology_terms(id) ON DELETE CASCADE,
  action terminology_audit_action NOT NULL,
  actor_id uuid NOT NULL,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS terminology_audit_events_term_idx
  ON terminology_audit_events (organization_id, term_id, created_at DESC);

CREATE OR REPLACE FUNCTION terminology_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS terminology_terms_set_updated_at
  ON terminology_terms;

CREATE TRIGGER terminology_terms_set_updated_at
BEFORE UPDATE ON terminology_terms
FOR EACH ROW
EXECUTE FUNCTION terminology_set_updated_at();

ALTER TABLE terminology_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminology_terms FORCE ROW LEVEL SECURITY;

ALTER TABLE terminology_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminology_audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS terminology_terms_select_policy
  ON terminology_terms;

CREATE POLICY terminology_terms_select_policy
ON terminology_terms
FOR SELECT
USING (
  organization_id = terminology_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS terminology_terms_insert_policy
  ON terminology_terms;

CREATE POLICY terminology_terms_insert_policy
ON terminology_terms
FOR INSERT
WITH CHECK (
  organization_id = terminology_current_organization_id()
  AND created_by = terminology_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS terminology_terms_update_policy
  ON terminology_terms;

CREATE POLICY terminology_terms_update_policy
ON terminology_terms
FOR UPDATE
USING (
  organization_id = terminology_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
)
WITH CHECK (
  organization_id = terminology_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS terminology_audit_select_policy
  ON terminology_audit_events;

CREATE POLICY terminology_audit_select_policy
ON terminology_audit_events
FOR SELECT
USING (
  organization_id = terminology_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS terminology_audit_insert_policy
  ON terminology_audit_events;

CREATE POLICY terminology_audit_insert_policy
ON terminology_audit_events
FOR INSERT
WITH CHECK (
  organization_id = terminology_current_organization_id()
  AND actor_id = terminology_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

CREATE OR REPLACE FUNCTION search_terminology_terms(
  p_language varchar,
  p_domain text DEFAULT NULL,
  p_status terminology_term_status DEFAULT NULL,
  p_query text DEFAULT NULL,
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  term text,
  language varchar,
  domain text,
  source terminology_source,
  definition text,
  approved_translation text,
  forbidden_variants text[],
  preferred_variants text[],
  notes text,
  status terminology_term_status,
  created_by uuid,
  created_at timestamptz,
  similarity_score real
)
LANGUAGE sql
STABLE
AS $$
  WITH query AS (
    SELECT lower(regexp_replace(btrim(COALESCE(p_query, '')), '[[:space:]]+', ' ', 'g')) AS normalized
  )
  SELECT
    term.id,
    term.term,
    term.language,
    term.domain,
    term.source,
    term.definition,
    term.approved_translation,
    term.forbidden_variants,
    term.preferred_variants,
    term.notes,
    term.status,
    term.created_by,
    term.created_at,
    CASE
      WHEN p_query IS NULL OR p_query = '' THEN 1
      ELSE similarity(term.normalized_term, query.normalized)
    END AS similarity_score
  FROM terminology_terms term
  CROSS JOIN query
  WHERE term.organization_id = terminology_current_organization_id()
    AND term.language = p_language
    AND (p_domain IS NULL OR term.domain = p_domain)
    AND (p_status IS NULL OR term.status = p_status)
    AND (
      p_query IS NULL
      OR p_query = ''
      OR term.normalized_term % query.normalized
      OR term.normalized_term LIKE '%' || query.normalized || '%'
    )
    AND (
      has_role('ADMIN')
      OR has_role('REVIEWER')
      OR has_role('TRANSLATOR')
      OR has_role('VIEWER')
    )
  ORDER BY
    CASE WHEN term.status = 'VALIDATED' THEN 0 ELSE 1 END,
    similarity_score DESC,
    term.created_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 100);
$$;
