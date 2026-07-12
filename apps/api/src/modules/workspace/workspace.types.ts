import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type WorkspaceActor = AuthenticatedRequestContext;

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

export type WorkspaceAuditAction =
  | "AI_AGENT_DATA_ACCESS"
  | "CONFIDENTIAL_RESOURCE_ACCESSED"
  | "DOCUMENT_OPENED"
  | "FEATURE_BLOCKED"
  | "INVITATION_ACCEPTED"
  | "INVITATION_SENT"
  | "NEED_TO_KNOW_ACCESS_CHANGED"
  | "NEED_TO_KNOW_ACCESS_GRANTED"
  | "NEED_TO_KNOW_ACCESS_REVOKED"
  | "QUOTA_EXCEEDED"
  | "ROLE_ASSIGNED"
  | "ROLE_CHANGED"
  | "ROLE_REVOKED"
  | "RESTRICTED_ACCESS_ATTEMPT"
  | "SUBSCRIPTION_ACTIVATED"
  | "SUBSCRIPTION_CHANGED"
  | "SUBSCRIPTION_DOWNGRADE"
  | "SUBSCRIPTION_UPGRADE"
  | "TEMPORARY_ACCESS_EXPIRED"
  | "WORKSPACE_LAYOUT_CREATED"
  | "WORKSPACE_NAVIGATION_GENERATED"
  | "WORKSPACE_WIDGET_CREATED"
  | "WORKSPACE_PREFERENCES_SAVED"
  | "WORKSPACE_HUMAN_OVERRIDE";

export type WorkspaceNeedToKnowRole =
  | "ADMINISTRATOR"
  | "AUDIO_VIDEO_COLLABORATOR"
  | "COLLABORATOR"
  | "ILLUSTRATOR"
  | "LAYOUT_SPECIALIST"
  | "REVIEWER"
  | "TRANSLATOR";

export type WorkspaceAccessResourceType =
  | "ADMINISTRATION"
  | "AGENT_EXECUTION"
  | "CHAPTER"
  | "COMMENT"
  | "DISTRIBUTION"
  | "DOCUMENT"
  | "EXPORT"
  | "LINGUISTIC_SOURCE"
  | "MANUSCRIPT"
  | "MEDIA_ASSET"
  | "PROJECT"
  | "PUBLISHING"
  | "RIGHTS_RECORD"
  | "SECTION"
  | "SEGMENT"
  | "VERSION";

export type WorkspaceConfidentialClassification =
  | "CONFIDENTIAL"
  | "INTERNAL"
  | "PUBLIC_METADATA"
  | "RESTRICTED";

export type WorkspaceAccessGrantStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

export type WorkspaceInvitationStatus = "ACCEPTED" | "EXPIRED" | "REVOKED" | "SENT";

export type WorkspaceNeedToKnowDecision = "ALLOW" | "DENY";

export type WorkspaceOperationalRole =
  | "ADMINISTRATOR"
  | "PROJECT_MANAGER"
  | "EDITOR"
  | "TRANSLATOR"
  | "REVIEWER"
  | "DESIGNER"
  | "AUDIO_NARRATOR"
  | "AUTHOR"
  | "COLLABORATOR"
  | "READER"
  | "GUEST";

export type WorkspaceRoleAssignmentScope =
  | "ORGANIZATION"
  | "PROJECT"
  | "DOCUMENT"
  | "CHAPTER"
  | "SEGMENT";

export type WorkspaceSubscriptionPlan =
  | "FREE"
  | "PREMIUM"
  | "BUSINESS"
  | "ENTERPRISE_RESERVED";

export type WorkspaceEntitlementFeature =
  | "ADVANCED_EDITORIAL_TOOLS"
  | "AI_AGENT"
  | "API_ACCESS"
  | "AUDIT_RETENTION"
  | "BACKUP_RETENTION"
  | "COLLABORATION"
  | "DISTRIBUTION_CHANNELS"
  | "EXPORT_DOCX"
  | "EXPORT_EPUB"
  | "EXPORT_JSON_MASTER"
  | "EXPORT_MOBI"
  | "EXPORT_PDF"
  | "EXPORT_PRINT"
  | "PRIORITY_PROCESSING"
  | "PUBLISHING_CHANNELS"
  | "TEAM_ADMINISTRATION"
  | "TRANSLATION_VOLUME";

export type WorkspacePlanQuotaKey =
  | "activeProjects"
  | "aiUsage"
  | "collaborators"
  | "storageMb"
  | "translationSegments";

export type WorkspaceEffectiveAccessAction =
  | "ADMINISTRATION_ACTION"
  | "AI_EXECUTION"
  | "API_USAGE"
  | "DISTRIBUTION"
  | "DOCUMENT_EDIT"
  | "EXPORT"
  | "PROJECT_CREATE"
  | "PUBLISHING"
  | "REVIEW"
  | "ROLE_ASSIGNMENT"
  | "STORAGE_UPLOAD"
  | "TRANSLATION"
  | "USER_INVITATION";

export interface WorkspaceAccessScope {
  projectId: string;
  documentIds?: string[];
  manuscriptIds?: string[];
  chapterIds?: string[];
  sectionIds?: string[];
  segmentIds?: string[];
  commentIds?: string[];
  versionIds?: string[];
  linguisticSourceIds?: string[];
  rightsRecordIds?: string[];
  mediaAssetIds?: string[];
  exportArtifactIds?: string[];
  publishingRecordIds?: string[];
  distributionRecordIds?: string[];
  agentExecutionIds?: string[];
}

export interface WorkspaceNeedToKnowGrant {
  id: string;
  organizationId: string;
  userId: string;
  collaboratorEmail?: string;
  collaboratorName?: string;
  projectId: string;
  role: WorkspaceNeedToKnowRole;
  permittedTools: WorkspaceModule[];
  accessScope: WorkspaceAccessScope;
  startsAt?: string;
  expiresAt?: string;
  reason?: string;
  grantedBy: string;
  grantedAt: string;
  revokedBy?: string;
  revokedAt?: string;
  status: WorkspaceAccessGrantStatus;
  temporary: boolean;
  confidentialClassification: WorkspaceConfidentialClassification;
  mostRestrictiveRuleApplied: true;
  metadata?: object;
}

export interface WorkspaceCollaboratorInvitation {
  id: string;
  organizationId: string;
  inviteeEmail: string;
  inviteeName?: string;
  projectId: string;
  role: WorkspaceNeedToKnowRole;
  permittedTools: WorkspaceModule[];
  accessScope: WorkspaceAccessScope;
  startsAt?: string;
  expiresAt?: string;
  reason?: string;
  status: WorkspaceInvitationStatus;
  sentBy: string;
  sentAt: string;
  acceptedBy?: string;
  acceptedAt?: string;
  accessGrantId?: string;
  preview: WorkspaceNeedToKnowPreview;
  metadata?: object;
}

export interface WorkspaceNeedToKnowPreview {
  visiblePanels: string[];
  hiddenPanels: string[];
  permittedActions: string[];
  restrictedResourceTypes: WorkspaceAccessResourceType[];
  restrictedMetadataReturned: false;
}

export interface WorkspaceNeedToKnowAccessInput {
  projectId: string;
  role?: WorkspaceNeedToKnowRole;
  assignedTask?: string;
  workflowStage?: string;
  resourceType: WorkspaceAccessResourceType;
  resourceId?: string;
  documentId?: string;
  manuscriptId?: string;
  chapterId?: string;
  sectionId?: string;
  segmentId?: string;
  confidentialClassification?: WorkspaceConfidentialClassification;
  requestedPanel?: string;
  requestedAction?: string;
}

export interface WorkspaceNeedToKnowAccessResult {
  decision: WorkspaceNeedToKnowDecision;
  reason: string;
  projectId: string;
  role: WorkspaceNeedToKnowRole;
  visiblePanels: string[];
  hiddenPanels: string[];
  permittedActions: string[];
  permittedTools: WorkspaceModule[];
  accessibleScope: WorkspaceAccessScope;
  restrictedMetadataReturned: false;
  mostRestrictiveRuleApplied: true;
  temporaryAccessExpiresAt?: string;
}

export interface WorkspaceSubscriptionPlanDefinition {
  plan: WorkspaceSubscriptionPlan;
  enabled: boolean;
  includedFeatures: WorkspaceEntitlementFeature[];
  quotas: Record<WorkspacePlanQuotaKey, number | null>;
  exportFormats: string[];
  publishingChannels: string[];
  distributionChannels: string[];
  auditRetentionDays: number;
  backupRetentionDays: number;
  priorityProcessing: boolean;
  downgradeBehavior: {
    preserveExistingContent: true;
    preserveAuditAndVersions: true;
    disableUnavailableFutureActionsOnly: true;
    markOverLimitResourcesReadOnly: true;
    automaticDeletion: false;
    remediationSummaryRequired: true;
  };
}

export interface WorkspaceSubscriptionUsage {
  activeProjects: number;
  collaborators: number;
  storageMb: number;
  aiUsage: number;
  translationSegments: number;
}

export interface WorkspaceSubscriptionSummary {
  currentPlan: WorkspaceSubscriptionPlan;
  plans: WorkspaceSubscriptionPlanDefinition[];
  currentEntitlements: WorkspaceSubscriptionPlanDefinition;
  usage: WorkspaceSubscriptionUsage;
  accountOwnerCanManageSubscription: boolean;
  roleNamesAreNotPlanNames: true;
  enterpriseReservedEnabled: false;
}

export interface WorkspaceEffectiveAccessInput extends WorkspaceNeedToKnowAccessInput {
  action: WorkspaceEffectiveAccessAction;
  requiredFeature?: WorkspaceEntitlementFeature;
  quotaKey?: WorkspacePlanQuotaKey;
  requestedAmount?: number;
}

export interface WorkspaceEffectiveAccessResult {
  decision: WorkspaceNeedToKnowDecision;
  reason: string;
  roleAllowed: boolean;
  subscriptionAllowed: boolean;
  needToKnowAllowed: boolean;
  explicitDenialApplied: boolean;
  mostRestrictiveRuleApplied: true;
  operationalRole: WorkspaceOperationalRole;
  roleAssignmentScopes: WorkspaceRoleAssignmentScope[];
  subscriptionPlan: WorkspaceSubscriptionPlan;
  requiredPlan?: WorkspaceSubscriptionPlan;
  requiredFeature?: WorkspaceEntitlementFeature;
  quotaKey?: WorkspacePlanQuotaKey;
  quotaLimit?: number | null;
  quotaUsage?: number;
  requestedAmount: number;
  dataDestroyed: false;
  existingWorkRemoved: false;
  restrictedNewActionOnly: true;
  readOnlyOverLimit: boolean;
  remediationSummary?: string[];
  needToKnow: WorkspaceNeedToKnowAccessResult;
}

export interface WorkspaceAgentDataAccessInput {
  agent: string;
  task: string;
  projectId: string;
  resourceType: WorkspaceAccessResourceType;
  resourceIds: string[];
  accessScope: WorkspaceAccessScope;
  decision: WorkspaceNeedToKnowDecision;
  result: string;
}

export interface WorkspaceAccessAuditInput {
  projectId: string;
  resourceType: WorkspaceAccessResourceType;
  resourceId?: string;
  reason?: string;
  confidentialClassification?: WorkspaceConfidentialClassification;
}

export interface WorkspaceLayout {
  id: string;
  organizationId: string;
  name: string;
  defaultForRoles: string[];
  dashboardRoute: "/workspace/dashboard";
  navigationRoute: "/workspace/navigation";
  visibleModules: WorkspaceModule[];
  humanFinalAuthorityRequired: true;
  aiMaySuggestDashboardLayouts: true;
  aiMaySuggestWidgets: true;
  aiMayRecommendShortcuts: true;
  aiMayAlterPermissions: false;
  aiMayExposeHiddenModules: false;
  aiMayChangePolicies: false;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspaceNavigationItem {
  id: string;
  organizationId: string;
  title: string;
  module: WorkspaceModule;
  icon: string;
  route: string;
  visible: boolean;
  order: number;
  permissionsRequired: string[];
  defaultForRoles: string[];
  organizationPolicyVisibility?: "VISIBLE" | "HIDDEN" | "RESTRICTED";
  moduleVisibility?: "VISIBLE" | "HIDDEN";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspaceWidget {
  id: string;
  organizationId: string;
  widgetType: WorkspaceWidgetType;
  title: string;
  visible: boolean;
  order: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  permissionsRequired: string[];
  defaultForRoles: string[];
  configuration: object;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspacePreferences {
  id: string;
  organizationId: string;
  userId: string;
  favoriteModules: WorkspaceModule[];
  dashboardLayout: object;
  collapsedMenus: string[];
  themeMetadata: object;
  language: string;
  platformLanguage: string;
  notificationPreferences: object;
  aiSuggestedLayout?: object;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspaceDashboard {
  layout: WorkspaceLayout;
  navigation: WorkspaceNavigationItem[];
  widgets: WorkspaceWidget[];
  preferences: WorkspacePreferences;
  needToKnow: {
    defaultAccess: "ASSIGNED_SCOPE_ONLY";
    hiddenDataLoadedThroughApi: false;
    visibleModules: WorkspaceModule[];
    panelsConfigurablePerUser: true;
    panelsRestoredBetweenSessions: true;
  };
  generatedFor: {
    userId: string;
    organizationId: string;
    roles: string[];
    permissions: string[];
  };
}

export interface WorkspaceAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: WorkspaceAuditAction;
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
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface SaveWorkspacePreferencesInput {
  favoriteModules?: WorkspaceModule[];
  dashboardLayout?: object;
  collapsedMenus?: string[];
  themeMetadata?: object;
  language?: string;
  platformLanguage?: string;
  notificationPreferences?: object;
  aiSuggestedLayout?: object;
  metadata?: object;
}

export interface CreateWorkspaceWidgetInput {
  widgetType: WorkspaceWidgetType;
  title?: string;
  visible?: boolean;
  order?: number;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  permissionsRequired?: string[];
  defaultForRoles?: string[];
  configuration?: object;
  aiSuggested?: boolean;
  metadata?: object;
}

export interface InviteWorkspaceCollaboratorInput {
  inviteeEmail: string;
  inviteeName?: string;
  projectId: string;
  role: WorkspaceNeedToKnowRole;
  permittedTools?: WorkspaceModule[];
  accessScope?: Partial<WorkspaceAccessScope>;
  startsAt?: string;
  expiresAt?: string;
  reason?: string;
  confidentialClassification?: WorkspaceConfidentialClassification;
  metadata?: object;
}

export interface AcceptWorkspaceInvitationInput {
  userId?: string;
}

export interface RevokeWorkspaceAccessInput {
  reason?: string;
}

export interface WorkspaceRepository {
  createLayout(layout: WorkspaceLayout): Promise<WorkspaceLayout>;
  listLayouts(organizationId: string): Promise<WorkspaceLayout[]>;
  createNavigationItem(item: WorkspaceNavigationItem): Promise<WorkspaceNavigationItem>;
  listNavigationItems(organizationId: string): Promise<WorkspaceNavigationItem[]>;
  createWidget(widget: WorkspaceWidget): Promise<WorkspaceWidget>;
  listWidgets(organizationId: string): Promise<WorkspaceWidget[]>;
  upsertPreferences(preferences: WorkspacePreferences): Promise<WorkspacePreferences>;
  findPreferencesByUser(userId: string, organizationId: string): Promise<WorkspacePreferences | null>;
  createInvitation(invitation: WorkspaceCollaboratorInvitation): Promise<WorkspaceCollaboratorInvitation>;
  updateInvitation(invitation: WorkspaceCollaboratorInvitation): Promise<WorkspaceCollaboratorInvitation>;
  findInvitationById(id: string, organizationId: string): Promise<WorkspaceCollaboratorInvitation | null>;
  createAccessGrant(grant: WorkspaceNeedToKnowGrant): Promise<WorkspaceNeedToKnowGrant>;
  updateAccessGrant(grant: WorkspaceNeedToKnowGrant): Promise<WorkspaceNeedToKnowGrant>;
  findAccessGrantById(id: string, organizationId: string): Promise<WorkspaceNeedToKnowGrant | null>;
  listAccessGrantsForUser(userId: string, organizationId: string): Promise<WorkspaceNeedToKnowGrant[]>;
  appendAuditEvent(event: WorkspaceAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<WorkspaceAuditEvent[]>;
}
