import type { ApiResult } from "./api-client";

export interface CoreModuleRecord {
  id: string;
  name: string;
  owner: string;
  status: "READY" | "PLANNED" | "PLACEHOLDER";
  summary: string;
}

export interface CoreModuleShellData {
  moduleName: string;
  primaryActionLabel: string;
  records: CoreModuleRecord[];
}

export type CoreModuleKey =
  | "author-studio"
  | "translation"
  | "research"
  | "library"
  | "marketplace"
  | "admin";

const moduleShells: Record<CoreModuleKey, CoreModuleShellData> = {
  "author-studio": {
    moduleName: "Author Studio",
    primaryActionLabel: "New manuscript",
    records: [
      {
        id: "author-studio-manuscripts",
        name: "Manuscripts",
        owner: "Authors",
        status: "PLACEHOLDER",
        summary: "Create, organize and submit manuscripts into editorial review."
      },
      {
        id: "author-studio-drafts",
        name: "Drafts",
        owner: "Authors",
        status: "PLACEHOLDER",
        summary: "Draft metadata, version history and author notes."
      }
    ]
  },
  "translation": {
    moduleName: "Translation",
    primaryActionLabel: "Open editor",
    records: [
      {
        id: "translation-segments",
        name: "Segment workspace",
        owner: "Translators",
        status: "READY",
        summary: "Source and target segment review foundation."
      },
      {
        id: "translation-validation",
        name: "Validation signals",
        owner: "Reviewers",
        status: "PLANNED",
        summary: "TM, terminology, QA and semantic signals remain backend governed."
      }
    ]
  },
  "research": {
    moduleName: "Research Hub",
    primaryActionLabel: "Add source",
    records: [
      {
        id: "research-sources",
        name: "Research sources",
        owner: "Editors",
        status: "PLACEHOLDER",
        summary: "Books, articles, references and knowledge entities."
      },
      {
        id: "research-collections",
        name: "Collections",
        owner: "Editorial team",
        status: "PLACEHOLDER",
        summary: "Thematic collections and reusable editorial knowledge."
      }
    ]
  },
  "library": {
    moduleName: "Library",
    primaryActionLabel: "Add library item",
    records: [
      {
        id: "library-items",
        name: "Saved items",
        owner: "Readers",
        status: "PLACEHOLDER",
        summary: "Books, magazines, audio, videos and localized media."
      },
      {
        id: "library-progress",
        name: "Reading progress",
        owner: "Readers",
        status: "PLACEHOLDER",
        summary: "Bookmarks, notes, favorites and access history."
      }
    ]
  },
  "marketplace": {
    moduleName: "Marketplace",
    primaryActionLabel: "Register agent",
    records: [
      {
        id: "marketplace-agents",
        name: "AI agents",
        owner: "Administrators",
        status: "PLACEHOLDER",
        summary: "Governed agent catalog with cost and policy links."
      },
      {
        id: "marketplace-extensions",
        name: "Extensions",
        owner: "Administrators",
        status: "PLACEHOLDER",
        summary: "Extension metadata registry without external execution."
      }
    ]
  },
  "admin": {
    moduleName: "Administration",
    primaryActionLabel: "Invite member",
    records: [
      {
        id: "admin-users",
        name: "Users",
        owner: "Administrators",
        status: "PLACEHOLDER",
        summary: "Users, roles, permissions, invitations and memberships."
      },
      {
        id: "admin-audit",
        name: "Audit",
        owner: "Administrators",
        status: "PLACEHOLDER",
        summary: "Administrative audit trail and human final authority."
      }
    ]
  }
};

export async function getCoreModuleShell(
  moduleKey: CoreModuleKey
): Promise<ApiResult<CoreModuleShellData>> {
  return {
    data: moduleShells[moduleKey],
    error: null
  };
}
