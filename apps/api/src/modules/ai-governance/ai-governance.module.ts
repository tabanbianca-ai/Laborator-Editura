import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { AiGovernanceController } from "./ai-governance.controller";
import { AiTranslationProviderModule } from "./ai-translation-provider.module";
import { TranslationsModule } from "../translations/translations.module";
import { AiAgentRegistryController } from "./ai-agent-registry.controller";
import { AiAgentRegistryService } from "./ai-agent-registry.service";
import { AiHandlerRegistry } from "./ai-handler-registry";
import { AiExecutionRepository } from "./ai-execution.repository";
import { AiExecutionService } from "./ai-execution.service";
import { AiExecutionController } from "./ai-execution.controller";
import { DocumentsModule } from "../documents/documents.module";
import { WorkspaceModule } from "../workspace/workspace.module";
import { WorkflowModule } from "../workflow/workflow.module";
import { ProjectsModule } from "../projects/projects.module";
import { AuthorStudioModule } from "../author-studio/author-studio.module";
import { ResearchModule } from "../research/research.module";
import { SchedulingModule } from "../scheduling/scheduling.module";

@Module({
  imports: [AiTranslationProviderModule, TranslationsModule, DocumentsModule, WorkspaceModule, WorkflowModule, ProjectsModule, AuthorStudioModule, ResearchModule, SchedulingModule],
  controllers: [AiGovernanceController, AiAgentRegistryController, AiExecutionController],
  providers: [
    runtimeDatabaseProvider,
    AiAgentRegistryService,
    AiHandlerRegistry,
    AiExecutionRepository,
    AiExecutionService
  ],
  exports: [AiTranslationProviderModule]
})
export class AiGovernanceModule {}
