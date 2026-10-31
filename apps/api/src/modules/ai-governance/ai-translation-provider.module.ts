import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { AiGovernanceService } from "./ai-governance.service";
import { AiTranslationProviderService } from "./ai-translation-provider.service";
import { AiSpendingService } from "./ai-spending.service";
import { createFinancialPool } from "./ai-financial-pool";

// The existing provider and cost service have one owner, without a runtime/translation cycle.
@Module({
  providers: [runtimeDatabaseProvider, DatabaseAiGovernanceRepository, AiGovernanceService, AiTranslationProviderService,
    { provide: "AI_SPENDING", inject: [DatabaseAiGovernanceRepository],
      useFactory: (repository: DatabaseAiGovernanceRepository) => new AiSpendingService(repository, createFinancialPool()) }],
  exports: [DatabaseAiGovernanceRepository, AiGovernanceService, AiTranslationProviderService, "AI_SPENDING"]
})
export class AiTranslationProviderModule {}
