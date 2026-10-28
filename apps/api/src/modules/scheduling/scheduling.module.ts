import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { DatabaseSchedulingRepository } from "./scheduling.repository";
import { SchedulingController } from "./scheduling.controller";
import { SchedulingService } from "./scheduling.service";
import { PlanningAgentAdapter } from "./planning-agent.adapter";
import { ProjectsModule } from "../projects/projects.module";
import { WorkflowModule } from "../workflow/workflow.module";

@Module({
  imports: [ProjectsModule, WorkflowModule],
  controllers: [SchedulingController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseSchedulingRepository,
    SchedulingService,
    PlanningAgentAdapter
  ],
  exports: [SchedulingService, PlanningAgentAdapter]
})
export class SchedulingModule {}
