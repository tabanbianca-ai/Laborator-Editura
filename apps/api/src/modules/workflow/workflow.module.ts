import { Module } from "@nestjs/common";
import { ProjectsModule } from "../projects/projects.module";
import { QaModule } from "../qa/qa.module";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { WorkflowController } from "./workflow.controller";
import { InMemoryWorkflowRepository } from "./workflow.repository";
import { WorkflowService } from "./workflow.service";

@Module({
  imports: [ProjectsModule, QaModule, SemanticFidelityModule],
  controllers: [WorkflowController],
  providers: [runtimeDatabaseProvider, InMemoryWorkflowRepository, WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {}
