export type WorkspaceModule =
  | "DASHBOARD"
  | "MY_PROJECTS"
  | "AUTHOR_STUDIO"
  | "TRANSLATION"
  | "LEXICOGRAPHIC"
  | "SEMANTIC_FIDELITY"
  | "RESEARCH_HUB"
  | "LIBRARY"
  | "COMMERCE"
  | "PUBLIC_PORTAL"
  | "COLLABORATION"
  | "MARKETPLACE"
  | "ADMINISTRATION"
  | "SECURITY"
  | "OBSERVABILITY"
  | "BACKUP"
  | "POLICIES";

export type WorkspaceWidgetType =
  | "RECENT_PROJECTS"
  | "ASSIGNED_TASKS"
  | "TRANSLATION_PROGRESS"
  | "RESEARCH_ACTIVITY"
  | "AI_USAGE"
  | "BUDGET_USAGE"
  | "SECURITY_ALERTS"
  | "BACKUP_STATUS"
  | "PUBLISHING_STATUS"
  | "MARKETPLACE_AGENTS"
  | "OBSERVABILITY_SUMMARY";

export interface WorkspaceNavigationItem {
  id: string;
  title: string;
  module: WorkspaceModule;
  icon: string;
  route: string;
  visible: boolean;
  order: number;
  permissionsRequired: string[];
  defaultForRoles: string[];
}

export interface WorkspaceWidget {
  id: string;
  widgetType: WorkspaceWidgetType;
  title: string;
  visible: boolean;
  order: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  permissionsRequired: string[];
  defaultForRoles: string[];
  configuration: object;
  aiSuggested: boolean;
}

export interface WorkspacePreferences {
  id: string;
  userId: string;
  favoriteModules: WorkspaceModule[];
  dashboardLayout: object;
  collapsedMenus: string[];
  themeMetadata: {
    theme?: string;
    [key: string]: unknown;
  };
  language: string;
  platformLanguage?: string;
  notificationPreferences: object;
}

export interface WorkspaceLanguageTarget {
  language: string;
  locale?: string;
  enabled: boolean;
}

export interface WorkspaceLanguageManagement {
  model: {
    platformLanguage: string;
    platformLocale?: string;
    defaultPlatformLanguage: string;
    fallbackLanguage: string;
    installedLanguages: string[];
    enabledLanguages: string[];
    translationCompleteness: Record<string, number>;
    project: {
      originalLanguage: string;
      originalLocale?: string;
      authoringLanguage: string;
      authoringLocale?: string;
      targetLanguages: WorkspaceLanguageTarget[];
      originalLanguageImmutable: true;
      multilingualAuthoringSupported: true;
      multipleTargetLanguagesSupported: true;
    };
    linguisticResourceLoading: Array<{
      sourceLanguage: string;
      sourceLocale?: string;
      targetLanguage: string;
      targetLocale?: string;
      resources: Record<string, {
        enabled: true;
        authoritative: false;
        loadedByLanguagePair: true;
      }>;
    }>;
    uiLocalizedByPlatformLanguage: true;
    aiAgentsUsePlatformLanguage: true;
    translationUsesOriginalToTarget: true;
    noMixedLanguageInterface: true;
  };
  administration: {
    installedLanguages: string[];
    enabledLanguages: string[];
    defaultPlatformLanguage: string;
    fallbackLanguage: string;
    translationCompleteness: Record<string, number>;
    linguisticResources: string[];
    dictionaries: string[];
    glossaries: string[];
  };
  aiAgents: {
    conversationLanguage: string;
    explanationsLanguage: string;
    translationDirection: string[];
    platformLanguageControlsUserCommunication: true;
    aiMayChangeLanguageConfiguration: false;
  };
  parallelReview: {
    defaultColumns: Array<{
      columnId: string;
      label: "Original" | "Translation" | "Comparison";
      language: string;
      locale?: string;
      versionId?: string;
    }>;
    supportsThreeColumns: true;
    supportsFourColumns: true;
    eachColumnSelectsLanguageAndVersion: true;
  };
  auditActions: string[];
}

export interface WorkspaceDashboard {
  layout: {
    id: string;
    name: string;
    visibleModules: WorkspaceModule[];
  };
  navigation: WorkspaceNavigationItem[];
  widgets: WorkspaceWidget[];
  preferences: WorkspacePreferences;
  languageManagement?: WorkspaceLanguageManagement;
  generatedFor: {
    userId: string;
    organizationId: string;
    roles: string[];
    permissions: string[];
  };
}
