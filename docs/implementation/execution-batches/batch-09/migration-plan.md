# Migration Plan

Batch 09 is additive.

Existing AI usage should be inventoried and classified as CANONICAL, LEGACY_AI, UNVERSIONED_PROMPT, DIRECT_PROVIDER_CALL, UNCONTROLLED_RAG, UNTRACKED_COST, RIGHTS_UNKNOWN, SECURITY_REVIEW_REQUIRED, or ORPHANED.

Canonical migration steps:

1. Register agent, provider, model, and prompt metadata.
2. Register knowledge sources and RAG collections only when eligible.
3. Add evaluation and regression profiles.
4. Route execution through the AI Orchestrator.
5. Preserve historical outputs as legacy assets until reviewed.

