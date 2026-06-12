export type MvpRole = "ADMIN" | "REVIEWER" | "TRANSLATOR" | "VIEWER";

export type AuthAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export type AuthAuditEntityType =
  | "AUTH_ORGANIZATION"
  | "AUTH_USER"
  | "AUTH_SESSION"
  | "USER_ROLE";

export interface AuthActor {
  userId: string;
  organizationId: string;
  roles: MvpRole[];
}

export interface AuthOrganization {
  id: string;
  name: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthSession {
  id: string;
  token: string;
  organizationId: string;
  userId: string;
  roles: MvpRole[];
  createdAt: string;
}

export interface AuthAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: AuthAuditAction;
  entityType: AuthAuditEntityType;
  entityId: string;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  displayName?: string;
  organizationName?: string;
  roles?: MvpRole[];
}

export interface LoginResult {
  user: AuthUser;
  organization: AuthOrganization;
  session: AuthSession;
  actor: AuthActor;
}
