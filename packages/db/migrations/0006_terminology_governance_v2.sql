-- Terminology Governance v2
-- Extends Terminology, QA, and export workflow guards with terminology quality
-- metadata. AI may propose terminology, but only authorized human roles may
-- validate, suspend, archive, or reject terms.

DO $$
BEGIN
  ALTER TYPE terminology_term_status ADD VALUE IF NOT EXISTS 'REJECTED';
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END
$$;

DO $$
BEGIN
  ALTER TYPE terminology_audit_action ADD VALUE IF NOT EXISTS 'EVALUATE';
  ALTER TYPE terminology_audit_action ADD VALUE IF NOT EXISTS 'MARK_UNDER_REVIEW';
  ALTER TYPE terminology_audit_action ADD VALUE IF NOT EXISTS 'REJECT';
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END
$$;

DO $$
BEGIN
  ALTER TYPE qa_issue_type ADD VALUE IF NOT EXISTS 'TERMINOLOGY_DIACRITICS';
  ALTER TYPE qa_issue_type ADD VALUE IF NOT EXISTS 'REJECTED_TERMINOLOGY';
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END
$$;

ALTER TABLE terminology_terms
  ADD COLUMN IF NOT EXISTS quality_score numeric(5, 2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS quality_level text NOT NULL DEFAULT 'REVIEW_REQUIRED',
  ADD COLUMN IF NOT EXISTS orthographic_validation_status text NOT NULL DEFAULT 'NOT_APPLICABLE',
  ADD COLUMN IF NOT EXISTS diacritics_validation_status text NOT NULL DEFAULT 'NOT_APPLICABLE',
  ADD COLUMN IF NOT EXISTS source_validation_status text NOT NULL DEFAULT 'MISSING_APPROVED_SOURCE',
  ADD COLUMN IF NOT EXISTS governance_decision_status text NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS reference_sources text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS glossary_present boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS editorial_approval boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS historical_usage_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS evaluated_by uuid,
  ADD COLUMN IF NOT EXISTS rejected_by uuid,
  ADD COLUMN IF NOT EXISTS evaluated_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

UPDATE terminology_terms
SET
  glossary_present = CASE
    WHEN source::text = 'GLOSSARY' THEN true
    ELSE glossary_present
  END,
  source_validation_status = CASE
    WHEN source::text IN ('DICTIONARY', 'GLOSSARY', 'CORPUS', 'EDITORIAL_DECISION', 'IMPORT')
      OR array_length(reference_sources, 1) IS NOT NULL
      THEN 'APPROVED_SOURCE'
    ELSE 'MISSING_APPROVED_SOURCE'
  END
WHERE source_validation_status = 'MISSING_APPROVED_SOURCE';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'terminology_quality_score_range'
  ) THEN
    ALTER TABLE terminology_terms
      ADD CONSTRAINT terminology_quality_score_range
      CHECK (quality_score >= 0 AND quality_score <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'terminology_quality_level_values'
  ) THEN
    ALTER TABLE terminology_terms
      ADD CONSTRAINT terminology_quality_level_values
      CHECK (quality_level IN ('TRUSTED', 'ACCEPTABLE', 'REVIEW_REQUIRED', 'REJECTED'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'terminology_validation_status_values'
  ) THEN
    ALTER TABLE terminology_terms
      ADD CONSTRAINT terminology_validation_status_values
      CHECK (
        orthographic_validation_status IN ('PASSED', 'FAILED', 'NOT_APPLICABLE')
        AND diacritics_validation_status IN ('PASSED', 'FAILED', 'NOT_APPLICABLE')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'terminology_source_validation_status_values'
  ) THEN
    ALTER TABLE terminology_terms
      ADD CONSTRAINT terminology_source_validation_status_values
      CHECK (source_validation_status IN ('APPROVED_SOURCE', 'MISSING_APPROVED_SOURCE'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'terminology_governance_decision_status_values'
  ) THEN
    ALTER TABLE terminology_terms
      ADD CONSTRAINT terminology_governance_decision_status_values
      CHECK (
        governance_decision_status IN (
          'PENDING',
          'UNDER_REVIEW',
          'VALIDATED',
          'REJECTED',
          'SUSPENDED',
          'ARCHIVED'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'terminology_rejected_fields'
  ) THEN
    ALTER TABLE terminology_terms
      ADD CONSTRAINT terminology_rejected_fields
      CHECK (
        (status::text = 'REJECTED' AND rejected_by IS NOT NULL AND rejected_at IS NOT NULL)
        OR status::text <> 'REJECTED'
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS terminology_governance_review_idx
  ON terminology_terms (
    organization_id,
    governance_decision_status,
    quality_level,
    orthographic_validation_status,
    diacritics_validation_status,
    source_validation_status
  );

CREATE INDEX IF NOT EXISTS qa_issues_terminology_blockers_idx
  ON qa_issues (organization_id, document_id, segment_id, status, severity, type)
  WHERE type::text IN (
    'TERMINOLOGY_VIOLATION',
    'FORBIDDEN_TERMINOLOGY_VARIANT',
    'TERMINOLOGY_DIACRITICS',
    'REJECTED_TERMINOLOGY'
  );
