import { Module } from "@nestjs/common";
import { QaModule } from "../qa/qa.module";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { WorkflowController } from "./workflow.controller";
import { InMemoryWorkflowRepository } from "./workflow.repository";
import { WorkflowService } from "./workflow.service";

@Module({
  imports: [QaModule, SemanticFidelityModule],
  controllers: [WorkflowController],
  providers: [InMemoryWorkflowRepository, WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {}
