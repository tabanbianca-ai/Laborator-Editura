import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseEnterpriseAdminRepository } from "./enterprise-admin.repository";
import {
  type AdminAuditAction,
  type AdminAuditEvent,
  type AdminBuiltInRole,
  type AdminInvitation,
  type AdminMembership,
  type AdminOrganizationMetadata,
  type AdminOrganizationType,
  type AdminPermission,
  type AdminPermissionScope,
  type AdminRole,
  type AdminRoleName,
  type AdminTeam,
  type AdminUser,
  type AssignAdminRoleInput,
  type CreateAdminInvitationInput,
  type CreateAdminRoleInput,
  type CreateAdminTeamInput,
  type CreateAdminUserInput,
  type EnterpriseAdminActor,
  type UpdateAdminOrganizationInput,
  type UpdateAdminTeamInput
} from "./enterprise-admin.types";

const BUILT_IN_ROLES: AdminBuiltInRole[] = [
  "PLATFORM_CREATOR",
  "ADMIN",
  "EDITOR",
  "TRANSLATOR",
  "PROOFREADER",
  "REVIEWER",
  "AUTHOR",
  "DESIGNER",
  "NARRATOR",
  "AUDIO_NARRATOR",
  "COLLABORATOR",
  "READER",
  "GUEST"
];

const PLATFORM_CREATOR_ROLE: AdminBuiltInRole = "PLATFORM_CREATOR";
const DEFAULT_ORGANIZATION_TYPE: AdminOrganizationType = "PERSOANA_FIZICA";
const DEFAULT_TEAM_NAMES = [
  "Echipa Traducere",
  "Echipa Revizie",
  "Echipa Machetare",
  "Echipa Ilustrații",
  "Echipa Multimedia",
  "Echipa Publicare",
  "Echipa Marketing",
  "Echipa Publicitate"
] as const;

const DEFAULT_PERMISSIONS: Array<{
  key: string;
  scope: AdminPermissionScope;
  description: string;
  moduleName?: string;
}> = [
  { key: "module:read", scope: "MODULE", description: "Read module metadata." },
  { key: "project:admin", scope: "PROJECT", description: "Administer project membership and settings." },
  { key: "document:admin", scope: "DOCUMENT", description: "Administer document access." },
  { key: "admin:manage-users", scope: "ADMIN", description: "Manage users and memberships." },
  { key: "api:manage", scope: "API", description: "Manage API access metadata." },
  { key: "ai:govern", scope: "AI", description: "Govern AI agent permissions and limits." }
];

@Injectable()
export class EnterpriseAdminService {
  constructor(private readonly repository: DatabaseEnterpriseAdminRepository) {}

  async getOrganizationProfile(actor: EnterpriseAdminActor): Promise<AdminOrganizationMetadata> {
    this.assertAdminActor(actor);
    await this.ensureDefaultTeams(actor);

    return this.ensureOrganizationMetadata(actor);
  }

  async updateOrganizationProfile(
    actor: EnterpriseAdminActor,
    input: UpdateAdminOrganizationInput
  ): Promise<AdminOrganizationMetadata> {
    this.assertAdminActor(actor);
    const existing = await this.ensureOrganizationMetadata(actor);
    const updated: AdminOrganizationMetadata = {
      ...existing,
      organizationName: input.organizationName ?? existing.organizationName,
      organizationType: input.organizationType ?? existing.organizationType,
      profile: {
        ...existing.profile,
        logoUrl: input.logoUrl ?? existing.profile.logoUrl,
        branding: input.branding ?? existing.profile.branding,
        timezone: input.timezone ?? existing.profile.timezone,
        currency: input.currency ?? existing.profile.currency
      },
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };
    const saved = await this.repository.upsertOrganizationMetadata(updated);
    await this.audit(
      "ADMIN_ORGANIZATION_MODIFIED",
      actor,
      { organizationMetadataId: saved.id },
      saved,
      existing
    );

    return saved;
  }

  async listTeams(actor: EnterpriseAdminActor): Promise<AdminTeam[]> {
    this.assertAdminActor(actor);
    await this.ensureDefaultTeams(actor);

    return this.repository.listTeams(actor.organizationId);
  }

  async createTeam(actor: EnterpriseAdminActor, input: CreateAdminTeamInput): Promise<AdminTeam> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");

    const existing = await this.repository.findTeamByName(input.name, actor.organizationId);

    if (existing) {
      throw new BadRequestException("team name already exists.");
    }

    const now = new Date().toISOString();
    const team: AdminTeam = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      description: input.description,
      projectIds: input.projectIds ?? [],
      taskIds: input.taskIds ?? [],
      documentIds: input.documentIds ?? [],
      workflowResponsibilities: input.workflowResponsibilities ?? [],
      status: "ACTIVE",
      defaultTeam: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };
    const created = await this.repository.createTeam(team);
    await this.audit("ADMIN_TEAM_CREATED", actor, { teamId: created.id }, created);

    return created;
  }

  async updateTeam(
    actor: EnterpriseAdminActor,
    teamId: string,
    input: UpdateAdminTeamInput
  ): Promise<AdminTeam> {
    this.assertAdminActor(actor);
    this.validateRequired(teamId, "teamId");
    const existing = await this.repository.findTeamById(teamId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("admin team not found.");
    }

    const updated: AdminTeam = {
      ...existing,
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      projectIds: input.projectIds ?? existing.projectIds,
      taskIds: input.taskIds ?? existing.taskIds,
      documentIds: input.documentIds ?? existing.documentIds,
      workflowResponsibilities: input.workflowResponsibilities ?? existing.workflowResponsibilities,
      status: input.status ?? existing.status,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };
    const saved = await this.repository.updateTeam(updated);
    await this.audit("ADMIN_TEAM_MODIFIED", actor, { teamId: saved.id }, saved, existing);

    return saved;
  }

  async listUsers(actor: EnterpriseAdminActor): Promise<AdminUser[]> {
    this.assertAdminActor(actor);
    return this.repository.listUsers(actor.organizationId);
  }

  async createUser(actor: EnterpriseAdminActor, input: CreateAdminUserInput): Promise<AdminUser> {
    this.assertAdminActor(actor);
    this.validateRequired(input.email, "email");
    this.validateRequired(input.displayName, "displayName");

    const now = new Date().toISOString();
    const user: AdminUser = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      email: input.email,
      displayName: input.displayName,
      status: input.status ?? "INVITED",
      mfaMetadata: input.mfaMetadata ?? { configured: false, provider: "NOT_CONFIGURED" },
      lastLoginMetadata: input.lastLoginMetadata,
      organizationMembershipIds: [],
      teamMembershipIds: [],
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        authBehaviorPreserved: true
      }
    };

    const created = await this.repository.createUser(user);
    await this.audit("ADMIN_USER_CREATED", actor, { userId: created.id }, created);

    return created;
  }

  async listRoles(actor: EnterpriseAdminActor): Promise<AdminRole[]> {
    this.assertAdminActor(actor);
    return this.repository.listRoles(actor.organizationId);
  }

  async createRole(actor: EnterpriseAdminActor, input: CreateAdminRoleInput): Promise<AdminRole> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");

    if (input.name === PLATFORM_CREATOR_ROLE) {
      throw new BadRequestException("Platform Creator is a protected system role.");
    }

    if (input.name === "ADMIN" && input.aiInitiatedAdminGrant) {
      throw new BadRequestException("AI cannot auto grant ADMIN.");
    }

    const now = new Date().toISOString();
    const role: AdminRole = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      displayName: input.displayName ?? input.name,
      description: input.description,
      builtIn: this.isBuiltInRole(input.name),
      custom: !this.isBuiltInRole(input.name),
      permissionIds: input.permissionIds ?? [],
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      aiMaySuggestPermissions: true,
      aiMayGrantAdminAutomatically: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createRole(role);
    await this.audit("ADMIN_ROLE_CREATED", actor, { roleId: created.id }, created);

    return created;
  }

  async listPermissions(actor: EnterpriseAdminActor): Promise<AdminPermission[]> {
    this.assertAdminActor(actor);
    const existing = await this.repository.listPermissions(actor.organizationId);

    if (existing.length > 0) {
      return existing;
    }

    const now = new Date().toISOString();
    const created: AdminPermission[] = [];

    for (const permission of DEFAULT_PERMISSIONS) {
      created.push(
        await this.repository.upsertPermission({
          id: `${actor.organizationId}:${permission.key}`,
          organizationId: actor.organizationId,
          scope: permission.scope,
          key: permission.key,
          description: permission.description,
          moduleName: permission.moduleName,
          projectScoped: permission.scope === "PROJECT",
          documentScoped: permission.scope === "DOCUMENT",
          adminScoped: permission.scope === "ADMIN",
          apiScoped: permission.scope === "API",
          aiScoped: permission.scope === "AI",
          createdAt: now
        })
      );
    }

    return created;
  }

  async assignRole(
    actor: EnterpriseAdminActor,
    userId: string,
    input: AssignAdminRoleInput
  ): Promise<AdminMembership> {
    this.assertAdminActor(actor);
    this.validateRequired(userId, "userId");

    if (input.roleName === PLATFORM_CREATOR_ROLE) {
      throw new BadRequestException("Platform Creator is not assignable through Administration.");
    }

    const user = await this.requireUser(actor, userId);
    const role = await this.resolveRole(actor, input.roleId, input.roleName);

    if (role.name === PLATFORM_CREATOR_ROLE) {
      throw new BadRequestException("Platform Creator is not assignable through Administration.");
    }

    if (role.name === "ADMIN" && input.aiInitiatedAdminGrant) {
      throw new BadRequestException("AI cannot auto grant ADMIN.");
    }

    const membership: AdminMembership = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: user.id,
      roleId: role.id,
      roleName: role.name,
      workspaceId: input.workspaceId,
      environmentId: input.environmentId,
      projectId: input.projectId,
      teamId: input.teamId,
      departmentId: input.departmentId,
      memberStatus: input.memberStatus ?? "ACTIVE",
      assignedBy: actor.userId,
      assignedAt: new Date().toISOString(),
      metadata: {
        ...(input.metadata ?? {}),
        humanFinalAuthority: true
      }
    };

    const created = await this.repository.createMembership(membership);
    await this.repository.updateUser({
      ...user,
      status: created.memberStatus,
      organizationMembershipIds: [...new Set([...user.organizationMembershipIds, created.id])],
      teamMembershipIds: created.teamId
        ? [...new Set([...user.teamMembershipIds, created.teamId])]
        : user.teamMembershipIds,
      updatedAt: new Date().toISOString()
    });
    await this.audit("ADMIN_ROLE_ASSIGNED", actor, {
      userId: user.id,
      roleId: role.id,
      membershipId: created.id
    }, created);
    await this.audit("ADMIN_MEMBER_ADDED", actor, {
      userId: user.id,
      roleId: role.id,
      membershipId: created.id,
      teamId: created.teamId
    }, created);

    return created;
  }

  async removeMember(
    actor: EnterpriseAdminActor,
    membershipId: string
  ): Promise<AdminMembership> {
    this.assertAdminActor(actor);
    this.validateRequired(membershipId, "membershipId");
    const existing = await this.repository.findMembershipById(membershipId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("admin membership not found.");
    }

    if (existing.roleName === PLATFORM_CREATOR_ROLE) {
      throw new BadRequestException("Platform Creator membership cannot be removed.");
    }

    const updated: AdminMembership = {
      ...existing,
      memberStatus: "ARCHIVED",
      metadata: {
        ...(existing.metadata ?? {}),
        removedBy: actor.userId,
        removedAt: new Date().toISOString()
      }
    };
    const saved = await this.repository.updateMembership(updated);
    await this.audit("ADMIN_MEMBER_REMOVED", actor, {
      userId: saved.userId,
      roleId: saved.roleId,
      membershipId: saved.id,
      teamId: saved.teamId
    }, saved, existing);

    return saved;
  }

  async createInvitation(
    actor: EnterpriseAdminActor,
    input: CreateAdminInvitationInput
  ): Promise<AdminInvitation> {
    this.assertAdminActor(actor);
    this.validateRequired(input.email, "email");

    if (input.roleName === PLATFORM_CREATOR_ROLE) {
      throw new BadRequestException("Platform Creator is not available for invitation.");
    }

    const role = input.roleId || input.roleName
      ? await this.resolveRole(actor, input.roleId, input.roleName)
      : undefined;

    if (role?.name === PLATFORM_CREATOR_ROLE) {
      throw new BadRequestException("Platform Creator is not available for invitation.");
    }

    if ((role?.name === "ADMIN" || input.roleName === "ADMIN") && input.aiInitiatedAdminGrant) {
      throw new BadRequestException("AI cannot auto grant ADMIN.");
    }

    const invitation: AdminInvitation = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      email: input.email,
      roleId: role?.id ?? input.roleId,
      roleName: role?.name ?? input.roleName,
      workspaceId: input.workspaceId,
      teamId: input.teamId,
      departmentId: input.departmentId,
      status: "PENDING",
      invitedBy: actor.userId,
      expiresAt: input.expiresAt,
      createdAt: new Date().toISOString(),
      metadata: {
        ...(input.metadata ?? {}),
        humanFinalAuthority: true
      }
    };

    const created = await this.repository.createInvitation(invitation);
    await this.audit("ADMIN_INVITATION_CREATED", actor, { invitationId: created.id }, created);

    return created;
  }

  async listAudit(actor: EnterpriseAdminActor): Promise<AdminAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async resolveRole(
    actor: EnterpriseAdminActor,
    roleId?: string,
    roleName?: AdminRoleName
  ): Promise<AdminRole> {
    if (roleId) {
      const byId = await this.repository.findRoleById(roleId, actor.organizationId);

      if (byId) {
        return byId;
      }
    }

    if (roleName) {
      const byName = await this.repository.findRoleByName(roleName, actor.organizationId);

      if (byName) {
        return byName;
      }
    }

    throw new NotFoundException("Admin role not found.");
  }

  private async requireUser(actor: EnterpriseAdminActor, userId: string): Promise<AdminUser> {
    const user = await this.repository.findUserById(userId, actor.organizationId);

    if (!user) {
      throw new NotFoundException("Admin user not found.");
    }

    return user;
  }

  private async audit(
    action: AdminAuditAction,
    actor: EnterpriseAdminActor,
    refs: {
      userId?: string;
      roleId?: string;
      permissionId?: string;
      organizationMetadataId?: string;
      teamId?: string;
      membershipId?: string;
      invitationId?: string;
    },
    afterState?: object,
    beforeState?: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      ...refs,
      beforeState,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private isBuiltInRole(roleName: AdminRoleName): roleName is AdminBuiltInRole {
    return BUILT_IN_ROLES.includes(roleName as AdminBuiltInRole);
  }

  private assertAdminActor(actor: EnterpriseAdminActor): void {
    if (!actor.roles.includes("PLATFORM_CREATOR") && !actor.roles.includes("ADMIN")) {
      throw new ForbiddenException("Enterprise admin endpoints require an authorized admin.");
    }
  }

  private async ensureOrganizationMetadata(
    actor: EnterpriseAdminActor
  ): Promise<AdminOrganizationMetadata> {
    const existing = await this.repository.findOrganizationMetadata(actor.organizationId);

    if (existing) {
      return existing;
    }

    const teams = await this.repository.listTeams(actor.organizationId);
    const now = new Date().toISOString();
    const organization: AdminOrganizationMetadata = {
      id: `${actor.organizationId}:organization-profile`,
      organizationId: actor.organizationId,
      organizationName: "Default Organization",
      organizationType: DEFAULT_ORGANIZATION_TYPE,
      workspaces: [],
      environments: [],
      projects: [],
      teams: teams.map((team) => team.name),
      departments: [],
      workspaceId: undefined,
      environmentId: undefined,
      projectIds: [],
      teamIds: teams.map((team) => team.id),
      departmentIds: [],
      status: "ACTIVE",
      active: true,
      suspended: false,
      archived: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      profile: {
        timezone: "Europe/Madrid",
        currency: "EUR"
      },
      metadata: {
        defaultOrganizationType: DEFAULT_ORGANIZATION_TYPE,
        platformCreatorRoleSeparateFromAdministrator: true
      }
    };
    const created = await this.repository.upsertOrganizationMetadata(organization);
    await this.audit("ADMIN_ORGANIZATION_CREATED", actor, {
      organizationMetadataId: created.id
    }, created);

    return created;
  }

  private async ensureDefaultTeams(actor: EnterpriseAdminActor): Promise<void> {
    const now = new Date().toISOString();

    for (const name of DEFAULT_TEAM_NAMES) {
      const existing = await this.repository.findTeamByName(name, actor.organizationId);

      if (existing) {
        continue;
      }

      const created = await this.repository.createTeam({
        id: randomUUID(),
        organizationId: actor.organizationId,
        name,
        description: "Default editorial team.",
        projectIds: [],
        taskIds: [],
        documentIds: [],
        workflowResponsibilities: [],
        status: "ACTIVE",
        defaultTeam: true,
        createdBy: actor.userId,
        createdAt: now,
        updatedAt: now,
        metadata: {
          createdByDefaultOrganizationSetup: true
        }
      });
      await this.audit("ADMIN_TEAM_CREATED", actor, { teamId: created.id }, created);
    }
  }

  private validateRequired(value: unknown, fieldName: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
