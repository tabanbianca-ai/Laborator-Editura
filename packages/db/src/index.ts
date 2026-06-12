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
    "0005_workflow_engine_v1.sql"
  ]
};

export * from "./runtime-database.js";
