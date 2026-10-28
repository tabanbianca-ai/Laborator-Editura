import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { ResearchController } from "./research.controller";
import { DatabaseResearchRepository } from "./research.repository";
import { ResearchService } from "./research.service";
import { DocumentationAgentAdapter } from "./documentation-agent.adapter";
import { LexicographicModule } from "../lexicographic/lexicographic.module";
import { WorkspaceModule } from "../workspace/workspace.module";

@Module({
  imports: [LexicographicModule, WorkspaceModule],
  controllers: [ResearchController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseResearchRepository,
    ResearchService,
    DocumentationAgentAdapter
  ],
  exports: [ResearchService, DocumentationAgentAdapter]
})
export class ResearchModule {}
