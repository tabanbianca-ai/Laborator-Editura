import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type EnterpriseAdminActor = AuthenticatedRequestContext;

export type AdminEntityStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";
export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | "INVITED" | "ARCHIVED";
export type AdminInvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type AdminBuiltInRole =
  | "ADMIN"
  | "EDITOR"
  | "TRANSLATOR"
  | "REVIEWER"
  | "AUTHOR"
  | "DESIGNER"
  | "AUDIO_NARRATOR"
  | "COLLABORATOR"
  | "READER"
  | "GUEST";

export type AdminRoleName = AdminBuiltInRole | (string & {});

export type AdminPermissionScope =
  | "MODULE"
  | "PROJECT"
  | "DOCUMENT"
  | "ADMIN"
  | "API"
  | "AI";

export type AdminAuditAction =
  | "ADMIN_USER_CREATED"
  | "ADMIN_ROLE_CREATED"
  | "ADMIN_ROLE_ASSIGNED"
  | "ADMIN_INVITATION_CREATED"
  | "ADMIN_USER_STATUS_CHANGED"
  | "ADMIN_PERMISSION_CHANGE_RECORDED"
  | "ADMIN_ORGANIZATION_CHANGE_RECORDED";

export interface AdminOrganizationMetadata {
  id: string;
  organizationId: string;
  workspaces: string[];
  environments: string[];
  projects: string[];
  teams: string[];
  departments: string[];
  workspaceId?: string;
  environmentId?: string;
  projectIds: string[];
  teamIds: string[];
  departmentIds: string[];
  status: AdminEntityStatus;
  active: boolean;
  suspended: boolean;
  archived: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface AdminUser {
  id: string;
  organizationId: string;
  email: string;
  displayName: string;
  status: AdminUserStatus;
  mfaMetadata: object;
  lastLoginMetadata?: object;
  organizationMembershipIds: string[];
  teamMembershipIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface AdminRole {
  id: string;
  organizationId: string;
  name: AdminRoleName;
  displayName: string;
  description?: string;
  builtIn: boolean;
  custom: boolean;
  permissionIds: string[];
  humanApprovalRequired: true;
  aiSuggested: boolean;
  aiMaySuggestPermissions: true;
  aiMayGrantAdminAutomatically: false;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface AdminPermission {
  id: string;
  organizationId: string;
  scope: AdminPermissionScope;
  key: string;
  description: string;
  moduleName?: string;
  projectScoped: boolean;
  documentScoped: boolean;
  adminScoped: boolean;
  apiScoped: boolean;
  aiScoped: boolean;
  createdAt: string;
}

export interface AdminMembership {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  roleName: AdminRoleName;
  workspaceId?: string;
  environmentId?: string;
  projectId?: string;
  teamId?: string;
  departmentId?: string;
  memberStatus: AdminUserStatus;
  assignedBy: string;
  assignedAt: string;
  metadata?: object;
}

export interface AdminInvitation {
  id: string;
  organizationId: string;
  email: string;
  roleId?: string;
  roleName?: AdminRoleName;
  workspaceId?: string;
  teamId?: string;
  departmentId?: string;
  status: AdminInvitationStatus;
  invitedBy: string;
  expiresAt?: string;
  createdAt: string;
  metadata?: object;
}

export interface AdminAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: AdminAuditAction;
  userId?: string;
  roleId?: string;
  permissionId?: string;
  membershipId?: string;
  invitationId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface CreateAdminUserInput {
  email: string;
  displayName: string;
  status?: AdminUserStatus;
  mfaMetadata?: object;
  lastLoginMetadata?: object;
  metadata?: object;
}

export interface CreateAdminRoleInput {
  name: AdminRoleName;
  displayName?: string;
  description?: string;
  permissionIds?: string[];
  aiSuggested?: boolean;
  aiInitiatedAdminGrant?: boolean;
  metadata?: object;
}

export interface AssignAdminRoleInput {
  roleId?: string;
  roleName?: AdminRoleName;
  workspaceId?: string;
  environmentId?: string;
  projectId?: string;
  teamId?: string;
  departmentId?: string;
  memberStatus?: AdminUserStatus;
  aiInitiatedAdminGrant?: boolean;
  metadata?: object;
}

export interface CreateAdminInvitationInput {
  email: string;
  roleId?: string;
  roleName?: AdminRoleName;
  workspaceId?: string;
  teamId?: string;
  departmentId?: string;
  expiresAt?: string;
  aiInitiatedAdminGrant?: boolean;
  metadata?: object;
}

export interface EnterpriseAdminRepository {
  createUser(user: AdminUser): Promise<AdminUser>;
  findUserById(id: string, organizationId: string): Promise<AdminUser | null>;
  listUsers(organizationId: string): Promise<AdminUser[]>;
  updateUser(user: AdminUser): Promise<AdminUser>;
  createRole(role: AdminRole): Promise<AdminRole>;
  findRoleById(id: string, organizationId: string): Promise<AdminRole | null>;
  findRoleByName(name: AdminRoleName, organizationId: string): Promise<AdminRole | null>;
  listRoles(organizationId: string): Promise<AdminRole[]>;
  listPermissions(organizationId: string): Promise<AdminPermission[]>;
  upsertPermission(permission: AdminPermission): Promise<AdminPermission>;
  createMembership(membership: AdminMembership): Promise<AdminMembership>;
  createInvitation(invitation: AdminInvitation): Promise<AdminInvitation>;
  appendAuditEvent(event: AdminAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<AdminAuditEvent[]>;
}
