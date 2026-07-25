import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { randomUUID } from "node:crypto";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type AuthAuditEvent,
  type AuthCredential,
  type AuthActivityEvent,
  type AuthEmailVerificationRequest,
  type AuthLoginAttempt,
  type AuthOrganization,
  type AuthPasswordResetRequest,
  type AuthSecurityEvent,
  type AuthSession,
  type AuthUser,
  type FounderOwnershipTransfer,
  type FounderProtection,
  type MvpRole
} from "./auth.types";

interface UserRoleRow {
  id: string;
  organizationId: string;
  userId: string;
  role: MvpRole;
  createdAt: string;
}

@Injectable()
export class DatabaseAuthRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createOrganization(organization: AuthOrganization): Promise<AuthOrganization> {
    return this.database.insert("organizations", organization);
  }

  async firstOrganization(): Promise<AuthOrganization | null> {
    return this.database.select<AuthOrganization>("organizations")[0] ?? null;
  }

  async createUser(user: AuthUser): Promise<AuthUser> {
    return this.database.insert("users", user);
  }

  async updateUser(user: AuthUser): Promise<AuthUser> {
    return this.database.upsert("users", user);
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    return this.database.select<AuthUser>(
      "users",
      (user) => user.email.toLocaleLowerCase() === email.toLocaleLowerCase()
    )[0] ?? null;
  }

  async assignRoles(organizationId: string, userId: string, roles: MvpRole[]): Promise<MvpRole[]> {
    const existingRows = this.database.selectForTenant<UserRoleRow>(
      "user_roles",
      organizationId,
      (row) => row.userId === userId
    );
    const existingRoles = new Set<MvpRole>(existingRows.map((row: UserRoleRow) => row.role));

    for (const role of roles) {
      if (!existingRoles.has(role)) {
        this.database.insert<UserRoleRow>("user_roles", {
          id: randomUUID(),
          organizationId,
          userId,
          role,
          createdAt: new Date().toISOString()
        });
        existingRoles.add(role);
      }
    }

    return Array.from(existingRoles);
  }

  async syncUserSessionRoles(organizationId: string, userId: string, roles: MvpRole[]): Promise<void> {
    const sessions = this.database.selectForTenant<AuthSession>(
      "auth_sessions",
      organizationId,
      (session) => session.userId === userId
    );

    for (const session of sessions) {
      this.database.upsert<AuthSession>("auth_sessions", {
        ...session,
        roles
      });
    }
  }

  async createSession(session: AuthSession): Promise<AuthSession> {
    return this.database.insert("auth_sessions", session);
  }

  async updateSession(session: AuthSession): Promise<AuthSession> {
    return this.database.upsert("auth_sessions", session);
  }

  async findSessionByToken(token: string): Promise<AuthSession | null> {
    return this.database.select<AuthSession>(
      "auth_sessions",
      (session) => session.token === token
    )[0] ?? null;
  }

  async findSessionByIdForTenant(
    id: string,
    organizationId: string
  ): Promise<AuthSession | null> {
    return this.database.findByIdForTenant<AuthSession>("auth_sessions", id, organizationId);
  }

  async listUserSessions(
    organizationId: string,
    userId: string
  ): Promise<AuthSession[]> {
    return this.database.selectForTenant<AuthSession>(
      "auth_sessions",
      organizationId,
      (session) => session.userId === userId
    );
  }

  async findOrganizationById(id: string): Promise<AuthOrganization | null> {
    return this.database.findById<AuthOrganization>("organizations", id);
  }

  async findUserById(id: string): Promise<AuthUser | null> {
    return this.database.findById<AuthUser>("users", id);
  }

  async findCredentialByUserId(userId: string): Promise<AuthCredential | null> {
    return this.database.select<AuthCredential>(
      "auth_credentials",
      (credential) => credential.userId === userId
    )[0] ?? null;
  }

  async upsertCredential(credential: AuthCredential): Promise<AuthCredential> {
    return this.database.upsert("auth_credentials", credential);
  }

  async findLoginAttemptByEmail(email: string): Promise<AuthLoginAttempt | null> {
    return this.database.select<AuthLoginAttempt>(
      "auth_login_attempts",
      (attempt) => attempt.email.toLocaleLowerCase() === email.toLocaleLowerCase()
    )[0] ?? null;
  }

  async upsertLoginAttempt(attempt: AuthLoginAttempt): Promise<AuthLoginAttempt> {
    return this.database.upsert("auth_login_attempts", attempt);
  }

  async appendSecurityEvent(event: AuthSecurityEvent): Promise<void> {
    this.database.insert("auth_security_events", event);
  }

  async createPasswordResetRequest(
    request: AuthPasswordResetRequest
  ): Promise<AuthPasswordResetRequest> {
    return this.database.insert("auth_password_reset_requests", request);
  }

  async findPasswordResetRequestByTokenHash(
    tokenHash: string
  ): Promise<AuthPasswordResetRequest | null> {
    return this.database.select<AuthPasswordResetRequest>(
      "auth_password_reset_requests",
      (request) => request.tokenHash === tokenHash
    )[0] ?? null;
  }

  async updatePasswordResetRequest(
    request: AuthPasswordResetRequest
  ): Promise<AuthPasswordResetRequest> {
    return this.database.upsert("auth_password_reset_requests", request);
  }

  async createEmailVerificationRequest(
    request: AuthEmailVerificationRequest
  ): Promise<AuthEmailVerificationRequest> {
    return this.database.insert("auth_email_verification_requests", request);
  }

  async findEmailVerificationRequestByTokenHash(
    tokenHash: string
  ): Promise<AuthEmailVerificationRequest | null> {
    return this.database.select<AuthEmailVerificationRequest>(
      "auth_email_verification_requests",
      (request) => request.tokenHash === tokenHash
    )[0] ?? null;
  }

  async updateEmailVerificationRequest(
    request: AuthEmailVerificationRequest
  ): Promise<AuthEmailVerificationRequest> {
    return this.database.upsert("auth_email_verification_requests", request);
  }

  async appendActivityEvent(event: AuthActivityEvent): Promise<void> {
    this.database.insert("auth_activity_events", event);
  }

  async listUserActivityEvents(
    organizationId: string,
    userId: string
  ): Promise<AuthActivityEvent[]> {
    return this.database.selectForTenant<AuthActivityEvent>(
      "auth_activity_events",
      organizationId,
      (event) => event.userId === userId
    );
  }

  async userBelongsToOrganization(organizationId: string, userId: string): Promise<boolean> {
    return this.database.selectForTenant<UserRoleRow>(
      "user_roles",
      organizationId,
      (row) => row.userId === userId
    ).length > 0;
  }

  async findOrganizationIdsForUser(userId: string): Promise<string[]> {
    return [
      ...new Set(
        this.database
          .select<UserRoleRow>("user_roles", (row) => row.userId === userId)
          .map((row) => row.organizationId)
      )
    ];
  }

  async createFounderProtection(protection: FounderProtection): Promise<FounderProtection> {
    return this.database.insert("organization_founder_protection", protection);
  }

  async findFounderProtectionByOrganization(organizationId: string): Promise<FounderProtection | null> {
    return this.database.selectForTenant<FounderProtection>(
      "organization_founder_protection",
      organizationId
    )[0] ?? null;
  }

  async updateFounderProtection(protection: FounderProtection): Promise<FounderProtection> {
    return this.database.upsert("organization_founder_protection", protection);
  }

  async createFounderOwnershipTransfer(
    transfer: FounderOwnershipTransfer
  ): Promise<FounderOwnershipTransfer> {
    return this.database.insert("founder_ownership_transfers", transfer);
  }

  async findFounderOwnershipTransferById(
    id: string,
    organizationId: string
  ): Promise<FounderOwnershipTransfer | null> {
    return this.database.findByIdForTenant<FounderOwnershipTransfer>(
      "founder_ownership_transfers",
      id,
      organizationId
    );
  }

  async findPendingFounderOwnershipTransfer(
    organizationId: string
  ): Promise<FounderOwnershipTransfer | null> {
    return this.database.selectForTenant<FounderOwnershipTransfer>(
      "founder_ownership_transfers",
      organizationId,
      (transfer) => transfer.status === "PENDING"
    )[0] ?? null;
  }

  async updateFounderOwnershipTransfer(
    transfer: FounderOwnershipTransfer
  ): Promise<FounderOwnershipTransfer> {
    return this.database.upsert("founder_ownership_transfers", transfer);
  }

  async appendAuditEvent(event: AuthAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): AuthAuditEvent[] {
    return this.database.selectForTenant<AuthAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) =>
        event.entityType === "AUTH_ORGANIZATION" ||
        event.entityType === "AUTH_USER" ||
        event.entityType === "AUTH_USER_PROFILE" ||
        event.entityType === "AUTH_CREDENTIAL" ||
        event.entityType === "AUTH_SESSION" ||
        event.entityType === "AUTH_PASSWORD_RESET_REQUEST" ||
        event.entityType === "AUTH_EMAIL_VERIFICATION" ||
        event.entityType === "AUTH_ACTIVITY_EVENT" ||
        event.entityType === "USER_ROLE" ||
        event.entityType === "PLATFORM_CREATOR_ROLE" ||
        event.entityType === "AUTH_SECURITY_EVENT" ||
        event.entityType === "FOUNDER_PROTECTION" ||
        event.entityType === "FOUNDER_RECOVERY" ||
        event.entityType === "FOUNDER_OWNERSHIP_TRANSFER"
    );
  }
}
