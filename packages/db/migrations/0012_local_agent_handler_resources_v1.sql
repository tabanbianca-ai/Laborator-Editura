-- Resource-specific task inputs preserve all existing document tasks and audit.
ALTER TABLE ai_execution_records ALTER COLUMN document_id DROP NOT NULL;
ALTER TABLE ai_execution_records ADD COLUMN IF NOT EXISTS resource jsonb;
ALTER TABLE ai_execution_records ADD CONSTRAINT ai_task_resource_shape CHECK (
  (resource IS NULL AND document_id IS NOT NULL)
  OR (resource IS NOT NULL AND jsonb_typeof(resource) = 'object'
    AND resource ?& ARRAY['type', 'id']
    AND jsonb_typeof(resource->'type') = 'string'
    AND jsonb_typeof(resource->'id') = 'string'
    AND resource->>'type' IN ('PROJECT', 'DOCUMENT', 'MANUSCRIPT', 'LINGUISTIC_SOURCE')
    AND length(resource->>'id') BETWEEN 1 AND 120
    AND ((resource->>'type' = 'DOCUMENT' AND document_id IS NOT NULL AND resource->>'id' = document_id::text)
      OR (resource->>'type' <> 'DOCUMENT' AND document_id IS NULL)))
);
