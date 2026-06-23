export type SecurityPolicyType =
  | "PASSWORD_LOGIN"
  | "SESSION_DURATION"
  | "API_KEY"
  | "WEBHOOK_SECURITY"
  | "NETWORK_ACCESS"
  | "MFA_REQUIREMENT"
  | "ORGANIZATION_ACCESS";

export type SecurityPolicyStatus = "DRAFT" | "ACTIVE" | "DISABLED";

export type SecurityAccessReviewStatus =
  | "PENDING_HUMAN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "REMEDIATION_REQUIRED";

export type SecurityEventType =
  | "LOGIN_EVENT"
  | "FAILED_ACCESS"
  | "PERMISSION_DENIED"
  | "POLICY_VIOLATION"
  | "SUSPICIOUS_ACTIVITY"
  | "SESSION_REVOCATION_RECORDED"
  | "API_KEY_USAGE"
  | "API_KEY_SCOPE_DENIED"
  | "API_KEY_EXPIRATION_WARNING"
  | "API_KEY_REVOCATION_RECORDED";

export type SecurityEventCategory = "SESSION" | "API_KEY" | "POLICY";

export type SecuritySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SecurityAuditAction =
  | "SECURITY_POLICY_CREATED"
  | "SECURITY_ACCESS_REVIEW_CREATED"
  | "SECURITY_SESSION_EVENT_RECORDED"
  | "SECURITY_API_KEY_EVENT_RECORDED"
  | "SECURITY_POLICY_VIOLATION_RECORDED"
  | "SECURITY_SESSION_REVOCATION_RECORDED";

export interface SecurityGovernanceActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface PasswordLoginPolicyMetadata {
  minLength?: number;
  requireComplexity?: boolean;
  failedLoginThreshold?: number;
  lockoutMinutes?: number;
}

export interface SessionDurationPolicyMetadata {
  maxSessionMinutes?: number;
  idleTimeoutMinutes?: number;
  refreshTokenRotation?: boolean;
}

export interface ApiKeyPolicyMetadata {
  maxLifetimeDays?: number;
  allowedScopes?: string[];
  requireExpiration?: boolean;
  revokeOnSuspiciousUse?: boolean;
}

export interface WebhookSecurityPolicyMetadata {
  requireSecretHashing?: boolean;
  requireHttpsTargets?: boolean;
  maxRetryAttempts?: number;
}

export interface SecurityPolicy {
  id: string;
  organizationId: string;
  policyType: SecurityPolicyType;
  name: string;
  description?: string;
  status: SecurityPolicyStatus;
  passwordLoginPolicy?: PasswordLoginPolicyMetadata;
  sessionDurationPolicy?: SessionDurationPolicyMetadata;
  apiKeyPolicy?: ApiKeyPolicyMetadata;
  webhookSecurityPolicy?: WebhookSecurityPolicyMetadata;
  allowedDomains: string[];
  ipAllowlist: string[];
  ipBlocklist: string[];
  mfaRequirementPlaceholder: boolean;
  rolePermissionMatrix: Record<string, string[]>;
  organizationAccessPolicy?: Record<string, unknown>;
  tenantIsolationChecks: string[];
  humanApprovalRequired: true;
  aiMayDetectRisks: true;
  aiMaySuggestPolicyChanges: true;
  aiMayChangePolicyAutomatically: false;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SecurityAccessReview {
  id: string;
  organizationId: string;
  reviewName: string;
  reviewedUserId?: string;
  reviewedRoles: string[];
  reviewedPermissions: string[];
  rolePermissionMatrix: Record<string, string[]>;
  accessFindings: string[];
  tenantIsolationChecks: string[];
  status: SecurityAccessReviewStatus;
  humanApprovalRequired: true;
  aiMaySummarizeAccessReviews: true;
  aiMayApproveAccessReviewAutomatically: false;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SecuritySessionEvent {
  id: string;
  organizationId: string;
  sessionId?: string;
  userId?: string;
  eventType: SecurityEventType;
  activeSessionMetadata?: Record<string, unknown>;
  suspiciousFlags: string[];
  lastSeenAt?: string;
  revocationRecorded: boolean;
  revocationReason?: string;
  enforcementMode: "METADATA_ONLY";
  message: string;
  severity: SecuritySeverity;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface SecurityApiKeyEvent {
  id: string;
  organizationId: string;
  apiKeyId?: string;
  eventType: SecurityEventType;
  usagePolicyMetadata?: Record<string, unknown>;
  scopeValidationMetadata?: Record<string, unknown>;
  expirationPolicyMetadata?: Record<string, unknown>;
  revocationAuditMetadata?: Record<string, unknown>;
  message: string;
  severity: SecuritySeverity;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface SecurityPolicyViolation {
  id: string;
  organizationId: string;
  policyId?: string;
  eventType: "POLICY_VIOLATION";
  violationType: string;
  message: string;
  severity: SecuritySeverity;
  requestPath?: string;
  userId?: string;
  suspiciousActivityMetadata?: Record<string, unknown>;
  enforcementMode: "METADATA_ONLY";
  resolved: false;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface SecurityEventsSummary {
  sessionEvents: SecuritySessionEvent[];
  apiKeyEvents: SecurityApiKeyEvent[];
  policyViolations: SecurityPolicyViolation[];
}

export interface SecurityAuditEvent {
  id: string;
  organizationId: string;
  action: SecurityAuditAction;
  actorId: string;
  policyId?: string;
  accessReviewId?: string;
  sessionEventId?: string;
  apiKeyEventId?: string;
  policyViolationId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface CreateSecurityPolicyInput {
  policyType: SecurityPolicyType;
  name: string;
  description?: string;
  status?: SecurityPolicyStatus;
  passwordLoginPolicy?: PasswordLoginPolicyMetadata;
  sessionDurationPolicy?: SessionDurationPolicyMetadata;
  apiKeyPolicy?: ApiKeyPolicyMetadata;
  webhookSecurityPolicy?: WebhookSecurityPolicyMetadata;
  allowedDomains?: string[];
  ipAllowlist?: string[];
  ipBlocklist?: string[];
  mfaRequirementPlaceholder?: boolean;
  rolePermissionMatrix?: Record<string, string[]>;
  organizationAccessPolicy?: Record<string, unknown>;
  tenantIsolationChecks?: string[];
  aiSuggested?: boolean;
  aiInitiatedPolicyChange?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateSecurityAccessReviewInput {
  reviewName: string;
  reviewedUserId?: string;
  reviewedRoles?: string[];
  reviewedPermissions?: string[];
  rolePermissionMatrix?: Record<string, string[]>;
  accessFindings?: string[];
  tenantIsolationChecks?: string[];
  aiInitiatedApproval?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateSecurityEventInput {
  category?: SecurityEventCategory;
  eventType: SecurityEventType;
  sessionId?: string;
  apiKeyId?: string;
  policyId?: string;
  userId?: string;
  requestPath?: string;
  message: string;
  severity?: SecuritySeverity;
  suspiciousFlags?: string[];
  violationType?: string;
  usagePolicyMetadata?: Record<string, unknown>;
  scopeValidationMetadata?: Record<string, unknown>;
  expirationPolicyMetadata?: Record<string, unknown>;
  revocationAuditMetadata?: Record<string, unknown>;
  suspiciousActivityMetadata?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RevokeSessionInput {
  reason?: string;
  suspiciousFlags?: string[];
  metadata?: Record<string, unknown>;
}

export interface SecurityGovernanceRepository {
  createPolicy(policy: SecurityPolicy): Promise<SecurityPolicy>;
  listPolicies(organizationId: string): Promise<SecurityPolicy[]>;
  createAccessReview(review: SecurityAccessReview): Promise<SecurityAccessReview>;
  listAccessReviews(organizationId: string): Promise<SecurityAccessReview[]>;
  createSessionEvent(event: SecuritySessionEvent): Promise<SecuritySessionEvent>;
  listSessionEvents(organizationId: string): Promise<SecuritySessionEvent[]>;
  createApiKeyEvent(event: SecurityApiKeyEvent): Promise<SecurityApiKeyEvent>;
  listApiKeyEvents(organizationId: string): Promise<SecurityApiKeyEvent[]>;
  createPolicyViolation(violation: SecurityPolicyViolation): Promise<SecurityPolicyViolation>;
  listPolicyViolations(organizationId: string): Promise<SecurityPolicyViolation[]>;
  appendAuditEvent(event: SecurityAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<SecurityAuditEvent[]>;
}
