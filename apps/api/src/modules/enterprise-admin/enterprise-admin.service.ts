import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseEnterpriseAdminRepository } from "./enterprise-admin.repository";
import {
  type AdminAuditAction,
  type AdminAuditEvent,
  type AdminBuiltInRole,
  type AdminInvitation,
  type AdminMembership,
  type AdminPermission,
  type AdminPermissionScope,
  type AdminRole,
  type AdminRoleName,
  type AdminUser,
  type AssignAdminRoleInput,
  type CreateAdminInvitationInput,
  type CreateAdminRoleInput,
  type CreateAdminUserInput,
  type EnterpriseAdminActor
} from "./enterprise-admin.types";

const BUILT_IN_ROLES: AdminBuiltInRole[] = [
  "ADMIN",
  "EDITOR",
  "TRANSLATOR",
  "REVIEWER",
  "AUTHOR",
  "DESIGNER",
  "AUDIO_NARRATOR",
  "COLLABORATOR",
  "READER",
  "GUEST"
];

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

    const user = await this.requireUser(actor, userId);
    const role = await this.resolveRole(actor, input.roleId, input.roleName);

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

    return created;
  }

  async createInvitation(
    actor: EnterpriseAdminActor,
    input: CreateAdminInvitationInput
  ): Promise<AdminInvitation> {
    this.assertAdminActor(actor);
    this.validateRequired(input.email, "email");

    const role = input.roleId || input.roleName
      ? await this.resolveRole(actor, input.roleId, input.roleName)
      : undefined;

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
    if (!actor.roles.includes("ADMIN")) {
      throw new ForbiddenException("Enterprise admin endpoints require an authorized admin.");
    }
  }

  private validateRequired(value: unknown, fieldName: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
