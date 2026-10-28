import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { AiGovernanceController } from "./ai-governance.controller";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { AiGovernanceService } from "./ai-governance.service";
import { AiTranslationProviderService } from "./ai-translation-provider.service";
import { AiAgentRegistryController } from "./ai-agent-registry.controller";
import { AiAgentRegistryService } from "./ai-agent-registry.service";

@Module({
  controllers: [AiGovernanceController, AiAgentRegistryController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseAiGovernanceRepository,
    AiGovernanceService,
    AiAgentRegistryService,
    AiTranslationProviderService
  ],
  exports: [AiGovernanceService, AiTranslationProviderService]
})
export class AiGovernanceModule {}
