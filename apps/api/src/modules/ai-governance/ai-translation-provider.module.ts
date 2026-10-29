import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { AiGovernanceService } from "./ai-governance.service";
import { AiTranslationProviderService } from "./ai-translation-provider.service";

// The existing provider and cost service have one owner, without a runtime/translation cycle.
@Module({
  providers: [runtimeDatabaseProvider, DatabaseAiGovernanceRepository, AiGovernanceService, AiTranslationProviderService],
  exports: [DatabaseAiGovernanceRepository, AiGovernanceService, AiTranslationProviderService]
})
export class AiTranslationProviderModule {}
