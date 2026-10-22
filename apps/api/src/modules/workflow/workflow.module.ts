import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module";
import { ProjectsModule } from "../projects/projects.module";
import { QaModule } from "../qa/qa.module";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { WorkflowDefinitionController } from "./workflow-definition.controller";
import { WorkflowDefinitionService } from "./workflow-definition.service";
import { WorkflowController } from "./workflow.controller";
import { InMemoryWorkflowRepository } from "./workflow.repository";
import { WorkflowRuleEvaluator } from "./workflow-rule-evaluator";
import { WorkflowService } from "./workflow.service";

@Module({
  imports: [ProjectsModule, DocumentsModule, QaModule, SemanticFidelityModule],
  controllers: [WorkflowController, WorkflowDefinitionController],
  providers: [
    runtimeDatabaseProvider,
    InMemoryWorkflowRepository,
    WorkflowRuleEvaluator,
    WorkflowDefinitionService,
    WorkflowService
  ],
  exports: [WorkflowDefinitionService, WorkflowService]
})
export class WorkflowModule {}
