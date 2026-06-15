-- Founder Protection v1
-- Protects tenant ownership, supports founder recovery, and records
-- accepted founder ownership transfers without trusting client-provided roles.

CREATE TABLE IF NOT EXISTS organization_founder_protection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  founder_user_id uuid NOT NULL REFERENCES users(id),
  protection_status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (protection_status IN ('ACTIVE', 'TRANSFER_PENDING')),
  recovery_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (organization_id)
);

CREATE TABLE IF NOT EXISTS founder_ownership_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  from_founder_user_id uuid NOT NULL REFERENCES users(id),
  to_founder_user_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'ACCEPTED', 'CANCELLED')),
  requested_by uuid NOT NULL REFERENCES users(id),
  accepted_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  completed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO organization_founder_protection (
  organization_id,
  founder_user_id,
  protection_status,
  recovery_enabled
)
SELECT
  organizations.id,
  seed_roles.user_id,
  'ACTIVE',
  true
FROM organizations
JOIN LATERAL (
  SELECT user_roles.user_id
  FROM user_roles
  WHERE user_roles.organization_id = organizations.id
  ORDER BY user_roles.created_at ASC, user_roles.id ASC
  LIMIT 1
) AS seed_roles ON true
ON CONFLICT (organization_id) DO NOTHING;

CREATE OR REPLACE FUNCTION is_current_founder()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_founder_protection
    WHERE organization_id = mvp_current_organization_id()
      AND founder_user_id = mvp_current_user_id()
      AND protection_status IN ('ACTIVE', 'TRANSFER_PENDING')
  );
$$;

CREATE INDEX IF NOT EXISTS organization_founder_protection_lookup_idx
  ON organization_founder_protection (organization_id, founder_user_id, protection_status);

CREATE INDEX IF NOT EXISTS founder_ownership_transfers_lookup_idx
  ON founder_ownership_transfers (organization_id, status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS founder_ownership_transfers_one_pending_idx
  ON founder_ownership_transfers (organization_id)
  WHERE status = 'PENDING';

ALTER TABLE organization_founder_protection ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_founder_protection FORCE ROW LEVEL SECURITY;

ALTER TABLE founder_ownership_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_ownership_transfers FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS founder_protection_select_policy ON organization_founder_protection;

CREATE POLICY founder_protection_select_policy
ON organization_founder_protection
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    is_current_founder()
    OR has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS founder_protection_insert_policy ON organization_founder_protection;

CREATE POLICY founder_protection_insert_policy
ON organization_founder_protection
FOR INSERT
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND founder_user_id = mvp_current_user_id()
);

DROP POLICY IF EXISTS founder_protection_update_policy ON organization_founder_protection;

CREATE POLICY founder_protection_update_policy
ON organization_founder_protection
FOR UPDATE
USING (
  organization_id = mvp_current_organization_id()
  AND (
    is_current_founder()
    OR EXISTS (
      SELECT 1
      FROM founder_ownership_transfers
      WHERE founder_ownership_transfers.organization_id = mvp_current_organization_id()
        AND founder_ownership_transfers.status = 'PENDING'
        AND founder_ownership_transfers.to_founder_user_id = mvp_current_user_id()
        AND founder_ownership_transfers.expires_at > now()
    )
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
);

DROP POLICY IF EXISTS founder_ownership_transfers_select_policy ON founder_ownership_transfers;

CREATE POLICY founder_ownership_transfers_select_policy
ON founder_ownership_transfers
FOR SELECT
USING (
  organization_id = mvp_current_organization_id()
  AND (
    from_founder_user_id = mvp_current_user_id()
    OR to_founder_user_id = mvp_current_user_id()
    OR has_role('ADMIN')
    OR has_role('REVIEWER')
  )
);

DROP POLICY IF EXISTS founder_ownership_transfers_insert_policy ON founder_ownership_transfers;

CREATE POLICY founder_ownership_transfers_insert_policy
ON founder_ownership_transfers
FOR INSERT
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND from_founder_user_id = mvp_current_user_id()
  AND requested_by = mvp_current_user_id()
  AND is_current_founder()
);

DROP POLICY IF EXISTS founder_ownership_transfers_update_policy ON founder_ownership_transfers;

CREATE POLICY founder_ownership_transfers_update_policy
ON founder_ownership_transfers
FOR UPDATE
USING (
  organization_id = mvp_current_organization_id()
  AND (
    from_founder_user_id = mvp_current_user_id()
    OR to_founder_user_id = mvp_current_user_id()
  )
)
WITH CHECK (
  organization_id = mvp_current_organization_id()
  AND (
    from_founder_user_id = mvp_current_user_id()
    OR to_founder_user_id = mvp_current_user_id()
  )
);
