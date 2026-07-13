import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { EnterpriseAdminService } from "./enterprise-admin.service";
import {
  type AssignAdminRoleInput,
  type CreateAdminInvitationInput,
  type CreateAdminRoleInput,
  type CreateAdminTeamInput,
  type CreateAdminUserInput,
  type UpdateAdminOrganizationInput,
  type UpdateAdminTeamInput
} from "./enterprise-admin.types";

@Controller("admin")
export class EnterpriseAdminController {
  constructor(private readonly enterpriseAdminService: EnterpriseAdminService) {}

  @Get("organization")
  getOrganizationProfile(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.enterpriseAdminService.getOrganizationProfile(actor);
  }

  @Post("organization")
  updateOrganizationProfile(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: UpdateAdminOrganizationInput
  ) {
    return this.enterpriseAdminService.updateOrganizationProfile(actor, input);
  }

  @Get("teams")
  listTeams(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.enterpriseAdminService.listTeams(actor);
  }

  @Post("teams")
  createTeam(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAdminTeamInput
  ) {
    return this.enterpriseAdminService.createTeam(actor, input);
  }

  @Post("teams/:id")
  updateTeam(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateAdminTeamInput
  ) {
    return this.enterpriseAdminService.updateTeam(actor, id, input);
  }

  @Get("users")
  listUsers(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.enterpriseAdminService.listUsers(actor);
  }

  @Post("users")
  createUser(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAdminUserInput
  ) {
    return this.enterpriseAdminService.createUser(actor, input);
  }

  @Get("roles")
  listRoles(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.enterpriseAdminService.listRoles(actor);
  }

  @Post("roles")
  createRole(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAdminRoleInput
  ) {
    return this.enterpriseAdminService.createRole(actor, input);
  }

  @Get("permissions")
  listPermissions(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.enterpriseAdminService.listPermissions(actor);
  }

  @Post("users/:id/roles")
  assignRole(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AssignAdminRoleInput
  ) {
    return this.enterpriseAdminService.assignRole(actor, id, input);
  }

  @Post("memberships/:id/remove")
  removeMember(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.enterpriseAdminService.removeMember(actor, id);
  }

  @Post("invitations")
  createInvitation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAdminInvitationInput
  ) {
    return this.enterpriseAdminService.createInvitation(actor, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.enterpriseAdminService.listAudit(actor);
  }
}
