import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { AiGovernanceController } from "./ai-governance.controller";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { AiGovernanceService } from "./ai-governance.service";

@Module({
  controllers: [AiGovernanceController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseAiGovernanceRepository,
    AiGovernanceService
  ],
  exports: [AiGovernanceService]
})
export class AiGovernanceModule {}
