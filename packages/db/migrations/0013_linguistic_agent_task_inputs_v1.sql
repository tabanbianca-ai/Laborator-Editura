-- Additive immutable request metadata; no content, activation, or financial authority.
ALTER TABLE ai_execution_records ADD COLUMN IF NOT EXISTS segment_id uuid;
ALTER TABLE ai_execution_records ADD COLUMN IF NOT EXISTS explicit_external_processing_authorization boolean;
ALTER TABLE ai_execution_records ADD CONSTRAINT ai_task_segment_document_required
  CHECK (segment_id IS NULL OR (document_id IS NOT NULL AND resource IS NOT NULL
    AND resource->>'type' = 'DOCUMENT'));
ALTER TABLE document_segments ADD CONSTRAINT document_segment_execution_scope
  UNIQUE (organization_id, project_id, document_id, id);
ALTER TABLE ai_execution_records ADD CONSTRAINT ai_task_segment_scope_reference
  FOREIGN KEY (organization_id, project_id, document_id, segment_id)
  REFERENCES document_segments (organization_id, project_id, document_id, id);
-- The existing identity/terminal/audit triggers and tenant RLS remain unchanged.
