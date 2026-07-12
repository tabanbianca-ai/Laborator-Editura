import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { WorkspaceService } from "./workspace.service";
import {
  type AcceptWorkspaceInvitationInput,
  type CreateWorkspaceWidgetInput,
  type InviteWorkspaceCollaboratorInput,
  type RevokeWorkspaceAccessInput,
  type WorkspaceAccessAuditInput,
  type WorkspaceAgentDataAccessInput,
  type WorkspaceEffectiveAccessInput,
  type WorkspaceNeedToKnowAccessInput,
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

  @Get("subscription")
  getSubscription(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.getSubscriptionSummary(actor);
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

  @Post("invitations")
  inviteCollaborator(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: InviteWorkspaceCollaboratorInput
  ) {
    return this.workspaceService.inviteCollaborator(actor, input);
  }

  @Post("invitations/preview")
  previewCollaboratorAccess(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: InviteWorkspaceCollaboratorInput
  ) {
    return this.workspaceService.previewCollaboratorAccess(actor, input);
  }

  @Post("invitations/:id/accept")
  acceptInvitation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") invitationId: string,
    @Body() input: AcceptWorkspaceInvitationInput
  ) {
    return this.workspaceService.acceptInvitation(actor, invitationId, input);
  }

  @Post("access/evaluate")
  evaluateAccess(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkspaceNeedToKnowAccessInput
  ) {
    return this.workspaceService.evaluateNeedToKnowAccess(actor, input);
  }

  @Post("access/resolve")
  resolveEffectiveAccess(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkspaceEffectiveAccessInput
  ) {
    return this.workspaceService.resolveEffectiveAccess(actor, input);
  }

  @Post("access/expire-temporary")
  expireTemporaryAccess(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.expireTemporaryAccess(actor);
  }

  @Post("access/restricted-attempt")
  recordRestrictedAccessAttempt(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkspaceAccessAuditInput
  ) {
    return this.workspaceService.recordRestrictedAccessAttempt(actor, input);
  }

  @Post("access/agent-data-access")
  recordAgentDataAccess(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkspaceAgentDataAccessInput
  ) {
    return this.workspaceService.recordAgentDataAccess(actor, input);
  }

  @Post("access/:id/revoke")
  revokeAccess(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") grantId: string,
    @Body() input: RevokeWorkspaceAccessInput
  ) {
    return this.workspaceService.revokeAccess(actor, grantId, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workspaceService.listAudit(actor);
  }
}
