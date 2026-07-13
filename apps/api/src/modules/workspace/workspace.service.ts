import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import {
  createParallelReviewColumns,
  createUnifiedLanguageManagementModel,
  normalizeLanguageLocale,
  validateIsoCompatibleLanguageTag
} from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { DatabaseWorkspaceRepository } from "./workspace.repository";
import {
  type CreateWorkspaceWidgetInput,
  type AcceptWorkspaceInvitationInput,
  type WorkspaceAccessScope,
  type InviteWorkspaceCollaboratorInput,
  type RevokeWorkspaceAccessInput,
  type SaveWorkspacePreferencesInput,
  type SaveWorkspaceLanguageManagementInput,
  type WorkspaceActor,
  type WorkspaceAccessAuditInput,
  type WorkspaceAccessResourceType,
  type WorkspaceAuditAction,
  type WorkspaceAuditEvent,
  type WorkspaceDashboard,
  type WorkspaceEffectiveAccessAction,
  type WorkspaceEffectiveAccessInput,
  type WorkspaceEffectiveAccessResult,
  type WorkspaceEntitlementFeature,
  type WorkspaceLayout,
  type WorkspaceLanguageManagement,
  type WorkspaceModule,
  type WorkspaceNavigationItem,
  type WorkspaceNeedToKnowAccessInput,
  type WorkspaceNeedToKnowAccessResult,
  type WorkspaceNeedToKnowGrant,
  type WorkspaceNeedToKnowPreview,
  type WorkspaceNeedToKnowRole,
  type WorkspaceOperationalRole,
  type WorkspacePlanQuotaKey,
  type WorkspaceRoleAssignmentScope,
  type WorkspaceAgentDataAccessInput,
  type WorkspacePreferences,
  type WorkspaceSubscriptionPlan,
  type WorkspaceSubscriptionPlanDefinition,
  type WorkspaceSubscriptionSummary,
  type WorkspaceSubscriptionUsage,
  type WorkspaceWidget
} from "./workspace.types";

interface StoredLanguageManagementMetadata {
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguages?: Array<{
    language: string;
    locale?: string;
    enabled?: boolean;
  }>;
  fallbackLanguage?: string;
  resourcesVersion?: number;
}

interface WorkspacePreferencesMetadata {
  unifiedLanguageManagement?: StoredLanguageManagementMetadata;
}

const DEFAULT_NAVIGATION: Array<Omit<
  WorkspaceNavigationItem,
  "id" | "organizationId" | "createdBy" | "createdAt" | "updatedAt"
>> = [
  { title: "Dashboard", module: "DASHBOARD", icon: "layout-dashboard", route: "/dashboard", visible: true, order: 1, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "My Projects", module: "MY_PROJECTS", icon: "folder-kanban", route: "/projects", visible: true, order: 2, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Author Studio", module: "AUTHOR_STUDIO", icon: "pen-tool", route: "/author-studio", visible: true, order: 3, permissionsRequired: ["document:write"], defaultForRoles: ["ADMIN", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Translation", module: "TRANSLATION", icon: "languages", route: "/translation-editor", visible: true, order: 4, permissionsRequired: ["translation:write"], defaultForRoles: ["ADMIN", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Lexicographic", module: "LEXICOGRAPHIC", icon: "book-open-text", route: "/lexicographic", visible: true, order: 5, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Semantic Fidelity", module: "SEMANTIC_FIDELITY", icon: "scan-search", route: "/semantic-fidelity", visible: true, order: 6, permissionsRequired: ["review:approve"], defaultForRoles: ["ADMIN", "REVIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Research Hub", module: "RESEARCH_HUB", icon: "library-big", route: "/research", visible: true, order: 7, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Library", module: "LIBRARY", icon: "book-marked", route: "/library", visible: true, order: 8, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Commerce", module: "COMMERCE", icon: "store", route: "/commerce", visible: true, order: 9, permissionsRequired: ["export:write"], defaultForRoles: ["ADMIN", "REVIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Public Portal", module: "PUBLIC_PORTAL", icon: "globe", route: "/public-portal", visible: true, order: 10, permissionsRequired: ["export:write"], defaultForRoles: ["ADMIN", "REVIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Collaboration", module: "COLLABORATION", icon: "messages-square", route: "/collaboration", visible: true, order: 11, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Marketplace", module: "MARKETPLACE", icon: "boxes", route: "/marketplace", visible: true, order: 12, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Administration", module: "ADMINISTRATION", icon: "shield-user", route: "/admin", visible: true, order: 13, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Security", module: "SECURITY", icon: "shield-check", route: "/security", visible: true, order: 14, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Observability", module: "OBSERVABILITY", icon: "activity", route: "/observability", visible: true, order: 15, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Backup", module: "BACKUP", icon: "archive-restore", route: "/backup", visible: true, order: 16, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Policies", module: "POLICIES", icon: "file-check-2", route: "/policies", visible: true, order: 17, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" }
];

const DEFAULT_WIDGETS: Array<Omit<
  WorkspaceWidget,
  "id" | "organizationId" | "createdBy" | "createdAt" | "updatedAt"
>> = [
  { widgetType: "RECENT_PROJECTS", title: "Recent projects", visible: true, order: 1, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], configuration: {}, aiSuggested: false },
  { widgetType: "ASSIGNED_TASKS", title: "Assigned tasks", visible: true, order: 2, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], configuration: {}, aiSuggested: false },
  { widgetType: "TRANSLATION_PROGRESS", title: "Translation progress", visible: true, order: 3, size: "LARGE", permissionsRequired: ["translation:write"], defaultForRoles: ["ADMIN", "TRANSLATOR"], configuration: {}, aiSuggested: false },
  { widgetType: "RESEARCH_ACTIVITY", title: "Research activity", visible: true, order: 4, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], configuration: {}, aiSuggested: false },
  { widgetType: "AI_USAGE", title: "AI usage", visible: true, order: 5, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "BUDGET_USAGE", title: "Budget usage", visible: true, order: 6, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "SECURITY_ALERTS", title: "Security alerts", visible: true, order: 7, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "BACKUP_STATUS", title: "Backup status", visible: true, order: 8, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "PUBLISHING_STATUS", title: "Publishing status", visible: true, order: 9, size: "MEDIUM", permissionsRequired: ["export:write"], defaultForRoles: ["ADMIN", "REVIEWER"], configuration: {}, aiSuggested: false },
  { widgetType: "MARKETPLACE_AGENTS", title: "Marketplace agents", visible: true, order: 10, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "OBSERVABILITY_SUMMARY", title: "Observability summary", visible: true, order: 11, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false }
];

const ROLE_PANELS: Record<WorkspaceNeedToKnowRole, string[]> = {
  ADMINISTRATOR: [
    "project",
    "manuscript",
    "sourceText",
    "translation",
    "review",
    "publishing",
    "administration",
    "audit"
  ],
  AUDIO_VIDEO_COLLABORATOR: [
    "validatedText",
    "assignedChapters",
    "pronunciation",
    "localizationData",
    "approvedMediaAssets"
  ],
  COLLABORATOR: ["assignedManuscriptSections", "assignedComments"],
  ILLUSTRATOR: [
    "assignedTextFragments",
    "illustrationBriefs",
    "approvedVisualReferences",
    "relevantAssets"
  ],
  LAYOUT_SPECIALIST: [
    "validatedText",
    "styles",
    "illustrations",
    "layoutAssets",
    "publicationSpecifications"
  ],
  REVIEWER: [
    "sourceText",
    "translation",
    "reviewProposals",
    "comments",
    "relevantVersionHistory"
  ],
  TRANSLATOR: [
    "sourceText",
    "translation",
    "linguisticResources",
    "glossaries",
    "terminologyDecisions",
    "assignedComments"
  ]
};

const ROLE_ACTIONS: Record<WorkspaceNeedToKnowRole, string[]> = {
  ADMINISTRATOR: ["inviteCollaborator", "grantAccess", "revokeAccess", "viewAudit"],
  AUDIO_VIDEO_COLLABORATOR: ["viewValidatedText", "createAudioVideoDraft", "comment"],
  COLLABORATOR: ["viewAssignedSections", "comment"],
  ILLUSTRATOR: ["viewBrief", "submitIllustrationDraft", "comment"],
  LAYOUT_SPECIALIST: ["viewValidatedText", "prepareLayout", "comment"],
  REVIEWER: ["viewReview", "proposeChanges", "resolveComments"],
  TRANSLATOR: ["viewSource", "saveTranslation", "consultLinguisticResources"]
};

const ROLE_TOOLS: Record<WorkspaceNeedToKnowRole, WorkspaceModule[]> = {
  ADMINISTRATOR: [
    "DASHBOARD",
    "MY_PROJECTS",
    "AUTHOR_STUDIO",
    "TRANSLATION",
    "LEXICOGRAPHIC",
    "SEMANTIC_FIDELITY",
    "RESEARCH_HUB",
    "LIBRARY",
    "COLLABORATION",
    "MARKETPLACE",
    "ADMINISTRATION",
    "SECURITY",
    "OBSERVABILITY",
    "BACKUP",
    "POLICIES"
  ],
  AUDIO_VIDEO_COLLABORATOR: ["DASHBOARD", "MY_PROJECTS", "COLLABORATION"],
  COLLABORATOR: ["DASHBOARD", "MY_PROJECTS", "COLLABORATION"],
  ILLUSTRATOR: ["DASHBOARD", "MY_PROJECTS", "COLLABORATION"],
  LAYOUT_SPECIALIST: ["DASHBOARD", "MY_PROJECTS", "COLLABORATION"],
  REVIEWER: ["DASHBOARD", "MY_PROJECTS", "SEMANTIC_FIDELITY", "RESEARCH_HUB", "COLLABORATION"],
  TRANSLATOR: ["DASHBOARD", "MY_PROJECTS", "TRANSLATION", "LEXICOGRAPHIC", "COLLABORATION"]
};

const ROLE_RESOURCE_TYPES: Record<WorkspaceNeedToKnowRole, WorkspaceAccessResourceType[]> = {
  ADMINISTRATOR: [
    "ADMINISTRATION",
    "AGENT_EXECUTION",
    "CHAPTER",
    "COMMENT",
    "DISTRIBUTION",
    "DOCUMENT",
    "EXPORT",
    "LINGUISTIC_SOURCE",
    "MANUSCRIPT",
    "MEDIA_ASSET",
    "PROJECT",
    "PUBLISHING",
    "RIGHTS_RECORD",
    "SECTION",
    "SEGMENT",
    "VERSION"
  ],
  AUDIO_VIDEO_COLLABORATOR: ["CHAPTER", "COMMENT", "DOCUMENT", "MANUSCRIPT", "MEDIA_ASSET", "PROJECT", "SECTION"],
  COLLABORATOR: ["COMMENT", "DOCUMENT", "MANUSCRIPT", "PROJECT", "SECTION", "SEGMENT"],
  ILLUSTRATOR: ["COMMENT", "DOCUMENT", "MANUSCRIPT", "MEDIA_ASSET", "PROJECT", "SECTION", "SEGMENT"],
  LAYOUT_SPECIALIST: ["COMMENT", "DOCUMENT", "EXPORT", "MANUSCRIPT", "MEDIA_ASSET", "PROJECT", "PUBLISHING", "SECTION"],
  REVIEWER: ["COMMENT", "DOCUMENT", "LINGUISTIC_SOURCE", "MANUSCRIPT", "PROJECT", "SECTION", "SEGMENT", "VERSION"],
  TRANSLATOR: ["COMMENT", "DOCUMENT", "LINGUISTIC_SOURCE", "MANUSCRIPT", "PROJECT", "SEGMENT", "SECTION"]
};

const ALWAYS_RESTRICTED_RESOURCE_TYPES = new Set<WorkspaceAccessResourceType>([
  "ADMINISTRATION",
  "DISTRIBUTION",
  "RIGHTS_RECORD"
]);

const OFFICIAL_OPERATIONAL_ROLES: WorkspaceOperationalRole[] = [
  "ADMINISTRATOR",
  "PROJECT_MANAGER",
  "EDITOR",
  "TRANSLATOR",
  "REVIEWER",
  "DESIGNER",
  "AUDIO_NARRATOR",
  "AUTHOR",
  "COLLABORATOR",
  "READER",
  "GUEST"
];

const ROLE_ASSIGNMENT_SCOPES = [
  "ORGANIZATION",
  "PROJECT",
  "DOCUMENT",
  "CHAPTER",
  "SEGMENT"
] as const;

const SUBSCRIPTION_PLANS: Record<WorkspaceSubscriptionPlan, WorkspaceSubscriptionPlanDefinition> = {
  FREE: {
    plan: "FREE",
    enabled: true,
    includedFeatures: ["EXPORT_JSON_MASTER", "EXPORT_PDF", "TRANSLATION_VOLUME"],
    quotas: {
      activeProjects: 1,
      aiUsage: 25,
      collaborators: 1,
      storageMb: 512,
      translationSegments: 1000
    },
    exportFormats: ["JSON_MASTER", "PDF"],
    publishingChannels: ["INTERNAL_EXPORT"],
    distributionChannels: ["LOCAL_DOWNLOAD"],
    auditRetentionDays: 30,
    backupRetentionDays: 7,
    priorityProcessing: false,
    downgradeBehavior: {
      preserveExistingContent: true,
      preserveAuditAndVersions: true,
      disableUnavailableFutureActionsOnly: true,
      markOverLimitResourcesReadOnly: true,
      automaticDeletion: false,
      remediationSummaryRequired: true
    }
  },
  PREMIUM: {
    plan: "PREMIUM",
    enabled: true,
    includedFeatures: [
      "ADVANCED_EDITORIAL_TOOLS",
      "AI_AGENT",
      "COLLABORATION",
      "EXPORT_DOCX",
      "EXPORT_EPUB",
      "EXPORT_JSON_MASTER",
      "EXPORT_MOBI",
      "EXPORT_PDF",
      "TRANSLATION_VOLUME"
    ],
    quotas: {
      activeProjects: 10,
      aiUsage: 1000,
      collaborators: 5,
      storageMb: 10240,
      translationSegments: 50000
    },
    exportFormats: ["JSON_MASTER", "PDF", "DOCX", "EPUB", "MOBI"],
    publishingChannels: ["INTERNAL_EXPORT", "PUBLIC_PORTAL_DRAFT"],
    distributionChannels: ["LOCAL_DOWNLOAD"],
    auditRetentionDays: 180,
    backupRetentionDays: 30,
    priorityProcessing: false,
    downgradeBehavior: {
      preserveExistingContent: true,
      preserveAuditAndVersions: true,
      disableUnavailableFutureActionsOnly: true,
      markOverLimitResourcesReadOnly: true,
      automaticDeletion: false,
      remediationSummaryRequired: true
    }
  },
  BUSINESS: {
    plan: "BUSINESS",
    enabled: true,
    includedFeatures: [
      "ADVANCED_EDITORIAL_TOOLS",
      "AI_AGENT",
      "API_ACCESS",
      "AUDIT_RETENTION",
      "BACKUP_RETENTION",
      "COLLABORATION",
      "DISTRIBUTION_CHANNELS",
      "EXPORT_DOCX",
      "EXPORT_EPUB",
      "EXPORT_JSON_MASTER",
      "EXPORT_MOBI",
      "EXPORT_PDF",
      "EXPORT_PRINT",
      "PRIORITY_PROCESSING",
      "PUBLISHING_CHANNELS",
      "TEAM_ADMINISTRATION",
      "TRANSLATION_VOLUME"
    ],
    quotas: {
      activeProjects: 100,
      aiUsage: 10000,
      collaborators: 50,
      storageMb: 102400,
      translationSegments: 500000
    },
    exportFormats: ["JSON_MASTER", "PDF", "DOCX", "EPUB", "MOBI", "PRINT"],
    publishingChannels: ["INTERNAL_EXPORT", "PUBLIC_PORTAL", "MARKETPLACE_METADATA"],
    distributionChannels: ["PUBLIC_PORTAL", "LOCAL_DOWNLOAD", "PARTNER_METADATA"],
    auditRetentionDays: 365,
    backupRetentionDays: 90,
    priorityProcessing: true,
    downgradeBehavior: {
      preserveExistingContent: true,
      preserveAuditAndVersions: true,
      disableUnavailableFutureActionsOnly: true,
      markOverLimitResourcesReadOnly: true,
      automaticDeletion: false,
      remediationSummaryRequired: true
    }
  },
  ENTERPRISE_RESERVED: {
    plan: "ENTERPRISE_RESERVED",
    enabled: false,
    includedFeatures: [],
    quotas: {
      activeProjects: null,
      aiUsage: null,
      collaborators: null,
      storageMb: null,
      translationSegments: null
    },
    exportFormats: [],
    publishingChannels: [],
    distributionChannels: [],
    auditRetentionDays: 0,
    backupRetentionDays: 0,
    priorityProcessing: false,
    downgradeBehavior: {
      preserveExistingContent: true,
      preserveAuditAndVersions: true,
      disableUnavailableFutureActionsOnly: true,
      markOverLimitResourcesReadOnly: true,
      automaticDeletion: false,
      remediationSummaryRequired: true
    }
  }
};

const FEATURE_MINIMUM_PLAN: Record<WorkspaceEntitlementFeature, WorkspaceSubscriptionPlan> = {
  ADVANCED_EDITORIAL_TOOLS: "PREMIUM",
  AI_AGENT: "PREMIUM",
  API_ACCESS: "BUSINESS",
  AUDIT_RETENTION: "BUSINESS",
  BACKUP_RETENTION: "BUSINESS",
  COLLABORATION: "PREMIUM",
  DISTRIBUTION_CHANNELS: "BUSINESS",
  EXPORT_DOCX: "PREMIUM",
  EXPORT_EPUB: "PREMIUM",
  EXPORT_JSON_MASTER: "FREE",
  EXPORT_MOBI: "PREMIUM",
  EXPORT_PDF: "FREE",
  EXPORT_PRINT: "BUSINESS",
  PRIORITY_PROCESSING: "BUSINESS",
  PUBLISHING_CHANNELS: "BUSINESS",
  TEAM_ADMINISTRATION: "BUSINESS",
  TRANSLATION_VOLUME: "FREE"
};

const ROLE_ACTIONS_ALLOWED: Record<WorkspaceOperationalRole, WorkspaceEffectiveAccessAction[]> = {
  ADMINISTRATOR: [
    "ADMINISTRATION_ACTION",
    "AI_EXECUTION",
    "API_USAGE",
    "DISTRIBUTION",
    "DOCUMENT_EDIT",
    "EXPORT",
    "PROJECT_CREATE",
    "PUBLISHING",
    "REVIEW",
    "ROLE_ASSIGNMENT",
    "STORAGE_UPLOAD",
    "TRANSLATION",
    "USER_INVITATION"
  ],
  PROJECT_MANAGER: ["DOCUMENT_EDIT", "PROJECT_CREATE", "REVIEW", "USER_INVITATION"],
  EDITOR: ["DOCUMENT_EDIT", "REVIEW"],
  TRANSLATOR: ["DOCUMENT_EDIT", "TRANSLATION"],
  REVIEWER: ["EXPORT", "REVIEW"],
  DESIGNER: ["DOCUMENT_EDIT", "EXPORT", "STORAGE_UPLOAD"],
  AUDIO_NARRATOR: ["AI_EXECUTION", "DOCUMENT_EDIT", "STORAGE_UPLOAD"],
  AUTHOR: ["DOCUMENT_EDIT", "PROJECT_CREATE"],
  COLLABORATOR: ["DOCUMENT_EDIT"],
  READER: [],
  GUEST: []
};

@Injectable()
export class WorkspaceService {
  constructor(private readonly repository: DatabaseWorkspaceRepository) {}

  async getNavigation(actor: WorkspaceActor): Promise<WorkspaceNavigationItem[]> {
    const navigation = await this.ensureNavigation(actor);
    const filtered = navigation
      .filter((item) => this.isNavigationItemVisible(actor, item))
      .sort((left, right) => left.order - right.order);

    await this.audit("WORKSPACE_NAVIGATION_GENERATED", actor, {}, {
      visibleModules: filtered.map((item) => item.module)
    });

    return filtered;
  }

  async getDashboard(actor: WorkspaceActor): Promise<WorkspaceDashboard> {
    const [layout, navigation, widgets, preferences] = await Promise.all([
      this.ensureLayout(actor),
      this.getNavigation(actor),
      this.getWidgets(actor),
      this.getPreferences(actor)
    ]);
    const languageManagement = this.buildLanguageManagement(preferences);

    return {
      layout,
      navigation,
      widgets,
      preferences,
      languageManagement,
      needToKnow: {
        defaultAccess: "ASSIGNED_SCOPE_ONLY",
        hiddenDataLoadedThroughApi: false,
        visibleModules: navigation.map((item) => item.module),
        panelsConfigurablePerUser: true,
        panelsRestoredBetweenSessions: true
      },
      generatedFor: {
        userId: actor.userId,
        organizationId: actor.organizationId,
        roles: actor.roles,
        permissions: actor.permissions
      }
    };
  }

  async getLanguageManagement(actor: WorkspaceActor): Promise<WorkspaceLanguageManagement> {
    return this.buildLanguageManagement(await this.getPreferences(actor));
  }

  async saveLanguageManagement(
    actor: WorkspaceActor,
    input: SaveWorkspaceLanguageManagementInput
  ): Promise<WorkspaceLanguageManagement> {
    const existingPreferences = await this.getPreferences(actor);
    const before = this.buildLanguageManagement(existingPreferences);
    const beforeMetadata = this.languageMetadataFromPreferences(existingPreferences);

    if (
      input.originalLanguage &&
      input.originalLanguage !== before.model.project.originalLanguage &&
      !input.authorizedOriginalLanguageChange
    ) {
      throw new ForbiddenException("Original Language is immutable unless changed by an authorized user.");
    }

    if (input.originalLanguage && input.originalLanguage !== before.model.project.originalLanguage) {
      this.assertCanManageAccess(actor);
    }

    const platformLanguage = input.platformLanguage ?? existingPreferences.platformLanguage;
    const nextMetadata: StoredLanguageManagementMetadata = {
      ...beforeMetadata,
      originalLanguage: input.originalLanguage ?? beforeMetadata.originalLanguage ?? before.model.project.originalLanguage,
      originalLocale: input.originalLocale ?? beforeMetadata.originalLocale ?? before.model.project.originalLocale,
      authoringLanguage: input.authoringLanguage ?? beforeMetadata.authoringLanguage ?? before.model.project.authoringLanguage,
      authoringLocale: input.authoringLocale ?? beforeMetadata.authoringLocale ?? before.model.project.authoringLocale,
      targetLanguages: input.targetLanguages ?? beforeMetadata.targetLanguages ?? before.model.project.targetLanguages,
      fallbackLanguage: input.fallbackLanguage ?? beforeMetadata.fallbackLanguage ?? before.model.fallbackLanguage,
      resourcesVersion: input.resourcesUpdated
        ? (beforeMetadata.resourcesVersion ?? 0) + 1
        : beforeMetadata.resourcesVersion
    };

    await this.savePreferences(actor, {
      platformLanguage,
      metadata: {
        ...(this.objectMetadata(existingPreferences.metadata)),
        unifiedLanguageManagement: nextMetadata
      }
    });

    const updatedPreferences = await this.getPreferences(actor);
    const after = this.buildLanguageManagement(updatedPreferences);
    await this.auditLanguageChanges(
      actor,
      before,
      after,
      Boolean(input.resourcesUpdated),
      Boolean(input.platformLanguage)
    );

    return after;
  }

  async getSubscriptionSummary(actor: WorkspaceActor): Promise<WorkspaceSubscriptionSummary> {
    const currentPlan = this.resolveSubscriptionPlan(actor);

    return {
      currentPlan,
      plans: Object.values(SUBSCRIPTION_PLANS),
      currentEntitlements: SUBSCRIPTION_PLANS[currentPlan],
      usage: this.getSubscriptionUsage(actor),
      accountOwnerCanManageSubscription: this.isAccountOwnerOrAdmin(actor),
      roleNamesAreNotPlanNames: true,
      enterpriseReservedEnabled: false
    };
  }

  async resolveEffectiveAccess(
    actor: WorkspaceActor,
    input: WorkspaceEffectiveAccessInput
  ): Promise<WorkspaceEffectiveAccessResult> {
    const subscription = await this.getSubscriptionSummary(actor);
    const operationalRole = this.operationalRoleFromActor(actor);
    const platformCreatorAccess = actor.roles.includes("PLATFORM_CREATOR");
    const roleAllowed = platformCreatorAccess || ROLE_ACTIONS_ALLOWED[operationalRole].includes(input.action);
    const needToKnow = await this.evaluateNeedToKnowAccess(actor, input);
    const requiredFeature = input.requiredFeature ?? this.defaultFeatureForAction(input.action);
    const planAllowsFeature =
      platformCreatorAccess ||
      !requiredFeature ||
      (subscription.currentEntitlements.enabled &&
        subscription.currentEntitlements.includedFeatures.includes(requiredFeature));
    const quotaKey = input.quotaKey ?? this.defaultQuotaForAction(input.action);
    const requestedAmount = input.requestedAmount ?? 1;
    const quotaLimit = quotaKey ? subscription.currentEntitlements.quotas[quotaKey] : undefined;
    const quotaUsage = quotaKey ? subscription.usage[quotaKey] : undefined;
    const quotaAllows =
      platformCreatorAccess ||
      !quotaKey ||
      quotaLimit === null ||
      quotaLimit === undefined ||
      (quotaUsage ?? 0) + requestedAmount <= quotaLimit;
    const subscriptionAllowed = planAllowsFeature && quotaAllows;
    const needToKnowAllowed = platformCreatorAccess || needToKnow.decision === "ALLOW";
    const decision: "ALLOW" | "DENY" =
      roleAllowed && subscriptionAllowed && needToKnowAllowed ? "ALLOW" : "DENY";
    const requiredPlan = requiredFeature ? FEATURE_MINIMUM_PLAN[requiredFeature] : undefined;
    const reason = this.effectiveAccessReason({
      roleAllowed,
      planAllowsFeature,
      quotaAllows,
      needToKnowAllowed,
      requiredFeature,
      requiredPlan,
      quotaKey
    });

    const result: WorkspaceEffectiveAccessResult = {
      decision,
      reason,
      roleAllowed,
      subscriptionAllowed,
      needToKnowAllowed,
      explicitDenialApplied: decision === "DENY",
      mostRestrictiveRuleApplied: true,
      operationalRole,
      roleAssignmentScopes: [...ROLE_ASSIGNMENT_SCOPES] as WorkspaceRoleAssignmentScope[],
      subscriptionPlan: subscription.currentPlan,
      requiredPlan: decision === "DENY" ? requiredPlan : undefined,
      requiredFeature,
      quotaKey,
      quotaLimit,
      quotaUsage,
      requestedAmount,
      dataDestroyed: false,
      existingWorkRemoved: false,
      restrictedNewActionOnly: true,
      readOnlyOverLimit: decision === "DENY" && Boolean(quotaKey && quotaLimit !== null && quotaLimit !== undefined),
      remediationSummary: decision === "DENY"
        ? this.buildRemediationSummary(requiredPlan, quotaKey)
        : undefined,
      needToKnow
    };

    if (decision === "DENY" && !planAllowsFeature) {
      await this.audit(
        "FEATURE_BLOCKED",
        actor,
        { projectId: input.projectId, resourceType: input.resourceType, resourceId: input.resourceId },
        result
      );
    }

    if (decision === "DENY" && !quotaAllows) {
      await this.audit(
        "QUOTA_EXCEEDED",
        actor,
        { projectId: input.projectId, resourceType: input.resourceType, resourceId: input.resourceId },
        result
      );
    }

    return result;
  }

  async getPreferences(actor: WorkspaceActor): Promise<WorkspacePreferences> {
    const existing = await this.repository.findPreferencesByUser(actor.userId, actor.organizationId);

    if (existing) {
      return {
        ...existing,
        platformLanguage: existing.platformLanguage ?? existing.language ?? "ro"
      };
    }

    return this.savePreferences(actor, {
      favoriteModules: ["DASHBOARD", "MY_PROJECTS"],
      dashboardLayout: { columns: 3, density: "comfortable" },
      collapsedMenus: [],
      themeMetadata: { theme: "system" },
      language: "ro",
      platformLanguage: "ro",
      notificationPreferences: { email: false, inApp: true },
      metadata: { generatedDefault: true }
    });
  }

  async savePreferences(
    actor: WorkspaceActor,
    input: SaveWorkspacePreferencesInput
  ): Promise<WorkspacePreferences> {
    const existing = await this.repository.findPreferencesByUser(actor.userId, actor.organizationId);
    const now = new Date().toISOString();
    const platformLanguage = this.normalizePlatformLanguage(
      input.platformLanguage ?? input.language ?? existing?.platformLanguage ?? existing?.language ?? "ro"
    );
    const preferences: WorkspacePreferences = {
      id: existing?.id ?? randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      favoriteModules: input.favoriteModules ?? existing?.favoriteModules ?? ["DASHBOARD"],
      dashboardLayout: input.dashboardLayout ?? existing?.dashboardLayout ?? {},
      collapsedMenus: input.collapsedMenus ?? existing?.collapsedMenus ?? [],
      themeMetadata: input.themeMetadata ?? existing?.themeMetadata ?? { theme: "system" },
      language: platformLanguage,
      platformLanguage,
      notificationPreferences:
        input.notificationPreferences ?? existing?.notificationPreferences ?? { inApp: true },
      aiSuggestedLayout: input.aiSuggestedLayout ?? existing?.aiSuggestedLayout,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      metadata: {
        ...(existing?.metadata ?? {}),
        ...(input.metadata ?? {}),
        aiMayAlterPermissions: false,
        aiMayExposeHiddenModules: false,
        aiMayChangePolicies: false
      }
    };

    const saved = await this.repository.upsertPreferences(preferences);
    await this.audit(
      "WORKSPACE_PREFERENCES_SAVED",
      actor,
      { preferenceId: saved.id },
      saved,
      existing ?? undefined
    );

    if (existing && existing.platformLanguage !== saved.platformLanguage) {
      await this.audit(
        "PLATFORM_LANGUAGE_CHANGED",
        actor,
        { preferenceId: saved.id },
        { platformLanguage: saved.platformLanguage },
        { platformLanguage: existing.platformLanguage }
      );
    }

    return saved;
  }

  async getWidgets(actor: WorkspaceActor): Promise<WorkspaceWidget[]> {
    const widgets = await this.ensureWidgets(actor);

    return widgets
      .filter((widget) => this.isWidgetVisible(actor, widget))
      .sort((left, right) => left.order - right.order);
  }

  async createWidget(actor: WorkspaceActor, input: CreateWorkspaceWidgetInput): Promise<WorkspaceWidget> {
    const now = new Date().toISOString();
    const widget: WorkspaceWidget = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      widgetType: input.widgetType,
      title: input.title ?? input.widgetType,
      visible: input.visible ?? true,
      order: input.order ?? 100,
      size: input.size ?? "MEDIUM",
      permissionsRequired: input.permissionsRequired ?? ["read"],
      defaultForRoles: input.defaultForRoles ?? actor.roles,
      configuration: input.configuration ?? {},
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        humanFinalAuthorityRequired: true,
        aiMaySuggestWidgets: true,
        aiMayAlterPermissions: false
      }
    };

    const created = await this.repository.createWidget(widget);
    await this.audit("WORKSPACE_WIDGET_CREATED", actor, { widgetId: created.id }, created);

    return created;
  }

  async listAudit(actor: WorkspaceActor): Promise<WorkspaceAuditEvent[]> {
    return this.repository.listAuditEvents(actor.organizationId);
  }

  async inviteCollaborator(
    actor: WorkspaceActor,
    input: InviteWorkspaceCollaboratorInput
  ) {
    this.assertCanManageAccess(actor);

    if (!input.inviteeEmail || !input.projectId || !input.role) {
      throw new BadRequestException("inviteeEmail, projectId and role are required.");
    }

    const now = new Date().toISOString();
    const accessScope = this.normalizeAccessScope(input.projectId, input.accessScope);
    const permittedTools = this.restrictToolsForRole(input.role, input.permittedTools);
    const preview = this.buildNeedToKnowPreview(input.role, permittedTools);
    const invitation = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      inviteeEmail: input.inviteeEmail,
      inviteeName: input.inviteeName,
      projectId: input.projectId,
      role: input.role,
      permittedTools,
      accessScope,
      startsAt: input.startsAt,
      expiresAt: input.expiresAt,
      reason: input.reason,
      status: "SENT" as const,
      sentBy: actor.userId,
      sentAt: now,
      preview,
      metadata: {
        ...(input.metadata ?? {}),
        inviteFlow: "choose person -> choose role and access scope -> confirm",
        advancedPermissionsOptional: true,
        hiddenDataLoadedThroughApi: false
      }
    };
    const created = await this.repository.createInvitation(invitation);

    await this.audit(
      "INVITATION_SENT",
      actor,
      { invitationId: created.id, projectId: created.projectId },
      created
    );

    return created;
  }

  async previewCollaboratorAccess(
    actor: WorkspaceActor,
    input: InviteWorkspaceCollaboratorInput
  ): Promise<WorkspaceNeedToKnowPreview> {
    this.assertCanManageAccess(actor);

    if (!input.role) {
      throw new BadRequestException("role is required.");
    }

    return this.buildNeedToKnowPreview(
      input.role,
      this.restrictToolsForRole(input.role, input.permittedTools)
    );
  }

  async acceptInvitation(
    actor: WorkspaceActor,
    invitationId: string,
    input: AcceptWorkspaceInvitationInput = {}
  ) {
    const invitation = await this.repository.findInvitationById(invitationId, actor.organizationId);

    if (!invitation) {
      throw new NotFoundException("Workspace invitation not found.");
    }

    if (invitation.status !== "SENT") {
      throw new BadRequestException("Workspace invitation is not pending.");
    }

    if (this.isExpired(invitation.expiresAt)) {
      const expired = await this.repository.updateInvitation({
        ...invitation,
        status: "EXPIRED"
      });
      await this.audit(
        "TEMPORARY_ACCESS_EXPIRED",
        actor,
        { invitationId: expired.id, projectId: expired.projectId },
        expired,
        invitation
      );
      throw new BadRequestException("Workspace invitation has expired.");
    }

    const now = new Date().toISOString();
    const grant: WorkspaceNeedToKnowGrant = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: input.userId ?? actor.userId,
      collaboratorEmail: invitation.inviteeEmail,
      collaboratorName: invitation.inviteeName,
      projectId: invitation.projectId,
      role: invitation.role,
      permittedTools: invitation.permittedTools,
      accessScope: invitation.accessScope,
      startsAt: invitation.startsAt,
      expiresAt: invitation.expiresAt,
      reason: invitation.reason,
      grantedBy: invitation.sentBy,
      grantedAt: now,
      status: "ACTIVE",
      temporary: Boolean(invitation.expiresAt),
      confidentialClassification: "INTERNAL",
      mostRestrictiveRuleApplied: true,
      metadata: {
        sourceInvitationId: invitation.id,
        hiddenDataLoadedThroughApi: false
      }
    };
    const createdGrant = await this.repository.createAccessGrant(grant);
    const accepted = await this.repository.updateInvitation({
      ...invitation,
      status: "ACCEPTED",
      acceptedBy: actor.userId,
      acceptedAt: now,
      accessGrantId: createdGrant.id
    });

    await this.audit(
      "INVITATION_ACCEPTED",
      actor,
      { invitationId: accepted.id, accessGrantId: createdGrant.id, projectId: accepted.projectId },
      accepted,
      invitation
    );
    await this.audit(
      "NEED_TO_KNOW_ACCESS_GRANTED",
      actor,
      { accessGrantId: createdGrant.id, invitationId: accepted.id, projectId: createdGrant.projectId },
      createdGrant
    );

    return { invitation: accepted, accessGrant: createdGrant };
  }

  async evaluateNeedToKnowAccess(
    actor: WorkspaceActor,
    input: WorkspaceNeedToKnowAccessInput
  ): Promise<WorkspaceNeedToKnowAccessResult> {
    if (!input.projectId || !input.resourceType) {
      throw new BadRequestException("projectId and resourceType are required.");
    }

    const grants = await this.activeGrants(actor);
    const matchingGrant = grants.find((grant) =>
      grant.projectId === input.projectId && this.scopeContains(grant, input)
    );
    const role = matchingGrant?.role ?? this.roleFromActor(actor);
    const hasExplicitGrant = matchingGrant !== undefined;
    const roleAllowsResource =
      ROLE_RESOURCE_TYPES[role].includes(input.resourceType) ||
      (hasExplicitGrant && input.resourceType !== "ADMINISTRATION");
    const confidential = input.confidentialClassification === "CONFIDENTIAL" ||
      input.confidentialClassification === "RESTRICTED";
    const restrictedByDefault = ALWAYS_RESTRICTED_RESOURCE_TYPES.has(input.resourceType) &&
      role !== "ADMINISTRATOR" &&
      !hasExplicitGrant;

    if (!roleAllowsResource || restrictedByDefault || (confidential && !hasExplicitGrant && role !== "ADMINISTRATOR")) {
      const result = this.buildAccessResult(input, role, matchingGrant, "DENY", "Most restrictive valid rule denies this resource.");
      await this.audit(
        "RESTRICTED_ACCESS_ATTEMPT",
        actor,
        { projectId: input.projectId, resourceType: input.resourceType, resourceId: input.resourceId },
        result
      );
      return result;
    }

    const result = this.buildAccessResult(
      input,
      role,
      matchingGrant,
      "ALLOW",
      hasExplicitGrant
        ? "Explicit need-to-know grant allows this assigned scope."
        : "Role-essential workspace access allows this non-confidential scope."
    );

    if (input.resourceType === "DOCUMENT") {
      await this.audit("DOCUMENT_OPENED", actor, {
        projectId: input.projectId,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? input.documentId
      }, result);
    }

    if (confidential) {
      await this.audit("CONFIDENTIAL_RESOURCE_ACCESSED", actor, {
        projectId: input.projectId,
        resourceType: input.resourceType,
        resourceId: input.resourceId
      }, result);
    }

    return result;
  }

  async revokeAccess(
    actor: WorkspaceActor,
    grantId: string,
    input: RevokeWorkspaceAccessInput = {}
  ): Promise<WorkspaceNeedToKnowGrant> {
    this.assertCanManageAccess(actor);

    const existing = await this.repository.findAccessGrantById(grantId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Need-to-know access grant not found.");
    }

    const revoked: WorkspaceNeedToKnowGrant = {
      ...existing,
      status: "REVOKED",
      revokedBy: actor.userId,
      revokedAt: new Date().toISOString(),
      metadata: {
        ...(existing.metadata ?? {}),
        revocationReason: input.reason,
        immediateRevocationAcrossActiveSessions: true
      }
    };
    const saved = await this.repository.updateAccessGrant(revoked);

    await this.audit(
      "NEED_TO_KNOW_ACCESS_REVOKED",
      actor,
      { accessGrantId: saved.id, projectId: saved.projectId },
      saved,
      existing
    );

    return saved;
  }

  async expireTemporaryAccess(actor: WorkspaceActor): Promise<WorkspaceNeedToKnowGrant[]> {
    const grants = await this.repository.listAccessGrantsForUser(actor.userId, actor.organizationId);
    const expired: WorkspaceNeedToKnowGrant[] = [];

    for (const grant of grants) {
      if (grant.status === "ACTIVE" && grant.temporary && this.isExpired(grant.expiresAt)) {
        const changed = await this.repository.updateAccessGrant({
          ...grant,
          status: "EXPIRED",
          revokedAt: new Date().toISOString(),
          metadata: {
            ...(grant.metadata ?? {}),
            automaticRevocation: true
          }
        });
        expired.push(changed);
        await this.audit(
          "TEMPORARY_ACCESS_EXPIRED",
          actor,
          { accessGrantId: changed.id, projectId: changed.projectId },
          changed,
          grant
        );
      }
    }

    return expired;
  }

  async recordRestrictedAccessAttempt(
    actor: WorkspaceActor,
    input: WorkspaceAccessAuditInput
  ): Promise<void> {
    await this.audit("RESTRICTED_ACCESS_ATTEMPT", actor, {
      projectId: input.projectId,
      resourceType: input.resourceType,
      resourceId: input.resourceId
    }, {
      reason: input.reason,
      confidentialClassification: input.confidentialClassification,
      restrictedMetadataReturned: false
    });
  }

  async recordAgentDataAccess(
    actor: WorkspaceActor,
    input: WorkspaceAgentDataAccessInput
  ): Promise<void> {
    await this.audit("AI_AGENT_DATA_ACCESS", actor, {
      projectId: input.projectId,
      resourceType: input.resourceType,
      agent: input.agent
    }, {
      agent: input.agent,
      task: input.task,
      accessedResources: input.resourceIds,
      accessScope: input.accessScope,
      decision: input.decision,
      result: input.result,
      timestamp: new Date().toISOString(),
      agentMayExpandOwnAccess: false
    });
  }

  private async ensureLayout(actor: WorkspaceActor): Promise<WorkspaceLayout> {
    const existing = await this.repository.listLayouts(actor.organizationId);
    const firstLayout = existing[0];

    if (firstLayout) {
      return firstLayout;
    }

    const now = new Date().toISOString();
    const layout: WorkspaceLayout = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: "Unified Enterprise Workspace",
      defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"],
      dashboardRoute: "/workspace/dashboard",
      navigationRoute: "/workspace/navigation",
      visibleModules: DEFAULT_NAVIGATION.map((item) => item.module),
      humanFinalAuthorityRequired: true,
      aiMaySuggestDashboardLayouts: true,
      aiMaySuggestWidgets: true,
      aiMayRecommendShortcuts: true,
      aiMayAlterPermissions: false,
      aiMayExposeHiddenModules: false,
      aiMayChangePolicies: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        backendOnly: true,
        frontendImplementation: "NOT_CONFIGURED"
      }
    };

    const created = await this.repository.createLayout(layout);
    await this.audit("WORKSPACE_LAYOUT_CREATED", actor, { layoutId: created.id }, created);

    return created;
  }

  private async ensureNavigation(actor: WorkspaceActor): Promise<WorkspaceNavigationItem[]> {
    const existing = await this.repository.listNavigationItems(actor.organizationId);

    if (existing.length > 0) {
      return existing;
    }

    const now = new Date().toISOString();
    const created: WorkspaceNavigationItem[] = [];

    for (const item of DEFAULT_NAVIGATION) {
      created.push(
        await this.repository.createNavigationItem({
          ...item,
          id: randomUUID(),
          organizationId: actor.organizationId,
          createdBy: actor.userId,
          createdAt: now,
          updatedAt: now,
          metadata: {
            generatedDefault: true,
            roleBasedNavigation: true
          }
        })
      );
    }

    return created;
  }

  private async ensureWidgets(actor: WorkspaceActor): Promise<WorkspaceWidget[]> {
    const existing = await this.repository.listWidgets(actor.organizationId);

    if (existing.length > 0) {
      return existing;
    }

    const now = new Date().toISOString();
    const created: WorkspaceWidget[] = [];

    for (const widget of DEFAULT_WIDGETS) {
      created.push(
        await this.repository.createWidget({
          ...widget,
          id: randomUUID(),
          organizationId: actor.organizationId,
          createdBy: actor.userId,
          createdAt: now,
          updatedAt: now,
          metadata: {
            generatedDefault: true,
            roleBasedDashboard: true
          }
        })
      );
    }

    return created;
  }

  private isNavigationItemVisible(actor: WorkspaceActor, item: WorkspaceNavigationItem): boolean {
    if (!item.visible || item.moduleVisibility === "HIDDEN" || item.organizationPolicyVisibility === "HIDDEN") {
      return false;
    }

    return this.hasRole(actor, item.defaultForRoles) && this.hasPermissions(actor, item.permissionsRequired);
  }

  private isWidgetVisible(actor: WorkspaceActor, widget: WorkspaceWidget): boolean {
    return widget.visible && this.hasRole(actor, widget.defaultForRoles) && this.hasPermissions(actor, widget.permissionsRequired);
  }

  private hasRole(actor: WorkspaceActor, allowedRoles: string[]): boolean {
    if (actor.roles.includes("PLATFORM_CREATOR")) {
      return true;
    }

    return allowedRoles.length === 0 || actor.roles.some((role) => allowedRoles.includes(role));
  }

  private hasPermissions(actor: WorkspaceActor, requiredPermissions: string[]): boolean {
    if (actor.roles.includes("PLATFORM_CREATOR")) {
      return true;
    }

    return requiredPermissions.length === 0 ||
      requiredPermissions.every((permission) => actor.permissions.includes(permission as never));
  }

  private resolveSubscriptionPlan(_actor: WorkspaceActor): WorkspaceSubscriptionPlan {
    return "FREE";
  }

  private getSubscriptionUsage(_actor: WorkspaceActor): WorkspaceSubscriptionUsage {
    return {
      activeProjects: 1,
      aiUsage: 0,
      collaborators: 0,
      storageMb: 128,
      translationSegments: 0
    };
  }

  private isAccountOwnerOrAdmin(actor: WorkspaceActor): boolean {
    return actor.roles.includes("PLATFORM_CREATOR") || actor.roles.includes("ADMIN");
  }

  private operationalRoleFromActor(actor: WorkspaceActor): WorkspaceOperationalRole {
    if (actor.roles.includes("PLATFORM_CREATOR") || actor.roles.includes("ADMIN")) {
      return "ADMINISTRATOR";
    }

    if (actor.roles.includes("REVIEWER")) {
      return "REVIEWER";
    }

    if (actor.roles.includes("TRANSLATOR")) {
      return "TRANSLATOR";
    }

    return "READER";
  }

  private defaultFeatureForAction(
    action: WorkspaceEffectiveAccessAction
  ): WorkspaceEntitlementFeature | undefined {
    switch (action) {
      case "AI_EXECUTION":
        return "AI_AGENT";
      case "API_USAGE":
        return "API_ACCESS";
      case "DISTRIBUTION":
        return "DISTRIBUTION_CHANNELS";
      case "EXPORT":
        return "EXPORT_PDF";
      case "PUBLISHING":
        return "PUBLISHING_CHANNELS";
      case "ROLE_ASSIGNMENT":
        return "TEAM_ADMINISTRATION";
      case "TRANSLATION":
        return "TRANSLATION_VOLUME";
      case "USER_INVITATION":
        return "COLLABORATION";
      case "ADMINISTRATION_ACTION":
      case "DOCUMENT_EDIT":
      case "PROJECT_CREATE":
      case "REVIEW":
      case "STORAGE_UPLOAD":
        return undefined;
    }
  }

  private defaultQuotaForAction(
    action: WorkspaceEffectiveAccessAction
  ): WorkspacePlanQuotaKey | undefined {
    switch (action) {
      case "AI_EXECUTION":
        return "aiUsage";
      case "PROJECT_CREATE":
        return "activeProjects";
      case "STORAGE_UPLOAD":
        return "storageMb";
      case "TRANSLATION":
        return "translationSegments";
      case "USER_INVITATION":
        return "collaborators";
      case "ADMINISTRATION_ACTION":
      case "API_USAGE":
      case "DISTRIBUTION":
      case "DOCUMENT_EDIT":
      case "EXPORT":
      case "PUBLISHING":
      case "REVIEW":
      case "ROLE_ASSIGNMENT":
        return undefined;
    }
  }

  private effectiveAccessReason(input: {
    needToKnowAllowed: boolean;
    planAllowsFeature: boolean;
    quotaAllows: boolean;
    quotaKey?: WorkspacePlanQuotaKey;
    requiredFeature?: WorkspaceEntitlementFeature;
    requiredPlan?: WorkspaceSubscriptionPlan;
    roleAllowed: boolean;
  }): string {
    if (!input.roleAllowed) {
      return "Role permissions do not allow this action.";
    }

    if (!input.planAllowsFeature) {
      return `Subscription plan does not include ${input.requiredFeature}; required plan is ${input.requiredPlan}.`;
    }

    if (!input.quotaAllows) {
      return `Subscription quota exceeded for ${input.quotaKey}. Existing work is preserved and only the new action is blocked.`;
    }

    if (!input.needToKnowAllowed) {
      return "Need-to-Know scope does not allow this resource.";
    }

    return "Role permissions, subscription entitlements, and Need-to-Know scope allow this action.";
  }

  private buildRemediationSummary(
    requiredPlan?: WorkspaceSubscriptionPlan,
    quotaKey?: WorkspacePlanQuotaKey
  ): string[] {
    return [
      "No existing projects, files, collaborators, audit entries, or versions are deleted.",
      "Only unavailable future actions are disabled.",
      quotaKey ? `Resources over the ${quotaKey} limit may become read-only where necessary.` : "Existing work remains available.",
      requiredPlan ? `Required plan: ${requiredPlan}.` : "Review the current role, plan, and assignment scope."
    ];
  }

  private buildLanguageManagement(preferences: WorkspacePreferences): WorkspaceLanguageManagement {
    const metadata = this.languageMetadataFromPreferences(preferences);
    const model = createUnifiedLanguageManagementModel({
      platformLanguage: preferences.platformLanguage ?? preferences.language,
      originalLanguage: metadata.originalLanguage ?? "fr",
      originalLocale: metadata.originalLocale ?? "fr-FR",
      authoringLanguage: metadata.authoringLanguage ?? "ro",
      authoringLocale: metadata.authoringLocale ?? "ro-RO",
      targetLanguages: metadata.targetLanguages ?? [
        { language: "en", locale: "en-US", enabled: true },
        { language: "es", locale: "es-ES", enabled: true },
        { language: "pt", locale: "pt-PT", enabled: true },
        { language: "it", locale: "it-IT", enabled: true }
      ],
      fallbackLanguage: metadata.fallbackLanguage ?? "en-US"
    });
    const primaryTarget = model.project.targetLanguages[0] ?? {
      language: model.project.authoringLanguage,
      locale: model.project.authoringLocale,
      enabled: true
    };

    return {
      model,
      administration: {
        installedLanguages: model.installedLanguages,
        enabledLanguages: model.enabledLanguages,
        defaultPlatformLanguage: model.defaultPlatformLanguage,
        fallbackLanguage: model.fallbackLanguage,
        translationCompleteness: model.translationCompleteness,
        linguisticResources: ["dictionaries", "glossaries", "terminology", "phraseology", "linguistic resources"],
        dictionaries: model.linguisticResourceLoading.map((plan) => this.languagePairKey(plan.sourceLanguage, plan.targetLanguage)),
        glossaries: model.linguisticResourceLoading.map((plan) => this.languagePairKey(plan.sourceLanguage, plan.targetLanguage))
      },
      aiAgents: {
        conversationLanguage: this.languagePairKey(model.platformLanguage, model.platformLocale),
        explanationsLanguage: this.languagePairKey(model.platformLanguage, model.platformLocale),
        translationDirection: model.project.targetLanguages.map((target) =>
          `${this.languagePairKey(model.project.originalLanguage, model.project.originalLocale)} -> ${this.languagePairKey(target.language, target.locale)}`
        ),
        platformLanguageControlsUserCommunication: true,
        aiMayChangeLanguageConfiguration: false
      },
      parallelReview: {
        defaultColumns: createParallelReviewColumns({
          originalLanguage: model.project.originalLanguage,
          originalLocale: model.project.originalLocale,
          targetLanguage: primaryTarget.language,
          targetLocale: primaryTarget.locale
        }),
        supportsThreeColumns: true,
        supportsFourColumns: true,
        eachColumnSelectsLanguageAndVersion: true
      },
      auditActions: [
        "PLATFORM_LANGUAGE_CHANGED",
        "ORIGINAL_LANGUAGE_CHANGED",
        "AUTHORING_LANGUAGE_CHANGED",
        "TARGET_LANGUAGE_ADDED",
        "TARGET_LANGUAGE_REMOVED",
        "LANGUAGE_RESOURCES_UPDATED"
      ]
    };
  }

  private async auditLanguageChanges(
    actor: WorkspaceActor,
    before: WorkspaceLanguageManagement,
    after: WorkspaceLanguageManagement,
    resourcesUpdated: boolean,
    platformLanguageAlreadyAudited = false
  ): Promise<void> {
    const beforeModel = before.model;
    const afterModel = after.model;

    if (!platformLanguageAlreadyAudited &&
      this.languagePairKey(beforeModel.platformLanguage, beforeModel.platformLocale) !==
      this.languagePairKey(afterModel.platformLanguage, afterModel.platformLocale)) {
      await this.audit("PLATFORM_LANGUAGE_CHANGED", actor, {}, afterModel, beforeModel);
    }

    if (this.languagePairKey(beforeModel.project.originalLanguage, beforeModel.project.originalLocale) !==
      this.languagePairKey(afterModel.project.originalLanguage, afterModel.project.originalLocale)) {
      await this.audit("ORIGINAL_LANGUAGE_CHANGED", actor, {}, afterModel.project, beforeModel.project);
    }

    if (this.languagePairKey(beforeModel.project.authoringLanguage, beforeModel.project.authoringLocale) !==
      this.languagePairKey(afterModel.project.authoringLanguage, afterModel.project.authoringLocale)) {
      await this.audit("AUTHORING_LANGUAGE_CHANGED", actor, {}, afterModel.project, beforeModel.project);
    }

    const beforeTargets = new Set(beforeModel.project.targetLanguages.map((target) =>
      this.languagePairKey(target.language, target.locale)
    ));
    const afterTargets = new Set(afterModel.project.targetLanguages.map((target) =>
      this.languagePairKey(target.language, target.locale)
    ));

    for (const target of afterTargets) {
      if (!beforeTargets.has(target)) {
        await this.audit("TARGET_LANGUAGE_ADDED", actor, {}, { targetLanguage: target }, beforeModel.project);
      }
    }

    for (const target of beforeTargets) {
      if (!afterTargets.has(target)) {
        await this.audit("TARGET_LANGUAGE_REMOVED", actor, {}, { targetLanguage: target }, beforeModel.project);
      }
    }

    if (resourcesUpdated) {
      await this.audit(
        "LANGUAGE_RESOURCES_UPDATED",
        actor,
        {},
        after.administration,
        before.administration
      );
    }
  }

  private languageMetadataFromPreferences(preferences: WorkspacePreferences): StoredLanguageManagementMetadata {
    const metadata = this.objectMetadata(preferences.metadata) as WorkspacePreferencesMetadata;
    const languageMetadata = metadata.unifiedLanguageManagement;

    if (!languageMetadata) {
      return {};
    }

    return {
      originalLanguage: this.optionalIsoLanguage(languageMetadata.originalLanguage),
      originalLocale: this.optionalIsoLanguage(languageMetadata.originalLocale),
      authoringLanguage: this.optionalIsoLanguage(languageMetadata.authoringLanguage),
      authoringLocale: this.optionalIsoLanguage(languageMetadata.authoringLocale),
      targetLanguages: Array.isArray(languageMetadata.targetLanguages)
        ? languageMetadata.targetLanguages.filter((target) => this.isStoredTargetLanguage(target))
        : undefined,
      fallbackLanguage: this.optionalIsoLanguage(languageMetadata.fallbackLanguage),
      resourcesVersion: typeof languageMetadata.resourcesVersion === "number"
        ? languageMetadata.resourcesVersion
        : undefined
    };
  }

  private objectMetadata(metadata?: object): Record<string, unknown> {
    return metadata ? { ...(metadata as Record<string, unknown>) } : {};
  }

  private optionalIsoLanguage(language?: string): string | undefined {
    return language && validateIsoCompatibleLanguageTag(language).valid ? language : undefined;
  }

  private isStoredTargetLanguage(value: unknown): value is NonNullable<StoredLanguageManagementMetadata["targetLanguages"]>[number] {
    if (!value || typeof value !== "object") {
      return false;
    }

    const target = value as {
      language?: unknown;
      locale?: unknown;
      enabled?: unknown;
    };

    return typeof target.language === "string" &&
      validateIsoCompatibleLanguageTag(target.language).valid &&
      (target.locale === undefined || typeof target.locale === "string") &&
      (target.enabled === undefined || typeof target.enabled === "boolean");
  }

  private languagePairKey(language: string, locale?: string): string {
    return locale ?? language;
  }

  private normalizePlatformLanguage(language: string): string {
    const validation = validateIsoCompatibleLanguageTag(language);

    if (!validation.valid) {
      return "ro";
    }

    return normalizeLanguageLocale(language).language;
  }

  private assertCanManageAccess(actor: WorkspaceActor): void {
    if (
      !actor.roles.includes("PLATFORM_CREATOR") &&
      !actor.roles.includes("ADMIN") &&
      !actor.roles.includes("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized human roles may manage workspace access.");
    }
  }

  private normalizeAccessScope(
    projectId: string,
    scope: Partial<WorkspaceAccessScope> = {}
  ): WorkspaceAccessScope {
    return {
      projectId,
      documentIds: scope.documentIds ?? [],
      manuscriptIds: scope.manuscriptIds ?? [],
      chapterIds: scope.chapterIds ?? [],
      sectionIds: scope.sectionIds ?? [],
      segmentIds: scope.segmentIds ?? [],
      commentIds: scope.commentIds ?? [],
      versionIds: scope.versionIds ?? [],
      linguisticSourceIds: scope.linguisticSourceIds ?? [],
      rightsRecordIds: scope.rightsRecordIds ?? [],
      mediaAssetIds: scope.mediaAssetIds ?? [],
      exportArtifactIds: scope.exportArtifactIds ?? [],
      publishingRecordIds: scope.publishingRecordIds ?? [],
      distributionRecordIds: scope.distributionRecordIds ?? [],
      agentExecutionIds: scope.agentExecutionIds ?? []
    };
  }

  private restrictToolsForRole(
    role: WorkspaceNeedToKnowRole,
    requestedTools?: WorkspaceModule[]
  ): WorkspaceModule[] {
    const allowedTools = ROLE_TOOLS[role];

    if (!requestedTools || requestedTools.length === 0) {
      return allowedTools;
    }

    return requestedTools.filter((tool) => allowedTools.includes(tool));
  }

  private buildNeedToKnowPreview(
    role: WorkspaceNeedToKnowRole,
    permittedTools: WorkspaceModule[]
  ): WorkspaceNeedToKnowPreview {
    const roleResourceTypes = new Set(ROLE_RESOURCE_TYPES[role]);
    const restrictedResourceTypes = ROLE_RESOURCE_TYPES.ADMINISTRATOR.filter(
      (resourceType) => !roleResourceTypes.has(resourceType)
    );
    const hiddenPanels = [
      "unrelatedContracts",
      "financialData",
      "rightsNegotiations",
      "administration",
      "distributionCredentials",
      "privateInternalDiscussions",
      ...Object.entries(ROLE_PANELS)
        .filter(([candidateRole]) => candidateRole !== role)
        .flatMap(([, panels]) => panels)
        .filter((panel) => !ROLE_PANELS[role].includes(panel))
    ];

    return {
      visiblePanels: ROLE_PANELS[role],
      hiddenPanels: Array.from(new Set(hiddenPanels)),
      permittedActions: ROLE_ACTIONS[role],
      restrictedResourceTypes: Array.from(new Set(restrictedResourceTypes)),
      restrictedMetadataReturned: false
    };
  }

  private isExpired(date?: string): boolean {
    return Boolean(date && new Date(date).getTime() <= Date.now());
  }

  private isNotStarted(date?: string): boolean {
    return Boolean(date && new Date(date).getTime() > Date.now());
  }

  private async activeGrants(actor: WorkspaceActor): Promise<WorkspaceNeedToKnowGrant[]> {
    const grants = await this.repository.listAccessGrantsForUser(actor.userId, actor.organizationId);
    const active: WorkspaceNeedToKnowGrant[] = [];

    for (const grant of grants) {
      if (grant.status !== "ACTIVE" || this.isNotStarted(grant.startsAt)) {
        continue;
      }

      if (grant.temporary && this.isExpired(grant.expiresAt)) {
        const expired = await this.repository.updateAccessGrant({
          ...grant,
          status: "EXPIRED",
          revokedAt: new Date().toISOString(),
          metadata: {
            ...(grant.metadata ?? {}),
            automaticRevocation: true
          }
        });
        await this.audit(
          "TEMPORARY_ACCESS_EXPIRED",
          actor,
          { accessGrantId: expired.id, projectId: expired.projectId },
          expired,
          grant
        );
        continue;
      }

      active.push(grant);
    }

    return active;
  }

  private roleFromActor(actor: WorkspaceActor): WorkspaceNeedToKnowRole {
    if (actor.roles.includes("PLATFORM_CREATOR") || actor.roles.includes("ADMIN")) {
      return "ADMINISTRATOR";
    }

    if (actor.roles.includes("REVIEWER")) {
      return "REVIEWER";
    }

    if (actor.roles.includes("TRANSLATOR")) {
      return "TRANSLATOR";
    }

    return "COLLABORATOR";
  }

  private scopeContains(
    grant: WorkspaceNeedToKnowGrant,
    input: WorkspaceNeedToKnowAccessInput
  ): boolean {
    if (grant.status !== "ACTIVE" || grant.projectId !== input.projectId) {
      return false;
    }

    const scopedIds = this.scopedIdsForResource(grant.accessScope, input.resourceType);

    if (scopedIds.length === 0 || input.resourceType === "PROJECT") {
      return true;
    }

    const requestedId = this.requestedResourceId(input);

    return Boolean(requestedId && scopedIds.includes(requestedId));
  }

  private scopedIdsForResource(
    scope: WorkspaceAccessScope,
    resourceType: WorkspaceAccessResourceType
  ): string[] {
    switch (resourceType) {
      case "AGENT_EXECUTION":
        return scope.agentExecutionIds ?? [];
      case "CHAPTER":
        return scope.chapterIds ?? [];
      case "COMMENT":
        return scope.commentIds ?? [];
      case "DISTRIBUTION":
        return scope.distributionRecordIds ?? [];
      case "DOCUMENT":
        return scope.documentIds ?? [];
      case "EXPORT":
        return scope.exportArtifactIds ?? [];
      case "LINGUISTIC_SOURCE":
        return scope.linguisticSourceIds ?? [];
      case "MANUSCRIPT":
        return scope.manuscriptIds ?? [];
      case "MEDIA_ASSET":
        return scope.mediaAssetIds ?? [];
      case "PUBLISHING":
        return scope.publishingRecordIds ?? [];
      case "RIGHTS_RECORD":
        return scope.rightsRecordIds ?? [];
      case "SECTION":
        return scope.sectionIds ?? [];
      case "SEGMENT":
        return scope.segmentIds ?? [];
      case "VERSION":
        return scope.versionIds ?? [];
      case "ADMINISTRATION":
      case "PROJECT":
        return [];
    }
  }

  private requestedResourceId(input: WorkspaceNeedToKnowAccessInput): string | undefined {
    switch (input.resourceType) {
      case "CHAPTER":
        return input.chapterId ?? input.resourceId;
      case "DOCUMENT":
        return input.documentId ?? input.resourceId;
      case "MANUSCRIPT":
        return input.manuscriptId ?? input.resourceId;
      case "SECTION":
        return input.sectionId ?? input.resourceId;
      case "SEGMENT":
        return input.segmentId ?? input.resourceId;
      default:
        return input.resourceId;
    }
  }

  private buildAccessResult(
    input: WorkspaceNeedToKnowAccessInput,
    role: WorkspaceNeedToKnowRole,
    grant: WorkspaceNeedToKnowGrant | undefined,
    decision: "ALLOW" | "DENY",
    reason: string
  ): WorkspaceNeedToKnowAccessResult {
    const preview = this.buildNeedToKnowPreview(role, grant?.permittedTools ?? ROLE_TOOLS[role]);

    return {
      decision,
      reason,
      projectId: input.projectId,
      role,
      visiblePanels: decision === "ALLOW" ? preview.visiblePanels : [],
      hiddenPanels: preview.hiddenPanels,
      permittedActions: decision === "ALLOW" ? preview.permittedActions : [],
      permittedTools: decision === "ALLOW" ? (grant?.permittedTools ?? ROLE_TOOLS[role]) : [],
      accessibleScope: grant?.accessScope ?? this.normalizeAccessScope(input.projectId),
      restrictedMetadataReturned: false,
      mostRestrictiveRuleApplied: true,
      temporaryAccessExpiresAt: grant?.temporary ? grant.expiresAt : undefined
    };
  }

  private async audit(
    action: WorkspaceAuditAction,
    actor: WorkspaceActor,
    refs: {
      layoutId?: string;
      navigationItemId?: string;
      widgetId?: string;
      preferenceId?: string;
      accessGrantId?: string;
      invitationId?: string;
      projectId?: string;
      resourceType?: WorkspaceAccessResourceType;
      resourceId?: string;
      agent?: string;
    },
    afterState?: object,
    beforeState?: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      ...refs,
      beforeState,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }
}
