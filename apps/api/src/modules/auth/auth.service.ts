import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { isLoginSecretValid } from "../security/environment-security";
import { DatabaseAuthRepository } from "./auth.repository";
import {
  type AuthActor,
  type AuthAuditAction,
  type AuthAuditEntityType,
  type AuthAuditEvent,
  type AuthSecurityEventType,
  type FounderOwnershipTransfer,
  type FounderOwnershipTransferResult,
  type FounderProtection,
  type FounderRecoveryResult,
  type InitiateFounderOwnershipTransferInput,
  type LoginInput,
  type LoginResult,
  type MvpRole
} from "./auth.types";

const DEFAULT_ROLES: MvpRole[] = ["TRANSLATOR"];
const FOUNDER_RECOVERY_ROLES: MvpRole[] = ["ADMIN", "REVIEWER", "TRANSLATOR"];
const PLATFORM_CREATOR_ROLE: MvpRole = "PLATFORM_CREATOR";
const FOUNDER_TRANSFER_EXPIRATION_DAYS = 30;
const FOUNDER_TRANSFER_EXPIRATION_MS = FOUNDER_TRANSFER_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCKOUT_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(private readonly repository: DatabaseAuthRepository) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const email = this.normalizeEmail(input.email);

    if (!email) {
      throw new BadRequestException("email is required.");
    }

    await this.assertAccountNotLocked(email);

    if (!this.isValidEmail(email) || !isLoginSecretValid(input.loginSecret)) {
      await this.recordFailedLogin(email, "Invalid login credentials.");
      throw new UnauthorizedException("Invalid login credentials.");
    }

    const now = new Date().toISOString();
    let organization = await this.repository.firstOrganization();
    const organizationCreated = !organization;

    if (!organization) {
      organization = await this.repository.createOrganization({
        id: randomUUID(),
        name: input.organizationName ?? "Default Organization",
        organizationType: input.organizationType ?? "PERSOANA_FIZICA",
        createdAt: now,
        updatedAt: now
      });
    }

    let user = await this.repository.findUserByEmail(email);
    const userCreated = !user;

    if (!user) {
      user = await this.repository.createUser({
        id: randomUUID(),
        email,
        displayName: input.displayName ?? email,
        createdAt: now
      });
    }

    let roles = await this.repository.assignRoles(
      organization.id,
      user.id,
      DEFAULT_ROLES
    );

    const platformCreatorAccess = this.isConfiguredPlatformCreatorEmail(email);

    if (platformCreatorAccess) {
      roles = await this.repository.assignRoles(organization.id, user.id, [PLATFORM_CREATOR_ROLE]);
    }

    const founderProtection = organizationCreated
      ? await this.repository.createFounderProtection({
          id: randomUUID(),
          organizationId: organization.id,
          founderUserId: user.id,
          protectionStatus: "ACTIVE",
          recoveryEnabled: true,
          createdAt: now,
          updatedAt: now
        })
      : undefined;
    const session = await this.repository.createSession({
      id: randomUUID(),
      token: randomUUID(),
      organizationId: organization.id,
      userId: user.id,
      roles,
      createdAt: now,
      expiresAt: this.createSessionExpiration(now),
      lastSeenAt: now
    });
    await this.clearLoginAttempt(email);

    const result: LoginResult = {
      user,
      organization,
      session,
      actor: {
        userId: user.id,
        organizationId: organization.id,
        roles
      }
    };

    const actor = result.actor;

    if (organizationCreated) {
      await this.audit("CREATE", actor, "AUTH_ORGANIZATION", organization.id, undefined, organization);
    }

    if (userCreated) {
      await this.audit("CREATE", actor, "AUTH_USER", user.id, undefined, user);
    }

    if (founderProtection) {
      await this.audit(
        "CREATE",
        actor,
        "FOUNDER_PROTECTION",
        founderProtection.id,
        undefined,
        founderProtection
      );
    }

    await this.audit("UPDATE", actor, "USER_ROLE", user.id, undefined, {
      organizationId: organization.id,
      userId: user.id,
      roles
    });

    if (platformCreatorAccess) {
      await this.audit(
        "CREATOR_ROLE_ACCESS",
        actor,
        "PLATFORM_CREATOR_ROLE",
        user.id,
        undefined,
        {
          organizationId: organization.id,
          userId: user.id,
          role: PLATFORM_CREATOR_ROLE,
          unrestrictedAccess: true,
          subscriptionIndependent: true
        }
      );
    }

    await this.audit("CREATE", actor, "AUTH_SESSION", session.id, undefined, session);

    return result;
  }

  async getCurrentActor(token: string): Promise<AuthActor> {
    if (!token) {
      throw new BadRequestException("session token is required.");
    }

    const session = await this.repository.findSessionByToken(token);

    if (!session) {
      throw new NotFoundException("session not found.");
    }

    if (session.revokedAt) {
      throw new UnauthorizedException("session is not valid.");
    }

    if (this.isSessionExpired(session)) {
      await this.auditSecurityEvent("SESSION_EXPIRED", "Session token expired.", {
        organizationId: session.organizationId,
        userId: session.userId
      });
      throw new UnauthorizedException("session is not valid.");
    }

    if (this.isSessionIdleTimedOut(session)) {
      await this.auditSecurityEvent("SESSION_IDLE_TIMEOUT", "Session idle timeout exceeded.", {
        organizationId: session.organizationId,
        userId: session.userId
      });
      throw new UnauthorizedException("session is not valid.");
    }

    await this.repository.updateSession({
      ...session,
      lastSeenAt: new Date().toISOString()
    });

    return {
      userId: session.userId,
      organizationId: session.organizationId,
      roles: session.roles
    };
  }

  getAuditEvents(actor: AuthActor): AuthAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  async getFounderProtection(actor: AuthActor): Promise<FounderProtection> {
    this.validateActor(actor);
    const protection = await this.loadFounderProtection(actor.organizationId);
    this.assertFounderOrPrivilegedHuman(actor, protection);

    return protection;
  }

  async recoverFounderProtection(actor: AuthActor): Promise<FounderRecoveryResult> {
    this.validateActor(actor);
    let protection = await this.loadFounderProtection(actor.organizationId);
    this.assertCurrentFounder(actor, protection);

    if (!protection.recoveryEnabled) {
      throw new ForbiddenException("founder recovery protection is disabled.");
    }

    const roles = await this.repository.assignRoles(
      actor.organizationId,
      actor.userId,
      FOUNDER_RECOVERY_ROLES
    );
    await this.repository.syncUserSessionRoles(actor.organizationId, actor.userId, roles);
    await this.audit("UPDATE", actor, "FOUNDER_RECOVERY", protection.id, undefined, {
      protection,
      recoveredRoles: roles
    });

    return {
      protection,
      roles
    };
  }

  async initiateFounderOwnershipTransfer(
    actor: AuthActor,
    input: InitiateFounderOwnershipTransferInput
  ): Promise<FounderOwnershipTransferResult> {
    this.validateActor(actor);

    if (!input.targetUserId) {
      throw new BadRequestException("targetUserId is required.");
    }

    let protection = await this.loadFounderProtection(actor.organizationId);
    this.assertCurrentFounder(actor, protection);

    if (input.targetUserId === actor.userId) {
      throw new BadRequestException("founder ownership is already assigned to this user.");
    }

    const targetUser = await this.repository.findUserById(input.targetUserId);

    if (!targetUser) {
      throw new NotFoundException("target user not found.");
    }

    const targetBelongsToOrganization = await this.repository.userBelongsToOrganization(
      actor.organizationId,
      input.targetUserId
    );

    if (!targetBelongsToOrganization) {
      throw new ForbiddenException("target user must belong to the same organization.");
    }

    const now = new Date().toISOString();
    const pendingTransfer = await this.repository.findPendingFounderOwnershipTransfer(actor.organizationId);

    if (pendingTransfer) {
      if (!this.isTransferExpired(pendingTransfer)) {
        throw new BadRequestException("a founder ownership transfer is already pending.");
      }

      protection = (await this.cancelPendingTransfer(actor, protection, pendingTransfer, now)).protection;
    }

    const transfer: FounderOwnershipTransfer = await this.repository.createFounderOwnershipTransfer({
      id: randomUUID(),
      organizationId: actor.organizationId,
      fromFounderUserId: actor.userId,
      toFounderUserId: input.targetUserId,
      status: "PENDING",
      requestedBy: actor.userId,
      createdAt: now,
      expiresAt: this.createTransferExpiration(now)
    });
    const updatedProtection = await this.repository.updateFounderProtection({
      ...protection,
      protectionStatus: "TRANSFER_PENDING",
      updatedAt: now
    });

    await this.audit(
      "CREATE",
      actor,
      "FOUNDER_OWNERSHIP_TRANSFER",
      transfer.id,
      undefined,
      transfer
    );
    await this.audit(
      "UPDATE",
      actor,
      "FOUNDER_PROTECTION",
      protection.id,
      protection,
      updatedProtection
    );

    return {
      protection: updatedProtection,
      transfer
    };
  }

  async acceptFounderOwnershipTransfer(
    actor: AuthActor,
    transferId: string
  ): Promise<FounderOwnershipTransferResult> {
    this.validateActor(actor);

    if (!transferId) {
      throw new BadRequestException("transferId is required.");
    }

    const transfer = await this.repository.findFounderOwnershipTransferById(
      transferId,
      actor.organizationId
    );

    if (!transfer) {
      throw new NotFoundException("founder ownership transfer not found.");
    }

    if (transfer.status !== "PENDING") {
      throw new BadRequestException("founder ownership transfer is not pending.");
    }

    this.assertTransferNotExpired(transfer);

    if (transfer.toFounderUserId !== actor.userId) {
      throw new ForbiddenException("only the target user may accept founder ownership.");
    }

    const acceptingUserBelongsToOrganization = await this.repository.userBelongsToOrganization(
      actor.organizationId,
      actor.userId
    );

    if (!acceptingUserBelongsToOrganization) {
      throw new ForbiddenException("accepting user must belong to the same organization.");
    }

    const protection = await this.loadFounderProtection(actor.organizationId);
    this.assertTransferMatchesFounderState(protection, transfer);

    const now = new Date().toISOString();
    const updatedProtection = await this.repository.updateFounderProtection({
      ...protection,
      founderUserId: actor.userId,
      protectionStatus: "ACTIVE",
      updatedAt: now
    });
    const updatedTransfer = await this.repository.updateFounderOwnershipTransfer({
      ...transfer,
      status: "ACCEPTED",
      acceptedBy: actor.userId,
      completedAt: now
    });
    const roles = await this.repository.assignRoles(
      actor.organizationId,
      actor.userId,
      FOUNDER_RECOVERY_ROLES
    );
    await this.repository.syncUserSessionRoles(actor.organizationId, actor.userId, roles);

    await this.audit(
      "UPDATE",
      actor,
      "FOUNDER_PROTECTION",
      protection.id,
      protection,
      updatedProtection
    );
    await this.audit(
      "UPDATE",
      actor,
      "FOUNDER_OWNERSHIP_TRANSFER",
      transfer.id,
      transfer,
      updatedTransfer
    );

    return {
      protection: updatedProtection,
      transfer: updatedTransfer,
      roles
    };
  }

  async cancelFounderOwnershipTransfer(
    actor: AuthActor,
    transferId: string
  ): Promise<FounderOwnershipTransferResult> {
    this.validateActor(actor);

    if (!transferId) {
      throw new BadRequestException("transferId is required.");
    }

    const transfer = await this.repository.findFounderOwnershipTransferById(
      transferId,
      actor.organizationId
    );

    if (!transfer) {
      throw new NotFoundException("founder ownership transfer not found.");
    }

    if (transfer.status !== "PENDING") {
      throw new BadRequestException("founder ownership transfer is not pending.");
    }

    const protection = await this.loadFounderProtection(actor.organizationId);
    this.assertCurrentFounder(actor, protection);

    if (transfer.fromFounderUserId !== actor.userId) {
      throw new ForbiddenException("only the founder who initiated the transfer may cancel it.");
    }

    return this.cancelPendingTransfer(actor, protection, transfer, new Date().toISOString());
  }

  private async audit(
    action: AuthAuditAction,
    actor: AuthActor,
    entityType: AuthAuditEntityType,
    entityId: string,
    beforeState: object | undefined,
    afterState: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      entityType,
      entityId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private async recordFailedLogin(email: string, message: string): Promise<void> {
    const existing = await this.repository.findLoginAttemptByEmail(email);
    const now = new Date().toISOString();
    const failureCount = (existing?.failureCount ?? 0) + 1;
    const lockedUntil =
      failureCount >= MAX_FAILED_LOGIN_ATTEMPTS
        ? new Date(Date.now() + ACCOUNT_LOCKOUT_MS).toISOString()
        : existing?.lockedUntil;

    const attempt = await this.repository.upsertLoginAttempt({
      id: existing?.id ?? randomUUID(),
      email,
      failureCount,
      lockedUntil,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    });

    await this.auditSecurityEvent("LOGIN_FAILED", message, {
      email
    });

    if (attempt.lockedUntil && failureCount >= MAX_FAILED_LOGIN_ATTEMPTS) {
      await this.auditSecurityEvent("ACCOUNT_LOCKED", "Account temporarily locked.", {
        email
      });
    }
  }

  private async clearLoginAttempt(email: string): Promise<void> {
    const existing = await this.repository.findLoginAttemptByEmail(email);

    if (!existing) {
      return;
    }

    await this.repository.upsertLoginAttempt({
      ...existing,
      failureCount: 0,
      lockedUntil: undefined,
      updatedAt: new Date().toISOString()
    });
  }

  private async assertAccountNotLocked(email: string): Promise<void> {
    const attempt = await this.repository.findLoginAttemptByEmail(email);

    if (!attempt?.lockedUntil) {
      return;
    }

    const lockedUntil = Date.parse(attempt.lockedUntil);

    if (Number.isFinite(lockedUntil) && lockedUntil > Date.now()) {
      await this.auditSecurityEvent("LOGIN_LOCKED", "Login rejected because account is temporarily locked.", {
        email
      });
      throw new UnauthorizedException("Account is temporarily locked. Try again later.");
    }

    await this.repository.upsertLoginAttempt({
      ...attempt,
      failureCount: 0,
      lockedUntil: undefined,
      updatedAt: new Date().toISOString()
    });
  }

  private async auditSecurityEvent(
    eventType: AuthSecurityEventType,
    message: string,
    context: { email?: string; organizationId?: string; userId?: string }
  ): Promise<void> {
    await this.repository.appendSecurityEvent({
      id: randomUUID(),
      organizationId: context.organizationId,
      userId: context.userId,
      email: context.email,
      eventType,
      message,
      createdAt: new Date().toISOString()
    });
  }

  private normalizeEmail(email: string | undefined): string {
    return (email ?? "").trim().toLocaleLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email);
  }

  private createSessionExpiration(createdAt: string): string {
    return new Date(Date.parse(createdAt) + SESSION_TTL_MS).toISOString();
  }

  private isSessionExpired(session: { expiresAt?: string }): boolean {
    const expiresAt = Date.parse(session.expiresAt ?? "");

    return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
  }

  private isSessionIdleTimedOut(session: { lastSeenAt?: string }): boolean {
    const lastSeenAt = Date.parse(session.lastSeenAt ?? "");

    return !Number.isFinite(lastSeenAt) || lastSeenAt + SESSION_IDLE_TIMEOUT_MS <= Date.now();
  }

  private async loadFounderProtection(organizationId: string): Promise<FounderProtection> {
    const protection = await this.repository.findFounderProtectionByOrganization(organizationId);

    if (!protection) {
      throw new NotFoundException("founder protection is not configured for this organization.");
    }

    return protection;
  }

  private assertCurrentFounder(actor: AuthActor, protection: FounderProtection): void {
    if (protection.founderUserId !== actor.userId) {
      throw new ForbiddenException("only the protected founder may perform this action.");
    }
  }

  private assertTransferMatchesFounderState(
    protection: FounderProtection,
    transfer: FounderOwnershipTransfer
  ): void {
    if (
      protection.protectionStatus !== "TRANSFER_PENDING" ||
      protection.founderUserId !== transfer.fromFounderUserId
    ) {
      throw new BadRequestException("organization no longer has a valid founder transfer state.");
    }
  }

  private assertTransferNotExpired(transfer: FounderOwnershipTransfer): void {
    if (this.isTransferExpired(transfer)) {
      throw new BadRequestException("founder ownership transfer is expired.");
    }
  }

  private isTransferExpired(transfer: FounderOwnershipTransfer): boolean {
    const expiresAt = Date.parse(transfer.expiresAt);

    return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
  }

  private createTransferExpiration(createdAt: string): string {
    return new Date(Date.parse(createdAt) + FOUNDER_TRANSFER_EXPIRATION_MS).toISOString();
  }

  private async cancelPendingTransfer(
    actor: AuthActor,
    protection: FounderProtection,
    transfer: FounderOwnershipTransfer,
    completedAt: string
  ): Promise<FounderOwnershipTransferResult> {
    this.assertTransferMatchesFounderState(protection, transfer);

    const updatedTransfer = await this.repository.updateFounderOwnershipTransfer({
      ...transfer,
      status: "CANCELLED",
      completedAt
    });
    const updatedProtection = await this.repository.updateFounderProtection({
      ...protection,
      protectionStatus: "ACTIVE",
      updatedAt: completedAt
    });

    await this.audit(
      "UPDATE",
      actor,
      "FOUNDER_OWNERSHIP_TRANSFER",
      transfer.id,
      transfer,
      updatedTransfer
    );
    await this.audit(
      "UPDATE",
      actor,
      "FOUNDER_PROTECTION",
      protection.id,
      protection,
      updatedProtection
    );

    return {
      protection: updatedProtection,
      transfer: updatedTransfer
    };
  }

  private assertFounderOrPrivilegedHuman(actor: AuthActor, protection: FounderProtection): void {
    const roles = new Set(actor.roles);

    if (
      protection.founderUserId !== actor.userId &&
      !roles.has("PLATFORM_CREATOR") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("founder protection details require founder, admin, or reviewer access.");
    }
  }

  private validateActor(actor: AuthActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private isConfiguredPlatformCreatorEmail(email: string): boolean {
    const configuredEmails = (process.env.LABORATOR_PLATFORM_CREATOR_EMAILS ??
      process.env.LABORATOR_PLATFORM_CREATOR_EMAIL ??
      "")
      .split(",")
      .map((value) => this.normalizeEmail(value))
      .filter((value) => value.length > 0);

    return configuredEmails.includes(email);
  }

}
