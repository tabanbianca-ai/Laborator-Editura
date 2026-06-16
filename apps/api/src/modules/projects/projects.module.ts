import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { ProjectsController } from "./projects.controller";
import { DatabaseProjectsRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController],
  providers: [runtimeDatabaseProvider, DatabaseProjectsRepository, ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
