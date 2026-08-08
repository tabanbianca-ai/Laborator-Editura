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

export type AuthIdentityType =
  | "HUMAN_USER"
  | "EXTERNAL_COLLABORATOR"
  | "SERVICE_ACCOUNT"
  | "API_CLIENT"
  | "AI_AGENT"
  | "SYSTEM_PROCESS";

export const CANONICAL_IDENTITY_TYPES = [
  "HUMAN_USER",
  "EXTERNAL_COLLABORATOR",
  "SERVICE_ACCOUNT",
  "API_CLIENT",
  "AI_AGENT",
  "SYSTEM_PROCESS"
] as const satisfies readonly AuthIdentityType[];

export type CanonicalIdentityStatus =
  | "INVITED"
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "LOCKED"
  | "DISABLED"
  | "ARCHIVED";

export const CANONICAL_IDENTITY_STATUSES = [
  "INVITED",
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "LOCKED",
  "DISABLED",
  "ARCHIVED"
] as const satisfies readonly CanonicalIdentityStatus[];

export type AuthenticationMethod =
  | "PASSWORD"
  | "RECOVERY_TOKEN"
  | "EMAIL_VERIFICATION_TOKEN"
  | "BOOTSTRAP_SECRET"
  | "SERVICE_ACCOUNT_TOKEN"
  | "API_KEY"
  | "SYSTEM_TOKEN";

export type AuthenticationLevel =
  | "PASSWORD"
  | "BOOTSTRAP"
  | "RECOVERY"
  | "SERVICE"
  | "SYSTEM";

export type RoleAssignmentScopeType =
  | "PLATFORM"
  | "ORGANIZATION"
  | "PROJECT"
  | "PUBLICATION"
  | "RESOURCE";

export type RoleAssignmentStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

export type ServiceAccountStatus = "ACTIVE" | "SUSPENDED" | "REVOKED" | "ARCHIVED";

export type DelegationStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

export type PrivilegedOperationStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

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

export type AuthUserStatus = CanonicalIdentityStatus | "INACTIVE";

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
  | "ASSIGN_ROLE"
  | "REVOKE_ROLE"
  | "LOGIN"
  | "LOGOUT"
  | "REFRESH_SESSION"
  | "REQUEST_PASSWORD_RESET"
  | "CHANGE_PASSWORD"
  | "VERIFY_EMAIL"
  | "REVOKE_SESSION"
  | "CREATE_SERVICE_ACCOUNT"
  | "REVOKE_SERVICE_ACCOUNT"
  | "START_DELEGATION"
  | "END_DELEGATION"
  | "PRIVILEGED_OPERATION_CHECK"
  | "UPDATE_PROFILE"
  | "CREATOR_ROLE_ACCESS";

export type AuthAuditEntityType =
  | "AUTH_IDENTITY"
  | "AUTH_ORGANIZATION"
  | "AUTH_USER"
  | "AUTH_USER_PROFILE"
  | "AUTH_CREDENTIAL"
  | "AUTH_SESSION"
  | "AUTH_ROLE_ASSIGNMENT"
  | "AUTH_PERMISSION"
  | "AUTH_SERVICE_ACCOUNT"
  | "AUTH_DELEGATION_SESSION"
  | "AUTH_PRIVILEGED_OPERATION_POLICY"
  | "AUTH_SECURITY_AUDIT_EVENT"
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
  | "IDENTITY_CREATED"
  | "IDENTITY_UPDATED"
  | "IDENTITY_STATUS_REJECTED"
  | "AUTHORIZATION_DENIED"
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
  identityId?: string;
  identityType?: AuthIdentityType;
  authenticationLevel?: AuthenticationLevel;
  securityVersion?: number;
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
  identityId?: string;
  identityType?: AuthIdentityType;
  canonicalUsername?: string;
  preferredLocale?: string;
  authenticationMethods?: AuthenticationMethod[];
  securityVersion?: number;
  email: string;
  displayName: string;
  status: AuthUserStatus;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  profile?: AuthUserProfile;
  emailVerifiedAt?: string;
  metadata?: object;
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
  identityId?: string;
  identityType?: AuthIdentityType;
  authenticationLevel?: AuthenticationLevel;
  issuedAt?: string;
  securityVersion?: number;
  createdAt: string;
  expiresAt?: string;
  lastSeenAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  deviceInformation?: object;
  ipRiskInformation?: object;
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
  revocationReason?: string;
  active: boolean;
  current?: boolean;
}

export interface CanonicalIdentity {
  id: string;
  organizationId: string;
  userId?: string;
  serviceAccountId?: string;
  apiClientId?: string;
  identityType: AuthIdentityType;
  status: CanonicalIdentityStatus;
  canonicalUsername: string;
  displayName: string;
  preferredLocale?: string;
  authenticationMethods: AuthenticationMethod[];
  securityVersion: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  metadata?: object;
}

export interface ScopedRoleAssignment {
  id: string;
  organizationId: string;
  identityId: string;
  userId?: string;
  role: MvpRole;
  scopeType: RoleAssignmentScopeType;
  scopeId: string;
  status: RoleAssignmentStatus;
  assignedBy?: string;
  reason?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CanonicalPermission {
  id: string;
  key: string;
  moduleName: string;
  description: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "DEPRECATED";
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAccount {
  id: string;
  organizationId: string;
  identityId: string;
  name: string;
  description?: string;
  status: ServiceAccountStatus;
  scopes: string[];
  tokenHash?: string;
  tokenFingerprint?: string;
  lastRotatedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DelegationSession {
  id: string;
  organizationId: string;
  delegatingUserId: string;
  delegatedIdentityId: string;
  reason: string;
  scopeType: RoleAssignmentScopeType;
  scopeId: string;
  status: DelegationStatus;
  startsAt: string;
  expiresAt: string;
  revokedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivilegedOperationPolicy {
  id: string;
  organizationId: string;
  operationKey: string;
  requiredRoles: MvpRole[];
  requiresRecentAuthentication: boolean;
  requiresAudit: boolean;
  status: PrivilegedOperationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IdentitySecurityAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  identityId?: string;
  action: AuthAuditAction | AuthSecurityEventType;
  resourceType: string;
  resourceId: string;
  decision: "ALLOW" | "DENY" | "RECORD";
  reason: string;
  createdAt: string;
  metadata?: object;
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
