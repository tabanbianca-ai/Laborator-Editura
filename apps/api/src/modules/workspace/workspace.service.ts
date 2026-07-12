import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { normalizeLanguageLocale, validateIsoCompatibleLanguageTag } from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { DatabaseWorkspaceRepository } from "./workspace.repository";
import {
  type CreateWorkspaceWidgetInput,
  type AcceptWorkspaceInvitationInput,
  type WorkspaceAccessScope,
  type InviteWorkspaceCollaboratorInput,
  type RevokeWorkspaceAccessInput,
  type SaveWorkspacePreferencesInput,
  type WorkspaceActor,
  type WorkspaceAccessAuditInput,
  type WorkspaceAccessResourceType,
  type WorkspaceAuditAction,
  type WorkspaceAuditEvent,
  type WorkspaceDashboard,
  type WorkspaceLayout,
  type WorkspaceModule,
  type WorkspaceNavigationItem,
  type WorkspaceNeedToKnowAccessInput,
  type WorkspaceNeedToKnowAccessResult,
  type WorkspaceNeedToKnowGrant,
  type WorkspaceNeedToKnowPreview,
  type WorkspaceNeedToKnowRole,
  type WorkspaceAgentDataAccessInput,
  type WorkspacePreferences,
  type WorkspaceWidget
} from "./workspace.types";

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

    return {
      layout,
      navigation,
      widgets,
      preferences,
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
    return allowedRoles.length === 0 || actor.roles.some((role) => allowedRoles.includes(role));
  }

  private hasPermissions(actor: WorkspaceActor, requiredPermissions: string[]): boolean {
    return requiredPermissions.length === 0 ||
      requiredPermissions.every((permission) => actor.permissions.includes(permission as never));
  }

  private normalizePlatformLanguage(language: string): string {
    const validation = validateIsoCompatibleLanguageTag(language);

    if (!validation.valid) {
      return "ro";
    }

    return normalizeLanguageLocale(language).language;
  }

  private assertCanManageAccess(actor: WorkspaceActor): void {
    if (!actor.roles.includes("ADMIN") && !actor.roles.includes("REVIEWER")) {
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
    if (actor.roles.includes("ADMIN")) {
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
