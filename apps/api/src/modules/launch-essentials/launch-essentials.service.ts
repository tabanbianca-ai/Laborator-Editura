import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseLaunchEssentialsRepository } from "./launch-essentials.repository";
import {
  type AcceptGdprConsentInput,
  type DisableMfaMetadataInput,
  type EnableMfaMetadataInput,
  type GdprConsentRecord,
  type GdprRequestRecord,
  type LaunchEssentialsActor,
  type LaunchEssentialsAuditAction,
  type LaunchEssentialsAuditEvent,
  type LaunchMfaRecord,
  type RotateSecretMetadataInput,
  type SecretVaultRecord,
  type SecretVaultType,
  type SensitiveMfaRole,
  type StoreSecretMetadataInput
} from "./launch-essentials.types";

const SENSITIVE_MFA_ROLES: SensitiveMfaRole[] = ["PLATFORM_CREATOR", "ADMIN", "REVIEWER", "EDITOR"];
const SECRET_TYPES: SecretVaultType[] = ["JWT", "API_KEY", "SMTP", "OAUTH", "WEBHOOK"];

@Injectable()
export class LaunchEssentialsService {
  constructor(private readonly repository: DatabaseLaunchEssentialsRepository) {}

  async listMfaRecords(actor: LaunchEssentialsActor): Promise<LaunchMfaRecord[]> {
    this.assertAdminActor(actor);
    return this.repository.listMfaRecords(actor.organizationId);
  }

  async enableMfaMetadata(
    actor: LaunchEssentialsActor,
    input: EnableMfaMetadataInput
  ): Promise<LaunchMfaRecord> {
    this.assertAdminActor(actor);
    this.assertSensitiveRole(input.role);
    const now = new Date().toISOString();
    const record: LaunchMfaRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: input.userId ?? actor.userId,
      role: input.role,
      status: "ENABLED",
      totpSecretPlaceholder: "TOTP_SECRET_PLACEHOLDER",
      recoveryCodesMetadata: {
        generated: true,
        codeCount: input.recoveryCodeCount ?? 10,
        lastGeneratedAt: now,
        storedAsHashPlaceholder: true
      },
      externalMfaProvider: "NOT_CONFIGURED",
      enabledBy: actor.userId,
      enabledAt: now,
      auditRequired: true,
      humanFinalAuthorityRequired: true,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createMfaRecord(record);
    await this.audit("MFA_METADATA_ENABLED", actor, { mfaRecordId: created.id }, created);

    return created;
  }

  async disableMfaMetadata(
    actor: LaunchEssentialsActor,
    input: DisableMfaMetadataInput
  ): Promise<LaunchMfaRecord> {
    this.assertAdminActor(actor);

    if (!input.recordId) {
      throw new BadRequestException("recordId is required.");
    }

    const existing = await this.repository.findMfaRecordById(input.recordId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("MFA metadata record not found.");
    }

    const now = new Date().toISOString();
    const disabled: LaunchMfaRecord = {
      ...existing,
      status: "DISABLED",
      disabledBy: actor.userId,
      disabledAt: now,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {})
      }
    };

    const saved = await this.repository.updateMfaRecord(disabled);
    await this.audit("MFA_METADATA_DISABLED", actor, { mfaRecordId: saved.id }, saved, existing);

    return saved;
  }

  async listMyConsents(actor: LaunchEssentialsActor): Promise<GdprConsentRecord[]> {
    return this.repository.listConsents(actor.organizationId, actor.userId);
  }

  async acceptConsent(
    actor: LaunchEssentialsActor,
    input: AcceptGdprConsentInput
  ): Promise<GdprConsentRecord> {
    this.validateRequired(input.consentType, "consentType");
    const now = new Date().toISOString();
    const record: GdprConsentRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      consentType: input.consentType,
      status: "ACCEPTED",
      acceptedAt: now,
      source: "USER_ACTION",
      auditRequired: true,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createConsent(record);
    await this.audit("GDPR_CONSENT_ACCEPTED", actor, { gdprConsentId: created.id }, created);

    return created;
  }

  async withdrawConsent(actor: LaunchEssentialsActor, consentId: string): Promise<GdprConsentRecord> {
    const existing = await this.repository.findConsentById(consentId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("GDPR consent record not found.");
    }

    if (
      existing.userId !== actor.userId &&
      !actor.roles.includes("PLATFORM_CREATOR") &&
      !actor.roles.includes("ADMIN")
    ) {
      throw new ForbiddenException("Users may only withdraw their own consent records.");
    }

    const now = new Date().toISOString();
    const withdrawn: GdprConsentRecord = {
      ...existing,
      status: "WITHDRAWN",
      withdrawnAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateConsent(withdrawn);
    await this.audit("GDPR_CONSENT_WITHDRAWN", actor, { gdprConsentId: saved.id }, saved, existing);

    return saved;
  }

  async requestPersonalDataExport(actor: LaunchEssentialsActor): Promise<GdprRequestRecord> {
    return this.createGdprRequest(actor, "PERSONAL_DATA_EXPORT", {
      requestedBy: actor.userId,
      generationProvider: "NOT_CONFIGURED",
      metadataOnly: true
    });
  }

  async requestAccountDeletion(actor: LaunchEssentialsActor): Promise<GdprRequestRecord> {
    return this.createGdprRequest(actor, "ACCOUNT_DELETION", {
      requestedBy: actor.userId,
      advancedRetentionEngine: "NOT_CONFIGURED",
      metadataOnly: true
    });
  }

  async listSecrets(actor: LaunchEssentialsActor): Promise<SecretVaultRecord[]> {
    this.assertAdminActor(actor);
    return this.repository.listSecrets(actor.organizationId);
  }

  async storeSecretMetadata(
    actor: LaunchEssentialsActor,
    input: StoreSecretMetadataInput
  ): Promise<SecretVaultRecord> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");
    this.assertSecretType(input.secretType);
    const now = new Date().toISOString();
    const record: SecretVaultRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      secretType: input.secretType,
      encryptedValuePlaceholder: input.encryptedValuePlaceholder ?? "ENCRYPTED_VALUE_PLACEHOLDER",
      hashedValuePlaceholder: input.hashedValuePlaceholder ?? "HASHED_VALUE_PLACEHOLDER",
      rotationMetadata: {
        rotationRequired: input.rotationRequired ?? true,
        nextRotationDueAt: input.nextRotationDueAt
      },
      accessAuditMetadata: {
        accessCount: 0
      },
      externalVaultProvider: "NOT_CONFIGURED",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createSecret(record);
    await this.audit("SECRET_METADATA_STORED", actor, { secretId: created.id }, created);

    return created;
  }

  async rotateSecretMetadata(
    actor: LaunchEssentialsActor,
    secretId: string,
    input: RotateSecretMetadataInput = {}
  ): Promise<SecretVaultRecord> {
    this.assertAdminActor(actor);
    const existing = await this.requireSecret(actor, secretId);
    const now = new Date().toISOString();
    const rotated: SecretVaultRecord = {
      ...existing,
      encryptedValuePlaceholder: input.encryptedValuePlaceholder ?? existing.encryptedValuePlaceholder,
      hashedValuePlaceholder: input.hashedValuePlaceholder ?? existing.hashedValuePlaceholder,
      rotationMetadata: {
        ...existing.rotationMetadata,
        rotationRequired: false,
        lastRotatedAt: now,
        nextRotationDueAt: input.nextRotationDueAt,
        rotatedBy: actor.userId
      },
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {})
      }
    };

    const saved = await this.repository.updateSecret(rotated);
    await this.audit("SECRET_METADATA_ROTATED", actor, { secretId: saved.id }, saved, existing);

    return saved;
  }

  async recordSecretAccess(actor: LaunchEssentialsActor, secretId: string): Promise<SecretVaultRecord> {
    this.assertAdminActor(actor);
    const existing = await this.requireSecret(actor, secretId);
    const now = new Date().toISOString();
    const accessed: SecretVaultRecord = {
      ...existing,
      accessAuditMetadata: {
        ...existing.accessAuditMetadata,
        lastAccessedAt: now,
        lastAccessedBy: actor.userId,
        accessCount: existing.accessAuditMetadata.accessCount + 1
      },
      updatedAt: now
    };

    const saved = await this.repository.updateSecret(accessed);
    await this.audit("SECRET_METADATA_ACCESSED", actor, { secretId: saved.id }, saved, existing);

    return saved;
  }

  async listAudit(actor: LaunchEssentialsActor): Promise<LaunchEssentialsAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async createGdprRequest(
    actor: LaunchEssentialsActor,
    requestType: GdprRequestRecord["requestType"],
    metadata: object
  ): Promise<GdprRequestRecord> {
    const now = new Date().toISOString();
    const request: GdprRequestRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      requestType,
      status: "REQUESTED",
      requestedAt: now,
      exportMetadata: requestType === "PERSONAL_DATA_EXPORT" ? metadata : undefined,
      deletionMetadata: requestType === "ACCOUNT_DELETION" ? metadata : undefined,
      noAdvancedRetentionEngine: true,
      auditRequired: true,
      humanFinalAuthorityRequired: true,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createGdprRequest(request);
    await this.audit(
      requestType === "PERSONAL_DATA_EXPORT"
        ? "GDPR_PERSONAL_DATA_EXPORT_REQUESTED"
        : "GDPR_ACCOUNT_DELETION_REQUESTED",
      actor,
      { gdprRequestId: created.id },
      created
    );

    return created;
  }

  private async requireSecret(
    actor: LaunchEssentialsActor,
    secretId: string
  ): Promise<SecretVaultRecord> {
    const secret = await this.repository.findSecretById(secretId, actor.organizationId);

    if (!secret) {
      throw new NotFoundException("Secret metadata record not found.");
    }

    return secret;
  }

  private async audit(
    action: LaunchEssentialsAuditAction,
    actor: LaunchEssentialsActor,
    refs: {
      mfaRecordId?: string;
      gdprConsentId?: string;
      gdprRequestId?: string;
      secretId?: string;
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

  private assertAdminActor(actor: LaunchEssentialsActor): void {
    if (!actor.roles.includes("PLATFORM_CREATOR") && !actor.roles.includes("ADMIN")) {
      throw new ForbiddenException("Public launch essentials administration requires ADMIN.");
    }
  }

  private assertSensitiveRole(role: SensitiveMfaRole): void {
    if (!SENSITIVE_MFA_ROLES.includes(role)) {
      throw new BadRequestException("MFA metadata is limited to ADMIN, REVIEWER and EDITOR roles.");
    }
  }

  private assertSecretType(secretType: SecretVaultType): void {
    if (!SECRET_TYPES.includes(secretType)) {
      throw new BadRequestException("Unsupported secret type.");
    }
  }

  private validateRequired(value: unknown, fieldName: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
