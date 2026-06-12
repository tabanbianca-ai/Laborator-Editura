-- MVP Foundation v1
-- Provides the operational blockers needed before backend/core validation:
-- authentication identity, organizations, projects, documents, segments,
-- translation persistence, export artifacts, and the shared has_role() model.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mvp_role') THEN
    CREATE TYPE mvp_role AS ENUM (
      'ADMIN',
      'REVIEWER',
      'TRANSLATOR',
      'VIEWER'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM (
      'ACTIVE',
      'ARCHIVED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM (
      'DRAFT',
      'IN_TRANSLATION',
      'IN_REVIEW',
      'APPROVED',
      'EXPORTED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'segment_status') THEN
    CREATE TYPE segment_status AS ENUM (
      'NEW',
      'IN_TRANSLATION',
      'TRANSLATED',
      'IN_REVIEW',
      'APPROVED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'translation_status') THEN
    CREATE TYPE translation_status AS ENUM (
      'DRAFT',
      'SUBMITTED',
      'VALIDATED',
      'APPROVED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'export_format') THEN
    CREATE TYPE export_format AS ENUM (
      'JSON_MASTER'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'foundation_audit_action') THEN
    CREATE TYPE foundation_audit_action AS ENUM (
      'CREATE',
      'UPDATE',
      'DELETE',
      'APPROVE',
      'EXPORT'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION mvp_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION mvp_current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role mvp_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id, role)
);

CREATE OR REPLACE FUNCTION has_role(role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = mvp_current_user_id()
      AND organization_id = mvp_current_organization_id()
      AND role::text = upper(role_name)
  );
$$;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  roles mvp_role[] NOT NULL DEFAULT ARRAY[]::mvp_role[],
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  source_language text NOT NULL,
  target_languages text[] NOT NULL,
  domain text,
  status project_status NOT NULL DEFAULT 'ACTIVE',
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  source_language text NOT NULL,
  target_language text NOT NULL,
  document_type text NOT NULL DEFAULT 'text',
  status document_status NOT NULL DEFAULT 'DRAFT',
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS document_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  source_text text NOT NULL,
  source_language text NOT NULL,
  target_language text NOT NULL,
  segment_order integer NOT NULL,
  status segment_status NOT NULL DEFAULT 'NEW',
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (organization_id, document_id, segment_order)
);

CREATE TABLE IF NOT EXISTS segment_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES document_segments(id) ON DELETE CASCADE,
  target_text text NOT NULL,
  target_language text NOT NULL,
  status translation_status NOT NULL DEFAULT 'SUBMITTED',
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS export_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  format export_format NOT NULL DEFAULT 'JSON_MASTER',
  artifact jsonb NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS foundation_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES users(id),
  action foundation_audit_action NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS projects_lookup_idx
  ON projects (organization_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS documents_lookup_idx
  ON documents (organization_id, project_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS document_segments_lookup_idx
  ON document_segments (organization_id, project_id, document_id, segment_order);

CREATE INDEX IF NOT EXISTS segment_translations_lookup_idx
  ON segment_translations (organization_id, project_id, document_id, segment_id, created_at DESC);

CREATE INDEX IF NOT EXISTS export_artifacts_lookup_idx
  ON export_artifacts (organization_id, project_id, document_id, created_at DESC);

CREATE INDEX IF NOT EXISTS foundation_audit_events_lookup_idx
  ON foundation_audit_events (organization_id, entity_type, entity_id, created_at DESC);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles FORCE ROW LEVEL SECURITY;

ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions FORCE ROW LEVEL SECURITY;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

ALTER TABLE document_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_segments FORCE ROW LEVEL SECURITY;

ALTER TABLE segment_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment_translations FORCE ROW LEVEL SECURITY;

ALTER TABLE export_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_artifacts FORCE ROW LEVEL SECURITY;

ALTER TABLE foundation_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_audit_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_select_policy ON organizations;

CREATE POLICY organizations_select_policy
ON organizations
FOR SELECT
USING (
  id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS users_select_policy ON users;

CREATE POLICY users_select_policy
ON users
FOR SELECT
USING (
  id = mvp_current_user_id()
  OR has_role('ADMIN')
  OR has_role('REVIEWER')
);

DROP POLICY IF EXISTS user_roles_select_policy ON user_roles;

CREATE POLICY user_roles_select_policy
ON user_roles
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    user_id = mvp_current_user_id()
    OR has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS auth_sessions_select_policy ON auth_sessions;

CREATE POLICY auth_sessions_select_policy
ON auth_sessions
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND user_id = mvp_current_user_id()
);

DROP POLICY IF EXISTS tenant_select_projects_policy ON projects;

CREATE POLICY tenant_select_projects_policy
ON projects
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS tenant_write_projects_policy ON projects;

CREATE POLICY tenant_write_projects_policy
ON projects
FOR ALL
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND created_by = mvp_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS tenant_select_documents_policy ON documents;

CREATE POLICY tenant_select_documents_policy
ON documents
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS tenant_write_documents_policy ON documents;

CREATE POLICY tenant_write_documents_policy
ON documents
FOR ALL
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND created_by = mvp_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS tenant_select_segments_policy ON document_segments;

CREATE POLICY tenant_select_segments_policy
ON document_segments
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS tenant_write_segments_policy ON document_segments;

CREATE POLICY tenant_write_segments_policy
ON document_segments
FOR ALL
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND created_by = mvp_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS tenant_select_translations_policy ON segment_translations;

CREATE POLICY tenant_select_translations_policy
ON segment_translations
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS tenant_write_translations_policy ON segment_translations;

CREATE POLICY tenant_write_translations_policy
ON segment_translations
FOR ALL
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND created_by = mvp_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);

DROP POLICY IF EXISTS tenant_select_exports_policy ON export_artifacts;

CREATE POLICY tenant_select_exports_policy
ON export_artifacts
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS tenant_write_exports_policy ON export_artifacts;

CREATE POLICY tenant_write_exports_policy
ON export_artifacts
FOR ALL
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND created_by = mvp_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS tenant_select_foundation_audit_policy ON foundation_audit_events;

CREATE POLICY tenant_select_foundation_audit_policy
ON foundation_audit_events
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
    OR has_role('VIEWER')
  )
);

DROP POLICY IF EXISTS tenant_write_foundation_audit_policy ON foundation_audit_events;

CREATE POLICY tenant_write_foundation_audit_policy
ON foundation_audit_events
FOR INSERT
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND actor_id = mvp_current_user_id()
  AND (
    has_role('ADMIN')
    OR has_role('REVIEWER')
    OR has_role('TRANSLATOR')
  )
);
