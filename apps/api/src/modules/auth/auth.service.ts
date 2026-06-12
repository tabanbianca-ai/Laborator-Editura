import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseAuthRepository } from "./auth.repository";
import {
  type AuthActor,
  type AuthAuditAction,
  type AuthAuditEntityType,
  type AuthAuditEvent,
  type LoginInput,
  type LoginResult,
  type MvpRole
} from "./auth.types";

const DEFAULT_ROLES: MvpRole[] = ["TRANSLATOR"];

@Injectable()
export class AuthService {
  constructor(private readonly repository: DatabaseAuthRepository) {}

  async login(input: LoginInput): Promise<LoginResult> {
    if (!input.email) {
      throw new BadRequestException("email is required.");
    }

    const now = new Date().toISOString();
    let organization = await this.repository.firstOrganization();
    const organizationCreated = !organization;

    if (!organization) {
      organization = await this.repository.createOrganization({
        id: randomUUID(),
        name: input.organizationName ?? "Default Organization",
        createdAt: now
      });
    }

    let user = await this.repository.findUserByEmail(input.email);
    const userCreated = !user;

    if (!user) {
      user = await this.repository.createUser({
        id: randomUUID(),
        email: input.email,
        displayName: input.displayName ?? input.email,
        createdAt: now
      });
    }

    const roles = await this.repository.assignRoles(
      organization.id,
      user.id,
      DEFAULT_ROLES
    );
    const session = await this.repository.createSession({
      id: randomUUID(),
      token: randomUUID(),
      organizationId: organization.id,
      userId: user.id,
      roles,
      createdAt: now
    });

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

    await this.audit("UPDATE", actor, "USER_ROLE", user.id, undefined, {
      organizationId: organization.id,
      userId: user.id,
      roles
    });
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

  private validateActor(actor: AuthActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

}
