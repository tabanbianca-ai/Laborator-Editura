import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { ResearchController } from "./research.controller";
import { DatabaseResearchRepository } from "./research.repository";
import { ResearchService } from "./research.service";

@Module({
  controllers: [ResearchController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseResearchRepository,
    ResearchService
  ],
  exports: [ResearchService]
})
export class ResearchModule {}
