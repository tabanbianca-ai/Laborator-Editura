import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { WorkspaceService } from "./workspace.service";
import {
  type CreateWorkspaceWidgetInput,
  type SaveWorkspacePreferencesInput
} from "./workspace.types";

@Controller("workspace")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get("navigation")
  getNavigation(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.getNavigation(actor);
  }

  @Get("dashboard")
  getDashboard(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.getDashboard(actor);
  }

  @Get("preferences")
  getPreferences(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.getPreferences(actor);
  }

  @Post("preferences")
  savePreferences(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: SaveWorkspacePreferencesInput
  ) {
    return this.workspaceService.savePreferences(actor, input);
  }

  @Get("widgets")
  getWidgets(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.getWidgets(actor);
  }

  @Post("widgets")
  createWidget(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateWorkspaceWidgetInput
  ) {
    return this.workspaceService.createWidget(actor, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.listAudit(actor);
  }
}
