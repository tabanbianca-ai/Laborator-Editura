-- Forward compatibility for already-migrated databases. Do not replay 0006 or
-- rewrite its recorded checksum. No data/enum/security semantics are changed.
-- A full lookup index avoids the non-IMMUTABLE enum-to-text partial predicate.
-- An existing valid historical index is preserved, not replaced or dropped.
CREATE INDEX IF NOT EXISTS qa_issues_terminology_blockers_idx
  ON qa_issues (organization_id, document_id, segment_id, status, severity, type);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid
      JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_am a ON a.oid=c.relam
    WHERE n.nspname=current_schema() AND c.relname='qa_issues_terminology_blockers_idx'
      AND i.indrelid='qa_issues'::regclass AND i.indisvalid AND i.indisready AND a.amname='btree'
      AND NOT i.indisunique AND i.indnkeyatts=6 AND i.indnatts=6
      AND (SELECT array_agg(att.attname::text ORDER BY key.ordinality)
        FROM unnest(i.indkey) WITH ORDINALITY AS key(attnum,ordinality)
        JOIN pg_attribute att ON att.attrelid=i.indrelid AND att.attnum=key.attnum)
        = ARRAY['organization_id','document_id','segment_id','status','severity','type']
  ) THEN RAISE EXCEPTION 'QA blocker index definition requires explicit review'; END IF;
END;
$$;
