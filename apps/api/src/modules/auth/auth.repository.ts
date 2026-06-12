import { Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { randomUUID } from "node:crypto";
import {
  type AuthAuditEvent,
  type AuthOrganization,
  type AuthSession,
  type AuthUser,
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
  constructor(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  async createOrganization(organization: AuthOrganization): Promise<AuthOrganization> {
    return this.database.insert("organizations", organization);
  }

  async firstOrganization(): Promise<AuthOrganization | null> {
    return this.database.select<AuthOrganization>("organizations")[0] ?? null;
  }

  async createUser(user: AuthUser): Promise<AuthUser> {
    return this.database.insert("users", user);
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

  async createSession(session: AuthSession): Promise<AuthSession> {
    return this.database.insert("auth_sessions", session);
  }

  async findSessionByToken(token: string): Promise<AuthSession | null> {
    return this.database.select<AuthSession>(
      "auth_sessions",
      (session) => session.token === token
    )[0] ?? null;
  }

  async findOrganizationById(id: string): Promise<AuthOrganization | null> {
    return this.database.findById<AuthOrganization>("organizations", id);
  }

  async findUserById(id: string): Promise<AuthUser | null> {
    return this.database.findById<AuthUser>("users", id);
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
        event.entityType === "AUTH_SESSION" ||
        event.entityType === "USER_ROLE"
    );
  }
}
