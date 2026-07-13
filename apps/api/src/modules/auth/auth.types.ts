export type MvpRole = "PLATFORM_CREATOR" | "ADMIN" | "REVIEWER" | "TRANSLATOR" | "VIEWER";

export type OrganizationType =
  | "PERSOANA_FIZICA"
  | "EDITURA"
  | "ASOCIATIE_ONG"
  | "COMPANIE"
  | "INSTITUTIE";

export type AuthAuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "EXPORT"
  | "CREATOR_ROLE_ACCESS";

export type AuthAuditEntityType =
  | "AUTH_ORGANIZATION"
  | "AUTH_USER"
  | "AUTH_SESSION"
  | "USER_ROLE"
  | "PLATFORM_CREATOR_ROLE"
  | "AUTH_SECURITY_EVENT"
  | "FOUNDER_PROTECTION"
  | "FOUNDER_RECOVERY"
  | "FOUNDER_OWNERSHIP_TRANSFER";

export type FounderProtectionStatus = "ACTIVE" | "TRANSFER_PENDING";

export type FounderOwnershipTransferStatus = "PENDING" | "ACCEPTED" | "CANCELLED";

export type AuthSecurityEventType =
  | "LOGIN_FAILED"
  | "ACCOUNT_LOCKED"
  | "LOGIN_LOCKED"
  | "SESSION_EXPIRED"
  | "SESSION_IDLE_TIMEOUT";

export interface AuthActor {
  userId: string;
  organizationId: string;
  roles: MvpRole[];
}

export interface AuthOrganization {
  id: string;
  name: string;
  organizationType: OrganizationType;
  createdAt: string;
  updatedAt: string;
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
  expiresAt?: string;
  lastSeenAt?: string;
  revokedAt?: string;
}

export interface AuthLoginAttempt {
  id: string;
  email: string;
  failureCount: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSecurityEvent {
  id: string;
  organizationId?: string;
  userId?: string;
  email?: string;
  eventType: AuthSecurityEventType;
  message: string;
  createdAt: string;
  metadata?: object;
}

export interface FounderProtection {
  id: string;
  organizationId: string;
  founderUserId: string;
  protectionStatus: FounderProtectionStatus;
  recoveryEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FounderOwnershipTransfer {
  id: string;
  organizationId: string;
  fromFounderUserId: string;
  toFounderUserId: string;
  status: FounderOwnershipTransferStatus;
  requestedBy: string;
  acceptedBy?: string;
  createdAt: string;
  expiresAt: string;
  completedAt?: string;
}

export interface AuthAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: AuthAuditAction;
  entityType: AuthAuditEntityType;
  entityId: string;
  beforeState?: object | null;
  afterState?: object | null;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  displayName?: string;
  loginSecret?: string;
  organizationName?: string;
  organizationType?: OrganizationType;
  roles?: MvpRole[];
}

export interface InitiateFounderOwnershipTransferInput {
  targetUserId: string;
}

export interface LoginResult {
  user: AuthUser;
  organization: AuthOrganization;
  session: AuthSession;
  actor: AuthActor;
}

export interface FounderRecoveryResult {
  protection: FounderProtection;
  roles: MvpRole[];
}

export interface FounderOwnershipTransferResult {
  protection: FounderProtection;
  transfer: FounderOwnershipTransfer;
  roles?: MvpRole[];
}
