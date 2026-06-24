import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type LaunchEssentialsActor = AuthenticatedRequestContext;

export type SensitiveMfaRole = "ADMIN" | "REVIEWER" | "EDITOR";
export type LaunchMfaStatus = "ENABLED" | "DISABLED";
export type GdprConsentStatus = "ACCEPTED" | "WITHDRAWN";
export type GdprRequestType = "PERSONAL_DATA_EXPORT" | "ACCOUNT_DELETION";
export type GdprRequestStatus = "REQUESTED" | "COMPLETED" | "REJECTED";
export type SecretVaultType = "JWT" | "API_KEY" | "SMTP" | "OAUTH" | "WEBHOOK";

export type LaunchEssentialsAuditAction =
  | "MFA_METADATA_ENABLED"
  | "MFA_METADATA_DISABLED"
  | "GDPR_CONSENT_ACCEPTED"
  | "GDPR_CONSENT_WITHDRAWN"
  | "GDPR_PERSONAL_DATA_EXPORT_REQUESTED"
  | "GDPR_ACCOUNT_DELETION_REQUESTED"
  | "SECRET_METADATA_STORED"
  | "SECRET_METADATA_ROTATED"
  | "SECRET_METADATA_ACCESSED";

export interface MfaRecoveryCodesMetadata {
  generated: boolean;
  codeCount?: number;
  lastGeneratedAt?: string;
  storedAsHashPlaceholder: true;
}

export interface LaunchMfaRecord {
  id: string;
  organizationId: string;
  userId: string;
  role: SensitiveMfaRole;
  status: LaunchMfaStatus;
  totpSecretPlaceholder: string;
  recoveryCodesMetadata: MfaRecoveryCodesMetadata;
  externalMfaProvider: "NOT_CONFIGURED";
  enabledBy?: string;
  enabledAt?: string;
  disabledBy?: string;
  disabledAt?: string;
  auditRequired: true;
  humanFinalAuthorityRequired: true;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface GdprConsentRecord {
  id: string;
  organizationId: string;
  userId: string;
  consentType: string;
  status: GdprConsentStatus;
  acceptedAt?: string;
  withdrawnAt?: string;
  source: "USER_ACTION" | "ADMIN_METADATA";
  auditRequired: true;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface GdprRequestRecord {
  id: string;
  organizationId: string;
  userId: string;
  requestType: GdprRequestType;
  status: GdprRequestStatus;
  requestedAt: string;
  completedAt?: string;
  rejectedAt?: string;
  exportMetadata?: object;
  deletionMetadata?: object;
  noAdvancedRetentionEngine: true;
  auditRequired: true;
  humanFinalAuthorityRequired: true;
  createdAt: string;
  updatedAt: string;
}

export interface SecretVaultRecord {
  id: string;
  organizationId: string;
  name: string;
  secretType: SecretVaultType;
  encryptedValuePlaceholder: string;
  hashedValuePlaceholder: string;
  rotationMetadata: {
    rotationRequired: boolean;
    lastRotatedAt?: string;
    nextRotationDueAt?: string;
    rotatedBy?: string;
  };
  accessAuditMetadata: {
    lastAccessedAt?: string;
    lastAccessedBy?: string;
    accessCount: number;
  };
  externalVaultProvider: "NOT_CONFIGURED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface LaunchEssentialsAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: LaunchEssentialsAuditAction;
  mfaRecordId?: string;
  gdprConsentId?: string;
  gdprRequestId?: string;
  secretId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface EnableMfaMetadataInput {
  userId?: string;
  role: SensitiveMfaRole;
  recoveryCodeCount?: number;
  metadata?: object;
}

export interface DisableMfaMetadataInput {
  recordId: string;
  metadata?: object;
}

export interface AcceptGdprConsentInput {
  consentType: string;
  metadata?: object;
}

export interface StoreSecretMetadataInput {
  name: string;
  secretType: SecretVaultType;
  encryptedValuePlaceholder?: string;
  hashedValuePlaceholder?: string;
  rotationRequired?: boolean;
  nextRotationDueAt?: string;
  metadata?: object;
}

export interface RotateSecretMetadataInput {
  encryptedValuePlaceholder?: string;
  hashedValuePlaceholder?: string;
  nextRotationDueAt?: string;
  metadata?: object;
}

export interface LaunchEssentialsRepository {
  createMfaRecord(record: LaunchMfaRecord): Promise<LaunchMfaRecord>;
  updateMfaRecord(record: LaunchMfaRecord): Promise<LaunchMfaRecord>;
  findMfaRecordById(id: string, organizationId: string): Promise<LaunchMfaRecord | null>;
  listMfaRecords(organizationId: string): Promise<LaunchMfaRecord[]>;
  createConsent(record: GdprConsentRecord): Promise<GdprConsentRecord>;
  updateConsent(record: GdprConsentRecord): Promise<GdprConsentRecord>;
  findConsentById(id: string, organizationId: string): Promise<GdprConsentRecord | null>;
  listConsents(organizationId: string, userId?: string): Promise<GdprConsentRecord[]>;
  createGdprRequest(record: GdprRequestRecord): Promise<GdprRequestRecord>;
  createSecret(record: SecretVaultRecord): Promise<SecretVaultRecord>;
  updateSecret(record: SecretVaultRecord): Promise<SecretVaultRecord>;
  findSecretById(id: string, organizationId: string): Promise<SecretVaultRecord | null>;
  listSecrets(organizationId: string): Promise<SecretVaultRecord[]>;
  appendAuditEvent(event: LaunchEssentialsAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<LaunchEssentialsAuditEvent[]>;
}
