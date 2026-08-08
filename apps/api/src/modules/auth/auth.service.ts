import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { isLoginSecretValid } from "../security/environment-security";
import { DatabaseAuthRepository } from "./auth.repository";
import { permissionsForRoles } from "./request-context.types";
import {
  type AuthActor,
  type AuthActiveSessionsResult,
  type AuthAuditAction,
  type AuthAuditEntityType,
  type AuthAuditEvent,
  type AuthActivityEvent,
  type AuthenticationMethod,
  type CanonicalIdentity,
  type AuthCredential,
  type AuthEmailVerificationRequest,
  type AuthOrganization,
  type AuthProfileResult,
  type AuthSecurityEventType,
  type AuthSession,
  type AuthSessionRefreshResult,
  type AuthSessionSummary,
  type AuthSessionVerificationResult,
  type AuthUser,
  type ChangePasswordInput,
  type FounderOwnershipTransfer,
  type FounderOwnershipTransferResult,
  type FounderProtection,
  type FounderRecoveryResult,
  type InitiateFounderOwnershipTransferInput,
  type LoginInput,
  type LoginResult,
  type MvpRole,
  type RequestPasswordResetInput,
  type SafeAuthMutationResult,
  type UpdateProfileInput,
  type VerifyEmailInput
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
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_HASH_KEY_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 12;

@Injectable()
export class AuthService {
  constructor(private readonly repository: DatabaseAuthRepository) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const email = this.normalizeEmail(input.email);

    if (!email) {
      throw new BadRequestException("email is required.");
    }

    await this.assertAccountNotLocked(email);

    if (!this.isValidEmail(email)) {
      await this.recordFailedLogin(email, "Invalid login credentials.");
      throw new UnauthorizedException("Invalid login credentials.");
    }

    if (input.password) {
      this.assertPasswordStrength(input.password);
    }

    const now = new Date().toISOString();
    const bootstrapSecretValid = isLoginSecretValid(input.loginSecret);
    const existingUser = await this.repository.findUserByEmail(email);

    if (existingUser) {
      await this.assertUserCanAuthenticate(existingUser, input, bootstrapSecretValid);
    } else if (!bootstrapSecretValid) {
      await this.recordFailedLogin(email, "Invalid login credentials.");
      throw new UnauthorizedException("Invalid login credentials.");
    }

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

    let user = existingUser;
    const userCreated = !user;

    if (!user) {
      user = await this.repository.createUser({
        id: randomUUID(),
        identityType: "HUMAN_USER",
        canonicalUsername: email,
        preferredLocale: "ro-RO",
        authenticationMethods: [],
        securityVersion: 1,
        email,
        displayName: input.displayName ?? email,
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now
      });
    }

    const userBeforeLogin = user;
    const normalizedUserStatus = user.status ?? "ACTIVE";
    const identityId = user.identityId ?? user.id;
    const authenticationMethods = this.mergeAuthenticationMethods(
      user.authenticationMethods,
      this.authenticationMethodForLogin(input, bootstrapSecretValid)
    );
    user = await this.repository.updateUser({
      ...user,
      identityId,
      identityType: user.identityType ?? "HUMAN_USER",
      canonicalUsername: user.canonicalUsername ?? email,
      preferredLocale: user.preferredLocale ?? "ro-RO",
      authenticationMethods,
      securityVersion: user.securityVersion ?? 1,
      status: normalizedUserStatus,
      displayName: input.displayName ?? user.displayName,
      lastLoginAt: now,
      updatedAt: now,
      profile: {
        displayName: input.displayName ?? user.displayName,
        email: user.email,
        status: normalizedUserStatus,
        createdAt: user.createdAt,
        lastLoginAt: now,
        emailVerifiedAt: user.emailVerifiedAt
      }
    });
    const canonicalIdentityBefore = await this.repository.findCanonicalIdentityByIdForTenant(
      identityId,
      organization.id
    );
    const canonicalIdentity = await this.repository.upsertCanonicalIdentity(
      this.buildCanonicalIdentity(user, organization.id, canonicalIdentityBefore, now)
    );

    let createdCredential: AuthCredential | undefined;

    if (input.password && !(await this.repository.findCredentialByUserId(user.id))) {
      createdCredential = await this.createCredential(user.id, input.password);
      await this.repository.upsertCredential(createdCredential);
    }

    const emailVerificationRequest = userCreated
      ? await this.repository.createEmailVerificationRequest({
          id: randomUUID(),
          email: user.email,
          userId: user.id,
          organizationId: organization.id,
          tokenHash: this.hashToken(randomUUID()),
          createdAt: now,
          expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS).toISOString()
        })
      : undefined;

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
      identityId: user.identityId ?? user.id,
      identityType: user.identityType ?? "HUMAN_USER",
      authenticationLevel: bootstrapSecretValid && !input.password ? "BOOTSTRAP" : "PASSWORD",
      issuedAt: now,
      securityVersion: user.securityVersion ?? 1,
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
        roles,
        identityId: user.identityId ?? user.id,
        identityType: user.identityType ?? "HUMAN_USER",
        authenticationLevel: session.authenticationLevel,
        securityVersion: user.securityVersion ?? 1
      }
    };

    const actor = result.actor;

    if (organizationCreated) {
      await this.audit("CREATE", actor, "AUTH_ORGANIZATION", organization.id, undefined, organization);
    }

    if (userCreated) {
      await this.audit("CREATE", actor, "AUTH_USER", user.id, undefined, user);
    }

    await this.audit(
      canonicalIdentityBefore ? "UPDATE" : "CREATE",
      actor,
      "AUTH_IDENTITY",
      canonicalIdentity.id,
      canonicalIdentityBefore ?? undefined,
      canonicalIdentity
    );

    if (createdCredential) {
      await this.audit(
        "CREATE",
        actor,
        "AUTH_CREDENTIAL",
        createdCredential.id,
        undefined,
        this.safeCredentialState(createdCredential)
      );
    }

    if (emailVerificationRequest) {
      await this.audit(
        "CREATE",
        actor,
        "AUTH_EMAIL_VERIFICATION",
        emailVerificationRequest.id,
        undefined,
        this.safeEmailVerificationState(emailVerificationRequest)
      );
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
    await this.audit("LOGIN", actor, "AUTH_USER", user.id, userBeforeLogin, user);
    await this.auditActivity(actor, "LOGIN_SUCCEEDED", "User authenticated successfully.", {
      sessionId: session.id
    });
    await this.auditSecurityEvent("LOGIN_SUCCEEDED", "User authenticated successfully.", {
      organizationId: organization.id,
      userId: user.id
    });

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

    const user = await this.repository.findUserById(session.userId);

    if (!user || !this.isAuthenticatableUserStatus(user.status)) {
      await this.auditSecurityEvent("IDENTITY_STATUS_REJECTED", "Session rejected by identity status.", {
        organizationId: session.organizationId,
        userId: session.userId
      });
      throw new UnauthorizedException("session is not valid.");
    }

    const userSecurityVersion = user.securityVersion ?? 1;

    if ((session.securityVersion ?? userSecurityVersion) !== userSecurityVersion) {
      await this.repository.updateSession({
        ...session,
        revokedAt: new Date().toISOString(),
        revocationReason: "SECURITY_VERSION_CHANGED"
      });
      await this.auditSecurityEvent("SESSION_REVOKED", "Session revoked after critical identity change.", {
        organizationId: session.organizationId,
        userId: session.userId
      });
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
      roles: session.roles,
      identityId: session.identityId ?? user.identityId ?? session.userId,
      identityType: session.identityType ?? user.identityType ?? "HUMAN_USER",
      authenticationLevel: session.authenticationLevel,
      securityVersion: userSecurityVersion
    };
  }

  async verifySession(
    actor: AuthActor,
    token: string
  ): Promise<AuthSessionVerificationResult> {
    this.validateActor(actor);
    const session = await this.loadSessionForActor(actor, token);
    const user = await this.loadUser(actor.userId);
    const organization = await this.loadOrganization(actor.organizationId);

    return {
      authenticated: true,
      user,
      organization,
      session,
      roles: actor.roles
    };
  }

  async refreshSession(actor: AuthActor, token: string): Promise<AuthSessionRefreshResult> {
    this.validateActor(actor);
    const existing = await this.loadSessionForActor(actor, token);
    const now = new Date().toISOString();
    const refreshed = await this.repository.updateSession({
      ...existing,
      token: randomUUID(),
      expiresAt: this.createSessionExpiration(now),
      lastSeenAt: now,
      issuedAt: now
    });
    const refreshedActor: AuthActor = {
      userId: refreshed.userId,
      organizationId: refreshed.organizationId,
      roles: refreshed.roles,
      identityId: refreshed.identityId,
      identityType: refreshed.identityType,
      authenticationLevel: refreshed.authenticationLevel,
      securityVersion: refreshed.securityVersion
    };

    await this.audit("REFRESH_SESSION", actor, "AUTH_SESSION", refreshed.id, existing, refreshed);
    await this.auditActivity(actor, "SESSION_REFRESHED", "Session refreshed.", {
      sessionId: refreshed.id
    });
    await this.auditSecurityEvent("SESSION_REFRESHED", "Session refreshed.", {
      organizationId: actor.organizationId,
      userId: actor.userId
    });

    return {
      session: refreshed,
      actor: refreshedActor
    };
  }

  async logout(actor: AuthActor, token: string): Promise<SafeAuthMutationResult> {
    this.validateActor(actor);
    const existing = await this.loadSessionForActor(actor, token);
    const revoked = await this.repository.updateSession({
      ...existing,
      revokedAt: new Date().toISOString()
    });

    await this.audit("LOGOUT", actor, "AUTH_SESSION", revoked.id, existing, revoked);
    await this.auditActivity(actor, "LOGOUT", "User logged out.", {
      sessionId: revoked.id
    });
    await this.auditSecurityEvent("LOGOUT", "User logged out.", {
      organizationId: actor.organizationId,
      userId: actor.userId
    });

    return {
      accepted: true,
      message: "Logout completed."
    };
  }

  async listActiveSessions(
    actor: AuthActor,
    currentToken?: string
  ): Promise<AuthActiveSessionsResult> {
    this.validateActor(actor);
    const sessions = await this.repository.listUserSessions(actor.organizationId, actor.userId);

    return {
      sessions: sessions.map((session) => this.toSessionSummary(session, currentToken))
    };
  }

  async revokeSession(
    actor: AuthActor,
    sessionId: string
  ): Promise<SafeAuthMutationResult> {
    this.validateActor(actor);

    if (!sessionId) {
      throw new BadRequestException("sessionId is required.");
    }

    const existing = await this.repository.findSessionByIdForTenant(sessionId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("session not found.");
    }

    if (existing.userId !== actor.userId && !this.isPrivilegedHuman(actor)) {
      throw new ForbiddenException("session revocation requires owner or admin access.");
    }

    const revoked = await this.repository.updateSession({
      ...existing,
      revokedAt: existing.revokedAt ?? new Date().toISOString()
    });

    await this.audit("REVOKE_SESSION", actor, "AUTH_SESSION", revoked.id, existing, revoked);
    await this.auditActivity(actor, "SESSION_REVOKED", "Session revoked.", {
      sessionId: revoked.id
    });
    await this.auditSecurityEvent("SESSION_REVOKED", "Session revoked.", {
      organizationId: actor.organizationId,
      userId: existing.userId
    });

    return {
      accepted: true,
      message: "Session revoked."
    };
  }

  async getProfile(actor: AuthActor): Promise<AuthProfileResult> {
    this.validateActor(actor);
    const user = await this.loadUser(actor.userId);
    const organization = await this.loadOrganization(actor.organizationId);
    const activityLog = await this.repository.listUserActivityEvents(actor.organizationId, actor.userId);

    return {
      user,
      organization,
      roles: actor.roles,
      permissions: permissionsForRoles(actor.roles),
      activityLog: activityLog.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    };
  }

  async updateProfile(
    actor: AuthActor,
    input: UpdateProfileInput
  ): Promise<AuthProfileResult> {
    this.validateActor(actor);
    const existing = await this.loadUser(actor.userId);
    const displayName = input.displayName?.trim();

    if (!displayName) {
      throw new BadRequestException("displayName is required.");
    }

    const updated = await this.repository.updateUser({
      ...existing,
      status: existing.status ?? "ACTIVE",
      displayName,
      profile: {
        displayName,
        email: existing.email,
        status: existing.status ?? "ACTIVE",
        createdAt: existing.createdAt,
        lastLoginAt: existing.lastLoginAt,
        emailVerifiedAt: existing.emailVerifiedAt
      }
    });

    await this.audit("UPDATE_PROFILE", actor, "AUTH_USER_PROFILE", updated.id, existing, updated);
    await this.auditActivity(actor, "UPDATE_PROFILE", "User profile updated.", {
      userId: updated.id
    });

    return this.getProfile(actor);
  }

  async requestPasswordReset(input: RequestPasswordResetInput): Promise<SafeAuthMutationResult> {
    const email = this.normalizeEmail(input.email);

    if (!email || !this.isValidEmail(email)) {
      return {
        accepted: true,
        message: "If the account exists, a reset process has been started."
      };
    }

    if (input.token && input.newPassword) {
      return this.completePasswordReset(email, input.token, input.newPassword);
    }

    const user = await this.repository.findUserByEmail(email);

    if (user) {
      const organizationIds = await this.repository.findOrganizationIdsForUser(user.id);
      const organizationId = organizationIds[0];
      const now = new Date().toISOString();
      const request = await this.repository.createPasswordResetRequest({
        id: randomUUID(),
        email,
        userId: user.id,
        organizationId,
        tokenHash: this.hashToken(randomUUID()),
        createdAt: now,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS).toISOString()
      });

      await this.auditSecurityEvent("PASSWORD_RESET_REQUESTED", "Password reset requested.", {
        email,
        organizationId,
        userId: user.id
      });

      if (organizationId) {
        const actor = {
          userId: user.id,
          organizationId,
          roles: ["GUEST"] as MvpRole[]
        };
        await this.audit(
          "REQUEST_PASSWORD_RESET",
          actor,
          "AUTH_PASSWORD_RESET_REQUEST",
          request.id,
          undefined,
          this.safePasswordResetState(request)
        );
        await this.auditActivity(actor, "PASSWORD_RESET_REQUESTED", "Password reset requested.", {
          requestId: request.id
        });
      }
    }

    return {
      accepted: true,
      message: "If the account exists, a reset process has been started."
    };
  }

  async changePassword(
    actor: AuthActor,
    input: ChangePasswordInput
  ): Promise<SafeAuthMutationResult> {
    this.validateActor(actor);
    this.assertPasswordStrength(input.newPassword);

    const existing = await this.repository.findCredentialByUserId(actor.userId);

    if (existing && !this.verifyPassword(input.currentPassword ?? "", existing)) {
      throw new UnauthorizedException("Current password is invalid.");
    }

    const credential = await this.createCredential(actor.userId, input.newPassword, existing?.id, existing?.createdAt);
    await this.repository.upsertCredential(credential);
    await this.bumpUserSecurityVersion(actor.userId);
    await this.revokeSessionsAfterCriticalChange(
      [actor.organizationId],
      actor.userId,
      "PASSWORD_CHANGED"
    );
    await this.audit(
      existing ? "CHANGE_PASSWORD" : "CREATE",
      actor,
      "AUTH_CREDENTIAL",
      credential.id,
      existing ? this.safeCredentialState(existing) : undefined,
      this.safeCredentialState(credential)
    );
    await this.auditActivity(actor, "PASSWORD_CHANGED", "Password changed.", {
      credentialId: credential.id
    });
    await this.auditSecurityEvent("PASSWORD_CHANGED", "Password changed.", {
      organizationId: actor.organizationId,
      userId: actor.userId
    });

    return {
      accepted: true,
      message: "Password changed."
    };
  }

  private async completePasswordReset(
    email: string,
    token: string,
    newPassword: string
  ): Promise<SafeAuthMutationResult> {
    this.assertPasswordStrength(newPassword);
    const request = await this.repository.findPasswordResetRequestByTokenHash(this.hashToken(token));

    if (!request || request.email !== email || request.usedAt || this.isPast(request.expiresAt) || !request.userId) {
      return {
        accepted: true,
        message: "If the account exists, a reset process has been started."
      };
    }

    const user = await this.repository.findUserById(request.userId);

    if (!user) {
      return {
        accepted: true,
        message: "If the account exists, a reset process has been started."
      };
    }

    const existing = await this.repository.findCredentialByUserId(user.id);
    const credential = await this.createCredential(user.id, newPassword, existing?.id, existing?.createdAt);
    const usedRequest = await this.repository.updatePasswordResetRequest({
      ...request,
      usedAt: new Date().toISOString()
    });
    await this.repository.upsertCredential(credential);
    await this.bumpUserSecurityVersion(user.id);
    const organizationIds = request.organizationId
      ? [request.organizationId]
      : await this.repository.findOrganizationIdsForUser(user.id);
    await this.revokeSessionsAfterCriticalChange(
      organizationIds,
      user.id,
      "PASSWORD_RESET"
    );

    if (request.organizationId) {
      const actor = {
        userId: user.id,
        organizationId: request.organizationId,
        roles: ["GUEST"] as MvpRole[]
      };
      await this.audit(
        "CHANGE_PASSWORD",
        actor,
        "AUTH_CREDENTIAL",
        credential.id,
        existing ? this.safeCredentialState(existing) : undefined,
        this.safeCredentialState(credential)
      );
      await this.audit(
        "UPDATE",
        actor,
        "AUTH_PASSWORD_RESET_REQUEST",
        usedRequest.id,
        this.safePasswordResetState(request),
        this.safePasswordResetState(usedRequest)
      );
      await this.auditActivity(actor, "PASSWORD_CHANGED", "Password changed through reset.", {
        requestId: usedRequest.id
      });
      await this.auditSecurityEvent("PASSWORD_CHANGED", "Password changed through reset.", {
        organizationId: request.organizationId,
        userId: user.id
      });
    }

    return {
      accepted: true,
      message: "Password reset completed."
    };
  }

  async verifyEmail(input: VerifyEmailInput): Promise<SafeAuthMutationResult> {
    const email = this.normalizeEmail(input.email);
    const tokenHash = this.hashToken(input.token ?? "");
    const request = input.token
      ? await this.repository.findEmailVerificationRequestByTokenHash(tokenHash)
      : null;

    if (!email || !this.isValidEmail(email) || !request || request.email !== email) {
      return {
        accepted: true,
        message: "Email verification request processed."
      };
    }

    if (request.verifiedAt || this.isPast(request.expiresAt)) {
      return {
        accepted: true,
        message: "Email verification request processed."
      };
    }

    const user = request.userId ? await this.repository.findUserById(request.userId) : null;
    const verifiedAt = new Date().toISOString();
    const updatedRequest: AuthEmailVerificationRequest = await this.repository.updateEmailVerificationRequest({
      ...request,
      verifiedAt
    });

    if (user) {
      await this.repository.updateUser({
        ...user,
        emailVerifiedAt: verifiedAt,
        profile: {
          displayName: user.displayName,
          email: user.email,
          status: user.status,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          emailVerifiedAt: verifiedAt
        }
      });
    }

    if (request.organizationId && request.userId) {
      const actor = {
        userId: request.userId,
        organizationId: request.organizationId,
        roles: ["GUEST"] as MvpRole[]
      };
      await this.audit(
        "VERIFY_EMAIL",
        actor,
        "AUTH_EMAIL_VERIFICATION",
        updatedRequest.id,
        this.safeEmailVerificationState(request),
        this.safeEmailVerificationState(updatedRequest)
      );
      await this.auditActivity(actor, "EMAIL_VERIFIED", "Email verified.", {
        requestId: updatedRequest.id
      });
      await this.auditSecurityEvent("EMAIL_VERIFIED", "Email verified.", {
        organizationId: request.organizationId,
        userId: request.userId
      });
    }

    return {
      accepted: true,
      message: "Email verification request processed."
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
    const protection = await this.loadFounderProtection(actor.organizationId);
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

  private async assertUserCanAuthenticate(
    user: AuthUser,
    input: LoginInput,
    bootstrapSecretValid: boolean
  ): Promise<void> {
    if (!this.isAuthenticatableUserStatus(user.status)) {
      await this.recordFailedLogin(user.email, "Invalid login credentials.");
      throw new UnauthorizedException("Invalid login credentials.");
    }

    const credential = await this.repository.findCredentialByUserId(user.id);

    if (credential && this.verifyPassword(input.password ?? "", credential)) {
      return;
    }

    if (bootstrapSecretValid) {
      return;
    }

    await this.recordFailedLogin(user.email, "Invalid login credentials.");
    throw new UnauthorizedException("Invalid login credentials.");
  }

  private buildCanonicalIdentity(
    user: AuthUser,
    organizationId: string,
    existing: CanonicalIdentity | null,
    now: string
  ): CanonicalIdentity {
    return {
      id: user.identityId ?? user.id,
      organizationId,
      userId: user.id,
      identityType: user.identityType ?? "HUMAN_USER",
      status: this.toCanonicalIdentityStatus(user.status),
      canonicalUsername: user.canonicalUsername ?? user.email,
      displayName: user.displayName,
      preferredLocale: user.preferredLocale,
      authenticationMethods: user.authenticationMethods ?? ["PASSWORD"],
      securityVersion: user.securityVersion ?? 1,
      createdAt: existing?.createdAt ?? user.createdAt,
      updatedAt: now,
      archivedAt: existing?.archivedAt,
      metadata: {
        ...(existing?.metadata ?? {}),
        source: "auth.users",
        canonicalModel: "Batch 02 identity foundation"
      }
    };
  }

  private toCanonicalIdentityStatus(status: AuthUser["status"]): CanonicalIdentity["status"] {
    if (status === "INACTIVE") {
      return "DISABLED";
    }

    return status;
  }

  private isAuthenticatableUserStatus(status: AuthUser["status"]): boolean {
    return status === "ACTIVE";
  }

  private authenticationMethodForLogin(
    input: LoginInput,
    bootstrapSecretValid: boolean
  ): AuthenticationMethod {
    if (input.password) {
      return "PASSWORD";
    }

    if (bootstrapSecretValid) {
      return "BOOTSTRAP_SECRET";
    }

    return "PASSWORD";
  }

  private mergeAuthenticationMethods(
    existing: AuthenticationMethod[] | undefined,
    method: AuthenticationMethod
  ): AuthenticationMethod[] {
    return [...new Set([...(existing ?? []), method])];
  }

  private async bumpUserSecurityVersion(userId: string): Promise<AuthUser> {
    const user = await this.loadUser(userId);
    const now = new Date().toISOString();

    return this.repository.updateUser({
      ...user,
      securityVersion: (user.securityVersion ?? 1) + 1,
      updatedAt: now,
      profile: user.profile
        ? {
            ...user.profile,
            status: user.status
          }
        : undefined
    });
  }

  private async revokeSessionsAfterCriticalChange(
    organizationIds: string[],
    userId: string,
    reason: string
  ): Promise<void> {
    const revokedAt = new Date().toISOString();

    for (const organizationId of organizationIds) {
      const revokedSessions = await this.repository.revokeUserSessions(
        organizationId,
        userId,
        revokedAt,
        reason
      );

      if (revokedSessions.length > 0) {
        await this.auditSecurityEvent("SESSION_REVOKED", "Sessions revoked after critical identity change.", {
          organizationId,
          userId
        });
      }
    }
  }

  private async loadSessionForActor(actor: AuthActor, token: string): Promise<AuthSession> {
    if (!token) {
      throw new UnauthorizedException("session is not valid.");
    }

    const session = await this.repository.findSessionByToken(token);

    if (!session || session.organizationId !== actor.organizationId || session.userId !== actor.userId) {
      throw new UnauthorizedException("session is not valid.");
    }

    if (session.revokedAt || this.isSessionExpired(session)) {
      throw new UnauthorizedException("session is not valid.");
    }

    return session;
  }

  private async loadUser(userId: string): Promise<AuthUser> {
    const user = await this.repository.findUserById(userId);

    if (!user) {
      throw new NotFoundException("user not found.");
    }

    return user;
  }

  private async loadOrganization(organizationId: string): Promise<AuthOrganization> {
    const organization = await this.repository.findOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException("organization not found.");
    }

    return organization;
  }

  private async createCredential(
    userId: string,
    password: string,
    existingId?: string,
    existingCreatedAt?: string
  ): Promise<AuthCredential> {
    this.assertPasswordStrength(password);
    const now = new Date().toISOString();
    const passwordSalt = randomBytes(16).toString("hex");

    return {
      id: existingId ?? randomUUID(),
      userId,
      passwordHash: this.hashPassword(password, passwordSalt),
      passwordSalt,
      createdAt: existingCreatedAt ?? now,
      updatedAt: now
    };
  }

  private hashPassword(password: string, salt: string): string {
    return scryptSync(password, salt, PASSWORD_HASH_KEY_LENGTH).toString("hex");
  }

  private verifyPassword(password: string, credential: AuthCredential): boolean {
    if (!password) {
      return false;
    }

    const expected = Buffer.from(credential.passwordHash, "hex");
    const candidate = Buffer.from(this.hashPassword(password, credential.passwordSalt), "hex");

    return expected.length === candidate.length && timingSafeEqual(expected, candidate);
  }

  private assertPasswordStrength(password: string): void {
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException("password must contain at least 12 characters.");
    }
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private safeCredentialState(credential: AuthCredential): object {
    return {
      id: credential.id,
      userId: credential.userId,
      passwordConfigured: true,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt
    };
  }

  private safePasswordResetState(request: {
    id: string;
    email: string;
    userId?: string;
    organizationId?: string;
    createdAt: string;
    expiresAt: string;
    usedAt?: string;
  }): object {
    return {
      id: request.id,
      email: request.email,
      userId: request.userId,
      organizationId: request.organizationId,
      createdAt: request.createdAt,
      expiresAt: request.expiresAt,
      usedAt: request.usedAt
    };
  }

  private safeEmailVerificationState(request: AuthEmailVerificationRequest): object {
    return {
      id: request.id,
      email: request.email,
      userId: request.userId,
      organizationId: request.organizationId,
      createdAt: request.createdAt,
      expiresAt: request.expiresAt,
      verifiedAt: request.verifiedAt
    };
  }

  private toSessionSummary(session: AuthSession, currentToken?: string): AuthSessionSummary {
    return {
      id: session.id,
      organizationId: session.organizationId,
      userId: session.userId,
      roles: session.roles,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastSeenAt: session.lastSeenAt,
      revokedAt: session.revokedAt,
      active: !session.revokedAt && !this.isSessionExpired(session),
      current: currentToken ? session.token === currentToken : undefined
    };
  }

  private isPrivilegedHuman(actor: AuthActor): boolean {
    const roles = new Set(actor.roles);

    return roles.has("PLATFORM_CREATOR") || roles.has("ADMIN") || roles.has("EDITOR");
  }

  private isPast(dateValue: string): boolean {
    const time = Date.parse(dateValue);

    return !Number.isFinite(time) || time <= Date.now();
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

  private async auditActivity(
    actor: AuthActor,
    action: AuthActivityEvent["action"],
    message: string,
    metadata?: object
  ): Promise<void> {
    await this.repository.appendActivityEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      action,
      message,
      metadata,
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
