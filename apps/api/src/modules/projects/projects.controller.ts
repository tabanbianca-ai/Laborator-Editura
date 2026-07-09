import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { ProjectsService } from "./projects.service";
import {
  type AssignProjectDossierItemInput,
  type CreateProjectDossierInput,
  type CreateProjectInput
} from "./projects.types";

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

  @Get(":id/dossiers")
  listProjectDossiers(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.projectsService.listProjectDossiers(actor, id);
  }

  @Post(":id/dossiers")
  createProjectDossier(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateProjectDossierInput
  ) {
    return this.projectsService.createProjectDossier(actor, id, input);
  }

  @Post(":id/dossier-items")
  assignProjectDossierItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AssignProjectDossierItemInput
  ) {
    return this.projectsService.assignProjectDossierItem(actor, id, input);
  }

  @Get(":id")
  getProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.projectsService.getProject(actor, id);
  }
}
