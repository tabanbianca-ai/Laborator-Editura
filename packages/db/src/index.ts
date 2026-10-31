export interface DatabasePackageStatus {
  readyForPrisma: boolean;
  migrations: string[];
}

export const databasePackageStatus: DatabasePackageStatus = {
  readyForPrisma: true,
  migrations: [
    "0000_mvp_foundation_v1.sql",
    "0001_translation_memory_v1.sql",
    "0002_terminology_glossary_v1.sql",
    "0003_qa_engine_v1.sql",
    "0004_semantic_fidelity_v1.sql",
    "0005_workflow_engine_v1.sql",
    "0006_terminology_governance_v2.sql",
    "0007_founder_protection_v1.sql",
    "0008_security_hardening_phase_1.sql",
    "0009_workflow_definitions_versions_v1.sql",
    "0010_ai_agent_registry_versions_v1.sql",
    "0011_ai_execution_runtime_v1.sql",
    "0012_local_agent_handler_resources_v1.sql",
    "0013_linguistic_agent_task_inputs_v1.sql",
    "0014_ai_financial_foundation_v1.sql",
    "0015_qa_blocker_index_compatibility_v1.sql",
    "0016_ai_budget_projection_v1.sql"
  ]
};

export * from "./runtime-database.js";
export * from "./financial-persistence.js";
export * from "./ai-budget-reservations.js";
export * from "./ai-budget-projection.js";
