import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { ProjectsService } from "./projects.service";
import { type CreateProjectInput } from "./projects.types";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  createProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateProjectInput
  ) {
    return this.projectsService.createProject(actor, input);
  }

  @Get()
  listProjects(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.projectsService.listProjects(actor);
  }

  @Get(":id")
  getProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.projectsService.getProject(actor, id);
  }
}
