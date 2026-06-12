import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { DatabaseProjectsRepository } from "./projects.repository";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController],
  providers: [DatabaseProjectsRepository, ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
