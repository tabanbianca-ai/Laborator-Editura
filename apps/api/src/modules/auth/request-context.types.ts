import {
  type AuthActor,
  type RoleAssignmentScopeType,
  type MvpRole
} from "./auth.types";

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

export type CanonicalPermissionName =
  | "platform.admin.manage"
  | "organization.manage"
  | "identity.manage"
  | "role.assign"
  | "permission.manage"
  | "project.read"
  | "project.write"
  | "document.read"
  | "document.write"
  | "segment.read"
  | "segment.write"
  | "translation.read"
  | "translation.write"
  | "review.approve"
  | "design.write"
  | "audio.write"
  | "author.write"
  | "collaboration.write"
  | "export.write"
  | "audit.read"
  | "service_account.manage";

export interface CanonicalPermissionDefinition {
  key: CanonicalPermissionName;
  legacyPermission?: MvpPermission;
  moduleName: string;
  description: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  privileged: boolean;
}

export const CANONICAL_PERMISSION_CATALOG = [
  {
    key: "platform.admin.manage",
    legacyPermission: "admin:manage",
    moduleName: "platform",
    description: "Manage platform-wide administrative configuration.",
    riskLevel: "CRITICAL",
    privileged: true
  },
  {
    key: "organization.manage",
    legacyPermission: "admin:manage",
    moduleName: "organization",
    description: "Manage organization settings and memberships.",
    riskLevel: "HIGH",
    privileged: true
  },
  {
    key: "identity.manage",
    legacyPermission: "admin:manage",
    moduleName: "auth",
    description: "Manage identities, account status, and sessions.",
    riskLevel: "CRITICAL",
    privileged: true
  },
  {
    key: "role.assign",
    legacyPermission: "admin:manage",
    moduleName: "auth",
    description: "Assign or revoke scoped roles.",
    riskLevel: "CRITICAL",
    privileged: true
  },
  {
    key: "permission.manage",
    legacyPermission: "admin:manage",
    moduleName: "auth",
    description: "Manage permission catalog metadata.",
    riskLevel: "CRITICAL",
    privileged: true
  },
  {
    key: "project.read",
    legacyPermission: "read",
    moduleName: "projects",
    description: "Read visible project metadata.",
    riskLevel: "LOW",
    privileged: false
  },
  {
    key: "project.write",
    legacyPermission: "project:write",
    moduleName: "projects",
    description: "Create or update scoped project metadata.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "document.read",
    legacyPermission: "read",
    moduleName: "documents",
    description: "Read visible documents.",
    riskLevel: "LOW",
    privileged: false
  },
  {
    key: "document.write",
    legacyPermission: "document:write",
    moduleName: "documents",
    description: "Create or update scoped documents.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "segment.read",
    legacyPermission: "read",
    moduleName: "segments",
    description: "Read visible document segments.",
    riskLevel: "LOW",
    privileged: false
  },
  {
    key: "segment.write",
    legacyPermission: "segment:write",
    moduleName: "segments",
    description: "Create or update assigned segments.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "translation.read",
    legacyPermission: "read",
    moduleName: "translations",
    description: "Read assigned translation data.",
    riskLevel: "LOW",
    privileged: false
  },
  {
    key: "translation.write",
    legacyPermission: "translation:write",
    moduleName: "translations",
    description: "Create or update assigned translations.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "review.approve",
    legacyPermission: "review:approve",
    moduleName: "workflow",
    description: "Perform authorized human approval and review actions.",
    riskLevel: "HIGH",
    privileged: true
  },
  {
    key: "design.write",
    legacyPermission: "design:write",
    moduleName: "layout",
    description: "Update assigned design or layout metadata.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "audio.write",
    legacyPermission: "audio:write",
    moduleName: "audio",
    description: "Update assigned audio narration metadata.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "author.write",
    legacyPermission: "author:write",
    moduleName: "author-studio",
    description: "Create or update owned author workspace content.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "collaboration.write",
    legacyPermission: "collaboration:write",
    moduleName: "collaboration",
    description: "Create or update assigned collaboration records.",
    riskLevel: "MEDIUM",
    privileged: false
  },
  {
    key: "export.write",
    legacyPermission: "export:write",
    moduleName: "export",
    description: "Create export records within workflow gates.",
    riskLevel: "HIGH",
    privileged: true
  },
  {
    key: "audit.read",
    legacyPermission: "admin:manage",
    moduleName: "audit",
    description: "Read audit evidence for authorized scopes.",
    riskLevel: "HIGH",
    privileged: true
  },
  {
    key: "service_account.manage",
    legacyPermission: "admin:manage",
    moduleName: "auth",
    description: "Create, rotate, or revoke service account credentials.",
    riskLevel: "CRITICAL",
    privileged: true
  }
] as const satisfies readonly CanonicalPermissionDefinition[];

export const ROLE_PERMISSION_CATALOG = {
  PLATFORM_CREATOR: CANONICAL_PERMISSION_CATALOG.map((permission) => permission.key),
  ADMIN: CANONICAL_PERMISSION_CATALOG.map((permission) => permission.key),
  EDITOR: [
    "project.read",
    "project.write",
    "document.read",
    "document.write",
    "segment.read",
    "translation.read",
    "review.approve",
    "export.write"
  ],
  TRANSLATOR: [
    "project.read",
    "project.write",
    "document.read",
    "document.write",
    "segment.read",
    "segment.write",
    "translation.read",
    "translation.write"
  ],
  PROOFREADER: ["project.read", "document.read", "segment.read", "translation.read", "review.approve"],
  REVIEWER: ["project.read", "document.read", "segment.read", "translation.read", "review.approve", "export.write"],
  DESIGNER: ["project.read", "document.read", "design.write"],
  NARRATOR: ["project.read", "document.read", "audio.write"],
  AUDIO_NARRATOR: ["project.read", "document.read", "audio.write"],
  AUTHOR: ["project.read", "document.read", "document.write", "author.write"],
  COLLABORATOR: ["project.read", "document.read", "collaboration.write"],
  READER: ["project.read", "document.read"],
  GUEST: ["project.read"],
  VIEWER: ["project.read", "document.read"]
} as const satisfies Record<MvpRole, readonly CanonicalPermissionName[]>;

export interface AuthenticatedRequestContext extends AuthActor {
  permissions: MvpPermission[];
  canonicalPermissions?: CanonicalPermissionName[];
}

export interface RequestWithAuthContext {
  authContext?: AuthenticatedRequestContext;
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
  originalUrl?: string;
  path?: string;
  url?: string;
}

export interface AuthorizationPolicy {
  permission: CanonicalPermissionName;
  scopeType: RoleAssignmentScopeType;
  scopeId?: string;
  privileged?: boolean;
}

export interface AuthorizationDecision {
  allowed: boolean;
  reason: "ALLOW" | "DEFAULT_DENY" | "MISSING_PERMISSION" | "MISSING_SCOPE";
}

export function canonicalPermissionsForRoles(roles: MvpRole[]): CanonicalPermissionName[] {
  const permissions = new Set<CanonicalPermissionName>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSION_CATALOG[role]) {
      permissions.add(permission);
    }
  }

  return [...permissions];
}

export function evaluateAuthorizationPolicy(
  actor: AuthenticatedRequestContext | undefined,
  policy: AuthorizationPolicy
): AuthorizationDecision {
  if (!actor) {
    return { allowed: false, reason: "DEFAULT_DENY" };
  }

  const permissions = new Set(actor.canonicalPermissions ?? canonicalPermissionsForRoles(actor.roles));

  if (!permissions.has(policy.permission)) {
    return { allowed: false, reason: "MISSING_PERMISSION" };
  }

  if (policy.scopeType !== "PLATFORM" && !actor.organizationId) {
    return { allowed: false, reason: "MISSING_SCOPE" };
  }

  return { allowed: true, reason: "ALLOW" };
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
