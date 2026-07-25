export type MvpRole =
  | "PLATFORM_CREATOR"
  | "ADMIN"
  | "EDITOR"
  | "TRANSLATOR"
  | "PROOFREADER"
  | "REVIEWER"
  | "DESIGNER"
  | "NARRATOR"
  | "AUDIO_NARRATOR"
  | "AUTHOR"
  | "COLLABORATOR"
  | "READER"
  | "GUEST"
  | "VIEWER";

export const OFFICIAL_AUTH_ROLES = [
  "ADMIN",
  "EDITOR",
  "TRANSLATOR",
  "PROOFREADER",
  "DESIGNER",
  "NARRATOR",
  "AUTHOR",
  "COLLABORATOR",
  "READER",
  "GUEST"
] as const satisfies readonly MvpRole[];

export type AuthUserStatus = "ACTIVE" | "INACTIVE";

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
  | "LOGIN"
  | "LOGOUT"
  | "REFRESH_SESSION"
  | "REQUEST_PASSWORD_RESET"
  | "CHANGE_PASSWORD"
  | "VERIFY_EMAIL"
  | "REVOKE_SESSION"
  | "UPDATE_PROFILE"
  | "CREATOR_ROLE_ACCESS";

export type AuthAuditEntityType =
  | "AUTH_ORGANIZATION"
  | "AUTH_USER"
  | "AUTH_USER_PROFILE"
  | "AUTH_CREDENTIAL"
  | "AUTH_SESSION"
  | "AUTH_PASSWORD_RESET_REQUEST"
  | "AUTH_EMAIL_VERIFICATION"
  | "AUTH_ACTIVITY_EVENT"
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
  | "LOGIN_SUCCEEDED"
  | "ACCOUNT_LOCKED"
  | "LOGIN_LOCKED"
  | "SESSION_EXPIRED"
  | "SESSION_IDLE_TIMEOUT"
  | "SESSION_REFRESHED"
  | "SESSION_REVOKED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_CHANGED"
  | "EMAIL_VERIFIED"
  | "LOGOUT";

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
  status: AuthUserStatus;
  createdAt: string;
  lastLoginAt?: string;
  profile?: AuthUserProfile;
  emailVerifiedAt?: string;
}

export interface AuthUserProfile {
  displayName: string;
  email: string;
  status: AuthUserStatus;
  createdAt: string;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
}

export interface AuthCredential {
  id: string;
  userId: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
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

export interface AuthSessionSummary {
  id: string;
  organizationId: string;
  userId: string;
  roles: MvpRole[];
  createdAt: string;
  expiresAt?: string;
  lastSeenAt?: string;
  revokedAt?: string;
  active: boolean;
  current?: boolean;
}

export interface AuthLoginAttempt {
  id: string;
  email: string;
  failureCount: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPasswordResetRequest {
  id: string;
  email: string;
  userId?: string;
  organizationId?: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface AuthEmailVerificationRequest {
  id: string;
  email: string;
  userId?: string;
  organizationId?: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  verifiedAt?: string;
}

export interface AuthActivityEvent {
  id: string;
  organizationId: string;
  userId: string;
  action: AuthSecurityEventType | AuthAuditAction;
  message: string;
  createdAt: string;
  metadata?: object;
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
  password?: string;
  organizationName?: string;
  organizationType?: OrganizationType;
  roles?: MvpRole[];
}

export interface LogoutInput {
  sessionId?: string;
}

export interface RequestPasswordResetInput {
  email: string;
  token?: string;
  newPassword?: string;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export interface VerifyEmailInput {
  email: string;
  token?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
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

export interface AuthProfileResult {
  user: AuthUser;
  organization: AuthOrganization;
  roles: MvpRole[];
  permissions: string[];
  activityLog: AuthActivityEvent[];
}

export interface AuthSessionVerificationResult {
  authenticated: true;
  user: AuthUser;
  organization: AuthOrganization;
  session: AuthSession;
  roles: MvpRole[];
}

export interface AuthActiveSessionsResult {
  sessions: AuthSessionSummary[];
}

export interface AuthSessionRefreshResult {
  session: AuthSession;
  actor: AuthActor;
}

export interface SafeAuthMutationResult {
  accepted: true;
  message: string;
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
