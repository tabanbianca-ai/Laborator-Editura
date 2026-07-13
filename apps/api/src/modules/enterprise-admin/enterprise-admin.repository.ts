import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type AdminAuditEvent,
  type AdminInvitation,
  type AdminMembership,
  type AdminOrganizationMetadata,
  type AdminPermission,
  type AdminRole,
  type AdminRoleName,
  type AdminTeam,
  type AdminUser,
  type EnterpriseAdminRepository
} from "./enterprise-admin.types";

@Injectable()
export class DatabaseEnterpriseAdminRepository implements EnterpriseAdminRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async upsertOrganizationMetadata(
    organization: AdminOrganizationMetadata
  ): Promise<AdminOrganizationMetadata> {
    return this.database.upsert("admin_organizations", organization);
  }

  async findOrganizationMetadata(organizationId: string): Promise<AdminOrganizationMetadata | null> {
    return this.database.selectForTenant<AdminOrganizationMetadata>(
      "admin_organizations",
      organizationId
    )[0] ?? null;
  }

  async createTeam(team: AdminTeam): Promise<AdminTeam> {
    return this.database.insert("admin_teams", team);
  }

  async findTeamById(id: string, organizationId: string): Promise<AdminTeam | null> {
    return this.database.findByIdForTenant<AdminTeam>("admin_teams", id, organizationId);
  }

  async findTeamByName(name: string, organizationId: string): Promise<AdminTeam | null> {
    return this.database.selectForTenant<AdminTeam>(
      "admin_teams",
      organizationId,
      (team) => team.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    )[0] ?? null;
  }

  async listTeams(organizationId: string): Promise<AdminTeam[]> {
    return this.database.selectForTenant<AdminTeam>("admin_teams", organizationId);
  }

  async updateTeam(team: AdminTeam): Promise<AdminTeam> {
    return this.database.upsert("admin_teams", team);
  }

  async createUser(user: AdminUser): Promise<AdminUser> {
    return this.database.insert("admin_users", user);
  }

  async findUserById(id: string, organizationId: string): Promise<AdminUser | null> {
    return this.database.findByIdForTenant<AdminUser>("admin_users", id, organizationId);
  }

  async listUsers(organizationId: string): Promise<AdminUser[]> {
    return this.database.selectForTenant<AdminUser>("admin_users", organizationId);
  }

  async updateUser(user: AdminUser): Promise<AdminUser> {
    return this.database.upsert("admin_users", user);
  }

  async createRole(role: AdminRole): Promise<AdminRole> {
    return this.database.insert("admin_roles", role);
  }

  async findRoleById(id: string, organizationId: string): Promise<AdminRole | null> {
    return this.database.findByIdForTenant<AdminRole>("admin_roles", id, organizationId);
  }

  async findRoleByName(name: AdminRoleName, organizationId: string): Promise<AdminRole | null> {
    return this.database.selectForTenant<AdminRole>(
      "admin_roles",
      organizationId,
      (role) => role.name === name
    )[0] ?? null;
  }

  async listRoles(organizationId: string): Promise<AdminRole[]> {
    return this.database.selectForTenant<AdminRole>("admin_roles", organizationId);
  }

  async listPermissions(organizationId: string): Promise<AdminPermission[]> {
    return this.database.selectForTenant<AdminPermission>("admin_permissions", organizationId);
  }

  async upsertPermission(permission: AdminPermission): Promise<AdminPermission> {
    return this.database.upsert("admin_permissions", permission);
  }

  async createMembership(membership: AdminMembership): Promise<AdminMembership> {
    return this.database.insert("admin_memberships", membership);
  }

  async findMembershipById(id: string, organizationId: string): Promise<AdminMembership | null> {
    return this.database.findByIdForTenant<AdminMembership>("admin_memberships", id, organizationId);
  }

  async updateMembership(membership: AdminMembership): Promise<AdminMembership> {
    return this.database.upsert("admin_memberships", membership);
  }

  async createInvitation(invitation: AdminInvitation): Promise<AdminInvitation> {
    return this.database.insert("admin_invitations", invitation);
  }

  async appendAuditEvent(event: AdminAuditEvent): Promise<void> {
    this.database.insert("admin_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<AdminAuditEvent[]> {
    return this.database.selectForTenant<AdminAuditEvent>("admin_audit_events", organizationId);
  }
}
