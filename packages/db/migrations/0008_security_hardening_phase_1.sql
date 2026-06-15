-- Security Hardening Phase 1
-- Application security and staging infrastructure support only.

CREATE TABLE IF NOT EXISTS auth_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  failure_count integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS auth_security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  email text,
  event_type text NOT NULL CHECK (
    event_type IN (
      'LOGIN_FAILED',
      'ACCOUNT_LOCKED',
      'LOGIN_LOCKED',
      'SESSION_EXPIRED',
      'SESSION_IDLE_TIMEOUT'
    )
  ),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE auth_sessions
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;

UPDATE auth_sessions
SET
  expires_at = COALESCE(expires_at, created_at + interval '8 hours'),
  last_seen_at = COALESCE(last_seen_at, created_at)
WHERE expires_at IS NULL
   OR last_seen_at IS NULL;

ALTER TABLE auth_sessions
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '8 hours');

ALTER TABLE auth_sessions
  ALTER COLUMN last_seen_at SET DEFAULT now();

CREATE INDEX IF NOT EXISTS auth_login_attempts_lookup_idx
  ON auth_login_attempts (email, locked_until);

CREATE INDEX IF NOT EXISTS auth_security_events_lookup_idx
  ON auth_security_events (organization_id, user_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS auth_sessions_expiration_idx
  ON auth_sessions (organization_id, user_id, expires_at, last_seen_at);
