import { type AuthActor, type MvpRole } from "./auth.types";

export type MvpPermission =
  | "project:write"
  | "document:write"
  | "segment:write"
  | "translation:write"
  | "review:approve"
  | "export:write"
  | "read";

export interface AuthenticatedRequestContext extends AuthActor {
  permissions: MvpPermission[];
}

export interface RequestWithAuthContext {
  authContext?: AuthenticatedRequestContext;
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
  path?: string;
  url?: string;
}

export function permissionsForRoles(roles: MvpRole[]): MvpPermission[] {
  const permissions = new Set<MvpPermission>(["read"]);

  for (const role of roles) {
    if (role === "ADMIN") {
      permissions.add("project:write");
      permissions.add("document:write");
      permissions.add("segment:write");
      permissions.add("translation:write");
      permissions.add("review:approve");
      permissions.add("export:write");
    }

    if (role === "REVIEWER") {
      permissions.add("review:approve");
      permissions.add("export:write");
    }

    if (role === "TRANSLATOR") {
      permissions.add("project:write");
      permissions.add("document:write");
      permissions.add("segment:write");
      permissions.add("translation:write");
    }
  }

  return [...permissions];
}
