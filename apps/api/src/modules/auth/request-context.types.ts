import { type AuthActor, type MvpRole } from "./auth.types";

export type MvpPermission =
  | "admin:manage"
  | "project:write"
  | "document:write"
  | "segment:write"
  | "translation:write"
  | "review:approve"
  | "design:write"
  | "audio:write"
  | "author:write"
  | "collaboration:write"
  | "export:write"
  | "read";

export interface AuthenticatedRequestContext extends AuthActor {
  permissions: MvpPermission[];
}

export interface RequestWithAuthContext {
  authContext?: AuthenticatedRequestContext;
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
  originalUrl?: string;
  path?: string;
  url?: string;
}

export function permissionsForRoles(roles: MvpRole[]): MvpPermission[] {
  const permissions = new Set<MvpPermission>(["read"]);

  for (const role of roles) {
    if (role === "PLATFORM_CREATOR" || role === "ADMIN") {
      permissions.add("admin:manage");
      permissions.add("project:write");
      permissions.add("document:write");
      permissions.add("segment:write");
      permissions.add("translation:write");
      permissions.add("review:approve");
      permissions.add("design:write");
      permissions.add("audio:write");
      permissions.add("author:write");
      permissions.add("collaboration:write");
      permissions.add("export:write");
    }

    if (role === "EDITOR" || role === "REVIEWER" || role === "PROOFREADER") {
      permissions.add("review:approve");
      permissions.add("document:write");
      permissions.add("export:write");
    }

    if (role === "TRANSLATOR") {
      permissions.add("project:write");
      permissions.add("document:write");
      permissions.add("segment:write");
      permissions.add("translation:write");
    }

    if (role === "DESIGNER") {
      permissions.add("design:write");
    }

    if (role === "NARRATOR" || role === "AUDIO_NARRATOR") {
      permissions.add("audio:write");
    }

    if (role === "AUTHOR") {
      permissions.add("author:write");
      permissions.add("document:write");
    }

    if (role === "COLLABORATOR") {
      permissions.add("collaboration:write");
    }
  }

  return [...permissions];
}
