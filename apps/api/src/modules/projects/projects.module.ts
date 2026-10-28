import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { ProjectsController } from "./projects.controller";
import { DatabaseProjectsRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";
import { ProjectsAgentAdapter } from "./projects-agent.adapter";

@Module({
  controllers: [ProjectsController],
  providers: [runtimeDatabaseProvider, DatabaseProjectsRepository, ProjectsService, ProjectsAgentAdapter],
  exports: [ProjectsService, ProjectsAgentAdapter]
})
export class ProjectsModule {}
